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
    prefix="/api/v1/ai",
    tags=["AI Analysis"],
    responses={404: {"description": "Not found"}},
)

# Initialize logger
logger = logging.getLogger(__name__)

# Log router initialization for debugging
logger.info(f"AI Router initialized with prefix: /api/v1/ai")

# Health check endpoint specific to audio processing
@router.get("/process-audio-health", name="process_audio_health")
async def process_audio_health():
    """Health check endpoint for the process-audio feature."""
    logger.info("Audio processing health check called")
    
    # Check if OpenAI API key is configured
    api_key = os.getenv("OPENAI_API_KEY")
    api_key_status = "available" if api_key else "missing"
    
    # Test OpenAI connectivity
    openai_status = "unknown"
    openai_error = None
    if api_key:
        try:
            # Import inside function to avoid circular import
            import openai
            client = openai.OpenAI(api_key=api_key)
            # Simple API call to verify connectivity
            models = client.models.list()
            openai_status = "connected"
        except Exception as e:
            openai_status = "error"
            openai_error = str(e)
            logger.error(f"OpenAI API connection test failed: {str(e)}")
    
    # Check for whisper_processor module
    whisper_available = False
    try:
        from app.ai.speech.whisper_processor import process_audio as whisper_process
        whisper_available = True
    except ImportError:
        logger.error("Whisper processor module not available")
    
    return {
        "status": "online" if openai_status == "connected" else "degraded",
        "endpoint": "/api/v1/ai/process-audio",
        "whisper_api": whisper_available,
        "openai_connectivity": {
            "status": openai_status,
            "api_key_configured": api_key_status,
            "error": openai_error
        },
        "timestamp": datetime.now().isoformat(),
        "message": "Audio processing endpoint is available" if openai_status == "connected" else 
                  "Audio processing endpoint is available but OpenAI service may not be connected"
    }

# Print available endpoints on startup
@router.on_startup
async def on_startup():
    """Log all endpoints when the application starts."""
    logger.info("Available AI endpoints:")
    for route in router.routes:
        logger.info(f"  - {route.path} ({route.name})")

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
            CognitiveDomain(k.lower()): float(v) 
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
            "model_type": results.get("model_type", "gpt4o"),
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
    Set the API key for the GPT-4o model.
    
    Args:
        model_type: Will always be 'gpt4o' regardless of input
        api_key: API key for GPT-4o (required)
        current_user: The authenticated user
        
    Returns:
        Success message
    """
    # Check if user has admin role
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can update the API key"
        )
    
    # Force model_type to 'gpt4o'
    model_type = 'gpt4o'
    
    # API key is required
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="API key is required for GPT-4o"
        )
    
    try:
        success = set_model(model_type, api_key)
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail="Failed to set API key. Please check if the API key is valid."
            )
        
        return {"success": True, "message": "GPT-4o API key updated successfully"}
    
    except Exception as e:
        logger.error(f"Error setting API key: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while updating the API key: {str(e)}"
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

@router.post("/process-audio", response_model=Dict[str, Any], name="process_audio")
async def process_audio_endpoint(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    include_analysis: str = Form("false"),
    request_id: Optional[str] = Form(None),
    current_user: Optional[UserInDB] = Depends(get_current_user, use_cache=False),
    db = Depends(get_database)
):
    """
    Process audio file for speech-to-text and optional cognitive analysis.
    
    Args:
        audio_file: The audio file to process
        language: Language code (optional, auto-detect if None)
        include_analysis: Whether to analyze the transcribed text (string "true" or "false")
        request_id: Unique identifier for the request
        current_user: The authenticated user (optional)
        db: Database connection
        
    Returns:
        Transcription and optional analysis results
    """
    logger.info(f"Process audio endpoint called at path: /api/v1/ai/process-audio")
    
    # Convert include_analysis from string to boolean
    # Frontend sends 'true' or 'false' as strings in form data
    should_include_analysis = include_analysis.lower() == 'true'
    
    # Create temporary file
    temp_file = None
    
    try:
        # Log the request with more details
        logger.info(f"Audio processing request received: ID={request_id}, file={audio_file.filename}, include_analysis={should_include_analysis}")
        
        # Log file details for debugging
        logger.info(f"Audio file details - name: {audio_file.filename}, content_type: {audio_file.content_type}, size: {audio_file.size if hasattr(audio_file, 'size') else 'unknown'}")
        
        # Log current user status
        logger.info(f"Authentication status: {'Authenticated' if current_user else 'Anonymous'}")
        
        # Validate file
        if not audio_file.filename:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "No audio file provided.",
                    "error_type": "validation_error",
                    "field": "audio_file"
                }
            )
        
        # Check if audio content_type is valid
        valid_audio_types = [
            'audio/wav', 'audio/x-wav', 'audio/mp3', 'audio/mpeg', 
            'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/aac',
            'audio/ogg', 'audio/webm', 'audio/flac', 'audio/x-flac'
        ]
        
        content_type = audio_file.content_type or ''
        if content_type and content_type not in valid_audio_types and not content_type.startswith('audio/'):
            raise HTTPException(
                status_code=415,
                detail={
                    "message": f"Unsupported audio format: {content_type}. Please upload a WAV, MP3, M4A, AAC, OGG, or FLAC file.",
                    "error_type": "unsupported_media_type",
                    "file_type": content_type,
                    "supported_types": valid_audio_types
                }
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
                    detail={
                        "message": "Audio file too large. Maximum size is 20MB.",
                        "error_type": "file_too_large",
                        "file_size": file_size,
                        "max_size": 20 * 1024 * 1024
                    }
                )
            temp_file.write(chunk)
        
        temp_file.close()
        
        if file_size == 0:
            os.unlink(temp_file.name)
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Empty audio file. Please upload a valid audio recording.",
                    "error_type": "empty_file",
                    "file_size": 0
                }
            )
        
        # Check if file is too small (less than 0.5 seconds at 44.1kHz)
        min_audio_size = 1000  # Minimum size in bytes
        if file_size < min_audio_size:
            os.unlink(temp_file.name)
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Audio file is too short. Please provide a longer recording.",
                    "error_type": "file_too_short",
                    "file_size": file_size,
                    "min_size": min_audio_size
                }
            )
        
        # Process audio file - calling with correct parameters
        audio_results = process_audio(temp_file.name, language)
        
        if not audio_results.get("success", False):
            logger.error(f"Audio processing failed: {audio_results.get('error')}")
            error_message = audio_results.get('error', 'Unknown error')
            
            # Determine specific error category and response code
            status_code = 500
            error_response = {
                "message": f"Audio processing failed: {error_message}",
                "error_type": "processing_error",
                "request_id": request_id or str(uuid.uuid4()),
                "timestamp": datetime.now().isoformat(),
                "audio_details": {
                    "file_name": audio_file.filename,
                    "content_type": audio_file.content_type,
                    "file_size": file_size
                }
            }
            
            # Categorize common Whisper API errors
            if "API key" in error_message or "authentication" in error_message.lower():
                status_code = 401
                error_response["error_type"] = "openai_authentication_error"
                error_response["resolution"] = "Please check that a valid OpenAI API key is configured."
                
            elif "timeout" in error_message.lower():
                status_code = 504
                error_response["error_type"] = "openai_timeout_error"
                error_response["resolution"] = "The request timed out. Try again with a shorter audio file or when the service is less busy."
                
            elif "rate limit" in error_message.lower():
                status_code = 429
                error_response["error_type"] = "openai_rate_limit_error"
                error_response["resolution"] = "OpenAI API rate limit exceeded. Please try again later."
                
            elif "connection" in error_message.lower():
                status_code = 503
                error_response["error_type"] = "openai_connection_error"
                error_response["resolution"] = "Could not connect to OpenAI. Please check your internet connection or try again later."
            
            elif "too short" in error_message.lower():
                status_code = 400
                error_response["error_type"] = "audio_too_short"
                error_response["resolution"] = "The audio file is too short. Please provide a longer recording."
            
            elif "format" in error_message.lower() or "invalid file" in error_message.lower():
                status_code = 415
                error_response["error_type"] = "invalid_audio_format"
                error_response["resolution"] = "The audio file format is not supported. Please convert to WAV, MP3, or M4A format."
            
            # Add technical details for debugging in production
            error_response["technical_details"] = {
                "original_error": error_message,
                "audio_file_path": temp_file.name if os.path.exists(temp_file.name) else "file removed",
                "language_parameter": language,
                "api_key_configured": bool(os.getenv("OPENAI_API_KEY"))
            }
            
            raise HTTPException(
                status_code=status_code,
                detail=error_response
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
        
        # Add technical metadata for debugging
        response["meta"] = {
            "request_id": request_id or str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "file_details": {
                "original_filename": audio_file.filename,
                "content_type": audio_file.content_type,
                "file_size_bytes": file_size
            },
            "processing_info": {
                "language_requested": language or "auto-detect",
                "include_analysis": should_include_analysis
            }
        }
        
        # Analyze the transcribed text if requested and user is authenticated
        # Skip analysis in public mode when user is not authenticated
        if should_include_analysis and transcribed_text and current_user:
            # Check if text is long enough for analysis
            if len(transcribed_text.strip()) < 10:
                response["analysis_skipped"] = "Text too short for analysis"
            else:
                # Analyze the transcribed text
                analysis_results = analyze_text(transcribed_text, include_features=False)
                
                if analysis_results.get("success", False):
                    # Create analysis record
                    domain_scores = {
                        CognitiveDomain(k.lower()): float(v) 
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
                        "model_type": analysis_results.get("model_type", "gpt4o"),
                        "timestamp": analysis_record.timestamp.isoformat()
                    }
                else:
                    response["analysis_error"] = analysis_results.get("error", "Unknown error")
        # For anonymous users, we still want to provide basic analysis results
        elif should_include_analysis and transcribed_text and not current_user:
            # Check if text is long enough for analysis
            if len(transcribed_text.strip()) < 10:
                response["analysis_skipped"] = "Text too short for analysis"
            else:
                # Analyze the transcribed text without saving to database
                analysis_results = analyze_text(transcribed_text, include_features=False)
                
                if analysis_results.get("success", False):
                    # Add analysis results to response without saving to database
                    response["analysis"] = {
                        "analysis_id": f"demo_{uuid.uuid4()}",
                        "overall_score": analysis_results.get("overall_score", 0.0),
                        "confidence_score": analysis_results.get("confidence_score", 0.0),
                        "domain_scores": analysis_results.get("domain_scores", {}),
                        "recommendations": analysis_results.get("recommendations", []),
                        "model_type": analysis_results.get("model_type", "gpt4o"),
                        "timestamp": datetime.now().isoformat(),
                        "demo_mode": True
                    }
                else:
                    response["analysis_error"] = analysis_results.get("error", "Unknown error")
        
        return response
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        logger.error(f"Error in audio processing endpoint: {str(e)}", exc_info=True)
        
        error_detail = {
            "message": f"An error occurred during audio processing: {str(e)}",
            "error_type": "server_error",
            "request_id": request_id or str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat()
        }
        
        if temp_file:
            error_detail["file_info"] = {
                "temp_file_path": temp_file.name if os.path.exists(temp_file.name) else "unknown",
                "original_filename": getattr(audio_file, "filename", "unknown"),
                "content_type": getattr(audio_file, "content_type", "unknown")
            }
        
        raise HTTPException(
            status_code=500,
            detail=error_detail
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