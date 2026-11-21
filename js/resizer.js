document.addEventListener("DOMContentLoaded", () => {
    const resizer = document.getElementById("resizer");
    const leftPanel = document.getElementById("left-panel");

    if (!resizer || !leftPanel) {
        console.error("Erreur : resizer ou left-panel introuvable dans le HTML.");
        return;
    }

    let isResizing = false;

    resizer.addEventListener("mousedown", (e) => {
        isResizing = true;
        resizer.classList.add("active");
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none"; // Empêche de sélectionner le texte pendant le glissement
    });

    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        // Calcul de la nouvelle largeur en temps réel
        let newLeftWidth = e.clientX;
        
        // Limites : 50% minimum (pour ne pas écraser la gauche) et 75% maximum
        const minWidth = window.innerWidth * 0.5;
        const maxWidth = window.innerWidth * 0.75;

        if (newLeftWidth < minWidth) newLeftWidth = minWidth;
        if (newLeftWidth > maxWidth) newLeftWidth = maxWidth;

        // On applique la largeur (le texte va se redessiner instantanément grâce au CSS)
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
});

console.log("resizer=version 2 (temps réel)");
