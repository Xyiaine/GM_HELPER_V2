const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cityPositions = {
  "BUNKER OMÉGA": { x: 769, y: 120 },                  // Genève (46.2044° N, 6.1432° E)
  "CITÉ INDUSTRIELLE": { x: 842, y: 195 },             // Turin (45.0703° N, 7.6869° E)
  "CITÉ MÉDICALE": { x: 1901, y: 1120 },               // Alexandrie (31.2001° N, 29.9187° E)
  "CITÉ DE L'ARMEMENT & DÉFENSE": { x: 221, y: 791 },  // Gibraltar (36.1408° N, -5.3536° E)
  "CITÉ DE L'EAU & ALIMENTATION": { x: 695, y: 300 },  // Camargue / Rhône (43.5000° N, 4.6000° E)
  "CITÉ DES MÉTAUX & RECYCLAGE": { x: 1606, y: 668 },  // Athènes (37.9838° N, 23.7275° E)
  "CITÉ DU CARBURANT": { x: 622, y: 750 },             // Alger (36.7538° N, 3.0588° E)
  "CITÉ DU DIVERTISSEMENT": { x: 1071, y: 406 },       // Rome (41.9028° N, 12.4964° E)
  "L'ILE DES ANCIENS": { x: 71, y: 800 },              // Atlantique Ouest Gibraltar (36.0000° N, -8.5000° E)
  "NUKE CITY": { x: 732, y: 314 }                      // Marseille (43.2965° N, 5.3698° E)
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
