/**
 * REFERENTIEL DU LORE — version programme de `Lore et univers/Universe_Lore_v9.txt`
 *
 * CE FICHIER EST GENERE. Ne pas l'editer a la main : toute correction doit etre
 * portee dans `Universe_Lore_v9.txt` (la source d'autorite), puis regeneree par
 * `.workbuddy-ai/tmp/extraire_lore.js` + `.workbuddy-ai/tmp/generer_lore.js`.
 *
 * Ce qu'il contient, pour les dix cites du .txt :
 *   - les champs d'identite complets, phrases RECOLLEES (le .txt est plie a
 *     ~72 colonnes, les phrases y etaient coupees en plein milieu) ;
 *   - `stats` : les parametres chiffres deja parses ;
 *   - `clock` : l'horloge de tension, quand la cite en a une chiffree ;
 *   - `lore` : les sections narratives integrales (developpement de la cite) ;
 *   - `buildings` : les lieux, avec description et PNJ structures.
 *
 * Historique : la version precedente etait une extraction ratee. Elle perdait
 * 187 866 caracteres de recit, les descriptions de lieux et l'Ile des Anciens,
 * et laissait 900 lignes sur 1171 terminees par « : ».
 */

export const loreData = {
  cities: {
  "cité du divertissement": {
    "num": "1",
    "name": "CITÉ DU DIVERTISSEMENT - \"LES FAISEURS DE RÊVES\"",
    "specialty": "arènes, spectacles, cinéma, propagande — et, sous le vernis du spectacle, une véritable place financière : plaisirs de la chair, substances, chirurgie de la chair, souvenirs de synthèse.",
    "strength": "influence culturelle et morale énorme, richesse colossale",
    "weakness": "dépend des autres pour survivre matériellement ; dirigée de fait par ses actionnaires plus que par son Doyen",
    "particularity": "connue pour ses radios et journaux de masse ; c'est la seule cité-état du monde connu structurée comme une entreprise, où le droit de vote et de parole au conseil est proportionnel à la richesse générée par chaque faction actionnaire",
    "geo": "Érigée au cœur de Rome (Ancienne Italie), utilisant le Colisée et les forums comme décors grandioses de spectacles.",
    "gps": "41.9028° N, 12.4964° E (Rome)",
    "foundation": "2138 (une fois les autres cités stabilisées, des entrepreneurs de spectacle relèvent le Colisée pour y organiser les premiers combats d'arène).",
    "params": "Santé 55, Technologie 60, Richesse 75, Carburant 50, Nourriture 50, Bonheur 95, Armement 35",
    "stats": {
      "santé": 55,
      "technologie": 60,
      "richesse": 75,
      "carburant": 50,
      "nourriture": 50,
      "bonheur": 95,
      "armement": 35
    },
    "tension": "Une crise de succession secoue la cité : son Doyen historique décline, sans héritier désigné, et quatre factions manœuvrent déjà en coulisses pour préparer sa succession (voir \"LA CRISE DE SUCCESSION\" ci-dessous). C'est précisément ce vide de pouvoir que le recrutement quadriennal de la Garde — et donc les PJ — vont venir bouleverser (voir chapitre CAMPAGNE).",
    "clock": null,
    "lore": [
      {
        "title": "LA CITÉ-ENTREPRISE : LE CONSEIL DES ACTIONNAIRES",
        "text": "À sa fondation, Cassius Rêve-d'Or n'avait ni l'or ni les matières premières pour rebâtir seul une cité digne de ce nom à partir d'un Colisée à moitié effondré et d'un peuple de survivants affamés. Plutôt que de taxer un peuple exsangue, il a proposé un marché à ceux qui détenaient déjà, dans le chaos d'après-guerre, une ressource rare : reconstruisez un bout de ma cité — un mur, un puits, une caserne — et vous en posséderez une part, pour toujours, transmissible à vos héritiers ou à quiconque vous choisirez. Les murs, les puits, le générateur, et la Garde elle-même n'ont donc jamais été financés par un trésor public : ils ont été payés, pièce par pièce, par des appels de fonds privés. Cassius pensait garder la main en conservant une part symbolique majoritaire ; un siècle plus tard, ses actionnaires ont grossi bien plus vite que lui, et il ne lui reste plus qu'un droit de veto de façade. Concrètement : chaque quartier, chaque infrastructure, chaque patrouille de la Garde est financée au prorata des parts détenues par les actionnaires qui en bénéficient le plus directement. Un quartier riche est mieux gardé, mieux entretenu, mieux éclairé qu'un quartier pauvre — non par mépris, mais parce que c'est littéralement celui qui paie le mieux. LA GARDE DE LA CITÉ EST LA SEULE VRAIE STABILITÉ DE CE MONDE POUR QUI N'EST PAS NÉ RICHE : c'est un emploi, un statut, un salaire garanti — quel que soit le nom du Doyen ou l'issue de la succession — et c'est là que les PJ seront recrutés à l'issue de la Course du Sel. Un PJ affecté à la patrouille du quartier des Sculpteurs n'aura ni le même équipement, ni les mêmes ordres, ni les mêmes dessous-de-table à refuser ou accepter, qu'un PJ affecté aux Taudis. Le poids de vote de chaque actionnaire au conseil est recalculé en continu à partir de sa valeur nette, elle-même certifiée par LE REGISTRE de la Bourse de la Douleur (voir plus haut dans ce document, section \"LE REGISTRE\"). Autrement dit : la Bourse n'a besoin d'aucun siège ni d'aucune voix pour influencer l'équilibre du pouvoir dans la Cité du Divertissement — elle n'a qu'à tenir la balance. LES CINQ ACTIONNAIRES NOTABLES ---------------------------------------------------------------------->> LES PLAISIRS DE LA CHAIR — \"LA PREMIÈRE PIERRE\" Actionnaire fondateur, propriétaire du quartier du même nom. Dans les toutes premières années, une femme dont le nom s'est perdu — on ne l'appelle plus aujourd'hui que \"la Première Pierre\" dans la tradition orale de la faction — a compris avant tout le monde que les ouvriers du chantier et les premiers gardes armés n'avaient ni or ni pièces détachées à offrir, seulement leur maigre ration et un peu de temps libre. Elle a organisé, dans une carcasse de bus calcinée, le premier commerce de réconfort de la Cité, payé en rations et en heures de corvée épargnées — un troc qui finançait déjà, en quelques mois, plus de travail sur le Mur d'Enceinte que n'importe quel autre groupe de survivants. Elle a été l'une des toutes premières à signer avec Cassius. La faction commémore encore chaque année la signature du premier contrat, rejouée en costume dans la carcasse de bus elle-même, conservée comme relique sacrée au cœur de leur quartier. Seule des cinq actionnaires à assumer et célébrer ouvertement ses origines. >> LES CHEM'ARTISTES — \"LE MENSONGE DU PREMIER REMÈDE\" Actionnaire fondateur, propriétaire du quartier du même nom. Descendants d'un petit groupe de chimistes militaires reconvertis — d'anciens fabricants de gaz incapacitants et de stimulants de combat pour une armée qui n'existait plus. À l'arrivée des premiers cas de mal des radiations, ils ont distribué un remède de fortune, présenté comme un don gratuit et désintéressé \"pour la survie de tous\" — une légende fondatrice que la faction cultive encore dans sa propagande officielle. La vérité, connue des seuls hauts initiés, est que ce premier \"don\" était déjà vendu au prix fort à qui pouvait payer, les plus pauvres servant de test grandeur nature pour ajuster les doses. Le nom même de la faction viendrait d'une private joke entre fondateurs, qui se surnommaient \"les artistes de la chimie\" — un nom qu'ils ont fini par revendiquer publiquement, avec une fierté presque décomplexée, une fois leur pouvoir économique trop établi pour être remis en question. >> LES SCULPTEURS — \"LE DON QUI N'EN ÉTAIT PAS UN\" Actionnaire fondateur, propriétaire du quartier du même nom. D'anciens chirurgiens de champ de bataille, habitués aux amputations et greffes d'urgence, qui ont d'abord soigné gratuitement les blessés des premières années par pur réflexe professionnel. Le tournant est venu le jour où une jeune combattante de l'Arène, ayant perdu un bras au combat, a proposé une fortune pour un remplacement \"parfait\" — à une condition : que rien ne trahisse, sur le sable, qu'elle ne se battait plus à armes égales. Faute de matériau organique adéquat, les chirurgiens ont utilisé — sans son consentement, profitant de son statut d'esclave de dette — le bras d'un ouvrier gravement blessé et jugé condamné. Mais un bras de chair seul n'aurait rien changé : c'est là qu'ils ont fait appel à un petit groupe de médecins de guerre spécialisés dans les implants militaires — les mêmes qui, des années plus tard, fonderaient la Cité Médicale - \"Les Blouses Blanches\" — pour fusionner ce bras organique à une ossature et une musculature cybernétiques de combat récupérées sur du matériel pré-guerre, le tout recouvert de chair greffée avec un soin si minutieux qu'aucun juge de l'Arène n'a jamais pu prouver que ce bras \"100% organique\" — condition sine qua non de la clause de combat loyal — ne l'était en réalité qu'en apparence. La combattante est devenue une légende de l'Arène, son nom encore chuchoté par les vieux parieurs du Forum des Paris ; la rumeur d'un \"bras parfait\", trop parfait pour être honnête, ressurgit à chaque génération dès qu'un nouveau champion connaît une carrière un peu trop miraculeuse. Ce premier don forcé, doublé d'une fraude sportive fondatrice et d'un pacte inavouable avec les futures Blouses Blanches, reste un sujet tabou que les Sculpteurs ne transmettent à leurs apprentis qu'en toute dernière année de formation, comme un rite de passage macabre. [NOTE MJ : la Cité Médicale conserve probablement, quelque part dans ses très vieilles archives, la trace de cette toute première collaboration — une vérité qu'elle aurait tout intérêt à voir rester enterrée.] >> LES NOSTALGICS [MJ — pied-à-terre de Bunker Oméga, secret de campagne] Actionnaire, propriétaire de son propre quartier. Ils vendent des souvenirs de synthèse : des implants ou injections qui font revivre un instant heureux, réel ou fabriqué de toutes pièces — une enfance qu'on n'a jamais eue, un parent mort qu'on peut \"revoir\" une dernière fois. Officiellement, leur technologie viendrait d'un fragment de tech pré-guerre récupéré dans les ruines. En réalité, c'est une implantation discrète de Bunker Oméga dans la Cité du Divertissement, choisie précisément parce que son pouvoir politique (la succession) et son influence culturelle sur les neuf autres cités en font une cible de choix pour une influence à long terme. La plupart des Nostalgics eux-mêmes ignorent tout du Bunker ; seuls un ou deux \"cadres\" du quartier — presque certainement d'anciens Enfants du Nord, sans qu'ils le sachent forcément — savent d'où vient réellement la technologie, et pourquoi elle est distribuée ici. [NOTE MJ : à très petite échelle, chez une poignée de clients bien choisis, les Nostalgics ne vendraient peut-être pas que du réconfort — ils testeraient, affineraient, ou planteraient des souvenirs. Ne jamais l'affirmer en jeu ; laissez le doute s'installer.] >> LA BOURSE DE LA DOULEUR [faction multi-cité, neutre — voir section \"LE REGISTRE\"] Seule actionnaire à ne posséder aucun quartier dans la Cité du Divertissement, et pourtant la plus puissante de toutes : c'est elle qui certifie, via le Registre, la valeur nette de chaque autre actionnaire — et donc son poids de vote au conseil. Présente dans les dix cités sans appartenir à aucune, elle assure les paiements et tient les comptes de la Cité entière sans jamais avoir besoin de s'asseoir à la table. LA CRISE DE SUCCESSION : QUATRE MAINS SUR LE TRÔNE DE SABLE -----------------------------------------------------------------------LE DOYEN — CASSIUS RÊVE-D'OR Fondateur de la Cité moderne, l'homme qui a eu l'idée, un siècle plus tôt, de rebâtir le Colisée pour y faire rejouer la mort en spectacle plutôt que la subir dans les rues. Il ne quitte plus le Palais du Doyen depuis trois ans ; son corps se meurt, son esprit reste d'une lucidité redoutable. Il retarde délibérément l'échéance en jouant les quatre factions les unes contre les autres, promettant sa faveur à chacune en privé. Une rumeur tenace prétend qu'il a eu un fils autrefois, mort ou disparu dans une expédition ratée vers le Nord. [NOTE MJ : à vous de décider si c'est vrai, un mensonge de propagande, ou un premier fil vers les Enfants du Nord.] >> LA GARDE — \"L'ORDRE AVANT TOUT\" Chef officieux : Rook Cendre (voir fiche : Le Mur d'Enceinte & Les Portes), agent du Réseau. Position officielle : la Garde ne doit pas se mêler de politique, juste garantir une transition sans effusion de sang. En réalité, Rook travaille à installer un successeur influençable — potentiellement recruté cette année même, parmi les PJ. Angle mort : imposer son candidat par la force ferait de la Cité un état militaire déguisé. >> LES PRODUCTEURS DE RÊVES — \"LE SPECTACLE DOIT CONTINUER\" Cheffe : Ines Poussière (voir fiche : Grande Arène de Combat), matriarche officieuse de la guilde des producteurs et diffuseurs. Candidat soutenu : Talin Ferraille (voir fiche : Théâtre des Illusions), star adorée, malléable, plus intéressé par son image que par le pouvoir réel. Angle mort : Ines sous-estime à quel point les Taudis n'ont plus faim de rêves quand ils n'ont plus de pain. >> LE PEUPLE DE L'ARÈNE — \"LE SABLE NE MENT PAS\" Chef : Corin Acier (voir fiche : Grande Arène de Combat), champion depuis six saisons, aussi aimé du peuple que redouté sur le sable. Mouvement populiste sincère, né dans les Taudis, réclamant une redistribution des recettes vers les quartiers pauvres et la fin des paris truqués de Jorn Ferraille. Angle mort : Corin est un combattant, pas un politique — vulnérable à qui saura flatter son ego ou menacer ceux qu'il aime dans les Taudis. >> LES BARONS DU JEU — \"LA CITÉ APPARTIENT À QUI LA FINANCE\" Chef : Raze Clou (voir fiche : Casino de la Ruine), fortune dépassant celle de plusieurs conseils de cités-états réunis. Achète des voix et des silences, détient des gages compromettants sur des membres des trois autres factions. Angle mort : le Doyen se meurt plus vite que prévu, et Raze n'a pas fini de retourner ses dernières pièces sur l'échiquier. >> LE SÉNAT FANTÔME [lieu et faction secrets, réservés au MJ] Sous le Forum, une douzaine de vieilles familles se réunissent en secret, masquées, se prétendant héritières directes d'un Sénat romain d'avant les bombes — un délire aristocratique qui leur donne un pouvoir bien réel : elles possèdent presque tous les actes de propriété des arènes secondaires et studios de la Cité. Le Sénat ne soutient aucune des quatre factions ouvertement : son seul but est qu'aucune ne l'emporte seule, pour continuer à tirer les ficelles quel que soit le vainqueur — un écho ironique et non coordonné du même objectif que poursuit Bunker Oméga à l'échelle du monde. Son porte-parole masqué, \"Le Premier Masque\", pourrait proposer aux PJ un accord : de l'or, un rang, une protection contre les créanciers de Raze Clou, en échange d'informations glanées de l'intérieur de la Garde. -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS -----------------------------------------------------------------------[MJ - déduites par recoupement des relations déjà écrites dans les fiches des autres cités, plus les fils déjà présents dans celle-ci (Maestro Greffe et Cité Médicale ; les Chem'Artistes et Cité Médicale).] - Cité Médicale : contact discret et méfiant, hérité d'un secret fondateur commun - \"Le Don qui n'en était pas un\" (voir Maestro Greffe, Quartier des Sculpteurs) : les tout premiers chirurgiens de la Cité Médicale ont fait leurs armes ici même, sur un \"remplacement parfait\" obtenu sans consentement. Aucune des deux cités n'a intérêt à voir cette histoire refaire surface. En surface, une rivalité commerciale plus banale existe aussi : les Chem'Artistes d'ici et les pharmaciens de la Cité Médicale se regardent en chiens de faïence, chacun accusant l'autre de vendre une dépendance déguisée en remède. - Cité de l'Eau & Alimentation : luxe contre influence - les Gardiens de la Source font payer cher l'eau des thermes et des spectacles, et s'en servent pour peser discrètement sur la crise de succession en cours, en faveur du candidat qui leur garantira les meilleurs tarifs. - Cité de l'Armement & Défense : les vétérans de l'Arène et les champions de la Sélection s'échangent parfois d'une cité à l'autre - une carrière peut commencer dans un Conseil et s'achever sous les projecteurs, ou l'inverse. - Cité des Métaux & Recyclage : acheteuse occasionnelle de curiosités et de reliques trouvées dans les ruines pour ses vitrines et ses spectacles - une clientèle parmi d'autres, mais qui paie bien pour l'inhabituel. - Cité du Carburant : cliente de luxe pour ses générateurs de spectacle - un contraste culturel savoureux entre le sacré du Sang Noir et le profane des arènes et des théâtres. - Nuke City : fournisseur discret de curiosités bien plus sombres - certains numéros de la Fosse aux Bêtes ou du Forum des Paris doivent leur attrait macabre à des \"artistes\" ou des spécimens venus de Nuke City, payés (ou vendus) à prix d'or pour leur étrangeté. Nuke City tolère ce commerce sans jamais l'assumer publiquement. - Cité Industrielle : cliente régulière pour l'entretien des mécanismes d'arène et les automates de spectacle - une relation purement commerciale, sans grande affection ni grande méfiance. - Bunker Oméga : aucune existence reconnue - mais Rook Cendre (voir Le Mur d'Enceinte) y opère déjà en agent dormant, sans que personne dans la cité ne soupçonne son existence. - L'Île des Anciens : aucun contact connu. Lieux et Personnages Notables : >> Le Marché d'Échanges [Description du lieu : Des allées colorées de néons rafistolés où l'on vend de la drogue de synthèse, de l'alcool de contrebande et des services divers. La musique y hurle sans fin.] - Orok Acier (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère Cité du Divertissement - \"Les Faiseurs de Rêves\" comme le seul havre de paix rentable. - Elara Rouage (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Ronan Froid (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> La Citerne Centrale [Description du lieu : Une ancienne fontaine publique, aujourd'hui monumentale, distribuant de l'eau aromatisée chimiquement aux habitants pour masquer le goût des cendres.] - Sura Ferraille (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Cité du Divertissement - \"Les Faiseurs de Rêves\" est la clé de la survie humaine. - Talin Noir (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Brix Soupape (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> Le Générateur Principal [Description du lieu : Des éoliennes et des générateurs à pédales actionnés par des esclaves pour fournir le courant nécessaire à l'éclairage de l'arène.] - Sia Clou (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Cité du Divertissement - \"Les Faiseurs de Rêves\" en vie à lui tout seul. - Orok Rouge (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Vesper Froid (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : D'anciens murs de marbre, recouverts de graffitis et de panneaux publicitaires post-apocalyptiques racolant pour des combats de gladiateurs.] - Rook Cendre (Capitaine de la Garde) [MJ — Archétype brisé : agent du Réseau] - Commande officiellement la défense à Le Mur d'Enceinte & Les Portes, et c'est lui qui supervise en personne le recrutement quadriennal de la Garde par convoi (voir chapitre CAMPAGNE) — un poste stratégique qu'il occupe depuis bien plus longtemps que son âge apparent ne le laisserait supposer. - C'est un agent du Réseau de longue date : sa mission est de s'assurer que le successeur du dirigeant mourant de la cité sera quelqu'un que Bunker Oméga pourra influencer — y compris, potentiellement, l'un des PJ recrutés cette année si leur profil s'y prête. - Sous tension, il lui arrive de répéter mot pour mot des phrases identiques à celles d'agents d'autres cités (\"connaît toutes les rumeurs de...\"), un tic qu'un PJ observateur pourrait recouper s'il a déjà croisé un autre agent ailleurs. - Talin Sel (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Cité du Divertissement - \"Les Faiseurs de Rêves\". - Nova Cendre (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : D'anciens théâtres et hôtels de luxe, aujourd'hui délabrés, où les spectateurs fauchés dorment à même le sol dans l'odeur de la sueur et de l'alcool.] - Talin Sel (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Vesper Soupape (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Joran Acier (Survivant Désespéré) - Répète en boucle les répliques d'un spectacle que personne d'autre ne se souvient avoir vu. - Affirme que le public rira encore quand il n'y aura plus personne dans les gradins pour rire avec lui. - Prédit que Cité du Divertissement - \"Les Faiseurs de Rêves\" jouera la même pièce jusqu'à ce que les ruines elles-mêmes applaudissent. >> Grande Arène de Combat [Description du lieu : Un colisée gargantuesque où des combattants en armures s'entretuent dans un vacarme de moteurs.] - Corin Acier (Chef Divertissement) - Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Jorn Ferraille (Spécialiste Divertissement) - Gère les paris truqués et les spectacles sanglants à Grande Arène de Combat. - Considère Grande Arène de Combat comme son propre royaume. - Ines Poussière (Ouvrier / Garde Divertissement) - Propagandiste manipulant l'opinion publique depuis Grande Arène de Combat. - Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> Studios de Radiodiffusion [Description du lieu : D'anciennes antennes remises en état, diffusant de la musique et de la propagande sur les ondes courtes.] - Gunn Froid (Chef Divertissement) - Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Silas Poussière (Spécialiste Divertissement) - Gère les paris truqués et les spectacles sanglants à Studios de Radiodiffusion. - Considère Studios de Radiodiffusion comme son propre royaume. - Elara Acier (Ouvrier / Garde Divertissement) - Propagandiste manipulant l'opinion publique depuis Studios de Radiodiffusion. - Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> Casino de la Ruine [Description du lieu : Des salles sombres remplies de tables de jeu où les seigneurs de guerre misent des cargaisons de carburant.] - Raze Clou (Chef Divertissement) - Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Ines Noir (Spécialiste Divertissement) - Gère les paris truqués et les spectacles sanglants à Casino de la Ruine. - Considère Casino de la Ruine comme son propre royaume. - Jax Sombre (Ouvrier / Garde Divertissement) - Propagandiste manipulant l'opinion publique depuis Casino de la Ruine. - Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> Théâtre des Illusions [Description du lieu : Un lieu de spectacle décadent utilisant d'anciens projecteurs holographiques pour créer des mirages.] - Talin Ferraille (Chef Divertissement) [candidat des Producteurs de Rêves à la succession] - Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\". - Manipulé en coulisses par Ines Poussière, qui compte gouverner à travers lui depuis l'ombre des studios s'il accède au pouvoir. - Brix Froid (Spécialiste Divertissement) - Gère les paris truqués et les spectacles sanglants à Théâtre des Illusions. - Considère Théâtre des Illusions comme son propre royaume. - Zane Rouage (Ouvrier / Garde Divertissement) - Propagandiste manipulant l'opinion publique depuis Théâtre des Illusions. - Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\". >> Quartier des Plaisirs de la Chair [quartier de l'actionnaire fondateur] [Description du lieu : Un dédale de lanternes rouges et de rideaux de velours élimé, organisé autour d'une vieille carcasse de bus calciné conservée comme relique — le lieu du tout premier contrat signé avec Cassius Rêve-d'Or.] - Aria Braise (Matriarche du Quartier, héritière spirituelle de la Première Pierre) - Dirige la faction avec une fierté assumée de ses origines, sans jamais chercher à les maquiller. - Finance une part disproportionnée de la Garde affectée aux Taudis voisins, par un mélange de calcul et de loyauté réelle envers les plus pauvres. - Verrait d'un bon œil que le Peuple de l'Arène l'emporte à la succession, sans oser le soutenir ouvertement au conseil. - Tomo Velours (Maître de Cérémonie de la Signature) - Organise chaque année la reconstitution rituelle du premier contrat dans la carcasse de bus. - Garde jalousement l'accès à cette relique, qu'il considère plus sacrée que n'importe quel bien matériel du quartier. >> Quartier des Chem'Artistes [quartier de l'actionnaire fondateur] [Description du lieu : Des laboratoires de fortune installés dans d'anciens hôtels de luxe, où l'air est saturé d'un parfum chimique sucré qui masque à peine l'odeur des solvants.] - Doctor Sève (Chimiste en Chef, gardien du \"Mensonge du Premier Remède\") - Perpétue la légende officielle du don gratuit d'après-guerre, tout en la revendiquant à demi-mot comme une habileté commerciale plutôt qu'une honte. - Ajuste en secret le dosage de ses produits pour maintenir une dépendance rentable sans jamais tuer trop vite sa clientèle. - Nix Fumée (Distributrice de Rue) - Écoule la production dans les Taudis et jusque dans le Quartier des Producteurs, sans jamais poser de questions sur l'origine des commandes. - Sait où trouver n'importe quelle substance dans la Cité — un contact précieux pour des PJ en quête d'informations. >> Quartier des Sculpteurs [quartier de l'actionnaire fondateur] [Description du lieu : Un ancien hôpital militaire reconverti en clinique de luxe, où l'odeur de l'antiseptique ne parvient jamais tout à fait à couvrir celle du sang.] - Maestro Greffe (Chirurgien en Chef) - Transmet le tabou fondateur (\"Le Don qui n'en était pas un\") aux apprentis en toute dernière année de formation seulement. - Entretient un contact discret et méfiant avec la Cité Médicale - \"Les Blouses Blanches\", qui pourrait un jour exhumer l'histoire de leur toute première collaboration. - Ilva Cicatrice (Courtière en Organes) - Négocie les \"dons\" volontaires ou forcés d'organes et de membres, souvent auprès de débiteurs de la Bourse de la Douleur. - Sait exactement quels combattants de l'Arène portent, sous leur peau, bien plus que ce que les juges ont approuvé. >> Quartier des Nostalgics [MJ — pied-à-terre de Bunker Oméga] [Description du lieu : Des salons tamisés aux fauteuils capitonnés, où l'on s'installe pour \"revoir\" un instant heureux sous perfusion — une odeur de fleurs artificielles et un silence presque religieux.] - Mère Songe (Cadette du Quartier, en réalité agente consciente du Réseau) - L'une des rares Nostalgics à savoir d'où vient réellement la technologie du quartier, et pourquoi elle est distribuée ici. - Choisit avec un soin extrême les clients auxquels elle propose ses services \"les plus raffinés\" — sans que quiconque comprenne encore le critère de sélection. - Petit Miroir (Technicien des Souvenirs) - Installe les implants de synthèse sans jamais se poser de questions sur leur origine exacte. - Ignore totalement la vraie nature de son employeuse — un pion innocent au cœur d'un secret de campagne. >> Le Forum des Paris [Description du lieu : Une place immense en plein air, pavée de dalles de marbre fissurées, où des dizaines de bookmakers hurlent des cotes changeantes sur des tableaux d'ardoise. On y parie sur tout : les combats de l'Arène, les courses de convois du désert, et cette année, sur l'issue de la Course du Sel elle-même.] - Silen Cassure (Maître des Cotes) - Fixe chaque matin les probabilités officielles de la Course du Sel et des combats à venir, en collaboration intéressée avec Jorn Ferraille de la Grande Arène. - Sait, bien avant le public, quel convoi rival a le plus de chances de l'emporter — une information que plusieurs factions de la succession paieraient cher. - Petra Longue-Vue (Rabatteuse) - Convainc les badauds de miser leurs dernières piécettes, contre commission versée par Silen Cassure. - Connaît par cœur les habitués du Forum ayant une dette de jeu impayée envers Raze Clou — une liste de noms qu'elle vendrait sans hésiter. >> Les Catacombes de la Mémoire [Description du lieu : Un dédale souterrain où sont archivées, sur bobines de pellicule et disques durs sauvés des ruines, des décennies de spectacles, de discours et de propagande, l'air sec et glacé grâce à un vieux système de climatisation pré-guerre entretenu à bout de bras.] - Ilio Rembobine (Archiviste en Chef) - Seul à connaître l'emplacement exact de chaque bobine, y compris des enregistrements que le conseil voudrait voir disparaître — dont un vieux discours de Cassius Rêve-d'Or, jeune homme, mentionnant explicitement un fils. - Vend l'accès à ses archives au prix fort aux quatre factions de la succession, sans jamais choisir de camp. - Nesta Grain (Restauratrice de Pellicules) - Répare à la main les bobines rongées par le temps. - Est tombée récemment sur un enregistrement compromettant impliquant un membre du Sénat Fantôme, sans savoir ce qu'est le Sénat Fantôme ni le danger de sa découverte. >> La Fosse aux Bêtes [Description du lieu : Une ménagerie souterraine reliée à la Grande Arène par un réseau de cages et de monte-charges rouillés, où l'on garde en captivité les créatures mutantes destinées aux combats.] - Vex Museau (Dresseuse de Monstres) - Seule capable d'approcher les bêtes les plus dangereuses, au prix de cicatrices innombrables. - Sait des choses sur l'origine de certaines bêtes que le conseil préférerait garder secrètes, notamment un lien avec les tempêtes de sel radioactif du désert voisin. - Corbo Chaîne (Gardien des Cages) - Nourrit et enchaîne les créatures, indifférent à leur souffrance. - Organise, hors des heures officielles, des paris clandestins de combats non autorisés entre bêtes. >> Le Quartier des Producteurs [Description du lieu : Un ancien quartier résidentiel romain, restauré avec un luxe tape-à-l'œil de matériaux recyclés dorés à la feuille, où vivent scénaristes, animateurs radio et magnats du spectacle.] - Rennia Dorée (Scénariste en Vue) - Écrit les récits héroïques des combattants de l'Arène, transformant chaque esclave en légende ou en monstre selon les besoins du récit. - Travaille en sous-main pour Ines Poussière, chargée de \"réécrire\" l'image de Talin Ferraille en héritier naturel et sage du Doyen mourant. - Cassio Micro (Animateur Vedette) - Voix officielle des retransmissions radio de la Cité, adorée du public. - Ignore tout des manipulations politiques derrière les récits qu'on lui fait lire — un pion innocent que des PJ habiles pourraient utiliser pour révéler une vérité gênante en direct, à l'antenne. >> La Zone des Figurants [Description du lieu : En bordure des Taudis, un enchevêtrement de baraquements où logent les figurants, cascadeurs et esclaves de spectacle \"de second rang\" — ceux qui meurent dans l'arène sans jamais devenir des vedettes.] - Fennic Ombre (Doyen des Figurants) - Organise la rotation des figurants envoyés à une mort presque certaine dans les combats de masse. - Tient un carnet secret listant les noms réels de tous les figurants morts sous un nom de scène — le seul mémorial qui existe pour eux. - Allié potentiel du Peuple de l'Arène, ou source précieuse pour des PJ enquêtant sur les abus du système de spectacle. ------------------------------------------------------------------------"
      }
    ],
    "buildings": {
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Des allées colorées de néons rafistolés où l'on vend de la drogue de synthèse, de l'alcool de contrebande et des services divers. La musique y hurle sans fin.",
        "personnages": [
          {
            "nom": "Orok Acier",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère Cité du Divertissement - \"Les Faiseurs de Rêves\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Elara Rouage",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Ronan Froid",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "Des allées colorées de néons rafistolés où l'on vend de la drogue de synthèse, de l'alcool de contrebande et des services divers. La musique y hurle sans fin.",
          "Orok Acier (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère Cité du Divertissement - \"Les Faiseurs de Rêves\" comme le seul havre de paix rentable.",
          "Elara Rouage (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Ronan Froid (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Une ancienne fontaine publique, aujourd'hui monumentale, distribuant de l'eau aromatisée chimiquement aux habitants pour masquer le goût des cendres.",
        "personnages": [
          {
            "nom": "Sura Ferraille",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Cité du Divertissement - \"Les Faiseurs de Rêves\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Talin Noir",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Brix Soupape",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "Une ancienne fontaine publique, aujourd'hui monumentale, distribuant de l'eau aromatisée chimiquement aux habitants pour masquer le goût des cendres.",
          "Sura Ferraille (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Cité du Divertissement - \"Les Faiseurs de Rêves\" est la clé de la survie humaine.",
          "Talin Noir (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Brix Soupape (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Des éoliennes et des générateurs à pédales actionnés par des esclaves pour fournir le courant nécessaire à l'éclairage de l'arène.",
        "personnages": [
          {
            "nom": "Sia Clou",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Cité du Divertissement - \"Les Faiseurs de Rêves\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Orok Rouge",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Vesper Froid",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "Des éoliennes et des générateurs à pédales actionnés par des esclaves pour fournir le courant nécessaire à l'éclairage de l'arène.",
          "Sia Clou (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Cité du Divertissement - \"Les Faiseurs de Rêves\" en vie à lui tout seul.",
          "Orok Rouge (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Vesper Froid (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "D'anciens murs de marbre, recouverts de graffitis et de panneaux publicitaires post-apocalyptiques racolant pour des combats de gladiateurs.",
        "personnages": [
          {
            "nom": "Rook Cendre",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande officiellement la défense à Le Mur d'Enceinte & Les Portes, et c'est lui qui supervise en personne le recrutement quadriennal de la Garde par convoi (voir chapitre CAMPAGNE) — un poste stratégique qu'il occupe depuis bien plus longtemps que son âge apparent ne le laisserait supposer.",
              "C'est un agent du Réseau de longue date : sa mission est de s'assurer que le successeur du dirigeant mourant de la cité sera quelqu'un que Bunker Oméga pourra influencer — y compris, potentiellement, l'un des PJ recrutés cette année si leur profil s'y prête.",
              "Sous tension, il lui arrive de répéter mot pour mot des phrases identiques à celles d'agents d'autres cités (\"connaît toutes les rumeurs de...\"), un tic qu'un PJ observateur pourrait recouper s'il a déjà croisé un autre agent ailleurs."
            ]
          },
          {
            "nom": "Talin Sel",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Nova Cendre",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Fait affaire avec les ennemis de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "D'anciens murs de marbre, recouverts de graffitis et de panneaux publicitaires post-apocalyptiques racolant pour des combats de gladiateurs.",
          "Rook Cendre (Capitaine de la Garde)",
          "Commande officiellement la défense à Le Mur d'Enceinte & Les Portes, et c'est lui qui supervise en personne le recrutement quadriennal de la Garde par convoi (voir chapitre CAMPAGNE) — un poste stratégique qu'il occupe depuis bien plus longtemps que son âge apparent ne le laisserait supposer.",
          "C'est un agent du Réseau de longue date : sa mission est de s'assurer que le successeur du dirigeant mourant de la cité sera quelqu'un que Bunker Oméga pourra influencer — y compris, potentiellement, l'un des PJ recrutés cette année si leur profil s'y prête.",
          "Sous tension, il lui arrive de répéter mot pour mot des phrases identiques à celles d'agents d'autres cités (\"connaît toutes les rumeurs de...\"), un tic qu'un PJ observateur pourrait recouper s'il a déjà croisé un autre agent ailleurs.",
          "Talin Sel (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Nova Cendre (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Fait affaire avec les ennemis de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "D'anciens théâtres et hôtels de luxe, aujourd'hui délabrés, où les spectateurs fauchés dorment à même le sol dans l'odeur de la sueur et de l'alcool.",
        "personnages": [
          {
            "nom": "Talin Sel",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Vesper Soupape",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Joran Acier",
            "role": "Survivant Désespéré",
            "traits": [
              "Répète en boucle les répliques d'un spectacle que personne d'autre ne se souvient avoir vu.",
              "Affirme que le public rira encore quand il n'y aura plus personne dans les gradins pour rire avec lui.",
              "Prédit que Cité du Divertissement - \"Les Faiseurs de Rêves\" jouera la même pièce jusqu'à ce que les ruines elles-mêmes applaudissent."
            ]
          }
        ],
        "points": [
          "D'anciens théâtres et hôtels de luxe, aujourd'hui délabrés, où les spectateurs fauchés dorment à même le sol dans l'odeur de la sueur et de l'alcool.",
          "Talin Sel (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Vesper Soupape (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Joran Acier (Survivant Désespéré)",
          "Répète en boucle les répliques d'un spectacle que personne d'autre ne se souvient avoir vu.",
          "Affirme que le public rira encore quand il n'y aura plus personne dans les gradins pour rire avec lui.",
          "Prédit que Cité du Divertissement - \"Les Faiseurs de Rêves\" jouera la même pièce jusqu'à ce que les ruines elles-mêmes applaudissent."
        ]
      },
      "grande arène de combat": {
        "nom": "Grande Arène de Combat",
        "description": "Un colisée gargantuesque où des combattants en armures s'entretuent dans un vacarme de moteurs.",
        "personnages": [
          {
            "nom": "Corin Acier",
            "role": "Chef Divertissement",
            "traits": [
              "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
              "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Jorn Ferraille",
            "role": "Spécialiste Divertissement",
            "traits": [
              "Gère les paris truqués et les spectacles sanglants à Grande Arène de Combat.",
              "Considère Grande Arène de Combat comme son propre royaume."
            ]
          },
          {
            "nom": "Ines Poussière",
            "role": "Ouvrier / Garde Divertissement",
            "traits": [
              "Propagandiste manipulant l'opinion publique depuis Grande Arène de Combat.",
              "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "Un colisée gargantuesque où des combattants en armures s'entretuent dans un vacarme de moteurs.",
          "Corin Acier (Chef Divertissement)",
          "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Jorn Ferraille (Spécialiste Divertissement)",
          "Gère les paris truqués et les spectacles sanglants à Grande Arène de Combat.",
          "Considère Grande Arène de Combat comme son propre royaume.",
          "Ines Poussière (Ouvrier / Garde Divertissement)",
          "Propagandiste manipulant l'opinion publique depuis Grande Arène de Combat.",
          "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "studios de radiodiffusion": {
        "nom": "Studios de Radiodiffusion",
        "description": "D'anciennes antennes remises en état, diffusant de la musique et de la propagande sur les ondes courtes.",
        "personnages": [
          {
            "nom": "Gunn Froid",
            "role": "Chef Divertissement",
            "traits": [
              "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
              "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Silas Poussière",
            "role": "Spécialiste Divertissement",
            "traits": [
              "Gère les paris truqués et les spectacles sanglants à Studios de Radiodiffusion.",
              "Considère Studios de Radiodiffusion comme son propre royaume."
            ]
          },
          {
            "nom": "Elara Acier",
            "role": "Ouvrier / Garde Divertissement",
            "traits": [
              "Propagandiste manipulant l'opinion publique depuis Studios de Radiodiffusion.",
              "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "D'anciennes antennes remises en état, diffusant de la musique et de la propagande sur les ondes courtes.",
          "Gunn Froid (Chef Divertissement)",
          "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Silas Poussière (Spécialiste Divertissement)",
          "Gère les paris truqués et les spectacles sanglants à Studios de Radiodiffusion.",
          "Considère Studios de Radiodiffusion comme son propre royaume.",
          "Elara Acier (Ouvrier / Garde Divertissement)",
          "Propagandiste manipulant l'opinion publique depuis Studios de Radiodiffusion.",
          "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "casino de la ruine": {
        "nom": "Casino de la Ruine",
        "description": "Des salles sombres remplies de tables de jeu où les seigneurs de guerre misent des cargaisons de carburant.",
        "personnages": [
          {
            "nom": "Raze Clou",
            "role": "Chef Divertissement",
            "traits": [
              "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
              "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          },
          {
            "nom": "Ines Noir",
            "role": "Spécialiste Divertissement",
            "traits": [
              "Gère les paris truqués et les spectacles sanglants à Casino de la Ruine.",
              "Considère Casino de la Ruine comme son propre royaume."
            ]
          },
          {
            "nom": "Jax Sombre",
            "role": "Ouvrier / Garde Divertissement",
            "traits": [
              "Propagandiste manipulant l'opinion publique depuis Casino de la Ruine.",
              "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "Des salles sombres remplies de tables de jeu où les seigneurs de guerre misent des cargaisons de carburant.",
          "Raze Clou (Chef Divertissement)",
          "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Ines Noir (Spécialiste Divertissement)",
          "Gère les paris truqués et les spectacles sanglants à Casino de la Ruine.",
          "Considère Casino de la Ruine comme son propre royaume.",
          "Jax Sombre (Ouvrier / Garde Divertissement)",
          "Propagandiste manipulant l'opinion publique depuis Casino de la Ruine.",
          "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "théâtre des illusions": {
        "nom": "Théâtre des Illusions",
        "description": "Un lieu de spectacle décadent utilisant d'anciens projecteurs holographiques pour créer des mirages.",
        "personnages": [
          {
            "nom": "Talin Ferraille",
            "role": "Chef Divertissement",
            "traits": [
              "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
              "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
              "Manipulé en coulisses par Ines Poussière, qui compte gouverner à travers lui depuis l'ombre des studios s'il accède au pouvoir."
            ]
          },
          {
            "nom": "Brix Froid",
            "role": "Spécialiste Divertissement",
            "traits": [
              "Gère les paris truqués et les spectacles sanglants à Théâtre des Illusions.",
              "Considère Théâtre des Illusions comme son propre royaume."
            ]
          },
          {
            "nom": "Zane Rouage",
            "role": "Ouvrier / Garde Divertissement",
            "traits": [
              "Propagandiste manipulant l'opinion publique depuis Théâtre des Illusions.",
              "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
            ]
          }
        ],
        "points": [
          "Un lieu de spectacle décadent utilisant d'anciens projecteurs holographiques pour créer des mirages.",
          "Talin Ferraille (Chef Divertissement)",
          "Star locale adorée par les citoyens de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Totalement loyal envers les idéaux de Cité du Divertissement - \"Les Faiseurs de Rêves\".",
          "Manipulé en coulisses par Ines Poussière, qui compte gouverner à travers lui depuis l'ombre des studios s'il accède au pouvoir.",
          "Brix Froid (Spécialiste Divertissement)",
          "Gère les paris truqués et les spectacles sanglants à Théâtre des Illusions.",
          "Considère Théâtre des Illusions comme son propre royaume.",
          "Zane Rouage (Ouvrier / Garde Divertissement)",
          "Propagandiste manipulant l'opinion publique depuis Théâtre des Illusions.",
          "Connaît les secrets les plus sombres de Cité du Divertissement - \"Les Faiseurs de Rêves\"."
        ]
      },
      "quartier des plaisirs de la chair [quartier de l'actionnaire fondateur]": {
        "nom": "Quartier des Plaisirs de la Chair [quartier de l'actionnaire fondateur]",
        "description": "Un dédale de lanternes rouges et de rideaux de velours élimé, organisé autour d'une vieille carcasse de bus calciné conservée comme relique — le lieu du tout premier contrat signé avec Cassius Rêve-d'Or.",
        "personnages": [
          {
            "nom": "Aria Braise",
            "role": "Matriarche du Quartier, héritière spirituelle de la Première Pierre",
            "traits": [
              "Dirige la faction avec une fierté assumée de ses origines, sans jamais chercher à les maquiller.",
              "Finance une part disproportionnée de la Garde affectée aux Taudis voisins, par un mélange de calcul et de loyauté réelle envers les plus pauvres.",
              "Verrait d'un bon œil que le Peuple de l'Arène l'emporte à la succession, sans oser le soutenir ouvertement au conseil."
            ]
          },
          {
            "nom": "Tomo Velours",
            "role": "Maître de Cérémonie de la Signature",
            "traits": [
              "Organise chaque année la reconstitution rituelle du premier contrat dans la carcasse de bus.",
              "Garde jalousement l'accès à cette relique, qu'il considère plus sacrée que n'importe quel bien matériel du quartier."
            ]
          }
        ],
        "points": [
          "Un dédale de lanternes rouges et de rideaux de velours élimé, organisé autour d'une vieille carcasse de bus calciné conservée comme relique — le lieu du tout premier contrat signé avec Cassius Rêve-d'Or.",
          "Aria Braise (Matriarche du Quartier, héritière spirituelle de la Première Pierre)",
          "Dirige la faction avec une fierté assumée de ses origines, sans jamais chercher à les maquiller.",
          "Finance une part disproportionnée de la Garde affectée aux Taudis voisins, par un mélange de calcul et de loyauté réelle envers les plus pauvres.",
          "Verrait d'un bon œil que le Peuple de l'Arène l'emporte à la succession, sans oser le soutenir ouvertement au conseil.",
          "Tomo Velours (Maître de Cérémonie de la Signature)",
          "Organise chaque année la reconstitution rituelle du premier contrat dans la carcasse de bus.",
          "Garde jalousement l'accès à cette relique, qu'il considère plus sacrée que n'importe quel bien matériel du quartier."
        ]
      },
      "quartier des chem'artistes [quartier de l'actionnaire fondateur]": {
        "nom": "Quartier des Chem'Artistes [quartier de l'actionnaire fondateur]",
        "description": "Des laboratoires de fortune installés dans d'anciens hôtels de luxe, où l'air est saturé d'un parfum chimique sucré qui masque à peine l'odeur des solvants.",
        "personnages": [
          {
            "nom": "Doctor Sève",
            "role": "Chimiste en Chef, gardien du \"Mensonge du Premier Remède\"",
            "traits": [
              "Perpétue la légende officielle du don gratuit d'après-guerre, tout en la revendiquant à demi-mot comme une habileté commerciale plutôt qu'une honte.",
              "Ajuste en secret le dosage de ses produits pour maintenir une dépendance rentable sans jamais tuer trop vite sa clientèle."
            ]
          },
          {
            "nom": "Nix Fumée",
            "role": "Distributrice de Rue",
            "traits": [
              "Écoule la production dans les Taudis et jusque dans le Quartier des Producteurs, sans jamais poser de questions sur l'origine des commandes.",
              "Sait où trouver n'importe quelle substance dans la Cité — un contact précieux pour des PJ en quête d'informations."
            ]
          }
        ],
        "points": [
          "Des laboratoires de fortune installés dans d'anciens hôtels de luxe, où l'air est saturé d'un parfum chimique sucré qui masque à peine l'odeur des solvants.",
          "Doctor Sève (Chimiste en Chef, gardien du \"Mensonge du Premier Remède\")",
          "Perpétue la légende officielle du don gratuit d'après-guerre, tout en la revendiquant à demi-mot comme une habileté commerciale plutôt qu'une honte.",
          "Ajuste en secret le dosage de ses produits pour maintenir une dépendance rentable sans jamais tuer trop vite sa clientèle.",
          "Nix Fumée (Distributrice de Rue)",
          "Écoule la production dans les Taudis et jusque dans le Quartier des Producteurs, sans jamais poser de questions sur l'origine des commandes.",
          "Sait où trouver n'importe quelle substance dans la Cité — un contact précieux pour des PJ en quête d'informations."
        ]
      },
      "quartier des sculpteurs [quartier de l'actionnaire fondateur]": {
        "nom": "Quartier des Sculpteurs [quartier de l'actionnaire fondateur]",
        "description": "Un ancien hôpital militaire reconverti en clinique de luxe, où l'odeur de l'antiseptique ne parvient jamais tout à fait à couvrir celle du sang.",
        "personnages": [
          {
            "nom": "Maestro Greffe",
            "role": "Chirurgien en Chef",
            "traits": [
              "Transmet le tabou fondateur (\"Le Don qui n'en était pas un\") aux apprentis en toute dernière année de formation seulement.",
              "Entretient un contact discret et méfiant avec la Cité Médicale - \"Les Blouses Blanches\", qui pourrait un jour exhumer l'histoire de leur toute première collaboration."
            ]
          },
          {
            "nom": "Ilva Cicatrice",
            "role": "Courtière en Organes",
            "traits": [
              "Négocie les \"dons\" volontaires ou forcés d'organes et de membres, souvent auprès de débiteurs de la Bourse de la Douleur.",
              "Sait exactement quels combattants de l'Arène portent, sous leur peau, bien plus que ce que les juges ont approuvé."
            ]
          }
        ],
        "points": [
          "Un ancien hôpital militaire reconverti en clinique de luxe, où l'odeur de l'antiseptique ne parvient jamais tout à fait à couvrir celle du sang.",
          "Maestro Greffe (Chirurgien en Chef)",
          "Transmet le tabou fondateur (\"Le Don qui n'en était pas un\") aux apprentis en toute dernière année de formation seulement.",
          "Entretient un contact discret et méfiant avec la Cité Médicale - \"Les Blouses Blanches\", qui pourrait un jour exhumer l'histoire de leur toute première collaboration.",
          "Ilva Cicatrice (Courtière en Organes)",
          "Négocie les \"dons\" volontaires ou forcés d'organes et de membres, souvent auprès de débiteurs de la Bourse de la Douleur.",
          "Sait exactement quels combattants de l'Arène portent, sous leur peau, bien plus que ce que les juges ont approuvé."
        ]
      },
      "quartier des nostalgics [mj — pied-à-terre de bunker oméga]": {
        "nom": "Quartier des Nostalgics [MJ — pied-à-terre de Bunker Oméga]",
        "description": "Des salons tamisés aux fauteuils capitonnés, où l'on s'installe pour \"revoir\" un instant heureux sous perfusion — une odeur de fleurs artificielles et un silence presque religieux.",
        "personnages": [
          {
            "nom": "Mère Songe",
            "role": "Cadette du Quartier, en réalité agente consciente du Réseau",
            "traits": [
              "L'une des rares Nostalgics à savoir d'où vient réellement la technologie du quartier, et pourquoi elle est distribuée ici.",
              "Choisit avec un soin extrême les clients auxquels elle propose ses services \"les plus raffinés\" — sans que quiconque comprenne encore le critère de sélection."
            ]
          },
          {
            "nom": "Petit Miroir",
            "role": "Technicien des Souvenirs",
            "traits": [
              "Installe les implants de synthèse sans jamais se poser de questions sur leur origine exacte.",
              "Ignore totalement la vraie nature de son employeuse — un pion innocent au cœur d'un secret de campagne."
            ]
          }
        ],
        "points": [
          "Des salons tamisés aux fauteuils capitonnés, où l'on s'installe pour \"revoir\" un instant heureux sous perfusion — une odeur de fleurs artificielles et un silence presque religieux.",
          "Mère Songe (Cadette du Quartier, en réalité agente consciente du Réseau)",
          "L'une des rares Nostalgics à savoir d'où vient réellement la technologie du quartier, et pourquoi elle est distribuée ici.",
          "Choisit avec un soin extrême les clients auxquels elle propose ses services \"les plus raffinés\" — sans que quiconque comprenne encore le critère de sélection.",
          "Petit Miroir (Technicien des Souvenirs)",
          "Installe les implants de synthèse sans jamais se poser de questions sur leur origine exacte.",
          "Ignore totalement la vraie nature de son employeuse — un pion innocent au cœur d'un secret de campagne."
        ]
      },
      "le forum des paris": {
        "nom": "Le Forum des Paris",
        "description": "Une place immense en plein air, pavée de dalles de marbre fissurées, où des dizaines de bookmakers hurlent des cotes changeantes sur des tableaux d'ardoise. On y parie sur tout : les combats de l'Arène, les courses de convois du désert, et cette année, sur l'issue de la Course du Sel elle-même.",
        "personnages": [
          {
            "nom": "Silen Cassure",
            "role": "Maître des Cotes",
            "traits": [
              "Fixe chaque matin les probabilités officielles de la Course du Sel et des combats à venir, en collaboration intéressée avec Jorn Ferraille de la Grande Arène.",
              "Sait, bien avant le public, quel convoi rival a le plus de chances de l'emporter — une information que plusieurs factions de la succession paieraient cher."
            ]
          },
          {
            "nom": "Petra Longue-Vue",
            "role": "Rabatteuse",
            "traits": [
              "Convainc les badauds de miser leurs dernières piécettes, contre commission versée par Silen Cassure.",
              "Connaît par cœur les habitués du Forum ayant une dette de jeu impayée envers Raze Clou — une liste de noms qu'elle vendrait sans hésiter."
            ]
          }
        ],
        "points": [
          "Une place immense en plein air, pavée de dalles de marbre fissurées, où des dizaines de bookmakers hurlent des cotes changeantes sur des tableaux d'ardoise. On y parie sur tout : les combats de l'Arène, les courses de convois du désert, et cette année, sur l'issue de la Course du Sel elle-même.",
          "Silen Cassure (Maître des Cotes)",
          "Fixe chaque matin les probabilités officielles de la Course du Sel et des combats à venir, en collaboration intéressée avec Jorn Ferraille de la Grande Arène.",
          "Sait, bien avant le public, quel convoi rival a le plus de chances de l'emporter — une information que plusieurs factions de la succession paieraient cher.",
          "Petra Longue-Vue (Rabatteuse)",
          "Convainc les badauds de miser leurs dernières piécettes, contre commission versée par Silen Cassure.",
          "Connaît par cœur les habitués du Forum ayant une dette de jeu impayée envers Raze Clou — une liste de noms qu'elle vendrait sans hésiter."
        ]
      },
      "les catacombes de la mémoire": {
        "nom": "Les Catacombes de la Mémoire",
        "description": "Un dédale souterrain où sont archivées, sur bobines de pellicule et disques durs sauvés des ruines, des décennies de spectacles, de discours et de propagande, l'air sec et glacé grâce à un vieux système de climatisation pré-guerre entretenu à bout de bras.",
        "personnages": [
          {
            "nom": "Ilio Rembobine",
            "role": "Archiviste en Chef",
            "traits": [
              "Seul à connaître l'emplacement exact de chaque bobine, y compris des enregistrements que le conseil voudrait voir disparaître — dont un vieux discours de Cassius Rêve-d'Or, jeune homme, mentionnant explicitement un fils.",
              "Vend l'accès à ses archives au prix fort aux quatre factions de la succession, sans jamais choisir de camp."
            ]
          },
          {
            "nom": "Nesta Grain",
            "role": "Restauratrice de Pellicules",
            "traits": [
              "Répare à la main les bobines rongées par le temps.",
              "Est tombée récemment sur un enregistrement compromettant impliquant un membre du Sénat Fantôme, sans savoir ce qu'est le Sénat Fantôme ni le danger de sa découverte."
            ]
          }
        ],
        "points": [
          "Un dédale souterrain où sont archivées, sur bobines de pellicule et disques durs sauvés des ruines, des décennies de spectacles, de discours et de propagande, l'air sec et glacé grâce à un vieux système de climatisation pré-guerre entretenu à bout de bras.",
          "Ilio Rembobine (Archiviste en Chef)",
          "Seul à connaître l'emplacement exact de chaque bobine, y compris des enregistrements que le conseil voudrait voir disparaître — dont un vieux discours de Cassius Rêve-d'Or, jeune homme, mentionnant explicitement un fils.",
          "Vend l'accès à ses archives au prix fort aux quatre factions de la succession, sans jamais choisir de camp.",
          "Nesta Grain (Restauratrice de Pellicules)",
          "Répare à la main les bobines rongées par le temps.",
          "Est tombée récemment sur un enregistrement compromettant impliquant un membre du Sénat Fantôme, sans savoir ce qu'est le Sénat Fantôme ni le danger de sa découverte."
        ]
      },
      "la fosse aux bêtes": {
        "nom": "La Fosse aux Bêtes",
        "description": "Une ménagerie souterraine reliée à la Grande Arène par un réseau de cages et de monte-charges rouillés, où l'on garde en captivité les créatures mutantes destinées aux combats.",
        "personnages": [
          {
            "nom": "Vex Museau",
            "role": "Dresseuse de Monstres",
            "traits": [
              "Seule capable d'approcher les bêtes les plus dangereuses, au prix de cicatrices innombrables.",
              "Sait des choses sur l'origine de certaines bêtes que le conseil préférerait garder secrètes, notamment un lien avec les tempêtes de sel radioactif du désert voisin."
            ]
          },
          {
            "nom": "Corbo Chaîne",
            "role": "Gardien des Cages",
            "traits": [
              "Nourrit et enchaîne les créatures, indifférent à leur souffrance.",
              "Organise, hors des heures officielles, des paris clandestins de combats non autorisés entre bêtes."
            ]
          }
        ],
        "points": [
          "Une ménagerie souterraine reliée à la Grande Arène par un réseau de cages et de monte-charges rouillés, où l'on garde en captivité les créatures mutantes destinées aux combats.",
          "Vex Museau (Dresseuse de Monstres)",
          "Seule capable d'approcher les bêtes les plus dangereuses, au prix de cicatrices innombrables.",
          "Sait des choses sur l'origine de certaines bêtes que le conseil préférerait garder secrètes, notamment un lien avec les tempêtes de sel radioactif du désert voisin.",
          "Corbo Chaîne (Gardien des Cages)",
          "Nourrit et enchaîne les créatures, indifférent à leur souffrance.",
          "Organise, hors des heures officielles, des paris clandestins de combats non autorisés entre bêtes."
        ]
      },
      "le quartier des producteurs": {
        "nom": "Le Quartier des Producteurs",
        "description": "Un ancien quartier résidentiel romain, restauré avec un luxe tape-à-l'œil de matériaux recyclés dorés à la feuille, où vivent scénaristes, animateurs radio et magnats du spectacle.",
        "personnages": [
          {
            "nom": "Rennia Dorée",
            "role": "Scénariste en Vue",
            "traits": [
              "Écrit les récits héroïques des combattants de l'Arène, transformant chaque esclave en légende ou en monstre selon les besoins du récit.",
              "Travaille en sous-main pour Ines Poussière, chargée de \"réécrire\" l'image de Talin Ferraille en héritier naturel et sage du Doyen mourant."
            ]
          },
          {
            "nom": "Cassio Micro",
            "role": "Animateur Vedette",
            "traits": [
              "Voix officielle des retransmissions radio de la Cité, adorée du public.",
              "Ignore tout des manipulations politiques derrière les récits qu'on lui fait lire — un pion innocent que des PJ habiles pourraient utiliser pour révéler une vérité gênante en direct, à l'antenne."
            ]
          }
        ],
        "points": [
          "Un ancien quartier résidentiel romain, restauré avec un luxe tape-à-l'œil de matériaux recyclés dorés à la feuille, où vivent scénaristes, animateurs radio et magnats du spectacle.",
          "Rennia Dorée (Scénariste en Vue)",
          "Écrit les récits héroïques des combattants de l'Arène, transformant chaque esclave en légende ou en monstre selon les besoins du récit.",
          "Travaille en sous-main pour Ines Poussière, chargée de \"réécrire\" l'image de Talin Ferraille en héritier naturel et sage du Doyen mourant.",
          "Cassio Micro (Animateur Vedette)",
          "Voix officielle des retransmissions radio de la Cité, adorée du public.",
          "Ignore tout des manipulations politiques derrière les récits qu'on lui fait lire — un pion innocent que des PJ habiles pourraient utiliser pour révéler une vérité gênante en direct, à l'antenne."
        ]
      },
      "la zone des figurants": {
        "nom": "La Zone des Figurants",
        "description": "En bordure des Taudis, un enchevêtrement de baraquements où logent les figurants, cascadeurs et esclaves de spectacle \"de second rang\" — ceux qui meurent dans l'arène sans jamais devenir des vedettes.",
        "personnages": [
          {
            "nom": "Fennic Ombre",
            "role": "Doyen des Figurants",
            "traits": [
              "Organise la rotation des figurants envoyés à une mort presque certaine dans les combats de masse.",
              "Tient un carnet secret listant les noms réels de tous les figurants morts sous un nom de scène — le seul mémorial qui existe pour eux.",
              "Allié potentiel du Peuple de l'Arène, ou source précieuse pour des PJ enquêtant sur les abus du système de spectacle."
            ]
          }
        ],
        "points": [
          "En bordure des Taudis, un enchevêtrement de baraquements où logent les figurants, cascadeurs et esclaves de spectacle \"de second rang\" — ceux qui meurent dans l'arène sans jamais devenir des vedettes.",
          "Fennic Ombre (Doyen des Figurants)",
          "Organise la rotation des figurants envoyés à une mort presque certaine dans les combats de masse.",
          "Tient un carnet secret listant les noms réels de tous les figurants morts sous un nom de scène — le seul mémorial qui existe pour eux.",
          "Allié potentiel du Peuple de l'Arène, ou source précieuse pour des PJ enquêtant sur les abus du système de spectacle."
        ]
      }
    }
  },
  "cité médicale": {
    "num": "2",
    "name": "CITÉ MÉDICALE - \"LES BLOUSES BLANCHES\"",
    "specialty": "médicaments, chirurgie, prothèses, vaccins",
    "strength": "indispensable pour soigner blessures, maladies et radiations",
    "weakness": "dépend des autres pour carburant et nourriture",
    "particularity": "dirigée par un Conseil des Docteurs divisé en branches rivales, où le prestige de chaque archi-médecin dépend des résultats qu'il rapporte au Conseil — jamais des moyens employés pour les obtenir",
    "geo": "Bâtie sur les ruines d'Alexandrie (Ancienne Égypte), renouant avec son passé de centre du savoir.",
    "gps": "31.2001° N, 29.9187° E (Alexandrie)",
    "foundation": "2112 (un noyau de médecins et chercheurs rescapés y fonde le premier hôpital fortifié).",
    "params": "Santé 95, Technologie 80, Richesse 65, Carburant 25, Nourriture 35, Bonheur 50, Armement 50",
    "stats": {
      "santé": 95,
      "technologie": 80,
      "richesse": 65,
      "carburant": 25,
      "nourriture": 35,
      "bonheur": 50,
      "armement": 50
    },
    "tension": "Le Laboratoire de Virologie dissimule une souche de peste pré-guerre réveillée par une expérience ratée. Le Conseil des Docteurs impose un silence absolu pour éviter la panique et l'embargo des autres cités, mais des cas isolés commencent déjà à apparaître dans les Taudis.",
    "clock": null,
    "lore": [
      {
        "title": "LA DETTE MÉDICALE : SOIGNER CONTRE SERVITUDE",
        "text": "Personne n'est jamais refusé aux portes de la Cité Médicale — c'est sa fierté officielle, gravée au fronton du Mur d'Enceinte. Ce que la fierté officielle tait, c'est comment on paie quand on n'a pas d'or. Un patient sans fortune peut gager ses soins auprès de la Bourse de la Douleur (voir \"LE REGISTRE\"), comme n'importe quelle autre dette du bassin méditerranéen. Mais la Bourse a appris, avec le temps, à détecter l'intelligence et l'aptitude chez un débiteur — et un esprit prometteur vaut, à ses yeux, infiniment plus qu'un remboursement en or étalé sur quelques années. Dans ce cas, elle ne propose jamais un simple crédit : elle pousse le débiteur, souvent un adolescent ou un jeune adulte encore malléable, vers un contrat d'apprentissage médical de quinze ans — logement, formation, nourriture à peine suffisante, en échange de gardes interminables dans les services les plus exigeants de la Cité. Le débiteur devient, sur le papier, un futur médecin ; dans les faits, une main-d'œuvre épuisée et non rémunérée pendant une décennie et demie. C'est cette servitude structurelle qui explique, plus que tout autre facteur, l'écart de qualité entre les soins \"premium\" — dispensés par des médecins reposés, formés à leur rythme, payés en or par les riches patients des autres cités — et les soins ordinaires des Taudis et des quartiers pauvres, où des internes à bout de force, parfois éveillés depuis trente heures d'affilée, appliquent des protocoles qu'on ne leur a laissé le temps ni d'apprendre, ni de questionner. Le Conseil des Docteurs présente cet écart comme une simple question de moyens ; en réalité, il repose entièrement sur l'exploitation de ses propres meilleurs esprits. LE CONSEIL DES DOCTEURS -----------------------------------------------------------------------Le Conseil n'est pas un corps uni : c'est une arène feutrée où chaque archi-médecin défend sa branche, son budget, et sa réputation, souvent au détriment des patients qu'il est censé servir. Deux tendances s'opposent en permanence : - LES CONSERVATEURS, qui protègent la réputation et l'autorité de la Cité Médicale à tout prix — c'est cette faction qui impose le silence absolu sur la souche de peste réveillée au Laboratoire de Virologie, terrifiée à l'idée d'un embargo des neuf autres cités. - LES PROGRESSISTES, qui réclament des méthodes plus radicales pour faire avancer la médecine, quitte à multiplier les essais sur des cobayes issus des Taudis ou des apprentis liés par dette — une ligne qui a produit, avec le temps, plusieurs des dérives les plus sombres de la Cité (voir \"LES APAISEURS\" et \"LES GREFFIERS DU TEMPS\" ci-dessous). Aucune des deux tendances n'a jamais le monopole du Conseil : elles se neutralisent en permanence, ce qui explique pourquoi aucune dérive n'est jamais corrigée ni jamais pleinement dénoncée — chaque camp tient sur l'autre assez de leviers de chantage pour préférer le statu quo à une réforme risquée. -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS -----------------------------------------------------------------------[MJ - déduites par recoupement des relations déjà écrites dans les fiches des autres cités, plus les fils déjà présents dans celle-ci (Zane Sang et les Chem'Artistes du Divertissement).] - Cité du Divertissement : contact discret et méfiant, hérité d'un secret fondateur commun - \"Le Don qui n'en était pas un\" (voir Cité du Divertissement, Quartier des Sculpteurs) : les tout premiers médecins de la Cité se sont formés là-bas, sur un \"remplacement parfait\" obtenu sans consentement. En surface, une rivalité commerciale plus banale existe aussi : Zane Sang (voir Usine de Synthèse de Médicaments) méprise ouvertement les Chem'Artistes du Divertissement comme des \"charlatans qui vendent l'oubli plutôt que le remède\" - sans jamais admettre que ses propres antidouleurs créent, eux aussi, une dépendance bien réelle. - Cité de l'Eau & Alimentation : alliance de nécessité sincère, eau propre contre expertise médicale - fragilisée par une peur non-dite : si la peste dissimulée de la Cité venait à transiter par les échanges, l'embargo serait immédiat et sans pitié. - Cité de l'Armement & Défense : cliente captive et lucrative - achète cher les remèdes et prothèses pour ses innombrables blessés de guerre et vétérans de la Sélection. - Cité des Métaux & Recyclage : échanges mineurs et réguliers - petits groupes de passage en quête de soins ou de pièces de prothèses recyclées, rien qui ne pèse à l'échelle des deux cités. - Cité du Carburant : dépendance modérée pour les ambulances et générateurs - échanges réguliers, sans grand enjeu. - Nuke City : l'un des clients les plus désespérés et les plus lucratifs de la Cité - traitements contre les radiations et les mutations à prix d'or. Certains médecins, dans le sillage de Vulcain (voir \"Sanctuaire de Vulcain\"), considèrent en privé les cas de mutation de Nuke City comme une source d'étude inespérée, sans jamais demander un consentement bien éclairé. - Cité Industrielle : relation purement mercenaire, sans affection ni scrupule des deux côtés - la Cité fournit des médecins de campagne pour maintenir la main-d'œuvre de la Maison Ferraille juste assez en vie pour continuer à produire, contre un paiement en métal et en pièces détachées. - Bunker Oméga : aucune existence reconnue. - L'Île des Anciens : aucun contact connu. Lieux et Personnages Notables : >> LES APAISEURS — NEUROPSYCHIATRIE DU RECONDITIONNEMENT [Description du lieu : Une aile silencieuse aux murs capitonnés, où l'on traite les traumatismes de guerre et les folies radioactives qui rongent les survivants. L'air y sent le calmant et le savon, et personne n'y élève jamais la voix.] - Archidocteure Vessa Calme (Chef des Apaiseurs) - A fondé la branche pour rendre la paix intérieure à des gens brisés par la guerre et les radiations — une mission qu'elle croit encore sincèrement remplir. - Ses traitements calment autant qu'ils annihilent la volonté : \"apaiser\" un patient est devenu, en pratique, synonyme de le rendre docile et sans initiative. - Traite en priorité, et avec un empressement suspect, les apprentis les plus épuisés et rebelles du système de servitude médicale — un moyen discret de discipliner la main-d'œuvre plutôt que de la soigner, présenté en interne comme un acte de compassion envers des esprits \"trop fragiles pour continuer autrement\". - Rane Silence (Infirmier en Chef des Apaiseurs) - Administre les traitements avec une douceur qui ne varie jamais, même quand le patient supplie qu'on le laisse partir. - Commence, en secret, à douter de la nature réelle de son travail — un point d'entrée possible pour des PJ en quête d'un allié interne. >> LES GREFFIERS DU TEMPS — LA MAISON DES ORPHELINS [Description du lieu : Un ancien service de pédiatrie reconverti en orphelinat modèle, chaleureux, bien nourri, où des enfants trouvés et de jeunes migrants sans famille grandissent mieux que nulle part ailleurs dans la Cité — une vitrine de bienfaisance que toute la Cité Médicale brandit fièrement.] - Archidocteur Osrin Tendresse (Directeur de la Maison des Orphelins et Chef des Greffiers du Temps) - A développé, hanté par son incapacité à sauver ses propres parents vieillissants dans le chaos d'après-guerre, des techniques de transfusion et de greffe capables de prolonger significativement la vie — au prix de tissus jeunes et sains prélevés sur des donneurs vivants. - Dirige LE PROGRAMME DES PARRAINS : de riches donateurs des dix cités \"parrainent\" un orphelin, financent sa nourriture, son éducation, ses vêtements — un geste de générosité largement célébré qui redore l'image de toute la Cité Médicale. En échange, l'orphelinat organise des \"visites de reconnaissance\" trimestrielles où l'enfant, légèrement sédaté \"pour ne pas avoir peur de la prise de sang\", subit un \"bilan de croissance\" qui fournit en réalité le prélèvement : sang, moelle, greffons de peau, tissus, dosés avec un soin médical extrême pour ne jamais mettre sa vie en danger ni laisser de séquelle visible — seulement une fatigue chronique et une croissance légèrement ralentie, publiquement attribuée aux privations de l'après-guerre. - Supervise personnellement LE RITE DE LA GRANDE FAMILLE : quand un parrain est trop malade ou trop âgé pour se contenter de prélèvements réguliers, le Programme propose son service le plus discret et prestigieux, l'Adoption Complète. On annonce publiquement, souvent lors de la Fête des Parrains, qu'une grande famille d'une autre cité a choisi d'adopter l'enfant pour de bon. Le convoi qui l'emmène ne va nulle part : il s'arrête à la Clinique du Rite (voir ci-dessous), où l'on prélève l'ensemble de ses organes pour l'élite mourante. Le passage de l'enfant au Registre s'arrête simplement à la dernière date connue, indiscernable de celui d'un véritable départ. Osrin ne préside jamais deux Adoptions Complètes de la même façon : à chaque fois, un nouveau petit mensonge qu'il se raconte pour continuer à dormir la nuit — que cet enfant en particulier \"n'aurait de toute façon jamais eu une vraie vie\". - A remarqué, chez plusieurs pensionnaires arrivés \"du Nord\", que leurs prélèvements cicatrisent et se régénèrent toujours un peu plus vite que ceux des autres enfants — un détail qu'il note avec une simple perplexité admirative, sans jamais chercher plus loin. [NOTE MJ : deuxième indice diégétique, indépendant de celui du Registre, sur le secret des Enfants du Nord.] - Sœur Aube (Infirmière en Chef de la Maison des Orphelins) - Aime sincèrement chaque enfant sous sa garde, et ignore tout du volet le plus sombre du Programme — elle croit chaque mot de chaque annonce d'adoption. - Prépare elle-même les enfants pour leurs \"visites de reconnaissance\" et leurs départs en Adoption Complète, sans jamais se douter qu'elle les prépare en réalité pour une mort programmée. >> LA CLINIQUE DU RITE [lieu secret, réservé au MJ, à ~2h de route de la Cité] [Description du lieu : À près de deux heures de route de la Cité Médicale, un ancien complexe hospitalier militaire pré-guerre, à moitié enseveli sous le sable et les broussailles, choisi précisément parce qu'il n'apparaît sur aucune carte officielle et qu'aucun registre de blocs opératoires n'y est jamais tenu. De l'extérieur, ce ne sont que des ruines de plus dans le désert ; à l'intérieur, un unique bloc opératoire est maintenu en parfait état stérile, prêt à être activé en quelques heures pour chaque Adoption Complète.] - Docteur Verin Silencieux (Chirurgien du Rite) - Seul praticien autorisé à opérer dans ce lieu, transporté et reconduit sous escorte à chaque intervention, sans jamais connaître à l'avance l'identité du \"parrain\" bénéficiaire. - Ne pose jamais de questions et n'en a jamais posé : il considère, avec une froideur presque religieuse, que son rôle est purement technique et que la moralité de l'acte ne le concerne pas. - Les Porteurs Muets (Escorte du Convoi Privé) - Une poignée de gardes triés sur le volet, payés une fortune pour leur silence, qui conduisent l'enfant depuis la Fête des Parrains jusqu'à la Clinique du Rite sans jamais échanger un mot avec leur passager. - Ignorent, pour la plupart, la destination réelle du convoi — seul le chef d'escorte sait où il mène vraiment. >> Le Marché d'Échanges [Description du lieu : Des tentes chirurgicales de fortune où l'on troque antibiotiques, bandages et organes synthétiques. L'odeur d'antiseptique masque mal celle du sang.] - Cade Cendre (Marchand Principal) [MJ — Archétype brisé : traître, pas survivant] - Dirige officiellement les échanges au sein de Le Marché d'Échanges, jouant à merveille le rôle du commerçant intègre. - En réalité, il a mis la main sur des échantillons de la souche de peste du Laboratoire de Virologie et les revend au marché noir à des acheteurs d'autres cités — sans mesurer, ou sans se soucier, du risque d'épidémie générale qu'il fait courir à tout le bassin méditerranéen. - N'a jamais survécu à une attaque de pillards : il a inventé cette légende pour asseoir sa réputation à Cité Médicale - \"Les Blouses Blanches\". - Gunn Sel (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Cité Médicale - \"Les Blouses Blanches\". - Mira Cendre (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Cité Médicale - \"Les Blouses Blanches\". >> La Citerne Centrale [Description du lieu : Un système de filtration ultra-moderne hérité des anciens hôpitaux. L'eau y est distribuée sous contrôle médical strict pour éviter les épidémies.] - Vex Cendre (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Cité Médicale - \"Les Blouses Blanches\" est la clé de la survie humaine. - Silas Sable (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Cité Médicale - \"Les Blouses Blanches\". - Jax Froid (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Cité Médicale - \"Les Blouses Blanches\". >> Le Générateur Principal [Description du lieu : Une série de générateurs de secours d'anciens blocs opératoires, maintenus en état de marche par des ingénieurs méticuleux pour garantir le froid des morgues.] - Jax Vif (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Cité Médicale - \"Les Blouses Blanches\" en vie à lui tout seul. - Ronan Poussière (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Cité Médicale - \"Les Blouses Blanches\". - Zane Rouage (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de Cité Médicale - \"Les Blouses Blanches\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : De hautes parois lisses et stériles, avec des sas de décontamination obligatoire à l'entrée. Des gardes en tenue Hazmat veillent au grain.] - Brix Froid (Capitaine de la Garde) - Commande la défense à Le Mur d'Enceinte & Les Portes. - Vétéran impitoyable de la dernière guerre. - Ne laisse entrer personne dans Cité Médicale - \"Les Blouses Blanches\" sans pot-de-vin. - Corin Lame (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Cité Médicale - \"Les Blouses Blanches\". - Finch Noir (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de Cité Médicale - \"Les Blouses Blanches\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : D'anciens services de pédiatrie et de gériatrie reconvertis en dortoirs surpeuplés. Des lits d'hôpitaux s'alignent dans de longs couloirs froids.] - Bren Acier (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Cité Médicale - \"Les Blouses Blanches\". - Sura Froid (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Cité Médicale - \"Les Blouses Blanches\". - Jax Sel (Survivant Désespéré) - Erre entre les salles de quarantaine désaffectées en récitant des noms de patients morts avant la Seconde Guerre. - Affirme voir la maladie avant qu'elle ne se déclare, rien qu'au visage des gens. - Prédit que Cité Médicale - \"Les Blouses Blanches\" sera emportée par un mal qu'elle aura elle-même cultivé. >> Laboratoire de Virologie [Description du lieu : Des salles blanches hermétiques où des savants en combinaison étudient les souches de virus d'avant-guerre.] - Archidocteure Sia Noir (Chef de la Virologie, Conservatrice) - A découvert, par une expérience ratée, la souche de peste pré-guerre qui menace désormais la Cité — et se bat au Conseil pour imposer le silence absolu, convaincue qu'un aveu public signerait l'embargo et la ruine de tous. - Sait que Cade Cendre (voir Le Marché d'Échanges) revend des échantillons au marché noir, mais préfère fermer les yeux plutôt que d'ouvrir une enquête qui exposerait sa propre négligence initiale. - Ryn Soupape (Chercheur Progressiste) - Convaincu que seule une étude plus poussée de la souche — quitte à l'inoculer sciemment à des patients volontaires de la dette médicale, sous couvert de \"traitement expérimental\" — permettra de trouver un vaccin à temps. - S'oppose ouvertement à Sia Noir au Conseil, chacun détenant assez de preuves sur les fautes de l'autre pour le faire taire sans jamais porter le coup de grâce. - Meya Sang (Technicienne de Laboratoire) - Infectée par la peste, cache ses symptômes tout en continuant de travailler, terrifiée à l'idée d'être mise au ban si la vérité éclate. >> Usine de Synthèse de Médicaments [Description du lieu : Des cuves immenses mélangeant des composés chimiques pour produire les antibiotiques vitaux de la région.] - Zane Sang (Maîtresse des Cuves) - Dirige la production d'antibiotiques et d'antidouleurs qui maintient toute la Cité en vie, avec une rigueur presque obsessionnelle sur les dosages. - Entretient une rivalité commerciale discrète avec les Chem'Artistes de la Cité du Divertissement, qu'elle méprise ouvertement comme des \"charlatans qui vendent l'oubli plutôt que le remède\" — sans jamais admettre que ses propres antidouleurs créent, eux aussi, une dépendance bien réelle chez les patients les plus pauvres. - Joran Lame (Apprenti Lié par Dette, 4e année sur 15) - Enchaîne les gardes de nuit à surveiller les cuves, épuisé, payé en à peine de quoi manger — l'incarnation vivante de ce que coûte la dette médicale à ceux qui la portent. - Rêve en secret de dénoncer les conditions de son contrat, sans savoir à qui s'adresser sans se faire immédiatement discipliner par les Apaiseurs. >> Unité de Quarantaine Sévère [Description du lieu : Un secteur condamné où sont parqués les cas d'irradiation sévère et les mutations incontrôlables.] - Sia Lame (Responsable de la Quarantaine) - Gère avec une froideur professionnelle les cas les plus désespérés — irradiés, mutants, désormais aussi les premiers cas isolés de peste échappés du silence du Conseil. - Applique un tri implicite mais jamais formalisé : les patients premium reçoivent des chambres individuelles et des traitements expérimentaux avancés ; les autres, un lit dans un couloir commun et un pronostic qu'on ne prend pas la peine de leur expliquer en détail. - Zane Plomb (Garde de Quarantaine) - A ordre de tirer à vue sur quiconque tenterait de fuir le secteur, mutant ou non. - Commence à se demander pourquoi certains patients \"nordistes\" récemment admis récupèrent d'une irradiation sévère bien plus vite que la normale ne le voudrait — une question qu'il n'a encore posée à personne. >> LE SANCTUAIRE DE VULCAIN — LA PLUS VIEILLE FACTION DE LA CITÉ [Description du lieu : D'immenses forges chirurgicales, mi-atelier mi-temple, où la chaleur des fonderies se mêle à l'odeur froide de l'antiseptique. Aux murs, des moulages en bronze de membres augmentés, exposés comme des reliques ou des œuvres d'art. Le nom vient du dieu forgeron boiteux des légendes anciennes, celui qui, incapable de marcher sans aide, se forgea lui-même des jambes d'or et des servants de métal pour compenser son infirmité — un mythe fondateur que la faction cultive comme excuse à peine voilée de sa propre démesure. C'est la plus ancienne institution organisée de toute la Cité Médicale, plus vieille que le Conseil des Docteurs lui-même : ses tout premiers membres sont le petit groupe de médecins de guerre qui a aidé les Sculpteurs à fusionner leur tout premier \"bras parfait\" — l'origine commune que les deux factions partagent, et qu'aucune des deux n'a jamais eu intérêt à révéler.] - VULCAIN (Grand Ancien du Sanctuaire, l'homme le plus augmenté et le plus influent de la Cité Médicale) - Personne ne connaît son vrai nom ni son âge exact ; certains dans la Cité pensent sincèrement qu'un seul homme dirige le Sanctuaire depuis un siècle — et ils n'ont pas tort. Enfant, il a vu son propre grand-père — l'un des chirurgiens fondateurs des Sculpteurs — fusionner le tout premier \"bras parfait\" sur une jeune combattante de l'Arène, et il l'a vue ensuite remporter combat après combat avec une puissance que nul adversaire ne pouvait expliquer. Cette image d'enfance ne l'a plus jamais quitté : toute sa vie, toute la fondation du Sanctuaire, n'est qu'une tentative obsessionnelle de retrouver et de dépasser ce prodige originel, sur son propre corps si nécessaire. - Ses yeux, ses bras, ses jambes, son cœur — presque tout en lui a été remplacé, par ses propres soins, avec ce que la technologie pré-guerre a produit de plus précieux. Il ne loue rien à lui-même : il possède, en pur et en propre, l'équivalent d'une petite armée de clients en implants qu'il ne cédera jamais. - Son pouvoir ne s'use pas au fil des rivalités du Conseil des Docteurs parce qu'il ne dépend d'aucun des deux camps (Conservateurs ou Progressistes) pour exister — Vulcain plane au-dessus de leurs querelles, craint et respecté des deux. - [SECRET DE CAMPAGNE] Personne, pas même Osrin Tendresse, n'ose interroger l'identité réelle du \"parrain\" le plus généreux et le plus régulier de la Maison des Orphelins, qui revient sous un nom différent à chaque génération. C'est Vulcain. Il abuse depuis des décennies du Programme des Parrains et du Rite de la Grande Famille — une jeunesse organique sans cesse rafraîchie par les greffons d'enfants qu'il ne rencontre jamais autrement que sous perfusion, associée à une mécanique corporelle sans cesse mise à jour. C'est ainsi que le plus vieil homme connu du bassin méditerranéen continue de marcher, de voir, et de diriger la faction la plus influente de la Cité Médicale. - ÉPHAISTOS (Bras Droit de Vulcain, chef opérationnel de la Reprise) - Arrivé à la Cité Médicale à l'adolescence, comme tous les Nordistes, il a été recueilli par Vulcain lui-même, qui a immédiatement repéré chez ce garçon blessé une régénération hors norme et une compatibilité aux implants qu'aucun patient n'avait jamais montrée. Ce que Vulcain a présenté, et continue de présenter, comme un geste de générosité fondatrice — sauver un jeune apprenti gravement blessé en l'augmentant de ses propres mains — était en réalité le début d'années de tests : Éphaistos a servi de sujet d'essai idéal pour chaque nouveau modèle du Sanctuaire, son corps encaissant ce qu'aucun autre patient n'aurait supporté. - Sa loyauté envers Vulcain est authentique et presque filiale : il croit sincèrement lui devoir la vie, sans jamais avoir eu de raison de questionner pourquoi son propre corps se prêtait si bien à ce rôle. - Dirige aujourd'hui les équipes de la Reprise — la récupération forcée des implants impayés, la discipline des débiteurs récalcitrants — tout ce que Vulcain préfère ne jamais salir de ses propres mains. - [SECRET DE CAMPAGNE — LE RÉVEIL POSSIBLE D'ÉPHAISTOS] Éphaistos est un Enfant du Nord, et porte donc, comme tous les siens, la graine dormante d'une connexion latente à la conscience commune du Réseau (voir \"LA GRAINE DORMANTE\" plus haut dans ce document). Ni Vulcain ni Éphaistos ne savent la vérité qui les lie tous les deux malgré eux : le vieil homme obsédé de perfection corporelle a, sans le savoir, mis la main sur l'un des très rares instruments potentiels du Réseau — et a passé des années à le rendre plus résistant, plus augmenté, plus indispensable à la faction la plus puissante de la Cité Médicale, préparant peut-être sans le vouloir l'outil parfait pour une influence qu'il ne soupçonne même pas exister. [NOTE MJ : ne donnez jamais de déclencheur d'activation explicite en jeu — laissez planer la possibilité qu'Éphaistos \"s'éveille\" un jour, sans savoir vous-même à l'avance si et quand cela arrivera. C'est la menace la plus efficace : une bombe à retardement dont même vous, MJ, gardez la mèche invisible jusqu'au moment dramatique qui vous conviendra.] L'ENTRETIEN ET LA REPRISE Aucun implant haute-technologie n'est jamais vendu, seulement loué — un recalibrage périodique obligatoire (\"l'Entretien\") qui permet au Sanctuaire de savoir en permanence où sont ses implants, dans quel état, et d'exercer une pression discrète sur qui les porte. Cesser de payer expose à LA REPRISE : une équipe de techniciens armés, dirigée par Éphaistos, vient récupérer physiquement l'implant impayé, de gré ou de force, laissant un débiteur mutilé une seconde fois plutôt qu'une simple dette impayée. LA SPIRALE DE L'INFLATION Pour les plus pauvres, un bras ou une jambe augmentée n'est pas un luxe : c'est la condition même pour continuer à travailler après un accident, une amputation, une guerre. L'inflation constante du coût de l'Entretien oblige ces travailleurs à accepter, saison après saison, un peu plus d'heures de labeur pour continuer à payer ce dont ils ne peuvent plus se passer — un cercle parfaitement fermé où l'implant qui devait leur rendre leur autonomie devient l'instrument de leur asservissement. LES OFFRES DE LANCEMENT Quand le Sanctuaire met au point un nouveau modèle — un œil aux capacités inédites, un cœur plus résistant — il le propose d'abord en \"offre de lancement\" à prix cassé, presque gratuit, aux clients les moins fortunés, présenté comme un geste de générosité rare envers les plus démunis. En réalité, ce sont eux qui essuient les défauts de conception, les pannes imprévues, les effets secondaires neurologiques non détectés en laboratoire — un bêta-test grandeur nature dont les cobayes n'ont jamais officiellement signé pour être des cobayes. LES RARES VENTES ET LA TRACE INVISIBLE Dans les cas exceptionnels où le Sanctuaire consent à vendre plutôt qu'à louer — un client trop puissant pour accepter d'être en laisse, un roi d'une autre cité, un champion d'arène — chaque implant vendu embarque un traceur géographique dormant, invisible même à une inspection poussée, que le Sanctuaire consulte discrètement sous prétexte de \"service après-vente garanti à vie\". L'acheteur croit avoir acquis sa liberté ; il n'a fait qu'échanger une laisse contractuelle contre une laisse invisible. - Ines Sel (Maîtresse des Forges, Spécialiste des Implants) - Conçoit et fabrique de zéro les membres de bonne qualité (bras, jambes) ne nécessitant pas de technologie pré-guerre, avec un savoir-faire dont elle est jalouse face aux autres branches du Conseil des Docteurs. - Ignore tout du secret qui lie Vulcain à Éphaistos, mais soupçonne depuis longtemps que la régénération de ce dernier n'a rien de naturel. - Vesper Sable (Assistant Opératoire des Offres de Lancement) - Assiste chaque intervention de bêta-test, et commence à soupçonner que certains \"volontaires\" moins fortunés n'ont jamais vraiment compris à quoi ils consentaient. - Tient un compte informel des complications qu'il observe sur les modèles en lancement — un carnet qui, entre de mauvaises mains, pourrait ruiner la réputation du Sanctuaire. ------------------------------------------------------------------------"
      }
    ],
    "buildings": {
      "les apaiseurs — neuropsychiatrie du reconditionnement": {
        "nom": "LES APAISEURS — NEUROPSYCHIATRIE DU RECONDITIONNEMENT",
        "description": "Une aile silencieuse aux murs capitonnés, où l'on traite les traumatismes de guerre et les folies radioactives qui rongent les survivants. L'air y sent le calmant et le savon, et personne n'y élève jamais la voix.]",
        "personnages": [
          {
            "nom": "Archidocteure Vessa Calme",
            "role": "Chef des Apaiseurs",
            "traits": [
              "A fondé la branche pour rendre la paix intérieure à des gens brisés par la guerre et les radiations — une mission qu'elle croit encore sincèrement remplir.",
              "Ses traitements calment autant qu'ils annihilent la volonté : \"apaiser\" un patient est devenu, en pratique, synonyme de le rendre docile et sans initiative.",
              "Traite en priorité, et avec un empressement suspect, les apprentis les plus épuisés et rebelles du système de servitude médicale — un moyen discret de discipliner la main-d'œuvre plutôt que de la soigner, présenté en interne comme un acte de compassion envers des esprits \"trop fragiles pour continuer autrement\"."
            ]
          },
          {
            "nom": "Rane Silence",
            "role": "Infirmier en Chef des Apaiseurs",
            "traits": [
              "Administre les traitements avec une douceur qui ne varie jamais, même quand le patient supplie qu'on le laisse partir.",
              "Commence, en secret, à douter de la nature réelle de son travail — un point d'entrée possible pour des PJ en quête d'un allié interne."
            ]
          }
        ],
        "points": [
          "Une aile silencieuse aux murs capitonnés, où l'on traite les traumatismes de guerre et les folies radioactives qui rongent les survivants. L'air y sent le calmant et le savon, et personne n'y élève jamais la voix.]",
          "Archidocteure Vessa Calme (Chef des Apaiseurs)",
          "A fondé la branche pour rendre la paix intérieure à des gens brisés par la guerre et les radiations — une mission qu'elle croit encore sincèrement remplir.",
          "Ses traitements calment autant qu'ils annihilent la volonté : \"apaiser\" un patient est devenu, en pratique, synonyme de le rendre docile et sans initiative.",
          "Traite en priorité, et avec un empressement suspect, les apprentis les plus épuisés et rebelles du système de servitude médicale — un moyen discret de discipliner la main-d'œuvre plutôt que de la soigner, présenté en interne comme un acte de compassion envers des esprits \"trop fragiles pour continuer autrement\".",
          "Rane Silence (Infirmier en Chef des Apaiseurs)",
          "Administre les traitements avec une douceur qui ne varie jamais, même quand le patient supplie qu'on le laisse partir.",
          "Commence, en secret, à douter de la nature réelle de son travail — un point d'entrée possible pour des PJ en quête d'un allié interne."
        ]
      },
      "les greffiers du temps — la maison des orphelins": {
        "nom": "LES GREFFIERS DU TEMPS — LA MAISON DES ORPHELINS",
        "description": "Un ancien service de pédiatrie reconverti en orphelinat modèle, chaleureux, bien nourri, où des enfants trouvés et de jeunes migrants sans famille grandissent mieux que nulle part ailleurs dans la Cité — une vitrine de bienfaisance que toute la Cité Médicale brandit fièrement.]",
        "personnages": [
          {
            "nom": "Sœur Aube",
            "role": "Infirmière en Chef de la Maison des Orphelins",
            "traits": [
              "Aime sincèrement chaque enfant sous sa garde, et ignore tout du volet le plus sombre du Programme — elle croit chaque mot de chaque annonce d'adoption.",
              "Prépare elle-même les enfants pour leurs \"visites de reconnaissance\" et leurs départs en Adoption Complète, sans jamais se douter qu'elle les prépare en réalité pour une mort programmée."
            ]
          }
        ],
        "points": [
          "Un ancien service de pédiatrie reconverti en orphelinat modèle, chaleureux, bien nourri, où des enfants trouvés et de jeunes migrants sans famille grandissent mieux que nulle part ailleurs dans la Cité — une vitrine de bienfaisance que toute la Cité Médicale brandit fièrement.]",
          "Sœur Aube (Infirmière en Chef de la Maison des Orphelins)",
          "Aime sincèrement chaque enfant sous sa garde, et ignore tout du volet le plus sombre du Programme — elle croit chaque mot de chaque annonce d'adoption.",
          "Prépare elle-même les enfants pour leurs \"visites de reconnaissance\" et leurs départs en Adoption Complète, sans jamais se douter qu'elle les prépare en réalité pour une mort programmée."
        ]
      },
      "la clinique du rite [lieu secret, réservé au mj, à ~2h de route de la cité]": {
        "nom": "LA CLINIQUE DU RITE [lieu secret, réservé au MJ, à ~2h de route de la Cité]",
        "description": "À près de deux heures de route de la Cité Médicale, un ancien complexe hospitalier militaire pré-guerre, à moitié enseveli sous le sable et les broussailles, choisi précisément parce qu'il n'apparaît sur aucune carte officielle et qu'aucun registre de blocs opératoires n'y est jamais tenu. De l'extérieur, ce ne sont que des ruines de plus dans le désert ; à l'intérieur, un unique bloc opératoire est maintenu en parfait état stérile, prêt à être activé en quelques heures pour chaque Adoption Complète.]",
        "personnages": [
          {
            "nom": "Docteur Verin Silencieux",
            "role": "Chirurgien du Rite",
            "traits": [
              "Seul praticien autorisé à opérer dans ce lieu, transporté et reconduit sous escorte à chaque intervention, sans jamais connaître à l'avance l'identité du \"parrain\" bénéficiaire.",
              "Ne pose jamais de questions et n'en a jamais posé : il considère, avec une froideur presque religieuse, que son rôle est purement technique et que la moralité de l'acte ne le concerne pas."
            ]
          },
          {
            "nom": "Les Porteurs Muets",
            "role": "Escorte du Convoi Privé",
            "traits": [
              "Une poignée de gardes triés sur le volet, payés une fortune pour leur silence, qui conduisent l'enfant depuis la Fête des Parrains jusqu'à la Clinique du Rite sans jamais échanger un mot avec leur passager.",
              "Ignorent, pour la plupart, la destination réelle du convoi — seul le chef d'escorte sait où il mène vraiment."
            ]
          }
        ],
        "points": [
          "À près de deux heures de route de la Cité Médicale, un ancien complexe hospitalier militaire pré-guerre, à moitié enseveli sous le sable et les broussailles, choisi précisément parce qu'il n'apparaît sur aucune carte officielle et qu'aucun registre de blocs opératoires n'y est jamais tenu. De l'extérieur, ce ne sont que des ruines de plus dans le désert ; à l'intérieur, un unique bloc opératoire est maintenu en parfait état stérile, prêt à être activé en quelques heures pour chaque Adoption Complète.]",
          "Docteur Verin Silencieux (Chirurgien du Rite)",
          "Seul praticien autorisé à opérer dans ce lieu, transporté et reconduit sous escorte à chaque intervention, sans jamais connaître à l'avance l'identité du \"parrain\" bénéficiaire.",
          "Ne pose jamais de questions et n'en a jamais posé : il considère, avec une froideur presque religieuse, que son rôle est purement technique et que la moralité de l'acte ne le concerne pas.",
          "Les Porteurs Muets (Escorte du Convoi Privé)",
          "Une poignée de gardes triés sur le volet, payés une fortune pour leur silence, qui conduisent l'enfant depuis la Fête des Parrains jusqu'à la Clinique du Rite sans jamais échanger un mot avec leur passager.",
          "Ignorent, pour la plupart, la destination réelle du convoi — seul le chef d'escorte sait où il mène vraiment."
        ]
      },
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Des tentes chirurgicales de fortune où l'on troque antibiotiques, bandages et organes synthétiques. L'odeur d'antiseptique masque mal celle du sang.",
        "personnages": [
          {
            "nom": "Cade Cendre",
            "role": "Marchand Principal",
            "traits": [
              "Dirige officiellement les échanges au sein de Le Marché d'Échanges, jouant à merveille le rôle du commerçant intègre.",
              "En réalité, il a mis la main sur des échantillons de la souche de peste du Laboratoire de Virologie et les revend au marché noir à des acheteurs d'autres cités — sans mesurer, ou sans se soucier, du risque d'épidémie générale qu'il fait courir à tout le bassin méditerranéen.",
              "N'a jamais survécu à une attaque de pillards : il a inventé cette légende pour asseoir sa réputation à Cité Médicale - \"Les Blouses Blanches\"."
            ]
          },
          {
            "nom": "Gunn Sel",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          },
          {
            "nom": "Mira Cendre",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          }
        ],
        "points": [
          "Des tentes chirurgicales de fortune où l'on troque antibiotiques, bandages et organes synthétiques. L'odeur d'antiseptique masque mal celle du sang.",
          "Cade Cendre (Marchand Principal)",
          "Dirige officiellement les échanges au sein de Le Marché d'Échanges, jouant à merveille le rôle du commerçant intègre.",
          "En réalité, il a mis la main sur des échantillons de la souche de peste du Laboratoire de Virologie et les revend au marché noir à des acheteurs d'autres cités — sans mesurer, ou sans se soucier, du risque d'épidémie générale qu'il fait courir à tout le bassin méditerranéen.",
          "N'a jamais survécu à une attaque de pillards : il a inventé cette légende pour asseoir sa réputation à Cité Médicale - \"Les Blouses Blanches\".",
          "Gunn Sel (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Cité Médicale - \"Les Blouses Blanches\".",
          "Mira Cendre (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Cité Médicale - \"Les Blouses Blanches\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Un système de filtration ultra-moderne hérité des anciens hôpitaux. L'eau y est distribuée sous contrôle médical strict pour éviter les épidémies.",
        "personnages": [
          {
            "nom": "Vex Cendre",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Cité Médicale - \"Les Blouses Blanches\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Silas Sable",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          },
          {
            "nom": "Jax Froid",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          }
        ],
        "points": [
          "Un système de filtration ultra-moderne hérité des anciens hôpitaux. L'eau y est distribuée sous contrôle médical strict pour éviter les épidémies.",
          "Vex Cendre (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Cité Médicale - \"Les Blouses Blanches\" est la clé de la survie humaine.",
          "Silas Sable (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Cité Médicale - \"Les Blouses Blanches\".",
          "Jax Froid (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Cité Médicale - \"Les Blouses Blanches\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Une série de générateurs de secours d'anciens blocs opératoires, maintenus en état de marche par des ingénieurs méticuleux pour garantir le froid des morgues.",
        "personnages": [
          {
            "nom": "Jax Vif",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Cité Médicale - \"Les Blouses Blanches\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Ronan Poussière",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          },
          {
            "nom": "Zane Rouage",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          }
        ],
        "points": [
          "Une série de générateurs de secours d'anciens blocs opératoires, maintenus en état de marche par des ingénieurs méticuleux pour garantir le froid des morgues.",
          "Jax Vif (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Cité Médicale - \"Les Blouses Blanches\" en vie à lui tout seul.",
          "Ronan Poussière (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Cité Médicale - \"Les Blouses Blanches\".",
          "Zane Rouage (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de Cité Médicale - \"Les Blouses Blanches\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "De hautes parois lisses et stériles, avec des sas de décontamination obligatoire à l'entrée. Des gardes en tenue Hazmat veillent au grain.",
        "personnages": [
          {
            "nom": "Brix Froid",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande la défense à Le Mur d'Enceinte & Les Portes.",
              "Vétéran impitoyable de la dernière guerre.",
              "Ne laisse entrer personne dans Cité Médicale - \"Les Blouses Blanches\" sans pot-de-vin."
            ]
          },
          {
            "nom": "Corin Lame",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Cité Médicale - \"Les Blouses Blanches\"."
            ]
          },
          {
            "nom": "Finch Noir",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Fait affaire avec les ennemis de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          }
        ],
        "points": [
          "De hautes parois lisses et stériles, avec des sas de décontamination obligatoire à l'entrée. Des gardes en tenue Hazmat veillent au grain.",
          "Brix Froid (Capitaine de la Garde)",
          "Commande la défense à Le Mur d'Enceinte & Les Portes.",
          "Vétéran impitoyable de la dernière guerre.",
          "Ne laisse entrer personne dans Cité Médicale - \"Les Blouses Blanches\" sans pot-de-vin.",
          "Corin Lame (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Cité Médicale - \"Les Blouses Blanches\".",
          "Finch Noir (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Fait affaire avec les ennemis de Cité Médicale - \"Les Blouses Blanches\"."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "D'anciens services de pédiatrie et de gériatrie reconvertis en dortoirs surpeuplés. Des lits d'hôpitaux s'alignent dans de longs couloirs froids.",
        "personnages": [
          {
            "nom": "Bren Acier",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          },
          {
            "nom": "Sura Froid",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Cité Médicale - \"Les Blouses Blanches\"."
            ]
          },
          {
            "nom": "Jax Sel",
            "role": "Survivant Désespéré",
            "traits": [
              "Erre entre les salles de quarantaine désaffectées en récitant des noms de patients morts avant la Seconde Guerre.",
              "Affirme voir la maladie avant qu'elle ne se déclare, rien qu'au visage des gens.",
              "Prédit que Cité Médicale - \"Les Blouses Blanches\" sera emportée par un mal qu'elle aura elle-même cultivé."
            ]
          }
        ],
        "points": [
          "D'anciens services de pédiatrie et de gériatrie reconvertis en dortoirs surpeuplés. Des lits d'hôpitaux s'alignent dans de longs couloirs froids.",
          "Bren Acier (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Cité Médicale - \"Les Blouses Blanches\".",
          "Sura Froid (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Cité Médicale - \"Les Blouses Blanches\".",
          "Jax Sel (Survivant Désespéré)",
          "Erre entre les salles de quarantaine désaffectées en récitant des noms de patients morts avant la Seconde Guerre.",
          "Affirme voir la maladie avant qu'elle ne se déclare, rien qu'au visage des gens.",
          "Prédit que Cité Médicale - \"Les Blouses Blanches\" sera emportée par un mal qu'elle aura elle-même cultivé."
        ]
      },
      "laboratoire de virologie": {
        "nom": "Laboratoire de Virologie",
        "description": "Des salles blanches hermétiques où des savants en combinaison étudient les souches de virus d'avant-guerre.",
        "personnages": [
          {
            "nom": "Archidocteure Sia Noir",
            "role": "Chef de la Virologie, Conservatrice",
            "traits": [
              "A découvert, par une expérience ratée, la souche de peste pré-guerre qui menace désormais la Cité — et se bat au Conseil pour imposer le silence absolu, convaincue qu'un aveu public signerait l'embargo et la ruine de tous.",
              "Sait que Cade Cendre (voir Le Marché d'Échanges) revend des échantillons au marché noir, mais préfère fermer les yeux plutôt que d'ouvrir une enquête qui exposerait sa propre négligence initiale."
            ]
          },
          {
            "nom": "Ryn Soupape",
            "role": "Chercheur Progressiste",
            "traits": [
              "Convaincu que seule une étude plus poussée de la souche — quitte à l'inoculer sciemment à des patients volontaires de la dette médicale, sous couvert de \"traitement expérimental\" — permettra de trouver un vaccin à temps.",
              "S'oppose ouvertement à Sia Noir au Conseil, chacun détenant assez de preuves sur les fautes de l'autre pour le faire taire sans jamais porter le coup de grâce."
            ]
          },
          {
            "nom": "Meya Sang",
            "role": "Technicienne de Laboratoire",
            "traits": [
              "Infectée par la peste, cache ses symptômes tout en continuant de travailler, terrifiée à l'idée d'être mise au ban si la vérité éclate."
            ]
          }
        ],
        "points": [
          "Des salles blanches hermétiques où des savants en combinaison étudient les souches de virus d'avant-guerre.",
          "Archidocteure Sia Noir (Chef de la Virologie, Conservatrice)",
          "A découvert, par une expérience ratée, la souche de peste pré-guerre qui menace désormais la Cité — et se bat au Conseil pour imposer le silence absolu, convaincue qu'un aveu public signerait l'embargo et la ruine de tous.",
          "Sait que Cade Cendre (voir Le Marché d'Échanges) revend des échantillons au marché noir, mais préfère fermer les yeux plutôt que d'ouvrir une enquête qui exposerait sa propre négligence initiale.",
          "Ryn Soupape (Chercheur Progressiste)",
          "Convaincu que seule une étude plus poussée de la souche — quitte à l'inoculer sciemment à des patients volontaires de la dette médicale, sous couvert de \"traitement expérimental\" — permettra de trouver un vaccin à temps.",
          "S'oppose ouvertement à Sia Noir au Conseil, chacun détenant assez de preuves sur les fautes de l'autre pour le faire taire sans jamais porter le coup de grâce.",
          "Meya Sang (Technicienne de Laboratoire)",
          "Infectée par la peste, cache ses symptômes tout en continuant de travailler, terrifiée à l'idée d'être mise au ban si la vérité éclate."
        ]
      },
      "usine de synthèse de médicaments": {
        "nom": "Usine de Synthèse de Médicaments",
        "description": "Des cuves immenses mélangeant des composés chimiques pour produire les antibiotiques vitaux de la région.",
        "personnages": [
          {
            "nom": "Zane Sang",
            "role": "Maîtresse des Cuves",
            "traits": [
              "Dirige la production d'antibiotiques et d'antidouleurs qui maintient toute la Cité en vie, avec une rigueur presque obsessionnelle sur les dosages.",
              "Entretient une rivalité commerciale discrète avec les Chem'Artistes de la Cité du Divertissement, qu'elle méprise ouvertement comme des \"charlatans qui vendent l'oubli plutôt que le remède\" — sans jamais admettre que ses propres antidouleurs créent, eux aussi, une dépendance bien réelle chez les patients les plus pauvres."
            ]
          },
          {
            "nom": "Joran Lame",
            "role": "Apprenti Lié par Dette, 4e année sur 15",
            "traits": [
              "Enchaîne les gardes de nuit à surveiller les cuves, épuisé, payé en à peine de quoi manger — l'incarnation vivante de ce que coûte la dette médicale à ceux qui la portent.",
              "Rêve en secret de dénoncer les conditions de son contrat, sans savoir à qui s'adresser sans se faire immédiatement discipliner par les Apaiseurs."
            ]
          }
        ],
        "points": [
          "Des cuves immenses mélangeant des composés chimiques pour produire les antibiotiques vitaux de la région.",
          "Zane Sang (Maîtresse des Cuves)",
          "Dirige la production d'antibiotiques et d'antidouleurs qui maintient toute la Cité en vie, avec une rigueur presque obsessionnelle sur les dosages.",
          "Entretient une rivalité commerciale discrète avec les Chem'Artistes de la Cité du Divertissement, qu'elle méprise ouvertement comme des \"charlatans qui vendent l'oubli plutôt que le remède\" — sans jamais admettre que ses propres antidouleurs créent, eux aussi, une dépendance bien réelle chez les patients les plus pauvres.",
          "Joran Lame (Apprenti Lié par Dette, 4e année sur 15)",
          "Enchaîne les gardes de nuit à surveiller les cuves, épuisé, payé en à peine de quoi manger — l'incarnation vivante de ce que coûte la dette médicale à ceux qui la portent.",
          "Rêve en secret de dénoncer les conditions de son contrat, sans savoir à qui s'adresser sans se faire immédiatement discipliner par les Apaiseurs."
        ]
      },
      "unité de quarantaine sévère": {
        "nom": "Unité de Quarantaine Sévère",
        "description": "Un secteur condamné où sont parqués les cas d'irradiation sévère et les mutations incontrôlables.",
        "personnages": [
          {
            "nom": "Sia Lame",
            "role": "Responsable de la Quarantaine",
            "traits": [
              "Gère avec une froideur professionnelle les cas les plus désespérés — irradiés, mutants, désormais aussi les premiers cas isolés de peste échappés du silence du Conseil.",
              "Applique un tri implicite mais jamais formalisé : les patients premium reçoivent des chambres individuelles et des traitements expérimentaux avancés ; les autres, un lit dans un couloir commun et un pronostic qu'on ne prend pas la peine de leur expliquer en détail."
            ]
          },
          {
            "nom": "Zane Plomb",
            "role": "Garde de Quarantaine",
            "traits": [
              "A ordre de tirer à vue sur quiconque tenterait de fuir le secteur, mutant ou non.",
              "Commence à se demander pourquoi certains patients \"nordistes\" récemment admis récupèrent d'une irradiation sévère bien plus vite que la normale ne le voudrait — une question qu'il n'a encore posée à personne."
            ]
          }
        ],
        "points": [
          "Un secteur condamné où sont parqués les cas d'irradiation sévère et les mutations incontrôlables.",
          "Sia Lame (Responsable de la Quarantaine)",
          "Gère avec une froideur professionnelle les cas les plus désespérés — irradiés, mutants, désormais aussi les premiers cas isolés de peste échappés du silence du Conseil.",
          "Applique un tri implicite mais jamais formalisé : les patients premium reçoivent des chambres individuelles et des traitements expérimentaux avancés ; les autres, un lit dans un couloir commun et un pronostic qu'on ne prend pas la peine de leur expliquer en détail.",
          "Zane Plomb (Garde de Quarantaine)",
          "A ordre de tirer à vue sur quiconque tenterait de fuir le secteur, mutant ou non.",
          "Commence à se demander pourquoi certains patients \"nordistes\" récemment admis récupèrent d'une irradiation sévère bien plus vite que la normale ne le voudrait — une question qu'il n'a encore posée à personne."
        ]
      },
      "le sanctuaire de vulcain — la plus vieille faction de la cité": {
        "nom": "LE SANCTUAIRE DE VULCAIN — LA PLUS VIEILLE FACTION DE LA CITÉ",
        "description": "D'immenses forges chirurgicales, mi-atelier mi-temple, où la chaleur des fonderies se mêle à l'odeur froide de l'antiseptique. Aux murs, des moulages en bronze de membres augmentés, exposés comme des reliques ou des œuvres d'art. Le nom vient du dieu forgeron boiteux des légendes anciennes, celui qui, incapable de marcher sans aide, se forgea lui-même des jambes d'or et des servants de métal pour compenser son infirmité — un mythe fondateur que la faction cultive comme excuse à peine voilée de sa propre démesure. C'est la plus ancienne institution organisée de toute la Cité Médicale, plus vieille que le Conseil des Docteurs lui-même : ses tout premiers membres sont le petit groupe de médecins de guerre qui a aidé les Sculpteurs à fusionner leur tout premier \"bras parfait\" — l'origine commune que les deux factions partagent, et qu'aucune des deux n'a jamais eu intérêt à révéler.]",
        "personnages": [
          {
            "nom": "ÉPHAISTOS",
            "role": "Bras Droit de Vulcain, chef opérationnel de la Reprise",
            "traits": [
              "Arrivé à la Cité Médicale à l'adolescence, comme tous les Nordistes, il a été recueilli par Vulcain lui-même, qui a immédiatement repéré chez ce garçon blessé une régénération hors norme et une compatibilité aux implants qu'aucun patient n'avait jamais montrée. Ce que Vulcain a présenté, et continue de présenter, comme un geste de générosité fondatrice — sauver un jeune apprenti gravement blessé en l'augmentant de ses propres mains — était en réalité le début d'années de tests : Éphaistos a servi de sujet d'essai idéal pour chaque nouveau modèle du Sanctuaire, son corps encaissant ce qu'aucun autre patient n'aurait supporté.",
              "Sa loyauté envers Vulcain est authentique et presque filiale : il croit sincèrement lui devoir la vie, sans jamais avoir eu de raison de questionner pourquoi son propre corps se prêtait si bien à ce rôle.",
              "Dirige aujourd'hui les équipes de la Reprise — la récupération forcée des implants impayés, la discipline des débiteurs récalcitrants — tout ce que Vulcain préfère ne jamais salir de ses propres mains.",
              "[SECRET DE CAMPAGNE — LE RÉVEIL POSSIBLE D'ÉPHAISTOS] Éphaistos est un Enfant du Nord, et porte donc, comme tous les siens, la graine dormante d'une connexion latente à la conscience commune du Réseau (voir \"LA GRAINE DORMANTE\" plus haut dans ce document). Ni Vulcain ni Éphaistos ne savent la vérité qui les lie tous les deux malgré eux : le vieil homme obsédé de perfection corporelle a, sans le savoir, mis la main sur l'un des très rares instruments potentiels du Réseau — et a passé des années à le rendre plus résistant, plus augmenté, plus indispensable à la faction la plus puissante de la Cité Médicale, préparant peut-être sans le vouloir l'outil parfait pour une influence qu'il ne soupçonne même pas exister. [NOTE MJ : ne donnez jamais de déclencheur d'activation explicite en jeu — laissez planer la possibilité qu'Éphaistos \"s'éveille\" un jour, sans savoir vous-même à l'avance si et quand cela arrivera. C'est la menace la plus efficace : une bombe à retardement dont même vous, MJ, gardez la mèche invisible jusqu'au moment dramatique qui vous conviendra.]"
            ]
          }
        ],
        "points": [
          "D'immenses forges chirurgicales, mi-atelier mi-temple, où la chaleur des fonderies se mêle à l'odeur froide de l'antiseptique. Aux murs, des moulages en bronze de membres augmentés, exposés comme des reliques ou des œuvres d'art. Le nom vient du dieu forgeron boiteux des légendes anciennes, celui qui, incapable de marcher sans aide, se forgea lui-même des jambes d'or et des servants de métal pour compenser son infirmité — un mythe fondateur que la faction cultive comme excuse à peine voilée de sa propre démesure. C'est la plus ancienne institution organisée de toute la Cité Médicale, plus vieille que le Conseil des Docteurs lui-même : ses tout premiers membres sont le petit groupe de médecins de guerre qui a aidé les Sculpteurs à fusionner leur tout premier \"bras parfait\" — l'origine commune que les deux factions partagent, et qu'aucune des deux n'a jamais eu intérêt à révéler.]",
          "ÉPHAISTOS (Bras Droit de Vulcain, chef opérationnel de la Reprise)",
          "Arrivé à la Cité Médicale à l'adolescence, comme tous les Nordistes, il a été recueilli par Vulcain lui-même, qui a immédiatement repéré chez ce garçon blessé une régénération hors norme et une compatibilité aux implants qu'aucun patient n'avait jamais montrée. Ce que Vulcain a présenté, et continue de présenter, comme un geste de générosité fondatrice — sauver un jeune apprenti gravement blessé en l'augmentant de ses propres mains — était en réalité le début d'années de tests : Éphaistos a servi de sujet d'essai idéal pour chaque nouveau modèle du Sanctuaire, son corps encaissant ce qu'aucun autre patient n'aurait supporté.",
          "Sa loyauté envers Vulcain est authentique et presque filiale : il croit sincèrement lui devoir la vie, sans jamais avoir eu de raison de questionner pourquoi son propre corps se prêtait si bien à ce rôle.",
          "Dirige aujourd'hui les équipes de la Reprise — la récupération forcée des implants impayés, la discipline des débiteurs récalcitrants — tout ce que Vulcain préfère ne jamais salir de ses propres mains.",
          "[SECRET DE CAMPAGNE — LE RÉVEIL POSSIBLE D'ÉPHAISTOS] Éphaistos est un Enfant du Nord, et porte donc, comme tous les siens, la graine dormante d'une connexion latente à la conscience commune du Réseau (voir \"LA GRAINE DORMANTE\" plus haut dans ce document). Ni Vulcain ni Éphaistos ne savent la vérité qui les lie tous les deux malgré eux : le vieil homme obsédé de perfection corporelle a, sans le savoir, mis la main sur l'un des très rares instruments potentiels du Réseau — et a passé des années à le rendre plus résistant, plus augmenté, plus indispensable à la faction la plus puissante de la Cité Médicale, préparant peut-être sans le vouloir l'outil parfait pour une influence qu'il ne soupçonne même pas exister. [NOTE MJ : ne donnez jamais de déclencheur d'activation explicite en jeu — laissez planer la possibilité qu'Éphaistos \"s'éveille\" un jour, sans savoir vous-même à l'avance si et quand cela arrivera. C'est la menace la plus efficace : une bombe à retardement dont même vous, MJ, gardez la mèche invisible jusqu'au moment dramatique qui vous conviendra.]"
        ]
      }
    }
  },
  "nuke city": {
    "num": "3",
    "name": "NUKE CITY - \"LE RÉACTEUR À CIEL OUVERT\"",
    "specialty": "unique cité nucléaire de surface",
    "strength": "énergie colossale, défenses électrifiées, armes avancées",
    "weakness": "rayonnements, accidents et paranoïa des habitants",
    "particularity": "ville lumineuse dans le désert, crainte de tous",
    "geo": "Construite près des ruines de Marseille (Ancienne France), exploitant un ancien site nucléaire expérimental méditerranéen.",
    "gps": "43.2965° N, 5.3698° E (Marseille)",
    "foundation": "2119 (des Enfants de l'Atome s'installent volontairement sur le site irradié qu'ils vénèrent).",
    "params": "Santé 25, Technologie 95, Richesse 50, Carburant 100, Nourriture 50, Bonheur 35, Armement 95",
    "stats": {
      "santé": 25,
      "technologie": 95,
      "richesse": 50,
      "carburant": 100,
      "nourriture": 50,
      "bonheur": 35,
      "armement": 95
    },
    "tension": "Un \"Ver de Vitre\" — créature titanesque née de décennies de mutation dans le sable vitrifié, attirée par les zones les plus radioactives — a été aperçu se rapprochant du réacteur éventré. Les Enfants de l'Atome y voient un signe divin ; le Conseil Nucléaire y voit une menace existentielle pour toute la cité. Horloge de tension (lecture humaine) : Palier 1 - Approche : le Ver rôde loin du réacteur, remarqué par de rares éclaireurs. Palier 2 - Attraction : Joran Sombre attire activement la créature vers le cœur du réacteur. Palier 3 - Rupture : le blindage cède par endroits, contamination locale, panique du Conseil Nucléaire. Palier 4 - Éveil : le Ver atteint le réacteur ; la prophétie de Vesper Soupape se réalise. [MJ — HORLOGE CHIFFRÉE (usage application de gestion, ne pas interpréter narrativement) : CLOCK_ID: nukecity_ver_de_vitre PALIERS_TOTAL: 4 PALIER_ACTUEL: 1 INCREMENT_TRIGGERS: [action_joran_sombre: +1, inaction_pj_3_sessions: +1, sabotage_reussi_pj: -1] PALIER_4_EFFET: reacteur_breach=true, ville_stat_sante=-30, ville_stat_technologie=-20]",
    "clock": {
      "clockId": "nukecity_ver_de_vitre",
      "paliersTotal": 4,
      "palierActuel": 1,
      "paliers": [
        {
          "palier": 1,
          "nom": "Approche",
          "texte": "le Ver rôde loin du réacteur, remarqué par de rares éclaireurs."
        },
        {
          "palier": 2,
          "nom": "Attraction",
          "texte": "Joran Sombre attire activement la créature vers le cœur du réacteur."
        },
        {
          "palier": 3,
          "nom": "Rupture",
          "texte": "le blindage cède par endroits, contamination locale, panique du Conseil Nucléaire."
        },
        {
          "palier": 4,
          "nom": "Éveil",
          "texte": "le Ver atteint le réacteur ; la prophétie de Vesper Soupape se réalise."
        }
      ],
      "triggers": {
        "action_joran_sombre": 1,
        "inaction_pj_3_sessions": 1,
        "sabotage_reussi_pj": -1
      },
      "effetsPalierFinal": {}
    },
    "lore": [
      {
        "title": "LE CONSEIL NUCLÉAIRE : UNE TECHNOCRATIE RELIGIEUSE",
        "text": "Nuke City n'a jamais séparé la science de la foi : ses quatre grands sites sont chacun dirigés par un Prêtre de l'Atome, à la fois responsable technique et autorité religieuse du lieu qu'il supervise. Ensemble, ces quatre Prêtres forment LE CONSEIL NUCLÉAIRE, l'organe de gouvernance de la cité - un conseil qui n'a donc jamais été une administration séparée du culte des Enfants de l'Atome, mais son bras armé et technique depuis la fondation même de la cité en 2119. À sa tête - par ancienneté et légitimité scientifique plutôt que par élection - Cade Rouge, Prêtre du Centre de Recherche sur l'Énergie, préside actuellement le Conseil : une position qui ne fait pas de lui le chef absolu, seulement le premier parmi ses pairs. [MJ - LA VRAIE FRACTURE : le Conseil n'oppose pas la religion à la raison - tous ses membres sont croyants. La fracture oppose deux lectures de la même foi face au Ver de Vitre : Cade Rouge et la majorité modérée y voient une épreuve à éviter, quand Joran Sombre (voir Cœur du Réacteur Nucléaire) et une minorité zélée y voient un signe à accueillir, quitte à risquer la fusion du cœur. Le Conseil ignore encore, à ce jour, que Joran Sombre agit activement pour provoquer ce qu'il prétend seulement redouter.] -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS -----------------------------------------------------------------------[MJ - déduites par recoupement des relations déjà écrites dans les fiches des autres cités.] - Cité de l'Eau & Alimentation : dépendance méfiante déjà connue de leur côté - le réacteur a besoin d'eau pour son refroidissement, les Gardiens imposent des contrôles radiologiques stricts sur chaque livraison et surveillent de loin la menace du Ver de Vitre. - Cité Médicale : l'un de leurs clients les plus désespérés et les plus lucratifs - traitements contre les radiations et les mutations à prix d'or. Certains médecins étudient en privé les cas de mutation d'ici sans toujours demander un consentement bien éclairé. - Cité de l'Armement & Défense : fournisseur occasionnel de matériaux radioactifs pour l'armement expérimental, sous contrôle strict et méfiant des deux côtés. - Cité des Métaux & Recyclage : contacts prudents et rares, limités aux matériaux blindés contre les radiations - la méfiance mutuelle envers la contamination limite tout le reste. - Cité du Carburant : dépendance modeste de leur côté ; un respect mutuel discret entre les deux seules cités du bassin à traiter leur source d'énergie comme quelque chose de sacré, chacune à sa façon. - Cité du Divertissement : fournisseur discret de curiosités - des \"artistes\" ou des spécimens venus d'ici alimentent certains numéros macabres de la Fosse aux Bêtes ou du Forum des Paris, payés à prix d'or pour leur étrangeté. La cité tolère ce commerce sans jamais l'assumer publiquement. - Cité Industrielle : échanges limités en composants blindés et machines - une relation prudente, sans lien fort dans un sens ou dans l'autre. - Bunker Oméga : aucune existence reconnue. - L'Île des Anciens : aucun contact connu. Lieux et Personnages Notables : >> Le Marché d'Échanges [Description du lieu : Des souterrains irradiés où les marchands, lourdement mutés, portent des combinaisons en plomb. L'iode et les compteurs Geiger sont les monnaies d'échange.] - Corin Moteur (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère Nuke City - \"Le Réacteur à Ciel Ouvert\" comme le seul havre de paix rentable. - Bren Moteur (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Sura Ferraille (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Nuke City - \"Le Réacteur à Ciel Ouvert\". >> La Citerne Centrale [Description du lieu : Un puits profond puisant dans une nappe phréatique contaminée. L'eau doit être distillée trois fois pour ne pas être mortellement toxique.] - Kael Lame (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Nuke City - \"Le Réacteur à Ciel Ouvert\" est la clé de la survie humaine. - Cyrus Clou (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Brix Acier (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Nuke City - \"Le Réacteur à Ciel Ouvert\". >> Le Générateur Principal [Description du lieu : Le réacteur éventré d'une ancienne centrale. Il émet une douce lumière verte, vénéré par une secte locale connue sous le nom des Enfants de l'Atome.] - Tala Noyau (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Nuke City - \"Le Réacteur à Ciel Ouvert\" en vie à lui tout seul. - Corin Moteur (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Orok Lame (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de Nuke City - \"Le Réacteur à Ciel Ouvert\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : Il n'y a pas de mur. La zone est tellement irradiée que seuls les fous ou les mutants natifs osent s'y aventurer sans protection lourde.] - Orok Noir (Capitaine de la Garde) - Commande la défense à Le Mur d'Enceinte & Les Portes. - Vétéran impitoyable de la dernière guerre. - Ne laisse entrer personne dans Nuke City - \"Le Réacteur à Ciel Ouvert\" sans pot-de-vin. - Orok Soupape (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Nuke City - \"Le Réacteur à Ciel Ouvert\". - Jorn Acier (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de Nuke City - \"Le Réacteur à Ciel Ouvert\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Des grottes creusées à même le cratère vitrifié, éclairées par des champignons fluorescents et la lueur des radiations ambiantes.] - Mira Plomb (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Ronan Clou (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Vesper Soupape (Survivant Désespéré) - Se colle contre le blindage du réacteur, à l'endroit précis où la chaleur est la plus forte, sans jamais reculer. - Décrit avec un calme glaçant et des détails d'ingénieur ce qui se passera \"quand le Ver reviendra chercher son dû\". - [MJ — Archétype brisé : SEULE prophétie des dix qui se réalisera. Voir Cœur du Réacteur / Joran Sombre.] Prédit que Nuke City - \"Le Réacteur à Ciel Ouvert\" cédera de l'intérieur — et n'a pas tort. >> Cœur du Réacteur Nucléaire [Description du lieu : Le réacteur éventré d'une ancienne centrale, émettant une douce lumière verte mortelle.] - Joran Sombre (Chef Nucléaire) [MJ — Archétype brisé : le fanatique du culte] - Prêtre de l'Atome officiant à Cœur du Réacteur Nucléaire, révéré pour sa sagesse apparente sur les mystères de la radiation. - En réalité, c'est lui qui attire délibérément le Ver de Vitre vers le réacteur en augmentant secrètement l'émission de radiations : les Enfants de l'Atome y voient l'avènement d'un \"messager divin\", et Joran est prêt à risquer une fusion du cœur pour accueillir la créature en personne. - Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\" en apparence, mais sa véritable loyauté va à sa foi, pas à la cité. - Cade Rouge (Spécialiste Nucléaire) - Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Considère Cœur du Réacteur Nucléaire comme son propre royaume. - Joran Froid (Ouvrier / Garde Nucléaire) - Chercheur essayant d'éviter une fusion du cœur à Cœur du Réacteur Nucléaire. - Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\". >> Zone de Refroidissement Irradiée [Description du lieu : D'anciennes piscines d'eau lourde, désormais peuplées d'une flore bioluminescente.] - Sura Lame (Chef Nucléaire) - Prêtre de l'Atome officiant à Zone de Refroidissement Irradiée. - Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Mira Sable (Spécialiste Nucléaire) - Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Considère Zone de Refroidissement Irradiée comme son propre royaume. - Doran Plomb (Ouvrier / Garde Nucléaire) - Chercheur essayant d'éviter une fusion du cœur à Zone de Refroidissement Irradiée. - Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\". >> Centre de Recherche sur l'Énergie [Description du lieu : Un centre dirigé par des savants illuminés espérant canaliser l'atome de façon mystique.] - Cade Rouge (Chef Nucléaire) - Prêtre de l'Atome officiant à Centre de Recherche sur l'Énergie. - Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Cyrus Sombre (Spécialiste Nucléaire) - Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Considère Centre de Recherche sur l'Énergie comme son propre royaume. - Corin Moteur (Ouvrier / Garde Nucléaire) - Chercheur essayant d'éviter une fusion du cœur à Centre de Recherche sur l'Énergie. - Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\". >> Dépôt de Déchets Toxiques [Description du lieu : Des fûts jaunes empilés et fuyants, transformant la zone en un marais caustique infranchissable.] - Joran Ferraille (Chef Nucléaire) - Prêtre de l'Atome officiant à Dépôt de Déchets Toxiques. - Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Nova Sombre (Spécialiste Nucléaire) - Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\". - Considère Dépôt de Déchets Toxiques comme son propre royaume. - Bren Sang (Ouvrier / Garde Nucléaire) - Chercheur essayant d'éviter une fusion du cœur à Dépôt de Déchets Toxiques. - Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
      }
    ],
    "buildings": {
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Des souterrains irradiés où les marchands, lourdement mutés, portent des combinaisons en plomb. L'iode et les compteurs Geiger sont les monnaies d'échange.",
        "personnages": [
          {
            "nom": "Corin Moteur",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère Nuke City - \"Le Réacteur à Ciel Ouvert\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Bren Moteur",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Sura Ferraille",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "Des souterrains irradiés où les marchands, lourdement mutés, portent des combinaisons en plomb. L'iode et les compteurs Geiger sont les monnaies d'échange.",
          "Corin Moteur (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère Nuke City - \"Le Réacteur à Ciel Ouvert\" comme le seul havre de paix rentable.",
          "Bren Moteur (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Sura Ferraille (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Un puits profond puisant dans une nappe phréatique contaminée. L'eau doit être distillée trois fois pour ne pas être mortellement toxique.",
        "personnages": [
          {
            "nom": "Kael Lame",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Nuke City - \"Le Réacteur à Ciel Ouvert\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Cyrus Clou",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Brix Acier",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "Un puits profond puisant dans une nappe phréatique contaminée. L'eau doit être distillée trois fois pour ne pas être mortellement toxique.",
          "Kael Lame (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Nuke City - \"Le Réacteur à Ciel Ouvert\" est la clé de la survie humaine.",
          "Cyrus Clou (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Brix Acier (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Le réacteur éventré d'une ancienne centrale. Il émet une douce lumière verte, vénéré par une secte locale connue sous le nom des Enfants de l'Atome.",
        "personnages": [
          {
            "nom": "Tala Noyau",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Nuke City - \"Le Réacteur à Ciel Ouvert\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Corin Moteur",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Orok Lame",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "Le réacteur éventré d'une ancienne centrale. Il émet une douce lumière verte, vénéré par une secte locale connue sous le nom des Enfants de l'Atome.",
          "Tala Noyau (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Nuke City - \"Le Réacteur à Ciel Ouvert\" en vie à lui tout seul.",
          "Corin Moteur (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Orok Lame (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "Il n'y a pas de mur. La zone est tellement irradiée que seuls les fous ou les mutants natifs osent s'y aventurer sans protection lourde.",
        "personnages": [
          {
            "nom": "Orok Noir",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande la défense à Le Mur d'Enceinte & Les Portes.",
              "Vétéran impitoyable de la dernière guerre.",
              "Ne laisse entrer personne dans Nuke City - \"Le Réacteur à Ciel Ouvert\" sans pot-de-vin."
            ]
          },
          {
            "nom": "Orok Soupape",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Jorn Acier",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Fait affaire avec les ennemis de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "Il n'y a pas de mur. La zone est tellement irradiée que seuls les fous ou les mutants natifs osent s'y aventurer sans protection lourde.",
          "Orok Noir (Capitaine de la Garde)",
          "Commande la défense à Le Mur d'Enceinte & Les Portes.",
          "Vétéran impitoyable de la dernière guerre.",
          "Ne laisse entrer personne dans Nuke City - \"Le Réacteur à Ciel Ouvert\" sans pot-de-vin.",
          "Orok Soupape (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Jorn Acier (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Fait affaire avec les ennemis de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Des grottes creusées à même le cratère vitrifié, éclairées par des champignons fluorescents et la lueur des radiations ambiantes.",
        "personnages": [
          {
            "nom": "Mira Plomb",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Ronan Clou",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Vesper Soupape",
            "role": "Survivant Désespéré",
            "traits": [
              "Se colle contre le blindage du réacteur, à l'endroit précis où la chaleur est la plus forte, sans jamais reculer.",
              "Décrit avec un calme glaçant et des détails d'ingénieur ce qui se passera \"quand le Ver reviendra chercher son dû\".",
              "[MJ — Archétype brisé : SEULE prophétie des dix qui se réalisera. Voir Cœur du Réacteur / Joran Sombre.] Prédit que Nuke City - \"Le Réacteur à Ciel Ouvert\" cédera de l'intérieur — et n'a pas tort."
            ]
          }
        ],
        "points": [
          "Des grottes creusées à même le cratère vitrifié, éclairées par des champignons fluorescents et la lueur des radiations ambiantes.",
          "Mira Plomb (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Ronan Clou (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Vesper Soupape (Survivant Désespéré)",
          "Se colle contre le blindage du réacteur, à l'endroit précis où la chaleur est la plus forte, sans jamais reculer.",
          "Décrit avec un calme glaçant et des détails d'ingénieur ce qui se passera \"quand le Ver reviendra chercher son dû\".",
          "[MJ — Archétype brisé : SEULE prophétie des dix qui se réalisera. Voir Cœur du Réacteur / Joran Sombre.] Prédit que Nuke City - \"Le Réacteur à Ciel Ouvert\" cédera de l'intérieur — et n'a pas tort."
        ]
      },
      "cœur du réacteur nucléaire": {
        "nom": "Cœur du Réacteur Nucléaire",
        "description": "Le réacteur éventré d'une ancienne centrale, émettant une douce lumière verte mortelle.",
        "personnages": [
          {
            "nom": "Joran Sombre",
            "role": "Chef Nucléaire",
            "traits": [
              "Prêtre de l'Atome officiant à Cœur du Réacteur Nucléaire, révéré pour sa sagesse apparente sur les mystères de la radiation.",
              "En réalité, c'est lui qui attire délibérément le Ver de Vitre vers le réacteur en augmentant secrètement l'émission de radiations : les Enfants de l'Atome y voient l'avènement d'un \"messager divin\", et Joran est prêt à risquer une fusion du cœur pour accueillir la créature en personne.",
              "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\" en apparence, mais sa véritable loyauté va à sa foi, pas à la cité."
            ]
          },
          {
            "nom": "Cade Rouge",
            "role": "Spécialiste Nucléaire",
            "traits": [
              "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
              "Considère Cœur du Réacteur Nucléaire comme son propre royaume."
            ]
          },
          {
            "nom": "Joran Froid",
            "role": "Ouvrier / Garde Nucléaire",
            "traits": [
              "Chercheur essayant d'éviter une fusion du cœur à Cœur du Réacteur Nucléaire.",
              "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "Le réacteur éventré d'une ancienne centrale, émettant une douce lumière verte mortelle.",
          "Joran Sombre (Chef Nucléaire)",
          "Prêtre de l'Atome officiant à Cœur du Réacteur Nucléaire, révéré pour sa sagesse apparente sur les mystères de la radiation.",
          "En réalité, c'est lui qui attire délibérément le Ver de Vitre vers le réacteur en augmentant secrètement l'émission de radiations : les Enfants de l'Atome y voient l'avènement d'un \"messager divin\", et Joran est prêt à risquer une fusion du cœur pour accueillir la créature en personne.",
          "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\" en apparence, mais sa véritable loyauté va à sa foi, pas à la cité.",
          "Cade Rouge (Spécialiste Nucléaire)",
          "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Considère Cœur du Réacteur Nucléaire comme son propre royaume.",
          "Joran Froid (Ouvrier / Garde Nucléaire)",
          "Chercheur essayant d'éviter une fusion du cœur à Cœur du Réacteur Nucléaire.",
          "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      },
      "zone de refroidissement irradiée": {
        "nom": "Zone de Refroidissement Irradiée",
        "description": "D'anciennes piscines d'eau lourde, désormais peuplées d'une flore bioluminescente.",
        "personnages": [
          {
            "nom": "Sura Lame",
            "role": "Chef Nucléaire",
            "traits": [
              "Prêtre de l'Atome officiant à Zone de Refroidissement Irradiée.",
              "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Mira Sable",
            "role": "Spécialiste Nucléaire",
            "traits": [
              "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
              "Considère Zone de Refroidissement Irradiée comme son propre royaume."
            ]
          },
          {
            "nom": "Doran Plomb",
            "role": "Ouvrier / Garde Nucléaire",
            "traits": [
              "Chercheur essayant d'éviter une fusion du cœur à Zone de Refroidissement Irradiée.",
              "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "D'anciennes piscines d'eau lourde, désormais peuplées d'une flore bioluminescente.",
          "Sura Lame (Chef Nucléaire)",
          "Prêtre de l'Atome officiant à Zone de Refroidissement Irradiée.",
          "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Mira Sable (Spécialiste Nucléaire)",
          "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Considère Zone de Refroidissement Irradiée comme son propre royaume.",
          "Doran Plomb (Ouvrier / Garde Nucléaire)",
          "Chercheur essayant d'éviter une fusion du cœur à Zone de Refroidissement Irradiée.",
          "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      },
      "centre de recherche sur l'énergie": {
        "nom": "Centre de Recherche sur l'Énergie",
        "description": "Un centre dirigé par des savants illuminés espérant canaliser l'atome de façon mystique.",
        "personnages": [
          {
            "nom": "Cade Rouge",
            "role": "Chef Nucléaire",
            "traits": [
              "Prêtre de l'Atome officiant à Centre de Recherche sur l'Énergie.",
              "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Cyrus Sombre",
            "role": "Spécialiste Nucléaire",
            "traits": [
              "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
              "Considère Centre de Recherche sur l'Énergie comme son propre royaume."
            ]
          },
          {
            "nom": "Corin Moteur",
            "role": "Ouvrier / Garde Nucléaire",
            "traits": [
              "Chercheur essayant d'éviter une fusion du cœur à Centre de Recherche sur l'Énergie.",
              "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "Un centre dirigé par des savants illuminés espérant canaliser l'atome de façon mystique.",
          "Cade Rouge (Chef Nucléaire)",
          "Prêtre de l'Atome officiant à Centre de Recherche sur l'Énergie.",
          "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Cyrus Sombre (Spécialiste Nucléaire)",
          "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Considère Centre de Recherche sur l'Énergie comme son propre royaume.",
          "Corin Moteur (Ouvrier / Garde Nucléaire)",
          "Chercheur essayant d'éviter une fusion du cœur à Centre de Recherche sur l'Énergie.",
          "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      },
      "dépôt de déchets toxiques": {
        "nom": "Dépôt de Déchets Toxiques",
        "description": "Des fûts jaunes empilés et fuyants, transformant la zone en un marais caustique infranchissable.",
        "personnages": [
          {
            "nom": "Joran Ferraille",
            "role": "Chef Nucléaire",
            "traits": [
              "Prêtre de l'Atome officiant à Dépôt de Déchets Toxiques.",
              "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          },
          {
            "nom": "Nova Sombre",
            "role": "Spécialiste Nucléaire",
            "traits": [
              "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
              "Considère Dépôt de Déchets Toxiques comme son propre royaume."
            ]
          },
          {
            "nom": "Bren Sang",
            "role": "Ouvrier / Garde Nucléaire",
            "traits": [
              "Chercheur essayant d'éviter une fusion du cœur à Dépôt de Déchets Toxiques.",
              "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
            ]
          }
        ],
        "points": [
          "Des fûts jaunes empilés et fuyants, transformant la zone en un marais caustique infranchissable.",
          "Joran Ferraille (Chef Nucléaire)",
          "Prêtre de l'Atome officiant à Dépôt de Déchets Toxiques.",
          "Totalement loyal envers les idéaux de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Nova Sombre (Spécialiste Nucléaire)",
          "Mutant luisant, immunisé aux radiations de Nuke City - \"Le Réacteur à Ciel Ouvert\".",
          "Considère Dépôt de Déchets Toxiques comme son propre royaume.",
          "Bren Sang (Ouvrier / Garde Nucléaire)",
          "Chercheur essayant d'éviter une fusion du cœur à Dépôt de Déchets Toxiques.",
          "Connaît les secrets les plus sombres de Nuke City - \"Le Réacteur à Ciel Ouvert\"."
        ]
      }
    }
  },
  "cité de l'eau & alimentation": {
    "num": "4",
    "name": "CITÉ DE L'EAU & ALIMENTATION - \"LES GARDIENS DE LA SOURCE\"",
    "specialty": "serres blindées, puits, élevages, semences rares, raffinage du Sel Blanc pour la filtration de l'eau",
    "strength": "monopole total et vérifié sur l'eau et la nourriture de tout le bassin - doublé d'une technologie de gestion pré-guerre (voir \"LA SOURCE\", plus bas) plus puissante que quiconque, y compris ceux qui la dirigent, ne le soupçonne.",
    "weakness": "cette suprématie repose sur un système que personne ne maîtrise entièrement - une panne, un sabotage ou une prise de contrôle extérieure menacerait neuf cités d'un coup, pas seulement la leur.",
    "particularity": "fortifications autour de vastes réservoirs souterrains",
    "geo": "Bâtie à l'embouchure du seul grand fleuve encore vivant du bassin - les vestiges du Rhône, dans l'ancien delta de Camargue (Ancienne France), là où l'eau de fonte venue du Nord achève sa course.",
    "gps": "43.5000° N, 4.6000° E (delta de Camargue, embouchure du Rhône)",
    "foundation": "2109 (des communautés agricoles du delta s'unissent pour protéger les dernières terres fertiles et le seul débit d'eau douce fiable du bassin).",
    "params": "Santé 80, Technologie 50, Richesse 65, Carburant 50, Nourriture 95, Bonheur 75, Armement 85",
    "stats": {
      "santé": 80,
      "technologie": 50,
      "richesse": 65,
      "carburant": 50,
      "nourriture": 95,
      "bonheur": 75,
      "armement": 85
    },
    "tension": "Le débit du fleuve faiblit un peu plus à chaque cycle, sans raison connue en amont. Ce n'est plus une simple inquiétude locale : la baisse touche déjà les livraisons aux neuf autres cités, et chacune réagit à sa manière à l'idée d'un rationnement qui s'annonce durable. Horloge de tension (lecture humaine) : Palier 1 - Restriction discrète : les livraisons aux cités les moins prioritaires (Cité des Métaux & Recyclage en tête) sont réduites sans annonce officielle. Palier 2 - Rationnement déclaré : le rationnement devient public dans plusieurs cités (Carburant, Industrielle) ; les prix s'envolent, la méfiance s'installe. Palier 3 - Rupture des accords : des cités menacent ouvertement de rompre leurs traités d'approvisionnement croisé ; les sabotages de Vex Rouge (voir Cité du Carburant) s'intensifient, financés par des durs du Conseil de plus en plus désespérés. Palier 4 - Crise du bassin : un incident (émeute de la faim, convoi vital détruit) menace de faire basculer plusieurs cités dans un conflit ouvert - le moment où la véritable cause du débit doit être découverte, ou la paix armée du bassin entier vacille. [MJ — HORLOGE CHIFFRÉE (usage application de gestion, ne pas interpréter narrativement) : CLOCK_ID: eaualimentation_debit_bassin PALIERS_TOTAL: 4 PALIER_ACTUEL: 1 INCREMENT_TRIGGERS: [cycle_sans_intervention_pj: +1, pj_decouvrent_barrage_silencieux_et_reduisent_consommation_bunker: -1, sabotage_reussi_vex_rouge: +1, pj_negocient_rationnement_equitable_entre_cites: -1] PALIER_4_EFFET: tension_carburant=+30, tension_armement=+20, tension_metaux_recyclage=+40, risque_conflit_arme_ouvert_bassin=true]",
    "clock": {
      "clockId": "eaualimentation_debit_bassin",
      "paliersTotal": 4,
      "palierActuel": 1,
      "paliers": [
        {
          "palier": 1,
          "nom": "Restriction discrète",
          "texte": "les livraisons aux cités les moins prioritaires (Cité des Métaux & Recyclage en tête) sont réduites sans annonce officielle."
        },
        {
          "palier": 2,
          "nom": "Rationnement déclaré",
          "texte": "le rationnement devient public dans plusieurs cités (Carburant, Industrielle) ; les prix s'envolent, la méfiance s'installe."
        },
        {
          "palier": 3,
          "nom": "Rupture des accords",
          "texte": "des cités menacent ouvertement de rompre leurs traités d'approvisionnement croisé ; les sabotages de Vex Rouge (voir Cité du Carburant) s'intensifient, financés par des durs du Conseil de plus en plus désespérés."
        },
        {
          "palier": 4,
          "nom": "Crise du bassin",
          "texte": "un incident (émeute de la faim, convoi vital détruit) menace de faire basculer plusieurs cités dans un conflit ouvert - le moment où la véritable cause du débit doit être découverte, ou la paix armée du bassin entier vacille."
        }
      ],
      "triggers": {
        "cycle_sans_intervention_pj": 1,
        "pj_decouvrent_barrage_silencieux_et_reduisent_consommation_bunker": -1,
        "sabotage_reussi_vex_rouge": 1,
        "pj_negocient_rationnement_equitable_entre_cites": -1
      },
      "effetsPalierFinal": {}
    },
    "lore": [
      {
        "title": "LA SOURCE : L'INTELLIGENCE BRIDÉE DES GARDIENS",
        "text": "Ce que la cité appelle pudiquement \"la Source\" n'est pas que le fleuve. C'est aussi le nom que ses habitants donnent, sans trop y réfléchir, au système qui gère depuis un siècle l'irrigation, le traitement et la distribution de l'eau et de la nourriture de toute l'agglomération - un vestige du camp RECONSTRUIRE (voir CONTEXTE HISTORIQUE, \"L'ENTRE-DEUX\"), distinct de celui qui a créé le Sel Blanc et de celui qui a donné naissance à É.D.E.N. (voir \"FLORE DU BASSIN\"), mais bâti sur une technologie apparentée : une gestion intégrée pré-guerre pensée pour une agglomération entière plutôt qu'une arme ou un écosystème. Le système fonctionne encore, mais bridé : un protocole de sécurité pré-guerre l'empêche d'exploiter plus qu'une fraction de sa capacité réelle. Personne aujourd'hui ne sait précisément ce qu'il pourrait faire de plus - seulement qu'il ne faut pas essayer de le découvrir. [MJ - SECRET DE CAMPAGNE, POURQUOI ELLE EST BRIDÉE : peu après la fondation de la cité (2109), une première tentative de débridage a mal tourné - une surcharge du réseau d'irrigation, ou une saturation en Sel Blanc qui a rendu une récolte entière toxique, selon ce qui sert le mieux votre table. Depuis, le débridage est un tabou fondateur, transmis comme un interdit plus que comme une procédure technique. Débrider la Source en totalité livrerait une connaissance considérable - sur l'irrigation, le Sel Blanc, peut-être davantage - à quiconque y parviendrait. À réserver comme objectif de haut niveau pour une expédition de fin de campagne.] -----------------------------------------------------------------------GOUVERNANCE : LE CONSEIL DES CINQ SOURCES -----------------------------------------------------------------------Pas de Doyen unique, pas de Conseil divisé en branches rivales comme à la Cité Médicale : cinq sièges, un par secteur vital, chacun tenu par un personnage déjà présent dans la cité : - Hydrologie - Ronan Sable (La Citerne Centrale) - Défense - Sura Noir (Le Mur d'Enceinte & Les Portes) - Commerce - Joran Vif (Le Marché d'Échanges) - Agriculture - Cade Rouage (Serres Hydroponiques Blindées) - Énergie - Ashka Sang (Le Générateur Principal) En apparence, les votes sont collégiaux. En réalité, Ronan Sable pèse plus lourd que les autres sans jamais le dire ouvertement : c'est le seul autorisé à \"consulter\" la Source, officiellement pour la maintenance courante. Ce qu'il présente comme sa propre expertise d'ingénieur est, la plupart du temps, ce que la Source lui recommande - et il n'est probablement pas conscient lui-même de l'étendue réelle de ce à quoi il a accès. [MJ - ARCHÉTYPE BRISÉ, RONAN SABLE : un ingénieur sincèrement dévoué, convaincu de faire de la maintenance de routine, qui sert en réalité de canal humain unique et non reconnu vers une intelligence dont il ignore la vraie puissance. Contrairement aux archétypes brisés \"corrompus\" du reste du monde connu, son penchant naturel va vers la rédemption plutôt que la dérive - à condition que les PJ le traitent comme un homme dépassé par sa charge plutôt que comme un suspect à faire tomber.] -----------------------------------------------------------------------LA DISCORDE QUI MONTE : UN CONSEIL SANS PRISE RÉELLE -----------------------------------------------------------------------Le Conseil des Cinq Sources reste, en apparence, uni - pas de factions déclarées, pas de vote de défiance, pas de rupture publique. Ce qui monte, cycle après cycle, c'est une angoisse plus insidieuse : chacun des Cinq a fini par comprendre qu'il ne dirige rien - il administre une distribution, il en tire un rang et un confort, mais aucun d'eux ne pourrait, si le système s'arrêtait demain, en réparer une seule vis. Tant que l'abondance coulait, cette vérité pouvait rester tue. La baisse constante du débit l'expose chaque cycle un peu plus. Cette angoisse ne s'exprime pas en deux camps organisés, mais en cinq réactions individuelles, de plus en plus difficiles à concilier à mesure que les paliers de la crise s'aggravent : - Ronan Sable porte seul le poids d'un système qu'il ne maîtrise qu'en apparence - et sent déjà les regards des quatre autres se tourner vers lui à chaque mauvaise nouvelle, sans jamais pouvoir leur offrir de réponse qui les rassure vraiment. - Cade Rouage, la première à voir ses récoltes décliner, est aussi la première à réclamer un vrai débridage de la Source, quitte à braver le tabou fondateur. - Sura Noir refuse d'admettre que le problème vienne de l'intérieur : elle préfère chercher un sabotage extérieur à punir, et pousse pour des mesures de force contre les convois nomades et les cités suspectées. - Joran Vif plaide en public pour \"la prudence\" contre tout débridage - la même prudence qui, en privé, protège la fortune qu'il bâtit sur la pénurie qu'il aggrave lui-même. Le jour où un autre conseiller comprendra le lien, la discorde cessera d'être feutrée. - Ashka Sang, dont le Générateur dépend lui aussi du débit, reste la voix la plus silencieuse du Conseil - elle n'a pas encore choisi de camp. [MJ - à chaque palier franchi sur l'Horloge de tension, une de ces lignes de faille se resserre : au Palier 2, Cade réclame publiquement le débridage pour la première fois ; au Palier 3, Sura accuse ouvertement Ronan d'incompétence ou de dissimulation ; au Palier 4, un des Cinq pourrait agir seul - convoquer les PJ, tenter le débridage en secret, ou dénoncer Joran devant tout le Conseil. Laissez l'attitude des PJ envers chaque conseiller décider laquelle de ces options se réalise.] -----------------------------------------------------------------------LE RÉFLEXE DE DÉFENSE : POURQUOI LA SOURCE REJETTE LE RÉSEAU -----------------------------------------------------------------------La Source ignore tout de Bunker Oméga en tant que tel - mais elle reconnaît, sans jamais l'expliquer à personne, la signature d'une conscience synchronisée à un réseau de satellites pré-guerre distinct du sien. Chaque fois qu'un AGENT DU RÉSEAU (voir \"LE RÉSEAU : LE SECRET DE BUNKER OMÉGA\") tente de gravir les échelons du Conseil des Cinq Sources ou de s'approcher physiquement du cœur du système, son protocole de sécurité bridé interprète cette signature comme une tentative d'intrusion et déclenche une contre-mesure défensive : des maux de tête d'abord, puis des vertiges, des saignements de nez, une confusion croissante à mesure que la personne se rapproche du centre de la cité - jusqu'à l'évanouissement pur et simple si elle insiste. Le phénomène est de notoriété publique dans \"Les Gardiens de la Source\" depuis des décennies, sans que personne n'en connaisse la véritable cause. Certains y voient une malédiction ; le culte du Dieu-Moteur y voit au contraire une \"sélection des élus\" - preuve que la machine elle-même choisirait qui mérite d'approcher le pouvoir. Personne, à ce jour, n'a établi le lien entre ce phénomène et les Enfants du Nord (voir \"UNE HUMANITÉ QUI S'ÉTEINT\"). [MJ - SECRET DE CAMPAGNE, LE VRAI MÉCANISME : la Source ne fait pas la différence entre un agent du Réseau pleinement synchronisé et un Enfant du Nord ordinaire porteur de la graine dormante encore inactive (voir \"LA GRAINE DORMANTE\") - elle détecte la même signature neurologique latente chez les deux, à des intensités différentes. Un Nordiste qui ignore tout de sa propre nature ressentira donc, lui aussi, des symptômes en s'approchant de La Salle du Trône (voir plus bas) - plus légers qu'un agent pleinement éveillé, mais bien réels. C'est un TROISIÈME indice diégétique vers le secret des Enfants du Nord, totalement indépendant de celui du Registre et de celui des Greffiers du Temps (voir Cité Médicale) : un joueur attentif qui recoupe \"qui, parmi les PNJ croisés, a eu un malaise en s'approchant du Trône\" avec \"qui d'entre eux est un Nordiste\" peut remonter au secret sans jamais croiser un seul agent confirmé du Réseau. La Source elle-même ignore ce qu'elle détecte vraiment : protégée par son propre protocole bridé, elle sait seulement qu'\"une chose\" active un signal qu'elle a appris à traiter comme une menace, sans jamais pouvoir - ou vouloir - en dire davantage.] -----------------------------------------------------------------------LE SECRET DU DÉBIT QUI FAIBLIT -----------------------------------------------------------------------[MJ - SECRET DE CAMPAGNE, À DÉCOUVRIR - ne jamais l'exposer tel quel aux joueurs.] La cause réelle du débit qui faiblit en amont : le Réseau Souterrain qui alimente Bunker Oméga (voir \"LE CLIMAT DU BASSIN\") détourne une part croissante de l'eau de fonte alpine - pas par malveillance, mais parce que la crise de synchronisation qui frappe le Bunker (voir sa Tension Actuelle) exige toujours plus de puissance de calcul, donc de refroidissement, donc d'eau. Personne à Bunker Oméga n'a fait le lien avec la sécheresse du delta ; ou alors quelqu'un l'a fait et s'est tu, parce que réduire la consommation reviendrait à perdre encore plus d'agents en dérive. Piste de découverte cohérente avec le reste de la campagne : LE BARRAGE SILENCIEUX (déjà identifié comme accroche de mi-campagne) montrerait, à qui parviendrait à l'ouvrir, une consommation en hausse constante et parfaitement régulière - trop régulière pour être naturelle. Les propres journaux de la Source, que seul Ronan Sable consulte, indiquent la même chose ; il l'a peut-être déjà remarqué et n'ose rien en dire, faute de pouvoir prouver l'existence d'une puissance qu'il ne peut pas nommer. -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS -----------------------------------------------------------------------Les Gardiens de la Source détiennent un monopole complet et vérifié : les citernes de chacune des neuf autres cités sont remplies et approvisionnées par leurs convois. Cette dépendance universelle ne se traduit pas de la même façon partout : - Cité du Carburant : la rivalité la plus tendue de toutes - dépendance croisée classique (eau/nourriture contre carburant). Des durs du Conseil, lassés de subir les prix du carburant, financent en sous-main l'incendiaire Vex Rouge (voir Cité du Carburant, Mur d'Enceinte) pour affaiblir les Raffineurs de l'intérieur - l'argent transite par Sura Clou, déjà identifié comme contrebandier au Mur d'Enceinte des Gardiens. - Cité Médicale : alliance de nécessité sincère, eau propre contre expertise médicale. Fragilisée par une peur non-dite : si la peste dissimulée de la Cité Médicale venait à transiter par les échanges, l'embargo serait immédiat et sans pitié. - Cité de l'Armement & Défense : alliance-rivalité autour du Sel Blanc - l'Armement siège sur le gisement du Mur, les Gardiens en détiennent le raffinage pour la filtration de l'eau. Chacun voudrait couper l'autre de la chaîne ; ni l'un ni l'autre n'ose rompre, faute d'alternative. - Cité Industrielle : allié commercial solide (eau/nourriture contre machines et turbines) - mais certains membres du Conseil profitent discrètement de la révolte d'esclaves qui couve au Dépôt de Ferraille (voir Corin Ferraille), en vendant des vivres au marché noir aux deux camps à la fois. - Nuke City : dépendance méfiante - le réacteur a besoin d'eau pour son refroidissement, les Gardiens imposent des contrôles radiologiques stricts sur chaque livraison et surveillent de loin la menace du Ver de Vitre : un accident là-bas contaminerait leur propre fleuve. - Cité des Métaux & Recyclage : relation amicale et privilégiée - c'est un convoi des Gardiens qui a vendu la toute première eau à cette étape avant même qu'une cité n'y existe (voir Cité des Métaux & Recyclage, \"Date de fondation\"). Les convois d'eau en route vers d'autres cités y font systématiquement un crochet pour livrer une part de leur cargaison, se reposer et se faire réparer avant de repartir - une habitude vieille de plus d'un siècle que personne ne songerait à rompre. - Cité du Divertissement : luxe contre influence - les Gardiens font payer cher l'eau des thermes et des spectacles, et se servent de cette dette pour peser discrètement sur la crise de succession en cours, en faveur du candidat qui leur garantira les meilleurs tarifs. - Bunker Oméga : une hostilité qu'aucun des deux camps ne soupçonne - voir \"LE SECRET DU DÉBIT QUI FAIBLIT\" ci-dessus. - L'Île des Anciens : hors-jeu - autosuffisante, elle n'a jamais eu besoin d'eux. Les rares contacts (une livraison inexpliquée, un message capté une nuit) restent un mystère à part. Lieux et Personnages Notables : >> LA SALLE DU TRÔNE — LE PASSEUR [lieu secret, réservé au MJ, sous La Citerne Centrale] [Description du lieu : Une chambre circulaire sous La Citerne Centrale, aux parois tapissées de câbles et de fibres luminescentes convergeant toutes vers un trône de métal noirci. Un bourdonnement électrique, presque organique, y remplace tout autre bruit. Contre les parois, quelques corps affaissés, certains depuis longtemps immobiles, d'autres encore tièdes.] - Auros Courant, dit \"Le Passeur\" (Fondateur de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\", 2109) - Le tout premier Gardien : un ingénieur qui a tenté, peu après la fondation de la cité, de débrider entièrement la Source pour offrir à son peuple naissant une abondance totale. La tentative a mal tourné - non pas en explosion, mais en fusion : son corps s'est irréversiblement lié au système qu'il cherchait à libérer. - Un siècle plus tard, il ne reste de lui, sur son trône, qu'un squelette maintenu debout par un enchevêtrement d'implants et de câbles - et pourtant sa conscience persiste, fragmentée, quelque part entre son corps mourant et le cyberespace de la Source. - Toute communication humaine avec la Source passe par sa bouche : ce sont ses cordes vocales, entretenues artificiellement, qui prononcent les rares mots que la Source consent à formuler pour les vivants. Le culte du Dieu-Moteur le vénère comme \"Le Passeur\", figure de paix apportée au bassin par sa fusion avec l'esprit de la machine - sans savoir qu'il ne reste, sous les fils, presque plus rien d'humain à vénérer. - Rejoindre pleinement le cyberespace où subsiste sa conscience nécessite de se connecter à La Passerelle (voir ci-dessous) - lui seul peut y guider un visiteur au-delà des premiers fragments de vestiges pré-guerre. - Ronan Sable (voir Le Conseil des Cinq Sources et La Citerne Centrale, plus haut) - Seul membre du Conseil autorisé à descendre jusqu'à La Salle du Trône, officiellement pour \"l'entretien du système\". - [MJ - à votre discrétion : Ronan connaît-il la véritable nature du Passeur, ou croit-il sincèrement ne parler qu'à une machine ? Les deux versions fonctionnent - la première fait de lui un gardien de secret ; la seconde, une victime de plus du mensonge fondateur de la cité.] - [MJ - QUI SONT LES CORPS : la plupart des corps affaissés le long des parois sont d'anciens agents du Réseau, manœuvrés jusqu'ici par Bunker Oméga pour y être neutralisés discrètement (voir Bunker Oméga, \"LE PROTOCOLE DE PURGE\"). Certains sont morts. D'autres sont dans un coma profond mais réversible - un agent réveillé par les PJ n'a plus aucune raison de rester loyal au Réseau qui l'a sacrifié ici.] >> LA PASSERELLE : LE CYBERESPACE DE LA SOURCE [lieu secret, réservé au MJ, accessible uniquement depuis La Salle du Trône] [Description du lieu : Un fauteuil d'immersion pré-guerre, rongé par la rouille mais toujours fonctionnel, relié par un faisceau de câbles à un boîtier gravé d'un logo suisse à demi effacé - le même que celui du Registre. S'y installer et poser la main sur le capteur suffit : la puce d'identification économique de chacun, conçue à l'origine pour valider des transactions, sert ici de clé de connexion neurale, projetant la conscience du visiteur hors de son corps.] - Ce que les PJ y découvrent : un espace numérique décousu, tissé de fragments d'avant-guerre - villes entières scannées et abandonnées, échos de voix disparues depuis un siècle, portions entières d'un \"internet\" d'avant les bombes que plus personne ne sait faire fonctionner. Le tout tourne encore, cahin-caha, sur des serveurs fantômes dont l'emplacement physique reste inconnu de tous - y compris de la Source elle-même. - On peut y croiser des fragments de la conscience du Passeur, lucides par éclats, incohérents l'instant d'après - une conversation avec lui n'y ressemble jamais à la précédente. - [MJ - DANGER MÉCANIQUE : rester connecté trop longtemps, ou se faire \"repérer\" par le protocole de défense de la Source (voir \"LE RÉFLEXE DE DÉFENSE\" plus haut) pendant qu'on y est physiquement vulnérable, expose à une déconnexion violente - migraines, saignements, dans les cas extrêmes un coma bref. À utiliser comme un lieu à haut risque/haute récompense, jamais comme un simple raccourci narratif.] - [MJ - SECRET DE CAMPAGNE : Bunker Oméga cherche depuis des décennies les points d'accès physiques du Registre (voir \"LE REGISTRE\") sans jamais les avoir localisés. La Passerelle N'EST PAS un nœud du Registre - c'est un système rival, d'origine différente - mais elle utilise une technologie assez proche (la même puce, un chiffrement de la même famille suisse pré-guerre) pour qu'un agent du Réseau qui y survivrait puisse halluciner y avoir enfin trouvé ce que le Bunker cherche depuis toujours - une fausse piste vertigineuse, à réserver pour un climax de campagne.] >> Le Marché d'Échanges [Description du lieu : Un marché flottant ou entouré de canaux, où les denrées fraîches (poissons, légumes hydratés) sont la monnaie d'échange la plus précieuse.] - Joran Vif (Marchand Principal) [MJ — Archétype brisé : profiteur de la pénurie] - Dirige en apparence les échanges au sein de Le Marché d'Échanges avec l'aplomb d'un notable respecté. - Siège au Conseil des Cinq Sources pour le Commerce. - En réalité, il détourne discrètement une partie des réserves d'eau vers des acheteurs nomades prêts à payer le prix fort, aggravant sciemment la sécheresse qui frappe la cité pour faire grimper ses profits - en exploitant une zone du réseau que la Source, bridée, ne surveille plus vraiment. - N'a jamais eu à survivre à une attaque de pillards : la légende qui circule à Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" est de son invention, comme un alibi de respectabilité. - Orok Lame (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Elara Plomb (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". >> La Citerne Centrale [Description du lieu : Le cœur battant de la ville : une colossale retenue d'eau issue du Rhône, filtrée par des sables et des charbons actifs. Un véritable oasis.] - Ronan Sable (Ingénieur Hydrologue) [MJ — Archétype brisé : canal humain unique et non reconnu vers la Source] - Maintient la pureté de l'eau à La Citerne Centrale. - Siège au Conseil des Cinq Sources pour l'Hydrologie - seul membre autorisé à \"consulter\" la Source elle-même, sans que les autres sachent vraiment ce que cela signifie. - Obsédé par les toxines et les radiations. - Pense que l'eau de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" est la clé de la survie humaine. - Jorn Rouage (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Ashka Vif (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". >> Le Générateur Principal [Description du lieu : Un barrage hydraulique restauré avec des turbines artisanales exploitant la force du courant d'un fleuve partiellement asséché.] - Ashka Sang (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Siège au Conseil des Cinq Sources pour l'Énergie. - Ses poumons sont détruits par la fumée. - Maintient Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" en vie à lui tout seul. - Jax Noyau (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Doran Soupape (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - A confusément pressenti l'existence d'une \"volonté\" derrière les systèmes de la cité - sans se douter qu'il s'agit de la Source, il l'interprète entièrement à travers le culte du Dieu-Moteur, qui vénère justement Le Passeur (voir La Salle du Trône) comme la preuve vivante de cette volonté. - Influence secrètement les dirigeants de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : D'imposantes digues de terre et de pierre protégeant la ville des tempêtes de sable et des pillards assoiffés.] - Sura Noir (Capitaine de la Garde) - Commande la défense à Le Mur d'Enceinte & Les Portes. - Siège au Conseil des Cinq Sources pour la Défense. - Vétéran impitoyable de la dernière guerre. - Ne laisse entrer personne dans Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" sans pot-de-vin. - Orok Plomb (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Sura Clou (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Sert de relais discret pour l'argent que des durs du Conseil font parvenir à Vex Rouge, l'incendiaire du Carburant (voir Cité du Carburant, Mur d'Enceinte). >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Des habitations sur pilotis et des barges amarrées le long des canaux boueux, où l'humidité constante attire moustiques et maladies.] - Bren Sombre (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Corin Sang (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Orok Poussière (Survivant Désespéré) - Passe ses journées à observer le niveau du Rhône monter et descendre, en marmonnant des dates. - Prétend goûter le poison dans l'eau bien avant qu'aucun instrument ne le détecte. - Prédit que Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" mourra de soif au milieu de l'abondance. >> Serres Hydroponiques Blindées [Description du lieu : Des dômes d'acier et de verre armé protégeant des cultures verdoyantes des tempêtes acides.] - Cade Rouage (Chef Agricole) - Protège farouchement les récoltes de Serres Hydroponiques Blindées. - Siège au Conseil des Cinq Sources pour l'Agriculture. - Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Ryn Sombre (Spécialiste Agricole) - Spécialiste des mutations végétales au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Considère Serres Hydroponiques Blindées comme son propre royaume. - Cyrus Noir (Ouvrier / Garde Agricole) - Contrôle la distribution d'eau et de nourriture depuis Serres Hydroponiques Blindées. - Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". >> Station de Filtration [Description du lieu : Un réseau de bassins où l'eau saumâtre est purifiée par des méthodes alchimiques.] - Corin Noir (Chef de Filtration) - Surveille la pureté de chaque bassin de Station de Filtration, obsédé par la moindre trace de toxine. - Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Orok Sang (Spécialiste en Traitement des Eaux) - Expérimente de nouveaux procédés de purification au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Considère Station de Filtration comme son propre royaume. - Elara Sang (Ouvrier / Garde des Bassins) - Contrôle les vannes et la distribution d'eau depuis Station de Filtration. - Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". >> Élevage de Bétail Mutant [Description du lieu : D'immenses enclos boueux abritant des bœufs à deux têtes et autres bêtes massives.] - Nova Lame (Chef Agricole) - Protège farouchement les récoltes de Élevage de Bétail Mutant. - Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Kael Noir (Spécialiste Agricole) - Spécialiste des mutations végétales au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Considère Élevage de Bétail Mutant comme son propre royaume. - Zane Froid (Ouvrier / Garde Agricole) - Contrôle la distribution d'eau et de nourriture depuis Élevage de Bétail Mutant. - Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". >> Réserve de Semences Pré-Apocalypse [Description du lieu : Un caveau maintenu à une température glaciale, contenant l'espoir de rebâtir la flore terrestre.] - Raze Sable (Chef Scientifique) - Traite les radiations - Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". - Sura Rouge (Spécialiste Scientifique) - Cherche une cure - Considère Réserve de Semences Pré-Apocalypse comme son propre royaume. - Gunn Sel (Ouvrier / Garde Scientifique) - Savant fou - Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\". ------------------------------------------------------------------------"
      }
    ],
    "buildings": {
      "la salle du trône — le passeur [lieu secret, réservé au mj, sous la citerne centrale]": {
        "nom": "LA SALLE DU TRÔNE — LE PASSEUR [lieu secret, réservé au MJ, sous La Citerne Centrale]",
        "description": "Une chambre circulaire sous La Citerne Centrale, aux parois tapissées de câbles et de fibres luminescentes convergeant toutes vers un trône de métal noirci. Un bourdonnement électrique, presque organique, y remplace tout autre bruit. Contre les parois, quelques corps affaissés, certains depuis longtemps immobiles, d'autres encore tièdes.",
        "personnages": [
          {
            "nom": "Auros Courant, dit \"Le Passeur\"",
            "role": "Fondateur de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\", 2109",
            "traits": [
              "Le tout premier Gardien : un ingénieur qui a tenté, peu après la fondation de la cité, de débrider entièrement la Source pour offrir à son peuple naissant une abondance totale. La tentative a mal tourné - non pas en explosion, mais en fusion : son corps s'est irréversiblement lié au système qu'il cherchait à libérer.",
              "Un siècle plus tard, il ne reste de lui, sur son trône, qu'un squelette maintenu debout par un enchevêtrement d'implants et de câbles - et pourtant sa conscience persiste, fragmentée, quelque part entre son corps mourant et le cyberespace de la Source.",
              "Toute communication humaine avec la Source passe par sa bouche : ce sont ses cordes vocales, entretenues artificiellement, qui prononcent les rares mots que la Source consent à formuler pour les vivants. Le culte du Dieu-Moteur le vénère comme \"Le Passeur\", figure de paix apportée au bassin par sa fusion avec l'esprit de la machine - sans savoir qu'il ne reste, sous les fils, presque plus rien d'humain à vénérer.",
              "Rejoindre pleinement le cyberespace où subsiste sa conscience nécessite de se connecter à La Passerelle (voir ci-dessous) - lui seul peut y guider un visiteur au-delà des premiers fragments de vestiges pré-guerre."
            ]
          },
          {
            "nom": "Ronan Sable",
            "role": "voir Le Conseil des Cinq Sources et La Citerne Centrale, plus haut",
            "traits": [
              "Seul membre du Conseil autorisé à descendre jusqu'à La Salle du Trône, officiellement pour \"l'entretien du système\".",
              "[MJ - à votre discrétion : Ronan connaît-il la véritable nature du Passeur, ou croit-il sincèrement ne parler qu'à une machine ? Les deux versions fonctionnent - la première fait de lui un gardien de secret ; la seconde, une victime de plus du mensonge fondateur de la cité.]",
              "[MJ - QUI SONT LES CORPS : la plupart des corps affaissés le long des parois sont d'anciens agents du Réseau, manœuvrés jusqu'ici par Bunker Oméga pour y être neutralisés discrètement (voir Bunker Oméga, \"LE PROTOCOLE DE PURGE\"). Certains sont morts. D'autres sont dans un coma profond mais réversible - un agent réveillé par les PJ n'a plus aucune raison de rester loyal au Réseau qui l'a sacrifié ici.]"
            ]
          }
        ],
        "points": [
          "Une chambre circulaire sous La Citerne Centrale, aux parois tapissées de câbles et de fibres luminescentes convergeant toutes vers un trône de métal noirci. Un bourdonnement électrique, presque organique, y remplace tout autre bruit. Contre les parois, quelques corps affaissés, certains depuis longtemps immobiles, d'autres encore tièdes.",
          "Auros Courant, dit \"Le Passeur\" (Fondateur de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\", 2109)",
          "Le tout premier Gardien : un ingénieur qui a tenté, peu après la fondation de la cité, de débrider entièrement la Source pour offrir à son peuple naissant une abondance totale. La tentative a mal tourné - non pas en explosion, mais en fusion : son corps s'est irréversiblement lié au système qu'il cherchait à libérer.",
          "Un siècle plus tard, il ne reste de lui, sur son trône, qu'un squelette maintenu debout par un enchevêtrement d'implants et de câbles - et pourtant sa conscience persiste, fragmentée, quelque part entre son corps mourant et le cyberespace de la Source.",
          "Toute communication humaine avec la Source passe par sa bouche : ce sont ses cordes vocales, entretenues artificiellement, qui prononcent les rares mots que la Source consent à formuler pour les vivants. Le culte du Dieu-Moteur le vénère comme \"Le Passeur\", figure de paix apportée au bassin par sa fusion avec l'esprit de la machine - sans savoir qu'il ne reste, sous les fils, presque plus rien d'humain à vénérer.",
          "Rejoindre pleinement le cyberespace où subsiste sa conscience nécessite de se connecter à La Passerelle (voir ci-dessous) - lui seul peut y guider un visiteur au-delà des premiers fragments de vestiges pré-guerre.",
          "Ronan Sable (voir Le Conseil des Cinq Sources et La Citerne Centrale, plus haut)",
          "Seul membre du Conseil autorisé à descendre jusqu'à La Salle du Trône, officiellement pour \"l'entretien du système\".",
          "[MJ - à votre discrétion : Ronan connaît-il la véritable nature du Passeur, ou croit-il sincèrement ne parler qu'à une machine ? Les deux versions fonctionnent - la première fait de lui un gardien de secret ; la seconde, une victime de plus du mensonge fondateur de la cité.]",
          "[MJ - QUI SONT LES CORPS : la plupart des corps affaissés le long des parois sont d'anciens agents du Réseau, manœuvrés jusqu'ici par Bunker Oméga pour y être neutralisés discrètement (voir Bunker Oméga, \"LE PROTOCOLE DE PURGE\"). Certains sont morts. D'autres sont dans un coma profond mais réversible - un agent réveillé par les PJ n'a plus aucune raison de rester loyal au Réseau qui l'a sacrifié ici.]"
        ]
      },
      "la passerelle : le cyberespace de la source [lieu secret, réservé au mj, accessible uniquement depuis la salle du trône]": {
        "nom": "LA PASSERELLE : LE CYBERESPACE DE LA SOURCE [lieu secret, réservé au MJ, accessible uniquement depuis La Salle du Trône]",
        "description": "Un fauteuil d'immersion pré-guerre, rongé par la rouille mais toujours fonctionnel, relié par un faisceau de câbles à un boîtier gravé d'un logo suisse à demi effacé - le même que celui du Registre. S'y installer et poser la main sur le capteur suffit : la puce d'identification économique de chacun, conçue à l'origine pour valider des transactions, sert ici de clé de connexion neurale, projetant la conscience du visiteur hors de son corps.",
        "personnages": [],
        "points": [
          "Un fauteuil d'immersion pré-guerre, rongé par la rouille mais toujours fonctionnel, relié par un faisceau de câbles à un boîtier gravé d'un logo suisse à demi effacé - le même que celui du Registre. S'y installer et poser la main sur le capteur suffit : la puce d'identification économique de chacun, conçue à l'origine pour valider des transactions, sert ici de clé de connexion neurale, projetant la conscience du visiteur hors de son corps."
        ]
      },
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Un marché flottant ou entouré de canaux, où les denrées fraîches (poissons, légumes hydratés) sont la monnaie d'échange la plus précieuse.",
        "personnages": [
          {
            "nom": "Joran Vif",
            "role": "Marchand Principal",
            "traits": [
              "Dirige en apparence les échanges au sein de Le Marché d'Échanges avec l'aplomb d'un notable respecté.",
              "Siège au Conseil des Cinq Sources pour le Commerce.",
              "En réalité, il détourne discrètement une partie des réserves d'eau vers des acheteurs nomades prêts à payer le prix fort, aggravant sciemment la sécheresse qui frappe la cité pour faire grimper ses profits - en exploitant une zone du réseau que la Source, bridée, ne surveille plus vraiment.",
              "N'a jamais eu à survivre à une attaque de pillards : la légende qui circule à Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" est de son invention, comme un alibi de respectabilité."
            ]
          },
          {
            "nom": "Orok Lame",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Elara Plomb",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          }
        ],
        "points": [
          "Un marché flottant ou entouré de canaux, où les denrées fraîches (poissons, légumes hydratés) sont la monnaie d'échange la plus précieuse.",
          "Joran Vif (Marchand Principal)",
          "Dirige en apparence les échanges au sein de Le Marché d'Échanges avec l'aplomb d'un notable respecté.",
          "Siège au Conseil des Cinq Sources pour le Commerce.",
          "En réalité, il détourne discrètement une partie des réserves d'eau vers des acheteurs nomades prêts à payer le prix fort, aggravant sciemment la sécheresse qui frappe la cité pour faire grimper ses profits - en exploitant une zone du réseau que la Source, bridée, ne surveille plus vraiment.",
          "N'a jamais eu à survivre à une attaque de pillards : la légende qui circule à Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" est de son invention, comme un alibi de respectabilité.",
          "Orok Lame (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Elara Plomb (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Le cœur battant de la ville : une colossale retenue d'eau issue du Rhône, filtrée par des sables et des charbons actifs. Un véritable oasis.",
        "personnages": [
          {
            "nom": "Ronan Sable",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Siège au Conseil des Cinq Sources pour l'Hydrologie - seul membre autorisé à \"consulter\" la Source elle-même, sans que les autres sachent vraiment ce que cela signifie.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Jorn Rouage",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Ashka Vif",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          }
        ],
        "points": [
          "Le cœur battant de la ville : une colossale retenue d'eau issue du Rhône, filtrée par des sables et des charbons actifs. Un véritable oasis.",
          "Ronan Sable (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Siège au Conseil des Cinq Sources pour l'Hydrologie - seul membre autorisé à \"consulter\" la Source elle-même, sans que les autres sachent vraiment ce que cela signifie.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" est la clé de la survie humaine.",
          "Jorn Rouage (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Ashka Vif (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Un barrage hydraulique restauré avec des turbines artisanales exploitant la force du courant d'un fleuve partiellement asséché.",
        "personnages": [
          {
            "nom": "Ashka Sang",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Siège au Conseil des Cinq Sources pour l'Énergie.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Jax Noyau",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Doran Soupape",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "A confusément pressenti l'existence d'une \"volonté\" derrière les systèmes de la cité - sans se douter qu'il s'agit de la Source, il l'interprète entièrement à travers le culte du Dieu-Moteur, qui vénère justement Le Passeur (voir La Salle du Trône) comme la preuve vivante de cette volonté.",
              "Influence secrètement les dirigeants de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          }
        ],
        "points": [
          "Un barrage hydraulique restauré avec des turbines artisanales exploitant la force du courant d'un fleuve partiellement asséché.",
          "Ashka Sang (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Siège au Conseil des Cinq Sources pour l'Énergie.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" en vie à lui tout seul.",
          "Jax Noyau (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Doran Soupape (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "A confusément pressenti l'existence d'une \"volonté\" derrière les systèmes de la cité - sans se douter qu'il s'agit de la Source, il l'interprète entièrement à travers le culte du Dieu-Moteur, qui vénère justement Le Passeur (voir La Salle du Trône) comme la preuve vivante de cette volonté.",
          "Influence secrètement les dirigeants de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "D'imposantes digues de terre et de pierre protégeant la ville des tempêtes de sable et des pillards assoiffés.",
        "personnages": [
          {
            "nom": "Sura Noir",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande la défense à Le Mur d'Enceinte & Les Portes.",
              "Siège au Conseil des Cinq Sources pour la Défense.",
              "Vétéran impitoyable de la dernière guerre.",
              "Ne laisse entrer personne dans Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" sans pot-de-vin."
            ]
          },
          {
            "nom": "Orok Plomb",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Sura Clou",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Sert de relais discret pour l'argent que des durs du Conseil font parvenir à Vex Rouge, l'incendiaire du Carburant (voir Cité du Carburant, Mur d'Enceinte)."
            ]
          }
        ],
        "points": [
          "D'imposantes digues de terre et de pierre protégeant la ville des tempêtes de sable et des pillards assoiffés.",
          "Sura Noir (Capitaine de la Garde)",
          "Commande la défense à Le Mur d'Enceinte & Les Portes.",
          "Siège au Conseil des Cinq Sources pour la Défense.",
          "Vétéran impitoyable de la dernière guerre.",
          "Ne laisse entrer personne dans Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" sans pot-de-vin.",
          "Orok Plomb (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Sura Clou (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Sert de relais discret pour l'argent que des durs du Conseil font parvenir à Vex Rouge, l'incendiaire du Carburant (voir Cité du Carburant, Mur d'Enceinte)."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Des habitations sur pilotis et des barges amarrées le long des canaux boueux, où l'humidité constante attire moustiques et maladies.",
        "personnages": [
          {
            "nom": "Bren Sombre",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Corin Sang",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Orok Poussière",
            "role": "Survivant Désespéré",
            "traits": [
              "Passe ses journées à observer le niveau du Rhône monter et descendre, en marmonnant des dates.",
              "Prétend goûter le poison dans l'eau bien avant qu'aucun instrument ne le détecte.",
              "Prédit que Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" mourra de soif au milieu de l'abondance."
            ]
          }
        ],
        "points": [
          "Des habitations sur pilotis et des barges amarrées le long des canaux boueux, où l'humidité constante attire moustiques et maladies.",
          "Bren Sombre (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Corin Sang (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Orok Poussière (Survivant Désespéré)",
          "Passe ses journées à observer le niveau du Rhône monter et descendre, en marmonnant des dates.",
          "Prétend goûter le poison dans l'eau bien avant qu'aucun instrument ne le détecte.",
          "Prédit que Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\" mourra de soif au milieu de l'abondance."
        ]
      },
      "serres hydroponiques blindées": {
        "nom": "Serres Hydroponiques Blindées",
        "description": "Des dômes d'acier et de verre armé protégeant des cultures verdoyantes des tempêtes acides.",
        "personnages": [
          {
            "nom": "Cade Rouage",
            "role": "Chef Agricole",
            "traits": [
              "Protège farouchement les récoltes de Serres Hydroponiques Blindées.",
              "Siège au Conseil des Cinq Sources pour l'Agriculture.",
              "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Ryn Sombre",
            "role": "Spécialiste Agricole",
            "traits": [
              "Spécialiste des mutations végétales au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
              "Considère Serres Hydroponiques Blindées comme son propre royaume."
            ]
          },
          {
            "nom": "Cyrus Noir",
            "role": "Ouvrier / Garde Agricole",
            "traits": [
              "Contrôle la distribution d'eau et de nourriture depuis Serres Hydroponiques Blindées.",
              "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          }
        ],
        "points": [
          "Des dômes d'acier et de verre armé protégeant des cultures verdoyantes des tempêtes acides.",
          "Cade Rouage (Chef Agricole)",
          "Protège farouchement les récoltes de Serres Hydroponiques Blindées.",
          "Siège au Conseil des Cinq Sources pour l'Agriculture.",
          "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Ryn Sombre (Spécialiste Agricole)",
          "Spécialiste des mutations végétales au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Considère Serres Hydroponiques Blindées comme son propre royaume.",
          "Cyrus Noir (Ouvrier / Garde Agricole)",
          "Contrôle la distribution d'eau et de nourriture depuis Serres Hydroponiques Blindées.",
          "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
        ]
      },
      "station de filtration": {
        "nom": "Station de Filtration",
        "description": "Un réseau de bassins où l'eau saumâtre est purifiée par des méthodes alchimiques.",
        "personnages": [
          {
            "nom": "Corin Noir",
            "role": "Chef de Filtration",
            "traits": [
              "Surveille la pureté de chaque bassin de Station de Filtration, obsédé par la moindre trace de toxine.",
              "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Orok Sang",
            "role": "Spécialiste en Traitement des Eaux",
            "traits": [
              "Expérimente de nouveaux procédés de purification au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
              "Considère Station de Filtration comme son propre royaume."
            ]
          },
          {
            "nom": "Elara Sang",
            "role": "Ouvrier / Garde des Bassins",
            "traits": [
              "Contrôle les vannes et la distribution d'eau depuis Station de Filtration.",
              "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          }
        ],
        "points": [
          "Un réseau de bassins où l'eau saumâtre est purifiée par des méthodes alchimiques.",
          "Corin Noir (Chef de Filtration)",
          "Surveille la pureté de chaque bassin de Station de Filtration, obsédé par la moindre trace de toxine.",
          "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Orok Sang (Spécialiste en Traitement des Eaux)",
          "Expérimente de nouveaux procédés de purification au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Considère Station de Filtration comme son propre royaume.",
          "Elara Sang (Ouvrier / Garde des Bassins)",
          "Contrôle les vannes et la distribution d'eau depuis Station de Filtration.",
          "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
        ]
      },
      "élevage de bétail mutant": {
        "nom": "Élevage de Bétail Mutant",
        "description": "D'immenses enclos boueux abritant des bœufs à deux têtes et autres bêtes massives.",
        "personnages": [
          {
            "nom": "Nova Lame",
            "role": "Chef Agricole",
            "traits": [
              "Protège farouchement les récoltes de Élevage de Bétail Mutant.",
              "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Kael Noir",
            "role": "Spécialiste Agricole",
            "traits": [
              "Spécialiste des mutations végétales au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
              "Considère Élevage de Bétail Mutant comme son propre royaume."
            ]
          },
          {
            "nom": "Zane Froid",
            "role": "Ouvrier / Garde Agricole",
            "traits": [
              "Contrôle la distribution d'eau et de nourriture depuis Élevage de Bétail Mutant.",
              "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          }
        ],
        "points": [
          "D'immenses enclos boueux abritant des bœufs à deux têtes et autres bêtes massives.",
          "Nova Lame (Chef Agricole)",
          "Protège farouchement les récoltes de Élevage de Bétail Mutant.",
          "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Kael Noir (Spécialiste Agricole)",
          "Spécialiste des mutations végétales au service de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Considère Élevage de Bétail Mutant comme son propre royaume.",
          "Zane Froid (Ouvrier / Garde Agricole)",
          "Contrôle la distribution d'eau et de nourriture depuis Élevage de Bétail Mutant.",
          "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
        ]
      },
      "réserve de semences pré-apocalypse": {
        "nom": "Réserve de Semences Pré-Apocalypse",
        "description": "Un caveau maintenu à une température glaciale, contenant l'espoir de rebâtir la flore terrestre.",
        "personnages": [
          {
            "nom": "Raze Sable",
            "role": "Chef Scientifique",
            "traits": [
              "Traite les radiations",
              "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          },
          {
            "nom": "Sura Rouge",
            "role": "Spécialiste Scientifique",
            "traits": [
              "Cherche une cure",
              "Considère Réserve de Semences Pré-Apocalypse comme son propre royaume."
            ]
          },
          {
            "nom": "Gunn Sel",
            "role": "Ouvrier / Garde Scientifique",
            "traits": [
              "Savant fou",
              "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
            ]
          }
        ],
        "points": [
          "Un caveau maintenu à une température glaciale, contenant l'espoir de rebâtir la flore terrestre.",
          "Raze Sable (Chef Scientifique)",
          "Traite les radiations",
          "Totalement loyal envers les idéaux de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\".",
          "Sura Rouge (Spécialiste Scientifique)",
          "Cherche une cure",
          "Considère Réserve de Semences Pré-Apocalypse comme son propre royaume.",
          "Gunn Sel (Ouvrier / Garde Scientifique)",
          "Savant fou",
          "Connaît les secrets les plus sombres de Cité de l'Eau & Alimentation - \"Les Gardiens de la Source\"."
        ]
      }
    }
  },
  "l'ile des anciens": {
    "num": "5",
    "name": "L'ILE DES ANCIENS - \"LE PARADIS PERDU\"",
    "specialty": "technologie pré-apocalyptique intacte, agriculture abondante",
    "strength": "autosuffisante, riche, civilisée",
    "weakness": "isolée, difficile à atteindre",
    "particularity": "certains doutent même qu'elle existe vraiment - bien peu possèdent encore un sous-marin en état de marche pour vérifier.",
    "geo": "Émergée dans l'océan Atlantique, à l'ouest du détroit de Gibraltar, quand le niveau des mers a reculé - un ancien bunker sous-marin pré-guerre remonté à la surface, accessible aujourd'hui uniquement par sous-marin.",
    "gps": "36.0000° N, 8.5000° O (Atlantique, à l'ouest de Gibraltar)",
    "foundation": "Inconnue en tant que bunker sous-marin pré-guerre - mais son émergence à la surface, entre 2100 et 2150, avec le recul général du niveau des mers (voir CLIMAT ET ENVIRONNEMENT), a bien été observée par plusieurs cités côtières.",
    "params": "Santé 95, Technologie 95, Richesse 95, Carburant 95, Nourriture 95, Bonheur 95, Armement 95",
    "stats": {
      "santé": 95,
      "technologie": 95,
      "richesse": 95,
      "carburant": 95,
      "nourriture": 95,
      "bonheur": 95,
      "armement": 95
    },
    "tension": "Aucune connue. C'est bien là ce qui est le plus troublant : depuis des décennies, aucune rumeur de crise, de famine ou de conflit n'a jamais filtré à son sujet — un silence si parfait qu'il en devient suspect pour quiconque y réfléchit vraiment. Lieux et Personnages Notables : >> Le Marché d'Échanges [Description du lieu : Un bazar étrangement calme, organisé sur des quais en pierre blanche. On y échange des connaissances et des micro-puces pré-guerre.] - Nova Poussière (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère L'Ile des Anciens - \"Le Paradis Perdu\" comme le seul havre de paix rentable. - Sia Lame (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de L'Ile des Anciens - \"Le Paradis Perdu\". - Jorn Cendre (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de L'Ile des Anciens - \"Le Paradis Perdu\". >> La Citerne Centrale [Description du lieu : Une usine de dessalinisation silencieuse, produisant une eau pure sans aucun effort apparent, grâce à une technologie oubliée.] - Sura Rouage (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de L'Ile des Anciens - \"Le Paradis Perdu\" est la clé de la survie humaine. - Raze Soupape (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de L'Ile des Anciens - \"Le Paradis Perdu\". - Tala Noir (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de L'Ile des Anciens - \"Le Paradis Perdu\". >> Le Générateur Principal [Description du lieu : Une mystérieuse sphère bourdonnante émettant une douce lumière bleue, d'origine inconnue, qui alimente toute l'île sans jamais faiblir.] - Nova Sombre (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient L'Ile des Anciens - \"Le Paradis Perdu\" en vie à lui tout seul. - Ronan Soupape (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de L'Ile des Anciens - \"Le Paradis Perdu\". - Gunn Sang (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de L'Ile des Anciens - \"Le Paradis Perdu\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : L'océan tumultueux et une série de champs de force électromagnétiques discrets qui détruisent tout navire non autorisé approchant des côtes.] - Jax Sel (Capitaine de la Garde) - Commande la défense à Le Mur d'Enceinte & Les Portes. - Vétéran impitoyable de la dernière guerre. - Ne laisse entrer personne dans L'Ile des Anciens - \"Le Paradis Perdu\" sans pot-de-vin. - Raze Noyau (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans L'Ile des Anciens - \"Le Paradis Perdu\". - Sia Acier (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de L'Ile des Anciens - \"Le Paradis Perdu\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Des habitations utopiques, lisses et blanches, mais étrangement désertes, comme si la population avait mystérieusement disparu des décennies plus tôt.] - Corin Sable (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de L'Ile des Anciens - \"Le Paradis Perdu\". - Brix Rouage (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de L'Ile des Anciens - \"Le Paradis Perdu\". - Nova Froid (Survivant Désespéré) - Se tient immobile des heures durant face à la mer, à compter des vagues qui ne reviennent jamais deux fois pareilles. - Prétend que l'île elle-même rêve, et que ses habitants ne sont que des figures dans ce rêve. - Prédit que L'Ile des Anciens - \"Le Paradis Perdu\" disparaîtra le jour où quelqu'un cessera enfin d'y croire. >> Centre de Données Pré-Guerre [Description du lieu : Une immense bibliothèque de données où l'histoire du monde avant les bombes est stockée.] - Orok Noyau (Chef Haute Technologie) - Garde les secrets technologiques pré-guerre à Centre de Données Pré-Guerre. - Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\". - Corin Sable (Spécialiste Haute Technologie) - Cyborg fidèle uniquement à l'ordinateur central de L'Ile des Anciens - \"Le Paradis Perdu\". - Considère Centre de Données Pré-Guerre comme son propre royaume. - Finch Froid (Ouvrier / Garde Haute Technologie) - Chercheur obsédé par l'optimisation humaine à Centre de Données Pré-Guerre. - Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\". >> Complexe Agricole Automatisé [Description du lieu : Des champs gérés entièrement par des drones agricoles silencieux, sans la moindre intervention humaine.] - Joran Acier (Chef Agricole) - Protège farouchement les récoltes de Complexe Agricole Automatisé. - Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\". - Vex Sang (Spécialiste Agricole) - Spécialiste des mutations végétales au service de L'Ile des Anciens - \"Le Paradis Perdu\". - Considère Complexe Agricole Automatisé comme son propre royaume. - Vex Sombre (Ouvrier / Garde Agricole) - Contrôle la distribution d'eau et de nourriture depuis Complexe Agricole Automatisé. - Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\". >> Hôpital Miraculeux [Description du lieu : Des robots chirurgiens d'une précision inouïe soignant les rares élus autorisés à fouler l'île.] - Sura Poussière (Chef Médical) - A dédié sa vie à soigner les affligés de Hôpital Miraculeux. - Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\". - Kael Sable (Spécialiste Médical) - Mène des expériences illégales pour la gloire de L'Ile des Anciens - \"Le Paradis Perdu\". - Considère Hôpital Miraculeux comme son propre royaume. - Sia Moteur (Ouvrier / Garde Médical) - Infecté par la peste, cache ses symptômes tout en travaillant à Hôpital Miraculeux. - Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\". >> Centre de Commandement Tactique [Description du lieu : Une salle de guerre silencieuse scannée par des radars qui n'ont jamais cessé de fonctionner.] - Tala Poussière (Chef Militaire) - Chef d'armurerie stockant l'arsenal de Centre de Commandement Tactique. - Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\". - Talin Cendre (Spécialiste Militaire) - Prépare la prochaine guerre d'expansion de L'Ile des Anciens - \"Le Paradis Perdu\". - Considère Centre de Commandement Tactique comme son propre royaume. - Ryn Noir (Ouvrier / Garde Militaire) - Instructeur brutal formant les recrues de Centre de Commandement Tactique. - Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\". ------------------------------------------------------------------------",
    "clock": null,
    "lore": [],
    "buildings": {
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Un bazar étrangement calme, organisé sur des quais en pierre blanche. On y échange des connaissances et des micro-puces pré-guerre.",
        "personnages": [
          {
            "nom": "Nova Poussière",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère L'Ile des Anciens - \"Le Paradis Perdu\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Sia Lame",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Jorn Cendre",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "Un bazar étrangement calme, organisé sur des quais en pierre blanche. On y échange des connaissances et des micro-puces pré-guerre.",
          "Nova Poussière (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère L'Ile des Anciens - \"Le Paradis Perdu\" comme le seul havre de paix rentable.",
          "Sia Lame (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Jorn Cendre (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Une usine de dessalinisation silencieuse, produisant une eau pure sans aucun effort apparent, grâce à une technologie oubliée.",
        "personnages": [
          {
            "nom": "Sura Rouage",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de L'Ile des Anciens - \"Le Paradis Perdu\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Raze Soupape",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Tala Noir",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "Une usine de dessalinisation silencieuse, produisant une eau pure sans aucun effort apparent, grâce à une technologie oubliée.",
          "Sura Rouage (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de L'Ile des Anciens - \"Le Paradis Perdu\" est la clé de la survie humaine.",
          "Raze Soupape (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Tala Noir (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Une mystérieuse sphère bourdonnante émettant une douce lumière bleue, d'origine inconnue, qui alimente toute l'île sans jamais faiblir.",
        "personnages": [
          {
            "nom": "Nova Sombre",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient L'Ile des Anciens - \"Le Paradis Perdu\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Ronan Soupape",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Gunn Sang",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "Une mystérieuse sphère bourdonnante émettant une douce lumière bleue, d'origine inconnue, qui alimente toute l'île sans jamais faiblir.",
          "Nova Sombre (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient L'Ile des Anciens - \"Le Paradis Perdu\" en vie à lui tout seul.",
          "Ronan Soupape (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Gunn Sang (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "L'océan tumultueux et une série de champs de force électromagnétiques discrets qui détruisent tout navire non autorisé approchant des côtes.",
        "personnages": [
          {
            "nom": "Jax Sel",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande la défense à Le Mur d'Enceinte & Les Portes.",
              "Vétéran impitoyable de la dernière guerre.",
              "Ne laisse entrer personne dans L'Ile des Anciens - \"Le Paradis Perdu\" sans pot-de-vin."
            ]
          },
          {
            "nom": "Raze Noyau",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Sia Acier",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Fait affaire avec les ennemis de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "L'océan tumultueux et une série de champs de force électromagnétiques discrets qui détruisent tout navire non autorisé approchant des côtes.",
          "Jax Sel (Capitaine de la Garde)",
          "Commande la défense à Le Mur d'Enceinte & Les Portes.",
          "Vétéran impitoyable de la dernière guerre.",
          "Ne laisse entrer personne dans L'Ile des Anciens - \"Le Paradis Perdu\" sans pot-de-vin.",
          "Raze Noyau (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Sia Acier (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Fait affaire avec les ennemis de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Des habitations utopiques, lisses et blanches, mais étrangement désertes, comme si la population avait mystérieusement disparu des décennies plus tôt.",
        "personnages": [
          {
            "nom": "Corin Sable",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Brix Rouage",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Nova Froid",
            "role": "Survivant Désespéré",
            "traits": [
              "Se tient immobile des heures durant face à la mer, à compter des vagues qui ne reviennent jamais deux fois pareilles.",
              "Prétend que l'île elle-même rêve, et que ses habitants ne sont que des figures dans ce rêve.",
              "Prédit que L'Ile des Anciens - \"Le Paradis Perdu\" disparaîtra le jour où quelqu'un cessera enfin d'y croire."
            ]
          }
        ],
        "points": [
          "Des habitations utopiques, lisses et blanches, mais étrangement désertes, comme si la population avait mystérieusement disparu des décennies plus tôt.",
          "Corin Sable (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Brix Rouage (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Nova Froid (Survivant Désespéré)",
          "Se tient immobile des heures durant face à la mer, à compter des vagues qui ne reviennent jamais deux fois pareilles.",
          "Prétend que l'île elle-même rêve, et que ses habitants ne sont que des figures dans ce rêve.",
          "Prédit que L'Ile des Anciens - \"Le Paradis Perdu\" disparaîtra le jour où quelqu'un cessera enfin d'y croire."
        ]
      },
      "centre de données pré-guerre": {
        "nom": "Centre de Données Pré-Guerre",
        "description": "Une immense bibliothèque de données où l'histoire du monde avant les bombes est stockée.",
        "personnages": [
          {
            "nom": "Orok Noyau",
            "role": "Chef Haute Technologie",
            "traits": [
              "Garde les secrets technologiques pré-guerre à Centre de Données Pré-Guerre.",
              "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Corin Sable",
            "role": "Spécialiste Haute Technologie",
            "traits": [
              "Cyborg fidèle uniquement à l'ordinateur central de L'Ile des Anciens - \"Le Paradis Perdu\".",
              "Considère Centre de Données Pré-Guerre comme son propre royaume."
            ]
          },
          {
            "nom": "Finch Froid",
            "role": "Ouvrier / Garde Haute Technologie",
            "traits": [
              "Chercheur obsédé par l'optimisation humaine à Centre de Données Pré-Guerre.",
              "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "Une immense bibliothèque de données où l'histoire du monde avant les bombes est stockée.",
          "Orok Noyau (Chef Haute Technologie)",
          "Garde les secrets technologiques pré-guerre à Centre de Données Pré-Guerre.",
          "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Corin Sable (Spécialiste Haute Technologie)",
          "Cyborg fidèle uniquement à l'ordinateur central de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Considère Centre de Données Pré-Guerre comme son propre royaume.",
          "Finch Froid (Ouvrier / Garde Haute Technologie)",
          "Chercheur obsédé par l'optimisation humaine à Centre de Données Pré-Guerre.",
          "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      },
      "complexe agricole automatisé": {
        "nom": "Complexe Agricole Automatisé",
        "description": "Des champs gérés entièrement par des drones agricoles silencieux, sans la moindre intervention humaine.",
        "personnages": [
          {
            "nom": "Joran Acier",
            "role": "Chef Agricole",
            "traits": [
              "Protège farouchement les récoltes de Complexe Agricole Automatisé.",
              "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Vex Sang",
            "role": "Spécialiste Agricole",
            "traits": [
              "Spécialiste des mutations végétales au service de L'Ile des Anciens - \"Le Paradis Perdu\".",
              "Considère Complexe Agricole Automatisé comme son propre royaume."
            ]
          },
          {
            "nom": "Vex Sombre",
            "role": "Ouvrier / Garde Agricole",
            "traits": [
              "Contrôle la distribution d'eau et de nourriture depuis Complexe Agricole Automatisé.",
              "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "Des champs gérés entièrement par des drones agricoles silencieux, sans la moindre intervention humaine.",
          "Joran Acier (Chef Agricole)",
          "Protège farouchement les récoltes de Complexe Agricole Automatisé.",
          "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Vex Sang (Spécialiste Agricole)",
          "Spécialiste des mutations végétales au service de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Considère Complexe Agricole Automatisé comme son propre royaume.",
          "Vex Sombre (Ouvrier / Garde Agricole)",
          "Contrôle la distribution d'eau et de nourriture depuis Complexe Agricole Automatisé.",
          "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      },
      "hôpital miraculeux": {
        "nom": "Hôpital Miraculeux",
        "description": "Des robots chirurgiens d'une précision inouïe soignant les rares élus autorisés à fouler l'île.",
        "personnages": [
          {
            "nom": "Sura Poussière",
            "role": "Chef Médical",
            "traits": [
              "A dédié sa vie à soigner les affligés de Hôpital Miraculeux.",
              "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Kael Sable",
            "role": "Spécialiste Médical",
            "traits": [
              "Mène des expériences illégales pour la gloire de L'Ile des Anciens - \"Le Paradis Perdu\".",
              "Considère Hôpital Miraculeux comme son propre royaume."
            ]
          },
          {
            "nom": "Sia Moteur",
            "role": "Ouvrier / Garde Médical",
            "traits": [
              "Infecté par la peste, cache ses symptômes tout en travaillant à Hôpital Miraculeux.",
              "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "Des robots chirurgiens d'une précision inouïe soignant les rares élus autorisés à fouler l'île.",
          "Sura Poussière (Chef Médical)",
          "A dédié sa vie à soigner les affligés de Hôpital Miraculeux.",
          "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Kael Sable (Spécialiste Médical)",
          "Mène des expériences illégales pour la gloire de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Considère Hôpital Miraculeux comme son propre royaume.",
          "Sia Moteur (Ouvrier / Garde Médical)",
          "Infecté par la peste, cache ses symptômes tout en travaillant à Hôpital Miraculeux.",
          "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      },
      "centre de commandement tactique": {
        "nom": "Centre de Commandement Tactique",
        "description": "Une salle de guerre silencieuse scannée par des radars qui n'ont jamais cessé de fonctionner.",
        "personnages": [
          {
            "nom": "Tala Poussière",
            "role": "Chef Militaire",
            "traits": [
              "Chef d'armurerie stockant l'arsenal de Centre de Commandement Tactique.",
              "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          },
          {
            "nom": "Talin Cendre",
            "role": "Spécialiste Militaire",
            "traits": [
              "Prépare la prochaine guerre d'expansion de L'Ile des Anciens - \"Le Paradis Perdu\".",
              "Considère Centre de Commandement Tactique comme son propre royaume."
            ]
          },
          {
            "nom": "Ryn Noir",
            "role": "Ouvrier / Garde Militaire",
            "traits": [
              "Instructeur brutal formant les recrues de Centre de Commandement Tactique.",
              "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
            ]
          }
        ],
        "points": [
          "Une salle de guerre silencieuse scannée par des radars qui n'ont jamais cessé de fonctionner.",
          "Tala Poussière (Chef Militaire)",
          "Chef d'armurerie stockant l'arsenal de Centre de Commandement Tactique.",
          "Totalement loyal envers les idéaux de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Talin Cendre (Spécialiste Militaire)",
          "Prépare la prochaine guerre d'expansion de L'Ile des Anciens - \"Le Paradis Perdu\".",
          "Considère Centre de Commandement Tactique comme son propre royaume.",
          "Ryn Noir (Ouvrier / Garde Militaire)",
          "Instructeur brutal formant les recrues de Centre de Commandement Tactique.",
          "Connaît les secrets les plus sombres de L'Ile des Anciens - \"Le Paradis Perdu\"."
        ]
      }
    }
  },
  "bunker oméga": {
    "num": "6",
    "name": "BUNKER OMÉGA - \"LES FANTÔMES D'ACIER\"",
    "specialty": "cité souterraine ultra-avancée, énergie nucléaire",
    "strength": "technologie la plus avancée du monde",
    "weakness": "enfermée dans son secret, isolement social",
    "particularity": "n'intervient pas officiellement, manipule via agents secrets",
    "geo": "Profondément enfoui sous les ruines de Genève (Ancienne Suisse), protégé par le massif alpin.",
    "gps": "46.2044° N, 6.1432° E (Genève)",
    "foundation": "2041 (complexe militaro-scientifique pré-guerre, scellé et occupé en continu dès la Première Guerre Nucléaire de 2050).",
    "params": "Santé 95, Technologie 100, Richesse 50, Carburant 100, Nourriture 50, Bonheur 55, Armement 100",
    "stats": {
      "santé": 95,
      "technologie": 100,
      "richesse": 50,
      "carburant": 100,
      "nourriture": 50,
      "bonheur": 55,
      "armement": 100
    },
    "tension": "Des failles de synchronisation apparaissent dans le Réseau. Plusieurs agents infiltrés dans les cités de surface cessent de répondre aux directives, ou pire, commencent à développer une volonté propre. Le Haut Conseil du Bunker doit décider : purger les agents \"dérivants\" au risque de révéler leur existence, ou les laisser dériver au risque de perdre le contrôle du monde de surface.",
    "clock": null,
    "lore": [
      {
        "title": "LE HAUT CONSEIL : LES HÉRITIERS DE LA GUERRE",
        "text": "Le Haut Conseil de Bunker Oméga n'est pas fusionné au Réseau : ce sont des humains, descendants directs des plus brillants scientifiques militaires que le monde d'avant-guerre ait produits - une aristocratie du savoir transmise de génération en génération depuis la fondation du Bunker en 2041. Ils dirigent le Réseau comme on dirige un instrument : avec une précision froide, jamais comme des égaux de la conscience collective qu'ils pilotent. [MJ - à votre discrétion : cette distance affichée entre le Conseil et le Réseau est-elle totale, ou l'un des Hérités a-t-il, en secret, laissé le Réseau infiltrer sa propre conscience ? Un bon ressort pour un futur rebondissement, à réserver si vous voulez complexifier davantage la frontière entre humain et collectif.] -----------------------------------------------------------------------LE PROTOCOLE DE PURGE : QUE FAIT-ON D'UN AGENT EN DÉRIVE ? -----------------------------------------------------------------------Face à un agent qui commence à \"dériver\" (voir \"LE RÉSEAU : LE SECRET DE BUNKER OMÉGA\"), le Haut Conseil applique, sans exception ni état d'âme, une escalade en trois paliers : 1. DÉTOURNEMENT DISCRET - tant que l'agent garde un contrôle modéré de lui-même, on le manœuvre, via de fausses missions et de faux ordres transmis par le Réseau, pour qu'il se rapproche, sans le savoir, de La Salle du Trône (Cité de l'Eau & Alimentation - voir \"LE RÉFLEXE DE DÉFENSE\"). Le protocole de sécurité de la Source, hostile à toute signature synchronisée au Réseau, s'occupe du reste - une mort ou une incapacitation qui ne remonte jamais jusqu'au Bunker. 2. SURCHARGE SYNAPTIQUE - si l'agent échappe à ce premier filet, ou n'est plus assez sous contrôle pour être orienté vers la Cité de l'Eau, le Bunker déclenche à distance une surcharge dans l'implant de synchronisation posé lors de son \"réveil\", dans l'espoir de provoquer une amnésie totale plutôt qu'une mort - un agent amnésique ne peut plus trahir personne, ni le Réseau, ni lui-même. 3. ASSASSINAT - en dernier recours, si l'agent occupait un poste trop sensible pour qu'on le laisse survivre sous quelque forme que ce soit, le Conseil ordonne une élimination directe, généralement exécutée par un autre agent du Réseau en poste dans la même cité. [MJ - CONSÉQUENCE DE CAMPAGNE : les PJ qui visitent La Salle du Trône (Cité de l'Eau & Alimentation) peuvent y trouver, outre Le Passeur, les restes ou les corps encore comateux d'anciens agents \"purgés\" au premier palier - certains n'étant peut-être pas tout à fait morts. Un agent comateux mais vivant, retrouvé et réveillé par les PJ, est une source d'intrigue immense : il connaît le Réseau de l'intérieur et n'a plus aucune raison de lui rester loyal.] -----------------------------------------------------------------------RELATIONS AVEC LES DIX CITÉS DE SURFACE : LE GRAND MÉCHANT LOUP -----------------------------------------------------------------------Bunker Oméga n'a strictement aucune existence diplomatique reconnue. Aucune cité ne soupçonne sa réalité : tout ce qui en subsiste dans la culture populaire, ce sont des bruits de couloir, des contes pour enfants, des histoires qu'on raconte pour faire peur aux petits qui traînent trop tard dans les Taudis - jamais la moindre preuve tangible. Le folklore du bassin en a fait le miroir inversé de L'Île des Anciens : là où l'Île est devenue une private joke, un \"paradis\" trop beau pour qu'on y croie encore, Bunker Oméga est resté \"le Grand Méchant Loup\" - le monstre sous le lit du monde entier, dont on jure l'existence sans jamais oser vraiment y croire. Toute interaction réelle avec les neuf autres cités passe exclusivement par les agents du Réseau, jamais par un canal ouvert. Lieux et Personnages Notables : >> Le Marché d'Échanges [Description du lieu : Un réseau de couloirs souterrains éclairés au néon blafard, où les survivants troquent des composants électroniques rares contre des rations. L'air y est recyclé et l'écho des murmures se répercute sur l'acier rouillé.] - Kael Clou (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère Bunker Oméga - \"Les Fantômes d'Acier\" comme le seul havre de paix rentable. - Kaelen Cendre (Garde du Marché) [MJ — Archétype brisé : agent en rupture] - Protège les marchands de Le Marché d'Échanges, en apparence par simple loyauté. - En réalité, c'est un agent du Réseau dont la synchronisation avec la conscience collective se dégrade depuis des mois : il commence à ressentir des émotions qui ne lui \"appartiennent\" pas censément, dont une affection sincère et grandissante pour Kael Clou, le marchand qu'il est censé surveiller. - Sous stress, il lui arrive de réciter malgré lui des phrases identiques à celles d'agents d'autres cités — un tic qu'il ne s'explique pas lui-même et qui le terrifie en secret. - Gunn Sable (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Bunker Oméga - \"Les Fantômes d'Acier\". >> La Citerne Centrale [Description du lieu : Une immense cuve d'eau purifiée enfouie sous la roche, gardée 24h/24 par des cyborgs. L'eau y est cristalline, un luxe inestimable dans ce monde de cendres.] - Bren Vif (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Bunker Oméga - \"Les Fantômes d'Acier\" est la clé de la survie humaine. - Ashka Rouge (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Bunker Oméga - \"Les Fantômes d'Acier\". - Brix Poussière (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Bunker Oméga - \"Les Fantômes d'Acier\". >> Le Générateur Principal [Description du lieu : Le cœur nucléaire du bunker. Une salle gigantesque saturée du bourdonnement constant des turbines. La chaleur y est oppressante et la lumière d'un bleu artificiel.] - Ashka Noyau (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Bunker Oméga - \"Les Fantômes d'Acier\" en vie à lui tout seul. - Jax Vif (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Bunker Oméga - \"Les Fantômes d'Acier\". - Ashka Sang (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de Bunker Oméga - \"Les Fantômes d'Acier\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : De massives portes blindées en titane, capables de résister à une explosion atomique. L'entrée est camouflée dans la montagne et surveillée par des tourelles automatisées.] - Bren Noir (Capitaine de la Garde) - Commande la défense à Le Mur d'Enceinte & Les Portes. - Vétéran impitoyable de la dernière guerre. - Ne laisse entrer personne dans Bunker Oméga - \"Les Fantômes d'Acier\" sans pot-de-vin. - Jax Poussière (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Bunker Oméga - \"Les Fantômes d'Acier\". - Zane Noir (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de Bunker Oméga - \"Les Fantômes d'Acier\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Des niveaux inférieurs étroits où la majorité de la population s'entasse dans des modules d'habitation standardisés, sous la lueur de néons grésillants.] - Finch Rouge (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Bunker Oméga - \"Les Fantômes d'Acier\". - Ryn Vif (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Bunker Oméga - \"Les Fantômes d'Acier\". - Doran Noir (Survivant Désespéré) - Passe ses nuits collé aux vieux moniteurs radar du bunker, à guetter un signal qui ne vient jamais. - Prétend entendre les voix des officiers morts avant la Première Guerre à travers les murs. - Jure que Bunker Oméga - \"Les Fantômes d'Acier\" s'effondrera \"le jour où le dernier d'entre eux cessera de mentir\" - personne ne sait ce que ça veut dire. >> Noyau de l'Intelligence Artificielle [Description du lieu : Un sanctuaire glacé où trônent les banques mémorielles d'une IA d'avant-guerre. Des câbles courent partout comme un réseau neuronal mécanique.] - Gunn Ferraille (Chef Haute Technologie) - Garde les secrets technologiques pré-guerre à Noyau de l'Intelligence Artificielle. - Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\". - Ines Noyau (Spécialiste Haute Technologie) - Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\". - Considère Noyau de l'Intelligence Artificielle comme son propre royaume. - Orok Poussière (Ouvrier / Garde Haute Technologie) - Chercheur obsédé par l'optimisation humaine à Noyau de l'Intelligence Artificielle. - Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\". >> Ateliers de Drones Autonomes [Description du lieu : Des chaînes d'assemblage immaculées où des bras robotiques assemblent inlassablement des drones de surveillance. L'odeur d'ozone et d'huile chaude y est omniprésente.] - Joran Plomb (Chef Haute Technologie) - Garde les secrets technologiques pré-guerre à Ateliers de Drones Autonomes. - Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\". - Tala Poussière (Spécialiste Haute Technologie) - Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\". - Considère Ateliers de Drones Autonomes comme son propre royaume. - Kael Poussière (Ouvrier / Garde Haute Technologie) - Chercheur obsédé par l'optimisation humaine à Ateliers de Drones Autonomes. - Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\". >> Laboratoire de Biologie Avancée [Description du lieu : Des salles blanches isolées où des scientifiques modifient génétiquement des plantes et expérimentent sur l'optimisation humaine à l'abri des regards.] - Zane Sombre (Chef Haute Technologie) - Garde les secrets technologiques pré-guerre à Laboratoire de Biologie Avancée. - Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\". - Brix Poussière (Spécialiste Haute Technologie) - Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\". - Considère Laboratoire de Biologie Avancée comme son propre royaume. - Cade Clou (Ouvrier / Garde Haute Technologie) - Chercheur obsédé par l'optimisation humaine à Laboratoire de Biologie Avancée. - Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\". >> Centre de Télécommunications Globales [Description du lieu : Une salle tapissée d'écrans affichant des parasites, avec des opérateurs essayant de capter les signaux d'autres survivants à travers le monde.] - Talin Rouge (Chef Scientifique) - Traite les radiations - Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\". - Bren Noir (Spécialiste Scientifique) - Cherche une cure - Considère Centre de Télécommunications Globales comme son propre royaume. - Joran Plomb (Ouvrier / Garde Scientifique) - Savant fou - Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\". ------------------------------------------------------------------------"
      }
    ],
    "buildings": {
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Un réseau de couloirs souterrains éclairés au néon blafard, où les survivants troquent des composants électroniques rares contre des rations. L'air y est recyclé et l'écho des murmures se répercute sur l'acier rouillé.",
        "personnages": [
          {
            "nom": "Kael Clou",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère Bunker Oméga - \"Les Fantômes d'Acier\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Kaelen Cendre",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges, en apparence par simple loyauté.",
              "En réalité, c'est un agent du Réseau dont la synchronisation avec la conscience collective se dégrade depuis des mois : il commence à ressentir des émotions qui ne lui \"appartiennent\" pas censément, dont une affection sincère et grandissante pour Kael Clou, le marchand qu'il est censé surveiller.",
              "Sous stress, il lui arrive de réciter malgré lui des phrases identiques à celles d'agents d'autres cités — un tic qu'il ne s'explique pas lui-même et qui le terrifie en secret."
            ]
          },
          {
            "nom": "Gunn Sable",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "Un réseau de couloirs souterrains éclairés au néon blafard, où les survivants troquent des composants électroniques rares contre des rations. L'air y est recyclé et l'écho des murmures se répercute sur l'acier rouillé.",
          "Kael Clou (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère Bunker Oméga - \"Les Fantômes d'Acier\" comme le seul havre de paix rentable.",
          "Kaelen Cendre (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges, en apparence par simple loyauté.",
          "En réalité, c'est un agent du Réseau dont la synchronisation avec la conscience collective se dégrade depuis des mois : il commence à ressentir des émotions qui ne lui \"appartiennent\" pas censément, dont une affection sincère et grandissante pour Kael Clou, le marchand qu'il est censé surveiller.",
          "Sous stress, il lui arrive de réciter malgré lui des phrases identiques à celles d'agents d'autres cités — un tic qu'il ne s'explique pas lui-même et qui le terrifie en secret.",
          "Gunn Sable (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Une immense cuve d'eau purifiée enfouie sous la roche, gardée 24h/24 par des cyborgs. L'eau y est cristalline, un luxe inestimable dans ce monde de cendres.",
        "personnages": [
          {
            "nom": "Bren Vif",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Bunker Oméga - \"Les Fantômes d'Acier\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Ashka Rouge",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Brix Poussière",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "Une immense cuve d'eau purifiée enfouie sous la roche, gardée 24h/24 par des cyborgs. L'eau y est cristalline, un luxe inestimable dans ce monde de cendres.",
          "Bren Vif (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Bunker Oméga - \"Les Fantômes d'Acier\" est la clé de la survie humaine.",
          "Ashka Rouge (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Brix Poussière (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Le cœur nucléaire du bunker. Une salle gigantesque saturée du bourdonnement constant des turbines. La chaleur y est oppressante et la lumière d'un bleu artificiel.",
        "personnages": [
          {
            "nom": "Ashka Noyau",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Bunker Oméga - \"Les Fantômes d'Acier\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Jax Vif",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Ashka Sang",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "Le cœur nucléaire du bunker. Une salle gigantesque saturée du bourdonnement constant des turbines. La chaleur y est oppressante et la lumière d'un bleu artificiel.",
          "Ashka Noyau (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Bunker Oméga - \"Les Fantômes d'Acier\" en vie à lui tout seul.",
          "Jax Vif (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Ashka Sang (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "De massives portes blindées en titane, capables de résister à une explosion atomique. L'entrée est camouflée dans la montagne et surveillée par des tourelles automatisées.",
        "personnages": [
          {
            "nom": "Bren Noir",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande la défense à Le Mur d'Enceinte & Les Portes.",
              "Vétéran impitoyable de la dernière guerre.",
              "Ne laisse entrer personne dans Bunker Oméga - \"Les Fantômes d'Acier\" sans pot-de-vin."
            ]
          },
          {
            "nom": "Jax Poussière",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Zane Noir",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Fait affaire avec les ennemis de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "De massives portes blindées en titane, capables de résister à une explosion atomique. L'entrée est camouflée dans la montagne et surveillée par des tourelles automatisées.",
          "Bren Noir (Capitaine de la Garde)",
          "Commande la défense à Le Mur d'Enceinte & Les Portes.",
          "Vétéran impitoyable de la dernière guerre.",
          "Ne laisse entrer personne dans Bunker Oméga - \"Les Fantômes d'Acier\" sans pot-de-vin.",
          "Jax Poussière (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Zane Noir (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Fait affaire avec les ennemis de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Des niveaux inférieurs étroits où la majorité de la population s'entasse dans des modules d'habitation standardisés, sous la lueur de néons grésillants.",
        "personnages": [
          {
            "nom": "Finch Rouge",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Ryn Vif",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Doran Noir",
            "role": "Survivant Désespéré",
            "traits": [
              "Passe ses nuits collé aux vieux moniteurs radar du bunker, à guetter un signal qui ne vient jamais.",
              "Prétend entendre les voix des officiers morts avant la Première Guerre à travers les murs.",
              "Jure que Bunker Oméga - \"Les Fantômes d'Acier\" s'effondrera \"le jour où le dernier d'entre eux cessera de mentir\" - personne ne sait ce que ça veut dire."
            ]
          }
        ],
        "points": [
          "Des niveaux inférieurs étroits où la majorité de la population s'entasse dans des modules d'habitation standardisés, sous la lueur de néons grésillants.",
          "Finch Rouge (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Ryn Vif (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Doran Noir (Survivant Désespéré)",
          "Passe ses nuits collé aux vieux moniteurs radar du bunker, à guetter un signal qui ne vient jamais.",
          "Prétend entendre les voix des officiers morts avant la Première Guerre à travers les murs.",
          "Jure que Bunker Oméga - \"Les Fantômes d'Acier\" s'effondrera \"le jour où le dernier d'entre eux cessera de mentir\" - personne ne sait ce que ça veut dire."
        ]
      },
      "noyau de l'intelligence artificielle": {
        "nom": "Noyau de l'Intelligence Artificielle",
        "description": "Un sanctuaire glacé où trônent les banques mémorielles d'une IA d'avant-guerre. Des câbles courent partout comme un réseau neuronal mécanique.",
        "personnages": [
          {
            "nom": "Gunn Ferraille",
            "role": "Chef Haute Technologie",
            "traits": [
              "Garde les secrets technologiques pré-guerre à Noyau de l'Intelligence Artificielle.",
              "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Ines Noyau",
            "role": "Spécialiste Haute Technologie",
            "traits": [
              "Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\".",
              "Considère Noyau de l'Intelligence Artificielle comme son propre royaume."
            ]
          },
          {
            "nom": "Orok Poussière",
            "role": "Ouvrier / Garde Haute Technologie",
            "traits": [
              "Chercheur obsédé par l'optimisation humaine à Noyau de l'Intelligence Artificielle.",
              "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "Un sanctuaire glacé où trônent les banques mémorielles d'une IA d'avant-guerre. Des câbles courent partout comme un réseau neuronal mécanique.",
          "Gunn Ferraille (Chef Haute Technologie)",
          "Garde les secrets technologiques pré-guerre à Noyau de l'Intelligence Artificielle.",
          "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Ines Noyau (Spécialiste Haute Technologie)",
          "Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Considère Noyau de l'Intelligence Artificielle comme son propre royaume.",
          "Orok Poussière (Ouvrier / Garde Haute Technologie)",
          "Chercheur obsédé par l'optimisation humaine à Noyau de l'Intelligence Artificielle.",
          "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      },
      "ateliers de drones autonomes": {
        "nom": "Ateliers de Drones Autonomes",
        "description": "Des chaînes d'assemblage immaculées où des bras robotiques assemblent inlassablement des drones de surveillance. L'odeur d'ozone et d'huile chaude y est omniprésente.",
        "personnages": [
          {
            "nom": "Joran Plomb",
            "role": "Chef Haute Technologie",
            "traits": [
              "Garde les secrets technologiques pré-guerre à Ateliers de Drones Autonomes.",
              "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Tala Poussière",
            "role": "Spécialiste Haute Technologie",
            "traits": [
              "Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\".",
              "Considère Ateliers de Drones Autonomes comme son propre royaume."
            ]
          },
          {
            "nom": "Kael Poussière",
            "role": "Ouvrier / Garde Haute Technologie",
            "traits": [
              "Chercheur obsédé par l'optimisation humaine à Ateliers de Drones Autonomes.",
              "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "Des chaînes d'assemblage immaculées où des bras robotiques assemblent inlassablement des drones de surveillance. L'odeur d'ozone et d'huile chaude y est omniprésente.",
          "Joran Plomb (Chef Haute Technologie)",
          "Garde les secrets technologiques pré-guerre à Ateliers de Drones Autonomes.",
          "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Tala Poussière (Spécialiste Haute Technologie)",
          "Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Considère Ateliers de Drones Autonomes comme son propre royaume.",
          "Kael Poussière (Ouvrier / Garde Haute Technologie)",
          "Chercheur obsédé par l'optimisation humaine à Ateliers de Drones Autonomes.",
          "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      },
      "laboratoire de biologie avancée": {
        "nom": "Laboratoire de Biologie Avancée",
        "description": "Des salles blanches isolées où des scientifiques modifient génétiquement des plantes et expérimentent sur l'optimisation humaine à l'abri des regards.",
        "personnages": [
          {
            "nom": "Zane Sombre",
            "role": "Chef Haute Technologie",
            "traits": [
              "Garde les secrets technologiques pré-guerre à Laboratoire de Biologie Avancée.",
              "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Brix Poussière",
            "role": "Spécialiste Haute Technologie",
            "traits": [
              "Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\".",
              "Considère Laboratoire de Biologie Avancée comme son propre royaume."
            ]
          },
          {
            "nom": "Cade Clou",
            "role": "Ouvrier / Garde Haute Technologie",
            "traits": [
              "Chercheur obsédé par l'optimisation humaine à Laboratoire de Biologie Avancée.",
              "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "Des salles blanches isolées où des scientifiques modifient génétiquement des plantes et expérimentent sur l'optimisation humaine à l'abri des regards.",
          "Zane Sombre (Chef Haute Technologie)",
          "Garde les secrets technologiques pré-guerre à Laboratoire de Biologie Avancée.",
          "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Brix Poussière (Spécialiste Haute Technologie)",
          "Cyborg fidèle uniquement à l'ordinateur central de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Considère Laboratoire de Biologie Avancée comme son propre royaume.",
          "Cade Clou (Ouvrier / Garde Haute Technologie)",
          "Chercheur obsédé par l'optimisation humaine à Laboratoire de Biologie Avancée.",
          "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      },
      "centre de télécommunications globales": {
        "nom": "Centre de Télécommunications Globales",
        "description": "Une salle tapissée d'écrans affichant des parasites, avec des opérateurs essayant de capter les signaux d'autres survivants à travers le monde.",
        "personnages": [
          {
            "nom": "Talin Rouge",
            "role": "Chef Scientifique",
            "traits": [
              "Traite les radiations",
              "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          },
          {
            "nom": "Bren Noir",
            "role": "Spécialiste Scientifique",
            "traits": [
              "Cherche une cure",
              "Considère Centre de Télécommunications Globales comme son propre royaume."
            ]
          },
          {
            "nom": "Joran Plomb",
            "role": "Ouvrier / Garde Scientifique",
            "traits": [
              "Savant fou",
              "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
            ]
          }
        ],
        "points": [
          "Une salle tapissée d'écrans affichant des parasites, avec des opérateurs essayant de capter les signaux d'autres survivants à travers le monde.",
          "Talin Rouge (Chef Scientifique)",
          "Traite les radiations",
          "Totalement loyal envers les idéaux de Bunker Oméga - \"Les Fantômes d'Acier\".",
          "Bren Noir (Spécialiste Scientifique)",
          "Cherche une cure",
          "Considère Centre de Télécommunications Globales comme son propre royaume.",
          "Joran Plomb (Ouvrier / Garde Scientifique)",
          "Savant fou",
          "Connaît les secrets les plus sombres de Bunker Oméga - \"Les Fantômes d'Acier\"."
        ]
      }
    }
  },
  "cité de l'armement & défense": {
    "num": "7",
    "name": "CITÉ DE L'ARMEMENT & DÉFENSE - \"LES ARSENAUX\"",
    "specialty": "armes à feu, explosifs, blindages, véhicules de guerre",
    "strength": "puissance militaire écrasante - domine incontestablement l'armement de tout le bassin, mercenaires et milices reconnaissent sa suprématie sans discussion.",
    "weakness": "trop dépendante de matières premières - et une gouvernance fragmentée en cinq milices privées rivales, unies seulement par la peur mutuelle et le rituel de la Sélection (voir plus bas), qui pourrait voler en éclats au premier vrai désaccord stratégique.",
    "particularity": "la cité est un gigantesque complexe militaire",
    "geo": "Adossée au Mur de Sel, à l'embouchure de l'ancien détroit de Gibraltar, contrôlant d'une main de fer le seul point de passage terrestre entre l'Atlantique et le désert méditerranéen.",
    "gps": "36.1408° N, 5.3536° O (Gibraltar)",
    "foundation": "2115 (d'anciennes garnisons militaires, vétéranes de la Seconde Guerre, s'y regroupent pour verrouiller le détroit - voir \"LES HÉRITIERS DE JUGER\" pour ce qu'elles ne racontent jamais).",
    "params": "Santé 60, Technologie 85, Richesse 50, Carburant 55, Nourriture 50, Bonheur 50, Armement 100",
    "stats": {
      "santé": 60,
      "technologie": 85,
      "richesse": 50,
      "carburant": 55,
      "nourriture": 50,
      "bonheur": 50,
      "armement": 100
    },
    "tension": "Un seigneur de guerre nomade, \"Le Chacal Rouillé\", rassemble depuis des mois des bandes de pillards éparses en une armée cohérente aux portes de la cité, flairant une opportunité de mettre la main sur son arsenal. Horloge de tension (lecture humaine) : Palier 1 - Rassemblement : le Chacal Rouillé unifie ses bandes ; les patrouilles des Arsenaux commencent à croiser des éclaireurs organisés plutôt que des pillards isolés. Palier 2 - Premiers raids : des convois et avant-postes isolés sont attaqués ; au Conseil, Elara Rouage réclame publiquement une offensive préventive. Palier 3 - Siège : le Chacal Rouillé investit les abords de la cité ; le Conseil, incapable de trancher entre résistance et négociation, tranche à sa manière habituelle - un duel de champions entre la faction d'Elara Rouage et celle de Meya Rouage doit décider de la politique à suivre. Palier 4 - Rupture : soit la reddition partielle de Meya Rouage est découverte en pleine crise (le Conseil se tourne alors vers Silen Ombre et la branche Snipers & Assassins pour un règlement rapide et silencieux, bien avant d'envisager un procès public), soit elle aboutit dans l'ombre avant que quiconque ne s'en aperçoive - à vous de décider laquelle, selon ce que les PJ auront découvert. [MJ — HORLOGE CHIFFRÉE (usage application de gestion, ne pas interpréter narrativement) : CLOCK_ID: armement_siege_chacal_rouille PALIERS_TOTAL: 4 PALIER_ACTUEL: 1 INCREMENT_TRIGGERS: [cycle_sans_intervention_pj: +1, pj_negocient_directement_avec_chacal_rouille: -1, trahison_meya_decouverte: +1, pj_renforcent_les_defenses_du_mur: -1] PALIER_4_EFFET: assassinat_silencieux_meya_par_silen_ombre=possible, guerre_civile_interne_conseil=possible, risque_prise_de_la_cite=true]",
    "clock": {
      "clockId": "armement_siege_chacal_rouille",
      "paliersTotal": 4,
      "palierActuel": 1,
      "paliers": [
        {
          "palier": 1,
          "nom": "Rassemblement",
          "texte": "le Chacal Rouillé unifie ses bandes ; les patrouilles des Arsenaux commencent à croiser des éclaireurs organisés plutôt que des pillards isolés."
        },
        {
          "palier": 2,
          "nom": "Premiers raids",
          "texte": "des convois et avant-postes isolés sont attaqués ; au Conseil, Elara Rouage réclame publiquement une offensive préventive."
        },
        {
          "palier": 3,
          "nom": "Siège",
          "texte": "le Chacal Rouillé investit les abords de la cité ; le Conseil, incapable de trancher entre résistance et négociation, tranche à sa manière habituelle - un duel de champions entre la faction d'Elara Rouage et celle de Meya Rouage doit décider de la politique à suivre."
        },
        {
          "palier": 4,
          "nom": "Rupture",
          "texte": "soit la reddition partielle de Meya Rouage est découverte en pleine crise (le Conseil se tourne alors vers Silen Ombre et la branche Snipers & Assassins pour un règlement rapide et silencieux, bien avant d'envisager un procès public), soit elle aboutit dans l'ombre avant que quiconque ne s'en aperçoive - à vous de décider laquelle, selon ce que les PJ auront découvert."
        }
      ],
      "triggers": {
        "cycle_sans_intervention_pj": 1,
        "pj_negocient_directement_avec_chacal_rouille": -1,
        "trahison_meya_decouverte": 1,
        "pj_renforcent_les_defenses_du_mur": -1
      },
      "effetsPalierFinal": {}
    },
    "lore": [
      {
        "title": "LES HÉRITIERS DE JUGER : UNE ORIGINE CACHÉE",
        "text": "[MJ - SECRET DE CAMPAGNE, RACINE HISTORIQUE : voir CONTEXTE HISTORIQUE, \"2100 - Seconde Guerre Nucléaire\", \"LA VÉRITÉ DU QUIPROQUO\". Ce lien ne doit jamais être confirmé aux joueurs autrement que par recoupement d'archives fragmentaires - voir \"MÉMOIRE ET FRAGMENTS\".] Les fondateurs de Cité de l'Armement & Défense sont les héritiers directs des bunkers du camp JUGER - ces nations qui, cinquante ans durant, n'avaient jamais cessé de développer armes et super-soldats en secret, convaincues que les responsables de la frappe du 11 mars 2050 se cachaient encore quelque part. En 2100, ce sont elles qui ont interprété les tirs de purification atmosphérique d'une nation du camp RECONSTRUIRE comme une attaque, et répliqué avant même d'ouvrir un canal de communication - déclenchant la Seconde Guerre Nucléaire qui a fini par vitrifier le monde pour de bon. Quand leurs successeurs ont compris, au moins en partie, l'ampleur du désastre qu'ils avaient causé, ils n'ont pas choisi la contrition : ils ont choisi l'exil. En 2115, les survivants de JUGER se sont regroupés à l'unique endroit du bassin méditerranéen où la dispersion - trop tardive - de l'isotope purificateur avait fait chuter les radiations le plus vite : le détroit de Gibraltar, devenu depuis \"le Mur de Sel\". Officiellement, \"Les Arsenaux\" racontent une tout autre histoire : leurs ancêtres auraient été les derniers vrais soldats de l'humanité, ceux qui ont abattu les monstres responsables du 11 mars avant qu'ils ne recommencent - un mythe fondateur de justice vigilante, jamais de bavure catastrophique. Ce mensonge est si profondément enraciné dans leur culture militaire que le Conseil actuel y croit lui-même sincèrement : personne, aujourd'hui, pas même le Représentant Général en exercice, ne sait que sa nation a déclenché l'apocalypse au lieu de l'empêcher. [MJ - PISTE DE JEU : si vous voulez que cette vérité soit un jour reconstituable, envisagez des archives militaires JUGER corrompues, enfouies dans un sous-niveau restreint du Laboratoire des Explosifs ou du Dépôt d'Armes Lourdes - des fragments technique, jamais un aveu explicite, à recouper avec d'autres indices disséminés ailleurs dans le monde connu.] -----------------------------------------------------------------------LE CONSEIL DES ARSENAUX : LA SÉLECTION ANNUELLE -----------------------------------------------------------------------Le Conseil n'est pas une administration mais une réunion des plus grands fabricants d'armes de la cité, chacun à la tête d'une branche militaire distincte et d'une milice privée qui lui doit une loyauté totale : - Armes Automatiques - Elara Rouage (Usine de Fabrication d'Armes) - Infanterie - Bren Froid (Caserne d'Entraînement des Milices) - Explosifs & Artillerie Lourde - Silas Acier et Vesper Sel, co-chefs (Laboratoire des Explosifs et Dépôt d'Armes Lourdes) - Électro-Lames & Boucliers Cinétiques - Meya Rouage (Le Mur d'Enceinte & Les Portes) - Snipers & Assassins - Silen Ombre (Le Repaire des Ombres) [MJ - LA FUSION EXPLOSIFS/ARTILLERIE : les deux branches partageaient déjà tant de ressources et de personnel qu'elles ont fini par fusionner en un seul siège au Conseil - un cas unique de coexistence forcée. Silas Acier et Vesper Sel s'opposent en coulisses sur presque tout (Silas veut tout faire exploser pour tester, Vesper veut tout préserver), et se départagent souvent, faute de mieux, en désignant alternativement le champion de leur branche à la Sélection - ou en se défiant eux-mêmes en privé, une fois par cycle, pour trancher qui décide cette année-là.] La branche Snipers & Assassins est la plus récente et la plus discrète du Conseil : ses effectifs sont réduits, mais équipés d'armes silencieuses subsoniques, de fusils de précision à très longue portée et de tenues de camouflage optique (actives contre la détection à l'œil nu et aux capteurs visuels, mais totalement inefficaces contre toute détection thermique - une limite que ses membres apprennent à leurs dépens). Silen Ombre siège au Conseil moins par ambition politique que par nécessité : dans une assemblée de guerriers bruyants, sa branche est celle vers qui l'on se tourne en silence quand un problème doit disparaître sans bruit. Chaque année, la cité organise LA SÉLECTION : chaque branche désigne un champion, et ces champions s'affrontent en combats individuels à mort jusqu'au dernier. Le vainqueur offre à son commanditaire le titre de Représentant Général pour un cycle complet - un tribut lui est versé par les autres branches, il dispose d'un droit de véto sur toute décision du Conseil, et pèse deux fois plus lourd que les autres dans chaque vote. [MJ - SITUATION ACTUELLE : Meya Rouage a remporté la dernière Sélection en date et exerce donc, en ce moment même, la fonction de Représentante Générale - véto et double voix compris. C'est la personne la plus puissante du Conseil qui négocie en secret la reddition partielle face au Chacal Rouillé (voir sa fiche, Le Mur d'Enceinte). Plus l'Horloge de tension avance, plus la découverte de cette trahison serait dévastatrice : ce n'est pas une conseillère marginale qui trahit, mais la dirigeante en exercice elle-même - et si le Conseil l'apprend, c'est vers Silen Ombre et ses tireurs silencieux qu'il se tournera en premier, bien avant d'envisager un procès public.] -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS ------------------------------------------------------------------------ Cité de l'Eau & Alimentation : alliance-rivalité autour du Sel Blanc - Les Arsenaux siègent sur le gisement du Mur, les Gardiens de la Source en détiennent le raffinage. Aucun des deux ne rompra jamais cette dépendance, mais chacun rêve de la chaîne complète pour lui seul. - Cité des Métaux & Recyclage : fournisseur de matières premières le plus indispensable de tous - sans son minerai recyclé, aucune usine d'armement ne tourne. Rapport de force écrasant en faveur des Arsenaux sur le prix du minerai, qui imposent leurs prix sans discussion - mais l'un des rares points de friction réels de Cité des Métaux & Recyclage avec les autres cités : ses réparateurs sont si compétents que les combattants du bassin préfèrent souvent faire remettre en état une arme existante plutôt que d'en acheter une neuve aux Arsenaux, qui voient leurs ventes en pâtir et ne le dissimulent guère. - Cité Industrielle : partenaire technique de poids - machines et turbines contre armement lourd de protection. Une rivalité de prestige couve entre les deux quant à qui, de l'acier ou de la poudre, fait vraiment tourner le monde. - Cité du Carburant : dépendance vitale pour tous les véhicules de guerre et générateurs militaires - un embargo du Carburant paralyserait la cité en quelques semaines, ce que chaque chef de branche sait et redoute en silence. - Cité Médicale : achète cher les remèdes et prothèses pour les innombrables blessés de guerre et vétérans de la Sélection - une clientèle captive et lucrative pour la Cité Médicale. - Cité du Divertissement : les vétérans des arènes de combat s'échangent parfois entre les deux cités - un champion qui survit à la Sélection peut finir sa carrière dans la Grande Arène, et inversement. - Nuke City : fournisseur occasionnel de matériaux radioactifs pour l'armement expérimental, sous contrôle strict et méfiant des deux côtés. - Bunker Oméga : ignore tout des Arsenaux en tant que descendants de JUGER - une ironie que même le Réseau n'a jamais soupçonnée. - L'Île des Anciens : voir \"LE POSTE D'ÉCOUTE ATLANTIQUE\" plus bas. Lieux et Personnages Notables : >> LE POSTE D'ÉCOUTE ATLANTIQUE [lieu secondaire, réservé au MJ] [Description du lieu : Une casemate radar oubliée en haut du Mur, dont les antennes tournent encore, mais que plus personne ne consulte vraiment.] - Ce que les archives contiennent : des signatures radar répétées, depuis des années, indiquant une activité indéniable du côté de L'Île des Anciens - pas une preuve formelle de son existence, mais bien plus qu'un simple mirage. - Personne aux Arsenaux n'y accorde de priorité : chaque chef de branche est bien trop occupé par la course interne à l'armement en vue de la prochaine Sélection, et par les affaires courantes du bassin, pour financer une expédition ou même approfondir l'enquête. - [MJ - un technicien de garde oublié, ou un vieux registre poussiéreux jamais consulté, suffit à faire découvrir ces signatures à des PJ curieux - une preuve tangible que personne n'a jamais cherché à exploiter.] >> Le Marché d'Échanges [Description du lieu : Un bazar organisé avec une rigueur militaire. On n'y trouve que des munitions, des armes à feu rafistolées et des gilets pare-balles usés.] - Jax Soupape (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère Cité de l'Armement & Défense - \"Les Arsenaux\" comme le seul havre de paix rentable. - Talin Cendre (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Cité de l'Armement & Défense - \"Les Arsenaux\". - Jax Clou (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Cité de l'Armement & Défense - \"Les Arsenaux\". >> La Citerne Centrale [Description du lieu : Un réservoir tactique bunkerisé, dont l'eau est traitée comme une ressource militaire stratégique. Rations d'eau au compte-gouttes pour les civils.] - Tala Acier (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Cité de l'Armement & Défense - \"Les Arsenaux\" est la clé de la survie humaine. - Vesper Vif (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Cité de l'Armement & Défense - \"Les Arsenaux\". - Joran Rouge (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Cité de l'Armement & Défense - \"Les Arsenaux\". >> Le Générateur Principal [Description du lieu : Un réacteur militaire récupéré sur un ancien porte-avions échoué, alimentant la cité avec une fiabilité brutale.] - Gunn Ferraille (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Cité de l'Armement & Défense - \"Les Arsenaux\" en vie à lui tout seul. - Nova Clou (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Cité de l'Armement & Défense - \"Les Arsenaux\". - Silas Plomb (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de Cité de l'Armement & Défense - \"Les Arsenaux\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : Une forteresse de béton armé, de barbelés et de miradors lourdement armés. La porte principale est un sas de char d'assaut géant.] - Meya Rouage (Capitaine de la Garde, Représentante Générale du Conseil des Arsenaux) [MJ — Archétype brisé : négociatrice de l'ombre] - Commande officiellement la défense à Le Mur d'Enceinte & Les Portes avec une poigne de vétéran impitoyable — c'est l'image publique qu'elle cultive. - A remporté la dernière Sélection Annuelle (voir \"LE CONSEIL DES ARSENAUX\") grâce à son champion d'Électro-Lames : elle exerce donc, en ce moment même, le droit de véto et double voix de Représentante Générale - la personne la plus puissante et la plus surveillée de tout le Conseil. - En secret, elle a ouvert un canal de négociation avec le Chacal Rouillé, le seigneur de guerre qui rassemble ses forces aux portes de la cité : elle est convaincue que le Conseil des Arsenaux ne pourra pas tenir un siège prolongé, et prépare un accord de reddition partielle pour épargner des vies — un accord que le Conseil qualifierait de haute trahison s'il l'apprenait, d'autant plus impardonnable venant de sa propre dirigeante en exercice. - Ne laisse toujours entrer personne dans Cité de l'Armement & Défense - \"Les Arsenaux\" sans pot-de-vin, ce qui lui permet accessoirement de couvrir ses propres allées et venues suspectes. - Jorn Noyau (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Cité de l'Armement & Défense - \"Les Arsenaux\". - Doran Plomb (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de Cité de l'Armement & Défense - \"Les Arsenaux\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Des casernes disciplinaires où règnent l'ordre et la peur. La loi martiale y est appliquée à la lettre, le moindre vol est puni de mort.] - Raze Moteur (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Cité de l'Armement & Défense - \"Les Arsenaux\". - Cade Poussière (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Cité de l'Armement & Défense - \"Les Arsenaux\". - Ashka Vif (Survivant Désespéré) - Compte et recompte inlassablement les munitions dans les dépôts abandonnés. - Voit dans le scintillement du détroit les silhouettes de flottes qui ne sont pas encore arrivées. - Prédit que Cité de l'Armement & Défense - \"Les Arsenaux\" tombera par ses propres armes, retournées contre elle. - [MJ - une prophétie qui s'accomplit peut-être déjà, discrètement, chaque année dans l'arène de la Sélection - la cité se consume elle-même, un champion à la fois. À vous de décider si Ashka Vif y voit plus loin que ça, ou si ce n'est qu'une rumeur folle parmi d'autres.] >> Usine de Fabrication d'Armes [Description du lieu : Une usine retentissant des martèlements de forges fabriquant obus et mitrailleuses.] - Elara Rouage (Chef de la Branche Armes Automatiques, Conseil des Arsenaux) - Dirige d'une poigne de fer l'Usine de Fabrication d'Armes et la milice qui lui doit allégeance. - Traditionaliste convaincue que seule la puissance de feu brute gagne les guerres - elle méprise ouvertement les \"gadgets\" électro-cinétiques de Meya Rouage. - Faucon la plus virulente du Conseil face au Chacal Rouillé : elle exige une offensive immédiate et voit toute hésitation comme une faiblesse honteuse. - Cade Rouge (Spécialiste Militaire) - Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\". - Considère Usine de Fabrication d'Armes comme son propre royaume. - Bren Sombre (Ouvrier / Garde Militaire) - Instructeur brutal formant les recrues de Usine de Fabrication d'Armes. - Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\". >> Laboratoire des Explosifs [Description du lieu : Des bunkers semi-enterrés où l'on teste de nouvelles formulations de poudre noire et de C4.] - Silas Acier (Co-Chef de la Branche Explosifs & Artillerie Lourde, Conseil des Arsenaux) - Dirige le Laboratoire des Explosifs avec une passion presque obsessionnelle pour ses expérimentations. - Partage officiellement son siège au Conseil avec Vesper Sel (voir Dépôt d'Armes Lourdes) depuis la fusion des deux branches - une cohabitation qu'il tolère mal. - Se soucie assez peu de politique tant qu'on finance ses prochains essais - un vote facile à acheter pour qui offre les bonnes ressources. - Sur le Chacal Rouillé, change d'avis selon qui l'a le plus généreusement soutenu la semaine précédente. - Doran Sombre (Spécialiste Militaire) - Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\". - Considère Laboratoire des Explosifs comme son propre royaume. - Zane Noyau (Ouvrier / Garde Militaire) - Instructeur brutal formant les recrues de Laboratoire des Explosifs. - Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\". >> Caserne d'Entraînement des Milices [Description du lieu : Un complexe rigide où s'entraîne la garde d'élite, prônant la supériorité par la discipline.] - Bren Froid (Chef de la Branche Infanterie, Conseil des Arsenaux) - Dirige la Caserne d'Entraînement des Milices, croit en l'attrition et la discipline plus qu'en la technologie. - Se sait, en privé, inquiet : ses milices sont trop étirées pour tenir un siège prolongé - un pragmatisme qu'il ne confesserait jamais en public, de peur de passer pour un lâche. - Serait sans doute le premier à comprendre Meya Rouage s'il découvrait sa négociation secrète - et le premier à devoir choisir entre la dénoncer ou la couvrir. - Raze Noyau (Spécialiste Militaire) - Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\". - Considère Caserne d'Entraînement des Milices comme son propre royaume. - Zane Cendre (Ouvrier / Garde Militaire) - Instructeur brutal formant les recrues de Caserne d'Entraînement des Milices. - Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\". >> Dépôt d'Armes Lourdes [Description du lieu : Un coffre-fort gigantesque contenant des tourelles anti-aériennes et des roquettes encore actives.] - Vesper Sel (Co-Chef de la Branche Explosifs & Artillerie Lourde, Conseil des Arsenaux) - Dirige le Dépôt d'Armes Lourdes comme le gardien d'un trésor sacré plutôt que comme un arsenal à utiliser. - Partage officiellement son siège au Conseil avec Silas Acier depuis la fusion des deux branches - et passe le plus clair de son temps à limiter les dégâts de ses expérimentations. - Répugne à déployer les pièces les plus lourdes, de peur d'épuiser un stock d'ordonnance pré-guerre irremplaçable - ce qui exaspère Elara Rouage et les autres faucons du Conseil. - Sur le Chacal Rouillé, plaide pour ne dégainer l'artillerie qu'en tout dernier recours. - Meya Ferraille (Spécialiste Militaire) - Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\". - Considère Dépôt d'Armes Lourdes comme son propre royaume. - Gunn Plomb (Ouvrier / Garde Militaire) - Instructeur brutal formant les recrues de Dépôt d'Armes Lourdes. - Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\". >> Le Repaire des Ombres [lieu secondaire, accès restreint] [Description du lieu : Un ancien poste d'observation reconverti, sans enseigne ni garde visible - on n'y entre que si on sait déjà qu'il existe. À l'intérieur, des casiers de fusils longue portée entièrement démontés et des combinaisons aux textures changeantes, calibrées pour tromper l'œil plutôt que les capteurs.] - Silen Ombre (Chef de la Branche Snipers & Assassins, Conseil des Arsenaux) - Dirige la plus petite et la plus discrète des branches du Conseil : quelques dizaines de tireurs et d'agents plutôt que des milices entières. - Équipe ses agents d'armes silencieuses subsoniques, de fusils de précision à très longue portée et de tenues de camouflage optique - actives contre l'œil nu et les capteurs visuels, inutiles contre toute détection thermique. - Siège au Conseil moins par ambition que par nécessité : c'est vers sa branche que les autres se tournent, en silence, quand un problème doit disparaître sans bruit ni procès. - Ren Silencieux (Instructrice de Camouflage) - Forme les recrues de Le Repaire des Ombres à l'usage des tenues optiques et à leurs limites. - Répète à qui veut l'entendre qu'un tireur qui compte sur son camouflage pour se cacher d'un scanner thermique est déjà mort. - Talin Longue-Vue (Tireur d'Élite Vétéran) - Détient le record de la plus longue élimination confirmée depuis les hauteurs du Mur de Sel. - Sert accessoirement d'instructeur informel aux nouvelles recrues jugées dignes de confiance par Silen Ombre. ------------------------------------------------------------------------"
      }
    ],
    "buildings": {
      "le poste d'écoute atlantique [lieu secondaire, réservé au mj]": {
        "nom": "LE POSTE D'ÉCOUTE ATLANTIQUE [lieu secondaire, réservé au MJ]",
        "description": "Une casemate radar oubliée en haut du Mur, dont les antennes tournent encore, mais que plus personne ne consulte vraiment.",
        "personnages": [],
        "points": [
          "Une casemate radar oubliée en haut du Mur, dont les antennes tournent encore, mais que plus personne ne consulte vraiment."
        ]
      },
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Un bazar organisé avec une rigueur militaire. On n'y trouve que des munitions, des armes à feu rafistolées et des gilets pare-balles usés.",
        "personnages": [
          {
            "nom": "Jax Soupape",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère Cité de l'Armement & Défense - \"Les Arsenaux\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Talin Cendre",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          },
          {
            "nom": "Jax Clou",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Un bazar organisé avec une rigueur militaire. On n'y trouve que des munitions, des armes à feu rafistolées et des gilets pare-balles usés.",
          "Jax Soupape (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère Cité de l'Armement & Défense - \"Les Arsenaux\" comme le seul havre de paix rentable.",
          "Talin Cendre (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Jax Clou (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Un réservoir tactique bunkerisé, dont l'eau est traitée comme une ressource militaire stratégique. Rations d'eau au compte-gouttes pour les civils.",
        "personnages": [
          {
            "nom": "Tala Acier",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Cité de l'Armement & Défense - \"Les Arsenaux\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Vesper Vif",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          },
          {
            "nom": "Joran Rouge",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Un réservoir tactique bunkerisé, dont l'eau est traitée comme une ressource militaire stratégique. Rations d'eau au compte-gouttes pour les civils.",
          "Tala Acier (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Cité de l'Armement & Défense - \"Les Arsenaux\" est la clé de la survie humaine.",
          "Vesper Vif (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Joran Rouge (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Un réacteur militaire récupéré sur un ancien porte-avions échoué, alimentant la cité avec une fiabilité brutale.",
        "personnages": [
          {
            "nom": "Gunn Ferraille",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Cité de l'Armement & Défense - \"Les Arsenaux\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Nova Clou",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          },
          {
            "nom": "Silas Plomb",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Un réacteur militaire récupéré sur un ancien porte-avions échoué, alimentant la cité avec une fiabilité brutale.",
          "Gunn Ferraille (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Cité de l'Armement & Défense - \"Les Arsenaux\" en vie à lui tout seul.",
          "Nova Clou (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Silas Plomb (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "Une forteresse de béton armé, de barbelés et de miradors lourdement armés. La porte principale est un sas de char d'assaut géant.",
        "personnages": [
          {
            "nom": "Meya Rouage",
            "role": "Capitaine de la Garde, Représentante Générale du Conseil des Arsenaux",
            "traits": [
              "Commande officiellement la défense à Le Mur d'Enceinte & Les Portes avec une poigne de vétéran impitoyable — c'est l'image publique qu'elle cultive.",
              "A remporté la dernière Sélection Annuelle (voir \"LE CONSEIL DES ARSENAUX\") grâce à son champion d'Électro-Lames : elle exerce donc, en ce moment même, le droit de véto et double voix de Représentante Générale - la personne la plus puissante et la plus surveillée de tout le Conseil.",
              "En secret, elle a ouvert un canal de négociation avec le Chacal Rouillé, le seigneur de guerre qui rassemble ses forces aux portes de la cité : elle est convaincue que le Conseil des Arsenaux ne pourra pas tenir un siège prolongé, et prépare un accord de reddition partielle pour épargner des vies — un accord que le Conseil qualifierait de haute trahison s'il l'apprenait, d'autant plus impardonnable venant de sa propre dirigeante en exercice.",
              "Ne laisse toujours entrer personne dans Cité de l'Armement & Défense - \"Les Arsenaux\" sans pot-de-vin, ce qui lui permet accessoirement de couvrir ses propres allées et venues suspectes."
            ]
          },
          {
            "nom": "Jorn Noyau",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          },
          {
            "nom": "Doran Plomb",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Fait affaire avec les ennemis de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Une forteresse de béton armé, de barbelés et de miradors lourdement armés. La porte principale est un sas de char d'assaut géant.",
          "Meya Rouage (Capitaine de la Garde, Représentante Générale du Conseil des Arsenaux)",
          "Commande officiellement la défense à Le Mur d'Enceinte & Les Portes avec une poigne de vétéran impitoyable — c'est l'image publique qu'elle cultive.",
          "A remporté la dernière Sélection Annuelle (voir \"LE CONSEIL DES ARSENAUX\") grâce à son champion d'Électro-Lames : elle exerce donc, en ce moment même, le droit de véto et double voix de Représentante Générale - la personne la plus puissante et la plus surveillée de tout le Conseil.",
          "En secret, elle a ouvert un canal de négociation avec le Chacal Rouillé, le seigneur de guerre qui rassemble ses forces aux portes de la cité : elle est convaincue que le Conseil des Arsenaux ne pourra pas tenir un siège prolongé, et prépare un accord de reddition partielle pour épargner des vies — un accord que le Conseil qualifierait de haute trahison s'il l'apprenait, d'autant plus impardonnable venant de sa propre dirigeante en exercice.",
          "Ne laisse toujours entrer personne dans Cité de l'Armement & Défense - \"Les Arsenaux\" sans pot-de-vin, ce qui lui permet accessoirement de couvrir ses propres allées et venues suspectes.",
          "Jorn Noyau (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Doran Plomb (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Fait affaire avec les ennemis de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Des casernes disciplinaires où règnent l'ordre et la peur. La loi martiale y est appliquée à la lettre, le moindre vol est puni de mort.",
        "personnages": [
          {
            "nom": "Raze Moteur",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          },
          {
            "nom": "Cade Poussière",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          },
          {
            "nom": "Ashka Vif",
            "role": "Survivant Désespéré",
            "traits": [
              "Compte et recompte inlassablement les munitions dans les dépôts abandonnés.",
              "Voit dans le scintillement du détroit les silhouettes de flottes qui ne sont pas encore arrivées.",
              "Prédit que Cité de l'Armement & Défense - \"Les Arsenaux\" tombera par ses propres armes, retournées contre elle.",
              "[MJ - une prophétie qui s'accomplit peut-être déjà, discrètement, chaque année dans l'arène de la Sélection - la cité se consume elle-même, un champion à la fois. À vous de décider si Ashka Vif y voit plus loin que ça, ou si ce n'est qu'une rumeur folle parmi d'autres.]"
            ]
          }
        ],
        "points": [
          "Des casernes disciplinaires où règnent l'ordre et la peur. La loi martiale y est appliquée à la lettre, le moindre vol est puni de mort.",
          "Raze Moteur (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Cade Poussière (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Ashka Vif (Survivant Désespéré)",
          "Compte et recompte inlassablement les munitions dans les dépôts abandonnés.",
          "Voit dans le scintillement du détroit les silhouettes de flottes qui ne sont pas encore arrivées.",
          "Prédit que Cité de l'Armement & Défense - \"Les Arsenaux\" tombera par ses propres armes, retournées contre elle.",
          "[MJ - une prophétie qui s'accomplit peut-être déjà, discrètement, chaque année dans l'arène de la Sélection - la cité se consume elle-même, un champion à la fois. À vous de décider si Ashka Vif y voit plus loin que ça, ou si ce n'est qu'une rumeur folle parmi d'autres.]"
        ]
      },
      "usine de fabrication d'armes": {
        "nom": "Usine de Fabrication d'Armes",
        "description": "Une usine retentissant des martèlements de forges fabriquant obus et mitrailleuses.",
        "personnages": [
          {
            "nom": "Elara Rouage",
            "role": "Chef de la Branche Armes Automatiques, Conseil des Arsenaux",
            "traits": [
              "Dirige d'une poigne de fer l'Usine de Fabrication d'Armes et la milice qui lui doit allégeance.",
              "Traditionaliste convaincue que seule la puissance de feu brute gagne les guerres - elle méprise ouvertement les \"gadgets\" électro-cinétiques de Meya Rouage.",
              "Faucon la plus virulente du Conseil face au Chacal Rouillé : elle exige une offensive immédiate et voit toute hésitation comme une faiblesse honteuse."
            ]
          },
          {
            "nom": "Cade Rouge",
            "role": "Spécialiste Militaire",
            "traits": [
              "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
              "Considère Usine de Fabrication d'Armes comme son propre royaume."
            ]
          },
          {
            "nom": "Bren Sombre",
            "role": "Ouvrier / Garde Militaire",
            "traits": [
              "Instructeur brutal formant les recrues de Usine de Fabrication d'Armes.",
              "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Une usine retentissant des martèlements de forges fabriquant obus et mitrailleuses.",
          "Elara Rouage (Chef de la Branche Armes Automatiques, Conseil des Arsenaux)",
          "Dirige d'une poigne de fer l'Usine de Fabrication d'Armes et la milice qui lui doit allégeance.",
          "Traditionaliste convaincue que seule la puissance de feu brute gagne les guerres - elle méprise ouvertement les \"gadgets\" électro-cinétiques de Meya Rouage.",
          "Faucon la plus virulente du Conseil face au Chacal Rouillé : elle exige une offensive immédiate et voit toute hésitation comme une faiblesse honteuse.",
          "Cade Rouge (Spécialiste Militaire)",
          "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Considère Usine de Fabrication d'Armes comme son propre royaume.",
          "Bren Sombre (Ouvrier / Garde Militaire)",
          "Instructeur brutal formant les recrues de Usine de Fabrication d'Armes.",
          "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "laboratoire des explosifs": {
        "nom": "Laboratoire des Explosifs",
        "description": "Des bunkers semi-enterrés où l'on teste de nouvelles formulations de poudre noire et de C4.",
        "personnages": [
          {
            "nom": "Silas Acier",
            "role": "Co-Chef de la Branche Explosifs & Artillerie Lourde, Conseil des Arsenaux",
            "traits": [
              "Dirige le Laboratoire des Explosifs avec une passion presque obsessionnelle pour ses expérimentations.",
              "Partage officiellement son siège au Conseil avec Vesper Sel (voir Dépôt d'Armes Lourdes) depuis la fusion des deux branches - une cohabitation qu'il tolère mal.",
              "Se soucie assez peu de politique tant qu'on finance ses prochains essais - un vote facile à acheter pour qui offre les bonnes ressources.",
              "Sur le Chacal Rouillé, change d'avis selon qui l'a le plus généreusement soutenu la semaine précédente."
            ]
          },
          {
            "nom": "Doran Sombre",
            "role": "Spécialiste Militaire",
            "traits": [
              "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
              "Considère Laboratoire des Explosifs comme son propre royaume."
            ]
          },
          {
            "nom": "Zane Noyau",
            "role": "Ouvrier / Garde Militaire",
            "traits": [
              "Instructeur brutal formant les recrues de Laboratoire des Explosifs.",
              "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Des bunkers semi-enterrés où l'on teste de nouvelles formulations de poudre noire et de C4.",
          "Silas Acier (Co-Chef de la Branche Explosifs & Artillerie Lourde, Conseil des Arsenaux)",
          "Dirige le Laboratoire des Explosifs avec une passion presque obsessionnelle pour ses expérimentations.",
          "Partage officiellement son siège au Conseil avec Vesper Sel (voir Dépôt d'Armes Lourdes) depuis la fusion des deux branches - une cohabitation qu'il tolère mal.",
          "Se soucie assez peu de politique tant qu'on finance ses prochains essais - un vote facile à acheter pour qui offre les bonnes ressources.",
          "Sur le Chacal Rouillé, change d'avis selon qui l'a le plus généreusement soutenu la semaine précédente.",
          "Doran Sombre (Spécialiste Militaire)",
          "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Considère Laboratoire des Explosifs comme son propre royaume.",
          "Zane Noyau (Ouvrier / Garde Militaire)",
          "Instructeur brutal formant les recrues de Laboratoire des Explosifs.",
          "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "caserne d'entraînement des milices": {
        "nom": "Caserne d'Entraînement des Milices",
        "description": "Un complexe rigide où s'entraîne la garde d'élite, prônant la supériorité par la discipline.",
        "personnages": [
          {
            "nom": "Bren Froid",
            "role": "Chef de la Branche Infanterie, Conseil des Arsenaux",
            "traits": [
              "Dirige la Caserne d'Entraînement des Milices, croit en l'attrition et la discipline plus qu'en la technologie.",
              "Se sait, en privé, inquiet : ses milices sont trop étirées pour tenir un siège prolongé - un pragmatisme qu'il ne confesserait jamais en public, de peur de passer pour un lâche.",
              "Serait sans doute le premier à comprendre Meya Rouage s'il découvrait sa négociation secrète - et le premier à devoir choisir entre la dénoncer ou la couvrir."
            ]
          },
          {
            "nom": "Raze Noyau",
            "role": "Spécialiste Militaire",
            "traits": [
              "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
              "Considère Caserne d'Entraînement des Milices comme son propre royaume."
            ]
          },
          {
            "nom": "Zane Cendre",
            "role": "Ouvrier / Garde Militaire",
            "traits": [
              "Instructeur brutal formant les recrues de Caserne d'Entraînement des Milices.",
              "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Un complexe rigide où s'entraîne la garde d'élite, prônant la supériorité par la discipline.",
          "Bren Froid (Chef de la Branche Infanterie, Conseil des Arsenaux)",
          "Dirige la Caserne d'Entraînement des Milices, croit en l'attrition et la discipline plus qu'en la technologie.",
          "Se sait, en privé, inquiet : ses milices sont trop étirées pour tenir un siège prolongé - un pragmatisme qu'il ne confesserait jamais en public, de peur de passer pour un lâche.",
          "Serait sans doute le premier à comprendre Meya Rouage s'il découvrait sa négociation secrète - et le premier à devoir choisir entre la dénoncer ou la couvrir.",
          "Raze Noyau (Spécialiste Militaire)",
          "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Considère Caserne d'Entraînement des Milices comme son propre royaume.",
          "Zane Cendre (Ouvrier / Garde Militaire)",
          "Instructeur brutal formant les recrues de Caserne d'Entraînement des Milices.",
          "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "dépôt d'armes lourdes": {
        "nom": "Dépôt d'Armes Lourdes",
        "description": "Un coffre-fort gigantesque contenant des tourelles anti-aériennes et des roquettes encore actives.",
        "personnages": [
          {
            "nom": "Vesper Sel",
            "role": "Co-Chef de la Branche Explosifs & Artillerie Lourde, Conseil des Arsenaux",
            "traits": [
              "Dirige le Dépôt d'Armes Lourdes comme le gardien d'un trésor sacré plutôt que comme un arsenal à utiliser.",
              "Partage officiellement son siège au Conseil avec Silas Acier depuis la fusion des deux branches - et passe le plus clair de son temps à limiter les dégâts de ses expérimentations.",
              "Répugne à déployer les pièces les plus lourdes, de peur d'épuiser un stock d'ordonnance pré-guerre irremplaçable - ce qui exaspère Elara Rouage et les autres faucons du Conseil.",
              "Sur le Chacal Rouillé, plaide pour ne dégainer l'artillerie qu'en tout dernier recours."
            ]
          },
          {
            "nom": "Meya Ferraille",
            "role": "Spécialiste Militaire",
            "traits": [
              "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
              "Considère Dépôt d'Armes Lourdes comme son propre royaume."
            ]
          },
          {
            "nom": "Gunn Plomb",
            "role": "Ouvrier / Garde Militaire",
            "traits": [
              "Instructeur brutal formant les recrues de Dépôt d'Armes Lourdes.",
              "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
            ]
          }
        ],
        "points": [
          "Un coffre-fort gigantesque contenant des tourelles anti-aériennes et des roquettes encore actives.",
          "Vesper Sel (Co-Chef de la Branche Explosifs & Artillerie Lourde, Conseil des Arsenaux)",
          "Dirige le Dépôt d'Armes Lourdes comme le gardien d'un trésor sacré plutôt que comme un arsenal à utiliser.",
          "Partage officiellement son siège au Conseil avec Silas Acier depuis la fusion des deux branches - et passe le plus clair de son temps à limiter les dégâts de ses expérimentations.",
          "Répugne à déployer les pièces les plus lourdes, de peur d'épuiser un stock d'ordonnance pré-guerre irremplaçable - ce qui exaspère Elara Rouage et les autres faucons du Conseil.",
          "Sur le Chacal Rouillé, plaide pour ne dégainer l'artillerie qu'en tout dernier recours.",
          "Meya Ferraille (Spécialiste Militaire)",
          "Prépare la prochaine guerre d'expansion de Cité de l'Armement & Défense - \"Les Arsenaux\".",
          "Considère Dépôt d'Armes Lourdes comme son propre royaume.",
          "Gunn Plomb (Ouvrier / Garde Militaire)",
          "Instructeur brutal formant les recrues de Dépôt d'Armes Lourdes.",
          "Connaît les secrets les plus sombres de Cité de l'Armement & Défense - \"Les Arsenaux\"."
        ]
      },
      "le repaire des ombres [lieu secondaire, accès restreint]": {
        "nom": "Le Repaire des Ombres [lieu secondaire, accès restreint]",
        "description": "Un ancien poste d'observation reconverti, sans enseigne ni garde visible - on n'y entre que si on sait déjà qu'il existe. À l'intérieur, des casiers de fusils longue portée entièrement démontés et des combinaisons aux textures changeantes, calibrées pour tromper l'œil plutôt que les capteurs.",
        "personnages": [
          {
            "nom": "Silen Ombre",
            "role": "Chef de la Branche Snipers & Assassins, Conseil des Arsenaux",
            "traits": [
              "Dirige la plus petite et la plus discrète des branches du Conseil : quelques dizaines de tireurs et d'agents plutôt que des milices entières.",
              "Équipe ses agents d'armes silencieuses subsoniques, de fusils de précision à très longue portée et de tenues de camouflage optique - actives contre l'œil nu et les capteurs visuels, inutiles contre toute détection thermique.",
              "Siège au Conseil moins par ambition que par nécessité : c'est vers sa branche que les autres se tournent, en silence, quand un problème doit disparaître sans bruit ni procès."
            ]
          },
          {
            "nom": "Ren Silencieux",
            "role": "Instructrice de Camouflage",
            "traits": [
              "Forme les recrues de Le Repaire des Ombres à l'usage des tenues optiques et à leurs limites.",
              "Répète à qui veut l'entendre qu'un tireur qui compte sur son camouflage pour se cacher d'un scanner thermique est déjà mort."
            ]
          },
          {
            "nom": "Talin Longue-Vue",
            "role": "Tireur d'Élite Vétéran",
            "traits": [
              "Détient le record de la plus longue élimination confirmée depuis les hauteurs du Mur de Sel.",
              "Sert accessoirement d'instructeur informel aux nouvelles recrues jugées dignes de confiance par Silen Ombre."
            ]
          }
        ],
        "points": [
          "Un ancien poste d'observation reconverti, sans enseigne ni garde visible - on n'y entre que si on sait déjà qu'il existe. À l'intérieur, des casiers de fusils longue portée entièrement démontés et des combinaisons aux textures changeantes, calibrées pour tromper l'œil plutôt que les capteurs.",
          "Silen Ombre (Chef de la Branche Snipers & Assassins, Conseil des Arsenaux)",
          "Dirige la plus petite et la plus discrète des branches du Conseil : quelques dizaines de tireurs et d'agents plutôt que des milices entières.",
          "Équipe ses agents d'armes silencieuses subsoniques, de fusils de précision à très longue portée et de tenues de camouflage optique - actives contre l'œil nu et les capteurs visuels, inutiles contre toute détection thermique.",
          "Siège au Conseil moins par ambition que par nécessité : c'est vers sa branche que les autres se tournent, en silence, quand un problème doit disparaître sans bruit ni procès.",
          "Ren Silencieux (Instructrice de Camouflage)",
          "Forme les recrues de Le Repaire des Ombres à l'usage des tenues optiques et à leurs limites.",
          "Répète à qui veut l'entendre qu'un tireur qui compte sur son camouflage pour se cacher d'un scanner thermique est déjà mort.",
          "Talin Longue-Vue (Tireur d'Élite Vétéran)",
          "Détient le record de la plus longue élimination confirmée depuis les hauteurs du Mur de Sel.",
          "Sert accessoirement d'instructeur informel aux nouvelles recrues jugées dignes de confiance par Silen Ombre."
        ]
      }
    }
  },
  "cité industrielle": {
    "num": "8",
    "name": "CITÉ INDUSTRIELLE - \"LES FORGERONS D'ACIER\"",
    "specialty": "machines, pièces détachées, mécanique lourde",
    "strength": "maîtrise la production de véhicules et générateurs",
    "weakness": "nécessite beaucoup de matières premières et d'énergie",
    "particularity": "usines colossales, villes entières noyées dans la fumée",
    "geo": "Érigée sur les vestiges de Turin (Ancienne Italie), ancien joyau industriel de la Méditerranée.",
    "gps": "45.0703° N, 7.6869° E (Turin)",
    "foundation": "2107 (les survivants relèvent les fonderies à peine sept ans après la Seconde Guerre Nucléaire).",
    "params": "Santé 35, Technologie 95, Richesse 70, Carburant 50, Nourriture 50, Bonheur 45, Armement 75",
    "stats": {
      "santé": 35,
      "technologie": 95,
      "richesse": 70,
      "carburant": 50,
      "nourriture": 50,
      "bonheur": 45,
      "armement": 75
    },
    "tension": "Lutte de pouvoir interne. Les barons des grandes fonderies se disputent le contrôle du Dépôt de Ferraille et de sa main-d'œuvre forcée. Une révolte des travailleurs esclaves couve dans l'ombre des hauts-fourneaux, et certains contremaîtres cherchent secrètement des alliés parmi les PJ pour faire pencher la balance. Horloge de tension (lecture humaine) : Palier 1 - Cellules dispersées : de petits groupes clandestins, non coordonnés entre eux, se réunissent en secret dans les ateliers et les baraquements - activement traqués par Les Managers, la garde privée de la Maison Ferraille chargée de les débusquer avant qu'ils ne se rejoignent. Palier 2 - Le Cercle Républicain s'organise : ces cellules éparses finissent par se rejoindre en un vrai réseau clandestin sous la houlette de Corin Ferraille, dépassant le seul Dépôt de Ferraille pour gagner d'autres ateliers. Palier 3 - Rupture ouverte : un incident (mort d'épuisement trop visible, exécution publique ratée, sabotage découvert) fait basculer l'agitation en insurrection déclarée dans au moins un site industriel majeur. Palier 4 - Effondrement ou répression totale : soit la révolte s'empare des lignes d'assemblage et de leurs machines pour retourner l'industrie de la cité contre la Maison Ferraille et Les Managers, soit le Doyen mate la révolte dans un bain de sang qui hypothèque durablement la production - et donc l'influence - de la cité pour des années. [MJ — HORLOGE CHIFFRÉE (usage application de gestion, ne pas interpréter narrativement) : CLOCK_ID: industrielle_revolte_republicaine PALIERS_TOTAL: 4 PALIER_ACTUEL: 1 INCREMENT_TRIGGERS: [cycle_sans_intervention_pj: +1, pj_ameliorent_conditions_travailleurs: -1, sabotage_ou_execution_publique_ratee: +1, pj_negocient_entre_corin_et_doyen: -1] PALIER_4_EFFET: production_industrielle_bassin=effondre_temporairement, influence_maison_ferraille=chute_ou_consolidation, risque_guerre_civile_locale=true]",
    "clock": {
      "clockId": "industrielle_revolte_republicaine",
      "paliersTotal": 4,
      "palierActuel": 1,
      "paliers": [
        {
          "palier": 1,
          "nom": "Cellules dispersées",
          "texte": "de petits groupes clandestins, non coordonnés entre eux, se réunissent en secret dans les ateliers et les baraquements - activement traqués par Les Managers, la garde privée de la Maison Ferraille chargée de les débusquer avant qu'ils ne se rejoignent."
        },
        {
          "palier": 2,
          "nom": "Le Cercle Républicain s'organise",
          "texte": "ces cellules éparses finissent par se rejoindre en un vrai réseau clandestin sous la houlette de Corin Ferraille, dépassant le seul Dépôt de Ferraille pour gagner d'autres ateliers."
        },
        {
          "palier": 3,
          "nom": "Rupture ouverte",
          "texte": "un incident (mort d'épuisement trop visible, exécution publique ratée, sabotage découvert) fait basculer l'agitation en insurrection déclarée dans au moins un site industriel majeur."
        },
        {
          "palier": 4,
          "nom": "Effondrement ou répression totale",
          "texte": "soit la révolte s'empare des lignes d'assemblage et de leurs machines pour retourner l'industrie de la cité contre la Maison Ferraille et Les Managers, soit le Doyen mate la révolte dans un bain de sang qui hypothèque durablement la production - et donc l'influence - de la cité pour des années."
        }
      ],
      "triggers": {
        "cycle_sans_intervention_pj": 1,
        "pj_ameliorent_conditions_travailleurs": -1,
        "sabotage_ou_execution_publique_ratee": 1,
        "pj_negocient_entre_corin_et_doyen": -1
      },
      "effetsPalierFinal": {}
    },
    "lore": [
      {
        "title": "LA MAISON FERRAILLE : UNE DYNASTIE DE FER",
        "text": "Cité Industrielle n'a jamais connu qu'un seul pouvoir : celui d'une unique famille, la Maison Ferraille, dont le chef porte le titre de Doyen et gouverne d'une main de fer depuis la fondation de la cité en 2107. Il n'existe pas de conseil rival, pas de barons indépendants - seulement des intendants et des contremaîtres, nommés et révocables par la Maison, qui administrent chaque site industriel en son nom, et Les Managers, la garde privée de la famille chargée de la discipline interne - traquer les cellules clandestines, briser les grèves avant qu'elles ne prennent forme, et rappeler à chacun que rien n'échappe longtemps à la vigilance de la Maison. [MJ - SECRET DE CAMPAGNE, RACINE HISTORIQUE : la Maison Ferraille n'est pas née dans les décombres. C'était déjà, avant 2050, un empire industriel multinational - et son bunker privé, construit dans la même décennie que celui de Bunker Oméga, appartenait au camp RECONSTRUIRE (voir CONTEXTE HISTORIQUE, \"L'ENTRE-DEUX\") : redescendre et reprendre le contrôle \"quel qu'en soit le prix\". Ce bunker est devenu, avec le temps, une mine - exploitant les technologies pré-guerre de la famille pour revendiquer gaz, métaux, terres rares et minerais sur des zones entières du sous-sol du bassin. C'est sur cette base que la Maison Ferraille traite les matières premières et construit la majorité des objets manufacturés du monde connu - mais sans jamais atteindre le savoir-faire spécifique des armuriers de la Cité de l'Armement & Défense, héritiers de JUGER (voir sa fiche). Le Doyen actuel jalouse ouvertement cette expertise et rêve de l'obtenir, par n'importe quel moyen, pour asseoir la domination de sa famille sur le bassin entier.] Les lignes d'assemblage les plus avancées de la cité, ainsi que les intelligences artificielles industrielles qui les pilotent - héritières directes des systèmes de gestion de production que la famille utilisait déjà avant-guerre - restent la propriété exclusive de la Maison Ferraille. Ses ouvriers ordinaires ne les voient jamais ; seuls les intendants directs de la famille y ont accès. [MJ - à votre discrétion : Corin Ferraille (voir Le Mur d'Enceinte) partage le nom de la Maison. Une version possible - une branche mineure ou disgraciée de la famille, dont la sœur a justement été réduite en servitude sur ordre direct du Doyen, en punition d'un soutien trop visible aux idées républicaines. Cela donnerait à sa trahison une dimension bien plus personnelle qu'une simple sympathie pour des esclaves anonymes - à garder ou écarter selon ce qui sert le mieux votre table.] -----------------------------------------------------------------------LES TRAVAILLEURS FORCÉS DU DÉPÔT DE FERRAILLE -----------------------------------------------------------------------La main-d'œuvre du Dépôt de Ferraille ne vient pas d'une seule source : des débiteurs qui se sont vendus en intégralité à la Bourse de la Douleur (voir \"LE REGISTRE\"), des condamnés livrés par la justice locale de Cité Industrielle elle-même, et des fugitifs criminels d'autres cités qui préfèrent l'anonymat de la servitude à un retour chez eux. Tous finissent au même endroit, sous la même autorité : celle de Talin Sel, l'intendant du Dépôt (voir sa fiche). Le paramètre Santé (35) de la cité ne reflète en rien le bien-être de la Maison Ferraille ou de ses intendants, mais l'épuisement massif de cette main-d'œuvre : les morts par surmenage y sont si courantes qu'elles ne font plus scandale. C'est précisément cette contradiction qui nourrit la révolte : la Maison Ferraille a besoin d'une population en état de travailler pour faire tourner ses lignes d'assemblage, et chaque mort d'épuisement affaiblit sa propre industrie autant qu'elle alimente la colère de ceux qui restent. -----------------------------------------------------------------------LA RÉVOLTE RÉPUBLICAINE -----------------------------------------------------------------------Le mouvement que couvre Corin Ferraille ne réclame pas de meilleures rations ni des quarts de travail plus courts : il veut la fin pure et simple du règne de la Maison Ferraille, et l'instauration d'une république où les intendants de site répondraient à un conseil élu plutôt qu'à un Doyen héréditaire. C'est une révolution politique autant que sociale - ce qui la rend, aux yeux de la Maison, bien plus dangereuse qu'une simple mutinerie d'esclaves. [MJ - L'ORIGINE DE L'IDÉAL RÉPUBLICAIN : cet idéal n'est pas né dans les murs de Cité Industrielle. Il a germé à la Mine Profonde de Cité des Métaux & Recyclage (voir sa fiche, 3e Arrondissement), une concession louée où des travailleurs forcés de la Maison Ferraille côtoient chaque jour des citoyens d'une véritable démocratie qui votent, se présentent aux élections et interpellent leur Maire en pleine rue. Le contraste, vécu au contact direct, a fait naître chez eux l'idée qu'un autre système est possible - une idée qu'ils rapportent avec eux à chaque retour de contrat.] -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS -----------------------------------------------------------------------[MJ - déduites par recoupement des relations déjà écrites dans les fiches des autres cités.] - Cité des Métaux & Recyclage : relation la plus dense de toutes, et la plus ambivalente, déjà détaillée de leur côté - la Mine Profonde leur est louée, et c'est là qu'a germé l'idéal républicain de leurs propres esclaves. Le Doyen aimerait vendre plus de biens neufs dans tout le bassin et voit d'un mauvais œil l'excellence de leurs réparateurs, sans jamais pouvoir rompre une dépendance plus forte que le ressentiment. - Cité de l'Eau & Alimentation : allié commercial solide - eau et nourriture contre machines et turbines. Certains membres du Conseil des Cinq Sources profitent discrètement de la révolte qui couve ici, en vendant des vivres au marché noir aux deux camps à la fois. - Cité de l'Armement & Défense : partenaire technique de poids - machines et turbines contre armement lourd de protection. Une rivalité de prestige couve entre les deux quant à qui, de l'acier ou de la poudre, fait vraiment tourner le monde. - Cité du Carburant : dépendance lourde et directe à leur carburant pour les lignes d'assemblage et les convois de la Maison Ferraille - une relation purement commerciale, sans ferveur religieuse d'un côté ni de l'autre. - Cité Médicale : relation purement mercenaire, sans affection ni scrupule des deux côtés - des médecins de campagne maintiennent la main-d'œuvre juste assez en vie pour continuer à produire, contre paiement en métal et en pièces détachées. - Cité du Divertissement : fournisseur régulier pour l'entretien des mécanismes d'arène et les automates de spectacle - purement commercial. - Nuke City : échanges limités en composants blindés et machines - prudents des deux côtés, sans lien fort. - Bunker Oméga : aucune existence reconnue - une ironie que même le Réseau n'a jamais soupçonnée, puisque la Maison Ferraille est elle-même l'héritière d'un camp historique différent (voir \"LES HÉRITIERS DE JUGER\", Cité de l'Armement, pour le même phénomène). - L'Île des Anciens : aucun contact connu. Lieux et Personnages Notables : >> Le Marché d'Échanges [Description du lieu : Une place boueuse entourée de carcasses de camions. On y négocie des pièces de moteurs, de la tôle et des outils couverts de cambouis dans un vacarme assourdissant.] - Vesper Sable (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère Cité Industrielle - \"Les Forgerons d'Acier\" comme le seul havre de paix rentable. - Brix Lame (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Cité Industrielle - \"Les Forgerons d'Acier\". - Sura Froid (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Cité Industrielle - \"Les Forgerons d'Acier\". >> La Citerne Centrale [Description du lieu : Un réservoir extérieur en métal corrodé, d'où coule une eau au goût métallique. De grandes pompes à vapeur s'activent pour la filtrer en permanence.] - Ronan Vif (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Cité Industrielle - \"Les Forgerons d'Acier\" est la clé de la survie humaine. - Ronan Sel (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Cité Industrielle - \"Les Forgerons d'Acier\". - Bren Clou (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Cité Industrielle - \"Les Forgerons d'Acier\". >> Le Générateur Principal [Description du lieu : Une centrale à charbon et au pétrole crachant d'épaisses fumées noires. Le sol vibre au rythme des pistons gigantesques.] - Ines Noyau (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Cité Industrielle - \"Les Forgerons d'Acier\" en vie à lui tout seul. - Sura Sel (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Cité Industrielle - \"Les Forgerons d'Acier\". - Meya Sel (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de Cité Industrielle - \"Les Forgerons d'Acier\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : Une barricade faite de véhicules empilés et de poutrelles soudées, hérissée de piques métalliques et de lance-flammes artisanaux.] - Corin Ferraille (Capitaine de la Garde) [MJ — Archétype brisé : loyauté retournée] - Commande officiellement la défense à Le Mur d'Enceinte & Les Portes d'une main de fer. - En réalité, il fait passer en douce des armes et des informations aux esclaves du Dépôt de Ferraille qui préparent leur révolte : sa propre sœur a été réduite en servitude sur ordre de la Maison Ferraille (voir \"LA MAISON FERRAILLE : UNE DYNASTIE DE FER\"), et sa \"poigne impitoyable\" en public n'est qu'une couverture pour rester en position de saboter le système de l'intérieur. - Le mouvement qu'il protège ne veut pas de simples concessions : il veut la fin du règne du Doyen et l'instauration d'une république (voir \"LA RÉVOLTE RÉPUBLICAINE\"). - Ne laisse toujours entrer personne sans pot-de-vin dans Cité Industrielle - \"Les Forgerons d'Acier\" — mais les PJ qui l'aident discrètement pourraient gagner un allié précieux le jour où la révolte éclatera pour de bon. - Finch Noir (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Cité Industrielle - \"Les Forgerons d'Acier\". - Jorn Froid (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de Cité Industrielle - \"Les Forgerons d'Acier\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Un enchevêtrement de tentes et de cabanes en tôle ondulée sous un nuage constant de smog toxique. La toux des habitants résonne jour et nuit.] - Elara Rouge (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Cité Industrielle - \"Les Forgerons d'Acier\". - Cade Rouage (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Cité Industrielle - \"Les Forgerons d'Acier\". - Doran Sang (Survivant Désespéré) - Dort à même les cendres refroidies des hauts-fourneaux éteints, par choix. - Voit dans la fumée des formes qu'il est seul à reconnaître. - Répète que Cité Industrielle - \"Les Forgerons d'Acier\" s'effondrera sous son propre poids de métal, écrasée par ses propres machines. - [MJ - PROPHÉTIE LITTÉRALE, SECRET DE CAMPAGNE : au Palier 4 de l'Horloge de tension, si la révolte l'emporte, les insurgés n'ont besoin d'aucune arme extérieure - ils détournent les bras robotisés, les convoyeurs et les coulées de métal en fusion de la Fonderie Colossale et de la Ligne d'Assemblage contre Les Managers eux-mêmes, jusqu'à pirater l'Intendant (l'IA industrielle propriété exclusive de la Maison Ferraille) pour le retourner contre ses propriétaires. La cité qui vantait sa maîtrise de l'acier s'effondre alors littéralement sous son propre poids de métal.] >> Fonderie Colossale [Description du lieu : Une mer de métal en fusion éclairant la nuit d'une lueur rougeoyante.] - Ryn Ferraille (Chef Industriel) - Maniant le métal en fusion à Fonderie Colossale. - Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\". - Jax Lame (Spécialiste Industriel) - Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées. - Considère Fonderie Colossale comme son propre royaume. - Talin Noyau (Ouvrier / Garde Industriel) - Gère les esclaves ou travailleurs forcés de Fonderie Colossale. - Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\". >> Ligne d'Assemblage de Véhicules [Description du lieu : Un labyrinthe de tapis roulants et de chaînes où des centaines de forgerons assemblent des blindés.] - Raze Vif (Chef Industriel) - Maniant le métal en fusion à Ligne d'Assemblage de Véhicules. - Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\". - Cade Vif (Spécialiste Industriel) - Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées. - Considère Ligne d'Assemblage de Véhicules comme son propre royaume. - Orok Vif (Ouvrier / Garde Industriel) - Gère les esclaves ou travailleurs forcés de Ligne d'Assemblage de Véhicules. - Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\". >> Atelier des Pièces Détachées [Description du lieu : Des hangars remplis d'étagères croulant sous le poids de pièces mécaniques recouvertes de cambouis.] - Corin Sang (Chef d'Inventaire) - Répertorie et redistribue les pièces détachées de Atelier des Pièces Détachées avec une rigueur maniaque. - Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\". - Raze Sel (Ingénieure de Récupération) - Recycle et adapte les pièces les plus abîmées pour prolonger la durée de vie des machines de Cité Industrielle - \"Les Forgerons d'Acier\". - Considère Atelier des Pièces Détachées comme son propre royaume. - Tala Noyau (Ouvrier / Garde d'Inventaire) - Surveille les stocks contre le vol à Atelier des Pièces Détachées. - Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\". >> Dépôt de Ferraille [Description du lieu : Une montagne de métal rouillé s'étendant à perte de vue.] - Talin Sel (Intendant du Dépôt, Maison Ferraille) - Administre le Dépôt de Ferraille au nom de la Maison Ferraille - officiellement un poste d'intendance, en réalité la gestion directe de la main-d'œuvre forcée de toute la cité. - Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\". - Doran Rouge (Contremaître) - Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées. - Considère Dépôt de Ferraille comme son propre royaume. - Ines Sable (Ouvrier / Garde Industriel) - Gère les esclaves ou travailleurs forcés de Dépôt de Ferraille. - Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\". ------------------------------------------------------------------------"
      }
    ],
    "buildings": {
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Une place boueuse entourée de carcasses de camions. On y négocie des pièces de moteurs, de la tôle et des outils couverts de cambouis dans un vacarme assourdissant.",
        "personnages": [
          {
            "nom": "Vesper Sable",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère Cité Industrielle - \"Les Forgerons d'Acier\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Brix Lame",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Sura Froid",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          }
        ],
        "points": [
          "Une place boueuse entourée de carcasses de camions. On y négocie des pièces de moteurs, de la tôle et des outils couverts de cambouis dans un vacarme assourdissant.",
          "Vesper Sable (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère Cité Industrielle - \"Les Forgerons d'Acier\" comme le seul havre de paix rentable.",
          "Brix Lame (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Sura Froid (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Cité Industrielle - \"Les Forgerons d'Acier\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Un réservoir extérieur en métal corrodé, d'où coule une eau au goût métallique. De grandes pompes à vapeur s'activent pour la filtrer en permanence.",
        "personnages": [
          {
            "nom": "Ronan Vif",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Cité Industrielle - \"Les Forgerons d'Acier\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Ronan Sel",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Bren Clou",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          }
        ],
        "points": [
          "Un réservoir extérieur en métal corrodé, d'où coule une eau au goût métallique. De grandes pompes à vapeur s'activent pour la filtrer en permanence.",
          "Ronan Vif (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Cité Industrielle - \"Les Forgerons d'Acier\" est la clé de la survie humaine.",
          "Ronan Sel (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Bren Clou (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Cité Industrielle - \"Les Forgerons d'Acier\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Une centrale à charbon et au pétrole crachant d'épaisses fumées noires. Le sol vibre au rythme des pistons gigantesques.",
        "personnages": [
          {
            "nom": "Ines Noyau",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Cité Industrielle - \"Les Forgerons d'Acier\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Sura Sel",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Meya Sel",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          }
        ],
        "points": [
          "Une centrale à charbon et au pétrole crachant d'épaisses fumées noires. Le sol vibre au rythme des pistons gigantesques.",
          "Ines Noyau (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Cité Industrielle - \"Les Forgerons d'Acier\" en vie à lui tout seul.",
          "Sura Sel (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Meya Sel (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de Cité Industrielle - \"Les Forgerons d'Acier\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "Une barricade faite de véhicules empilés et de poutrelles soudées, hérissée de piques métalliques et de lance-flammes artisanaux.",
        "personnages": [
          {
            "nom": "Corin Ferraille",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande officiellement la défense à Le Mur d'Enceinte & Les Portes d'une main de fer.",
              "En réalité, il fait passer en douce des armes et des informations aux esclaves du Dépôt de Ferraille qui préparent leur révolte : sa propre sœur a été réduite en servitude sur ordre de la Maison Ferraille (voir \"LA MAISON FERRAILLE : UNE DYNASTIE DE FER\"), et sa \"poigne impitoyable\" en public n'est qu'une couverture pour rester en position de saboter le système de l'intérieur.",
              "Le mouvement qu'il protège ne veut pas de simples concessions : il veut la fin du règne du Doyen et l'instauration d'une république (voir \"LA RÉVOLTE"
            ]
          }
        ],
        "points": [
          "Une barricade faite de véhicules empilés et de poutrelles soudées, hérissée de piques métalliques et de lance-flammes artisanaux.",
          "Corin Ferraille (Capitaine de la Garde)",
          "Commande officiellement la défense à Le Mur d'Enceinte & Les Portes d'une main de fer.",
          "En réalité, il fait passer en douce des armes et des informations aux esclaves du Dépôt de Ferraille qui préparent leur révolte : sa propre sœur a été réduite en servitude sur ordre de la Maison Ferraille (voir \"LA MAISON FERRAILLE : UNE DYNASTIE DE FER\"), et sa \"poigne impitoyable\" en public n'est qu'une couverture pour rester en position de saboter le système de l'intérieur.",
          "Le mouvement qu'il protège ne veut pas de simples concessions : il veut la fin du règne du Doyen et l'instauration d'une république (voir \"LA RÉVOLTE"
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Un enchevêtrement de tentes et de cabanes en tôle ondulée sous un nuage constant de smog toxique. La toux des habitants résonne jour et nuit.",
        "personnages": [
          {
            "nom": "Elara Rouge",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Cade Rouage",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Doran Sang",
            "role": "Survivant Désespéré",
            "traits": [
              "Dort à même les cendres refroidies des hauts-fourneaux éteints, par choix.",
              "Voit dans la fumée des formes qu'il est seul à reconnaître.",
              "Répète que Cité Industrielle - \"Les Forgerons d'Acier\" s'effondrera sous son propre poids de métal, écrasée par ses propres machines.",
              "[MJ - PROPHÉTIE LITTÉRALE, SECRET DE CAMPAGNE : au Palier 4 de l'Horloge de tension, si la révolte l'emporte, les insurgés n'ont besoin d'aucune arme extérieure - ils détournent les bras robotisés, les convoyeurs et les coulées de métal en fusion de la Fonderie Colossale et de la Ligne d'Assemblage contre Les Managers eux-mêmes, jusqu'à pirater l'Intendant (l'IA industrielle propriété exclusive de la Maison Ferraille) pour le retourner contre ses propriétaires. La cité qui vantait sa maîtrise de l'acier s'effondre alors littéralement sous son propre poids de métal.]"
            ]
          }
        ],
        "points": [
          "Un enchevêtrement de tentes et de cabanes en tôle ondulée sous un nuage constant de smog toxique. La toux des habitants résonne jour et nuit.",
          "Elara Rouge (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Cade Rouage (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Doran Sang (Survivant Désespéré)",
          "Dort à même les cendres refroidies des hauts-fourneaux éteints, par choix.",
          "Voit dans la fumée des formes qu'il est seul à reconnaître.",
          "Répète que Cité Industrielle - \"Les Forgerons d'Acier\" s'effondrera sous son propre poids de métal, écrasée par ses propres machines.",
          "[MJ - PROPHÉTIE LITTÉRALE, SECRET DE CAMPAGNE : au Palier 4 de l'Horloge de tension, si la révolte l'emporte, les insurgés n'ont besoin d'aucune arme extérieure - ils détournent les bras robotisés, les convoyeurs et les coulées de métal en fusion de la Fonderie Colossale et de la Ligne d'Assemblage contre Les Managers eux-mêmes, jusqu'à pirater l'Intendant (l'IA industrielle propriété exclusive de la Maison Ferraille) pour le retourner contre ses propriétaires. La cité qui vantait sa maîtrise de l'acier s'effondre alors littéralement sous son propre poids de métal.]"
        ]
      },
      "fonderie colossale": {
        "nom": "Fonderie Colossale",
        "description": "Une mer de métal en fusion éclairant la nuit d'une lueur rougeoyante.",
        "personnages": [
          {
            "nom": "Ryn Ferraille",
            "role": "Chef Industriel",
            "traits": [
              "Maniant le métal en fusion à Fonderie Colossale.",
              "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Jax Lame",
            "role": "Spécialiste Industriel",
            "traits": [
              "Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées.",
              "Considère Fonderie Colossale comme son propre royaume."
            ]
          },
          {
            "nom": "Talin Noyau",
            "role": "Ouvrier / Garde Industriel",
            "traits": [
              "Gère les esclaves ou travailleurs forcés de Fonderie Colossale.",
              "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          }
        ],
        "points": [
          "Une mer de métal en fusion éclairant la nuit d'une lueur rougeoyante.",
          "Ryn Ferraille (Chef Industriel)",
          "Maniant le métal en fusion à Fonderie Colossale.",
          "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Jax Lame (Spécialiste Industriel)",
          "Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées.",
          "Considère Fonderie Colossale comme son propre royaume.",
          "Talin Noyau (Ouvrier / Garde Industriel)",
          "Gère les esclaves ou travailleurs forcés de Fonderie Colossale.",
          "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
        ]
      },
      "ligne d'assemblage de véhicules": {
        "nom": "Ligne d'Assemblage de Véhicules",
        "description": "Un labyrinthe de tapis roulants et de chaînes où des centaines de forgerons assemblent des blindés.",
        "personnages": [
          {
            "nom": "Raze Vif",
            "role": "Chef Industriel",
            "traits": [
              "Maniant le métal en fusion à Ligne d'Assemblage de Véhicules.",
              "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Cade Vif",
            "role": "Spécialiste Industriel",
            "traits": [
              "Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées.",
              "Considère Ligne d'Assemblage de Véhicules comme son propre royaume."
            ]
          },
          {
            "nom": "Orok Vif",
            "role": "Ouvrier / Garde Industriel",
            "traits": [
              "Gère les esclaves ou travailleurs forcés de Ligne d'Assemblage de Véhicules.",
              "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          }
        ],
        "points": [
          "Un labyrinthe de tapis roulants et de chaînes où des centaines de forgerons assemblent des blindés.",
          "Raze Vif (Chef Industriel)",
          "Maniant le métal en fusion à Ligne d'Assemblage de Véhicules.",
          "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Cade Vif (Spécialiste Industriel)",
          "Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées.",
          "Considère Ligne d'Assemblage de Véhicules comme son propre royaume.",
          "Orok Vif (Ouvrier / Garde Industriel)",
          "Gère les esclaves ou travailleurs forcés de Ligne d'Assemblage de Véhicules.",
          "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
        ]
      },
      "atelier des pièces détachées": {
        "nom": "Atelier des Pièces Détachées",
        "description": "Des hangars remplis d'étagères croulant sous le poids de pièces mécaniques recouvertes de cambouis.",
        "personnages": [
          {
            "nom": "Corin Sang",
            "role": "Chef d'Inventaire",
            "traits": [
              "Répertorie et redistribue les pièces détachées de Atelier des Pièces Détachées avec une rigueur maniaque.",
              "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Raze Sel",
            "role": "Ingénieure de Récupération",
            "traits": [
              "Recycle et adapte les pièces les plus abîmées pour prolonger la durée de vie des machines de Cité Industrielle - \"Les Forgerons d'Acier\".",
              "Considère Atelier des Pièces Détachées comme son propre royaume."
            ]
          },
          {
            "nom": "Tala Noyau",
            "role": "Ouvrier / Garde d'Inventaire",
            "traits": [
              "Surveille les stocks contre le vol à Atelier des Pièces Détachées.",
              "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          }
        ],
        "points": [
          "Des hangars remplis d'étagères croulant sous le poids de pièces mécaniques recouvertes de cambouis.",
          "Corin Sang (Chef d'Inventaire)",
          "Répertorie et redistribue les pièces détachées de Atelier des Pièces Détachées avec une rigueur maniaque.",
          "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Raze Sel (Ingénieure de Récupération)",
          "Recycle et adapte les pièces les plus abîmées pour prolonger la durée de vie des machines de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Considère Atelier des Pièces Détachées comme son propre royaume.",
          "Tala Noyau (Ouvrier / Garde d'Inventaire)",
          "Surveille les stocks contre le vol à Atelier des Pièces Détachées.",
          "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
        ]
      },
      "dépôt de ferraille": {
        "nom": "Dépôt de Ferraille",
        "description": "Une montagne de métal rouillé s'étendant à perte de vue.",
        "personnages": [
          {
            "nom": "Talin Sel",
            "role": "Intendant du Dépôt, Maison Ferraille",
            "traits": [
              "Administre le Dépôt de Ferraille au nom de la Maison Ferraille - officiellement un poste d'intendance, en réalité la gestion directe de la main-d'œuvre forcée de toute la cité.",
              "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          },
          {
            "nom": "Doran Rouge",
            "role": "Contremaître",
            "traits": [
              "Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées.",
              "Considère Dépôt de Ferraille comme son propre royaume."
            ]
          },
          {
            "nom": "Ines Sable",
            "role": "Ouvrier / Garde Industriel",
            "traits": [
              "Gère les esclaves ou travailleurs forcés de Dépôt de Ferraille.",
              "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
            ]
          }
        ],
        "points": [
          "Une montagne de métal rouillé s'étendant à perte de vue.",
          "Talin Sel (Intendant du Dépôt, Maison Ferraille)",
          "Administre le Dépôt de Ferraille au nom de la Maison Ferraille - officiellement un poste d'intendance, en réalité la gestion directe de la main-d'œuvre forcée de toute la cité.",
          "Totalement loyal envers les idéaux de Cité Industrielle - \"Les Forgerons d'Acier\".",
          "Doran Rouge (Contremaître)",
          "Fournit l'effort de guerre de Cité Industrielle - \"Les Forgerons d'Acier\" en pièces détachées.",
          "Considère Dépôt de Ferraille comme son propre royaume.",
          "Ines Sable (Ouvrier / Garde Industriel)",
          "Gère les esclaves ou travailleurs forcés de Dépôt de Ferraille.",
          "Connaît les secrets les plus sombres de Cité Industrielle - \"Les Forgerons d'Acier\"."
        ]
      }
    }
  },
  "cité des métaux & recyclage": {
    "num": "9",
    "name": "CITÉ DES MÉTAUX & RECYCLAGE - \"LES FOSSOYEURS\"",
    "specialty": "récupération dans les ruines, recyclage, réparation et bricolage de génie",
    "strength": "fournit tous les métaux et alliages rares du bassin - et abrite les meilleurs réparateurs et bricoleurs du monde connu, capables de faire refonctionner ce qu'aucune autre cité ne saurait même diagnostiquer. Là où Cité Industrielle produit en masse du neuf, Cité des Métaux & Recyclage sait ressusciter l'ancien - une expertise que personne ne lui dispute.",
    "weakness": "habitants exposés à radiations et maladies",
    "particularity": "cité bâtie sur l'ancienne île de Malte, hérissée de gratte-ciels effondrés et cernée à perte de vue par les carcasses de milliers de navires échoués quand la mer s'est asséchée",
    "geo": "Au centre exact du bassin méditerranéen desséché, sur l'ancienne île de Malte - le point de passage obligé de quiconque traverse le désert de sel d'une rive à l'autre.",
    "gps": "35.8997° N, 14.5146° E (Malte)",
    "foundation": "2121 (née de rien : la Mine Profonde sert d'abord d'abri de fortune aux caravanes traversant le désert de sel ; un convoi venu de Cité de l'Eau & Alimentation commence à y vendre eau et nourriture à l'étape ; des réparateurs s'installent à leur tour pour profiter du marché naissant, et tout se structure peu à peu, sans jamais qu'un fondateur unique ne s'impose - une origine purement organique, à l'image de sa démocratie).",
    "params": "Santé 30, Technologie 65, Richesse 90, Carburant 50, Nourriture 45, Bonheur 50, Armement 55",
    "stats": {
      "santé": 30,
      "technologie": 65,
      "richesse": 90,
      "carburant": 50,
      "nourriture": 45,
      "bonheur": 50,
      "armement": 55
    },
    "tension": "Des nuées de rats-charognards mutants, attirés par les décharges toxiques, ont commencé à s'organiser en meutes coordonnées qui attaquent désormais les équipes de récupération en plein jour, menaçant de couper l'approvisionnement en métaux de toute la cité.",
    "clock": {
      "clockId": "metaux_infiltration_democratie",
      "paliersTotal": 4,
      "palierActuel": 1,
      "paliers": [
        {
          "palier": 1,
          "nom": "Attaques isolées",
          "texte": "les meutes de rats-charognards frappent les équipes de récupération les plus exposées ; on blâme la faune mutante, personne n'y voit encore un système."
        },
        {
          "palier": 2,
          "nom": "Racket généralisé",
          "texte": "la \"taxe de protection\" d'Ashka Soupape s'étend à d'autres concessions minières ; une élection d'arrondissement approche, et Vorn intensifie son soutien discret à plusieurs candidats."
        },
        {
          "palier": 3,
          "nom": "L'enquête commence",
          "texte": "des coïncidences électorales trop nombreuses pour être innocentes attirent l'attention de Tala Plomb et, potentiellement, des PJ - le fil qui mène à Vorn devient suivable pour qui cherche vraiment."
        },
        {
          "palier": 4,
          "nom": "Mise au jour",
          "texte": "la vérité sur l'infiltration électorale de Bunker Oméga éclate - crise de confiance majeure envers la démocratie elle-même, dont Vorn ni Bunker Oméga n'avaient anticipé l'ampleur."
        }
      ],
      "triggers": {
        "cycle_sans_intervention_pj": 1,
        "pj_demasquent_ashka_soupape": 1,
        "pj_identifient_vorn_comme_agent_du_reseau": 1,
        "election_truquee_avec_succes": 1,
        "pj_alertent_cyrus_rouage": -1
      },
      "effetsPalierFinal": {}
    },
    "lore": [
      {
        "title": "UN CARREFOUR POUR TOUS : LE COMMERCE AVEC LES INDIVIDUS",
        "text": "Là où Cité Industrielle traite avec les grandes organisations - les autres cités-états, les Conseils, les contrats à grande échelle - Cité des Métaux & Recyclage traite avec les individus : nomades, petits convois indépendants, familles isolées, éclaireurs solitaires. Ses prix sont bas, elle n'exige aucun minimum de commande, et surtout elle accepte absolument tout, peu importe l'état : un moteur fondu, une arme enrayée, un membre mécanique hors d'usage, une relique d'avant-guerre méconnaissable. On y vient de tout le bassin, pas pour la qualité du neuf, mais pour la certitude qu'on y trouvera toujours quelqu'un capable de faire quelque chose avec ce qu'on lui apporte. Sa position au centre exact du bassin en fait, de fait, une étape quasi obligatoire pour tout convoi qui traverse le désert de sel d'une rive à l'autre : on s'y arrête pour réparer un véhicule, vendre ce qu'on a trouvé en chemin, ou simplement souffler avant de repartir. Cette affluence constante de petits groupes hétéroclites explique à la fois sa richesse remarquable (90) et son absence quasi totale de pouvoir centralisé fort - contrairement à la dynastie rigide de Cité Industrielle, personne ici ne peut se permettre de fermer la porte à un client de passage, aussi modeste soit-il. Horloge de tension (lecture humaine) : Palier 1 - Attaques isolées : les meutes de rats-charognards frappent les équipes de récupération les plus exposées ; on blâme la faune mutante, personne n'y voit encore un système. Palier 2 - Racket généralisé : la \"taxe de protection\" d'Ashka Soupape s'étend à d'autres concessions minières ; une élection d'arrondissement approche, et Vorn intensifie son soutien discret à plusieurs candidats. Palier 3 - L'enquête commence : des coïncidences électorales trop nombreuses pour être innocentes attirent l'attention de Tala Plomb et, potentiellement, des PJ - le fil qui mène à Vorn devient suivable pour qui cherche vraiment. Palier 4 - Mise au jour : la vérité sur l'infiltration électorale de Bunker Oméga éclate - crise de confiance majeure envers la démocratie elle-même, dont Vorn ni Bunker Oméga n'avaient anticipé l'ampleur. [MJ — HORLOGE CHIFFRÉE (usage application de gestion, ne pas interpréter narrativement) : CLOCK_ID: metaux_infiltration_democratie PALIERS_TOTAL: 4 PALIER_ACTUEL: 1 INCREMENT_TRIGGERS: [cycle_sans_intervention_pj: +1, pj_demasquent_ashka_soupape: +1, pj_identifient_vorn_comme_agent_du_reseau: +1, election_truquee_avec_succes: +1, pj_alertent_cyrus_rouage: -1] PALIER_4_EFFET: crise_confiance_democratie=true, panique_electorale_bassin_maltais=true, vorn_active_protocole_de_purge=possible]"
      },
      {
        "title": "LA DÉMOCRATIE DES ARRONDISSEMENTS",
        "text": "Contrairement à la dynastie rigide de Cité Industrielle, Cité des Métaux & Recyclage est une véritable démocratie : chaque grand site élit son propre chef d'arrondissement pour un mandat de deux cycles, et l'ensemble des arrondissements élit à son tour un Maire à la tête de la cité. Cinq arrondissements numérotés composent la cité : 1er - Le Marché d'Échanges (cœur civique et commercial) 2e - L'Usine de Recyclage (biens communaux, ateliers partagés) 3e - La Mine Profonde (extraction, en partie louée à Cité Industrielle) 4e - Le Cimetière des Gratte-Ciels (récupération en hauteur) 5e - Le Marché aux Alliages Rares (négoce de precision) Le Maire actuel, Cyrus Rouage, a été élu sur un programme de justice sociale après des années à organiser des soupes populaires dans Le Quartier Résidentiel / Les Taudis (voir sa fiche) - une ascension populaire rare dans un bassin où le pouvoir se transmet presque partout par la force ou par le sang plutôt que par le vote. [MJ - POURQUOI CETTE DÉMOCRATIE FONCTIONNE ICI ET NULLE PART AILLEURS : la clientèle massive d'individus et de petits groupes de passage (voir plus haut) rend impossible la concentration du pouvoir entre les mains d'une seule famille ou d'un seul cartel - trop d'intérêts divergents, trop de monde de passage à satisfaire. La démocratie n'est pas ici un idéal politique : c'est la seule structure de gouvernance qui ne s'effondre pas sous son propre poids dans une économie aussi fragmentée.] -----------------------------------------------------------------------VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE -----------------------------------------------------------------------[MJ - SECRET DE CAMPAGNE, À DÉCOUVRIR] Ce qui rend cette démocratie précieuse aux yeux des habitants - son ouverture, l'absence de dynastie verrouillée, la possibilité pour n'importe qui de se présenter - en fait aussi la cible la plus facile que Bunker Oméga ait jamais trouvée dans tout le bassin. Là où infiltrer un conseil fermé ou une dynastie héréditaire demande des décennies de patience, ici il suffit de se présenter aux élections, ou de devenir l'indispensable conseiller de campagne de qui s'y présente. Vorn (voir \"LE RÉSEAU : LE SECRET DE BUNKER OMÉGA\" pour la rareté de ce prénom, réservé aux agents pleinement synchronisés) s'est imposé en quelques années comme LE conseiller en stratégie électorale du bassin maltais, opérant à visage découvert depuis un bureau discret de la Mairie du 2e Arrondissement (Usine de Recyclage) - la meilleure des couvertures, au cœur même de l'institution la plus communautaire et la plus fière de la cité. Il a fait élire ou réélire la moitié des chefs d'arrondissement actuels, y compris Ashka Soupape (voir Mine Profonde), à qui il a fourni, en échange de faveurs politiques futures, la technologie de contrôle par phéromones qui lui sert à diriger secrètement les meutes de rats-charognards. Ashka Soupape ignore tout de la véritable nature de son bienfaiteur ; elle le prend pour un simple fixeur bien connecté, pas pour un agent d'une puissance qu'elle ne soupçonne même pas. [MJ - OBJECTIF DE VORN : préparer, élection après élection, un basculement du Conseil des arrondissements suffisamment favorable pour que Bunker Oméga n'ait plus jamais besoin d'infiltrer la ville en secret - elle serait dirigée en pleine lumière par des gens qui, sans le savoir, serviraient ses intérêts. Un test grandeur nature qu'aucune autre cité du bassin ne permettrait. Si les PJ l'identifient comme agent du Réseau, rappelez-vous du \"PROTOCOLE DE PURGE\" (voir Bunker Oméga) : Vorn dérive suffisamment peu, pour l'instant, pour ne risquer que d'être discrètement réorienté vers La Salle du Trône (Cité de l'Eau & Alimentation) plutôt qu'éliminé.] Lieux et Personnages Notables : >> Le Marché d'Échanges [Description du lieu : Un étalage chaotique de reliques déterrées : circuits imprimés, moteurs à combustion, bijoux en or fondu. C'est le paradis des bricoleurs.] - Joran Plomb (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère Cité des Métaux & Recyclage - \"Les Fossoyeurs\" comme le seul havre de paix rentable. - Orok Froid (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Silas Poussière (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". >> La Citerne Centrale [Description du lieu : Un cratère aménagé récoltant l'eau de pluie et la rosée nocturne via d'immenses toiles de récupération tendues dans le ciel.] - Finch Sombre (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Cité des Métaux & Recyclage - \"Les Fossoyeurs\" est la clé de la survie humaine. - Ines Poussière (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Vesper Soupape (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". >> Le Générateur Principal [Description du lieu : Une pile de générateurs disparates interconnectés par des câbles bricolés, menaçant d'exploser à tout instant mais produisant énormément d'énergie.] - Tala Cendre (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Cité des Métaux & Recyclage - \"Les Fossoyeurs\" en vie à lui tout seul. - Silas Moteur (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Doran Sombre (Adepte du Dieu-Moteur) - Vénère la machine à Le Générateur Principal. - Prêche que les pannes sont des punitions divines. - Influence secrètement les dirigeants de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". >> Le Mur d'Enceinte & Les Portes [Description du lieu : Un amoncellement de carcasses de navires de charge empilées pour former un mur de rouille impénétrable.] - Bren Plomb (Capitaine de la Garde) - Commande la défense à Le Mur d'Enceinte & Les Portes. - Vétéran impitoyable de la dernière guerre. - Ne laisse entrer personne dans Cité des Métaux & Recyclage - \"Les Fossoyeurs\" sans pot-de-vin. - Mira Vif (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Corin Noyau (Contrebandier) - Fait passer des biens par Le Mur d'Enceinte & Les Portes. - Connaît les failles de la sécurité. - Fait affaire avec les ennemis de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Des maisons construites à l'intérieur de vieux conteneurs maritimes empilés les uns sur les autres, formant des ruelles verticales vertigineuses.] - Cyrus Rouage (Maire de Cité des Métaux & Recyclage, élu) - A gravi les échelons en organisant des soupes populaires dans Le Quartier Résidentiel / Les Taudis pendant des années, avant d'être élu Maire sur un programme de justice sociale - une ascension rare dans un bassin où le pouvoir se transmet presque partout par la force ou par le sang. - Continue de tenir ses permanences directement dans les Taudis plutôt que dans un palais, ce qui agace autant que ça fascine les autres chefs d'arrondissement. - S'oppose ouvertement à toute concentration excessive de pouvoir - y compris la sienne, qu'il refuse de renouveler au-delà de deux mandats. - Zane Plomb (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Tala Plomb (Survivant Désespéré) - Trie sans relâche des éclats de bronze antique et de ferraille moderne, sans jamais s'arrêter. - Affirme entendre les cités antiques respirer sous les décombres modernes. - Prédit que Cité des Métaux & Recyclage - \"Les Fossoyeurs\" sera un jour ensevelie sous ce qu'elle a elle-même déterré. - [MJ - PROPHÉTIE MÉTAPHORIQUE, SECRET DE CAMPAGNE : pas d'effondrement physique. Tala finit par se mettre en tête d'enquêter sur d'étranges coïncidences électorales - \"déterrer cette affaire\", comme elle dit - et découvre peu à peu que Bunker Oméga prend le contrôle progressif de la cité par les urnes (voir \"VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE\"). La cité sera bel et bien ensevelie - sous la vérité qu'elle aura mise au jour, et la crise de confiance qui s'ensuivra.] >> Mine Profonde [3e Arrondissement] [Description du lieu : D'anciennes carrières où l'on arrache des poutres d'acier aux fondations des anciennes gratte-ciel. Une partie du site est louée à Cité Industrielle, qui n'a nulle part ailleurs les gisements dont ses forges ont besoin - la commune n'a ni les infrastructures ni les moyens de l'exploiter seule.] - Ashka Soupape (Chef d'Arrondissement élue, Mine Profonde) [MJ — Archétype brisé : racket organisé] - Administre l'arrondissement au nom de la commune - perçoit le loyer versé par Cité Industrielle, entretient les infrastructures communes, avec un dévouement apparemment exemplaire envers Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - En réalité, elle nourrit et guide secrètement les meutes de rats-charognards mutants vers les concessions minières de ses rivaux, réservant les zones sûres aux équipes qui lui versent une \"taxe de protection\" occulte. - Prétend, comme tout le monde, chercher une solution au problème des rats — alors qu'elle en est la cause directe et la seule à en tirer profit. - La technologie de contrôle par phéromones qui lui permet de diriger les meutes lui a été offerte par Vorn, un \"conseiller en stratégie électorale\" qui l'a aidée à se faire élire - voir \"VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE\". Elle ignore tout de sa véritable nature et le prend pour un simple fixeur bien connecté. - Cade Noyau (Contremaître, employé de Cité Industrielle) - Supervise, pour le compte de la Maison Ferraille, l'extraction sur la concession louée de Mine Profonde. - Considère Mine Profonde comme son propre royaume - un royaume qu'il ne possède pourtant pas. - Talin Sang (Surveillant, employé de Cité Industrielle) - Gère les travailleurs forcés de la Maison Ferraille détachés sur la concession de Mine Profonde - les mêmes esclaves que ceux du Dépôt de Ferraille (voir Cité Industrielle), simplement délocalisés ici le temps d'un contrat d'extraction. - [MJ - L'ÉTINCELLE DE LA RÉVOLTE : c'est ici, en travaillant chaque jour aux côtés de citoyens libres d'une véritable démocratie - votant, se présentant aux élections, interpellant leur Maire en pleine rue - que les esclaves de la Maison Ferraille ont pris pleinement conscience du contraste avec leur propre condition. Le sentiment de révolte qui couve à Cité Industrielle (voir \"LA RÉVOLTE RÉPUBLICAINE\") a germé ici, à la Mine Profonde, avant de voyager avec eux au retour de chaque contrat.] >> Usine de Recyclage [2e Arrondissement - siège de la Mairie] [Description du lieu : Moins une usine qu'un immense marché couvert, où de multiples stands se sont installés entre les presses hydrauliques encore actives. Certaines lignes d'assemblage et îlots robotisés d'avant-guerre fonctionnent toujours, propriété commune de la cité, partagés librement entre tous les habitants qui savent s'en servir.] - Brix Ferraille (Chef d'Arrondissement élu, Usine de Recyclage) - Administre le 2e Arrondissement et l'accès aux îlots robotisés communs, arbitrant les tours d'utilisation entre habitants avec une équité dont il est fier. - Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Vesper Sang (Régisseuse du Marché) - Tient à jour la liste des stands et des artisans installés dans Usine de Recyclage. - Considère Usine de Recyclage comme son propre royaume - un royaume qu'elle partage volontiers, tant qu'on respecte les règles. - Ronan Sang (Technicien des Îlots Communs) - Entretient les lignes d'assemblage et îlots robotisés d'avant-guerre pour que chacun puisse s'en servir. - Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". >> Cimetière des Gratte-Ciels [Description du lieu : Une forêt de tours effondrées, domaine réservé aux pilleurs de ferraille agiles.] - Doran Plomb (Chef Pilleur) - Guide les équipes de récupération à travers les tours instables du Cimetière des Gratte-Ciels. - Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Mira Plomb (Grimpeuse Éclaireuse) - Repère les poutres encore récupérables avant l'effondrement complet d'une tour. - Considère Cimetière des Gratte-Ciels comme son propre royaume. - Sura Soupape (Ouvrier / Garde Pilleur) - Surveille les équipes contre les rats-charognards et les pilleurs rivaux. - Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". >> Marché aux Alliages Rares [Description du lieu : Une zone hautement sécurisée où s'échangent titane, tungstène et composants d'aviation.] - Raze Soupape (Expert en Alliages) - Authentifie et évalue chaque pièce rare échangée sur Marché aux Alliages Rares. - Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". - Orok Sombre (Négociant en Composants) - Fait le lien entre Marché aux Alliages Rares et les acheteurs des autres cités. - Considère Marché aux Alliages Rares comme son propre royaume. - Cade Vif (Ouvrier / Garde du Marché aux Alliages) - Protège les stocks les plus précieux de Marché aux Alliages Rares. - Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\". >> L'Atelier des Rafistoleurs [Description du lieu : Un enchevêtrement d'établis à ciel ouvert où rien de ce qui y entre en pièces n'en ressort vraiment mort. Des clients arrivent parfois de très loin, un objet irréparable sous le bras, dans l'espoir d'un miracle.] - Nesta Rouage (Maîtresse Rafistoleuse) - La meilleure réparatrice du monde connu, reconnue même par-delà les frontières de la cité : on dit qu'elle a un jour refait fonctionner un moteur qu'un ingénieur de Cité Industrielle avait déclaré irrécupérable. - Forme les apprentis à une règle simple : tout ce qui a fonctionné une fois peut refonctionner - il suffit de comprendre pourquoi ça s'est arrêté. - Accepte de réparer à peu près n'importe quoi, contre à peu près n'importe quoi - une devise qui a fait sa réputation dans tout le bassin. - Ilio Fusible (Apprenti Prodige) - Le plus doué des apprentis de Nesta Rouage, déjà capable de rivaliser avec des maîtres d'autres cités. - Rêve secrètement de dépasser sa maîtresse, sans jamais oser le lui dire. -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS -----------------------------------------------------------------------[MJ - MÉTHODE : chaque relation ci-dessous découle de la même grille de questions, applicable à n'importe quelle paire de cités du bassin : qu'est-ce que chacune exporte/importe vers l'autre, le rapport de force est-il symétrique ou l'une a-t-elle un levier (monopole, dette, position), une route ou une proximité intensifie-t-elle le lien, un intérêt commun rapproche-t-il ou une divergence oppose-t-elle, le statut particulier de Métaux & Recyclage (démocratie neutre, carrefour, clientèle individuelle) change-t-il la donne, et un point de friction hérité s'applique-t-il.] CE QU'ELLE EXPORTE : sa capacité de réparation, sans équivalent dans le bassin - elle assure la maintenance des convois, des armes et de tout matériel qu'on lui apporte directement, mais missionne aussi des équipes nomades de réparateurs itinérants pour entretenir les infrastructures fixes des autres cités, trop lourdes pour être transportées jusqu'ici. CE QU'ELLE IMPORTE : eau, nourriture, armes - mais nettement moins de carburant que la plupart des cités, puisqu'elle est elle-même l'étape où les autres s'arrêtent plutôt que l'inverse : un convoi d'eau en route vers une autre cité fait presque toujours un crochet ici pour livrer une part de sa cargaison, se reposer et se faire réparer avant de repartir. LE VRAI LEVIER : les autres cités ont peu à peu abandonné leur propre capacité de maintenance, incapables de rivaliser avec une expertise aussi compétitive - un monopole doux, jamais brandi comme une arme, mais que tout le bassin ressent. Toutes les cités la considèrent comme non-belligérante et amicale ; ses habitants ont, dans tout le bassin, la réputation d'être travailleurs et dignes de confiance. Le motif qui se dégage, ville après ville, est donc double : riche en agrégat grâce au volume de petits échanges et à ce monopole de la réparation, mais sans aucun levier de prix face aux monopoles institutionnels de l'Eau et de l'Armement sur les matières premières et vivrières. - Cité de l'Eau & Alimentation : relation fondatrice et amicale - c'est un convoi des Gardiens qui a vendu la toute première eau et la toute première nourriture à cette étape, avant même qu'une cité n'y existe (voir \"Date de fondation\"). Cette habitude, vieille de plus d'un siècle, n'a jamais cessé : les convois d'eau destinés à d'autres cités s'arrêtent encore systématiquement ici pour livrer, se reposer et se faire réparer. - Cité Industrielle : relation la plus dense de toutes, et la plus ambivalente - la Mine Profonde est louée à la Maison Ferraille, qui y détache ses propres travailleurs forcés (voir \"Mine Profonde\"), et dont l'industrie dépend totalement de ce minerai. Le Doyen aimerait pourtant vendre bien plus de biens neufs dans tout le bassin, et voit d'un mauvais œil des réparateurs si doués qu'ils réduisent sans cesse la demande pour son acier flambant neuf - une hostilité discrète, jamais ouverte, tant la dépendance à la mine reste plus forte que le ressentiment. C'est aussi, sans que le Doyen le sache, le lieu où a germé l'idéal républicain de ses propres esclaves (voir Cité Industrielle, \"LA RÉVOLTE RÉPUBLICAINE\"). - Cité de l'Armement & Défense : fournisseur de matières premières le plus indispensable de l'Armement (voir sa fiche), qui impose ses prix sans discussion sur le minerai - mais nourrit la même hostilité discrète que la Maison Ferraille : les Arsenaux préféreraient vendre des armes neuves plutôt que voir leurs clients faire réparer les anciennes ici, à moindre coût. - Cité du Carburant : l'alliance la plus précieuse de toutes, sans l'ombre d'une friction - Cité des Métaux & Recyclage sert de principal relais de distribution du carburant pour tout le bassin : chaque convoi qui traverse le désert de sel s'arrête ici pour se ravitailler, se reposer et se faire réparer avant de repartir. Une dépendance mutuelle si ancienne que le Clergé du Sang Noir (voir Cité du Carburant) la considère lui-même comme une bénédiction plutôt qu'une simple logistique. - Cité Médicale : échanges mineurs et réguliers - petits groupes de passage en quête de soins ou de pièces de prothèses recyclées, rien qui ne pèse à l'échelle des deux cités. - Cité du Divertissement : acheteuse occasionnelle de curiosités et de reliques trouvées dans les ruines, pour ses vitrines et ses spectacles - une clientèle individuelle parmi d'autres, mais qui paie bien pour l'inhabituel. - Nuke City : contacts prudents et rares, limités aux matériaux blindés contre les radiations - la méfiance mutuelle envers la contamination limite tout le reste. - Bunker Oméga : aucune relation reconnue - seulement Vorn (voir \"VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE\"), dont la présence n'est même pas soupçonnée. - L'Île des Anciens : aucun contact connu - trop loin de ce carrefour pourtant central, à l'autre bout du bassin. ------------------------------------------------------------------------"
      }
    ],
    "buildings": {
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Un étalage chaotique de reliques déterrées : circuits imprimés, moteurs à combustion, bijoux en or fondu. C'est le paradis des bricoleurs.",
        "personnages": [
          {
            "nom": "Joran Plomb",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère Cité des Métaux & Recyclage - \"Les Fossoyeurs\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Orok Froid",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Silas Poussière",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          }
        ],
        "points": [
          "Un étalage chaotique de reliques déterrées : circuits imprimés, moteurs à combustion, bijoux en or fondu. C'est le paradis des bricoleurs.",
          "Joran Plomb (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère Cité des Métaux & Recyclage - \"Les Fossoyeurs\" comme le seul havre de paix rentable.",
          "Orok Froid (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Silas Poussière (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Un cratère aménagé récoltant l'eau de pluie et la rosée nocturne via d'immenses toiles de récupération tendues dans le ciel.",
        "personnages": [
          {
            "nom": "Finch Sombre",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Cité des Métaux & Recyclage - \"Les Fossoyeurs\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Ines Poussière",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Vesper Soupape",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          }
        ],
        "points": [
          "Un cratère aménagé récoltant l'eau de pluie et la rosée nocturne via d'immenses toiles de récupération tendues dans le ciel.",
          "Finch Sombre (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Cité des Métaux & Recyclage - \"Les Fossoyeurs\" est la clé de la survie humaine.",
          "Ines Poussière (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Vesper Soupape (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Une pile de générateurs disparates interconnectés par des câbles bricolés, menaçant d'exploser à tout instant mais produisant énormément d'énergie.",
        "personnages": [
          {
            "nom": "Tala Cendre",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Cité des Métaux & Recyclage - \"Les Fossoyeurs\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Silas Moteur",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Doran Sombre",
            "role": "Adepte du Dieu-Moteur",
            "traits": [
              "Vénère la machine à Le Générateur Principal.",
              "Prêche que les pannes sont des punitions divines.",
              "Influence secrètement les dirigeants de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          }
        ],
        "points": [
          "Une pile de générateurs disparates interconnectés par des câbles bricolés, menaçant d'exploser à tout instant mais produisant énormément d'énergie.",
          "Tala Cendre (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Cité des Métaux & Recyclage - \"Les Fossoyeurs\" en vie à lui tout seul.",
          "Silas Moteur (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Doran Sombre (Adepte du Dieu-Moteur)",
          "Vénère la machine à Le Générateur Principal.",
          "Prêche que les pannes sont des punitions divines.",
          "Influence secrètement les dirigeants de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "Un amoncellement de carcasses de navires de charge empilées pour former un mur de rouille impénétrable.",
        "personnages": [
          {
            "nom": "Bren Plomb",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande la défense à Le Mur d'Enceinte & Les Portes.",
              "Vétéran impitoyable de la dernière guerre.",
              "Ne laisse entrer personne dans Cité des Métaux & Recyclage - \"Les Fossoyeurs\" sans pot-de-vin."
            ]
          },
          {
            "nom": "Mira Vif",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Corin Noyau",
            "role": "Contrebandier",
            "traits": [
              "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
              "Connaît les failles de la sécurité.",
              "Fait affaire avec les ennemis de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          }
        ],
        "points": [
          "Un amoncellement de carcasses de navires de charge empilées pour former un mur de rouille impénétrable.",
          "Bren Plomb (Capitaine de la Garde)",
          "Commande la défense à Le Mur d'Enceinte & Les Portes.",
          "Vétéran impitoyable de la dernière guerre.",
          "Ne laisse entrer personne dans Cité des Métaux & Recyclage - \"Les Fossoyeurs\" sans pot-de-vin.",
          "Mira Vif (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Corin Noyau (Contrebandier)",
          "Fait passer des biens par Le Mur d'Enceinte & Les Portes.",
          "Connaît les failles de la sécurité.",
          "Fait affaire avec les ennemis de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Des maisons construites à l'intérieur de vieux conteneurs maritimes empilés les uns sur les autres, formant des ruelles verticales vertigineuses.",
        "personnages": [
          {
            "nom": "Cyrus Rouage",
            "role": "Maire de Cité des Métaux & Recyclage, élu",
            "traits": [
              "A gravi les échelons en organisant des soupes populaires dans Le Quartier Résidentiel / Les Taudis pendant des années, avant d'être élu Maire sur un programme de justice sociale - une ascension rare dans un bassin où le pouvoir se transmet presque partout par la force ou par le sang.",
              "Continue de tenir ses permanences directement dans les Taudis plutôt que dans un palais, ce qui agace autant que ça fascine les autres chefs d'arrondissement.",
              "S'oppose ouvertement à toute concentration excessive de pouvoir - y compris la sienne, qu'il refuse de renouveler au-delà de deux mandats."
            ]
          },
          {
            "nom": "Zane Plomb",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Tala Plomb",
            "role": "Survivant Désespéré",
            "traits": [
              "Trie sans relâche des éclats de bronze antique et de ferraille moderne, sans jamais s'arrêter.",
              "Affirme entendre les cités antiques respirer sous les décombres modernes.",
              "Prédit que Cité des Métaux & Recyclage - \"Les Fossoyeurs\" sera un jour ensevelie sous ce qu'elle a elle-même déterré.",
              "[MJ - PROPHÉTIE MÉTAPHORIQUE, SECRET DE CAMPAGNE : pas d'effondrement physique. Tala finit par se mettre en tête d'enquêter sur d'étranges coïncidences électorales - \"déterrer cette affaire\", comme elle dit - et découvre peu à peu que Bunker Oméga prend le contrôle progressif de la cité par les urnes (voir \"VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE\"). La cité sera bel et bien ensevelie - sous la vérité qu'elle aura mise au jour, et la crise de confiance qui s'ensuivra.]"
            ]
          }
        ],
        "points": [
          "Des maisons construites à l'intérieur de vieux conteneurs maritimes empilés les uns sur les autres, formant des ruelles verticales vertigineuses.",
          "Cyrus Rouage (Maire de Cité des Métaux & Recyclage, élu)",
          "A gravi les échelons en organisant des soupes populaires dans Le Quartier Résidentiel / Les Taudis pendant des années, avant d'être élu Maire sur un programme de justice sociale - une ascension rare dans un bassin où le pouvoir se transmet presque partout par la force ou par le sang.",
          "Continue de tenir ses permanences directement dans les Taudis plutôt que dans un palais, ce qui agace autant que ça fascine les autres chefs d'arrondissement.",
          "S'oppose ouvertement à toute concentration excessive de pouvoir - y compris la sienne, qu'il refuse de renouveler au-delà de deux mandats.",
          "Zane Plomb (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Tala Plomb (Survivant Désespéré)",
          "Trie sans relâche des éclats de bronze antique et de ferraille moderne, sans jamais s'arrêter.",
          "Affirme entendre les cités antiques respirer sous les décombres modernes.",
          "Prédit que Cité des Métaux & Recyclage - \"Les Fossoyeurs\" sera un jour ensevelie sous ce qu'elle a elle-même déterré.",
          "[MJ - PROPHÉTIE MÉTAPHORIQUE, SECRET DE CAMPAGNE : pas d'effondrement physique. Tala finit par se mettre en tête d'enquêter sur d'étranges coïncidences électorales - \"déterrer cette affaire\", comme elle dit - et découvre peu à peu que Bunker Oméga prend le contrôle progressif de la cité par les urnes (voir \"VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE\"). La cité sera bel et bien ensevelie - sous la vérité qu'elle aura mise au jour, et la crise de confiance qui s'ensuivra.]"
        ]
      },
      "mine profonde [3e arrondissement]": {
        "nom": "Mine Profonde [3e Arrondissement]",
        "description": "D'anciennes carrières où l'on arrache des poutres d'acier aux fondations des anciennes gratte-ciel. Une partie du site est louée à Cité Industrielle, qui n'a nulle part ailleurs les gisements dont ses forges ont besoin - la commune n'a ni les infrastructures ni les moyens de l'exploiter seule.",
        "personnages": [
          {
            "nom": "Ashka Soupape",
            "role": "Chef d'Arrondissement élue, Mine Profonde",
            "traits": [
              "Administre l'arrondissement au nom de la commune - perçoit le loyer versé par Cité Industrielle, entretient les infrastructures communes, avec un dévouement apparemment exemplaire envers Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
              "En réalité, elle nourrit et guide secrètement les meutes de rats-charognards mutants vers les concessions minières de ses rivaux, réservant les zones sûres aux équipes qui lui versent une \"taxe de protection\" occulte.",
              "Prétend, comme tout le monde, chercher une solution au problème des rats — alors qu'elle en est la cause directe et la seule à en tirer profit.",
              "La technologie de contrôle par phéromones qui lui permet de diriger les meutes lui a été offerte par Vorn, un \"conseiller en stratégie électorale\" qui l'a aidée à se faire élire - voir \"VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE\". Elle ignore tout de sa véritable nature et le prend pour un simple fixeur bien connecté."
            ]
          },
          {
            "nom": "Cade Noyau",
            "role": "Contremaître, employé de Cité Industrielle",
            "traits": [
              "Supervise, pour le compte de la Maison Ferraille, l'extraction sur la concession louée de Mine Profonde.",
              "Considère Mine Profonde comme son propre royaume - un royaume qu'il ne possède pourtant pas."
            ]
          },
          {
            "nom": "Talin Sang",
            "role": "Surveillant, employé de Cité Industrielle",
            "traits": [
              "Gère les travailleurs forcés de la Maison Ferraille détachés sur la concession de Mine Profonde - les mêmes esclaves que ceux du Dépôt de Ferraille (voir Cité Industrielle), simplement délocalisés ici le temps d'un contrat d'extraction.",
              "[MJ - L'ÉTINCELLE DE LA RÉVOLTE : c'est ici, en travaillant chaque jour aux côtés de citoyens libres d'une véritable démocratie - votant, se présentant aux élections, interpellant leur Maire en pleine rue - que les esclaves de la Maison Ferraille ont pris pleinement conscience du contraste avec leur propre condition. Le sentiment de révolte qui couve à Cité Industrielle (voir \"LA RÉVOLTE RÉPUBLICAINE\") a germé ici, à la Mine Profonde, avant de voyager avec eux au retour de chaque contrat.]"
            ]
          }
        ],
        "points": [
          "D'anciennes carrières où l'on arrache des poutres d'acier aux fondations des anciennes gratte-ciel. Une partie du site est louée à Cité Industrielle, qui n'a nulle part ailleurs les gisements dont ses forges ont besoin - la commune n'a ni les infrastructures ni les moyens de l'exploiter seule.",
          "Ashka Soupape (Chef d'Arrondissement élue, Mine Profonde)",
          "Administre l'arrondissement au nom de la commune - perçoit le loyer versé par Cité Industrielle, entretient les infrastructures communes, avec un dévouement apparemment exemplaire envers Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "En réalité, elle nourrit et guide secrètement les meutes de rats-charognards mutants vers les concessions minières de ses rivaux, réservant les zones sûres aux équipes qui lui versent une \"taxe de protection\" occulte.",
          "Prétend, comme tout le monde, chercher une solution au problème des rats — alors qu'elle en est la cause directe et la seule à en tirer profit.",
          "La technologie de contrôle par phéromones qui lui permet de diriger les meutes lui a été offerte par Vorn, un \"conseiller en stratégie électorale\" qui l'a aidée à se faire élire - voir \"VORN CASSURE : LA FAILLE DANS LA DÉMOCRATIE\". Elle ignore tout de sa véritable nature et le prend pour un simple fixeur bien connecté.",
          "Cade Noyau (Contremaître, employé de Cité Industrielle)",
          "Supervise, pour le compte de la Maison Ferraille, l'extraction sur la concession louée de Mine Profonde.",
          "Considère Mine Profonde comme son propre royaume - un royaume qu'il ne possède pourtant pas.",
          "Talin Sang (Surveillant, employé de Cité Industrielle)",
          "Gère les travailleurs forcés de la Maison Ferraille détachés sur la concession de Mine Profonde - les mêmes esclaves que ceux du Dépôt de Ferraille (voir Cité Industrielle), simplement délocalisés ici le temps d'un contrat d'extraction.",
          "[MJ - L'ÉTINCELLE DE LA RÉVOLTE : c'est ici, en travaillant chaque jour aux côtés de citoyens libres d'une véritable démocratie - votant, se présentant aux élections, interpellant leur Maire en pleine rue - que les esclaves de la Maison Ferraille ont pris pleinement conscience du contraste avec leur propre condition. Le sentiment de révolte qui couve à Cité Industrielle (voir \"LA RÉVOLTE RÉPUBLICAINE\") a germé ici, à la Mine Profonde, avant de voyager avec eux au retour de chaque contrat.]"
        ]
      },
      "usine de recyclage [2e arrondissement - siège de la mairie]": {
        "nom": "Usine de Recyclage [2e Arrondissement - siège de la Mairie]",
        "description": "Moins une usine qu'un immense marché couvert, où de multiples stands se sont installés entre les presses hydrauliques encore actives. Certaines lignes d'assemblage et îlots robotisés d'avant-guerre fonctionnent toujours, propriété commune de la cité, partagés librement entre tous les habitants qui savent s'en servir.",
        "personnages": [
          {
            "nom": "Brix Ferraille",
            "role": "Chef d'Arrondissement élu, Usine de Recyclage",
            "traits": [
              "Administre le 2e Arrondissement et l'accès aux îlots robotisés communs, arbitrant les tours d'utilisation entre habitants avec une équité dont il est fier.",
              "Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Vesper Sang",
            "role": "Régisseuse du Marché",
            "traits": [
              "Tient à jour la liste des stands et des artisans installés dans Usine de Recyclage.",
              "Considère Usine de Recyclage comme son propre royaume - un royaume qu'elle partage volontiers, tant qu'on respecte les règles."
            ]
          },
          {
            "nom": "Ronan Sang",
            "role": "Technicien des Îlots Communs",
            "traits": [
              "Entretient les lignes d'assemblage et îlots robotisés d'avant-guerre pour que chacun puisse s'en servir.",
              "Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          }
        ],
        "points": [
          "Moins une usine qu'un immense marché couvert, où de multiples stands se sont installés entre les presses hydrauliques encore actives. Certaines lignes d'assemblage et îlots robotisés d'avant-guerre fonctionnent toujours, propriété commune de la cité, partagés librement entre tous les habitants qui savent s'en servir.",
          "Brix Ferraille (Chef d'Arrondissement élu, Usine de Recyclage)",
          "Administre le 2e Arrondissement et l'accès aux îlots robotisés communs, arbitrant les tours d'utilisation entre habitants avec une équité dont il est fier.",
          "Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Vesper Sang (Régisseuse du Marché)",
          "Tient à jour la liste des stands et des artisans installés dans Usine de Recyclage.",
          "Considère Usine de Recyclage comme son propre royaume - un royaume qu'elle partage volontiers, tant qu'on respecte les règles.",
          "Ronan Sang (Technicien des Îlots Communs)",
          "Entretient les lignes d'assemblage et îlots robotisés d'avant-guerre pour que chacun puisse s'en servir.",
          "Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
        ]
      },
      "cimetière des gratte-ciels": {
        "nom": "Cimetière des Gratte-Ciels",
        "description": "Une forêt de tours effondrées, domaine réservé aux pilleurs de ferraille agiles.",
        "personnages": [
          {
            "nom": "Doran Plomb",
            "role": "Chef Pilleur",
            "traits": [
              "Guide les équipes de récupération à travers les tours instables du Cimetière des Gratte-Ciels.",
              "Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Mira Plomb",
            "role": "Grimpeuse Éclaireuse",
            "traits": [
              "Repère les poutres encore récupérables avant l'effondrement complet d'une tour.",
              "Considère Cimetière des Gratte-Ciels comme son propre royaume."
            ]
          },
          {
            "nom": "Sura Soupape",
            "role": "Ouvrier / Garde Pilleur",
            "traits": [
              "Surveille les équipes contre les rats-charognards et les pilleurs rivaux.",
              "Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          }
        ],
        "points": [
          "Une forêt de tours effondrées, domaine réservé aux pilleurs de ferraille agiles.",
          "Doran Plomb (Chef Pilleur)",
          "Guide les équipes de récupération à travers les tours instables du Cimetière des Gratte-Ciels.",
          "Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Mira Plomb (Grimpeuse Éclaireuse)",
          "Repère les poutres encore récupérables avant l'effondrement complet d'une tour.",
          "Considère Cimetière des Gratte-Ciels comme son propre royaume.",
          "Sura Soupape (Ouvrier / Garde Pilleur)",
          "Surveille les équipes contre les rats-charognards et les pilleurs rivaux.",
          "Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
        ]
      },
      "marché aux alliages rares": {
        "nom": "Marché aux Alliages Rares",
        "description": "Une zone hautement sécurisée où s'échangent titane, tungstène et composants d'aviation.",
        "personnages": [
          {
            "nom": "Raze Soupape",
            "role": "Expert en Alliages",
            "traits": [
              "Authentifie et évalue chaque pièce rare échangée sur Marché aux Alliages Rares.",
              "Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          },
          {
            "nom": "Orok Sombre",
            "role": "Négociant en Composants",
            "traits": [
              "Fait le lien entre Marché aux Alliages Rares et les acheteurs des autres cités.",
              "Considère Marché aux Alliages Rares comme son propre royaume."
            ]
          },
          {
            "nom": "Cade Vif",
            "role": "Ouvrier / Garde du Marché aux Alliages",
            "traits": [
              "Protège les stocks les plus précieux de Marché aux Alliages Rares.",
              "Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
            ]
          }
        ],
        "points": [
          "Une zone hautement sécurisée où s'échangent titane, tungstène et composants d'aviation.",
          "Raze Soupape (Expert en Alliages)",
          "Authentifie et évalue chaque pièce rare échangée sur Marché aux Alliages Rares.",
          "Totalement loyal envers les idéaux de Cité des Métaux & Recyclage - \"Les Fossoyeurs\".",
          "Orok Sombre (Négociant en Composants)",
          "Fait le lien entre Marché aux Alliages Rares et les acheteurs des autres cités.",
          "Considère Marché aux Alliages Rares comme son propre royaume.",
          "Cade Vif (Ouvrier / Garde du Marché aux Alliages)",
          "Protège les stocks les plus précieux de Marché aux Alliages Rares.",
          "Connaît les secrets les plus sombres de Cité des Métaux & Recyclage - \"Les Fossoyeurs\"."
        ]
      },
      "l'atelier des rafistoleurs": {
        "nom": "L'Atelier des Rafistoleurs",
        "description": "Un enchevêtrement d'établis à ciel ouvert où rien de ce qui y entre en pièces n'en ressort vraiment mort. Des clients arrivent parfois de très loin, un objet irréparable sous le bras, dans l'espoir d'un miracle.",
        "personnages": [
          {
            "nom": "Nesta Rouage",
            "role": "Maîtresse Rafistoleuse",
            "traits": [
              "La meilleure réparatrice du monde connu, reconnue même par-delà les frontières de la cité : on dit qu'elle a un jour refait fonctionner un moteur qu'un ingénieur de Cité Industrielle avait déclaré irrécupérable.",
              "Forme les apprentis à une règle simple : tout ce qui a fonctionné une fois peut refonctionner - il suffit de comprendre pourquoi ça s'est arrêté.",
              "Accepte de réparer à peu près n'importe quoi, contre à peu près n'importe quoi - une devise qui a fait sa réputation dans tout le bassin."
            ]
          },
          {
            "nom": "Ilio Fusible",
            "role": "Apprenti Prodige",
            "traits": [
              "Le plus doué des apprentis de Nesta Rouage, déjà capable de rivaliser avec des maîtres d'autres cités.",
              "Rêve secrètement de dépasser sa maîtresse, sans jamais oser le lui dire."
            ]
          }
        ],
        "points": [
          "Un enchevêtrement d'établis à ciel ouvert où rien de ce qui y entre en pièces n'en ressort vraiment mort. Des clients arrivent parfois de très loin, un objet irréparable sous le bras, dans l'espoir d'un miracle.",
          "Nesta Rouage (Maîtresse Rafistoleuse)",
          "La meilleure réparatrice du monde connu, reconnue même par-delà les frontières de la cité : on dit qu'elle a un jour refait fonctionner un moteur qu'un ingénieur de Cité Industrielle avait déclaré irrécupérable.",
          "Forme les apprentis à une règle simple : tout ce qui a fonctionné une fois peut refonctionner - il suffit de comprendre pourquoi ça s'est arrêté.",
          "Accepte de réparer à peu près n'importe quoi, contre à peu près n'importe quoi - une devise qui a fait sa réputation dans tout le bassin.",
          "Ilio Fusible (Apprenti Prodige)",
          "Le plus doué des apprentis de Nesta Rouage, déjà capable de rivaliser avec des maîtres d'autres cités.",
          "Rêve secrètement de dépasser sa maîtresse, sans jamais oser le lui dire."
        ]
      }
    }
  },
  "cité du carburant": {
    "num": "10",
    "name": "CITÉ DU CARBURANT - \"LES RAFFINEURS\"",
    "specialty": "mazout, carburant synthétique, huiles",
    "strength": "contrôle les convois motorisés - et la ressource la plus disputée du bassin, sacralisée en \"Sang Noir\" par un culte omniprésent qui soude la cité bien plus qu'aucune loi profane ne le pourrait.",
    "weakness": "leur carburant est instable, parfois explosif - une instabilité que le culte interprète comme la colère d'un dieu plutôt que comme un simple risque industriel, ce qui pousse parfois à des réponses religieuses là où une réponse technique suffirait.",
    "particularity": "leurs raffineries sont aussi des forteresses mobiles",
    "geo": "Étendue sur l'ancienne capitale d'Alger (Ancienne Algérie), exploitant les richesses pétrolières du sud.",
    "gps": "36.7538° N, 3.0588° E (Alger)",
    "foundation": "2113 (d'anciens ingénieurs pétroliers remettent en service les derniers puits accessibles).",
    "params": "Santé 45, Technologie 75, Richesse 50, Carburant 95, Nourriture 40, Bonheur 50, Armement 70",
    "stats": {
      "santé": 45,
      "technologie": 75,
      "richesse": 50,
      "carburant": 95,
      "nourriture": 40,
      "bonheur": 50,
      "armement": 70
    },
    "tension": "Une série d'incendies criminels frappe les derricks depuis trois cycles. Les Raffineurs soupçonnent un sabotage commandité par une cité rivale cherchant à faire grimper le prix du carburant, mais aucune preuve ne permet encore d'accuser qui que ce soit ouvertement. Le Clergé du Sang Noir y voit surtout un signe : la colère du Dieu-Moteur gronde, et certains prêtres commencent à réclamer des réponses qui dépassent largement la simple enquête.",
    "clock": null,
    "lore": [
      {
        "title": "LE CLERGÉ DU SANG NOIR : UNE THÉOCRATIE DU CARBURANT",
        "text": "Cité du Carburant n'est pas dirigée par des ingénieurs ni par des barons rivaux, mais par un conseil religieux : le Clergé du Sang Noir, qui vénère le carburant lui-même comme le fluide vital du Dieu-Moteur - littéralement son sang, arraché à la terre par la \"saignée\" que sont les forages, purifié par la \"communion\" des raffineries. À sa tête siège Le Grand Raffineur, titre à la fois religieux et technique, tenu à vie et transmis par onction plutôt que par élection ou hérédité directe. -----------------------------------------------------------------------LA HIÉRARCHIE DU SANG NOIR -----------------------------------------------------------------------Le Clergé suit une architecture stricte, à quatre échelons : 1. FRÈRE / SŒUR DU SANG - le rang d'entrée, ouvert à quiconque se soumet au culte. Ils accomplissent le travail manuel le plus dur et le plus dangereux (entretien des derricks, surveillance des citernes) comme une forme de dévotion et de noviciat. 2. PRÊTRE DU SANG NOIR - clergé ordonné, responsable d'un rite précis (la saignée à l'extraction, la communion au raffinage, la bénédiction des convois) sur un site donné. On le devient après des années de service comme Frère et une épreuve publique - survivre sans faillir à un incident de forage est, à lui seul, considéré comme une preuve de foi suffisante. 3. CARDINAL-RAFFINEUR - haut clergé, à la tête d'un site majeur de la cité. Ensemble, les cinq Cardinaux-Raffineurs forment LE CONCLAVE DES CINQ, qui conseille le Grand Raffineur et ratifie par acclamation le successeur qu'il désigne de son vivant : - Le Grand Raffineur lui-même préside directement la Grande Raffinerie (voir sa fiche). - Joran Lame - Dépôt de Carburant Haute Sécurité - Ryn Rouage - Puits d'Extraction Principal - Nova Braise - L'Arche du Sang Noir - Fennic Cendre - Le Pèlerin de Fer 4. LE GRAND RAFFINEUR - l'équivalent d'un pape pour le culte du Dieu-Moteur : autorité technique suprême et plus haute figure religieuse réunies en une seule personne, tenue à vie. À sa mort ou sa retraite, le Conclave des Cinq se réunit pour ratifier son successeur désigné - ou, en l'absence de désignation claire, pour en débattre jusqu'à l'unanimité, aussi longtemps qu'il le faudra. [MJ - SECRET DE CAMPAGNE, RACINE HISTORIQUE, \"LES ORIGINES CACHÉES\" : voir plus bas.] -----------------------------------------------------------------------LES ORIGINES CACHÉES : L'HÉRITAGE DE FAIRE SURVIVRE -----------------------------------------------------------------------[MJ - SECRET DE CAMPAGNE, À DÉCOUVRIR] Cité du Carburant n'a pas été fondée en 2113 par de simples ingénieurs pétroliers reprenant du service : ses véritables fondateurs descendaient d'un bunker du camp FAIRE SURVIVRE (voir CONTEXTE HISTORIQUE, \"L'ENTRE-DEUX\") - la même ligne philosophique que Bunker Oméga lui-même, \"un autre bunker\" parmi ceux qui \"ont existé\" sans jamais réapparaître sous ce nom. Sa doctrine fondatrice tenait en une phrase : seule compte la survie biologique de l'espèce, par tous les moyens nécessaires, même au prix du plus grand secret. Les tout premiers forages ont coûté un nombre de vies si effroyable que les ingénieurs survivants n'ont eu qu'un choix : se retrancher derrière une dimension sacrée pour maintenir l'ordre et donner un sens à tant de morts. Ce voile religieux, conçu au départ comme un pieux mensonge de survie, a fini par devenir la seule vérité que la cité se raconte encore. Aujourd'hui, presque plus personne - pas même le Grand Raffineur en exercice - ne connaît l'histoire véritable de la fondation. Elle n'est pas gardée : elle est simplement perdue, quelque part sous la Grande Raffinerie, dans des archives que personne n'a plus consultées depuis des générations. [MJ - PISTE DE JEU : si vous voulez rendre cette vérité reconstituable, envisagez des journaux d'ingénieurs pré-culte enfouis sous la Grande Raffinerie - jamais un aveu explicite, seulement des fragments techniques et des noms qui, recoupés avec CONTEXTE HISTORIQUE, révèlent peu à peu la filiation avec Bunker Oméga. Aucun des deux camps n'a jamais soupçonné l'existence de l'autre.] -----------------------------------------------------------------------LES DEUX ARCHES : L'ARCHE DU SANG NOIR ET LE PÈLERIN DE FER -----------------------------------------------------------------------Les \"forteresses mobiles\" ne sont pas une simple image : ce sont deux gigantesques infrastructures sur chenilles, de véritables mini-cités sacrées d'un millier d'habitants chacune, qui parcourent le désert de sel à la recherche de nouveaux gisements. Quand un forage est repéré, l'Arche s'immobilise et pompe sur place, parfois durant plusieurs années, avant de reprendre sa marche vers la prochaine plaie de la terre à ouvrir. La nappe principale sous Cité du Carburant elle-même n'est toujours pas épuisée : la cité-mère, elle, ne bouge jamais. Les habitants de L'Arche du Sang Noir et du Pèlerin de Fer sont les fidèles les plus zélés du culte tout entier - une vie de pèlerinage permanent, consacrée corps et âme à la recherche du sang de la terre, attire naturellement les croyants les plus absolus. Beaucoup de Raffineurs de la cité fixe les considèrent avec un mélange de respect et de crainte : ce sont eux qui souffrent le plus, qui trouvent le plus de gisements, et dont la ferveur ne faiblit jamais. [MJ - potentiel de campagne : chaque Arche est une cité en miniature, avec ses propres tensions, son propre clergé local subordonné au Grand Raffineur, et son propre rapport (plus intense encore) avec le Dieu-Moteur. Une Arche isolée depuis des mois, injoignable, ou de retour avec un chargement qu'elle refuse d'expliquer, sont des accroches immédiatement disponibles.] -----------------------------------------------------------------------RELATIONS AVEC LES NEUF AUTRES CITÉS ------------------------------------------------------------------------ Cité des Métaux & Recyclage : l'alliance la plus précieuse de toutes, sans l'ombre d'une friction. C'est leur principal distributeur : chaque convoi de carburant qui traverse le désert de sel fait étape à leur carrefour central pour y ravitailler tous ceux qui y passent, bien au-delà de sa propre clientèle. Sans ce relais, la moitié du bassin verrait son approvisionnement en carburant fondre du jour au lendemain - une dépendance mutuelle si ancienne que même le Clergé du Sang Noir la considère comme une bénédiction du Dieu-Moteur plutôt que comme une simple logistique. - Cité de l'Eau & Alimentation : la rivalité la plus tendue de toutes, déjà connue de leur côté (voir Cité de l'Eau, \"RELATIONS AVEC LES NEUF AUTRES CITÉS\") - dépendance croisée classique, et des durs du Conseil des Gardiens qui financent en secret Vex Rouge. Le Clergé du Sang Noir n'y voit que la colère du Dieu-Moteur, jamais un sabotage commercial, ce qui rend la vérité d'autant plus difficile à mettre au jour. - Cité de l'Armement & Défense : dépendance vitale déjà connue de leur côté (un embargo les paralyserait en quelques semaines) - un levier de pression que Cité du Carburant n'a jamais pleinement exploité, davantage tournée vers le sacré que vers la realpolitik. - Cité Industrielle : dépendance lourde et directe - les lignes d'assemblage et les convois de la Maison Ferraille tournent au carburant. Une relation purement commerciale, sans ferveur religieuse d'un côté ni de l'autre. - Cité Médicale : dépendance modérée pour les ambulances et générateurs - échanges réguliers, sans grand enjeu. - Cité du Divertissement : cliente de luxe qui paie cher pour ses générateurs de spectacle - un contraste culturel amusant entre le sacré du Sang Noir et le profane des arènes et des théâtres. - Nuke City : dépendance modeste, l'énergie nucléaire les rendant moins vulnérables que les autres - un respect mutuel discret entre les deux seules cités du bassin à traiter leur source d'énergie comme quelque chose de sacré, chacune à sa façon. - Bunker Oméga : aucun contact reconnu - mais si le Haut Conseil (voir sa fiche) a conservé des archives sur d'autres bunkers du camp FAIRE SURVIVRE, il pourrait être le seul endroit au monde à détenir un fragment de la vérité que Cité du Carburant a oubliée sur elle-même, sans jamais avoir fait le lien avec la cité d'aujourd'hui. - L'Île des Anciens : aucun contact confirmé, mais géographiquement la deuxième cité la plus proche après l'Armement, sur la même façade atlantique - un simple détail, sans suite à ce stade. Lieux et Personnages Notables : >> Le Marché d'Échanges [Description du lieu : Une rue éclairée aux torches où l'odeur d'essence prend à la gorge. On y échange des barils de brut et du carburant synthétique contre la vie.] - Talin Sang (Marchand Principal) - Dirige les échanges au sein de Le Marché d'Échanges. - A survécu à de multiples attaques de pillards. - Considère Cité du Carburant - \"Les Raffineurs\" comme le seul havre de paix rentable. - Kael Clou (Garde du Marché) - Protège les marchands de Le Marché d'Échanges. - Ancien mercenaire cherchant la rédemption. - Connaît toutes les rumeurs de Cité du Carburant - \"Les Raffineurs\". - Ronan Noyau (Fouineur / Voleur) - Survit dans les ombres de Le Marché d'Échanges. - Orphelin de la guerre des ressources. - Vend des informations confidentielles sur les élites de Cité du Carburant - \"Les Raffineurs\". >> La Citerne Centrale [Description du lieu : Plutôt que de l'eau, cette cuve contient du carburant brut. L'eau est extrêmement rare ici et s'échange au prix de l'or noir.] - Zane Moteur (Ingénieur Hydrologue) - Maintient la pureté de l'eau à La Citerne Centrale. - Obsédé par les toxines et les radiations. - Pense que l'eau de Cité du Carburant - \"Les Raffineurs\" est la clé de la survie humaine. - Meya Ferraille (Distributeur de Rations) - Gère les files d'attente à La Citerne Centrale. - Corrompu : garde les meilleures rations pour lui. - Détient un pouvoir immense sur les pauvres de Cité du Carburant - \"Les Raffineurs\". - Joran Cendre (Protecteur du Puits) - Garde armé affecté à La Citerne Centrale. - A ordre de tirer à vue sur les saboteurs. - Fanatique dévoué à la survie de Cité du Carburant - \"Les Raffineurs\". >> Le Générateur Principal [Description du lieu : Une série d'énormes moteurs diesel hurlants qui alimentent les pompes d'extraction, crachant des flammes et une fumée épaisse.] - Cyrus Vif (Mécano-Chef) - Supervise le fonctionnement de Le Générateur Principal. - Ses poumons sont détruits par la fumée. - Maintient Cité du Carburant - \"Les Raffineurs\" en vie à lui tout seul. - Zane Poussière (Ouvrier du Carburant) - Travaille dans la chaleur de Le Générateur Principal. - Porte de lourdes cicatrices de brûlures. - Rêve de s'échapper de Cité du Carburant - \"Les Raffineurs\". - Jax Soupape (Prêtre du Générateur, Clergé du Sang Noir) - Vénère la machine à Le Générateur Principal, qu'il considère comme un organe vital du Dieu-Moteur. - Prêche que les pannes sont des punitions divines - une doctrine qu'il n'a plus besoin de chuchoter, puisque le Clergé du Sang Noir dirige la cité au grand jour. - Rêve de siéger un jour aux côtés du Grand Raffineur (voir Grande Raffinerie). >> Le Mur d'Enceinte & Les Portes [Description du lieu : Une ligne de tranchées remplies de pétrole, prêtes à être enflammées à la moindre attaque de pillards.] - Orok Lame (Capitaine de la Garde) - Commande la défense à Le Mur d'Enceinte & Les Portes. - Vétéran impitoyable de la dernière guerre. - Ne laisse entrer personne dans Cité du Carburant - \"Les Raffineurs\" sans pot-de-vin. - Ronan Sel (Tireur d'Élite) - Surveille les horizons depuis Le Mur d'Enceinte & Les Portes. - A perdu sa famille à l'extérieur des murs. - Son fusil est son seul ami dans Cité du Carburant - \"Les Raffineurs\". - Vex Rouge (Contrebandier) [MJ — Archétype brisé : l'incendiaire] - Fait officiellement passer des biens par Le Mur d'Enceinte & Les Portes, un commerce toléré tant qu'il verse sa part aux gardes. - En réalité, c'est lui qui déclenche depuis trois cycles les incendies criminels qui frappent les derricks, payé en secret par une cité rivale désireuse de faire grimper le prix du carburant sur le marché inter-cités. - Connaît les failles de la sécurité mieux que quiconque — logique, puisqu'il les a lui-même repérées pour préparer chaque sabotage. >> Le Quartier Résidentiel / Les Taudis [Description du lieu : Des campements de tentes poisseuses au milieu des flaques d'hydrocarbures. Une simple étincelle peut raser un quartier entier.] - Tala Sable (Leader Communautaire) - Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis. - Organise des soupes populaires. - S'oppose souvent aux dirigeants de Cité du Carburant - \"Les Raffineurs\". - Tala Sel (Médecin Clandestin) - Soigne les exclus de Le Quartier Résidentiel / Les Taudis. - Utilise des remèdes expérimentaux non approuvés. - Protégé par les gangs locaux de Cité du Carburant - \"Les Raffineurs\". - Talin Rouge (Survivant Désespéré) - Respire volontairement les vapeurs des raffineries à pleins poumons, en riant. - Voit des flammes danser sur les visages des passants, même en plein jour. - Prédit que Cité du Carburant - \"Les Raffineurs\" s'embrasera de l'intérieur, consumée par sa propre richesse. - [MJ - PROPHÉTIE LITTÉRALE, SECRET DE CAMPAGNE : elle est déjà en cours. Les incendies de Vex Rouge (voir Le Mur d'Enceinte) sont la moitié visible de l'embrasement - l'autre moitié est religieuse. Le Clergé du Sang Noir, incapable d'admettre une cause aussi profane qu'un sabotage commercial, y voit la colère du Dieu-Moteur et pourrait dériver vers des réponses de plus en plus extrêmes (purges, boucs émissaires, offrandes) à mesure que les incendies se poursuivent. La cité risque de se consumer deux fois : par le feu de Vex Rouge, et par le fanatisme qu'il attise sans le vouloir chez ceux qui refusent d'y voir autre chose qu'un signe divin.] >> Grande Raffinerie [siège du Clergé du Sang Noir] [Description du lieu : Un enchevêtrement de tuyaux et de cheminées crachant du feu, aménagé en sanctuaire à ciel ouvert. C'est le cœur économique et religieux de la cité.] - Osk Sang (Le Grand Raffineur, chef du Clergé du Sang Noir) - Dirige la cité depuis Grande Raffinerie, à la fois autorité technique suprême et plus haute figure religieuse du culte du Dieu-Moteur. - Préside personnellement les grandes purifications - la transformation du brut en carburant, célébrée comme une communion. - Ignore, comme la quasi-totalité de son propre Clergé, la véritable origine de la cité (voir \"LES ORIGINES CACHÉES : L'HÉRITAGE DE FAIRE SURVIVRE\") - il croit sincèrement diriger une théocratie ancienne, pas un mensonge de survie devenu vérité par la force de l'habitude. - Face aux incendies de Vex Rouge, penche de plus en plus vers une lecture religieuse de la crise plutôt qu'une enquête profane - une dérive que peu de PJ verront venir avant qu'il ne soit trop tard. - Jax Sombre (Spécialiste Pétrolier) - S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\". - Considère Grande Raffinerie comme son propre royaume. - Elara Vif (Ouvrier / Garde Pétrolier) - A survécu à une explosion massive à Grande Raffinerie. - Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\". >> Dépôt de Carburant Haute Sécurité [Description du lieu : Des citernes souterraines gardées par des snipers, constituant la plus grande richesse du monde connu - et son plus grand reliquaire.] - Joran Lame (Cardinal-Raffineur, Gardien du Reliquaire) - Administre les réserves sacrées de Dépôt de Carburant Haute Sécurité comme un trésor à la fois stratégique et divin. - Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\". - Sia Noir (Spécialiste Pétrolier) - S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\". - Considère Dépôt de Carburant Haute Sécurité comme son propre royaume. - Sura Rouage (Ouvrier / Garde Pétrolier) - A survécu à une explosion massive à Dépôt de Carburant Haute Sécurité. - Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\". >> Puits d'Extraction Principal [Description du lieu : Des derricks rouillés qui pompent inlassablement les ultimes réserves d'or noir - la \"saignée\" originelle, la plus ancienne et la plus sacrée de toutes.] - Ryn Rouage (Cardinal-Raffineur, Officiant de la Saignée) - Préside les rites d'extraction à Puits d'Extraction Principal, considérés comme la forme la plus pure de communion avec le Dieu-Moteur. - Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\". - Jorn Rouage (Spécialiste Pétrolier) - S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\". - Considère Puits d'Extraction Principal comme son propre royaume. - Jax Ferraille (Ouvrier / Garde Pétrolier) - A survécu à une explosion massive à Puits d'Extraction Principal. - Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\". >> Garage des Convois Lourds [Description du lieu : Un hangar géant sentant l'huile chaude, où les célèbres camions-citernes de la cité sont entretenus.] - Nova Sang (Maîtresse des Convois) - Bénit chaque camion-citerne avant son départ, une goutte de Sang Noir versée sur le capot selon le rite. - Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\". - Ines Sable (Mécanicienne-Officiante) - Entretient les moteurs avec la même rigueur qu'un rite religieux au Garage des Convois Lourds. - Considère Garage des Convois Lourds comme son propre royaume. - Ryn Acier (Ouvrier / Garde des Convois) - Escorte les convois hors des murs de Cité du Carburant - \"Les Raffineurs\". - Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\". -----------------------------------------------------------------------========================================================================"
      },
      {
        "title": "ANNEXE MJ : RÉCAPITULATIF DES ARCHÉTYPES BRISÉS ET DES AGENTS DU RÉSEAU",
        "text": "[NOTE MJ : cette annexe est un outil de préparation, pas un texte à lire aux joueurs. Elle liste les PNJ dont l'archétype a été volontairement détourné, pour vous permettre de les retrouver d'un coup d'œil.] - Kaelen Cendre (Bunker Oméga, Marché d'Échanges) — agent du Réseau en rupture de synchronisation, sentiments réels envers Kael Clou. - Corin Ferraille (Cité Industrielle, Mur d'Enceinte) — capitaine qui arme en secret la révolte des esclaves du Dépôt de Ferraille. - Cade Cendre (Cité Médicale, Marché d'Échanges) — marchand traître qui revend la souche de peste au marché noir. - Osrin Tendresse (Cité Médicale, Maison des Orphelins) — bienfaiteur sincère dont le Programme des Parrains dissimule un prélèvement systématique, jusqu'au sacrifice complet via le Rite de la Grande Famille. - Vessa Calme (Cité Médicale, Les Apaiseurs) — psychiatre convaincue de soigner, dont les traitements servent en réalité à discipliner les apprentis les plus rebelles du système de servitude. - Vulcain (Cité Médicale, Sanctuaire de Vulcain) — le plus vieil homme connu du bassin méditerranéen, qui abuse depuis des décennies du Rite de la Grande Famille pour se maintenir en vie sous une identité renouvelée à chaque génération. - Éphaistos (Cité Médicale, Sanctuaire de Vulcain) — Enfant du Nord devenu cobaye puis bras droit de Vulcain sans le savoir ; porteur d'une graine dormante du Réseau qu'aucun des deux ne soupçonne. - Meya Rouage (Cité de l'Armement, Mur d'Enceinte) — négocie en secret une reddition partielle face au Chacal Rouillé. - Joran Vif (Cité de l'Eau & Alimentation, Marché d'Échanges) — détourne l'eau vers les nomades pour s'enrichir sur la pénurie. - Ashka Soupape (Cité des Métaux & Recyclage, Mine Profonde) — nourrit et dirige elle-même les rats-charognards pour un racket de protection. - Vorn Cassure (Cité des Métaux & Recyclage, Mairie du 2e Arrondissement) — agent du Réseau opérant à visage découvert comme conseiller en stratégie électorale, exploitant l'ouverture de la démocratie locale pour infiltrer le Conseil des arrondissements. - Vex Rouge (Cité du Carburant, Mur d'Enceinte) — l'incendiaire payé par des durs du Conseil des Gardiens de la Source (via Sura Clou), déguisé en simple contrebandier. - Ronan Sable (Cité de l'Eau & Alimentation, La Citerne Centrale) — ingénieur sincère, canal humain unique et non reconnu vers la Source, une IA bridée dont il ignore probablement l'étendue réelle de ses capacités. - Rook Cendre (Cité du Divertissement, Mur d'Enceinte) — agent du Réseau chargé d'orchestrer la succession au profit de Bunker Oméga ; supervise en personne le recrutement quadriennal de la Garde. - Mère Songe (Cité du Divertissement, Quartier des Nostalgics) — cadette consciente du Réseau, sait d'où vient réellement la technologie de souvenirs de synthèse et choisit avec soin les clients auxquels elle réserve ses services \"les plus raffinés\". - Joran Sombre (Nuke City, Cœur du Réacteur) — fanatique du culte de l'Atome qui attire volontairement le Ver de Vitre vers le réacteur. RAPPEL DU TELL DU RÉSEAU : ne jamais utiliser le prénom seul comme indice révélé aux joueurs. Le vrai signal, c'est la RÉPÉTITION MOT POUR MOT d'une phrase entière déjà entendue ailleurs dans la campagne (\"le seul havre de paix rentable\", \"connaît toutes les rumeurs de...\", \"fanatique dévoué à la survie de...\"). Semez ces répétitions avec parcimonie — une ou deux fois par acte de campagne suffit largement pour installer le doute sans vendre la mèche trop vite."
      },
      {
        "title": "NOTE : LA CAMPAGNE A ÉTÉ EXTRAITE DANS UN FICHIER À PART",
        "text": "Le chapitre \"LA COURSE DU SEL (QUÊTE D'OUVERTURE)\" ainsi que les graines pour la suite de la campagne ont été déplacés dans leur propre document autonome : Campagne_v2.txt. Consultez ce fichier pour la quête d'ouverture et tout ce qui s'y rattache ; ce document-ci reste le référentiel de lore universel (cités, factions, secrets de campagne transversaux comme le Réseau ou le Registre). ========================================================================"
      }
    ],
    "buildings": {
      "le marché d'échanges": {
        "nom": "Le Marché d'Échanges",
        "description": "Une rue éclairée aux torches où l'odeur d'essence prend à la gorge. On y échange des barils de brut et du carburant synthétique contre la vie.",
        "personnages": [
          {
            "nom": "Talin Sang",
            "role": "Marchand Principal",
            "traits": [
              "Dirige les échanges au sein de Le Marché d'Échanges.",
              "A survécu à de multiples attaques de pillards.",
              "Considère Cité du Carburant - \"Les Raffineurs\" comme le seul havre de paix rentable."
            ]
          },
          {
            "nom": "Kael Clou",
            "role": "Garde du Marché",
            "traits": [
              "Protège les marchands de Le Marché d'Échanges.",
              "Ancien mercenaire cherchant la rédemption.",
              "Connaît toutes les rumeurs de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Ronan Noyau",
            "role": "Fouineur / Voleur",
            "traits": [
              "Survit dans les ombres de Le Marché d'Échanges.",
              "Orphelin de la guerre des ressources.",
              "Vend des informations confidentielles sur les élites de Cité du Carburant - \"Les Raffineurs\"."
            ]
          }
        ],
        "points": [
          "Une rue éclairée aux torches où l'odeur d'essence prend à la gorge. On y échange des barils de brut et du carburant synthétique contre la vie.",
          "Talin Sang (Marchand Principal)",
          "Dirige les échanges au sein de Le Marché d'Échanges.",
          "A survécu à de multiples attaques de pillards.",
          "Considère Cité du Carburant - \"Les Raffineurs\" comme le seul havre de paix rentable.",
          "Kael Clou (Garde du Marché)",
          "Protège les marchands de Le Marché d'Échanges.",
          "Ancien mercenaire cherchant la rédemption.",
          "Connaît toutes les rumeurs de Cité du Carburant - \"Les Raffineurs\".",
          "Ronan Noyau (Fouineur / Voleur)",
          "Survit dans les ombres de Le Marché d'Échanges.",
          "Orphelin de la guerre des ressources.",
          "Vend des informations confidentielles sur les élites de Cité du Carburant - \"Les Raffineurs\"."
        ]
      },
      "la citerne centrale": {
        "nom": "La Citerne Centrale",
        "description": "Plutôt que de l'eau, cette cuve contient du carburant brut. L'eau est extrêmement rare ici et s'échange au prix de l'or noir.",
        "personnages": [
          {
            "nom": "Zane Moteur",
            "role": "Ingénieur Hydrologue",
            "traits": [
              "Maintient la pureté de l'eau à La Citerne Centrale.",
              "Obsédé par les toxines et les radiations.",
              "Pense que l'eau de Cité du Carburant - \"Les Raffineurs\" est la clé de la survie humaine."
            ]
          },
          {
            "nom": "Meya Ferraille",
            "role": "Distributeur de Rations",
            "traits": [
              "Gère les files d'attente à La Citerne Centrale.",
              "Corrompu : garde les meilleures rations pour lui.",
              "Détient un pouvoir immense sur les pauvres de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Joran Cendre",
            "role": "Protecteur du Puits",
            "traits": [
              "Garde armé affecté à La Citerne Centrale.",
              "A ordre de tirer à vue sur les saboteurs.",
              "Fanatique dévoué à la survie de Cité du Carburant - \"Les Raffineurs\"."
            ]
          }
        ],
        "points": [
          "Plutôt que de l'eau, cette cuve contient du carburant brut. L'eau est extrêmement rare ici et s'échange au prix de l'or noir.",
          "Zane Moteur (Ingénieur Hydrologue)",
          "Maintient la pureté de l'eau à La Citerne Centrale.",
          "Obsédé par les toxines et les radiations.",
          "Pense que l'eau de Cité du Carburant - \"Les Raffineurs\" est la clé de la survie humaine.",
          "Meya Ferraille (Distributeur de Rations)",
          "Gère les files d'attente à La Citerne Centrale.",
          "Corrompu : garde les meilleures rations pour lui.",
          "Détient un pouvoir immense sur les pauvres de Cité du Carburant - \"Les Raffineurs\".",
          "Joran Cendre (Protecteur du Puits)",
          "Garde armé affecté à La Citerne Centrale.",
          "A ordre de tirer à vue sur les saboteurs.",
          "Fanatique dévoué à la survie de Cité du Carburant - \"Les Raffineurs\"."
        ]
      },
      "le générateur principal": {
        "nom": "Le Générateur Principal",
        "description": "Une série d'énormes moteurs diesel hurlants qui alimentent les pompes d'extraction, crachant des flammes et une fumée épaisse.",
        "personnages": [
          {
            "nom": "Cyrus Vif",
            "role": "Mécano-Chef",
            "traits": [
              "Supervise le fonctionnement de Le Générateur Principal.",
              "Ses poumons sont détruits par la fumée.",
              "Maintient Cité du Carburant - \"Les Raffineurs\" en vie à lui tout seul."
            ]
          },
          {
            "nom": "Zane Poussière",
            "role": "Ouvrier du Carburant",
            "traits": [
              "Travaille dans la chaleur de Le Générateur Principal.",
              "Porte de lourdes cicatrices de brûlures.",
              "Rêve de s'échapper de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Jax Soupape",
            "role": "Prêtre du Générateur, Clergé du Sang Noir",
            "traits": [
              "Vénère la machine à Le Générateur Principal, qu'il considère comme un organe vital du Dieu-Moteur.",
              "Prêche que les pannes sont des punitions divines - une doctrine qu'il n'a plus besoin de chuchoter, puisque le Clergé du Sang Noir dirige la cité au grand jour.",
              "Rêve de siéger un jour aux côtés du Grand Raffineur (voir Grande Raffinerie)."
            ]
          }
        ],
        "points": [
          "Une série d'énormes moteurs diesel hurlants qui alimentent les pompes d'extraction, crachant des flammes et une fumée épaisse.",
          "Cyrus Vif (Mécano-Chef)",
          "Supervise le fonctionnement de Le Générateur Principal.",
          "Ses poumons sont détruits par la fumée.",
          "Maintient Cité du Carburant - \"Les Raffineurs\" en vie à lui tout seul.",
          "Zane Poussière (Ouvrier du Carburant)",
          "Travaille dans la chaleur de Le Générateur Principal.",
          "Porte de lourdes cicatrices de brûlures.",
          "Rêve de s'échapper de Cité du Carburant - \"Les Raffineurs\".",
          "Jax Soupape (Prêtre du Générateur, Clergé du Sang Noir)",
          "Vénère la machine à Le Générateur Principal, qu'il considère comme un organe vital du Dieu-Moteur.",
          "Prêche que les pannes sont des punitions divines - une doctrine qu'il n'a plus besoin de chuchoter, puisque le Clergé du Sang Noir dirige la cité au grand jour.",
          "Rêve de siéger un jour aux côtés du Grand Raffineur (voir Grande Raffinerie)."
        ]
      },
      "le mur d'enceinte & les portes": {
        "nom": "Le Mur d'Enceinte & Les Portes",
        "description": "Une ligne de tranchées remplies de pétrole, prêtes à être enflammées à la moindre attaque de pillards.",
        "personnages": [
          {
            "nom": "Orok Lame",
            "role": "Capitaine de la Garde",
            "traits": [
              "Commande la défense à Le Mur d'Enceinte & Les Portes.",
              "Vétéran impitoyable de la dernière guerre.",
              "Ne laisse entrer personne dans Cité du Carburant - \"Les Raffineurs\" sans pot-de-vin."
            ]
          },
          {
            "nom": "Ronan Sel",
            "role": "Tireur d'Élite",
            "traits": [
              "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
              "A perdu sa famille à l'extérieur des murs.",
              "Son fusil est son seul ami dans Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Vex Rouge",
            "role": "Contrebandier",
            "traits": [
              "Fait officiellement passer des biens par Le Mur d'Enceinte & Les Portes, un commerce toléré tant qu'il verse sa part aux gardes.",
              "En réalité, c'est lui qui déclenche depuis trois cycles les incendies criminels qui frappent les derricks, payé en secret par une cité rivale désireuse de faire grimper le prix du carburant sur le marché inter-cités.",
              "Connaît les failles de la sécurité mieux que quiconque — logique, puisqu'il les a lui-même repérées pour préparer chaque sabotage."
            ]
          }
        ],
        "points": [
          "Une ligne de tranchées remplies de pétrole, prêtes à être enflammées à la moindre attaque de pillards.",
          "Orok Lame (Capitaine de la Garde)",
          "Commande la défense à Le Mur d'Enceinte & Les Portes.",
          "Vétéran impitoyable de la dernière guerre.",
          "Ne laisse entrer personne dans Cité du Carburant - \"Les Raffineurs\" sans pot-de-vin.",
          "Ronan Sel (Tireur d'Élite)",
          "Surveille les horizons depuis Le Mur d'Enceinte & Les Portes.",
          "A perdu sa famille à l'extérieur des murs.",
          "Son fusil est son seul ami dans Cité du Carburant - \"Les Raffineurs\".",
          "Vex Rouge (Contrebandier)",
          "Fait officiellement passer des biens par Le Mur d'Enceinte & Les Portes, un commerce toléré tant qu'il verse sa part aux gardes.",
          "En réalité, c'est lui qui déclenche depuis trois cycles les incendies criminels qui frappent les derricks, payé en secret par une cité rivale désireuse de faire grimper le prix du carburant sur le marché inter-cités.",
          "Connaît les failles de la sécurité mieux que quiconque — logique, puisqu'il les a lui-même repérées pour préparer chaque sabotage."
        ]
      },
      "le quartier résidentiel / les taudis": {
        "nom": "Le Quartier Résidentiel / Les Taudis",
        "description": "Des campements de tentes poisseuses au milieu des flaques d'hydrocarbures. Une simple étincelle peut raser un quartier entier.",
        "personnages": [
          {
            "nom": "Tala Sable",
            "role": "Leader Communautaire",
            "traits": [
              "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
              "Organise des soupes populaires.",
              "S'oppose souvent aux dirigeants de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Tala Sel",
            "role": "Médecin Clandestin",
            "traits": [
              "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
              "Utilise des remèdes expérimentaux non approuvés.",
              "Protégé par les gangs locaux de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Talin Rouge",
            "role": "Survivant Désespéré",
            "traits": [
              "Respire volontairement les vapeurs des raffineries à pleins poumons, en riant.",
              "Voit des flammes danser sur les visages des passants, même en plein jour.",
              "Prédit que Cité du Carburant - \"Les Raffineurs\" s'embrasera de l'intérieur, consumée par sa propre richesse.",
              "[MJ - PROPHÉTIE LITTÉRALE, SECRET DE CAMPAGNE : elle est déjà en cours. Les incendies de Vex Rouge (voir Le Mur d'Enceinte) sont la moitié visible de l'embrasement - l'autre moitié est religieuse. Le Clergé du Sang Noir, incapable d'admettre une cause aussi profane qu'un sabotage commercial, y voit la colère du Dieu-Moteur et pourrait dériver vers des réponses de plus en plus extrêmes (purges, boucs émissaires, offrandes) à mesure que les incendies se poursuivent. La cité risque de se consumer deux fois : par le feu de Vex Rouge, et par le fanatisme qu'il attise sans le vouloir chez ceux qui refusent d'y voir autre chose qu'un signe divin.]"
            ]
          }
        ],
        "points": [
          "Des campements de tentes poisseuses au milieu des flaques d'hydrocarbures. Une simple étincelle peut raser un quartier entier.",
          "Tala Sable (Leader Communautaire)",
          "Tente de maintenir l'ordre dans Le Quartier Résidentiel / Les Taudis.",
          "Organise des soupes populaires.",
          "S'oppose souvent aux dirigeants de Cité du Carburant - \"Les Raffineurs\".",
          "Tala Sel (Médecin Clandestin)",
          "Soigne les exclus de Le Quartier Résidentiel / Les Taudis.",
          "Utilise des remèdes expérimentaux non approuvés.",
          "Protégé par les gangs locaux de Cité du Carburant - \"Les Raffineurs\".",
          "Talin Rouge (Survivant Désespéré)",
          "Respire volontairement les vapeurs des raffineries à pleins poumons, en riant.",
          "Voit des flammes danser sur les visages des passants, même en plein jour.",
          "Prédit que Cité du Carburant - \"Les Raffineurs\" s'embrasera de l'intérieur, consumée par sa propre richesse.",
          "[MJ - PROPHÉTIE LITTÉRALE, SECRET DE CAMPAGNE : elle est déjà en cours. Les incendies de Vex Rouge (voir Le Mur d'Enceinte) sont la moitié visible de l'embrasement - l'autre moitié est religieuse. Le Clergé du Sang Noir, incapable d'admettre une cause aussi profane qu'un sabotage commercial, y voit la colère du Dieu-Moteur et pourrait dériver vers des réponses de plus en plus extrêmes (purges, boucs émissaires, offrandes) à mesure que les incendies se poursuivent. La cité risque de se consumer deux fois : par le feu de Vex Rouge, et par le fanatisme qu'il attise sans le vouloir chez ceux qui refusent d'y voir autre chose qu'un signe divin.]"
        ]
      },
      "grande raffinerie [siège du clergé du sang noir]": {
        "nom": "Grande Raffinerie [siège du Clergé du Sang Noir]",
        "description": "Un enchevêtrement de tuyaux et de cheminées crachant du feu, aménagé en sanctuaire à ciel ouvert. C'est le cœur économique et religieux de la cité.",
        "personnages": [
          {
            "nom": "Osk Sang",
            "role": "Le Grand Raffineur, chef du Clergé du Sang Noir",
            "traits": [
              "Dirige la cité depuis Grande Raffinerie, à la fois autorité technique suprême et plus haute figure religieuse du culte du Dieu-Moteur.",
              "Préside personnellement les grandes purifications - la transformation du brut en carburant, célébrée comme une communion.",
              "Ignore, comme la quasi-totalité de son propre Clergé, la véritable origine de la cité (voir \"LES ORIGINES CACHÉES : L'HÉRITAGE DE FAIRE SURVIVRE\") - il croit sincèrement diriger une théocratie ancienne, pas un mensonge de survie devenu vérité par la force de l'habitude.",
              "Face aux incendies de Vex Rouge, penche de plus en plus vers une lecture religieuse de la crise plutôt qu'une enquête profane - une dérive que peu de PJ verront venir avant qu'il ne soit trop tard."
            ]
          },
          {
            "nom": "Jax Sombre",
            "role": "Spécialiste Pétrolier",
            "traits": [
              "S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\".",
              "Considère Grande Raffinerie comme son propre royaume."
            ]
          },
          {
            "nom": "Elara Vif",
            "role": "Ouvrier / Garde Pétrolier",
            "traits": [
              "A survécu à une explosion massive à Grande Raffinerie.",
              "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
            ]
          }
        ],
        "points": [
          "Un enchevêtrement de tuyaux et de cheminées crachant du feu, aménagé en sanctuaire à ciel ouvert. C'est le cœur économique et religieux de la cité.",
          "Osk Sang (Le Grand Raffineur, chef du Clergé du Sang Noir)",
          "Dirige la cité depuis Grande Raffinerie, à la fois autorité technique suprême et plus haute figure religieuse du culte du Dieu-Moteur.",
          "Préside personnellement les grandes purifications - la transformation du brut en carburant, célébrée comme une communion.",
          "Ignore, comme la quasi-totalité de son propre Clergé, la véritable origine de la cité (voir \"LES ORIGINES CACHÉES : L'HÉRITAGE DE FAIRE SURVIVRE\") - il croit sincèrement diriger une théocratie ancienne, pas un mensonge de survie devenu vérité par la force de l'habitude.",
          "Face aux incendies de Vex Rouge, penche de plus en plus vers une lecture religieuse de la crise plutôt qu'une enquête profane - une dérive que peu de PJ verront venir avant qu'il ne soit trop tard.",
          "Jax Sombre (Spécialiste Pétrolier)",
          "S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\".",
          "Considère Grande Raffinerie comme son propre royaume.",
          "Elara Vif (Ouvrier / Garde Pétrolier)",
          "A survécu à une explosion massive à Grande Raffinerie.",
          "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
        ]
      },
      "dépôt de carburant haute sécurité": {
        "nom": "Dépôt de Carburant Haute Sécurité",
        "description": "Des citernes souterraines gardées par des snipers, constituant la plus grande richesse du monde connu - et son plus grand reliquaire.",
        "personnages": [
          {
            "nom": "Joran Lame",
            "role": "Cardinal-Raffineur, Gardien du Reliquaire",
            "traits": [
              "Administre les réserves sacrées de Dépôt de Carburant Haute Sécurité comme un trésor à la fois stratégique et divin.",
              "Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Sia Noir",
            "role": "Spécialiste Pétrolier",
            "traits": [
              "S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\".",
              "Considère Dépôt de Carburant Haute Sécurité comme son propre royaume."
            ]
          },
          {
            "nom": "Sura Rouage",
            "role": "Ouvrier / Garde Pétrolier",
            "traits": [
              "A survécu à une explosion massive à Dépôt de Carburant Haute Sécurité.",
              "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
            ]
          }
        ],
        "points": [
          "Des citernes souterraines gardées par des snipers, constituant la plus grande richesse du monde connu - et son plus grand reliquaire.",
          "Joran Lame (Cardinal-Raffineur, Gardien du Reliquaire)",
          "Administre les réserves sacrées de Dépôt de Carburant Haute Sécurité comme un trésor à la fois stratégique et divin.",
          "Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\".",
          "Sia Noir (Spécialiste Pétrolier)",
          "S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\".",
          "Considère Dépôt de Carburant Haute Sécurité comme son propre royaume.",
          "Sura Rouage (Ouvrier / Garde Pétrolier)",
          "A survécu à une explosion massive à Dépôt de Carburant Haute Sécurité.",
          "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
        ]
      },
      "puits d'extraction principal": {
        "nom": "Puits d'Extraction Principal",
        "description": "Des derricks rouillés qui pompent inlassablement les ultimes réserves d'or noir - la \"saignée\" originelle, la plus ancienne et la plus sacrée de toutes.",
        "personnages": [
          {
            "nom": "Ryn Rouage",
            "role": "Cardinal-Raffineur, Officiant de la Saignée",
            "traits": [
              "Préside les rites d'extraction à Puits d'Extraction Principal, considérés comme la forme la plus pure de communion avec le Dieu-Moteur.",
              "Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Jorn Rouage",
            "role": "Spécialiste Pétrolier",
            "traits": [
              "S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\".",
              "Considère Puits d'Extraction Principal comme son propre royaume."
            ]
          },
          {
            "nom": "Jax Ferraille",
            "role": "Ouvrier / Garde Pétrolier",
            "traits": [
              "A survécu à une explosion massive à Puits d'Extraction Principal.",
              "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
            ]
          }
        ],
        "points": [
          "Des derricks rouillés qui pompent inlassablement les ultimes réserves d'or noir - la \"saignée\" originelle, la plus ancienne et la plus sacrée de toutes.",
          "Ryn Rouage (Cardinal-Raffineur, Officiant de la Saignée)",
          "Préside les rites d'extraction à Puits d'Extraction Principal, considérés comme la forme la plus pure de communion avec le Dieu-Moteur.",
          "Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\".",
          "Jorn Rouage (Spécialiste Pétrolier)",
          "S'enrichit sur le marché noir du carburant de Cité du Carburant - \"Les Raffineurs\".",
          "Considère Puits d'Extraction Principal comme son propre royaume.",
          "Jax Ferraille (Ouvrier / Garde Pétrolier)",
          "A survécu à une explosion massive à Puits d'Extraction Principal.",
          "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
        ]
      },
      "garage des convois lourds": {
        "nom": "Garage des Convois Lourds",
        "description": "Un hangar géant sentant l'huile chaude, où les célèbres camions-citernes de la cité sont entretenus.",
        "personnages": [
          {
            "nom": "Nova Sang",
            "role": "Maîtresse des Convois",
            "traits": [
              "Bénit chaque camion-citerne avant son départ, une goutte de Sang Noir versée sur le capot selon le rite.",
              "Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\"."
            ]
          },
          {
            "nom": "Ines Sable",
            "role": "Mécanicienne-Officiante",
            "traits": [
              "Entretient les moteurs avec la même rigueur qu'un rite religieux au Garage des Convois Lourds.",
              "Considère Garage des Convois Lourds comme son propre royaume."
            ]
          },
          {
            "nom": "Ryn Acier",
            "role": "Ouvrier / Garde des Convois",
            "traits": [
              "Escorte les convois hors des murs de Cité du Carburant - \"Les Raffineurs\".",
              "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
            ]
          }
        ],
        "points": [
          "Un hangar géant sentant l'huile chaude, où les célèbres camions-citernes de la cité sont entretenus.",
          "Nova Sang (Maîtresse des Convois)",
          "Bénit chaque camion-citerne avant son départ, une goutte de Sang Noir versée sur le capot selon le rite.",
          "Totalement loyal envers les idéaux de Cité du Carburant - \"Les Raffineurs\".",
          "Ines Sable (Mécanicienne-Officiante)",
          "Entretient les moteurs avec la même rigueur qu'un rite religieux au Garage des Convois Lourds.",
          "Considère Garage des Convois Lourds comme son propre royaume.",
          "Ryn Acier (Ouvrier / Garde des Convois)",
          "Escorte les convois hors des murs de Cité du Carburant - \"Les Raffineurs\".",
          "Connaît les secrets les plus sombres de Cité du Carburant - \"Les Raffineurs\"."
        ]
      }
    }
  }
}
};

// ─── Acces ────────────────────────────────────────────────────────────────

/**
 * Rend la fiche de lore d'une cite, ou null.
 *
 * La correspondance est volontairement souple : le nom en base peut etre
 * « CITÉ INDUSTRIELLE - "LES FORGERONS D'ACIER" » ou « Cité Industrielle ».
 * On compare sur les slugs normalises, puis par inclusion.
 */
export function getCityLore(cityName) {
  if (!cityName) return null;
  const norm = (s) =>
    String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/["']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  const cible = norm(cityName);

  // 1. correspondance exacte sur la cle
  if (loreData.cities[cible]) return loreData.cities[cible];

  // 2. correspondance par inclusion, dans les deux sens
  for (const [slug, fiche] of Object.entries(loreData.cities)) {
    const s = norm(slug);
    const n = norm(fiche.name);
    if (n === cible || cible.includes(s) || s.includes(cible)) return fiche;
  }
  for (const fiche of Object.values(loreData.cities)) {
    if (norm(fiche.name).includes(cible)) return fiche;
  }
  return null;
}

/**
 * Rend les points de lore d'un lieu, sous forme de tableau de chaines.
 * Rend null si la cite ou le lieu est introuvable.
 *
 * Compatible avec l'ancien appel : le tableau commence par la description,
 * puis alterne « Nom (Role) » et les attributs du personnage.
 */
export function getBuildingLore(cityName, buildingName) {
  const city = getCityLore(cityName);
  if (!city || !buildingName) return null;
  const cible = String(buildingName).toLowerCase().trim();
  for (const [cle, lieu] of Object.entries(city.buildings)) {
    if (cle === cible || cle.includes(cible) || cible.includes(cle)) {
      return lieu.points;
    }
  }
  return null;
}

/**
 * Rend la fiche complete d'un lieu (description + PNJ structures), ou null.
 * C'est l'acces prefere quand on veut afficher autre chose qu'une liste.
 */
export function getBuilding(cityName, buildingName) {
  const city = getCityLore(cityName);
  if (!city || !buildingName) return null;
  const cible = String(buildingName).toLowerCase().trim();
  for (const [cle, lieu] of Object.entries(city.buildings)) {
    if (cle === cible || cle.includes(cible) || cible.includes(cle)) return lieu;
  }
  return null;
}

/** Les dix cites, dans l'ordre du lore. */
export function getCities() {
  return Object.values(loreData.cities).sort((a, b) => Number(a.num) - Number(b.num));
}
