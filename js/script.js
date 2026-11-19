document.addEventListener("DOMContentLoaded", () => {
    
    // --- FONCTIONS POUR LA GRILLE DU HAUT ---
    
    function creerElementClasse(nomClasse, data) {
        const div = document.createElement("div");
        div.className = "class-box";
        
        if (data.statut === "corrigé") {
            div.classList.add("statut-corrige");
        } else if (data.statut === "en-cours") {
            div.classList.add("statut-en-cours");
        } else {
            div.classList.add("statut-attente");
        }

        div.innerHTML = `
            <span class="classe-titre">${nomClasse}</span>
            ${data.nom ? `<span class="classe-nom">${data.nom}</span>` : ''}
            ${data.absents > 0 || data.absents === "inconnu" ? `<span class="classe-alerte">${data.absents === "inconnu" ? "Abs: ?" : data.absents + " abs."}</span>` : ''}
        `;

        return div;
    }

    function initialiserGrille() {
        const niveaux = {
            "3e": ["3A", "3B", "3C", "3D"],
            "4e": ["4A", "4B", "4C", "4D", "4E"],
            "5e": ["5A", "5B", "5C", "5D", "5E"],
            "6e": ["6A", "6B", "6C", "6D", "6E"]
        };

        for (const [niveau, classes] of Object.entries(niveaux)) {
            const gridElement = document.getElementById(`grid-${niveau}`);
            classes.forEach(nomClasse => {
                const dataClasse = siteData[nomClasse];
                if (dataClasse) {
                    gridElement.appendChild(creerElementClasse(nomClasse, dataClasse));
                }
            });
        }
    }

    // --- FONCTIONS POUR LA LISTE D'ATTENTE (EN BAS) ---
    
    function initialiserListeAttente() {
        const container = document.getElementById("liste-attente");
        container.innerHTML = ""; // On vide le placeholder

        // 1. On récupère toutes les classes qui ne sont PAS "corrigé"
        const classesEnAttente = Object.entries(siteData)
            .filter(([nom, data]) => data.statut !== "corrigé" && data.nom !== "") // On ignore les vides et les corrigés
            .map(([nom, data]) => ({ nomClasse: nom, ...data }));

        if (classesEnAttente.length === 0) {
            container.innerHTML = `<p class="placeholder-text">Aucune correction en attente pour le moment.</p>`;
            return;
        }

        // 2. On trie : "en-cours" d'abord, puis les autres
        classesEnAttente.sort((a, b) => {
            if (a.statut === "en-cours" && b.statut !== "en-cours") return -1;
            if (a.statut !== "en-cours" && b.statut === "en-cours") return 1;
            return 0; // Si même statut, on garde l'ordre alphabétique (ou on pourrait trier par urgence)
        });

        // 3. On crée les éléments HTML pour chaque classe en attente
        classesEnAttente.forEach(classe => {
            const div = document.createElement("div");
            div.className = "waiting-item";
            
            // On ajoute la classe de couleur selon le statut
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
            container.appendChild(div);
        });
    }

    // --- LANCEMENT ---
    initialiserGrille();
    initialiserListeAttente();
});
