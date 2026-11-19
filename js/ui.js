function creerElementClasse(nomClasse, data) {
    const div = document.createElement("div");
    div.className = "class-box";
    
    if (data.statut === "corrigé") div.classList.add("statut-corrige");
    else if (data.statut === "en-cours") div.classList.add("statut-en-cours");
    else div.classList.add("statut-attente");

    const estFini = data.statut === "corrigé";
    const pastilleHTML = estFini ? `<div class="status-dot done" title="Terminé">✓</div>` : `<div class="status-dot"></div>`;

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
    
    div.innerHTML = `
        <div class="waiting-info">
            <strong>${classe.nomClasse} - ${classe.nom}</strong>
            <span>${classe.eleves} élèves</span>
        </div>
        <div class="waiting-status">
            ${classe.statut === "en-cours" ? "En cours de correction" : "En attente"}
        </div>
    `;
    return div;
}
