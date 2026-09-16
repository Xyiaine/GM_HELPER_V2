// GM Helper — Distribution des récompenses
//
// Transforme les récompenses planifiées sur un nœud de quête en modifications
// réelles des fiches de personnage. Chaque distribution est consignée dans le
// journal de séance et notifiée aux joueurs concernés.

const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { distributeRewardsSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// ============================================================
// Helpers
// ============================================================

function parseCurrency(json) {
  try { return JSON.parse(json || '{}'); }
  catch { return { cp: 0, sp: 0, gp: 0, pp: 0 }; }
}

function serializeCurrency(cur) {
  return JSON.stringify(cur);
}

async function applyItemReward(prisma, campaignId, characterId, rewardValue) {
  // rewardValue peut être un ID d'item existant ou une description libre.
  let item = await prisma.item.findFirst({
    where: { id: rewardValue.trim(), campaignId },
  });

  if (!item) {
    // Aucun item existant : on crée un objet générique portant la description.
    item = await prisma.item.create({
      data: {
        campaignId,
        name: rewardValue.trim().slice(0, 100),
        type: 'misc',
        rarity: 'common',
        description: rewardValue.trim(),
      },
    });
  }

  const existing = await prisma.characterInventoryItem.findFirst({
    where: { characterId, itemId: item.id },
  });

  if (existing) {
    await prisma.characterInventoryItem.update({
      where: { id: existing.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.characterInventoryItem.create({
      data: { characterId, itemId: item.id, quantity: 1 },
    });
  }

  return { itemId: item.id, itemName: item.name };
}

async function applyGoldReward(prisma, characterId, rewardValue) {
  const amount = parseInt(rewardValue, 10) || 0;
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: { currency: true },
  });
  const cur = parseCurrency(character?.currency);
  cur.gp = (cur.gp || 0) + amount;
  await prisma.character.update({
    where: { id: characterId },
    data: { currency: serializeCurrency(cur) },
  });
  return { amount, unit: 'gp' };
}

async function applyXpReward(prisma, characterId, rewardValue) {
  const amount = parseInt(rewardValue, 10) || 0;
  await prisma.character.update({
    where: { id: characterId },
    data: { skillPoints: { increment: amount } },
  });
  return { amount };
}

async function applyNpcFavorReward(prisma, questId, rewardValue) {
  // rewardValue attendu : "factionName:amount" ou juste un nombre (ajouté à la
  // faction principale de la quête).
  const parts = rewardValue.split(':');
  const amount = parseInt(parts[parts.length - 1], 10) || 0;
  const factionName = parts.length > 1 ? parts[0].trim() : null;

  if (factionName) {
    const existing = await prisma.questFactionProgress.findFirst({
      where: { questId, factionName },
    });
    if (existing) {
      await prisma.questFactionProgress.update({
        where: { id: existing.id },
        data: {
          progressValue: Math.min(100, existing.progressValue + amount),
          lastUpdatedNodeId: questId,
        },
      });
    } else {
      await prisma.questFactionProgress.create({
        data: {
          questId,
          factionName,
          progressValue: Math.min(100, amount),
          lastUpdatedNodeId: questId,
        },
      });
    }
    return { factionName, amount };
  }

  return { factionName: null, amount };
}

async function applyInformationReward(prisma, campaignId, rewardValue) {
  const note = await prisma.note.create({
    data: {
      campaignId,
      title: 'Information découverte',
      content: rewardValue.trim(),
      visibleByPlayers: true,
    },
  });
  return { noteId: note.id };
}

// ============================================================
// POST /gm/campaigns/:campaignId/quests/:questId/nodes/:nodeId/distribute
// ============================================================

router.post('/:questId/nodes/:nodeId/distribute', validate(distributeRewardsSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const io = req.app.get('io');
    const { campaignId, questId, nodeId } = req.params;
    const { distributions } = req.body;

    // Vérifier que le nœud existe et est atteint
    const node = await prisma.questNode.findFirst({
      where: { id: nodeId, questId, quest: { campaignId } },
      include: { rewards: true, quest: { select: { name: true } } },
    });

    if (!node) {
      return res.status(404).json({ error: 'Nœud introuvable' });
    }

    if (node.status !== 'reached') {
      return res.status(400).json({ error: 'Le nœud doit être atteint avant de distribuer des récompenses' });
    }

    // Précharger les personnages de la campagne
    const characterIds = [...new Set(distributions.flatMap((d) => d.characterIds))];
    const characters = await prisma.character.findMany({
      where: { id: { in: characterIds }, campaignId },
      select: { id: true, name: true },
    });
    const characterMap = new Map(characters.map((c) => [c.id, c]));

    const results = [];
    const liveSession = await prisma.session.findFirst({
      where: { campaignId, status: 'live' },
      select: { id: true },
    });

    for (const dist of distributions) {
      const reward = node.rewards.find((r) => r.id === dist.rewardId);
      if (!reward) {
        results.push({ rewardId: dist.rewardId, error: 'Récompense introuvable sur ce nœud' });
        continue;
      }

      for (const charId of dist.characterIds) {
        const character = characterMap.get(charId);
        if (!character) {
          results.push({ rewardId: reward.id, characterId: charId, error: 'Personnage introuvable' });
          continue;
        }

        let applied = null;
        try {
          switch (reward.rewardType) {
            case 'item':
              applied = await applyItemReward(prisma, campaignId, charId, reward.rewardValue);
              break;
            case 'gold':
              applied = await applyGoldReward(prisma, charId, reward.rewardValue);
              break;
            case 'xp':
              applied = await applyXpReward(prisma, charId, reward.rewardValue);
              break;
            case 'npcFavor':
              applied = await applyNpcFavorReward(prisma, questId, reward.rewardValue);
              break;
            case 'information':
              applied = await applyInformationReward(prisma, campaignId, reward.rewardValue);
              break;
            default:
              applied = { raw: reward.rewardValue };
          }
        } catch (applyErr) {
          console.error('Reward application error:', applyErr);
          results.push({
            rewardId: reward.id,
            characterId: charId,
            rewardType: reward.rewardType,
            error: applyErr.message,
          });
          continue;
        }

        // Journal de séance
        await prisma.sessionLog.create({
          data: {
            campaignId,
            sessionId: liveSession ? liveSession.id : null,
            kind: 'reward',
            payload: {
              questId,
              nodeId,
              questName: node.quest.name,
              nodeTitle: node.title,
              rewardId: reward.id,
              rewardType: reward.rewardType,
              rewardValue: reward.rewardValue,
              characterId: charId,
              characterName: character.name,
              applied,
            },
          },
        }).catch((logErr) => {
          console.error('SessionLog reward error:', logErr);
        });

        results.push({
          rewardId: reward.id,
          characterId: charId,
          characterName: character.name,
          rewardType: reward.rewardType,
          applied,
        });

        // Notification au joueur concerné (et à l'écran de table)
        io.to(`campaign:${campaignId}:player`).emit('player:reward_received', {
          characterId: charId,
          characterName: character.name,
          rewardType: reward.rewardType,
          rewardValue: reward.rewardValue,
          questName: node.quest.name,
          nodeTitle: node.title,
          applied,
        });
      }
    }

    res.json({ distributed: results });
  } catch (err) {
    console.error('Distribute rewards error:', err);
    res.status(500).json({ error: 'Erreur lors de la distribution des récompenses' });
  }
});

// ============================================================
// GET /gm/campaigns/:campaignId/quests/:questId/nodes/:nodeId/rewards
// (liste des récompenses d'un nœud — déjà présent dans quests.js, mais
//  factorisé ici pour cohérence si besoin)
// ============================================================

module.exports = router;
