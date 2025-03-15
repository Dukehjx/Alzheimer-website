"""
Simple FastAPI server to test the integration.
"""

import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI(
    title="Alzheimer's Early Detection API",
    description="API for detecting early signs of cognitive decline through language analysis",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up static files directories
static_dir = Path(__file__).parent / "backend" / "static"
if not os.path.exists(static_dir):
    os.makedirs(static_dir, exist_ok=True)

# Define root endpoint to serve index.html
@app.get("/", include_in_schema=False)
async def serve_spa():
    """Serve the single page application."""
    return FileResponse(f"{static_dir}/index.html")

# Mount static files
app.mount("/static", StaticFiles(directory=f"{static_dir}/static"), name="static")

# Configuration endpoint for language analysis
@app.get("/language-analysis/config", tags=["Language Analysis"])
async def get_config():
    """Get the current configuration of the language analysis service."""
    return {
        "whisper_mode": "local",
        "whisper_model": "base",
        "has_openai_key": False
    }

# Speech analysis endpoint
@app.post("/language-analysis/analyze-speech", tags=["Language Analysis"])
async def analyze_speech(request: Request):
    """Analyze a speech recording for signs of cognitive decline."""
    try:
        form_data = await request.form()
        
        # Mock analysis response
        return {
            "transcription": "This is a mock transcription of speech.",
            "risk_assessment": {
                "overall_risk_score": 0.45,
                "risk_level": "moderate",
                "categories": [
                    {
                        "name": "Lexical Diversity",
                        "score": 0.65,
                        "description": "Moderate vocabulary range"
                    },
                    {
                        "name": "Syntactic Complexity",
                        "score": 0.55,
                        "description": "Average sentence complexity"
                    },
                    {
                        "name": "Speech Fluency",
                        "score": 0.40,
                        "description": "Some hesitations and pauses noted"
                    }
                ],
                "recommendations": [
                    "Consider regular cognitive exercises to maintain verbal fluency.",
                    "Track changes in speech patterns over time with regular assessments."
                ],
                "explanations": {
                    "explanation": "The speech analysis shows moderate linguistic characteristics that may warrant monitoring."
                }
            },
            "linguistic_features": {
                "vocabulary_size": 42,
                "type_token_ratio": 0.82,
                "avg_sentence_length": 12.3,
                "avg_word_length": 4.1,
                "readability_score": 6.8,
                "pause_ratio": 0.15,
                "speech_rate": 145 
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Audio upload analysis endpoint
@app.post("/language-analysis/analyze-audio", tags=["Language Analysis"])
async def analyze_audio_file(audio_file: UploadFile = File(...)):
    """Analyze an uploaded audio file for signs of cognitive decline."""
    try:
        # Here you would process the audio file
        # For now, we return a mock response
        return {
            "transcription": "This is a mock transcription from an audio file.",
            "risk_assessment": {
                "overall_risk_score": 0.35,
                "risk_level": "low",
                "categories": [
                    {
                        "name": "Lexical Diversity",
                        "score": 0.30,
                        "description": "Good vocabulary usage"
                    },
                    {
                        "name": "Syntactic Complexity",
                        "score": 0.25,
                        "description": "Complex sentence structures"
                    }
                ],
                "recommendations": [
                    "Continue with regular cognitive activities to maintain language skills.",
                    "Consider follow-up assessment in 6-12 months to track any changes."
                ],
                "explanations": {
                    "explanation": "The analysis indicates normal linguistic patterns with no significant concerns."
                }
            },
            "linguistic_features": {
                "vocabulary_size": 58,
                "type_token_ratio": 0.88,
                "avg_sentence_length": 14.2,
                "avg_word_length": 4.5,
                "readability_score": 8.7
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Text analysis endpoint
@app.post("/language-analysis/analyze-text", tags=["Language Analysis"])
async def analyze_text(request: Request):
    """Analyze a text sample for signs of cognitive decline."""
    try:
        form_data = await request.form()
        text = form_data.get("text", "")
        
        if not text:
            raise HTTPException(status_code=400, detail="Text input cannot be empty")
        
        # Return a mock response
        return {
            "transcription": text,
            "risk_assessment": {
                "overall_risk_score": 0.63,
                "risk_level": "high",
                "categories": [
                    {
                        "name": "Lexical Diversity",
                        "score": 0.85,
                        "description": "Limited vocabulary usage"
                    },
                    {
                        "name": "Syntactic Complexity",
                        "score": 0.75,
                        "description": "Simple sentence structures"
                    }
                ],
                "recommendations": [
                    "Consider consulting a healthcare professional for a comprehensive cognitive assessment.",
                    "Engage in activities that encourage complex language use, such as reading, writing, or storytelling."
                ],
                "explanations": {
                    "explanation": "The analysis indicates potential cognitive concerns based on linguistic patterns."
                }
            },
            "linguistic_features": {
                "vocabulary_size": 28,
                "type_token_ratio": 0.74,
                "avg_sentence_length": 9.5,
                "avg_word_length": 3.74,
                "readability_score": 3.4
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}

# Version endpoint
@app.get("/version", tags=["Info"])
async def version():
    """Get API version information."""
    return {
        "version": app.version,
        "title": app.title,
        "description": app.description
    }

# Catch-all route to serve SPA for any non-API routes
# This must be placed AFTER all API routes to avoid conflicts
@app.get("/{catch_all:path}", include_in_schema=False)
async def catch_all(catch_all: str):
    """Catch-all route to serve the SPA for any non-API routes."""
    # Don't raise 404 for language-analysis paths - they should be handled by their specific routes
    if catch_all == "docs" or catch_all == "openapi.json":
        raise HTTPException(status_code=404, detail="API endpoint not found")
    return FileResponse(f"{static_dir}/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("simple_server:app", host="127.0.0.1", port=8000, reload=True) 