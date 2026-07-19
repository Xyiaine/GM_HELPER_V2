const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const nodesData = [
  // ÉTAPE 0
  {
    ref: "n0a",
    title: "0.a — Le réveil en mouvement",
    nodeType: "start",
    x: 400, y: 100,
    sensoryText: "VISUEL : tableau de bord fêlé qui vibre, sable giclant sous les pneus, horizon tanguant à travers le pare-brise constellé d'impacts.\nBRUIT : moteur hurlant, vent claquant, sifflement aigu dans les oreilles (tympans sonnés).\nODEUR : poudre brûlée, relent chimique sucré, reste de vapeur âcre florale.",
    mjDescription: "Aucun des PJ ne sait qui il est, ni pourquoi il est ici."
  },
  {
    ref: "n0b",
    title: "0.b — La détente encore pressée",
    nodeType: "intermediate",
    x: 400, y: 250,
    sensoryText: "VISUEL : un des PJ à la tourelle, doigt crispé sur la détente, canon fumant.\nBRUIT : détonations espacées vers l'arrière, cliquetis métallique de la culasse dans le vide.",
    mjDescription: "Premier moment de jeu : le joueur réalise en pleine action qu'il tire sans savoir pourquoi."
  },
  {
    ref: "n0c",
    title: "0.c — L'épave au loin",
    nodeType: "intermediate",
    x: 400, y: 400,
    sensoryText: "VISUEL : au loin derrière, colonne de fumée noire s'élevant d'une épave métallique tordue.\nBRUIT : un dernier écho de l'explosion qui roule comme un tonnerre lointain.\nODEUR : vapeur âcre portée par le vent chaud.",
    mjDescription: "C'est l'épave du Convoi 5 (Nostalgics) que les PJ viennent de détruire. Ne pas leur révéler d'emblée."
  },
  {
    ref: "n0d",
    title: "0.d — Le sol qui tremble",
    nodeType: "intermediate",
    x: 400, y: 550,
    sensoryText: "INDICE : Fin crépitement de sable sur le plancher, choc sourd et rythmique sous les sièges. Quelque chose cogne le sol au loin.",
    mjDescription: "Le Ver des Sables (bébé) approche. S'ils réagissent à l'indice : avantage. Sinon, Jet de Perception/Vigilance pour voir l'ondulation de sable. Le Ver les prend en chasse."
  },
  // ÉTAPE 1
  {
    ref: "n1a",
    title: "1.a — Cimetière de tôle",
    nodeType: "intermediate",
    x: 400, y: 700,
    sensoryText: "VISUEL : des dizaines d'épaves rouillées, portières arrachées, à moitié enfouies.\nBRUIT : grincement de tôle balancée au vent, crissement du sable.\nODEUR : rouille chaude, poussière, carburant rance.",
    mjDescription: "Entrée dans l'ossuaire de l'Étape 1."
  },
  {
    ref: "n1b",
    title: "1.b — La chaleur écrasante",
    nodeType: "intermediate",
    x: 400, y: 850,
    sensoryText: "VISUEL : mirage qui fait trembler l'horizon, ciel blanc et aveuglant.\nBRUIT : silence pesant, bourdonnement erratique d'insectes mutants.\nODEUR : sel chaud, sueur collante, plastique fondant sur le tableau de bord.",
    mjDescription: "L'environnement devient étouffant."
  },
  {
    ref: "n1c",
    title: "1.c — Poussière à l'horizon",
    nodeType: "intermediate",
    x: 400, y: 1000,
    sensoryText: "INDICE : Fin panache de poussière lointain qui ne suit pas la direction du vent.",
    mjDescription: "Un convoi rival approche. Jet de Perception s'ils ne remarquent pas l'indice visuel."
  },
  {
    ref: "n1d",
    title: "1.d — Panne mécanique",
    nodeType: "intermediate",
    x: 400, y: 1150,
    sensoryText: "VISUEL : fumée noire du capot, pièce qui rougeoie.\nBRUIT : toux métallique, moteur qui cale.",
    mjDescription: "Réparation forcée sous pression pour des PJ qui ne se font pas encore confiance."
  },
  {
    ref: "n1e",
    title: "1.e — Premier contact",
    nodeType: "intermediate",
    x: 400, y: 1300,
    sensoryText: "VISUEL : silhouettes lointaines (motos des Loups ou lourds du Sel Blanc).\nBRUIT : grondement de moteurs stabilisé à distance.",
    mjDescription: "Le convoi rival pourrait avoir vu l'explosion de l'Étape 0 et se pose des questions."
  },
  // ÉTAPE 1.5
  {
    ref: "n15a",
    title: "1.5.a — Tempête qui monte",
    nodeType: "intermediate",
    x: 400, y: 1450,
    sensoryText: "INDICE : Air statique, cheveux dressés, silence brutal (plus d'insectes). Puis un mur de poussière ocre.",
    mjDescription: "Signes avant-coureurs. Jet de Survie/Perception pour estimer le temps avant impact. S'ils roulent dedans : mort quasi-certaine."
  },
  {
    ref: "n15b",
    title: "1.5.b — Ruée vers l'abri",
    nodeType: "intermediate",
    x: 400, y: 1600,
    sensoryText: "VISUEL : crevasse de roche dure affleurant au milieu du sel.\nBRUIT : moteur à fond, sable cinglant la carrosserie.",
    mjDescription: "Les vers ne creusent pas la roche, seul abri sûr."
  },
  {
    ref: "n15c",
    title: "1.5.c — Attente dans la roche",
    nodeType: "intermediate",
    x: 400, y: 1750,
    sensoryText: "VISUEL : obscurité étroite trouée de lumière.\nBRUIT : écho de respiration, rugissement étouffé de la tempête dehors.\nODEUR : pierre humide et minérale.",
    mjDescription: "Temps mort. Jet de mémoire ou dialogue sincère entre PJ."
  },
  {
    ref: "n15d",
    title: "1.5.d — Le convoi lointain",
    nodeType: "intermediate",
    x: 400, y: 1900,
    sensoryText: "VISUEL : un autre convoi visible au loin dans la tempête, pris en chasse par le ver (flashs, projecteurs).\nBRUIT : tirs étouffés, moteurs emballés, cris... puis silence.",
    mjDescription: "Leçon par l'exemple de ce qui arrive si on reste dehors. Ne confirmez pas l'identité du convoi."
  },
  {
    ref: "n15e",
    title: "1.5.e — Le chant dans la crevasse",
    nodeType: "intermediate",
    x: 400, y: 2050,
    sensoryText: "INDICE : Chant grave et continu qui imite le vent, sans vent (les vers ne sont pas là).",
    mjDescription: "Ce sont les Adorateurs du Chant des Dunes (Enfants du Sel). Jet de Perception. Ne les montrez pas directement, les PJ doivent juste se sentir observés."
  },
  // BRANCH A
  {
    ref: "n2Aa",
    title: "2A.a — Approche des dunes",
    nodeType: "intermediate",
    x: 200, y: 2200,
    sensoryText: "VISUEL : dunes titanesques, crêtes changeant de teinte.\nBRUIT : bourdonnement grave naissant avec le vent.\nODEUR : sable propre minéral, ozone électrique.",
    mjDescription: "Début de la voie des Dunes Chantantes."
  },
  {
    ref: "n2Ab",
    title: "2A.b — Le chant grandit",
    nodeType: "intermediate",
    x: 200, y: 2350,
    sensoryText: "VISUEL : vagues de sable vibrant au rythme du son.\nBRUIT : le chant des dunes s'intensifie, venant de partout.",
    mjDescription: "Beauté troublante, ambiance épique."
  },
  {
    ref: "n2Ac",
    title: "2A.c — Poussière et moteurs",
    nodeType: "intermediate",
    x: 200, y: 2500,
    sensoryText: "INDICE : Poussière anormale et chant marquant une pause imperceptible (retenue de souffle).",
    mjDescription: "Jet de Perception pour repérer les Loups de Sel avant l'embuscade."
  },
  {
    ref: "n2Ad",
    title: "2A.d — Attaque des Loups",
    nodeType: "intermediate",
    x: 200, y: 2650,
    sensoryText: "VISUEL : motos surgissant, éclats sur lames et canons.\nBRUIT : cris, tirs, moteurs rugissants par-dessus le chant.",
    mjDescription: "Combat, fuite ou négociation avec Ashen Roka."
  },
  {
    ref: "n2Ae",
    title: "2A.e — Le chant s'arrête net",
    nodeType: "intermediate",
    x: 200, y: 2800,
    sensoryText: "INDICE : Le chant s'interrompt d'un coup. Silence total et soudain.",
    mjDescription: "Si les joueurs ne réagissent pas, Jet de Perception/Instinct juste avant que LE VER DES SABLES ne surgisse AU MILIEU de l'embuscade (alliance forcée)."
  },
  {
    ref: "n2Af",
    title: "2A.f — Enfants du Sel",
    nodeType: "intermediate",
    x: 200, y: 2950,
    sensoryText: "VISUEL : silhouettes immobiles sur les crêtes apparues de nulle part.\nBRUIT : le chant reprend doucement.",
    mjDescription: "Tribut ou conseils. Indice: un membre d'un convoi (homme du Nord) n'a 'pas d'ombre dans le chant'."
  },
  // BRANCH B
  {
    ref: "n2Ba",
    title: "2B.a — Entrée verre noir",
    nodeType: "intermediate",
    x: 600, y: 2200,
    sensoryText: "VISUEL : sable vitrifié noir et luisant, éclats coupants.\nBRUIT : crissement caractéristique sable-verre, cliquetis d'un compteur Geiger.\nODEUR : ozone, métal brûlé.",
    mjDescription: "Début de la Passe du Sel Noir. Protège du Ver des Sables."
  },
  {
    ref: "n2Bb",
    title: "2B.b — Navigation prudente",
    nodeType: "intermediate",
    x: 600, y: 2350,
    sensoryText: "VISUEL : chaleur déformant l'air, reflets verdâtres.\nBRUIT : souffle tendu des PJ, cliquetis Geiger.",
    mjDescription: "Tension continue sans répit."
  },
  {
    ref: "n2Bc",
    title: "2B.c — Poches de radiation",
    nodeType: "intermediate",
    x: 600, y: 2500,
    sensoryText: "INDICE : intensité inégale du Geiger, lueur verdâtre devant.",
    mjDescription: "Jet de Survie/Science pour esquiver, sinon irradiation."
  },
  {
    ref: "n2Bd",
    title: "2B.d — Cendres Silencieuses",
    nodeType: "intermediate",
    x: 600, y: 2650,
    sensoryText: "VISUEL : casques et lunettes nocturnes luisantes.\nBRUIT : moteurs au ralenti, voix étouffées.",
    mjDescription: "Rencontre avec Vray Cendres. Alliance prudente possible."
  },
  {
    ref: "n2Be",
    title: "2B.e — Grondement contenu",
    nodeType: "intermediate",
    x: 600, y: 2800,
    sensoryText: "VISUEL : ondulations de sable contournant la lisière sans y entrer.\nBRUIT : grondement sourd et frustré.",
    mjDescription: "Le Ver attend leur sortie."
  },
  // ÉTAPE 3
  {
    ref: "n3a",
    title: "3.a — Ossuaire",
    nodeType: "convergence",
    x: 400, y: 3100,
    sensoryText: "VISUEL : vaste ossuaire de métal, carcasses à perte de vue.\nBRUIT : vent sifflant dans la tôle (flûtes brisées).\nODEUR : décomposition ancienne, métal chauffé.",
    mjDescription: "Arrivée dans la dernière zone."
  },
  {
    ref: "n3b",
    title: "3.b — Convergence",
    nodeType: "intermediate",
    x: 400, y: 3250,
    sensoryText: "VISUEL : silhouettes des convois rivaux (Sel Blanc, Cendres) convergeant vers le même point.\nBRUIT : moteurs multiples grondant, nuages mêlés.",
    mjDescription: "Tous les survivants se rejoignent."
  },
  {
    ref: "n3c",
    title: "3.c — Obstacle final",
    nodeType: "intermediate",
    x: 400, y: 3400,
    sensoryText: "INDICE : terre remuée, ciel jaune sale, ou grincement de pont.",
    mjDescription: "Jet de Perception/Pilotage au dernier moment (pont effondré, mine, etc.)."
  },
  {
    ref: "n3d",
    title: "3.d — Sprint final",
    nodeType: "intermediate",
    x: 400, y: 3550,
    sensoryText: "VISUEL : épaves défilant, convois au coude à coude.\nBRUIT : moteurs au rupteur, tirs de désespoir.",
    mjDescription: "Incertitude totale sur l'arrivée."
  },
  {
    ref: "n3e",
    title: "3.e — Ultime apparition",
    nodeType: "intermediate",
    x: 400, y: 3700,
    sensoryText: "INDICE : Dernier tremblement, silence brutal par-dessus le sprint.",
    mjDescription: "(Optionnel) Jet d'Instinct pour esquiver la gueule du Ver juste devant les portes."
  },
  // ENDS
  {
    ref: "win",
    title: "Victoire - Recrutement",
    nodeType: "end",
    endOutcome: "success",
    x: 200, y: 3850,
    sensoryText: "Portes monumentales de la Cité ouvertes. Air filtré. Silence.",
    mjDescription: "Recrutés sans questions. Capitaine Rook Cendre les évalue. Personne ne parle du Convoi 5... pour l'instant."
  },
  {
    ref: "lose",
    title: "Défaite - Échec",
    nodeType: "end",
    endOutcome: "failure",
    x: 600, y: 3850,
    sensoryText: "Portes fermées, poussière des vainqueurs. Moqueries des Taudis.",
    mjDescription: "Échec mais possibilité d'être recrutés en renfort. Le coût doit être clair, mais ne bloque pas la campagne."
  }
];

const connectionsData = [
  { from: "n0a", to: "n0b" },
  { from: "n0b", to: "n0c" },
  { from: "n0c", to: "n0d" },
  { from: "n0d", to: "n1a", label: "Fuite" },
  { from: "n1a", to: "n1b" },
  { from: "n1b", to: "n1c" },
  { from: "n1c", to: "n1d" },
  { from: "n1d", to: "n1e" },
  { from: "n1e", to: "n15a" },
  { from: "n15a", to: "n15b" },
  { from: "n15b", to: "n15c" },
  { from: "n15c", to: "n15d" },
  { from: "n15d", to: "n15e" },
  // Branches
  { from: "n15e", to: "n2Aa", label: "Dunes Chantantes" },
  { from: "n15e", to: "n2Ba", label: "Passe du Sel Noir" },
  // Branch A
  { from: "n2Aa", to: "n2Ab" },
  { from: "n2Ab", to: "n2Ac" },
  { from: "n2Ac", to: "n2Ad" },
  { from: "n2Ad", to: "n2Ae" },
  { from: "n2Ae", to: "n2Af" },
  { from: "n2Af", to: "n3a", label: "Retour sur route" },
  // Branch B
  { from: "n2Ba", to: "n2Bb" },
  { from: "n2Bb", to: "n2Bc" },
  { from: "n2Bc", to: "n2Bd" },
  { from: "n2Bd", to: "n2Be" },
  { from: "n2Be", to: "n3a", label: "Retour sur route" },
  // Convergence
  { from: "n3a", to: "n3b" },
  { from: "n3b", to: "n3c" },
  { from: "n3c", to: "n3d" },
  { from: "n3d", to: "n3e" },
  // Fin
  { from: "n3e", to: "win", label: "Arrivée premier" },
  { from: "n3e", to: "lose", label: "Arrivée après" }
];

async function main() {
  const quest = await prisma.quest.findFirst({
    where: { name: "La Course du Sel (Quête d'ouverture)" }
  });

  if (!quest) {
    console.error("Quest not found");
    return;
  }

  // Clear existing nodes and connections
  await prisma.questNodeConnection.deleteMany({
    where: { fromNode: { questId: quest.id } }
  });
  await prisma.questNode.deleteMany({
    where: { questId: quest.id }
  });

  const nodeMap = {};

  for (const nd of nodesData) {
    const created = await prisma.questNode.create({
      data: {
        questId: quest.id,
        title: nd.title,
        nodeType: nd.nodeType,
        positionX: nd.x,
        positionY: nd.y,
        sensoryText: nd.sensoryText,
        mjDescription: nd.mjDescription,
        endOutcome: nd.endOutcome || null
      }
    });
    nodeMap[nd.ref] = created.id;
  }

  for (const conn of connectionsData) {
    await prisma.questNodeConnection.create({
      data: {
        fromNodeId: nodeMap[conn.from],
        toNodeId: nodeMap[conn.to],
        label: conn.label || ""
      }
    });
  }

  console.log("Detailed graph generated successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
