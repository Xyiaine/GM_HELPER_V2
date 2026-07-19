const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { verifyToken, requireCampaignAccess, requireGM } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // We could make subfolders per campaign, but keeping it flat for now
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = crypto.randomBytes(8).toString('hex') + '-' + Date.now();
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

router.use(verifyToken, requireCampaignAccess, requireGM);

// POST /api/v1/gm/campaigns/:campaignId/uploads
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the URL to access the file
    // Assumes server is accessible directly. In a real app, you might want full domain.
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({ url: fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

module.exports = router;
