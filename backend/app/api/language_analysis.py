"""
Language Analysis API routes for analyzing speech and text samples
to detect early signs of cognitive decline.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from typing import Optional, Dict, Any, Literal

from ..services.cognitive_service import CognitiveService, get_cognitive_service

router = APIRouter(
    prefix="/language-analysis",
    tags=["Language Analysis"],
    responses={404: {"description": "Not found"}},
)

@router.post("/analyze-text", response_model=None)
async def analyze_text(
    text: str = Form(...),
    user_id: Optional[str] = Form(None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    cognitive_service: CognitiveService = get_cognitive_service()
):
    """
    Analyze a text sample for signs of cognitive decline.
    
    This endpoint processes text input and returns linguistic metrics
    that may indicate early signs of MCI or Alzheimer's.
    
    Parameters:
    - **text**: The text sample to analyze
    - **user_id**: Optional user ID for tracking history
    
    Returns a detailed analysis including:
    - Linguistic features and metrics
    - Risk assessment scores
    - Recommendations based on the analysis
    """
    try:
        # Call the AI service to analyze the text
        metadata = {"source": "api", "endpoint": "analyze-text"}
        
        result = await cognitive_service.analyze_text(
            text=text,
            user_id=user_id,
            metadata=metadata,
            background_tasks=background_tasks
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze-speech", response_model=None)
async def analyze_speech(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    whisper_mode: Optional[Literal["local", "api"]] = Form(None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    cognitive_service: CognitiveService = get_cognitive_service()
):
    """
    Analyze a speech recording for signs of cognitive decline.
    
    This endpoint accepts audio files, transcribes them to text using
    a speech-to-text service, and then performs linguistic analysis.
    
    Parameters:
    - **audio_file**: Audio recording file (MP3, WAV, M4A, etc.)
    - **language**: Optional language code (e.g., 'en', 'es')
    - **user_id**: Optional user ID for tracking history
    - **whisper_mode**: Optional mode for speech-to-text ('local' or 'api')
    
    Returns a detailed analysis including:
    - Speech transcription
    - Linguistic features and metrics
    - Risk assessment scores
    - Recommendations based on the analysis
    """
    try:
        # Call the AI service to analyze the speech
        metadata = {
            "source": "api", 
            "endpoint": "analyze-speech",
            "whisper_mode": whisper_mode
        }
        
        result = await cognitive_service.analyze_speech(
            audio_file=audio_file,
            language=language,
            user_id=user_id,
            metadata=metadata,
            background_tasks=background_tasks,
            whisper_mode=whisper_mode
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech analysis failed: {str(e)}")

@router.get("/history/{user_id}", response_model=None)
async def get_analysis_history(
    user_id: str,
    cognitive_service: CognitiveService = get_cognitive_service()
):
    """
    Retrieve the analysis history for a specific user.
    
    This endpoint returns a list of previous analyses and their results,
    which can be used to track changes over time.
    
    Parameters:
    - **user_id**: ID of the user to retrieve history for
    
    Returns:
    - List of previous assessments with their summary results
    """
    try:
        result = await cognitive_service.get_user_history(user_id)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

@router.get("/config", response_model=None)
async def get_config(
    cognitive_service: CognitiveService = get_cognitive_service()
):
    """
    Get the current configuration of the language analysis service.
    
    This endpoint returns information about the current configuration,
    including the Whisper mode and model being used.
    
    Returns:
    - Configuration details
    """
    try:
        return {
            "whisper_mode": cognitive_service.whisper_mode,
            "whisper_model": cognitive_service.whisper_model,
            "has_openai_key": bool(cognitive_service.openai_api_key)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve configuration: {str(e)}") 