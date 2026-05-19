const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const SheetService = require('../services/SheetService');

const resetCourses = async () => {
    try {
        console.log('🗑️ Resetting Courses sheet...');
        await SheetService.deleteSheet('Courses');
        console.log('✅ Courses sheet deleted. It will be recreated with new headers on next access.');
    } catch (error) {
        console.error('❌ Reset failed:', error);
    }
};

resetCourses();
