"""
AI module for Alzheimer's detection platform.

This module provides utilities for analyzing language to detect cognitive
decline indicators.

It includes both spaCy-based and GPT-based models for text analysis,
as well as Whisper-based speech-to-text processing.
"""

from app.ai.factory import (
    analyze_text,
    process_audio, 
    set_model,
    set_whisper_model_size,
    register_gpt_model
)

# Import NLP pipeline components
from app.ai.nlp import (
    text_analysis_pipeline,
    detect_linguistic_patterns,
    normalize_and_score_features,
    validate_and_preprocess_text
)

__all__ = [
    # Factory functions
    "analyze_text",
    "process_audio",
    "set_model",
    "set_whisper_model_size",
    "register_gpt_model",
    
    # NLP pipeline components
    "text_analysis_pipeline",
    "detect_linguistic_patterns",
    "normalize_and_score_features",
    "validate_and_preprocess_text"
] 