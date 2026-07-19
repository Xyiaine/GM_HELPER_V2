const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.log("Campaign not found");
    return;
  }

  // Create or Update WorldMap
  await prisma.worldMap.upsert({
    where: { campaignId: campaign.id },
    update: { baseMapImageUrl: '/assets/world_map.png' },
    create: {
      campaignId: campaign.id,
      baseMapImageUrl: '/assets/world_map.png',
      zoom: 1.0,
      panX: 0,
      panY: 0
    }
  });
  console.log("WorldMap assigned.");

  // Place cities randomly on a 1024x1024 map, roughly keeping them away from the edges
  const cities = await prisma.city.findMany({
    where: { location: { campaignId: campaign.id } }
  });

  // Distribute cities to avoid too much overlap
  // We'll just assign random coords between 150 and 850
  for (const city of cities) {
    if (city.mapX === null || city.mapY === null) {
      const rx = Math.floor(Math.random() * 700) + 150;
      const ry = Math.floor(Math.random() * 700) + 150;
      await prisma.city.update({
        where: { id: city.id },
        data: { mapX: rx, mapY: ry }
      });
      console.log(`Assigned coords (${rx}, ${ry}) to city ${city.id}`);
    }
  }

  console.log("Map setup completed successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
