"""
Language Analysis API routes for analyzing speech and text samples
to detect early signs of cognitive decline.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, Body, Depends
from typing import Optional, Dict, Any, List
import json
import asyncio
import logging
import tempfile
import os

from app.ai.nlp import (
    text_analysis_pipeline,
    validate_and_preprocess_text,
    extract_segments
)
from app.ai.factory import model_factory

# Initialize logger
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/language-analysis",
    tags=["Language Analysis"],
    responses={404: {"description": "Not found"}},
)

@router.post("/analyze-text")
async def analyze_text(
    text: str = Form(...),
    include_features: bool = Form(False),
    include_raw_text: bool = Form(False),
    detect_patterns: bool = Form(False)
):
    """
    Analyze a text sample for signs of cognitive decline.
    
    This endpoint processes text input and returns linguistic metrics
    that may indicate early signs of MCI or Alzheimer's.
    
    Args:
        text: The text to analyze
        include_features: Whether to include detailed linguistic features
        include_raw_text: Whether to include the original text in the response
        detect_patterns: Whether to detect specific linguistic patterns
    
    Returns:
        Analysis results with risk score and recommendations
    """
    try:
        # Log which model is being used
        current_model = model_factory.get_current_model_type()
        logger.info(f"Language analysis using model: {current_model}")
        
        # Validate and preprocess the text
        validation = validate_and_preprocess_text(text)
        if not validation["success"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid text input: {', '.join(validation.get('errors', ['Unknown error']))}"
            )
        
        # Analyze the text
        if detect_patterns:
            results = await text_analysis_pipeline.detect_linguistic_patterns(validation["text"])
        else:
            results = await text_analysis_pipeline.analyze_text(
                validation["text"],
                include_features=include_features,
                include_raw_text=include_raw_text
            )
        
        # Add validation metadata
        results["language"] = validation["language"]
        results["language_name"] = validation["language_name"]
        
        # Add warnings if any
        if validation.get("warnings"):
            results["warnings"] = validation["warnings"]
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze-text-segments")
async def analyze_text_segments(
    text: str = Form(...),
    min_segment_length: int = Form(50),
    include_features: bool = Form(False)
):
    """
    Analyze segments of a text sample separately and return results for each segment.
    
    This is useful for analyzing longer texts by breaking them into paragraphs
    or sections and analyzing each independently.
    
    Args:
        text: The text to analyze
        min_segment_length: Minimum length for a valid segment
        include_features: Whether to include detailed linguistic features
    
    Returns:
        Analysis results for each segment and overall assessment
    """
    try:
        # Validate and preprocess the text
        validation = validate_and_preprocess_text(text)
        if not validation["success"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid text input: {', '.join(validation.get('errors', ['Unknown error']))}"
            )
        
        # Extract segments
        segments = extract_segments(validation["text"], min_segment_length=min_segment_length)
        
        if not segments:
            raise HTTPException(
                status_code=400,
                detail="Could not extract valid segments from text"
            )
        
        # Analyze each segment
        segment_results = []
        analysis_tasks = []
        
        for segment in segments:
            # Create analysis tasks
            task = text_analysis_pipeline.analyze_text(
                segment["text"],
                include_features=include_features,
                include_raw_text=False
            )
            analysis_tasks.append(task)
        
        # Run all analyses concurrently
        segment_analyses = await asyncio.gather(*analysis_tasks)
        
        # Combine segment data with analysis results
        for i, segment in enumerate(segments):
            segment_result = {
                "segment": segment,
                "analysis": segment_analyses[i]
            }
            segment_results.append(segment_result)
        
        # Calculate overall risk score (average of segment scores weighted by length)
        total_length = sum(segment["length"] for segment in segments)
        overall_score = 0.0
        
        if total_length > 0:
            for i, segment in enumerate(segments):
                if segment_analyses[i].get("success", False):
                    weight = segment["length"] / total_length
                    overall_score += segment_analyses[i].get("risk_score", 0.5) * weight
        
        # Return combined results
        return {
            "success": True,
            "segments": segment_results,
            "overall_risk_score": overall_score,
            "segment_count": len(segments),
            "language": validation["language"],
            "language_name": validation["language_name"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Segment analysis failed: {str(e)}")

@router.post("/analyze-speech")
async def analyze_speech(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    include_features: bool = Form(False)
):
    """
    Analyze a speech recording for signs of cognitive decline.
    
    This endpoint accepts audio files, transcribes them to text using
    OpenAI Whisper, and then performs linguistic analysis using GPT-4o.
    """
    try:
        # Process audio to get transcription
        # model_factory.process_audio expects a file path or a seekable BinaryIO.
        # audio_file.file is a SpooledTemporaryFile, which is a BinaryIO.
        transcription_result = model_factory.process_audio(
            audio_file=audio_file.file, 
            language=language
        )

        if not transcription_result.get("success"):
            error_detail = transcription_result.get("error", "Speech-to-text failed")
            logger.error(f"Speech transcription failed: {error_detail}")
            raise HTTPException(status_code=400, detail=error_detail)

        transcribed_text = transcription_result.get("text")
        if not transcribed_text or not transcribed_text.strip():
            logger.error("Transcription resulted in empty text.")
            raise HTTPException(status_code=400, detail="Transcription resulted in empty text.")

        # Analyze the transcribed text
        logger.info(f"Analyzing transcribed text (length {len(transcribed_text)} characters).")
        analysis_result = model_factory.analyze_text(
            text=transcribed_text,
            include_features=include_features
        )

        if not analysis_result.get("success"):
            error_detail = analysis_result.get("error", "Text analysis failed")
            logger.error(f"Text analysis of transcription failed: {error_detail}")
            # Still return transcription even if analysis fails
            return {
                "transcription_details": transcription_result,
                "analysis_details": analysis_result,
                "warning": "Text analysis failed, only transcription is available."
            }
            
        return {
            "transcription_details": transcription_result,
            "analysis_details": analysis_result
        }

    except HTTPException as http_exc:
        # Re-raise HTTPException to ensure FastAPI handles it correctly
        raise http_exc
    except Exception as e:
        logger.exception(f"Error in /analyze-speech endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Speech analysis failed: {str(e)}")

@router.get("/history/{user_id}")
async def get_analysis_history(user_id: str):
    """
    Retrieve the analysis history for a specific user.
    
    This endpoint returns a list of previous analyses and their results,
    which can be used to track changes over time.
    """
    # In a real implementation, this would query a database
    # For now, we return mock data
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