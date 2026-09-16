const express = require('express');
const { verifyToken, requireCampaignAccess } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { unlockSkillSchema } = require('../../validators/schemas');
const { getAllTrees, validateAndUnlockSkill } = require('../../services/skillTreeService');
const { deriveProgression } = require('../../utils/hybridProgression');

const router = express.Router({ mergeParams: true });

// This router was the only GM router missing `verifyToken`. Without it, req.user
// is never populated, so `requireCampaignAccess` threw on `req.user.id` and every
// request returned a 500 — the whole skill tree feature was unreachable.
router.use(verifyToken, requireCampaignAccess);

// GET /api/v1/gm/campaigns/:campaignId/skill-trees
router.get('/', async (req, res) => {
  try {
    const trees = await getAllTrees();
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes HTTP caching hint
    res.json({ trees });
  } catch (err) {
    console.error('Fetch skill trees error:', err);
    res.status(500).json({ error: 'Failed to fetch skill trees' });
  }
});

// POST /api/v1/gm/campaigns/:campaignId/skill-trees/characters/:characterId/unlock
router.post('/characters/:characterId/unlock', validate(unlockSkillSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { nodeId } = req.body;

    const character = await prisma.character.findFirst({
      where: { id: req.params.characterId, campaignId: req.campaignId },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found in this campaign' });
    }

    // This route previously accepted any campaign member: a player could spend
    // the skill points of another player's character. Only the GM of the campaign
    // or the owner of the character may unlock a node.
    const isGM = req.membership && req.membership.role === 'GM';
    const isOwner = character.ownerUserId && character.ownerUserId === req.user.id;

    if (!isGM && !isOwner) {
      return res.status(403).json({ error: 'Only the GM or the character owner can unlock a skill' });
    }

    const result = await validateAndUnlockSkill(character, nodeId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Level and proficiency bonus are derived from the unlocked nodes. They used
    // to be left untouched, so a player could spend points and see no progression.
    const progression = deriveProgression(result.unlockedSkills);

    const updatedCharacter = await prisma.character.update({
      where: { id: character.id },
      data: {
        unlockedSkills: result.unlockedSkills,
        skillPoints: result.skillPoints,
        level: progression.level,
        proficiencyBonus: progression.proficiencyBonus,
      },
    });

    res.json({
      success: true,
      character: updatedCharacter,
      unlockedNode: result.node,
      progression,
    });
  } catch (err) {
    console.error('Unlock skill error:', err);
    res.status(500).json({ error: 'Failed to unlock skill' });
  }
});

module.exports = router;
