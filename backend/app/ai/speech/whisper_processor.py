"""
Whisper speech processing module.

This module provides functions for speech-to-text conversion using the OpenAI Whisper API.
"""

import logging
import os
import tempfile
from pathlib import Path
from typing import BinaryIO, Dict, Any, Optional, Union

from app.ai.openai_init import get_openai_client

# Import openai only when needed to avoid errors if not installed
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    # Define OpenAI error types as generic Exception if not available, for broader except blocks
    class OpenAIError(Exception):
        pass
    class APIConnectionError(OpenAIError):
        pass
    class APITimeoutError(OpenAIError):
        pass
    class RateLimitError(OpenAIError):
        pass
    class AuthenticationError(OpenAIError):
        pass

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
    Transcribe audio file to text using the shared OpenAI Whisper API client.
    
    Args:
        audio_path: Path to audio file
        language: Language code (optional, auto-detect if None)
    
    Returns:
        Dictionary containing transcription results
    """
    if not OPENAI_AVAILABLE:
        # This check is somewhat redundant if get_openai_client() is the sole source
        # but kept for robustness in case openai package itself is missing.
        logger.error("OpenAI package not available for transcription.")
        return {
            "success": False,
            "error": "OpenAI package not available. Install with 'pip install openai'."
        }
    
    openai_client_instance = get_openai_client()
    if not openai_client_instance:
        logger.error("Whisper transcription: Shared OpenAI client not available.")
        return {
            "success": False,
            "error": "OpenAI client not initialized or available for transcription."
        }
    
    whisper_model = "whisper-1"
    
    try:
        # API key check is implicitly handled by successful client retrieval
        # No need to os.getenv("OPENAI_API_KEY") here directly
        
        options = {}
        if language:
            options["language"] = language
        logger.info(f"Transcription options: {options}")
        
        logger.info(f"Transcribing audio file with OpenAI Whisper API: {audio_path}")
        if not os.path.exists(audio_path):
            logger.error(f"Audio file does not exist: {audio_path}")
            return {"success": False, "error": f"Audio file not found: {audio_path}"}
        if not os.access(audio_path, os.R_OK):
            logger.error(f"Audio file is not readable: {audio_path}")
            return {"success": False, "error": f"Audio file is not readable: {audio_path}"}
        
        file_size = os.path.getsize(audio_path)
        logger.info(f"Audio file size: {file_size} bytes for transcription.")
        
        try:
            with open(audio_path, "rb") as audio_file_obj:
                response = openai_client_instance.audio.transcriptions.create(
                    file=audio_file_obj,
                    model=whisper_model,
                    **options
                )
        # Use openai.APIConnectionError etc. if OPENAI_AVAILABLE is True
        except (openai.APIConnectionError if OPENAI_AVAILABLE else APIConnectionError) as conn_error:
            logger.error(f"OpenAI API connection error during transcription: {str(conn_error)}")
            return {"success": False, "error": f"OpenAI API connection error: {str(conn_error)}"}
        except (openai.APITimeoutError if OPENAI_AVAILABLE else APITimeoutError) as timeout_error:
            logger.error(f"OpenAI API timeout during transcription: {str(timeout_error)}")
            return {"success": False, "error": f"OpenAI API timeout: {str(timeout_error)}"}
        except (openai.RateLimitError if OPENAI_AVAILABLE else RateLimitError) as rate_limit_error:
            logger.error(f"OpenAI API rate limit exceeded during transcription: {str(rate_limit_error)}")
            return {"success": False, "error": f"OpenAI API rate limit exceeded: {str(rate_limit_error)}"}
        except (openai.AuthenticationError if OPENAI_AVAILABLE else AuthenticationError) as auth_error:
            logger.error(f"OpenAI API authentication error during transcription: {str(auth_error)}")
            return {"success": False, "error": "OpenAI API authentication error. The API key may be invalid or expired."}
        except (openai.OpenAIError if OPENAI_AVAILABLE else OpenAIError) as api_error: # Broad OpenAI error
            logger.error(f"OpenAI API error during transcription: {str(api_error)}")
            return {"success": False, "error": f"OpenAI API error: {str(api_error)}"}
        # Catch general connection errors as well
        except (ConnectionError, TimeoutError) as general_conn_err:
            logger.error(f"General connection error with OpenAI API during transcription: {str(general_conn_err)}")
            return {"success": False, "error": f"Connection error: {str(general_conn_err)}. Check internet connection."}
            
        logger.info(f"Transcription completed. Text: {response.text[:100]}...")
        return {
            "text": response.text,
            "segments": [], 
            "language": language or "auto-detected",
            "success": True
        }
    
    except Exception as e:
        logger.error(f"Error transcribing audio with OpenAI API: {str(e)}", exc_info=True)
        return {"success": False, "error": f"Transcription error: {str(e)}"}

def process_audio(
    audio_file: Union[BinaryIO, str, Path],
    model_name: str = "base",
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Process audio file: preprocess and transcribe.
    Relies on the shared OpenAI client via transcribe_audio_api.
    
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
        # API key presence is now checked by get_openai_client() used in transcribe_audio_api
        # However, a quick check here can prevent unnecessary preprocessing if client is not there.
        if not get_openai_client():
             logger.error("Audio processing: OpenAI client not available. Cannot proceed.")
             return {"success": False, "error": "OpenAI client not configured or available."}

        if isinstance(audio_file, (str, Path)):
            if not os.path.exists(audio_file):
                logger.error(f"Audio file not found: {audio_file}")
                return {"success": False, "error": f"Audio file not found: {audio_file}"}
            logger.info(f"Processing audio file: {audio_file}")
            file_size = os.path.getsize(audio_file)
            logger.info(f"Audio file size: {file_size} bytes")
        else: # File-like object
            current_pos = audio_file.tell()
            audio_file.seek(0, os.SEEK_END)
            file_size = audio_file.tell()
            audio_file.seek(current_pos) # Reset to original position
            logger.info(f"Processing audio from file-like object, size: {file_size} bytes")

        logger.info("Preprocessing audio file...")
        temp_path = preprocess_audio(audio_file)
        logger.info(f"Audio preprocessed successfully: {temp_path}")
        
        logger.info(f"Transcribing audio (metadata model: {model_name})...")
        result = transcribe_audio_api(temp_path, language)
        
        if not result.get("success", False):
            logger.error(f"Transcription failed: {result.get('error', 'Unknown error')}")
            return result # Propagate error from transcribe_audio_api
            
        logger.info("Audio transcription completed successfully.")
        
        # Add additional metadata to result
        result["model_name"] = model_name # For metadata purposes
        result["file_size"] = file_size
        
        return result
    
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        return {"success": False, "error": str(e)}
    
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
                logger.debug(f"Removed temporary file: {temp_path}")
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_path}: {str(e)}") 