# Internationalization (i18n) Setup

This document describes the internationalization implementation for the NeuroAegis platform.

## Overview

The platform now supports both English (EN) and Thai (TH) languages using the `react-i18next` library.

## Features Implemented

### 1. Core i18n Infrastructure
- **Library**: react-i18next with i18next-browser-languagedetector
- **Language Detection**: Automatic detection based on localStorage, navigator, and htmlTag
- **Fallback Language**: English (EN)
- **Persistence**: Language preference saved to localStorage

### 2. Language Toggle
- **Location**: Navigation bar (both desktop and mobile)
- **Icon**: Language icon with current language indicator (EN/TH)
- **Functionality**: One-click toggle between English and Thai

### 3. Translated Components

#### Navigation & Layout
- ✅ Navigation component with all menu items
- ✅ Footer component with links and company information
- ✅ Language switcher component

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
language: Language names
```

### 4. Thai Translations Quality
- **Accuracy**: Professional Thai translations for medical/healthcare context
- **Terminology**: Appropriate medical terminology for cognitive health
- **Cultural Sensitivity**: Culturally appropriate phrasing for Thai users

## Usage Guide

### For Developers

#### Adding New Translations
1. Add the English key to `frontend/src/i18n/locales/en.json`
2. Add the corresponding Thai translation to `frontend/src/i18n/locales/th.json`
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
- **Desktop**: Click the language icon (🌐) in the top navigation bar
- **Mobile**: Open the mobile menu and find the language toggle
- **Indicator**: Shows current language (EN for English, TH for Thai)

## File Structure

```
frontend/src/i18n/
├── index.js           # i18n configuration
└── locales/
    ├── en.json        # English translations
    └── th.json        # Thai translations
```

## Components with i18n Support

### Fully Translated
- [x] Navigation.jsx
- [x] HomePage.jsx
- [x] LoginForm.jsx
- [x] Footer.jsx
- [x] LanguageSwitcher.jsx

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

## Best Practices

1. **Key Naming**: Use nested keys with descriptive names
2. **Consistency**: Follow the established key structure
3. **Context**: Group related translations under common parent keys
4. **Fallbacks**: Always provide English translations as fallback
5. **Testing**: Test both languages to ensure proper rendering

## Browser Support

The i18n implementation supports all modern browsers and falls back gracefully for:
- localStorage availability
- Language detection APIs
- CSS for RTL languages (if needed in future)

## Performance

- **Bundle Size**: Translation files are loaded only when needed
- **Caching**: Browser caches translation files and user preferences
- **Lazy Loading**: Future enhancement could implement lazy loading of translation files 