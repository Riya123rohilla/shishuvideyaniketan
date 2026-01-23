import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import LearningApproach from '../components/LearningApproach';
import LearningSupportFeatures from '../components/LearningSupportFeatures';
import WhyLearningApproach from '../components/WhyLearningApproach';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import LearningImpact from '../components/LearningImpact';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CallToAction from '../components/CallToAction';

const HomePage = () => {
  return (
    <div className="pt-20">
      {/* 🏠 Hero Section */}
      <Hero />
      
      {/* 🏫 About School */}
      <About />
      
      {/* 📘 Modern Learning Approach */}
      <LearningApproach />
      
      {/* 📝 Learning Support Features - 3 Cards */}
      <LearningSupportFeatures />
      
      {/* 🎯 Why This Learning Approach - Numbered List */}
      <WhyLearningApproach />
      
      {/* 🔄 How Learning Support Works - 4 Steps */}
      <HowItWorks />
      
      {/* ⭐ Why Choose Us */}
      <WhyChooseUs />
      
      {/* 📊 Student Learning Impact - Stats */}
      <LearningImpact />
      
      {/* 🗣️ Testimonials */}
      <Testimonials />
      
      {/* ❓ FAQ */}
      <FAQ />
      
      {/* 📣 Call To Action */}
      <CallToAction />
    </div>
  );
};

export default HomePage;
