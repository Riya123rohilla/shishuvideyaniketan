import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80)'}}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative text-center text-white px-4 z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">{t('about.title')}</h1>
        <p className="text-2xl text-white font-bold mb-8">{t('common.comingSoon')}</p>
        <Link 
          to="/" 
          className="inline-block bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transform hover:scale-105 transition duration-300 shadow-lg"
        >
          ← {t('common.backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
