import React from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

function WhyChooseOurSchool() {
  const { t } = useTranslation();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const boxes = [
    {
      id: 1,
      title: t('aboutPage.whyChoose.features.faculty.title'),
      description: t('aboutPage.whyChoose.features.faculty.description'),
      image: "/assets/teacher.png",
    },
    {
      id: 2,
      title: t('aboutPage.whyChoose.features.safety.title'),
      description: t('aboutPage.whyChoose.features.safety.description'),
      image: "/assets/friendly.png",
    },
    {
      id: 3,
      title: t('aboutPage.whyChoose.features.classroom.title'),
      description: t('aboutPage.whyChoose.features.classroom.description'),
      image: "/assets/classes.png",
    },
    {
      id: 4,
      title: t('aboutPage.whyChoose.features.balance.title'),
      description: t('aboutPage.whyChoose.features.balance.description'),
      image: "/assets/extra1.png",
    },
    {
      id: 5,
      title: t('aboutPage.whyChoose.features.studentCentered.title'),
      description: t('aboutPage.whyChoose.features.studentCentered.description'),
      image: "/assets/computer.png",
    },
    {
      id: 6,
      title: t('aboutPage.whyChoose.features.parentTeacher.title'),
      description: t('aboutPage.whyChoose.features.parentTeacher.description'),
      image: "/assets/parents.png",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.h2
          className="text-3xl font-bold text-center mb-4 text-blue-900"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {t('aboutPage.whyChoose.title')}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-center text-gray-700 font-bold mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {t('aboutPage.whyChoose.subtitle')}
        </motion.p>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {boxes.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition text-blue-900"
            >
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />

              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 font-bold text-sm">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default WhyChooseOurSchool;
