"""
NLP Module Initialization.

This module provides natural language processing functions for detecting cognitive decline markers.
"""

from app.ai.nlp.preprocessing import preprocess_text
from app.ai.nlp.feature_extraction import extract_linguistic_features
from app.ai.nlp.risk_assessment import calculate_cognitive_risk

__all__ = [
    "preprocess_text",
    "extract_linguistic_features",
    "calculate_cognitive_risk"
] 