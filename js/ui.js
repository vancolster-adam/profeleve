function creerElementClasse(nomClasse, data) {
    const div = document.createElement("div");
    div.className = "class-box";
    div.classList.add(`statut-${data.statut}`); // Ajoute la classe de bordure (ex: statut-rendu)

    // Attribution de la pastille selon le statut
    let pastilleHTML = "";
    switch (data.statut) {
        case "rendu":
            pastilleHTML = `<div class="status-dot rendu" title="Rendu">✓</div>`; break;
        case "noté":
            pastilleHTML = `<div class="status-dot note" title="Noté">✓</div>`; break;
        case "corrigé":
            pastilleHTML = `<div class="status-dot corrige" title="Corrigé">✓</div>`; break;
        case "correction":
            pastilleHTML = `<div class="status-dot correction" title="En cours">🖉</div>`; break;
        case "évalué":
            pastilleHTML = `<div class="status-dot evalue" title="Attente de correction">⌛</div>`; break;
        case "non-evalué":
        default:
            pastilleHTML = `<div class="status-dot non-evalue" title="Non évalué">✕</div>`; break;
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
    // Ajoute une classe spécifique au statut pour la couleur de la barre de gauche
    div.className = `waiting-item statut-${classe.statut}`; 
    
    // Traduction des statuts pour l'affichage
    const libellesStatuts = {
        "évalué": "En attente de correction",
        "correction": "En cours de correction",
        "corrigé": "Corrigé (notes à saisir)",
        "noté": "Noté (à rendre)"
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
