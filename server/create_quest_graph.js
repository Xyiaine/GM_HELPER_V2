const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const quest = await prisma.quest.findFirst({
    where: { name: "La Course du Sel (Quête d'ouverture)" }
  });

  if (!quest) {
    console.error("Quest not found");
    return;
  }

  // Clear existing nodes if any
  await prisma.questNode.deleteMany({
    where: { questId: quest.id }
  });

  // Create nodes
  const n0 = await prisma.questNode.create({
    data: { questId: quest.id, title: "Étape 0 — La Fuite", nodeType: "start", positionX: 300, positionY: 100 }
  });
  const n1 = await prisma.questNode.create({
    data: { questId: quest.id, title: "Étape 1 — La Route des Carcasses", nodeType: "intermediate", positionX: 300, positionY: 250 }
  });
  const n15 = await prisma.questNode.create({
    data: { questId: quest.id, title: "Étape 1.5 — La Crevasse", nodeType: "intermediate", positionX: 300, positionY: 400 }
  });
  const n2a = await prisma.questNode.create({
    data: { questId: quest.id, title: "Étape 2A — Les Dunes Chantantes", nodeType: "intermediate", positionX: 100, positionY: 550 }
  });
  const n2b = await prisma.questNode.create({
    data: { questId: quest.id, title: "Étape 2B — La Passe du Sel Noir", nodeType: "intermediate", positionX: 500, positionY: 550 }
  });
  const n3 = await prisma.questNode.create({
    data: { questId: quest.id, title: "Étape 3 — Le Cimetière des Convois", nodeType: "convergence", positionX: 300, positionY: 700 }
  });
  const nEndWin = await prisma.questNode.create({
    data: { questId: quest.id, title: "Victoire - Recrutement", nodeType: "end", endOutcome: "success", positionX: 100, positionY: 850 }
  });
  const nEndFail = await prisma.questNode.create({
    data: { questId: quest.id, title: "Défaite - Échec", nodeType: "end", endOutcome: "failure", positionX: 500, positionY: 850 }
  });

  // Create connections
  await prisma.questNodeConnection.createMany({
    data: [
      { fromNodeId: n0.id, toNodeId: n1.id, label: "Fuite réussie" },
      { fromNodeId: n1.id, toNodeId: n15.id, label: "Tempête imminente" },
      { fromNodeId: n15.id, toNodeId: n2a.id, label: "Prendre les dunes" },
      { fromNodeId: n15.id, toNodeId: n2b.id, label: "Prendre le verre noir" },
      { fromNodeId: n2a.id, toNodeId: n3.id, label: "Traversée réussie" },
      { fromNodeId: n2b.id, toNodeId: n3.id, label: "Traversée réussie" },
      { fromNodeId: n3.id, toNodeId: nEndWin.id, label: "Arrivée premier" },
      { fromNodeId: n3.id, toNodeId: nEndFail.id, label: "Arrivée après les autres" }
    ]
  });

  console.log("Graph nodes and connections created successfully for the quest!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
