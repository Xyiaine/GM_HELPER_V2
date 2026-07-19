// GM Helper — GM Tag Routes
const express = require('express');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { createTagSchema } = require('../../validators/schemas');

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireCampaignAccess, requireGM);

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const tags = await prisma.tag.findMany({
      where: { campaignId: req.campaignId },
      orderBy: { name: 'asc' },
    });
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list tags' });
  }
});

router.post('/', validate(createTagSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const tag = await prisma.tag.create({
      data: { ...req.body, campaignId: req.campaignId },
    });
    res.status(201).json({ tag });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Tag already exists' });
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const tag = await prisma.tag.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ tag });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.tag.delete({ where: { id: req.params.id } });
    // Also delete entity tag associations
    await prisma.entityTag.deleteMany({ where: { tagId: req.params.id } });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

// Apply/remove tag to entity
router.post('/:id/apply', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { entityType, entityId } = req.body;
    const entityTag = await prisma.entityTag.create({
      data: { tagId: req.params.id, entityType, entityId },
    });
    res.status(201).json({ entityTag });
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Tag already applied' });
    res.status(500).json({ error: 'Failed to apply tag' });
  }
});

router.post('/:id/remove', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { entityType, entityId } = req.body;
    await prisma.entityTag.deleteMany({
      where: { tagId: req.params.id, entityType, entityId },
    });
    res.json({ message: 'Tag removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove tag' });
  }
});

module.exports = router;
