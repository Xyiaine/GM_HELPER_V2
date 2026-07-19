const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const quest = await prisma.quest.findFirst({
    where: { name: "La Course du Sel (Quête d'ouverture)" },
    include: { nodes: true }
  });

  if (!quest) {
    console.error("Quest not found");
    return;
  }

  const updates = [
    {
      title: "Étape 0 — La Fuite",
      sensoryText: `VISUEL : Tableau de bord fêlé qui vibre, sable giclant sous les pneus, horizon tanguant à travers le pare-brise constellé d'impacts. Un PJ posté à la tourelle, doigt crispé sur la détente, canon fumant. Au loin derrière, l'épave du Convoi 5 qui brûle en colonne de fumée noire.\n\nBRUIT : Moteur hurlant, vent claquant, sifflement aigu dans les oreilles (tympans sonnés). Détonations espacées dans le vide. Écho lointain de l'explosion.\n\nODEUR : Poudre brûlée collant à la gorge, relent chimique entêtant (presque sucré) et reste de vapeur âcre florale.\n\nINDICE VER : Crépitement des grains de sable sur le plancher, choc sourd et rythmique sous les sièges.`,
      mjDescription: `OUVERTURE IN MEDIAS RES : Les PJ sont amnésiques et n'ont aucun souvenir de pourquoi ils sont là. En réalité, ils viennent de détruire le Convoi 5 (Nostalgics) qui transportait des précurseurs neurochimiques.\n- Faites jouer le PJ à la tourelle qui réalise qu'il tire sans savoir pourquoi.\n- Ne révélez pas qu'ils sont responsables.\n- LE VER DES SABLES (BÉBÉ) approche : Si un joueur réagit à l'indice du sol qui tremble (avantage), sinon Jet de Perception/Vigilance. Le ver les prend en chasse dès l'ouverture, forçant la fuite immédiate.`
    },
    {
      title: "Étape 1 — La Route des Carcasses",
      sensoryText: `VISUEL : Cimetière de tôle, dizaines d'épaves rouillées. Mirage tremblant à l'horizon sous un ciel blanc et aveuglant. Un panache de fumée noire s'échappe du capot (panne).\n\nBRUIT : Grincement de tôle tordue, crissement du sable. Silence pesant coupé par un bourdonnement erratique d'insectes mutants. Toux métallique du moteur qui cale par à-coups.\n\nODEUR : Rouille chaude, sueur collante, pointe âcre de carburant rance, plastique fondant sur le tableau de bord.\n\nINDICE CONVOI : Panache de poussière lointain qui ne suit pas le vent.`,
      mjDescription: `1.c Poussière à l'horizon : Indice visuel. S'ils le remarquent, avantage, sinon Jet de Perception pour ne pas être surpris par le convoi rival.\n1.d Panne mécanique forcée : Répartition des tâches sous pression malgré la méfiance mutuelle.\n1.e Contact rival : Premier contact lointain avec les "Loups de Sel" ou la "Caravane du Sel Blanc", qui pourraient avoir vu l'explosion de l'Étape 0 et se poser des questions.`
    },
    {
      title: "Étape 1.5 — La Crevasse",
      sensoryText: `VISUEL : Mur ocre et électrique à l'horizon (tempête). Profonde crevasse de roche dure (seul endroit non fait de sable). À l'intérieur : obscurité étroite trouée de lumière.\n\nBRUIT : Air statique, silence brutal des insectes (indice tempête). Rugissement du moteur, puis écho de leur propre respiration contre la pierre froide. Hurlements étouffés d'un convoi lointain pris par le ver au-dehors.\n\nODEUR : Pierre humide et minérale, contraste brutal avec le sel chaud.\n\nINDICE CHANT : Un chant grave et continu qui n'est pas le vent.`,
      mjDescription: `1.5.a Tempête de sel : Indice de l'air statique. Jet Survie/Perception pour estimer le temps avant impact. Rouler dedans est mortel.\n1.5.b Abri rocheux : Les vers ne creusent pas la roche.\n1.5.c Attente : Temps mort forcé. Bon moment pour un Jet de Mémoire ou du RP.\n1.5.d Convoi condamné : Un convoi rival (ne pas identifier) se fait attaquer par le ver dans la tempête sous leurs yeux (pédagogie par l'exemple).\n1.5.e Chant des Adorateurs : Les Enfants du Sel observent. Jet Perception. Ils doivent ressortir avec l'idée d'avoir été observés.`
    },
    {
      title: "Étape 2A — Les Dunes Chantantes",
      sensoryText: `VISUEL : Dunes titanesques changeant de teinte. Motos jaillissant du sable avec éclats sur les lames. À la fin : silhouettes enveloppées sur les crêtes.\n\nBRUIT : Bourdonnement grave (chant des dunes). Rugissements des motos, tirs. \n\nODEUR : Sable propre, ozone électrique, poudre, sueur.\n\nINDICE EMBUSCADE : Pause imperceptible dans le chant, poussière anormale.\nINDICE VER : Le chant s'arrête net. Silence assourdissant.`,
      mjDescription: `2A.c Embuscade : Ashen Roka et les Loups de Sel attaquent. Jet Perception sur l'indice du chant qui marque une pause.\n2A.e Le Ver revient : Le chant omniprésent s'arrête NET (indice ultime). S'ils ne réagissent pas, Jet Perception/Instinct juste avant que le Ver ne surgisse AU MILIEU de l'affrontement, forçant une alliance temporaire.\n2A.f Enfants du Sel : Apparition pacifique des nomades après l'attaque. Semer le 1er indice sur l'homme du Nord (il n'a pas "d'ombre dans le chant").`
    },
    {
      title: "Étape 2B — La Passe du Sel Noir",
      sensoryText: `VISUEL : Sable vitrifié (anciennes bombes), noir et luisant, éclats coupants. Reflets verdâtres (radiations). Silhouettes casquées aux lunettes nocturnes luisantes (Cendres).\n\nBRUIT : Crissement verre-sable. Cliquetis erratique du compteur Geiger. Grondement sourd et frustré tournant autour du convoi à distance.\n\nODEUR : Ozone, métal brûlé, air toxique.\n\nINDICE RADIATION : Cliquetis inégal du Geiger, lueur verdâtre devant.`,
      mjDescription: `2B.a Verre noir : Le terrain fusionné tient le ver des sables à distance, mais apporte d'autres dangers.\n2B.c Poches de radiation : Indice du compteur. Jet Survie/Science pour esquiver, sinon irradiation.\n2B.d Les Cendres Silencieuses : Rencontre avec le convoi de Vray Cendres, guidée à l'instinct. Alliance prudente ou échange d'infos.\n2B.e Le Ver frustré : On le voit onduler à la limite du verre noir, incapable d'entrer mais attendant leur sortie. Tension continue.`
    },
    {
      title: "Étape 3 — Le Cimetière des Convois",
      sensoryText: `VISUEL : Vaste ossuaire de métal, carcasses à l'infini, os blanchis. Les convois rivaux convergent dans la poussière. Un obstacle bloque la route finale.\n\nBRUIT : Vent sifflant dans la tôle comme des flûtes brisées. Moteurs au rupteur, tirs désespérés.\n\nODEUR : Métal chauffé, ozone, décomposition ancienne.\n\nINDICE OBSTACLE : Terre remuée, ciel jaune ou pont grinçant.`,
      mjDescription: `3.b Convergence : Les survivants (Sel Blanc, Cendres) se retrouvent pour le finish.\n3.c L'obstacle final : Pont effondré ou tempête acide. Jet Perception/Pilotage au dernier moment pour passer.\n3.d Sprint : Maintien de l'incertitude totale sur l'ordre d'arrivée.\n3.e Climax (Optionnel) : Ultime charge du ver juste avant les portes (indice: dernier tremblement, Jet Instinct).`
    },
    {
      title: "Victoire - Recrutement",
      sensoryText: `VISUEL : Les portes de la Cité du Divertissement s'ouvrent, monumentales. Les gardes impassibles.\nBRUIT : Le silence après la course, moteurs coupés.\nODEUR : Air filtré de la cité, parfum lointain des Plaisirs de la Chair.`,
      mjDescription: `S'ils arrivent premiers : Recrutés en bloc sans questions. Personne ne fait le lien avec le Convoi 5 pour l'instant. Début de l'Acte 2 (infiltration, affectation). Le Capitaine Rook Cendre (Réseau) les évalue.`
    },
    {
      title: "Défaite - Échec",
      sensoryText: `VISUEL : Les portes se referment devant eux, ou ils arrivent dans la poussière des vainqueurs.\nBRUIT : Frustration, murmures moqueurs des habitants des Taudis à la lisière.\nODEUR : Sable, sueur et déception.`,
      mjDescription: `Ne pas bloquer la campagne : S'ils perdent, trouvez un biais. Renforts tardifs après pertes du vainqueur, acte héroïque remarqué, ou corruption. L'échec doit avoir un coût matériel/narratif mais la quête continue.`
    }
  ];

  for (const node of quest.nodes) {
    const updateData = updates.find(u => u.title === node.title);
    if (updateData) {
      await prisma.questNode.update({
        where: { id: node.id },
        data: {
          sensoryText: updateData.sensoryText,
          mjDescription: updateData.mjDescription
        }
      });
      console.log(`Updated node: ${node.title}`);
    }
  }

  console.log("All nodes updated successfully with exhaustive narrative elements!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
