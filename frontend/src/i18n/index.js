import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import th from './locales/th.json';
import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import ms from './locales/ms.json';
import vi from './locales/vi.json';
import ru from './locales/ru.json';

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
    },
    ja: {
        translation: ja
    },
    ko: {
        translation: ko
    },
    es: {
        translation: es
    },
    pt: {
        translation: pt
    },
    ar: {
        translation: ar
    },
    hi: {
        translation: hi
    },
    ms: {
        translation: ms
    },
    vi: {
        translation: vi
    },
    ru: {
        translation: ru
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