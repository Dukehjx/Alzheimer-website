import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher({ className = '' }) {
    const { i18n, t } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'th' : 'en';
        i18n.changeLanguage(newLang);
    };

    const currentLanguageLabel = i18n.language === 'en' ? t('language.thai') : t('language.english');

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title={`Switch to ${currentLanguageLabel}`}
            >
                <LanguageIcon className="h-5 w-5" />
                <span className="hidden sm:inline">
                    {i18n.language === 'en' ? 'EN' : 'TH'}
                </span>
            </button>
        </div>
    );
} 