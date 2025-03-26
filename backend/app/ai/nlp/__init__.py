"""
NLP Module Initialization.

This module provides natural language processing functions for detecting cognitive decline markers.
"""

from app.ai.nlp.preprocessing import preprocess_text, tokenize_text
from app.ai.nlp.feature_extraction import extract_linguistic_features
from app.ai.nlp.risk_assessment import calculate_cognitive_risk
from app.ai.nlp.text_analysis import TextAnalysisPipeline, text_analysis_pipeline
from app.ai.nlp.pattern_detection import detect_linguistic_patterns
from app.ai.nlp.normalization import normalize_and_score_features
from app.ai.nlp.input_validation import validate_and_preprocess_text, extract_segments

__all__ = [
    "preprocess_text",
    "tokenize_text",
    "extract_linguistic_features",
    "calculate_cognitive_risk",
    "text_analysis_pipeline",
    "TextAnalysisPipeline",
    "detect_linguistic_patterns",
    "normalize_and_score_features",
    "validate_and_preprocess_text",
    "extract_segments"
] 