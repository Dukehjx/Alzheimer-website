"""
Language Feature Normalization and Scoring.

This module implements normalization and scoring functions for linguistic features
to ensure consistent evaluation across different text samples.
"""

import logging
import numpy as np
from typing import Dict, Any, List, Optional, Union, Tuple

# Initialize logger
logger = logging.getLogger(__name__)

# Default normalization parameters based on general population statistics
# These would ideally be derived from a large dataset of healthy controls
DEFAULT_NORMALIZATION_PARAMS = {
    "lexical_diversity": {
        "type_token_ratio": {"mean": 0.65, "std": 0.1, "min": 0.3, "max": 0.9},
        "hapax_legomena_ratio": {"mean": 0.5, "std": 0.1, "min": 0.2, "max": 0.8},
        "unique_lemma_ratio": {"mean": 0.7, "std": 0.1, "min": 0.4, "max": 0.95}
    },
    "syntactic_complexity": {
        "mean_sentence_length": {"mean": 15.0, "std": 5.0, "min": 5.0, "max": 30.0},
        "max_tree_depth": {"mean": 7.0, "std": 2.0, "min": 3.0, "max": 15.0},
        "mean_tree_depth": {"mean": 4.0, "std": 1.0, "min": 2.0, "max": 8.0},
        "mean_dependents_per_word": {"mean": 1.2, "std": 0.3, "min": 0.5, "max": 2.5},
        "clauses_per_sentence": {"mean": 1.8, "std": 0.6, "min": 1.0, "max": 4.0},
        "complex_sentence_ratio": {"mean": 0.5, "std": 0.15, "min": 0.1, "max": 0.9}
    },
    "hesitation_patterns": {
        "filler_ratio": {"mean": 0.02, "std": 0.01, "min": 0.0, "max": 0.1},
        "repetition_ratio": {"mean": 0.01, "std": 0.01, "min": 0.0, "max": 0.08},
        "revision_ratio": {"mean": 0.005, "std": 0.005, "min": 0.0, "max": 0.05},
        "hesitation_score": {"mean": 0.03, "std": 0.02, "min": 0.0, "max": 0.15}
    },
    "repetition_patterns": {
        "word_repetition_rate": {"mean": 0.02, "std": 0.015, "min": 0.0, "max": 0.1},
        "phrase_repetition_rate": {"mean": 0.01, "std": 0.01, "min": 0.0, "max": 0.08},
        "semantic_repetition_rate": {"mean": 0.03, "std": 0.02, "min": 0.0, "max": 0.15},
        "combined_repetition_score": {"mean": 0.02, "std": 0.015, "min": 0.0, "max": 0.12}
    }
}

# Feature polarity (whether higher values indicate better or worse cognitive function)
FEATURE_POLARITY = {
    "lexical_diversity": {
        "type_token_ratio": "higher_is_better",
        "hapax_legomena_ratio": "higher_is_better",
        "unique_lemma_ratio": "higher_is_better"
    },
    "syntactic_complexity": {
        "mean_sentence_length": "higher_is_better",
        "max_tree_depth": "higher_is_better",
        "mean_tree_depth": "higher_is_better",
        "mean_dependents_per_word": "higher_is_better",
        "clauses_per_sentence": "higher_is_better",
        "complex_sentence_ratio": "higher_is_better"
    },
    "hesitation_patterns": {
        "filler_ratio": "lower_is_better",
        "repetition_ratio": "lower_is_better",
        "revision_ratio": "lower_is_better",
        "hesitation_score": "lower_is_better"
    },
    "repetition_patterns": {
        "word_repetition_rate": "lower_is_better",
        "phrase_repetition_rate": "lower_is_better",
        "semantic_repetition_rate": "lower_is_better",
        "combined_repetition_score": "lower_is_better"
    }
}

def normalize_feature(
    value: float, 
    category: str, 
    feature: str, 
    normalization_params: Optional[Dict[str, Any]] = None
) -> float:
    """
    Normalize a feature value to a standardized scale.
    
    Args:
        value: The raw feature value
        category: The feature category (e.g., "lexical_diversity")
        feature: The specific feature name (e.g., "type_token_ratio")
        normalization_params: Optional custom normalization parameters
        
    Returns:
        Normalized feature value (0-1 scale)
    """
    if value is None:
        return 0.5  # Default to middle value for missing data
    
    # Use provided normalization parameters or defaults
    params = normalization_params or DEFAULT_NORMALIZATION_PARAMS
    
    try:
        # Get parameters for this feature
        feature_params = params.get(category, {}).get(feature, {})
        if not feature_params:
            logger.warning(f"No normalization parameters for {category}.{feature}")
            return 0.5
        
        # Min-max normalization to 0-1 range
        feature_min = feature_params.get("min", 0)
        feature_max = feature_params.get("max", 1)
        
        # Clamp value to min-max range
        clamped_value = max(feature_min, min(feature_max, value))
        
        # Normalize to 0-1 range
        normalized_value = (clamped_value - feature_min) / (feature_max - feature_min)
        
        # Adjust polarity so that higher values always indicate better cognitive function
        polarity = FEATURE_POLARITY.get(category, {}).get(feature, "higher_is_better")
        if polarity == "lower_is_better":
            normalized_value = 1.0 - normalized_value
        
        return normalized_value
    
    except Exception as e:
        logger.error(f"Error normalizing feature {category}.{feature}: {str(e)}")
        return 0.5

def normalize_features(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize all features in a feature dictionary.
    
    Args:
        features: Dictionary of extracted linguistic features
        
    Returns:
        Dictionary with normalized features added
    """
    normalized_features = {}
    
    # Process each feature category
    for category, category_features in features.items():
        if not isinstance(category_features, dict):
            # Skip non-dictionary items (metadata, etc.)
            normalized_features[category] = category_features
            continue
        
        normalized_category = {}
        for feature, value in category_features.items():
            if isinstance(value, (int, float)):
                # Normalize numerical features
                normalized_value = normalize_feature(value, category, feature)
                normalized_category[feature] = value  # Keep original value
                normalized_category[f"{feature}_normalized"] = normalized_value  # Add normalized value
            else:
                # Keep non-numerical values as is
                normalized_category[feature] = value
        
        normalized_features[category] = normalized_category
    
    return normalized_features

def calculate_cognitive_scores(normalized_features: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate cognitive domain scores from normalized features.
    
    Args:
        normalized_features: Dictionary of normalized linguistic features
        
    Returns:
        Dictionary of cognitive domain scores
    """
    # Define which normalized features contribute to each cognitive domain
    domain_feature_mapping = {
        "language_ability": [
            ("lexical_diversity", "type_token_ratio_normalized", 0.4),
            ("lexical_diversity", "hapax_legomena_ratio_normalized", 0.3),
            ("lexical_diversity", "unique_lemma_ratio_normalized", 0.3)
        ],
        "executive_function": [
            ("syntactic_complexity", "complex_sentence_ratio_normalized", 0.3),
            ("syntactic_complexity", "mean_tree_depth_normalized", 0.3),
            ("syntactic_complexity", "clauses_per_sentence_normalized", 0.4)
        ],
        "attention": [
            ("hesitation_patterns", "hesitation_score_normalized", 0.5),
            ("hesitation_patterns", "revision_ratio_normalized", 0.5)
        ],
        "memory": [
            ("repetition_patterns", "word_repetition_rate_normalized", 0.3),
            ("repetition_patterns", "phrase_repetition_rate_normalized", 0.3),
            ("repetition_patterns", "combined_repetition_score_normalized", 0.4)
        ]
    }
    
    # Calculate scores for each domain
    domain_scores = {}
    
    for domain, features_list in domain_feature_mapping.items():
        domain_score = 0.0
        total_weight = 0.0
        
        for category, feature, weight in features_list:
            # Get the normalized feature value, defaulting to 0.5 if not found
            feature_value = normalized_features.get(category, {}).get(feature, 0.5)
            domain_score += feature_value * weight
            total_weight += weight
        
        # Normalize by total weight
        if total_weight > 0:
            domain_scores[domain] = domain_score / total_weight
        else:
            domain_scores[domain] = 0.5
    
    # Calculate overall cognitive score (average of domain scores)
    domain_scores["overall_cognitive"] = sum(domain_scores.values()) / len(domain_scores)
    
    return domain_scores

def normalize_and_score_features(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize features and calculate cognitive scores.
    
    Args:
        features: Dictionary of extracted linguistic features
        
    Returns:
        Dictionary containing both normalized features and cognitive scores
    """
    if not features:
        return {
            "normalized_features": {},
            "cognitive_scores": {
                "language_ability": 0.5,
                "executive_function": 0.5,
                "attention": 0.5,
                "memory": 0.5,
                "overall_cognitive": 0.5
            }
        }
    
    try:
        # Normalize features
        normalized_features = normalize_features(features)
        
        # Calculate cognitive scores
        cognitive_scores = calculate_cognitive_scores(normalized_features)
        
        return {
            "normalized_features": normalized_features,
            "cognitive_scores": cognitive_scores
        }
    
    except Exception as e:
        logger.error(f"Error in feature normalization and scoring: {str(e)}", exc_info=True)
        return {
            "error": f"Normalization failed: {str(e)}",
            "normalized_features": {},
            "cognitive_scores": {}
        } 