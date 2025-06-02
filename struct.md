# Alzheimer Website Project Structure

## Project Overview
```
Alzheimer-website/
├── frontend/           # React-based frontend application
├── backend/           # Python-based backend server
├── docs/             # Project documentation
├── struct.md         # Project structure documentation
└── README.md         # Main project documentation
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
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   └── cognitive-games/ # Cognitive training game components
│   ├── pages/             # Page components and routes
│   │   ├── HomePage.jsx
│   │   ├── EarlyDetectionQuizPage.jsx  # NEW: Quiz assessment page
│   │   ├── AIScreeningPage.jsx
│   │   ├── CognitiveTraining.jsx
│   │   ├── CognitiveTrainingPage.jsx
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
│   │   └── quizData.js    # NEW: Quiz questions and scoring logic
│   ├── contexts/          # React context providers
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── api/              # API integration layer
│   │   ├── apiClient.js
│   │   ├── aiService.js
│   │   └── authService.js
│   ├── assets/           # Static assets (images, fonts)
│   │   └── react.svg
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
└── QUIZ_IMPLEMENTATION.md # NEW: Quiz feature documentation
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
│   ├── schemas/         # Data validation schemas
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
│   └── game/           # Cognitive game static files (compiled Python)
│       ├── cognitive_exercises.cpython-311.pyc
│       ├── sound_manager.cpython-311.pyc
│       ├── run_cognitive_exercises.cpython-311.pyc
│       ├── menu.cpython-311.pyc
│       ├── main.cpython-311.pyc
│       ├── game_board.cpython-311.pyc
│       ├── challenge_system.cpython-311.pyc
│       ├── card.cpython-311.pyc
│       └── __init__.cpython-311.pyc
├── scripts/            # Utility and data population scripts
│   ├── db_utils.py
│   ├── populate_resources.py
│   └── add_user.py
├── main.py             # Application entry point
├── requirements.txt    # Python dependencies
├── backend.log         # Backend log file
├── .gitignore         # Git ignore rules
├── venv/              # Python virtual environment
├── __pycache__/       # Python bytecode cache
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

#### Pages
- **pages/**: Page-level components and routing logic
  - **HomePage.jsx**: Landing page with quiz entry points
  - **EarlyDetectionQuizPage.jsx**: **NEW** - Complete quiz assessment system
  - **AIScreeningPage.jsx**: AI-powered language analysis
  - **CognitiveTraining.jsx**: Cognitive training games
  - **ResourceHubPage.jsx**: Educational resources
  - **ProfilePage.jsx**: User profile management
  - **Dashboard.jsx**: User dashboard with metrics

#### Data & Configuration
- **data/**: Static data configurations
  - **quizData.js**: **NEW** - Quiz questions, scoring logic, and thresholds
- **contexts/**: React context providers for state management
- **api/**: API integration and data management
- **assets/**: Static resources (images, icons, fonts)

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
- **scripts/**: Utility and data population scripts

### Configuration Files
- **vite.config.js**: Frontend build configuration
- **tailwind.config.cjs**: UI styling framework configuration
- **package.json**: Frontend Node.js dependencies
- **requirements.txt**: Backend Python dependencies

## New Features Added

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
  - `cognitiveTrainingService.js`: **NEW** - API service for all cognitive training exercises
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
