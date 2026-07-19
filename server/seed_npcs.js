const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to get random item from array
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Base names for generation
const firstNames = [
  "Kael", "Sia", "Orok", "Vex", "Jax", "Lira", "Nyx", "Gunn", "Rook", "Finch", 
  "Tala", "Brix", "Zane", "Nova", "Cade", "Mira", "Jorn", "Kira", "Raze", "Vorn",
  "Silas", "Dax", "Elara", "Titus", "Kaelen", "Ryn", "Vesper", "Cyrus", "Lyra", "Zev",
  "Kael", "Sia", "Orok", "Vex", "Jax", "Lira", "Nyx", "Gunn", "Rook", "Finch", 
  "Tala", "Brix", "Zane", "Nova", "Cade", "Mira", "Jorn", "Kira", "Raze", "Vorn",
  "Silas", "Dax", "Elara", "Titus", "Kaelen", "Ryn", "Vesper", "Cyrus", "Lyra", "Zev"
];

const lastNames = [
  "Rouage", "Cendre", "Ferraille", "Acier", "Plomb", "Sang", "Sel", "Sable", "Poussière",
  "Noir", "Rouge", "Vif", "Froid", "Sombre", "Lame", "Clou", "Moteur", "Soupape", "Noyau",
  "Rouage", "Cendre", "Ferraille", "Acier", "Plomb", "Sang", "Sel", "Sable", "Poussière",
  "Noir", "Rouge", "Vif", "Froid", "Sombre", "Lame", "Clou", "Moteur", "Soupape", "Noyau"
];

// Generate generic NPCs based on the 5 standard locations
function getGenericNpcs(locationName, cityName) {
  let npcs = [];
  
  if (locationName === "Le Marché d'Échanges") {
    npcs.push({
      role: "Marchand Principal",
      desc: `- Dirige les échanges au sein de ${locationName}.\n- A survécu à de multiples attaques de pillards.\n- Considère ${cityName} comme le seul havre de paix rentable.`
    });
    npcs.push({
      role: "Garde du Marché",
      desc: `- Protège les marchands de ${locationName}.\n- Ancien mercenaire cherchant la rédemption.\n- Connaît toutes les rumeurs de ${cityName}.`
    });
    npcs.push({
      role: "Fouineur / Voleur",
      desc: `- Survit dans les ombres de ${locationName}.\n- Orphelin de la guerre des ressources.\n- Vend des informations confidentielles sur les élites de ${cityName}.`
    });
  } else if (locationName === "La Citerne Centrale") {
    npcs.push({
      role: "Ingénieur Hydrologue",
      desc: `- Maintient la pureté de l'eau à ${locationName}.\n- Obsédé par les toxines et les radiations.\n- Pense que l'eau de ${cityName} est la clé de la survie humaine.`
    });
    npcs.push({
      role: "Distributeur de Rations",
      desc: `- Gère les files d'attente à ${locationName}.\n- Corrompu : garde les meilleures rations pour lui.\n- Détient un pouvoir immense sur les pauvres de ${cityName}.`
    });
    npcs.push({
      role: "Protecteur du Puits",
      desc: `- Garde armé affecté à ${locationName}.\n- A ordre de tirer à vue sur les saboteurs.\n- Fanatique dévoué à la survie de ${cityName}.`
    });
  } else if (locationName === "Le Générateur Principal") {
    npcs.push({
      role: "Mécano-Chef",
      desc: `- Supervise le fonctionnement de ${locationName}.\n- Ses poumons sont détruits par la fumée.\n- Maintient ${cityName} en vie à lui tout seul.`
    });
    npcs.push({
      role: "Ouvrier du Carburant",
      desc: `- Travaille dans la chaleur de ${locationName}.\n- Porte de lourdes cicatrices de brûlures.\n- Rêve de s'échapper de ${cityName}.`
    });
    npcs.push({
      role: "Adepte du Dieu-Moteur",
      desc: `- Vénère la machine à ${locationName}.\n- Prêche que les pannes sont des punitions divines.\n- Influence secrètement les dirigeants de ${cityName}.`
    });
  } else if (locationName === "Le Mur d'Enceinte & Les Portes") {
    npcs.push({
      role: "Capitaine de la Garde",
      desc: `- Commande la défense à ${locationName}.\n- Vétéran impitoyable de la dernière guerre.\n- Ne laisse entrer personne dans ${cityName} sans pot-de-vin.`
    });
    npcs.push({
      role: "Tireur d'Élite",
      desc: `- Surveille les horizons depuis ${locationName}.\n- A perdu sa famille à l'extérieur des murs.\n- Son fusil est son seul ami dans ${cityName}.`
    });
    npcs.push({
      role: "Contrebandier",
      desc: `- Fait passer des biens par ${locationName}.\n- Connaît les failles de la sécurité.\n- Fait affaire avec les ennemis de ${cityName}.`
    });
  } else if (locationName === "Le Quartier Résidentiel / Les Taudis") {
    npcs.push({
      role: "Leader Communautaire",
      desc: `- Tente de maintenir l'ordre dans ${locationName}.\n- Organise des soupes populaires.\n- S'oppose souvent aux dirigeants de ${cityName}.`
    });
    npcs.push({
      role: "Médecin Clandestin",
      desc: `- Soigne les exclus de ${locationName}.\n- Utilise des remèdes expérimentaux non approuvés.\n- Protégé par les gangs locaux de ${cityName}.`
    });
    npcs.push({
      role: "Survivant Désespéré",
      desc: `- Fouille les poubelles de ${locationName}.\n- A des visions prophétiques dues aux radiations.\n- Prédit la chute imminente de ${cityName}.`
    });
  }

  return npcs;
}

// Generate specialized NPCs based on the location name
function getSpecializedNpcs(locationName, cityName) {
  let npcs = [];
  
  // Create 3 generic but highly themed NPCs based on keywords in the location name
  let theme = "Scientifique";
  let trait1 = "Traite les radiations";
  let trait2 = "Cherche une cure";
  let trait3 = "Savant fou";

  if (locationName.includes("Virologie") || locationName.includes("Médicaments") || locationName.includes("Clinique") || locationName.includes("Quarantaine") || locationName.includes("Hôpital")) {
    theme = "Médical";
    trait1 = `A dédié sa vie à soigner les affligés de ${locationName}.`;
    trait2 = `Mène des expériences illégales pour la gloire de ${cityName}.`;
    trait3 = `Infecté par la peste, cache ses symptômes tout en travaillant à ${locationName}.`;
  } else if (locationName.includes("Raffinerie") || locationName.includes("Carburant") || locationName.includes("Puits")) {
    theme = "Pétrolier";
    trait1 = `Expert en extraction affecté à ${locationName}.`;
    trait2 = `S'enrichit sur le marché noir du carburant de ${cityName}.`;
    trait3 = `A survécu à une explosion massive à ${locationName}.`;
  } else if (locationName.includes("Fonderie") || locationName.includes("Assemblage") || locationName.includes("Ferraille") || locationName.includes("Recyclage") || locationName.includes("Mine")) {
    theme = "Industriel";
    trait1 = `Maniant le métal en fusion à ${locationName}.`;
    trait2 = `Fournit l'effort de guerre de ${cityName} en pièces détachées.`;
    trait3 = `Gère les esclaves ou travailleurs forcés de ${locationName}.`;
  } else if (locationName.includes("Serres") || locationName.includes("Filtration") || locationName.includes("Bétail") || locationName.includes("Agricole")) {
    theme = "Agricole";
    trait1 = `Protège farouchement les récoltes de ${locationName}.`;
    trait2 = `Spécialiste des mutations végétales au service de ${cityName}.`;
    trait3 = `Contrôle la distribution d'eau et de nourriture depuis ${locationName}.`;
  } else if (locationName.includes("Arène") || locationName.includes("Radiodiffusion") || locationName.includes("Casino") || locationName.includes("Théâtre")) {
    theme = "Divertissement";
    trait1 = `Star locale adorée par les citoyens de ${cityName}.`;
    trait2 = `Gère les paris truqués et les spectacles sanglants à ${locationName}.`;
    trait3 = `Propagandiste manipulant l'opinion publique depuis ${locationName}.`;
  } else if (locationName.includes("Réacteur") || locationName.includes("Irradiée") || locationName.includes("Énergie") || locationName.includes("Déchets")) {
    theme = "Nucléaire";
    trait1 = `Prêtre de l'Atome officiant à ${locationName}.`;
    trait2 = `Mutant luisant, immunisé aux radiations de ${cityName}.`;
    trait3 = `Chercheur essayant d'éviter une fusion du cœur à ${locationName}.`;
  } else if (locationName.includes("Armes") || locationName.includes("Explosifs") || locationName.includes("Caserne") || locationName.includes("Commandement")) {
    theme = "Militaire";
    trait1 = `Chef d'armurerie stockant l'arsenal de ${locationName}.`;
    trait2 = `Prépare la prochaine guerre d'expansion de ${cityName}.`;
    trait3 = `Instructeur brutal formant les recrues de ${locationName}.`;
  } else if (locationName.includes("Intelligence") || locationName.includes("Drones") || locationName.includes("Biologie") || locationName.includes("Données")) {
    theme = "Haute Technologie";
    trait1 = `Garde les secrets technologiques pré-guerre à ${locationName}.`;
    trait2 = `Cyborg fidèle uniquement à l'ordinateur central de ${cityName}.`;
    trait3 = `Chercheur obsédé par l'optimisation humaine à ${locationName}.`;
  }

  npcs.push({ role: `Chef ${theme}`, desc: `- ${trait1}\n- Totalement loyal envers les idéaux de ${cityName}.` });
  npcs.push({ role: `Spécialiste ${theme}`, desc: `- ${trait2}\n- Considère ${locationName} comme son propre royaume.` });
  npcs.push({ role: `Ouvrier / Garde ${theme}`, desc: `- ${trait3}\n- Connaît les secrets les plus sombres de ${cityName}.` });

  return npcs;
}

async function main() {
  console.log('Seeding 270 NPCs...');

  const campaign = await prisma.campaign.findFirst({
    where: { name: "Chroniques de l'Apocalypse" }
  });

  if (!campaign) {
    console.error("Campaign not found.");
    process.exit(1);
  }

  // Fetch all building/district locations
  const locations = await prisma.location.findMany({
    where: {
      campaignId: campaign.id,
      type: { in: ['building', 'district'] }
    },
    include: {
      parentLocation: true
    }
  });

  if (locations.length === 0) {
    console.error("No locations found. Run seed_city_locations.js first.");
    process.exit(1);
  }

  let totalNpcs = 0;

  for (const loc of locations) {
    if (!loc.parentLocation) continue; // Only process locations tied to a city

    const cityName = loc.parentLocation.name;
    let npcTemplates = [];

    // Check if it's a generic location
    if (["Le Marché d'Échanges", "La Citerne Centrale", "Le Générateur Principal", "Le Mur d'Enceinte & Les Portes", "Le Quartier Résidentiel / Les Taudis"].includes(loc.name)) {
      npcTemplates = getGenericNpcs(loc.name, cityName);
    } else {
      npcTemplates = getSpecializedNpcs(loc.name, cityName);
    }

    for (const tpl of npcTemplates) {
      const name = `${rand(firstNames)} ${rand(lastNames)}`;
      
      await prisma.nPC.create({
        data: {
          campaignId: campaign.id,
          locationId: loc.id,
          name: name,
          role: tpl.role,
          personality: 'Survivant post-apocalyptique',
          description: tpl.desc,
          isActive: true
        }
      });
      totalNpcs++;
    }
  }

  console.log(`Successfully created ${totalNpcs} NPCs!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
