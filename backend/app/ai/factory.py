"""
AI Model Factory Module.

This module provides a factory for creating and managing OpenAI API calls
for language analysis and speech-to-text conversion.
"""

import os
import logging
from enum import Enum
from typing import Dict, Any, Callable, Optional, Union, BinaryIO
from pathlib import Path

# Import the speech processor and the shared client getter
from app.ai.speech.whisper_processor import process_audio as whisper_process_audio
# Note: get_openai_client will be used by submodules like gpt/speech later

# Initialize logger
logger = logging.getLogger(__name__)

class ModelType(str, Enum):
    """Enum for available model types."""
    GPT4O = "gpt4o"

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
        self._models: Dict[ModelType, Optional[Callable]] = {
            ModelType.GPT4O: None
        }
        self._current_model_type = ModelType.GPT4O
        self._whisper_model_size = WhisperModelSize.BASE
    
    def register_gpt_model(self, gpt_analysis_function: Callable) -> bool:
        """
        Register a GPT model analysis function.
        
        Args:
            gpt_analysis_function: The function that implements GPT-based analysis.
                                   Expected signature: func(text: str, include_features: bool) -> Dict[str, Any]
        """
        if not callable(gpt_analysis_function):
            logger.error("Failed to register GPT model: provided function is not callable.")
            return False
        self._models[ModelType.GPT4O] = gpt_analysis_function
        logger.info(f"GPT model analysis function '{gpt_analysis_function.__name__}' registered for {ModelType.GPT4O.value}")
        return True
    
    def set_model(self, model_type: ModelType) -> bool:
        """
        Set the current model type to use for text analysis.
        
        Args:
            model_type: The model type to use.
            
        Returns:
            True if model type was set successfully, False otherwise.
        """
        if model_type not in self._models:
            logger.error(f"Model type {model_type.value} not available in factory.")
            return False
        
        if self._models[model_type] is None:
            logger.error(f"Model {model_type.value} is not registered or initialized in factory.")
            return False
        
        self._current_model_type = model_type
        logger.info(f"Current text analysis model type set to {model_type.value}")
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
        logger.info(f"Whisper model size set to {model_size.value}")
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
        return self._current_model_type
    
    def analyze_text(self, text: str, include_features: bool = False) -> Dict[str, Any]:
        """
        Analyze text using the currently set and registered model.
        
        Args:
            text: The text to analyze.
            include_features: Whether to include detailed linguistic features.
            
        Returns:
            Analysis results.
        """
        model_function = self._models.get(self._current_model_type)
        
        if model_function is None:
            logger.error(f"Current model {self._current_model_type.value} is not registered or initialized.")
            return {
                "success": False,
                "error": f"Model {self._current_model_type.value} not available or not initialized.",
                "model_type": self._current_model_type.value
            }
        
        try:
            # Assuming the registered function can handle include_features
            result = model_function(text, include_features=include_features)
            if isinstance(result, dict) and "model_type" not in result:
                 result["model_type"] = self._current_model_type.value
            return result
        except Exception as e:
            logger.error(f"Error analyzing text with {self._current_model_type.value}: {str(e)}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "model_type": self._current_model_type.value
            }
    
    def process_audio(
        self,
        audio_file: Union[BinaryIO, str, Path],
        language: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process audio file using OpenAI Whisper API via whisper_processor."""
        try:
            logger.info(f"Processing audio with Whisper model size configuration: {self._whisper_model_size.value}")
            model_size_str = str(self._whisper_model_size.value) # whisper_process_audio expects a string
            # whisper_process_audio will use the shared client from openai_init
            result = whisper_process_audio(audio_file, model_size_str, language)
            return result
        except Exception as e:
            logger.error(f"Error processing audio: {str(e)}", exc_info=True)
            return {
                "success": False,
                "error": str(e)
            }

# Create a singleton instance of the factory
model_factory = AIModelFactory()

# --- Standalone functions ---

def analyze_text(text: str, include_features: bool = False) -> Dict[str, Any]:
    """
    Standalone function to analyze text. Uses the model_factory instance.
    DEPRECATED for external use. Prefer using `model_factory.analyze_text()` directly.
    Ensures that the factory's configured model is used.
    """
    logger.debug("Standalone analyze_text function called, deferring to model_factory instance. Consider direct use.")
    return model_factory.analyze_text(text, include_features=include_features)

def process_audio(
    audio_file: Union[BinaryIO, str, Path],
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Standalone function to process audio. Uses the model_factory instance.
    DEPRECATED for external use. Prefer using `model_factory.process_audio()` directly.
    """
    logger.debug("Standalone process_audio function called, deferring to model_factory instance. Consider direct use.")
    return model_factory.process_audio(audio_file, language)

def set_model(model_type_str: str) -> bool:
    """
    Standalone function to set the model type in the factory.
    This primarily handles string to ModelType conversion.
    Prefer `model_factory.set_model(ModelType.VALUE)` if using enums directly.
    """
    try:
        model_type_enum = ModelType(model_type_str.lower())
        logger.debug(f"Standalone set_model attempting to set model to {model_type_enum.value}")
        return model_factory.set_model(model_type_enum)
    except ValueError:
        logger.error(f"Invalid model type string '{model_type_str}' for ModelType enum.")
        return False

def set_whisper_model_size(model_size_str: str) -> bool:
    """
    Standalone function to set the Whisper model size in the factory.
    Converts string to WhisperModelSize enum.
    Prefer `model_factory.set_whisper_model_size(WhisperModelSize.VALUE)` if using enums directly.
    """
    try:
        model_size_enum = WhisperModelSize(model_size_str.lower())
        return model_factory.set_whisper_model_size(model_size_enum)
    except ValueError:
        logger.error(f"Invalid model size string '{model_size_str}' for WhisperModelSize enum.")
        return False

def register_gpt_model(api_key_for_gpt_init: str) -> bool:
    """
    Standalone function to initialize the GPT module and register its analysis function 
    with the model_factory.
    This is a key setup function called during AI module initialization.
    
    Args:
        api_key_for_gpt_init: API key, potentially used by the GPT module's own initialization.
    """
    logger.info("Attempting to initialize GPT module and register with factory...")
    try:
        # Import GPT module components needed for registration
        from app.ai.gpt.risk_assessment import initialize_gpt as gpt_module_initialize
        from app.ai.gpt.analyzer import analyze_with_gpt as gpt_analyzer_function

        # Initialize the GPT module (e.g., test API key, load resources if any for this module)
        # This initialize_gpt will need to be updated to use the shared client for its tests.
        if not gpt_module_initialize(api_key_for_gpt_init):
            logger.error("GPT module initialization (gpt.risk_assessment.initialize_gpt) failed.")
            return False
        logger.info("GPT module (risk_assessment.initialize_gpt) initialized successfully.")

        # Register the actual analysis function from gpt.analyzer with the factory instance
        if model_factory.register_gpt_model(gpt_analyzer_function):
            logger.info("Successfully registered GPT analyzer function with the model factory.")
            return True
        else:
            logger.error("Failed to register GPT analyzer function with the model factory.")
            return False
            
    except ImportError as e:
        logger.error(f"Failed to import GPT module components: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error during GPT model registration process: {str(e)}", exc_info=True)
        return False 