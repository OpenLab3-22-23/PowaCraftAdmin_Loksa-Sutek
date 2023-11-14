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


// Získání polohy uživatele
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;

    // Volání Geonames API pro získání informací o poloze
    const response = await fetch(`http://api.geonames.org/countryCodeJSON?lat=${latitude}&lng=${longitude}&username=powiss`);
    const data = await response.json();

    console.log("Skratka tvojej krajiny: ", data.countryCode);
  }, error => {
    console.error("Chyba při získávání polohy:", error.message);
  });
} else {
  console.error("Geolocation není podporováno v tomto prohlížeči.");
}


i18n
  .use(initReactI18next) 
  .init({
    resources, 
    lng: "sk", 
    debug: false,
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false
    },
    ns: "translation", 
    defaultNS: "translation"
  });

export default i18n;