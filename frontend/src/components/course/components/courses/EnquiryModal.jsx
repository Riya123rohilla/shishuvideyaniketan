import { useEffect, useMemo, useState } from 'react';
import { enquiryAPI } from '../../../../services/api';
import './EnquiryModal.css';

const EnquiryModal = ({ isOpen, onClose, course, isHindi }) => {
  const courseTitle = useMemo(() => {
    if (!course) return '';
    if (isHindi && course.titleHi) return course.titleHi;
    return course.title || '';
  }, [course, isHindi]);

  const initialMessage = useMemo(
    () =>
      isHindi
        ? `मैं ${courseTitle} के बारे में पूछताछ करना चाहता/चाहती हूं। कृपया प्रवेश प्रक्रिया की जानकारी साझा करें।`
        : `I want to enquire about ${courseTitle}. Please share admission details.`,
    [courseTitle, isHindi]
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = 'hidden';
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: initialMessage,
    });
    setSubmitted(false);
    setError('');

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, initialMessage, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: `Course Enquiry - ${courseTitle || 'Course'}`,
        message: formData.message.trim(),
      };

      const response = await enquiryAPI.create(payload);
      if (response?.data?.success) {
        setSubmitted(true);
      } else {
        setError(isHindi ? 'पूछताछ जमा नहीं हो सकी। कृपया पुनः प्रयास करें।' : 'Could not submit enquiry. Please try again.');
      }
    } catch (submitError) {
      console.error('Failed to submit enquiry:', submitError);
      setError(isHindi ? 'पूछताछ जमा नहीं हो सकी। कृपया पुनः प्रयास करें।' : 'Could not submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="course-enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="course-enquiry-title">
      <div className="course-enquiry-backdrop" onClick={onClose}></div>
      <div className="course-enquiry-content">
        <button className="course-enquiry-close" onClick={onClose} aria-label="Close enquiry form">
          x
        </button>

        {!submitted ? (
          <>
            <h3 id="course-enquiry-title">{isHindi ? 'कोर्स पूछताछ' : 'Course Enquiry'}</h3>
            <p className="course-enquiry-subtitle">{courseTitle}</p>

            <form onSubmit={handleSubmit} className="course-enquiry-form">
              <label>
                {isHindi ? 'नाम' : 'Name'}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                {isHindi ? 'ईमेल' : 'Email'}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>

              <label>
                {isHindi ? 'संदेश' : 'Message'}
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                ></textarea>
              </label>

              {error && <p className="course-enquiry-error">{error}</p>}

              <button type="submit" className="btn btn-accent course-enquiry-submit" disabled={submitting}>
                {submitting
                  ? isHindi
                    ? 'जमा किया जा रहा है...'
                    : 'Submitting...'
                  : isHindi
                    ? 'पूछताछ भेजें'
                    : 'Send Enquiry'}
              </button>
            </form>
          </>
        ) : (
          <div className="course-enquiry-success">
            <h3>{isHindi ? 'धन्यवाद!' : 'Thank You!'}</h3>
            <p>
              {isHindi
                ? 'आपकी पूछताछ सफलतापूर्वक जमा हो गई है। हमारी टीम जल्द संपर्क करेगी।'
                : 'Your enquiry has been submitted successfully. Our team will contact you soon.'}
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              {isHindi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
