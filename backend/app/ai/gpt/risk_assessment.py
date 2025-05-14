"""
GPT-4o based risk assessment for cognitive decline.

This module provides GPT-4o powered language analysis for cognitive decline detection.
It will be initialized and used when an OpenAI API key is provided.
"""

import logging
import os # Keep for other potential uses, though API key is now via shared client
import json
from datetime import datetime
from typing import Dict, Any, List, Optional, Set

from app.models.analysis import CognitiveDomain
from app.ai.openai_init import get_openai_client # Import the shared client getter

# Initialize logger
logger = logging.getLogger(__name__)

# Global OpenAI API client (now obtained via get_openai_client)
# openai_client = None # Replaced by shared client logic

VALID_DOMAINS: Set[str] = {domain.value.upper() for domain in CognitiveDomain}

def initialize_gpt(api_key: str) -> bool: # api_key param might become redundant if only shared client is used
    """
    Initialize and test the GPT model setup using the shared OpenAI client.
    The api_key parameter is kept for compatibility but the shared client is preferred.
    """
    openai_client_instance = get_openai_client()
    if not openai_client_instance:
        logger.error("GPT module: Shared OpenAI client not available. Initialization failed.")
        return False
    
    try:
        # Test the API key via the shared client
        response = openai_client_instance.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a cognitive health assistant (GPT module test)."},
                {"role": "user", "content": "Test call from GPT risk assessment module."}
            ],
            max_tokens=10
        )
        logger.info("GPT module (risk_assessment): Successfully tested API connection via shared client.")
        return True
    except Exception as e:
        logger.error(f"GPT module (risk_assessment): Error testing API via shared client: {str(e)}")
        return False

def generate_gpt_prompt(text: str, include_features: bool = False) -> str:
    """
    Generate a prompt for GPT-4o analysis.
    
    Args:
        text: Original text input
        include_features: Whether to include detailed linguistic features
        
    Returns:
        Formatted prompt for GPT-4o
    """
    base_prompt = f"""
You are an expert cognitive linguist specializing in detecting early signs of cognitive decline through language analysis.
Analyze the following text for indicators of Mild Cognitive Impairment (MCI) or early Alzheimer's disease.

TEXT: "{text}"

Based on the text, please:
1. Assess the cognitive risk level (0.0-1.0 scale, where 1.0 is highest risk)
2. Provide scores for specific cognitive domains: LANGUAGE, MEMORY, EXECUTIVE_FUNCTION, ATTENTION
3. Provide specific evidence from the text that supports your assessment
4. List 3-5 personalized recommendations based on the analysis
5. Provide a confidence score (0.0-1.0) for your assessment
"""

    if include_features:
        base_prompt += """
6. Extract detailed linguistic features:
   - Lexical diversity metrics
   - Syntactic complexity indicators
   - Semantic coherence measures
   - Error patterns
"""

    base_prompt += """
Format your response as JSON with the following structure:
{
  "risk_score": float,
  "domain_scores": {
    "LANGUAGE": float,
    "MEMORY": float,
    "EXECUTIVE_FUNCTION": float,
    "ATTENTION": float
  },
  "evidence": [
    string,
    string,
    ...
  ],
  "recommendations": [
    string,
    string,
    ...
  ],
  "confidence_score": float"""

    if include_features:
        base_prompt += """,
  "linguistic_features": {
    "lexical_diversity": object,
    "syntactic_complexity": object,
    "semantic_coherence": object,
    "error_patterns": object
  }"""

    base_prompt += "\n}"
    
    return base_prompt

def validate_domain_scores(scores: Dict[str, float]) -> Dict[str, float]:
    """Validate and normalize domain scores."""
    validated = {}
    for domain in VALID_DOMAINS:
        score = scores.get(domain, 0.0)
        # Ensure score is within valid range
        validated[domain] = max(0.0, min(1.0, float(score)))
    return validated

def parse_gpt_response(response: str) -> Dict[str, Any]:
    """
    Parse the GPT-4o response into structured data.
    
    Args:
        response: Raw GPT-4o response
        
    Returns:
        Structured response data
    """
    try:
        # Extract JSON from response (in case there's extra text)
        json_start = response.find("{")
        json_end = response.rfind("}") + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = response[json_start:json_end]
            data = json.loads(json_str)
            
            # Validate the required fields
            required_fields = {"risk_score", "domain_scores", "evidence", "recommendations"}
            if not all(field in data for field in required_fields):
                raise ValueError("Missing required fields in GPT response")
            
            # Validate domain scores
            data["domain_scores"] = validate_domain_scores(data["domain_scores"])
            
            # Ensure confidence score exists
            if "confidence_score" not in data:
                data["confidence_score"] = 0.8  # Default confidence if not provided
            
            return data
        else:
            raise ValueError("No valid JSON found in GPT response")
    except Exception as e:
        logger.error(f"Error parsing GPT response: {str(e)}")
        logger.debug(f"Raw response: {response}")
        return None

def calculate_cognitive_risk(text: str, include_features: bool = False) -> Dict[str, Any]:
    """Calculate cognitive risk using GPT-4o via the shared OpenAI client."""
    openai_client_instance = get_openai_client()
    
    if not openai_client_instance:
        logger.error("GPT risk assessment: Shared OpenAI client not available.")
        return {
            "success": False,
            "error": "OpenAI client not initialized or available."
        }
    
    try:
        prompt = generate_gpt_prompt(text, include_features)
        
        response = openai_client_instance.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a cognitive health assessment system specializing in linguistic analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.3
        )
        
        response_text = response.choices[0].message.content
        gpt_data = parse_gpt_response(response_text)
        
        if not gpt_data:
            return {
                "success": False,
                "error": "Failed to parse GPT-4o response"
            }
        
        result = {
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
            "risk_score": gpt_data["risk_score"],
            "domain_scores": gpt_data["domain_scores"],
            "evidence": gpt_data["evidence"],
            "recommendations": gpt_data["recommendations"],
            "confidence_score": gpt_data["confidence_score"]
        }
        
        if include_features and "linguistic_features" in gpt_data:
            result["features"] = gpt_data["linguistic_features"]
        
        return result
    
    except Exception as e:
        logger.error(f"Error in GPT-4o risk calculation: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": f"GPT-4o risk calculation failed: {str(e)}"
        } 