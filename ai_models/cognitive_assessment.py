"""
Cognitive Assessment Module

This module integrates the speech-to-text, NLP analysis, and risk scoring
components to provide a complete cognitive assessment pipeline.
"""

import logging
import os
from pathlib import Path
from typing import Dict, Any, Optional, Union, BinaryIO, Literal

from pydantic import BaseModel, Field

from .whisper_stt import WhisperSTT, TranscriptionResult
from .nlp_analyzer import NLPAnalyzer, LinguisticFeatures
from .risk_scorer import RiskScorer, RiskAssessment

# Configure logging
logger = logging.getLogger(__name__)


class CognitiveAssessmentInput(BaseModel):
    """Input model for cognitive assessment."""
    text: Optional[str] = Field(None, description="Text input for analysis")
    audio_file: Optional[str] = Field(None, description="Path to audio file for analysis")
    language: Optional[str] = Field(None, description="Language code (e.g., 'en', 'es')")
    user_id: Optional[str] = Field(None, description="User ID for tracking")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class CognitiveAssessmentResult(BaseModel):
    """Complete cognitive assessment result."""
    # Input information
    input_type: str = Field(..., description="Type of input (text or speech)")
    user_id: Optional[str] = Field(None, description="User ID if provided")
    
    # Transcription (if speech input)
    transcription: Optional[TranscriptionResult] = Field(
        None, description="Transcription result if speech input was provided"
    )
    
    # Linguistic features
    linguistic_features: LinguisticFeatures = Field(
        ..., description="Extracted linguistic features"
    )
    
    # Risk assessment
    risk_assessment: RiskAssessment = Field(
        ..., description="Cognitive risk assessment"
    )
    
    # Metadata
    assessment_id: str = Field(..., description="Unique ID for this assessment")
    timestamp: str = Field(..., description="Timestamp of assessment")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class CognitiveAssessment:
    """
    Integrated cognitive assessment pipeline.
    
    This class combines speech-to-text, NLP analysis, and risk scoring
    to provide a complete cognitive assessment from either text or speech input.
    """
    
    def __init__(
        self, 
        openai_api_key: Optional[str] = None,
        whisper_mode: Literal["local", "api"] = "local",
        whisper_model: str = "base",
        spacy_model: str = "en_core_web_md",
        risk_model_path: Optional[str] = None
    ):
        """
        Initialize the cognitive assessment pipeline.
        
        Args:
            openai_api_key: OpenAI API key for Whisper (required for API mode)
            whisper_mode: Whether to use local Whisper model or OpenAI API
            whisper_model: Whisper model to use for local mode (tiny, base, small, medium, large)
            spacy_model: Name of spaCy model to use
            risk_model_path: Path to risk model weights
        """
        self.openai_api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        self.whisper_mode = whisper_mode
        
        # Initialize components
        try:
            self.stt = WhisperSTT(
                api_key=self.openai_api_key, 
                mode=whisper_mode,
                model_name=whisper_model
            )
            self.nlp_analyzer = NLPAnalyzer(model_name=spacy_model)
            self.risk_scorer = RiskScorer(model_weights_path=risk_model_path)
            
            logger.info(f"Cognitive assessment pipeline initialized successfully with Whisper in {whisper_mode} mode")
        except Exception as e:
            logger.exception(f"Error initializing cognitive assessment pipeline: {e}")
            raise
    
    async def assess_from_text(
        self, 
        text: str, 
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CognitiveAssessmentResult:
        """
        Assess cognitive function from text input.
        
        Args:
            text: Text to analyze
            user_id: Optional user ID for tracking
            metadata: Optional additional metadata
            
        Returns:
            Complete cognitive assessment result
        """
        if not text or not text.strip():
            raise ValueError("Text input cannot be empty")
        
        try:
            # Clean up text
            text = text.strip()
            
            logger.info(f"Processing text input ({len(text)} chars)")
            
            # Extract linguistic features
            linguistic_features = self.nlp_analyzer.analyze_text(text)
            
            # Calculate cognitive risk
            risk_assessment = self.risk_scorer.calculate_risk(linguistic_features)
            
            # Create result
            from datetime import datetime
            import uuid
            
            result = CognitiveAssessmentResult(
                input_type="text",
                user_id=user_id,
                linguistic_features=linguistic_features,
                risk_assessment=risk_assessment,
                assessment_id=str(uuid.uuid4()),
                timestamp=datetime.now().isoformat(),
                metadata=metadata or {}
            )
            
            logger.info(f"Completed text assessment with risk level: {risk_assessment.risk_level}")
            return result
            
        except Exception as e:
            logger.exception(f"Error during text assessment: {e}")
            raise
    
    async def assess_from_speech(
        self,
        audio_file: Union[str, Path, BinaryIO],
        language: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CognitiveAssessmentResult:
        """
        Assess cognitive function from speech input.
        
        Args:
            audio_file: Path to audio file or file-like object
            language: Optional language code (e.g., "en", "es")
            user_id: Optional user ID for tracking
            metadata: Optional additional metadata
            
        Returns:
            Complete cognitive assessment result
        """
        try:
            logger.info(f"Processing speech input using Whisper in {self.whisper_mode} mode")
            
            # Convert speech to text
            transcription = await self.stt.transcribe_audio(
                audio_file=audio_file,
                language=language
            )
            
            if not transcription.is_successful:
                raise ValueError(f"Speech transcription failed: {transcription.error_message}")
            
            if not transcription.text or not transcription.text.strip():
                raise ValueError("Transcription resulted in empty text")
            
            # Extract linguistic features
            linguistic_features = self.nlp_analyzer.analyze_text(transcription.text)
            
            # Calculate cognitive risk
            risk_assessment = self.risk_scorer.calculate_risk(linguistic_features)
            
            # Create result
            from datetime import datetime
            import uuid
            
            result = CognitiveAssessmentResult(
                input_type="speech",
                user_id=user_id,
                transcription=transcription,
                linguistic_features=linguistic_features,
                risk_assessment=risk_assessment,
                assessment_id=str(uuid.uuid4()),
                timestamp=datetime.now().isoformat(),
                metadata={
                    **(metadata or {}),
                    "whisper_mode": self.whisper_mode
                }
            )
            
            logger.info(f"Completed speech assessment with risk level: {risk_assessment.risk_level}")
            return result
            
        except Exception as e:
            logger.exception(f"Error during speech assessment: {e}")
            raise
    
    async def assess(self, input_data: CognitiveAssessmentInput) -> CognitiveAssessmentResult:
        """
        Assess cognitive function from either text or speech input.
        
        Args:
            input_data: Input data containing either text or audio_file
            
        Returns:
            Complete cognitive assessment result
        """
        # Validate input
        if input_data.text:
            return await self.assess_from_text(
                text=input_data.text,
                user_id=input_data.user_id,
                metadata=input_data.metadata
            )
        elif input_data.audio_file:
            return await self.assess_from_speech(
                audio_file=input_data.audio_file,
                language=input_data.language,
                user_id=input_data.user_id,
                metadata=input_data.metadata
            )
        else:
            raise ValueError("Either text or audio_file must be provided") 