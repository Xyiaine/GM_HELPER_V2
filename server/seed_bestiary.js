const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Seeding Bestiary du Bassin (Créatures & Flore) ===");

  let campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });
  if (!campaign) campaign = await prisma.campaign.findFirst();
  if (!campaign) {
    console.error("No campaign found!");
    process.exit(1);
  }

  const bestiaryEntries = [
    // FLORE
    {
      name: "Cactus de Sel",
      category: "other",
      challengeRating: 0,
      armorClass: 10,
      hpMax: 10,
      speed: "0m",
      stats: JSON.stringify({ str: 10, dex: 1, con: 12, int: 1, wis: 10, cha: 1 }),
      traits: JSON.stringify({
        gradient: "Pure : eau potable, coque fine (Force DD 8). Mutée : eau à filtrer (1d4 poison), coque épaisse (Force DD 16 ou 10 dégâts).",
        ressource: "Réserve d'eau pure dans le désert."
      }),
      description: "Coque cristalline de Sel Blanc se formant naturellement autour de lui. Contient de l'eau potable."
    },
    {
      name: "Lichen d'Orage",
      category: "other",
      challengeRating: 0,
      armorClass: 10,
      hpMax: 5,
      speed: "0m",
      stats: JSON.stringify({ str: 1, dex: 1, con: 10, int: 1, wis: 10, cha: 1 }),
      traits: JSON.stringify({
        gradient: "Nourrit des radiations ambiantes et luit dans le noir en proportion de l'absorption.",
        compteurGeiger: "Permet de détecter la proximité d'une source radioactive."
      }),
      description: "Lichen radiotrophe servant de compteur Geiger vivant."
    },
    {
      name: "Épine-Éclair",
      category: "other",
      challengeRating: 0.125,
      armorClass: 12,
      hpMax: 15,
      speed: "0m",
      stats: JSON.stringify({ str: 10, dex: 1, con: 14, int: 1, wis: 10, cha: 1 }),
      traits: JSON.stringify({
        orage: "En cas de tempête statique, toucher l'épine inflige 2d6 dégâts de foudre."
      }),
      description: "Plante aux épines métallisées accumulant la charge électrostatique ambiante."
    },

    // FAUNE & PETITE FAUNE
    {
      name: "Criquet-Blindé",
      category: "beast",
      challengeRating: 0.125,
      armorClass: 13,
      hpMax: 7,
      hpFormula: "2d6",
      speed: "9m, vol 9m",
      stats: JSON.stringify({ str: 10, dex: 14, con: 11, int: 1, wis: 10, cha: 3 }),
      attacks: JSON.stringify([
        { name: "Morsure", bonus: "+2", damage: "1d4 perforant", range: "1.5m" }
      ]),
      traits: JSON.stringify({
        gradient: "Pure : chair de base du bassin. Mutée : chair légèrement fluorescente.",
        comestible: "Salé puis cuit, source principale de protéines."
      }),
      description: "Insecte géant herbivore à exosquelette épais, base de la chaîne alimentaire."
    },
    {
      name: "Essaim de Criquets-Blindés",
      category: "beast",
      challengeRating: 0.5,
      armorClass: 12,
      hpMax: 22,
      hpFormula: "5d8",
      speed: "9m, vol 9m",
      stats: JSON.stringify({ str: 10, dex: 14, con: 11, int: 1, wis: 10, cha: 3 }),
      attacks: JSON.stringify([
        { name: "Morsures", bonus: "+4", damage: "4d4 perforant (2d4 si mi-PV)", range: "0m" }
      ]),
      traits: JSON.stringify({
        essaim: "Peut occuper l'espace d'une autre créature. Résistant aux attaques physiques."
      }),
      description: "Nuée vorace de criquets-blindés recouvrant une zone entière."
    },
    {
      name: "Ver de Ferraille",
      category: "beast",
      challengeRating: 0.25,
      armorClass: 11,
      hpMax: 11,
      hpFormula: "2d8+2",
      speed: "6m, fouisseur 3m",
      stats: JSON.stringify({ str: 12, dex: 10, con: 13, int: 1, wis: 8, cha: 3 }),
      attacks: JSON.stringify([
        { name: "Morsure acide", bonus: "+3", damage: "1d4+1 perforant + 1d4 acide", range: "1.5m" }
      ]),
      traits: JSON.stringify({
        digestionMetallique: "Ingère et dissout la rouille et les débris métalliques."
      }),
      description: "Larve géante détritivore se nourrissant de rouille et de matière morte."
    },

    // PRÉDATEURS INTERMÉDIAIRES
    {
      name: "Loup du Désert / Meute du Bassin",
      category: "beast",
      challengeRating: 1,
      armorClass: 14,
      hpMax: 26,
      hpFormula: "4d8+8",
      speed: "15m",
      stats: JSON.stringify({ str: 14, dex: 15, con: 14, int: 3, wis: 12, cha: 6 }),
      attacks: JSON.stringify([
        { name: "Morsure", bonus: "+4", damage: "2d6+2 perforant (JS Force DD 12 ou à terre)", range: "1.5m" }
      ]),
      traits: JSON.stringify({
        tactiqueDeMeute: "Avantage aux attaques si un allié non incitant est à moins de 1.5m de la cible.",
        gradient: "Muté (+2 PV/dé, JS DD 14, Morsure radioactive +1d4 radiation)."
      }),
      description: "Canidé adapté à la sécheresse du désert de sel, chassant en meute coordonnée."
    },
    {
      name: "Scorpion de Verre",
      category: "beast",
      challengeRating: 2,
      armorClass: 15,
      hpMax: 39,
      hpFormula: "6d8+12",
      speed: "12m, fouisseur 6m",
      stats: JSON.stringify({ str: 15, dex: 14, con: 14, int: 1, wis: 11, cha: 3 }),
      attacks: JSON.stringify([
        { name: "Pince", bonus: "+4", damage: "1d8+2 contondant (agrippé DD 12)", range: "1.5m" },
        { name: "Aiguillon toxique", bonus: "+4", damage: "1d6+2 perforant + 2d10 poison (JS Con DD 12)", range: "1.5m" }
      ]),
      traits: JSON.stringify({
        carapaceTranslucide: "Avantage aux tests de Discrétion sur les champs de verre et le sel.",
        gradient: "Muté (Poison neurotoxique infligeant la condition Paralysé)."
      }),
      description: "Scorpion géant à la carapace de silice translucide chassant en embuscade."
    },

    // VERS DES SABLES
    {
      name: "Jeune Ver des Sables",
      category: "monstrosity",
      challengeRating: 5,
      armorClass: 16,
      hpMax: 95,
      hpFormula: "10d10+40",
      speed: "9m, fouisseur 18m",
      stats: JSON.stringify({ str: 20, dex: 10, con: 18, int: 1, wis: 10, cha: 3 }),
      attacks: JSON.stringify([
        { name: "Morsure", bonus: "+8", damage: "3d8+5 perforant", range: "3m" },
        { name: "Coup de queue", bonus: "+8", damage: "2d10+5 contondant", range: "6m" }
      ]),
      traits: JSON.stringify({
        perceptionDesVibrations: "Détecte les déplacements au sol jusqu'à 30m.",
        engloutissement: "Peut avaler une créature de taille M ou inférieure."
      }),
      description: "Prédateur souterrain massif attiré par le bruit des moteurs et les vibrations du sol."
    },
    {
      name: "Ver des Sables Adulte (Le Dévoreur du Bassin)",
      category: "monstrosity",
      challengeRating: 11,
      armorClass: 18,
      hpMax: 207,
      hpFormula: "18d12+90",
      speed: "12m, fouisseur 24m",
      stats: JSON.stringify({ str: 26, dex: 8, con: 20, int: 2, wis: 12, cha: 5 }),
      attacks: JSON.stringify([
        { name: "Morsure gigantesque", bonus: "+12", damage: "4d10+8 perforant (Avalé si M ou P)", range: "4.5m" },
        { name: "Balayage de queue", bonus: "+12", damage: "3d12+8 contondant", range: "9m" }
      ]),
      traits: JSON.stringify({
        vibrationSens: "Sensibilité extrême aux véhicules roulant sur le sel à pleine vitesse.",
        gradient: "Muté (Ver de Vitre à Nuke City, sécrète du plasma radioactif)."
      }),
      description: "Apex mythique du désert de sel capable d'engloutir un véhicule entier."
    },

    // BOSS LÉGENDAIRE
    {
      name: "Le Prototype",
      category: "construct",
      challengeRating: 15,
      armorClass: 19,
      hpMax: 310,
      hpFormula: "23d12+161",
      speed: "12m, vol 18m (propulseurs)",
      stats: JSON.stringify({ str: 24, dex: 16, con: 24, int: 18, wis: 14, cha: 10 }),
      attacks: JSON.stringify([
        { name: "Lame Monomoléculaire", bonus: "+12", damage: "3d10+7 tranchant (Critique sur 18-20)", range: "3m" },
        { name: "Canon à Plasma Concentré", bonus: "+10", damage: "4d12+5 feu/force (Portée 30/90m)", range: "90m" },
        { name: "Pression d'Ozone (Zone)", bonus: "JS Dex DD 18", damage: "8d6 foudre dans un rayon de 9m", range: "9m" }
      ]),
      traits: JSON.stringify({
        blindageRegeneratif: "Régénère 15 PV par tour tant qu'il n'est pas frappé par des dégâts d'acide.",
        resistances: "Résistant à tous les dégâts physiques non magiques et à l'énergie conventionnelle.",
        immunités: "Immunisé aux dégâts de poison, de radiation, et aux états Étourdi, Paralysé, Empoisonné.",
        actionsLegendaires: [
          "Attaque de Lame (1 action)",
          "Impulsion EMP (2 actions, désactive l'électronique dans un rayon de 18m)",
          "Surcharge Thermique (3 actions, tir immédiat de Canon à Plasma)"
        ]
      }),
      description: "Créature légendaire bio-mécanique pré-guerre autonome patrouillant les zones interdites du bassin."
    }
  ];

  console.log("Seeding Bestiary entries into database...");
  for (const entry of bestiaryEntries) {
    const existing = await prisma.bestiary.findFirst({
      where: { campaignId: campaign.id, name: entry.name }
    });

    if (existing) {
      console.log(`Updating bestiary entry '${entry.name}'...`);
      await prisma.bestiary.update({
        where: { id: existing.id },
        data: {
          category: entry.category,
          challengeRating: entry.challengeRating,
          armorClass: entry.armorClass,
          hpMax: entry.hpMax,
          hpFormula: entry.hpFormula,
          speed: entry.speed,
          stats: entry.stats,
          attacks: entry.attacks,
          traits: entry.traits,
          description: entry.description
        }
      });
    } else {
      console.log(`Creating bestiary entry '${entry.name}'...`);
      await prisma.bestiary.create({
        data: {
          campaignId: campaign.id,
          name: entry.name,
          category: entry.category,
          challengeRating: entry.challengeRating,
          armorClass: entry.armorClass,
          hpMax: entry.hpMax,
          hpFormula: entry.hpFormula,
          speed: entry.speed,
          stats: entry.stats,
          attacks: entry.attacks,
          traits: entry.traits,
          description: entry.description
        }
      });
    }
  }

  console.log("=== Bestiary seeded successfully! ===");
}

main()
  .catch(err => {
    console.error("Error seeding bestiary:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
