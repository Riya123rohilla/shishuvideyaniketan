import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LearningImpact = () => {
  const { t } = useTranslation();
  
  // State for animated counters
  const [counters, setCounters] = useState({
    resources: 0,
    students: 0,
    satisfaction: 0
  });

  const stats = [
    {
      id: 'resources',
      target: 1000,
      suffix: '+',
      label: t('learningImpact.learningResources'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'students',
      target: 800,
      suffix: '+',
      label: t('learningImpact.studentsSupported'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'satisfaction',
      target: 95,
      suffix: '%',
      label: t('learningImpact.studentSatisfaction'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'performance',
      target: 100,
      suffix: '%',
      label: t('learningImpact.improvedPerformance'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    // Animate counters on component mount
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = stats.map((stat) => {
      const increment = stat.target / steps;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(intervals.find(i => i === intervals[stats.indexOf(stat)]));
        }
        setCounters(prev => ({
          ...prev,
          [stat.id]: Math.floor(current)
        }));
      }, stepDuration);
    });

    return () => intervals.forEach(clearInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="learning-impact" className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            📊 {t('learningImpact.title')}
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {t('learningImpact.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="bg-white text-blue-900 rounded-xl shadow-2xl p-8 text-center transform hover:scale-105 transition duration-300"
            >
              <div className="flex justify-center mb-4 text-blue-900">
                {stat.icon}
              </div>
              <div className="text-5xl font-bold mb-2">
                {counters[stat.id]}{stat.suffix}
              </div>
              <p className="text-lg font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Achievement Note */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 text-lg italic">
            ✨ Our commitment to excellence reflects in every student's success story
          </p>
        </div>
      </div>
    </section>
  );
};

export default LearningImpact;
