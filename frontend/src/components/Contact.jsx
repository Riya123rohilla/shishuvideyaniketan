import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import schoolCampus from '../assets/school.png';
import { enquiryAPI } from '../services/api';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // Refs for GSAP animations
    const heroRef = useRef(null);
    const heroContentRef = useRef(null);
    const mapSectionRef = useRef(null);
    const infoSideRef = useRef(null);
    const formSideRef = useRef(null);
    const bannerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            const heroTl = gsap.timeline();
            heroTl
                .from(heroContentRef.current.querySelector('.hero-badge'), {
                    y: -50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                })
                .from(heroContentRef.current.querySelector('h1'), {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, '-=0.5')
                .from(heroContentRef.current.querySelector('p'), {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.6');

            // Map section animation
            gsap.from(mapSectionRef.current, {
                scrollTrigger: {
                    trigger: mapSectionRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 80,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Info side animation
            gsap.from(infoSideRef.current, {
                scrollTrigger: {
                    trigger: infoSideRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Form side animation
            gsap.from(formSideRef.current, {
                scrollTrigger: {
                    trigger: formSideRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                x: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Banner animation
            gsap.from(bannerRef.current, {
                scrollTrigger: {
                    trigger: bannerRef.current,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await enquiryAPI.create(formData);
            if (response.data.success) {
                alert(t('contact.thankYou') || 'Thank you for contacting us! We will get back to you soon.');
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            alert('Failed to submit enquiry. Please try again later.');
        }
    };

    return (
        <section className="font-sans overflow-x-hidden">
            {/* Hero Banner with Image */}
            <div className="relative h-[450px] overflow-hidden" ref={heroRef}>
                {/* Hero Image */}
                <div className="absolute inset-0 z-[1]">
                    <img
                        src={schoolCampus}
                        alt="Sishu Vidhya Niketan Campus"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Subtle dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 z-[2]"></div>
                </div>

                {/* Hero Content */}
                <div
                    className="relative z-[3] h-full flex flex-col items-center justify-center text-center px-6 pb-24 pt-10"
                    ref={heroContentRef}
                >
                    <span className="hero-badge inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 text-sm font-bold uppercase tracking-[2px] mb-5 border border-white/30">
                        {t('contact.subtitle')}
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 drop-shadow-lg">
                        {t('contact.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/95 font-bold max-w-xl mx-auto leading-relaxed">
                        {t('contact.subtitle')}
                    </p>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-[-1px] left-0 right-0 z-[4]">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-20">
                        <path
                            d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                            className="fill-white"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-white py-16 md:py-20" ref={mapSectionRef}>
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <span className="inline-block bg-gray-100 text-gray-700 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
                            {t('contact.findUs')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
                            {t('contact.ourLocation')}
                        </h2>
                        <p className="text-base md:text-lg font-bold text-gray-700 leading-relaxed">
                            {t('contact.visitCampus')}
                        </p>
                    </div>

                    {/* Map Container */}
                    <div className="w-full h-[400px] md:h-[450px] overflow-hidden shadow-2xl border-4 border-white relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0185786095466!2d77.22495091508096!3d28.631453782418843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0x52a7f9f5d2b7f7c!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1673847183451!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="School Location Map"
                        ></iframe>
                    </div>

                    {/* Directions Button */}
                    <div className="mt-7 text-center">
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 bg-blue-900 text-white px-8 py-4 text-base font-bold rounded-xl shadow-lg hover:bg-blue-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                            </svg>
                            {t('contact.getDirections')}
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact Info + Form Section */}
            <div className="bg-gray-50 py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">

                        {/* Left Side - How to Reach Us */}
                        <div className="bg-white p-8 md:p-12 shadow-2xl" ref={infoSideRef}>
                            <div className="mb-9">
                                <span className="inline-block bg-gray-100 text-gray-700 px-5 py-2 text-xs font-bold uppercase tracking-wider mb-4">
                                    {t('contact.quickInfo')}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2.5">
                                    {t('contact.howToReach')}
                                </h2>
                                <p className="text-base font-bold text-gray-700 leading-relaxed">
                                    {t('contact.reachChannels')}
                                </p>
                            </div>

                            {/* Info Items */}
                            <div className="flex flex-col gap-7">
                                {/* Location */}
                                <div className="flex items-start gap-5 p-5 bg-gray-50 border-l-4 border-blue-900 hover:bg-gray-100 hover:translate-x-2 transition-all duration-300">
                                    <div className="w-13 h-13 min-w-[52px] flex items-center justify-center bg-white text-blue-900 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-blue-900 mb-2">{t('contact.visitOurCampus')}</h4>
                                        <p className="text-sm font-bold text-gray-700">Sishu Vidhya Niketan School</p>
                                        <p className="text-sm font-bold text-gray-700">Main Road, Near City Center</p>
                                        <p className="text-sm font-bold text-gray-700">Your City, State - 123456</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-5 p-5 bg-gray-50 border-l-4 border-blue-900 hover:bg-gray-100 hover:translate-x-2 transition-all duration-300">
                                    <div className="w-13 h-13 min-w-[52px] flex items-center justify-center bg-white text-blue-900 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-blue-900 mb-2">{t('contact.callUs')}</h4>
                                        <p className="text-sm font-bold text-gray-700"><span className="text-blue-900">{t('contact.mainOffice')}:</span> +91 98765 43210</p>
                                        <p className="text-sm font-bold text-gray-700"><span className="text-blue-900">{t('contact.admissions')}:</span> +91 12345 67890</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-5 p-5 bg-gray-50 border-l-4 border-blue-900 hover:bg-gray-100 hover:translate-x-2 transition-all duration-300">
                                    <div className="w-13 h-13 min-w-[52px] flex items-center justify-center bg-white text-blue-900 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-blue-900 mb-2">{t('contact.emailUs')}</h4>
                                        <p className="text-sm font-bold text-gray-700"><span className="text-blue-900">{t('contact.general')}:</span> info@sishuvidyaniketan.edu</p>
                                        <p className="text-sm font-bold text-gray-700"><span className="text-blue-900">{t('contact.admissions')}:</span> admissions@svn.edu</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-5 p-5 bg-gray-50 border-l-4 border-blue-900 hover:bg-gray-100 hover:translate-x-2 transition-all duration-300">
                                    <div className="w-13 h-13 min-w-[52px] flex items-center justify-center bg-white text-blue-900 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-blue-900 mb-2">{t('contact.officeHours')}</h4>
                                        <p className="text-sm font-bold text-gray-700"><span className="text-blue-900">{t('contact.monFri')}:</span> 8:00 AM - 4:00 PM</p>
                                        <p className="text-sm font-bold text-gray-700"><span className="text-blue-900">{t('contact.saturday')}:</span> 9:00 AM - 1:00 PM</p>
                                        <p className="text-sm font-bold text-gray-700"><span className="text-blue-900">{t('contact.sunday')}:</span> {t('contact.closed')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="bg-blue-900 p-1.5 rounded-xl shadow-2xl" ref={formSideRef}>
                            <div className="bg-white p-8 md:p-11 h-full">
                                <div className="mb-7">
                                    <span className="inline-block bg-gray-100 text-gray-700 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
                                        {t('contact.sendMessage')}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2.5">
                                        {t('contact.writeToUs')}
                                    </h2>
                                    <p className="text-base font-bold text-gray-700 leading-relaxed">
                                        {t('contact.fillForm')}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    {/* Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="name" className="text-sm font-bold text-blue-900">{t('contact.fullName')}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder={t('contact.enterName')}
                                            required
                                            className="px-4 py-3 border-2 border-gray-200 text-black bg-white outline-none focus:border-blue-900 focus:ring-4 focus:ring-gray-100 transition-all duration-300 placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="text-sm font-bold text-blue-900">{t('contact.emailAddress')}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder={t('contact.enterEmail')}
                                            required
                                            className="px-4 py-3 border-2 border-gray-200 text-black bg-white outline-none focus:border-blue-900 focus:ring-4 focus:ring-gray-100 transition-all duration-300 placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="phone" className="text-sm font-bold text-blue-900">{t('contact.phoneNumber')}</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder={t('contact.enterPhone')}
                                            className="px-4 py-3 border-2 border-gray-200 text-black bg-white outline-none focus:border-blue-900 focus:ring-4 focus:ring-gray-100 transition-all duration-300 placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="subject" className="text-sm font-bold text-blue-900">{t('contact.subject')}</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="px-4 py-3 border-2 border-gray-200 text-black bg-white outline-none focus:border-blue-900 focus:ring-4 focus:ring-gray-100 transition-all duration-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_14px_center] bg-[length:20px] pr-12"
                                        >
                                            <option value="">{t('contact.selectSubject')}</option>
                                            <option value="admission">{t('contact.admissionInquiry')}</option>
                                            <option value="general">{t('contact.generalInquiry')}</option>
                                            <option value="feedback">{t('contact.feedback')}</option>
                                            <option value="complaint">{t('contact.complaint')}</option>
                                            <option value="other">{t('contact.other')}</option>
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="message" className="text-sm font-bold text-blue-900">{t('contact.yourMessage')}</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder={t('contact.writeMessage')}
                                            rows="4"
                                            required
                                            className="px-4 py-3 border-2 border-gray-200 text-black bg-white outline-none focus:border-blue-900 focus:ring-4 focus:ring-gray-100 transition-all duration-300 resize-y min-h-[100px] placeholder:text-gray-400"
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-3 bg-blue-900 text-white border-none px-8 py-4 text-base font-bold rounded-xl cursor-pointer shadow-lg hover:bg-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 mt-2 group"
                                    >
                                        <span>{t('contact.send')}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300">
                                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Contact Banner */}
            <div className="bg-blue-900 py-12 px-6 relative overflow-hidden rounded-xl" ref={bannerRef}>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                {t('contact.admissionQuestions')}
                            </h3>
                            <p className="text-white/85 font-bold text-base">
                                {t('contact.admissionHelp')}
                            </p>
                        </div>
                        <a
                            href="tel:+919876543210"
                            className="inline-flex items-center gap-2.5 bg-white text-blue-900 px-8 py-4 text-base font-bold shadow-lg hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 flex-shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                            </svg>
                            {t('contact.callNow')}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
