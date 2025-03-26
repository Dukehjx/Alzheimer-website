"""
AI analysis API routes.

This module provides endpoints for AI-powered text analysis and cognitive risk assessment.
"""

from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from typing import Dict, Any, Optional, List
import logging
from datetime import datetime
import uuid
import os
import tempfile
from pydantic import BaseModel, Field

from app.models.analysis import AnalysisResult, AnalysisType, CognitiveDomain
from app.utils.security import get_current_user
from app.db import get_database
from app.models.user import UserInDB
from app.ai.factory import analyze_text, set_model, process_audio, set_whisper_model_size

# Initialize router
router = APIRouter(
    prefix="/api/ai",
    tags=["AI Analysis"],
    responses={404: {"description": "Not found"}},
)

# Initialize logger
logger = logging.getLogger(__name__)

# Analysis database model
class AnalysisInDB(BaseModel):
    """Analysis record for database storage."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    text: str
    cognitive_score: float
    domain_scores: Dict[CognitiveDomain, float]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    analysis_type: AnalysisType
    confidence_score: float
    recommendations: list[str]

@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_text_endpoint(
    text: str = Body(..., embed=True),
    analysis_type: AnalysisType = Body(AnalysisType.TEXT, embed=True),
    include_features: bool = Body(False, embed=True),
    request_id: Optional[str] = Body(None, embed=True),
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Analyze text for cognitive risk assessment.
    
    This endpoint uses AI models to analyze text input and
    return a cognitive risk assessment.
    
    Args:
        text: The text to analyze
        analysis_type: The type of analysis to perform
        include_features: Whether to include detailed linguistic features in response
        request_id: Unique identifier for the request to avoid caching
        current_user: The authenticated user
        db: Database connection
        
    Returns:
        Analysis results
    """
    try:
        # Log the request
        logger.info(f"Analysis request received: ID={request_id}, length={len(text)}, start={text[:20]}")
        
        # Validate input
        if not text or len(text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Text input too short. Please provide at least 10 characters."
            )
        
        # Call AI model to analyze text
        results = analyze_text(text, include_features)
        
        if not results.get("success", False):
            logger.error(f"Analysis failed: {results.get('error')}")
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {results.get('error', 'Unknown error')}"
            )
        
        # Create analysis record
        domain_scores = {
            CognitiveDomain(k): float(v) 
            for k, v in results.get("domain_scores", {}).items()
        }
        
        # Store results in database
        analysis_record = AnalysisInDB(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            text=text,
            cognitive_score=results.get("overall_score", 0.0),
            domain_scores=domain_scores,
            timestamp=datetime.now(),
            analysis_type=analysis_type,
            confidence_score=results.get("confidence_score", 0.0),
            recommendations=results.get("recommendations", [])
        )
        
        await db.analyses.insert_one(analysis_record.dict())
        
        # Return the analysis results
        response = {
            "success": True,
            "analysis_id": analysis_record.id,
            "overall_score": results.get("overall_score", 0.0),
            "confidence_score": results.get("confidence_score", 0.0),
            "domain_scores": results.get("domain_scores", {}),
            "recommendations": results.get("recommendations", []),
            "timestamp": analysis_record.timestamp.isoformat()
        }
        
        # Include detailed features if requested
        if include_features:
            response["features"] = results.get("features", {})
        
        return response
    
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        logger.error(f"Error in analysis endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during analysis: {str(e)}"
        )

@router.post("/set-model")
async def set_model_endpoint(
    model_type: str = Body(..., embed=True),
    api_key: Optional[str] = Body(None, embed=True),
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Set the AI model to use for analysis.
    
    Args:
        model_type: The type of model to use ('spacy' or 'gpt4')
        api_key: API key for GPT-4 (required if model_type is 'gpt4')
        current_user: The authenticated user
        
    Returns:
        Success message
    """
    # Check if user has admin role
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can change the AI model"
        )
    
    try:
        success = set_model(model_type, api_key)
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to set model to {model_type}. Check if API key is valid."
            )
        
        return {"success": True, "message": f"Model set to {model_type}"}
    
    except Exception as e:
        logger.error(f"Error setting model: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while setting the model: {str(e)}"
        )

@router.get("/history")
async def get_analysis_history(
    limit: int = 10,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Get analysis history for the current user.
    
    Args:
        limit: Maximum number of results to return
        current_user: The authenticated user
        db: Database connection
        
    Returns:
        List of analysis results
    """
    try:
        # Get analysis history from database
        cursor = db.analyses.find(
            {"user_id": current_user.id}
        ).sort("timestamp", -1).limit(limit)
        
        history = []
        async for doc in cursor:
            # Convert ObjectId to string for JSON serialization
            doc["_id"] = str(doc["_id"])
            # Convert datetime to ISO format
            if "timestamp" in doc:
                doc["timestamp"] = doc["timestamp"].isoformat()
            history.append(doc)
        
        return history
    
    except Exception as e:
        logger.error(f"Error fetching analysis history: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching analysis history: {str(e)}"
        )

@router.post("/process-audio", response_model=Dict[str, Any])
async def process_audio_endpoint(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    include_analysis: bool = Form(False),
    request_id: Optional[str] = Form(None),
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Process audio file for speech-to-text and optional cognitive analysis.
    
    Args:
        audio_file: The audio file to process
        language: Language code (optional, auto-detect if None)
        include_analysis: Whether to analyze the transcribed text
        request_id: Unique identifier for the request
        current_user: The authenticated user
        db: Database connection
        
    Returns:
        Transcription and optional analysis results
    """
    # Create temporary file
    temp_file = None
    
    try:
        # Log the request
        logger.info(f"Audio processing request received: ID={request_id}, file={audio_file.filename}")
        
        # Validate file
        if not audio_file.filename:
            raise HTTPException(
                status_code=400,
                detail="No audio file provided."
            )
        
        # Check file size (limit to 20MB)
        file_size = 0
        chunk_size = 1024 * 1024  # 1MB
        
        # Create temporary file to save the uploaded audio
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        
        # Read and write the file in chunks
        while chunk := await audio_file.read(chunk_size):
            file_size += len(chunk)
            if file_size > 20 * 1024 * 1024:  # 20MB
                # Clean up and raise error
                temp_file.close()
                os.unlink(temp_file.name)
                raise HTTPException(
                    status_code=413,
                    detail="Audio file too large. Maximum size is 20MB."
                )
            temp_file.write(chunk)
        
        temp_file.close()
        
        # Process audio file - calling with correct parameters
        audio_results = process_audio(temp_file.name, language)
        
        if not audio_results.get("success", False):
            logger.error(f"Audio processing failed: {audio_results.get('error')}")
            raise HTTPException(
                status_code=500,
                detail=f"Audio processing failed: {audio_results.get('error', 'Unknown error')}"
            )
        
        # Get the transcribed text
        transcribed_text = audio_results.get("text", "")
        
        # Initialize response
        response = {
            "success": True,
            "transcription": {
                "text": transcribed_text,
                "language": audio_results.get("language"),
                "segments": audio_results.get("segments", [])
            }
        }
        
        # Analyze the transcribed text if requested
        if include_analysis and transcribed_text:
            # Check if text is long enough for analysis
            if len(transcribed_text.strip()) < 10:
                response["analysis_skipped"] = "Text too short for analysis"
            else:
                # Analyze the transcribed text
                analysis_results = analyze_text(transcribed_text, include_features=False)
                
                if analysis_results.get("success", False):
                    # Create analysis record
                    domain_scores = {
                        CognitiveDomain(k): float(v) 
                        for k, v in analysis_results.get("domain_scores", {}).items()
                    }
                    
                    # Store results in database
                    analysis_record = AnalysisInDB(
                        id=str(uuid.uuid4()),
                        user_id=current_user.id,
                        text=transcribed_text,
                        cognitive_score=analysis_results.get("overall_score", 0.0),
                        domain_scores=domain_scores,
                        timestamp=datetime.now(),
                        analysis_type=AnalysisType.SPEECH,
                        confidence_score=analysis_results.get("confidence_score", 0.0),
                        recommendations=analysis_results.get("recommendations", [])
                    )
                    
                    await db.analyses.insert_one(analysis_record.dict())
                    
                    # Add analysis results to response
                    response["analysis"] = {
                        "analysis_id": analysis_record.id,
                        "overall_score": analysis_results.get("overall_score", 0.0),
                        "confidence_score": analysis_results.get("confidence_score", 0.0),
                        "domain_scores": analysis_results.get("domain_scores", {}),
                        "recommendations": analysis_results.get("recommendations", []),
                        "model_type": analysis_results.get("model_type", "spacy"),
                        "timestamp": analysis_record.timestamp.isoformat()
                    }
                else:
                    response["analysis_error"] = analysis_results.get("error", "Unknown error")
        
        return response
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        logger.error(f"Error in audio processing endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during audio processing: {str(e)}"
        )
    
    finally:
        # Clean up temporary file
        if temp_file and os.path.exists(temp_file.name):
            try:
                os.unlink(temp_file.name)
            except Exception as e:
                logger.warning(f"Failed to remove temporary file: {str(e)}")

@router.post("/set-whisper-model")
async def set_whisper_model_endpoint(
    model_size: str = Body(..., embed=True),
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Set the Whisper model size to use.
    
    Args:
        model_size: The model size to use ('tiny', 'base', 'small', 'medium', 'large')
        current_user: The authenticated user
        
    Returns:
        Success message
    """
    # Check if user has admin role
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can change the Whisper model"
        )
    
    try:
        success = set_whisper_model_size(model_size)
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to set Whisper model size to {model_size}."
            )
        
        return {"success": True, "message": f"Whisper model size set to {model_size}"}
    
    except Exception as e:
        logger.error(f"Error setting Whisper model size: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while setting the Whisper model size: {str(e)}"
        ) 