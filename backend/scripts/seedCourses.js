const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const SheetService = require('../services/SheetService');
const courses = require('../data/initialCourses');

const seedCourses = async () => {
    try {
        console.log('🌱 Starting course seeding...');

        // Check if courses already exist
        const existingCourses = await SheetService.getAll('Courses');
        if (existingCourses.length > 0) {
            console.log(`⚠️ ${existingCourses.length} courses already exist. Skipping seed.`);
            return;
        }

        console.log(`📦 Seeding ${courses.length} courses...`);

        for (const course of courses) {
            await SheetService.add('Courses', course);
            console.log(`✅ Added: ${course.title}`);
        }

        console.log('🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
};

seedCourses();
