# 🌍 NeuroAegis: AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention

Welcome to NeuroAegis - our innovative platform designed to facilitate early detection of Mild Cognitive Impairment (MCI) and support Alzheimer's prevention through AI-driven tools and resources. This project combines advanced language analysis, cognitive training, comprehensive resources, and scientifically-designed assessments to promote cognitive health.

## 🧠 Core Features

### 1. Early Detection Quiz

- **Quick Test (6 questions)**: Rapid 2-3 minute screening with Yes/No questions for immediate cognitive insights
- **Comprehensive Test (20 questions)**: Detailed 10-15 minute assessment with multiple choice and input questions
- **Domain Analysis**: Evaluates Memory, Orientation, Language, Executive Function, and Attention with weighted scoring
- **Scientifically-Based Scoring**: Uses established cognitive assessment principles with clear interpretation thresholds
- **Immediate Results**: Real-time scoring with color-coded results and actionable recommendations
- **Medical Compliance**: Comprehensive disclaimers and guidance for professional consultation

### 2. AI-Powered MCI & Alzheimer's Early Screening

- **AI Language Analysis**: Users can submit speech or text samples, which our AI analyzes to assess potential cognitive decline by examining linguistic patterns.
- **Real-time Feedback**: Receive immediate risk scores based on factors like vocabulary richness, sentence complexity, and fluency.
- **Data Tracking**: Monitor language trends over time to identify early signs of cognitive decline.
- **Speech-to-Text Integration**: Uses OpenAI's Whisper API for accurate transcription of user speech recordings.

### 3. Alzheimer's Prevention & Cognitive Training

- **Daily Cognitive Training Games**: Engage in AI-generated language-based challenges, such as word recall and reading comprehension, to strengthen cognitive abilities.
- **Memory Match Game**: Complete memory training exercises with question-answer card matching across multiple difficulty levels and game modes.
- **Personalized Recommendations**: Obtain AI-driven, customized prevention plans tailored to individual cognitive profiles.
- **Lifestyle & Health Guidelines**: Access evidence-based strategies for diet, exercise, sleep, and social interaction to slow cognitive decline.
- **Progress Tracking**: Comprehensive metrics to monitor cognitive performance over time across all training exercises.

### 4. Resource Hub

- **Alzheimer's Knowledge Base**: Explore comprehensive information on early symptoms, prevention strategies, and caregiving tips.
- **Latest Research Updates**: Stay informed with AI-curated articles on new findings in Alzheimer's treatment and prevention.
- **Community Support Forum**: Connect with patients, caregivers, and researchers to exchange insights and experiences.
- **Personalized Resource Recommendations**: AI-driven content suggestions based on user profile and needs.

### 5. Health Monitoring & User Profiles

- **Speech Recordings & Progress Tracking**: Periodically record speech to monitor cognitive changes over time.
- **Doctor/Researcher Collaboration (Optional)**: Share data with medical professionals or researchers to support studies on cognitive health.
- **User Profile Management**: Comprehensive profile management with health metrics, cognitive scores, and personalized recommendations.
- **Journal Entries**: Option for users to maintain cognitive health journals tracked over time.

## 🛠 Technical Implementation

### 1. Frontend (User Interface & Interaction)

- **Tech Stack**:
  - **Core**: React.js 18.x with modern hooks and functional components
  - **Styling**: Tailwind CSS with customized theming, Headless UI components
  - **State Management**: React Context API with custom hooks
  - **Routing**: React Router v6 with protected routes
  - **Forms**: React Hook Form for form validation and submission
  - **Charts & Visualization**: Chart.js with React-ChartJS-2 for data visualization
  - **Animation**: Framer Motion for smooth UI transitions
  - **Icons**: Heroicons and React Icons libraries
- **Key Components**:
  - Responsive layout with collapsible sidebar navigation
  - Dark/light mode theming with persistent user preferences
  - Interactive dashboard with cognitive health metrics visualization
  - Early Detection Quiz with scientifically-designed assessments
  - AI Screening interface with speech recording and text input options
  - Result visualization with cognitive scores, category breakdowns, and recommendations
  - Resource Hub with categorized content
  - Cognitive Training games with progress tracking
  - User Profile management with authentication

### 2. Backend (Data Processing & AI Computation)

- **Tech Stack**:
  - **Core**: FastAPI (Python) with async support
  - **Authentication**: JWT-based authentication system
  - **Database**: MongoDB for flexible document storage
  - **NLP Processing**: spaCy for natural language processing
  - **Machine Learning**: scikit-learn for model training and inference
  - **Speech Processing**: OpenAI Whisper for speech-to-text conversion
  - **AI Integration**: OpenAI GPT models (GPT-4o) for advanced language analysis
  - **Error Handling**: Comprehensive exception handling and logging
  
- **API Structure**:
  - RESTful API design with organized endpoint namespaces
  - Validation using Pydantic models for request/response data
  - CORS middleware for cross-domain requests
  - Health check and monitoring endpoints
  - Static file serving for resources

- **Key Modules**:
  - **Authentication API**: User registration, login, profile management
  - **Language Analysis API**: Speech-to-text conversion, linguistic analysis, cognitive assessment
  - **Cognitive Training API**: Game generation, progress tracking, personalized challenges
  - **Resource Hub API**: Content management, personalized recommendations
  - **AI Router**: Advanced AI interactions for various platform features

### 3. AI & Machine Learning Pipeline

- **Speech-to-Text (STT)**: 
  - Integration with OpenAI's Whisper API for accurate speech transcription
  - Audio processing with PyDub and FFmpeg
  
- **NLP Feature Extraction**:
  - Lexical diversity measurement using advanced algorithms
  - Dependency parsing with spaCy to evaluate sentence complexity
  - Tracking of hesitations, repetitions, and pause patterns to analyze fluency
  
- **AI Model Factory**:
  - Flexible architecture with model selection capabilities
  - Support for multiple AI models with OpenAI GPT-4o as the primary language model
  - Custom prompt engineering for specific cognitive assessment tasks
  
- **ML-Based Cognitive Risk Scoring**: 
  - Models trained on Alzheimer's language datasets
  - Feature extraction and normalization pipeline
  - Scoring algorithms for different cognitive domains

### 4. Database Structure

- **Collections**:
  - Users: User profiles and authentication data
  - Analysis Results: Language assessment outcomes and historical trends
  - Cognitive Training: Game configurations and challenges
  - Training Sessions: User training history and performance metrics
  - Resources: Educational content and reference materials
  - User Metrics: Aggregated cognitive health indicators
  - Journal Entries: User-generated content for cognitive tracking
  - Quiz Results: Early detection quiz scores and historical data

---

## 📁 Project Structure

```
Alzheimer-website/
├── frontend/           # React-based frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components (auth, layout, cognitive games, etc.)
│   │   │   ├── TextAnalysis.jsx
│   │   │   ├── AudioRecorder.jsx
│   │   │   ├── AIModelSettings.jsx
│   │   │   ├── AudioProcessingError.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── SiteMetadata.jsx
│   │   │   ├── ScoreExplanation.jsx
│   │   │   ├── ThemeSwitcher.jsx
│   │   │   ├── FontSizeSelector.jsx
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── cognitive-games/
│   │   ├── pages/              # Page components and routes
│   │   │   ├── ResourceHub.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResourceHubPage.jsx
│   │   │   ├── AIScreeningPage.jsx
│   │   │   ├── EarlyDetectionQuizPage.jsx
│   │   │   ├── CognitiveTraining.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── CognitiveTrainingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfService.jsx
│   │   │   ├── CookiePolicy.jsx
│   │   │   └── DataProtection.jsx
│   │   ├── data/               # Static data and configurations
│   │   │   └── quizData.js
│   │   ├── contexts/           # React context providers
│   │   │   ├── ThemeContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── api/                # API integration layer
│   │   │   ├── apiClient.js
│   │   │   ├── aiService.js
│   │   │   └── authService.js
│   │   ├── assets/             # Static assets (images, fonts)
│   │   │   └── react.svg
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Application entry point
│   │   ├── index.css           # Global styles and Tailwind
│   │   ├── theme.js            # Theme configuration
│   │   └── config.js           # Application configuration
│   ├── public/                 # Public static files
│   │   ├── manifest.json
│   │   └── brain-icon.svg
│   ├── build/                  # Production build output
│   ├── node_modules/           # Node.js dependencies
│   ├── package.json            # Project dependencies and scripts
│   ├── package-lock.json       # Dependency lock file
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.cjs     # Tailwind CSS configuration
│   ├── postcss.config.cjs      # PostCSS configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── .npmrc                  # NPM configuration
│   └── QUIZ_IMPLEMENTATION.md  # Quiz feature documentation
├── backend/            # Python-based backend server
│   ├── app/
│   │   ├── models/             # Database models
│   │   │   ├── training.py
│   │   │   ├── analysis.py
│   │   │   ├── resource.py
│   │   │   ├── token.py
│   │   │   ├── user.py
│   │   │   └── __init__.py
│   │   ├── routes/             # API route handlers
│   │   │   └── ai.py
│   │   ├── api/                # API endpoints
│   │   │   ├── cognitive_training.py
│   │   │   ├── auth.py
│   │   │   ├── language_analysis.py
│   │   │   ├── resources.py
│   │   │   └── __init__.py
│   │   ├── services/           # Business logic services
│   │   │   ├── resource_service.py
│   │   │   ├── cognitive_training_service.py
│   │   │   └── __init__.py
│   │   ├── schemas/            # Data validation schemas
│   │   │   └── resource.py
│   │   ├── utils/              # Utility functions
│   │   │   ├── security.py
│   │   │   └── __init__.py
│   │   ├── ai/                 # AI-related functionality
│   │   │   ├── factory.py
│   │   │   ├── openai_init.py
│   │   │   ├── gpt/
│   │   │   │   ├── analyzer.py
│   │   │   │   ├── risk_assessment.py
│   │   │   │   └── __init__.py
│   │   │   └── speech/
│   │   │       ├── whisper_processor.py
│   │   │       └── __init__.py
│   │   ├── db/
│   │   │   ├── mongodb.py
│   │   │   └── __init__.py
│   │   ├── __init__.py         # App package init
│   │   └── db.py               # DB connection logic
│   ├── static/
│   │   ├── brain-icon.svg
│   │   ├── favicon.ico
│   │   └── game/               # Cognitive game static files (compiled Python)
│   │       ├── cognitive_exercises.cpython-311.pyc
│   │       ├── sound_manager.cpython-311.pyc
│   │       ├── run_cognitive_exercises.cpython-311.pyc
│   │       ├── menu.cpython-311.pyc
│   │       ├── main.cpython-311.pyc
│   │       ├── game_board.cpython-311.pyc
│   │       ├── challenge_system.cpython-311.pyc
│   │       ├── card.cpython-311.pyc
│   │       └── __init__.cpython-311.pyc
│   ├── scripts/                # Utility and data population scripts
│   │   ├── db_utils.py
│   │   ├── populate_resources.py
│   │   └── add_user.py
│   ├── main.py                 # Application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── backend.log             # Backend log file
│   ├── .gitignore              # Git ignore rules
│   ├── venv/                   # Python virtual environment
│   ├── __pycache__/            # Python bytecode cache
│   └── .vscode/                # VSCode settings
│       └── settings.json
├── docs/               # Project documentation
├── struct.md           # Project structure documentation
└── README.md           # This file
```

---

## Key Components Description

### Frontend
- **components/**: Reusable UI components (auth, layout, cognitive games, etc.)
- **pages/**: Page-level components and routing logic
- **data/**: Static data configurations (quiz questions, thresholds)
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

---

## 🚀 Setup and Deployment

### Backend Setup
1. Create and activate a virtual environment: `python -m venv venv && source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env` (see `.env.example` for reference)
4. **Populate the resource database**: `python scripts/update_resources_from_txt.py` (loads resources from `resourcehub.txt`)
5. Run the development server: `python main.py`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. For production build: `npm run build`

## 🔧 Development Guidelines

- **Code Style**: Follow PEP 8 for Python and Airbnb style guide for JavaScript
- **API Documentation**: FastAPI auto-generates Swagger UI documentation at `/docs`
- **Testing**: Run tests with pytest for backend and Jest for frontend
- **Version Control**: Follow conventional commit messages for clarity

## 🎯 Project Highlights

- **High Innovation**: Combines AI-powered linguistic analysis with cognitive training, scientifically-designed assessments, and Alzheimer's prevention.
- **Significant Social Impact**: Assists aging populations and caregivers in tracking cognitive health with multiple assessment tools.
- **Commercial Potential**: Potential to evolve into a subscription-based cognitive health monitoring service.
- **Cutting-edge AI**: Leverages the latest advancements in natural language processing and AI models.
- **Data-driven Insights**: Provides valuable metrics and visualization for cognitive health tracking.
- **Medical Compliance**: Comprehensive disclaimers and professional guidance integration.

### Database Management Scripts
- **`scripts/update_resources_from_txt.py`**: Parses `resourcehub.txt` and populates MongoDB with all resources (70 resources across 3 categories)
- **`scripts/cleanup_resources.py`**: Removes any malformed resources with URLs as titles
- **`scripts/populate_resources.py`**: Legacy script with hardcoded resources (replaced by the txt parser)
- **`scripts/add_user.py`**: Utility to add test users to the database

## 🧪 New Features

### Early Detection Quiz
The platform now includes a comprehensive Early Detection Quiz system:
- **Quick Test**: 6-question rapid screening (2-3 minutes)
- **Comprehensive Test**: 20-question detailed assessment (10-15 minutes)
- **Domain Analysis**: Memory, Orientation, Language, Executive Function, Attention
- **Weighted Scoring**: Scientifically-based scoring with clear thresholds
- **Responsive Design**: Works across all devices with dark mode support
- **Medical Compliance**: Comprehensive disclaimers and professional guidance

For detailed information about the quiz implementation, see `frontend/QUIZ_IMPLEMENTATION.md`. 