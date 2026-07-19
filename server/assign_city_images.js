const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mapping = {
  "BUNKER OMÉGA": "/assets/bunker_omega.png",
  "CITÉ INDUSTRIELLE": "/assets/cite_industrielle.png",
  "CITÉ MÉDICALE": "/assets/cite_medicale.png",
  "CITÉ DE L'ARMEMENT & DÉFENSE": "/assets/cite_armement.png",
  "CITÉ DE L'EAU & ALIMENTATION": "/assets/cite_eau.png",
  "CITÉ DES MÉTAUX & RECYCLAGE": "/assets/cite_metaux.png",
  "CITÉ DU CARBURANT": "/assets/cite_carburant.png",
  "CITÉ DU DIVERTISSEMENT": "/assets/cite_divertissement.png",
  "L'ILE DES ANCIENS": "/assets/ile_anciens.png",
  "NUKE CITY": "/assets/nuke_city.png"
};

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) return console.log("Campaign not found");

  for (const [cityName, imgPath] of Object.entries(mapping)) {
    const loc = await prisma.location.findFirst({
      where: { campaignId: campaign.id, name: cityName }
    });
    
    if (loc) {
      await prisma.location.update({
        where: { id: loc.id },
        data: { imageUrl: imgPath }
      });
      console.log(`Updated ${cityName} with ${imgPath}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
