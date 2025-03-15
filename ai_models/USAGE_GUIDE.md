# Usage Guide for Alzheimer's AI Detection Models

This guide shows how to use the AI models for Alzheimer's and cognitive decline detection in various contexts.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Using the Backend API](#using-the-backend-api)
3. [Integrating Directly with Python Code](#integrating-directly-with-python-code)
4. [Advanced Usage](#advanced-usage)
5. [Interpreting Results](#interpreting-results)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before using the AI models, ensure you have:

1. Installed all dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Installed the required spaCy model:
   ```bash
   python -m spacy download en_core_web_md
   ```

3. Set up your OpenAI API key (required for speech analysis):
   ```bash
   # For Windows PowerShell
   $env:OPENAI_API_KEY="your-api-key-here"
   
   # For Linux/Mac
   export OPENAI_API_KEY="your-api-key-here"
   ```

## Using the Backend API

The easiest way to use the AI models is through the FastAPI backend, which provides RESTful endpoints for analysis.

### Text Analysis

To analyze text for signs of cognitive decline:

```bash
# Using curl
curl -X POST "http://localhost:8000/language-analysis/analyze-text" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "text=Sample text for analysis&user_id=user123"
```

```python
# Using Python requests
import requests

url = "http://localhost:8000/language-analysis/analyze-text"
data = {
    "text": "Sample text for analysis",
    "user_id": "user123"
}
response = requests.post(url, data=data)
print(response.json())
```

### Speech Analysis

To analyze speech recordings:

```bash
# Using curl
curl -X POST "http://localhost:8000/language-analysis/analyze-speech" \
  -F "audio_file=@/path/to/audio.mp3" \
  -F "user_id=user123" \
  -F "language=en"
```

```python
# Using Python requests
import requests

url = "http://localhost:8000/language-analysis/analyze-speech"
files = {"audio_file": open("/path/to/audio.mp3", "rb")}
data = {"user_id": "user123", "language": "en"}
response = requests.post(url, files=files, data=data)
print(response.json())
```

### Retrieving User History

To get a user's analysis history:

```bash
# Using curl
curl -X GET "http://localhost:8000/language-analysis/history/user123"
```

```python
# Using Python requests
import requests

url = "http://localhost:8000/language-analysis/history/user123"
response = requests.get(url)
print(response.json())
```

## Integrating Directly with Python Code

For more advanced usage or integration with other systems, you can use the AI models directly in Python code.

### Basic Usage

```python
import asyncio
from ai_models.cognitive_assessment import CognitiveAssessment, CognitiveAssessmentInput

async def analyze_text_sample():
    # Initialize the cognitive assessment pipeline
    assessment = CognitiveAssessment()
    
    # Create input for text analysis
    input_data = CognitiveAssessmentInput(
        text="This is a sample text for analysis",
        user_id="user123"
    )
    
    # Run the assessment
    result = await assessment.assess(input_data)
    
    # Print results
    print(f"Risk level: {result.risk_assessment.risk_level}")
    print(f"Risk score: {result.risk_assessment.overall_score}")
    
    return result

# Run the async function
result = asyncio.run(analyze_text_sample())
```

### Speech Analysis Usage

```python
import asyncio
from ai_models.cognitive_assessment import CognitiveAssessment, CognitiveAssessmentInput

async def analyze_speech_sample(audio_path):
    # Initialize the cognitive assessment pipeline
    assessment = CognitiveAssessment()
    
    # Create input for speech analysis
    input_data = CognitiveAssessmentInput(
        audio_file=audio_path,
        language="en",
        user_id="user123"
    )
    
    # Run the assessment
    result = await assessment.assess(input_data)
    
    # Print results
    print(f"Transcription: {result.transcription.text}")
    print(f"Risk level: {result.risk_assessment.risk_level}")
    
    return result

# Run the async function
result = asyncio.run(analyze_speech_sample("/path/to/audio.mp3"))
```

## Advanced Usage

### Customizing Risk Scoring

You can customize the risk scoring model by providing your own model weights:

```python
from ai_models.risk_scorer import RiskScorer
from ai_models.nlp_analyzer import NLPAnalyzer

# Initialize components with custom settings
nlp_analyzer = NLPAnalyzer(model_name="en_core_web_lg")  # Using a larger model
risk_scorer = RiskScorer(model_weights_path="/path/to/custom/weights.json")

# Analyze text
features = nlp_analyzer.analyze_text("Sample text")
risk_assessment = risk_scorer.calculate_risk(features)
```

### Saving and Loading Results

```python
import json
from ai_models.cognitive_assessment import CognitiveAssessmentResult

# Save a result to JSON
def save_result(result: CognitiveAssessmentResult, filepath: str):
    with open(filepath, 'w') as f:
        f.write(result.json(exclude_none=True, indent=2))

# Load a result from JSON
def load_result(filepath: str) -> CognitiveAssessmentResult:
    with open(filepath, 'r') as f:
        data = json.load(f)
    return CognitiveAssessmentResult(**data)
```

## Interpreting Results

The risk assessment includes:

- **Overall Risk Score**: A value between 0 and 1, where higher values indicate increased risk
- **Risk Level**: Categorized as "low", "moderate", or "high"
- **Risk Categories**: Specific areas of concern, each with its own score
- **Recommendations**: Suggested actions based on the analysis
- **Explanations**: Detailed interpretation of the results

### Risk Levels

- **Low Risk (0-0.3)**: No significant indicators of cognitive decline detected
- **Moderate Risk (0.3-0.7)**: Some indicators present that may warrant attention
- **High Risk (0.7-1.0)**: Significant indicators present that suggest professional evaluation

## Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**:
   - Error: "Authentication error with OpenAI API"
   - Solution: Check that your API key is correctly set in the environment variable

2. **Speech Analysis Fails**:
   - Error: "Speech transcription failed"
   - Solution: Ensure the audio file is in a supported format (MP3, WAV, M4A) and is not corrupted

3. **Import Errors**:
   - Error: "ModuleNotFoundError"
   - Solution: Make sure you've installed all requirements and are running the code from the correct directory

4. **NLP Model Errors**:
   - Error: "Model 'en_core_web_md' not found"
   - Solution: Run `python -m spacy download en_core_web_md`

For more help, check the project's issue tracker or documentation. 