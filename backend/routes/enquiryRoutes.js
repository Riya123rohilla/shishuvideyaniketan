const express = require('express');
const router = express.Router();
const axios = require('axios');
let db, admin;

try {
  const firebase = require('../config/firebase');
  db = firebase.db;
  admin = firebase.admin;
} catch (error) {
  console.error('Firebase module load error:', error.message);
}

const authMiddleware = require('../middleware/authMiddleware');

// Firestore REST API fallback
const FIREBASE_PROJECT_ID = 'redesign-bbbbf';
const FIRESTORE_API = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// @route   POST /api/enquiries
// @desc    Submit new enquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const enquiryData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || 'General Enquiry',
      message: message.trim(),
      status: 'new',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore REST API
    const firestoreDoc = {};
    Object.keys(enquiryData).forEach(key => {
      firestoreDoc[key] = { stringValue: String(enquiryData[key]) };
    });

    const response = await axios.post(
      `${FIRESTORE_API}/enquiries`,
      { fields: firestoreDoc },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
        timeout: 10000
      }
    );

    const docId = response.data.name.split('/').pop();
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: { _id: docId, ...enquiryData }
    });

  } catch (error) {
    console.error('[POST /enquiries]', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit enquiry' 
    });
  }
});

// @route   GET /api/enquiries
// @desc    Get all enquiries
// @access  Private (with fallback to public)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    
    // Use REST API to fetch documents
    let url = `${FIRESTORE_API}/enquiries?pageSize=100`;

    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    const enquiries = [];
    if (response.data.documents) {
      response.data.documents.forEach(doc => {
        const fields = doc.fields || {};
        enquiries.push({
          _id: doc.name.split('/').pop(),
          name: fields.name?.stringValue || '',
          email: fields.email?.stringValue || '',
          phone: fields.phone?.stringValue || '',
          subject: fields.subject?.stringValue || '',
          message: fields.message?.stringValue || '',
          status: fields.status?.stringValue || 'new',
          notes: fields.notes?.stringValue || '',
          createdAt: fields.createdAt?.stringValue || new Date().toISOString(),
          updatedAt: fields.updatedAt?.stringValue || new Date().toISOString()
        });
      });
    }

    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    // Return empty array on error instead of failing
    res.json({ success: true, count: 0, data: [] });
  }
});

// @route   GET /api/enquiries/:id
// @desc    Get single enquiry
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const docId = req.params.id;
    const docUrl = `${FIRESTORE_API}/enquiries/${docId}`;
    
    const response = await axios.get(docUrl, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    const fields = response.data.fields || {};
    const enquiry = {
      _id: response.data.name.split('/').pop(),
      name: fields.name?.stringValue || '',
      email: fields.email?.stringValue || '',
      phone: fields.phone?.stringValue || '',
      subject: fields.subject?.stringValue || '',
      message: fields.message?.stringValue || '',
      status: fields.status?.stringValue || 'new',
      notes: fields.notes?.stringValue || '',
      createdAt: fields.createdAt?.stringValue || new Date().toISOString(),
      updatedAt: fields.updatedAt?.stringValue || new Date().toISOString()
    };

    res.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('[GET /enquiries/:id]', error.message);
    res.status(404).json({ success: false, message: 'Enquiry not found' });
  }
});

// @route   PUT /api/enquiries/:id
// @desc    Update enquiry status/notes
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const docId = req.params.id;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    updateData.updatedAt = new Date().toISOString();

    // Build Firestore format
    const firestoreDoc = {};
    Object.keys(updateData).forEach(key => {
      firestoreDoc[key] = { stringValue: String(updateData[key]) };
    });

    const docUrl = `${FIRESTORE_API}/enquiries/${docId}`;
    await axios.patch(docUrl, { fields: firestoreDoc }, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    res.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error('[PUT /enquiries/:id]', error.message);
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete enquiry
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const docId = req.params.id;
    const docUrl = `${FIRESTORE_API}/enquiries/${docId}`;
    
    await axios.delete(docUrl, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('[DELETE /enquiries/:id]', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
});

module.exports = router;
