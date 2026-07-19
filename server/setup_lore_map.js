const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cityPositions = {
  "BUNKER OMÉGA": { x: 730, y: 270 },         // Genève
  "CITÉ INDUSTRIELLE": { x: 800, y: 320 },    // Turin
  "CITÉ MÉDICALE": { x: 1530, y: 810 },       // Alexandrie
  "CITÉ DE L'ARMEMENT & DÉFENSE": { x: 280, y: 640 }, // Gibraltar
  "CITÉ DE L'EAU & ALIMENTATION": { x: 1570, y: 860 }, // Le Caire
  "CITÉ DES MÉTAUX & RECYCLAGE": { x: 1240, y: 590 },  // Athènes
  "CITÉ DU CARBURANT": { x: 570, y: 700 },    // Alger
  "CITÉ DU DIVERTISSEMENT": { x: 920, y: 480 }, // Rome
  "L'ILE DES ANCIENS": { x: 990, y: 700 },      // Malte
  "NUKE CITY": { x: 670, y: 430 }               // Marseille
};

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) return console.log("Campaign not found");

  // Force map to map-lore-base.png
  await prisma.worldMap.update({
    where: { campaignId: campaign.id },
    data: { baseMapImageUrl: '/assets/map-lore-base.png' }
  });
  console.log("Updated map image.");

  const cities = await prisma.city.findMany({
    where: { location: { campaignId: campaign.id } },
    include: { location: true }
  });

  for (const city of cities) {
    const locName = city.location.name;
    const pos = cityPositions[locName] || { x: 500, y: 500 };
    await prisma.city.update({
      where: { id: city.id },
      data: { mapX: pos.x, mapY: pos.y }
    });
    console.log(`Placed ${locName} at ${pos.x}, ${pos.y}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
