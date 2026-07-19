const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) return console.log("Campaign not found");

  const res = await prisma.location.updateMany({
    where: { 
      campaignId: campaign.id,
      type: { in: ['city', 'City-State'] }
    },
    data: { imageUrl: '/assets/local_city_map.png' }
  });

  console.log(`Updated ${res.count} city locations with local map image.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
