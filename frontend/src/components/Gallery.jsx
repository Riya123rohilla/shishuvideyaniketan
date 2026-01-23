import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

const images = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=90',
        title: 'Our Campus',
        category: 'Campus Life',
        description: 'Our beautiful campus features modern architecture surrounded by lush green gardens, providing an ideal environment for learning and growth.',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=90',
        title: 'Advanced Science Labs',
        category: 'Academics',
        description: 'State-of-the-art science laboratories equipped with modern equipment for hands-on experiments in Physics, Chemistry, and Biology.',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=90',
        title: 'Creative Art Studio',
        category: 'Arts',
        description: 'A dedicated space for students to explore their creativity through painting, sculpture, and various forms of visual arts.',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=90',
        title: 'Interactive Classrooms',
        category: 'Academics',
        description: 'Smart classrooms with digital boards and modern teaching aids to make learning engaging and interactive.',
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=1200&q=90',
        title: 'Music & Performing Arts',
        category: 'Arts',
        description: 'Well-equipped music room with various instruments where students learn vocal and instrumental music.',
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&q=90',
        title: 'Healthy Cafeteria',
        category: 'Facilities',
        description: 'Hygienic cafeteria serving nutritious meals prepared with fresh ingredients in a clean environment.',
    },
    {
        id: 7,
        src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=90',
        title: 'Resource Center',
        category: 'Facilities',
        description: 'Extensive library with thousands of books, digital resources, and quiet study areas for research and reading.',
    },
    {
        id: 8,
        src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=90',
        title: 'Sports Complex',
        category: 'Sports',
        description: 'Multi-sport complex with facilities for cricket, football, basketball, and athletics to promote physical fitness.',
    },
];

const Gallery = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const carouselRef = useRef(null);
    const slidesRef = useRef([]);
    const titleRef = useRef(null);
    const categoryRef = useRef(null);
    const modalRef = useRef(null);

    // Drag state
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentX = useRef(0);
    const dragOffset = useRef(0);
    const dragThreshold = 50;

    slidesRef.current = [];
    const addToRefs = (el) => {
        if (el && !slidesRef.current.includes(el)) {
            slidesRef.current.push(el);
        }
    };

    // Infinite loop navigation
    const goToSlide = (index) => {
        let newIndex = index;
        if (newIndex < 0) {
            newIndex = images.length - 1;
        } else if (newIndex >= images.length) {
            newIndex = 0;
        }
        setActiveIndex(newIndex);
    };

    const nextSlide = () => {
        goToSlide(activeIndex + 1);
    };

    const prevSlide = () => {
        goToSlide(activeIndex - 1);
    };

    // Calculate circular offset for 360° effect
    const getCircularOffset = (index, active, total) => {
        let offset = index - active;
        if (offset > total / 2) {
            offset -= total;
        } else if (offset < -total / 2) {
            offset += total;
        }
        return offset;
    };

    // Animate slides to position
    const animateSlides = (extraOffset = 0) => {
        const total = images.length;

        slidesRef.current.forEach((slide, index) => {
            if (!slide) return;

            const offset = getCircularOffset(index, activeIndex, total);
            const isActive = offset === 0;
            const isSide = Math.abs(offset) === 1;
            const isVisible = Math.abs(offset) <= 2;

            gsap.to(slide, {
                x: offset * 380 + extraOffset,
                scale: isActive ? 1 : (isSide ? 0.85 : 0.75),
                opacity: isVisible ? (isActive ? 1 : (isSide ? 0.9 : 0.6)) : 0,
                zIndex: 10 - Math.abs(offset),
                filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
                duration: extraOffset !== 0 ? 0.1 : 0.5,
                ease: extraOffset !== 0 ? 'none' : 'power3.out',
                display: isVisible ? 'block' : 'none',
            });
        });
    };

    // Animate slides when activeIndex changes
    useEffect(() => {
        dragOffset.current = 0;
        animateSlides(0);

        if (titleRef.current && categoryRef.current) {
            gsap.fromTo([categoryRef.current, titleRef.current],
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex]);

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX || e.touches?.[0]?.clientX || 0;
        currentX.current = startX.current;
        dragOffset.current = 0;
        if (carouselRef.current) {
            carouselRef.current.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        currentX.current = e.clientX || e.touches?.[0]?.clientX || 0;
        dragOffset.current = currentX.current - startX.current;
        animateSlides(dragOffset.current);
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const diff = startX.current - currentX.current;
        if (Math.abs(diff) > dragThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            animateSlides(0);
        }

        dragOffset.current = 0;
        if (carouselRef.current) {
            carouselRef.current.style.cursor = 'grab';
        }
    };

    // Touch handlers for mobile
    const handleTouchStart = (e) => {
        handleMouseDown({ clientX: e.touches[0].clientX });
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        currentX.current = e.touches[0].clientX;
        dragOffset.current = currentX.current - startX.current;
        animateSlides(dragOffset.current);
    };

    const handleTouchEnd = () => {
        handleMouseUp();
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'Escape') setShowModal(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle mouse wheel scroll
    const handleWheel = (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > 20) nextSlide();
            if (e.deltaX < -20) prevSlide();
        }
    };

    // Handle center image click
    const handleImageClick = (index, e) => {
        e.stopPropagation();
        if (index === activeIndex && Math.abs(dragOffset.current) < 10) {
            setShowModal(true);
        } else {
            goToSlide(index);
        }
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Modal animation
    useEffect(() => {
        if (showModal && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [showModal]);

    return (
        <section className="py-20 bg-white min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Section Heading */}
            <div className="text-center mb-12">
                <span className="text-sm font-bold tracking-[0.3em] uppercase mb-4 block text-gray-700">
                    {t('gallery.subtitle')}
                </span>
                <h2 className="text-5xl md:text-7xl font-bold mb-4 text-blue-900 tracking-wide uppercase" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {t('gallery.title')}
                </h2>
                <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-1 bg-blue-900"></div>
                    <div className="w-3 h-3 bg-blue-900"></div>
                    <div className="w-12 h-1 bg-blue-900"></div>
                </div>
            </div>

            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="relative w-full flex items-center justify-center select-none overflow-hidden"
                style={{ height: '550px', cursor: 'grab', maxWidth: '1400px', margin: '0 auto' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
            >
                {/* Slides */}
                <div className="relative flex items-center justify-center overflow-hidden" style={{ width: '100%', height: '100%', maxWidth: '1200px' }}>
                    {images.map((img, index) => (
                        <div
                            key={img.id}
                            ref={addToRefs}
                            onClick={(e) => handleImageClick(index, e)}
                            className={`absolute cursor-pointer transition-shadow duration-300 shadow-2xl pointer-events-auto ${index === activeIndex ? 'hover:shadow-gray-400 hover:shadow-2xl' : ''}`}
                            style={{
                                width: '350px',
                                height: '480px',
                            }}
                        >
                            <img
                                src={img.src}
                                alt={img.title}
                                className="w-full h-full object-cover"
                                draggable="false"
                            />
                            {/* Click hint overlay for center image */}
                            {index === activeIndex && (
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center group">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-4 py-2 shadow-lg">
                                        <span className="text-black text-sm font-bold flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Details
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="absolute left-4 md:left-10 z-20 bg-white hover:bg-gray-100 text-black p-3 shadow-lg transition-all hover:scale-110 active:scale-95"
                    aria-label="Previous Slide"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="absolute right-4 md:right-10 z-20 bg-white hover:bg-gray-100 text-black p-3 shadow-lg transition-all hover:scale-110 active:scale-95"
                    aria-label="Next Slide"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Active Image Info */}
            <div className="text-center mt-12">
                <h3 ref={titleRef} className="text-3xl md:text-4xl font-bold mb-2 text-blue-900">
                    {images[activeIndex].title}
                </h3>
                <p ref={categoryRef} className="text-sm font-bold uppercase tracking-widest text-gray-700">
                    {images[activeIndex].category}
                </p>
            </div>

            {/* Dot Indicators */}
            <div className="flex gap-2 mt-8">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 transition-all duration-300 ${index === activeIndex
                            ? 'bg-blue-900 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Image Details Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        className="bg-white max-w-4xl w-full overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Modal Image */}
                            <div className="md:w-1/2">
                                <img
                                    src={images[activeIndex].src}
                                    alt={images[activeIndex].title}
                                    className="w-full h-64 md:h-full object-cover"
                                />
                            </div>

                            {/* Modal Content */}
                            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                <span className="text-sm font-bold tracking-widest uppercase mb-2 text-gray-700">
                                    {images[activeIndex].category}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                                    {images[activeIndex].title}
                                </h3>
                                <p className="text-gray-700 text-lg leading-relaxed mb-6 font-bold">
                                    {images[activeIndex].description}
                                </p>

                                {/* Modal Actions */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Learn More
                                    </button>
                                </div>

                                {/* Navigation in Modal */}
                                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className="text-gray-700 text-sm font-bold">
                                        {activeIndex + 1} / {images.length}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 shadow-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
