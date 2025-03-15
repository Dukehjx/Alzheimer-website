#!/usr/bin/env python
"""
Test script to demonstrate using the AI models.

This script provides examples of how to use the cognitive assessment
pipeline for both text and speech analysis.
"""

import os
import sys
import asyncio
import logging
from pathlib import Path
import json
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import our modules
try:
    from cognitive_assessment import CognitiveAssessment, CognitiveAssessmentInput
except ImportError:
    logger.error("Failed to import AI modules. Make sure you're running from the ai_models directory.")
    sys.exit(1)


async def test_text_analysis():
    """Test the text analysis pipeline."""
    logger.info("Testing text analysis...")
    
    # Sample text for analysis
    # This example contains some linguistic patterns that might indicate cognitive decline
    sample_text = """
    I was... umm... going to the store yesterday. The store. I needed to buy some, 
    you know, groceries and things. And when I got there, I forgot what I needed. 
    I walked around for a while looking at things, hoping I would remember. 
    I got some milk and some... what do you call it... bread. Yes, bread.
    Then I came home. But I think I forgot something important that I needed to get.
    """
    
    try:
        # Initialize the cognitive assessment pipeline
        api_key = os.getenv("OPENAI_API_KEY")
        assessment = CognitiveAssessment(openai_api_key=api_key)
        
        # Prepare input
        input_data = CognitiveAssessmentInput(
            text=sample_text,
            user_id="test_user",
            metadata={"source": "test_script", "test_type": "text_analysis"}
        )
        
        # Process assessment
        logger.info("Processing text...")
        result = await assessment.assess(input_data)
        
        # Print results
        logger.info(f"Assessment completed with ID: {result.assessment_id}")
        logger.info(f"Risk level: {result.risk_assessment.risk_level}")
        logger.info(f"Risk score: {result.risk_assessment.overall_score}")
        
        # Print detailed results
        print("\n===== DETAILED RESULTS =====")
        print(f"Risk Level: {result.risk_assessment.risk_level}")
        print(f"Overall Score: {result.risk_assessment.overall_score}")
        
        print("\nRisk Categories:")
        for cat in result.risk_assessment.categories:
            print(f"- {cat.name}: {cat.score} - {cat.description}")
            
        print("\nRecommendations:")
        for rec in result.risk_assessment.recommendations:
            print(f"- {rec}")
            
        print("\nExplanations:")
        for exp in result.risk_assessment.explanations:
            print(f"- {exp}")
        
        # Save results to file
        output_dir = Path("test_results")
        output_dir.mkdir(exist_ok=True)
        
        output_file = output_dir / f"text_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            f.write(result.json(exclude_none=True, indent=2))
            
        logger.info(f"Results saved to {output_file}")
        
        return result
        
    except Exception as e:
        logger.exception(f"Error during text analysis: {e}")
        raise


async def test_speech_analysis(audio_file_path: str):
    """
    Test the speech analysis pipeline.
    
    Args:
        audio_file_path: Path to an audio file for testing
    """
    logger.info(f"Testing speech analysis with file: {audio_file_path}")
    
    if not os.path.exists(audio_file_path):
        logger.error(f"Audio file not found: {audio_file_path}")
        return
        
    try:
        # Initialize the cognitive assessment pipeline
        api_key = os.getenv("OPENAI_API_KEY")
        assessment = CognitiveAssessment(openai_api_key=api_key)
        
        # Prepare input
        input_data = CognitiveAssessmentInput(
            audio_file=audio_file_path,
            language="en",
            user_id="test_user",
            metadata={"source": "test_script", "test_type": "speech_analysis"}
        )
        
        # Process assessment
        logger.info("Processing speech...")
        result = await assessment.assess(input_data)
        
        # Print results
        logger.info(f"Assessment completed with ID: {result.assessment_id}")
        logger.info(f"Transcription: {result.transcription.text}")
        logger.info(f"Risk level: {result.risk_assessment.risk_level}")
        logger.info(f"Risk score: {result.risk_assessment.overall_score}")
        
        # Print detailed results
        print("\n===== DETAILED RESULTS =====")
        print(f"Transcription: {result.transcription.text}")
        print(f"Risk Level: {result.risk_assessment.risk_level}")
        print(f"Overall Score: {result.risk_assessment.overall_score}")
        
        print("\nRisk Categories:")
        for cat in result.risk_assessment.categories:
            print(f"- {cat.name}: {cat.score} - {cat.description}")
            
        print("\nRecommendations:")
        for rec in result.risk_assessment.recommendations:
            print(f"- {rec}")
            
        print("\nExplanations:")
        for exp in result.risk_assessment.explanations:
            print(f"- {exp}")
        
        # Save results to file
        output_dir = Path("test_results")
        output_dir.mkdir(exist_ok=True)
        
        output_file = output_dir / f"speech_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            f.write(result.json(exclude_none=True, indent=2))
            
        logger.info(f"Results saved to {output_file}")
        
        return result
        
    except Exception as e:
        logger.exception(f"Error during speech analysis: {e}")
        raise


async def main():
    """Run the test script."""
    logger.info("Starting AI models test script")
    
    # Check if we have an API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.warning("No OpenAI API key found in environment. Speech-to-text will not work.")
        logger.info("Please set the OPENAI_API_KEY environment variable.")
    
    # Test text analysis
    await test_text_analysis()
    
    # Test speech analysis if an audio file is provided and we have an API key
    if api_key:
        audio_file = None
        # Look for audio files in the test_audio directory
        audio_dir = Path("test_audio")
        if audio_dir.exists():
            audio_files = list(audio_dir.glob("*.mp3")) + list(audio_dir.glob("*.wav")) + list(audio_dir.glob("*.m4a"))
            if audio_files:
                audio_file = str(audio_files[0])
                logger.info(f"Found audio file: {audio_file}")
                
        if audio_file:
            await test_speech_analysis(audio_file)
        else:
            logger.info("No audio file found for testing speech analysis.")
            logger.info("Please place an audio file in the test_audio directory.")
    
    logger.info("Test script completed")


if __name__ == "__main__":
    # Create necessary directories
    os.makedirs("test_audio", exist_ok=True)
    os.makedirs("test_results", exist_ok=True)
    
    # Run the async main function
    asyncio.run(main()) 