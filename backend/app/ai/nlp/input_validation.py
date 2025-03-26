"""
Text Input Validation and Preprocessing.

This module provides functions for validating and preprocessing text inputs
before they are analyzed by the NLP pipeline.
"""

import logging
import re
import unicodedata
from typing import Dict, Any, List, Optional, Tuple, Union
import langdetect
from langdetect.lang_detect_exception import LangDetectException

# Initialize logger
logger = logging.getLogger(__name__)

# Maximum text length for analysis (to prevent resource exhaustion)
MAX_TEXT_LENGTH = 50000

# Minimum text length for meaningful analysis
MIN_TEXT_LENGTH = 20

# Supported languages (ISO 639-1 codes)
SUPPORTED_LANGUAGES = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese"
}

def validate_text_input(text: str) -> Dict[str, Any]:
    """
    Validate text input for analysis.
    
    Args:
        text: Text input to validate
        
    Returns:
        Dictionary with validation result and metadata
    """
    # Initialize result
    result = {
        "valid": False,
        "text": text,
        "original_length": len(text) if text else 0,
        "errors": [],
        "warnings": [],
        "language": None,
        "detection_confidence": 0.0
    }
    
    # Check if text is None or empty
    if not text:
        result["errors"].append("Text input is empty")
        return result
    
    # Check if text is a string
    if not isinstance(text, str):
        result["errors"].append("Text input must be a string")
        return result
    
    # Check if text is too short
    if len(text) < MIN_TEXT_LENGTH:
        result["errors"].append(f"Text too short for analysis (minimum {MIN_TEXT_LENGTH} characters)")
        return result
    
    # Check if text is too long
    if len(text) > MAX_TEXT_LENGTH:
        result["warnings"].append(f"Text exceeds maximum length ({len(text)}/{MAX_TEXT_LENGTH} characters). Will be truncated.")
        text = text[:MAX_TEXT_LENGTH]
        result["text"] = text
    
    # Detect language
    try:
        # Correctly use langdetect
        langdetect.DetectorFactory.seed = 0  # For consistent results
        detection = langdetect.detect_langs(text)
        
        if detection:
            result["language"] = detection[0].lang
            result["detection_confidence"] = detection[0].prob
        else:
            # Default to English if detection fails
            result["language"] = "en"
            result["detection_confidence"] = 0.5
            result["warnings"].append("Language detection uncertain. Assuming English.")
        
        # Check if language is supported
        if result["language"] not in SUPPORTED_LANGUAGES:
            result["warnings"].append(f"Language '{result['language']}' not fully supported. Analysis may be less accurate.")
    except LangDetectException as e:
        logger.warning(f"Language detection failed: {str(e)}")
        result["warnings"].append("Could not detect language. Assuming English.")
        result["language"] = "en"
    
    # Set validation result
    result["valid"] = len(result["errors"]) == 0
    
    return result

def preprocess_input_text(text: str) -> Tuple[str, Dict[str, Any]]:
    """
    Preprocess text input to standardize format and handle common issues.
    
    Args:
        text: Text input to preprocess
        
    Returns:
        Tuple of (preprocessed_text, metadata)
    """
    metadata = {
        "original_length": len(text) if text else 0,
        "preprocessing_steps": []
    }
    
    if not text:
        return "", metadata
    
    # 1. Normalize Unicode characters
    text = unicodedata.normalize("NFKC", text)
    metadata["preprocessing_steps"].append("unicode_normalization")
    
    # 2. Standardize line endings
    text = re.sub(r"\r\n?", "\n", text)
    metadata["preprocessing_steps"].append("standardize_line_endings")
    
    # 3. Remove excessive whitespace (but preserve paragraph structure)
    text = re.sub(r" +", " ", text)
    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)
    metadata["preprocessing_steps"].append("remove_excessive_whitespace")
    
    # 4. Remove URLs
    text = re.sub(r"https?://\S+", " [URL] ", text)
    metadata["preprocessing_steps"].append("remove_urls")
    
    # 5. Remove email addresses
    text = re.sub(r"\S+@\S+\.\S+", " [EMAIL] ", text)
    metadata["preprocessing_steps"].append("remove_emails")
    
    # 6. Standardize numbers (optional - might affect cognitive assessment)
    # text = re.sub(r"\d+", " [NUMBER] ", text)
    # metadata["preprocessing_steps"].append("standardize_numbers")
    
    # 7. Clean up spacing
    text = re.sub(r"\s+", " ", text)
    text = text.strip()
    metadata["preprocessing_steps"].append("clean_spacing")
    
    # Record final length
    metadata["processed_length"] = len(text)
    metadata["length_change"] = metadata["processed_length"] - metadata["original_length"]
    
    return text, metadata

def validate_and_preprocess_text(text: str) -> Dict[str, Any]:
    """
    Validate and preprocess text input in a single function.
    
    Args:
        text: Text input to process
        
    Returns:
        Dictionary with validation and preprocessing results
    """
    # First validate the input
    validation_result = validate_text_input(text)
    
    # If not valid, return validation result with errors
    if not validation_result["valid"]:
        return {
            "success": False,
            "valid": False,
            "errors": validation_result["errors"],
            "warnings": validation_result["warnings"]
        }
    
    # If valid, preprocess the text
    preprocessed_text, preprocessing_metadata = preprocess_input_text(validation_result["text"])
    
    # Combine results
    result = {
        "success": True,
        "valid": True,
        "text": preprocessed_text,
        "original_length": preprocessing_metadata["original_length"],
        "processed_length": preprocessing_metadata["processed_length"],
        "language": validation_result["language"],
        "language_name": SUPPORTED_LANGUAGES.get(validation_result["language"], "Unknown"),
        "detection_confidence": validation_result["detection_confidence"],
        "warnings": validation_result["warnings"],
        "preprocessing_steps": preprocessing_metadata["preprocessing_steps"]
    }
    
    return result

def extract_segments(text: str, min_segment_length: int = 50) -> List[Dict[str, Any]]:
    """
    Extract segments (paragraphs, sentences) from the text for analysis.
    
    Args:
        text: Text to segment
        min_segment_length: Minimum character length for a valid segment
        
    Returns:
        List of segment dictionaries
    """
    segments = []
    
    if not text:
        return segments
    
    # First split by paragraphs
    paragraphs = re.split(r"\n\s*\n", text)
    
    for i, paragraph in enumerate(paragraphs):
        # Skip empty paragraphs
        if not paragraph.strip():
            continue
        
        # Clean whitespace
        paragraph = re.sub(r"\s+", " ", paragraph.strip())
        
        # Skip paragraphs that are too short
        if len(paragraph) < min_segment_length:
            continue
        
        segments.append({
            "id": f"p{i+1}",
            "type": "paragraph",
            "text": paragraph,
            "length": len(paragraph),
            "position": i
        })
    
    # If no valid paragraphs were found, try sentence-based segmentation
    if not segments and len(text) >= min_segment_length:
        # Simple sentence splitting (not perfect but sufficient for this purpose)
        sentences = re.split(r"(?<=[.!?])\s+", text)
        
        for i, sentence in enumerate(sentences):
            # Skip empty sentences
            if not sentence.strip():
                continue
                
            # Clean whitespace
            sentence = re.sub(r"\s+", " ", sentence.strip())
            
            # Skip sentences that are too short
            if len(sentence) < min_segment_length:
                continue
            
            segments.append({
                "id": f"s{i+1}",
                "type": "sentence",
                "text": sentence,
                "length": len(sentence),
                "position": i
            })
    
    # If still no segments, just use the whole text if it's long enough
    if not segments and len(text) >= min_segment_length:
        segments.append({
            "id": "full",
            "type": "full_text",
            "text": text,
            "length": len(text),
            "position": 0
        })
    
    return segments 