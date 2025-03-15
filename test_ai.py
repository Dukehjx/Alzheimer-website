#!/usr/bin/env python
"""
Test script for the AI models.

This script tests the AI models to ensure they are working correctly.
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

# Import the AI models
from ai_models.api_integration import AssessmentService

async def test_text_analysis():
    """Test the text analysis functionality."""
    print("Testing text analysis...")
    
    # Create an instance of the AssessmentService
    service = AssessmentService(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        whisper_mode="local",
        whisper_model="base",
        storage_dir="./test_results",
        save_results=False
    )
    
    # Sample text for testing
    sample_text = "I went to the store yesterday to buy some groceries. I forgot what I was supposed to get. I think I needed milk and bread, but I'm not sure. I ended up buying some apples and bananas."
    
    # Process the text
    result = await service.process_text(
        text=sample_text,
        user_id="test_user",
        metadata={"source": "test_script"}
    )
    
    # Print the results
    if result.success:
        print("Text analysis successful!")
        print(f"Transcription: {result.data.get('transcription', 'N/A')}")
        print(f"Risk assessment: {result.data.get('risk_assessment', {}).get('overall_risk_score', 'N/A')}")
        print(f"Risk level: {result.data.get('risk_assessment', {}).get('risk_level', 'N/A')}")
        
        # Print linguistic features
        features = result.data.get('linguistic_features', {})
        print("\nLinguistic Features:")
        print(f"Vocabulary Size: {features.get('vocabulary_size', 'N/A')}")
        print(f"Type-Token Ratio: {features.get('type_token_ratio', 'N/A')}")
        print(f"Average Sentence Length: {features.get('avg_sentence_length', 'N/A')}")
        print(f"Average Word Length: {features.get('avg_word_length', 'N/A')}")
        print(f"Readability Score: {features.get('readability_score', 'N/A')}")
        
        # Print recommendations
        print("\nRecommendations:")
        for i, rec in enumerate(result.data.get('risk_assessment', {}).get('recommendations', []), 1):
            print(f"{i}. {rec}")
    else:
        print(f"Text analysis failed: {result.message}")

if __name__ == "__main__":
    asyncio.run(test_text_analysis()) 