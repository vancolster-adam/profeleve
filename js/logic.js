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

// Fonction qui attribue une priorité selon TES règles
function getPriorite(statutComplet) {
    if (statutComplet.startsWith("grading")) return 1; // En cours (priorité absolue)
    if (statutComplet.startsWith("evaluated")) {
        return statutComplet.includes("_") ? 2 : 3; // Évalué avec date (2) > Évalué sans date (3)
    }
    if (statutComplet.startsWith("not-evaluated")) {
        return statutComplet.includes("_") ? 4 : 5; // Non évalué avec date (4) > Non évalué sans date (5)
    }
    return 6; // Au cas où
}

function initialiserListeAttente() {
    const container = document.getElementById("liste-attente");
    container.innerHTML = ""; 

    const classesEnAttente = Object.entries(siteData)
        .filter(([nom, data]) => {
            // On garde uniquement les bases autorisées dans la liste
            const statutBase = data.statut.split('_')[0];
            const statutsAutorises = ["grading", "evaluated", "not-evaluated"];
            return statutsAutorises.includes(statutBase) && (data.nom !== "" || data.pp !== "");
        })
        .map(([nom, data]) => ({ nomClasse: nom, ...data }));

    if (classesEnAttente.length === 0) {
        container.innerHTML = `<p class="placeholder-text">Aucune correction en attente pour le moment.</p>`;
        return;
    }

    // Tri basé sur notre fonction getPriorite
    classesEnAttente.sort((a, b) => {
        return getPriorite(a.statut) - getPriorite(b.statut);
    });

    classesEnAttente.forEach(classe => {
        container.appendChild(creerElementAttente(classe));
    });
}

// On garde la fonction d'animation intacte
function animerNoms() {
    setInterval(() => {
        const nomTexts = document.querySelectorAll('.nom-text');
        nomTexts.forEach(el => {
            const parent = el.closest('.classe-nom');
            const nomPP = parent.getAttribute('data-pp');
            const nomClasse = parent.getAttribute('data-nom');
            if (!nomPP || !nomClasse) return;

            el.classList.add('fade-out');
            setTimeout(() => {
                if (el.textContent.trim() === nomPP) el.textContent = nomClasse;
                else el.textContent = nomPP;
                
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
                void el.offsetWidth; 
                el.classList.remove('fade-in');
            }, 400);
        });
    }, 3000);
}

console.log("logic=version nextstp");
