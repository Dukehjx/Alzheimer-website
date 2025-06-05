import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher({ className = '' }) {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', name: t('language.english'), nativeName: 'English' },
        { code: 'th', name: t('language.thai'), nativeName: 'ไทย' },
        { code: 'zh', name: t('language.chinese'), nativeName: '简体中文' },
        { code: 'zh-TW', name: t('language.traditionalChinese'), nativeName: '繁體中文' },
        { code: 'ja', name: t('language.japanese'), nativeName: '日本語' },
        { code: 'ko', name: t('language.korean'), nativeName: '한국어' },
        { code: 'es', name: t('language.spanish'), nativeName: 'Español' },
        { code: 'pt', name: t('language.portuguese'), nativeName: 'Português' },
        { code: 'ar', name: t('language.arabic'), nativeName: 'العربية' },
        { code: 'hi', name: t('language.hindi'), nativeName: 'हिन्दी' },
        { code: 'ms', name: t('language.malay'), nativeName: 'Bahasa Melayu' },
        { code: 'vi', name: t('language.vietnamese'), nativeName: 'Tiếng Việt' },
        { code: 'ru', name: t('language.russian'), nativeName: 'Русский' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);

        // Set document direction for RTL languages
        if (languageCode === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', languageCode);
        }

        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Initialize document direction on mount
    useEffect(() => {
        if (i18n.language === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', i18n.language);
        }
    }, [i18n.language]);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <LanguageIcon className="h-5 w-5" />
                <span className="hidden sm:inline">
                    {currentLanguage.nativeName}
                </span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50">
                    <div className="py-1">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${i18n.language === language.code
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{language.nativeName}</span>
                                    {i18n.language === language.code && (
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 