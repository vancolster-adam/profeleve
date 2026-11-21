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
// GESTION DES VERSIONS PUB/PRIV
// =========================================
function parserDoubleVersion(texte, pwdString) {
    // 1. Gérer les cas avec Pub ET Priv : {\pub: ... ;; \priv: ...}
    texte = texte.replace(/\{\s*\\pub:\s*(.*?)\s*;;\s*\\priv:\s*(.*?)\s*\}/g, (match, textePub, textePriv) => {
        return `<span class="version-pub">${textePub}</span><span class="version-priv" data-unlock-pwd="${pwdString}">${textePriv}</span>`;
    });

    // 2. Gérer les cas avec seulement Priv : {\priv: ...}
    texte = texte.replace(/\{\s*\\priv:\s*(.*?)\s*\}/g, (match, textePriv) => {
        return `<span class="version-priv" data-unlock-pwd="${pwdString}">${textePriv}</span>`;
    });

    // 3. Gérer les cas avec seulement Pub : {\pub: ...}
    texte = texte.replace(/\{\s*\\pub:\s*(.*?)\s*\}/g, (match, textePub) => {
        return `<span class="version-pub">${textePub}</span>`;
    });

    return texte;
}

// Fonction globale accessible depuis la console
window.unlock = function(...passwords) {
    let found = false;
    passwords.forEach(pwd => {
        // On cherche tous les éléments qui ont ce mot de passe
        const elements = document.querySelectorAll(`.version-priv[data-unlock-pwd*="${pwd}"]`);
        elements.forEach(el => {
            el.classList.add('unlocked');
            found = true;
        });
    });
    
    if (found) {
        console.log("✅ Analyse(s) déverrouillée(s) avec succès !");
    } else {
        console.log("❌ Mot de passe incorrect ou aucune analyse correspondante.");
    }
};

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
        
        let currentContentDiv = null; 
        let currentAlbumContentDiv = null; 
        let currentPwd = ""; // Stocke les mots de passe de la section en cours

        lignes.forEach(ligne => {
            const ligneNettoyee = ligne.trim();
            if (!ligneNettoyee) return;

            // Détection de la balise de mot de passe
            if (ligneNettoyee.startsWith('\\unlock:')) {
                currentPwd = ligneNettoyee.replace('\\unlock:', '').trim();
                return;
            }

            if (ligneNettoyee.startsWith('\\')) {
                const match = ligneNettoyee.match(/^\\(\w+|[0-9]+):?\s*(.*)/);
                const commande = match ? match[1] : "";
                const texteBrut = match ? match[2] : ligneNettoyee;
                
                const { url, texteSansUrl } = extraireImage(texteBrut);
                
                const details = document.createElement('details');
                details.className = 'analysis-details';
                if (commande.match(/^[0-9]+$/)) details.classList.add('child-track'); 
                
                const summary = document.createElement('summary');
                let imgHTML = url ? `<img src="${url}" alt="Cover" class="summary-cover">` : '';
                
                summary.innerHTML = `
                    ${imgHTML}
                    <span class="summary-title">${texteSansUrl || "Sans titre"}</span>
                `;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'details-content';
                details.appendChild(summary);
                details.appendChild(contentDiv);

                if (commande === "album") {
                    container.appendChild(details);
                    currentAlbumContentDiv = contentDiv;
                } else if (commande === "single") {
                    container.appendChild(details);
                    currentAlbumContentDiv = null;
                } else if (commande.match(/^[0-9]+$/)) {
                    if (currentAlbumContentDiv) {
                        currentAlbumContentDiv.appendChild(details);
                    } else {
                        container.appendChild(details);
                    }
                } else {
                    container.appendChild(details);
                    currentAlbumContentDiv = null;
                }
                
                currentContentDiv = contentDiv;
                return;
            }

            // Texte normal avec gestion Pub/Priv
            if (currentContentDiv) {
                // On traite le texte pour remplacer les balises { } par du HTML
                const texteFormate = parserDoubleVersion(ligneNettoyee, currentPwd);
                currentContentDiv.innerHTML += texteFormate + '<br>';
            } else {
                const p = document.createElement('p');
                p.innerHTML = parserDoubleVersion(ligneNettoyee, currentPwd);
                container.appendChild(p);
            }
        });

    } catch (error) {
        console.error("Erreur d'analyse :", error);
        container.innerHTML = `<p class="placeholder-text">Erreur : Impossible de charger l'analyse.</p>`;
    }
}
console.log("ui=version pub/priv");
