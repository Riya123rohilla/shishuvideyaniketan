import React from 'react';
import { useTranslation } from 'react-i18next';

const CallToAction = () => {
  const { t } = useTranslation();

  return (
    <section id="cta" className="py-20 bg-cover bg-center text-white relative" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=90)'}}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          {t('callToAction.title')}
        </h2>
        <p className="text-xl mb-8 text-white font-bold">
          {t('callToAction.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#contact" 
            className="bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transform hover:scale-105 transition duration-300 shadow-lg"
          >
            {t('callToAction.startJourney')}
          </a>
          <a 
            href="tel:+919876543210" 
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transform hover:scale-105 transition duration-300"
          >
            {t('callToAction.callNow')}: +91 98765 43210
          </a>
        </div>
        <div className="mt-8 flex justify-center items-center gap-2 text-white font-bold">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">{t('callToAction.limitedSeats')}</p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
