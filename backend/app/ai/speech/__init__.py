"""
Speech processing module for Alzheimer's detection platform.

This module provides functions for speech-to-text conversion and processing
using the Whisper model.
"""

from .whisper_processor import process_audio, transcribe_audio_api as transcribe_audio

__all__ = ["process_audio", "transcribe_audio"] 