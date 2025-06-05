# Internationalization (i18n) Setup

This document describes the internationalization implementation for the NeuroAegis platform.

## Overview

The platform now supports English (EN), Thai (TH), Chinese Simplified (ZH), and Chinese Traditional (ZH-TW) languages using the `react-i18next` library.

## Features Implemented

### 1. Core i18n Infrastructure
- **Library**: react-i18next with i18next-browser-languagedetector
- **Supported Languages**: English, Thai, Chinese Simplified, Chinese Traditional
- **Language Detection**: Automatic detection based on localStorage, navigator, and htmlTag
- **Fallback Language**: English (EN)
- **Persistence**: Language preference saved to localStorage

### 2. Language Switcher
- **Location**: Navigation bar (both desktop and mobile)
- **Type**: Dropdown menu with language options
- **Languages**: English, ไทย (Thai), 简体中文 (Simplified Chinese), 繁體中文 (Traditional Chinese)
- **Functionality**: Click to select from available languages
- **Visual Indicators**: Current language highlighted with checkmark

### 3. Translated Components

#### Navigation & Layout
- ✅ Navigation component with all menu items
- ✅ Footer component with links and company information
- ✅ Language switcher component (dropdown with 4 languages)

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
language: Language names (English, ไทย, 简体中文, 繁體中文)
```

### 4. Translation Quality
- **English**: Original content with professional medical terminology
- **Thai**: Professional Thai translations for medical/healthcare context with appropriate terminology and cultural sensitivity
- **Chinese Simplified**: Professional Simplified Chinese translations with medical-grade terminology appropriate for cognitive health context in mainland China
- **Chinese Traditional**: Professional Traditional Chinese translations with medical-grade terminology appropriate for cognitive health context in Taiwan, Hong Kong, and other Traditional Chinese regions

## Usage Guide

### For Developers

#### Adding New Translations
1. Add the English key to `frontend/src/i18n/locales/en.json`
2. Add the corresponding Thai translation to `frontend/src/i18n/locales/th.json`
3. Add the corresponding Simplified Chinese translation to `frontend/src/i18n/locales/zh.json`
4. Add the corresponding Traditional Chinese translation to `frontend/src/i18n/locales/zh-TW.json`
5. Use the translation in your component:

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
- **Options**: English, ไทย, 简体中文, 繁體中文
- **Indicator**: Shows current language name and highlights selected option

## File Structure

```
frontend/src/i18n/
├── index.js           # i18n configuration
└── locales/
    ├── en.json        # English translations
    ├── th.json        # Thai translations
    ├── zh.json        # Chinese Simplified translations
    └── zh-TW.json     # Chinese Traditional translations
```

## Components with i18n Support

### Fully Translated
- [x] Navigation.jsx
- [x] HomePage.jsx
- [x] LoginForm.jsx
- [x] Footer.jsx
- [x] LanguageSwitcher.jsx (4-language dropdown)

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
- **Supported Languages**: en, th, zh, zh-TW

### Language Switcher Component
- **Type**: Dropdown menu with click-outside-to-close functionality
- **Features**: 
  - Visual indicators for current language
  - Hover states and transitions
  - Accessible ARIA attributes
  - Responsive design
  - Dark mode support
  - Support for 4 languages

### Language Codes
- **en**: English
- **th**: Thai (ไทย)
- **zh**: Chinese Simplified (简体中文)
- **zh-TW**: Chinese Traditional (繁體中文)

## Best Practices

1. **Key Naming**: Use nested keys with descriptive names
2. **Consistency**: Follow the established key structure
3. **Context**: Group related translations under common parent keys
4. **Fallbacks**: Always provide English translations as fallback
5. **Testing**: Test all four languages to ensure proper rendering
6. **Medical Terminology**: Use appropriate medical terms for each language and region
7. **Cultural Sensitivity**: Ensure translations are culturally appropriate for each region
8. **Character Sets**: Properly handle both Simplified and Traditional Chinese characters

## Regional Considerations

### Chinese Language Variants
- **Simplified Chinese (zh)**: Used in mainland China, Singapore
- **Traditional Chinese (zh-TW)**: Used in Taiwan, Hong Kong, Macau

### Medical Terminology Differences
- **Simplified Chinese**: Uses mainland China medical terminology
- **Traditional Chinese**: Uses Taiwan/Hong Kong medical terminology
- **Example**: Alzheimer's Disease
  - Simplified: 阿尔兹海默病
  - Traditional: 阿茲海默症

## Browser Support

The i18n implementation supports all modern browsers and falls back gracefully for:
- localStorage availability
- Language detection APIs
- CSS for different text directions
- Font rendering for Chinese characters (both Simplified and Traditional)

## Performance

- **Bundle Size**: Translation files are loaded only when needed
- **Caching**: Browser caches translation files and user preferences
- **Lazy Loading**: Future enhancement could implement lazy loading of translation files
- **Font Loading**: Chinese characters load efficiently with proper font fallbacks for both character sets 