import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: 'Home',
        about: 'About',
        products: 'Products',
        login: 'Login',
        welcome: 'Welcome to LIMAT!',
      },
    },
    am: {
      translation: {
        home: 'መነሻ',
        about: 'ስለ እኛ',
        products: 'ምርቶች',
        login: 'ግባ',
        welcome: 'እንኳን ወደ ሊማት በደህና መጡ!',
      },
    },
    om: {
      translation: {
        home: 'Mana',
        about: 'Waa’ee keenya',
        products: 'Meeshaalee',
        login: 'Seeni',
        welcome: 'Baga gara LIMAT dhufte!',
      },
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
