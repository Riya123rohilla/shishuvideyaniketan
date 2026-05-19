import React from 'react';
import { useTranslation } from 'react-i18next';

const WhyLearningApproach = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      number: '1',
      title: t('whyLearningApproach.savesTime'),
      description: t('whyLearningApproach.savesTimeDesc')
    },
    {
      number: '2',
      title: t('whyLearningApproach.betterUnderstanding'),
      description: t('whyLearningApproach.betterUnderstandingDesc')
    },
    {
      number: '3',
      title: t('whyLearningApproach.examOriented'),
      description: t('whyLearningApproach.examOrientedDesc')
    },
    {
      number: '4',
      title: t('whyLearningApproach.learnAnytime'),
      description: t('whyLearningApproach.learnAnytimeDesc')
    }
  ];

  return (
    <section id="why-learning-approach" className="py-16 bg-gradient-to-r from-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            🎯 {t('whyLearningApproach.title')}
          </h2>
          <p className="text-gray-700 font-bold text-lg max-w-2xl mx-auto">
            {t('whyLearningApproach.subtitle')}
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Number Badge */}
              <div className="flex-shrink-0 w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mr-6 shadow-lg">
                {benefit.number}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 font-bold leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Check Icon */}
              <div className="flex-shrink-0 ml-4 text-blue-900">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-blue-900 text-white px-8 py-4 rounded-xl shadow-lg">
            <p className="text-lg font-semibold">
              ✨ {t('whyLearningApproach.experience')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyLearningApproach;
