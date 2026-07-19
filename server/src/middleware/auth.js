// GM Helper — Authentication Middleware
// JWT verification, role checking, campaign access control

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from Authorization header or cookie.
 * Attaches user info to req.user
 */
function verifyToken(req, res, next) {
  // Try Authorization header first, then cookie
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      displayName: decoded.displayName,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Verify user has access to the campaign specified in params.
 * Attaches membership info to req.membership
 * Must be used AFTER verifyToken.
 */
async function requireCampaignAccess(req, res, next) {
  const campaignId = req.params.campaignId;
  if (!campaignId) {
    return res.status(400).json({ error: 'Campaign ID required' });
  }

  try {
    const prisma = req.app.get('prisma');
    const membership = await prisma.campaignMembership.findUnique({
      where: {
        campaignId_userId: {
          campaignId,
          userId: req.user.id,
        },
      },
    });

    if (!membership || membership.status !== 'active') {
      return res.status(403).json({ error: 'No access to this campaign' });
    }

    req.membership = membership;
    req.campaignId = campaignId;
    next();
  } catch (err) {
    console.error('Campaign access check error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Require GM role on the current campaign.
 * Must be used AFTER requireCampaignAccess.
 */
function requireGM(req, res, next) {
  if (!req.membership || req.membership.role !== 'GM') {
    return res.status(403).json({ error: 'GM access required' });
  }
  next();
}

/**
 * Require PLAYER role on the current campaign.
 * Must be used AFTER requireCampaignAccess.
 */
function requirePlayer(req, res, next) {
  if (!req.membership || req.membership.role !== 'PLAYER') {
    return res.status(403).json({ error: 'Player access required' });
  }
  next();
}

/**
 * Require either GM or PLAYER role (any campaign member).
 * Must be used AFTER requireCampaignAccess.
 */
function requireMember(req, res, next) {
  if (!req.membership) {
    return res.status(403).json({ error: 'Campaign membership required' });
  }
  next();
}

module.exports = {
  verifyToken,
  requireCampaignAccess,
  requireGM,
  requirePlayer,
  requireMember,
};
