import { useState, useRef, useEffect } from 'react';
import './CourseTabs.css';

const CourseTabs = ({ course, isHindi }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabsRef = useRef(null);
    const indicatorRef = useRef(null);
    const contentRef = useRef(null);

    // Get localized course data
    const getLocalizedValue = (field, fieldHi) => {
        return isHindi && fieldHi ? fieldHi : field;
    };

    const summary = getLocalizedValue(course.summary, course.summaryHi);
    const grade = getLocalizedValue(course.grade, course.gradeHi);
    const ageRange = getLocalizedValue(course.ageRange, course.ageRangeHi);
    const duration = getLocalizedValue(course.duration, course.durationHi);
    const mode = getLocalizedValue(course.mode, course.modeHi);
    const modeText = typeof mode === 'string' ? mode : String(mode || '');
    const modeTextLower = modeText.toLowerCase();
    const streamText = typeof course.stream === 'string' ? course.stream : '';

    const parseMaybeJson = (value) => {
        if (typeof value !== 'string') {
            return value;
        }

        const trimmed = value.trim();
        if (!trimmed) {
            return [];
        }

        try {
            return JSON.parse(trimmed);
        } catch {
            // Support comma-separated values from sheet/manual entry.
            return trimmed.includes(',')
                ? trimmed.split(',').map((item) => item.trim()).filter(Boolean)
                : [trimmed];
        }
    };

    const toArray = (value) => {
        const parsed = parseMaybeJson(value);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        if (parsed === null || parsed === undefined || parsed === '') {
            return [];
        }
        return [parsed];
    };

    const subjects = toArray(course.subjects).map((subject) =>
        typeof subject === 'string' ? subject : String(subject)
    );
    const syllabus = toArray(course.syllabus);
    const teachers = toArray(course.teachers);
    const faqs = toArray(course.faqs);

    const tabs = isHindi ? [
        { id: 'overview', label: 'अवलोकन', icon: '📋' },
        { id: 'syllabus', label: 'पाठ्यक्रम', icon: '📚' },
        { id: 'teachers', label: 'शिक्षक', icon: '👨‍🏫' },
        { id: 'schedule', label: 'समय सारिणी', icon: '📅' },
        { id: 'faq', label: 'अक्सर पूछे जाने वाले प्रश्न', icon: '❓' },
    ] : [
        { id: 'overview', label: 'Overview', icon: '📋' },
        { id: 'syllabus', label: 'Syllabus', icon: '📚' },
        { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
        { id: 'schedule', label: 'Schedule', icon: '📅' },
        { id: 'faq', label: 'FAQ', icon: '❓' },
    ];

    useEffect(() => {
        if (tabsRef.current && indicatorRef.current) {
            const tabElements = tabsRef.current.querySelectorAll('[role="tab"]');
            const activeTabEl = tabElements[activeTab];
            if (activeTabEl) {
                indicatorRef.current.style.left = activeTabEl.offsetLeft + 'px';
                indicatorRef.current.style.width = activeTabEl.offsetWidth + 'px';
            }
        }
    }, [activeTab]);

    useEffect(() => {
        // No animated content transitions
    }, [activeTab]);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="course-tabs">
            {/* Tab Headers */}
            <div className="tabs-header" ref={tabsRef} role="tablist">
                <div className="tabs-indicator" ref={indicatorRef}></div>
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === index}
                        aria-controls={`panel-${tab.id}`}
                        className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tabs-content" ref={contentRef}>
                {/* Overview */}
                {activeTab === 0 && (
                    <div id="panel-overview" role="tabpanel" className="tab-panel">
                        <div className="overview-section">
                            <h3>{isHindi ? 'इस कोर्स के बारे में' : 'About This Course'}</h3>
                            {course.stream && (
                                <div className="stream-badge">
                                    <span className="badge badge-stream">{course.stream}</span>
                                </div>
                            )}
                            <p>{summary}</p>
                            <p>
                                {isHindi 
                                    ? `यह व्यापक कार्यक्रम ${grade} ({ageRange}) के छात्रों के लिए डिज़ाइन किया गया है। यह कोर्स ${duration} तक चलता है और ${mode.toLowerCase()} आयोजित किया जाता है।`
                                    : `This comprehensive program is designed for students in ${grade} (${ageRange}). The course runs for ${duration} and is conducted ${modeTextLower}.`
                                }
                            </p>
                        </div>

                        {subjects.length > 0 && (
                            <div className="overview-section">
                                <h3>{isHindi ? 'उपलब्ध विषय' : 'Subjects Offered'}</h3>
                                <div className="subjects-grid">
                                    {subjects.map((subject, index) => (
                                        <div key={index} className="subject-chip">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            {subject}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="overview-section">
                            <h3>{isHindi ? 'पूर्वापेक्षाएँ' : 'Prerequisites'}</h3>
                            <div className="prereq-box">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{course.prerequisites || (isHindi ? 'कोई पूर्वापेक्षा आवश्यक नहीं' : 'No prerequisites required')}</span>
                            </div>
                        </div>

                        <div className="overview-section">
                            <h3>{isHindi ? 'आप क्या सीखेंगे' : "What You'll Learn"}</h3>
                            <ul className="learning-list">
                                <li>{isHindi ? 'मुख्य विषयों में मजबूत नींव' : 'Strong foundation in core subjects'}</li>
                                <li>{isHindi ? 'आलोचनात्मक सोच और समस्या-समाधान कौशल' : 'Critical thinking and problem-solving skills'}</li>
                                <li>{isHindi ? 'प्रभावी संचार क्षमताएं' : 'Effective communication abilities'}</li>
                                {streamText.includes('Science') && <li>{isHindi ? 'वैज्ञानिक पद्धति और प्रयोगशाला कौशल' : 'Scientific methodology and laboratory skills'}</li>}
                                {streamText.includes('Commerce') && <li>{isHindi ? 'व्यापार कुशाग्रता और वित्तीय साक्षरता' : 'Business acumen and financial literacy'}</li>}
                                {streamText.includes('Arts') && <li>{isHindi ? 'विश्लेषणात्मक सोच और शोध कौशल' : 'Analytical thinking and research skills'}</li>}
                                <li>{isHindi ? 'उच्च शिक्षा और करियर के लिए तैयारी' : 'Preparation for higher education and career'}</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Syllabus */}
                {activeTab === 1 && (
                    <div id="panel-syllabus" role="tabpanel" className="tab-panel">
                        <div className="syllabus-header">
                            <h3>{isHindi ? 'कोर्स पाठ्यक्रम' : 'Course Syllabus'}</h3>
                            <button className="btn btn-secondary btn-sm">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {isHindi ? 'PDF डाउनलोड करें' : 'Download PDF'}
                            </button>
                        </div>

                        <div className="syllabus-timeline">
                            {syllabus.map((item, index) => {
                                const topics = toArray(item?.topics).map((topic) =>
                                    typeof topic === 'string' ? topic : String(topic)
                                );

                                return (
                                <div key={index} className="syllabus-item">
                                    <div className="syllabus-week">
                                        <span className="week-number">{isHindi ? `सप्ताह ${item.week}` : `Week ${item.week}`}</span>
                                    </div>
                                    <div className="syllabus-content">
                                        <h4>{item.title}</h4>
                                        <ul className="topics-list">
                                            {topics.map((topic, i) => (
                                                <li key={i}>{topic}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Teachers */}
                {activeTab === 2 && (
                    <div id="panel-teachers" role="tabpanel" className="tab-panel">
                        <h3>{isHindi ? 'अपने शिक्षकों से मिलें' : 'Meet Your Instructors'}</h3>
                        <div className="teachers-grid">
                            {teachers.map((teacher, teacherIndex) => {
                                const teacherData = (teacher && typeof teacher === 'object')
                                    ? teacher
                                    : { name: String(teacher), role: '', bio: '', image: '' };

                                return (
                                <div key={teacherData.id || teacherIndex} className="teacher-card">
                                    <img
                                        src={teacherData.image}
                                        alt={teacherData.name}
                                        className="teacher-image"
                                    />
                                    <div className="teacher-info">
                                        <h4>{teacherData.name}</h4>
                                        <span className="teacher-role">{teacherData.role}</span>
                                        <p className="teacher-bio">{teacherData.bio}</p>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Schedule */}
                {activeTab === 3 && (
                    <div id="panel-schedule" role="tabpanel" className="tab-panel">
                        <h3>{isHindi ? 'कक्षा समय सारिणी' : 'Class Schedule'}</h3>
                        <div className="schedule-card">
                            <div className="schedule-row">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <span className="schedule-label">{isHindi ? 'अवधि' : 'Duration'}</span>
                                    <span className="schedule-value">{duration}</span>
                                </div>
                            </div>
                            <div className="schedule-row">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <span className="schedule-label">{isHindi ? 'समय' : 'Timing'}</span>
                                    <span className="schedule-value">{course.schedule}</span>
                                </div>
                            </div>
                            <div className="schedule-row">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <span className="schedule-label">{isHindi ? 'मोड' : 'Mode'}</span>
                                    <span className="schedule-value">{modeText}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQ */}
                {activeTab === 4 && (
                    <div id="panel-faq" role="tabpanel" className="tab-panel">
                        <h3>{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}</h3>
                        {faqs.length > 0 ? (
                            <div className="faq-list">
                                {faqs.map((faq, index) => {
                                    const faqData = (faq && typeof faq === 'object')
                                        ? faq
                                        : { question: String(faq), answer: '' };

                                    return (
                                    <details key={index} className="faq-item">
                                        <summary className="faq-question">
                                            <span>{faqData.question}</span>
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="faq-answer">
                                            <p>{faqData.answer}</p>
                                        </div>
                                    </details>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>{isHindi ? 'इस कोर्स के लिए अभी तक कोई FAQ उपलब्ध नहीं है।' : 'No FAQs available for this course yet.'}</p>
                                <p>{isHindi ? 'कोई सवाल है? हमारी प्रवेश टीम से संपर्क करें।' : 'Have a question? Contact our admissions team.'}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseTabs;
