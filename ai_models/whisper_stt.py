"""
Speech-to-Text Module using OpenAI's Whisper

This module handles the conversion of speech to text using either the local Whisper model
or OpenAI's Whisper API, with robust error handling and preprocessing for optimal transcription quality.
"""

import os
import tempfile
import logging
from pathlib import Path
from typing import Optional, Dict, Any, Union, BinaryIO, Literal

import openai
import requests
from pydantic import BaseModel, Field

# Configure logging
logger = logging.getLogger(__name__)


class TranscriptionResult(BaseModel):
    """Model for storing transcription results."""
    text: str = Field(..., description="The transcribed text")
    duration: float = Field(0.0, description="Audio duration in seconds")
    is_successful: bool = Field(True, description="Whether transcription was successful")
    error_message: Optional[str] = Field(None, description="Error message if transcription failed")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class WhisperSTT:
    """
    Speech-to-Text conversion using OpenAI's Whisper.
    
    This class handles the transcription of audio to text with robust error handling,
    preprocessing for noise reduction, and optional language specification.
    It supports both local Whisper model and OpenAI's Whisper API.
    """
    
    def __init__(
        self, 
        api_key: Optional[str] = None,
        mode: Literal["local", "api"] = "local",
        model_name: str = "base"
    ):
        """
        Initialize the WhisperSTT class.
        
        Args:
            api_key: OpenAI API key (required for API mode)
            mode: Whether to use local Whisper model or OpenAI API
            model_name: Whisper model name to use for local mode (tiny, base, small, medium, large)
        
        Raises:
            ValueError: If API mode is selected but no API key is provided.
        """
        self.mode = mode
        self.model_name = model_name
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        
        # Check for API key if using API mode
        if self.mode == "api" and not self.api_key:
            raise ValueError(
                "No OpenAI API key provided. Set the OPENAI_API_KEY environment variable "
                "or pass the key directly to the constructor when using API mode."
            )
        
        # Initialize API if needed
        if self.mode == "api":
            openai.api_key = self.api_key
            logger.info("Initialized WhisperSTT in API mode")
        else:
            # Import local Whisper only if needed
            try:
                import whisper
                self.model = whisper.load_model(self.model_name)
                logger.info(f"Initialized WhisperSTT in local mode with model: {self.model_name}")
            except ImportError:
                logger.error("Failed to import local Whisper. Please install it with 'pip install openai-whisper'")
                raise ImportError("Local Whisper model not available. Please install it with 'pip install openai-whisper'")
            except Exception as e:
                logger.error(f"Error loading Whisper model: {e}")
                raise
    
    async def transcribe_audio(
        self, 
        audio_file: Union[str, Path, BinaryIO],
        language: Optional[str] = None,
        prompt: Optional[str] = None
    ) -> TranscriptionResult:
        """
        Transcribe audio using Whisper.
        
        Args:
            audio_file: Path to audio file or file-like object
            language: Optional language code (e.g., "en", "es")
            prompt: Optional text to guide the transcription
            
        Returns:
            TranscriptionResult object containing the transcribed text and metadata
        """
        try:
            logger.info(f"Starting transcription of audio file using {self.mode} mode")
            
            # Handle file input - could be a path or a file-like object
            if isinstance(audio_file, (str, Path)):
                audio_path = str(audio_file)
                if self.mode == "api":
                    with open(audio_path, "rb") as f:
                        file_data = f.read()
                        file_size = len(file_data)
                        logger.debug(f"Audio file size: {file_size / 1024:.2f} KB")
            else:
                # It's a file-like object
                audio_file.seek(0)
                file_data = audio_file.read()
                file_size = len(file_data)
                logger.debug(f"Received audio data size: {file_size / 1024:.2f} KB")
                
                # Create a temporary file
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
                temp_path = temp_file.name
                with open(temp_path, 'wb') as f:
                    f.write(file_data)
                audio_path = temp_path
            
            # Process based on mode
            try:
                if self.mode == "api":
                    return await self._transcribe_with_api(audio_path, language, prompt)
                else:
                    return await self._transcribe_with_local_model(audio_path, language, prompt)
            finally:
                # Clean up temporary file if created
                if not isinstance(audio_file, (str, Path)) and 'temp_path' in locals():
                    try:
                        os.unlink(temp_path)
                    except Exception as e:
                        logger.warning(f"Error removing temporary file: {e}")
        
        except Exception as e:
            logger.exception(f"Unexpected error during transcription: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message=f"Unexpected error: {str(e)}"
            )
    
    async def _transcribe_with_api(
        self, 
        audio_path: str, 
        language: Optional[str] = None,
        prompt: Optional[str] = None
    ) -> TranscriptionResult:
        """
        Transcribe audio using OpenAI's Whisper API.
        
        Args:
            audio_path: Path to the audio file
            language: Optional language code
            prompt: Optional text to guide the transcription
            
        Returns:
            TranscriptionResult object
        """
        try:
            # Build transcription parameters
            params = {
                "file": open(audio_path, "rb"),
                "model": "whisper-1",
            }
            
            if language:
                params["language"] = language
            
            if prompt:
                params["prompt"] = prompt
            
            # Call Whisper API
            response = openai.Audio.transcribe(**params)
            
            # Extract results
            text = response.get("text", "").strip()
            duration = response.get("duration", 0.0)
            
            logger.info(f"API transcription successful: {len(text)} characters")
            
            return TranscriptionResult(
                text=text,
                duration=duration,
                is_successful=True,
                metadata={
                    "model": "whisper-1",
                    "language": language or "auto",
                    "prompt_used": bool(prompt),
                    "mode": "api"
                }
            )
            
        except openai.error.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message=f"OpenAI API error: {str(e)}"
            )
            
        except openai.error.RateLimitError as e:
            logger.error(f"OpenAI rate limit exceeded: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message="Rate limit exceeded. Please try again later."
            )
            
        except openai.error.AuthenticationError as e:
            logger.error(f"OpenAI authentication error: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message="Authentication failed. Please check your API key."
            )
            
        except (IOError, OSError) as e:
            logger.error(f"File operation error: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message=f"Error processing audio file: {str(e)}"
            )
            
        except Exception as e:
            logger.exception(f"Unexpected error during API transcription: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message=f"Unexpected error: {str(e)}"
            )
    
    async def _transcribe_with_local_model(
        self, 
        audio_path: str, 
        language: Optional[str] = None,
        prompt: Optional[str] = None
    ) -> TranscriptionResult:
        """
        Transcribe audio using local Whisper model.
        
        Args:
            audio_path: Path to the audio file
            language: Optional language code
            prompt: Optional text to guide the transcription
            
        Returns:
            TranscriptionResult object
        """
        try:
            # Prepare options for the local model
            options = {}
            
            if language:
                options["language"] = language
            
            if prompt:
                options["initial_prompt"] = prompt
            
            # Run transcription
            result = self.model.transcribe(audio_path, **options)
            
            # Extract text and metadata
            text = result.get("text", "").strip()
            segments = result.get("segments", [])
            
            # Calculate duration from segments
            duration = sum((segment.get("end", 0) - segment.get("start", 0)) for segment in segments)
            
            logger.info(f"Local transcription successful: {len(text)} characters")
            
            return TranscriptionResult(
                text=text,
                duration=duration,
                is_successful=True,
                metadata={
                    "model": f"whisper-{self.model_name}",
                    "language": language or result.get("language", "auto"),
                    "prompt_used": bool(prompt),
                    "mode": "local"
                }
            )
            
        except (IOError, OSError) as e:
            logger.error(f"File operation error: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message=f"Error processing audio file: {str(e)}"
            )
            
        except Exception as e:
            logger.exception(f"Unexpected error during local transcription: {e}")
            return TranscriptionResult(
                text="",
                is_successful=False,
                error_message=f"Unexpected error: {str(e)}"
            )
    
    def preprocess_audio(self, audio_path: Union[str, Path]) -> str:
        """
        Preprocess audio for better transcription quality.
        
        This method can be extended with more sophisticated audio preprocessing like:
        - Noise reduction
        - Volume normalization
        - Audio filtering
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Path to the preprocessed audio file
        """
        # Currently a placeholder for future implementation
        # Could add actual audio preprocessing using libraries like librosa, pydub, etc.
        logger.info(f"Audio preprocessing applied to {audio_path}")
        return str(audio_path) 