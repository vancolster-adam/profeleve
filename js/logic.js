function initialiserGrille() {
    const niveaux = { "3e": ["3A", "3B", "3C", "3D"], "4e": ["4A", "4B", "4C", "4D", "4E"], "5e": ["5A", "5B", "5C", "5D", "5E"], "6e": ["6A", "6B", "6C", "6D", "6E"] };
    for (const [niveau, classes] of Object.entries(niveaux)) {
        const gridElement = document.getElementById(`grid-${niveau}`);
        classes.forEach(nomClasse => {
            if (siteData[nomClasse]) {
                gridElement.appendChild(creerElementClasse(nomClasse, siteData[nomClasse]));
            }
        });
    }
}

function initialiserListeAttente() {
    const container = document.getElementById("liste-attente");
    container.innerHTML = ""; 

    // On exclut "returned" ET "corrected"
    const classesEnAttente = Object.entries(siteData)
        .filter(([nom, data]) => data.statut !== "returned" && data.statut !== "corrected" && data.nom !== "")
        .map(([nom, data]) => ({ nomClasse: nom, ...data }));

    if (classesEnAttente.length === 0) {
        container.innerHTML = `<p class="placeholder-text">Aucune correction en attente pour le moment.</p>`;
        return;
    }

    // On retire "corrected" du dictionnaire de priorité puisqu'il n'apparaîtra plus
    const priorite = {
        "grading": 1,
        "scored": 2,
        "evaluated": 3,
        "not-evaluated": 4
    };

    classesEnAttente.sort((a, b) => priorite[a.statut] - priorite[b.statut]);

    classesEnAttente.forEach(classe => {
        container.appendChild(creerElementAttente(classe));
    });
}
