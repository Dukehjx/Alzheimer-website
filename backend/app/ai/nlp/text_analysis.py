"""
Text Analysis Pipeline for Linguistic Pattern Detection.

This module implements a complete pipeline for analyzing text samples to 
detect linguistic patterns that may indicate early signs of cognitive decline.
It coordinates preprocessing, feature extraction, and risk assessment using GPT-4o.
"""

import logging
from typing import Dict, Any, List, Optional, Union
import asyncio
import time
from datetime import datetime

from app.ai.nlp.preprocessing import preprocess_text, tokenize_text
from app.ai.nlp.feature_extraction import extract_linguistic_features

# Remove the circular import
# from app.ai.factory import analyze_text as factory_analyze_text

# Initialize logger
logger = logging.getLogger(__name__)

class TextAnalysisPipeline:
    """
    A complete pipeline for analyzing text to detect linguistic patterns
    related to cognitive decline using GPT-4o.
    """
    
    def __init__(self):
        """Initialize the text analysis pipeline."""
        logger.info("Initializing text analysis pipeline with GPT-4o")
    
    async def analyze_text(
        self, 
        text: str, 
        include_features: bool = True,
        include_raw_text: bool = False,
        normalize_scores: bool = True
    ) -> Dict[str, Any]:
        """
        Analyze text for linguistic patterns that may indicate cognitive decline
        using the GPT-4o model.
        
        Args:
            text: The text to analyze
            include_features: Whether to include detailed linguistic features in the output
            include_raw_text: Whether to include the original text in the output
            normalize_scores: Whether to normalize scores to a 0-1 range
            
        Returns:
            Dictionary containing analysis results
        """
        start_time = time.time()
        
        if not text or not isinstance(text, str):
            logger.warning("Invalid text input for analysis")
            return {
                "success": False,
                "error": "Invalid text input",
                "execution_time": 0
            }
        
        try:
            # Process the text using the pipeline components
            results = {
                "success": True,
                "analysis_id": f"analysis_{int(datetime.now().timestamp())}",
                "text_length": len(text),
                "timestamp": datetime.now().isoformat(),
            }
            
            # Include original text if requested (useful for debugging)
            if include_raw_text:
                results["original_text"] = text
            
            # Step 1: Preprocess the text
            logger.debug(f"Preprocessing text of length {len(text)}")
            processed_text, preprocessing_metadata = preprocess_text(text)
            results["preprocessing_metadata"] = preprocessing_metadata
            
            # Skip analysis if text is too short after preprocessing
            if len(processed_text) < 10:
                logger.warning("Text too short after preprocessing for meaningful analysis")
                results["success"] = False
                results["error"] = "Text too short for analysis"
                results["execution_time"] = time.time() - start_time
                return results
            
            # Step 2: Extract linguistic features if needed
            if include_features:
                logger.debug("Extracting linguistic features")
                linguistic_features = extract_linguistic_features(processed_text)
                results["linguistic_features"] = linguistic_features
            
            # Step 3: Use GPT-4o for cognitive risk assessment
            logger.debug("Calculating cognitive risk scores with GPT-4o")
            
            # Import analyze_with_gpt directly from analyzer to avoid circular import
            from app.ai.gpt.analyzer import analyze_with_gpt
            
            risk_assessment = analyze_with_gpt(
                processed_text, 
                include_features=include_features
            )
            
            # Check if risk_assessment was successful
            if not risk_assessment.get("success", False):
                logger.warning(f"Risk assessment failed: {risk_assessment.get('error', 'Unknown error')}")
                return {
                    "success": False,
                    "error": f"Risk assessment failed: {risk_assessment.get('error', 'Unknown error')}",
                    "execution_time": time.time() - start_time
                }
            
            # Step 4: Combine results
            results.update({
                "risk_score": risk_assessment.get("risk_score", 0.5),
                "confidence_score": risk_assessment.get("confidence", 0.7),
                "domain_scores": risk_assessment.get("domain_scores", {}),
                "model_type": risk_assessment.get("model_type", "gpt4o"),
                "recommendations": risk_assessment.get("recommendations", []),
                "evidence": risk_assessment.get("evidence", [])
            })
            
            # Add execution time
            results["execution_time"] = time.time() - start_time
            
            return results
            
        except Exception as e:
            logger.error(f"Text analysis failed: {str(e)}", exc_info=True)
            return {
                "success": False,
                "error": f"Analysis failed: {str(e)}",
                "execution_time": time.time() - start_time
            }
    
    async def detect_linguistic_patterns(
        self, 
        text: str,
        patterns_of_interest: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Detect specific linguistic patterns in text that may indicate cognitive decline.
        
        Args:
            text: The text to analyze
            patterns_of_interest: List of pattern types to focus on (e.g., "repetitions", "hesitations")
            
        Returns:
            Dictionary containing detected patterns
        """
        if not patterns_of_interest:
            patterns_of_interest = ["repetitions", "hesitations", "simplification", "word_finding_difficulty"]
        
        # First run the general analysis
        analysis_results = await self.analyze_text(text, include_features=True)
        
        if not analysis_results.get("success", False):
            return analysis_results
        
        # Extract patterns from the GPT-4o analysis
        patterns = {
            "detected_patterns": {},
            "success": True,
            "model_type": "gpt4o"
        }
        
        features = analysis_results.get("linguistic_features", {})
        evidence = analysis_results.get("evidence", [])
        
        # Add feature-based patterns if available
        if features:
            # Extract repetition patterns
            if "repetitions" in patterns_of_interest and "repetition_patterns" in features:
                repetition_data = features["repetition_patterns"]
                patterns["detected_patterns"]["repetitions"] = {
                    "score": repetition_data.get("combined_repetition_score", 0),
                    "word_repetition_rate": repetition_data.get("word_repetition_rate", 0),
                    "phrase_repetition_rate": repetition_data.get("phrase_repetition_rate", 0)
                }
            
            # Extract hesitation patterns
            if "hesitations" in patterns_of_interest and "hesitation_patterns" in features:
                hesitation_data = features["hesitation_patterns"]
                patterns["detected_patterns"]["hesitations"] = {
                    "score": hesitation_data.get("hesitation_score", 0),
                    "filler_ratio": hesitation_data.get("filler_ratio", 0),
                    "revision_ratio": hesitation_data.get("revision_ratio", 0)
                }
            
            # Extract simplification patterns (from syntactic complexity)
            if "simplification" in patterns_of_interest and "syntactic_complexity" in features:
                complexity_data = features["syntactic_complexity"]
                patterns["detected_patterns"]["simplification"] = {
                    "score": 1.0 - complexity_data.get("complex_sentence_ratio", 0),
                    "mean_sentence_length": complexity_data.get("mean_sentence_length", 0),
                    "max_tree_depth": complexity_data.get("max_tree_depth", 0)
                }
            
            # Extract word finding difficulty (from lexical diversity)
            if "word_finding_difficulty" in patterns_of_interest and "lexical_diversity" in features:
                lexical_data = features["lexical_diversity"]
                patterns["detected_patterns"]["word_finding_difficulty"] = {
                    "score": 1.0 - lexical_data.get("type_token_ratio", 0),
                    "unique_lemma_ratio": lexical_data.get("unique_lemma_ratio", 0)
                }
        
        # Add evidence from GPT-4o analysis
        if evidence:
            patterns["evidence"] = evidence
            
        # Add overall metrics
        patterns["risk_score"] = analysis_results.get("risk_score", 0.5)
        patterns["confidence_score"] = analysis_results.get("confidence_score", 0.7)
        
        # Only add recommendations if they exist
        if "recommendations" in analysis_results and analysis_results["recommendations"]:
            patterns["recommendations"] = analysis_results["recommendations"]
        else:
            patterns["recommendations"] = ["Continue regular cognitive exercises."]
        
        return patterns

# Singleton instance for application-wide use
text_analysis_pipeline = TextAnalysisPipeline() 