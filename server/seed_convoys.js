const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Seeding Convoys for 'La Course du Sel' ===");

  // Find Campaign
  let campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });
  if (!campaign) campaign = await prisma.campaign.findFirst();
  if (!campaign) {
    console.error("No campaign found!");
    process.exit(1);
  }

  // Fetch Cities
  const cities = await prisma.city.findMany({
    where: { location: { campaignId: campaign.id } },
    include: { location: true }
  });

  const getCity = (nameSubstring) => {
    return cities.find(c => c.location.name.toLowerCase().includes(nameSubstring.toLowerCase()));
  };

  const destCity = getCity("DIVERTISSEMENT");
  const fuelCity = getCity("CARBURANT") || destCity;
  const metalCity = getCity("MÉTAUX") || destCity;
  const foodCity = getCity("EAU") || destCity;
  const medCity = getCity("MÉDICALE") || destCity;
  const nukeCity = getCity("NUKE") || destCity;

  if (!destCity) {
    console.error("Destination city 'Cité du Divertissement' not found!");
    process.exit(1);
  }

  // Define 5 Convoys
  const convoyDefs = [
    {
      name: "Convoi 1 — Les Loups de Sel",
      originCityId: fuelCity.id,
      destinationCityId: destCity.id,
      status: "in_progress",
      difficulty: 65,
      cargoType: "resources",
      cargoDetails: "Précurseurs chimiques pour les Chem'Artistes. Chef : Doran Roka (antagoniste / rival de convoi).",
      fuel: 80,
      water: 60,
      food: 50,
      medicine: 40,
      ammo: 90,
      vehicles: [
        { name: "Le Molosse blindé (Véhicule de Doran Roka)", type: "truck", hpMax: 180, hpCurrent: 180, passengers: "Doran Roka, 4 garde-du-corps" },
        { name: "Scout léger Loup-1", type: "moto", hpMax: 60, hpCurrent: 60, passengers: "Éclaireur 1" },
        { name: "Scout léger Loup-2", type: "moto", hpMax: 60, hpCurrent: 60, passengers: "Éclaireur 2" }
      ]
    },
    {
      name: "Convoi 2 — Convoi 2 (Les PJ)",
      originCityId: metalCity.id,
      destinationCityId: destCity.id,
      status: "in_progress",
      difficulty: 50,
      cargoType: "mixed",
      cargoDetails: "Caisse scellée mystère (contient des larves de ver des sables vivantes). Transport des recrues (PJ).",
      fuel: 100,
      water: 80,
      food: 80,
      medicine: 50,
      ammo: 70,
      vehicles: [
        { name: "Camion-Tout-Terrain du Convoi 2", type: "truck", hpMax: 150, hpCurrent: 150, passengers: "Les PJ, Ines" },
        { name: "Buggy d'escorte", type: "car", hpMax: 90, hpCurrent: 90, passengers: "2 recrues" }
      ]
    },
    {
      name: "Convoi 3 — La Caravane du Sel Blanc",
      originCityId: foodCity.id,
      destinationCityId: destCity.id,
      status: "in_progress",
      difficulty: 40,
      cargoType: "resources",
      cargoDetails: "Textiles, parfums et vins d'exception pour les Plaisirs de la Chair. Cheffe : Meya Sel-Blanc (convoi lent mais increvable).",
      fuel: 120,
      water: 120,
      food: 150,
      medicine: 60,
      ammo: 40,
      vehicles: [
        { name: "La Forteresse roulante (Meya Sel-Blanc)", type: "truck", hpMax: 220, hpCurrent: 220, passengers: "Meya Sel-Blanc, gardes du corps" },
        { name: "Bétaillère de transport", type: "truck", hpMax: 140, hpCurrent: 140, passengers: "Personnel de cargaison" }
      ]
    },
    {
      name: "Convoi 4 — Les Cendres Silencieuses",
      originCityId: medCity.id,
      destinationCityId: destCity.id,
      status: "in_progress",
      difficulty: 70,
      cargoType: "resources",
      cargoDetails: "Organes et prothèses biologiques pour les Sculpteurs. Cheffe : Ashka Cendres (emprunte la Passe du Sel Noir).",
      fuel: 90,
      water: 70,
      food: 60,
      medicine: 120,
      ammo: 60,
      vehicles: [
        { name: "L'Ombre de Verre (Ashka Cendres)", type: "car", hpMax: 110, hpCurrent: 110, passengers: "Ashka Cendres, copilote" },
        { name: "Camion Isotherme Médical", type: "truck", hpMax: 130, hpCurrent: 130, passengers: "Techniciens médicaux" }
      ]
    },
    {
      name: "Convoi 5 — Le Convoi des Nostalgics",
      originCityId: nukeCity.id,
      destinationCityId: destCity.id,
      status: "failed",
      difficulty: 80,
      cargoType: "resources",
      cargoDetails: "Précurseurs neurochimiques. ÉLIMINÉ DE LA COURSE au départ suite à l'explosion (node_0c, node_0e).",
      fuel: 0,
      water: 0,
      food: 0,
      medicine: 0,
      ammo: 0,
      vehicles: [
        { name: "Épave fumante du Convoi 5", type: "truck", hpMax: 120, hpCurrent: 0, passengers: "Ines (seule survivante)", isDestroyed: true }
      ]
    }
  ];

  for (const def of convoyDefs) {
    // Check if convoy with same name exists
    const existing = await prisma.convoy.findFirst({
      where: { campaignId: campaign.id, name: def.name }
    });

    if (existing) {
      console.log(`Convoy '${def.name}' already exists. Updating...`);
      await prisma.convoy.update({
        where: { id: existing.id },
        data: {
          status: def.status,
          cargoType: def.cargoType,
          cargoDetails: def.cargoDetails,
          fuel: def.fuel,
          water: def.water,
          food: def.food,
          medicine: def.medicine,
          ammo: def.ammo,
        }
      });
    } else {
      console.log(`Creating convoy '${def.name}'...`);
      await prisma.convoy.create({
        data: {
          campaignId: campaign.id,
          name: def.name,
          originCityId: def.originCityId,
          destinationCityId: def.destinationCityId,
          status: def.status,
          difficulty: def.difficulty,
          cargoType: def.cargoType,
          cargoDetails: def.cargoDetails,
          fuel: def.fuel,
          water: def.water,
          food: def.food,
          medicine: def.medicine,
          ammo: def.ammo,
          totalSteps: 5,
          vehicles: {
            create: def.vehicles
          }
        }
      });
    }
  }

  console.log("=== All 5 Convoys seeded successfully! ===");
}

main()
  .catch(err => {
    console.error("Error seeding convoys:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
