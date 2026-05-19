/**
 * Seed Real Data for Gallery, Staff, and Courses
 * This script populates the Google Sheets with sample data
 */

const SheetService = require('./services/SheetService');

// Gallery Data - School images (Bilingual: English + Hindi)
const galleryData = [
    {
        title: 'School Building | स्कूल भवन',
        category: 'Campus',
        description: 'Our main school building with modern infrastructure | आधुनिक बुनियादी ढांचे के साथ हमारा मुख्य स्कूल भवन',
        src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=90'
    },
    {
        title: 'Science Laboratory | विज्ञान प्रयोगशाला',
        category: 'Academics',
        description: 'State-of-the-art science laboratories for practical learning | व्यावहारिक शिक्षा के लिए अत्याधुनिक विज्ञान प्रयोगशालाएं',
        src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=90'
    },
    {
        title: 'Art Room | कला कक्षा',
        category: 'Arts',
        description: 'Creative space for students to explore their artistic talents | छात्रों के लिए अपनी कलात्मक प्रतिभा का पता लगाने के लिए रचनात्मक स्थान',
        src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=90'
    },
    {
        title: 'Smart Classroom | स्मार्ट क्लासरूम',
        category: 'Academics',
        description: 'Digital classrooms with interactive learning tools | इंटरैक्टिव शिक्षण उपकरणों के साथ डिजिटल कक्षाएं',
        src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=90'
    },
    {
        title: 'Music Room | संगीत कक्ष',
        category: 'Arts',
        description: 'Music room equipped with various instruments | विभिन्न वाद्य यंत्रों से सुसज्जित संगीत कक्ष',
        src: 'https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=1200&q=90'
    },
    {
        title: 'Library | पुस्तकालय',
        category: 'Facilities',
        description: 'Extensive library with thousands of books and digital resources | हजारों पुस्तकों और डिजिटल संसाधनों के साथ विशाल पुस्तकालय',
        src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=90'
    },
    {
        title: 'Sports Complex | खेल परिसर',
        category: 'Sports',
        description: 'Multi-sport complex with facilities for various sports | विभिन्न खेलों की सुविधाओं के साथ बहु-खेल परिसर',
        src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=90'
    },
    {
        title: 'Cafeteria | कैफेटेरिया',
        category: 'Facilities',
        description: 'Hygienic cafeteria serving nutritious meals | पौष्टिक भोजन परोसने वाली स्वच्छ कैफेटेरिया',
        src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=90'
    },
    {
        title: 'Computer Lab | कंप्यूटर लैब',
        category: 'Academics',
        description: 'Modern computer lab with latest technology | नवीनतम तकनीक के साथ आधुनिक कंप्यूटर लैब',
        src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=90'
    },
    {
        title: 'Morning Assembly | प्रार्थना सभा',
        category: 'Events',
        description: 'Daily assembly where students gather for prayers and announcements | दैनिक सभा जहां छात्र प्रार्थना और घोषणाओं के लिए एकत्रित होते हैं',
        src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=90'
    }
];

// Staff Data - School management team (Bilingual: English + Hindi)
const staffData = [
    {
        name: 'Shekhar Chandra Agarwal | शेखर चंद्र अग्रवाल',
        position: 'Director | निदेशक',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
        bio: 'Mr. Shekhar Chandra Agarwal is a visionary leader with over 20 years of experience in educational administration. | श्री शेखर चंद्र अग्रवाल एक दूरदर्शी नेता हैं जिनके पास शैक्षिक प्रशासन में 20 वर्षों से अधिक का अनुभव है।',
        qualifications: 'MBA in Education Management, B.Ed | शिक्षा प्रबंधन में एमबीए, बी.एड',
        experience: '20+ years in Education | 20+ वर्ष शिक्षा क्षेत्र में',
        email: 'director@shishuvidyaniketan.edu',
        phone: '06452-220393',
        achievements: JSON.stringify(['Founder 2005 | संस्थापक 2005', 'Digital Education Initiative | डिजिटल शिक्षा पहल', 'Scholarship Program | छात्रवृत्ति कार्यक्रम'])
    },
    {
        name: 'Sanjay Kumar Jha | संजय कुमार झा',
        position: 'Principal | प्रधानाचार्य',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
        bio: 'Mr. Sanjay Kumar Jha is a dedicated educator with extensive experience in curriculum development and student welfare. | श्री संजय कुमार झा एक समर्पित शिक्षक हैं जिनके पास पाठ्यक्रम विकास और छात्र कल्याण में व्यापक अनुभव है।',
        qualifications: 'M.A. English Literature, M.Ed, Ph.D Education | अंग्रेजी साहित्य में एम.ए., एम.एड., शिक्षा में पी.एच.डी.',
        experience: '25+ years in Teaching & Administration | 25+ वर्ष शिक्षण और प्रशासन में',
        email: 'principal@shishuvidyaniketan.edu',
        phone: '06452-220393',
        achievements: JSON.stringify(['Top 10 District Ranking | जिले में शीर्ष 10 रैंकिंग', 'Activity-based Curriculum | गतिविधि-आधारित पाठ्यक्रम', 'Parent-Teacher Collaboration | अभिभावक-शिक्षक सहयोग'])
    },
    {
        name: 'Lata Agrawal | लता अग्रवाल',
        position: 'Managing Committee Member / Treasurer | प्रबंध समिति सदस्य / कोषाध्यक्ष',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',
        bio: 'Mrs. Lata Agrawal manages the financial operations of the school trust with expertise and dedication. | श्रीमती लता अग्रवाल स्कूल ट्रस्ट के वित्तीय संचालन का प्रबंधन विशेषज्ञता और समर्पण के साथ करती हैं।',
        qualifications: 'CA, MBA in Finance | सी.ए., वित्त में एमबीए',
        experience: '18+ years in Financial Management | 18+ वर्ष वित्तीय प्रबंधन में',
        email: 'treasurer@shishuvidyaniketan.edu',
        phone: '06452-220393',
        achievements: JSON.stringify(['Transparent Accounting System | पारदर्शी लेखा प्रणाली', 'Infrastructure Development | बुनियादी ढांचा विकास', 'Student Welfare Fund | छात्र कल्याण कोष'])
    },
    {
        name: 'Priya Sharma | प्रिया शर्मा',
        position: 'Vice Principal | उप-प्रधानाचार्य',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face',
        bio: 'Mrs. Priya Sharma is committed to academic excellence and student development. | श्रीमती प्रिया शर्मा शैक्षणिक उत्कृष्टता और छात्र विकास के लिए प्रतिबद्ध हैं।',
        qualifications: 'M.Sc Mathematics, B.Ed | गणित में एम.एससी., बी.एड',
        experience: '15+ years in Education | 15+ वर्ष शिक्षा में',
        email: 'viceprincipal@shishuvidyaniketan.edu',
        phone: '06452-220393',
        achievements: JSON.stringify(['Examination System | परीक्षा प्रणाली', 'Remedial Teaching | उपचारात्मक शिक्षण', 'Inter-school Competition | अंतर-विद्यालय प्रतियोगिता'])
    },
    {
        name: 'Amit Kumar | अमित कुमार',
        position: 'Academic Director | शैक्षणिक निदेशक',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face',
        bio: 'Mr. Amit Kumar leads academic planning and curriculum development. | श्री अमित कुमार शैक्षणिक योजना और पाठ्यक्रम विकास का नेतृत्व करते हैं।',
        qualifications: 'M.Tech, M.Ed, NET Qualified | एम.टेक, एम.एड., नेट योग्य',
        experience: '12+ years in Academic Planning | 12+ वर्ष शैक्षणिक योजना में',
        email: 'academic@shishuvidyaniketan.edu',
        phone: '06452-220393',
        achievements: JSON.stringify(['Integrated Curriculum | एकीकृत पाठ्यक्रम', 'STEM Education Program | STEM शिक्षा कार्यक्रम', 'Teacher Training | शिक्षक प्रशिक्षण'])
    }
];

// Courses Data - Classes 1-12
const coursesData = [
    {
        id: 'class-1',
        code: 'CLS-01',
        title: 'Class 1 - Foundation',
        titleHi: 'कक्षा 1 - नींव',
        summary: 'Building strong basics in literacy, numeracy, and social skills through play-based learning.',
        summaryHi: 'खेल-आधारित शिक्षा के माध्यम से साक्षरता, संख्या ज्ञान और सामाजिक कौशल में मजबूत बुनियादी बना रहे हैं।',
        ageRange: '5-6 years',
        ageRangeHi: '5-6 वर्ष',
        grade: 'Class 1',
        gradeHi: 'कक्षा 1',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Friday, 8:00 AM - 2:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹25,000/year',
        feeHi: '₹25,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
        category: 'Primary',
        categoryHi: 'प्राथमिक',
        popular: true,
        stream: 'General',
        prerequisites: 'Nursery/KG completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'EVS', 'Art & Craft']),
        teachers: JSON.stringify(['Mrs. Sunita Devi', 'Mrs. Rekha Kumari']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'EVS', 'Art & Craft', 'Music'])
    },
    {
        id: 'class-2',
        code: 'CLS-02',
        title: 'Class 2 - Foundation Plus',
        titleHi: 'कक्षा 2 - फाउंडेशन प्लस',
        summary: 'Strengthening reading, writing, and mathematical concepts with interactive activities.',
        summaryHi: 'इंटरैक्टिव गतिविधियों के साथ पढ़ने, लिखने और गणितीय अवधारणाओं को मजबूत करना।',
        ageRange: '6-7 years',
        ageRangeHi: '6-7 वर्ष',
        grade: 'Class 2',
        gradeHi: 'कक्षा 2',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Friday, 8:00 AM - 2:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹26,000/year',
        feeHi: '₹26,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
        category: 'Primary',
        categoryHi: 'प्राथमिक',
        popular: false,
        stream: 'General',
        prerequisites: 'Class 1 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'EVS', 'Computer Basics']),
        teachers: JSON.stringify(['Mrs. Anita Singh', 'Mr. Ramesh Kumar']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'EVS', 'Computer', 'Art'])
    },
    {
        id: 'class-3',
        code: 'CLS-03',
        title: 'Class 3 - Primary',
        titleHi: 'कक्षा 3 - प्राथमिक',
        summary: 'Developing language skills, basic science concepts, and critical thinking abilities.',
        summaryHi: 'भाषा कौशल, बुनियादी विज्ञान अवधारणाओं और आलोचनात्मक सोच क्षमताओं का विकास।',
        ageRange: '7-8 years',
        ageRangeHi: '7-8 वर्ष',
        grade: 'Class 3',
        gradeHi: 'कक्षा 3',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Friday, 8:00 AM - 2:30 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹27,000/year',
        feeHi: '₹27,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
        category: 'Primary',
        categoryHi: 'प्राथमिक',
        popular: false,
        stream: 'General',
        prerequisites: 'Class 2 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies']),
        teachers: JSON.stringify(['Mrs. Kavita Sharma', 'Mr. Ajay Kumar']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer'])
    },
    {
        id: 'class-4',
        code: 'CLS-04',
        title: 'Class 4 - Primary Advanced',
        titleHi: 'कक्षा 4 - उन्नत प्राथमिक',
        summary: 'Expanding knowledge in all subjects with emphasis on comprehension and application.',
        summaryHi: 'समझ और अनुप्रयोग पर जोर देने के साथ सभी विषयों में ज्ञान का विस्तार।',
        ageRange: '8-9 years',
        ageRangeHi: '8-9 वर्ष',
        grade: 'Class 4',
        gradeHi: 'कक्षा 4',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Friday, 8:00 AM - 2:30 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹28,000/year',
        feeHi: '₹28,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
        category: 'Primary',
        categoryHi: 'प्राथमिक',
        popular: false,
        stream: 'General',
        prerequisites: 'Class 3 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer']),
        teachers: JSON.stringify(['Mrs. Meena Verma', 'Mr. Suresh Yadav']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Art'])
    },
    {
        id: 'class-5',
        code: 'CLS-05',
        title: 'Class 5 - Primary Final',
        titleHi: 'कक्षा 5 - प्राथमिक अंतिम',
        summary: 'Preparing students for middle school with comprehensive primary education.',
        summaryHi: 'व्यापक प्राथमिक शिक्षा के साथ छात्रों को मध्य विद्यालय के लिए तैयार करना।',
        ageRange: '9-10 years',
        ageRangeHi: '9-10 वर्ष',
        grade: 'Class 5',
        gradeHi: 'कक्षा 5',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Friday, 8:00 AM - 3:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹30,000/year',
        feeHi: '₹30,000/वर्ष',
        image: '/assets/friendly.png',
        category: 'Primary',
        categoryHi: 'प्राथमिक',
        popular: true,
        stream: 'General',
        prerequisites: 'Class 4 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'GK']),
        teachers: JSON.stringify(['Mr. Rajesh Gupta', 'Mrs. Pooja Singh']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'GK'])
    },
    {
        id: 'class-6',
        code: 'CLS-06',
        title: 'Class 6 - Middle School Foundation',
        titleHi: 'कक्षा 6 - माध्यमिक फाउंडेशन',
        summary: 'Introduction to middle school curriculum with deeper subject exploration.',
        summaryHi: 'गहरी विषय खोज के साथ मध्य विद्यालय पाठ्यक्रम का परिचय।',
        ageRange: '10-11 years',
        ageRangeHi: '10-11 वर्ष',
        grade: 'Class 6',
        gradeHi: 'कक्षा 6',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 3:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹32,000/year',
        feeHi: '₹32,000/वर्ष',
        image: '/assets/computer.png',
        category: 'Middle School',
        categoryHi: 'माध्यमिक विद्यालय',
        popular: false,
        stream: 'General',
        prerequisites: 'Class 5 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Sanskrit/Computer']),
        teachers: JSON.stringify(['Mr. Vinod Kumar', 'Mrs. Sarita Mishra']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer'])
    },
    {
        id: 'class-7',
        code: 'CLS-07',
        title: 'Class 7 - Middle School',
        titleHi: 'कक्षा 7 - माध्यमिक',
        summary: 'Building on middle school foundations with increased academic rigor.',
        summaryHi: 'बढ़ी हुई शैक्षणिक कठोरता के साथ मध्य विद्यालय की बुनियाद पर निर्माण।',
        ageRange: '11-12 years',
        ageRangeHi: '11-12 वर्ष',
        grade: 'Class 7',
        gradeHi: 'कक्षा 7',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 3:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹33,000/year',
        feeHi: '₹33,000/वर्ष',
        image: '/assets/school.png',
        category: 'Middle School',
        categoryHi: 'माध्यमिक विद्यालय',
        popular: false,
        stream: 'General',
        prerequisites: 'Class 6 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science']),
        teachers: JSON.stringify(['Mr. Deepak Sharma', 'Mrs. Neha Gupta']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer'])
    },
    {
        id: 'class-8',
        code: 'CLS-08',
        title: 'Class 8 - Middle School Final',
        titleHi: 'कक्षा 8 - माध्यमिक अंतिम',
        summary: 'Preparing students for board examinations with comprehensive subject coverage.',
        summaryHi: 'व्यापक विषय कवरेज के साथ बोर्ड परीक्षाओं के लिए छात्रों को तैयार करना।',
        ageRange: '12-13 years',
        ageRangeHi: '12-13 वर्ष',
        grade: 'Class 8',
        gradeHi: 'कक्षा 8',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 3:30 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹35,000/year',
        feeHi: '₹35,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
        category: 'Middle School',
        categoryHi: 'माध्यमिक विद्यालय',
        popular: true,
        stream: 'General',
        prerequisites: 'Class 7 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Sanskrit/Computer']),
        teachers: JSON.stringify(['Mr. Alok Verma', 'Mrs. Shilpa Rani']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer'])
    },
    {
        id: 'class-9',
        code: 'CLS-09',
        title: 'Class 9 - Secondary Foundation',
        titleHi: 'कक्षा 9 - माध्यमिक फाउंडेशन',
        summary: 'Beginning of secondary education with CBSE curriculum and board preparation.',
        summaryHi: 'CBSE पाठ्यक्रम और बोर्ड तैयारी के साथ माध्यमिक शिक्षा की शुरुआत।',
        ageRange: '13-14 years',
        ageRangeHi: '13-14 वर्ष',
        grade: 'Class 9',
        gradeHi: 'कक्षा 9',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 4:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹38,000/year',
        feeHi: '₹38,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
        category: 'Secondary',
        categoryHi: 'माध्यमिक',
        popular: true,
        stream: 'General',
        prerequisites: 'Class 8 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'IT/AI']),
        teachers: JSON.stringify(['Mr. Sandeep Kumar', 'Mrs. Ritu Agarwal', 'Mr. Prakash Jha']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'IT/AI'])
    },
    {
        id: 'class-10',
        code: 'CLS-10',
        title: 'Class 10 - Board Year',
        titleHi: 'कक्षा 10 - बोर्ड वर्ष',
        summary: 'CBSE Board examination year with intensive preparation and guidance.',
        summaryHi: 'गहन तैयारी और मार्गदर्शन के साथ CBSE बोर्ड परीक्षा वर्ष।',
        ageRange: '14-15 years',
        ageRangeHi: '14-15 वर्ष',
        grade: 'Class 10',
        gradeHi: 'कक्षा 10',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 4:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹40,000/year',
        feeHi: '₹40,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
        category: 'Secondary',
        categoryHi: 'माध्यमिक',
        popular: true,
        stream: 'General',
        prerequisites: 'Class 9 completion',
        syllabus: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'IT/AI']),
        teachers: JSON.stringify(['Mr. Vikas Pandey', 'Mrs. Sunaina Sharma', 'Mr. Rahul Singh']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'IT/AI'])
    },
    {
        id: 'class-11-science',
        code: 'CLS-11-SCI',
        title: 'Class 11 - Science Stream',
        titleHi: 'कक्षा 11 - विज्ञान धारा',
        summary: 'Science stream with PCM/PCB options for aspiring engineers and doctors.',
        summaryHi: 'इच्छुक इंजीनियरों और डॉक्टरों के लिए PCM/PCB विकल्पों के साथ विज्ञान धारा।',
        ageRange: '15-16 years',
        ageRangeHi: '15-16 वर्ष',
        grade: 'Class 11',
        gradeHi: 'कक्षा 11',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 4:30 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹45,000/year',
        feeHi: '₹45,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
        category: 'Senior Secondary',
        categoryHi: 'वरिष्ठ माध्यमिक',
        popular: true,
        stream: 'Science',
        prerequisites: 'Class 10 with minimum 60% in Science & Mathematics',
        syllabus: JSON.stringify(['Physics', 'Chemistry', 'Mathematics/Biology', 'English', 'Computer Science/PE']),
        teachers: JSON.stringify(['Dr. Ashok Kumar', 'Mrs. Poonam Gupta', 'Mr. Arvind Singh']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'])
    },
    {
        id: 'class-11-commerce',
        code: 'CLS-11-COM',
        title: 'Class 11 - Commerce Stream',
        titleHi: 'कक्षा 11 - वाणिज्य धारा',
        summary: 'Commerce stream for future business leaders and finance professionals.',
        summaryHi: 'भविष्य के व्यापारिक नेताओं और वित्त पेशेवरों के लिए वाणिज्य धारा।',
        ageRange: '15-16 years',
        ageRangeHi: '15-16 वर्ष',
        grade: 'Class 11',
        gradeHi: 'कक्षा 11',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 4:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹42,000/year',
        feeHi: '₹42,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        category: 'Senior Secondary',
        categoryHi: 'वरिष्ठ माध्यमिक',
        popular: false,
        stream: 'Commerce',
        prerequisites: 'Class 10 pass',
        syllabus: JSON.stringify(['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics/Informatics']),
        teachers: JSON.stringify(['Mr. Sunil Agarwal', 'Mrs. Mamta Verma']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics', 'Informatics'])
    },
    {
        id: 'class-12-science',
        code: 'CLS-12-SCI',
        title: 'Class 12 - Science Board Year',
        titleHi: 'कक्षा 12 - विज्ञान बोर्ड वर्ष',
        summary: 'CBSE Board examination with JEE/NEET preparation support.',
        summaryHi: 'JEE/NEET तैयारी सहायता के साथ CBSE बोर्ड परीक्षा।',
        ageRange: '16-17 years',
        ageRangeHi: '16-17 वर्ष',
        grade: 'Class 12',
        gradeHi: 'कक्षा 12',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 5:00 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹50,000/year',
        feeHi: '₹50,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
        category: 'Senior Secondary',
        categoryHi: 'वरिष्ठ माध्यमिक',
        popular: true,
        stream: 'Science',
        prerequisites: 'Class 11 Science completion',
        syllabus: JSON.stringify(['Physics', 'Chemistry', 'Mathematics/Biology', 'English', 'Computer Science/PE']),
        teachers: JSON.stringify(['Dr. Ashok Kumar', 'Mrs. Poonam Gupta', 'Mr. Arvind Singh', 'Dr. Neelam Jha']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'])
    },
    {
        id: 'class-12-commerce',
        code: 'CLS-12-COM',
        title: 'Class 12 - Commerce Board Year',
        titleHi: 'कक्षा 12 - वाणिज्य बोर्ड वर्ष',
        summary: 'CBSE Board examination with CA/CS/Management entrance preparation.',
        summaryHi: 'CA/CS/प्रबंधन प्रवेश तैयारी के साथ CBSE बोर्ड परीक्षा।',
        ageRange: '16-17 years',
        ageRangeHi: '16-17 वर्ष',
        grade: 'Class 12',
        gradeHi: 'कक्षा 12',
        duration: '1 Academic Year',
        durationHi: '1 शैक्षणिक वर्ष',
        schedule: 'Monday to Saturday, 8:00 AM - 4:30 PM',
        mode: 'Offline',
        modeHi: 'ऑफलाइन',
        fee: '₹45,000/year',
        feeHi: '₹45,000/वर्ष',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        category: 'Senior Secondary',
        categoryHi: 'वरिष्ठ माध्यमिक',
        popular: false,
        stream: 'Commerce',
        prerequisites: 'Class 11 Commerce completion',
        syllabus: JSON.stringify(['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics/Informatics']),
        teachers: JSON.stringify(['Mr. Sunil Agarwal', 'Mrs. Mamta Verma', 'Mr. Rakesh Sharma']),
        faqs: JSON.stringify([]),
        subjects: JSON.stringify(['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics', 'Informatics'])
    }
];

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
        image: 'https://images.unsplash.com/photo-1461896836934- voices-from-the-stands?w=800&q=80',
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

async function seedData() {
    console.log('🌱 Starting Data Seeding Process...\n');

    try {
        // Seed Gallery
        console.log('📸 Seeding Gallery Data...');
        for (const image of galleryData) {
            try {
                await SheetService.add('Gallery', image);
                console.log(`  ✅ Added: ${image.title}`);
            } catch (err) {
                console.log(`  ⚠️ Skipped: ${image.title} - ${err.message}`);
            }
        }
        console.log('\n✅ Gallery seeding complete!\n');

        // Seed Staff
        console.log('👥 Seeding Staff Data...');
        for (const member of staffData) {
            try {
                await SheetService.add('Staff', member);
                console.log(`  ✅ Added: ${member.name}`);
            } catch (err) {
                console.log(`  ⚠️ Skipped: ${member.name} - ${err.message}`);
            }
        }
        console.log('\n✅ Staff seeding complete!\n');

        // Seed Courses
        console.log('📚 Seeding Courses Data...');
        for (const course of coursesData) {
            try {
                await SheetService.add('Courses', course);
                console.log(`  ✅ Added: ${course.title}`);
            } catch (err) {
                console.log(`  ⚠️ Skipped: ${course.title} - ${err.message}`);
            }
        }
        console.log('\n✅ Courses seeding complete!\n');

        // Seed Events
        console.log('📅 Seeding Events Data...');
        for (const event of eventsData) {
            try {
                await SheetService.add('Events', event);
                console.log(`  ✅ Added: ${event.title}`);
            } catch (err) {
                console.log(`  ⚠️ Skipped: ${event.title} - ${err.message}`);
            }
        }
        console.log('\n✅ Events seeding complete!\n');

        console.log('🎉 All data seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`  - Gallery: ${galleryData.length} images`);
        console.log(`  - Staff: ${staffData.length} members`);
        console.log(`  - Courses: ${coursesData.length} courses`);
        console.log(`  - Events: ${eventsData.length} events`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seedData();
