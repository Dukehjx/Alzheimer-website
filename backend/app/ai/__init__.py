"""
AI module for Alzheimer's detection platform.

This module provides utilities for analyzing language to detect cognitive
decline indicators using GPT-4o and OpenAI's Whisper API.

The system uses GPT-4o for all language analysis and cognitive assessment,
and Whisper API for speech-to-text processing.
"""

from app.ai.factory import (
    analyze_text,
    process_audio, 
    set_model,
    set_whisper_model_size,
    register_gpt_model
)

__all__ = [
    # Factory functions
    "analyze_text",
    "process_audio",
    "set_model",
    "set_whisper_model_size",
    "register_gpt_model"
] 