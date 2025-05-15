"""
Language Analysis API routes for analyzing speech and text samples
to detect early signs of cognitive decline. All endpoints in this router
now use the central model_factory for consistent AI processing.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, Body, Depends
from typing import Optional, Dict, Any, List
# import json # No longer directly used
import asyncio
import logging
# import tempfile # No longer directly used here, handled by UploadFile or in model_factory
# import os # No longer directly used here

# Removed NLP specific imports, using model_factory instead
# from app.ai.nlp import (
#     text_analysis_pipeline,
#     validate_and_preprocess_text,
#     extract_segments
# )
from app.ai.factory import model_factory # Central factory for AI operations

# Initialize logger
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/language-analysis",
    tags=["Language Analysis"],
    responses={404: {"description": "Not found"}},
)

@router.post("/analyze-text")
async def analyze_text_endpoint( # Renamed to avoid conflict if we re-import analyze_text from factory
    text: str = Form(...),
    include_features: bool = Form(False)
    # include_raw_text: bool = Form(False), # Removed, not directly supported by model_factory.analyze_text
    # detect_patterns: bool = Form(False) # Removed, not directly supported by model_factory.analyze_text
):
    """
    Analyze a text sample for signs of cognitive decline using the model_factory.
    
    Args:
        text: The text to analyze.
        include_features: Whether to include detailed linguistic features from GPT analysis.
    
    Returns:
        Analysis results with risk score and recommendations.
    """
    try:
        current_model_type = model_factory.get_current_model_type()
        logger.info(f"Analyzing text using model_factory (model type: {current_model_type}) with input text: '{text[:100]}...'")

        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty.")
        
        # Use model_factory for analysis
        analysis_result = model_factory.analyze_text(
            text=text,
            include_features=include_features
        )

        if not analysis_result.get("success"):
            error_detail = analysis_result.get("error", "Text analysis failed via model_factory")
            logger.error(f"Text analysis failed: {error_detail}")
            raise HTTPException(status_code=500, detail=error_detail)
        
        return analysis_result
    
    except HTTPException as http_exc:
        raise http_exc # Re-raise FastAPI's HTTP exceptions
    except Exception as e:
        logger.exception(f"Error in /analyze-text endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text analysis failed: {str(e)}")

# Helper function for text segmentation (simplified)
def _segment_text(text: str, min_segment_length: int = 50) -> List[Dict[str, Any]]:
    """Rudimentary text segmentation by paragraphs or sentences if long enough."""
    if not text or not text.strip():
        return []

    segments_data = []
    # Simple paragraph-based segmentation
    paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
    
    current_segment_text = ""
    segment_id_counter = 1

    for para in paragraphs:
        if len(current_segment_text) + len(para) + (1 if current_segment_text else 0) > min_segment_length * 5 and current_segment_text: # Heuristic to avoid overly long segments
            if len(current_segment_text) >= min_segment_length:
                segments_data.append({
                    "id": f"segment_{segment_id_counter}",
                    "text": current_segment_text,
                    "length": len(current_segment_text),
                    "char_start_index": text.find(current_segment_text), # Approximate
                    "char_end_index": text.find(current_segment_text) + len(current_segment_text) # Approximate
                })
                segment_id_counter += 1
                current_segment_text = para
            else: # If current segment is too short, append new para
                 current_segment_text += ("\n" + para) if current_segment_text else para
        else:
            current_segment_text += ("\n" + para) if current_segment_text else para

    # Add the last segment if it's valid
    if current_segment_text and len(current_segment_text) >= min_segment_length:
        segments_data.append({
            "id": f"segment_{segment_id_counter}",
            "text": current_segment_text,
            "length": len(current_segment_text),
            "char_start_index": text.rfind(current_segment_text), # Approximate
            "char_end_index": text.rfind(current_segment_text) + len(current_segment_text) # Approximate
        })
    
    # If no segments were created by paragraph splitting and text is long enough, treat as one segment
    if not segments_data and len(text) >= min_segment_length:
         segments_data.append({
            "id": "segment_1",
            "text": text,
            "length": len(text),
            "char_start_index": 0,
            "char_end_index": len(text)
        })

    logger.info(f"Segmented text into {len(segments_data)} parts.")
    return segments_data


@router.post("/analyze-text-segments")
async def analyze_text_segments_endpoint( # Renamed to avoid conflict
    text: str = Form(...),
    min_segment_length: int = Form(50, ge=10), # Ensure min_segment_length is reasonable
    include_features: bool = Form(False)
):
    """
    Analyze segments of a text sample using model_factory.
    
    Args:
        text: The text to analyze.
        min_segment_length: Minimum character length for a segment to be analyzed.
        include_features: Whether to include detailed linguistic features for each segment.
    
    Returns:
        Analysis results for each segment and an overall assessment.
    """
    try:
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty.")
        if min_segment_length < 10: # Basic validation
             raise HTTPException(status_code=400, detail="Minimum segment length must be at least 10.")

        logger.info(f"Analyzing text segments. Total length: {len(text)}, min_segment_length: {min_segment_length}")

        segments = _segment_text(text, min_segment_length)
        
        if not segments:
            logger.warning("No valid segments found for analysis after segmentation.")
            # Optionally, analyze the whole text if no segments? Or return error?
            # For now, if no segments, analyze the whole text as one if it meets min_segment_length
            if len(text) >= min_segment_length:
                logger.info("No segments extracted, analyzing the whole text as a single segment.")
                analysis_result = model_factory.analyze_text(text=text, include_features=include_features)
                return {
                     "success": True, # Assuming success if analyze_text doesn't fail
                     "segments_analysis": [analysis_result] if analysis_result.get("success") else [],
                     "overall_assessment": analysis_result if analysis_result.get("success") else {"success": False, "error": "Single segment analysis failed"},
                     "segment_count": 1 if analysis_result.get("success") else 0,
                     "message": "Analyzed as a single segment as no smaller segments could be extracted."
                }
            else:
                 raise HTTPException(status_code=400, detail="Text is too short to be segmented or analyzed.")

        segment_analysis_results = []
        successful_analyses = []

        for segment_data in segments:
            logger.info(f"Analyzing segment ID {segment_data['id']}: '{segment_data['text'][:50]}...'")
            analysis_result = model_factory.analyze_text(
                text=segment_data["text"],
                include_features=include_features
            )
            segment_analysis_results.append({
                "segment_info": segment_data,
                "analysis": analysis_result
            })
            if analysis_result.get("success"):
                successful_analyses.append(analysis_result)
        
        # Calculate overall assessment (e.g., average score if applicable)
        # This is a simplified overall assessment.
        overall_assessment = {}
        if successful_analyses:
            avg_overall_score = sum(res.get("overall_score", 0.0) for res in successful_analyses) / len(successful_analyses)
            # Potentially aggregate recommendations or evidence if needed
            overall_assessment = {
                "success": True,
                "average_overall_score": avg_overall_score,
                "message": "Aggregated from successful segment analyses.",
                "analyzed_segment_count": len(successful_analyses),
                "total_segments_processed": len(segments)
            }
        else:
            overall_assessment = {
                "success": False,
                "error": "No segments could be successfully analyzed.",
                "analyzed_segment_count": 0,
                "total_segments_processed": len(segments)
            }
            
        return {
            "success": True, # Overall success of the endpoint call
            "segments_analysis": segment_analysis_results,
            "overall_assessment": overall_assessment,
            "segment_count": len(segments)
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.exception(f"Error in /analyze-text-segments endpoint: {str(e)}")
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