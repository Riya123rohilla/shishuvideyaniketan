const express = require('express');
const router = express.Router();
const SheetService = require('../services/SheetService');
const authMiddleware = require('../middleware/authMiddleware');

const SHEET_TITLE = 'Enquiries';

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

    const newEnquiry = await SheetService.add(SHEET_TITLE, enquiryData);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: newEnquiry
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
    const enquiries = await SheetService.getAll(SHEET_TITLE);

    // Optional filtering if needed, though status query param is not strictly used in original fully
    // But we can filter
    let data = enquiries;
    if (status) {
      data = enquiries.filter(e => e.status === status);
    }

    // Sort by date desc
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, count: data.length, data: data });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.json({ success: true, count: 0, data: [] });
  }
});

// @route   GET /api/enquiries/:id
// @desc    Get single enquiry
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const enquiry = await SheetService.getById(SHEET_TITLE, req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('[GET /enquiries/:id]', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
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

    const updatedEnquiry = await SheetService.update(SHEET_TITLE, docId, updateData);

    if (!updatedEnquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, message: 'Updated successfully', data: updatedEnquiry });
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
    const success = await SheetService.remove(SHEET_TITLE, docId);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('[DELETE /enquiries/:id]', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
});

module.exports = router;
