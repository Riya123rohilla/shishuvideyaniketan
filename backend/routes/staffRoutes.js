const express = require('express');
const router = express.Router();
const SheetService = require('../services/SheetService');
const authMiddleware = require('../middleware/authMiddleware');

const SHEET_NAME = 'Staff';

// GET all staff members
router.get('/', async (req, res) => {
    try {
        const staff = await SheetService.getAll(SHEET_NAME);
        res.json({ success: true, count: staff.length, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST new staff member (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            name, position, image, bio,
            qualifications, experience, email, phone, achievements
        } = req.body;

        if (!name || !position) {
            return res.status(400).json({ success: false, message: 'Name and Position are required' });
        }

        const newStaff = await SheetService.add(SHEET_NAME, {
            name,
            position,
            image: image || '',
            bio: bio || '',
            qualifications: qualifications || '',
            experience: experience || '',
            email: email || '',
            phone: phone || '',
            achievements: achievements || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        res.status(201).json({ success: true, data: newStaff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update staff member (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const {
            name, position, image, bio,
            qualifications, experience, email, phone, achievements
        } = req.body;

        const updateData = {
            updatedAt: new Date().toISOString()
        };

        if (name) updateData.name = name;
        if (position) updateData.position = position;
        if (image !== undefined) updateData.image = image;
        if (bio !== undefined) updateData.bio = bio;
        if (qualifications !== undefined) updateData.qualifications = qualifications;
        if (experience !== undefined) updateData.experience = experience;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (achievements !== undefined) updateData.achievements = achievements;

        const updatedStaff = await SheetService.update(SHEET_NAME, req.params.id, updateData);

        if (!updatedStaff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }

        res.json({ success: true, data: updatedStaff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE staff member (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const success = await SheetService.remove(SHEET_NAME, req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }
        res.json({ success: true, message: 'Staff member deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
