# Alzheimer's Detection Platform - Backend API

This is the backend API for the AI-powered Alzheimer's detection and prevention platform. It provides endpoints for language analysis, cognitive assessment, and resource management.

## Features

- **Language Analysis API**: Process text and speech samples to detect linguistic patterns that may indicate cognitive decline
- **Cognitive Assessment**: Analyze user inputs to provide risk assessments for MCI and Alzheimer's
- **User Management**: Store and track user data and progress over time
- **Resource Management**: Serve educational content and personalized recommendations

## Technology Stack

- **FastAPI**: Modern, high-performance web framework for building APIs
- **Python 3.9+**: For backend logic and data processing
- **NLP Tools**: spaCy for linguistic analysis
- **Speech-to-Text**: OpenAI's Whisper API for transcription
- **Machine Learning**: scikit-learn for risk assessment models
- **Database**: SQLite (development) or MongoDB (production)

## Getting Started

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Virtual environment tool (venv, conda, etc.)

### Installation

1. **Create and activate a virtual environment**:

```bash
# Using venv
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

2. **Install dependencies**:

```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:

```bash
# Copy the example .env file
cp .env.example .env
# Edit the .env file with your configuration
```

4. **Run the development server**:

```bash
uvicorn main:app --reload
```

The API will be available at http://127.0.0.1:8000/

### API Documentation

Once the server is running, you can access the automatically generated API documentation:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Development

### Project Structure

```
backend/
├── app/                    # Application package
│   ├── api/                # API endpoints
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── tests/                  # Test suite
├── .env.example            # Example environment variables
├── main.py                 # Application entry point
├── README.md               # This file
└── requirements.txt        # Dependencies
```

### Running Tests

```bash
pytest
```

### Adding New Features

1. Create appropriate models in the `app/models` directory
2. Implement business logic in the `app/services` directory
3. Define API endpoints in the `app/api` directory
4. Register new routers in `main.py`
5. Add tests in the `tests` directory

## Production Deployment

For production deployment, consider:

1. Using Gunicorn as a WSGI server
2. Setting up a reverse proxy like Nginx
3. Implementing proper authentication and security measures
4. Switching to a production-grade database like MongoDB or PostgreSQL

## License

This project is licensed under the terms of the license included with this repository. 