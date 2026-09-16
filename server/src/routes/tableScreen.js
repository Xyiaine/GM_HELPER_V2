const express = require('express');
const { buildTableScreenState } = require('../services/tableScreenState');

const router = express.Router();

// GET /api/v1/table-screen/:token
//
// Aucun `verifyToken` : l'écran de table s'authentifie par possession du jeton
// de session. Il est projeté sur une télévision, sans compte utilisateur.
//
// La route ne renvoyait auparavant que l'identifiant et le mode de la session
// ainsi que les diffusions : le nom de la campagne, la scène en cours, la
// rencontre active et les minuteurs manquaient, alors que le composant client
// les attendait. L'écran restait donc sur un fond noir permanent.
router.get('/:token', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const state = await buildTableScreenState(prisma, req.params.token);

    if (!state) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    res.json(state);
  } catch (err) {
    console.error('Table screen error:', err);
    res.status(500).json({ error: 'Failed to load table screen data' });
  }
});

module.exports = router;
