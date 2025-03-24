"""
GPT-powered text analyzer.

This module provides functionality for analyzing text using GPT models
to detect potential signs of cognitive decline.
"""

import logging
from typing import Dict, Any, Optional

from app.ai.gpt.risk_assessment import calculate_cognitive_risk as gpt_calculate_risk

# Initialize logger
logger = logging.getLogger(__name__)

def analyze_with_gpt(text: str, include_features: bool = False) -> Dict[str, Any]:
    """
    Analyze text using GPT models for cognitive risk assessment.
    
    Args:
        text: The text to analyze
        include_features: Whether to include detailed features in response
        
    Returns:
        Analysis results dictionary
    """
    logger.info(f"Analyzing text with GPT: {text[:50]}...")
    
    try:
        # Call the GPT-based risk assessment function
        result = gpt_calculate_risk(text, include_features=include_features)
        
        if not result.get("success", False):
            logger.error(f"GPT analysis failed: {result.get('error')}")
        
        return result
    
    except Exception as e:
        logger.error(f"Error in GPT analysis: {str(e)}")
        logger.exception(e)
        return {
            "success": False,
            "error": f"GPT analysis failed: {str(e)}"
        } 