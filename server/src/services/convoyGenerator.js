// GM Helper — Convoy Procedural Generation Engine
// Generates events based on distance, difficulty, and biome influence

/**
 * City biome data — maps city keywords to thematic event pools.
 * The generator picks from the relevant pools when the route passes near a city.
 */
const BIOME_EVENTS = {
  'Oméga': {
    climate: [
      { title: 'Brouillard Artificiel', description: `**Signes avant-coureurs (Jet de Perception / Technologie) :**
*Les compteurs Geiger et les radios crépitent sans raison apparente. Une fine brume au ras du sol commence à s'épaissir à une vitesse anormale pour la région.*
> En cas de réussite, l'équipage a le temps d'activer les phares anti-brouillard ou les sonars avant d'être totalement aveuglé.

**L'Événement :**
*Un épais brouillard synthétique, dense comme du coton, s'échappe des anciens systèmes de défense de Bunker Oméga. Il engloutit le convoi, réduisant la visibilité à zéro. L'air a un goût métallique et les phares ne percent pas au-delà du capot.*

**Informations pour le MJ & Joueurs :**
- Ralentissement drastique : forte consommation de Carburant.
- Risque de collision entre les véhicules du convoi (PV).
- Les systèmes électroniques simples tombent en panne.
- Impossible de se repérer à l'œil nu, requiert un jet de navigation difficile.`, severity: 'medium' },
      { title: 'Onde EMP Résiduelle', description: `**Signes avant-coureurs (Jet de Perception / Sciences) :**
*Un bourdonnement grave fait vibrer les plombages dentaires et les carcasses des camions. L'air semble chargé d'électricité statique.*
> En cas de réussite, les conducteurs peuvent couper les moteurs et les systèmes vitaux pour minimiser les dégâts des surtensions.

**L'Événement :**
*Un flash silencieux mais aveuglant déchire le ciel nuageux. Immédiatement, tous les tableaux de bord s'éteignent. Les moteurs toussent puis meurent simultanément. Un silence pesant s'abat sur le désert de sel.*

**Informations pour le MJ & Joueurs :**
- Immobilisation immédiate de toute la flotte.
- L'électronique non-blindée est frite, causant des dégâts majeurs (PV) et nécessitant des réparations.
- Le convoi est une cible immobile dans le noir total (si l'événement a lieu de nuit).
- Temps de réparation extrêmement long.`, severity: 'high' },
    ],
    encounter: [
      { title: 'Drone de Surveillance', description: `**Signes avant-coureurs (Jet de Perception / Vigilance) :**
*Un léger sifflement aigu, semblable à un insecte géant, se fait entendre au-dessus du bruit des moteurs. Un point noir tourne en cercles parfaits dans le ciel.*
> En cas de réussite, l'escouade peut tenter de se camoufler sous des bâches thermiques avant d'être repérée.

**L'Événement :**
*Un drone autonome lourd de Bunker Oméga, portant les stigmates des guerres passées, s'abaisse à quelques mètres au-dessus du convoi. Son œil rouge balaye chaque véhicule d'un faisceau laser inquisiteur. Ses intentions sont inconnues.*

**Informations pour le MJ & Joueurs :**
- Le drone ne tire pas en premier, mais enregistre tout.
- Le détruire coûte des Munitions mais rapporte des pièces (Ressources).
- S'il n'est pas détruit, il y a 50% de chances qu'il alerte une patrouille d'androïdes (ajoute un événement de combat à la roadmap).
- Les tirs manqués risquent de l'alerter et de déclencher ses armes de défense.`, severity: 'low' },
      { title: 'Agent Fantôme', description: `**Signes avant-coureurs (Jet de Perception / Psychologie) :**
*Parmi un petit groupe de marchands nomades croisés sur la route, l'un d'eux semble trop propre, ses mouvements trop calculés, et son regard trop perçant.*
> En cas de réussite, l'équipage le repère avant qu'il n'approche les cargaisons sensibles ou ne sabote un véhicule.

**L'Événement :**
*Sous couvert de troc banal, un agent infiltré d'Oméga s'est glissé près du convoi. Ses véritables objectifs sont cachés, mais la rumeur dit qu'Oméga paie cher pour récupérer des technologies ou éliminer discrètement des cibles.*

**Informations pour le MJ & Joueurs :**
- Risque de vol d'une ressource précieuse (Médicaments, Munitions).
- Peut offrir un marché très lucratif s'il s'intéresse à une de vos cargaisons.
- Très dangereux en combat rapproché si les choses tournent mal (PV).
- Les autres marchands fuiront dès le premier coup de feu.`, severity: 'medium' },
      { title: 'Embuscade de Synthétiques', description: `**Signes avant-coureurs (Jet de Perception / Tactique) :**
*Des monticules de sel sur la route semblent avoir été disposés de façon trop symétrique pour être naturels.*
> En cas de réussite, les chauffeurs évitent le champ de mines IEM qui initie l'embuscade.

**L'Événement :**
*Le sol de sel éclate. Des androïdes de combat défectueux, à moitié rouillés mais toujours mortels, s'extirpent de leur enfouissement. Leurs processeurs endommagés ne reconnaissent plus aucun code de reddition. Leurs fusils à plasma crachent la mort.*

**Informations pour le MJ & Joueurs :**
- Attaque redoutable infligeant de lourds dégâts (PV) à la flotte.
- Consommation extrême de Munitions et Médicaments pour survivre.
- Les synthétiques ne ressentent ni peur ni douleur : impossible de les intimider.
- Butin potentiel : des batteries à haute capacité (Carburant) en cas de réussite totale.`, severity: 'critical' },
    ],
  },
  'Industrielle': {
    climate: [
      { title: 'Pluie de Cendres Industrielles', description: `**Signes avant-coureurs (Jet de Perception / Météo) :**
*Le ciel devient noir en plein jour. Le vent chaud apporte une forte odeur de charbon brûlé et de métal fondu.*
> En cas de réussite, on peut protéger les arrivées d'air des moteurs et bâcher les marchandises.

**L'Événement :**
*Des retombées de cendres toxiques et brûlantes provenant des gigantesques fonderies de la Cité Industrielle s'abattent sur le convoi. Elles obscurcissent le ciel, recouvrent les pare-brises d'une pâte noirâtre et corrodent le métal.*

**Informations pour le MJ & Joueurs :**
- Ralentissement majeur et visibilité réduite (consommation Carburant).
- Usure des moteurs et de la peinture des véhicules (-PV).
- Si l'équipage sort sans protection lourde, ils risquent des brûlures graves (Médicaments).
- Les panneaux solaires (s'il y en a) deviennent inutiles.`, severity: 'medium' },
      { title: 'Nappe de Gaz Chimique', description: `**Signes avant-coureurs (Jet de Perception / Chimie) :**
*Les oiseaux morts parsèment le sol. Une brume jaunâtre s'écoule lentement d'une usine en ruines toute proche, épousant le relief du terrain.*
> En cas de réussite, le convoi peut faire un large détour ou s'équiper de masques à oxygène à temps.

**L'Événement :**
*Un nuage de gaz toxique hyper dense stagne dans une cuvette naturelle que la route traverse. L'air devient irrespirable, rongeant les poumons et brûlant les yeux. La visibilité est trouble.*

**Informations pour le MJ & Joueurs :**
- Dégâts directs à l'équipage, nécessitant beaucoup de Médicaments.
- Possibilité de faire un détour (coût élevé en Carburant mais économise les Médicaments).
- Le gaz est hautement inflammable : l'utilisation d'armes à feu ou de moteurs surchauffés peut déclencher une explosion (-PV).`, severity: 'high' },
    ],
    encounter: [
      { title: 'Convoi de Ferraille', description: `**Signes avant-coureurs (Jet de Perception / Ouïe) :**
*Un grincement de métal atroce, comme si on traînait un paquebot sur du ciment, s'entend à des kilomètres.*
> En cas de réussite, le convoi ralentit à temps pour éviter la collision dans un virage.

**L'Événement :**
*Un groupe pitoyable de récupérateurs faméliques pousse un énorme chariot fait de bric et de broc, chargé de tonnes de ferraille. Ils bloquent tout le passage dans un défilé rocheux.*

**Informations pour le MJ & Joueurs :**
- Impossible de passer en force sans écraser des innocents.
- On peut négocier le passage avec de l'Eau ou de la Nourriture.
- Les ferrailleurs ont des pièces de rechange (possibilité de troc).
- Perte de temps si on décide de dégager le chemin à la main.`, severity: 'low' },
      { title: 'Pillards Mécanisés', description: `**Signes avant-coureurs (Jet de Perception / Tactique) :**
*Le bruit des moteurs de pillards habituels est ici remplacé par des bruits de pas lourds et hydrauliques résonnant sur le sel.*
> En cas de réussite, l'équipage comprend qu'il a affaire à du blindage lourd et peut préparer des armes anti-véhicules.

**L'Événement :**
*Des pillards d'élite, équipés d'exosquelettes de manutention modifiés pour le combat et volés à la Cité Industrielle, tendent une embuscade redoutable. Ils peuvent littéralement retourner un pick-up à mains nues.*

**Informations pour le MJ & Joueurs :**
- Consommation extrême de Munitions (ils sont lourdement blindés).
- Dégâts potentiellement massifs (-PV) si un exosquelette atteint un véhicule.
- Ils cherchent principalement de la Nourriture ou des pièces, on peut tenter d'acheter sa vie.
- Victoire totale permet de récupérer de l'équipement lourd.`, severity: 'high' },
      { title: 'Ouvriers en Fuite', description: `**Signes avant-coureurs (Jet de Perception / Empathie) :**
*Un groupe de silhouettes avance péniblement dans le désert, sans véhicules. Ils ont encore les menottes brisées à leurs poignets.*
> En cas de réussite, les joueurs remarquent qu'ils sont traqués par des drones au loin.

**L'Événement :**
*Une dizaine d'ouvriers esclaves évadés des mines de la Cité Industrielle barrent la route au convoi. Ils sont assoiffés, désespérés, et supplient qu'on les emmène loin de leurs bourreaux.*

**Informations pour le MJ & Joueurs :**
- Les aider coûte énormément de Nourriture et d'Eau.
- Ils prennent beaucoup de place, surchargeant potentiellement les véhicules (risques mécaniques).
- Si vous les emmenez, des chasseurs de primes vous traqueront sûrement (ajoute un événement de combat plus tard).
- Ils connaissent peut-être des raccourcis secrets ou la configuration de la Cité.`, severity: 'medium' },
    ],
  },
  'Médicale': {
    climate: [
      { title: 'Zone de Quarantaine', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*De vieilles barrières jaunes et noires barrent la route. Des monceaux de combinaisons Hazmat calcinées jonchent les bas-côtés.*
> En cas de réussite, les joueurs identifient la nature du virus avant de s'engager, et se préparent médicalement.

**L'Événement :**
*Le convoi n'a pas le choix et doit traverser une ancienne zone de quarantaine oubliée. L'air y est étouffant, chargé d'une poussière ocre. Les filtres des véhicules clignotent en alerte rouge de contamination biologique.*

**Informations pour le MJ & Joueurs :**
- Forte probabilité que l'équipage soit infecté : énorme coût en Médicaments.
- Faire un détour est possible mais extrêmement coûteux en Carburant.
- Les cadavres dans la zone portent parfois des reliques intactes, avis aux pilleurs courageux.`, severity: 'high' },
      { title: 'Pluie Acide Biologique', description: `**Signes avant-coureurs (Jet de Perception / Météo) :**
*Un nuage pourpre, qui semble presque pulser de l'intérieur, s'approche. Les insectes du désert tombent morts.*
> En cas de réussite, les camions sont calfeutrés à la hâte.

**L'Événement :**
*Une pluie grasse et rougeâtre tombe sur le convoi. Ce n'est pas de l'acide ordinaire, c'est un agent pathogène vaporisé. Il ronge les joints en caoutchouc et s'infiltre dans les habitacles, provoquant des quintes de toux sanglantes.*

**Informations pour le MJ & Joueurs :**
- Dommages simultanés aux véhicules (-PV) et à l'équipage (-Médicaments).
- Impossible de sortir faire des réparations sans combinaison complète.
- Panique potentielle parmi les passagers non préparés.`, severity: 'medium' },
    ],
    encounter: [
      { title: 'Caravane Médicale', description: `**Signes avant-coureurs (Jet de Perception / Vigilance) :**
*Des véhicules peints en blanc immaculé avec la grande croix rouge de la Cité Médicale s'approchent pacifiquement, drapeaux levés.*
> En cas de réussite, le convoi prépare ses blessés et ses stocks pour le troc sans perdre de temps.

**L'Événement :**
*Une caravane de médecins itinérants très bien escortée croise votre route. Ils font une halte et proposent leurs services à tous les nomades, moyennant finances.*

**Informations pour le MJ & Joueurs :**
- Opportunité rare d'échanger n'importe quelle ressource contre des Médicaments.
- Ils peuvent soigner toutes les afflictions et remonter le moral de l'équipage.
- Les attaquer (non recommandé) provoquerait l'ire de la Cité Médicale (baisse de réputation majeure).`, severity: 'low' },
      { title: 'Infectés Sauvages', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*Des gémissements terrifiants s'élèvent d'un canyon étroit. Des silhouettes désarticulées courent avec une vitesse anormale vers les moteurs.*
> En cas de réussite, l'artilleur monte sur la tourelle avant le contact.

**L'Événement :**
*Une horde d'anciens humains, ravagés par un virus expérimental qui a décuplé leur force et détruit leur esprit, se jette sous les roues et s'accroche aux camions en hurlant.*

**Informations pour le MJ & Joueurs :**
- Risque de dommages physiques massifs aux véhicules (PV).
- Si un infecté entre dans la cabine, le coût en Munitions et Médicaments grimpe en flèche.
- Ils ne s'enfuient jamais : c'est un combat à mort.`, severity: 'high' },
      { title: 'Marchand de Médicaments', description: `**Signes avant-coureurs (Jet de Perception / Persuasion) :**
*Un petit buggy rapide avec un drapeau noir vous fait des appels de phares depuis un promontoire.*
> En cas de réussite, vous devinez que ce marchand est un charlatan ou un trafiquant avant de lui parler.

**L'Événement :**
*Un trafiquant patibulaire, à moitié camouflé, propose des auto-injecteurs, des antibiotiques et de la morphine à des prix frôlant le vol pur et simple.*

**Informations pour le MJ & Joueurs :**
- Troc de survie : Échangez du Carburant, Munitions ou Nourriture contre un petit peu de Médicaments.
- 10% de chances que les produits soient frelatés.
- Tuer le marchand est tentant, mais son buggy est extrêmement rapide (combat risqué).`, severity: 'low' },
    ],
  },
  'Carburant': {
    climate: [
      { title: 'Fuite de Pétrole Enflammée', description: `**Signes avant-coureurs (Jet de Perception / Navigation) :**
*Une colonne de fumée noire opaque, visible à des dizaines de kilomètres, obstrue totalement l'horizon.*
> En cas de réussite, le convoi trouve une brèche dans les flammes avant d'être pris au piège.

**L'Événement :**
*Un ancien pipeline souterrain a rompu, et une mer de pétrole brut s'est déversée sur la route avant de s'enflammer. Un véritable mur de feu s'élève devant vous, crachant une chaleur étouffante.*

**Informations pour le MJ & Joueurs :**
- Traverser le mur de feu cause d'énormes dommages (-PV).
- Faire le grand tour consomme énormément de Carburant.
- Les conducteurs doivent réussir des jets de pilotage sous peine d'endommager gravement les pneus.`, severity: 'high' },
      { title: 'Vapeurs Inflammables', description: `**Signes avant-coureurs (Jet de Perception / Chimie) :**
*L'air devient lourd, tremblant. Les respirations se font courtes et l'odeur caractéristique de l'essence emplit l'habitacle.*
> En cas de réussite, un mécanicien hurle à tout le monde d'éteindre cigarettes, armes à feu et moteurs défaillants avant la catastrophe.

**L'Événement :**
*Le convoi traverse une cuvette où stagnent des émanations de gaz naturel hyper concentrées, échappées des nappes de la Cité du Carburant. La moindre étincelle transformerait la cuvette en enfer.*

**Informations pour le MJ & Joueurs :**
- Interdiction stricte d'utiliser les armes à feu : embuscade mortelle s'ils sont attaqués ici.
- Risque extrême (-PV critique) si le moteur d'un des camions surchauffe.
- Ralentissement nécessaire pour ne pas faire chauffer la mécanique (-Carburant).`, severity: 'critical' },
    ],
    encounter: [
      { title: 'Station-Service Fantôme', description: `**Signes avant-coureurs (Jet de Perception / Fouille) :**
*Le soleil tape sur la devanture d'une ancienne station "Dino-Gas". Fait étrange : les pompes ne sont pas rouillées.*
> En cas de réussite, les joueurs repèrent les snipers cachés sur le toit ou le piège explosif sur la pompe.

**L'Événement :**
*La station semble offrir un répit providentiel. Les pompes indiquent encore de la pression. C'est l'occasion de remplir les réservoirs, si on ose s'y arrêter.*

**Informations pour le MJ & Joueurs :**
- S'il n'y a pas de piège : énorme gain de Carburant gratuit (+Carburant).
- S'il y a un piège (embuscade) : le gain de Carburant n'est possible qu'après un combat acharné (coût Munitions/Médicaments).
- Les joueurs doivent peser le risque/récompense de s'y arrêter.`, severity: 'medium' },
      { title: 'Pillards du Pétrole', description: `**Signes avant-coureurs (Jet de Perception / Tactique) :**
*Des véhicules noirs, mats, sans aucun éclat métallique, roulent tous feux éteints sur les crêtes de sel.*
> En cas de réussite, le convoi allume ses phares pour les aveugler et préparer ses armes.

**L'Événement :**
*Une bande lourdement armée, les fameux 'Blood-Oil', spécialisée dans le siphonnage de camions en marche, attaque le convoi par l'arrière. Ils envoient des grappins équipés de tuyaux !*

**Informations pour le MJ & Joueurs :**
- Ils visent directement la jauge de Carburant (-Carburant) plutôt que la destruction (-PV).
- Pour les repousser, le coût en Munitions est très élevé.
- S'ils parviennent à s'accrocher, ils voleront continuellement le carburant jusqu'à ce que le harpon soit coupé.`, severity: 'high' },
      { title: 'Convoi Tanker Ennemi', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*Le sol tremble. Pas un petit séisme, mais les vibrations régulières et lourdes de chenilles massives et de V8 surcompressés.*
> En cas de réussite, vous déviez de la route principale pour vous cacher.

**L'Événement :**
*Un gigantesque convoi citerne, long d'une centaine de mètres, apparaît en sens inverse. Il est hérissé de lances-flammes, d'artillerie lourde, et appartient à une faction très hostile.*

**Informations pour le MJ & Joueurs :**
- Affrontement frontal suicidaire (-PV critiques, mort possible).
- Fuite obligatoire (jet de pilotage intense, consommation massive de Carburant).
- Si le MJ est clément, le convoi ennemi peut simplement exiger un péage lourd (Nourriture ou Médicaments) pour passer.`, severity: 'critical' },
    ],
  },
  'Eau': {
    climate: [
      { title: 'Mirage du Désert de Sel', description: `**Signes avant-coureurs (Jet de Perception / Navigation) :**
*Le paysage semble se répéter. Les boussoles magnétiques tournent lentement sur elles-mêmes.*
> En cas de réussite, le navigateur se fie aux étoiles ou à la topographie lointaine et ne perd pas la route.

**L'Événement :**
*Le sel étincelant et la chaleur créent d'immenses mirages hyper-réalistes. Des cités d'eau, des forêts, ou de faux dangers apparaissent devant les camions, provoquant la panique et des erreurs de cap majeures.*

**Informations pour le MJ & Joueurs :**
- Grosse perte de temps et de Carburant si les pilotes suivent les mirages.
- Les conducteurs fatigués peuvent commettre des erreurs (dégâts mineurs -PV).
- L'équipe perd en moral, pensant trouver de l'eau.`, severity: 'medium' },
      { title: 'Tempête de Sel', description: `**Signes avant-coureurs (Jet de Perception / Météo) :**
*Le vent se lève, portant de gros cristaux blancs qui tintent sur le verre.*
> En cas de réussite, les vitres sont protégées par des volets blindés.

**L'Événement :**
*Pire qu'une tempête de sable : une tornade de cristaux de sel acérés s'abat sur la route. Elle raye le verre, ronge l'acier nu, et s'infiltre dans chaque plaie pour infliger une douleur insoutenable.*

**Informations pour le MJ & Joueurs :**
- Dégâts importants (-PV) au blindage.
- Si des personnes sont exposées, elles souffrent horriblement (-Médicaments).
- Le sel pénètre dans les réserves d'Eau non scellées, la rendant imbuvable (-Eau).`, severity: 'high' },
    ],
    encounter: [
      { title: 'Oasis Cachée', description: `**Signes avant-coureurs (Jet de Perception / Pistage) :**
*Une tâche verte, presque fluo, contraste avec la blancheur du sel. Des traces de pneus y mènent et en repartent.*
> En cas de réussite, vous repérez l'oasis mais aussi les pièges tendus autour de la source d'eau.

**L'Événement :**
*Un point d'eau souterrain a percé la croûte de sel, formant un petit lac saumâtre au centre d'une végétation mutante. Un véritable trésor dans ce désert.*

**Informations pour le MJ & Joueurs :**
- Possibilité énorme de refaire les stocks d'Eau (+Eau).
- Risque qu'elle soit gardée par des mutants ou des pillards, forçant un combat.
- Nécessite du temps pour purifier l'eau si le convoi a l'équipement nécessaire.`, severity: 'low' },
      { title: 'Nomades du Sel', description: `**Signes avant-coureurs (Jet de Perception / Empathie) :**
*Des silhouettes silencieuses, enveloppées de bandages blancs de la tête aux pieds, émergent des dunes de sel comme des fantômes.*
> En cas de réussite, vous savez approcher sans les offenser avec vos moteurs bruyants.

**L'Événement :**
*Une tribu mystérieuse, adaptée à cet enfer immaculé, encercle pacifiquement votre convoi. Ils utilisent des signes pour communiquer et portent de lourdes gourdes d'eau purifiée.*

**Informations pour le MJ & Joueurs :**
- Ils échangent leur Eau précieuse contre presque n'importe quoi (Nourriture, Munitions).
- Très utiles comme guides : peuvent réduire la consommation de Carburant pour le reste du trajet.
- S'ils sont agressés, ils disparaissent dans le sel comme par magie, laissant des pièges derrière eux.`, severity: 'low' },
      { title: 'Bêtes du Sel', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*De grands monticules de sel éclatent soudainement autour du convoi, projetant de la poudre blanche partout.*
> En cas de réussite, les tourelles font feu avant que les bêtes n'atteignent les camions.

**L'Événement :**
*D'énormes prédateurs reptiliens, aveugles mais extrêmement sensibles aux vibrations, jaillissent du sol. Leurs carapaces sont incrustées de cristaux durs comme le roc.*

**Informations pour le MJ & Joueurs :**
- Combat intense : gros coût en Munitions (leurs carapaces sont dures à percer).
- Ils peuvent percer les pneus ou retourner les petits véhicules (-PV).
- Leur viande est hautement toxique, inutile pour le ravitaillement.`, severity: 'high' },
    ],
  },
  'Divertissement': {
    climate: [
      { title: 'Zone de Radiations Festives', description: `**Signes avant-coureurs (Jet de Perception / Sciences) :**
*À l'horizon nocturne, une étrange lueur multicolore pulse de façon hypnotique. Les compteurs Geiger émettent de légers cliquetis rythmiques.*
> En cas de réussite, les pilotes peuvent s'armer de lunettes polarisées et sceller les camions avant d'entrer dans la zone.

**L'Événement :**
*Le convoi pénètre dans les ruines d'un immense complexe de divertissement pré-guerre. Des centaines de néons brisés mais toujours alimentés par un réacteur nucléaire instable crachent une lumière stroboscopique terrifiante. Les couleurs sont magnifiques mais l'air est saturé de radiations douces.*

**Informations pour le MJ & Joueurs :**
- L'effet stroboscopique hypnotise les conducteurs (risque d'accident, -PV).
- Les radiations sont faibles mais constantes (consommation de Médicaments).
- Une fouille peut révéler des objets de luxe d'avant-guerre, très prisés par les marchands.
- Idéal pour cacher la signature thermique du convoi à des poursuivants.`, severity: 'medium' },
    ],
    encounter: [
      { title: 'Troupe d\'Artistes Nomades', description: `**Signes avant-coureurs (Jet de Perception / Psychologie) :**
*Une musique entraînante et des rires résonnent. Vous repérez des véhicules peints de couleurs criardes, ornés de fanions ridicules.*
> En cas de réussite, vous devinez qu'il ne s'agit pas d'un piège macabre, mais de véritables artistes.

**L'Événement :**
*Un convoi théâtral, mené par un bateleur charismatique aux vêtements bariolés, croise votre route. Ils font une halte et commencent immédiatement à jongler avec des torches enflammées et à jouer de la musique avec des instruments faits d'ossements et de tuyaux de plomb.*

**Informations pour le MJ & Joueurs :**
- Ils demandent simplement un peu de Carburant ou de Nourriture en échange de leur spectacle.
- Le spectacle remonte drastiquement le moral des troupes (bonus pour les prochains jets).
- Ils connaissent toutes les rumeurs et ragots des Cités environnantes.
- S'ils sont attaqués, ils s'enfuient en lançant des bombes fumigènes multicolores.`, severity: 'low' },
      { title: 'Combattants de l\'Arène en Cavale', description: `**Signes avant-coureurs (Jet de Perception / Empathie) :**
*Des silhouettes extrêmement massives, portant des armures lourdes en plaques de métal brut et des armes couvertes de sang séché, marchent au milieu de la route, épuisées.*
> En cas de réussite, vous repérez les chaînes brisées à leurs chevilles et comprenez qu'il s'agit d'esclaves gladiateurs.

**L'Événement :**
*Un groupe de cinq colosses, couverts de cicatrices et d'imposants tatouages de l'Arène, bloque la route. Ils sont armés jusqu'aux dents, désespérés, et n'ont absolument plus rien à perdre.*

**Informations pour le MJ & Joueurs :**
- S'ils sentent la moindre faiblesse, ils attaqueront pour voler les véhicules (combat très difficile, -PV).
- S'ils sont respectés et nourris, ils peuvent offrir leurs services comme gardes du corps temporels.
- Les transporter attire inévitablement les chasseurs de l'Arène, lourdement armés.`, severity: 'high' },
      { title: 'Bookmaker Piégeur', description: `**Signes avant-coureurs (Jet de Perception / Vigilance) :**
*Un seul buggy, flambant neuf et luxueusement équipé, est stationné en travers de la route. Un homme en costume chic s'appuie contre la portière, un chronomètre à la main.*
> En cas de réussite, vous remarquez les drones caméras qui tournoient discrètement au-dessus de lui.

**L'Événement :**
*Le bookmaker se présente avec un large sourire carnassier. Il vous propose un pari en direct, diffusé à la Cité du Divertissement : faire la course contre son meilleur pilote à travers un canyon miné. Si vous gagnez, il vous offre une fortune. Si vous perdez, votre convoi lui appartient.*

**Informations pour le MJ & Joueurs :**
- Le refuser poliment ne pose aucun problème.
- L'accepter déclenche une course mortelle (jets de pilotage extrêmes, dégâts colossaux en cas d'erreur).
- Récompense potentielle massive (Ressources, Monnaie, Réputation).
- Si on essaie de le tuer, les drones diffuseront l'image de votre traîtrise dans tout le désert.`, severity: 'medium' },
    ],
  },
  'Nuke': {
    climate: [
      { title: 'Pluie Radioactive', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*Les nuages prennent une teinte grisâtre et morbide. Les dosimètres s'emballent brutalement avant même la première goutte.*
> En cas de réussite, l'équipage a le temps de déployer des bâches plombées avant l'averse.

**L'Événement :**
*Une averse violente, noire de cendres et hautement radioactive, s'abat sur la région. Les gouttes brûlent la peau et saturent l'air d'isotopes mortels. Les pare-brises sont couverts d'une boue noire crépitante.*

**Informations pour le MJ & Joueurs :**
- Toute personne non protégée souffrira de brûlures radiologiques sévères (-Médicaments massifs).
- La cargaison extérieure est contaminée (Nourriture et Eau deviennent toxiques).
- Nettoyer les véhicules nécessitera de l'Eau saine une fois la pluie passée.
- Les moteurs doivent être coupés si la prise d'air n'est pas filtrée.`, severity: 'critical' },
      { title: 'Zone d\'Irradiation Résiduelle', description: `**Signes avant-coureurs (Jet de Perception / Sciences) :**
*Le sable prend une texture vitrifiée. Des ombres humaines fantomatiques sont gravées de manière permanente sur les rares rochers environnants.*
> En cas de réussite, vous comprenez l'origine du cratère et vous équipez en masques filtrants.

**L'Événement :**
*Le sol craque sous le poids des véhicules, brisant le verre fondu d'un ancien cratère nucléaire. La chaleur résiduelle fait bouillir la gomme des pneus, et la radioactivité silencieuse pénètre le blindage.*

**Informations pour le MJ & Joueurs :**
- Dégâts constants aux pneus et au bas de caisse (-PV).
- Consommation de Médicaments pour prévenir les effets des radiations.
- La zone est si dangereuse que même les pillards ne s'y aventurent pas : tranquillité absolue garantie.
- Possibilité de trouver des matériaux pré-guerre rares si quelqu'un ose sortir.`, severity: 'high' },
    ],
    encounter: [
      { title: 'Fanatiques du Noyau', description: `**Signes avant-coureurs (Jet de Perception / Connaissances Locales) :**
*Vous apercevez des silhouettes encapuchonnées priant devant des tonneaux de déchets toxiques brillants.*
> En cas de réussite, vous savez qu'ils sont extrêmement instables et vous préparez une négociation basée sur la religion.

**L'Événement :**
*Une procession d'adorateurs de l'Atome, rongés par les tumeurs et la folie, se jette devant le convoi. Ils hurlent des versets incohérents sur la purification par la lueur verte et exigent un "don de chair" ou un "bain de feu".*

**Informations pour le MJ & Joueurs :**
- Ils sont nombreux et utilisent des armes artisanales radioactives (Dégâts persistants).
- S'ils sont écrasés, le sang et les restes irradiés contaminent le bas de caisse.
- Ils peuvent être achetés en leur offrant des objets technologiques ou de la drogue.
- S'ils montent à bord, c'est un massacre garanti (coût énorme en Munitions/Médicaments).`, severity: 'high' },
      { title: 'Créature Irradiée Géante', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*Les compteurs Geiger ne détectent pas de radiations ambiantes, mais de brusques pics isolés. De profonds tremblements secouent le sel, comme si un char d'assaut souterrain approchait.*
> En cas de réussite, les véhicules accélèrent au maximum avant l'éruption.

**L'Événement :**
*Un monstre colossal, un ver muté ou un scorpion géant défiguré par des décennies d'irradiation, perce la croûte de sel dans une explosion de gravats. Sa gueule, luisante d'un acide vert fluo, claque dans un bruit de tonnerre.*

**Informations pour le MJ & Joueurs :**
- Danger absolu : la créature peut écraser un camion entier d'un seul coup (-PV critiques).
- Seules les armes lourdes et les explosifs l'égratignent.
- L'acide qu'elle crache fait fondre le blindage et contamine les réserves.
- Si le convoi fuit, il doit abandonner du poids ou cramer ses réserves de Carburant.`, severity: 'critical' },
      { title: 'Marchands de Déchets', description: `**Signes avant-coureurs (Jet de Perception / Troc) :**
*Un chariot tiré par des bêtes mutantes fatiguées transporte des barils en plomb lourds et sécurisés.*
> En cas de réussite, vous repérez les symboles de radiation effacés sur les barils.

**L'Événement :**
*Des trafiquants protégés par de grosses combinaisons en plomb vous hèlent. Ils ont récupéré des noyaux de fusion miniatures, des isotopes rares et des piles atomiques dans un ancien silo.*

**Informations pour le MJ & Joueurs :**
- Ils proposent des pièces d'une valeur inestimable, mais hautement toxiques.
- Les acheter requiert un stockage blindé, sinon les radiations empoisonnent l'équipage lentement (-Médicaments réguliers).
- Ces noyaux peuvent servir de monnaie d'échange suprême ou de Carburant infini si le mécanicien est un génie.`, severity: 'medium' },
    ],
  },
  'Métaux': {
    climate: [
      { title: 'Éboulement de Ferraille', description: `**Signes avant-coureurs (Jet de Perception / Tactique) :**
*Vous traversez un canyon formé par des gratte-ciels en ruine couchés sur le côté. Des grincements métalliques sinistres résonnent en hauteur.*
> En cas de réussite, le convoi s'arrête net avant que la structure ne s'effondre.

**L'Événement :**
*Avec un vacarme assourdissant, un enchevêtrement de poutres d'acier tordues, de béton et de verre s'effondre depuis le sommet de la carcasse d'immeuble, s'écrasant pile au milieu de la voie.*

**Informations pour le MJ & Joueurs :**
- Si le convoi a été surpris : dégâts directs très sévères sur le ou les véhicules de tête (-PV).
- Si évité : la route est tout de même bloquée, nécessitant un temps énorme pour déblayer la ferraille.
- L'éboulement peut libérer des composants mécaniques utilisables (gain de ressources si on prend le temps de fouiller).
- Le bruit a potentiellement attiré des mineurs locaux hostiles.`, severity: 'high' },
      { title: 'Champ Magnétique Anomal', description: `**Signes avant-coureurs (Jet de Perception / Sciences) :**
*Les cheveux se dressent sur les têtes. Toutes les petites pièces métalliques non arrimées se mettent à trembler et à glisser lentement vers l'Est.*
> En cas de réussite, le pilote passe en mode de conduite entièrement manuelle et le navigateur lâche sa boussole.

**L'Événement :**
*La forte concentration de minerais ferreux sous la croûte terrestre crée ici une perturbation électromagnétique majeure. Les systèmes de direction assistée deviennent erratiques, tirant violemment le volant. Les instruments de bord s'affolent complètement.*

**Informations pour le MJ & Joueurs :**
- Conduite dangereuse nécessitant toute l'attention des pilotes (risque de collision mineure, -PV).
- Les communications radio sont coupées : le convoi doit rester très groupé.
- Les armes automatiques peuvent s'enrayer à cause de la magnétisation des culasses.`, severity: 'medium' },
    ],
    encounter: [
      { title: 'Mineurs en Grève', description: `**Signes avant-coureurs (Jet de Perception / Empathie) :**
*Un barrage de vieux wagons de mine retournés barre la route. De la fumée noire s'élève de braseros artisanaux. Des cris de colère résonnent.*
> En cas de réussite, vous comprenez que ce ne sont pas des pillards, mais des civils en colère contre leur direction.

**L'Événement :**
*Une centaine de mineurs recouverts de suie, équipés de pioches hydrauliques et de foreuses explosives, bloquent le passage. Ils exigent un paiement solidaire pour leur caisse de grève ou menacent de détruire les véhicules.*

**Informations pour le MJ & Joueurs :**
- Forcer le barrage coûtera des Munitions et des PV, et massacrer des mineurs entachera votre réputation.
- Les payer (Nourriture, Eau, ou Carburant) ouvre le passage pacifiquement.
- Si vous acceptez de prendre un de leurs blessés graves avec vous, ils vous escorte en sécurité.`, severity: 'medium' },
      { title: 'Contrebandiers d\'Alliages', description: `**Signes avant-coureurs (Jet de Perception / Fouille) :**
*Sous une immense plaque d'acier faisant office de tente improvisée, des étincelles de soudure bleutées trahissent une activité humaine cachée.*
> En cas de réussite, vous repérez le repaire sans déclencher d'alerte, et approchez en amis.

**L'Événement :**
*Un groupe de mécaniciens rebelles qui volent du métal raffiné à la Cité des Métaux. Ils sont en train de fondre et de souder des plaques de blindage de qualité militaire.*

**Informations pour le MJ & Joueurs :**
- Ils proposent de renforcer les camions du convoi à des prix très réduits (Troc).
- Possibilité d'augmenter de manière permanente les PV Max d'un véhicule si l'offre est acceptée.
- S'éterniser ici augmente le risque qu'une patrouille punitive de la Cité des Métaux ne vous tombe dessus.`, severity: 'low' },
    ],
  },
  'Armement': {
    climate: [
      { title: 'Champ de Mines Oublié', description: `**Signes avant-coureurs (Jet de Perception / Tactique) :**
*La route principale est détruite. La piste de contournement présente d'étranges cratères parfaitement ronds et peu profonds, ainsi que des carcasses calcinées très anciennes.*
> En cas de réussite, le pilote de tête freine juste avant d'entrer dans le champ de mines.

**L'Événement :**
*Le convoi se retrouve piégé au milieu d'un vaste champ de mines anti-véhicules de la Grande Guerre, enfouies sous quelques centimètres de poussière. Le moindre écart, la moindre vibration un peu forte pourrait déclencher l'enfer.*

**Informations pour le MJ & Joueurs :**
- Avancer nécessite des jets de survie/démolition extrêmes de la part des éclaireurs à pied.
- Progression incroyablement lente et stressante (consommation de temps).
- Si une mine saute : dégâts colossaux (-PV critiques), pouvant détruire un véhicule entier et la route derrière lui.
- Le bruit d'une explosion alertera à coup sûr des patrouilles ennemies.`, severity: 'critical' },
      { title: 'Cratère d\'Explosion', description: `**Signes avant-coureurs (Jet de Perception / Navigation) :**
*La route s'arrête brusquement dans le vide. La chaleur de l'air est légèrement plus élevée.*
> En cas de réussite, le convoi évite de foncer tête baissée dans le gouffre, ce qui aurait brisé les suspensions.

**L'Événement :**
*Une bombe titanesque a creusé ici un cratère de deux cents mètres de large. Les bords sont instables, vitrifiés, et la route droite est coupée. Il va falloir descendre dans la cuvette et remonter de l'autre côté.*

**Informations pour le MJ & Joueurs :**
- La descente et la montée sont périlleuses pour les gros camions (jets de pilotage obligatoires, risque de dégâts mineurs).
- Le fond du cratère est un goulot d'étranglement idéal pour une embuscade.
- Énorme consommation de Carburant pour forcer les moteurs dans la montée.`, severity: 'medium' },
    ],
    encounter: [
      { title: 'Patrouille de Milice Armée', description: `**Signes avant-coureurs (Jet de Perception / Ouïe) :**
*Le grondement sourd et régulier d'un moteur militaire parfaitement réglé. Une sirène ponctuelle retentit.*
> En cas de réussite, vous avez le temps de cacher d'éventuelles contrebandes ou armes illégales.

**L'Événement :**
*Un blindé léger de la milice de la Cité de l'Armement barre la route. Deux jeeps équipées de mitrailleuses lourdes l'encadrent. Un officier en uniforme impeccable vous ordonne de stopper les moteurs et de préparer vos papiers et vos taxes.*

**Informations pour le MJ & Joueurs :**
- Ils vont exiger un droit de passage (Nourriture, Carburant, ou Munitions).
- Si l'équipage se montre insolent, la fouille sera très musclée et destructrice (-PV intérieurs).
- Les attaquer est suicidaire, ils appelleront des renforts aériens en moins de cinq minutes.
- Une bonne persuasion peut réduire le pot-de-vin à néant.`, severity: 'medium' },
      { title: 'Trafiquants d\'Armes', description: `**Signes avant-coureurs (Jet de Perception / Troc) :**
*Un petit campement discret, couvert de filets de camouflage militaires, avec de caisses empilées de couleur olive.*
> En cas de réussite, vous devinez qu'ils ont des surplus de haute qualité avant même de voir les caisses.

**L'Événement :**
*Un groupe de contrebandiers chevronnés est posé là, nettoyant des fusils d'assaut et des lance-roquettes flambant neufs. Ils cherchent des clients discrets pour écouler des stocks volés aux usines d'Armement.*

**Informations pour le MJ & Joueurs :**
- Superbe opportunité pour acheter des Munitions en grande quantité ou de l'équipement lourd.
- Les prix sont élevés, ils demandent surtout des Médicaments et de l'Eau pure.
- Ils sont paranos : au moindre geste suspect, ils abattront les négociateurs.`, severity: 'low' },
      { title: 'Escouade de Mercenaires', description: `**Signes avant-coureurs (Jet de Perception / Tactique) :**
*Un éclat laser fugitif balaie le pare-brise. Sur une crête à un kilomètre, un sniper vient de se trahir. C'est un tir croisé parfait.*
> En cas de réussite, les véhicules accélèrent en zigzaguant et évitent la première salve de roquettes.

**L'Événement :**
*Une escouade de mercenaires professionnels, suréquipés en armes lourdes et tactiques, vous a pris en chasse. Ils savent exactement ce que vous transportez et ont été engagés pour vous l'arracher par la force. C'est un combat de professionnels.*

**Informations pour le MJ & Joueurs :**
- Dégâts colossaux garantis (-PV). Leurs armes transpercent les blindages standards.
- Consommation gigantesque de Munitions et de Médicaments pour survivre.
- Viser leurs véhicules ou leurs armes lourdes est la seule option pour les forcer à abandonner.
- S'ils fuient, ils laisseront du très bon matériel derrière eux.`, severity: 'critical' },
    ],
  },
  'Anciens': {
    climate: [
      { title: 'Anomalie Technologique', description: `**Signes avant-coureurs (Jet de Perception / Sciences) :**
*Des hologrammes distordus apparaissent et disparaissent aléatoirement sur la route. Des voix robotiques grésillent en boucle dans les haut-parleurs des camions.*
> En cas de réussite, les conducteurs peuvent anticiper les chocs électriques et isoler les batteries.

**L'Événement :**
*Le convoi entre dans une zone où l'ancienne matrice technologique est corrompue. Des pylônes sortent de terre de manière erratique, des arcs électriques relient les rochers, et des champs de force invisibles bloquent certains passages.*

**Informations pour le MJ & Joueurs :**
- La route devient un véritable labyrinthe aléatoire, consommant énormément de temps et de Carburant.
- Risque élevé d'accident et de décharge mortelle (-PV, -Médicaments) si on touche un champ de force.
- Le mécanicien aura énormément de travail pour réinitialiser les systèmes de bord corrompus par l'anomalie.`, severity: 'high' },
    ],
    encounter: [
      { title: 'Gardiens Automatisés', description: `**Signes avant-coureurs (Jet de Perception / Technologie) :**
*Deux dômes métalliques lisses s'élèvent lentement du sable de part et d'autre de la route, émettant un bourdonnement inquiétant.*
> En cas de réussite, le tireur comprend que ce sont des tourelles laser avant qu'elles ne fassent le point.

**L'Événement :**
*Le système de défense automatisé d'une installation pré-guerre sous le sable s'active. Les tourelles scannent le convoi, le classent comme "Cible Non Autorisée" et ouvrent un feu de suppression continu et d'une précision chirurgicale.*

**Informations pour le MJ & Joueurs :**
- Les lasers coupent le métal comme du beurre (-PV lourds).
- Impossible de raisonner ou d'intimider une IA de sécurité.
- Il faut soit traverser à pleine vitesse (risque de crash), soit détruire les tourelles (coût massif en Munitions).
- Une fois détruites, leurs lentilles de focalisation peuvent valoir une fortune.`, severity: 'high' },
      { title: 'Archéologues du Passé', description: `**Signes avant-coureurs (Jet de Perception / Fouille) :**
*Des projecteurs éclairent l'entrée d'un bunker souterrain à demi enfoui. Des tentes d'expédition jaune fluo sont dressées à côté.*
> En cas de réussite, vous approchez en montrant patte blanche, rassurant ces savants effrayés par le désert.

**L'Événement :**
*Un groupe d'universitaires poussiéreux, sponsorisé par les Anciens, procède à l'excavation de serveurs de données antiques. Ils manquent cruellement de moyens de survie pour terminer leurs travaux.*

**Informations pour le MJ & Joueurs :**
- Ils échangeront volontiers de l'Eau et de la Nourriture contre des pièces détachées ou des artefacts inutiles pour eux.
- Ils connaissent l'histoire de la région et peuvent fournir une carte des vieux tunnels (raccourcis possibles).
- Si on les attaque pour les voler, la faction des Anciens mettra une prime sur votre tête.`, severity: 'low' },
      { title: 'Trésor Technologique Piégé', description: `**Signes avant-coureurs (Jet de Perception / Démolition) :**
*Un conteneur pré-guerre intact, aux scellés encore posés, est mystérieusement visible au bout d'un cul-de-sac. Mais le sable autour est anormalement lisse.*
> En cas de réussite, l'éclaireur repère le fil de détente au ras du sol avant que quiconque ne l'approche.

**L'Événement :**
*L'opportunité est trop belle pour l'ignorer : du matériel militaire ou scientifique intact. Cependant, il est protégé par un système de sécurité actif ou un piège mortel posé par de précédents pillards vicieux.*

**Informations pour le MJ & Joueurs :**
- Si le désamorçage échoue : explosion dévastatrice (-PV, mort d'un personnage possible).
- S'ils fuient sans y toucher : aucun dommage, mais la frustration sera grande.
- Si le désamorçage réussit : un butin incroyable en armes, ressources ou pièces de moteur spéciales.`, severity: 'medium' },
    ],
  },
};

/** Generic events (no biome influence) */
const GENERIC_EVENTS = {
  climate: [
    { title: 'Tempête de Sable Majeure', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*Le vent change brusquement de direction et l'air devient soudainement très sec. À l'horizon, le ciel prend une teinte cuivrée anormale.*
> En cas de réussite, le convoi a le temps de bâcher les cargaisons sensibles et de trouver un semblant d'abri avant l'impact.

**L'Événement :**
*Un mur brunâtre gigantesque se lève lentement à l'horizon, obscurcissant le soleil jusqu'à le réduire à une lueur blafarde. Quelques minutes plus tard, la tempête vous frappe de plein fouet. Le vent s'engouffre dans les habitacles en sifflant lugubrement, portant avec lui des millions de grains de sel et de sable qui viennent griffer les carrosseries et les pare-brises avec un bruit assourdissant. La visibilité tombe instantanément à moins de deux mètres. Les moteurs forcent, luttant contre le vent de face.*

**Informations pour le MJ & Joueurs :**
- Vitesse de progression quasiment nulle : consommation extrême de Carburant pour avancer.
- Les filtres à air et la mécanique fine se bouchent : risque imminent de perte de points de vie (PV) pour toute la flotte.
- L'orientation est impossible sans boussole ou système scellé : risque de perdre complètement la route.
- Les snipers et observateurs ennemis sont rendus aveugles, offrant une opportunité de semer un poursuivant.
- Sortir des véhicules nécessite des masques à gaz ou des lunettes de protection lourdes.`, severity: 'high' },
    { title: 'Chaleur Infernale', description: `**Signes avant-coureurs (Jet de Perception / Mécanique) :**
*L'air commence à scintiller étrangement plus tôt que d'habitude. L'odeur de l'asphalte et du sel cuit devient prenante, et les jauges de température frémissent anormalement.*
> En cas de réussite, les mécaniciens peuvent purger les radiateurs préventivement et l'équipage se rationne en eau avant le choc thermique.

**L'Événement :**
*Le soleil tape sans aucune pitié sur la tôle surchauffée de vos véhicules. L'air brûlant vibre et déforme l'horizon en d'étranges mirages liquides. Les radiateurs fument, et à l'intérieur des cabines non-climatisées, la température frôle les 55 degrés. La sueur coule à flots, la soif commence à tirailler violemment les gorges, et le métal extérieur est assez chaud pour brûler la peau au premier contact.*

**Informations pour le MJ & Joueurs :**
- Les réserves d'Eau du convoi fondent à vue d'œil pour maintenir l'équipage en vie.
- La mécanique est mise à rude épreuve : fort risque d'explosion de radiateur ou de surchauffe moteur.
- Les passagers et conducteurs souffrent de fatigue extrême, imposant des malus aux tests de conduite ou de vigilance.
- Une pause forcée de jour coûte un temps précieux, mais rouler de nuit attire d'autres types de prédateurs.`, severity: 'medium' },
    { title: 'Pluie Acide Légère', description: `**Signes avant-coureurs (Jet de Perception / Sciences) :**
*Une masse nuageuse anormalement basse et teintée de vert émeraude s'approche rapidement poussée par le vent. Une très légère odeur d'œuf pourri précède les nuages.*
> En cas de réussite, l'équipage a quelques minutes pour fermer hermétiquement les véhicules et enfiler des protections de fortune.

**L'Événement :**
*Le ciel prend une teinte verdâtre maladive, suivie d'un crépitement sinistre qui commence à résonner sur le toit des camions. De petites gouttes opaques et jaunâtres tombent du ciel, laissant des traces de brûlure et des volutes de fumée chimique sur la peinture de la flotte. L'odeur piquante du soufre et de métal dissous envahit l'atmosphère, irritant immédiatement les narines.*

**Informations pour le MJ & Joueurs :**
- Usure lente, insidieuse mais certaine des points de vie (PV) du blindage des véhicules.
- Impossible de sortir ou d'effectuer des réparations externes sans équipement de protection de niveau Hazmat.
- Les bâches couvrant les cargaisons non-blindées risquent d'être percées, menaçant la Nourriture ou les Médicaments.
- Les blessures ouvertes exposées à l'air libre s'infectent rapidement.`, severity: 'low' },
  ],
  encounter: [
    { title: 'Caravane Marchande Égarée', description: `**Signes avant-coureurs (Jet de Perception / Pistage) :**
*Le guetteur repère de profondes traces de pneus très lourds déviant de la route principale, accompagnées d'une légère fumée noire immobile derrière un piton rocheux.*
> En cas de réussite, le convoi peut approcher prudemment par un angle mort ou préparer ses armes sans être vu en premier.

**L'Événement :**
*À l'ombre d'une formation rocheuse escarpée, un énorme camion à huit roues, lourdement modifié et tractant deux remorques blindées, est arrêté sur le bas-côté. Son moteur crache une fumée noire, signe d'une avarie mineure. Des gardes armés patrouillent nerveusement autour du périmètre, fusils d'assaut baissés mais prêts. Lorsqu'ils vous aperçoivent, l'un des hommes en haillons s'avance prudemment et vous fait de grands signes amicaux, les mains bien en évidence.*

**Informations pour le MJ & Joueurs :**
- Les marchands sont pacifiques, mais ont la détente très facile s'ils se sentent menacés.
- C'est l'une des rares occasions d'échanger des ressources excédentaires contre ce qu'il vous manque cruellement.
- Le marchand principal possède une carte de la région : il peut vous avertir d'un danger imminent sur votre route.
- Si le convoi a des pièces mécaniques (ou des PJ capables de réparer leur moteur), une grosse récompense peut être négociée.
- Ils vendent potentiellement des informations sur la cité que vous ciblez.`, severity: 'low' },
    { title: 'Embuscade de Pillards Motorisés', description: `**Signes avant-coureurs (Jet de Perception / Tactique) :**
*Une volée d'oiseaux charognards s'envole brusquement d'une dune voisine. Quelques secondes plus tard, vous remarquez un reflet métallique furtif, comme un miroir, masqué dans les ombres des rochers.*
> En cas de réussite, le convoi n'est pas surpris. Les conducteurs peuvent faire une manœuvre d'esquive et les tourelles tirent les premières. En cas d'échec, les pillards ont un tour d'attaque gratuit.

**L'Événement :**
*Le hurlement aigu et strident de moteurs bricolés résonne soudainement derrière une immense dune de sel cristallisé. En une fraction de seconde, quatre buggys ultra-légers, hérissés de pointes rouillées et peints à la chaux, surgissent à pleine vitesse. Ils encerclent votre convoi comme une meute de loups. Des harpons explosifs fendent l'air et se plantent dans le blindage de vos camions avec un fracas assourdissant. Le combat est inévitable !*

**Informations pour le MJ & Joueurs :**
- Attaque frontale extrêmement agressive : risque très élevé de dommages immédiats à la flotte (PV).
- Consommation massive de Munitions requise pour repousser l'assaut et protéger les flancs du convoi.
- Les pillards visent spécifiquement à immobiliser le véhicule transportant la cargaison principale.
- Si l'escouade accomplit une Réussite Totale, les buggys peuvent être siphonnés pour récupérer énormément de Carburant.
- Fuir nécessite des tests de pilotage très difficiles.`, severity: 'high' },
    { title: 'Meute Sauvage Mutante', description: `**Signes avant-coureurs (Jet de Perception / Survie) :**
*Le silence devient assourdissant. Vous trouvez des carcasses fraîches d'animaux du désert déchiquetées le long de la piste. Une odeur nauséabonde de viande avariée flotte dans l'air.*
> En cas de réussite, les joueurs ont le temps de barricader les fenêtres et de préparer des armes incendiaires avant la charge de la meute.

**L'Événement :**
*Le convoi traverse une zone de canyons de sel étroits. Des hurlements gutturaux, à mi-chemin entre le ricanement et le rugissement, déchirent le silence. Des dizaines d'ombres difformes, croisement probable entre des hyènes géantes et quelque chose de bien pire issu des radiations, courent le long des parois. Elles commencent à bondir sur les toits de vos véhicules, griffant désespérément pour arracher les portes ou briser les vitres.*

**Informations pour le MJ & Joueurs :**
- Ces créatures sont affamées et frénétiques : danger mortel pour les passagers, surtout si le cargo transporte des "Humains".
- Consommation importante de Médicaments à prévoir pour traiter les morsures venimeuses si quelqu'un est blessé.
- Les bêtes ignorent les balles de petit calibre mais fuient face aux lance-flammes, fusées éclairantes ou gros calibres.
- Le blindage extérieur subira des dégâts mineurs mais constants (PV) à force de griffures et de morsures.`, severity: 'medium' },
  ],
  calm: [
    { title: 'Ancien Relais Routier (Abris)', description: `**Signes avant-coureurs (Jet de Perception / Fouille) :**
*Un panneau publicitaire pré-guerre à moitié enfoui indique "Dernière station avant la mer". Au loin, une imposante structure carrée se détache de la platitude du désert.*
> En cas de réussite, le convoi peut s'approcher silencieusement pour s'assurer que l'abri n'est pas déjà occupé par des pillards.

**L'Événement :**
*Après des heures de conduite monotone, les vestiges imposants d'une immense station-service d'avant la guerre se dessinent sur le côté de la piste. Bien que les pompes soient à sec et rouillées depuis des décennies, l'immense toit en tôle ondulée tient encore solidement sur ses piliers de béton armé. C'est un endroit ombragé, frais, et naturellement protégé des vents de sel. Le silence y est apaisant.*

**Informations pour le MJ & Joueurs :**
- Emplacement défensif idéal : le convoi peut s'arrêter, éteindre les moteurs et refroidir toute la mécanique (Gros bonus de PV).
- Les joueurs ont l'opportunité de fouiller les nombreuses carcasses de voitures alentour pour trouver de la ferraille ou des ressources.
- Un repos complet permet de soigner les blessés et de réduire considérablement la fatigue des conducteurs.
- Des traces fraîches sur le sol indiquent que d'autres nomades utilisent cet endroit : prudence recommandée.
- Permet une réorganisation complète de la cargaison et des passagers d'un véhicule à l'autre.`, severity: 'low' },
    { title: 'Route Dégagée et Paisible', description: `**Signes avant-coureurs (Jet de Perception / Navigation) :**
*Le navigateur repère sur la carte une longue portion rectiligne correspondant à une ancienne autoroute. Les éclaireurs confirment que l'horizon est dégagé de toute menace visible sur plusieurs kilomètres.*
> En cas de réussite, les conducteurs peuvent optimiser leur vitesse de croisière pour gagner du temps et économiser plus de carburant.

**L'Événement :**
*La piste s'étend à perte de vue devant vous. Elle est plate, dure comme du ciment et ne présente pas le moindre obstacle, cratère ou carcasse. Les moteurs des camions ronronnent à un régime parfaitement constant. Même le désert impitoyable semble retenir son souffle pour vous laisser passer. La radio capte vaguement un vieux morceau de musique crépitant. Un moment de répit incroyablement rare dans ce monde de violence.*

**Informations pour le MJ & Joueurs :**
- Progression rapide et extrêmement économique en Carburant (possibilité de regagner virtuellement de la jauge par l'économie réalisée).
- Beaucoup de temps libre pour permettre aux mécaniciens de réparer du matériel à l'arrière des camions roulants.
- Les médecins de bord ont le calme nécessaire pour faire des soins chirurgicaux mineurs ou distiller des remèdes.
- Les conducteurs peuvent discuter et remonter le moral des troupes.
- Risque de relâchement de la vigilance : si le prochain événement est une embuscade, le MJ peut donner un malus d'initiative.`, severity: 'low' },
  ],
  mechanical: [
    { title: 'Surchauffe Critique du Moteur', description: `**Signes avant-coureurs (Jet de Perception / Mécanique) :**
*Une légère odeur de plastique brûlé commence à s'infiltrer dans la cabine de pilotage, et le moteur émet un très léger cliquetis métallique rythmé.*
> En cas de réussite, le pilote réduit sa vitesse ou coupe certains cylindres à temps, transformant un incident critique en une simple avarie gérable. En cas d'échec, le moteur pète en pleine accélération.

**L'Événement :**
*Alors que le convoi franchit une pente raide, une fumée noire, épaisse et âcre s'échappe soudainement du capot du véhicule de tête, envahissant la cabine. Sur le tableau de bord, l'aiguille de température est bloquée dans le rouge vif, et une alarme stridente retentit. Le moteur hoquète violemment, perdant de sa puissance et créant un dangereux ralentissement en chaîne pour tout le reste du convoi.*

**Informations pour le MJ & Joueurs :**
- Arrêt immédiat obligatoire sous peine de fondre littéralement le bloc moteur (-PV critiques définitifs).
- Une réparation d'urgence prend beaucoup de temps et nécessite de sacrifier des réserves d'Eau précieuses pour refroidir le radiateur en urgence.
- Le convoi est immobilisé sur une pente, ce qui le rend extrêmement vulnérable à toute attaque.
- Si le mécanicien rate son jet, la consommation de Carburant de ce véhicule sera doublée pour le reste du trajet.`, severity: 'medium' },
    { title: 'Essieu Brisé sur un Cratère Dissimulé', description: `**Signes avant-coureurs (Jet de Perception / Conduite) :**
*L'éclaireur ou le pilote repère une zone où le sel semble anormalement plat, sans aucune trace de vent, comme si une fine croûte recouvrait un creux profond.*
> En cas de réussite, le pilote donne un grand coup de volant, évitant le gouffre et ne subissant qu'une forte secousse.

**L'Événement :**
*Le sol semblait pourtant parfaitement plat, mais une fine couche de sel masquait la cavité d'un très vieux cratère d'artillerie. Le lourd camion de transport y plonge avec un craquement métallique terrifiant qui résonne à des kilomètres à la ronde. Le véhicule s'affaisse violemment sur le flanc droit, l'avant enfoncé dans la poussière. La roue avant a été complètement arrachée.*

**Informations pour le MJ & Joueurs :**
- Immobilisation totale et complète du véhicule concerné.
- Une réparation réussie exige un treuil puissant, beaucoup de temps, et le sacrifice de pièces de rechange majeures.
- En cas d'échec total de réparation, le véhicule devra être abandonné dans le désert (Perte du véhicule).
- Si le véhicule est abandonné, transférer sa cargaison dans les autres véhicules prendra du temps et posera des problèmes de poids.
- Le fracas a probablement alerté des prédateurs ou des pillards dans un rayon de plusieurs kilomètres.`, severity: 'high' },
  ],
};

/** Reward pool templates */
const REWARD_POOL = [
  { type: 'resources', label: 'Cargaison de Carburant', description: '+30 Carburant pour la cité de destination', value: 30 },
  { type: 'resources', label: 'Stock de Médicaments', description: '+20 Santé pour la cité de destination', value: 20 },
  { type: 'resources', label: 'Caisses de Munitions', description: '+25 Armement pour la cité de destination', value: 25 },
  { type: 'resources', label: 'Réserves Alimentaires', description: '+15 Nourriture pour la cité de destination', value: 15 },
  { type: 'currency', label: 'Prime de Livraison', description: 'Paiement en monnaie d\'échange (barter credits)', value: 500 },
  { type: 'currency', label: 'Double Prime', description: 'Prime doublée pour livraison intacte', value: 1000 },
  { type: 'reputation', label: 'Réputation Commerciale', description: '+1 niveau de réputation avec la cité de destination', value: 1 },
  { type: 'reputation', label: 'Alliance Temporaire', description: 'La cité d\'origine offre une protection pendant 1 mois', value: 1 },
  { type: 'item', label: 'Pièce d\'Équipement Rare', description: 'Arme ou armure de qualité supérieure offerte par la cité', value: 1 },
  { type: 'item', label: 'Véhicule Bonus', description: 'Un véhicule supplémentaire offert pour le prochain convoi', value: 1 },
  { type: 'intel', label: 'Renseignements Stratégiques', description: 'Information secrète sur une cité rivale', value: 1 },
  { type: 'favor', label: 'Faveur du Dirigeant', description: 'Le dirigeant de la cité vous doit une faveur', value: 1 },
];

/**
 * Calculate the number of events for a convoy based on map distance.
 * @param {Object} origin - { mapX, mapY } from City model
 * @param {Object} destination - { mapX, mapY } from City model
 * @returns {number} Number of steps (5 to 20)
 */
function calculateStepCount(origin, destination) {
  if (!origin.mapX || !origin.mapY || !destination.mapX || !destination.mapY) {
    return 8; // Default if positions unknown
  }
  const dx = origin.mapX - destination.mapX;
  const dy = origin.mapY - destination.mapY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // Normalize: assume map is ~2000 units wide, scale to 5-20 steps
  const steps = Math.round(5 + (distance / 2000) * 15);
  return Math.max(5, Math.min(20, steps));
}

/**
 * Pick a weighted random category for an event based on difficulty.
 * Higher difficulty = more encounters, less calm.
 * @param {number} difficulty 0-100
 * @returns {string} category
 */
function pickCategory(difficulty) {
  const r = Math.random() * 100;
  // Scale thresholds by difficulty
  const encounterChance = 20 + (difficulty * 0.4); // 20-60%
  const climateChance = 15 + (difficulty * 0.15);   // 15-30%
  const mechanicalChance = 10;                       // 10% fixed
  const calmChance = 100 - encounterChance - climateChance - mechanicalChance;

  if (r < encounterChance) return 'encounter';
  if (r < encounterChance + climateChance) return 'climate';
  if (r < encounterChance + climateChance + mechanicalChance) return 'mechanical';
  return 'calm';
}

/**
 * Pick a random event from the appropriate pool.
 * @param {string} category
 * @param {string|null} biomeKey - City keyword for biome influence
 * @param {number} difficulty
 * @returns {Object} { title, description, severity, category, biomeSource }
 */
function pickEvent(category, biomeKey, difficulty) {
  let pool = [];

  // If we have biome-specific events and this category exists there, mix them in
  if (biomeKey && BIOME_EVENTS[biomeKey] && BIOME_EVENTS[biomeKey][category]) {
    pool = [...BIOME_EVENTS[biomeKey][category]];
  }

  // Add generic events for this category
  if (GENERIC_EVENTS[category]) {
    pool = [...pool, ...GENERIC_EVENTS[category]];
  }

  if (pool.length === 0) {
    // Fallback to a calm event
    pool = GENERIC_EVENTS.calm;
  }

  // Filter by severity based on difficulty
  if (difficulty > 70) {
    // High difficulty: prefer high/critical events
    const hardPool = pool.filter(e => e.severity === 'high' || e.severity === 'critical');
    if (hardPool.length > 0) pool = hardPool;
  } else if (difficulty < 30) {
    // Low difficulty: prefer low/medium events
    const easyPool = pool.filter(e => e.severity === 'low' || e.severity === 'medium');
    if (easyPool.length > 0) pool = easyPool;
  }

  const event = pool[Math.floor(Math.random() * pool.length)];

  // Generate proposed effects
  let proposedEffects = null;
  const isRestore = category === 'calm';
  const type = isRestore ? 'restore' : 'damage';
  
  let hpAmount = 0;
  let resourceAmount = 0;
  
  // Base ranges by severity
  if (isRestore) {
    hpAmount = Math.floor(Math.random() * 20) + 20; // 20-40
    resourceAmount = Math.floor(Math.random() * 15) + 15; // 15-30
  } else {
    const sev = event.severity;
    if (sev === 'low') { hpAmount = 10 + Math.floor(Math.random() * 10); resourceAmount = 10 + Math.floor(Math.random() * 10); }
    else if (sev === 'medium') { hpAmount = 20 + Math.floor(Math.random() * 20); resourceAmount = 20 + Math.floor(Math.random() * 20); }
    else if (sev === 'high') { hpAmount = 40 + Math.floor(Math.random() * 20); resourceAmount = 40 + Math.floor(Math.random() * 20); }
    else { hpAmount = 60 + Math.floor(Math.random() * 40); resourceAmount = 60 + Math.floor(Math.random() * 40); }
  }

  const resources = ['fuel', 'water', 'food', 'medicine', 'ammo'];
  const primaryRes = resources[Math.floor(Math.random() * resources.length)];

  proposedEffects = {
    type,
    baseVehicleHp: hpAmount,
    baseResource: {
      [primaryRes]: resourceAmount
    }
  };

  return {
    ...event,
    category,
    biomeSource: biomeKey || null,
    effects: JSON.stringify(proposedEffects)
  };
}

/**
 * Determine which biome keys influence this convoy route.
 * Looks at origin city name, destination city name, and any cities "in between".
 * @param {Object} originCity - Full city object with location.name
 * @param {Object} destCity - Full city object with location.name
 * @param {Array} allCities - All cities in the campaign
 * @returns {string[]} Array of biome keys
 */
function getBiomeKeys(originCity, destCity, allCities) {
  const keys = new Set();

  function extractKey(name) {
    for (const key of Object.keys(BIOME_EVENTS)) {
      if (name && name.includes(key)) {
        keys.add(key);
      }
    }
  }

  extractKey(originCity.location?.name || originCity.name || '');
  extractKey(destCity.location?.name || destCity.name || '');

  // Check for cities that lie roughly between origin and destination
  if (originCity.mapX != null && destCity.mapX != null) {
    const minX = Math.min(originCity.mapX, destCity.mapX);
    const maxX = Math.max(originCity.mapX, destCity.mapX);
    const minY = Math.min(originCity.mapY, destCity.mapY);
    const maxY = Math.max(originCity.mapY, destCity.mapY);

    for (const city of allCities) {
      if (city.id === originCity.id || city.id === destCity.id) continue;
      if (city.mapX >= minX - 100 && city.mapX <= maxX + 100 &&
          city.mapY >= minY - 100 && city.mapY <= maxY + 100) {
        extractKey(city.location?.name || '');
      }
    }
  }

  return Array.from(keys);
}

/**
 * Generate the full event roadmap for a convoy.
 * @param {Object} params
 * @param {Object} params.originCity - Origin city with location relation
 * @param {Object} params.destCity - Destination city with location relation
 * @param {Array} params.allCities - All cities in the campaign
 * @param {number} params.difficulty - 0-100
 * @returns {Object[]} Array of event objects ready for DB insertion
 */
function generateRoadmap({ originCity, destCity, allCities, difficulty }) {
  const stepCount = calculateStepCount(originCity, destCity);
  const biomeKeys = getBiomeKeys(originCity, destCity, allCities);
  const events = [];

  // Ensure first and last events are always calm (departure/arrival)
  events.push({
    orderIndex: 0,
    category: 'calm',
    title: 'Départ du Convoi',
    description: `Le convoi quitte ${originCity.location?.name || 'la cité d\'origine'}. Les moteurs rugissent dans le désert de sel.`,
    severity: 'low',
    biomeSource: null,
    status: 'pending',
  });

  for (let i = 1; i < stepCount - 1; i++) {
    const category = pickCategory(difficulty);
    // Rotate through biome keys for variety
    const biomeKey = biomeKeys.length > 0 ? biomeKeys[i % biomeKeys.length] : null;
    const event = pickEvent(category, biomeKey, difficulty);

    events.push({
      orderIndex: i,
      ...event,
      status: 'pending',
    });
  }

  events.push({
    orderIndex: stepCount - 1,
    category: 'calm',
    title: 'Approche de la Destination',
    description: `Les tours de ${destCity.location?.name || 'la cité de destination'} apparaissent à l\'horizon. Le convoi est presque arrivé.`,
    severity: 'low',
    biomeSource: null,
    status: 'pending',
  });

  return events;
}

/**
 * Propose rewards based on convoy completion metrics.
 * @param {Object} convoy - The convoy with vehicles and resources
 * @returns {Object[]} Array of proposed reward objects
 */
function proposeRewards(convoy) {
  // Calculate a success score based on remaining resources and vehicle integrity
  const resourceScore = (convoy.fuel + convoy.water + convoy.food + convoy.medicine + convoy.ammo) / 5;
  const vehiclesAlive = convoy.vehicles ? convoy.vehicles.filter(v => !v.isDestroyed).length : 0;
  const vehiclesTotal = convoy.vehicles ? convoy.vehicles.length : 1;
  const vehicleScore = (vehiclesAlive / vehiclesTotal) * 100;
  const overallScore = (resourceScore + vehicleScore) / 2;

  // Number of rewards depends on success
  let rewardCount;
  if (overallScore >= 80) rewardCount = 5;
  else if (overallScore >= 50) rewardCount = 3;
  else if (overallScore >= 20) rewardCount = 2;
  else rewardCount = 1;

  // Difficulty multiplier for reward values
  const diffMultiplier = 0.5 + (convoy.difficulty / 100);

  // Shuffle and pick
  const shuffled = [...REWARD_POOL].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, rewardCount).map((r, i) => ({
    id: `reward_${Date.now()}_${i}`,
    ...r,
    value: Math.round(r.value * diffMultiplier),
  }));

  return picked;
}

module.exports = {
  generateRoadmap,
  proposeRewards,
  calculateStepCount,
  BIOME_EVENTS,
  GENERIC_EVENTS,
};
