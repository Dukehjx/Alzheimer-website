"""
Whisper speech processing module.

This module provides functions for speech-to-text conversion using the Whisper model.
"""

import logging
import os
import tempfile
from pathlib import Path
from typing import BinaryIO, Dict, Any, Optional, Union

import whisper
import ffmpeg
from pydub import AudioSegment

# Initialize logger
logger = logging.getLogger(__name__)

# Global variables
_model = None
_model_name = "base"  # Default model size

def get_whisper_model(model_name: str = "base"):
    """
    Get or initialize the Whisper model.
    
    Args:
        model_name: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
    
    Returns:
        Loaded Whisper model
    """
    global _model, _model_name
    
    # Only load the model if it's not already loaded or if a different model is requested
    if _model is None or model_name != _model_name:
        try:
            logger.info(f"Loading Whisper model: {model_name}")
            _model = whisper.load_model(model_name)
            _model_name = model_name
        except Exception as e:
            logger.error(f"Error loading Whisper model: {str(e)}")
            raise RuntimeError(f"Failed to load Whisper model: {str(e)}")
    
    return _model

def preprocess_audio(audio_file: Union[BinaryIO, str, Path]) -> str:
    """
    Preprocess audio file for optimal conversion.
    
    Args:
        audio_file: File-like object or path to audio file
    
    Returns:
        Path to preprocessed audio file
    """
    try:
        # Create a temporary file for the processed audio
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_path = temp_file.name
        temp_file.close()
        
        # Convert the audio file to WAV format with appropriate settings
        if isinstance(audio_file, (str, Path)):
            audio = AudioSegment.from_file(audio_file)
        else:
            audio_file.seek(0)  # Reset file pointer
            audio = AudioSegment.from_file(audio_file)
        
        # Normalize audio and convert to mono with 16kHz sample rate (optimal for Whisper)
        audio = audio.set_channels(1)
        audio = audio.set_frame_rate(16000)
        audio = audio.normalize()
        
        # Export to WAV format
        audio.export(temp_path, format="wav")
        
        return temp_path
    
    except Exception as e:
        logger.error(f"Error preprocessing audio: {str(e)}")
        raise RuntimeError(f"Audio preprocessing failed: {str(e)}")

def transcribe_audio(
    audio_path: Union[str, Path],
    model_name: str = "base",
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Transcribe audio file to text using Whisper model.
    
    Args:
        audio_path: Path to audio file
        model_name: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
        language: Language code (optional, auto-detect if None)
    
    Returns:
        Dictionary containing transcription results
    """
    try:
        # Get Whisper model
        model = get_whisper_model(model_name)
        
        # Set transcription options
        options = {}
        if language:
            options["language"] = language
        
        # Transcribe audio
        logger.info(f"Transcribing audio file: {audio_path}")
        result = model.transcribe(str(audio_path), **options)
        
        return {
            "text": result["text"],
            "segments": result["segments"],
            "language": result.get("language"),
            "success": True
        }
    
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

def process_audio(
    audio_file: Union[BinaryIO, str, Path],
    model_name: str = "base",
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Process audio file: preprocess and transcribe.
    
    Args:
        audio_file: File-like object or path to audio file
        model_name: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
        language: Language code (optional, auto-detect if None)
    
    Returns:
        Dictionary containing transcription results
    """
    temp_path = None
    
    try:
        # Preprocess audio
        temp_path = preprocess_audio(audio_file)
        
        # Transcribe preprocessed audio
        result = transcribe_audio(temp_path, model_name, language)
        
        return result
    
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
    
    finally:
        # Clean up temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_path}: {str(e)}") 