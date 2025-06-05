import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import th from './locales/th.json';
import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';

const resources = {
    en: {
        translation: en
    },
    th: {
        translation: th
    },
    zh: {
        translation: zh
    },
    'zh-TW': {
        translation: zhTW
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        }
    });

export default i18n; 