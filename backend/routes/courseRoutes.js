const express = require('express');
const router = express.Router();
const SheetService = require('../services/SheetService');
const authMiddleware = require('../middleware/authMiddleware');

const SHEET_TITLE = 'Courses';

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const courses = await SheetService.getAll(SHEET_TITLE);

        // Parse JSON fields if SheetService returns them stringified?
        // SheetService now automatically parses JSON fields in `getAll`.

        // Sort or filter?
        // Maybe sort by grade level logic? For now default sort.

        res.json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const course = await SheetService.getById(SHEET_TITLE, req.params.id);
        // Also try by 'code' or custom 'id' field if not found by _id?
        // Our frontend uses string IDs like 'class-1-foundation'. 
        // If we migrate data to sheet, they will have UUIDs OR we can use the 'id' column as _id?
        // SheetService generates _id (UUID).
        // If we want to support the old IDs, we might need to search by another field.

        if (!course) {
            // Fallback search by 'id' logic if needed?
            // But let's assume valid ID is passed.
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json({ success: true, data: course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newCourse = await SheetService.add(SHEET_TITLE, req.body);
        res.status(201).json({
            success: true,
            data: newCourse
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedCourse = await SheetService.update(SHEET_TITLE, req.params.id, req.body);
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json({ success: true, data: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const success = await SheetService.remove(SHEET_TITLE, req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json({ success: true, message: 'Course deleted' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
