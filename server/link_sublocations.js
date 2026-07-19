const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) return console.log("Campaign not found");

  const cities = await prisma.location.findMany({
    where: { campaignId: campaign.id, type: { in: ['city', 'City-State'] } }
  });

  let linkedCount = 0;

  for (const city of cities) {
    // Find points of interest that start with the city name (since seed_lore prefixed them)
    const subLocs = await prisma.location.findMany({
      where: {
        campaignId: campaign.id,
        type: 'Point of Interest',
        name: { startsWith: `${city.name} - ` }
      }
    });

    for (const sub of subLocs) {
      await prisma.location.update({
        where: { id: sub.id },
        data: { parentLocationId: city.id }
      });
      linkedCount++;
    }
  }

  console.log(`Linked ${linkedCount} sub-locations to their parent cities.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
