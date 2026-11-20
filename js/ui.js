function creerElementClasse(nomClasse, data) {
    const div = document.createElement("div");
    div.className = "class-box";
    div.classList.add(`statut-${data.statut}`); 

    let pastilleHTML = "";
    switch (data.statut) {
        case "returned":
            pastilleHTML = `<div class="status-dot returned" title="Rendu">✓</div>`; break;
        case "scored":
            pastilleHTML = `<div class="status-dot scored" title="Noté">💯</div>`; break; // U+1F4AF
        case "corrected":
            pastilleHTML = `<div class="status-dot corrected" title="Corrigé">✓</div>`; break;
        case "grading":
            pastilleHTML = `<div class="status-dot grading" title="En cours">🖉</div>`; break;
        case "evaluated":
            pastilleHTML = `<div class="status-dot evaluated" title="Attente de correction">⌛</div>`; break;
        case "not-evaluated":
        default:
            pastilleHTML = `<div class="status-dot not-evaluated" title="Non évalué">✕</div>`; break;
    }

    div.innerHTML = `
        <span class="classe-titre">${nomClasse}</span>
        ${data.nom ? `<span class="classe-nom">${data.nom}</span>` : ''}
        ${data.absents > 0 || data.absents === "inconnu" ? `<span class="classe-alerte">${data.absents === "inconnu" ? "Abs: ?" : data.absents + " abs."}</span>` : ''}
        ${pastilleHTML}
    `;

    return div;
}

function creerElementAttente(classe) {
    const div = document.createElement("div");
    div.className = `waiting-item statut-${classe.statut}`; 
    
    // On retire "corrected" de ce dictionnaire
    const libellesStatuts = {
        "evaluated": "En attente de correction",
        "grading": "En cours de correction",
        "scored": "Noté (à rendre)"
    };

    div.innerHTML = `
        <div class="waiting-info">
            <strong>${classe.nomClasse} - ${classe.nom || "Sans nom"}</strong>
            <span>${classe.eleves > 0 ? classe.eleves + " élèves" : "Données inconnues"}</span>
        </div>
        <div class="waiting-status">
            ${libellesStatuts[classe.statut] || classe.statut}
        </div>
    `;
    return div;
}
