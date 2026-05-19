import React from 'react';
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Class 8 Student",
      text: "The structured notes and practice questions helped me understand topics much better. I can revise faster and remember everything for exams!"
    },
    {
      name: "Mrs. Deepika Verma",
      role: "Mathematics Teacher",
      text: "This structured approach has transformed our teaching method. Students are more engaged and their academic performance has improved significantly."
    },
    {
      name: "Arjun Kumar",
      role: "Class 6 Student",
      text: "I love how the teachers make learning fun and easy. The practice questions help me prepare well for tests. Thank you for making studying enjoyable!"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            🗣️ {t('testimonials.title')}
          </h2>
          <p className="text-gray-700 font-bold text-lg max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 font-bold mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-blue-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
