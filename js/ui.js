// =========================================
// FONCTIONS UTILITAIRES
// =========================================

// Sépare le statut de la date (ex: "evaluated_11/11/2026")
function parseStatut(statutComplet) {
    if (!statutComplet) return { base: "", date: null };
    const parts = statutComplet.split('_');
    return {
        base: parts[0],
        date: parts[1] || null
    };
}

// Formate la date (ex: "11/11/2026" -> "mercredi 11 nov.")
function formaterDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return dateStr;
    
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(date.getTime())) return dateStr;
    
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    let resultat = date.toLocaleDateString('fr-FR', options);
    return resultat.replace(".", ""); // Enlève le point du "nov."
}

// Extrait l'image entre crochets [url] et renvoie le texte nettoyé
function extraireImage(texte) {
    const regex = /\[(.*?)\]/;
    const match = texte.match(regex);
    if (match) {
        return {
            url: match[1],
            texteSansUrl: texte.replace(regex, '').trim()
        };
    }
    return { url: null, texteSansUrl: texte };
}

// =========================================
// DASHBOARD (Partie Droite)
// =========================================

function creerElementClasse(nomClasse, data) {
    const div = document.createElement("div");
    div.className = "class-box";
    
    const statutInfo = parseStatut(data.statut);
    div.classList.add(`statut-${statutInfo.base}`); 

    let pastilleHTML = "";
    switch (statutInfo.base) {
        case "returned": pastilleHTML = `<div class="status-dot returned" title="Rendu">✓</div>`; break;
        case "scored": pastilleHTML = `<div class="status-dot scored" title="Noté">💯</div>`; break;
        case "corrected": pastilleHTML = `<div class="status-dot corrected" title="Corrigé">✓</div>`; break;
        case "grading": pastilleHTML = `<div class="status-dot grading" title="En cours">🖉</div>`; break;
        case "evaluated": pastilleHTML = `<div class="status-dot evaluated" title="Attente de correction">⌛</div>`; break;
        case "not-evaluated": default: pastilleHTML = `<div class="status-dot not-evaluated" title="Non évalué">✕</div>`; break;
    }

    let sousTitreHTML = "";
    if (data.pp || data.nom) {
        const texteInitial = data.pp || data.nom;
        sousTitreHTML = `
            <span class="classe-nom" data-pp="${data.pp || ''}" data-nom="${data.nom || ''}">
                <span class="nom-text">${texteInitial}</span>
            </span>
        `;
    }

    div.innerHTML = `
        <span class="classe-titre">${nomClasse}</span>
        ${sousTitreHTML}
        ${data.absents === 0 ? `<span class="classe-complet">Complet</span>` : ''}
        ${data.absents > 0 ? `<span class="classe-alerte">${data.absents} abs.</span>` : ''}
        ${data.absents === "inconnu" ? `<span class="classe-alerte">Abs: ?</span>` : ''}
        ${pastilleHTML}
    `;

    return div;
}

function creerElementAttente(classe) {
    const div = document.createElement("div");
    const statutInfo = parseStatut(classe.statut);
    
    div.className = `waiting-item statut-${statutInfo.base}`; 
    
    let texteStatut = "";
    if (statutInfo.base === "grading") {
        texteStatut = "En cours de correction";
    } else if (statutInfo.base === "evaluated") {
        texteStatut = statutInfo.date ? `Correction estimée pour le ${formaterDate(statutInfo.date)}` : "En attente de correction";
    } else if (statutInfo.base === "not-evaluated") {
        texteStatut = statutInfo.date ? `Évaluation prévue le ${formaterDate(statutInfo.date)}` : "Non évalué";
    }

    const nomAffichage = classe.nom || classe.pp || "Sans nom";

    div.innerHTML = `
        <div class="waiting-info">
            <strong>${classe.nomClasse} - ${nomAffichage}</strong>
            <span>${classe.eleves > 0 ? classe.eleves + " élèves" : "Données inconnues"}</span>
        </div>
        <div class="waiting-status">
            ${texteStatut}
        </div>
    `;
    return div;
}

// =========================================
// ANALYSE (Partie Gauche)
// =========================================

async function chargerAnalyse() {
    const container = document.getElementById('analysis-container');
    if (!container) return;

    try {
        const response = await fetch('data/analyses.txt');
        if (!response.ok) throw new Error("Fichier introuvable");
        const texte = await response.text();
        
        container.innerHTML = ''; 
        const lignes = texte.split('\n');
        let currentContentDiv = null; // Stocke la div où écrire le texte actuel

        lignes.forEach(ligne => {
            const ligneNettoyee = ligne.trim();
            if (!ligneNettoyee) return;

            // --- ALBUM ---
            if (ligneNettoyee.startsWith('\\album:')) {
                const contenu = ligneNettoyee.replace('\\album:', '').trim();
                const { url, texteSansUrl } = extraireImage(contenu);
                
                const header = document.createElement('div');
                header.className = 'analysis-header';
                let imgHTML = url ? `<img src="${url}" alt="Pochette" class="analysis-cover">` : '';
                
                header.innerHTML = `
                    <div class="analysis-header-text">
                        <h2>${texteSansUrl}</h2>
                    </div>
                    ${imgHTML}
                `;
                container.appendChild(header);
                currentContentDiv = null; // On reset pour le texte qui suit
                return;
            }

            // --- SINGLES ---
            if (ligneNettoyee.startsWith('\\single:')) {
                const contenu = ligneNettoyee.replace('\\single:', '').trim();
                const { url, texteSansUrl } = extraireImage(contenu);
                
                const div = document.createElement('div');
                div.className = 'analysis-block single-block';
                let imgHTML = url ? `<img src="${url}" alt="Cover" class="single-cover">` : '';
                
                div.innerHTML = `
                    ${imgHTML}
                    <span>${texteSansUrl}</span>
                `;
                container.appendChild(div);
                currentContentDiv = null; // On reset
                return;
            }

            // --- PISTES (Accordéons) ---
            if (/^\\\d+/.test(ligneNettoyee)) {
                const titrePiste = ligneNettoyee.replace(/^\\\d+/, '').replace(':', '').trim();
                const numero = ligneNettoyee.match(/^\\\d+/)[0].replace('\\', '');
                
                const details = document.createElement('details');
                details.className = 'analysis-details';
                
                const summary = document.createElement('summary');
                summary.textContent = titrePiste ? `${numero} - ${titrePiste}` : `Piste ${numero}`;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'details-content';
                
                details.appendChild(summary);
                details.appendChild(contentDiv);
                container.appendChild(details);
                
                currentContentDiv = contentDiv;
                return;
            }

            // --- TEXTE NORMAL ---
            if (currentContentDiv) {
                currentContentDiv.innerHTML += ligneNettoyee + '<br>';
            } else {
                // Texte libre (ex: sous l'album)
                const p = document.createElement('p');
                p.innerHTML = ligneNettoyee;
                container.appendChild(p);
            }
        });

    } catch (error) {
        console.error("Erreur d'analyse :", error);
        container.innerHTML = `<p class="placeholder-text">Erreur : Impossible de charger l'analyse (data/analyses.txt introuvable).</p>`;
    }
}

console.log("ui=version analyse test 2");
