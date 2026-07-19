const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../data/skill_trees');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. MÉDECINE
const medecine = {
  arbre: {
    id: "medecine", nom: "Médecine", type: "commun", cite_origine: null, condition_deblocage: null,
    description: "Soigner ses alliés et soi-même dans un monde en ruines.",
    branches: [
      {
        id: "soins_de_terrain", nom: "Soins de Terrain",
        noeuds: [
          { id: "trousse_de_fortune", nom: "Trousse de Fortune", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Bandages improvisés plus efficaces.", effet: { resume: "+2 soins prodigués avec du matériel improvisé", valeur: 2, cible: "soins_improvises" }, position: { x: 50, y: 100 } },
          { id: "sang_froid_rafistoleur", nom: "Sang-Froid du Rafistoleur", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Peut soigner sous le feu sans malus.", effet: { resume: "Soins en combat sans pénalité" }, position: { x: -50, y: 100 } },
          { id: "piqure_de_rappel", nom: "Piqûre de Rappel", tier: 2, type: "actif", cout_points: 1, prerequis: ["trousse_de_fortune"], description: "Injecte un stimulant qui restaure des PV immédiatement.", effet: { resume: "Soin instantané", cout_ressource: { type: "dose_medicament", quantite: 1 }, cooldown_tours: 3, portee: "allie_adjacent" }, position: { x: 50, y: 200 } },
          { id: "mains_stables", nom: "Mains Stables", tier: 3, type: "passif", cout_points: 2, prerequis: ["piqure_de_rappel", "sang_froid_rafistoleur"], description: "Aucune chance d'échec critique lors d'un soin d'urgence.", effet: { resume: "Empêche les échecs critiques médicaux" }, position: { x: 0, y: 300 } },
          { id: "resurrection_de_fortune", nom: "Résurrection de Fortune", tier: 5, type: "actif", cout_points: 3, prerequis: ["mains_stables"], description: "Stabilise un allié à l'article de la mort au prix d'un épuisement sévère.", effet: { resume: "Ranimation critique (coûte 1 action complète et réduit les PV max du soigneur temporairement)", cooldown_tours: 99, portee: "allie_adjacent" }, position: { x: 0, y: 500 } }
        ]
      },
      {
        id: "pharmacologie", nom: "Pharmacologie",
        noeuds: [
          { id: "detox_express", nom: "Détox Express", tier: 2, type: "passif", cout_points: 1, prerequis: ["trousse_de_fortune"], description: "Réduit de moitié la durée des effets de radiations légères.", effet: { resume: "Durée des radiations divisée par 2" }, position: { x: 150, y: 200 } },
          { id: "diagnostic_combat", nom: "Diagnostic de Combat", tier: 3, type: "actif", cout_points: 2, prerequis: ["detox_express"], description: "Identifie instantanément l'état critique d'un allié (poison, saignement, fracture).", effet: { resume: "Analyse médicale instantanée", cooldown_tours: 1 }, position: { x: 150, y: 300 } },
          { id: "antidote_universel", nom: "Antidote Universel", tier: 4, type: "actif", cout_points: 2, prerequis: ["diagnostic_combat"], description: "Neutralise un poison ou une maladie légère.", effet: { resume: "Purge les altérations d'état", cout_ressource: { type: "dose_medicament", quantite: 3 }, cooldown_tours: 5 }, position: { x: 150, y: 400 } }
        ]
      },
      {
        id: "chirurgie", nom: "Chirurgie",
        noeuds: [
          { id: "anatomie_appliquee", nom: "Anatomie Appliquée", tier: 2, type: "passif", cout_points: 1, prerequis: ["sang_froid_rafistoleur"], description: "Savoir où frapper et où suturer.", effet: { resume: "Critique sur 19-20 en mêlée et +2 soins globaux" }, position: { x: -150, y: 200 } },
          { id: "chirurgien_apocalypse", nom: "Chirurgien de l'Apocalypse", tier: 5, type: "actif", cout_points: 3, prerequis: ["anatomie_appliquee"], description: "Réalise une opération lourde (greffe/prothèse) sans infrastructure hospitalière.", effet: { resume: "Chirurgie de terrain miraculeuse", cooldown_tours: 99 }, position: { x: -150, y: 500 } }
        ]
      }
    ]
  }
};

// 2. TECHNOLOGIE
const technologie = {
  arbre: {
    id: "technologie", nom: "Technologie", type: "commun", cite_origine: null, condition_deblocage: null,
    description: "Construire, réparer, hacker et bidouiller les reliques mécaniques.",
    branches: [
      {
        id: "mecanique_lourde", nom: "Mécanique Lourde",
        noeuds: [
          { id: "oeil_du_mecano", nom: "Œil du Mécano", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Identifie instantanément une panne.", effet: { resume: "Diagnostic mécanique instantané" }, position: { x: -50, y: 100 } },
          { id: "reparation_urgence", nom: "Réparation d'Urgence", tier: 2, type: "actif", cout_points: 1, prerequis: ["oeil_du_mecano"], description: "Répare partiellement un véhicule en plein combat.", effet: { resume: "Soin de véhicule", cout_ressource: { type: "piece_detachee", quantite: 5 }, cooldown_tours: 3 }, position: { x: -50, y: 200 } },
          { id: "overclocking", nom: "Overclocking", tier: 3, type: "passif", cout_points: 2, prerequis: ["reparation_urgence"], description: "Les machines réparées gagnent un bonus de performance.", effet: { resume: "+5 Vitesse, +2 Dégâts pour la machine réparée pendant 3 tours" }, position: { x: -50, y: 300 } },
          { id: "souffle_dieu_moteur", nom: "Le Souffle du Dieu-Moteur", tier: 5, type: "actif", cout_points: 3, prerequis: ["overclocking"], description: "Relance instantanément un moteur en panne totale.", effet: { resume: "Résurrection de véhicule", cooldown_tours: 99 }, position: { x: -50, y: 500 } }
        ]
      },
      {
        id: "electronique", nom: "Électronique & IA",
        noeuds: [
          { id: "recyclage_habile", nom: "Recyclage Habile", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Plus efficace pour démonter.", effet: { resume: "Avantage aux jets de récupération de pièces" }, position: { x: 50, y: 100 } },
          { id: "cablage_fortune", nom: "Câblage de Fortune", tier: 2, type: "passif", cout_points: 1, prerequis: ["recyclage_habile"], description: "Répare très rapidement.", effet: { resume: "Avantage aux jets de réparation rapide" }, position: { x: 50, y: 200 } },
          { id: "decryptage_pre_guerre", nom: "Décryptage Pré-Guerre", tier: 3, type: "actif", cout_points: 2, prerequis: ["cablage_fortune"], description: "Débloque un terminal électronique ancien.", effet: { resume: "Piratage informatique automatique", cooldown_tours: 10 }, position: { x: 50, y: 300 } },
          { id: "sabotage_silencieux", nom: "Sabotage Silencieux", tier: 4, type: "actif", cout_points: 2, prerequis: ["decryptage_pre_guerre"], description: "Désactive à distance un piège ou une tourelle.", effet: { resume: "Désactivation électronique (Portée: 20m)", cooldown_tours: 5 }, position: { x: 50, y: 400 } }
        ]
      }
    ]
  }
};

// 3. DEFENSE
const defense = {
  arbre: {
    id: "defense", nom: "Défense", type: "commun", cite_origine: null, condition_deblocage: null,
    description: "Encaisser les dégâts, protéger le groupe, réduction de dégâts.",
    branches: [
      {
        id: "resilience", nom: "Résilience",
        noeuds: [
          { id: "cuir_tanne", nom: "Cuir Tanné", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Peau durcie.", effet: { resume: "+1 CA Naturelle", valeur: 1 }, position: { x: 0, y: 100 } },
          { id: "endurance_survivant", nom: "Endurance de Survivant", tier: 2, type: "passif", cout_points: 1, prerequis: ["cuir_tanne"], description: "+15 PV max.", effet: { resume: "+15 PV Max", valeur: 15 }, position: { x: -50, y: 200 } },
          { id: "resistance_radiations", nom: "Résistance aux Radiations", tier: 3, type: "passif", cout_points: 2, prerequis: ["endurance_survivant"], description: "Prend moins de dégâts radiologiques.", effet: { resume: "Résistance aux dégâts de radiation (dégâts divisés par 2)" }, position: { x: -50, y: 300 } }
        ]
      },
      {
        id: "protection_groupe", nom: "Protection du Groupe",
        noeuds: [
          { id: "provocation", nom: "Provocation", tier: 1, type: "actif", cout_points: 1, prerequis: [], description: "Force les ennemis proches à vous cibler pendant 1 tour.", effet: { resume: "Aggro de zone (5m)", cooldown_tours: 3 }, position: { x: 100, y: 100 } },
          { id: "position_defensive", nom: "Position Défensive", tier: 2, type: "actif", cout_points: 1, prerequis: ["provocation"], description: "Vous gagnez la Résistance à tous les dégâts pendant 1 tour, mais votre vitesse tombe à 0.", effet: { resume: "Résistance aux dégâts, Vitesse=0", cooldown_tours: 2 }, position: { x: 100, y: 200 } },
          { id: "bouclier_humain", nom: "Bouclier Humain", tier: 3, type: "actif", cout_points: 2, prerequis: ["position_defensive"], description: "Absorbe les dégâts destinés à un allié adjacent.", effet: { resume: "Interception de dégâts", cooldown_tours: 1 }, position: { x: 100, y: 300 } },
          { id: "rempart_inebranlable", nom: "Rempart Inébranlable", tier: 5, type: "actif", cout_points: 3, prerequis: ["bouclier_humain"], description: "Devient quasi-invulnérable et protège la formation.", effet: { resume: "Invulnérabilité de zone (1 tour)", cout_ressource: { type: "adrenaline", quantite: 2 }, cooldown_tours: 10 }, position: { x: 50, y: 500 } }
        ]
      },
      {
        id: "blindage", nom: "Blindage",
        noeuds: [
          { id: "blindage_improvise", nom: "Blindage Improvisé", tier: 4, type: "passif", cout_points: 2, prerequis: ["cuir_tanne"], description: "Réduction fixe des dégâts par coup.", effet: { resume: "-3 Dégâts sur toute attaque subie", valeur: 3 }, position: { x: -100, y: 400 } }
        ]
      }
    ]
  }
};

// 4. COMBAT RAPPROCHE
const combat_rapproche = {
  arbre: {
    id: "combat_rapproche", nom: "Combat Rapproché", type: "commun", cite_origine: null, condition_deblocage: null,
    description: "Armes de mêlée et armes automatiques courte portée.",
    branches: [
      {
        id: "melee_brutale", nom: "Mêlée Brutale",
        noeuds: [
          { id: "frappe_vicieuse", nom: "Frappe Vicieuse", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Coups plus précis.", effet: { resume: "Critique sur 19-20 en mêlée" }, position: { x: -50, y: 100 } },
          { id: "enchainement", nom: "Enchaînement", tier: 2, type: "actif", cout_points: 1, prerequis: ["frappe_vicieuse"], description: "Attaque supplémentaire gratuite après un critique.", effet: { resume: "Attaque bonus sur Critique", cooldown_tours: 1 }, position: { x: -50, y: 200 } },
          { id: "frenesie_du_sang", nom: "Frénésie du Sang", tier: 3, type: "actif", cout_points: 2, prerequis: ["enchainement"], description: "Attaques téméraires.", effet: { resume: "Avantage aux attaques de mêlée, mais les ennemis ont l'Avantage pour vous toucher (2 tours)", cooldown_tours: 5 }, position: { x: -50, y: 300 } },
          { id: "coup_fatal", nom: "Coup Fatal", tier: 4, type: "actif", cout_points: 2, prerequis: ["frenesie_du_sang"], description: "Garantit un coup critique sur cible affaiblie.", effet: { resume: "Critique garanti si PV cible < 30%", cooldown_tours: 3 }, position: { x: -50, y: 400 } },
          { id: "tornade_acier", nom: "Tornade d'Acier", tier: 5, type: "actif", cout_points: 3, prerequis: ["coup_fatal"], description: "Attaque tous les ennemis adjacents en un tour.", effet: { resume: "Attaque AoE mêlée", cout_ressource: { type: "adrenaline", quantite: 1 }, cooldown_tours: 5 }, position: { x: 0, y: 500 } }
        ]
      },
      {
        id: "close_quarters", nom: "Close-Quarters",
        noeuds: [
          { id: "rafale_courte", nom: "Rafale Courte", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Réduit la dispersion des mitraillettes à bout portant.", effet: { resume: "+2 Précision au SMG (<10m)", valeur: 2 }, position: { x: 50, y: 100 } },
          { id: "chargeur_rapide", nom: "Chargeur Rapide", tier: 2, type: "passif", cout_points: 1, prerequis: ["rafale_courte"], description: "Rechargement deux fois plus rapide.", effet: { resume: "Rechargement coûte une action libre" }, position: { x: 50, y: 200 } },
          { id: "tir_en_mouvement", nom: "Tir en Mouvement", tier: 3, type: "passif", cout_points: 2, prerequis: ["chargeur_rapide"], description: "Aucun malus de précision en se déplaçant avec un SMG.", effet: { resume: "Tir en courant sans malus" }, position: { x: 50, y: 300 } }
        ]
      }
    ]
  }
};

// 5. COMBAT A DISTANCE
const combat_distance = {
  arbre: {
    id: "combat_distance", nom: "Combat à Distance", type: "commun", cite_origine: null, condition_deblocage: null,
    description: "Fusils de précision et mitrailleuses lourdes.",
    branches: [
      {
        id: "precision", nom: "Précision",
        noeuds: [
          { id: "souffle_controle", nom: "Souffle Contrôlé", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Visée stable.", effet: { resume: "+2 Précision (>20m)", valeur: 2 }, position: { x: -50, y: 100 } },
          { id: "munitions_choisies", nom: "Munitions Choisies", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Balles spéciales.", effet: { resume: "+1 Dégât Fusil", valeur: 1 }, position: { x: -100, y: 100 } },
          { id: "oeil_sniper", nom: "Œil de Tireur d'Élite", tier: 3, type: "actif", cout_points: 2, prerequis: ["souffle_controle"], description: "Tir garanti en zone vitale sur cible immobile.", effet: { resume: "Coup critique automatique (cible immobile)", cooldown_tours: 4 }, position: { x: -50, y: 300 } },
          { id: "sang_froid_sniper", nom: "Sang-Froid du Sniper", tier: 4, type: "passif", cout_points: 2, prerequis: ["oeil_sniper"], description: "Aucune pénalité après un mouvement.", effet: { resume: "Mouvement sans malus de visée" }, position: { x: -50, y: 400 } },
          { id: "le_jugement", nom: "Le Jugement", tier: 5, type: "actif", cout_points: 3, prerequis: ["sang_froid_sniper"], description: "Tir mortel longue distance.", effet: { resume: "Létalité extrême, ignore les armures", cout_ressource: { type: "munitions_lourdes", quantite: 1 }, cooldown_tours: 10 }, position: { x: 0, y: 500 } }
        ]
      },
      {
        id: "puissance_de_feu", nom: "Puissance de Feu",
        noeuds: [
          { id: "tir_instinctif", nom: "Tir Instinctif", tier: 2, type: "actif", cout_points: 1, prerequis: ["souffle_controle"], description: "Tir de réaction sans viser à moyenne distance.", effet: { resume: "Attaque d'opportunité à l'arme à feu", cooldown_tours: 2 }, position: { x: 50, y: 200 } },
          { id: "refroidissement_ameliore", nom: "Refroidissement Amélioré", tier: 2, type: "passif", cout_points: 1, prerequis: ["souffle_controle"], description: "Réduit la surchauffe des mitrailleuses.", effet: { resume: "Double le nombre de tirs avant surchauffe" }, position: { x: 100, y: 200 } },
          { id: "tir_suppression", nom: "Tir de Suppression", tier: 3, type: "actif", cout_points: 2, prerequis: ["refroidissement_ameliore"], description: "Arrose une zone, réduit la précision ennemie.", effet: { resume: "Désavantage aux jets d'attaque ennemis dans la zone", cout_ressource: { type: "munitions", quantite: 20 }, cooldown_tours: 3 }, position: { x: 100, y: 300 } }
        ]
      }
    ]
  }
};

// 6. BEAU PARLEUR
const beau_parleur = {
  arbre: {
    id: "beau_parleur", nom: "Beau Parleur", type: "commun", cite_origine: null, condition_deblocage: null,
    description: "Négociation, intimidation et charisme.",
    branches: [
      {
        id: "negociation", nom: "Négociation",
        noeuds: [
          { id: "sens_marchandage", nom: "Sens du Marchandage", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Meilleurs prix lors des échanges.", effet: { resume: "Avantage aux jets de Persuasion pour marchander" }, position: { x: -50, y: 100 } },
          { id: "bluff_calcule", nom: "Bluff Calculé", tier: 2, type: "actif", cout_points: 1, prerequis: ["sens_marchandage"], description: "Fait croire un mensonge crédible.", effet: { resume: "Illusion verbale convaincante", cooldown_tours: 0 }, position: { x: -50, y: 200 } },
          { id: "lecture_intentions", nom: "Lecture des Intentions", tier: 4, type: "passif", cout_points: 2, prerequis: ["bluff_calcule"], description: "Détecte les mensonges.", effet: { resume: "Immunité aux bluffs PNJ simples" }, position: { x: -50, y: 400 } },
          { id: "verbe_qui_plie", nom: "Le Verbe qui Plie les Rois", tier: 5, type: "actif", cout_points: 3, prerequis: ["lecture_intentions"], description: "Retourne une négociation hostile en votre faveur.", effet: { resume: "Succès critique social automatique", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      },
      {
        id: "intimidation", nom: "Intimidation",
        noeuds: [
          { id: "regard_qui_tue", nom: "Regard qui Tue", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Effrayant.", effet: { resume: "Avantage aux jets d'Intimidation" }, position: { x: 50, y: 100 } },
          { id: "autorite_naturelle", nom: "Autorité Naturelle", tier: 2, type: "passif", cout_points: 1, prerequis: ["regard_qui_tue"], description: "Les PNJ mineurs hésitent à s'opposer.", effet: { resume: "Les bandits de bas niveau fuient ou parlementent" }, position: { x: 50, y: 200 } },
          { id: "chantage", nom: "Chantage", tier: 3, type: "actif", cout_points: 2, prerequis: ["autorite_naturelle"], description: "Force un PNJ à coopérer sous la menace.", effet: { resume: "Contrôle d'un PNJ non-hostile pour 1 action" }, position: { x: 50, y: 300 } }
        ]
      },
      {
        id: "charisme", nom: "Charisme de Groupe",
        noeuds: [
          { id: "discours_rassembleur", nom: "Discours Rassembleur", tier: 3, type: "actif", cout_points: 2, prerequis: ["sens_marchandage", "regard_qui_tue"], description: "Redonne du moral au groupe.", effet: { resume: "Restaure 10 PV et annule la Peur pour tout le groupe", cooldown_tours: 10 }, position: { x: 0, y: 300 } }
        ]
      }
    ]
  }
};

// --- ARBRES CACHÉS ---
const bunker_omega = {
  arbre: {
    id: "voile_acier", nom: "Voile d'Acier", type: "cache", cite_origine: "bunker_omega", condition_deblocage: "Originaire du Bunker Oméga ou approbation du Fantôme-Chef.", description: "L'art de l'espionnage technologique et des opérations secrètes.",
    branches: [
      {
        id: "infiltration", nom: "Infiltration",
        noeuds: [
          { id: "pas_de_lombre", nom: "Pas de l'Ombre", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Silencieux dans les ruines urbaines.", effet: { resume: "Avantage en Discrétion en ville" }, position: { x: 0, y: 100 } },
          { id: "brouillage_fortune", nom: "Brouillage de Fortune", tier: 2, type: "actif", cout_points: 1, prerequis: ["pas_de_lombre"], description: "Brouille un capteur ou une caméra.", effet: { resume: "Désactivation optique locale (5 min)", cout_ressource: { type: "pile", quantite: 1 }, cooldown_tours: 3 }, position: { x: -50, y: 200 } },
          { id: "extraction_silencieuse", nom: "Extraction Silencieuse", tier: 3, type: "actif", cout_points: 2, prerequis: ["brouillage_fortune"], description: "Permet de fuir sans déclencher d'alerte.", effet: { resume: "Évasion garantie hors d'un combat si non engagé en mêlée" }, position: { x: -50, y: 300 } },
          { id: "isolement_volontaire", nom: "Isolement Volontaire", tier: 4, type: "passif", cout_points: 2, prerequis: ["extraction_silencieuse"], description: "Mieux seul, mal à l'aise en groupe.", effet: { resume: "Avantage en Discrétion, Désavantage en Persuasion" }, position: { x: 0, y: 400 } },
          { id: "fantome_ultime", nom: "Le Fantôme Ultime", tier: 5, type: "actif", cout_points: 3, prerequis: ["isolement_volontaire"], description: "Indétectable physiquement et numériquement.", effet: { resume: "Invisibilité totale pour 1 scène", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      },
      {
        id: "renseignement", nom: "Renseignement",
        noeuds: [
          { id: "contact_dormant", nom: "Contact Dormant", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Informateur dans chaque grande cité.", effet: { resume: "1 Indice narratif gratuit par Cité visitée" }, position: { x: 50, y: 100 } },
          { id: "identite_emprunt", nom: "Identité d'Emprunt", tier: 2, type: "actif", cout_points: 1, prerequis: ["contact_dormant"], description: "Passer pour un local.", effet: { resume: "Passe-droit social temporaire" }, position: { x: 50, y: 200 } },
          { id: "reseau_agents", nom: "Réseau d'Agents", tier: 3, type: "passif", cout_points: 2, prerequis: ["identite_emprunt"], description: "Accès aux petits secrets des élites.", effet: { resume: "Avantage aux jets d'Intimidation sur VIPs" }, position: { x: 50, y: 300 } },
          { id: "oeil_du_bunker", nom: "Œil du Bunker", tier: 4, type: "passif", cout_points: 2, prerequis: ["reseau_agents"], description: "Détecte mensonges et taupes.", effet: { resume: "Révèle automatiquement les agents doubles" }, position: { x: 50, y: 400 } }
        ]
      }
    ]
  }
};

const cite_industrielle = {
  arbre: {
    id: "chaine_montage", nom: "Chaîne de Montage", type: "cache", cite_origine: "cite_industrielle", condition_deblocage: "Respect des Forgerons.", description: "Construction de masse et mécanique brute.",
    branches: [
      {
        id: "forge", nom: "La Forge",
        noeuds: [
          { id: "marteau_pilon", nom: "Marteau-Pilon", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Coups très lourds.", effet: { resume: "+2 Dégâts avec Armes Lourdes Improvisées", valeur: 2 }, position: { x: 0, y: 100 } },
          { id: "fabrication_express", nom: "Fabrication Express", tier: 2, type: "actif", cout_points: 1, prerequis: ["marteau_pilon"], description: "Crée une arme de jet ou munition lourde en plein combat.", effet: { resume: "Craft instantané", cout_ressource: { type: "piece_detachee", quantite: 3 } }, position: { x: -50, y: 200 } },
          { id: "renfort_structurel", nom: "Renfort Structurel", tier: 3, type: "passif", cout_points: 2, prerequis: ["fabrication_express"], description: "Les véhicules gagnent des PV additionnels.", effet: { resume: "+20 PV Max pour les camions conduits" }, position: { x: -50, y: 300 } },
          { id: "surcharge_carburant", nom: "Surcharge Carburant", tier: 4, type: "actif", cout_points: 2, prerequis: ["renfort_structurel"], description: "Sacrifie de l'essence pour un boost de vitesse absurde.", effet: { resume: "Double Vitesse, consomme 2x plus de Carburant" }, position: { x: 0, y: 400 } },
          { id: "titan_acier", nom: "Le Titan d'Acier", tier: 5, type: "actif", cout_points: 3, prerequis: ["surcharge_carburant"], description: "Transforme un véhicule en bulldozer de combat inarrêtable.", effet: { resume: "Véhicule immunisé aux dégâts légers et écrase tout, impact massif sur le Carburant" }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

// Writing the first batch
const trees = [medecine, technologie, defense, combat_rapproche, combat_distance, beau_parleur, bunker_omega, cite_industrielle];
trees.forEach(t => fs.writeFileSync(path.join(outDir, `arbre_${t.arbre.id}.json`), JSON.stringify(t, null, 2)));
console.log('Batch 1 written');
