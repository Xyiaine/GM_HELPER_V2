const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { requireCampaignAccess, requireGM } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(requireCampaignAccess);
router.use(requireGM);

// GET /api/v1/gm/campaigns/:campaignId/skill-trees
router.get('/', async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '../../data/skill_trees');
    const files = await fs.readdir(dataDir);
    const trees = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        trees.push(JSON.parse(content));
      }
    }

    res.json({ trees: trees.map(t => t.arbre) });
  } catch (err) {
    console.error('Fetch skill trees error:', err);
    res.status(500).json({ error: 'Failed to fetch skill trees' });
  }
});

module.exports = router;
