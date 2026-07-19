const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedQuest() {
  const campaignId = 'cmrak8t7p0000utp0vy5yc7qq';

  console.log('Creating quest...');
  const quest = await prisma.quest.create({
    data: {
      campaignId,
      name: "Le Rituel de l'Ombre",
      description: "Un culte secret tente d'invoquer une entité démoniaque. Les joueurs doivent les arrêter avant qu'il ne soit trop tard.",
      status: 'active',
      type: 'main'
    }
  });

  console.log('Creating nodes...');
  const node1 = await prisma.questNode.create({
    data: {
      questId: quest.id,
      title: "Découverte du culte",
      nodeType: 'start',
      status: 'reached',
      positionX: 100,
      positionY: 200,
      sensoryText: "Vous pénétrez dans une crypte poussiéreuse. Sur le sol, des traces de pas récentes et des symboles ésotériques fraîchement tracés."
    }
  });

  const node2 = await prisma.questNode.create({
    data: {
      questId: quest.id,
      title: "Préparation du rituel",
      nodeType: 'intermediate',
      status: 'locked',
      positionX: 400,
      positionY: 200,
      isTimed: true,
      timerDurationSeconds: 120, // 2 minutes for testing
      sensoryText: "Soudain, des chants lugubres résonnent. La température chute brusquement... Le rituel d'invocation vient de commencer !"
    }
  });

  const node3 = await prisma.questNode.create({
    data: {
      questId: quest.id,
      title: "Démon invoqué (Échec)",
      nodeType: 'end',
      status: 'locked',
      positionX: 700,
      positionY: 100,
      sensoryText: "Un cri déchirant. Une faille de ténèbres pures s'ouvre au centre de la pièce... L'entité est là."
    }
  });

  const node4 = await prisma.questNode.create({
    data: {
      questId: quest.id,
      title: "Rituel interrompu (Succès)",
      nodeType: 'end',
      status: 'locked',
      positionX: 700,
      positionY: 300,
      sensoryText: "Dans un dernier soupir, le grand prêtre s'effondre. Les chants s'arrêtent et l'atmosphère redevient calme."
    }
  });

  console.log('Creating connections...');
  await prisma.questNodeConnection.create({
    data: {
      fromNodeId: node1.id,
      toNodeId: node2.id
    }
  });

  await prisma.questNodeConnection.create({
    data: {
      fromNodeId: node2.id,
      toNodeId: node3.id,
      isTimeoutConnection: true,
      label: "Temps écoulé"
    }
  });

  await prisma.questNodeConnection.create({
    data: {
      fromNodeId: node2.id,
      toNodeId: node4.id,
      isTimeoutConnection: false,
      label: "Joueurs interviennent"
    }
  });

  console.log('Done!');
}

seedQuest().catch(console.error).finally(() => prisma.$disconnect());
