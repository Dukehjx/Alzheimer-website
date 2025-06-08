# 🌍 NeuroAegis: AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention

Welcome to NeuroAegis - our innovative platform designed to facilitate early detection of Mild Cognitive Impairment (MCI) and support Alzheimer's prevention through AI-driven tools and resources. This project combines advanced language analysis, a suite of cognitive training games, comprehensive resources, and scientifically-designed assessments to promote lifelong cognitive health.

The platform is fully internationalized, supporting multiple languages to be accessible to a global audience.

## 🧠 Core Features

### 1. Multi-Lingual Support & Accessibility
- **Global Reach**: The entire platform is internationalized (i18n) and supports over a dozen languages, including English, Spanish, Chinese, Hindi, Arabic, and more.
- **Accessibility Features**: Includes font size selectors and high-contrast themes to ensure the platform is usable by as many people as possible.

### 2. Early Detection Quiz
- **Quick Test (6 questions)**: A rapid 2-3 minute screening with Yes/No questions for immediate cognitive insights.
- **Comprehensive Test (20 questions)**: A detailed 10-15 minute assessment with multiple-choice and input questions.
- **Domain Analysis**: Evaluates Memory, Orientation, Language, Executive Function, and Attention with weighted scoring.
- **Scientifically-Based Scoring**: Uses established cognitive assessment principles with clear interpretation thresholds.
- **Immediate Results**: Real-time scoring with color-coded results and actionable recommendations.
- **Medical Compliance**: Comprehensive disclaimers and guidance for professional consultation.

### 3. AI-Powered MCI & Alzheimer's Early Screening
- **AI Language Analysis**: Users can submit speech or text samples, which our AI analyzes to assess potential cognitive decline by examining linguistic patterns.
- **Real-time Feedback**: Receive immediate risk scores based on factors like vocabulary richness, sentence complexity, and fluency.
- **Data Tracking**: Monitor language trends over time to identify early signs of cognitive decline.
- **Speech-to-Text Integration**: Uses OpenAI's Whisper API for accurate transcription of user speech recordings.

### 4. Alzheimer's Prevention & Cognitive Training
- **Diverse Game Library**: Engage in a variety of cognitive training games designed to challenge different mental faculties.
  - **Memory Match**: A classic card-matching game to test and improve short-term memory.
  - **Sequence Ordering**: Challenge your ability to recall and order sequences of items.
  - **Category Naming**: Test your semantic memory by naming items that belong to a specific category.
- **Personalized Recommendations**: Obtain AI-driven, customized prevention plans tailored to individual cognitive profiles.
- **Lifestyle & Health Guidelines**: Access evidence-based strategies for diet, exercise, sleep, and social interaction to slow cognitive decline.
- **Progress Tracking**: Comprehensive metrics to monitor cognitive performance over time across all training exercises.

### 5. Resource Hub
- **Alzheimer's Knowledge Base**: Explore comprehensive information on early symptoms, prevention strategies, and caregiving tips.
- **Latest Research Updates**: Stay informed with AI-curated articles on new findings in Alzheimer's treatment and prevention.
- **Community Support Forum**: Connect with patients, caregivers, and researchers to exchange insights and experiences.
- **Personalized Resource Recommendations**: AI-driven content suggestions based on user profile and needs.

### 6. Health Monitoring & User Profiles
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
  - **Internationalization**: `i18next` and `react-i18next` for multi-language support.
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
  - **Language Switcher**: Dropdown menu for easy language selection.

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
│   │   ├── components/         # Reusable UI components
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── cognitive-games/
│   │   ├── pages/              # Page components and routes
│   │   │   ├── UserHomePage.jsx
│   │   │   ├── MemoryMatchPage.jsx
│   │   │   └── ...
│   │   ├── data/               # Static data for games and quizzes
│   │   │   ├── quizData.js
│   │   │   ├── memoryMatchData.js
│   │   │   ├── sequenceOrderingData.js
│   │   │   └── categoryNamingData.js
│   │   ├── contexts/           # React context providers
│   │   ├── api/                # API integration layer
│   │   │   └── cognitiveTrainingService.js
│   │   ├── assets/             # Static assets (images, fonts)
│   │   ├── i18n/               # Internationalization (i18n)
│   │   │   ├── locales/        # Translation files (en.json, es.json, etc.)
│   │   │   └── index.js        # i18next configuration
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Application entry point
│   │   └── ...
│   ├── public/                 # Public static files
│   ├── package.json            # Project dependencies and scripts
│   ├── QUIZ_IMPLEMENTATION.md
│   ├── MEMORY_MATCH_IMPLEMENTATION.md
│   └── INTERNATIONALIZATION.md
├── backend/            # Python-based backend server
│   ├── app/
│   │   ├── models/             # Database models
│   │   ├── routes/             # API route handlers
│   │   ├── api/                # API endpoints
│   │   │   └── cognitive_training.py
│   │   ├── services/           # Business logic services
│   │   │   └── cognitive_training_service.py
│   │   ├── schemas/            # Data validation schemas
│   │   ├── ai/                 # AI-related functionality
│   │   │   ├── gpt/
│   │   │   └── speech/
│   │   ├── db/                 # Database configuration
│   │   └── ...
│   ├── scripts/                # Utility and data population scripts
│   │   ├── update_resources_from_txt.py
│   │   └── ...
│   ├── main.py                 # Application entry point
│   └── requirements.txt        # Python dependencies
├── struct.md           # Detailed project structure documentation
├── resourcehub.txt     # Raw data for the Resource Hub
└── README.md           # This file
```

---

## Key Components Description

### Frontend
- **components/**: Reusable UI components. Includes game components, layout, auth, and accessibility widgets like `ThemeSwitcher` and `LanguageSwitcher`.
- **pages/**: Page-level components that define the application's routes.
- **data/**: Static data for quizzes and an expanding library of cognitive games.
- **contexts/**: React Context for global state management (authentication, theme).
- **api/**: Services for communicating with the backend REST API.
- **i18n/**: Configuration and locale files for multi-language support.
- **assets/**: Static resources like images and fonts.
- **public/**: Publicly accessible files like `index.html` and manifest.

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
- **scripts/**: Utility and data population scripts
- **main.py**: Application entry point

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

### Expanded Cognitive Training Suite
The platform's cognitive training offering has been significantly expanded beyond the initial Memory Match game.
- **New Games**: 
  - **Sequence Ordering**: Challenges users to remember and correctly order a series of items.
  - **Category Naming**: A semantic memory game where users list items belonging to a given category.
- **Scalable Architecture**: The backend and frontend services (`cognitive_training.py` and `cognitiveTrainingService.js`) are built to easily accommodate new games in the future.

### Comprehensive Internationalization (i18n)
- **Global Accessibility**: The entire user interface has been translated into over a dozen languages, making the platform accessible to a worldwide audience.
- **Easy Language Switching**: Users can select their preferred language from a simple dropdown menu in the navigation bar.
- **Well-Documented**: The process for adding new languages is detailed in the `frontend/INTERNATIONALIZATION.md` file.

### Early Detection Quiz
- **Weighted Scoring**: Scientifically-based scoring with clear thresholds.
- **Responsive Design**: Works across all devices with dark mode and multi-language support.
- **Medical Compliance**: Comprehensive disclaimers and professional guidance.

For detailed information about the quiz implementation, see `frontend/QUIZ_IMPLEMENTATION.md`.
For details on the Memory Match game, see `frontend/MEMORY_MATCH_IMPLEMENTATION.md`. 