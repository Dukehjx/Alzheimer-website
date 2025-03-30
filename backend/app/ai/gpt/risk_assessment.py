"""
GPT-4o based risk assessment for cognitive decline.

This module provides GPT-4o powered language analysis for cognitive decline detection.
It will be initialized and used when an OpenAI API key is provided.
"""

import logging
import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

from app.models.analysis import CognitiveDomain

# Initialize logger
logger = logging.getLogger(__name__)

# Global OpenAI API client
openai_client = None

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

def generate_gpt_prompt(text: str, linguistic_features: Dict[str, Any]) -> str:
    """
    Generate a prompt for GPT-4o analysis.
    
    Args:
        text: Original text input
        linguistic_features: Extracted linguistic features from spaCy
        
    Returns:
        Formatted prompt for GPT-4o
    """
    return f"""
You are an expert cognitive linguist specializing in detecting early signs of cognitive decline through language analysis.
Analyze the following text for indicators of Mild Cognitive Impairment (MCI) or early Alzheimer's disease.

TEXT: "{text}"

LINGUISTIC FEATURES:
{json.dumps(linguistic_features, indent=2)}

Based on the text and extracted linguistic features, please:
1. Assess the cognitive risk level (0.0-1.0 scale, where 1.0 is highest risk)
2. Provide scores for specific cognitive domains: LANGUAGE, MEMORY, EXECUTIVE_FUNCTION, ATTENTION
3. Provide specific evidence from the text that supports your assessment
4. List 3-5 personalized recommendations based on the analysis

Format your response as JSON with the following structure:
{{
  "risk_score": float,
  "domain_scores": {{
    "LANGUAGE": float,
    "MEMORY": float,
    "EXECUTIVE_FUNCTION": float,
    "ATTENTION": float
  }},
  "evidence": [
    string,
    string,
    ...
  ],
  "recommendations": [
    string,
    string,
    ...
  ]
}}
"""

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
            if "risk_score" not in data or "domain_scores" not in data:
                raise ValueError("Missing required fields in GPT response")
            
            return data
        else:
            raise ValueError("No valid JSON found in GPT response")
    except Exception as e:
        logger.error(f"Error parsing GPT response: {str(e)}")
        logger.debug(f"Raw response: {response}")
        return None

def calculate_cognitive_risk(text: str) -> Dict[str, Any]:
    """
    Calculate cognitive risk using GPT-4o.
    
    This function leverages GPT-4o's language understanding
    to assess cognitive decline risks from text.
    
    Args:
        text: The text to analyze
        
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
        # First, extract basic linguistic features using spaCy
        from app.ai.nlp.feature_extraction import extract_linguistic_features
        features = extract_linguistic_features(text)
        
        if not features.get("success", False):
            logger.error(f"Failed to extract linguistic features: {features.get('error')}")
            return {
                "success": False,
                "error": "Failed to extract linguistic features"
            }
        
        # Generate prompt for GPT-4o
        prompt = generate_gpt_prompt(text, features)
        
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
        
        # Combine GPT results with the feature extraction
        result = {
            "success": True,
            "risk_score": gpt_data.get("risk_score", 0.5),
            "confidence": 0.9,  # GPT typically provides high-confidence assessments
            "domain_scores": gpt_data.get("domain_scores", {}),
            "recommendations": gpt_data.get("recommendations", []),
            "evidence": gpt_data.get("evidence", []),
            "features": features,
            "processing_time": datetime.now().isoformat(),
            "model_type": "gpt4o"
        }
        
        return result
    
    except Exception as e:
        logger.error(f"Error calculating cognitive risk with GPT-4o: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        } 