document.addEventListener("DOMContentLoaded", () => {
    const resizer = document.getElementById("resizer");
    const leftPanel = document.getElementById("left-panel");
    const rightPanel = document.getElementById("right-panel");

    if (!resizer || !leftPanel || !rightPanel) return;

    let isResizing = false;

    // Quand on clique sur la poignée
    resizer.addEventListener("mousedown", (e) => {
        isResizing = true;
        resizer.classList.add("active");
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none"; // Empêche de sélectionner le texte pendant le drag
    });

    // Quand on bouge la souris
    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        // Calcul de la nouvelle largeur
        let newLeftWidth = e.clientX;
        
        // Application des limites (50% minimum, 75% maximum de l'écran)
        const minWidth = window.innerWidth * 0.5;
        const maxWidth = window.innerWidth * 0.75;

        if (newLeftWidth < minWidth) newLeftWidth = minWidth;
        if (newLeftWidth > maxWidth) newLeftWidth = maxWidth;

        // On applique la largeur à la partie gauche
        leftPanel.style.flex = `0 0 ${newLeftWidth}px`;
        
        // La partie droite garde sa largeur de 50vw, elle sera poussée hors de l'écran
    });

    // Quand on relâche la souris
    document.addEventListener("mouseup", () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove("active");
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    });
});
console.log("logic=version resizer 1");
