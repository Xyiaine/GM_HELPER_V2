// GM Helper — Auth Routes
// POST /api/v1/auth/register, login, refresh, logout

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/schemas');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const SALT_ROUNDS = 12;

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

// ============================================================
// POST /register
// ============================================================
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { firstName, lastName, pseudo, displayName, email, password } = req.body;

    const userDisplayName = pseudo || displayName;
    if (!userDisplayName) {
      return res.status(400).json({ error: 'Le pseudo est requis' });
    }

    const userEmail = email || `${userDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}@gmhelper.local`;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userEmail },
          { displayName: userDisplayName },
        ],
      },
    });
    if (existing) {
      return res.status(409).json({ error: 'Ce pseudo est déjà utilisé' });
    }

    const passwordHash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

    const user = await prisma.user.create({
      data: {
        email: userEmail,
        passwordHash,
        displayName: userDisplayName,
        firstName: firstName || null,
        lastName: lastName || null,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiry,
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    res.status(201).json({
      user,
      accessToken,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ============================================================
// POST /login
// ============================================================
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { email, pseudo, password } = req.body;
    const identifier = pseudo || email;

    if (!identifier) {
      return res.status(400).json({ error: 'Identifiant (pseudo ou email) requis' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { displayName: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    if (user.passwordHash) {
      if (!password) {
        return res.status(401).json({ error: 'Mot de passe requis pour ce compte' });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
        expiresAt: { lt: new Date() },
      },
    });

    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiry,
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================================================
// POST /refresh
// ============================================================
router.post('/refresh', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Find and validate refresh token
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!stored || stored.expiresAt < new Date()) {
      // Clean up expired token
      if (stored) {
        await prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: stored.userId },
      select: { id: true, email: true, displayName: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Rotate refresh token (invalidate old, create new)
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const newRefreshToken = generateRefreshToken();
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: refreshExpiry,
      },
    });

    // Generate new access token
    const accessToken = generateAccessToken(user);

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    res.json({ user, accessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// ============================================================
// POST /logout
// ============================================================
router.post('/logout', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const token = req.cookies?.refreshToken;
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ============================================================
// GET /me — Get current user info
// ============================================================
router.get('/me', verifyToken, async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        memberships: {
          select: {
            campaignId: true,
            role: true,
            status: true,
            campaign: {
              select: { id: true, name: true, description: true },
            },
          },
          where: { status: 'active' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

module.exports = router;
