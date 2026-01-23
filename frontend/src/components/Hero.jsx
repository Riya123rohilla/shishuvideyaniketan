import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative bg-cover bg-center pt-32 pb-20 overflow-hidden mt-4" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=90)'}}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="animate-slide-in-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white font-bold">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transform hover:scale-105 transition text-center shadow-lg"
              >
                {t('common.apply')}
              </a>
              <a 
                href="#about" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-blue-900 transition text-center"
              >
                {t('common.learn')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
