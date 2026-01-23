import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import './CourseCard.css';

const CourseCard = forwardRef(({ course, index }, ref) => {
    const { t, i18n } = useTranslation();
    const isHindi = i18n.language === 'hi';
    
    // Get localized course data
    const title = isHindi && course.titleHi ? course.titleHi : course.title;
    const summary = isHindi && course.summaryHi ? course.summaryHi : course.summary;
    const category = isHindi && course.categoryHi ? course.categoryHi : course.category;
    const grade = isHindi && course.gradeHi ? course.gradeHi : course.grade;
    const ageRange = isHindi && course.ageRangeHi ? course.ageRangeHi : course.ageRange;
    const duration = isHindi && course.durationHi ? course.durationHi : course.duration;
    const mode = isHindi && course.modeHi ? course.modeHi : course.mode;
    const fee = isHindi && course.feeHi ? course.feeHi : course.fee;
    
    // Get grade icon based on category
    const getGradeIcon = () => {
        if (course.category === 'Pre-Primary') return '🎒';
        if (course.category === 'Primary') return '📖';
        if (course.category === 'Middle School') return '📝';
        if (course.category === 'Secondary') return '🎓';
        if (course.category === 'Senior Secondary') return '🏆';
        return '📚';
    };

    // Get stream color
    const getStreamClass = () => {
        if (course.stream?.includes('PCM')) return 'stream-pcm';
        if (course.stream?.includes('PCB')) return 'stream-pcb';
        if (course.stream?.includes('Commerce')) return 'stream-commerce';
        if (course.stream?.includes('Arts')) return 'stream-arts';
        return '';
    };

    return (
        <article
            ref={ref}
            className={`course-card ${getStreamClass()}`}
            data-index={index}
        >
            {/* Decorative Top Border */}
            <div className="card-accent-border"></div>

            {/* Image Section */}
            <div className="card-image-wrapper">
                <div className="card-image">
                    <img
                        src={course.image}
                        alt={title}
                        loading="lazy"
                    />
                    <div className="card-image-overlay"></div>
                </div>

                {/* Floating Grade Badge */}
                <div className="grade-badge">
                    <span className="grade-icon">{getGradeIcon()}</span>
                    <span className="grade-text">{grade}</span>
                </div>

                {/* Popular Badge */}
                {course.popular && (
                    <div className="popular-ribbon">
                        <div className="ribbon-shine"></div>
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {isHindi ? 'लोकप्रिय' : 'Popular'}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="card-content">
                {/* Category & Code Row */}
                <div className="card-header-row">
                    <span className="category-tag">{category}</span>
                    {course.stream && (
                        <span className="stream-tag">{course.stream}</span>
                    )}
                </div>

                {/* Title */}
                <h3 className="card-title">
                    <Link to={`/courses/${course.id}`}>{title}</Link>
                </h3>

                {/* Summary */}
                <p className="card-description">{summary}</p>

                {/* Info Pills */}
                <div className="info-pills">
                    <div className="info-pill">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {ageRange}
                    </div>
                    <div className="info-pill">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {duration}
                    </div>
                    <div className="info-pill">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {mode}
                    </div>
                </div>

                {/* Divider */}
                <div className="card-divider"></div>

                {/* Footer */}
                <div className="card-footer">
                    <div className="fee-section">
                        <span className="fee-label">{t('coursesPage.annualFee')}</span>
                        <span className="fee-value">{fee}</span>
                    </div>
                    <Link to={`/courses/${course.id}`} className="view-btn">
                        <span>{t('coursesPage.viewDetails')}</span>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;
