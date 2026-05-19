const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SheetService = require('../services/SheetService');
const authMiddleware = require('../middleware/authMiddleware');

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME;
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SHEET_TITLE = 'Admins';

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!DEFAULT_USERNAME || !DEFAULT_PASSWORD || !JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server auth configuration is missing'
      });
    }

    console.log(`[AUTH] Login attempt: ${identifier}`);

    let isValid = false;
    let adminUser = null;

    try {
      let existingAdmin = null;
      try {
        existingAdmin = await SheetService.getByUsername(identifier);
      } catch (sheetFetchErr) {
        console.warn(`[AUTH] Could not fetch from Sheet, trying env fallback:`, sheetFetchErr.message);
      }

      if (existingAdmin) {
        // Check hashed password first, fallback to plain text for migration
        if (existingAdmin.password && (existingAdmin.password.startsWith('$2a$') || existingAdmin.password.startsWith('$2b$'))) {
          isValid = await bcrypt.compare(password, existingAdmin.password);
        } else if (existingAdmin.password) {
          // Plain text password (legacy) - migrate to hashed
          isValid = existingAdmin.password === password;
          if (isValid) {
            try {
              const hashedPassword = await bcrypt.hash(password, 10);
              await SheetService.update(ADMIN_SHEET_TITLE, existingAdmin._id, {
                password: hashedPassword,
                updatedAt: new Date().toISOString()
              });
              console.log(`[AUTH] Migrated password to hashed for: ${identifier}`);
            } catch (migErr) {
              console.warn(`[AUTH] Migration failed but login proceeding:`, migErr.message);
            }
          }
        }
        adminUser = existingAdmin;
      }

      // Fallback to env default credentials if sheet login failed or admin not found
      if (!isValid && identifier === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        isValid = true;
        console.log(`[AUTH] Logged in using ENV credentials`);

        // Try to sync with sheet if not already there
        if (!adminUser) {
          try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const isEmail = identifier.includes('@');
            adminUser = await SheetService.add(ADMIN_SHEET_TITLE, {
              username: isEmail ? 'admin' : identifier,
              email: isEmail ? identifier : '',
              password: hashedPassword
            });
            console.log(`[AUTH] Admin credentials synced to Sheet`);
          } catch (syncErr) {
            console.warn(`[AUTH] Sync to sheet failed:`, syncErr.message);
          }
        }
      }
    } catch (err) {
      console.error(`[AUTH] Unexpected error in login logic:`, err);
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const payload = {
      id: adminUser ? adminUser._id : 'admin_default',
      username: adminUser ? adminUser.username : identifier
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    console.log(`[AUTH] Login successful for: ${identifier}`);

    res.json({
      success: true,
      token,
      admin: payload
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const adminUser = await SheetService.getByUsername(req.admin.username || DEFAULT_USERNAME);

    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found in records'
      });
    }

    // Verify current password (hashed or plain text)
    let currentPasswordValid = false;
    if (adminUser.password.startsWith('$2a$') || adminUser.password.startsWith('$2b$')) {
      currentPasswordValid = await bcrypt.compare(currentPassword, adminUser.password);
    } else {
      currentPasswordValid = adminUser.password === currentPassword;
    }

    if (!currentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await SheetService.update(ADMIN_SHEET_TITLE, adminUser._id, {
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('[AUTH] Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
