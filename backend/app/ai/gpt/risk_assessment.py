"""
GPT-4o based risk assessment for cognitive decline.

This module provides GPT-4o powered language analysis for cognitive decline detection.
It will be initialized and used when an OpenAI API key is provided.
"""

import logging
import os  # Keep for other potential uses, though API key is now via shared client
import json
from datetime import datetime
from typing import Dict, Any, List, Optional, Set

from app.models.analysis import CognitiveDomain
from app.ai.openai_init import get_openai_client  # Import the shared client getter

# Initialize logger
logger = logging.getLogger(__name__)

# Global OpenAI API client (now obtained via get_openai_client)
# openai_client = None  # Replaced by shared client logic

VALID_DOMAINS: Set[str] = {domain.value.upper() for domain in CognitiveDomain}


def initialize_gpt(api_key: str) -> bool:
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
                {
                    "role": "system",
                    "content": (
                        "You are a cognitive health assistant (GPT module test). "
                        "Reply very briefly to confirm connectivity."
                    ),
                },
                {"role": "user", "content": "Test call from GPT risk assessment module."},
            ],
            max_tokens=10,
            temperature=0.0,
        )
        logger.info("GPT module (risk_assessment): Successfully tested API connection via shared client.")
        return True
    except Exception as e:
        logger.error(f"GPT module (risk_assessment): Error testing API via shared client: {str(e)}")
        return False


def generate_gpt_prompt(text: str, include_features: bool = False) -> str:
    """
    Generate a refined, few-shot prompt for GPT-4o analysis.

    Args:
        text: Original text input
        include_features: Whether to include detailed linguistic features

    Returns:
        Formatted prompt for GPT-4o
    """
    # Note: This prompt is intended to be passed as the 'content' of a single user message,
    # paired with a system message that establishes the assistant's role.

    instructions = f"""
=== TASK DESCRIPTION ===
You are a cognitive linguistics expert specializing in detecting early signs of cognitive decline (MCI or early Alzheimer's) from natural language.

=== INPUT TEXT ===
\"\"\"{text}\"\"\"

=== REQUIRED ANALYSIS ===
1. Compute a **risk_score** between 0.0 and 1.0 (1.0 = highest risk).
2. Assign scores (0.0–1.0) for each cognitive domain:
   - LANGUAGE
   - MEMORY
   - EXECUTIVE_FUNCTION
   - ATTENTION
3. Provide specific **evidence** from the text (3–5 bullet points) supporting each domain score or overall risk.
4. Offer 3–5 **personalized recommendations** (e.g., lifestyle changes, cognitive exercises, medical referrals).
5. Provide a **confidence_score** (0.0–1.0) indicating how certain you are about your analysis.

"""

    if include_features:
        instructions += """
6. Extract detailed **linguistic_features**:
   - lexical_diversity: metrics such as vocabulary size, type–token ratio
   - syntactic_complexity: indicators like average sentence length, parse tree depth
   - semantic_coherence: measures of topic drift or cohesion (e.g., cosine similarity between sentences)
   - error_patterns: grammatical errors, neologisms, repetitions, pauses or hesitations
"""

    # Specify the exact JSON schema for the assistant's output
    schema = """
=== RESPONSE FORMAT (JSON ONLY) ===
Output must be valid JSON with the following structure (no extra keys):

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
        schema += """,
  "linguistic_features": {
    "lexical_diversity": {
      "vocabulary_size": int,
      "type_token_ratio": float
    },
    "syntactic_complexity": {
      "average_sentence_length": float,
      "parse_tree_depth": float
    },
    "semantic_coherence": {
      "average_sentence_similarity": float
    },
    "error_patterns": {
      "count": int,
      "types": [string, ...]
    }
  }"""

    schema += "\n}\n"

    # Provide a concise example to illustrate correct formatting
    example = """
=== EXAMPLE ===
Input Text:
\"\"\"I sometimes forget words mid-sentence and repeat myself a lot. Yesterday, I went to the store, but I forgot why I went there and had to ask my neighbor to remind me.\"\"\"

Example Output:
{
  "risk_score": 0.72,
  "domain_scores": {
    "LANGUAGE": 0.65,
    "MEMORY": 0.80,
    "EXECUTIVE_FUNCTION": 0.60,
    "ATTENTION": 0.55
  },
  "evidence": [
    "Forgets words mid-sentence and repeats phrases (LANGUAGE).",
    "Cannot recall reason for store visit without prompting (MEMORY).",
    "Shows some difficulty organizing thoughts in a coherent sequence (EXECUTIVE_FUNCTION).",
    "Appears easily distracted and loses train of thought (ATTENTION)."
  ],
  "recommendations": [
    "Schedule regular memory exercises (e.g., word recall games).",
    "Consult a neurologist for baseline cognitive testing.",
    "Maintain a daily journal to track forgetfulness patterns.",
    "Engage in moderate physical exercise to promote brain health."
  ],
  "confidence_score": 0.78
}
"""

    # Combine all parts into the final prompt string
    full_prompt = (
        instructions.strip()
        + "\n"
        + schema.strip()
        + "\n"
        + example.strip()
        + "\n\nPlease analyze the INPUT TEXT and respond strictly according to the JSON schema above."
    )

    return full_prompt


def validate_domain_scores(scores: Dict[str, float]) -> Dict[str, float]:
    """Validate and normalize domain scores."""
    validated = {}
    for domain in VALID_DOMAINS:
        score = scores.get(domain, 0.0)
        # Ensure score is within valid range
        try:
            fscore = float(score)
        except (ValueError, TypeError):
            fscore = 0.0
        validated[domain] = max(0.0, min(1.0, fscore))
    return validated


def parse_gpt_response(response: str) -> Optional[Dict[str, Any]]:
    """
    Parse the GPT-4o response into structured data.

    Args:
        response: Raw GPT-4o response

    Returns:
        Structured response data, or None on failure
    """
    try:
        # Extract JSON substring (in case there is extra text before/after)
        json_start = response.find("{")
        json_end = response.rfind("}") + 1

        if json_start >= 0 and json_end > json_start:
            json_str = response[json_start:json_end]
            data = json.loads(json_str)

            # Validate required fields
            required_fields = {"risk_score", "domain_scores", "evidence", "recommendations", "confidence_score"}
            if not required_fields.issubset(set(data.keys())):
                raise ValueError("Missing required fields in GPT response")

            # Validate domain_scores
            data["domain_scores"] = validate_domain_scores(data["domain_scores"])

            # If include_features was requested but missing, skip
            # (the calling function will handle absence)
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
                {
                    "role": "system",
                    "content": (
                        "You are a high-precision cognitive health assessment engine. "
                        "Follow the user's instructions exactly and emit only valid JSON."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=1500,
            temperature=0.2,
        )

        response_text = response.choices[0].message.content
        gpt_data = parse_gpt_response(response_text)

        if not gpt_data:
            return {
                "success": False,
                "error": "Failed to parse GPT-4o response"
            }

        result: Dict[str, Any] = {
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
