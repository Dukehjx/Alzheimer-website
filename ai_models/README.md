# AI Models for Alzheimer's Detection

This module contains AI models and utilities for detecting early signs of cognitive decline through speech and text analysis. It integrates with the FastAPI backend to provide cognitive assessment capabilities to the Alzheimer's detection platform.

## Overview

The AI models in this module provide:

1. **Speech-to-Text Processing**: Converts speech recordings to text using OpenAI's Whisper API
2. **NLP Analysis**: Extracts linguistic features that may indicate cognitive decline
3. **Risk Scoring**: Evaluates the likelihood of cognitive impairment based on linguistic markers
4. **Integrated Assessment**: Combines all components for a complete cognitive assessment

## Components

### WhisperSTT (Speech-to-Text)

Handles conversion of speech recordings to text, with support for:
- Multiple audio formats (MP3, WAV, M4A, etc.)
- Multiple languages
- Robust error handling
- Audio preprocessing for optimal results

### NLPAnalyzer

Analyzes text for linguistic patterns that may indicate cognitive decline:
- Lexical diversity (vocabulary richness)
- Syntactic complexity
- Hesitation patterns
- Repetition detection
- Part-of-speech distribution

### RiskScorer

Calculates cognitive risk scores based on linguistic features:
- Overall risk score
- Category-specific scores
- Personalized explanations
- Recommendations based on results

### CognitiveAssessment

Integrates all components into a single pipeline:
- Support for both text and speech input
- Detailed assessment results
- Standardized output format

## Integration with Backend

The API integration module connects these AI models with the FastAPI backend:
- RESTful API endpoints
- Background processing
- Persistent storage of assessment results
- User history tracking

## Setup and Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Install spaCy language model:
   ```bash
   python -m spacy download en_core_web_md
   ```

3. Set environment variables:
   ```bash
   # Required for speech analysis
   export OPENAI_API_KEY="your-openai-api-key"
   ```

## Usage Example

```python
from ai_models.cognitive_assessment import CognitiveAssessment, CognitiveAssessmentInput

# Initialize the cognitive assessment pipeline
assessment = CognitiveAssessment(openai_api_key="your-openai-api-key")

# Analyze text
text_input = CognitiveAssessmentInput(
    text="Sample text for analysis...",
    user_id="user123"
)
text_result = await assessment.assess(text_input)

# Analyze speech from audio file
speech_input = CognitiveAssessmentInput(
    audio_file="path/to/audio.mp3",
    language="en",
    user_id="user123"
)
speech_result = await assessment.assess(speech_input)
```

## API Response Format

The assessment results include:

```json
{
  "assessment_id": "unique-id",
  "input_type": "text|speech",
  "transcription": "Transcribed text if speech input",
  "linguistic_features": {
    "lexical_diversity": 0.75,
    "syntactic_complexity": 0.68,
    "word_count": 120,
    // Additional metrics...
  },
  "risk_assessment": {
    "overall_score": 0.35,
    "risk_level": "low|moderate|high",
    "categories": [
      {
        "name": "Lexical Access",
        "score": 0.42,
        "description": "Category description"
      },
      // Additional categories...
    ],
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ],
    "explanations": [
      "Explanation of results 1",
      "Explanation of results 2"
    ]
  }
}
``` 