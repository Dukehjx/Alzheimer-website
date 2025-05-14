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
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Transcribe audio file to text using OpenAI Whisper API.
    
    Args:
        audio_path: Path to audio file
        language: Language code (optional, auto-detect if None)
    
    Returns:
        Dictionary containing transcription results
    """
    if not OPENAI_AVAILABLE:
        logger.error("OpenAI package not available")
        return {
            "success": False,
            "error": "OpenAI package not available. Install with 'pip install openai'."
        }
    
    # Whisper API only has one model available
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
        
        # Log API key first few chars for debugging (NEVER log the full key)
        key_prefix = api_key[:5] if len(api_key) > 5 else "****"
        logger.info(f"Using OpenAI API key starting with: {key_prefix}...")
        
        # Create OpenAI client with additional configuration
        client = openai.OpenAI(
            api_key=api_key,
            timeout=90.0,  # Increased timeout for larger files
            max_retries=5   # More retries for reliability
        )
        
        # Set transcription options
        options = {}
        if language:
            options["language"] = language
            
        logger.info(f"Transcription options: {options}")
        
        # Transcribe audio using the API
        logger.info(f"Transcribing audio file with OpenAI Whisper API: {audio_path}")
        
        # Check file exists and is readable
        if not os.path.exists(audio_path):
            logger.error(f"Audio file does not exist: {audio_path}")
            return {
                "success": False, 
                "error": f"Audio file not found: {audio_path}"
            }
            
        if not os.access(audio_path, os.R_OK):
            logger.error(f"Audio file is not readable: {audio_path}")
            return {
                "success": False,
                "error": f"Audio file is not readable: {audio_path}"
            }
        
        # Log file size
        file_size = os.path.getsize(audio_path)
        logger.info(f"Audio file size: {file_size} bytes")
        
        # Transcribe with enhanced error handling
        try:
            logger.info("Opening audio file for transcription...")
            with open(audio_path, "rb") as audio_file_obj:
                logger.info("Sending to OpenAI Whisper API...")
                response = client.audio.transcriptions.create(
                    file=audio_file_obj,
                    model=whisper_model,
                    **options
                )
                logger.info("Transcription response received from OpenAI")
        except openai.APIConnectionError as conn_error:
            logger.error(f"OpenAI API connection error: {str(conn_error)}")
            return {
                "success": False,
                "error": f"OpenAI API connection error: {str(conn_error)}"
            }
        except openai.APITimeoutError as timeout_error:
            logger.error(f"OpenAI API timeout: {str(timeout_error)}")
            return {
                "success": False,
                "error": f"OpenAI API timeout: {str(timeout_error)}"
            }
        except openai.RateLimitError as rate_limit_error:
            logger.error(f"OpenAI API rate limit exceeded: {str(rate_limit_error)}")
            return {
                "success": False,
                "error": f"OpenAI API rate limit exceeded: {str(rate_limit_error)}"
            }
        except openai.AuthenticationError as auth_error:
            logger.error(f"OpenAI API authentication error: {str(auth_error)}")
            return {
                "success": False,
                "error": f"OpenAI API authentication error: The API key provided is invalid or has expired."
            }
        except openai.OpenAIError as api_error:
            logger.error(f"OpenAI API error: {str(api_error)}")
            return {
                "success": False,
                "error": f"OpenAI API error: {str(api_error)}"
            }
        except (ConnectionError, TimeoutError) as conn_error:
            logger.error(f"Connection error with OpenAI API: {str(conn_error)}")
            return {
                "success": False,
                "error": f"Connection error: {str(conn_error)}. Please check your internet connection."
            }
            
        logger.info("Transcription completed successfully")
        logger.info(f"Transcribed text: {response.text[:100]}...")
        
        return {
            "text": response.text,
            "segments": [],  # OpenAI API doesn't return segments like the local model
            "language": language or "auto-detected",
            "success": True
        }
    
    except Exception as e:
        logger.error(f"Error transcribing audio with OpenAI API: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": f"Transcription error: {str(e)}"
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
        model_name: Whisper model identifier (e.g., 'base', 'whisper-1'). 
                    Used for metadata; the API itself uses 'whisper-1'.
        language: Language code (optional, auto-detect if None)
    
    Returns:
        Dictionary containing transcription results
    """
    temp_path = None
    
    try:
        # Validate the audio file
        if isinstance(audio_file, (str, Path)) and not os.path.exists(audio_file):
            logger.error(f"Audio file not found: {audio_file}")
            return {
                "success": False,
                "error": f"Audio file not found: {audio_file}"
            }
            
        # Check for API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key not found in environment variables")
            return {
                "success": False,
                "error": "OpenAI API key not configured"
            }
            
        # Log audio file information
        if isinstance(audio_file, (str, Path)):
            logger.info(f"Processing audio file: {audio_file}")
            file_size = os.path.getsize(audio_file)
            logger.info(f"Audio file size: {file_size} bytes")
        else:
            audio_file.seek(0, os.SEEK_END)
            file_size = audio_file.tell()
            audio_file.seek(0)
            logger.info(f"Processing audio from file-like object, size: {file_size} bytes")

        # Preprocess audio
        logger.info("Preprocessing audio file...")
        temp_path = preprocess_audio(audio_file)
        logger.info(f"Audio preprocessed successfully: {temp_path}")
        
        # Transcribe preprocessed audio using the API
        logger.info(f"Transcribing audio... (Note: API uses 'whisper-1' model)")
        result = transcribe_audio_api(temp_path, language)
        
        if not result.get("success", False):
            logger.error(f"Transcription failed: {result.get('error', 'Unknown error')}")
            return result
            
        logger.info("Audio transcription completed successfully")
        
        # Add additional metadata to result
        result["model_name"] = model_name
        result["file_size"] = file_size
        
        return result
    
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": str(e)
        }
    
    finally:
        # Clean up temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
                logger.debug(f"Removed temporary file: {temp_path}")
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_path}: {str(e)}") 