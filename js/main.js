document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialisation du dashboard
    initialiserGrille();
    initialiserListeAttente();
    animerNoms();
    chargerAnalyse();

    // 2. Initialisation de la barre de redimensionnement (Resizer)
    const resizer = document.getElementById("resizer");
    const leftPanel = document.getElementById("left-panel");

    if (resizer && leftPanel) {
        console.log("Resizer initialisé avec succès !");
        let isResizing = false;

        resizer.addEventListener("mousedown", (e) => {
            isResizing = true;
            resizer.classList.add("active");
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none"; 
        });

        document.addEventListener("mousemove", (e) => {
            if (!isResizing) return;

            // Calcul de la nouvelle largeur
            let newLeftWidth = e.clientX;
            
            // Limites : 50% minimum et 75% maximum
            const minWidth = window.innerWidth * 0.5;
            const maxWidth = window.innerWidth * 0.75;

            if (newLeftWidth < minWidth) newLeftWidth = minWidth;
            if (newLeftWidth > maxWidth) newLeftWidth = maxWidth;

            // On applique la largeur à la partie gauche
            leftPanel.style.flex = `0 0 ${newLeftWidth}px`;
        });

        document.addEventListener("mouseup", () => {
            if (isResizing) {
                isResizing = false;
                resizer.classList.remove("active");
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }
        });
    } else {
        console.error("Erreur : impossible de trouver le resizer ou le panneau gauche.");
    }
});
console.log("main=version resizer");
