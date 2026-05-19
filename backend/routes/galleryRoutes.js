const express = require('express');
const router = express.Router();
const SheetService = require('../services/SheetService');
const authMiddleware = require('../middleware/authMiddleware');

const SHEET_NAME = 'Gallery';

// GET all images
router.get('/', async (req, res) => {
    try {
        const images = await SheetService.getAll(SHEET_NAME);
        res.json({ success: true, count: images.length, data: images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST new image (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, category, description, src } = req.body;
        if (!src) {
            return res.status(400).json({ success: false, message: 'Image source is required' });
        }

        const newImage = await SheetService.add(SHEET_NAME, {
            title,
            category,
            description,
            src,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        res.status(201).json({ success: true, data: newImage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update image (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, category, description, src } = req.body;
        const updateData = { updatedAt: new Date().toISOString() };

        if (title !== undefined) updateData.title = title;
        if (category !== undefined) updateData.category = category;
        if (description !== undefined) updateData.description = description;
        if (src !== undefined) updateData.src = src;

        const updatedImage = await SheetService.update(SHEET_NAME, req.params.id, updateData);
        if (!updatedImage) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        res.json({ success: true, data: updatedImage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE image (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const success = await SheetService.remove(SHEET_NAME, req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
