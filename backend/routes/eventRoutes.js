const express = require('express');
const router = express.Router();
const SheetService = require('../services/SheetService');
const authMiddleware = require('../middleware/authMiddleware');

const SHEET_TITLE = 'Events';

// @route   GET /api/events
// @desc    Get all active events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await SheetService.getAll(SHEET_TITLE);

    // Filter active events and sort
    const activeEvents = events.filter(e => e.isActive === 'TRUE' || e.isActive === true || e.isActive === 'true');

    // Sort by priority (desc) then by start date (desc)
    activeEvents.sort((a, b) => {
      const pA = parseInt(a.priority) || 0;
      const pB = parseInt(b.priority) || 0;
      if (pB !== pA) return pB - pA;
      return new Date(b.startDate) - new Date(a.startDate);
    });

    res.json({
      success: true,
      count: activeEvents.length,
      data: activeEvents
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.json({ success: true, count: 0, data: [] });
  }
});

// @route   GET /api/events/all
// @desc    Get all events (including inactive) - Admin only
// @access  Private
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const events = await SheetService.getAll(SHEET_TITLE);
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.json({ success: true, count: 0, data: [] });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await SheetService.getById(SHEET_TITLE, req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, startDate, endDate, image, priority, visibilityDays } = req.body;

    const eventData = {
      title: title || '',
      description: description || '',
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date().toISOString(),
      image: image || '',
      visibilityDays: visibilityDays || 30,
      isActive: 'TRUE', // Store as string 'TRUE' for sheets compatibility if needed, but 'true' string is fine
      priority: priority || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newEvent = await SheetService.add(SHEET_TITLE, eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
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
    const { title, description, startDate, endDate, image, isActive, priority, visibilityDays } = req.body;
    const docId = req.params.id;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = String(isActive).toUpperCase(); // 'TRUE' or 'FALSE'
    if (priority !== undefined) updateData.priority = priority;
    if (visibilityDays !== undefined) updateData.visibilityDays = visibilityDays;
    updateData.updatedAt = new Date().toISOString();

    const updatedEvent = await SheetService.update(SHEET_TITLE, docId, updateData);

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
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
    const success = await SheetService.remove(SHEET_TITLE, docId);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

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

// @route   POST /api/events/cleanup/expired
// @desc    Delete events that have exceeded their visibility duration
// @access  Private (admin)
router.post('/cleanup/expired', authMiddleware, async (req, res) => {
  try {
    const allEvents = await SheetService.getAll(SHEET_TITLE);
    const today = new Date();
    let deletedCount = 0;

    for (const event of allEvents) {
      // Check if event has visibility duration set
      if (event.createdAt && event.visibilityDays) {
        const createdDate = new Date(event.createdAt);
        const visibilityExpireDate = new Date(createdDate.getTime() + (event.visibilityDays * 24 * 60 * 60 * 1000));

        // If visibility duration has expired, delete the event
        if (today > visibilityExpireDate) {
          try {
            await SheetService.remove(SHEET_TITLE, event._id || event.id);
            deletedCount++;
            console.log(`✅ Deleted expired event: ${event.title}`);
          } catch (error) {
            console.error(`❌ Failed to delete event ${event.title}:`, error.message);
          }
        }
      }
    }

    res.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} expired events.`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Cleanup error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup expired events'
    });
  }
});

module.exports = router;
