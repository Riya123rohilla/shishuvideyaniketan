/**
 * Seed Events Data (Bilingual: English + Hindi)
 */

const SheetService = require('./services/SheetService');

// Events Data - School events (Bilingual: English + Hindi)
const eventsData = [
    {
        title: 'Annual Day Celebration | वार्षिक दिवस समारोह',
        description: 'Grand annual day celebration with cultural performances, prize distribution, and special guests. | सांस्कृतिक प्रदर्शन, पुरस्कार वितरण और विशेष अतिथियों के साथ भव्य वार्षिक दिवस समारोह।',
        startDate: '2026-03-15',
        endDate: '2026-03-15',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        isActive: true,
        priority: 1
    },
    {
        title: 'Science Exhibition | विज्ञान प्रदर्शनी',
        description: 'Students showcase innovative science projects and experiments. | छात्र नवीन विज्ञान परियोजनाओं और प्रयोगों का प्रदर्शन करते हैं।',
        startDate: '2026-02-20',
        endDate: '2026-02-21',
        image: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800&q=80',
        isActive: true,
        priority: 2
    },
    {
        title: 'Sports Week | खेल सप्ताह',
        description: 'Week-long sports activities including athletics, cricket, football, and indoor games. | एथलेटिक्स, क्रिकेट, फुटबॉल और इनडोर गेम्स सहित सप्ताह भर की खेल गतिविधियाँ।',
        startDate: '2026-01-25',
        endDate: '2026-01-31',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        isActive: true,
        priority: 3
    },
    {
        title: 'Republic Day Celebration | गणतंत्र दिवस समारोह',
        description: 'Patriotic celebration with flag hoisting, parade, and cultural programs. | ध्वजारोहण, परेड और सांस्कृतिक कार्यक्रमों के साथ देशभक्ति का जश्न।',
        startDate: '2026-01-26',
        endDate: '2026-01-26',
        image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80',
        isActive: true,
        priority: 1
    },
    {
        title: 'Parent-Teacher Meeting | अभिभावक-शिक्षक बैठक',
        description: 'Quarterly PTM for discussing student progress and academic performance. | छात्र प्रगति और शैक्षणिक प्रदर्शन पर चर्चा के लिए त्रैमासिक पीटीएम।',
        startDate: '2026-04-10',
        endDate: '2026-04-10',
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
        isActive: true,
        priority: 4
    },
    {
        title: 'Summer Camp Registration | ग्रीष्मकालीन शिविर पंजीकरण',
        description: 'Register for exciting summer camp activities including arts, sports, and coding. | कला, खेल और कोडिंग सहित रोमांचक ग्रीष्मकालीन शिविर गतिविधियों के लिए पंजीकरण करें।',
        startDate: '2026-05-01',
        endDate: '2026-05-31',
        image: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=800&q=80',
        isActive: true,
        priority: 2
    },
    {
        title: 'Holi Celebration | होली उत्सव',
        description: 'Colorful Holi celebration with eco-friendly colors and cultural activities. | पर्यावरण अनुकूल रंगों और सांस्कृतिक गतिविधियों के साथ रंगीन होली उत्सव।',
        startDate: '2026-03-10',
        endDate: '2026-03-10',
        image: 'https://images.unsplash.com/photo-1576018131463-3c53899a87f7?w=800&q=80',
        isActive: true,
        priority: 3
    },
    {
        title: 'Admission Open 2026-27 | प्रवेश खुला 2026-27',
        description: 'New admissions open for classes Nursery to Class 12 for academic year 2026-27. | शैक्षणिक वर्ष 2026-27 के लिए नर्सरी से कक्षा 12 तक नए प्रवेश खुले हैं।',
        startDate: '2026-02-01',
        endDate: '2026-04-30',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
        isActive: true,
        priority: 1
    }
];

async function seedEvents() {
    console.log('📅 Seeding Events Data...\n');

    try {
        for (const event of eventsData) {
            try {
                await SheetService.add('Events', event);
                console.log(`  ✅ Added: ${event.title}`);
            } catch (err) {
                console.log(`  ⚠️ Skipped: ${event.title} - ${err.message}`);
            }
        }
        console.log('\n🎉 Events seeding complete!');
        console.log(`📊 Total: ${eventsData.length} events added`);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seedEvents();
