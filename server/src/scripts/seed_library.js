const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Initialisation de la Bibliothèque d\'Armes, Armures et Véhicules ---');

  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('Aucun utilisateur trouvé.');
    process.exit(1);
  }

  let campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    campaign = await prisma.campaign.findFirst();
  }

  if (!campaign) {
    console.error("Aucune campagne trouvée.");
    process.exit(1);
  }

  // --- ARMES ET ARMURES (Manuel Armes & Armures v2) ---
  const items = [
    // Mêlée
    {
      name: "Lame courte",
      type: "weapon",
      rarity: "common",
      description: "Couteau de poche, lame de survie, tournevis affûté.",
      value: 15,
      weight: 0.5,
      properties: JSON.stringify({
        category: "mêlée simple",
        damage: "1d4 perforant",
        properties: ["légère", "finesse", "lancer (6/18m)"],
        etat: 0, // Fonctionnel
        plafondEtat: "+2"
      })
    },
    {
      name: "Lame longue",
      type: "weapon",
      rarity: "common",
      description: "Épée récupérée, machette de récolte reforgée.",
      value: 30,
      weight: 1.5,
      properties: JSON.stringify({
        category: "mêlée martiale",
        damage: "1d8 tranchant (1d10 à 2 mains)",
        properties: ["polyvalente"],
        etat: 0,
        plafondEtat: "+2"
      })
    },
    {
      name: "Masse de forge",
      type: "weapon",
      rarity: "uncommon",
      description: "Marteau-piqueur reconverti, masse de démolition.",
      value: 50,
      weight: 5.0,
      properties: JSON.stringify({
        category: "mêlée martiale lourde",
        damage: "2d6 contondant",
        properties: ["lourde", "deux mains"],
        etat: 0,
        plafondEtat: "+2"
      })
    },
    // Armes à distance & Automatiques
    {
      name: "Pistolet léger",
      type: "weapon",
      rarity: "common",
      description: "Arme de poing 9mm ou .38 récupérée ou assemblée.",
      value: 60,
      weight: 1.0,
      properties: JSON.stringify({
        category: "distance simple",
        damage: "1d6 perforant",
        range: "12/36m",
        chargeur: 12,
        munitionsPortees: 36,
        properties: ["légère", "munitions"],
        etat: 0,
        plafondEtat: "+2"
      })
    },
    {
      name: "Mitrailleuse légère",
      type: "weapon",
      rarity: "rare",
      description: "Arme automatique à forte cadence de tir.",
      value: 200,
      weight: 7.0,
      properties: JSON.stringify({
        category: "distance automatique",
        damage: "6d4 perforant",
        range: "24/72m",
        chargeur: 30,
        munitionsPortees: 120,
        properties: ["lourde", "deux mains", "rafale"],
        noteAbsorption: "Dégâts étalés sur 6d4 - fortement réduits par l'Absorption des armures lourdes",
        etat: 0,
        plafondEtat: "+2"
      })
    },
    {
      name: "Fusil de précision antimatériel",
      type: "weapon",
      rarity: "very_rare",
      description: "Fusil de précision lourd perçant le blindage des véhicules et armures.",
      value: 400,
      weight: 9.0,
      properties: JSON.stringify({
        category: "distance précision",
        damage: "1d20 perforant",
        range: "60/180m",
        chargeur: 5,
        munitionsPortees: 20,
        properties: ["lourde", "deux mains", "chargement", "critique 19-20"],
        noteAbsorption: "Dégâts concentrés sur 1d20 - peu impacté par l'Absorption",
        etat: 0,
        plafondEtat: "+3"
      })
    },
    // Armures avec mécanique d'Absorption
    {
      name: "Gilet en cuir renforcé",
      type: "armor",
      rarity: "common",
      description: "Protections en cuir bouilli et bandes de caoutchouc.",
      value: 45,
      weight: 4.0,
      properties: JSON.stringify({
        armorClass: 12,
        dexBonus: "complet",
        absorption: 0,
        etat: 0,
        plafondEtat: "+1"
      })
    },
    {
      name: "Kevlar tactique d'avant-guerre",
      type: "armor",
      rarity: "uncommon",
      description: "Gilet tactique léger d'unités d'intervention pré-guerre.",
      value: 120,
      weight: 6.0,
      properties: JSON.stringify({
        armorClass: 14,
        dexBonus: "max 2",
        absorption: 1, // Réduit chaque dé de dégâts subis de 1
        noteAbsorption: "Soustrait 1 à chaque dé de dégâts subis (min 0)",
        etat: 0,
        plafondEtat: "+2"
      })
    },
    {
      name: "Harnais de Plaques de Titan",
      type: "armor",
      rarity: "rare",
      description: "Armure lourde assemblée à partir de plaques de blindage de chars.",
      value: 350,
      weight: 20.0,
      properties: JSON.stringify({
        armorClass: 18,
        dexBonus: "aucun",
        absorption: 3, // Réduit chaque dé de dégâts subis de 3
        stealthDisadvantage: true,
        strRequirement: 15,
        noteAbsorption: "Soustrait 3 à chaque dé de dégâts subis (min 0) - bloque quasi-totalement les tir automatiques",
        etat: 0,
        plafondEtat: "+3"
      })
    }
  ];

  console.log("Seeding Items, Weapons & Armors...");
  for (const item of items) {
    const existing = await prisma.item.findFirst({
      where: { campaignId: campaign.id, name: item.name }
    });

    if (existing) {
      await prisma.item.update({
        where: { id: existing.id },
        data: {
          type: item.type,
          rarity: item.rarity,
          description: item.description,
          value: item.value,
          weight: item.weight,
          properties: item.properties
        }
      });
    } else {
      await prisma.item.create({
        data: {
          campaignId: campaign.id,
          name: item.name,
          type: item.type,
          rarity: item.rarity,
          description: item.description,
          value: item.value,
          weight: item.weight,
          properties: item.properties
        }
      });
    }
  }

  console.log('--- Initialisation terminée avec succès ! ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
