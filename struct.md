# Alzheimer Website Project Structure

## Project Overview
```
Alzheimer-website/
├── frontend/           # React-based frontend application
├── backend/            # Python-based backend server
├── docs/             # Project documentation
├── struct.md           # Project structure documentation
├── README.md           # Main project documentation
├── resourcehub.txt     # Raw text file for resource hub data
└── .gitignore          # Git ignore configuration
```

## Frontend Structure
```
frontend/
├── src/                    # Source code directory
│   ├── components/         # Reusable UI components
│   │   ├── TextAnalysis.jsx
│   │   ├── AudioRecorder.jsx
│   │   ├── AIModelSettings.jsx
│   │   ├── AudioProcessingError.jsx
│   │   ├── Footer.jsx
│   │   ├── Navigation.jsx
│   │   ├── SiteMetadata.jsx
│   │   ├── ScoreExplanation.jsx
│   │   ├── ThemeSwitcher.jsx
│   │   ├── FontSizeSelector.jsx
│   │   ├── LanguageSwitcher.jsx # NEW: Language selection dropdown
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   └── cognitive-games/ # Cognitive training game components
│   ├── pages/             # Page components and routes
│   │   ├── HomePage.jsx
│   │   ├── UserHomePage.jsx # NEW: Landing page for logged-in users
│   │   ├── EarlyDetectionQuizPage.jsx
│   │   ├── AIScreeningPage.jsx
│   │   ├── CognitiveTraining.jsx
│   │   ├── CognitiveTrainingPage.jsx
│   │   ├── MemoryMatchPage.jsx # NEW: Page for the Memory Match game
│   │   ├── ResourceHub.jsx
│   │   ├── ResourceHubPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── TermsOfService.jsx
│   │   ├── CookiePolicy.jsx
│   │   └── DataProtection.jsx
│   ├── data/              # Static data and configurations
│   │   ├── quizData.js
│   │   ├── memoryMatchData.js # NEW: Data for Memory Match game
│   │   ├── sequenceOrderingData.js # NEW: Data for Sequence Ordering game
│   │   └── categoryNamingData.js # NEW: Data for Category Naming game
│   ├── contexts/          # React context providers
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── api/              # API integration layer
│   │   ├── apiClient.js
│   │   ├── aiService.js
│   │   ├── authService.js
│   │   └── cognitiveTrainingService.js # NEW: Service for cognitive games
│   ├── assets/           # Static assets (images, fonts)
│   │   └── react.svg
│   ├── i18n/             # NEW: Internationalization configuration
│   │   ├── locales/      # Language JSON files (en.json, es.json, etc.)
│   │   └── index.js      # i18next configuration
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   ├── index.css         # Global styles and Tailwind
│   ├── theme.js          # Theme configuration
│   └── config.js         # Application configuration
├── public/                # Public static files
│   ├── manifest.json
│   └── brain-icon.svg
├── build/                # Production build output
├── node_modules/         # Node.js dependencies
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Dependency lock file
├── vite.config.js        # Vite configuration
├── tailwind.config.cjs   # Tailwind CSS configuration
├── postcss.config.cjs    # PostCSS configuration
├── eslint.config.js      # ESLint configuration
├── .npmrc               # NPM configuration
├── QUIZ_IMPLEMENTATION.md # Quiz feature documentation
├── MEMORY_MATCH_IMPLEMENTATION.md # NEW: Memory Match game documentation
└── INTERNATIONALIZATION.md # NEW: Internationalization documentation
```

## Backend Structure
```
backend/
├── app/                  # Main application package
│   ├── models/          # Database models
│   │   ├── user.py
│   │   ├── analysis.py
│   │   ├── training.py
│   │   ├── resource.py
│   │   ├── token.py
│   │   └── __init__.py
│   ├── routes/          # API route handlers
│   │   └── ai.py
│   ├── api/             # API endpoints
│   │   ├── auth.py
│   │   ├── language_analysis.py
│   │   ├── cognitive_training.py
│   │   ├── resources.py
│   │   └── __init__.py
│   ├── services/        # Business logic services
│   │   ├── resource_service.py
│   │   ├── cognitive_training_service.py
│   │   └── __init__.py
│   ├── schemas/         # Data validation schemas (Pydantic models)
│   │   └── resource.py
│   ├── utils/           # Utility functions
│   │   ├── security.py
│   │   └── __init__.py
│   ├── ai/             # AI-related functionality
│   │   ├── factory.py
│   │   ├── openai_init.py
│   │   ├── gpt/        # GPT-4o integration
│   │   │   ├── analyzer.py
│   │   │   ├── risk_assessment.py
│   │   │   └── __init__.py
│   │   └── speech/     # Speech processing (Whisper)
│   │       ├── whisper_processor.py
│   │       └── __init__.py
│   ├── db/             # Database configuration
│   │   ├── mongodb.py
│   │   └── __init__.py
│   ├── __init__.py
│   └── db.py
├── static/              # Static files
│   ├── brain-icon.svg
│   ├── favicon.ico
│   └── game/           # (Legacy) Cognitive game static files
├── scripts/            # Utility and data population scripts
│   ├── db_utils.py
│   ├── populate_resources.py
│   ├── cleanup_resources.py
│   ├── update_resources_from_txt.py
│   └── add_user.py
├── main.py             # Application entry point
├── requirements.txt    # Python dependencies
├── backend.log         # Backend log file
├── .gitignore         # Git ignore rules
├── venv/              # Python virtual environment
└── .vscode/           # VSCode settings
    └── settings.json
```

## Key Components Description

### Frontend

#### Core Components
- **components/**: Reusable UI components following atomic design principles
  - **TextAnalysis.jsx**: AI text analysis interface
  - **AudioRecorder.jsx**: Speech recording functionality
  - **AIModelSettings.jsx**: AI model configuration
  - **Navigation.jsx**: Main navigation with quiz link
  - **Footer.jsx**: Footer with platform links including quiz
  - **ThemeSwitcher.jsx**: Dark/light mode toggle
  - **FontSizeSelector.jsx**: Accessibility font size control
  - **LanguageSwitcher.jsx**: **NEW** - UI for selecting the display language.

#### Pages
- **pages/**: Page-level components and routing logic
  - **HomePage.jsx**: Landing page for guests.
  - **UserHomePage.jsx**: **NEW** - Landing page for authenticated users.
  - **EarlyDetectionQuizPage.jsx**: Complete quiz assessment system.
  - **AIScreeningPage.jsx**: AI-powered language analysis.
  - **CognitiveTrainingPage.jsx**: Hub for all cognitive training games.
  - **MemoryMatchPage.jsx**: **NEW** - The Memory Match cognitive game.
  - **ResourceHubPage.jsx**: Educational resources.
  - **ProfilePage.jsx**: User profile management.
  - **Dashboard.jsx**: User dashboard with metrics.

#### Data & Configuration
- **data/**: Static data for quizzes and games.
  - **quizData.js**: Quiz questions, scoring logic, and thresholds.
  - **memoryMatchData.js**: **NEW** - Questions and answers for the Memory Match game.
  - **sequenceOrderingData.js**: **NEW** - Data for the Sequence Ordering game.
  - **categoryNamingData.js**: **NEW** - Data for the Category Naming game.
- **contexts/**: React context providers for state management.
- **api/**: API integration and data management.
- **i18n/**: **NEW** - Internationalization setup using `i18next`.

### Backend

#### Core Modules
- **models/**: Database models and schemas
  - User profiles, analysis results, training sessions, resources
- **api/**: API endpoints with RESTful design
  - Authentication, language analysis, cognitive training, resources
- **services/**: Business logic implementation
- **schemas/**: Data validation and serialization

#### AI & Processing
- **ai/**: AI-related features and integrations
  - **gpt/**: GPT-4o based text analysis and risk assessment
  - **speech/**: Whisper API speech processing
- **utils/**: Backend utility functions and helpers

#### Data & Storage
- **db/**: Database connection and configuration (MongoDB)
- **static/**: Static files and compiled cognitive games
- **scripts/**: Utility and data population scripts, including parsers for `resourcehub.txt`.

### Configuration Files
- **vite.config.js**: Frontend build configuration
- **tailwind.config.cjs**: UI styling framework configuration
- **package.json**: Frontend Node.js dependencies
- **requirements.txt**: Backend Python dependencies

## New Features Added

### Cognitive Training Games
- **Expanded Game Library**: In addition to the Memory Match game, the platform now includes:
  - **Sequence Ordering**: Challenges users to remember and replicate sequences.
  - **Category Naming**: Tests semantic memory by having users name items in a category.
- **Centralized Service**: All games are managed through the `cognitiveTrainingService.js` on the frontend and the `cognitive_training.py` API on the backend.
- **Dedicated Data Files**: Each game has its own data file in `frontend/src/data/` for easy management.

### Internationalization (i18n)
- **Multi-Language Support**: The user interface now supports multiple languages to cater to a global audience.
- **Implementation**: Uses `i18next` and `react-i18next` with language files stored in `frontend/src/i18n/locales/`.
- **Language Switcher**: A `LanguageSwitcher.jsx` component allows users to change their preferred language easily.

### Early Detection Quiz System
- **Frontend Implementation**:
  - `EarlyDetectionQuizPage.jsx`: Complete quiz interface with multiple states
  - `quizData.js`: Comprehensive question database with scoring logic
  - Updated navigation and footer with quiz entry points
  - Responsive design with dark mode support

- **Quiz Features**:
  - Quick Test: 6 Yes/No questions (2-3 minutes)
  - Comprehensive Test: 20 questions with multiple choice and input
  - Domain analysis: Memory, Orientation, Language, Executive Function, Attention
  - Weighted scoring system with scientific thresholds
  - Real-time results with color-coded interpretations
  - Medical disclaimers and professional guidance

- **UI/UX Enhancements**:
  - Progress tracking with visual indicators
  - Question navigation (forward/backward)
  - Accessibility features (keyboard navigation, screen reader support)
  - Mobile-responsive design
  - Integration with existing theme system

### Documentation
- **QUIZ_IMPLEMENTATION.md**: Comprehensive documentation of quiz features
- **MEMORY_MATCH_IMPLEMENTATION.md**: **NEW** - Detailed documentation for the Memory Match game
- **INTERNATIONALIZATION.md**: **NEW** - Documentation explaining the i18n architecture and how to add new languages
- **Updated README.md**: Reflects new quiz functionality
- **Updated struct.md**: Current project structure

## Entry Points for Quiz

### Homepage Integration
- Primary call-to-action button: "Take Early Detection Quiz"
- Feature card in 4-column grid layout
- Direct routing to `/quiz`

### Navigation Integration
- Added to main navigation menu
- Available across all pages
- Mobile-responsive menu item

### Footer Integration
- Listed under "Platform" section
- Consistent with other platform features
- Accessible from any page

## Technical Architecture

### State Management
- React Context API for global state
- Local component state for quiz flow
- Answer persistence during quiz session
- Results calculation and display

### Routing
- React Router v6 with `/quiz` route
- No authentication required for quiz access
- Seamless integration with existing routing

### Styling
- Tailwind CSS with custom color schemes
- Dark mode support throughout quiz interface
- Responsive design for all screen sizes
- Accessibility-compliant color contrasts

### Data Structure
- Modular quiz question format
- Flexible scoring system
- Configurable thresholds
- Domain-based categorization

### Memory Match Game Integration
- **Frontend Implementation**:
  - `MemoryMatchGame.jsx`: Complete game interface with backend integration
  - `memoryMatchData.js`: Game data and scoring logic
  - `cognitiveTrainingService.js`: API service for all cognitive training exercises
  - Real-time progress submission and tracking
  - Error handling and user feedback

- **Backend Implementation**:
  - `cognitive_training.py`: **UPDATED** - Added memory match submission endpoint
  - `cognitive_training_service.py`: **UPDATED** - Added memory match evaluation logic
  - `training.py`: **UPDATED** - Added MEMORY_MATCH to ExerciseType enum
  - Full progress tracking and metrics calculation
  - Database integration for session storage

- **Game Features**:
  - All 5 difficulty levels with correct grid sizes and pair counts
  - Complete scoring algorithm matching specifications
  - Visual animations for card flips, matches, and mismatches
  - Game modes with different mechanics (lives in challenge mode)
  - Real-time statistics tracking and backend submission
  - Pause/resume functionality
  - Comprehensive results screen with performance feedback
  - Mobile-responsive design
  - Full keyboard navigation support
