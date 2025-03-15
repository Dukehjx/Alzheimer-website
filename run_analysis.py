#!/usr/bin/env python
"""
Alzheimer's Early Detection Tool

This application records audio, transcribes it using Whisper,
and analyzes the language for cognitive markers.
"""

import os
import sys
import time
import asyncio
import logging
import argparse
from pathlib import Path
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add the current directory to the path to ensure imports work
current_dir = Path(__file__).parent
if current_dir not in sys.path:
    sys.path.append(str(current_dir))

# Import our modules
try:
    from ai_models.audio_recorder import record_audio
    from ai_models.whisper_stt import WhisperSTT, TranscriptionResult
    from ai_models.cognitive_assessment import CognitiveAssessment
    from ai_models.config import get_config, WHISPER_MODE, WHISPER_MODEL
except ImportError as e:
    logger.error(f"Failed to import required modules: {e}")
    logger.error("Please make sure you're running from the project root directory")
    sys.exit(1)


async def transcribe_audio(audio_path: str, whisper_mode: str, whisper_model: str) -> TranscriptionResult:
    """
    Transcribe audio using the specified Whisper mode and model.
    
    Args:
        audio_path: Path to the audio file
        whisper_mode: 'local' or 'api'
        whisper_model: Model name for local mode
        
    Returns:
        TranscriptionResult object
    """
    try:
        logger.info(f"Initializing WhisperSTT with mode={whisper_mode}, model={whisper_model}")
        stt = WhisperSTT(mode=whisper_mode, model_name=whisper_model)
        
        logger.info(f"Transcribing audio: {audio_path}")
        start_time = time.time()
        result = await stt.transcribe_audio(audio_path)
        duration = time.time() - start_time
        
        if result.is_successful:
            logger.info(f"Transcription successful in {duration:.2f} seconds")
            logger.info(f"Transcribed text: {result.text[:100]}...")
        else:
            logger.error(f"Transcription failed: {result.error_message}")
        
        return result
    
    except Exception as e:
        logger.exception(f"Error during transcription: {e}")
        raise


async def analyze_speech(
    audio_path: str, 
    whisper_mode: str = "local",
    whisper_model: str = "base",
    language: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze speech recording for cognitive markers.
    
    Args:
        audio_path: Path to the audio file
        whisper_mode: 'local' or 'api'
        whisper_model: Model name for local mode
        language: Optional language code
        
    Returns:
        Dictionary with assessment results
    """
    try:
        logger.info(f"Initializing cognitive assessment with whisper_mode={whisper_mode}")
        assessment = CognitiveAssessment(
            whisper_mode=whisper_mode, 
            whisper_model=whisper_model
        )
        
        logger.info(f"Processing speech from: {audio_path}")
        result = await assessment.assess_from_speech(
            audio_file=audio_path,
            language=language
        )
        
        return {
            "transcription": result.transcription.text if result.transcription else "",
            "linguistic_features": result.linguistic_features.model_dump(),
            "risk_assessment": {
                "overall_score": result.risk_assessment.overall_risk_score,
                "risk_level": result.risk_assessment.risk_level,
                "categories": [
                    {
                        "name": category.name,
                        "score": category.score,
                        "description": category.description
                    }
                    for category in result.risk_assessment.categories
                ],
                "recommendations": result.risk_assessment.recommendations,
                "explanations": {"explanation": result.risk_assessment.explanation}
            },
            "metadata": result.metadata
        }
    
    except Exception as e:
        logger.exception(f"Error during speech analysis: {e}")
        raise


def print_results(results: Dict[str, Any]):
    """
    Print assessment results in a formatted way.
    
    Args:
        results: Assessment results dictionary
    """
    print("\n" + "="*80)
    print(" "*30 + "COGNITIVE ASSESSMENT RESULTS")
    print("="*80 + "\n")
    
    # Print transcription
    print("TRANSCRIPTION:")
    print("-"*80)
    print(results["transcription"])
    print("\n")
    
    # Print risk assessment
    risk = results["risk_assessment"]
    print("RISK ASSESSMENT:")
    print("-"*80)
    print(f"Overall Risk Score: {risk['overall_score']:.2f}")
    print(f"Risk Level: {risk['risk_level']}")
    print("\nRisk Categories:")
    
    for category in risk["categories"]:
        print(f"- {category['name']}: {category['score']:.2f} - {category['description']}")
    
    # Print linguistic features
    features = results["linguistic_features"]
    print("\nLINGUISTIC FEATURES:")
    print("-"*80)
    print(f"Vocabulary Size: {features.get('vocabulary_size', 'N/A')}")
    print(f"Type-Token Ratio: {features.get('type_token_ratio', 0.0):.4f}")
    print(f"Average Sentence Length: {features.get('avg_sentence_length', 0.0):.2f} words")
    print(f"Average Word Length: {features.get('avg_word_length', 0.0):.2f} characters")
    print(f"Readability Score: {features.get('readability_score', 0.0):.2f}")
    
    # Print additional metrics if available
    if 'semantic_coherence' in features:
        print(f"Semantic Coherence: {features['semantic_coherence']:.4f}")
    if 'idea_density' in features:
        print(f"Idea Density: {features['idea_density']:.4f}")
    
    # Print recommendations
    print("\nRECOMMENDATIONS:")
    print("-"*80)
    for i, rec in enumerate(risk["recommendations"], 1):
        print(f"{i}. {rec}")
    
    # Print explanations
    print("\nEXPLANATION:")
    print("-"*80)
    if "explanations" in risk and "explanation" in risk["explanations"]:
        print(risk["explanations"]["explanation"])
    else:
        print("No detailed explanation available.")
    
    print("\n" + "="*80)


async def main():
    """Main entry point for the application."""
    parser = argparse.ArgumentParser(description="Alzheimer's Early Detection Tool")
    parser.add_argument("--record", "-r", action="store_true", help="Record new audio")
    parser.add_argument("--audio", "-a", help="Path to an existing audio file")
    parser.add_argument("--seconds", "-s", type=int, default=15, help="Recording duration in seconds")
    parser.add_argument("--whisper-mode", "-wm", choices=["local", "api"], default=WHISPER_MODE, 
                        help="Whisper mode (local or api)")
    parser.add_argument("--whisper-model", "-wmod", default=WHISPER_MODEL,
                        help="Whisper model for local mode")
    parser.add_argument("--language", "-l", help="Language code (e.g., 'en')")
    parser.add_argument("--output", "-o", help="Output directory for recordings")
    
    args = parser.parse_args()
    
    # Get either the provided audio path or record new audio
    audio_path = args.audio
    
    if not audio_path and not args.record:
        print("You must either specify an audio file with --audio or use --record to record new audio.")
        parser.print_help()
        return
    
    if args.record:
        # Create the output directory if specified
        output_dir = None
        if args.output:
            os.makedirs(args.output, exist_ok=True)
            output_dir = args.output
        
        # Record audio
        print(f"\nRecording audio for {args.seconds} seconds...")
        print("Please speak clearly about any topic (e.g., describe your day or a recent experience).")
        print("Press Ctrl+C to stop recording early.\n")
        
        try:
            audio_path = record_audio(
                output_path=os.path.join(output_dir, "cognitive_assessment.wav") if output_dir else None,
                seconds=args.seconds
            )
        except KeyboardInterrupt:
            print("\nRecording stopped early by user.")
            return
        except Exception as e:
            logger.exception(f"Error during audio recording: {e}")
            print(f"\nError recording audio: {str(e)}")
            return
    
    # Analyze the speech
    try:
        print("\nAnalyzing speech for cognitive markers...")
        
        results = await analyze_speech(
            audio_path=audio_path,
            whisper_mode=args.whisper_mode,
            whisper_model=args.whisper_model,
            language=args.language
        )
        
        print("\nAnalysis complete!")
        print_results(results)
        
    except Exception as e:
        logger.exception(f"Error during analysis: {e}")
        print(f"\nError during analysis: {str(e)}")


if __name__ == "__main__":
    # Show current configuration
    config = get_config()
    print("\nCurrent configuration:")
    print(f"Whisper Mode: {config['whisper']['mode']}")
    print(f"Whisper Model: {config['whisper']['model']}")
    print(f"OpenAI API Key Available: {config['whisper']['has_api_key']}")
    print(f"Model Directory: {config['paths']['model_dir']}")
    print()
    
    # Run the async main function
    asyncio.run(main()) 