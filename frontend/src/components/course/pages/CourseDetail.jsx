import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CourseTabs from '../components/courses/CourseTabs';
import EnrollModal from '../components/courses/EnrollModal';
import CourseCard from '../components/courses/CourseCard';
import { courses } from '../data/courses';
import './CourseDetail.css';

const CourseDetail = () => {
    const { courseId } = useParams();
    const { i18n } = useTranslation();
    const isHindi = i18n.language === 'hi';
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const course = courses.find(c => c.id === courseId);

    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const sidebarRef = useRef(null);

    // Get localized course data
    const getLocalizedValue = (field, fieldHi) => {
        return isHindi && fieldHi ? fieldHi : field;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [courseId]);

    // Get related courses (same category, excluding current)
    const relatedCourses = courses
        .filter(c => c.category === course?.category && c.id !== courseId)
        .slice(0, 3);

    if (!course) {
        return (
            <div className="not-found">
                <div className="not-found-content">
                    <h1>{isHindi ? 'कोर्स नहीं मिला' : 'Course Not Found'}</h1>
                    <p>{isHindi ? 'जिस कोर्स की आप तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।' : "The course you're looking for doesn't exist or has been removed."}</p>
                    <Link to="/courses" className="btn btn-primary">
                        {isHindi ? 'सभी कोर्स देखें' : 'Browse All Courses'}
                    </Link>
                </div>
            </div>
        );
    }

    // Localized course values
    const title = getLocalizedValue(course.title, course.titleHi);
    const summary = getLocalizedValue(course.summary, course.summaryHi);
    const category = getLocalizedValue(course.category, course.categoryHi);
    const ageRange = getLocalizedValue(course.ageRange, course.ageRangeHi);
    const duration = getLocalizedValue(course.duration, course.durationHi);
    const mode = getLocalizedValue(course.mode, course.modeHi);
    const fee = getLocalizedValue(course.fee, course.feeHi);

    return (
        <div className="course-detail-page">
            {/* Breadcrumb */}
            <div className="breadcrumb-section">
                <div className="breadcrumb-container">
                    <nav aria-label="Breadcrumb">
                        <ol className="breadcrumb">
                            <li><Link to="/">{isHindi ? 'होम' : 'Home'}</Link></li>
                            <li><Link to="/courses">{isHindi ? 'कोर्स' : 'Courses'}</Link></li>
                            <li aria-current="page">{title}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Hero Banner */}
            <section className="detail-hero" ref={heroRef}>
                <div className="detail-hero-overlay"></div>
                <img
                    src={course.image}
                    alt={title}
                    className="detail-hero-image"
                />
                <div className="detail-hero-content">
                    <div className="hero-badges">
                        <span className="badge badge-category">{category}</span>
                        {course.popular && (
                            <span className="badge badge-popular">
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {isHindi ? 'लोकप्रिय' : 'Popular'}
                            </span>
                        )}
                    </div>
                    <span className="course-code">{course.code}</span>
                    <h1>{title}</h1>
                    <p className="hero-summary">{summary}</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="detail-main">
                <div className="detail-container">
                    {/* Content Column */}
                    <div className="detail-content" ref={contentRef}>
                        {/* Quick Info Bar */}
                        <div className="quick-info-bar">
                            <div className="info-item">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <div>
                                    <span className="info-label">{isHindi ? 'आयु वर्ग' : 'Age Group'}</span>
                                    <span className="info-value">{ageRange}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <span className="info-label">{isHindi ? 'अवधि' : 'Duration'}</span>
                                    <span className="info-value">{duration}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <span className="info-label">{isHindi ? 'मोड' : 'Mode'}</span>
                                    <span className="info-value">{mode}</span>
                                </div>
                            </div>
                            <div className="info-item highlight">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <span className="info-label">{isHindi ? 'शुल्क' : 'Fee'}</span>
                                    <span className="info-value">{fee}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <CourseTabs course={course} isHindi={isHindi} />
                    </div>

                    {/* Sidebar */}
                    <aside className="detail-sidebar" ref={sidebarRef}>
                        <div className="sidebar-card">
                            <div className="sidebar-fee">
                                <span className="fee-label">{isHindi ? 'कोर्स शुल्क' : 'Course Fee'}</span>
                                <span className="fee-amount">{fee}</span>
                            </div>

                            <div className="sidebar-actions">
                                <button
                                    className="btn btn-accent"
                                    onClick={() => setIsEnrollModalOpen(true)}
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {isHindi ? 'अभी आवेदन करें' : 'Apply Now'}
                                </button>
                                <button className="btn btn-secondary">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {isHindi ? 'पूछताछ करें' : 'Enquire'}
                                </button>
                            </div>

                            <div className="sidebar-divider"></div>

                            <div className="sidebar-contact">
                                <h4>{isHindi ? 'मदद चाहिए?' : 'Need Help?'}</h4>
                                <p>{isHindi ? 'किसी भी प्रश्न के लिए हमारी प्रवेश टीम से संपर्क करें।' : 'Contact our admissions team for any queries.'}</p>
                                <a href="tel:+919876543210" className="contact-link">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +91 98765 43210
                                </a>
                                <a href="mailto:admissions@shishuvidyaniketan.edu" className="contact-link">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    admissions@svn.edu
                                </a>
                            </div>

                            <div className="sidebar-divider"></div>

                            <button className="download-btn">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {isHindi ? 'पाठ्यक्रम डाउनलोड करें (PDF)' : 'Download Syllabus (PDF)'}
                            </button>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
                <section className="related-courses">
                    <div className="related-container">
                        <div className="section-header">
                            <h2>{isHindi ? 'संबंधित कोर्स' : 'Related Courses'}</h2>
                            <Link to={`/courses?category=${course.category.toLowerCase()}`} className="view-all-link">
                                {isHindi ? 'सभी देखें' : 'View All'}
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <div className="related-grid">
                            {relatedCourses.map((relatedCourse, index) => (
                                <CourseCard key={relatedCourse.id} course={relatedCourse} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Mobile Fixed CTA Bar */}
            <div className="mobile-cta-bar">
                <div className="mobile-fee">
                    <span className="fee-label">{isHindi ? 'शुल्क' : 'Fee'}</span>
                    <span className="fee-amount">{fee}</span>
                </div>
                <button
                    className="btn btn-accent"
                    onClick={() => setIsEnrollModalOpen(true)}
                >
                    {isHindi ? 'अभी आवेदन करें' : 'Apply Now'}
                </button>
            </div>

            {/* Enroll Modal */}
            <EnrollModal
                isOpen={isEnrollModalOpen}
                onClose={() => setIsEnrollModalOpen(false)}
                course={course}
                isHindi={isHindi}
            />
        </div>
    );
};

export default CourseDetail;
