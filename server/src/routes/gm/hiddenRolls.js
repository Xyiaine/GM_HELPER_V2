// GM Helper — Jets cachés et scores passifs
//
// Les joueurs lancent leurs dés physiquement : l'application n'a donc rien à
// faire des jets visibles. Sa valeur est exactement là où le MJ doit calculer
// seul aujourd'hui — la Perception passive, qu'il faut connaître sans la
// demander, et les jets que le joueur ne doit pas voir.
//
// Rien de ce que produit cette route n'est diffusé : ni aux joueurs, ni à
// l'écran de table. Le résultat n'existe que sur l'écran du MJ.

const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { hiddenRollSchema } = require('../../validators/schemas');
const { computeCharacterRoll } = require('../../services/dice');
const { SKILL_ABILITY_MAP, parseCharacterSkills } = require('../../utils/dnd5eMath');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

/**
 * Score passif d'une compétence : 10 + modificateur, maîtrise et expertise
 * comprises. Même logique que `computeCharacterRoll`, pour qu'un score passif
 * et un jet ne puissent pas diverger.
 */
function passiveScore(character, skillKey) {
  const ability = SKILL_ABILITY_MAP[skillKey];
  if (!ability) return null;

  const score = character[ability];
  const base = typeof score === 'number' ? score : 10;
  const modifier = Math.floor((base - 10) / 2);

  const proficiencyLevel = Number(parseCharacterSkills(character)[skillKey]) || 0;
  const profBonus = character.proficiencyBonus || 2;

  let bonus = 0;
  if (proficiencyLevel >= 2) bonus = profBonus * 2;
  else if (proficiencyLevel === 1) bonus = profBonus;

  return 10 + modifier + bonus;
}

// GET /passive — scores passifs de tous les personnages de la campagne
//
// Répond à la question que le MJ se pose dix fois par séance : « qui remarque
// quelque chose, et à partir de quel seuil ? »
router.get('/passive', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    const characters = await prisma.character.findMany({
      where: { campaignId: req.campaignId },
      orderBy: { name: 'asc' },
    });

    const payload = characters.map((character) => ({
      id: character.id,
      name: character.name,
      level: character.level,
      passive: {
        perception: passiveScore(character, 'perception'),
        insight: passiveScore(character, 'insight'),
        investigation: passiveScore(character, 'investigation'),
      },
      // Le seuil de Perception passive le plus élevé du groupe : le MJ sait
      // immédiatement si quelqu'un remarque, sans interroger chaque joueur.
      skills: Object.fromEntries(
        Object.keys(SKILL_ABILITY_MAP).map((key) => [key, passiveScore(character, key)]),
      ),
    }));

    const highestPerception = payload.reduce(
      (best, entry) => (entry.passive.perception > (best ? best.passive.perception : -Infinity) ? entry : best),
      null,
    );

    res.json({
      characters: payload,
      group: {
        highestPerception: highestPerception
          ? { characterId: highestPerception.id, name: highestPerception.name, value: highestPerception.passive.perception }
          : null,
      },
    });
  } catch (err) {
    console.error('Passive scores error:', err);
    res.status(500).json({ error: 'Failed to compute passive scores' });
  }
});

// POST /roll — jet caché pour un personnage
router.post('/roll', validate(hiddenRollSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { characterId, type, ability, skill, advantage, disadvantage, dc, label } = req.body;

    const character = await prisma.character.findFirst({
      where: { id: characterId, campaignId: req.campaignId },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found in this campaign' });
    }

    let result;
    try {
      result = computeCharacterRoll(character, { type, ability, skill, advantage, disadvantage, label });
    } catch (computeErr) {
      return res.status(400).json({ error: computeErr.message });
    }

    const outcome = typeof dc === 'number'
      ? (result.total >= dc ? 'success' : 'failure')
      : null;

    // Le jet est consigné dans le journal de campagne pour alimenter le
    // récapitulatif de séance, mais jamais diffusé : c'est un jet caché.
    const liveSession = await prisma.session.findFirst({
      where: { campaignId: req.campaignId, status: 'live' },
      select: { id: true },
    });

    await prisma.sessionLog.create({
      data: {
        campaignId: req.campaignId,
        sessionId: liveSession ? liveSession.id : null,
        kind: 'dice',
        payload: {
          secret: true,
          characterId: character.id,
          characterName: character.name,
          label: result.label,
          expression: result.expression,
          total: result.total,
          dc: typeof dc === 'number' ? dc : null,
          outcome,
        },
      },
    }).catch((logErr) => {
      // Un journal indisponible ne doit pas empêcher le MJ d'obtenir son jet.
      console.error('Hidden roll log error:', logErr);
    });

    res.json({
      roll: {
        characterId: character.id,
        characterName: character.name,
        label: result.label,
        expression: result.expression,
        total: result.total,
        details: result.details,
        dc: typeof dc === 'number' ? dc : null,
        outcome,
      },
    });
  } catch (err) {
    console.error('Hidden roll error:', err);
    res.status(500).json({ error: 'Failed to roll' });
  }
});

module.exports = router;
