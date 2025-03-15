"""
Risk Scorer Module

This module calculates cognitive risk scores based on linguistic features
extracted from speech or text samples.
"""

import logging
import statistics
from typing import Dict, List, Any, Optional, Tuple
import json
import os
from pathlib import Path

import numpy as np
from pydantic import BaseModel, Field

from .nlp_analyzer import LinguisticFeatures

# Configure logging
logger = logging.getLogger(__name__)


class RiskCategory(BaseModel):
    """Model for a risk category with name, score, and description."""
    name: str = Field(..., description="Name of the risk category")
    score: float = Field(..., description="Score in this category (0-1)")
    description: str = Field(..., description="Description of what this category measures")
    contributing_factors: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Factors contributing to this risk score"
    )


class RiskAssessment(BaseModel):
    """Model for overall risk assessment results."""
    overall_risk_score: float = Field(..., description="Overall risk score (0-1)")
    risk_level: str = Field(..., description="Risk level (low, moderate, high)")
    categories: List[RiskCategory] = Field(
        default_factory=list,
        description="Detailed risk breakdown by categories"
    )
    recommendations: List[str] = Field(
        default_factory=list,
        description="Recommendations based on risk assessment"
    )
    explanation: str = Field("", description="Plain language explanation of the results")


class RiskScorer:
    """
    Cognitive risk scoring based on linguistic features.
    
    This class provides methods to assess cognitive risk from linguistic features
    extracted from speech or text, producing a detailed risk assessment.
    """
    
    def __init__(self, model_weights_path: Optional[str] = None):
        """
        Initialize the risk scorer.
        
        Args:
            model_weights_path: Optional path to model weights JSON file
        """
        # Define default feature weights for risk calculation
        # These would ideally come from a trained model, but we use reasonable defaults here
        self.feature_weights = self._load_model_weights(model_weights_path)
        
        # Define thresholds for risk levels
        self.risk_thresholds = {
            "low": 0.3,       # 0.0-0.3: Low risk
            "moderate": 0.6,  # 0.3-0.6: Moderate risk
            "high": 1.0       # 0.6-1.0: High risk
        }
        
        logger.info("RiskScorer initialized with default weights and thresholds")
    
    def _load_model_weights(self, model_path: Optional[str]) -> Dict[str, Dict[str, float]]:
        """
        Load model weights from a file or use defaults.
        
        Args:
            model_path: Path to a JSON file with model weights
            
        Returns:
            Dictionary of feature weights by category
        """
        # Default feature weights (if no model file provided)
        default_weights = {
            "lexical_diversity": {
                "vocabulary_size": -0.20,         # Higher is better (negative weight)
                "type_token_ratio": -0.25,        # Higher is better
                "hapax_legomena_ratio": -0.10     # Higher is better
            },
            "syntactic_complexity": {
                "avg_sentence_length": -0.10,     # Higher is better, to a point
                "avg_word_length": -0.05,         # Higher is better, to a point
                "avg_tree_depth": -0.10,          # Higher is better
                "readability_score": 0.05         # Higher score means harder to read (could be negative)
            },
            "fluency": {
                "hesitation_ratio": 0.30,         # Higher is worse
                "repetition_ratio": 0.25,         # Higher is worse
                "coherence_score": -0.25          # Higher is better
            },
            "pos_distribution": {
                "noun_ratio": -0.10,              # Higher noun ratio is better
                "verb_ratio": -0.05,              # Some balance is good
                "adjective_ratio": -0.05,         # Some balance is good
                "adverb_ratio": 0.00,             # Neutral
                "pronoun_ratio": 0.15             # Too many pronouns can indicate issues
            },
            "additional_metrics": {
                "word_frequency_score": 0.15,     # Higher means more common words (could be concerning)
                "sentence_complexity_variance": -0.10,  # Some variance is good
                "meta_linguistic_errors": 0.15     # Higher is worse
            }
        }
        
        if not model_path:
            return default_weights
        
        try:
            model_path = Path(model_path)
            if model_path.exists():
                with open(model_path, 'r') as f:
                    weights = json.load(f)
                logger.info(f"Loaded model weights from {model_path}")
                return weights
            else:
                logger.warning(f"Model weights file not found at {model_path}, using defaults")
                return default_weights
        except Exception as e:
            logger.error(f"Error loading model weights: {e}, using defaults")
            return default_weights
    
    def calculate_risk(self, features: LinguisticFeatures) -> RiskAssessment:
        """
        Calculate cognitive risk assessment based on linguistic features.
        
        Args:
            features: LinguisticFeatures object with extracted metrics
            
        Returns:
            RiskAssessment object with overall score and breakdown
        """
        try:
            # Calculate risk scores by category
            lexical_score = self._calculate_lexical_diversity_risk(features)
            syntactic_score = self._calculate_syntactic_complexity_risk(features)
            fluency_score = self._calculate_fluency_risk(features)
            pos_score = self._calculate_pos_distribution_risk(features)
            additional_score = self._calculate_additional_metrics_risk(features)
            
            # Combine category scores into overall risk score
            # These category weights determine how much each area contributes to overall risk
            category_weights = {
                "lexical_diversity": 0.25,
                "syntactic_complexity": 0.20,
                "fluency": 0.30,
                "pos_distribution": 0.10,
                "additional_metrics": 0.15
            }
            
            # Calculate weighted average for overall risk
            overall_risk = (
                lexical_score.score * category_weights["lexical_diversity"] +
                syntactic_score.score * category_weights["syntactic_complexity"] +
                fluency_score.score * category_weights["fluency"] +
                pos_score.score * category_weights["pos_distribution"] +
                additional_score.score * category_weights["additional_metrics"]
            )
            
            # Ensure risk is between 0 and 1
            overall_risk = max(0.0, min(1.0, overall_risk))
            
            # Determine risk level
            risk_level = "low"
            if overall_risk > self.risk_thresholds["moderate"]:
                risk_level = "high"
            elif overall_risk > self.risk_thresholds["low"]:
                risk_level = "moderate"
            
            # Create risk assessment
            risk_assessment = RiskAssessment(
                overall_risk_score=overall_risk,
                risk_level=risk_level,
                categories=[
                    lexical_score,
                    syntactic_score,
                    fluency_score,
                    pos_score,
                    additional_score
                ],
                recommendations=self._generate_recommendations(
                    overall_risk, [lexical_score, syntactic_score, fluency_score, pos_score, additional_score]
                ),
                explanation=self._generate_explanation(
                    overall_risk, risk_level, [lexical_score, syntactic_score, fluency_score, pos_score, additional_score]
                )
            )
            
            logger.info(f"Risk assessment complete: {risk_level} risk (score: {overall_risk:.2f})")
            return risk_assessment
            
        except Exception as e:
            logger.exception(f"Error calculating risk: {e}")
            # Return a safe default in case of errors
            return RiskAssessment(
                overall_risk_score=0.0,
                risk_level="unknown",
                explanation="Error calculating risk assessment. Please try again."
            )
    
    def _calculate_lexical_diversity_risk(self, features: LinguisticFeatures) -> RiskCategory:
        """
        Calculate risk based on lexical diversity metrics.
        
        Args:
            features: LinguisticFeatures object
            
        Returns:
            RiskCategory for lexical diversity
        """
        weights = self.feature_weights["lexical_diversity"]
        
        # Note: For negative weights, lower values of feature = higher risk score
        # For positive weights, higher values of feature = higher risk score
        contributing_factors = []
        
        # Normalize vocabulary size (0-1 scale where 0 is highest risk)
        # A typical healthy person might have ~200 unique words in a short sample
        vocab_risk = max(0, min(1, 1 - (features.vocabulary_size / 200)))
        contributing_factors.append({
            "name": "Vocabulary Size",
            "value": features.vocabulary_size,
            "impact": vocab_risk * weights["vocabulary_size"],
            "description": f"{'Limited' if vocab_risk > 0.5 else 'Normal'} vocabulary size"
        })
        
        # Type-token ratio (measure of lexical diversity)
        # Healthy range is typically 0.45-0.55 for short samples
        ttr_risk = 1 - min(1, features.type_token_ratio / 0.5)
        contributing_factors.append({
            "name": "Vocabulary Diversity",
            "value": features.type_token_ratio,
            "impact": ttr_risk * weights["type_token_ratio"],
            "description": f"{'Limited' if ttr_risk > 0.5 else 'Normal'} word variety"
        })
        
        # Hapax legomena ratio (words used only once)
        # Healthy range is typically 0.4-0.6 for short samples
        hapax_risk = 1 - min(1, features.hapax_legomena_ratio / 0.5)
        contributing_factors.append({
            "name": "Unique Word Usage",
            "value": features.hapax_legomena_ratio,
            "impact": hapax_risk * weights["hapax_legomena_ratio"],
            "description": f"{'Limited' if hapax_risk > 0.5 else 'Normal'} use of unique words"
        })
        
        # Calculate weighted risk score
        risk_score = (
            vocab_risk * weights["vocabulary_size"] +
            ttr_risk * weights["type_token_ratio"] +
            hapax_risk * weights["hapax_legomena_ratio"]
        )
        
        # Convert to 0-1 scale (adjusting for negative weights)
        # Sum of absolute weights
        weight_sum = sum(abs(w) for w in weights.values())
        # Normalize by dividing by sum of absolute weights and shifting to 0-1 scale
        normalized_score = 0.5 - (risk_score / weight_sum)
        
        # Ensure score is between 0 and 1
        normalized_score = max(0.0, min(1.0, normalized_score))
        
        return RiskCategory(
            name="Lexical Diversity",
            score=normalized_score,
            description="Measures vocabulary richness and word usage variety",
            contributing_factors=contributing_factors
        )
    
    def _calculate_syntactic_complexity_risk(self, features: LinguisticFeatures) -> RiskCategory:
        """
        Calculate risk based on syntactic complexity metrics.
        
        Args:
            features: LinguisticFeatures object
            
        Returns:
            RiskCategory for syntactic complexity
        """
        weights = self.feature_weights["syntactic_complexity"]
        contributing_factors = []
        
        # Sentence length (typically 10-20 words is normal)
        sent_len_risk = 0.0
        if features.avg_sentence_length < 5:
            sent_len_risk = 1.0  # Very short sentences
        elif features.avg_sentence_length < 10:
            sent_len_risk = 0.5  # Somewhat short sentences
        elif features.avg_sentence_length > 30:
            sent_len_risk = 0.3  # Very long sentences can also indicate issues
        
        contributing_factors.append({
            "name": "Sentence Length",
            "value": features.avg_sentence_length,
            "impact": sent_len_risk * weights["avg_sentence_length"],
            "description": (
                "Very short sentences" if features.avg_sentence_length < 5 else
                "Somewhat short sentences" if features.avg_sentence_length < 10 else
                "Very long sentences" if features.avg_sentence_length > 30 else
                "Normal sentence length"
            )
        })
        
        # Word length (typically 4-5 characters is normal)
        word_len_risk = 0.0
        if features.avg_word_length < 3:
            word_len_risk = 0.7  # Very short words
        elif features.avg_word_length < 4:
            word_len_risk = 0.3  # Somewhat short words
        
        contributing_factors.append({
            "name": "Word Length",
            "value": features.avg_word_length,
            "impact": word_len_risk * weights["avg_word_length"],
            "description": (
                "Very simple, short words" if features.avg_word_length < 3 else
                "Somewhat simple words" if features.avg_word_length < 4 else
                "Normal word complexity"
            )
        })
        
        # Parse tree depth (typically 3-7 is normal)
        tree_depth_risk = 0.0
        if features.avg_tree_depth < 2:
            tree_depth_risk = 1.0  # Very simple structure
        elif features.avg_tree_depth < 3:
            tree_depth_risk = 0.5  # Somewhat simple structure
        
        contributing_factors.append({
            "name": "Sentence Structure",
            "value": features.avg_tree_depth,
            "impact": tree_depth_risk * weights["avg_tree_depth"],
            "description": (
                "Very simple sentence structure" if features.avg_tree_depth < 2 else
                "Somewhat simple sentence structure" if features.avg_tree_depth < 3 else
                "Normal sentence complexity"
            )
        })
        
        # Readability (grade level 8-12 is typical for adults)
        readability_risk = 0.0
        if features.readability_score < 6:
            readability_risk = 0.7  # Very simple text
        elif features.readability_score < 8:
            readability_risk = 0.3  # Somewhat simple text
        
        contributing_factors.append({
            "name": "Text Readability",
            "value": features.readability_score,
            "impact": readability_risk * weights["readability_score"],
            "description": (
                "Elementary-level language" if features.readability_score < 6 else
                "Simple language" if features.readability_score < 8 else
                "Age-appropriate language complexity"
            )
        })
        
        # Calculate weighted risk score
        risk_score = (
            sent_len_risk * weights["avg_sentence_length"] +
            word_len_risk * weights["avg_word_length"] +
            tree_depth_risk * weights["avg_tree_depth"] +
            readability_risk * weights["readability_score"]
        )
        
        # Normalize
        weight_sum = sum(abs(w) for w in weights.values())
        normalized_score = 0.5 - (risk_score / weight_sum)
        normalized_score = max(0.0, min(1.0, normalized_score))
        
        return RiskCategory(
            name="Syntactic Complexity",
            score=normalized_score,
            description="Measures complexity of sentence structure and language",
            contributing_factors=contributing_factors
        )
    
    def _calculate_fluency_risk(self, features: LinguisticFeatures) -> RiskCategory:
        """
        Calculate risk based on fluency and coherence metrics.
        
        Args:
            features: LinguisticFeatures object
            
        Returns:
            RiskCategory for fluency
        """
        weights = self.feature_weights["fluency"]
        contributing_factors = []
        
        # Hesitation markers (ums, ahs, etc.)
        hesitation_risk = min(1.0, features.hesitation_ratio * 10)  # Scale up, cap at 1.0
        
        contributing_factors.append({
            "name": "Speech Hesitations",
            "value": features.hesitation_ratio,
            "impact": hesitation_risk * weights["hesitation_ratio"],
            "description": (
                "Frequent hesitations and fillers" if hesitation_risk > 0.6 else
                "Some hesitations" if hesitation_risk > 0.3 else
                "Few hesitations"
            )
        })
        
        # Word repetitions
        repetition_risk = min(1.0, features.repetition_ratio * 5)  # Scale up, cap at 1.0
        
        contributing_factors.append({
            "name": "Word Repetitions",
            "value": features.repetition_ratio,
            "impact": repetition_risk * weights["repetition_ratio"],
            "description": (
                "Frequent word repetitions" if repetition_risk > 0.6 else
                "Some word repetitions" if repetition_risk > 0.3 else
                "Few word repetitions"
            )
        })
        
        # Coherence (inverse - higher coherence score is better)
        coherence_risk = 1.0 - features.coherence_score
        
        contributing_factors.append({
            "name": "Text Coherence",
            "value": features.coherence_score,
            "impact": coherence_risk * weights["coherence_score"],
            "description": (
                "Poor text coherence" if coherence_risk > 0.6 else
                "Some coherence issues" if coherence_risk > 0.3 else
                "Good text coherence"
            )
        })
        
        # Calculate weighted risk score
        risk_score = (
            hesitation_risk * weights["hesitation_ratio"] +
            repetition_risk * weights["repetition_ratio"] +
            coherence_risk * weights["coherence_score"]
        )
        
        # Normalize
        weight_sum = sum(abs(w) for w in weights.values())
        normalized_score = 0.5 - (risk_score / weight_sum)
        normalized_score = max(0.0, min(1.0, normalized_score))
        
        return RiskCategory(
            name="Fluency & Coherence",
            score=normalized_score,
            description="Measures speech fluency and text coherence",
            contributing_factors=contributing_factors
        )
    
    def _calculate_pos_distribution_risk(self, features: LinguisticFeatures) -> RiskCategory:
        """
        Calculate risk based on parts-of-speech distribution.
        
        Args:
            features: LinguisticFeatures object
            
        Returns:
            RiskCategory for POS distribution
        """
        weights = self.feature_weights["pos_distribution"]
        contributing_factors = []
        
        # Noun ratio (typically 25-35% for healthy adults)
        noun_risk = 0.0
        if features.noun_ratio < 0.20:
            noun_risk = 0.8  # Very low noun usage
        elif features.noun_ratio < 0.25:
            noun_risk = 0.4  # Somewhat low noun usage
        
        contributing_factors.append({
            "name": "Noun Usage",
            "value": features.noun_ratio,
            "impact": noun_risk * weights["noun_ratio"],
            "description": (
                "Very low noun usage" if features.noun_ratio < 0.20 else
                "Somewhat low noun usage" if features.noun_ratio < 0.25 else
                "Normal noun usage"
            )
        })
        
        # Verb ratio (typically 15-25% for healthy adults)
        verb_risk = 0.0
        if features.verb_ratio < 0.12:
            verb_risk = 0.7  # Very low verb usage
        elif features.verb_ratio < 0.15:
            verb_risk = 0.3  # Somewhat low verb usage
        
        contributing_factors.append({
            "name": "Verb Usage",
            "value": features.verb_ratio,
            "impact": verb_risk * weights["verb_ratio"],
            "description": (
                "Very low verb usage" if features.verb_ratio < 0.12 else
                "Somewhat low verb usage" if features.verb_ratio < 0.15 else
                "Normal verb usage"
            )
        })
        
        # Pronoun ratio (high pronoun use can indicate issues with specific nouns)
        pronoun_risk = 0.0
        if features.pronoun_ratio > 0.20:
            pronoun_risk = 0.8  # Very high pronoun usage
        elif features.pronoun_ratio > 0.15:
            pronoun_risk = 0.4  # Somewhat high pronoun usage
        
        contributing_factors.append({
            "name": "Pronoun Usage",
            "value": features.pronoun_ratio,
            "impact": pronoun_risk * weights["pronoun_ratio"],
            "description": (
                "Very high pronoun usage" if features.pronoun_ratio > 0.20 else
                "Somewhat high pronoun usage" if features.pronoun_ratio > 0.15 else
                "Normal pronoun usage"
            )
        })
        
        # Calculate weighted risk score
        risk_score = (
            noun_risk * weights["noun_ratio"] +
            verb_risk * weights["verb_ratio"] +
            pronoun_risk * weights["pronoun_ratio"]
        )
        
        # Normalize
        weight_sum = sum(abs(w) for w in [weights["noun_ratio"], weights["verb_ratio"], weights["pronoun_ratio"]])
        normalized_score = 0.5 - (risk_score / weight_sum)
        normalized_score = max(0.0, min(1.0, normalized_score))
        
        return RiskCategory(
            name="Word Usage Patterns",
            score=normalized_score,
            description="Measures patterns in types of words used",
            contributing_factors=contributing_factors
        )
    
    def _calculate_additional_metrics_risk(self, features: LinguisticFeatures) -> RiskCategory:
        """
        Calculate risk based on additional linguistic metrics.
        
        Args:
            features: LinguisticFeatures object
            
        Returns:
            RiskCategory for additional metrics
        """
        weights = self.feature_weights["additional_metrics"]
        contributing_factors = []
        
        # Word frequency (high = more common words, potential vocabulary limitation)
        # Scale is 0-1 where higher values indicate more common/frequent words
        freq_risk = min(1.0, features.word_frequency_score * 2.0)  # Scale up, cap at 1.0
        
        contributing_factors.append({
            "name": "Word Commonality",
            "value": features.word_frequency_score,
            "impact": freq_risk * weights["word_frequency_score"],
            "description": (
                "Mostly common, simple words" if freq_risk > 0.7 else
                "Somewhat limited vocabulary" if freq_risk > 0.4 else
                "Good mix of common and specific words"
            )
        })
        
        # Sentence complexity variance (some variance is healthy)
        variance_risk = 0.0
        if features.sentence_complexity_variance < 1.0:
            variance_risk = 0.8  # Very monotonous sentences
        elif features.sentence_complexity_variance < 3.0:
            variance_risk = 0.4  # Somewhat monotonous sentences
        
        contributing_factors.append({
            "name": "Sentence Variety",
            "value": features.sentence_complexity_variance,
            "impact": variance_risk * weights["sentence_complexity_variance"],
            "description": (
                "Very monotonous sentence structure" if variance_risk > 0.7 else
                "Limited sentence variety" if variance_risk > 0.3 else
                "Good variety in sentence structure"
            )
        })
        
        # Grammatical/spelling errors are scaled by text length
        error_ratio = features.meta_linguistic_errors / 100  # Assume 100 words is a typical sample
        error_risk = min(1.0, error_ratio * 5.0)  # Scale up, cap at 1.0
        
        contributing_factors.append({
            "name": "Language Errors",
            "value": features.meta_linguistic_errors,
            "impact": error_risk * weights["meta_linguistic_errors"],
            "description": (
                "Frequent grammatical/spelling errors" if error_risk > 0.7 else
                "Some grammatical/spelling errors" if error_risk > 0.3 else
                "Few grammatical/spelling errors"
            )
        })
        
        # Calculate weighted risk score
        risk_score = (
            freq_risk * weights["word_frequency_score"] +
            variance_risk * weights["sentence_complexity_variance"] +
            error_risk * weights["meta_linguistic_errors"]
        )
        
        # Normalize
        weight_sum = sum(abs(w) for w in weights.values())
        normalized_score = 0.5 - (risk_score / weight_sum)
        normalized_score = max(0.0, min(1.0, normalized_score))
        
        return RiskCategory(
            name="Additional Language Patterns",
            score=normalized_score,
            description="Measures additional patterns in language use",
            contributing_factors=contributing_factors
        )
    
    def _generate_recommendations(self, overall_risk: float, categories: List[RiskCategory]) -> List[str]:
        """
        Generate recommendations based on risk assessment.
        
        Args:
            overall_risk: Overall risk score
            categories: List of risk categories
            
        Returns:
            List of recommendations
        """
        recommendations = []
        
        # General recommendations based on overall risk
        if overall_risk > self.risk_thresholds["moderate"]:
            recommendations.append(
                "Consider consulting a healthcare professional for a comprehensive cognitive assessment."
            )
        elif overall_risk > self.risk_thresholds["low"]:
            recommendations.append(
                "Regular cognitive monitoring is recommended. Consider follow-up assessments every 3-6 months."
            )
        else:
            recommendations.append(
                "Continue regular cognitive activities. Consider a follow-up assessment in 12 months."
            )
        
        # Get the categories with highest risk scores
        sorted_categories = sorted(categories, key=lambda x: x.score, reverse=True)
        
        # Add specific recommendations based on highest risk categories
        for category in sorted_categories[:2]:  # Top 2 risk categories
            if category.name == "Lexical Diversity" and category.score > 0.4:
                recommendations.append(
                    "Consider vocabulary-building exercises such as reading diverse materials, "
                    "word games, or learning new topics to expand vocabulary."
                )
            
            elif category.name == "Syntactic Complexity" and category.score > 0.4:
                recommendations.append(
                    "Engage in activities that encourage complex language use, such as "
                    "writing exercises, discussion groups, or language arts."
                )
            
            elif category.name == "Fluency & Coherence" and category.score > 0.4:
                recommendations.append(
                    "Practice verbal fluency with conversation partners, storytelling exercises, "
                    "or speech practice to improve flow and reduce hesitations."
                )
            
            elif category.name == "Word Usage Patterns" and category.score > 0.4:
                recommendations.append(
                    "Work on specific naming practices and precise language use through "
                    "picture naming exercises or specific vocabulary practice."
                )
        
        # General cognitive health recommendations
        recommendations.append(
            "Regular physical exercise has been shown to support cognitive health."
        )
        
        recommendations.append(
            "Social engagement and cognitively stimulating activities may help maintain "
            "language abilities and overall cognitive function."
        )
        
        return recommendations
    
    def _generate_explanation(self, overall_risk: float, risk_level: str, categories: List[RiskCategory]) -> str:
        """
        Generate a plain language explanation of the risk assessment.
        
        Args:
            overall_risk: Overall risk score
            risk_level: Risk level (low, moderate, high)
            categories: List of risk categories
            
        Returns:
            Plain language explanation
        """
        # Sort categories by risk (highest first)
        sorted_categories = sorted(categories, key=lambda x: x.score, reverse=True)
        
        # Introduction
        explanation = (
            f"Based on the language analysis, your cognitive risk level is {risk_level.upper()}. "
        )
        
        # Explanation of what this means
        if risk_level == "high":
            explanation += (
                "This suggests significant patterns in your language use that may be associated with "
                "cognitive changes. These patterns are worth discussing with a healthcare professional. "
            )
        elif risk_level == "moderate":
            explanation += (
                "This suggests some patterns in your language use that may be associated with mild "
                "cognitive changes. Regular monitoring is recommended. "
            )
        else:  # low
            explanation += (
                "This suggests your language patterns are generally consistent with typical "
                "cognitive function. Regular cognitive activities are recommended for maintenance. "
            )
        
        # Key findings
        explanation += "Key findings include: "
        
        # Add top 2 contributing categories
        for i, category in enumerate(sorted_categories[:2]):
            # Find top contributing factor
            top_factor = sorted(
                category.contributing_factors, 
                key=lambda x: abs(x.get("impact", 0)), 
                reverse=True
            )[0] if category.contributing_factors else None
            
            if top_factor:
                explanation += f"{top_factor['description']}; "
            else:
                explanation += f"{category.name.lower()} patterns within normal ranges; "
        
        # Final advice
        explanation += (
            f"The recommendations provided offer specific activities that may help "
            f"address these patterns and support cognitive health."
        )
        
        return explanation 