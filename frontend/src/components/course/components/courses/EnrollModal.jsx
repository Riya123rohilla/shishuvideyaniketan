import { useState, useRef, useEffect } from 'react';
import './EnrollModal.css';

const EnrollModal = ({ isOpen, onClose, course, isHindi }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        studentName: '',
        parentName: '',
        email: '',
        phone: '',
        grade: course?.grade || '',
        startDate: '',
        message: '',
        consent: false,
    });
    const [errors, setErrors] = useState({});

    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    // Get localized course data
    const courseTitle = isHindi && course?.titleHi ? course.titleHi : course?.title;
    const courseFee = isHindi && course?.feeHi ? course.feeHi : course?.fee;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.studentName.trim()) newErrors.studentName = isHindi ? 'छात्र का नाम आवश्यक है' : 'Student name is required';
        if (!formData.parentName.trim()) newErrors.parentName = isHindi ? 'अभिभावक का नाम आवश्यक है' : 'Parent/Guardian name is required';
        if (!formData.email.trim()) {
            newErrors.email = isHindi ? 'ईमेल आवश्यक है' : 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = isHindi ? 'कृपया वैध ईमेल दर्ज करें' : 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = isHindi ? 'फ़ोन नंबर आवश्यक है' : 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = isHindi ? 'फ़ोन 10 अंकों का होना चाहिए' : 'Phone must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.consent) {
            setErrors({ consent: 'Please accept the terms to continue' });
            return;
        }
        // Simulate form submission
        setStep(3);
        setTimeout(() => {
            handleClose();
            setStep(1);
            setFormData({
                studentName: '',
                parentName: '',
                email: '',
                phone: '',
                grade: course?.grade || '',
                startDate: '',
                message: '',
                consent: false,
            });
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="enroll-modal">
            <div
                className="modal-overlay"
                ref={overlayRef}
                onClick={handleClose}
            ></div>

            <div
                className="modal-content"
                ref={contentRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h2 id="modal-title">{isHindi ? 'कोर्स के लिए आवेदन करें' : 'Apply for Course'}</h2>
                        <p className="modal-subtitle">{courseTitle}</p>
                    </div>
                    <button className="modal-close" onClick={handleClose} aria-label="Close">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress */}
                <div className="modal-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">{isHindi ? 'आपकी जानकारी' : 'Your Info'}</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">{isHindi ? 'पुष्टि करें' : 'Confirm'}</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">{isHindi ? 'पूर्ण' : 'Done'}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label htmlFor="studentName">{isHindi ? 'छात्र का नाम *' : 'Student Name *'}</label>
                                <input
                                    type="text"
                                    id="studentName"
                                    name="studentName"
                                    className={`input ${errors.studentName ? 'error' : ''}`}
                                    placeholder={isHindi ? 'छात्र का पूरा नाम दर्ज करें' : "Enter student's full name"}
                                    value={formData.studentName}
                                    onChange={handleInputChange}
                                />
                                {errors.studentName && <span className="error-msg">{errors.studentName}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="parentName">{isHindi ? 'अभिभावक का नाम *' : 'Parent/Guardian Name *'}</label>
                                <input
                                    type="text"
                                    id="parentName"
                                    name="parentName"
                                    className={`input ${errors.parentName ? 'error' : ''}`}
                                    placeholder={isHindi ? 'अभिभावक का नाम दर्ज करें' : 'Enter parent/guardian name'}
                                    value={formData.parentName}
                                    onChange={handleInputChange}
                                />
                                {errors.parentName && <span className="error-msg">{errors.parentName}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">{isHindi ? 'ईमेल पता *' : 'Email Address *'}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`input ${errors.email ? 'error' : ''}`}
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && <span className="error-msg">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">{isHindi ? 'फ़ोन नंबर *' : 'Phone Number *'}</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className={`input ${errors.phone ? 'error' : ''}`}
                                        placeholder={isHindi ? '10 अंकों का नंबर' : '10 digit number'}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">{isHindi ? 'अतिरिक्त नोट्स (वैकल्पिक)' : 'Additional Notes (Optional)'}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="input"
                                    placeholder={isHindi ? 'कोई विशेष आवश्यकता या प्रश्न?' : 'Any specific requirements or questions?'}
                                    rows="3"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Confirmation */}
                    {step === 2 && (
                        <div className="form-step">
                            <div className="summary-card">
                                <h3>{isHindi ? 'आवेदन सारांश' : 'Application Summary'}</h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">{isHindi ? 'कोर्स' : 'Course'}</span>
                                        <span className="summary-value">{courseTitle}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">{isHindi ? 'छात्र' : 'Student'}</span>
                                        <span className="summary-value">{formData.studentName}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">{isHindi ? 'अभिभावक' : 'Parent/Guardian'}</span>
                                        <span className="summary-value">{formData.parentName}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">{isHindi ? 'ईमेल' : 'Email'}</span>
                                        <span className="summary-value">{formData.email}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">{isHindi ? 'फ़ोन' : 'Phone'}</span>
                                        <span className="summary-value">{formData.phone}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">{isHindi ? 'शुल्क' : 'Fee'}</span>
                                        <span className="summary-value highlight">{courseFee}</span>
                                    </div>
                                </div>
                            </div>

                            <label className="consent-checkbox">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleInputChange}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="consent-text">
                                    {isHindi 
                                        ? <>मैं <a href="/terms" target="_blank">सेवा की शर्तों</a> और <a href="/privacy" target="_blank">गोपनीयता नीति</a> से सहमत हूं। मैं इस आवेदन के संबंध में संपर्क करने के लिए सहमति देता हूं।</>
                                        : <>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>. I consent to be contacted regarding this application.</>
                                    }
                                </span>
                            </label>
                            {errors.consent && <span className="error-msg">{isHindi ? 'कृपया जारी रखने के लिए शर्तें स्वीकार करें' : errors.consent}</span>}
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="form-step success-step">
                            <div className="success-icon">
                                <svg width="64" height="64" fill="none" stroke="var(--c-success)" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>{isHindi ? 'आवेदन जमा हो गया!' : 'Application Submitted!'}</h3>
                            <p>{isHindi ? `${courseTitle} में आपकी रुचि के लिए धन्यवाद। हमारी प्रवेश टीम 24-48 घंटों के भीतर आपसे संपर्क करेगी।` : `Thank you for your interest in ${courseTitle}. Our admissions team will contact you within 24-48 hours.`}</p>
                            <p className="success-ref">{isHindi ? 'संदर्भ:' : 'Reference:'} SVN-{Date.now().toString().slice(-6)}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step !== 3 && (
                    <div className="modal-footer">
                        {step > 1 && (
                            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                                {isHindi ? 'वापस' : 'Back'}
                            </button>
                        )}
                        {step === 1 && (
                            <button className="btn btn-primary" onClick={handleNext}>
                                {isHindi ? 'जारी रखें' : 'Continue'}
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                        {step === 2 && (
                            <button className="btn btn-accent" onClick={handleSubmit}>
                                {isHindi ? 'आवेदन जमा करें' : 'Submit Application'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrollModal;
