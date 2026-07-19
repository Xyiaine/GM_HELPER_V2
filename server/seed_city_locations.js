const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding new city locations (buildings/districts)...');

  // 1. Get the Campaign
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.error("Campaign not found. Please run seed_lore.js first.");
    process.exit(1);
  }

  // 2. Define the generic locations
  const genericLocations = [
    "Le Marché d'Échanges",
    "La Citerne Centrale",
    "Le Générateur Principal",
    "Le Mur d'Enceinte & Les Portes",
    "Le Quartier Résidentiel / Les Taudis"
  ];

  // 3. Define the specialized locations per city keyword
  const specializedMap = {
    'Médicale': [
      "Laboratoire de Virologie",
      "Clinique d'Amélioration Cybernétique",
      "Usine de Synthèse de Médicaments",
      "Unité de Quarantaine Sévère"
    ],
    'Carburant': [
      "Grande Raffinerie",
      "Dépôt de Carburant Haute Sécurité",
      "Puits d'Extraction Principal",
      "Garage des Convois Lourds"
    ],
    'Industrielle': [
      "Fonderie Colossale",
      "Ligne d'Assemblage de Véhicules",
      "Atelier des Pièces Détachées",
      "Dépôt de Ferraille"
    ],
    'Eau': [
      "Serres Hydroponiques Blindées",
      "Station de Filtration",
      "Élevage de Bétail Mutant",
      "Réserve de Semences Pré-Apocalypse"
    ],
    'Divertissement': [
      "Grande Arène de Combat",
      "Studios de Radiodiffusion",
      "Casino de la Ruine",
      "Théâtre des Illusions"
    ],
    'Nuke': [
      "Cœur du Réacteur Nucléaire",
      "Zone de Refroidissement Irradiée",
      "Centre de Recherche sur l'Énergie",
      "Dépôt de Déchets Toxiques"
    ],
    'Métaux': [
      "Mine Profonde",
      "Usine de Recyclage",
      "Cimetière des Gratte-Ciels",
      "Marché aux Alliages Rares"
    ],
    'Armement': [
      "Usine de Fabrication d'Armes",
      "Laboratoire des Explosifs",
      "Caserne d'Entraînement des Milices",
      "Dépôt d'Armes Lourdes"
    ],
    'Anciens': [
      "Centre de Données Pré-Guerre",
      "Complexe Agricole Automatisé",
      "Hôpital Miraculeux",
      "Centre de Commandement Tactique"
    ],
    'Oméga': [
      "Noyau de l'Intelligence Artificielle",
      "Ateliers de Drones Autonomes",
      "Laboratoire de Biologie Avancée",
      "Centre de Télécommunications Globales"
    ]
  };

  // 4. Fetch the 10 cities
  const cityLocations = await prisma.location.findMany({
    where: {
      campaignId: campaign.id,
      type: 'city'
    }
  });

  if (cityLocations.length === 0) {
    console.error("No cities found in this campaign.");
    process.exit(1);
  }

  // 5. Insert locations for each city
  let totalCreated = 0;

  for (const city of cityLocations) {
    let keyToMatch = null;
    for (const key of Object.keys(specializedMap)) {
      if (city.name.includes(key)) {
        keyToMatch = key;
        break;
      }
    }

    if (!keyToMatch) {
      console.warn(`Could not find specialized map for city: ${city.name}`);
      continue;
    }

    const locationsToCreate = [
      ...genericLocations,
      ...specializedMap[keyToMatch]
    ];

    console.log(`Populating 9 locations for: ${city.name}`);

    for (const locName of locationsToCreate) {
      // Create each as a "building" under this city
      await prisma.location.create({
        data: {
          campaignId: campaign.id,
          parentLocationId: city.id,
          name: locName,
          type: 'building'
        }
      });
      totalCreated++;
    }
  }

  console.log(`Successfully created ${totalCreated} child locations!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
