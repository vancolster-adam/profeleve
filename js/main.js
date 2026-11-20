document.addEventListener("DOMContentLoaded", () => {
    initialiserGrille();
    initialiserListeAttente();
    animerNoms();
    chargerAnalyse(); // <-- On lance l'analyse
});

console.log("main=version Analyse");
