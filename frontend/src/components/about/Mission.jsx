import React from 'react'
import { useTranslation } from 'react-i18next';
import teaching from "../../assets/Mission.png";
import { motion } from 'framer-motion';

function Mission() {
    const { t } = useTranslation();
    
    const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        <motion.div variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}>
          <img
            src={teaching}
            alt="teaching"
            className="w-full h-[420px] object-cover rounded-xl shadow-lg"
          />
        </motion.div>

        <motion.div className="space-y-10"  variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}>
          
          <div>
            <h2 className="text-blue-900 text-3xl font-bold mb-4">
              {t('aboutPage.mission.title')}
            </h2>
            <p className="text-lg text-gray-700 font-bold leading-relaxed">
              {t('aboutPage.mission.description')}
            </p>
          </div>

          <div>
            <h2 className="text-blue-900 text-3xl font-bold mb-4">
              {t('aboutPage.vision.title')}
            </h2>
            <p className="text-lg text-gray-700 font-bold leading-relaxed">
              {t('aboutPage.vision.description')}
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  )
}

export default Mission
