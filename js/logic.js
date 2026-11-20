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

    const classesEnAttente = Object.entries(siteData)
        .filter(([nom, data]) => data.statut !== "returned" && data.statut !== "corrected" && (data.nom !== "" || data.pp !== ""))
        .map(([nom, data]) => ({ nomClasse: nom, ...data }));

    if (classesEnAttente.length === 0) {
        container.innerHTML = `<p class="placeholder-text">Aucune correction en attente pour le moment.</p>`;
        return;
    }

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

// Animation de bascule entre le PP et le Nom de la classe
function animerNoms() {
    setInterval(() => {
        const nomTexts = document.querySelectorAll('.nom-text');
        
        nomTexts.forEach(el => {
            const parent = el.closest('.classe-nom');
            const nomPP = parent.getAttribute('data-pp');
            const nomClasse = parent.getAttribute('data-nom');
            
            // Si l'un des deux est vide, on n'anime pas (on laisse l'autre affiché)
            if (!nomPP || !nomClasse) return;

            // 1. On lance l'animation de sortie (glisse vers le haut)
            el.classList.add('fade-out');
            
            // 2. Après 400ms, on change le texte et on le fait entrer par le bas
            setTimeout(() => {
                // Si on affiche actuellement le PP, on passe au Nom, et inversement
                if (el.textContent.trim() === nomPP) {
                    el.textContent = nomClasse;
                } else {
                    el.textContent = nomPP;
                }
                
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
                void el.offsetWidth; // Force le navigateur à appliquer le style
                el.classList.remove('fade-in');
            }, 400); // Doit correspondre à la durée de transition CSS
        });
    }, 3000); // Toutes les 3 secondes
}

console.log("logic=version pp");
