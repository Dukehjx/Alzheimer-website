"""
GPT-4o based risk assessment for cognitive decline.

This module provides GPT-4o powered language analysis for cognitive decline detection.
It will be initialized and used when an OpenAI API key is provided.
"""

import logging
import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional, Set

from app.models.analysis import CognitiveDomain

# Initialize logger
logger = logging.getLogger(__name__)

# Global OpenAI API client
openai_client = None

# Valid cognitive domains
VALID_DOMAINS: Set[str] = {domain.value.upper() for domain in CognitiveDomain}

def initialize_gpt(api_key: str) -> bool:
    """
    Initialize the GPT model with the provided API key.
    
    Args:
        api_key: OpenAI API key
        
    Returns:
        True if initialization was successful, False otherwise
    """
    global openai_client
    
    try:
        # Only import openai when we actually need it
        import openai
        
        # Set API key and initialize client
        openai.api_key = api_key
        openai_client = openai.OpenAI(api_key=api_key)
        
        # Test the API key with a simple call
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a cognitive health assistant."},
                {"role": "user", "content": "Hello, this is a test."}
            ],
            max_tokens=10
        )
        
        logger.info("GPT-4o model initialized successfully")
        return True
    except ImportError:
        logger.error("Failed to import openai package. Please install it with 'pip install openai'")
        return False
    except Exception as e:
        logger.error(f"Error initializing GPT-4o model: {str(e)}")
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
    """
    Calculate cognitive risk using GPT-4o.
    
    This function leverages GPT-4o's language understanding
    to assess cognitive decline risks from text.
    
    Args:
        text: The text to analyze
        include_features: Whether to include detailed linguistic features
        
    Returns:
        Dictionary with analysis results
    """
    global openai_client
    
    if openai_client is None:
        logger.error("GPT-4o model not initialized. Call initialize_gpt() first.")
        return {
            "success": False,
            "error": "GPT-4o model not initialized"
        }
    
    try:
        # Generate prompt for GPT-4o
        prompt = generate_gpt_prompt(text, include_features)
        
        # Call GPT-4o API
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a cognitive health assessment system specializing in linguistic analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.3  # Lower temperature for more deterministic results
        )
        
        # Extract response text
        response_text = response.choices[0].message.content
        
        # Parse the response
        gpt_data = parse_gpt_response(response_text)
        
        if not gpt_data:
            logger.error("Failed to parse GPT-4o response")
            return {
                "success": False,
                "error": "Failed to parse GPT-4o response"
            }
        
        # Format the result
        result = {
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
            "risk_score": gpt_data.get("risk_score", 0.0),
            "domain_scores": gpt_data.get("domain_scores", {}),
            "evidence": gpt_data.get("evidence", []),
            "recommendations": gpt_data.get("recommendations", []),
            "confidence_score": gpt_data.get("confidence_score", 0.8)
        }
        
        # Include linguistic features if requested
        if include_features and "linguistic_features" in gpt_data:
            result["features"] = gpt_data["linguistic_features"]
        
        return result
    
    except Exception as e:
        logger.error(f"Error in GPT-4o analysis: {str(e)}")
        return {
            "success": False,
            "error": f"GPT-4o analysis failed: {str(e)}"
        } 