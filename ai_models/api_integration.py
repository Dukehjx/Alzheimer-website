"""
API Integration Module

This module provides the integration between the AI models and the FastAPI backend.
It includes utility functions and classes to connect the cognitive assessment 
pipeline with the REST API endpoints.
"""

import logging
import os
from pathlib import Path
from typing import Dict, Any, Optional, List, Union, Literal
import json
import asyncio
from datetime import datetime

from fastapi import UploadFile, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, Field

from .cognitive_assessment import (
    CognitiveAssessment, 
    CognitiveAssessmentInput, 
    CognitiveAssessmentResult
)

# Configure logging
logger = logging.getLogger(__name__)


class APIResponse(BaseModel):
    """Standardized API response model."""
    success: bool = Field(..., description="Whether the request was successful")
    message: str = Field(..., description="Response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data")
    errors: Optional[List[str]] = Field(None, description="List of errors if any")


class AssessmentService:
    """
    Service class for handling cognitive assessments through the API.
    
    This class provides methods to interact with the cognitive assessment pipeline
    from FastAPI endpoints, including handling file uploads, text input, and
    persistent storage of assessment results.
    """
    
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        """Implement singleton pattern to avoid recreating expensive models."""
        if cls._instance is None:
            cls._instance = super(AssessmentService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(
        self,
        openai_api_key: Optional[str] = None,
        whisper_mode: Literal["local", "api"] = "local",
        whisper_model: str = "base",
        storage_dir: Optional[str] = None,
        save_results: bool = True
    ):
        """
        Initialize the assessment service.
        
        Args:
            openai_api_key: OpenAI API key for Whisper STT
            whisper_mode: Whether to use local Whisper model or OpenAI API
            whisper_model: Whisper model name to use for local mode
            storage_dir: Directory to store assessment results
            save_results: Whether to save assessment results to disk
        """
        # Only initialize once
        if self._initialized:
            return
            
        self.openai_api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        self.whisper_mode = whisper_mode
        self.whisper_model = whisper_model
        
        if self.whisper_mode == "api" and not self.openai_api_key:
            logger.warning("No OpenAI API key provided but API mode selected. Speech analysis will not work.")
        
        self.storage_dir = storage_dir or os.path.join(os.getcwd(), "assessment_results")
        os.makedirs(self.storage_dir, exist_ok=True)
        
        self.save_results = save_results
        
        # Initialize cognitive assessment pipeline
        try:
            self.cognitive_assessment = CognitiveAssessment(
                openai_api_key=self.openai_api_key,
                whisper_mode=self.whisper_mode,
                whisper_model=self.whisper_model
            )
            logger.info(f"Assessment service initialized successfully with Whisper in {whisper_mode} mode")
        except Exception as e:
            logger.exception(f"Error initializing assessment service: {e}")
            raise
            
        self._initialized = True
    
    async def process_text(
        self,
        text: str,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        background_tasks: Optional[Any] = None
    ) -> APIResponse:
        """
        Process text input for cognitive assessment.
        
        Args:
            text: Text to analyze
            user_id: Optional user ID for tracking
            metadata: Optional additional metadata
            background_tasks: Optional FastAPI BackgroundTasks for async operations
            
        Returns:
            APIResponse with assessment results
        """
        try:
            # Create metadata if not provided
            if metadata is None:
                metadata = {}
            
            # Add whisper mode to metadata
            metadata["whisper_mode"] = self.whisper_mode
            metadata["whisper_model"] = self.whisper_model
            
            # Process the text through the assessment pipeline
            assessment_result = await self.cognitive_assessment.assess(CognitiveAssessmentInput(
                text=text,
                user_id=user_id,
                metadata=metadata
            ))
            
            # Create the response data
            response_data = {
                "transcription": text,
                "risk_assessment": {
                    "overall_risk_score": assessment_result.risk_assessment.overall_risk_score,
                    "risk_level": assessment_result.risk_assessment.risk_level,
                    "categories": [
                        {
                            "name": category.name,
                            "score": category.score,
                            "description": category.description
                        }
                        for category in assessment_result.risk_assessment.categories
                    ],
                    "recommendations": assessment_result.risk_assessment.recommendations,
                    "explanations": assessment_result.risk_assessment.explanation
                },
                "linguistic_features": assessment_result.linguistic_features.model_dump()
            }
            
            # Save the results if enabled
            if self.save_results and user_id:
                if background_tasks:
                    background_tasks.add_task(
                        self._save_assessment_result,
                        user_id=user_id,
                        assessment_type="text",
                        assessment_data=response_data,
                        metadata=metadata
                    )
                else:
                    await self._save_assessment_result(
                        user_id=user_id,
                        assessment_type="text",
                        assessment_data=response_data,
                        metadata=metadata
                    )
            
            return APIResponse(
                success=True,
                message=f"Text analyzed successfully using NLP analysis.",
                data=response_data
            )
        except Exception as e:
            error_msg = f"Error processing text: {str(e)}"
            print(error_msg)
            import traceback
            traceback.print_exc()
            return APIResponse(
                success=False,
                message=error_msg,
                data=None
            )
    
    async def process_speech(
        self,
        audio_file: UploadFile,
        language: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        background_tasks: Optional[BackgroundTasks] = None
    ) -> APIResponse:
        """
        Process speech input for cognitive assessment.
        
        Args:
            audio_file: Uploaded audio file
            language: Optional language code
            user_id: Optional user ID for tracking
            metadata: Optional additional metadata
            background_tasks: FastAPI BackgroundTasks for async operations
            
        Returns:
            Standardized API response
        """
        if not audio_file:
            return APIResponse(
                success=False,
                message="No audio file provided",
                errors=["Missing audio file"]
            )
            
        # Verify file content type
        content_type = audio_file.content_type
        if not content_type or not content_type.startswith(('audio/', 'video/')):
            return APIResponse(
                success=False,
                message=f"Invalid file type: {content_type}",
                errors=[f"File must be audio format, got {content_type}"]
            )
            
        try:
            # Create a temporary file to store the uploaded audio
            temp_dir = Path(os.path.join(os.getcwd(), "temp"))
            temp_dir.mkdir(exist_ok=True)
            
            temp_file = Path(temp_dir) / f"{datetime.now().timestamp()}_{audio_file.filename}"
            
            # Save uploaded file to temp location
            contents = await audio_file.read()
            with open(temp_file, 'wb') as f:
                f.write(contents)
            
            # Process the audio file
            input_data = CognitiveAssessmentInput(
                audio_file=str(temp_file),
                language=language,
                user_id=user_id,
                metadata={
                    **(metadata or {}),
                    "whisper_mode": self.whisper_mode,
                    "whisper_model": self.whisper_model
                }
            )
            
            # Process assessment
            assessment_result = await self.cognitive_assessment.assess(input_data)
            
            # Save result in background if requested
            if self.save_results and background_tasks:
                background_tasks.add_task(
                    self._save_assessment_result,
                    assessment_result,
                    user_id
                )
                
            # Clean up temporary file in background
            if background_tasks:
                background_tasks.add_task(self._cleanup_temp_file, temp_file)
                
            # Prepare response
            return APIResponse(
                success=True,
                message=f"Speech analysis completed successfully using {self.whisper_mode} mode",
                data={
                    "assessment_id": assessment_result.assessment_id,
                    "transcription": assessment_result.transcription.text if assessment_result.transcription else None,
                    "risk_level": assessment_result.risk_assessment.risk_level,
                    "risk_score": assessment_result.risk_assessment.overall_score,
                    "whisper_mode": self.whisper_mode,
                    "whisper_model": self.whisper_model,
                    "categories": [
                        {
                            "name": cat.name,
                            "score": cat.score,
                            "description": cat.description
                        }
                        for cat in assessment_result.risk_assessment.categories
                    ],
                    "recommendations": assessment_result.risk_assessment.recommendations,
                    "explanations": assessment_result.risk_assessment.explanation
                }
            )
            
        except Exception as e:
            logger.exception(f"Error processing speech: {e}")
            return APIResponse(
                success=False,
                message=f"Error processing speech: {str(e)}",
                errors=[str(e)]
            )
            
    async def get_user_history(self, user_id: str) -> APIResponse:
        """
        Retrieve assessment history for a specific user.
        
        Args:
            user_id: User ID to retrieve history for
            
        Returns:
            Standardized API response with assessment history
        """
        if not user_id:
            return APIResponse(
                success=False,
                message="User ID cannot be empty",
                errors=["Missing user ID"]
            )
            
        try:
            # Create user-specific directory path
            user_dir = os.path.join(self.storage_dir, user_id)
            if not os.path.exists(user_dir):
                return APIResponse(
                    success=True,
                    message=f"No assessment history found for user {user_id}",
                    data={"assessments": []}
                )
                
            # Get all assessment files for this user
            assessment_files = [f for f in os.listdir(user_dir) if f.endswith('.json')]
            
            if not assessment_files:
                return APIResponse(
                    success=True,
                    message=f"No assessment history found for user {user_id}",
                    data={"assessments": []}
                )
                
            # Load and compile assessment data
            assessments = []
            for file_name in assessment_files:
                file_path = os.path.join(user_dir, file_name)
                try:
                    with open(file_path, 'r') as f:
                        assessment_data = json.load(f)
                        # Extract only the summary data
                        summary = {
                            "assessment_id": assessment_data.get("assessment_id"),
                            "timestamp": assessment_data.get("timestamp"),
                            "input_type": assessment_data.get("input_type"),
                            "risk_level": assessment_data.get("risk_assessment", {}).get("risk_level"),
                            "risk_score": assessment_data.get("risk_assessment", {}).get("overall_score"),
                        }
                        assessments.append(summary)
                except Exception as e:
                    logger.error(f"Error reading assessment file {file_path}: {e}")
                    continue
                    
            # Sort by timestamp, newest first
            assessments.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            
            return APIResponse(
                success=True,
                message=f"Retrieved {len(assessments)} assessments for user {user_id}",
                data={"assessments": assessments}
            )
            
        except Exception as e:
            logger.exception(f"Error retrieving user history: {e}")
            return APIResponse(
                success=False,
                message=f"Error retrieving user history: {str(e)}",
                errors=[str(e)]
            )
    
    async def get_assessment_details(self, assessment_id: str, user_id: Optional[str] = None) -> APIResponse:
        """
        Retrieve detailed results for a specific assessment.
        
        Args:
            assessment_id: ID of the assessment to retrieve
            user_id: Optional user ID to narrow down search
            
        Returns:
            Standardized API response with detailed assessment data
        """
        if not assessment_id:
            return APIResponse(
                success=False,
                message="Assessment ID cannot be empty",
                errors=["Missing assessment ID"]
            )
            
        try:
            # If user_id is provided, look in that directory
            if user_id:
                user_dir = os.path.join(self.storage_dir, user_id)
                if os.path.exists(user_dir):
                    # Look for the assessment file
                    assessment_path = os.path.join(user_dir, f"{assessment_id}.json")
                    if os.path.exists(assessment_path):
                        with open(assessment_path, 'r') as f:
                            assessment_data = json.load(f)
                        return APIResponse(
                            success=True,
                            message=f"Retrieved assessment details for {assessment_id}",
                            data=assessment_data
                        )
            
            # If not found with user_id or no user_id provided, search all directories
            for root, dirs, files in os.walk(self.storage_dir):
                for file in files:
                    if file == f"{assessment_id}.json":
                        file_path = os.path.join(root, file)
                        with open(file_path, 'r') as f:
                            assessment_data = json.load(f)
                        return APIResponse(
                            success=True,
                            message=f"Retrieved assessment details for {assessment_id}",
                            data=assessment_data
                        )
            
            # If we get here, the assessment was not found
            return APIResponse(
                success=False,
                message=f"Assessment {assessment_id} not found",
                errors=[f"No assessment found with ID {assessment_id}"]
            )
            
        except Exception as e:
            logger.exception(f"Error retrieving assessment details: {e}")
            return APIResponse(
                success=False,
                message=f"Error retrieving assessment details: {str(e)}",
                errors=[str(e)]
            )
    
    def _save_assessment_result(self, result: CognitiveAssessmentResult, user_id: Optional[str] = None):
        """Save assessment result to disk."""
        try:
            # Use provided user_id or from the result
            effective_user_id = user_id or result.user_id or "anonymous"
            
            # Create user directory if it doesn't exist
            user_dir = os.path.join(self.storage_dir, effective_user_id)
            os.makedirs(user_dir, exist_ok=True)
            
            # Save the result to a JSON file
            file_path = os.path.join(user_dir, f"{result.assessment_id}.json")
            with open(file_path, 'w') as f:
                f.write(result.json(exclude_none=True, indent=2))
                
            logger.info(f"Saved assessment result to {file_path}")
            
        except Exception as e:
            logger.exception(f"Error saving assessment result: {e}")
    
    def _cleanup_temp_file(self, file_path: Union[str, Path]):
        """Clean up temporary file."""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Removed temporary file {file_path}")
        except Exception as e:
            logger.error(f"Error removing temporary file {file_path}: {e}")


# Factory function for FastAPI dependency injection
def get_assessment_service(
    openai_api_key: Optional[str] = None,
    whisper_mode: Literal["local", "api"] = "local",
    whisper_model: str = "base",
    storage_dir: Optional[str] = None,
    save_results: bool = True
) -> AssessmentService:
    """
    Factory function to get the AssessmentService instance.
    
    This function is designed to be used with FastAPI's dependency injection system.
    
    Args:
        openai_api_key: OpenAI API key
        whisper_mode: Whether to use local Whisper model or OpenAI API
        whisper_model: Whisper model name to use for local mode
        storage_dir: Directory to store assessment results
        save_results: Whether to save assessment results
        
    Returns:
        AssessmentService instance
    """
    return AssessmentService(
        openai_api_key=openai_api_key,
        whisper_mode=whisper_mode,
        whisper_model=whisper_model,
        storage_dir=storage_dir,
        save_results=save_results
    ) 