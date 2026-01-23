import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

const FacilitiesPage = () => {
  const { t } = useTranslation();
  const [selectedFacility, setSelectedFacility] = useState(0);

  const facilities = [
    {
      id: 1,
      title: t('facilitiesPage.scienceLabs.title'),
      icon: '🔬',
      description: t('facilitiesPage.scienceLabs.description'),
      features: [t('facilitiesPage.scienceLabs.features.modern'), t('facilitiesPage.scienceLabs.features.safety'), t('facilitiesPage.scienceLabs.features.expert'), t('facilitiesPage.scienceLabs.features.group')],
      image: '/images/science_lab.png',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: t('facilitiesPage.computerLabs.title'),
      icon: '💻',
      description: t('facilitiesPage.computerLabs.description'),
      features: [t('facilitiesPage.computerLabs.features.hardware'), t('facilitiesPage.computerLabs.features.internet'), t('facilitiesPage.computerLabs.features.software'), t('facilitiesPage.computerLabs.features.cloud')],
      image: '/images/computer_lab.png',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: t('facilitiesPage.smartClassrooms.title'),
      icon: '📚',
      description: t('facilitiesPage.smartClassrooms.description'),
      features: [t('facilitiesPage.smartClassrooms.features.boards'), t('facilitiesPage.smartClassrooms.features.projectors'), t('facilitiesPage.smartClassrooms.features.video'), t('facilitiesPage.smartClassrooms.features.interactive')],
      image: '/images/classroom.png',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: t('facilitiesPage.library.title'),
      icon: '📖',
      description: t('facilitiesPage.library.description'),
      features: [t('facilitiesPage.library.features.collection'), t('facilitiesPage.library.features.ebooks'), t('facilitiesPage.library.features.study'), t('facilitiesPage.library.features.reference')],
      image: '/images/library.png',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: t('facilitiesPage.sports.title'),
      icon: '⚽',
      description: t('facilitiesPage.sports.description'),
      features: [t('facilitiesPage.sports.features.indoor'), t('facilitiesPage.sports.features.outdoor'), t('facilitiesPage.sports.features.gym'), t('facilitiesPage.sports.features.pool')],
      image: '/images/sports.png',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 6,
      title: t('facilitiesPage.artMusic.title'),
      icon: '🎨',
      description: t('facilitiesPage.artMusic.description'),
      features: [t('facilitiesPage.artMusic.features.instruments'), t('facilitiesPage.artMusic.features.supplies'), t('facilitiesPage.artMusic.features.sound'), t('facilitiesPage.artMusic.features.gallery')],
      image: '/images/art_studio.png',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 7,
      title: t('facilitiesPage.cafeteria.title'),
      icon: '🍽️',
      description: t('facilitiesPage.cafeteria.description'),
      features: [t('facilitiesPage.cafeteria.features.hygienic'), t('facilitiesPage.cafeteria.features.diverse'), t('facilitiesPage.cafeteria.features.nutritious'), t('facilitiesPage.cafeteria.features.dietary')],
      image: '/images/cafeteria.png',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 8,
      title: t('facilitiesPage.medical.title'),
      icon: '⚕️',
      description: t('facilitiesPage.medical.description'),
      features: [t('facilitiesPage.medical.features.firstAid'), t('facilitiesPage.medical.features.checkups'), t('facilitiesPage.medical.features.doctor'), t('facilitiesPage.medical.features.medicine')],
      image: '/images/medical.png',
      color: 'from-red-500 to-rose-500'
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      '.facility-card',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  }, []);

  const handleCardClick = (index) => {
    setSelectedFacility(index);
    gsap.fromTo(
      '.facility-detail',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <section className="relative pt-32 pb-16 px-4 bg-cover bg-center text-white" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=90)'}}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <div className="relative max-w-6xl mx-auto z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">{t('facilitiesPage.title')}</h1>
          <p className="text-xl md:text-2xl text-white font-bold max-w-3xl">
            {t('facilitiesPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Facilities List */}
          <div className="lg:col-span-1">
            <div className="space-y-3 sticky top-24">
              {facilities.map((facility, index) => (
                <button
                  key={facility.id}
                  onClick={() => handleCardClick(index)}
                  className={`facility-card w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedFacility === index
                      ? 'bg-gradient-to-r ' + facility.color + ' text-white shadow-lg scale-105'
                      : 'bg-white hover:bg-gray-50 text-gray-800 shadow border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{facility.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm md:text-base">{facility.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Facility Details */}
          <div className="lg:col-span-2">
            <div className="facility-detail bg-white rounded-xl shadow-lg overflow-hidden">
              <div className={`h-64 bg-gradient-to-r ${facilities[selectedFacility].color} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">{facilities[selectedFacility].icon}</span>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-blue-900">
                  {facilities[selectedFacility].title}
                </h2>

                <p className="text-gray-700 font-bold mb-6 text-lg leading-relaxed">
                  {facilities[selectedFacility].description}
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-blue-900">{t('facilitiesPage.keyFeatures')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {facilities[selectedFacility].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${facilities[selectedFacility].color} flex items-center justify-center text-white font-bold text-sm`}>
                          ✓
                        </div>
                        <span className="text-gray-700 font-bold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className={`w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${facilities[selectedFacility].color} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  {t('facilitiesPage.scheduleTour')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          {[
            { number: '8+', label: t('facilitiesPage.stats.facilities') },
            { number: '5000+', label: t('facilitiesPage.stats.students') },
            { number: '200+', label: t('facilitiesPage.stats.staff') },
            { number: '15', label: t('facilitiesPage.stats.acres') },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-8 text-center transform hover:scale-105 transition duration-300">
              <div className="text-4xl font-bold text-blue-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-700 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;
