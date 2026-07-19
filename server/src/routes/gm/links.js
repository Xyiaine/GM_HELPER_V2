// GM Helper — GM Entity Link Routes (Universal linking system)
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createEntityLinkSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

// GET / — List links (optionally filtered by entity)
router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { entityType, entityId } = req.query;
    const where = { campaignId: req.campaignId };

    if (entityType && entityId) {
      where.OR = [
        { sourceEntityType: entityType, sourceEntityId: entityId },
        { targetEntityType: entityType, targetEntityId: entityId },
      ];
    }

    const links = await prisma.entityLink.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ links });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list links' });
  }
});

// POST / — Create a link
router.post('/', validate(createEntityLinkSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const link = await prisma.entityLink.create({
      data: { ...req.body, campaignId: req.campaignId },
    });
    res.status(201).json({ link });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Link already exists' });
    res.status(500).json({ error: 'Failed to create link' });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.entityLink.deleteMany({
      where: { id: req.params.id, campaignId: req.campaignId },
    });
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

module.exports = router;
