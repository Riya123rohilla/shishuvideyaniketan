import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg font-semibold text-sm transition duration-300 bg-blue-900 text-white hover:bg-blue-800 flex items-center gap-2"
      title="Toggle Language"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7.921 14.612a.375.375 0 01-.53-.53l6.832-6.832a.375.375 0 010 .53L7.922 14.612z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.172 4.172a6 6 0 018.485 8.485 6 6 0 01-8.485-8.485z" clipRule="evenodd" />
      </svg>
      {i18n.language === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
