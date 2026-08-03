const express = require('express');
const { requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { unlockSkillSchema } = require('../../validators/schemas');
const { getAllTrees, validateAndUnlockSkill } = require('../../services/skillTreeService');

const router = express.Router({ mergeParams: true });

router.use(requireCampaignAccess);

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

    const result = await validateAndUnlockSkill(character, nodeId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const updatedCharacter = await prisma.character.update({
      where: { id: character.id },
      data: {
        unlockedSkills: result.unlockedSkills,
        skillPoints: result.skillPoints,
      },
    });

    res.json({ success: true, character: updatedCharacter, unlockedNode: result.node });
  } catch (err) {
    console.error('Unlock skill error:', err);
    res.status(500).json({ error: 'Failed to unlock skill' });
  }
});

module.exports = router;

