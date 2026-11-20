// =========================================
// FONCTIONS UTILITAIRES
// =========================================
function parseStatut(statutComplet) {
    if (!statutComplet) return { base: "", date: null };
    const parts = statutComplet.split('_');
    return { base: parts[0], date: parts[1] || null };
}

function formaterDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return dateStr;
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(date.getTime())) return dateStr;
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('fr-FR', options).replace(".", "");
}

function extraireImage(texte) {
    const regex = /\[(.*?)\]/;
    const match = texte.match(regex);
    if (match) {
        return { url: match[1], texteSansUrl: texte.replace(regex, '').trim() };
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
    if (statutInfo.base === "grading") texteStatut = "En cours de correction";
    else if (statutInfo.base === "evaluated") texteStatut = statutInfo.date ? `Correction estimée pour le ${formaterDate(statutInfo.date)}` : "En attente de correction";
    else if (statutInfo.base === "not-evaluated") texteStatut = statutInfo.date ? `Évaluation prévue le ${formaterDate(statutInfo.date)}` : "Non évalué";

    const nomAffichage = classe.nom || classe.pp || "Sans nom";

    div.innerHTML = `
        <div class="waiting-info">
            <strong>${classe.nomClasse} - ${nomAffichage}</strong>
            <span>${classe.eleves > 0 ? classe.eleves + " élèves" : "Données inconnues"}</span>
        </div>
        <div class="waiting-status">${texteStatut}</div>
    `;
    return div;
}

// =========================================
// ANALYSE (Partie Gauche - Unifiée)
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
        let currentContentDiv = null; 

        lignes.forEach(ligne => {
            const ligneNettoyee = ligne.trim();
            if (!ligneNettoyee) return;

            // Si la ligne commence par une barre oblique inversée (ex: \album:, \single:, \1:)
            if (ligneNettoyee.startsWith('\\')) {
                // On sépare le "type" (album, single, ou numéro) du reste du texte
                const match = ligneNettoyee.match(/^\\(\w+|[0-9]+):?\s*(.*)/);
                let titreBrut = ligneNettoyee;
                
                if (match) {
                    // On garde ce qu'il y a après les deux points (ou juste l'espace si pas de deux points)
                    titreBrut = match[2] || ""; 
                }

                const { url, texteSansUrl } = extraireImage(titreBrut);
                
                // Création de l'accordéon unifié
                const details = document.createElement('details');
                details.className = 'analysis-details';
                
                const summary = document.createElement('summary');
                
                // S'il y a une image, on l'affiche dans le résumé
                let imgHTML = url ? `<img src="${url}" alt="Cover" class="summary-cover">` : '';
                
                // On nettoie le titre pour enlever les numéros ou les mots-clés (ex: "1: ")
                let titrePropre = ligneNettoyee.replace(/^\\\w+:?/, '').trim(); 
                if (!titrePropre && !url) titrePropre = "Sans titre";

                summary.innerHTML = `
                    ${imgHTML}
                    <span class="summary-title">${titrePropre}</span>
                `;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'details-content';
                
                details.appendChild(summary);
                details.appendChild(contentDiv);
                container.appendChild(details);
                
                currentContentDiv = contentDiv;
                return;
            }

            // --- TEXTE NORMAL ---
            // Si ce n'est pas une balise, on l'ajoute au bloc déplié en cours
            if (currentContentDiv) {
                currentContentDiv.innerHTML += ligneNettoyee + '<br>';
            } else {
                const p = document.createElement('p');
                p.innerHTML = ligneNettoyee;
                container.appendChild(p);
            }
        });

    } catch (error) {
        console.error("Erreur d'analyse :", error);
        container.innerHTML = `<p class="placeholder-text">Erreur : Impossible de charger l'analyse.</p>`;
    }
}

console.log("ui=version analyse test 3");
