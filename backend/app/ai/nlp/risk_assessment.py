"""
Risk assessment and cognitive scoring module.

This module provides functions for scoring cognitive decline risk 
based on linguistic features extracted from text.
"""

import logging
import os
import json
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from app.ai.nlp.feature_extraction import extract_linguistic_features
from app.models.analysis import CognitiveDomain

# Initialize logger
logger = logging.getLogger(__name__)

# Risk model configuration
@dataclass
class ModelConfig:
    """Configuration for risk assessment model."""
    # Feature weights based on literature
    feature_weights: Dict[str, float] = None
    
    # Baseline thresholds for each metric
    thresholds: Dict[str, Dict[str, float]] = None
    
    # Domain mappings for various features
    domain_mappings: Dict[str, List[str]] = None
    
    # Weights for different cognitive domains in overall score
    domain_weights: Dict[CognitiveDomain, float] = None
    
    def __post_init__(self):
        """Initialize with default values if none provided."""
        if self.feature_weights is None:
            self.feature_weights = {
                "lexical_diversity.type_token_ratio": 0.15,
                "lexical_diversity.hapax_legomena_ratio": 0.10,
                "syntactic_complexity.mean_sentence_length": 0.10,
                "syntactic_complexity.max_tree_depth": 0.10,
                "syntactic_complexity.complex_sentence_ratio": 0.15,
                "hesitation_patterns.hesitation_score": 0.15,
                "repetition_patterns.combined_repetition_score": 0.15,
                "repetition_patterns.word_repetition_rate": 0.10
            }
        
        if self.thresholds is None:
            self.thresholds = {
                "lexical_diversity": {
                    "type_token_ratio": 0.5,  # Lower values indicate potential issues
                    "hapax_legomena_ratio": 0.3
                },
                "syntactic_complexity": {
                    "mean_sentence_length": 8.0,  # Lower values indicate potential issues
                    "max_tree_depth": 5.0,
                    "complex_sentence_ratio": 0.4
                },
                "hesitation_patterns": {
                    "hesitation_score": 0.2  # Higher values indicate potential issues
                },
                "repetition_patterns": {
                    "combined_repetition_score": 0.3,  # Higher values indicate potential issues
                    "word_repetition_rate": 0.4
                }
            }
        
        if self.domain_mappings is None:
            self.domain_mappings = {
                CognitiveDomain.LANGUAGE: [
                    "lexical_diversity.type_token_ratio",
                    "lexical_diversity.hapax_legomena_ratio",
                    "syntactic_complexity.complex_sentence_ratio"
                ],
                CognitiveDomain.MEMORY: [
                    "repetition_patterns.word_repetition_rate",
                    "repetition_patterns.combined_repetition_score"
                ],
                CognitiveDomain.EXECUTIVE_FUNCTION: [
                    "syntactic_complexity.mean_sentence_length",
                    "syntactic_complexity.max_tree_depth"
                ],
                CognitiveDomain.ATTENTION: [
                    "hesitation_patterns.hesitation_score",
                    "hesitation_patterns.revision_ratio"
                ]
            }
            
        if self.domain_weights is None:
            self.domain_weights = {
                CognitiveDomain.LANGUAGE: 1.0,
                CognitiveDomain.MEMORY: 1.0,
                CognitiveDomain.EXECUTIVE_FUNCTION: 1.0,
                CognitiveDomain.ATTENTION: 1.0
            }

# Initialize with default configuration
model_config = ModelConfig()

def get_feature_value(features: Dict[str, Any], feature_path: str) -> float:
    """
    Get a feature value from a nested dictionary using a dot-separated path.
    
    Args:
        features: Dictionary of features
        feature_path: Dot-separated path to the feature (e.g., "lexical_diversity.type_token_ratio")
        
    Returns:
        Feature value or 0.0 if not found
    """
    parts = feature_path.split('.')
    current = features
    
    try:
        for part in parts:
            current = current[part]
        return float(current)
    except (KeyError, TypeError, ValueError):
        logger.warning(f"Feature {feature_path} not found in features")
        return 0.0

def normalize_score(value: float, is_higher_better: bool, threshold: float) -> float:
    """
    Normalize a score to 0-1 range where 1 always indicates higher risk.
    
    Args:
        value: The raw feature value
        is_higher_better: Whether higher values indicate better cognitive function
        threshold: The threshold value for this feature
        
    Returns:
        Normalized score where higher values indicate higher risk
    """
    if value is None:
        return 0.5  # Default to medium risk if value is missing
    
    # For metrics where higher values are better (like lexical diversity)
    if is_higher_better:
        # Lower values indicate higher risk
        # 1.0 if value is 0, 0.0 if value is >= 2*threshold
        if value >= 2 * threshold:
            return 0.0
        elif value <= 0:
            return 1.0
        else:
            # Linear mapping from [0, 2*threshold] to [1.0, 0.0]
            return max(0.0, min(1.0, 1.0 - (value / (2 * threshold))))
    
    # For metrics where lower values are better (like hesitation)
    else:
        # Higher values indicate higher risk
        # 0.0 if value is 0, 1.0 if value is >= 2*threshold
        if value <= 0:
            return 0.0
        elif value >= 2 * threshold:
            return 1.0
        else:
            # Linear mapping from [0, 2*threshold] to [0.0, 1.0]
            return max(0.0, min(1.0, value / (2 * threshold)))

def calculate_domain_scores(features: Dict[str, Any]) -> Dict[CognitiveDomain, float]:
    """
    Calculate scores for each cognitive domain.
    
    Args:
        features: Dictionary of linguistic features
        
    Returns:
        Dictionary of domain scores
    """
    domain_scores = {}
    
    for domain, feature_paths in model_config.domain_mappings.items():
        if not feature_paths:
            continue
        
        domain_score = 0.0
        valid_features = 0
        
        for feature_path in feature_paths:
            # Get feature category and name
            parts = feature_path.split('.')
            if len(parts) >= 2:
                category, name = parts[0], parts[1]
                
                # Get feature value
                value = get_feature_value(features, feature_path)
                
                # Determine if higher values are better based on the category
                is_higher_better = category not in ["hesitation_patterns", "repetition_patterns"]
                
                # Get threshold for this feature
                threshold = model_config.thresholds.get(category, {}).get(name, 0.5)
                
                # Normalize to risk score (higher = more risk)
                risk_score = normalize_score(value, is_higher_better, threshold)
                
                # Get weight for this feature
                weight = model_config.feature_weights.get(feature_path, 1.0 / len(feature_paths))
                
                # Add to domain score
                domain_score += risk_score * weight
                valid_features += 1
        
        # Average the domain score if we have valid features
        if valid_features > 0:
            domain_scores[domain] = domain_score / valid_features
        else:
            domain_scores[domain] = 0.5  # Default to medium risk
    
    return domain_scores

def calculate_confidence_score(features: Dict[str, Any]) -> float:
    """
    Calculate confidence in the risk assessment.
    
    Args:
        features: Dictionary of linguistic features
        
    Returns:
        Confidence score (0-1)
    """
    # A simplistic confidence model based on text length and completeness of features
    
    # Text length factor - more text = more confidence
    text_length = features.get("preprocessing_metadata", {}).get("processed_length", 0)
    length_factor = min(1.0, text_length / 500)  # Max confidence at 500+ chars
    
    # Feature completeness factor
    expected_features = set(model_config.feature_weights.keys())
    available_features = 0
    
    for feature_path in expected_features:
        parts = feature_path.split('.')
        if len(parts) >= 2:
            category, name = parts[0], '.'.join(parts[1:])
            if category in features and name in features[category]:
                available_features += 1
    
    completeness_factor = available_features / len(expected_features) if expected_features else 0.5
    
    # Combine factors
    confidence = (length_factor * 0.7) + (completeness_factor * 0.3)
    return confidence

def generate_recommendations(domain_scores: Dict[CognitiveDomain, float], 
                             risk_score: float) -> List[str]:
    """
    Generate personalized recommendations based on risk assessment.
    
    Args:
        domain_scores: Dictionary of domain-specific risk scores
        risk_score: Overall risk score
        
    Returns:
        List of recommendations
    """
    recommendations = []
    
    # Add general recommendation based on overall risk
    if risk_score < 0.3:
        recommendations.append(
            "Your language patterns appear typical. Continue regular cognitive exercises.")
    elif risk_score < 0.6:
        recommendations.append(
            "Some mild indicators of cognitive changes detected. Regular cognitive training may be beneficial.")
    else:
        recommendations.append(
            "Multiple indicators of cognitive changes detected. Consider consulting with a healthcare professional.")
    
    # Add domain-specific recommendations
    for domain, score in domain_scores.items():
        if domain == CognitiveDomain.LANGUAGE and score > 0.5:
            recommendations.append(
                "Consider vocabulary building exercises to enhance language skills.")
        
        elif domain == CognitiveDomain.MEMORY and score > 0.5:
            recommendations.append(
                "Memory exercises focusing on word recall may help improve cognitive function.")
        
        elif domain == CognitiveDomain.EXECUTIVE_FUNCTION and score > 0.5:
            recommendations.append(
                "Activities that involve planning and organizing complex information may be beneficial.")
        
        elif domain == CognitiveDomain.ATTENTION and score > 0.5:
            recommendations.append(
                "Attention-focusing exercises could help improve concentration and reduce hesitations.")
    
    # Add follow-up recommendation based on risk
    if risk_score > 0.7:
        recommendations.append("Schedule a follow-up assessment in 1 month.")
    elif risk_score > 0.4:
        recommendations.append("Schedule a follow-up assessment in 3 months.")
    else:
        recommendations.append("Schedule a routine follow-up in 6 months.")
    
    return recommendations

def prepare_for_gpt_integration(
    text: str,
    features: Dict[str, Any], 
    domain_scores: Dict[CognitiveDomain, float],
    overall_score: float
) -> Dict[str, Any]:
    """
    Prepare data for integration with GPT models.
    
    Creates a structured representation of the analysis results
    that can be used as context for GPT prompts.
    
    Args:
        text: The original analyzed text
        features: Extracted linguistic features
        domain_scores: Calculated domain-specific scores
        overall_score: The overall cognitive risk score
        
    Returns:
        Dict with formatted data for GPT integration
    """
    return {
        "text_summary": {
            "original_text": text[:500] + ("..." if len(text) > 500 else ""),
            "word_count": features.get("lexical_diversity", {}).get("word_count", 0),
            "sentence_count": features.get("syntactic_complexity", {}).get("sentence_count", 0)
        },
        "linguistic_markers": {
            "lexical_diversity_score": features.get("lexical_diversity", {}).get("ttr", 0),
            "syntactic_complexity": features.get("syntactic_complexity", {}).get("mean_sentence_length", 0),
            "hesitation_rate": features.get("hesitation_patterns", {}).get("hesitation_ratio", 0),
            "repetition_score": features.get("repetition_patterns", {}).get("repetition_score", 0)
        },
        "cognitive_assessment": {
            "overall_score": overall_score,
            "domain_scores": {k.name: v for k, v in domain_scores.items()},
            "interpretation": get_score_interpretation(overall_score)
        }
    }

def get_score_interpretation(score: float) -> str:
    """
    Get a text interpretation of a cognitive risk score.
    
    Args:
        score: The cognitive risk score (0.0-1.0)
        
    Returns:
        A string interpretation of the score
    """
    if score < 0.2:
        return "No significant cognitive concerns detected."
    elif score < 0.4:
        return "Mild indicators that may warrant monitoring but are within normal range."
    elif score < 0.6:
        return "Moderate indicators that suggest potential early cognitive changes."
    elif score < 0.8:
        return "Significant indicators that may suggest mild cognitive impairment."
    else:
        return "Strong indicators suggesting possible cognitive decline warranting clinical assessment."

def calculate_cognitive_risk(
    text: str, 
    config: Optional[ModelConfig] = None,
    include_features: bool = False
) -> Dict[str, Any]:
    """
    Calculate cognitive risk scores based on linguistic features extracted from text.
    
    Args:
        text: The text to analyze for cognitive risk markers
        config: Optional configuration for the risk model
        include_features: Whether to include detailed linguistic features in response
        
    Returns:
        Dict containing overall score, domain scores, confidence score, and recommendations
    """
    logger.info(f"Calculating cognitive risk for text: {text[:50]}...")
    
    if not config:
        config = ModelConfig()
        
    try:
        # Extract linguistic features from the text
        features = extract_linguistic_features(text)
        
        if not features:
            logger.error("Feature extraction failed")
            return {
                "success": False,
                "error": "Feature extraction failed"
            }
            
        # Calculate domain-specific scores
        domain_scores = calculate_domain_scores(features)
        
        # Calculate overall cognitive risk score (weighted average of domain scores)
        overall_score = sum(
            score * config.domain_weights.get(domain, 1.0) 
            for domain, score in domain_scores.items()
        ) / sum(config.domain_weights.get(domain, 1.0) for domain in domain_scores)
        
        # Round the overall score to 2 decimal places
        overall_score = round(overall_score, 2)
        
        # Calculate confidence in the assessment
        confidence_score = calculate_confidence_score(features)
        
        # Generate recommendations based on the scores
        recommendations = generate_recommendations(domain_scores, overall_score)
        
        # Prepare GPT integration data if needed
        gpt_data = prepare_for_gpt_integration(text, features, domain_scores, overall_score)
        
        result = {
            "success": True,
            "overall_score": overall_score,
            "domain_scores": domain_scores,
            "confidence_score": confidence_score,
            "recommendations": recommendations,
            "gpt_data": gpt_data
        }
        
        # Include detailed features if requested
        if include_features:
            result["features"] = features
            
        return result
        
    except Exception as e:
        logger.error(f"Error calculating cognitive risk: {str(e)}")
        logger.exception(e)
        return {
            "success": False,
            "error": f"Error in risk calculation: {str(e)}"
        } 