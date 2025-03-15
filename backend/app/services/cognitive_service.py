"""
Cognitive Service Module

This module connects the FastAPI backend with the AI models
for cognitive assessment of speech and text.
"""

import os
import sys
from typing import Optional, Dict, Any, Literal
from pathlib import Path

# Add the project root to the Python path to allow importing the ai_models
project_root = Path(__file__).parent.parent.parent.parent
sys.path.append(str(project_root))

from fastapi import BackgroundTasks, HTTPException, UploadFile
from ai_models.api_integration import AssessmentService, APIResponse


class CognitiveService:
    """
    Service to integrate the AI models with the FastAPI backend.
    
    This class provides methods that can be called from API endpoints
    to analyze text and speech for signs of cognitive decline.
    """
    
    _instance = None
    
    def __new__(cls):
        """Implement singleton pattern."""
        if cls._instance is None:
            cls._instance = super(CognitiveService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize the cognitive service."""
        if self._initialized:
            return
            
        # Get configuration from environment variables
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
        # Get Whisper mode from environment or default to local
        self.whisper_mode = os.getenv("WHISPER_MODE", "local")
        if self.whisper_mode not in ["local", "api"]:
            self.whisper_mode = "local"  # Default to local if invalid value
            
        # Get Whisper model from environment or default to base
        self.whisper_model = os.getenv("WHISPER_MODEL", "base")
        
        # Set up the storage directory for assessment results
        storage_dir = os.path.join(project_root, "assessment_results")
        
        try:
            # Initialize the assessment service
            self.assessment_service = AssessmentService(
                openai_api_key=self.openai_api_key,
                whisper_mode=self.whisper_mode,
                whisper_model=self.whisper_model,
                storage_dir=storage_dir,
                save_results=True
            )
            
            print(f"Cognitive service initialized with Whisper in {self.whisper_mode} mode using {self.whisper_model} model")
            self._initialized = True
        except Exception as e:
            error_msg = f"Failed to initialize cognitive service: {str(e)}"
            print(error_msg)  # Print to console for debugging
            raise RuntimeError(error_msg)
    
    async def analyze_text(
        self, 
        text: str,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        background_tasks: Optional[BackgroundTasks] = None
    ) -> dict:
        """
        Analyze text for signs of cognitive decline.
        
        Args:
            text: Text to analyze
            user_id: Optional user ID for tracking
            metadata: Optional additional metadata
            background_tasks: FastAPI BackgroundTasks for async operations
            
        Returns:
            Dictionary with analysis results
        """
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty")
            
        response = await self.assessment_service.process_text(
            text=text,
            user_id=user_id,
            metadata=metadata,
            background_tasks=background_tasks
        )
        
        if not response.success:
            raise HTTPException(
                status_code=500,
                detail=response.message or "Text analysis failed"
            )
            
        return response.data
    
    async def analyze_speech(
        self,
        audio_file: UploadFile,
        language: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        background_tasks: Optional[BackgroundTasks] = None,
        whisper_mode: Optional[Literal["local", "api"]] = None
    ) -> dict:
        """
        Analyze speech for signs of cognitive decline.
        
        Args:
            audio_file: Uploaded audio file
            language: Optional language code
            user_id: Optional user ID for tracking
            metadata: Optional additional metadata
            background_tasks: FastAPI BackgroundTasks for async operations
            whisper_mode: Override the default Whisper mode for this request
            
        Returns:
            Dictionary with analysis results
        """
        if not audio_file:
            raise HTTPException(status_code=400, detail="No audio file provided")
            
        # Override Whisper mode if specified
        if whisper_mode and whisper_mode in ["local", "api"]:
            # Temporarily override the assessment service with the new mode
            temp_service = AssessmentService(
                openai_api_key=self.openai_api_key,
                whisper_mode=whisper_mode,
                whisper_model=self.whisper_model,
                storage_dir=self.assessment_service.storage_dir,
                save_results=self.assessment_service.save_results
            )
            
            response = await temp_service.process_speech(
                audio_file=audio_file,
                language=language,
                user_id=user_id,
                metadata=metadata,
                background_tasks=background_tasks
            )
        else:
            # Use the default service
            response = await self.assessment_service.process_speech(
                audio_file=audio_file,
                language=language,
                user_id=user_id,
                metadata=metadata,
                background_tasks=background_tasks
            )
        
        if not response.success:
            raise HTTPException(
                status_code=500,
                detail=response.message or "Speech analysis failed"
            )
            
        return response.data
    
    async def get_user_history(self, user_id: str) -> dict:
        """
        Get analysis history for a specific user.
        
        Args:
            user_id: User ID to get history for
            
        Returns:
            Dictionary with user history
        """
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID cannot be empty")
            
        response = await self.assessment_service.get_user_history(user_id)
        
        if not response.success:
            raise HTTPException(
                status_code=500,
                detail=response.message or "Failed to retrieve user history"
            )
            
        return {"user_id": user_id, "analysis_history": response.data.get("assessments", [])}


# Singleton instance for dependency injection
cognitive_service = CognitiveService()


def get_cognitive_service() -> CognitiveService:
    """
    Factory function to get the CognitiveService instance.
    
    This function is designed to be used with FastAPI's dependency injection system.
    
    Returns:
        CognitiveService instance
    """
    return cognitive_service 