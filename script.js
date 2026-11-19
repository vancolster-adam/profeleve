// On attend que le HTML soit chargé
document.addEventListener("DOMContentLoaded", () => {
    
    // Fonction pour afficher les données (on l'étoffera plus tard)
    function initialiserDashboard() {
        console.log("Dashboard initialisé.");
        console.log("Données actuelles :", siteData);

        // Ici, tu ajouteras la logique pour injecter les données de `siteData` 
        // dans les différentes div (classes-corrigees, liste-attente, etc.)
        
        // Exemple de ce qu'on fera plus tard :
        // document.getElementById('classes-corrigees').innerHTML = siteData.classesCorrigees;
    }

    // Lancement de l'initialisation
    initialiserDashboard();
});
