import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CourseHero.css';

const CourseHero = ({ searchQuery, onSearchChange }) => {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <section className="course-hero">
            <div className="hero-overlay"></div>
            <div className="hero-pattern"></div>

            <div className="hero-content">
                <div className="hero-text">
                    <span className="hero-badge">{t('coursesPage.heroBadge')}</span>
                    <h1 className="hero-title">{t('coursesPage.heroTitle')}</h1>
                    <p className="hero-subtitle">
                        {t('coursesPage.heroSubtitle')}
                    </p>
                </div>

                <div className="hero-search">
                    <div className={`search-wrapper ${isFocused ? 'focused' : ''}`} role="search">
                        <svg className="search-icon" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder={t('coursesPage.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            aria-label="Search courses"
                        />
                        {searchQuery && (
                            <button
                                className="search-clear"
                                onClick={() => onSearchChange('')}
                                aria-label="Clear search"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="hero-decoration hero-decoration-1"></div>
            <div className="hero-decoration hero-decoration-2"></div>
        </section>
    );
};

export default CourseHero;
