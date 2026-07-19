const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const loreData = {
  "BUNKER OMÉGA": {
    "Le Marché d'Échanges": "Un réseau de couloirs souterrains éclairés au néon blafard, où les survivants troquent des composants électroniques rares contre des rations. L'air y est recyclé et l'écho des murmures se répercute sur l'acier rouillé.",
    "La Citerne Centrale": "Une immense cuve d'eau purifiée enfouie sous la roche, gardée 24h/24 par des cyborgs. L'eau y est cristalline, un luxe inestimable dans ce monde de cendres.",
    "Le Générateur Principal": "Le cœur nucléaire du bunker. Une salle gigantesque saturée du bourdonnement constant des turbines. La chaleur y est oppressante et la lumière d'un bleu artificiel.",
    "Le Mur d'Enceinte & Les Portes": "De massives portes blindées en titane, capables de résister à une explosion atomique. L'entrée est camouflée dans la montagne et surveillée par des tourelles automatisées.",
    "Le Quartier Résidentiel / Les Taudis": "Des niveaux inférieurs étroits où la majorité de la population s'entasse dans des modules d'habitation standardisés, sous la lueur de néons grésillants.",
    "Noyau de l'Intelligence Artificielle": "Un sanctuaire glacé où trônent les banques mémorielles d'une IA d'avant-guerre. Des câbles courent partout comme un réseau neuronal mécanique.",
    "Ateliers de Drones Autonomes": "Des chaînes d'assemblage immaculées où des bras robotiques assemblent inlassablement des drones de surveillance. L'odeur d'ozone et d'huile chaude y est omniprésente.",
    "Laboratoire de Biologie Avancée": "Des salles blanches isolées où des scientifiques modifient génétiquement des plantes et expérimentent sur l'optimisation humaine à l'abri des regards.",
    "Centre de Télécommunications Globales": "Une salle tapissée d'écrans affichant des parasites, avec des opérateurs essayant de capter les signaux d'autres survivants à travers le monde."
  },
  "CITÉ INDUSTRIELLE": {
    "Le Marché d'Échanges": "Une place boueuse entourée de carcasses de camions. On y négocie des pièces de moteurs, de la tôle et des outils couverts de cambouis dans un vacarme assourdissant.",
    "La Citerne Centrale": "Un réservoir extérieur en métal corrodé, d'où coule une eau au goût métallique. De grandes pompes à vapeur s'activent pour la filtrer en permanence.",
    "Le Générateur Principal": "Une centrale à charbon et au pétrole crachant d'épaisses fumées noires. Le sol vibre au rythme des pistons gigantesques.",
    "Le Mur d'Enceinte & Les Portes": "Une barricade faite de véhicules empilés et de poutrelles soudées, hérissée de piques métalliques et de lance-flammes artisanaux.",
    "Le Quartier Résidentiel / Les Taudis": "Un enchevêtrement de tentes et de cabanes en tôle ondulée sous un nuage constant de smog toxique. La toux des habitants résonne jour et nuit.",
    "Hauts-Fourneaux": "Une mer de métal en fusion éclairant la nuit d'une lueur rougeoyante. La chaleur y est mortelle et les ouvriers portent d'épaisses combinaisons ignifugées.",
    "Lignes d'Assemblage Mécanique": "Un labyrinthe de tapis roulants et de chaînes où des centaines de forgerons assemblent des véhicules blindés de manière rudimentaire mais efficace.",
    "Décharge de Pièces Détachées": "Une montagne de métal rouillé s'étendant à perte de vue. Des pilleurs de ferraille s'y aventurent pour trouver la perle rare, risquant leur vie sous les éboulements.",
    "Fosse des Combats Ouvriers": "Une arène improvisée au milieu des usines où les travailleurs règlent leurs différends et parient leurs rations dans des combats sanglants à la clé anglaise."
  },
  "CITÉ MÉDICALE": {
    "Le Marché d'Échanges": "Des tentes chirurgicales de fortune où l'on troque antibiotiques, bandages et organes synthétiques. L'odeur d'antiseptique masque mal celle du sang.",
    "La Citerne Centrale": "Un système de filtration ultra-moderne hérité des anciens hôpitaux. L'eau y est distribuée sous contrôle médical strict pour éviter les épidémies.",
    "Le Générateur Principal": "Une série de générateurs de secours d'anciens blocs opératoires, maintenus en état de marche par des ingénieurs méticuleux pour garantir le froid des morgues.",
    "Le Mur d'Enceinte & Les Portes": "De hautes parois lisses et stériles, avec des sas de décontamination obligatoire à l'entrée. Des gardes en tenue Hazmat veillent au grain.",
    "Le Quartier Résidentiel / Les Taudis": "D'anciens services de pédiatrie et de gériatrie reconvertis en dortoirs surpeuplés. Des lits d'hôpitaux s'alignent dans de longs couloirs froids.",
    "Hôpital Principal": "Une gigantesque tour de verre et d'acier, à moitié détruite, abritant les médecins de l'élite et le matériel chirurgical le plus rare.",
    "Serres Hydroponiques Médicinales": "Des dômes vitrés où poussent des plantes médicinales mutantes à la croissance accélérée, baignées d'une lumière UV violacée.",
    "Quarantaine des Mutants": "Un secteur condamné où sont parqués les cas d'irradiation sévère et les mutations incontrôlables. Les hurlements y sont constants.",
    "Dépôt Pharmaceutique": "Un coffre-fort colossal renfermant les dernières réserves de vaccins et de stimulants du monde. La zone est plus gardée qu'une armurerie."
  },
  "CITÉ DE L'ARMEMENT & DÉFENSE": {
    "Le Marché d'Échanges": "Un bazar organisé avec une rigueur militaire. On n'y trouve que des munitions, des armes à feu rafistolées et des gilets pare-balles usés.",
    "La Citerne Centrale": "Un réservoir tactique bunkerisé, dont l'eau est traitée comme une ressource militaire stratégique. Rations d'eau au compte-gouttes pour les civils.",
    "Le Générateur Principal": "Un réacteur militaire récupéré sur un ancien porte-avions échoué, alimentant la cité avec une fiabilité brutale.",
    "Le Mur d'Enceinte & Les Portes": "Une forteresse de béton armé, de barbelés et de miradors lourdement armés. La porte principale est un sas de char d'assaut géant.",
    "Le Quartier Résidentiel / Les Taudis": "Des casernes disciplinaires où règnent l'ordre et la peur. La loi martiale y est appliquée à la lettre, le moindre vol est puni de mort.",
    "Usine d'Armement Lourd": "Une usine retentissant des martèlements de forges fabriquant obus et mitrailleuses lourdes dans une cadence effrénée.",
    "Polygone de Tir": "Un désert d'impacts où les nouvelles recrues s'entraînent sans relâche. Les cibles sont souvent de vieux véhicules, parfois des prisonniers.",
    "Casernes des Miliciens": "Un complexe rigide où s'entraîne la garde d'élite, prônant la supériorité par la discipline et le feu.",
    "Bunker de Commandement": "Une salle d'opérations enfouie, couverte de cartes stratégiques et de radios hurlant des rapports de patrouilles extérieures."
  },
  "CITÉ DE L'EAU & ALIMENTATION": {
    "Le Marché d'Échanges": "Un marché flottant ou entouré de canaux, où les denrées fraîches (poissons, légumes hydratés) sont la monnaie d'échange la plus précieuse.",
    "La Citerne Centrale": "Le cœur battant de la ville : une colossale retenue d'eau issue du Nil, filtrée par des sables et des charbons actifs. Un véritable oasis.",
    "Le Générateur Principal": "Un barrage hydraulique restauré avec des turbines artisanales exploitant la force du courant d'un fleuve partiellement asséché.",
    "Le Mur d'Enceinte & Les Portes": "D'imposantes digues de terre et de pierre protégeant la ville des tempêtes de sable et des pillards assoiffés.",
    "Le Quartier Résidentiel / Les Taudis": "Des habitations sur pilotis et des barges amarrées le long des canaux boueux, où l'humidité constante attire moustiques et maladies.",
    "Station d'Épuration Géante": "Un réseau de bassins où l'eau saumâtre est purifiée par des méthodes alchimiques et biologiques précieusement gardées.",
    "Champs de Culture Intérieurs": "Des terrasses verdoyantes irriguées en continu, une vision de paradis vert tranchant avec les terres dévastées alentour.",
    "Docks sur le Fleuve": "Des quais de bois pourris où s'amarrent des navires marchands rafistolés, prêts à transporter l'eau vers d'autres cités moyennant fortune.",
    "Réservoir des Élites": "Une oasis privée luxuriante, réservée aux dirigeants de la Cité, avec fontaines et piscines, un blasphème dans ce monde aride."
  },
  "CITÉ DES MÉTAUX & RECYCLAGE": {
    "Le Marché d'Échanges": "Un étalage chaotique de reliques déterrées : circuits imprimés, moteurs à combustion, bijoux en or fondu. C'est le paradis des bricoleurs.",
    "La Citerne Centrale": "Un cratère aménagé récoltant l'eau de pluie et la rosée nocturne via d'immenses toiles de récupération tendues dans le ciel.",
    "Le Générateur Principal": "Une pile de générateurs disparates interconnectés par des câbles bricolés, menaçant d'exploser à tout instant mais produisant énormément d'énergie.",
    "Le Mur d'Enceinte & Les Portes": "Un amoncellement de carcasses de navires de charge empilées pour former un mur de rouille impénétrable.",
    "Le Quartier Résidentiel / Les Taudis": "Des maisons construites à l'intérieur de vieux conteneurs maritimes empilés les uns sur les autres, formant des ruelles verticales vertigineuses.",
    "Décharge de l'Ancien Monde": "Un gouffre gigantesque rempli d'appareils de l'ancien temps. Des grues artisanales descendent les ferrailleurs dans ses profondeurs.",
    "Fonderie des Recyclés": "D'énormes creusets où fondent l'acier, le cuivre et le plomb sous une chaleur terrifiante, empestant le métal brûlé.",
    "Puits de Mine de Métal": "D'anciennes carrières où l'on ne mine pas de minerais, mais d'anciennes infrastructures souterraines pour en arracher les poutres d'acier.",
    "Marché Noir des Reliques": "Une ruelle sombre où se vendent sous le manteau des artefacts d'avant-guerre fonctionnels (ordinateurs, armes à plasma, disques durs)."
  },
  "CITÉ DU CARBURANT": {
    "Le Marché d'Échanges": "Une rue éclairée aux torches où l'odeur d'essence prend à la gorge. On y échange des barils de brut et du carburant synthétique contre la vie.",
    "La Citerne Centrale": "Plutôt que de l'eau, cette cuve contient du carburant brut. L'eau est extrêmement rare ici et s'échange au prix de l'or noir.",
    "Le Générateur Principal": "Une série d'énormes moteurs diesel hurlants qui alimentent les pompes d'extraction, crachant des flammes et une fumée épaisse.",
    "Le Mur d'Enceinte & Les Portes": "Une ligne de tranchées remplies de pétrole, prêtes à être enflammées à la moindre attaque de pillards.",
    "Le Quartier Résidentiel / Les Taudis": "Des campements de tentes poisseuses au milieu des flaques d'hydrocarbures. Une simple étincelle peut raser un quartier entier.",
    "Raffinerie Principale": "Un enchevêtrement de tuyaux, de cuves sous pression et de cheminées crachant du feu. C'est le cœur économique de la cité.",
    "Puits de Pétrole": "Des derricks rouillés qui pompent inlassablement les ultimes réserves d'or noir des profondeurs de la terre brûlée.",
    "Dépôt de Carburant": "Le lieu le plus sécurisé de la ville : des citernes souterraines gardées par des snipers, constituant la plus grande richesse du monde connu.",
    "Zone Inflammable (Taudis)": "Un secteur de la ville particulièrement toxique où le gaz s'échappe des canalisations fissurées. Les habitants portent des masques à gaz usagés en permanence."
  },
  "CITÉ DU DIVERTISSEMENT": {
    "Le Marché d'Échanges": "Des allées colorées de néons rafistolés où l'on vend de la drogue de synthèse, de l'alcool de contrebande et des services divers. La musique y hurle sans fin.",
    "La Citerne Centrale": "Une ancienne fontaine publique, aujourd'hui monumentale, distribuant de l'eau aromatisée chimiquement aux habitants pour masquer le goût des cendres.",
    "Le Générateur Principal": "Des éoliennes et des générateurs à pédales actionnés par des esclaves pour fournir le courant nécessaire à l'éclairage de l'arène.",
    "Le Mur d'Enceinte & Les Portes": "D'anciens murs de marbre, recouverts de graffitis et de panneaux publicitaires post-apocalyptiques racolant pour des combats de gladiateurs.",
    "Le Quartier Résidentiel / Les Taudis": "D'anciens théâtres et hôtels de luxe, aujourd'hui délabrés, où les spectateurs fauchés dorment à même le sol dans l'odeur de la sueur et de l'alcool.",
    "L'Arène Centrale": "Un colisée gargantuesque où des combattants en armures de récupération s'entretuent dans un vacarme de moteurs et de cris pour divertir les masses.",
    "Les Casinos Clandestins": "Des salles sombres remplies de tables de jeu improvisées où des seigneurs de guerre viennent miser des cargaisons entières de carburant.",
    "Quartier des Plaisirs": "Un labyrinthe de bordels et de fumeries où l'on oublie la dureté du monde post-apocalyptique l'espace de quelques heures.",
    "Piste de Course de Véhicules": "Un circuit mortel tracé dans les ruines de la ville, où des véhicules lourdement armés s'affrontent dans des courses sans règles."
  },
  "L'ILE DES ANCIENS": {
    "Le Marché d'Échanges": "Un bazar étrangement calme, organisé sur des quais en pierre blanche. On y échange des connaissances et des micro-puces pré-guerre.",
    "La Citerne Centrale": "Une usine de dessalinisation silencieuse, produisant une eau pure sans aucun effort apparent, grâce à une technologie oubliée.",
    "Le Générateur Principal": "Une mystérieuse sphère bourdonnante émettant une douce lumière bleue, d'origine inconnue, qui alimente toute l'île sans jamais faiblir.",
    "Le Mur d'Enceinte & Les Portes": "L'océan tumultueux et une série de champs de force électromagnétiques discrets qui détruisent tout navire non autorisé approchant des côtes.",
    "Le Quartier Résidentiel / Les Taudis": "Des habitations utopiques, lisses et blanches, mais étrangement désertes, comme si la population avait mystérieusement disparu des décennies plus tôt.",
    "Archives Holographiques": "Une immense bibliothèque de données où l'histoire du monde avant les bombes est stockée. Des hologrammes vacillants hantent les couloirs.",
    "Centre de Recherche Océanographique": "Des laboratoires inondés menant aux profondeurs, étudiant d'étranges créatures marines mutées par les radiations.",
    "Quai Sous-Marin": "Une baie d'amarrage dissimulée abritant quelques sous-marins rouillés mais fonctionnels, le seul moyen de transport pour quitter l'île sans être repéré.",
    "Musée des Reliques Intactes": "Un dôme préservant des objets banals de l'Ancien Monde (voitures intactes, vêtements, œuvres d'art) considérés comme divins par les habitants."
  },
  "NUKE CITY": {
    "Le Marché d'Échanges": "Des souterrains irradiés où les marchands, lourdement mutés, portent des combinaisons en plomb. L'iode et les compteurs Geiger sont les monnaies d'échange.",
    "La Citerne Centrale": "Un puits profond puisant dans une nappe phréatique contaminée. L'eau doit être distillée trois fois pour ne pas être mortellement toxique.",
    "Le Générateur Principal": "Le réacteur éventré d'une ancienne centrale. Il émet une douce lumière verte, vénéré par une secte locale connue sous le nom des Enfants de l'Atome.",
    "Le Mur d'Enceinte & Les Portes": "Il n'y a pas de mur. La zone est tellement irradiée que seuls les fous ou les mutants natifs osent s'y aventurer sans protection lourde.",
    "Le Quartier Résidentiel / Les Taudis": "Des grottes creusées à même le cratère vitrifié, éclairées par des champignons fluorescents et la lueur des radiations ambiantes.",
    "Cratère Émissif": "Le point d'impact direct de la bombe. Le sol y est une mer de verre fondu d'où émanent des vapeurs toxiques et mortelles.",
    "Bunkers de Plomb": "D'anciens abris anti-atomiques scellés, où certains habitants vivent sans jamais voir le jour de peur de s'irradier, devenant pâles et aveugles.",
    "Fosse des Mutants": "Une zone de quarantaine où les individus ayant subi des mutations trop extrêmes ou devenus fous sont abandonnés à leur sort.",
    "Laboratoire d'Étude des Radiations": "Un centre de recherche dirigé par des savants illuminés étudiant les effets des radiations sur le génome humain, espérant créer une nouvelle espèce."
  }
};

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) return console.log("Campaign not found");

  const cities = await prisma.location.findMany({
    where: { campaignId: campaign.id, type: { in: ['city', 'City-State'] } }
  });

  let updateCount = 0;

  for (const city of cities) {
    const cityLore = loreData[city.name];
    if (!cityLore) {
      console.log(`No lore data found for city: ${city.name}`);
      continue;
    }

    const subLocs = await prisma.location.findMany({
      where: { parentLocationId: city.id, type: 'Point of Interest' }
    });

    for (const subLoc of subLocs) {
      // The subLoc name in DB might be "BUNKER OMÉGA - Le Marché d'Échanges"
      // Let's strip the prefix to match the keys in loreData
      const pureNameMatch = subLoc.name.match(/ - (.*)$/);
      const pureName = pureNameMatch ? pureNameMatch[1] : subLoc.name;

      const desc = cityLore[pureName];
      if (desc) {
        await prisma.location.update({
          where: { id: subLoc.id },
          data: { description: desc }
        });
        updateCount++;
      } else {
        console.log(`No description found for sub-location: ${subLoc.name} (searched for ${pureName}) in city ${city.name}`);
      }
    }
  }

  console.log(`Successfully updated ${updateCount} sub-location descriptions in DB.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
