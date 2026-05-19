import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi }
};

// Get saved language or default to English
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // Use saved language or English as default
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    }
  });

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  document.documentElement.setAttribute('lang', lng);
});

// Set initial lang attribute
document.documentElement.setAttribute('lang', savedLanguage);

export default i18n;
