import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { staffAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { getBilingualText } from '../utils/bilingualText';

const ManagingBody = () => {
  const { i18n } = useTranslation();
  const getText = (text) => getBilingualText(text, i18n.language);

  // Fallback managing body members data
  const fallbackMembers = [
    {
      name: 'Shekhar Chandra Agarwal',
      position: 'Director',
      image: '/assets/director.jpeg',
      bio: '',
      qualifications: '',
      experience: '',
      email: '',
      phone: '',
      achievements: [],
    },
    {
      name: 'Aninda Kumar Das',
      position: 'Principal',
      image: '/assets/principal.jpeg',
      bio: '',
      qualifications: '',
      experience: '',
      email: '',
      phone: '',
      achievements: [],
    },
    {
      name: 'Arjun Kumar Mandal',
      position: 'Vice Principal',
      image: '/assets/vice_principal.jpeg',
      bio: '',
      qualifications: '',
      experience: '',
      email: '',
      phone: '',
      achievements: [],
    },
  ];

  const members = fallbackMembers;

  // Ensure members are displayed in specific order: Director, Principal, Vice Principal
  const orderedPositions = ['Director', 'Principal', 'Vice Principal'];
  const sortedMembers = useMemo(() => {
    if (!members || members.length === 0) return [];
    const copy = [...members];
    copy.sort((a, b) => {
      const ia = orderedPositions.indexOf(a.position);
      const ib = orderedPositions.indexOf(b.position);
      // If not found in map, push them to the end preserving relative order
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
    return copy;
  }, [members]);

  return (
    <>
      <section id="managing-body" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-blue-900/10 text-blue-900 rounded-full text-sm font-semibold mb-4"
            >
              Our Leadership
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 sm:mb-6"
            >
              THE MANAGING BODY
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 text-base sm:text-lg max-w-4xl mx-auto leading-relaxed px-4"
            >
              The School Managing Committee (SMC) meets regularly to draw out the plans for the school and to check performances. It operates with the assistance of our able teaching and non-teaching staff members.
            </motion.p>
            {/* Decorative Line */}
            {/* Gallery Container (No Scrolling) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 sm:px-10 lg:px-20 pb-8 mt-6 sm:mt-8 lg:mt-12">
              {sortedMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="gallery-card w-full max-w-sm mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="relative group overflow-hidden rounded-2xl shadow-xl bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300 h-full"
                  >
                    {/* Member Image */}
                    <div className="relative h-80 sm:h-96 lg:h-[26rem] overflow-hidden bg-gray-100">
                      <img
                        src={member.image}
                        alt={member.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='28'%3ENo Image%3C/text%3E%3C/svg%3E" }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />
                      {/* Gradient Overlay - Only at bottom for text */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>

                      {/* Member Info at Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-1">{getText(member.name)}</h3>
                        <p className="text-blue-200 text-xs sm:text-sm font-medium line-clamp-2">{getText(member.position)}</p>
                      </div>
                    </div>
                    {/* Bottom Accent */}
                    <div className="h-1 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900"></div>
                  </motion.div>
                  </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default ManagingBody;
