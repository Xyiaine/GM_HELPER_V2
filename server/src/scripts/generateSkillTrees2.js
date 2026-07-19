const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../data/skill_trees');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const cite_medicale = {
  arbre: {
    id: "serment_blouses_blanches", nom: "Serment des Blouses Blanches", type: "cache", cite_origine: "cite_medicale", condition_deblocage: "Respect des Blouses Blanches.", description: "Chirurgie avancée et survie extrême.",
    branches: [
      {
        id: "medecine_pointe", nom: "Médecine de Pointe",
        noeuds: [
          { id: "vaccin_large_spectre", nom: "Vaccin à Large Spectre", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Immunité aux maladies courantes.", effet: { resume: "Immunité Maladies Basiques" }, position: { x: 0, y: 100 } },
          { id: "transfusion_rapide", nom: "Transfusion Rapide", tier: 2, type: "actif", cout_points: 1, prerequis: ["vaccin_large_spectre"], description: "Donne ses propres PV à un allié.", effet: { resume: "Soin par transfert de PV", cooldown_tours: 2 }, position: { x: -50, y: 200 } },
          { id: "purge_rad_lourde", nom: "Purge Radiologique", tier: 3, type: "actif", cout_points: 2, prerequis: ["transfusion_rapide"], description: "Purge totalement les radiations au prix de la fatigue.", effet: { resume: "Soin Rads total, donne Fatigue", cout_ressource: { type: "dose_medicament", quantite: 2 } }, position: { x: -50, y: 300 } },
          { id: "prothese_combattante", nom: "Prothèse Combattante", tier: 4, type: "passif", cout_points: 2, prerequis: ["purge_rad_lourde"], description: "Les alliés soignés ignorent la douleur.", effet: { resume: "Alliés soignés reçoivent +10% Dégâts" }, position: { x: 0, y: 400 } },
          { id: "dieu_de_la_vie", nom: "Le Dieu de la Vie", tier: 5, type: "actif", cout_points: 3, prerequis: ["prothese_combattante"], description: "Restaure totalement tous les alliés, nécessite de rares composés.", effet: { resume: "Soin Complet de zone", cout_ressource: { type: "medicament_rare", quantite: 1 }, cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const armement = {
  arbre: {
    id: "doctrine_arsenaux", nom: "Doctrine des Arsenaux", type: "cache", cite_origine: "armement", condition_deblocage: "Grade chez les Arsenaux.", description: "Armement lourd et destruction massive.",
    branches: [
      {
        id: "destruction", nom: "Destruction Lourde",
        noeuds: [
          { id: "science_balistique", nom: "Science Balistique", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Ignore 10% de l'armure ennemie.", effet: { resume: "Pénétration d'Armure +10%" }, position: { x: 0, y: 100 } },
          { id: "grenadier_expert", nom: "Grenadier Expert", tier: 2, type: "passif", cout_points: 1, prerequis: ["science_balistique"], description: "Zone d'effet des explosifs augmentée.", effet: { resume: "+50% rayon explosif" }, position: { x: 50, y: 200 } },
          { id: "pluie_de_feu", nom: "Pluie de Feu", tier: 3, type: "actif", cout_points: 2, prerequis: ["grenadier_expert"], description: "Vide tout un chargeur lourd en une attaque.", effet: { resume: "Dégâts x3, vide le chargeur", cooldown_tours: 5 }, position: { x: 50, y: 300 } },
          { id: "armure_reactive", nom: "Armure Réactive", tier: 4, type: "passif", cout_points: 2, prerequis: ["pluie_de_feu"], description: "Les attaques de mêlée subies infligent des dégâts à l'attaquant.", effet: { resume: "Renvoi de Dégâts en Mêlée" }, position: { x: 0, y: 400 } },
          { id: "fureur_arsenal", nom: "La Fureur de l'Arsenal", tier: 5, type: "actif", cout_points: 3, prerequis: ["armure_reactive"], description: "Frappe d'artillerie dévastatrice coordonnée.", effet: { resume: "Dégâts AoE Massifs", cout_ressource: { type: "munitions_lourdes", quantite: 5 }, cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const eau = {
  arbre: {
    id: "benediction_source", nom: "Bénédiction de la Source", type: "cache", cite_origine: "eau", condition_deblocage: "Ami des Gardiens de la Source.", description: "Maîtrise de l'eau et survie hydrique.",
    branches: [
      {
        id: "survie_hydrique", nom: "Survie Hydrique",
        noeuds: [
          { id: "chameau_du_desert", nom: "Chameau du Désert", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Peut survivre avec très peu d'eau.", effet: { resume: "Besoins en eau divisés par 2" }, position: { x: 0, y: 100 } },
          { id: "purification_naturelle", nom: "Purification Naturelle", tier: 2, type: "actif", cout_points: 1, prerequis: ["chameau_du_desert"], description: "Rend buvable n'importe quelle eau saumâtre.", effet: { resume: "Génère 5 Eau Potable" }, position: { x: -50, y: 200 } },
          { id: "culture_acceleree", nom: "Culture Accélérée", tier: 3, type: "actif", cout_points: 2, prerequis: ["purification_naturelle"], description: "Fait pousser des rations en une nuit avec des graines spéciales.", effet: { resume: "Génère 10 Nourriture", cout_ressource: { type: "eau", quantite: 2 } }, position: { x: -50, y: 300 } },
          { id: "parfum_de_vie", nom: "Parfum de Vie", tier: 4, type: "passif", cout_points: 2, prerequis: ["culture_acceleree"], description: "L'odeur de la ressource attire l'attention (Faiblesse).", effet: { resume: "+10% de chances de rencontres hostiles, +10% Charisme" }, position: { x: 0, y: 400 } },
          { id: "maitre_oasis", nom: "Maître de l'Oasis", tier: 5, type: "actif", cout_points: 3, prerequis: ["parfum_de_vie"], description: "Crée un havre de paix temporaire.", effet: { resume: "Repose tout le groupe, soigne toutes les blessures légères", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const metaux = {
  arbre: {
    id: "rites_fossoyeurs", nom: "Rites des Fossoyeurs", type: "cache", cite_origine: "metaux", condition_deblocage: "Initié Fossoyeur.", description: "Récupération et résistance toxique.",
    branches: [
      {
        id: "fouille", nom: "Fouille des Ruines",
        noeuds: [
          { id: "nez_pour_la_ferraille", nom: "Nez pour la Ferraille", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Trouve toujours des pièces.", effet: { resume: "+30% de ferraille récupérée" }, position: { x: 0, y: 100 } },
          { id: "demantelement", nom: "Démantèlement", tier: 2, type: "actif", cout_points: 1, prerequis: ["nez_pour_la_ferraille"], description: "Détruit une barricade ou armure ennemie.", effet: { resume: "Détruit l'armure d'un ennemi", cooldown_tours: 3 }, position: { x: 50, y: 200 } },
          { id: "sacrifice_toxique", nom: "Sacrifice Toxique", tier: 3, type: "actif", cout_points: 2, prerequis: ["demantelement"], description: "Récupère des composants rares dans des zones ultra-radiées.", effet: { resume: "Génère 3 Pièces Rares, inflige 20 Rads au personnage" }, position: { x: 50, y: 300 } },
          { id: "sang_de_plomb", nom: "Sang de Plomb", tier: 4, type: "passif", cout_points: 2, prerequis: ["sacrifice_toxique"], description: "Les radiations augmentent l'endurance.", effet: { resume: "+1 PV Max par Rad accumulée (jusqu'à 20)" }, position: { x: 0, y: 400 } },
          { id: "seigneur_ruines", nom: "Le Seigneur des Ruines", tier: 5, type: "actif", cout_points: 3, prerequis: ["sang_de_plomb"], description: "Provoque un effondrement structurel massif.", effet: { resume: "AoE Massive (Dégâts physiques et étourdissement)", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const carburant = {
  arbre: {
    id: "flamme_raffineurs", nom: "Flamme des Raffineurs", type: "cache", cite_origine: "carburant", condition_deblocage: "Allié des Raffineurs.", description: "Carburants, explosifs et moteurs en feu.",
    branches: [
      {
        id: "chimie_combustion", nom: "Chimie de Combustion",
        noeuds: [
          { id: "expert_en_mazout", nom: "Expert en Mazout", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Réduit la consommation des véhicules.", effet: { resume: "-20% Conso Carburant" }, position: { x: 0, y: 100 } },
          { id: "melange_instable", nom: "Mélange Instable", tier: 2, type: "actif", cout_points: 1, prerequis: ["expert_en_mazout"], description: "Crée un explosif puissant mais instable.", effet: { resume: "Dégâts AoE, 10% chance d'explosion sur soi", cout_ressource: { type: "carburant", quantite: 1 } }, position: { x: -50, y: 200 } },
          { id: "moteur_hurlant", nom: "Moteur Hurlant", tier: 3, type: "actif", cout_points: 2, prerequis: ["melange_instable"], description: "Boost extrême d'un véhicule, l'endommage.", effet: { resume: "+50% Vitesse Véhicule, -10 PV Véhicule", cooldown_tours: 2 }, position: { x: -50, y: 300 } },
          { id: "peau_ignifugee", nom: "Peau Ignifugée", tier: 4, type: "passif", cout_points: 2, prerequis: ["moteur_hurlant"], description: "Résistance au feu.", effet: { resume: "Immunité aux dégâts de Feu" }, position: { x: 0, y: 400 } },
          { id: "holocauste_mobile", nom: "L'Holocauste Mobile", tier: 5, type: "actif", cout_points: 3, prerequis: ["peau_ignifugee"], description: "Embrase le véhicule pour percer les lignes ennemies sans subir de dommages.", effet: { resume: "Dégâts continus AoE autour du véhicule, Invulnérabilité au feu", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const divertissement = {
  arbre: {
    id: "masque_faiseurs_reves", nom: "Masque des Faiseurs de Rêves", type: "cache", cite_origine: "divertissement", condition_deblocage: "Idole de la Cité.", description: "Manipulation, propagande et moral.",
    branches: [
      {
        id: "illusion", nom: "Illusion",
        noeuds: [
          { id: "aura_de_star", nom: "Aura de Star", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Fascine les PNJ.", effet: { resume: "+20% Persuasion sur les foules" }, position: { x: 0, y: 100 } },
          { id: "distraction_fatale", nom: "Distraction Fatale", tier: 2, type: "actif", cout_points: 1, prerequis: ["aura_de_star"], description: "Stun un ennemi par une ruse spectaculaire.", effet: { resume: "Étourdit 1 cible (1 tour)", cooldown_tours: 3 }, position: { x: 50, y: 200 } },
          { id: "mensonge_apocalyptique", nom: "Mensonge Apocalyptique", tier: 3, type: "actif", cout_points: 2, prerequis: ["distraction_fatale"], description: "Propage une rumeur qui modifie l'économie locale.", effet: { resume: "Baisse le prix d'une ressource d'une Cité" }, position: { x: 50, y: 300 } },
          { id: "fragilite_diva", nom: "Fragilité de la Diva", tier: 4, type: "passif", cout_points: 2, prerequis: ["mensonge_apocalyptique"], description: "Incapable de porter des armures lourdes.", effet: { resume: "Esquive +20%, Armure Max limitée à Légère" }, position: { x: 0, y: 400 } },
          { id: "le_grand_spectacle", nom: "Le Grand Spectacle", tier: 5, type: "actif", cout_points: 3, prerequis: ["fragilite_diva"], description: "Stoppe temporairement un combat par une révélation ou une action époustouflante.", effet: { resume: "Fin immédiate des hostilités (1 scène)", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const ile_anciens = {
  arbre: {
    id: "heritage_anciens", nom: "Héritage des Anciens", type: "cache", cite_origine: "ile_anciens", condition_deblocage: "Élu du Paradis Perdu.", description: "Savoir pur de l'avant-guerre.",
    branches: [
      {
        id: "savoir_perdu", nom: "Savoir Perdu",
        noeuds: [
          { id: "erudit_pre_guerre", nom: "Érudit Pré-Guerre", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Comprend les textes et reliques anciens.", effet: { resume: "Lecture des données corrompues" }, position: { x: 0, y: 100 } },
          { id: "drone_compagnon", nom: "Drone Compagnon", tier: 2, type: "actif", cout_points: 1, prerequis: ["erudit_pre_guerre"], description: "Déploie un petit drone de reconnaissance.", effet: { resume: "Périmètre de vision partagé", cout_ressource: { type: "piece_rare", quantite: 1 } }, position: { x: -50, y: 200 } },
          { id: "bouclier_energetique", nom: "Bouclier Énergétique", tier: 3, type: "actif", cout_points: 2, prerequis: ["drone_compagnon"], description: "Génère un champ de force personnel.", effet: { resume: "Absorbe 50 Dégâts", cooldown_tours: 5 }, position: { x: -50, y: 300 } },
          { id: "dependance_technologique", nom: "Dépendance Technologique", tier: 4, type: "passif", cout_points: 2, prerequis: ["bouclier_energetique"], description: "Plus de bonus, mais nécessite des pièces de l'Île.", effet: { resume: "+2 à toutes les stats, réparation nécessite Pièces Rares" }, position: { x: 0, y: 400 } },
          { id: "frappe_orbitale", nom: "L'Œil des Dieux Anciens", tier: 5, type: "actif", cout_points: 3, prerequis: ["dependance_technologique"], description: "Appelle un satellite pré-guerre pour un laser orbital.", effet: { resume: "Dégâts AoE Massifs en Extérieur", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const nuke_city = {
  arbre: {
    id: "communion_reacteur", nom: "Communion du Réacteur", type: "cache", cite_origine: "nuke_city", condition_deblocage: "A survécu au cœur de Nuke City.", description: "L'énergie de l'atome maîtrisée au prix de son propre corps.",
    branches: [
      {
        id: "energie_atomique", nom: "Énergie Atomique",
        noeuds: [
          { id: "lueur_emeraude", nom: "Lueur Émeraude", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Brille dans le noir, immunisé aux Rads légères.", effet: { resume: "Vision nocturne légère, immunité Rads bas niveau" }, position: { x: 0, y: 100 } },
          { id: "surcharge_ionisante", nom: "Surcharge Ionisante", tier: 2, type: "actif", cout_points: 1, prerequis: ["lueur_emeraude"], description: "Ajoute des dégâts de radiation aux attaques.", effet: { resume: "+10 Dégâts Rads, inflige 2 Rads au lanceur", cooldown_tours: 2 }, position: { x: 50, y: 200 } },
          { id: "absorption_gamma", nom: "Absorption Gamma", tier: 3, type: "passif", cout_points: 2, prerequis: ["surcharge_ionisante"], description: "Se soigne dans les zones irradiées.", effet: { resume: "Régénère 5 PV/tour en zone radioactive" }, position: { x: 50, y: 300 } },
          { id: "mutation_instable", nom: "Mutation Instable", tier: 4, type: "passif", cout_points: 2, prerequis: ["absorption_gamma"], description: "Malus aux interactions sociales, mais physique surhumain.", effet: { resume: "+3 Force, -3 Charisme" }, position: { x: 0, y: 400 } },
          { id: "supernova", nom: "La Supernova", tier: 5, type: "actif", cout_points: 3, prerequis: ["mutation_instable"], description: "Relâche toute son énergie nucléaire en une explosion dévastatrice.", effet: { resume: "Dégâts extrêmes en zone, laisse le personnage à 1 PV", cooldown_tours: 99 }, position: { x: 0, y: 500 } }
        ]
      }
    ]
  }
};

const trees2 = [cite_medicale, armement, eau, metaux, carburant, divertissement, ile_anciens, nuke_city];
trees2.forEach(t => fs.writeFileSync(path.join(outDir, `arbre_${t.arbre.id}.json`), JSON.stringify(t, null, 2)));
console.log('Batch 2 written');
