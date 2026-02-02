import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ManagingBody = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Managing body members data with full details
  const members = [
    {
      name: 'Rajdeep Dhanuka',
      position: 'Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      bio: 'Mr. Rajdeep Dhanuka is a visionary leader with over 20 years of experience in educational administration. He has been instrumental in shaping the school\'s growth and development.',
      qualifications: 'MBA in Education Management, B.Ed',
      experience: '20+ years in Education Sector',
      email: 'director@shishuvidyaniketan.edu',
      phone: '+91 98765 43210',
      achievements: [
        'Founded the school in 2005',
        'Implemented digital learning initiatives',
        'Established scholarship programs for underprivileged students'
      ]
    },
    {
      name: 'Sanjay Kumar Jha',
      position: 'Principal',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
      bio: 'Mr. Sanjay Kumar Jha is a dedicated educator with a passion for nurturing young minds. He brings extensive experience in curriculum development and student welfare.',
      qualifications: 'M.A. in English Literature, M.Ed, Ph.D in Education',
      experience: '25+ years in Teaching & Administration',
      email: 'principal@shishuvidyaniketan.edu',
      phone: '+91 98765 43211',
      achievements: [
        'Improved school ranking to top 10 in district',
        'Introduced activity-based learning curriculum',
        'Established parent-teacher collaboration programs'
      ]
    },
    {
      name: 'Lata Agarwal',
      position: 'Member Managing Committee / Trust Treasurer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',
      bio: 'Mrs. Lata Agarwal manages the financial operations of the school trust with expertise and dedication. She ensures transparent and efficient fund management.',
      qualifications: 'CA, MBA in Finance',
      experience: '18+ years in Financial Management',
      email: 'treasurer@shishuvidyaniketan.edu',
      phone: '+91 98765 43212',
      achievements: [
        'Implemented transparent accounting systems',
        'Managed infrastructure development funds',
        'Established student welfare fund'
      ]
    },
    {
      name: 'Priya Sharma',
      position: 'Vice Principal',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face',
      bio: 'Mrs. Priya Sharma is committed to academic excellence and student development. She oversees daily operations and maintains high educational standards.',
      qualifications: 'M.Sc in Mathematics, B.Ed',
      experience: '15+ years in Education',
      email: 'viceprincipal@shishuvidyaniketan.edu',
      phone: '+91 98765 43213',
      achievements: [
        'Developed examination and assessment systems',
        'Introduced remedial teaching programs',
        'Organized inter-school competitions'
      ]
    },
    {
      name: 'Amit Kumar',
      position: 'Academic Director',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face',
      bio: 'Mr. Amit Kumar leads the academic planning and curriculum development. He ensures that students receive quality education aligned with modern standards.',
      qualifications: 'M.Tech, M.Ed, NET Qualified',
      experience: '12+ years in Academic Planning',
      email: 'academic@shishuvidyaniketan.edu',
      phone: '+91 98765 43214',
      achievements: [
        'Designed integrated curriculum framework',
        'Implemented STEM education programs',
        'Established teacher training workshops'
      ]
    }
  ];

  // Check scroll position to show/hide navigation arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Handle mouse wheel for horizontal scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
        checkScrollPosition();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  // Mouse drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    checkScrollPosition();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  // Scroll left/right with buttons
  const scrollByAmount = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const gap = 24;
      const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 400);
    }
  };

  const openModal = (member) => {
    if (!isDragging) {
      setSelectedMember(member);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

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
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mt-6 sm:mt-8"
            >
              <div className="w-8 sm:w-12 h-1 bg-blue-900 rounded-full"></div>
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-blue-900 rounded-full"></div>
              <div className="w-8 sm:w-12 h-1 bg-blue-900 rounded-full"></div>
            </motion.div>
          </div>

          {/* Gallery Container */}
          <div className="relative">
            {/* Left Navigation Button */}
            <motion.button
              onClick={() => scrollByAmount('left')}
              initial={{ opacity: 0 }}
              animate={{ opacity: canScrollLeft ? 1 : 0.3 }}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : ''}`}
              aria-label="Scroll Left"
              disabled={!canScrollLeft}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Right Navigation Button */}
            <motion.button
              onClick={() => scrollByAmount('right')}
              initial={{ opacity: 1 }}
              animate={{ opacity: canScrollRight ? 1 : 0.3 }}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : ''}`}
              aria-label="Scroll Right"
              disabled={!canScrollRight}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Scrollable Gallery */}
            <div 
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="overflow-x-auto px-8 sm:px-12 lg:px-16 pb-4 scrollbar-hide select-none"
              style={{ 
                cursor: 'grab',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex gap-6 w-max">
                {members.map((member, index) => (
                  <motion.div
                    key={index}
                    className="gallery-card flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="relative group overflow-hidden rounded-xl sm:rounded-2xl shadow-lg bg-white cursor-pointer border border-gray-200 hover:shadow-2xl transition-all duration-300 h-full"
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openModal(member)}
                    >
                      {/* Member Image */}
                      <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          draggable="false"
                        />
                        {/* Gradient Overlay - Only at bottom for text */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
                        
                        {/* Click to View Badge */}
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span className="text-xs sm:text-sm font-medium text-blue-900">Click to view</span>
                        </div>
                        
                        {/* Member Info at Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                          <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-1">{member.name}</h3>
                          <p className="text-blue-200 text-xs sm:text-sm font-medium line-clamp-2">{member.position}</p>
                        </div>
                      </div>
                      
                      {/* Bottom Accent */}
                      <div className="h-1 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900"></div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center items-center gap-2 mt-6 text-blue-900/60">
              <svg className="w-5 h-5 animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="text-sm font-medium">Scroll or drag to see more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative h-48 sm:h-64 md:h-80">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/50 to-transparent"></div>
                
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Name and Position */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{selectedMember.name}</h3>
                  <p className="text-blue-200 text-sm sm:text-lg font-medium">{selectedMember.position}</p>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {/* Bio */}
                <div className="mb-6">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    About
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{selectedMember.bio}</p>
                </div>
                
                {/* Info Grid */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {/* Qualifications */}
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-5">
                    <h4 className="text-xs sm:text-sm font-semibold text-blue-900/70 uppercase tracking-wide mb-2">Qualifications</h4>
                    <p className="text-blue-900 text-sm sm:text-base font-medium">{selectedMember.qualifications}</p>
                  </div>
                  
                  {/* Experience */}
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-5">
                    <h4 className="text-xs sm:text-sm font-semibold text-blue-900/70 uppercase tracking-wide mb-2">Experience</h4>
                    <p className="text-blue-900 text-sm sm:text-base font-medium">{selectedMember.experience}</p>
                  </div>
                </div>
                
                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </span>
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {selectedMember.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-900 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-600 text-sm sm:text-base">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Contact Info */}
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Contact Information
                  </h4>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    <a 
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group text-sm"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900/60 group-hover:text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-blue-900/80 group-hover:text-blue-900 truncate">{selectedMember.email}</span>
                    </a>
                    <a 
                      href={`tel:${selectedMember.phone}`}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group text-sm"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900/60 group-hover:text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-blue-900/80 group-hover:text-blue-900">{selectedMember.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManagingBody;
