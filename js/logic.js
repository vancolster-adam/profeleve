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

    // 1. On filtre STRICTEMENT pour ne garder que ces 3 statuts
    const classesEnAttente = Object.entries(siteData)
        .filter(([nom, data]) => {
            const statutsAutorises = ["grading", "evaluated", "not-evaluated"];
            return statutsAutorises.includes(data.statut) && (data.nom !== "" || data.pp !== "");
        })
        .map(([nom, data]) => ({ nomClasse: nom, ...data }));

    if (classesEnAttente.length === 0) {
        container.innerHTML = `<p class="placeholder-text">Aucune correction en attente pour le moment.</p>`;
        return;
    }

    // 2. On définit l'ordre : 1 en haut (grading), 3 en bas (not-evaluated)
    const priorite = {
        "grading": 1,
        "evaluated": 2,
        "not-evaluated": 3
    };

    // 3. On trie
    classesEnAttente.sort((a, b) => priorite[a.statut] - priorite[b.statut]);

    // 4. On affiche
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
            
            if (!nomPP || !nomClasse) return;

            el.classList.add('fade-out');
            
            setTimeout(() => {
                if (el.textContent.trim() === nomPP) {
                    el.textContent = nomClasse;
                } else {
                    el.textContent = nomPP;
                }
                
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
                void el.offsetWidth; 
                el.classList.remove('fade-in');
            }, 400);
        });
    }, 3000);
}

console.log("logic=version waitinglist");
