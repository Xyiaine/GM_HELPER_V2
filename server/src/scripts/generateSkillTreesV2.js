const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../data/skill_trees');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Clean old common trees, keep city trees
const commonTreeFiles = [
  'arbre_pisteur_des_sables.json',
  'arbre_ombres_du_bassin.json',
  'arbre_furie_des_ruines.json',
  'arbre_ordre_du_moteur.json',
  'arbre_symbiose_sauvage.json',
  'arbre_bourse_de_la_douleur.json',
  'arbre_discipline_du_souffle.json',
  'arbre_le_serment.json',
  'arbre_combat_rapproche.json',
  'arbre_combat_distance.json',
  'arbre_arsenal_vivant.json',
  'arbre_defense.json',
  'arbre_medecine.json',
  'arbre_technologie.json',
  'arbre_toile_de_velours.json',
  'arbre_beau_parleur.json'
];

for (const file of commonTreeFiles) {
  const filePath = path.join(outDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// Helper to format nodes with standard layout positioning
function createNode({ id, nom, tier, type, cout_points, prerequis = [], prerequis_logique = 'ou', description, resume, cooldown = null, ressource = null, contrepartie = null, contrepartie_type = null, extenuation_niveaux = 0, x, y }) {
  return {
    id,
    nom,
    tier,
    type, // "passif" | "actif"
    cout_points,
    prerequis,
    prerequis_logique, // "ou" | "et"
    description,
    effet: {
      resume,
      ...(cooldown ? { cooldown_tours: cooldown } : {}),
      ...(ressource ? { cout_ressource: ressource } : {})
    },
    contrepartie,
    contrepartie_type, // "legere" | "severe" | null
    extenuation_niveaux,
    position: { x, y }
  };
}

// 1. PISTEUR DES SABLES
const pisteur_des_sables = {
  arbre: {
    id: "pisteur_des_sables",
    nom: "Pisteur des Sables",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Rôdeur — Tir de précision à distance et compagnon animal du Bassin.",
    attributs: ["Dextérité", "Sagesse"],
    classe_5e_ref: "Rôdeur",
    monnaie: "points",
    budget_total: 28,
    bestiaire: {
      palier_1: [
        { nom: "Chacal-Cendré", pv: 12, def: 12, atq: "+3/1d6", vitesse: "rapide", capacite: "Discipline de Meute" },
        { nom: "Chien-Perdu", pv: 14, def: 10, atq: "+4/1d8", vitesse: "moyenne", capacite: "Instinct Sauvage aléatoire" },
        { nom: "Vestige Radiotrophe", pv: 6, def: 8, atq: "+1/1d4", vitesse: "lente", capacite: "Profil survie/détection radique" }
      ],
      palier_2: [
        { nom: "Scorpion de Verre", pv: 18, def: 15, atq: "+4/1d8 (venin cristallisant)", vitesse: "moyenne", capacite: "Camouflage de Verre" },
        { nom: "Fouisseur de Sel", pv: 16, def: 13, atq: "+4/1d6", vitesse: "souterraine", capacite: "Embuscade Souterraine" }
      ],
      palier_3: [
        { nom: "Jeune Caprimyces Titanicus", pv: 30, def: 16, atq: "+6/2d8", vitesse: "lente", capacite: "Symbiose Sporale" },
        { nom: "Rejeton du Ver de Vitre", pv: 26, def: 14, atq: "+7/2d6 (brûlure)", vitesse: "rapide", capacite: "Radiation passive" },
        { nom: "Anguille-Tonnerre", pv: 24, def: 13, atq: "+6/2d6 (décharge)", vitesse: "très rapide", capacite: "Apex du delta" }
      ]
    },
    branches: [
      {
        id: "tir_de_precision",
        nom: "Tir de Précision",
        noeuds: [
          createNode({ id: "souffle_retenu", nom: "Souffle Retenu", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Avantage au tir à distance si le personnage n'a pas bougé pendant son tour.", resume: "Avantage au tir à distance si immobile ce tour", x: -120, y: 100 }),
          createNode({ id: "cartouches_choisies", nom: "Cartouches Choisies", tier: 2, type: "passif", cout_points: 1, prerequis: ["souffle_retenu"], description: "+1 dégât avec les armes à un coup non-automatiques.", resume: "+1 dégât (armes à un coup)", x: -160, y: 200 }),
          createNode({ id: "visee_stabilisee", nom: "Visée Stabilisée", tier: 2, type: "actif", cout_points: 1, prerequis: ["souffle_retenu"], description: "Annule le désavantage dû au mouvement ou à une cible partiellement cachée.", resume: "Annule désavantage de mouvement/couverture", cooldown: 2, contrepartie: "-1 à la Discrétion pendant la préparation du tir (immobilité totale requise).", contrepartie_type: "legere", x: -80, y: 200 }),
          createNode({ id: "oeil_de_tireur_d_elite", nom: "Œil de Tireur d'Élite", tier: 3, type: "actif", cout_points: 2, prerequis: ["cartouches_choisies", "visee_stabilisee"], description: "Contre une cible immobile : touche automatiquement une zone vitale (dégâts maximisés).", resume: "Touche zone vitale automatique (dégâts max)", cooldown: 2, x: -160, y: 300 }),
          createNode({ id: "pas_du_fouisseur", nom: "Pas du Fouisseur", tier: 3, type: "passif", cout_points: 2, prerequis: ["cartouches_choisies", "visee_stabilisee"], description: "Aucune pénalité de discrétion en s'immobilisant pour tirer en zone de dunes/sable ; la première attaque depuis une position dissimulée bénéficie d'un avantage.", resume: "Discrétion parfaite en dunes + avantage au 1er tir", x: -80, y: 300 }),
          createNode({ id: "sang_froid_du_bassin", nom: "Sang-Froid du Bassin", tier: 4, type: "passif", cout_points: 2, prerequis: ["oeil_de_tireur_d_elite", "pas_du_fouisseur"], description: "Aucune pénalité de précision après un déplacement, même en terrain difficile.", resume: "Précision intacte en déplacement/terrain difficile", x: -160, y: 400 }),
          createNode({ id: "cadence_du_chasseur", nom: "Cadence du Chasseur", tier: 4, type: "actif", cout_points: 2, prerequis: ["oeil_de_tireur_d_elite", "pas_du_fouisseur"], description: "Une fois par repos long : deux tirs de précision sur la même cible au lieu d'un.", resume: "Deux tirs de précision sur la même cible", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_jugement_du_bassin", nom: "Le Jugement du Bassin", tier: 5, type: "actif", cout_points: 3, prerequis: ["sang_froid_du_bassin", "cadence_du_chasseur"], prerequis_logique: "et", description: "Tir unique à très longue portée contre une cible qui ignore la menace : dégâts quasi-létaux garantis, ignore une partie de l'armure.", resume: "Tir d'exécution longue portée (ignore armure)", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation au tireur (concentration extrême).", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "compagnon_de_chasse",
        nom: "Compagnon de Chasse",
        noeuds: [
          createNode({ id: "lien_du_bassin", nom: "Lien du Bassin", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Débloque le compagnon Palier 1. Le compagnon agit toujours juste après le Pisteur, sans initiative séparée.", resume: "Débloque compagnon Palier 1", x: 120, y: 100 }),
          createNode({ id: "commandement_de_base", nom: "Commandement de Base", tier: 2, type: "actif", cout_points: 1, prerequis: ["lien_du_bassin"], description: "Ordonne au compagnon une action simple (attaquer, distraire, rapporter).", resume: "Ordre simple au compagnon", cooldown: 2, x: 80, y: 200 }),
          createNode({ id: "flair_du_bassin", nom: "Flair du Bassin", tier: 2, type: "passif", cout_points: 1, prerequis: ["lien_du_bassin"], description: "Le compagnon repère embuscades/pièges/proies à l'odorat ; avantage aux tests de pistage.", resume: "Détection embuscades/pièges + avantage pistage", contrepartie: "-1 à son prochain jet d'initiative s'il est exposé à une odeur forte/toxique.", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "compagnon_aguerri", nom: "Compagnon Aguerri", tier: 3, type: "passif", cout_points: 2, prerequis: ["commandement_de_base", "flair_du_bassin"], description: "Débloque l'accès au Palier 2, en remplacement du Palier 1.", resume: "Compagnon Palier 2", x: 80, y: 300 }),
          createNode({ id: "tactique_de_meute", nom: "Tactique de Meute", tier: 3, type: "actif", cout_points: 2, prerequis: ["commandement_de_base", "flair_du_bassin"], description: "Si le compagnon et le Pisteur attaquent la même cible dans le même tour, la seconde attaque a un avantage.", resume: "Avantage aux attaques combinées maître/compagnon", cooldown: 2, x: 160, y: 300 }),
          createNode({ id: "endurance_du_bassin", nom: "Endurance du Bassin", tier: 4, type: "passif", cout_points: 2, prerequis: ["compagnon_aguerri", "tactique_de_meute"], description: "Le compagnon gagne une résistance aux dégâts de poison et de radiation.", resume: "Résistance poison et radiation pour le compagnon", x: 80, y: 400 }),
          createNode({ id: "rappel_d_urgence", nom: "Rappel d'Urgence", tier: 4, type: "actif", cout_points: 2, prerequis: ["compagnon_aguerri", "tactique_de_meute"], description: "Si le compagnon est mis hors combat, il peut être stabilisé/rappelé une fois par repos long.", resume: "Sauve le compagnon K.O. 1x par repos long", cooldown: 4, x: 160, y: 400 }),
          createNode({ id: "symbiose_du_bassin", nom: "Symbiose du Bassin", tier: 5, type: "actif", cout_points: 3, prerequis: ["endurance_du_bassin", "rappel_d_urgence"], prerequis_logique: "et", description: "Débloque le Palier 3. Une fois par repos long, fusion d'actions avec le compagnon en assaut coordonné.", resume: "Compagnon Palier 3 + Assaut coordonné dévastateur", cooldown: 4, contrepartie: "Inflige 1 niveau d'Exténuation au Pisteur.", contrepartie_type: "severe", extenuation_niveaux: 1, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 2. OMBRES DU BASSIN
const ombres_du_bassin = {
  arbre: {
    id: "ombres_du_bassin",
    nom: "Ombres du Bassin",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Roublard — Infiltration, discrétion urbaine et attaques sournoises de précision.",
    attributs: ["Dextérité", "Intelligence"],
    classe_5e_ref: "Roublard",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "ombre_et_silence",
        nom: "Ombre et Silence",
        noeuds: [
          createNode({ id: "pas_de_loup", nom: "Pas de Loup", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Avantage aux tests de discrétion en mouvement lent.", resume: "Avantage discrétion en mouvement lent", x: -120, y: 100 }),
          createNode({ id: "fondu_dans_la_foule", nom: "Fondu dans la Foule", tier: 2, type: "passif", cout_points: 1, prerequis: ["pas_de_loup"], description: "En zone urbaine, quasi indétectable sans action suspecte.", resume: "Camouflage social parfait en cité", contrepartie: "-1 à la Perception passive en se fondant dans la foule.", contrepartie_type: "legere", x: -160, y: 200 }),
          createNode({ id: "evasion_rapide", nom: "Évasion Rapide", tier: 2, type: "actif", cout_points: 1, prerequis: ["pas_de_loup"], description: "Se dégage d'une immobilisation sans subir d'attaque d'opportunité.", resume: "Libération instantanée d'entraves sans opportunité", cooldown: 2, x: -80, y: 200 }),
          createNode({ id: "sens_du_danger", nom: "Sens du Danger", tier: 3, type: "passif", cout_points: 2, prerequis: ["fondu_dans_la_foule", "evasion_rapide"], description: "Ne peut jamais être totalement pris au dépourvu.", resume: "Immunité aux attaques surprises totales", x: -160, y: 300 }),
          createNode({ id: "ombre_vivante", nom: "Ombre Vivante", tier: 3, type: "actif", cout_points: 2, prerequis: ["fondu_dans_la_foule", "evasion_rapide"], description: "Devient indétectable un court instant, même en plein combat.", resume: "Disparition furtive en plein combat", cooldown: 2, x: -80, y: 300 }),
          createNode({ id: "fantome_des_ruelles", nom: "Fantôme des Ruelles", tier: 4, type: "passif", cout_points: 2, prerequis: ["sens_du_danger", "ombre_vivante"], description: "Aucune pénalité de vitesse en discrétion.", resume: "Vitesse maximale conservée en Furtivité", x: -160, y: 400 }),
          createNode({ id: "double_jeu", nom: "Double Jeu", tier: 4, type: "actif", cout_points: 2, prerequis: ["sens_du_danger", "ombre_vivante"], description: "Feint la mort/l'incapacité pendant un tour.", resume: "Fausse mort pendant 1 tour pour tromper l'ennemi", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_point_de_non_retour", nom: "Le Point de Non-Retour", tier: 5, type: "actif", cout_points: 3, prerequis: ["fantome_des_ruelles", "double_jeu"], prerequis_logique: "et", description: "Disparaît de la perception ennemie un instant, ressort avec un avantage garanti.", resume: "Furtivité absolue instantanée + Avantage garanti", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation (tension nerveuse extrême).", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "lame_sournoise",
        nom: "Lame Sournoise",
        noeuds: [
          createNode({ id: "frappe_opportuniste", nom: "Frappe Opportuniste", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Dégâts bonus contre une cible n'ayant pas agi ou prise au dépourvu.", resume: "+1d6 dégâts sur cible surprise ou lente", x: 120, y: 100 }),
          createNode({ id: "coup_bas", nom: "Coup Bas", tier: 2, type: "actif", cout_points: 1, prerequis: ["frappe_opportuniste"], description: "Inflige un désavantage temporaire sur la prochaine action de la cible.", resume: "Malus/désavantage infligé à la cible", cooldown: 2, x: 80, y: 200 }),
          createNode({ id: "poche_habile", nom: "Poche Habile", tier: 2, type: "passif", cout_points: 1, prerequis: ["frappe_opportuniste"], description: "Une attaque de mêlée réussie permet de dérober un objet discrètement.", resume: "Vol à la tire en attaquant", contrepartie: "Si repéré, -1 aux jets sociaux avec ce PNJ/faction par la suite.", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "frappe_precise", nom: "Frappe Précise", tier: 3, type: "actif", cout_points: 2, prerequis: ["coup_bas", "poche_habile"], description: "Ignore une partie de l'armure en visant un point faible.", resume: "Pénétration d'armure ciblée", cooldown: 2, x: 80, y: 300 }),
          createNode({ id: "reflexes_de_rue", nom: "Réflexes de Rue", tier: 3, type: "passif", cout_points: 2, prerequis: ["coup_bas", "poche_habile"], description: "Bonus de défense contre attaques d'opportunité et ripostes ; permet en plus un dégagement sans provoquer d'attaque, 1x/combat.", resume: "Défense d'opportunité + Désengagement gratuit 1x/combat", x: 160, y: 300 }),
          createNode({ id: "trahison_programmee", nom: "Trahison Programmée", tier: 4, type: "passif", cout_points: 2, prerequis: ["frappe_precise", "reflexes_de_rue"], description: "Dégâts bonus si la cible est piégée/empoisonnée/distraite.", resume: "Dégâts majorés sur cible altérée/piégée", x: 80, y: 400 }),
          createNode({ id: "second_souffle_sournois", nom: "Second Souffle Sournois", tier: 4, type: "actif", cout_points: 2, prerequis: ["frappe_precise", "reflexes_de_rue"], description: "Toucher une cible surprise octroie une action bonus.", resume: "Action bonus offerte sur frappe surprise", cooldown: 4, x: 160, y: 400 }),
          createNode({ id: "le_coup_de_grace", nom: "Le Coup de Grâce", tier: 5, type: "actif", cout_points: 3, prerequis: ["trahison_programmee", "second_souffle_sournois"], prerequis_logique: "et", description: "Contre une cible très affaiblie/surprise : tentative d'exécution instantanée.", resume: "Tentative d'exécution létale instantanée", cooldown: 4, contrepartie: "Inflige 1 niveau d'Exténuation (décharge nerveuse post-exécution).", contrepartie_type: "severe", extenuation_niveaux: 1, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 3. FURIE DES RUINES
const furie_des_ruines = {
  arbre: {
    id: "furie_des_ruines",
    nom: "Furie des Ruines",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Barbare — Rage dévastatrice, encaissement extrême et bio-augmentations musculaires.",
    attributs: ["Force", "Constitution"],
    classe_5e_ref: "Barbare",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "rage_et_encaissement",
        nom: "Rage et Encaissement",
        noeuds: [
          createNode({ id: "sang_bouillant", nom: "Sang Bouillant", tier: 1, type: "actif", cout_points: 1, prerequis: [], description: "Entre en rage : bonus de dégâts en mêlée, malus de défense ce tour.", resume: "Entrée en Rage (+dégâts mêlée, -défense)", cooldown: 2, x: -120, y: 100 }),
          createNode({ id: "cuir_tanne", nom: "Cuir Tanné", tier: 2, type: "passif", cout_points: 1, prerequis: ["sang_bouillant"], description: "Résistance mineure aux dégâts tranchants/perforants.", resume: "Réduction dégâts tranchants/perforants", contrepartie: "-1 Charisme en interactions formelles (callosités visibles).", contrepartie_type: "legere", x: -160, y: 200 }),
          createNode({ id: "fureur_contagieuse", nom: "Fureur Contagieuse", tier: 2, type: "actif", cout_points: 1, prerequis: ["sang_bouillant"], description: "Un allié proche gagne un bonus d'attaque temporaire en voyant la rage.", resume: "Buff attaque pour un allié proche", cooldown: 2, x: -80, y: 200 }),
          createNode({ id: "tolerance_radique", nom: "Tolérance Radique", tier: 3, type: "passif", cout_points: 2, prerequis: ["cuir_tanne", "fureur_contagieuse"], description: "Réduit les effets des radiations légères à moyennes.", resume: "Résistance passive aux radiations", x: -160, y: 300 }),
          createNode({ id: "increvable", nom: "Increvable", tier: 3, type: "passif", cout_points: 2, prerequis: ["cuir_tanne", "fureur_contagieuse"], description: "Ne tombe pas inconscient immédiatement à 0 PV — un round de sursis.", resume: "1 round de sursis à 0 PV", x: -80, y: 300 }),
          createNode({ id: "deuxieme_souffle_sauvage", nom: "Deuxième Souffle Sauvage", tier: 4, type: "actif", cout_points: 2, prerequis: ["tolerance_radique", "increvable"], description: "Récupère des PV en plein combat en rugissant.", resume: "Soin personnel en combat (Rugissement)", cooldown: 4, x: -160, y: 400 }),
          createNode({ id: "peau_de_fer", nom: "Peau de Fer", tier: 4, type: "passif", cout_points: 2, prerequis: ["tolerance_radique", "increvable"], description: "Callosité renforcée par l'exposition combinée drogues/radiations : réduction de dégâts supplémentaire.", resume: "Réduction des dégâts physique accrue", x: -80, y: 400 }),
          createNode({ id: "rage_increvable", nom: "Rage Increvable", tier: 5, type: "actif", cout_points: 3, prerequis: ["deuxieme_souffle_sauvage", "peau_de_fer"], prerequis_logique: "et", description: "Pendant plusieurs tours : résistance à tous les types de dégâts, quasi impossible à mettre hors combat sauf dégâts massifs.", resume: "Invulnérabilité relative temporaire", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation une fois l'effet terminé.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "augmentations_discretes",
        nom: "Augmentations Discrètes",
        noeuds: [
          createNode({ id: "greffe_sous_cutanee", nom: "Greffe Sous-Cutanée", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Bonus mineur de dégâts en mêlée, invisible à l'œil nu.", resume: "+1 dégât mêlée invisible", x: 120, y: 100 }),
          createNode({ id: "reflexes_amplifies", nom: "Réflexes Amplifiés", tier: 2, type: "passif", cout_points: 1, prerequis: ["greffe_sous_cutanee"], description: "Bonus discret d'esquive/initiative, sans trace visible.", resume: "+1 Initiative et Esquive", x: 80, y: 200 }),
          createNode({ id: "adrenaline_programmee", nom: "Adrénaline Programmée", tier: 2, type: "actif", cout_points: 1, prerequis: ["greffe_sous_cutanee"], description: "Poussée d'adrénaline artificielle : action bonus ce tour.", resume: "Action bonus instantanée", cooldown: 2, contrepartie: "-1 à tous les jets pendant le tour suivant (contrecoup).", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "ossature_renforcee", nom: "Ossature Renforcée", tier: 3, type: "passif", cout_points: 2, prerequis: ["reflexes_amplifies", "adrenaline_programmee"], description: "Réduction des dégâts de chute/impact ; avantage aux jets pour résister à être renversé ou agrippé.", resume: "Résistance chutes + Avantage anti-renversement/agrippement", x: 80, y: 300 }),
          createNode({ id: "filtrage_toxique", nom: "Filtrage Toxique", tier: 3, type: "passif", cout_points: 2, prerequis: ["reflexes_amplifies", "adrenaline_programmee"], description: "Résistance aux poisons/toxines.", resume: "Résistance innée aux poisons", x: 160, y: 300 }),
          createNode({ id: "surcharge_musculaire", nom: "Surcharge Musculaire", tier: 4, type: "actif", cout_points: 2, prerequis: ["ossature_renforcee", "filtrage_toxique"], description: "Bonus de Force massif temporaire, une fois par repos long.", resume: "Boost de Force massif (+4 Force)", cooldown: 4, x: 80, y: 400 }),
          createNode({ id: "camouflage_biologique", nom: "Camouflage Biologique", tier: 4, type: "passif", cout_points: 2, prerequis: ["ossature_renforcee", "filtrage_toxique"], description: "Les scanners/détecteurs ne repèrent aucune anomalie — les greffes restent totalement indétectables.", resume: "Greffes indétectables aux scanners", x: 160, y: 400 }),
          createNode({ id: "le_corps_parfait", nom: "Le Corps Parfait", tier: 5, type: "passif", cout_points: 3, prerequis: ["surcharge_musculaire", "camouflage_biologique"], prerequis_logique: "et", description: "Bonus cumulé permanent de Force/Constitution, entièrement invisible et indétectable.", resume: "Bonus permanent +2 Force et +2 Con (indétectable)", x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 4. ORDRE DU MOTEUR
const ordre_du_moteur = {
  arbre: {
    id: "ordre_du_moteur",
    nom: "Ordre du Moteur",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Paladin (culte) — Rites sacrés de la Sainte-Vidange, Ferveur sacrée, bénédiction et marteau du Moteur.",
    attributs: ["Charisme", "Constitution"],
    classe_5e_ref: "Paladin (culte)",
    monnaie: "points",
    budget_total: 28,
    ressource_propre: {
      nom: "Ferveur",
      description: "Se régénère au repos court et long via des gestes de dévotion mécanique.",
      regeneration: "repos_court_et_long"
    },
    branches: [
      {
        id: "ingenierie_du_culte",
        nom: "Ingénierie du Culte",
        noeuds: [
          createNode({ id: "benediction_de_l_outil", nom: "Bénédiction de l'Outil", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Les armes/outils bénis reçoivent un bonus mineur de fiabilité (jamais d'enrayement) ou de dégâts.", resume: "Armes bénies (jamais d'enrayement)", x: -120, y: 100 }),
          createNode({ id: "exorcisme_mecanique", nom: "Exorcisme Mécanique", tier: 2, type: "actif", cout_points: 1, prerequis: ["benediction_de_l_outil"], description: "Purifie/répare rituellement un dysfonctionnement mineur d'une machine corrompue.", resume: "Purification de panne mécanique", cooldown: 2, contrepartie: "-1 à l'Intelligence effective pour tout diagnostic profane.", contrepartie_type: "legere", x: -160, y: 200 }),
          createNode({ id: "benediction_du_convoi", nom: "Bénédiction du Convoi", tier: 2, type: "actif", cout_points: 1, prerequis: ["benediction_de_l_outil"], description: "Bénit un véhicule/machine : résistance temporaire à la panne/aux dégâts critiques.", resume: "Protection sacrée pour véhicule", cooldown: 4, x: -80, y: 200 }),
          createNode({ id: "rite_d_entretien", nom: "Rite d'Entretien", tier: 3, type: "passif", cout_points: 2, prerequis: ["exorcisme_mecanique", "benediction_du_convoi"], description: "Les machines/véhicules bénis par le porteur tombent deux fois moins souvent en panne sur la durée.", resume: "Pannes mécaniques réduites de 50%", x: -160, y: 300 }),
          createNode({ id: "main_sacree", nom: "Main Sacrée", tier: 3, type: "actif", cout_points: 2, prerequis: ["exorcisme_mecanique", "benediction_du_convoi"], description: "Répare en urgence, en pleine action, un équipement endommagé d'un allié (arme enrayée, armure brisée).", resume: "Réparation sacrée d'urgence en combat", cooldown: 2, x: -80, y: 300 }),
          createNode({ id: "in_nomine_motoris", nom: "In Nomine Motoris", tier: 4, type: "passif", cout_points: 2, prerequis: ["rite_d_entretien", "main_sacree"], description: "La Ferveur se régénère plus vite près d'un Adepte du Dieu-Moteur ou lors d'un rite collectif.", resume: "Régénération de Ferveur accélérée", x: -160, y: 400 }),
          createNode({ id: "consecration_de_l_arsenal", nom: "Consécration de l'Arsenal", tier: 4, type: "actif", cout_points: 2, prerequis: ["rite_d_entretien", "main_sacree"], description: "Bénit toutes les armes du groupe avant un affrontement annoncé : bonus de dégâts partagé pour ce combat.", resume: "Buff collectif de dégâts sacrés", ressource: { type: "ferveur", quantite: 2 }, cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_souffle_consacre", nom: "Le Souffle Consacré", tier: 5, type: "actif", cout_points: 3, prerequis: ["in_nomine_motoris", "consecration_de_l_arsenal"], prerequis_logique: "et", description: "Libère toute sa Ferveur : dégâts de zone majeurs, immunité temporaire aux pannes pour les alliés proches.", resume: "Onde sacrée AoE + Immunité pannes", ressource: { type: "ferveur", quantite: 3 }, cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "jugement_du_moteur",
        nom: "Jugement du Moteur",
        noeuds: [
          createNode({ id: "oeil_du_profanateur", nom: "Œil du Profanateur", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Identifie instantanément qui a endommagé, insulté ou trahi une machine/le culte.", resume: "Détection des hérétiques du Moteur", x: 120, y: 100 }),
          createNode({ id: "jugement_du_moteur_node", nom: "Jugement du Moteur", tier: 2, type: "actif", cout_points: 1, prerequis: ["oeil_du_profanateur"], description: "Dégâts supplémentaires contre une cible jugée profanatrice du culte.", resume: "Châtiment sacré sur profanateur", ressource: { type: "ferveur", quantite: 1 }, cooldown: 2, x: 80, y: 200 }),
          createNode({ id: "aura_de_ferveur", nom: "Aura de Ferveur", tier: 2, type: "passif", cout_points: 1, prerequis: ["oeil_du_profanateur"], description: "Les alliés proches gagnent un bonus de moral/défense tant que le porteur reste visible.", resume: "Aura sacrée (+1 Défense alliés proches)", x: 160, y: 200 }),
          createNode({ id: "colere_consacree", nom: "Colère Consacrée", tier: 3, type: "passif", cout_points: 2, prerequis: ["jugement_du_moteur_node", "aura_de_ferveur"], description: "Bonus d'attaque après avoir vu une machine/un allié détruit sous ses yeux.", resume: "+2 Attaque si allié/machine détruit", x: 80, y: 300 }),
          createNode({ id: "marque_du_profanateur", nom: "Marque du Profanateur", tier: 3, type: "actif", cout_points: 2, prerequis: ["jugement_du_moteur_node", "aura_de_ferveur"], description: "Désigne une cible : les alliés gagnent un avantage à l'attaquer tant qu'elle reste marquée.", resume: "Marque d'hérésie (Avantage pour les alliés)", cooldown: 2, x: 160, y: 300 }),
          createNode({ id: "marteau_du_jugement", nom: "Marteau du Jugement", tier: 4, type: "actif", cout_points: 2, prerequis: ["colere_consacree", "marque_du_profanateur"], description: "Frappe consacrée : dégâts majorés contre machines corrompues ou ennemis du culte.", resume: "Frappe de châtiment lourd", ressource: { type: "ferveur", quantite: 2 }, cooldown: 2, x: 80, y: 400 }),
          createNode({ id: "zele_inebranlable", nom: "Zèle Inébranlable", tier: 4, type: "passif", cout_points: 2, prerequis: ["colere_consacree", "marque_du_profanateur"], description: "Résistance à la peur et au contrôle mental tant que la Ferveur n'est pas épuisée.", resume: "Immunité peur/contrôle si Ferveur active", x: 160, y: 400 }),
          createNode({ id: "le_jugement_ultime", nom: "Le Jugement Ultime", tier: 5, type: "actif", cout_points: 3, prerequis: ["marteau_du_jugement", "zele_inebranlable"], prerequis_logique: "et", description: "Frappe consacrée dévastatrice contre le pire profanateur présent, ignorant l'essentiel de son armure.", resume: "Châtiment suprême (ignore l'armure)", ressource: { type: "ferveur", quantite: 3 }, cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 5. SYMBIOSE SAUVAGE (3 branches)
const symbiose_sauvage = {
  arbre: {
    id: "symbiose_sauvage",
    nom: "Symbiose Sauvage",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Druide — Mutations bio-chimiques, prothèses bestiales et transe de combat.",
    attributs: ["Sagesse", "Constitution"],
    classe_5e_ref: "Druide",
    monnaie: "points",
    budget_total: 27,
    branches: [
      {
        id: "drogues_de_combat",
        nom: "Drogues de Combat",
        noeuds: [
          createNode({ id: "stimulant_de_combat", nom: "Stimulant de Combat", tier: 1, type: "actif", cout_points: 1, prerequis: [], description: "Injecte un stimulant : bonus temporaire de dégâts ou de vitesse ce tour.", resume: "Boost temporaire dégâts/vitesse", cooldown: 2, x: -160, y: 100 }),
          createNode({ id: "tolerance_chimique", nom: "Tolérance Chimique", tier: 2, type: "passif", cout_points: 1, prerequis: ["stimulant_de_combat"], description: "Résistance aux effets secondaires négatifs des drogues de combat.", resume: "Immunité contrecoups drogues", x: -160, y: 200 }),
          createNode({ id: "cocktail_berserk", nom: "Cocktail Berserk", tier: 3, type: "actif", cout_points: 2, prerequis: ["tolerance_chimique"], description: "Stimulant puissant : bonus majeur d'attaque, désavantage en défense ce tour.", resume: "Gros boost d'attaque (-Défense)", cooldown: 2, x: -160, y: 300 }),
          createNode({ id: "overdrive_controle", nom: "Overdrive Contrôlé", tier: 4, type: "passif", cout_points: 2, prerequis: ["cocktail_berserk"], description: "Peut cumuler un second stimulant sans effet secondaire supplémentaire, une fois par combat.", resume: "Cumul de 2 stimulants 1x/combat", x: -160, y: 400 }),
          createNode({ id: "transe_chimique_totale", nom: "Transe Chimique Totale", tier: 5, type: "actif", cout_points: 3, prerequis: ["overdrive_controle"], description: "État combatif extrême, bonus cumulés sur plusieurs tours.", resume: "Transe Berserk ultime", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation une fois l'effet terminé.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -160, y: 500 })
        ]
      },
      {
        id: "augmentations_bestiales_visibles",
        nom: "Augmentations Bestiales Visibles",
        noeuds: [
          createNode({ id: "griffes_de_combat", nom: "Griffes de Combat", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Greffe visible : dégâts de mêlée naturels améliorés (griffes/lames rétractables).", resume: "Griffes naturelles (1d8 dégâts)", x: 0, y: 100 }),
          createNode({ id: "marque_de_la_bete", nom: "Marque de la Bête", tier: 2, type: "passif", cout_points: 1, prerequis: ["griffes_de_combat"], description: "Apparence clairement non-humaine : bonus d'intimidation.", resume: "+2 Intimidation (greffes visuelles)", contrepartie: "-1 Charisme dans les interactions formelles/cités méfiantes.", contrepartie_type: "legere", x: 0, y: 200 }),
          createNode({ id: "reflexes_predateurs", nom: "Réflexes Prédateurs", tier: 3, type: "passif", cout_points: 2, prerequis: ["marque_de_la_bete"], description: "Bonus d'initiative/esquive grâce aux greffes sensorielles bestiales.", resume: "+2 Initiative et Esquive bestiale", x: 0, y: 300 }),
          createNode({ id: "machoires_augmentees", nom: "Mâchoires Augmentées", tier: 4, type: "passif", cout_points: 2, prerequis: ["reflexes_predateurs"], description: "Attaque secondaire de morsure en plus des griffes.", resume: "Attaque bonus de morsure", x: 0, y: 400 }),
          createNode({ id: "forme_predatrice_totale", nom: "Forme Prédatrice Totale", tier: 5, type: "actif", cout_points: 3, prerequis: ["machoires_augmentees"], description: "Transformation temporaire quasi-bestiale : bonus majeurs offensifs/défensifs.", resume: "Métamorphose hybride bestiale", cooldown: 4, contrepartie: "L'apparence devient irréversiblement plus inhumaine à chaque usage prolongé.", contrepartie_type: "severe", x: 0, y: 500 })
        ]
      },
      {
        id: "mutation_corporelle",
        nom: "Mutation Corporelle",
        noeuds: [
          createNode({ id: "peau_resiliente", nom: "Peau Résiliente", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Résistance légère aux radiations, mutation cutanée superficielle et visible.", resume: "Résistance radiations légère", x: 160, y: 100 }),
          createNode({ id: "metabolisme_radique", nom: "Métabolisme Radique", tier: 2, type: "passif", cout_points: 1, prerequis: ["peau_resiliente"], description: "Peut se nourrir partiellement de sources faiblement radioactives en cas de disette.", resume: "Nutrition par radiations légères", contrepartie: "Dépendance mineure — sevrage sans dose stabilisante.", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "excroissance_utile", nom: "Excroissance Utile", tier: 3, type: "passif", cout_points: 2, prerequis: ["metabolisme_radique"], description: "Développe un membre/organe mutant mineur (vision nocturne, membre préhensile).", resume: "Organe mutant au choix (vision nocturne/membre bonus)", x: 160, y: 300 }),
          createNode({ id: "adaptation_extreme", nom: "Adaptation Extrême", tier: 4, type: "passif", cout_points: 2, prerequis: ["excroissance_utile"], description: "Résistance significative aux radiations et poisons.", resume: "Résistance forte radiations & poisons", contrepartie: "Malus social cumulatif mineur (mutations très visibles).", contrepartie_type: "legere", x: 160, y: 400 }),
          createNode({ id: "symbiose_totale_avec_le_sel", nom: "Symbiose Totale avec le Sel", tier: 5, type: "actif", cout_points: 3, prerequis: ["adaptation_extreme"], description: "Quasi-immunité aux radiations.", resume: "Immunité totale aux radiations", contrepartie: "Apparence définitivement et fortement altérée.", contrepartie_type: "severe", x: 160, y: 500 })
        ]
      }
    ]
  }
};

// 6. BOURSE DE LA DOULEUR (Caché - Faveur)
const bourse_de_la_douleur = {
  arbre: {
    id: "bourse_de_la_douleur",
    nom: "Bourse de la Douleur",
    type: "cache",
    cite_origine: null,
    condition_deblocage: "Affiliation / Dette envers les Collecteurs de la Bourse de la Douleur",
    description: "Arbre caché transversal — Collecte de dettes, saisies et intimidation financière (rattaché au Barde).",
    attributs: ["Charisme", "Constitution"],
    classe_5e_ref: "Barde (Collecteur)",
    monnaie: "faveur",
    budget_total: 15,
    branches: [
      {
        id: "traque_de_la_dette",
        nom: "Traque de la Dette",
        noeuds: [
          createNode({ id: "registre_en_tete", nom: "Registre en Tête", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Accès facilité aux informations du Registre sur les dettes d'une cible.", resume: "Connaissance immédiate des dettes d'une cible", x: -100, y: 100 }),
          createNode({ id: "oeil_du_collecteur", nom: "Œil du Collecteur", tier: 2, type: "passif", cout_points: 1, prerequis: ["registre_en_tete"], description: "Repère instantanément les signes de richesse ou d'actifs dissimulés d'une cible.", resume: "Détection des biens et trésors cachés", x: -100, y: 200 }),
          createNode({ id: "menace_calculee", nom: "Menace Calculée", tier: 3, type: "actif", cout_points: 2, prerequis: ["oeil_du_collecteur"], description: "Intimidation ciblée basée sur la dette réelle de la cible.", resume: "Intimidation par le Registre des dettes", cooldown: 2, x: -100, y: 300 }),
          createNode({ id: "reseau_d_indics", nom: "Réseau d'Indics", tier: 4, type: "passif", cout_points: 2, prerequis: ["menace_calculee"], description: "Accès à des informateurs locaux dans n'importe quelle cité pour localiser un débiteur.", resume: "Informateurs urbains dans toutes les cités", x: -100, y: 400 }),
          createNode({ id: "sentence_inscrite", nom: "Sentence Inscrite", tier: 5, type: "actif", cout_points: 3, prerequis: ["reseau_d_indics"], description: "Marque une cible comme débiteur prioritaire au Registre : bonus permanent contre elle.", resume: "Marquage officiel au Registre des Collecteurs", x: -100, y: 500 })
        ]
      },
      {
        id: "application_de_la_sentence",
        nom: "Application de la Sentence",
        noeuds: [
          createNode({ id: "saisie_rapide", nom: "Saisie Rapide", tier: 1, type: "actif", cout_points: 1, prerequis: [], description: "Confisque un objet/arme à une cible désarmée ou vaincue, sans résistance.", resume: "Saisie d'équipement instantanée", cooldown: 2, x: 100, y: 100 }),
          createNode({ id: "poigne_du_contrat", nom: "Poigne du Contrat", tier: 2, type: "passif", cout_points: 1, prerequis: ["saisie_rapide"], description: "Bonus aux tests de contrainte physique (immobiliser, entraver un débiteur).", resume: "+2 aux jets pour entraver/immobiliser", x: 100, y: 200 }),
          createNode({ id: "garantie_corporelle", nom: "Garantie Corporelle", tier: 3, type: "passif", cout_points: 2, prerequis: ["poigne_du_contrat"], description: "Quand un débiteur ne peut payer, une contrepartie physique peut être exigée immédiatement.", resume: "Exécution de gage corporel/travail forcé", x: 100, y: 300 }),
          createNode({ id: "escorte_de_la_bourse", nom: "Escorte de la Bourse", tier: 4, type: "actif", cout_points: 2, prerequis: ["garantie_corporelle"], description: "Appelle un renfort mineur (autre Collecteur) dans une cité influente.", resume: "Appel de renfort d'un Collecteur local", cooldown: 4, x: 100, y: 400 }),
          createNode({ id: "dette_de_sang", nom: "Dette de Sang", tier: 5, type: "actif", cout_points: 3, prerequis: ["escorte_de_la_bourse"], description: "Convertit une dette impayée en obligation de service direct envers le porteur.", resume: "Servitude de dette imposée à la cible", x: 100, y: 500 })
        ]
      }
    ]
  }
};

// 7. DISCIPLINE DU SOUFFLE
const discipline_du_souffle = {
  arbre: {
    id: "discipline_du_souffle",
    nom: "Discipline du Souffle",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Moine — Maitrise mentale et physique pure, sans drogues ni prothèses.",
    attributs: ["Dextérité", "Constitution"],
    classe_5e_ref: "Moine",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "corps_inebranlable",
        nom: "Corps Inébranlable",
        noeuds: [
          createNode({ id: "poings_disciplines", nom: "Poings Disciplinés", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Les frappes à mains nues sont fiables et comptent comme une arme naturelle correcte.", resume: "Attaques mains nues 1d6 contondant", x: -120, y: 100 }),
          createNode({ id: "esquive_instinctive", nom: "Esquive Instinctive", tier: 2, type: "passif", cout_points: 1, prerequis: ["poings_disciplines"], description: "Bonus d'esquive tant qu'aucune armure lourde n'est portée.", resume: "+2 Esquive sans armure lourde", x: -160, y: 200 }),
          createNode({ id: "frappe_enchainee", nom: "Frappe Enchaînée", tier: 2, type: "actif", cout_points: 1, prerequis: ["poings_disciplines"], description: "Après avoir touché, effectue immédiatement une seconde frappe à mains nues.", resume: "Attaque bonus rapide à mains nues", cooldown: 2, contrepartie: "-1 à la Défense pendant le tour utilisé.", contrepartie_type: "legere", x: -80, y: 200 }),
          createNode({ id: "percee_fluide", nom: "Percée Fluide", tier: 3, type: "actif", cout_points: 2, prerequis: ["esquive_instinctive", "frappe_enchainee"], description: "Se déplace à travers/autour des ennemis sans provoquer d'attaque d'opportunité.", resume: "Déplacement fluide anti-opportunité", cooldown: 2, x: -160, y: 300 }),
          createNode({ id: "callosites_d_acier", nom: "Callosités d'Acier", tier: 3, type: "passif", cout_points: 2, prerequis: ["esquive_instinctive", "frappe_enchainee"], description: "Résistance mineure aux dégâts contondants/tranchants.", resume: "Réduction des dégâts physiques légers", x: -80, y: 300 }),
          createNode({ id: "riposte_foudroyante", nom: "Riposte Foudroyante", tier: 4, type: "passif", cout_points: 2, prerequis: ["percee_fluide", "callosites_d_acier"], description: "Une fois par tour, riposte automatiquement contre un ennemi qui rate une attaque de mêlée.", resume: "Riposte automatique 1x/tour sur raté ennemi", x: -160, y: 400 }),
          createNode({ id: "concentration_de_combat", nom: "Concentration de Combat", tier: 4, type: "actif", cout_points: 2, prerequis: ["percee_fluide", "callosites_d_acier"], description: "Pendant plusieurs tours, chaque frappe à mains nues bénéficie d'un léger avantage.", resume: "Avantage permanent aux poings (3 tours)", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_point_de_rupture", nom: "Le Point de Rupture", tier: 5, type: "actif", cout_points: 3, prerequis: ["riposte_foudroyante", "concentration_de_combat"], prerequis_logique: "et", description: "Une série de frappes ciblées désactive temporairement un membre ou désarme la cible.", resume: "Neutralisation d'un membre/Désarmement cible", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation (concentration extrême).", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "souffle_maitrise",
        nom: "Souffle Maîtrisé",
        noeuds: [
          createNode({ id: "apnee_controlee", nom: "Apnée Contrôlée", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Peut retenir sa respiration bien plus longtemps que la normale.", resume: "Apnée prolongée (gaz/eau/radiations)", x: 120, y: 100 }),
          createNode({ id: "calme_interieur", nom: "Calme Intérieur", tier: 2, type: "passif", cout_points: 1, prerequis: ["apnee_controlee"], description: "Résistance à la peur, à la panique et aux effets mentaux mineurs.", resume: "Immunité panique & peur légère", x: 80, y: 200 }),
          createNode({ id: "souffle_purifiant", nom: "Souffle Purifiant", tier: 2, type: "actif", cout_points: 1, prerequis: ["apnee_controlee"], description: "Filtre une partie d'un poison ou d'un gaz inhalé juste après exposition.", resume: "Purification immédiate des toxines inhalées", cooldown: 2, contrepartie: "Exige silence total et pleine action (-1 Initiative tour suivant).", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "meditation_de_combat", nom: "Méditation de Combat", tier: 3, type: "passif", cout_points: 2, prerequis: ["calme_interieur", "souffle_purifiant"], description: "Récupère un peu d'endurance entre deux échanges, 1x par combat.", resume: "Restauration d'endurance 1x/combat", x: 80, y: 300 }),
          createNode({ id: "voix_posee", nom: "Voix Posée", tier: 3, type: "passif", cout_points: 2, prerequis: ["calme_interieur", "souffle_purifiant"], description: "Résiste à l'intimidation et aux effets de terreur ; difficile à déstabiliser verbalement.", resume: "Immunité Intimidation & provocations", x: 160, y: 300 }),
          createNode({ id: "resistance_radique_par_le_souffle", nom: "Résistance Radique par le Souffle", tier: 4, type: "passif", cout_points: 2, prerequis: ["meditation_de_combat", "voix_posee"], description: "Réduction significative des effets de radiation par un contrôle respiratoire extrême.", resume: "Réduction drastique des radiations par le souffle", x: 80, y: 400 }),
          createNode({ id: "serenite_absolue", nom: "Sérénité Absolue", tier: 4, type: "actif", cout_points: 2, prerequis: ["meditation_de_combat", "voix_posee"], description: "Immunité temporaire à la peur et au contrôle mental pour soi et un allié proche.", resume: "Aura d'immunité mentale (Soi + 1 allié)", cooldown: 4, x: 160, y: 400 }),
          createNode({ id: "le_souffle_eternel", nom: "Le Souffle Éternel", tier: 5, type: "actif", cout_points: 3, prerequis: ["resistance_radique_par_le_souffle", "serenite_absolue"], prerequis_logique: "et", description: "Suspend quasiment tous ses besoins vitaux pendant plusieurs tours : résistance presque totale aux poisons/gaz/radiations.", resume: "Suspension biologique totale & Invulnérabilité environnementale", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation une fois l'effet terminé.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 8. LE SERMENT (Brouillon)
const le_serment = {
  arbre: {
    id: "le_serment",
    nom: "Le Serment",
    type: "brouillon",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Paladin (profane) — Vœu personnel de protection et justice sans attache religieuse.",
    attributs: ["Force", "Charisme"],
    classe_5e_ref: "Paladin (profane)",
    monnaie: "points",
    budget_total: 28,
    ressource_propre: {
      nom: "Détermination",
      description: "Se régénère en agissant conformément au Serment gravé.",
      regeneration: "actions_conformes_au_serment"
    },
    branches: [
      {
        id: "protection_juree",
        nom: "Protection Jurée",
        noeuds: [
          createNode({ id: "voeu_grave", nom: "Vœu Gravé", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Établit le Serment (à qui/quoi il est lié) ; débloque l'accès à la Détermination.", resume: "Débloque la ressource Détermination", x: -120, y: 100 }),
          createNode({ id: "rempart_du_serment", nom: "Rempart du Serment", tier: 2, type: "actif", cout_points: 1, prerequis: ["voeu_grave"], description: "S'interpose et absorbe une partie des dégâts destinés à la personne/cause protégée.", resume: "Interposition et absorption de dégâts", ressource: { type: "determination", quantite: 1 }, cooldown: 2, x: -160, y: 200 }),
          createNode({ id: "endurance_de_la_promesse", nom: "Endurance de la Promesse", tier: 2, type: "passif", cout_points: 1, prerequis: ["voeu_grave"], description: "Résistance mineure aux dégâts tant que l'objet du Serment est à portée de vue.", resume: "+1 Résistance si protégé en vue", contrepartie: "-1 aux jets sociaux envers quiconque menace le Serment.", contrepartie_type: "legere", x: -80, y: 200 }),
          createNode({ id: "aura_du_serment", nom: "Aura du Serment", tier: 3, type: "passif", cout_points: 2, prerequis: ["rempart_du_serment", "endurance_de_la_promesse"], description: "Les alliés proches de l'objet du Serment gagnent un bonus de défense mineur.", resume: "+1 Défense alliés proches du protégé", x: -160, y: 300 }),
          createNode({ id: "aucun_pas_en_arriere", nom: "Aucun Pas en Arrière", tier: 3, type: "passif", cout_points: 2, prerequis: ["rempart_du_serment", "endurance_de_la_promesse"], description: "Avantage aux jets de résistance contre le fait d'être repoussé ou contraint de reculer.", resume: "Immunité aux effets de recul/repli forcé", x: -80, y: 300 }),
          createNode({ id: "aigle_gardien", nom: "Aigle Gardien", tier: 4, type: "actif", cout_points: 2, prerequis: ["aura_du_serment", "aucun_pas_en_arriere"], description: "Intercepte une attaque destinée à quiconque est sous la protection du Serment.", resume: "Interception d'attaque à distance pour le protégé", ressource: { type: "determination", quantite: 2 }, cooldown: 4, x: -160, y: 400 }),
          createNode({ id: "conviction_inebranlable", nom: "Conviction Inébranlable", tier: 4, type: "passif", cout_points: 2, prerequis: ["aura_du_serment", "aucun_pas_en_arriere"], description: "Résistance à la peur et au contrôle mental tant que le Serment n'est pas compromis.", resume: "Immunité contrôle mental si Serment respecté", x: -80, y: 400 }),
          createNode({ id: "le_dernier_rempart", nom: "Le Dernier Rempart", tier: 5, type: "actif", cout_points: 3, prerequis: ["aigle_gardien", "conviction_inebranlable"], prerequis_logique: "et", description: "Devient la cible prioritaire de tous les ennemis proches et gagne une résistance majeure.", resume: "Provocation globale + Résistance ultime", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "jugement_personnel",
        nom: "Jugement Personnel",
        noeuds: [
          createNode({ id: "oeil_du_jugement", nom: "Œil du Jugement", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Identifie instantanément qui représente une menace directe pour l'objet du Serment.", resume: "Détection des menaces contre le Serment", x: 120, y: 100 }),
          createNode({ id: "frappe_du_serment", nom: "Frappe du Serment", tier: 2, type: "actif", cout_points: 1, prerequis: ["oeil_du_jugement"], description: "Dégâts bonus contre une cible ayant menacé ou attaqué l'objet du Serment.", resume: "Châtiment vengeresse (+dégâts)", ressource: { type: "determination", quantite: 1 }, cooldown: 2, x: 80, y: 200 }),
          createNode({ id: "colere_contenue", nom: "Colère Contenue", tier: 2, type: "passif", cout_points: 1, prerequis: ["oeil_du_jugement"], description: "Bonus d'attaque après avoir vu l'objet du Serment blessé.", resume: "+2 Attaque si protégé blessé", contrepartie: "-1 Sagesse effective pendant ce combat contre la cible.", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "marque_du_parjure", nom: "Marque du Parjure", tier: 3, type: "actif", cout_points: 2, prerequis: ["frappe_du_serment", "colere_contenue"], description: "Désigne un ennemi comme parjure : les alliés gagnent un avantage à l'attaquer.", resume: "Marque de parjure (Avantage alliés)", cooldown: 2, x: 80, y: 300 }),
          createNode({ id: "poursuite_implacable", nom: "Poursuite Implacable", tier: 3, type: "passif", cout_points: 2, prerequis: ["frappe_du_serment", "colere_contenue"], description: "Aucune pénalité de mouvement en poursuivant une cible marquée.", resume: "Vitesse max en poursuite de cible marquée", x: 160, y: 300 }),
          createNode({ id: "jugement_amplifie", nom: "Jugement Amplifié", tier: 4, type: "actif", cout_points: 2, prerequis: ["marque_du_parjure", "poursuite_implacable"], description: "Une frappe consacrée par la Détermination inflige des dégâts majorés à une cible marquée.", resume: "Frappe sacrée amplifiée", ressource: { type: "determination", quantite: 2 }, cooldown: 2, x: 80, y: 400 }),
          createNode({ id: "determination_renouvelee", nom: "Détermination Renouvelée", tier: 4, type: "passif", cout_points: 2, prerequis: ["marque_du_parjure", "poursuite_implacable"], description: "Régénère plus vite la Détermination après avoir protégé activement l'objet du Serment.", resume: "Recouvrement rapide de Détermination", x: 160, y: 400 }),
          createNode({ id: "le_jugement_final", nom: "Le Jugement Final", tier: 5, type: "actif", cout_points: 3, prerequis: ["jugement_amplifie", "determination_renouvelee"], prerequis_logique: "et", description: "Libère toute sa Détermination en un assaut dévastateur contre celui qui a menacé son Serment.", resume: "Assaut vengeresse dévastateur ultime", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 9. COMBAT RAPPROCHÉ
const combat_rapproche = {
  arbre: {
    id: "combat_rapproche",
    nom: "Combat Rapproché",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Guerrier (mêlée) — Maître d'arme au contact direct, exécutions et domination du terrain.",
    attributs: ["Force", "Constitution"],
    classe_5e_ref: "Guerrier (mêlée)",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "melee_brutale",
        nom: "Mêlée Brutale",
        noeuds: [
          createNode({ id: "frappe_assuree", nom: "Frappe Assurée", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "+1 dégât fiable avec les armes de mêlée.", resume: "+1 dégât armes de mêlée", x: -120, y: 100 }),
          createNode({ id: "enchainement", nom: "Enchaînement", tier: 2, type: "actif", cout_points: 1, prerequis: ["frappe_assuree"], description: "Après un coup réussi, chance d'attaque bonus immédiate.", resume: "Attaque bonus rapide de mêlée", cooldown: 2, contrepartie: "-1 à la Défense pendant le tour (position découverte).", contrepartie_type: "legere", x: -160, y: 200 }),
          createNode({ id: "poigne_ferme", nom: "Poigne Ferme", tier: 2, type: "passif", cout_points: 1, prerequis: ["frappe_assuree"], description: "Avantage pour ne pas se faire désarmer.", resume: "Immunité désarmement", x: -80, y: 200 }),
          createNode({ id: "coup_puissant", nom: "Coup Puissant", tier: 3, type: "actif", cout_points: 2, prerequis: ["enchainement", "poigne_ferme"], description: "Sacrifice de précision pour un gros bonus de dégâts sur une attaque.", resume: "-2 Précision / +2d6 Dégâts sur le coup", cooldown: 2, x: -160, y: 300 }),
          createNode({ id: "sens_du_combat", nom: "Sens du Combat", tier: 3, type: "passif", cout_points: 2, prerequis: ["enchainement", "poigne_ferme"], description: "Avantage à repérer le point faible d'un adversaire après l'avoir touché une première fois.", resume: "Avantage aux tirs/coups suivants sur la même cible", x: -80, y: 300 }),
          createNode({ id: "frappe_decisive", nom: "Frappe Décisive", tier: 4, type: "passif", cout_points: 2, prerequis: ["coup_puissant", "sens_du_combat"], description: "Chance de coup critique augmentée avec les armes de mêlée.", resume: "Critique sur 19-20 en mêlée", x: -160, y: 400 }),
          createNode({ id: "acharnement", nom: "Acharnement", tier: 4, type: "actif", cout_points: 2, prerequis: ["coup_puissant", "sens_du_combat"], description: "Enchaîne deux grosses attaques d'affilée sur la même cible.", resume: "Double frappe lourde instantanée", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_coup_qui_tue", nom: "Le Coup qui Tue", tier: 5, type: "actif", cout_points: 3, prerequis: ["frappe_decisive", "acharnement"], prerequis_logique: "et", description: "Attaque unique visant à achever une cible déjà affaiblie : dégâts maximisés, quasi-garantis.", resume: "Frappe d'exécution maximale", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "close_quarters",
        nom: "Close-Quarters",
        noeuds: [
          createNode({ id: "garde_rapprochee", nom: "Garde Rapprochée", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Bonus de défense contre les attaques au contact rapproché.", resume: "+1 Défense au contact direct", x: 120, y: 100 }),
          createNode({ id: "percee", nom: "Percée", tier: 2, type: "actif", cout_points: 1, prerequis: ["garde_rapprochee"], description: "Traverse la ligne ennemie pour atteindre une cible derrière, sans provoquer d'attaque d'opportunité.", resume: "Traversée de ligne ennemie sans opportunité", cooldown: 2, contrepartie: "-1 à la Défense au tour suivant.", contrepartie_type: "legere", x: 80, y: 200 }),
          createNode({ id: "desequilibre", nom: "Déséquilibre", tier: 2, type: "passif", cout_points: 1, prerequis: ["garde_rapprochee"], description: "Une attaque réussie a une chance de faire trébucher la cible.", resume: "Chance de faire trébucher la cible", x: 160, y: 200 }),
          createNode({ id: "corps_a_corps_etouffant", nom: "Corps à Corps Étouffant", tier: 3, type: "passif", cout_points: 2, prerequis: ["percee", "desequilibre"], description: "Avantage contre les cibles adjacentes multiples en mêlée serrée.", resume: "Avantage en combat contre cibles multiples", x: 80, y: 300 }),
          createNode({ id: "reaction_vive", nom: "Réaction Vive", tier: 3, type: "passif", cout_points: 2, prerequis: ["percee", "desequilibre"], description: "Attaque d'opportunité automatique si un ennemi tente de fuir le contact rapproché.", resume: "Opportunité automatique sur fuite ennemie", x: 160, y: 300 }),
          createNode({ id: "maitrise_du_terrain", nom: "Maîtrise du Terrain", tier: 4, type: "passif", cout_points: 2, prerequis: ["corps_a_corps_etouffant", "reaction_vive"], description: "Aucune pénalité en terrain encombré/exigu.", resume: "Immunité pénalités terrain exigu", x: 80, y: 400 }),
          createNode({ id: "tourbillon", nom: "Tourbillon", tier: 4, type: "actif", cout_points: 2, prerequis: ["corps_a_corps_etouffant", "reaction_vive"], description: "Attaque tous les ennemis adjacents en un seul mouvement.", resume: "Attaque AoE sur tous les ennemis adjacents", cooldown: 4, x: 160, y: 400 }),
          createNode({ id: "le_coeur_de_la_melee", nom: "Le Cœur de la Mêlée", tier: 5, type: "actif", cout_points: 3, prerequis: ["maitrise_du_terrain", "tourbillon"], prerequis_logique: "et", description: "Devient temporairement quasi increvable au contact direct, enchaînant les attaques contre tous les adversaires proches.", resume: "Fureur de mêlée déchaînée invincible", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 10. ARSENAL VIVANT
const arsenal_vivant = {
  arbre: {
    id: "arsenal_vivant",
    nom: "Arsenal Vivant",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Artificier (armement lourd) — Armes lourdes à un coup, mitrailleuses automatiques et puissance de feu brute.",
    attributs: ["Force", "Dextérité"],
    classe_5e_ref: "Artificier (armement lourd)",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "frappe_lourde",
        nom: "Frappe Lourde",
        noeuds: [
          createNode({ id: "calibrage_precis", nom: "Calibrage Précis", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Dégâts fiables accrus avec les armes à un coup lourdes.", resume: "+1 dégât (rail-gun, bazooka, roquettes)", x: -120, y: 100 }),
          createNode({ id: "chargeur_rapide_lourd", nom: "Chargeur Rapide", tier: 2, type: "passif", cout_points: 1, prerequis: ["calibrage_precis"], description: "Réduit le temps de rechargement d'une arme lourde.", resume: "Rechargement accéléré d'arme lourde", x: -160, y: 200 }),
          createNode({ id: "tir_perforant", nom: "Tir Perforant", tier: 2, type: "actif", cout_points: 1, prerequis: ["calibrage_precis"], description: "Ignore une part significative de l'armure/couverture de la cible.", resume: "Pénétration d'armure lourde", cooldown: 2, contrepartie: "-1 Initiative au tour suivant (recul désorientant).", contrepartie_type: "legere", x: -80, y: 200 }),
          createNode({ id: "visee_assistee", nom: "Visée Assistée", tier: 3, type: "passif", cout_points: 2, prerequis: ["chargeur_rapide_lourd", "tir_perforant"], description: "Avantage contre les cibles immobiles ou de grande taille (véhicules, machines).", resume: "Avantage au tir sur cibles grandes/immobiles", x: -160, y: 300 }),
          createNode({ id: "detonation_controlee", nom: "Détonation Contrôlée", tier: 3, type: "actif", cout_points: 2, prerequis: ["chargeur_rapide_lourd", "tir_perforant"], description: "Un tir crée une zone d'effet réduite (éclats/onde de choc).", resume: "Création d'une onde de choc d'éclats", cooldown: 2, x: -80, y: 300 }),
          createNode({ id: "refroidissement_d_urgence", nom: "Refroidissement d'Urgence", tier: 4, type: "passif", cout_points: 2, prerequis: ["visee_assistee", "detonation_controlee"], description: "Évite la surchauffe/l'enrayement même après plusieurs tirs lourds consécutifs.", resume: "Immunité surchauffe/enrayement lourd", x: -160, y: 400 }),
          createNode({ id: "tir_de_rupture", nom: "Tir de Rupture", tier: 4, type: "actif", cout_points: 2, prerequis: ["visee_assistee", "detonation_controlee"], description: "Un tir massif inflige des dégâts bonus et renverse/déstabilise la cible.", resume: "Tir destructeur + Renversement cible", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_poids_du_jugement", nom: "Le Poids du Jugement", tier: 5, type: "actif", cout_points: 3, prerequis: ["refroidissement_d_urgence", "tir_de_rupture"], prerequis_logique: "et", description: "Un tir dévastateur capable de démembrer une structure ou un véhicule léger.", resume: "Tir dévastateur anti-structure/anti-blindé", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "rafale_continue",
        nom: "Rafale Continue",
        noeuds: [
          createNode({ id: "doigt_sur_la_gachette", nom: "Doigt sur la Gâchette", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Dégâts fiables accrus avec les armes automatiques légères.", resume: "+1 dégât armes automatiques/SMG", x: 120, y: 100 }),
          createNode({ id: "arrosage_controle", nom: "Arrosage Contrôlé", tier: 2, type: "actif", cout_points: 1, prerequis: ["doigt_sur_la_gachette"], description: "Tire en rafale sur une zone, touchant plusieurs cibles proches.", resume: "Rafale de zone multi-cibles", cooldown: 2, contrepartie: "-1 Discrétion pendant et après l'utilisation (bruit/lumière).", contrepartie_type: "legere", x: 80, y: 200 }),
          createNode({ id: "munitions_optimisees", nom: "Munitions Optimisées", tier: 2, type: "passif", cout_points: 1, prerequis: ["doigt_sur_la_gachette"], description: "Consomme moins de munitions par rafale.", resume: "Consommation munitions -50%", x: 160, y: 200 }),
          createNode({ id: "suppression_continue", nom: "Suppression Continue", tier: 3, type: "actif", cout_points: 2, prerequis: ["arrosage_controle", "munitions_optimisees"], description: "Une cible sous le feu continu subit un désavantage à ses actions offensives.", resume: "Tir de suppression (Désavantage ennemi)", cooldown: 2, x: 80, y: 300 }),
          createNode({ id: "refroidissement_ameliore", nom: "Refroidissement Amélioré", tier: 3, type: "passif", cout_points: 2, prerequis: ["arrosage_controle", "munitions_optimisees"], description: "Réduit fortement les risques d'enrayement/surchauffe en tir prolongé.", resume: "Réduction risque enrayement tir continu", x: 160, y: 300 }),
          createNode({ id: "barrage_mobile", nom: "Barrage Mobile", tier: 4, type: "actif", cout_points: 2, prerequis: ["suppression_continue", "refroidissement_ameliore"], description: "Se déplace tout en maintenant un tir de suppression sur une zone.", resume: "Tir de suppression en déplacement", cooldown: 4, x: 80, y: 400 }),
          createNode({ id: "cadence_explosive", nom: "Cadence Explosive", tier: 4, type: "passif", cout_points: 2, prerequis: ["suppression_continue", "refroidissement_ameliore"], description: "Chance de dégâts critiques accrue avec les armes automatiques.", resume: "Critique sur 19-20 aux armes automatiques", x: 160, y: 400 }),
          createNode({ id: "rideau_de_feu", nom: "Rideau de Feu", tier: 5, type: "actif", cout_points: 3, prerequis: ["barrage_mobile", "cadence_explosive"], prerequis_logique: "et", description: "Déluge de tir automatique sur une large zone, touchant tous les ennemis proches.", resume: "Déluge de feu AoE massif", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 11. DÉFENSE
const defense = {
  arbre: {
    id: "defense",
    nom: "Défense",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Guerrier (tank) — Survie personnelle pure, encaissement de dégâts et blindage inamovible.",
    attributs: ["Constitution", "Force"],
    classe_5e_ref: "Guerrier (tank)",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "resilience",
        nom: "Résilience",
        noeuds: [
          createNode({ id: "cuir_epais", nom: "Cuir Épais", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Réduction mineure de tous les dégâts physiques subis.", resume: "-1 à tous les dégâts physiques subis", x: -120, y: 100 }),
          createNode({ id: "encaissement", nom: "Encaissement", tier: 2, type: "passif", cout_points: 1, prerequis: ["cuir_epais"], description: "Moins affecté par les effets de déséquilibre/étourdissement.", resume: "Résistance déséquilibre/étourdissement", x: -160, y: 200 }),
          createNode({ id: "second_souffle_defense", nom: "Second Souffle", tier: 2, type: "actif", cout_points: 1, prerequis: ["cuir_epais"], description: "Récupère un peu de PV en pleine garde défensive.", resume: "Soin personnel rapide en garde", cooldown: 2, contrepartie: "-1 Initiative au tour suivant.", contrepartie_type: "legere", x: -80, y: 200 }),
          createNode({ id: "inebranlable", nom: "Inébranlable", tier: 3, type: "passif", cout_points: 2, prerequis: ["encaissement", "second_souffle_defense"], description: "Avantage aux jets pour résister à être renversé, repoussé ou étourdi.", resume: "Avantage contre le fait d'être à terre/repoussé", x: -160, y: 300 }),
          createNode({ id: "ignorer_la_douleur", nom: "Ignorer la Douleur", tier: 3, type: "passif", cout_points: 2, prerequis: ["encaissement", "second_souffle_defense"], description: "Aucune pénalité de dégâts sous la moitié des PV maximum.", resume: "Immunité pénalités si PV < 50%", x: -80, y: 300 }),
          createNode({ id: "mur_de_chair", nom: "Mur de Chair", tier: 4, type: "passif", cout_points: 2, prerequis: ["inebranlable", "ignorer_la_douleur"], description: "Résistance significative contre une seule cible désignée en combat.", resume: "Résistance ciblée contre 1 ennemi désigné", x: -160, y: 400 }),
          createNode({ id: "regeneration_de_combat", nom: "Régénération de Combat", tier: 4, type: "actif", cout_points: 2, prerequis: ["inebranlable", "ignorer_la_douleur"], description: "Récupère des PV significatifs en pleine bataille.", resume: "Restauration PV majeure en combat", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "rempart_inebranlable", nom: "Rempart Inébranlable", tier: 5, type: "actif", cout_points: 3, prerequis: ["mur_de_chair", "regeneration_de_combat"], prerequis_logique: "et", description: "Pendant plusieurs tours, quasi insensible aux dégâts d'une seule source.", resume: "Invulnérabilité ciblée temporaire", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "blindage",
        nom: "Blindage",
        noeuds: [
          createNode({ id: "port_d_armure_optimise", nom: "Port d'Armure Optimisé", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Aucune pénalité de mobilité liée aux armures lourdes.", resume: "Mobilité maximale en armure lourde", x: 120, y: 100 }),
          createNode({ id: "bouclier_reactif", nom: "Bouclier Réactif", tier: 2, type: "passif", cout_points: 1, prerequis: ["port_d_armure_optimise"], description: "Bonus de défense contre la première attaque de chaque combat.", resume: "+2 Défense contre le premier coup", x: 80, y: 200 }),
          createNode({ id: "parade_ferme", nom: "Parade Ferme", tier: 2, type: "actif", cout_points: 1, prerequis: ["port_d_armure_optimise"], description: "Bloque totalement une attaque.", resume: "Blocage total d'1 attaque", cooldown: 2, contrepartie: "-1 à la Défense au tour suivant.", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "renforcement_tactique", nom: "Renforcement Tactique", tier: 3, type: "passif", cout_points: 2, prerequis: ["bouclier_reactif", "parade_ferme"], description: "Bonus de défense supplémentaire tant que le porteur reste immobile.", resume: "+2 Défense si immobile", x: 80, y: 300 }),
          createNode({ id: "contre_attaque_blindee", nom: "Contre-Attaque Blindée", tier: 3, type: "actif", cout_points: 2, prerequis: ["bouclier_reactif", "parade_ferme"], description: "Après avoir bloqué une attaque, riposte immédiatement.", resume: "Riposte instantanée après blocage", cooldown: 2, x: 160, y: 300 }),
          createNode({ id: "armure_vivante", nom: "Armure Vivante", tier: 4, type: "passif", cout_points: 2, prerequis: ["renforcement_tactique", "contre_attaque_blindee"], description: "L'armure encaisse une partie des dégâts sans jamais se dégrader.", resume: "Immunité dégradation d'armure", x: 80, y: 400 }),
          createNode({ id: "position_imprenable", nom: "Position Imprenable", tier: 4, type: "actif", cout_points: 2, prerequis: ["renforcement_tactique", "contre_attaque_blindee"], description: "Devient impossible à déplacer ou contourner pendant plusieurs tours.", resume: "Ancrage au sol inamovible (3 tours)", cooldown: 4, x: 160, y: 400 }),
          createNode({ id: "l_inamovible", nom: "L'Inamovible", tier: 5, type: "actif", cout_points: 3, prerequis: ["armure_vivante", "position_imprenable"], prerequis_logique: "et", description: "Devient quasiment impossible à tuer ou déplacer pendant plusieurs tours.", resume: "Blindage absolu inamovible", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 12. MÉDECINE
const medecine = {
  arbre: {
    id: "medecine",
    nom: "Médecine",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Clerc (scientifique) — Soins de terrain, pharmacologie, chirurgie lourde et noyau REBOOT.",
    attributs: ["Intelligence", "Sagesse"],
    classe_5e_ref: "Clerc (scientifique)",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "soins_de_terrain",
        nom: "Soins de Terrain",
        noeuds: [
          createNode({ id: "premiers_secours", nom: "Premiers Secours", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Stabilise automatiquement un allié à l'agonie à proximité, 1x par combat.", resume: "Stabilisation automatique d'agonisant 1x/combat", x: -120, y: 100 }),
          createNode({ id: "triage_rapide", nom: "Triage Rapide", tier: 2, type: "actif", cout_points: 1, prerequis: ["premiers_secours"], description: "Soigne rapidement un allié légèrement blessé, sans matériel lourd.", resume: "Soin rapide de blessure légère", cooldown: 2, contrepartie: "-1 Discrétion pendant le soin (concentration visible).", contrepartie_type: "legere", x: -160, y: 200 }),
          createNode({ id: "diagnostic_rapide", nom: "Diagnostic Rapide", tier: 2, type: "passif", cout_points: 1, prerequis: ["premiers_secours"], description: "Identifie instantanément la nature d'une blessure, maladie ou intoxication.", resume: "Analyse instantanée des afflictions", x: -80, y: 200 }),
          createNode({ id: "sang_froid_clinique", nom: "Sang-Froid Clinique", tier: 3, type: "passif", cout_points: 2, prerequis: ["triage_rapide", "diagnostic_rapide"], description: "Aucun désavantage à soigner sous le feu ennemi.", resume: "Soins en combat sans pénalités", x: -160, y: 300 }),
          createNode({ id: "antidote_express", nom: "Antidote Express", tier: 3, type: "actif", cout_points: 2, prerequis: ["triage_rapide", "diagnostic_rapide"], description: "Neutralise un poison ou une toxine en cours d'effet chez un allié.", resume: "Purge d'1 poison/toxine actif", cooldown: 2, x: -80, y: 300 }),
          createNode({ id: "chirurgie_de_fortune", nom: "Chirurgie de Fortune", tier: 4, type: "actif", cout_points: 2, prerequis: ["sang_froid_clinique", "antidote_express"], description: "Stabilise et soigne significativement un allié gravement blessé en plein combat.", resume: "Restauration PV majeure d'urgence", cooldown: 4, x: -160, y: 400 }),
          createNode({ id: "endurance_clinique", nom: "Endurance Clinique", tier: 4, type: "passif", cout_points: 2, prerequis: ["sang_froid_clinique", "antidote_express"], description: "Les soins prodigués sont plus efficaces si le porteur est resté indemne durant le combat.", resume: "+50% efficacité soins si soigneur indemne", x: -80, y: 400 }),
          createNode({ id: "miracle_clinique", nom: "Miracle Clinique", tier: 5, type: "actif", cout_points: 3, prerequis: ["chirurgie_de_fortune", "endurance_clinique"], prerequis_logique: "et", description: "Ramène un allié inconscient à un état stable et fonctionnel presque instantanément.", resume: "Reconstitution vitale d'urgence K.O.", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "chirurgie_et_pharmacologie",
        nom: "Chirurgie & Pharmacologie",
        noeuds: [
          createNode({ id: "pharmacopee_de_base", nom: "Pharmacopée de Base", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Fabrique/prépare des remèdes de base efficaces avec des ressources limitées.", resume: "Craft de médikits/remèdes de fortune", x: 120, y: 100 }),
          createNode({ id: "main_stable", nom: "Main Stable", tier: 2, type: "passif", cout_points: 1, prerequis: ["pharmacopee_de_base"], description: "Bonus aux interventions chirurgicales complexes.", resume: "+2 aux opérations/greffes chirurgicales", x: 80, y: 200 }),
          createNode({ id: "cocktail_therapeutique", nom: "Cocktail Thérapeutique", tier: 2, type: "actif", cout_points: 1, prerequis: ["pharmacopee_de_base"], description: "Injecte un mélange qui soigne et stabilise sur la durée.", resume: "Régénération de PV sur 3 tours", cooldown: 2, contrepartie: "-1 Constitution effective pendant quelques heures.", contrepartie_type: "legere", x: 160, y: 200 }),
          createNode({ id: "anesthesie_controlee", nom: "Anesthésie Contrôlée", tier: 3, type: "actif", cout_points: 2, prerequis: ["main_stable", "cocktail_therapeutique"], description: "Insensibilise une cible à la douleur, réduisant certains effets de choc.", resume: "Réduction des effets de choc/douleur", cooldown: 2, x: 80, y: 300 }),
          createNode({ id: "savoir_faire_blouses_blanches", nom: "Savoir-Faire des Blouses Blanches", tier: 3, type: "passif", cout_points: 2, prerequis: ["main_stable", "cocktail_therapeutique"], description: "Bonus significatif à toute opération nécessitant un équipement médical avancé (greffes, implants).", resume: "+4 aux greffes et pose d'implants", x: 160, y: 300 }),
          createNode({ id: "greffe_d_urgence", nom: "Greffe d'Urgence", tier: 4, type: "actif", cout_points: 2, prerequis: ["anesthesie_controlee", "savoir_faire_blouses_blanches"], description: "Répare un membre/organe gravement endommagé en pleine intervention.", resume: "Restauration d'1 membre/organe mutilé", cooldown: 4, x: 80, y: 400 }),
          createNode({ id: "stock_personnel", nom: "Stock Personnel", tier: 4, type: "passif", cout_points: 2, prerequis: ["anesthesie_controlee", "savoir_faire_blouses_blanches"], description: "Conserve toujours une réserve de fournitures médicales de base.", resume: "Réserve de secours médicale permanente", x: 160, y: 400 }),
          createNode({ id: "resurrection_de_fortune", nom: "Résurrection de Fortune", tier: 5, type: "actif", cout_points: 3, prerequis: ["greffe_d_urgence", "stock_personnel"], prerequis_logique: "et", description: "Ramène un allié récemment décédé à la vie. Nécessite un noyau REBOOT (organe symbiote vendu par les Blouses Blanches). Usage unique par noyau.", resume: "Réanimation d'un cadavre (coûte 1 Noyau REBOOT)", cooldown: 4, ressource: { type: "noyau_reboot", quantite: 1 }, contrepartie: "Inflige 2 niveaux d'Exténuation au chirurgien.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 13. TECHNOLOGIE
const technologie = {
  arbre: {
    id: "technologie",
    nom: "Technologie",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Magicien/Artificier (séculier) — Bricolage, réparation mécanique, piratage d'IA et contrôle de réseaux.",
    attributs: ["Intelligence", "Dextérité"],
    classe_5e_ref: "Magicien/Artificier (séculier)",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "mecanique_et_fabrication",
        nom: "Mécanique & Fabrication",
        noeuds: [
          createNode({ id: "bricolage_efficace", nom: "Bricolage Efficace", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Répare rapidement un équipement/véhicule endommagé avec des moyens limités.", resume: "+2 aux réparations improvisées", x: -120, y: 100 }),
          createNode({ id: "pieces_de_recup", nom: "Pièces de Récup", tier: 2, type: "passif", cout_points: 1, prerequis: ["bricolage_efficace"], description: "Fabrique des pièces de remplacement fonctionnelles à partir de matériaux de récupération.", resume: "Craft de pièces détachées avec ferraille", x: -160, y: 200 }),
          createNode({ id: "reparation_en_urgence", nom: "Réparation en Urgence", tier: 2, type: "actif", cout_points: 1, prerequis: ["bricolage_efficace"], description: "Répare en plein combat un équipement/véhicule allié endommagé.", resume: "Réparation instantanée en combat", cooldown: 2, contrepartie: "-1 Discrétion pendant la réparation (bruit/étincelles).", contrepartie_type: "legere", x: -80, y: 200 }),
          createNode({ id: "ingenierie_robuste", nom: "Ingénierie Robuste", tier: 3, type: "passif", cout_points: 2, prerequis: ["pieces_de_recup", "reparation_en_urgence"], description: "Les équipements/véhicules réparés par le porteur tombent moins souvent en panne.", resume: "Taux de panne réduit sur objets réparés", x: -160, y: 300 }),
          createNode({ id: "modification_imprisee", nom: "Modification Improvisée", tier: 3, type: "actif", cout_points: 2, prerequis: ["pieces_de_recup", "reparation_en_urgence"], description: "Bricole une amélioration temporaire significative sur une arme ou un véhicule.", resume: "Buff temporaire sur arme/véhicule (+2 stats)", cooldown: 4, x: -80, y: 300 }),
          createNode({ id: "maitre_mecanicien", nom: "Maître Mécanicien", tier: 4, type: "passif", cout_points: 2, prerequis: ["ingenierie_robuste", "modification_imprisee"], description: "Répare des dégâts bien plus importants en une seule intervention.", resume: "+50% PV restaurés sur réparations", x: -160, y: 400 }),
          createNode({ id: "fabrication_express", nom: "Fabrication Express", tier: 4, type: "actif", cout_points: 2, prerequis: ["ingenierie_robuste", "modification_imprisee"], description: "Fabrique un objet/outil utile à partir de presque rien en quelques minutes.", resume: "Craft d'outil spécifique en quelques minutes", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_grand_redemarrage", nom: "Le Grand Redémarrage", tier: 5, type: "actif", cout_points: 3, prerequis: ["maitre_mecanicien", "fabrication_express"], prerequis_logique: "et", description: "Relance et répare intégralement une machine ou un véhicule complexe donné pour mort.", resume: "Remise en état totale d'une machine/véhicule détruit", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "electronique_et_ia",
        nom: "Électronique & IA",
        noeuds: [
          createNode({ id: "lecture_de_systemes", nom: "Lecture de Systèmes", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Comprend rapidement le fonctionnement d'un système électronique inconnu.", resume: "Analyse instantanée de terminaux/drones", x: 120, y: 100 }),
          createNode({ id: "piratage_basique", nom: "Piratage Basique", tier: 2, type: "actif", cout_points: 1, prerequis: ["lecture_de_systemes"], description: "Contourne une sécurité électronique simple (serrure, terminal).", resume: "Piratage de serrures/terminaux simples", cooldown: 2, contrepartie: "-1 Discrétion pendant l'opération (risques de logs).", contrepartie_type: "legere", x: 80, y: 200 }),
          createNode({ id: "diagnostic_reseau", nom: "Diagnostic Réseau", tier: 2, type: "passif", cout_points: 1, prerequis: ["lecture_de_systemes"], description: "Repère les failles/vulnérabilités d'un système connecté.", resume: "Détection des failles de sécurité", x: 160, y: 200 }),
          createNode({ id: "controle_a_distance", nom: "Contrôle à Distance", tier: 3, type: "actif", cout_points: 2, prerequis: ["piratage_basique", "diagnostic_reseau"], description: "Prend temporairement le contrôle d'une machine/drone simple.", resume: "Piratage & contrôle d'1 drone/tourelle", cooldown: 2, x: 80, y: 300 }),
          createNode({ id: "pare_feu_personnel", nom: "Pare-Feu Personnel", tier: 3, type: "passif", cout_points: 2, prerequis: ["piratage_basique", "diagnostic_reseau"], description: "Résistance aux tentatives de piratage/sabotage électronique visant le porteur.", resume: "Immunité aux piratages personnels", x: 160, y: 300 }),
          createNode({ id: "maitre_du_reseau", nom: "Maître du Réseau", tier: 4, type: "passif", cout_points: 2, prerequis: ["controle_a_distance", "pare_feu_personnel"], description: "Accès facilité aux systèmes du Registre et aux réseaux de cité.", resume: "Accès réseau prioritaire au Registre", x: 80, y: 400 }),
          createNode({ id: "sabotage_silencieux_tech", nom: "Sabotage Silencieux", tier: 4, type: "actif", cout_points: 2, prerequis: ["controle_a_distance", "pare_feu_personnel"], description: "Désactive discrètement un système électronique complexe sans déclencher d'alerte.", resume: "Extinction de système sans alerte", cooldown: 4, x: 160, y: 400 }),
          createNode({ id: "l_esprit_dans_la_machine", nom: "L'Esprit dans la Machine", tier: 5, type: "actif", cout_points: 3, prerequis: ["maitre_du_reseau", "sabotage_silencieux_tech"], prerequis_logique: "et", description: "Prend le contrôle total d'un système complexe (véhicule, installation, réseau) pendant plusieurs tours.", resume: "Prise de contrôle informatique globale", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

// 14. TOILE DE VELOURS
const toile_de_velours = {
  arbre: {
    id: "toile_de_velours",
    nom: "Toile de Velours",
    type: "commun",
    cite_origine: null,
    condition_deblocage: null,
    description: "Analogue Barde — Manipulation sociale, séduction, intrigue politique et négociation.",
    attributs: ["Charisme", "Sagesse"],
    classe_5e_ref: "Barde",
    monnaie: "points",
    budget_total: 28,
    branches: [
      {
        id: "manipulation_et_seduction",
        nom: "Manipulation & Séduction",
        noeuds: [
          createNode({ id: "charme_naturel", nom: "Charme Naturel", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Bonus aux premières impressions et à la séduction.", resume: "+2 aux premiers contacts sociaux", x: -120, y: 100 }),
          createNode({ id: "mensonge_convaincant", nom: "Mensonge Convaincant", tier: 2, type: "passif", cout_points: 1, prerequis: ["charme_naturel"], description: "Bonus pour mentir de façon crédible sous pression.", resume: "Avantage aux jets de Tromperie sous pression", contrepartie: "Si découvert, -1 aux jets sociaux futurs avec ce PNJ.", contrepartie_type: "legere", x: -160, y: 200 }),
          createNode({ id: "suggestion_habile", nom: "Suggestion Habile", tier: 2, type: "actif", cout_points: 1, prerequis: ["charme_naturel"], description: "Pousse subtilement une cible à reconsidérer une décision immédiate.", resume: "Inflexion de décision chez la cible", cooldown: 2, x: -80, y: 200 }),
          createNode({ id: "lecture_des_desirs", nom: "Lecture des Désirs", tier: 3, type: "passif", cout_points: 2, prerequis: ["mensonge_convaincant", "suggestion_habile"], description: "Identifie ce qu'une cible désire ou craint le plus après une conversation.", resume: "Détection des désirs/craintes profondes d'1 PNJ", x: -160, y: 300 }),
          createNode({ id: "faux_semblant", nom: "Faux-Semblant", tier: 3, type: "actif", cout_points: 2, prerequis: ["mensonge_convaincant", "suggestion_habile"], description: "Se fait passer pour quelqu'un d'autre de façon crédible sur une courte durée.", resume: "Usurpation d'identité temporaire", cooldown: 2, x: -80, y: 300 }),
          createNode({ id: "emprise_sociale", nom: "Emprise Sociale", tier: 4, type: "passif", cout_points: 2, prerequis: ["lecture_des_desirs", "faux_semblant"], description: "Bonus significatif sur toute cible déjà charmée/manipulée avec succès.", resume: "Avantage permanent sur cibles déjà manipulées", x: -160, y: 400 }),
          createNode({ id: "marionnettiste", nom: "Marionnettiste", tier: 4, type: "actif", cout_points: 2, prerequis: ["lecture_des_desirs", "faux_semblant"], description: "Pousse une cible à accomplir une action mineure en sa faveur.", resume: "Injonction d'action sans éveil de soupçons", cooldown: 4, x: -80, y: 400 }),
          createNode({ id: "le_coeur_dans_la_main", nom: "Le Cœur dans la Main", tier: 5, type: "actif", cout_points: 3, prerequis: ["emprise_sociale", "marionnettiste"], prerequis_logique: "et", description: "Une cible devient temporairement convaincue que le porteur est son plus proche allié.", resume: "Fascination/Allégeance aveugle temporaire", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation (épuisement mental).", contrepartie_type: "severe", extenuation_niveaux: 2, x: -120, y: 500 })
        ]
      },
      {
        id: "negociation_et_intrigue",
        nom: "Négociation & Intrigue",
        noeuds: [
          createNode({ id: "sens_du_marche", nom: "Sens du Marché", tier: 1, type: "passif", cout_points: 1, prerequis: [], description: "Obtient systématiquement de meilleures conditions dans les échanges.", resume: "+20% valeur de troc/négociation", x: 120, y: 100 }),
          createNode({ id: "menace_voilee", nom: "Menace Voilée", tier: 2, type: "actif", cout_points: 1, prerequis: ["sens_du_marche"], description: "Intimide sans jamais formuler une menace explicite.", resume: "Intimidation subtile inattaquable", cooldown: 2, contrepartie: "PNJs clairvoyants se méfient (-1 interactions futures).", contrepartie_type: "legere", x: 80, y: 200 }),
          createNode({ id: "oreille_fine", nom: "Oreille Fine", tier: 2, type: "passif", cout_points: 1, prerequis: ["sens_du_marche"], description: "Capte les rumeurs et informations utiles bien plus vite dans une cité.", resume: "Détection accélérée de rumeurs/secrets de cité", x: 160, y: 200 }),
          createNode({ id: "reseau_d_allies", nom: "Réseau d'Alliés", tier: 3, type: "passif", cout_points: 2, prerequis: ["menace_voilee", "oreille_fine"], description: "Dispose toujours d'un contact utile dans n'importe quelle cité visitée au moins une fois.", resume: "Contact influent garanti dans chaque cité", x: 80, y: 300 }),
          createNode({ id: "double_discours", nom: "Double Discours", tier: 3, type: "actif", cout_points: 2, prerequis: ["menace_voilee", "oreille_fine"], description: "Tient deux discours contradictoires à deux interlocuteurs différents sans se faire prendre.", resume: "Manipulation parallèle de deux factions", cooldown: 2, x: 160, y: 300 }),
          createNode({ id: "maitre_du_jeu", nom: "Maître du Jeu", tier: 4, type: "passif", cout_points: 2, prerequis: ["reseau_d_allies", "double_discours"], description: "Avantage dans toute négociation à plusieurs parties.", resume: "Avantage aux négociations multi-factions", x: 80, y: 400 }),
          createNode({ id: "coup_monte", nom: "Coup Monté", tier: 4, type: "actif", cout_points: 2, prerequis: ["reseau_d_allies", "double_discours"], description: "Orchestre un évènement social qui retourne discrètement une situation en sa faveur.", resume: "Inversion d'évènement politique/social", cooldown: 4, x: 160, y: 400 }),
          createNode({ id: "l_ombre_derriere_le_trone", nom: "L'Ombre derrière le Trône", tier: 5, type: "actif", cout_points: 3, prerequis: ["maitre_du_jeu", "coup_monte"], prerequis_logique: "et", description: "Influence durablement une décision politique/économique majeure d'une cité.", resume: "Coup d'état d'influence politique discret", cooldown: 4, contrepartie: "Inflige 2 niveaux d'Exténuation.", contrepartie_type: "severe", extenuation_niveaux: 2, x: 120, y: 500 })
        ]
      }
    ]
  }
};

const allTrees = [
  pisteur_des_sables,
  ombres_du_bassin,
  furie_des_ruines,
  ordre_du_moteur,
  symbiose_sauvage,
  bourse_de_la_douleur,
  discipline_du_souffle,
  le_serment,
  combat_rapproche,
  arsenal_vivant,
  defense,
  medecine,
  technologie,
  toile_de_velours
];

console.log("=== Writing 14 Skill Trees JSON files ===");
for (const treeObj of allTrees) {
  const filename = `arbre_${treeObj.arbre.id}.json`;
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(treeObj, null, 2), 'utf-8');
  console.log(`Generated: ${filename}`);
}

console.log("=== Generation completed successfully! ===");
