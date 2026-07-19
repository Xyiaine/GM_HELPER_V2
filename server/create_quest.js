const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.log("Campagne principale introuvable, tentative de création ou utilisation de la première disponible.");
  }
  
  const targetCampaignId = campaign ? campaign.id : (await prisma.campaign.findFirst()).id;

  const gmNotes = fs.readFileSync(path.join(__dirname, '../Campagne_v2.txt'), 'utf-8');

  const quest = await prisma.quest.create({
    data: {
      campaignId: targetCampaignId,
      name: "La Course du Sel (Quête d'ouverture)",
      description: "Tous les quatre ans, la Cité du Divertissement organise un recrutement pour sa Garde. Des convois s'élancent depuis le centre du désert de sel en direction de la Cité. Le premier arrivé est recruté. Vous vous réveillez, amnésiques, dans le Convoi 2 en pleine fuite...",
      type: "main",
      difficulty: "Hard",
      visibility: "partial",
      status: "active",
      playerSummary: "Vous êtes à bord du Convoi 2, en pleine course à travers le désert de sel pour rejoindre la Cité du Divertissement. Vous fuyez quelque chose, sans le moindre souvenir de comment vous en êtes arrivés là.",
      gmNotes: gmNotes,
      objectives: {
        create: [
          { description: "Étape 0 — La Fuite (Survivre à l'incident initial et au tremblement du sol)", orderIndex: 0 },
          { description: "Étape 1 — La Route des Carcasses (Gérer la chaleur, les pannes et les convois rivaux)", orderIndex: 1 },
          { description: "Étape 1.5 — La Crevasse (Trouver refuge contre la tempête de sel)", orderIndex: 2 },
          { description: "Étape 2 — Traverser le désert (Alternative A: Les Dunes Chantantes ou Alternative B: La Passe du Sel Noir)", orderIndex: 3 },
          { description: "Étape 3 — Le Cimetière des Convois (Le sprint final vers la Cité du Divertissement)", orderIndex: 4 },
        ]
      }
    },
    include: {
      objectives: true
    }
  });

  console.log("Quête créée avec succès !");
  console.log(JSON.stringify(quest, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
