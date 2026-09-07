// saltRaceData.js — Données narratives & mécaniques pour le Tabletop de La Course du Sel

export const SALT_RACE_NPCS = {
  npc_ines: {
    id: 'npc_ines',
    name: 'Ines',
    role: 'Survivante amnésique du Convoi 5 (Nostalgics)',
    city: 'Cité du Divertissement',
    portrait: null,
    attitude: 0, // 0: Neutre / sous le choc
    status: 'amnésique / secourue',
    voiceProfile: {
      speechPattern: 'Voix fébrile et murmurée, trébuche sur les mots puis sort soudain un terme d\'ingénierie ultra-précis.',
      physicalTic: 'Se frotte les tempes à deux mains dès qu\'un bruit fort retentit, comme pour chasser un bourdonnement.',
      signatureBehavior: 'Observe fixement les mains des PJ quand ils manipulent des armes ou des outils.'
    },
    secret: 'Ne sait pas que ce sont les PJ qui ont fait sauter son convoi. Si elle recouvre la mémoire avant eux, la bascule sera dramatique.',
    statblock: { ca: 10, pv: 12, vig: '+0', agi: '+2', int: '+3' }
  },

  npc_doran_roka: {
    id: 'npc_doran_roka',
    name: 'Doran Roka',
    role: 'Chef des Loups de Sel (Convoi 1)',
    city: 'Cité de l\'Armement & Défense',
    portrait: null,
    attitude: -2, // Hostile
    status: 'agressif / rival direct',
    voiceProfile: {
      speechPattern: 'Phrases courtes, voix métallique et sèche, jamais de politesse superflue.',
      physicalTic: 'Fait tourner un anneau d\'acier à son pouce gauche quand il évalue le rapport de force.',
      signatureBehavior: 'Ne menace jamais deux fois : la première fois il prévient, la seconde il ouvre le feu.'
    },
    secret: 'Transporte des précurseurs chimiques pour les Chem\'Artistes. Prêt à saboter le convoi des PJ pour assurer sa place dans la Garde.',
    statblock: { ca: 15, pv: 42, vig: '+3', agi: '+2', int: '+1', arme: 'Fusil de chasse à canon scié (+5 au toucher, 2d8+3)' }
  },

  npc_meya_sel_blanc: {
    id: 'npc_meya_sel_blanc',
    name: 'Meya Sel-Blanc',
    role: 'Matriarche de la Caravane du Sel Blanc (Convoi 3)',
    city: 'Cité de l\'Eau & Alimentation',
    portrait: null,
    attitude: 0, // Neutre / Marchande
    status: 'prudente / ouverte au troc',
    voiceProfile: {
      speechPattern: 'Parle posément et lentement, pose toujours une question en retour avant de répondre à la vôtre.',
      physicalTic: 'Garde une paume appuyée contre la carrosserie de son camion pour sentir les vibrations du moteur et du sol.',
      signatureBehavior: 'Propose toujours un échange ou un troc avant qu\'on ne lui demande quoi que ce soit.'
    },
    secret: 'Sa cargaison de parfums et soies est fragile. Elle craint le ver plus que tout et est prête à partager de l\'eau contre une escorte sur les dunes.',
    statblock: { ca: 12, pv: 28, vig: '+1', agi: '+0', int: '+3', arme: 'Pistolet lourd ouvragé (+4, 1d10+1)' }
  },

  npc_ashka_cendres: {
    id: 'npc_ashka_cendres',
    name: 'Ashka Cendres',
    role: 'Éclaireuse des Cendres Silencieuses (Convoi 4)',
    city: 'Cité Médicale',
    portrait: null,
    attitude: -1, // Méfiante
    status: 'furtive / autonome',
    voiceProfile: {
      speechPattern: 'Chuchote en permanence, même lorsqu\'il n\'y a aucune raison de se cacher.',
      physicalTic: 'Ne regarde jamais son interlocuteur dans les yeux, scrute en permanence l\'horizon et les traces au sol.',
      signatureBehavior: 'Termine chaque échange par une mise en garde sibylline sur un danger qui rôde.'
    },
    secret: 'Connaît les raccourcis radioactifs évitant le Ver de Vitre. Transporte des greffons et organes cryogénisés pour les Sculpteurs.',
    statblock: { ca: 14, pv: 32, vig: '+1', agi: '+4', int: '+2', arme: 'Carabine de précision (+6, 1d12+4)' }
  },

  npc_enfants_du_sel: {
    id: 'npc_enfants_du_sel',
    name: 'Sura & Les Enfants du Sel',
    role: 'Meneuse du clan nomade des sables',
    city: 'Nomades du Bassin',
    portrait: null,
    attitude: 0, // Neutre / Mystique
    status: 'sauveteurs potentiels',
    voiceProfile: {
      speechPattern: 'Voix chantante ponctuée de claquements de langue, langage imagé teinté de légendes sur le Dieu-Sel.',
      physicalTic: 'Saupoudre une pincée de sel blanc purifiée devant ses pas avant de s\'adresser à un étranger.',
      signatureBehavior: 'Ne regarde jamais les armes, observe les yeux et les mains pour juger de la pureté du voyageur.'
    },
    secret: 'Savent que le ver qui chasse les PJ est un nouveau-né attiré par une résonance de la caisse scellée.',
    statblock: { ca: 13, pv: 30, vig: '+2', agi: '+3', int: '+1', arme: 'Épieu d\'os renforcé (+5, 1d8+3)' }
  },

  npc_rook_cendre: {
    id: 'npc_rook_cendre',
    name: 'Capitaine Rook Cendre',
    role: 'Capitaine de la Garde & Recruteur officiel',
    city: 'Cité du Divertissement',
    portrait: null,
    attitude: 0, // Impartial / Observateur
    status: 'juge suprême de la Course',
    voiceProfile: {
      speechPattern: 'Ton posé, glacial et cérémonial d\'un officier qui a tout vu et que rien ne surprend.',
      physicalTic: 'Passe lentement un doigt ganté sur le pommeau poli de son sabre d\'apparat.',
      signatureBehavior: 'Écoute sans interrompre, laisse de longs silences peser avant d\'accorder sa décision.'
    },
    secret: 'Agent secret du Réseau / Bunker Oméga. Évalue qui nommer capitaine pour servir de pion politique dans la Garde.',
    statblock: { ca: 17, pv: 65, vig: '+3', agi: '+2', int: '+3', arme: 'Sabre d\'acier et revolver lourd (+7, 2d8+4)' }
  }
};

// Mapping automatique des nœuds avec leurs PNJ interactifs (supporte les IDs techniques et les codes d'affichage)
export const NODE_NPC_MAP = {
  'node_0e': ['npc_ines'],
  '0.e': ['npc_ines'],
  'node_1e': ['npc_meya_sel_blanc'],
  '1.e': ['npc_meya_sel_blanc'],
  'node_1f_bis': ['npc_ines'],
  '1.f-bis': ['npc_ines'],
  'node_15b': ['npc_enfants_du_sel'],
  '1.5.b': ['npc_enfants_du_sel'],
  'node_2Ad': ['npc_doran_roka'],
  '2A.d': ['npc_doran_roka'],
  'node_2Af': ['npc_enfants_du_sel'],
  '2A.f': ['npc_enfants_du_sel'],
  'node_2Bd': ['npc_ashka_cendres'],
  '2B.d': ['npc_ashka_cendres'],
  'node_3a_bis': ['npc_rook_cendre'],
  '3.a-bis': ['npc_rook_cendre'],
  'node_end_success': ['npc_rook_cendre'],
  'FIN-succes': ['npc_rook_cendre'],
  'node_end_alt': ['npc_rook_cendre'],
  'FIN-alternative': ['npc_rook_cendre']
};

// Les 7 Événements Flottants (tirage d8 lore canonique)
export const FLOATING_EVENTS_D8 = [
  {
    d8: 1,
    id: 'float_1_caisse',
    title: 'La Caisse qui Craque',
    tag: 'Suspense / Découverte',
    pitch: 'Une secousse violente fend un coin de la caisse scellée du convoi.',
    description: 'Un bruit de frottement organique se fait entendre à l\'intérieur. Un examen hâtif révèle des larves vivantes de ver des sables qui s\'agitent à la chaleur.',
    dilemma: 'Ressceller à la hâte (garder la cargaison intacte pour le troc) ou ouvrir (révéler le secret aux PJ et risquer de compromettre la livraison) ?',
    wormImpact: '+0'
  },
  {
    d8: 2,
    id: 'float_2_ines_nom',
    title: 'Le Mot d\'Ines',
    tag: 'Mystère / Révélation',
    pitch: 'Ines trace des schémas fébriles dans la poussière de sel.',
    description: 'Elle murmure une désignation technique de réacteur qui ne correspond à rien de ce que le convoi 5 transportait.',
    dilemma: 'La questionner (test de Persuasion DD 12) pour débloquer un souvenir ou ne pas la brusquer ?',
    wormImpact: '+0'
  },
  {
    d8: 3,
    id: 'float_3_geste',
    title: 'Un Geste Reconnu',
    tag: 'Flashback PJ',
    pitch: 'Deux PJ effectuent machinalement le même geste d\'entraînement.',
    description: 'En nouant un câble ou en épaulant une arme, la précision et la synchronisation trahissent un passé commun que leur mémoire a effacé.',
    dilemma: 'Offre un avantage (+2) au prochain test coordonné entre ces deux PJ.',
    wormImpact: '+0'
  },
  {
    d8: 4,
    id: 'float_4_sursaut',
    title: 'Le Sursaut d\'Avant',
    tag: 'Tension Châssis',
    pitch: 'Une vibration résonne dans l\'acier de la jeep : le sol gondole.',
    description: 'Le compteur Geiger ou le Lichen d\'Orage luit d\'un coup violent. Quelque chose de colossal nage sous les cristaux de sel.',
    dilemma: 'Test de Pilotage DD 13 pour garder la trajectoire sans faire patiner les roues.',
    wormImpact: '+1 Ver'
  },
  {
    d8: 5,
    id: 'float_5_echo',
    title: 'Écho de la Frontière',
    tag: 'Lore Géopolitique',
    pitch: 'Découverte fortuite d\'un débris d\'uniforme étranger.',
    description: 'Une plaque militaire et un tissu portant un blason inconnu qui n\'appartient à aucune des 10 cités-états du Bassin.',
    dilemma: 'Garder l\'indice (servira d\'argument politique ou d\'échange plus tard dans la campagne).',
    wormImpact: '+0'
  },
  {
    d8: 6,
    id: 'float_6_detresse',
    title: 'Le Convoi en Détresse',
    tag: 'Dilemme Moral',
    pitch: 'Une carcasse de buggy civil fumante au bord de la piste avec deux blessés.',
    description: 'Un essieu brisé, des réservoirs d\'eau percés. Ils supplient pour qu\'on les prenne à bord ou qu\'on leur laisse un bidon d\'eau.',
    dilemma: 'S\'arrêter et aider (coûte 1 cran d\'Horloge du Ver et 10 Eau, mais rapporte un kit de pièces) OU tracer sans ralentir (préserve l\'avance mais pèse sur la conscience) ?',
    wormImpact: '+1 Ver si aide'
  },
  {
    d8: 7,
    id: 'float_7_silhouette',
    title: 'Une Silhouette qui n\'attend rien',
    tag: 'Présage / Climax',
    pitch: 'Une ombre solitaire se découpe sur une crête rocheuse à contre-jour.',
    description: 'Un manteau long balayé par le vent salin. Dès qu\'un PJ cligne des yeux ou pointe ses jumelles, la silhouette a disparu sans laisser de trace.',
    dilemma: 'C\'est le Capitaine Rook Cendre qui jauge discrètement les concurrents en amont de l\'arrivée.',
    wormImpact: '+0'
  },
  {
    d8: 8,
    id: 'float_8_calme',
    title: 'Le Silence Blanc',
    tag: 'Respiration',
    pitch: 'Le vent retombe quelques instants. Rien ne bouge sur le plateau salin.',
    description: 'Une accalmie bienvenue qui permet aux moteurs de refroidir et aux esprits de reprendre leur souffle.',
    dilemma: 'Aucun danger immédiat. Les PJ peuvent discuter ou se soigner librement.',
    wormImpact: '+0'
  }
];

// État initial de la Course des 5 convois
export const INITIAL_CONVOYS = [
  { id: 'convoi_1', name: 'Les Loups de Sel', leader: 'Doran Roka', progress: 3, status: 'agressif', icon: '🐺', relation: 'hostile' },
  { id: 'convoi_2', name: 'Convoi 2 (Les PJ)', leader: 'Groupe PJ', progress: 2, status: 'en course', icon: '🚚', isPlayer: true },
  { id: 'convoi_3', name: 'La Caravane du Sel Blanc', leader: 'Meya Sel-Blanc', progress: 2, status: 'prudent', icon: '🐫', relation: 'neutre' },
  { id: 'convoi_4', name: 'Les Cendres Silencieuses', leader: 'Ashka Cendres', progress: 1, status: 'furtif', icon: '🌫️', relation: 'méfiant' },
  { id: 'convoi_5', name: 'Les Nostalgics', leader: '—', progress: 0, status: 'épave détruite', icon: '💥', isDestroyed: true }
];

// Seuils de l'Horloge du Ver (6 cases)
export const WORM_THRESHOLDS = {
  3: {
    title: 'Signe Indirect (3/6)',
    text: 'Au loin, un éclair illumine un convoi rival pourchassé par une vague de sel. Aucune charge directe sur les PJ, mais la créature est bien éveillée.'
  },
  5: {
    title: 'Vibrations Proches (5/6)',
    text: 'Les essieux vibrent furieusement. Une gigantesque crête d\'écailles translucides fend les cristaux de sel à moins de 50 mètres sur le flanc.'
  },
  6: {
    title: 'ASSAUT DIRECT (6/6)',
    text: 'Le Ver des Sables surgit du sol gueule béante dans une gerbe d\'acide et de sel ! Le combat ou la manœuvre d\'évitement critique s\'engage immédiatement.'
  }
};

// ============================================================
// ÉPREUVES IMPOSÉES & JETS FORCÉS (Par Nœud de Quête)
// ============================================================
export const NODE_SPECIAL_CHALLENGES = {
  // Nœud 0.a : Réveil en mouvement
  '0.a': [
    {
      id: 'challenge_0a_con',
      title: 'Dissipation Neurochimique',
      stat: 'Constitution',
      type: 'progressive',
      icon: '🧪',
      description: 'Le nuage de vapeurs toxiques de l\'explosion s\'évacue peu à peu des poumons. Le test de Constitution devient plus facile tour après tour. Les souvenirs restent effacés, mais la netteté des sens et la motricité reviennent.',
      turns: [
        {
          turn: 1,
          dc: 16,
          label: 'Tour 1 (Immédiat)',
          badge: 'Très Difficile — DD 16',
          consequenceFailure: 'Effet maximal : vision dédoublée en tunnel, violente nausée, acouphènes assourdissants. Désavantage sur tout jet physique ce tour.',
          consequenceSuccess: 'Vos yeux cessent de larmoyer. Vous fixez la piste sans vomir et reprenez la maîtrise de vos mains.'
        },
        {
          turn: 2,
          dc: 13,
          label: 'Tour 2 (Quelques secondes)',
          badge: 'Moyen — DD 13',
          consequenceFailure: 'Membres encore lourds comme du plomb, gorge brûlante, vertige persistant.',
          consequenceSuccess: 'L\'air salin chasse l\'hébétude. Les commandes du véhicule et la visée répondent sans latence.'
        },
        {
          turn: 3,
          dc: 10,
          label: 'Tour 3 (Stabilisation)',
          badge: 'Facile — DD 10',
          consequenceFailure: 'Violente céphalée résiduelle aux tempes, mais perception fonctionnelle.',
          consequenceSuccess: 'Sensations tactiles et visuelles 100% nettes ! La mémoire du passé reste noire, mais le présent est clair.'
        }
      ]
    },
    {
      id: 'challenge_0a_med',
      title: 'Diagnostic Médical de la Toxine',
      stat: 'Médecine ou Intelligence',
      type: 'single',
      dc: 15,
      badge: 'Difficile — DD 15',
      icon: '🩺',
      description: 'Un PJ analyse le goût persistant sur sa langue, l\'odeur piquante ou la dilatation pupillaire de ses camarades.',
      consequenceFailure: 'Le PJ constate une violente irritation des muqueuses sans pouvoir nommer la substance.',
      readAloudPrompt: 'Révélation clinique au joueur ayant réussi :',
      successSecret: '« Cette odeur piquante et ce goût métallique persistant au fond de la gorge sont la signature clinique d\'une neurotoxine volatile amnésique militaire, dérivée d\'un précurseur chimique instable. Elle détruit temporairement les ponts de mémoire épisodique récente tout en préservant intacts les réflexes musculaires et le conditionnement de combat ! Ce n\'était pas un simple accident mécanique. »'
    }
  ],

  // Nœud 0.b : La détente encore pressée
  '0.b': [
    {
      id: 'challenge_0b_stress',
      title: 'Lâcher la Détente sous le Choc',
      stat: 'Sagesse ou Vigueur',
      type: 'single',
      dc: 12,
      badge: 'Moyen — DD 12',
      icon: '⚔️',
      description: 'L\'index du tireur reste contracté sur la mitrailleuse par spasme nerveux.',
      consequenceFailure: 'Une rafale convulsive de trop part dans le vide : canon en surchauffe et culasse bloquée pendant 1 tour.',
      consequenceSuccess: 'Le PJ relâche la détente à temps, index encore fumant, le mécanisme refroidit sous le vent.'
    }
  ],

  // Nœud 0.d : Le sol qui tremble
  '0.d': [
    {
      id: 'challenge_0d_seisme',
      title: 'Détecter la Vibration Souterraine',
      stat: 'Perception ou Vigilance',
      type: 'single',
      dc: 13,
      badge: 'Moyen — DD 13',
      icon: '👁️',
      description: 'Le sol tremble d\'une pulsation rythmée anormale sous les essieux, remontant par le plancher.',
      consequenceFailure: 'Surpris par le soulèvement de la croûte de sel : embardée violente, +1 case à l\'Horloge du Ver et passagers déséquilibrés.',
      consequenceSuccess: 'Avertissement crié à temps : le pilote stabilise le convoi et gagne un Avantage sur la fuite.'
    }
  ],

  // Nœud 0.e : Fouille de l\'épave
  '0.e': [
    {
      id: 'challenge_0e_fouille',
      title: 'Fouille Chronométrée sous Menace',
      stat: 'Investigation ou Dextérité',
      type: 'single',
      dc: 12,
      badge: 'Moyen — DD 12',
      icon: '🔍',
      description: 'Fouiller les décombres incandescents avant que les vibrations n\'attirent le prédateur du désert.',
      consequenceFailure: 'Fouille trop lente (+1 case Horloge du Ver) et mains brûlées (1d4 dégâts).',
      consequenceSuccess: 'Ines est dégagée saine et sauve sous l\'essieu et une caisse de pièces intacte est récupérée !'
    }
  ],

  // Nœud 1.route : Choix stratégique
  '1.route': [
    {
      id: 'challenge_1route_choix',
      title: 'Lecture de Terrain & Évaluation des Pistes',
      stat: 'Survie ou Cartographie',
      type: 'single',
      dc: 13,
      badge: 'Moyen — DD 13',
      icon: '🧭',
      description: 'Identifier les zones de sel mouvant et les ravines abritées pour comparer Route Rapide et Route Longue.',
      consequenceFailure: 'Le convoi hésite et perd son avance sur la Caravane de Meya Sel-Blanc.',
      consequenceSuccess: 'Le groupe repère les pièges de terrain et sait exactement à quoi s\'attendre sur chaque itinéraire.'
    }
  ],

  // Nœud 1.a : Cimetière de tôle
  '1.a': [
    {
      id: 'challenge_1a_slalom',
      title: 'Slalom dans le Cimetière de Tôle',
      stat: 'Dextérité (Pilotage)',
      type: 'single',
      dc: 14,
      badge: 'Difficile — DD 14',
      generative: true,
      icon: '🚗',
      description: 'Poutrelles acérées et carcasses dissimulées sous une fine pellicule de sel soufflé.',
      consequenceFailure: '⭐ ÉCHEC GÉNÉRATIF : Pneu tailladé et carrosserie froissée (-10 Carburant), MAIS le choc déloge un conteneur militaire intact contenant 2 kits de réparation !',
      consequenceSuccess: 'Trajectoire fluide au ras des épaves sans perdre un seul kilomètre-heure.'
    }
  ],

  // Nœud 1.c : Tempête radioactive
  '1.c': [
    {
      id: 'challenge_1c_tempete',
      title: 'Filtres & Tempête de Sel Ionisé',
      stat: 'Constitution ou Ingénierie',
      type: 'single',
      dc: 14,
      badge: 'Difficile — DD 14',
      icon: '⚡',
      description: 'Poussières ionisées crépitantes qui s\'infiltrent par les ouïes d\'aération du véhicule.',
      consequenceFailure: 'Filtres encrassés : quintes de toux suffocantes (Désavantage à la perception) et le moteur surchauffe.',
      consequenceSuccess: 'Calfeutrage d\'urgence efficace : le filtre tient bon et l\'habitacle reste préservé.'
    }
  ],

  // Nœud 1.5.a : Crevasse / La Suspension
  '1.5.a': [
    {
      id: 'challenge_15a_gouffre',
      title: 'Freinage d\'Urgence au Bord du Gouffre',
      stat: 'Dextérité (Pilotage) ou Réflexes',
      type: 'single',
      dc: 14,
      badge: 'Difficile — DD 14',
      icon: '⚠️',
      description: 'Une faille abyssale de 80 mètres de fond fend brutalement la plaine de sel d\'un horizon à l\'autre !',
      consequenceFailure: 'Les roues avant basculent dans le vide ! Le convoi est suspendu au-dessus de l\'abîme (déclenche le compte à rebours de la Suspension).',
      consequenceSuccess: 'Dérapage contrôlé spectaculaire, le pare-chocs s\'arrête à 30 centimètres du précipice.'
    }
  ],

  // Nœud 1.5.c : Tempête statique
  '1.5.c': [
    {
      id: 'challenge_15c_flashback',
      title: 'Flashback Involontaire sous l\'Éclair',
      stat: 'Sagesse ou Volonté',
      type: 'single',
      dc: 14,
      badge: 'Difficile — DD 14',
      icon: '🧠',
      description: 'Un arc ionique aveuglant frappe l\'antenne du véhicule et force une décharge dans la mémoire du PJ.',
      consequenceFailure: 'Le PJ est assailli par une vision de flammes et de panique : état Étourdi pendant 1 tour.',
      consequenceSuccess: 'Le PJ canalise le souvenir : il recouvre son vrai nom, sa cité d\'origine ou un élément de sa mission secrète !'
    }
  ],

  // Nœud 2A.d : Attaque des Loups de Sel
  '2A.d': [
    {
      id: 'challenge_2ad_doran',
      title: 'Tirs Croisés des Loups de Sel',
      stat: 'Perception ou Pilotage Tactique',
      type: 'single',
      dc: 15,
      badge: 'Difficile — DD 15',
      generative: true,
      icon: '🐺',
      description: 'Les buggys hérissés de pointes de Doran Roka cherchent à couper la trajectoire du convoi.',
      consequenceFailure: '⭐ ÉCHEC GÉNÉRATIF : Flanc perforé par un projectile lourd, MAIS le ricochet dévie sur le buggy de flanc de Doran qui part en tonneau et largue une caisse de précurseurs chimiques !',
      consequenceSuccess: 'Manœuvre d\'esquive millimétrée qui force les Loups de Sel à rompre l\'encerclement.'
    }
  ],

  // Nœud 2B.b : Le Verre Noir
  '2B.b': [
    {
      id: 'challenge_2bb_verre',
      title: 'Adhérence sur Sel Vitrifié',
      stat: 'Dextérité (Pilotage)',
      type: 'single',
      dc: 13,
      badge: 'Moyen — DD 13',
      icon: '💎',
      description: 'Le sol devient une dalle noire vitrifiée, tranchante et sans aucune rugosité.',
      consequenceFailure: 'Tête-à-queue violent : les pneus fument sur le verre, perte de vitesse et 1d6 dégâts de carrosserie.',
      consequenceSuccess: 'Glisse maîtrisée en douceur, le véhicule conserve toute sa vitesse sans dériver.'
    }
  ],

  // Nœud 3.c : L'Obstacle Final
  '3.c': [
    {
      id: 'challenge_3c_barrage',
      title: 'Percée du Barrage Final',
      stat: 'Pilotage ou Force (Bélier)',
      type: 'single',
      dc: 15,
      badge: 'Très Difficile — DD 15',
      generative: true,
      icon: '🏁',
      description: 'Le goulet d\'accès aux portes de la Cité du Divertissement est encombré de herses et de carcasses fumantes.',
      consequenceFailure: '⭐ ÉCHEC GÉNÉRATIF : Impact brutal, radiateur crevé, MAIS le convoi franchit l\'obstacle en glissade sur les jantes et entre dans la zone finale !',
      consequenceSuccess: 'Percée héroïque à pleine vitesse sous le regard médusé du Capitaine Rook Cendre !'
    }
  ]
};

// Aliases pour support direct via node_id
NODE_SPECIAL_CHALLENGES['node_0a'] = NODE_SPECIAL_CHALLENGES['0.a'];
NODE_SPECIAL_CHALLENGES['node_0b'] = NODE_SPECIAL_CHALLENGES['0.b'];
NODE_SPECIAL_CHALLENGES['node_0d'] = NODE_SPECIAL_CHALLENGES['0.d'];
NODE_SPECIAL_CHALLENGES['node_0e'] = NODE_SPECIAL_CHALLENGES['0.e'];
NODE_SPECIAL_CHALLENGES['node_1_route_choice'] = NODE_SPECIAL_CHALLENGES['1.route'];
NODE_SPECIAL_CHALLENGES['node_1a'] = NODE_SPECIAL_CHALLENGES['1.a'];
NODE_SPECIAL_CHALLENGES['node_1c'] = NODE_SPECIAL_CHALLENGES['1.c'];
NODE_SPECIAL_CHALLENGES['node_15a'] = NODE_SPECIAL_CHALLENGES['1.5.a'];
NODE_SPECIAL_CHALLENGES['node_15c'] = NODE_SPECIAL_CHALLENGES['1.5.c'];
NODE_SPECIAL_CHALLENGES['node_2Ad'] = NODE_SPECIAL_CHALLENGES['2A.d'];
NODE_SPECIAL_CHALLENGES['node_2Bb'] = NODE_SPECIAL_CHALLENGES['2B.b'];
NODE_SPECIAL_CHALLENGES['node_3c'] = NODE_SPECIAL_CHALLENGES['3.c'];

// ============================================================
// DONNÉES NARRATIVES CANONIQUES (Amorces & Actions Suggérées)
// ============================================================
export const CANONICAL_NODE_DATA = {
  '0.a': {
    hook: 'Le corps agit avant l\'esprit : les mains sont déjà crispées sur le volant qui tressaute, les pieds calés contre le plancher de tôle qui tangue follement, alors que votre mémoire reste un gouffre noir.',
    actions: [
      { text: 'Reprendre fermement le volant pour stabiliser la course dans l\'ornière', category: 'pilotage', icon: '🚗' },
      { text: 'Tâter son propre corps et son torse à la recherche d\'une blessure par balle', category: 'soin', icon: '🩺' },
      { text: 'Renifler la vapeur âcre et analyser le liquide collant sur le tableau de bord', category: 'investigation', icon: '🔍' },
      { text: 'Hurler à son copilote : « Qui êtes-vous et pourquoi on fonce à cette vitesse ?! »', category: 'dialogue', icon: '💬' }
    ]
  },
  '0.b': {
    hook: 'Le canon crache une gerbe d\'étincelles dans le vide. Le silence gêné entre vous commence à peser plus lourd que le hurlement du moteur.',
    actions: [
      { text: 'Lâcher la mitrailleuse de force avant que le canon n\'explose de surchauffe', category: 'combat', icon: '⚔️' },
      { text: 'Interpeller le reste de la cabine : « C\'est nous qui venons d\'ouvrir le feu ?! »', category: 'dialogue', icon: '💬' },
      { text: 'Scruter la piste arrière à travers le rétro pour identifier ce qui fume', category: 'investigation', icon: '🔍' }
    ]
  },
  '0.c': {
    hook: 'La colonne de fumée noire s\'amenuise à l\'horizon. Quelque chose dans ce silence donne envie de faire demi-tour plutôt que de fuir sans comprendre.',
    actions: [
      { text: 'Pointer des jumelles sur l\'épave fumante pour chercher des survivants', category: 'investigation', icon: '🔍' },
      { text: 'Écraser l\'accélérateur pour mettre le maximum de distance entre elle et nous', category: 'pilotage', icon: '🚗' },
      { text: 'Fouiller la boîte à gants et le carnet de route pour retrouver nos ordres', category: 'investigation', icon: '📖' }
    ]
  },
  '0.d': {
    hook: 'Un crépitement de cristaux de sel remonte par le plancher, suivi d\'une onde de choc sourde et rythmée, filant en plein contre le sens du vent.',
    actions: [
      { text: 'Accélérer brutalement sans attendre pour distancer l\'onde de choc', category: 'pilotage', icon: '🚗' },
      { text: 'Passer la tête par la portière pour sonder la dune qui ondule derrière', category: 'investigation', icon: '🔍' },
      { text: 'Hurler un avertissement au reste de l\'équipage pour qu\'ils s\'accrochent', category: 'dialogue', icon: '📢' }
    ]
  },
  '0.e': {
    hook: 'L\'épave du Convoi 5 fume encore sous le soleil de midi. L\'odeur de plastique fondu et d\'huile brûlée pique les yeux. Chaque minute passée ici se paie cher.',
    actions: [
      { text: 'Dégager la silhouette inanimée coincée sous l\'essieu arrière (Ines)', category: 'soin', icon: '🩺' },
      { text: 'Fouiller la cabine déchiquetée en quête de douilles ou du journal de bord', category: 'investigation', icon: '🔍' },
      { text: 'Récupérer des bidons de liquide de refroidissement et des munitions intactes', category: 'equipement', icon: '📦' },
      { text: 'Monter la garde sur le toit du camion l\'arme épaulée', category: 'combat', icon: '⚔️' }
    ]
  },
  '1.route': {
    hook: 'La carte tracée sur le tableau de bord indique deux sentiers à travers le sel craquelé : la Route Rapide et exposée, ou la Route Longue et encaissée. Le choix vous appartient.',
    actions: [
      { text: 'Choisir la Route Rapide (plein gaz à travers le cimetière de tôle)', category: 'pilotage', icon: '⚡' },
      { text: 'Choisir la Route Longue (contourner par les ravines pour éviter les contacts)', category: 'survie', icon: '🛡️' },
      { text: 'Débattre à la radio avec les membres de l\'équipage sur le compromis vitesse/sécurité', category: 'dialogue', icon: '💬' }
    ]
  },
  '1.a': {
    hook: 'Des carcasses de camions colossaux et de blindés rouillés émergent du brouillard salin comme les squelettes d\'une armée d\'acier oubliée.',
    actions: [
      { text: 'Faufiler le convoi entre deux parois d\'acier sans heurter les arêtes vives', category: 'pilotage', icon: '🚗' },
      { text: 'Ralentir pour fouiller une tourelle abandonnée à la recherche de munitions', category: 'investigation', icon: '🔍' },
      { text: 'Scruter les toits de tôle pour repérer d\'éventuels pillards en embuscade', category: 'combat', icon: '👁️' }
    ]
  },
  '1.5.a': {
    hook: 'Le plateau de sel se brise net sur le néant. Une faille titanesque de 80 mètres de profondeur ouvre ses mâchoires de calcaire blanc sous vos roues.',
    actions: [
      { text: 'Piler de toutes ses forces sur le frein et tirer le levier d\'urgence', category: 'pilotage', icon: '⚠️' },
      { text: 'Chercher un pont naturel d\'arche rocheuse à la jumelle le long du précipice', category: 'investigation', icon: '🔍' },
      { text: 'Tendre des câbles de treuil pour arrimer le châssis au roc solide', category: 'survie', icon: '🪢' }
    ]
  }
};

// Aliases pour codes avec tirets/underscores
CANONICAL_NODE_DATA['node_0a'] = CANONICAL_NODE_DATA['0.a'];
CANONICAL_NODE_DATA['node_0b'] = CANONICAL_NODE_DATA['0.b'];
CANONICAL_NODE_DATA['node_0c'] = CANONICAL_NODE_DATA['0.c'];
CANONICAL_NODE_DATA['node_0d'] = CANONICAL_NODE_DATA['0.d'];
CANONICAL_NODE_DATA['node_0e'] = CANONICAL_NODE_DATA['0.e'];
CANONICAL_NODE_DATA['node_1_route_choice'] = CANONICAL_NODE_DATA['1.route'];
CANONICAL_NODE_DATA['node_1a'] = CANONICAL_NODE_DATA['1.a'];
CANONICAL_NODE_DATA['node_15a'] = CANONICAL_NODE_DATA['1.5.a'];

// Helper : Récupérer les épreuves spéciales d'un nœud
export function getSpecialChallenges(node) {
  if (!node) return [];
  const code = node.displayCode || node.id;
  return NODE_SPECIAL_CHALLENGES[code] || NODE_SPECIAL_CHALLENGES[node.id] || [];
}

// Helper : Catégoriser et enrichir une action textuelle
export function categorizeAction(text) {
  const lower = (text || '').toLowerCase();
  if (lower.includes('volant') || lower.includes('accélér') || lower.includes('frein') || lower.includes('pilot') || lower.includes('traject') || lower.includes('slalom')) {
    return { category: 'Pilotage & Véhicule', icon: '🚗', color: '#3b82f6' };
  }
  if (lower.includes('bless') || lower.includes('corps') || lower.includes('soin') || lower.includes('toxin') || lower.includes('drogue') || lower.includes('ines')) {
    return { category: 'Santé & Secours', icon: '🩺', color: '#10b981' };
  }
  if (lower.includes('tir') || lower.includes('arm') || lower.includes('canon') || lower.includes('combat') || lower.includes('mitraill') || lower.includes('détente')) {
    return { category: 'Combat & Armement', icon: '⚔️', color: '#ef4444' };
  }
  if (lower.includes('fouille') || lower.includes('scrut') || lower.includes('jumell') || lower.includes('examin') || lower.includes('carnet') || lower.includes('vibrat')) {
    return { category: 'Investigation & Piste', icon: '🔍', color: '#f59e0b' };
  }
  if (lower.includes('hurl') || lower.includes('parl') || lower.includes('cri') || lower.includes('interpell') || lower.includes('débatt') || lower.includes('radio')) {
    return { category: 'Roleplay & Parole', icon: '💬', color: '#8b5cf6' };
  }
  return { category: 'Action PJ', icon: '⚡', color: '#ec4899' };
}

// Helper : Extraire amorce et actions (depuis données canoniques ou parsing mjDescription)
export function getNarrativeElements(node) {
  if (!node) return { hook: '', actions: [], cleanDesc: '' };

  const code = node.displayCode || node.id;
  const canonical = CANONICAL_NODE_DATA[code] || CANONICAL_NODE_DATA[node.id];

  let hook = canonical?.hook || node.actionsNarrativeHook || '';
  let actions = canonical?.actions ? [...canonical.actions] : [];
  let cleanDesc = node.mjDescription || '';

  // Si pas encore d'amorce, chercher dans mjDescription
  if (!hook && cleanDesc.includes('**Amorce Narrative**')) {
    const match = cleanDesc.match(/\*\*Amorce Narrative\*\*\s*:\s*([^\n\r*]+)/i);
    if (match) hook = match[1].trim();
  }

  // Si pas encore d'actions, chercher dans mjDescription
  if (actions.length === 0 && cleanDesc.includes('**Actions Suggérées**')) {
    const parts = cleanDesc.split('**Actions Suggérées**');
    if (parts[1]) {
      const lines = parts[1].split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const rawText = trimmed.replace(/^[-*]\s*/, '').trim();
          if (rawText && !rawText.startsWith('**')) {
            const cat = categorizeAction(rawText);
            actions.push({ text: rawText, ...cat });
          }
        } else if (trimmed.startsWith('**') && actions.length > 0) {
          break;
        }
      }
    }
  }

  // Si des actions existent sous forme de string brut
  if (actions.length > 0 && typeof actions[0] === 'string') {
    actions = actions.map(act => {
      const cat = categorizeAction(act);
      return { text: act, ...cat };
    });
  }

  // Nettoyage de la description MJ des blocs extraits pour éviter les doublons
  cleanDesc = cleanDesc
    .replace(/\*\*Amorce Narrative\*\*\s*:\s*[^\n\r*]+/gi, '')
    .replace(/\*\*Actions Suggérées\*\*\s*:[\s\S]*?(?=(\n\*\*[A-Z]|$))/gi, '')
    .trim();

  return { hook, actions, cleanDesc };
}

