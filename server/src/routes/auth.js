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
    { userId: user.id, email: user.email, displayName: user.displayName },
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
    const { email, password, displayName } = req.body;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: { email, passwordHash, displayName },
      select: { id: true, email: true, displayName: true, createdAt: true },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // Store refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiry,
      },
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    });
    const refreshToken = generateRefreshToken();

    // Store refresh token (clean up old ones first)
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

    // Set refresh token cookie
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
