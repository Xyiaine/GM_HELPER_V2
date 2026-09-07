// deckData.js — Données thématiques du Bassin de Sel pour le Multi-Decks MJ

export const INITIAL_HAZARD_CARDS = [
  // ─── CLIMAT & ENVIRONNEMENT ──────────────────────────────
  {
    id: 'hz_sel_storm',
    category: 'climate',
    title: 'Bourrasque de Sel Corrosive',
    cost: 3,
    severity: 'high',
    flavor: 'Des bourrasques de sel blanc cinglent les visages et s\'infiltrent dans les rouages.',
    effect: 'Visibilité réduite à 10 mètres. Tous les tirs à distance ont Désavantage. Chaque round dans la tempête sans protection oculaire impose un jet de CON DD 12 sous peine d\'être Aveuglé pour 1 minute.'
  },
  {
    id: 'hz_rad_fog',
    category: 'climate',
    title: 'Nappe de Brume Radiative',
    cost: 4,
    severity: 'critical',
    flavor: 'Une lueur vert pâle rampe au ras du sol ; le compteur Geiger crépite frénétiquement.',
    effect: 'Tout repos est impossible dans la zone. Les créatures subissent 1d4 dégâts de Radiation par heure passée dans la nappe sauf équipement NBC adapté.'
  },
  {
    id: 'hz_heat_wave',
    category: 'climate',
    title: 'Canicule du Zénith',
    cost: 2,
    severity: 'medium',
    flavor: 'L\'air tremble au-dessus du sel cristallisé. Le thermomètre dépasse les 50°C.',
    effect: 'La consommation d\'Eau potable double immédiatement. Jet de Vigueur/CON DD 11 pour éviter 1 niveau d\'Épuisement en cas d\'effort physique lourd.'
  },
  {
    id: 'hz_sinkhole',
    category: 'climate',
    title: 'Puits de Sel / Sol Mouvant',
    cost: 3,
    severity: 'high',
    flavor: 'La croûte de sel superficielle se dérobe sous le poids, révélant une fosse de boue caustique.',
    effect: 'Le véhicule de tête ou les marcheurs doivent réussir un test de Pilotage ou DEX DD 14 ou s\'enliser (vitesse réduite à 0, 1d6 dégâts d\'acide/sel aux châssis ou membres).'
  },

  // ─── VÉHICULES & CONVOI ──────────────────────────────────
  {
    id: 'hz_tire_blow',
    category: 'mechanical',
    title: 'Pneu Déchiqueté par les Cristaux',
    cost: 2,
    severity: 'medium',
    flavor: 'Une détonation sèche retentit sous le châssis, suivie de gerbes d\'étincelles.',
    effect: 'Le véhicule perd 10 PV et subit un tête-à-queue (test de Pilotage DD 13 pour ne pas verser). Nécessite 15 minutes d\'arrêt et un kit de pièces pour remplacer la roue.'
  },
  {
    id: 'hz_turbo_overheat',
    category: 'mechanical',
    title: 'Surchauffe Moteur / Durite Percée',
    cost: 3,
    severity: 'high',
    flavor: 'Une fumée noire et âcre jaillit du capot. Le radiateur est en ébullition.',
    effect: 'Vitesse du convoi divisée par deux. Si le véhicule continue sans refroidissement, il perd 5 PV de châssis par tranche de 10 km. Réparation : Bricolage DD 13 + 1 bidon de liquide de refroidissement.'
  },
  {
    id: 'hz_fuel_leak',
    category: 'mechanical',
    title: 'Fuite du Réservoir',
    cost: 4,
    severity: 'critical',
    flavor: 'Une odeur persistante d\'hydrocarbure flotte à l\'arrière du convoi.',
    effect: 'Le convoi perd immédiatement 15 unités de Carburant. Risque d\'inflammation au moindre tir ou étincelle à proximité (DD 12 de chance d\'incendie).'
  },
  {
    id: 'hz_cargo_shift',
    category: 'mechanical',
    title: 'Rupture des Sangles de Cargaison',
    cost: 2,
    severity: 'low',
    flavor: 'Les caisses s\'entrechoquent violemment à chaque bosse et menacent de basculer.',
    effect: '1d4 caisses de ressources tombent ou sont endommagées si le copilote ne réussit pas un test d\'Athlétisme/DEX DD 12 pour les rattraper en urgence.'
  },

  // ─── COMBAT & ADVERSITÉ ──────────────────────────────────
  {
    id: 'hz_scav_ambush',
    category: 'combat',
    title: 'Embuscade de Pilleurs du Sel',
    cost: 4,
    severity: 'critical',
    flavor: 'Des motos légères et des buggies hérissés de piques surgissent des dépressions rocheuses.',
    effect: '2 à 4 pillards à moto engagent le convoi par les flancs. Les PJ sont surpris sauf si leur Perception Passive est >= 14.'
  },
  {
    id: 'hz_gun_jam',
    category: 'combat',
    title: 'Enrayement Sablonneux',
    cost: 1,
    severity: 'low',
    flavor: 'Un grincement sec : la poussière de sel a grippé le percuteur au pire moment.',
    effect: 'L\'arme à feu ciblée s\'enraie. Nécessite une Action et un jet de Bricolage DD 10 pour la débloquer avant de pouvoir faire feu à nouveau.'
  },
  {
    id: 'hz_beast_call',
    category: 'combat',
    title: 'Appel de la Meute du Désert',
    cost: 3,
    severity: 'high',
    flavor: 'Un hurlement métallique et strident résonne au loin, bientôt repris par une dizaine d\'échos.',
    effect: 'Des Loups du Bassin ou Criquets-Blindés sont attirés par le bruit ou les odeurs et rejoignent le combat au round suivant comme renforts.'
  },
  {
    id: 'hz_vicious_blow',
    category: 'combat',
    title: 'Coup Vicieux / Tir Précis Ennemi',
    cost: 2,
    severity: 'medium',
    flavor: 'L\'ennemi repère la faille dans l\'armure et frappe sans la moindre pitié.',
    effect: 'La prochaine attaque réussie d\'un PNJ/Monstre inflige un Coup Critique automatique ou applique l\'état Renversé / Étourdi pour 1 round.'
  },

  // ─── REVERS DE FORTUNE & ROLEPLAY ─────────────────────────
  {
    id: 'hz_spoiled_ration',
    category: 'calm',
    title: 'Rations Contaminées par le Sel',
    cost: 2,
    severity: 'medium',
    flavor: 'L\'humidité saline s\'est infiltrée dans les sacs étanches : les galettes sont devenues toxiques.',
    effect: 'Perte de 10 Rations. Ceux qui en ont consommé doivent réussir un jet de CON DD 12 ou être Empoisonnés (Désavantage à tous les jets) pour 8 heures.'
  },
  {
    id: 'hz_suspicious_signal',
    category: 'calm',
    title: 'Signal Radio Furtif & Suspect',
    cost: 1,
    severity: 'low',
    flavor: 'Le poste de bord capte un crépitement rythmé en morse suivi d\'une voix étouffée qui murmure vos positions.',
    effect: 'Une faction ennemie surveille le convoi. Le prochain test de discrétion ou de diplomatie aura un malus de -2.'
  },
  {
    id: 'hz_gear_break',
    category: 'calm',
    title: 'Rupture d\'Équipement Précieux',
    cost: 2,
    severity: 'medium',
    flavor: 'Un craquement sourd : la sangle d\'un sac ou la lentille des jumelles cède sous les chocs répétés.',
    effect: 'Un outil non vital (filtre, jumelles, radio, tente) casse et devient inutilisable tant qu\'il n\'a pas été réparé à l\'étape suivante.'
  }
];

export const INTRIGUE_CARDS = [
  {
    id: 'int_01',
    title: 'Le Marchand aux Lingots Marqués',
    faction: 'Cité des Métaux & Recyclage',
    hook: 'Un ferrailleur propose d\'échanger des cartouches contre un lot de lingots frappés d\'un sceau de Bunker Oméga.',
    secret: 'Ces lingots sont traqués par un commando des Fantômes d\'Acier qui suit leur balise passive.',
    reward: '350 Crédits ou 20 Munitions, mais risque d\'embuscade à 30 km.'
  },
  {
    id: 'int_02',
    title: 'L\'Épidémie Silencieuse de la Cité Médicale',
    faction: 'Cité Médicale',
    hook: 'Une blouse blanche clandestine tente de fuir la cité avec une glacière cryogénique scellée.',
    secret: 'Le vaccin qu\'elle transporte est en réalité la souche mère d\'un champignon pulmonaire propagé volontairement.',
    reward: 'Une dose d\'anti-rad de niveau militaire et un accès secret au dispensaire de niveau 4.'
  },
  {
    id: 'int_03',
    title: 'Sabotage du Pipeline de Raffinage',
    faction: 'Cité du Carburant',
    hook: 'Un groupe de nomades offre du carburant pur en échange d\'explosifs ou d\'un piratage de vanne.',
    secret: 'La guilde des Raffineurs a placé une prime de 500 crédits morts ou vifs sur quiconque approche de la vanne n°7.',
    reward: 'Plein de carburant offert pour 2 véhicules si le sabotage réussit.'
  },
  {
    id: 'int_04',
    title: 'Le Carnet du Messager Égaré',
    faction: 'L\'Ile des Anciens',
    hook: 'Un cadavre desséché est retrouvé ligoté sur le capot d\'un buggy calciné au bord de la piste.',
    secret: 'Son carnet contient les fréquences radio chiffrées des patrouilles d\'élite des Arsenaux pour les 3 prochains jours.',
    reward: 'Permet d\'éviter automatiquement 1 rencontre hostile dans la région.'
  },
  {
    id: 'int_05',
    title: 'Le Pari Clandestin de l\'Arène',
    faction: 'Cité du Divertissement',
    hook: 'Un bookmaker balafré glisse aux PJ une proposition indécente : truquer un duel ou éliminer discrètement un favori.',
    secret: 'Le champion en question est secrètement le fils illégitime du baron de la Cité de l\'Armement.',
    reward: 'Gain colossal de 800 crédits mais hostilité mortelle en cas d\'échec.'
  }
];

// Tables de génération pour PNJ Express 1-Clic
export const NPC_GENERATOR_DATA = {
  firstNames: [
    'Rook', 'Vane', 'Silas', 'Marek', 'Gideon', 'Jarek', 'Balthazar', 'Titus', 'Kellan', 'Oryx',
    'Nesta', 'Sari', 'Mara', 'Kestra', 'Vesper', 'Lyra', 'Jocasta', 'Brina', 'Zoya', 'Tess'
  ],
  lastNames: [
    'Rouille', 'Salin', 'Vapeur', 'Scorie', 'Boulon', 'Cendre', 'Goudron', 'Piston', 'Fouet', 'Morne',
    'du Pipeline', 'de la Cuve', 'Brisé', 'l\'Écorcheur', 'le Muet', 'le Moine', 'd\'Acier', 'du Sillage'
  ],
  roles: [
    'Mécanicien de fortune', 'Barman de tripot', 'Sentinelle nerveuse', 'Pillard repenti',
    'Marchand d\'eau frelatée', 'Chirurgien de rue', 'Courrier du désert', 'Éclaireur solitaire',
    'Cultiste du réacteur', 'Recycleur d\'épaves', 'Garde de citerne', 'Fossoyeur d\'alliages'
  ],
  cities: [
    "Cité Médicale",
    "Cité du Carburant",
    "Cité Industrielle",
    "Cité de l'Eau & Alimentation",
    "Cité du Divertissement",
    "Nuke City",
    "Cité des Métaux & Recyclage",
    "Cité de l'Armement & Défense",
    "L'Ile des Anciens",
    "Bunker Oméga"
  ],
  speechPatterns: [
    'Voix rauque et sifflante, comme si ses poumons étaient incrustés de sel.',
    'Parle très vite en chuchotant, jetant sans cesse des coups d\'œil derrière lui.',
    'Ton autoritaire, hache ses phrases comme des ordres militaires.',
    'Voix douce et traînante, presque soporifique, ponctuée de ricanements.',
    'Bégaye légèrement sur les consonnes dures quand on l\'intimide.',
    'Parle par énigmes courtes et proverbes du désert.'
  ],
  physicalTics: [
    'Frotte constamment une pièce de métal usée entre son pouce et son index.',
    'Se passe la langue sur les lèvres gercées à la fin de chaque phrase.',
    'Cligne convulsivement de l\'œil gauche (tique nerveuse liée aux radiations).',
    'Tapote nerveusement sur la poignée de son arme ou de sa clé à molette.',
    'Vérifie compulsivement la jauge de son filtre respiratoire.',
    'Garde la tête penchée de côté comme s\'il écoutait un bruit lointain.'
  ],
  darkSecrets: [
    'A vendu les coordonnées du convoi de son ancien patron aux pillards pour éponger une dette.',
    'Cache une mutation cutanée évolutive sous ses bandages épais.',
    'Possède une clé magnétique volée ouvrant la réserve privée d\'un chef de guilde.',
    'Est en réalité un agent infiltré de Bunker Oméga chargé d\'observer les mouvements locaux.',
    'A empoisonné l\'eau d\'un rival la semaine dernière et craint que le corps ne soit découvert.',
    'Cherche désespérément à fuir le Bassin avec un enfant recueilli qui n\'est pas le sien.'
  ],
  quirkAppearances: [
    'Porte des lunettes de soudeur teintées fixées avec du fil de cuivre.',
    'Le visage zébré de cicatrices blanches dues à des brûlures d\'acide sulfurique.',
    'Un manteau rapiécé constitué de dizaines de morceaux de bâches de camions.',
    'Une prothèse de bras rudimentaire faite d\'un amortisseur de moto et d\'une pince d\'établi.',
    'Des dents entièrement limées ou remplacées par des boulons dorés.',
    'Une combinaison étanche jaunie couverte de graffitis de mise en garde contre les rads.'
  ]
};

export function generateRandomNpc(cityFilter = null) {
  const fNames = NPC_GENERATOR_DATA.firstNames;
  const lNames = NPC_GENERATOR_DATA.lastNames;
  const roles = NPC_GENERATOR_DATA.roles;
  const cities = NPC_GENERATOR_DATA.cities;
  const speeches = NPC_GENERATOR_DATA.speechPatterns;
  const tics = NPC_GENERATOR_DATA.physicalTics;
  const secrets = NPC_GENERATOR_DATA.darkSecrets;
  const appearances = NPC_GENERATOR_DATA.quirkAppearances;

  const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const selectedCity = cityFilter || randItem(cities);
  const firstName = randItem(fNames);
  const lastName = randItem(lNames);

  return {
    id: 'npc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: `${firstName} ${lastName}`,
    city: selectedCity,
    role: randItem(roles),
    appearance: randItem(appearances),
    speechPattern: randItem(speeches),
    physicalTic: randItem(tics),
    secret: randItem(secrets),
    attitude: 0, // -2: Hostile, -1: Méfiant, 0: Neutre, +1: Favorable, +2: Allié
    isSaved: false
  };
}
