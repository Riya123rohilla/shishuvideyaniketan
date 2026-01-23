import React from 'react';
import { useTranslation } from 'react-i18next';

const LearningSupportFeatures = () => {
  const { t } = useTranslation();

  // Learning support features - 3 cards
  const features = [
    {
      title: '📝 ' + t('learningSupportFeatures.easyNotes'),
      description: t('learningSupportFeatures.easyNotesDesc'),
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-700'
    },
    {
      title: '🎯 ' + t('learningSupportFeatures.importantPoints'),
      description: t('learningSupportFeatures.importantPointsDesc'),
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-amber-600 to-amber-800'
    },
    {
      title: '✍️ ' + t('learningSupportFeatures.practiceQuestions'),
      description: t('learningSupportFeatures.practiceQuestionsDesc'),
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-teal-700 to-teal-900'
    }
  ];

  return (
    <section id="learning-support" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            📘 {t('learningSupportFeatures.title')}
          </h2>
          <p className="text-gray-700 font-bold text-lg max-w-3xl mx-auto">
            {t('learningSupportFeatures.subtitle')}
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Card Content */}
              <div className="relative p-8 bg-white border-2 border-slate-800">
                <div className="flex justify-center mb-6 text-slate-800 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-700 font-bold text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-slate-800 opacity-10 rounded-bl-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningSupportFeatures;
