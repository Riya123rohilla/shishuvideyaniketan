import { useState, useMemo, useEffect, useLayoutEffect, useRef, createRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CourseHero from '../components/courses/CourseHero';
import CourseCard from '../components/courses/CourseCard';
import { courses } from '../data/courses';
import './CoursesIndex.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CoursesIndex = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const filterRef = useRef(null);
    const indicatorRef = useRef(null);
    const gridRef = useRef(null);
    const cardRefs = useRef([]);

    // Class data with icons and colors
    const classFilters = [
        { id: 'all', label: t('coursesPage.allClasses'), icon: '📚', color: '#164a7a' },
        { id: 'Class 1', label: 'Class 1', icon: '1', color: '#3b82f6' },
        { id: 'Class 2', label: 'Class 2', icon: '2', color: '#8b5cf6' },
        { id: 'Class 3', label: 'Class 3', icon: '3', color: '#06b6d4' },
        { id: 'Class 4', label: 'Class 4', icon: '4', color: '#84cc16' },
        { id: 'Class 5', label: 'Class 5', icon: '5', color: '#f97316' },
        { id: 'Class 6', label: 'Class 6', icon: '6', color: '#0ea5e9' },
        { id: 'Class 7', label: 'Class 7', icon: '7', color: '#a855f7' },
        { id: 'Class 8', label: 'Class 8', icon: '8', color: '#14b8a6' },
        { id: 'Class 9', label: 'Class 9', icon: '9', color: '#ef4444' },
        { id: 'Class 10', label: 'Class 10', icon: '10', color: '#6366f1' },
        { id: 'Class 11', label: 'Class 11', icon: '11', color: '#22c55e' },
        { id: 'Class 12', label: 'Class 12', icon: '12', color: '#eab308' },
    ];

    // Get category from URL params
    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            // Map category to class filter
            const categoryMap = {
                'pre-primary': 'all',
                'primary': 'all',
                'middle-school': 'all',
                'secondary': 'all',
                'senior-secondary': 'all'
            };
            setSelectedClass(categoryMap[category] || 'all');
        }
    }, [searchParams]);

    // Animate filter indicator on class change
    useEffect(() => {
        const activeBtn = filterRef.current?.querySelector('.class-btn.active');
        if (activeBtn && indicatorRef.current) {
            indicatorRef.current.style.left = activeBtn.offsetLeft + 'px';
            indicatorRef.current.style.width = activeBtn.offsetWidth + 'px';
        }
    }, [selectedClass]);

    // Filter courses
    const filteredCourses = useMemo(() => {
        let result = [...courses];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(course =>
                course.title.toLowerCase().includes(query) ||
                course.code.toLowerCase().includes(query) ||
                course.category.toLowerCase().includes(query) ||
                course.summary.toLowerCase().includes(query)
            );
        }

        // Class filter
        if (selectedClass !== 'all') {
            result = result.filter(course => course.grade === selectedClass);
        }

        // Sort by popular first
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

        return result;
    }, [searchQuery, selectedClass]);

    // Update refs array when filteredCourses changes
    useEffect(() => {
        cardRefs.current = filteredCourses.map((_, i) => cardRefs.current[i] || createRef());
    }, [filteredCourses]);

    const handleClassChange = (classId) => {
        setSelectedClass(classId);
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    };

    // Slide-in animations per row: left half from left, right half from right, breakpoint-aware
    useLayoutEffect(() => {
        if (!gridRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gridRef.current.querySelectorAll('.course-card');
            if (!cards || cards.length === 0) return;

            const mm = gsap.matchMedia();

            const animateRows = (columns) => {
                const rows = [];
                const cardArray = Array.from(cards);
                for (let i = 0; i < cardArray.length; i += columns) {
                    rows.push(cardArray.slice(i, i + columns));
                }

                rows.forEach((row) => {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: row[0],
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                            once: true,
                        },
                    });

                    row.forEach((card, idx) => {
                        const fromLeft = idx < Math.ceil(columns / 2);
                        gsap.set(card, { opacity: 0, x: fromLeft ? -120 : 120 });
                        tl.to(card, {
                            opacity: 1,
                            x: 0,
                            duration: 0.6,
                            ease: 'power3.out',
                        }, idx * 0.08);
                    });
                });
            };

            mm.add('(min-width: 1025px)', () => animateRows(4));
            mm.add('(min-width: 769px) and (max-width: 1024px)', () => animateRows(3));
            mm.add('(min-width: 481px) and (max-width: 768px)', () => animateRows(2));
            mm.add('(max-width: 480px)', () => animateRows(1));
        }, gridRef);

        return () => ctx.revert();
    }, [filteredCourses]);

    return (
        <div className="courses-page">
            {/* Hero */}
            <CourseHero
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeCategory="all"
                onCategoryChange={() => { }}
            />

            {/* Main Content */}
            <section className="courses-main">
                <div className="courses-container-full">
                    {/* Class Filter Strip */}
                    <div className="class-filter-section">
                        <div className="class-filter-header">
                            <h2 className="filter-title">
                                <span className="title-icon">🎯</span>
                                {t('coursesPage.selectClass')}
                            </h2>
                            <p className="filter-subtitle">
                                {t('coursesPage.clickToView')}
                            </p>
                        </div>

                        <div className="class-filter-wrapper">
                            <div className="class-filter-strip" ref={filterRef}>
                                <div className="filter-indicator" ref={indicatorRef}></div>
                                {classFilters.map((cls) => (
                                    <button
                                        key={cls.id}
                                        className={`class-btn ${selectedClass === cls.id ? 'active' : ''}`}
                                        onClick={() => handleClassChange(cls.id)}
                                        style={{ '--btn-color': cls.color }}
                                    >
                                        <span className="class-icon">{cls.icon}</span>
                                        <span className="class-label">{cls.label}</span>
                                        {selectedClass === cls.id && (
                                            <span className="active-dot"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="results-header">
                        <div className="results-info">
                            <span className="results-count">
                                {t('coursesPage.showing')} <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? t('coursesPage.course') : t('coursesPage.courses')}
                                {selectedClass !== 'all' && (
                                    <> {t('coursesPage.for')} <strong>{selectedClass}</strong></>
                                )}
                            </span>
                        </div>
                        {selectedClass !== 'all' && (
                            <button
                                className="clear-filter-btn"
                                onClick={() => handleClassChange('all')}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {t('coursesPage.clearFilter')}
                            </button>
                        )}
                    </div>

                    {/* Course Grid */}
                    {filteredCourses.length > 0 ? (
                        <div className="courses-grid-full" ref={gridRef}>
                            {filteredCourses.map((course, index) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    index={index}
                                    ref={cardRefs.current[index]}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="80" height="80" fill="none" stroke="var(--c-muted)" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>{t('coursesPage.noCourses')} {selectedClass}</h3>
                            <p>{t('coursesPage.tryDifferent')}</p>
                            <button className="btn btn-primary" onClick={() => handleClassChange('all')}>
                                {t('coursesPage.viewAllCourses')}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CoursesIndex;
