import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  const features = [
    { title: "Quality Education", description: "Experienced faculty and proven teaching methods" },
    { title: "Holistic Development", description: "Focus on academics, sports, arts, and values" },
    { title: "Safe Environment", description: "Secure campus with caring staff and modern facilities" }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Image */}
          <div className="order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=90" 
              alt="Students in classroom" 
              className="rounded-xl shadow-xl"
            />
          </div>
          
          {/* About Content */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              {t('about.title')} {t('navbar.schoolName')}
            </h2>
            <p className="text-gray-700 font-bold text-lg mb-4 leading-relaxed">
              {t('about.description')}
            </p>
            <p className="text-gray-700 font-bold text-lg mb-4 leading-relaxed">
              <span className="font-semibold text-blue-600">{t('about.mission')}:</span> {t('about.missionText')}
            </p>
            <p className="text-gray-700 font-bold text-lg mb-6 leading-relaxed">
              <span className="font-semibold text-blue-600">{t('about.vision')}:</span> {t('about.visionText')}
            </p>
            
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 mb-3">
                <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <p className="text-gray-700 font-bold">
                  <span className="font-semibold">{feature.title}:</span> {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
