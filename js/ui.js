function creerElementClasse(nomClasse, data) {
    const div = document.createElement("div");
    div.className = "class-box";
    
    // Ajout de la classe de bordure selon le statut
    if (data.statut === "corrigé") div.classList.add("statut-corrige");
    else if (data.statut === "en-cours") div.classList.add("statut-en-cours");
    else if (data.statut === "corrige-non-rendu") div.classList.add("statut-corrige-non-rendu");
    else div.classList.add("statut-attente");

    // Génération de la pastille selon le statut
    let pastilleHTML = "";
    if (data.statut === "corrigé") {
        pastilleHTML = `<div class="status-dot done" title="Terminé">✓</div>`;
    } else if (data.statut === "en-cours") {
        pastilleHTML = `<div class="status-dot en-cours" title="En cours">🖉</div>`;
    } else if (data.statut === "corrige-non-rendu") {
        pastilleHTML = `<div class="status-dot corrige-non-rendu" title="Corrigé, non rendu">✓</div>`;
    } else {
        pastilleHTML = `<div class="status-dot attente" title="En attente">✕</div>`;
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
    div.className = "waiting-item";
    if (classe.statut === "en-cours") div.classList.add("waiting-en-cours");
    
    // On gère l'affichage du texte dans la liste d'attente
    let texteStatut = "En attente";
    if (classe.statut === "en-cours") texteStatut = "En cours de correction";
    if (classe.statut === "corrige-non-rendu") texteStatut = "Corrigé (à rendre)";

    div.innerHTML = `
        <div class="waiting-info">
            <strong>${classe.nomClasse} - ${classe.nom || "Sans nom"}</strong>
            <span>${classe.eleves > 0 ? classe.eleves + " élèves" : "Données inconnues"}</span>
        </div>
        <div class="waiting-status">
            ${texteStatut}
        </div>
    `;
    return div;
}
