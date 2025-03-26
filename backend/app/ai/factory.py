"""
AI Model Factory Module.

This module provides a factory for creating and managing different AI models
for language analysis, allowing easy switching between spaCy and GPT models.
"""

import os
import logging
from enum import Enum
from typing import Dict, Any, Callable, Optional, Union, BinaryIO
from pathlib import Path

from app.ai.nlp.risk_assessment import calculate_cognitive_risk as spacy_calculate_risk
from app.ai.speech.whisper_processor import process_audio as whisper_process_audio

# Initialize logger
logger = logging.getLogger(__name__)

class ModelType(str, Enum):
    """Enum for available model types."""
    SPACY = "spacy"
    GPT4 = "gpt4"

# Model sizes for Whisper
class WhisperModelSize(str, Enum):
    """Enum for available Whisper model sizes."""
    TINY = "tiny"
    BASE = "base"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"

class AIModelFactory:
    """Factory for creating and managing AI models."""
    
    def __init__(self):
        """Initialize the factory with available models."""
        self._models = {
            ModelType.SPACY: spacy_calculate_risk,
            # GPT model will be registered when API key is provided
            ModelType.GPT4: None
        }
        self._current_model = ModelType.SPACY
        self._whisper_model_size = WhisperModelSize.BASE
    
    def register_gpt_model(self, gpt_function: Callable):
        """
        Register a GPT model function.
        
        Args:
            gpt_function: The function that implements GPT-based analysis
        """
        self._models[ModelType.GPT4] = gpt_function
        logger.info("GPT-4 model registered successfully")
    
    def set_model(self, model_type: ModelType) -> bool:
        """
        Set the current model to use.
        
        Args:
            model_type: The model type to use
            
        Returns:
            True if model was set successfully, False otherwise
        """
        if model_type not in self._models:
            logger.error(f"Model type {model_type} not available")
            return False
        
        if self._models[model_type] is None:
            logger.error(f"Model {model_type} is not initialized")
            return False
        
        self._current_model = model_type
        logger.info(f"Current model set to {model_type}")
        return True
    
    def set_whisper_model_size(self, model_size: WhisperModelSize) -> bool:
        """
        Set the Whisper model size to use.
        
        Args:
            model_size: The model size to use
            
        Returns:
            True if model size was set successfully
        """
        self._whisper_model_size = model_size
        logger.info(f"Whisper model size set to {model_size}")
        return True
    
    def get_whisper_model_size(self) -> WhisperModelSize:
        """
        Get the current Whisper model size.
        
        Returns:
            Current Whisper model size
        """
        return self._whisper_model_size
    
    def get_current_model_type(self) -> ModelType:
        """
        Get the current model type.
        
        Returns:
            Current model type
        """
        return self._current_model
    
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze text using the current model.
        
        Args:
            text: The text to analyze
            
        Returns:
            Analysis results
        """
        model_function = self._models[self._current_model]
        
        if model_function is None:
            logger.error(f"Current model {self._current_model} is not initialized")
            return {
                "success": False,
                "error": f"Model {self._current_model} not initialized"
            }
        
        try:
            result = model_function(text)
            # Add model type to result
            if isinstance(result, dict) and result.get("success", False):
                result["model_type"] = self._current_model
            return result
        except Exception as e:
            logger.error(f"Error analyzing text with {self._current_model}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "model_type": self._current_model
            }
    
    def process_audio(
        self,
        audio_file: Union[BinaryIO, str, Path],
        language: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process audio file using Whisper.
        
        Args:
            audio_file: File-like object or path to audio file
            language: Language code (optional, auto-detect if None)
            
        Returns:
            Transcription results
        """
        try:
            logger.info(f"Processing audio with Whisper {self._whisper_model_size} model")
            # Convert enum to string before passing to whisper_process_audio
            model_size_str = str(self._whisper_model_size.value)
            result = whisper_process_audio(audio_file, model_size_str, language)
            return result
        except Exception as e:
            logger.error(f"Error processing audio: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

# Create a singleton instance
model_factory = AIModelFactory()

def analyze_text(text: str, include_features: bool = False) -> Dict[str, Any]:
    """
    Analyze text using the current AI model.
    
    Args:
        text: The text to analyze
        include_features: Whether to include detailed linguistic features in response
        
    Returns:
        Analysis results from the current model
    """
    try:
        # Use the singleton instance, not creating a new one
        factory = model_factory
        current_model = factory.get_current_model_type()
        
        logger.info(f"Analyzing text with {current_model} model")
        
        if current_model == ModelType.SPACY:
            from app.ai.nlp.risk_assessment import calculate_cognitive_risk
            return calculate_cognitive_risk(text, include_features=include_features)
        elif current_model == ModelType.GPT4:
            # Import here to avoid circular imports
            from app.ai.gpt.analyzer import analyze_with_gpt
            return analyze_with_gpt(text, include_features=include_features)
            
        return {
            "success": False,
            "error": f"Unsupported model type: {current_model}"
        }
        
    except Exception as e:
        logger.error(f"Error in text analysis: {str(e)}")
        logger.exception(e)
        return {
            "success": False,
            "error": f"Analysis failed: {str(e)}"
        }

def process_audio(
    audio_file: Union[BinaryIO, str, Path],
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Process audio file using Whisper.
    
    Args:
        audio_file: File-like object or path to audio file
        language: Language code (optional, auto-detect if None)
        
    Returns:
        Transcription results
    """
    try:
        return model_factory.process_audio(audio_file, language)
    except Exception as e:
        logger.error(f"Error in process_audio: {str(e)}")
        return {
            "success": False,
            "error": f"Audio processing failed: {str(e)}"
        }

def set_model(model_type: str, api_key: Optional[str] = None) -> bool:
    """
    Set the current model to use.
    
    Args:
        model_type: The model type to use ("spacy" or "gpt4")
        api_key: API key for GPT-4 (required if model_type is "gpt4")
        
    Returns:
        True if model was set successfully, False otherwise
    """
    try:
        if model_type.lower() == "gpt4" and api_key:
            # Register GPT model with API key
            if not register_gpt_model(api_key):
                return False
        
        return model_factory.set_model(ModelType(model_type.lower()))
    except ValueError:
        logger.error(f"Invalid model type: {model_type}")
        return False

def set_whisper_model_size(model_size: str) -> bool:
    """
    Set the Whisper model size to use.
    
    Args:
        model_size: The model size to use ("tiny", "base", "small", "medium", "large")
        
    Returns:
        True if model size was set successfully, False otherwise
    """
    try:
        return model_factory.set_whisper_model_size(WhisperModelSize(model_size.lower()))
    except ValueError:
        logger.error(f"Invalid Whisper model size: {model_size}")
        return False

def register_gpt_model(api_key: str) -> bool:
    """
    Register GPT-4 model with the provided API key.
    
    Args:
        api_key: OpenAI API key
        
    Returns:
        True if model was registered successfully, False otherwise
    """
    if not api_key:
        logger.error("Empty API key provided")
        return False
    
    try:
        # This import is done here to avoid loading OpenAI when not needed
        from app.ai.gpt.risk_assessment import initialize_gpt, calculate_cognitive_risk as gpt_calculate_risk
        
        # Initialize GPT with the provided API key
        initialize_gpt(api_key)
        
        # Register the GPT model
        model_factory.register_gpt_model(gpt_calculate_risk)
        
        return True
    except ImportError:
        logger.error("Failed to import GPT modules. Make sure openai package is installed.")
        return False
    except Exception as e:
        logger.error(f"Error registering GPT model: {str(e)}")
        return False 