# Alzheimer Website Project Structure

## Project Overview
```
Alzheimer-website/
├── frontend/           # React-based frontend application
├── backend/            # Python-based backend server
└── docs/               # Project documentation
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
│   │   ├── auth/           # Auth-related UI components
│   │   ├── layout/         # Layout components
│   │   └── cognitive-games/ # Cognitive games UI components
│   ├── pages/              # Page components and routes
│   │   ├── ResourceHub.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ResourceHubPage.jsx
│   │   ├── AIScreeningPage.jsx
│   │   ├── CognitiveTraining.jsx
│   │   ├── HomePage.jsx
│   │   ├── CognitiveTrainingPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── LoginPage.jsx
│   ├── contexts/           # React context providers
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── api/                # API integration layer
│   │   ├── apiClient.js
│   │   ├── aiService.js
│   │   └── authService.js
│   ├── assets/             # Static assets (images, fonts)
│   │   └── react.svg
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   ├── index.css           # Global styles and Tailwind
│   ├── theme.js            # Theme configuration
│   └── config.js           # Application configuration
├── public/                 # Public static files
│   ├── manifest.json
│   └── brain-icon.svg
├── build/                  # Production build output
├── node_modules/           # Node.js dependencies
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── vite.config.js          # Vite configuration
├── tailwind.config.cjs     # Tailwind CSS configuration
├── postcss.config.cjs      # PostCSS configuration
├── eslint.config.js        # ESLint configuration
└── .npmrc                  # NPM configuration
```

## Backend Structure
```
backend/
├── app/                    # Main application package
│   ├── models/             # Database models
│   │   ├── training.py
│   │   ├── analysis.py
│   │   ├── resource.py
│   │   ├── token.py
│   │   ├── user.py
│   │   └── __init__.py
│   ├── routes/             # API route handlers
│   │   └── ai.py
│   ├── api/                # API endpoints
│   │   ├── cognitive_training.py
│   │   ├── auth.py
│   │   ├── language_analysis.py
│   │   ├── resources.py
│   │   └── __init__.py
│   ├── services/           # Business logic services
│   │   ├── resource_service.py
│   │   ├── cognitive_training_service.py
│   │   └── __init__.py
│   ├── schemas/            # Data validation schemas
│   │   └── resource.py
│   ├── utils/              # Utility functions
│   │   ├── security.py
│   │   └── __init__.py
│   ├── ai/                 # AI-related functionality
│   │   ├── factory.py
│   │   ├── openai_init.py
│   │   ├── gpt/            # GPT-4o integration
│   │   │   ├── analyzer.py
│   │   │   ├── risk_assessment.py
│   │   │   └── __init__.py
│   │   └── speech/         # Speech processing (Whisper)
│   │       ├── whisper_processor.py
│   │       └── __init__.py
│   ├── db/                 # Database configuration
│   │   ├── mongodb.py
│   │   └── __init__.py
│   ├── __init__.py         # App package init
│   └── db.py               # DB connection logic
├── static/                 # Static files
│   ├── brain-icon.svg
│   ├── favicon.ico
│   └── game/               # Cognitive game static files (compiled Python)
│       ├── cognitive_exercises.cpython-311.pyc
│       ├── sound_manager.cpython-311.pyc
│       ├── run_cognitive_exercises.cpython-311.pyc
│       ├── menu.cpython-311.pyc
│       ├── main.cpython-311.pyc
│       ├── game_board.cpython-311.pyc
│       ├── challenge_system.cpython-311.pyc
│       ├── card.cpython-311.pyc
│       └── __init__.cpython-311.pyc
├── scripts/                # Utility and data population scripts
│   ├── db_utils.py
│   ├── populate_resources.py
│   └── add_user.py
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── backend.log             # Backend log file
├── .gitignore              # Git ignore rules
├── venv/                   # Python virtual environment
├── __pycache__/            # Python bytecode cache
└── .vscode/                # VSCode settings
    └── settings.json
```

## Key Components Description

### Frontend
- **components/**: Reusable UI components (auth, layout, cognitive games, etc.)
- **pages/**: Page-level components and routing logic
- **contexts/**: React context providers for state management
- **api/**: API client configuration and endpoints
- **assets/**: Static resources (images, icons, fonts)
- **public/**: Public static files (manifest, icons)
- **App.jsx/main.jsx**: Main app and entry point
- **theme.js/config.js**: Theming and configuration

### Backend
- **models/**: Database models and schemas
- **routes/**: API route definitions and handlers
- **api/**: API endpoints (auth, language analysis, cognitive training, resources)
- **services/**: Business logic implementation
- **schemas/**: Data validation and serialization
- **ai/**: AI-related features and integrations
  - **gpt/**: GPT-4o based text analysis
  - **speech/**: Whisper API speech processing
- **utils/**: Backend utility functions and helpers
- **db/**: Database connection and configuration
- **static/**: Static files and compiled cognitive games
- **scripts/**: Utility and data population scripts
- **main.py**: Application entry point
- **requirements.txt**: Python dependencies

### Configuration
- **vite.config.js**: Frontend build configuration
- **tailwind.config.cjs**: UI styling framework configuration
- **postcss.config.cjs**: PostCSS configuration
- **eslint.config.js**: ESLint configuration
- **package.json**: Frontend Node.js dependencies
- **.vscode/**: Editor settings
