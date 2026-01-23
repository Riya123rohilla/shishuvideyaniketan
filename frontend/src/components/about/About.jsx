// import React from 'react';
import { useTranslation } from 'react-i18next';
import school from '../../assets/school.png';
import student from '../../assets/Prayer.png';
import { motion } from 'framer-motion';

function About() {
  const { t } = useTranslation();

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <>
      <div className="relative w-full h-[85vh] md:h-[100vh]">
        <motion.img
          src={school}
          alt="school"
          className="absolute top-0 left-0 w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('aboutPage.title')}
          </h1>
          <p className="max-w-3xl text-lg md:text-xl leading-relaxed font-bold">
            {t('aboutPage.description')}
          </p>
        </motion.div>
      </div>


      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              {t('aboutPage.whoWeAre.title')}
            </h2>
            <p className="text-lg text-gray-700 font-bold leading-relaxed">
              {t('aboutPage.whoWeAre.description')}
            </p>

          </motion.div>


          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              src={student}
              alt="student"
              className="w-full h-[370px] object-cover rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About;
