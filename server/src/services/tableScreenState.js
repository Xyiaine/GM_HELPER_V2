// GM Helper — État de l'écran de table
//
// L'écran de table est le seul support numérique partagé par la tablée : les
// joueurs n'ont que leur fiche papier. Il doit donc porter à lui seul ce que
// tout le monde regarde — l'illustration de la scène en cours, et en combat la
// carte de la rencontre avec l'ordre d'initiative.
//
// Cette fonction est la source unique de ce que l'écran a le droit de montrer.
// Elle sert à la fois au chargement initial (REST) et aux mises à jour poussées
// en cours de séance (Socket.IO), pour qu'un rafraîchissement ne révèle jamais
// autre chose que ce qui était déjà à l'écran.

const { filterEncounterForPublic, filterQuestNodeForPublic } = require('../utils/publicPayload');
const { getActiveTimerNodeIds } = require('./questTimers');

// Ordre canonique des combattants, identique à celui des routes de rencontre :
// `currentTurnIndex` est un index dans cette liste, toute divergence décalerait
// le tour affiché par rapport au tour réel.
const COMBATANT_ORDER = [{ initiative: 'desc' }, { orderIndex: 'asc' }];

/**
 * Construit l'état complet de l'écran de table à partir du jeton de session.
 *
 * @param {object} prisma Client Prisma
 * @param {string} token Jeton de l'écran de table
 * @returns {Promise<object|null>} `null` si le jeton est invalide ou la session close
 */
async function buildTableScreenState(prisma, token) {
  const session = await prisma.session.findFirst({
    where: { tableScreenToken: token, status: 'live' },
    include: {
      campaign: { select: { id: true, name: true, gameSystem: true } },
    },
  });

  if (!session) return null;

  const campaignId = session.campaignId;
  const activeTimerIds = getActiveTimerNodeIds();

  const [broadcasts, currentNode, encounter, timerNodes] = await Promise.all([
    prisma.spotlightBroadcast.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 40,
    }),

    // Scène courante : le dernier nœud atteint de la campagne. Le MJ marque un
    // nœud atteint en menant la partie, ce qui fait avancer l'écran de table
    // sans qu'il ait à pousser quoi que ce soit à la main.
    prisma.questNode.findFirst({
      where: { status: 'reached', quest: { campaignId } },
      orderBy: { reachedAt: 'desc' },
      include: { quest: { select: { id: true, name: true, imageUrl: true } } },
    }),

    session.activeEncounterId
      ? prisma.encounter.findUnique({
          where: { id: session.activeEncounterId },
          include: { combatants: { orderBy: COMBATANT_ORDER } },
        })
      : null,

    // Seuls les minuteurs que le MJ a explicitement rendus visibles arrivent
    // jusqu'à la table.
    activeTimerIds.length
      ? prisma.questNode.findMany({
          where: {
            id: { in: activeTimerIds },
            quest: { campaignId },
            timerVisibleToPlayers: true,
          },
          select: { id: true, title: true, timerDurationSeconds: true, reachedAt: true },
        })
      : [],
  ]);

  const timers = timerNodes
    .map((n) => {
      const startedAt = n.reachedAt ? new Date(n.reachedAt).getTime() : Date.now();
      const expiresAt = new Date(startedAt + (n.timerDurationSeconds || 0) * 1000);
      return {
        nodeId: n.id,
        title: n.title,
        duration: n.timerDurationSeconds,
        expiresAt,
      };
    })
    .filter((t) => t.expiresAt.getTime() > Date.now());

  return {
    session: {
      id: session.id,
      mode: session.mode,
      startedAt: session.startedAt,
      shareInitiative: session.shareInitiative,
    },
    campaign: {
      id: session.campaign.id,
      name: session.campaign.name,
      gameSystem: session.campaign.gameSystem,
    },
    broadcasts,
    scene: currentNode ? filterQuestNodeForPublic(currentNode, currentNode.quest) : null,
    encounter: filterEncounterForPublic(encounter),
    timers,
  };
}

/**
 * État réduit à la seule scène courante, pour une poussée en cours de séance.
 * Évite de renvoyer tout l'historique de diffusion à chaque changement de nœud.
 */
async function buildCurrentScene(prisma, campaignId) {
  const node = await prisma.questNode.findFirst({
    where: { status: 'reached', quest: { campaignId } },
    orderBy: { reachedAt: 'desc' },
    include: { quest: { select: { id: true, name: true, imageUrl: true } } },
  });

  return node ? filterQuestNodeForPublic(node, node.quest) : null;
}

module.exports = {
  buildTableScreenState,
  buildCurrentScene,
};
