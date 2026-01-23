import React from 'react';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: '1',
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      number: '2',
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      number: '3',
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '4',
      title: t('howItWorks.step4Title'),
      description: t('howItWorks.step4Desc'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            🔄 {t('howItWorks.title')}
          </h2>
          <p className="text-gray-700 font-bold text-lg max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps Flow */}
        <div className="relative">
          {/* Desktop Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 transform -translate-y-1/2 z-0"></div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-white border-4 border-blue-900 rounded-xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-6 flex justify-center text-blue-900 mb-4">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 font-bold text-center text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-blue-900 text-white px-10 py-5 rounded-xl shadow-xl">
            <p className="text-xl font-semibold mb-2">
              🌟 A Proven Process for Academic Excellence
            </p>
            <p className="text-blue-100">
              Join hundreds of students benefiting from our structured learning approach
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
