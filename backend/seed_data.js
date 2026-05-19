const SheetService = require('./services/SheetService');
require('dotenv').config();

const seedData = async () => {
    try {
        console.log('🌱 Seeding Gallery...');
        await SheetService.add('Gallery', {
            title: 'School Campus',
            category: 'Campus',
            description: 'Main building view',
            src: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000'
        });

        console.log('🌱 Seeding Staff...');
        await SheetService.add('Staff', {
            name: 'Dr. Rajesh Kumar',
            position: 'Principal',
            bio: '20+ years of experience in education',
            qualifications: 'Ph.D. in Education',
            experience: '20 Years',
            email: 'principal@svn.edu',
            achievements: ['Award for Excellence in Education 2022']
        });

        console.log('🌱 Seeding Courses...');
        await SheetService.add('Courses', {
            id: 'class-1-foundation',
            code: 'C1F',
            title: 'Class 1 Foundation',
            grade: 'Class 1',
            summary: 'Basic foundation for primary education',
            ageRange: '6-7 Years',
            duration: '1 Year',
            mode: 'On Campus',
            fee: '₹2000/month',
            popular: 'true',
            category: 'Primary'
        });

        console.log('✅ Seeding complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
    process.exit();
};

seedData();
