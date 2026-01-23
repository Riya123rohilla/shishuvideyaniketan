const express = require('express');
const router = express.Router();
const axios = require('axios');
let db;

try {
  const firebase = require('../config/firebase');
  db = firebase.db;
} catch (error) {
  console.error('Firebase module load error:', error.message);
}

const authMiddleware = require('../middleware/authMiddleware');

// Firestore REST API
const FIREBASE_PROJECT_ID = 'redesign-bbbbf';
const FIRESTORE_API = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// @route   GET /api/events
// @desc    Get all active events
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Use REST API to fetch active events
    const response = await axios.get(`${FIRESTORE_API}/events?pageSize=100`, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    const events = [];
    if (response.data.documents) {
      response.data.documents.forEach(doc => {
        const fields = doc.fields || {};
        const isActive = fields.isActive?.booleanValue !== false;
        
        // Only include active events
        if (isActive) {
          events.push({
            _id: doc.name.split('/').pop(),
            title: fields.title?.stringValue || '',
            description: fields.description?.stringValue || '',
            startDate: fields.startDate?.stringValue || '',
            endDate: fields.endDate?.stringValue || '',
            image: fields.image?.stringValue || '',
            priority: parseInt(fields.priority?.integerValue || '0'),
            isActive: isActive,
            createdAt: fields.createdAt?.stringValue || new Date().toISOString(),
            updatedAt: fields.updatedAt?.stringValue || new Date().toISOString()
          });
        }
      });
    }

    // Sort by priority (desc) then by start date (desc)
    events.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return new Date(b.startDate) - new Date(a.startDate);
    });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.json({ success: true, count: 0, data: [] });
  }
});

// @route   GET /api/events/all
// @desc    Get all events (including inactive) - Admin only
// @access  Private
router.get('/all', authMiddleware, async (req, res) => {
  try {
    // Use REST API to fetch documents
    const response = await axios.get(`${FIRESTORE_API}/events?pageSize=100`, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    const events = [];
    if (response.data.documents) {
      response.data.documents.forEach(doc => {
        const fields = doc.fields || {};
        events.push({
          _id: doc.name.split('/').pop(),
          title: fields.title?.stringValue || '',
          description: fields.description?.stringValue || '',
          startDate: fields.startDate?.stringValue || '',
          endDate: fields.endDate?.stringValue || '',
          image: fields.image?.stringValue || '',
          priority: parseInt(fields.priority?.integerValue || '0'),
          isActive: fields.isActive?.booleanValue !== false,
          createdAt: fields.createdAt?.stringValue || new Date().toISOString(),
          updatedAt: fields.updatedAt?.stringValue || new Date().toISOString()
        });
      });
    }

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    // Return empty array on error instead of failing
    res.json({ success: true, count: 0, data: [] });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const response = await axios.get(`${FIRESTORE_API}/events/${docId}`, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    const fields = response.data.fields || {};
    const event = {
      _id: response.data.name.split('/').pop(),
      title: fields.title?.stringValue || '',
      description: fields.description?.stringValue || '',
      startDate: fields.startDate?.stringValue || '',
      endDate: fields.endDate?.stringValue || '',
      image: fields.image?.stringValue || '',
      priority: parseInt(fields.priority?.integerValue || '0'),
      isActive: fields.isActive?.booleanValue !== false,
      createdAt: fields.createdAt?.stringValue || new Date().toISOString(),
      updatedAt: fields.updatedAt?.stringValue || new Date().toISOString()
    };

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Event not found' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, startDate, endDate, image, priority } = req.body;

    const eventData = {
      title: title || '',
      description: description || '',
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date().toISOString(),
      image: image || '',
      isActive: true,
      priority: priority || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Convert to Firestore REST API format
    const firestoreDoc = {
      fields: {
        title: { stringValue: eventData.title },
        description: { stringValue: eventData.description },
        startDate: { stringValue: eventData.startDate },
        endDate: { stringValue: eventData.endDate },
        image: { stringValue: eventData.image },
        isActive: { booleanValue: eventData.isActive },
        priority: { integerValue: String(eventData.priority) },
        createdAt: { stringValue: eventData.createdAt },
        updatedAt: { stringValue: eventData.updatedAt }
      }
    };

    const response = await axios.post(`${FIRESTORE_API}/events`, firestoreDoc, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    const docId = response.data.name.split('/').pop();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { _id: docId, ...eventData }
    });
  } catch (error) {
    console.error('Event creation error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event' 
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, startDate, endDate, image, isActive, priority } = req.body;
    const docId = req.params.id;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (priority !== undefined) updateData.priority = priority;
    updateData.updatedAt = new Date().toISOString();

    // Convert to Firestore format
    const firestoreDoc = { fields: {} };
    Object.keys(updateData).forEach(key => {
      if (key === 'isActive') {
        firestoreDoc.fields[key] = { booleanValue: updateData[key] };
      } else if (key === 'priority') {
        firestoreDoc.fields[key] = { integerValue: String(updateData[key]) };
      } else {
        firestoreDoc.fields[key] = { stringValue: String(updateData[key]) };
      }
    });

    const docUrl = `${FIRESTORE_API}/events/${docId}`;
    await axios.patch(docUrl, firestoreDoc, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    res.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Event update error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update event' 
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const docId = req.params.id;
    const docUrl = `${FIRESTORE_API}/events/${docId}`;

    await axios.delete(docUrl, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: 'AIzaSyBp4EGFLyzZPAzAM45DopE-1TCZfo_yihg' },
      timeout: 10000
    });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Event deletion error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event' 
    });
  }
});

module.exports = router;
