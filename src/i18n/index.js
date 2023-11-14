import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import slovakTranslation from '../locales/sk/translation.json';
import englishTranslation from '../locales/en/translation.json';

const resources = {
  sk: {
    translation: slovakTranslation
  },
 en: {
    translation: englishTranslation
  },
};


i18n
  .use(initReactI18next) 
  .init({
    resources, 
    lng: "en", 
    debug: false,
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false
    },
    ns: "translation", 
    defaultNS: "translation"
  });

export default i18n;
