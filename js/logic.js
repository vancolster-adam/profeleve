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

    // 1. On garde tout sauf les classes "rendu" et celles qui n'ont pas de nom
    const classesEnAttente = Object.entries(siteData)
        .filter(([nom, data]) => data.statut !== "rendu" && data.nom !== "")
        .map(([nom, data]) => ({ nomClasse: nom, ...data }));

    if (classesEnAttente.length === 0) {
        container.innerHTML = `<p class="placeholder-text">Aucune correction en attente pour le moment.</p>`;
        return;
    }

    // 2. Système de priorité pour le tri
    const priorite = {
        "correction": 1, // En cours
        "corrigé": 2,    // Prêt à noter
        "noté": 3,       // Prêt à rendre
        "évalué": 4,     // En attente de correction
        "non-evalué": 5  // Pas encore évalué
    };

    // 3. On trie selon ce système de priorité
    classesEnAttente.sort((a, b) => priorite[a.statut] - priorite[b.statut]);

    // 4. On affiche
    classesEnAttente.forEach(classe => {
        container.appendChild(creerElementAttente(classe));
    });
}
