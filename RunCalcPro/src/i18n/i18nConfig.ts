/**
 * i18next configuration for RunCals Pro
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { translations } from './translations';
import { loadLanguage } from '../utils/storage';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: translations.en,
      },
      zh: {
        translation: translations.zh,
      },
    },
    lng: 'zh', // Default language (will be overridden by saved preference)
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Load saved language preference
loadLanguage().then((savedLang) => {
  if (savedLang) {
    i18n.changeLanguage(savedLang);
  } else {
    // Use device locale if available
    const deviceLang = Localization.getLocales()[0]?.languageCode;
    if (deviceLang === 'en' || deviceLang === 'zh') {
      i18n.changeLanguage(deviceLang);
    }
  }
});

export default i18n;

