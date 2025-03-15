# 🌍 AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention

Welcome to our innovative platform designed to facilitate early detection of Mild Cognitive Impairment (MCI) and support Alzheimer's prevention through AI-driven tools and resources. This project combines advanced language analysis, cognitive training, and comprehensive resources to promote cognitive health.

## 🧠 Core Features

### 1. AI-Powered MCI & Alzheimer's Early Screening

- **AI Language Analysis**: Users can submit speech or text samples, which our AI analyzes to assess potential cognitive decline by examining linguistic patterns.
- **Real-time Feedback**: Receive immediate risk scores based on factors like vocabulary richness, sentence complexity, and fluency.
- **Data Tracking**: Monitor language trends over time to identify early signs of cognitive decline.

### 2. Alzheimer's Prevention & Cognitive Training

- **Daily Cognitive Training Games**: Engage in AI-generated language-based challenges, such as word recall and reading comprehension, to strengthen cognitive abilities.
- **Personalized Recommendations**: Obtain AI-driven, customized prevention plans tailored to individual cognitive profiles.
- **Lifestyle & Health Guidelines**: Access evidence-based strategies for diet, exercise, sleep, and social interaction to slow cognitive decline.

### 3. Resource Hub

- **Alzheimer's Knowledge Base**: Explore comprehensive information on early symptoms, prevention strategies, and caregiving tips.
- **Latest Research Updates**: Stay informed with AI-curated articles on new findings in Alzheimer's treatment and prevention.
- **Community Support Forum**: Connect with patients, caregivers, and researchers to exchange insights and experiences.

### 4. Lightweight Health Monitoring

- **Speech Recordings & Progress Tracking**: Periodically record speech to monitor cognitive changes over time.
- **Doctor/Researcher Collaboration (Optional)**: Share data with medical professionals or researchers to support studies on cognitive health.

## 🛠 Technical Implementation

### 1. Frontend (User Interface & Interaction)

- **Tech Stack**: React.js, Tailwind CSS, Headless UI components
- **Implemented Features**:
  - Responsive layout with collapsible sidebar navigation
  - Dark/light mode theming with persistent user preferences
  - Dashboard with cognitive health metrics visualization
  - AI Screening interface with speech recording and text input options
  - Result visualization with cognitive scores, category breakdowns, and recommendations
  - Resource Hub structure for educational content
  - Health Monitoring interface for tracking cognitive changes
  - Notifications system for updates and reminders
  - User profile components and authentication screens

### 2. Backend (Data Processing & AI Computation)

- **Tech Stack**: FastAPI (Python)
- **Functions**:
  - Speech-to-Text Conversion using OpenAI's Whisper API
  - NLP-Based Language Analysis with spaCy or GPT-4
  - AI Risk Scoring Model utilizing Scikit-learn
  - User Data Storage & Progress Tracking with MongoDB or SQLite

### 3. AI-Powered Language Analysis

- **Speech-to-Text (STT)**: Integrate OpenAI's Whisper API for accurate transcription.
- **NLP Feature Extraction**:
  - Measure lexical diversity to assess vocabulary richness.
  - Perform dependency parsing with spaCy to evaluate sentence complexity.
  - Track hesitations and repetitions to analyze fluency and pause patterns.
- **ML-Based Cognitive Risk Scoring**: Train models using Alzheimer's language datasets to provide reliable risk assessments.

## 🎯 Project Highlights

- **High Innovation**: Combines AI-powered linguistic analysis with cognitive training and Alzheimer's prevention.
- **Significant Social Impact**: Assists aging populations and caregivers in tracking cognitive health.
- **Commercial Potential**: Potential to evolve into a subscription-based cognitive health monitoring service.
- **Feasibility**: Achievable for developers using existing NLP and web development tools.

# Alzheimer's Early Detection Web Platform

This web platform integrates AI-powered language analysis tools to help detect early signs of cognitive decline that may indicate Alzheimer's disease or other forms of dementia.

## Features

- 🎤 **Speech Analysis**: Record or upload audio for transcription and analysis
- 📝 **Text Analysis**: Submit text samples for linguistic analysis
- 🔄 **Dual-Mode Processing**: Option to use either local or API-based speech recognition
- 📊 **Comprehensive Reports**: Detailed assessment of linguistic features and cognitive markers
- 📱 **User-Friendly Interface**: Modern, responsive web interface

## How It Works

The platform analyzes various linguistic features that have been shown to change in the early stages of cognitive decline, including:

- Lexical diversity (vocabulary richness)
- Syntactic complexity (sentence structure)
- Semantic coherence (topic maintenance)
- Fluency and hesitation patterns
- Word finding difficulty indicators

Research has shown that these linguistic markers can often appear years before clinical diagnosis of Alzheimer's disease.

## Technology Stack

- **Frontend**: React with React Router
- **Backend**: FastAPI (Python)
- **AI Models**:
  - Speech-to-Text: OpenAI Whisper (local and API modes)
  - Language Analysis: spaCy, custom NLP algorithms
  - Risk Assessment: Machine learning model trained on linguistic features

## Prerequisites

- Python 3.8 or higher
- Node.js and npm (for frontend development)
- FFmpeg (for audio processing)

## Installation

### Automatic Setup

The easiest way to set up the project is to use the provided setup script:

```bash
python setup.py
```

This script will:
1. Install all Python dependencies
2. Install required spaCy language models
3. Set up the frontend (install npm packages and build the React app)
4. Copy the frontend build to the backend static directory

For more options:

```bash
python setup.py --help
```

### Manual Setup

#### Backend Setup

1. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install spaCy language model:
   ```bash
   python -m spacy download en_core_web_md
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Copy the build files to the backend static directory:
   ```bash
   mkdir -p ../backend/static
   cp -r build/* ../backend/static/
   ```

## Running the Application

### Option 1: Full Stack (Recommended for Production)

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. Access the application at: http://localhost:8000

This serves both the API and the frontend from the same server.

### Option 2: Development Mode

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the frontend at: http://localhost:3000

This setup provides hot reloading for frontend development.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
# OpenAI API key (required for API mode)
OPENAI_API_KEY=your_openai_api_key

# Whisper configuration
WHISPER_MODE=local  # 'local' or 'api'
WHISPER_MODEL=base  # 'tiny', 'base', 'small', 'medium', 'large'

# Path configuration
MODEL_DIR=./models
STORAGE_DIR=./assessment_results
```

## Optional: Using the CLI Tool

This platform also includes a command-line interface for cognitive assessment:

```bash
python run_analysis.py --record --seconds 15 --whisper-model tiny
```

For more CLI options, see the [USAGE_INSTRUCTIONS.md](USAGE_INSTRUCTIONS.md) file.

## Important Disclaimer

This tool is for educational and research purposes only. It is not intended to diagnose any medical condition or replace professional medical advice. Always consult qualified healthcare professionals for proper diagnosis and treatment of Alzheimer's disease and other cognitive disorders.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the Whisper API
- spaCy for NLP capabilities
- FastAPI for the backend framework