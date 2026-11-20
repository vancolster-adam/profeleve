const siteData = {
    "3A": { pp: "Fabrice LAFFARGUE", nom: "Hannah Arendt", eleves: 31, statut: "returned", absents: 2 },
    "3B": { pp: "Danièle ARTUR", nom: "Gisèle Halimi", eleves: 30, statut: "returned", absents: 2 },
    "3C": { pp: "Janick LOGET", nom: "Romain Gary", eleves: 29, statut: "returned", absents: 1 },
    "3D": { pp: "Christophe BIOULAC", nom: "Srinivasa Ramanujan", eleves: 30, statut: "returned", absents: 2 },
    "4A": { pp: "Amandine ESSAFRI", nom: "Angela Davis", eleves: 26, statut: "returned", absents: 3 },
    "4B": { pp: "Florian GORGUES", nom: "Simone de Beauvoir", eleves: 25, statut: "returned", absents: 2 },
    "4C": { pp: "Véronique GOUDALLE", nom: "Andrée Chedid", eleves: 25, statut: "grading", absents: "inconnu" },
    "4D": { pp: "Yann HENRY", nom: "Olympe de Gouges", eleves: 26, statut: "returned", absents: 0 },    
    "4E": { pp: "Ioulia MASSADÉ", nom: "George Eliot", eleves: 25, statut: "scored_20/11/2026", absents: 3 },
    "5A": { pp: "Aïssa KERMEZLI", nom: "Jamie Edwards", eleves: 29, statut: "evaluated_23/11/2026", absents: 0 },
    "5B": { pp : "François-Xavier LEDOUX", nom: "Blaise Pascal", eleves: 25, statut: "returned", absents: "inconnu" },
    "5C": { pp: "Clément BAROIN", nom: "Isabelle O'Brien", eleves: 30, statut: "evaluated_23/112026", absents: "inconnu" },
    "5D": { pp: "Claire VALLET", nom: "Alexander Bell", eleves: 29, statut: "scored", absents: 1 },
    "5E": { pp: "Marta MONTEMERLO", nom: "Marie Perrin", eleves: 29, statut: "returned", absents: 3 },
    "6A": { pp: "Nicolas BLANC", nom: "Arvernes", eleves: 27, statut: "returned", absents: 2 },
    "6B": { pp: "Marie-Claire BRETTES", nom: "Senons", eleves: 28, statut: "returned", absents: 1 },
    "6C": { pp: "Stéphane GOTTFARSTEIN", nom: "Carnutes", eleves: 24, statut: "returned", absents: 2 },
    "6D": { pp: "Arnaud COLLINET", nom: "Bituriges", eleves: 29, statut: "returned", absents: 5 },
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
   6. "returned"      : Devoir rendu aux élèves, terminé (Disparaît de la liste). */
