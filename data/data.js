const siteData = {
    "3A": { pp: "Fabrice LAFFARGUE", nom: "Hannah Arendt", eleves: 31, statut: "returned", absents: 2 },
    "3B": { pp: "Danièle ARTUR", nom: "Gisèle Halimi", eleves: 30, statut: "returned", absents: 2 },
    "3C": { nom: "Romain Gary", eleves: 29, statut: "scored", absents: 2 },
    "3D": { nom: "Srinivasa Ramanujan", eleves: 30, statut: "returned", absents: 2 },
    "4A": { nom: "Angela Davis", eleves: 26, statut: "returned", absents: 3 },
    "4B": { nom: "", eleves: 0, statut: "evaluated", absents: 0 },
    "4C": { nom: "", eleves: 0, statut: "evaluated", absents: 0 },
    "4D": { nom: "", eleves: 0, statut: "evaluated", absents: 0 },    
    "4E": { nom: "George Eliot", eleves: 25, statut: "grading", absents: "inconnu" },
    "5A": { nom: "", eleves: 0, statut: "evaluated", absents: 0 },
    "5B": { pp : "François-Xavier LEDOUX", nom: "Blaise Pascal", eleves: 25, statut: "returned", absents: 0 },
    "5C": { nom: "", eleves: 0, statut: "evaluated", absents: 0 },
    "5D": { nom: "", eleves: 0, statut: "evaluated", absents: 0 },
    "5E": { nom: "Marie Perrin", eleves: 29, statut: "returned", absents: 3 },
    "6A": { nom: "Arvernes", eleves: 0, statut: "returned", absents: 2 },
    "6B": { nom: "Senons", eleves: 28, statut: "returned", absents: 1 },
    "6C": { nom: "Carnutes", eleves: 24, statut: "evaluated", absents: 0 },
    "6D": { pp: "Arnaud COLLINET", nom: "Bituriges", eleves: 29, statut: "evaluated", absents: 0 },
    "6E": { pp: "Joël CLERGIOT", nom: "Parisii", eleves: 29, statut: "returned", absents: 0 }
};

/* =========================================
   RAPPEL DES STATUTS POSSIBLES :
   =========================================
   
   1. "not-evaluated" : Devoir non évalué (rien n'est fait).
   2. "evaluated"     : Devoir récupéré, en attente de correction.
   3. "grading"       : En cours de correction (Priorité 1 dans la liste d'attente).
   4. "corrected"     : Corrigé, notes non saisies (Disparaît de la liste d'attente).
   5. "scored"        : Notes saisies, prêt à rendre (Disparaît de la liste d'attente).
   6. "returned"      : Devoir rendu aux élèves, terminé (Disparaît de la liste).
