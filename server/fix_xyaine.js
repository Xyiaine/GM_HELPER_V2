const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'xyaine@admin.com' } });
  if (!user) {
    console.log('Utilisateur xyaine@admin.com introuvable.');
    return;
  }

  // 1. Définir Xyaine comme GM de toutes les campagnes
  const campaigns = await prisma.campaign.findMany();
  for (const c of campaigns) {
    await prisma.campaign.update({
      where: { id: c.id },
      data: { gmUserId: user.id }
    });

    // Mettre à jour ou créer l'adhésion
    const membership = await prisma.campaignMembership.findFirst({
      where: { campaignId: c.id, userId: user.id }
    });

    if (membership) {
      await prisma.campaignMembership.update({
        where: { id: membership.id },
        data: { role: 'GM', status: 'active' }
      });
    } else {
      await prisma.campaignMembership.create({
        data: {
          campaignId: c.id,
          userId: user.id,
          role: 'GM',
          status: 'active'
        }
      });
    }
  }

  // 2. Définir Xyaine comme propriétaire de tous les personnages
  await prisma.character.updateMany({
    data: { ownerUserId: user.id }
  });

  console.log('Xyaine@admin.com est maintenant GM de toutes les campagnes et propriétaire de tous les personnages.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
