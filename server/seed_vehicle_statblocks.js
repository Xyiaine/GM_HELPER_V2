const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Seeding D&D 5e Stat-Blocks (Clean Speeds: 24m, 16m, 12m, 8m) ===");

  let campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });
  if (!campaign) campaign = await prisma.campaign.findFirst();
  if (!campaign) {
    console.error("No campaign found!");
    process.exit(1);
  }

  /*
    GRILLE DE TAILLE ET DE VITESSE D&D 5e :
    - Moto (Petit/Léger)      : CA 13 | PV 50  | Vitesse 24m (16 cases) | Init +5
    - Voiture (Moyen)          : CA 16 | PV 110 | Vitesse 16m (10 cases) | Init +3
    - Camion Blindé (Lourd)    : CA 18 | PV 180 | Vitesse 12m (8 cases)  | Init +1
    - Mastodonte (Très Lourd) : CA 20 | PV 250 | Vitesse 8m  (5 cases)  | Init -2
  */

  const vehicleStatBlocks = [
    {
      name: "Scout léger Loup (Convoi 1)",
      modelType: "Moto d'Attaque Rapide (Taille : Petite / Légère)",
      description: "Moto d'assaut très rapide des Loups de Sel. Vitesse maximale mais faible résistance.",
      acBase: 13,
      speedBase: 24, // 24m
      hpMaxBase: 50,
      hpCurrent: 50,
      notes: JSON.stringify({
        initiative: "+5",
        taille: "Petite (Moto)",
        pilote: "Éclaireur des Loups (+5 en Pilotage)",
        specialAbilities: [
          { name: "Haute Agilité", description: "Peut effectuer l'action Se Désengager en action bonus." }
        ],
        actions: [
          { name: "Fusil à pompe scié", type: "Ranged", attackBonus: "+5", range: "6/15m", damage: "2d8+3 perçant" },
          { name: "Harpon Incendiaire", type: "Ranged", attackBonus: "+4", range: "12m", damage: "1d10 perçant + 1d6 feu" }
        ]
      })
    },
    {
      name: "L'Ombre de Verre (Convoi 4 - Ashka Cendres)",
      modelType: "Voiture d'Éclaireuse Furtive (Taille : Moyenne)",
      description: "Voiture profilée à silencieux thermique d'Ashka Cendres.",
      acBase: 16,
      speedBase: 16, // 16m
      hpMaxBase: 110,
      hpCurrent: 110,
      notes: JSON.stringify({
        initiative: "+3",
        taille: "Moyenne (Voiture profilée)",
        pilote: "Ashka Cendres (Discrétion +7, Pilotage +6)",
        specialAbilities: [
          { name: "Silencieux Thermique", description: "Avantage sur les jets de Discrétion dans les ravines." },
          { name: "Mines d'huile (Réaction)", description: "JS Dextérité DD 15 pour le véhicule suiveur ou dérapage." }
        ],
        actions: [
          { name: "Sniper Lourd Antimatériel", type: "Ranged", attackBonus: "+7", range: "60/180m", damage: "3d10+5 perçant (Critique 19-20)" }
        ]
      })
    },
    {
      name: "Le Molosse blindé (Convoi 1 - Doran Roka)",
      modelType: "Camion Blindé de Combat (Taille : Grande / Lourde)",
      description: "Camion de combat pesant de Doran Roka. Plaquage d'acier renforcé.",
      acBase: 18,
      speedBase: 12, // 12m
      hpMaxBase: 180,
      hpCurrent: 180,
      notes: JSON.stringify({
        initiative: "+1",
        taille: "Grande (Camion blindé)",
        pilote: "Doran Roka (Pilotage +5)",
        resistances: "Réduction des dégâts physiques de 5 (Blindage Lourd)",
        specialAbilities: [
          { name: "Éperon d'acier (Bélier)", description: "Attaque CàC, +7 au toucher, 1.5m. Touché : 4d10+5 contondant. JS Force DD 15 ou véhicule cible renversé." },
          { name: "Blindage Lourd", description: "Réduit tous les dégâts physiques subis de 5." }
        ],
        actions: [
          { name: "Tourelle Mitrailleuse Lourde", type: "Ranged", attackBonus: "+6", range: "30/90m", damage: "3d8+4 perçant" },
          { name: "Lance-Grappins Électriques", type: "Ranged", attackBonus: "+5", range: "18m", damage: "Immobilise le véhicule cible (JS Force DD 14)" }
        ]
      })
    },
    {
      name: "Camion Isotherme Médical (Convoi 4)",
      modelType: "Camion Réfrigéré Blindé (Taille : Grande / Lourde)",
      description: "Camion lourd de transport d'organes des Sculpteurs.",
      acBase: 18,
      speedBase: 12, // 12m
      hpMaxBase: 180,
      hpCurrent: 180,
      notes: JSON.stringify({
        initiative: "+1",
        taille: "Grande (Camion réfrigéré)",
        specialAbilities: [
          { name: "Cryo-Brumisateur", description: "Crée une zone de givre au sol ralentissant les suiveurs." }
        ],
        actions: [
          { name: "Cryo-Lance", type: "Cone", attackBonus: "JS Con DD 14", range: "Cône 9m", damage: "2d8 froid + vitesse /2 pendant 1 tour" }
        ]
      })
    },
    {
      name: "La Forteresse roulante (Convoi 3 - Meya Sel-Blanc)",
      modelType: "Camion Mastodonte (Taille : Très Grande / Très Lourde)",
      description: "Super-structure ambulante de Meya Sel-Blanc. Blindage maximal et mastodonte lent.",
      acBase: 20,
      speedBase: 8, // 8m
      hpMaxBase: 250,
      hpCurrent: 250,
      notes: JSON.stringify({
        initiative: "-2",
        taille: "Très Grande / Mastodonte",
        pilote: "Meya Sel-Blanc (Pilotage +4)",
        resistances: "Immunisé aux renversements et étourdissements",
        specialAbilities: [
          { name: "Écran de poussière (Action Bonus)", description: "Déploie un nuage opaque de 12m. Abri total contre les attaques à distance pendant 1 tour." },
          { name: "Structure Massique", description: "Immunisé aux effets de renversement." }
        ],
        actions: [
          { name: "Mortier à Poudre Noire", type: "Area", attackBonus: "JS Dex DD 14", range: "45m", damage: "4d6 d'explosion (Zone de 6m de rayon)" },
          { name: "Baliste de Flanc à Pression", type: "Ranged", attackBonus: "+5", range: "24m", damage: "2d10+4 perçant" }
        ]
      })
    }
  ];

  // Update Vehicle Registry
  console.log("Updating Vehicle Registry with clean speed values...");
  for (const vDef of vehicleStatBlocks) {
    const existing = await prisma.vehicle.findFirst({
      where: { campaignId: campaign.id, name: vDef.name }
    });

    if (existing) {
      await prisma.vehicle.update({
        where: { id: existing.id },
        data: {
          modelType: vDef.modelType,
          acBase: vDef.acBase,
          speedBase: vDef.speedBase,
          hpMaxBase: vDef.hpMaxBase,
          hpCurrent: vDef.hpCurrent,
          notes: vDef.notes
        }
      });
    } else {
      await prisma.vehicle.create({
        data: {
          campaignId: campaign.id,
          name: vDef.name,
          modelType: vDef.modelType,
          description: vDef.description,
          acBase: vDef.acBase,
          speedBase: vDef.speedBase,
          hpMaxBase: vDef.hpMaxBase,
          hpCurrent: vDef.hpCurrent,
          notes: vDef.notes
        }
      });
    }
  }

  // Update ConvoyVehicles
  console.log("Updating ConvoyVehicles passengers summary with clean speeds...");
  const convoyVehicles = await prisma.convoyVehicle.findMany();

  for (const cv of convoyVehicles) {
    if (cv.name.includes("Loup")) {
      await prisma.convoyVehicle.update({
        where: { id: cv.id },
        data: {
          hpMax: 50,
          hpCurrent: Math.min(cv.hpCurrent, 50),
          passengers: "CA 13 (Moto) | PV 50 | Vitesse 24m | Init +5 | Fusil +5 (2d8+3) | Harpon +4"
        }
      });
    } else if (cv.name.includes("Molosse")) {
      await prisma.convoyVehicle.update({
        where: { id: cv.id },
        data: {
          hpMax: 180,
          hpCurrent: Math.min(cv.hpCurrent, 180),
          passengers: "CA 18 (Camion) | PV 180 | Vitesse 12m | Init +1 | Éperon +7 | Tourelle +6 | Doran Roka"
        }
      });
    } else if (cv.name.includes("Ombre de Verre")) {
      await prisma.convoyVehicle.update({
        where: { id: cv.id },
        data: {
          hpMax: 110,
          hpCurrent: Math.min(cv.hpCurrent, 110),
          passengers: "CA 16 (Voiture) | PV 110 | Vitesse 16m | Init +3 | Sniper +7 | Ashka Cendres"
        }
      });
    } else if (cv.name.includes("Forteresse")) {
      await prisma.convoyVehicle.update({
        where: { id: cv.id },
        data: {
          hpMax: 250,
          hpCurrent: Math.min(cv.hpCurrent, 250),
          passengers: "CA 20 (Mastodonte) | PV 250 | Vitesse 8m | Init -2 | Mortier JS Dex DD14 | Meya Sel-Blanc"
        }
      });
    } else if (cv.name.includes("Isotherme")) {
      await prisma.convoyVehicle.update({
        where: { id: cv.id },
        data: {
          hpMax: 180,
          hpCurrent: Math.min(cv.hpCurrent, 180),
          passengers: "CA 18 (Camion) | PV 180 | Vitesse 12m | Init +1 | Cryo-Lance JS Con DD14"
        }
      });
    }
  }

  console.log("=== Vehicle speeds seeded successfully! ===");
}

main()
  .catch(err => {
    console.error("Error seeding vehicle stat-blocks:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
