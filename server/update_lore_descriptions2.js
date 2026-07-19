const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fallbackLore = {
  "Fonderie Colossale": "Une mer de métal en fusion éclairant la nuit d'une lueur rougeoyante.",
  "Ligne d'Assemblage de Véhicules": "Un labyrinthe de tapis roulants et de chaînes où des centaines de forgerons assemblent des blindés.",
  "Atelier des Pièces Détachées": "Des hangars remplis d'étagères croulant sous le poids de pièces mécaniques recouvertes de cambouis.",
  "Dépôt de Ferraille": "Une montagne de métal rouillé s'étendant à perte de vue.",
  
  "Laboratoire de Virologie": "Des salles blanches hermétiques où des savants en combinaison étudient les souches de virus d'avant-guerre.",
  "Clinique d'Amélioration Cybernétique": "Des blocs opératoires clandestins spécialisés dans le remplacement de membres par des prothèses d'acier.",
  "Usine de Synthèse de Médicaments": "Des cuves immenses mélangeant des composés chimiques pour produire les antibiotiques vitaux de la région.",
  "Unité de Quarantaine Sévère": "Un secteur condamné où sont parqués les cas d'irradiation sévère et les mutations incontrôlables.",

  "Usine de Fabrication d'Armes": "Une usine retentissant des martèlements de forges fabriquant obus et mitrailleuses.",
  "Laboratoire des Explosifs": "Des bunkers semi-enterrés où l'on teste de nouvelles formulations de poudre noire et de C4.",
  "Caserne d'Entraînement des Milices": "Un complexe rigide où s'entraîne la garde d'élite, prônant la supériorité par la discipline.",
  "Dépôt d'Armes Lourdes": "Un coffre-fort gigantesque contenant des tourelles anti-aériennes et des roquettes encore actives.",

  "Serres Hydroponiques Blindées": "Des dômes d'acier et de verre armé protégeant des cultures verdoyantes des tempêtes acides.",
  "Station de Filtration": "Un réseau de bassins où l'eau saumâtre est purifiée par des méthodes alchimiques.",
  "Élevage de Bétail Mutant": "D'immenses enclos boueux abritant des bœufs à deux têtes et autres bêtes massives.",
  "Réserve de Semences Pré-Apocalypse": "Un caveau maintenu à une température glaciale, contenant l'espoir de rebâtir la flore terrestre.",

  "Mine Profonde": "D'anciennes carrières où l'on arrache des poutres d'acier aux fondations des anciennes gratte-ciel.",
  "Usine de Recyclage": "Des presses hydrauliques colossales broyant des carcasses de voitures pour en faire des blocs compacts.",
  "Cimetière des Gratte-Ciels": "Une forêt de tours effondrées, domaine réservé aux pilleurs de ferraille agiles.",
  "Marché aux Alliages Rares": "Une zone hautement sécurisée où s'échangent titane, tungstène et composants d'aviation.",

  "Grande Raffinerie": "Un enchevêtrement de tuyaux et de cheminées crachant du feu. C'est le cœur économique de la cité.",
  "Dépôt de Carburant Haute Sécurité": "Des citernes souterraines gardées par des snipers, constituant la plus grande richesse du monde connu.",
  "Puits d'Extraction Principal": "Des derricks rouillés qui pompent inlassablement les ultimes réserves d'or noir.",
  "Garage des Convois Lourds": "Un hangar géant sentant l'huile chaude, où les célèbres camions-citernes de la cité sont entretenus.",

  "Grande Arène de Combat": "Un colisée gargantuesque où des combattants en armures s'entretuent dans un vacarme de moteurs.",
  "Studios de Radiodiffusion": "D'anciennes antennes remises en état, diffusant de la musique et de la propagande sur les ondes courtes.",
  "Casino de la Ruine": "Des salles sombres remplies de tables de jeu où les seigneurs de guerre misent des cargaisons de carburant.",
  "Théâtre des Illusions": "Un lieu de spectacle décadent utilisant d'anciens projecteurs holographiques pour créer des mirages.",

  "Centre de Données Pré-Guerre": "Une immense bibliothèque de données où l'histoire du monde avant les bombes est stockée.",
  "Complexe Agricole Automatisé": "Des champs gérés entièrement par des drones agricoles silencieux, sans la moindre intervention humaine.",
  "Hôpital Miraculeux": "Des robots chirurgiens d'une précision inouïe soignant les rares élus autorisés à fouler l'île.",
  "Centre de Commandement Tactique": "Une salle de guerre silencieuse scannée par des radars qui n'ont jamais cessé de fonctionner.",

  "Cœur du Réacteur Nucléaire": "Le réacteur éventré d'une ancienne centrale, émettant une douce lumière verte mortelle.",
  "Zone de Refroidissement Irradiée": "D'anciennes piscines d'eau lourde, désormais peuplées d'une flore bioluminescente.",
  "Centre de Recherche sur l'Énergie": "Un centre dirigé par des savants illuminés espérant canaliser l'atome de façon mystique.",
  "Dépôt de Déchets Toxiques": "Des fûts jaunes empilés et fuyants, transformant la zone en un marais caustique infranchissable."
};

async function main() {
  const subLocs = await prisma.location.findMany({
    where: { type: 'Point of Interest', description: { startsWith: 'Un lieu clé' } }
  });

  let updateCount = 0;

  for (const subLoc of subLocs) {
    const pureNameMatch = subLoc.name.match(/ - (.*)$/);
    const pureName = pureNameMatch ? pureNameMatch[1] : subLoc.name;

    const desc = fallbackLore[pureName];
    if (desc) {
      await prisma.location.update({
        where: { id: subLoc.id },
        data: { description: desc }
      });
      updateCount++;
    } else {
      console.log(`STILL no description for: ${subLoc.name} (${pureName})`);
    }
  }

  console.log(`Successfully updated ${updateCount} remaining sub-location descriptions in DB.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
