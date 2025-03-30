"""
Whisper speech processing module.

This module provides functions for speech-to-text conversion using the OpenAI Whisper API.
"""

import logging
import os
import tempfile
from pathlib import Path
from typing import BinaryIO, Dict, Any, Optional, Union

# Import openai only when needed to avoid errors if not installed
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

import ffmpeg
from pydub import AudioSegment

# Initialize logger
logger = logging.getLogger(__name__)

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

def transcribe_audio_api(
    audio_path: Union[str, Path],
    model_name: str = "base",
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Transcribe audio file to text using OpenAI Whisper API.
    
    Args:
        audio_path: Path to audio file
        model_name: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
        language: Language code (optional, auto-detect if None)
    
    Returns:
        Dictionary containing transcription results
    """
    if not OPENAI_AVAILABLE:
        return {
            "success": False,
            "error": "OpenAI package not available. Install with 'pip install openai'."
        }
    
    # Map model sizes to OpenAI Whisper API models
    model_map = {
        "tiny": "whisper-1",
        "base": "whisper-1",
        "small": "whisper-1",
        "medium": "whisper-1",
        "large": "whisper-1",
    }
    
    # Always use whisper-1 model as it's the only one available via API
    whisper_model = "whisper-1"
    
    try:
        # Get API key from environment
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key not found in environment variables")
            return {
                "success": False,
                "error": "OpenAI API key not configured"
            }
        
        # Create OpenAI client
        client = openai.OpenAI(api_key=api_key)
        
        # Set transcription options
        options = {}
        if language:
            options["language"] = language
        
        # Transcribe audio using the API
        logger.info(f"Transcribing audio file with OpenAI Whisper API: {audio_path}")
        
        with open(audio_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                file=audio_file,
                model=whisper_model,
                **options
            )
        
        return {
            "text": response.text,
            "segments": [],  # OpenAI API doesn't return segments like the local model
            "language": language,
            "success": True
        }
    
    except Exception as e:
        logger.error(f"Error transcribing audio with OpenAI API: {str(e)}")
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
        
        # Transcribe preprocessed audio using the API
        result = transcribe_audio_api(temp_path, model_name, language)
        
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