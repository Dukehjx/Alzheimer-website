# Internationalization (i18n) Setup

This document describes the internationalization implementation for the NeuroAegis platform.

## Overview

The platform now supports 13 languages using the `react-i18next` library:
- **English (EN)** - Global standard
- **Thai (TH)** - Southeast Asian coverage  
- **Chinese Simplified (ZH)** - Mainland China & Singapore
- **Chinese Traditional (ZH-TW)** - Taiwan, Hong Kong & Macau
- **Japanese (JA)** - Japan coverage
- **Korean (KO)** - South Korea coverage
- **Spanish (ES)** - Global Spanish markets
- **Portuguese (PT)** - Brazil
- **Arabic (AR)** - Arabic-speaking regions with RTL support
- **Hindi (HI)** - India
- **Malay (MS)** - Malaysia & Southeast Asia
- **Vietnamese (VI)** - Vietnam
- **Russian (RU)** - Russia & Eastern Europe

## Features Implemented

### 1. Core i18n Infrastructure
- **Library**: react-i18next with i18next-browser-languagedetector
- **Supported Languages**: 13 languages with professional medical-grade translations
- **Language Detection**: Automatic detection based on localStorage, navigator, and htmlTag
- **Fallback Language**: English (EN)
- **Persistence**: Language preference saved to localStorage
- **RTL Support**: Full right-to-left text direction support for Arabic

### 2. Language Switcher
- **Location**: Navigation bar (both desktop and mobile)
- **Type**: Dropdown menu with 13 language options
- **Languages**: English, ไทย, 简体中文, 繁體中文, 日本語, 한국어, Español, Português, العربية, हिन्दी, Bahasa Melayu, Tiếng Việt, Русский
- **Functionality**: Click to select from available languages with RTL detection
- **Visual Indicators**: Current language highlighted with checkmark

### 3. Translated Components

#### Navigation & Layout
- ✅ Navigation component with all menu items
- ✅ Footer component with links and company information
- ✅ Language switcher component (dropdown with 13 languages)

#### Pages
- ✅ HomePage with hero section and features
- ✅ LoginForm with all authentication fields

#### Translation Keys Structure
```
nav: Navigation items (home, aiScreening, etc.)
common: Common buttons and actions (getStarted, learnMore, etc.)
home: Homepage content including features section
auth: Authentication pages (login, register)
footer: Footer content and links
legal: Legal pages (privacy, terms, etc.)
theme: Theme options
language: Language names for all 13 languages
```

### 4. Translation Quality
- **English**: Original content with professional medical terminology
- **Thai**: Professional medical terminology with cultural sensitivity
- **Chinese Simplified**: Medical-grade terminology for mainland China context
- **Chinese Traditional**: Medical-grade terminology for Taiwan/Hong Kong context
- **Japanese**: Formal medical terminology with appropriate honorifics
- **Korean**: Professional medical terminology with formal language and honorifics
- **Spanish**: Neutral Spanish suitable for global Spanish-speaking markets
- **Portuguese**: Brazilian Portuguese with appropriate medical terminology
- **Arabic**: Modern Standard Arabic with professional medical terminology and RTL support
- **Hindi**: Professional medical terminology for Indian healthcare context
- **Malay**: Professional medical terminology for Malaysia and Southeast Asia
- **Vietnamese**: Professional medical terminology for Vietnamese healthcare context
- **Russian**: Professional medical terminology for Russian-speaking regions

## Usage Guide

### For Developers

#### Adding New Translations
1. Add the English key to `frontend/src/i18n/locales/en.json`
2. Add corresponding translations to all 12 other language files:
   - `th.json` (Thai)
   - `zh.json` (Chinese Simplified)
   - `zh-TW.json` (Chinese Traditional)
   - `ja.json` (Japanese)
   - `ko.json` (Korean)
   - `es.json` (Spanish)
   - `pt.json` (Portuguese)
   - `ar.json` (Arabic)
   - `hi.json` (Hindi)
   - `ms.json` (Malay)
   - `vi.json` (Vietnamese)
   - `ru.json` (Russian)
3. Use the translation in your component:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('your.translation.key')}</h1>;
}
```

#### Language Detection Order
1. localStorage (user's previously selected language)
2. Browser navigator language
3. HTML lang attribute
4. Fallback to English

### For Users

#### Switching Languages
- **Desktop**: Click the language dropdown (🌐) in the top navigation bar
- **Mobile**: Open the mobile menu and find the language dropdown in settings
- **Options**: English, ไทย, 简体中文, 繁體中文, 日本語, 한국어, Español, Português, العربية, हिन्दी, Bahasa Melayu, Tiếng Việt, Русский
- **RTL**: Arabic automatically switches to right-to-left text direction
- **Indicator**: Shows current language name and highlights selected option

## File Structure

```
frontend/src/i18n/
├── index.js           # i18n configuration with 13 languages
└── locales/
    ├── en.json        # English translations
    ├── th.json        # Thai translations
    ├── zh.json        # Chinese Simplified translations
    ├── zh-TW.json     # Chinese Traditional translations
    ├── ja.json        # Japanese translations
    ├── ko.json        # Korean translations
    ├── es.json        # Spanish translations
    ├── pt.json        # Portuguese translations
    ├── ar.json        # Arabic translations (RTL)
    ├── hi.json        # Hindi translations
    ├── ms.json        # Malay translations
    ├── vi.json        # Vietnamese translations
    └── ru.json        # Russian translations
```

## Components with i18n Support

### Fully Translated
- [x] Navigation.jsx
- [x] HomePage.jsx
- [x] LoginForm.jsx
- [x] Footer.jsx
- [x] LanguageSwitcher.jsx (13-language dropdown with RTL support)

### Needs Translation (for future development)
- [ ] RegisterForm.jsx
- [ ] EarlyDetectionQuizPage.jsx
- [ ] AIScreeningPage.jsx
- [ ] CognitiveTraining.jsx
- [ ] ResourceHubPage.jsx
- [ ] ProfilePage.jsx
- [ ] Legal pages (Privacy, Terms, etc.)

## Technical Details

### Dependencies Added
```json
{
  "react-i18next": "^13.x.x",
  "i18next": "^23.x.x", 
  "i18next-browser-languagedetector": "^7.x.x"
}
```

### Configuration
- **Debug Mode**: Enabled in development
- **Interpolation**: HTML escaping disabled (safe for React)
- **Detection**: Browser language detection with localStorage caching
- **Namespace**: Using default "translation" namespace
- **Supported Languages**: en, th, zh, zh-TW, ja, ko, es, pt, ar, hi, ms, vi, ru
- **RTL Support**: Automatic direction switching for Arabic

### Language Switcher Component
- **Type**: Dropdown menu with click-outside-to-close functionality
- **Features**: 
  - Visual indicators for current language
  - Hover states and transitions
  - Accessible ARIA attributes
  - Responsive design
  - Dark mode support
  - Support for 13 languages
  - RTL direction detection
  - Document language attribute setting

### Language Codes
- **en**: English
- **th**: Thai (ไทย)
- **zh**: Chinese Simplified (简体中文)
- **zh-TW**: Chinese Traditional (繁體中文)
- **ja**: Japanese (日本語)
- **ko**: Korean (한국어)
- **es**: Spanish (Español)
- **pt**: Portuguese (Português)
- **ar**: Arabic (العربية) - RTL
- **hi**: Hindi (हिन्दी)
- **ms**: Malay (Bahasa Melayu)
- **vi**: Vietnamese (Tiếng Việt)
- **ru**: Russian (Русский)

## Best Practices

1. **Key Naming**: Use nested keys with descriptive names
2. **Consistency**: Follow the established key structure
3. **Context**: Group related translations under common parent keys
4. **Fallbacks**: Always provide English translations as fallback
5. **Testing**: Test all 13 languages to ensure proper rendering
6. **Medical Terminology**: Use appropriate medical terms for each language and region
7. **Cultural Sensitivity**: Ensure translations are culturally appropriate for each region
8. **Character Sets**: Properly handle different writing systems (Latin, Chinese, Arabic, Devanagari, Cyrillic, etc.)
9. **RTL Support**: Test Arabic thoroughly for proper right-to-left rendering

## Regional Considerations

### Chinese Language Variants
- **Simplified Chinese (zh)**: Used in mainland China, Singapore
- **Traditional Chinese (zh-TW)**: Used in Taiwan, Hong Kong, Macau

### Arabic RTL Support
- **Direction**: Automatic right-to-left text direction
- **Layout**: CSS adjustments for proper RTL layout
- **Fonts**: Optimized Arabic font rendering

### Medical Terminology Differences
- **Languages adapt medical terms appropriately**:
  - Japanese: アルツハイマー病
  - Korean: 알츠하이머병  
  - Spanish: Enfermedad de Alzheimer
  - Portuguese: Doença de Alzheimer
  - Arabic: مرض الزهايمر
  - Hindi: अल्जाइमर रोग
  - Malay: Penyakit Alzheimer
  - Vietnamese: Bệnh Alzheimer
  - Russian: Болезнь Альцгеймера

## Browser Support

The i18n implementation supports all modern browsers and falls back gracefully for:
- localStorage availability
- Language detection APIs
- CSS for different text directions (LTR/RTL)
- Font rendering for all character sets (Latin, Chinese, Arabic, Devanagari, Cyrillic)
- RTL layout support

## Performance

- **Bundle Size**: Translation files are loaded only when needed
- **Caching**: Browser caches translation files and user preferences
- **Lazy Loading**: Future enhancement could implement lazy loading of translation files
- **Font Loading**: Optimized font loading for different writing systems
- **RTL Performance**: Efficient CSS-based RTL support without JavaScript overhead 