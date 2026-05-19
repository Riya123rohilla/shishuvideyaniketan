import React from 'react';
import { useTranslation } from 'react-i18next';

const LearningApproach = () => {
  const { t } = useTranslation();

  const approaches = [
    {
      title: t('learningApproach.easyNotes'),
      description: t('learningApproach.easyNotesDesc'),
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      bgColor: "bg-emerald-100"
    },
    {
      title: t('learningApproach.importantPoints'),
      description: t('learningApproach.importantPointsDesc'),
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      ),
      bgColor: "bg-amber-100"
    },
    {
      title: t('learningApproach.practiceQuestions'),
      description: t('learningApproach.practiceQuestionsDesc'),
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      bgColor: "bg-teal-100"
    }
  ];

  return (
    <section id="learning" className="py-16 bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            {t('learningApproach.title')}
          </h2>
          <p className="text-gray-700 font-bold text-lg max-w-3xl mx-auto leading-relaxed">
            {t('learningApproach.subtitle')}
          </p>
        </div>

        {/* Learning Support Features Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {approaches.map((approach, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition duration-300"
            >
              <div className={`${approach.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                {approach.icon}
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">{approach.title}</h3>
              <p className="text-gray-700 font-bold leading-relaxed">
                {approach.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningApproach;
