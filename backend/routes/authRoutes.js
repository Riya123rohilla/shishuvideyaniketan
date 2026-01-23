const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

// Hardcoded credentials as fallback (from .env)
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(`[AUTH] Login attempt: ${username}`);

    // First, try to get admin from Firestore
    let isValid = false;
    try {
      const adminRef = db.collection('admins').doc('admin');
      const adminDoc = await adminRef.get();

      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        console.log(`[AUTH] Admin found in Firestore, validating credentials...`);
        isValid = adminData.username === username && adminData.password === password;
      } else {
        console.log(`[AUTH] Admin not found in Firestore, checking hardcoded credentials...`);
        // Fall back to hardcoded credentials
        isValid = username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD;
        
        // If credentials match, save to Firestore for future use
        if (isValid) {
          try {
            await adminRef.set({
              username: DEFAULT_USERNAME,
              password: DEFAULT_PASSWORD,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            console.log(`[AUTH] Admin credentials saved to Firestore`);
          } catch (firestoreError) {
            console.warn(`[AUTH] Could not save to Firestore:`, firestoreError.message);
            // Continue anyway - credentials still valid
          }
        }
      }
    } catch (firestoreError) {
      console.warn(`[AUTH] Firestore error, using fallback credentials:`, firestoreError.message);
      // Use hardcoded credentials as fallback
      isValid = username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD;
    }

    // Validate credentials
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: 'admin', username: username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`[AUTH] Login successful for: ${username}`);

    res.json({
      success: true,
      token,
      admin: {
        id: 'admin',
        username: username
      }
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
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminRef = db.collection('admins').doc('admin');
    
    let adminDoc;
    try {
      adminDoc = await adminRef.get();
    } catch (error) {
      console.warn(`[AUTH] Could not fetch from Firestore:`, error.message);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (!adminDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const adminData = adminDoc.data();
    if (adminData.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    try {
      await adminRef.update({
        password: newPassword,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('[AUTH] Error updating password:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update password'
      });
    }

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
