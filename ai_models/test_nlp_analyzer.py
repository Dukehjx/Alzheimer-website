#!/usr/bin/env python
"""
Test script for the NLP Analyzer.

This script demonstrates how to use the NLP Analyzer to analyze text for
linguistic features that may indicate cognitive decline.
"""

import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Make sure we can import from the ai_models module
script_dir = Path(__file__).parent
if script_dir not in sys.path:
    sys.path.append(str(script_dir.parent))

# Import the NLP Analyzer
try:
    from ai_models.nlp_analyzer import NLPAnalyzer
except ImportError:
    logger.error("Failed to import NLPAnalyzer. Make sure you're running from the project root.")
    sys.exit(1)


def test_nlp_analyzer(text_file_path: str = None, text: str = None):
    """
    Test the NLP Analyzer with either a file or direct text input.
    
    Args:
        text_file_path: Path to a text file for analysis
        text: Direct text input for analysis
    """
    if not text_file_path and not text:
        logger.error("Either text_file_path or text must be provided")
        return
    
    # Read from file if provided
    if text_file_path:
        try:
            with open(text_file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            logger.info(f"Loaded text from file: {text_file_path}")
        except Exception as e:
            logger.error(f"Error reading file: {e}")
            return
    
    # Initialize the NLP Analyzer
    try:
        analyzer = NLPAnalyzer()
        logger.info("NLP Analyzer initialized")
    except Exception as e:
        logger.error(f"Error initializing NLP Analyzer: {e}")
        return
    
    # Analyze the text
    try:
        logger.info("Analyzing text...")
        features = analyzer.analyze_text(text)
        
        # Print the results
        print("\nLinguistic Features Analysis:")
        print("=" * 30)
        
        # Lexical diversity
        print("\nLexical Diversity:")
        print(f"Vocabulary Size: {features.vocabulary_size}")
        print(f"Type-Token Ratio: {features.type_token_ratio:.4f}")
        print(f"Hapax Legomena Ratio: {features.hapax_legomena_ratio:.4f}")
        
        # Syntactic complexity
        print("\nSyntactic Complexity:")
        print(f"Average Sentence Length: {features.avg_sentence_length:.2f} words")
        print(f"Average Word Length: {features.avg_word_length:.2f} characters")
        print(f"Readability Score: {features.readability_score:.2f}")
        
        # Fluency metrics
        print("\nFluency Metrics:")
        print(f"Filler Word Ratio: {features.filler_word_ratio:.4f}")
        print(f"Repetition Ratio: {features.repetition_ratio:.4f}")
        
        # Parts of speech distribution
        print("\nParts of Speech Distribution:")
        for pos, value in features.pos_distribution.items():
            print(f"  {pos}: {value:.4f}")
        
        # Additional metrics
        print("\nAdditional Metrics:")
        print(f"Semantic Coherence: {features.semantic_coherence:.4f}")
        print(f"Idea Density: {features.idea_density:.4f}")
        
        # Overall assessment
        print("\nOverall Assessment:")
        print(f"Total Words: {features.total_words}")
        print(f"Total Sentences: {features.total_sentences}")
        print(f"Analysis Duration: {features.analysis_duration:.4f} seconds")
        
        return features
        
    except Exception as e:
        logger.exception(f"Error during text analysis: {e}")
        return None


def main():
    """Run the test script."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Test the NLP Analyzer")
    parser.add_argument("--file", "-f", help="Path to a text file for analysis")
    parser.add_argument("--text", "-t", help="Direct text input for analysis")
    
    args = parser.parse_args()
    
    if not args.file and not args.text:
        # Use the sample text file if no input is provided
        sample_file = Path(__file__).parent.parent / "test_files" / "sample_text.txt"
        if sample_file.exists():
            args.file = str(sample_file)
            print(f"Using sample text file: {args.file}")
        else:
            print("No input provided and sample text file not found.")
            parser.print_help()
            return
    
    test_nlp_analyzer(args.file, args.text)


if __name__ == "__main__":
    main() 