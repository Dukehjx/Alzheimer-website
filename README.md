# 🌍 AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention

Welcome to our innovative platform designed to facilitate early detection of Mild Cognitive Impairment (MCI) and support Alzheimer's prevention through AI-driven tools and resources. This project combines advanced language analysis, cognitive training, and comprehensive resources to promote cognitive health.

## 🧠 Core Features

### 1. AI-Powered MCI & Alzheimer's Early Screening

- **AI Language Analysis**: Users can submit speech or text samples, which our AI analyzes to assess potential cognitive decline by examining linguistic patterns.
- **Real-time Feedback**: Receive immediate risk scores based on factors like vocabulary richness, sentence complexity, and fluency.
- **Data Tracking**: Monitor language trends over time to identify early signs of cognitive decline.
- **Speech-to-Text Integration**: Uses OpenAI's Whisper API for accurate transcription of user speech recordings.

### 2. Alzheimer's Prevention & Cognitive Training

- **Daily Cognitive Training Games**: Engage in AI-generated language-based challenges, such as word recall and reading comprehension, to strengthen cognitive abilities.
- **Personalized Recommendations**: Obtain AI-driven, customized prevention plans tailored to individual cognitive profiles.
- **Lifestyle & Health Guidelines**: Access evidence-based strategies for diet, exercise, sleep, and social interaction to slow cognitive decline.
- **Progress Tracking**: Comprehensive metrics to monitor cognitive performance over time.

### 3. Resource Hub

- **Alzheimer's Knowledge Base**: Explore comprehensive information on early symptoms, prevention strategies, and caregiving tips.
- **Latest Research Updates**: Stay informed with AI-curated articles on new findings in Alzheimer's treatment and prevention.
- **Community Support Forum**: Connect with patients, caregivers, and researchers to exchange insights and experiences.
- **Personalized Resource Recommendations**: AI-driven content suggestions based on user profile and needs.

### 4. Health Monitoring & User Profiles

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

## 🚀 Setup and Deployment

### Backend Setup
1. Create and activate a virtual environment: `python -m venv venv && source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env` (see `.env.example` for reference)
4. Run the development server: `python main.py`

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

- **High Innovation**: Combines AI-powered linguistic analysis with cognitive training and Alzheimer's prevention.
- **Significant Social Impact**: Assists aging populations and caregivers in tracking cognitive health.
- **Commercial Potential**: Potential to evolve into a subscription-based cognitive health monitoring service.
- **Cutting-edge AI**: Leverages the latest advancements in natural language processing and AI models.
- **Data-driven Insights**: Provides valuable metrics and visualization for cognitive health tracking. 