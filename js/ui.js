// 1. Fonction pour séparer le statut et la date
function parseStatut(statutComplet) {
    const parts = statutComplet.split('_');
    return {
        base: parts[0], // ex: "evaluated"
        date: parts[1] || null // ex: "11/11/2026"
    };
}

// 2. Fonction pour formater la date (ex: "11/11/2026" -> "mercredi 11 nov.")
function formaterDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return dateStr;
    
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(date.getTime())) return dateStr;
    
    // Options pour retirer l'année et garder le jour/mois court
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    // On nettoie un peu le résultat (parfois il y a des points ou des majuscules bizarres)
    let resultat = date.toLocaleDateString('fr-FR', options);
    return resultat.replace(".", ""); // Enlève le point du "nov."
}

function creerElementClasse(nomClasse, data) {
    const div = document.createElement("div");
    div.className = "class-box";
    
    const statutInfo = parseStatut(data.statut);
    
    // On ajoute la classe CSS basée sur le statut de BASE (sans la date)
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
    
    // On garde la couleur de la barre de gauche basée sur le statut de base
    div.className = `waiting-item statut-${statutInfo.base}`; 
    
    let texteStatut = "";

    // Logique d'affichage des textes avec ou sans date
    if (statutInfo.base === "grading") {
        texteStatut = "En cours de correction";
    } else if (statutInfo.base === "evaluated") {
        texteStatut = statutInfo.date 
            ? `Correction estimée pour le ${formaterDate(statutInfo.date)}` 
            : "En attente de correction";
    } else if (statutInfo.base === "not-evaluated") {
        texteStatut = statutInfo.date 
            ? `Évaluation prévue le ${formaterDate(statutInfo.date)}` 
            : "Non évalué";
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

// Fonction pour lire et afficher le fichier analyses.txt
async function chargerAnalyse() {
    try {
        const response = await fetch('analyses.txt');
        if (!response.ok) throw new Error("Fichier introuvable");
        const texte = await response.text();
        
        const container = document.getElementById('analysis-container');
        container.innerHTML = ''; // On vide le "Chargement..."

        // 1. On sépare le texte en lignes
        const lignes = texte.split('\n');
        
        let currentDetails = null; // L'accordéon actuellement ouvert
        let currentContentDiv = null;

        // Variables pour la pochette
        let coverUrl = "https://via.placeholder.com/120?text=Pochette"; 
        let headerCreated = false;

        // On parcourt chaque ligne dans l'ordre exact du document
        lignes.forEach(ligne => {
            const ligneNettoyee = ligne.trim();
            if (!ligneNettoyee) return;

            // --- GESTION DE LA POCHETTE ---
            if (ligneNettoyee.startsWith('\\cover:')) {
                coverUrl = ligneNettoyee.replace('\\cover:', '').trim();
                return;
            }

            // --- GESTION DU TITRE D'ALBUM ---
            if (ligneNettoyee.startsWith('\\album:')) {
                const titreAlbum = ligneNettoyee.replace('\\album:', '').trim();
                
                // On crée l'en-tête avec la pochette
                const header = document.createElement('div');
                header.className = 'analysis-header';
                header.innerHTML = `
                    <div class="analysis-header-text">
                        <h2>${titreAlbum}</h2>
                    </div>
                    <img src="${coverUrl}" alt="Pochette" class="analysis-cover">
                `;
                container.appendChild(header);
                headerCreated = true;
                return;
            }

            // --- GESTION DES SINGLES (Texte simple) ---
            if (ligneNettoyee.startsWith('\\single:')) {
                const texteSingle = ligneNettoyee.replace('\\single:', '').trim();
                const div = document.createElement('div');
                div.className = 'analysis-block single-block';
                div.innerHTML = texteSingle;
                container.appendChild(div);
                return;
            }

            // --- GESTION DES PISTES (Accordéons) ---
            // Si la ligne commence par \1, \2, \3... (sans "single:")
            if (/^\\\d+/.test(ligneNettoyee)) {
                const titrePiste = ligneNettoyee.replace(/^\\\d+/, '').replace(':', '').trim();
                const numero = ligneNettoyee.match(/^\\\d+/)[0].replace('\\', '');
                
                const details = document.createElement('details');
                details.className = 'analysis-details';
                
                const summary = document.createElement('summary');
                // Si le titre est vide, on affiche juste "Piste X"
                summary.textContent = titrePiste ? `${numero} - ${titrePiste}` : `Piste ${numero}`;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'details-content';
                
                details.appendChild(summary);
                details.appendChild(contentDiv);
                container.appendChild(details);
                
                currentDetails = details;
                currentContentDiv = contentDiv;
                return;
            }

            // --- TEXTE NORMAL ---
            // Si ce n'est pas une balise, on l'ajoute au bloc en cours
            if (currentContentDiv) {
                // On ajoute le texte avec innerHTML pour que tes <br> fonctionnent
                currentContentDiv.innerHTML += ligneNettoyee + '<br>';
            } else {
                // Si on est avant toute balise, on le met dans un bloc par défaut
                const p = document.createElement('p');
                p.innerHTML = ligneNettoyee;
                container.appendChild(p);
            }
        });

        // Si aucune pochette n'a été trouvée, on met une image par défaut sur le premier header
        if (!headerCreated) {
            const header = document.createElement('div');
            header.className = 'analysis-header';
            header.innerHTML = `
                <div class="analysis-header-text"><h2>Analyse</h2></div>
                <img src="${coverUrl}" alt="Pochette" class="analysis-cover">
            `;
            container.prepend(header);
        }

    } catch (error) {
        console.error("Erreur de chargement de l'analyse :", error);
        document.getElementById('analysis-container').innerHTML = `<p class="placeholder-text">Impossible de charger l'analyse. Vérifie que le fichier analyses.txt est bien présent.</p>`;
    }
}

console.log("ui=version analyse 1");
