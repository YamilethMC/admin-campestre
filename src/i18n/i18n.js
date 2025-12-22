import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import en from './locales/en.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
};

const getStoredLanguage = () => {
  return localStorage.getItem('userLanguage') || 'es';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
