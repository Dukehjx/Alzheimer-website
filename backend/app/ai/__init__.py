"""
AI Module Initialization.

This module contains all AI-related functionality for the Alzheimer's detection platform.
"""

from app.ai.nlp import (
    preprocess_text,
    extract_linguistic_features,
    calculate_cognitive_risk
)

__all__ = [
    "preprocess_text",
    "extract_linguistic_features",
    "calculate_cognitive_risk"
] 