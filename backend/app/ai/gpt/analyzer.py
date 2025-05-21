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
        include_features: Whether to include detailed linguistic features in response
        
    Returns:
        Analysis results dictionary containing:
        - success: bool indicating if analysis was successful
        - overall_score: float between 0 and 1
        - domain_scores: dict of cognitive domain scores
        - evidence: list of supporting evidence
        - recommendations: list of recommendations
        - features: (optional) detailed linguistic features if requested
    """
    logger.info(f"Analyzing text with GPT: {text[:50]}...")
    
    try:
        # Call the GPT-based risk assessment function with features flag
        result = gpt_calculate_risk(text, include_features)
        
        if not result.get("success", False):
            return result
            
        # Ensure consistent naming (risk_score -> overall_score)
        if "risk_score" in result:
            result["overall_score"] = result.pop("risk_score")
        
        return result
    
    except Exception as e:
        logger.error(f"Error in GPT analysis: {str(e)}")
        logger.exception(e)
        return {
            "success": False,
            "error": f"GPT analysis failed: {str(e)}",
            "overall_score": 0.0,
            "domain_scores": {},
            "evidence": [],
            "recommendations": []
        } 