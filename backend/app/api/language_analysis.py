"""
Language Analysis API routes for analyzing speech and text samples
to detect early signs of cognitive decline.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from typing import Optional, Dict, List, Any
import json
import os

# Create router without prefix for Vercel compatibility
router = APIRouter(
    tags=["Language Analysis"],
    responses={404: {"description": "Not found"}},
)

# Simple mock function instead of using heavy NLP libraries
def analyze_text_simple(text: str) -> Dict[str, Any]:
    """
    Simple text analysis that doesn't require heavy libraries.
    This is a placeholder for the real NLP analysis.
    """
    # Calculate basic metrics without NLP libraries
    word_count = len(text.split())
    char_count = len(text)
    avg_word_length = char_count / max(word_count, 1)
    
    # Mock values for metrics that would normally require NLP
    metrics = {
        "lexical_diversity": 0.75,  # Would normally be calculated with NLP
        "syntactic_complexity": 0.68,  # Would normally be calculated with NLP
        "hesitations": 0.05,  # Would normally be calculated with NLP
        "repetitions": 0.02,  # Would normally be calculated with NLP
        "word_count": word_count,  # This we can actually calculate
        "character_count": char_count,  # This we can actually calculate
        "avg_word_length": avg_word_length  # This we can actually calculate
    }
    
    # Mock risk score
    risk_score = 0.25
    
    return {
        "analysis_id": "sample-123",
        "text_length": len(text),
        "metrics": metrics,
        "risk_score": risk_score,
        "recommendations": [
            "Continue regular cognitive exercises",
            "Monitor changes in linguistic patterns over time"
        ]
    }

@router.post("/api/language-analysis/analyze-text")
async def analyze_text(text: str = Form(...)):
    """
    Analyze a text sample for signs of cognitive decline.
    
    This endpoint processes text input and returns linguistic metrics
    that may indicate early signs of MCI or Alzheimer's.
    """
    try:
        # Use the simple analyzer instead of heavy NLP libraries
        result = analyze_text_simple(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/api/language-analysis/analyze-speech")
async def analyze_speech(audio_file: UploadFile = File(...)):
    """
    Analyze a speech recording for signs of cognitive decline.
    
    This endpoint accepts audio files, transcribes them to text using
    a speech-to-text service, and then performs linguistic analysis.
    """
    try:
        # In a production app, we'd use a Speech-to-Text service
        # But for now, just return mock data without heavy ML libraries
        return {
            "analysis_id": "speech-123",
            "audio_duration": "35 seconds",
            "transcription": "This would be the transcribed text from the audio file.",
            "metrics": {
                "lexical_diversity": 0.72,
                "syntactic_complexity": 0.65,
                "hesitations": 0.08,
                "repetitions": 0.03,
                "speech_rate": 0.9,
                "pause_patterns": 0.85
            },
            "risk_score": 0.3,
            "recommendations": [
                "Consider speech fluency exercises",
                "Schedule a follow-up assessment in 3 months"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech analysis failed: {str(e)}")

@router.get("/api/language-analysis/history/{user_id}")
async def get_analysis_history(user_id: str):
    """
    Retrieve the analysis history for a specific user.
    
    This endpoint returns a list of previous analyses and their results,
    which can be used to track changes over time.
    """
    # Simple mock data response without database access
    return {
        "user_id": user_id,
        "analysis_history": [
            {
                "analysis_id": "hist-001",
                "date": "2023-11-01",
                "type": "text",
                "risk_score": 0.22,
            },
            {
                "analysis_id": "hist-002",
                "date": "2023-12-01",
                "type": "speech",
                "risk_score": 0.25,
            }
        ]
    } 