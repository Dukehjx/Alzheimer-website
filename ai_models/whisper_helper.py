"""
Whisper Helper Script.

This script provides a simplified interface for using Whisper and checks for 
required dependencies like FFmpeg.
"""

import os
import sys
import shutil
import logging
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional, Union, List, Tuple

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def is_ffmpeg_available() -> bool:
    """
    Check if FFmpeg is installed and available in the system PATH.
    
    Returns:
        bool: True if FFmpeg is available, False otherwise
    """
    return shutil.which("ffmpeg") is not None


def check_dependencies() -> Tuple[bool, List[str]]:
    """
    Check if all required dependencies for Whisper are available.
    
    Returns:
        Tuple[bool, List[str]]: (True if all dependencies are available, list of missing dependencies)
    """
    missing_dependencies = []
    
    # Check for FFmpeg
    if not is_ffmpeg_available():
        missing_dependencies.append("FFmpeg")
    
    # Check for whisper package
    try:
        import whisper
    except ImportError:
        missing_dependencies.append("openai-whisper")
    
    # Check for PyTorch
    try:
        import torch
    except ImportError:
        missing_dependencies.append("torch")
    
    return len(missing_dependencies) == 0, missing_dependencies


def install_missing_dependencies(dependencies: List[str]) -> bool:
    """
    Attempt to install missing dependencies.
    
    Args:
        dependencies: List of missing dependencies to install
        
    Returns:
        bool: True if installation was successful, False otherwise
    """
    if not dependencies:
        return True
    
    logger.info(f"Attempting to install missing dependencies: {', '.join(dependencies)}")
    
    success = True
    
    # Install Python packages
    python_packages = [pkg for pkg in dependencies if pkg != "FFmpeg"]
    if python_packages:
        try:
            packages_str = " ".join(python_packages)
            logger.info(f"Installing Python packages: {packages_str}")
            subprocess.check_call([sys.executable, "-m", "pip", "install", *python_packages])
        except subprocess.CalledProcessError:
            logger.error(f"Failed to install Python packages: {packages_str}")
            success = False
    
    # Notify about FFmpeg if it's missing
    if "FFmpeg" in dependencies:
        logger.error(
            "FFmpeg is required but not found in PATH. "
            "Please install FFmpeg manually following the instructions in FFmpeg_Installation_Guide.md"
        )
        success = False
    
    return success


def transcribe_audio(
    file_path: str, 
    model_name: str = "base",
    language: Optional[str] = None,
    show_progress: bool = True
) -> Dict[str, Any]:
    """
    Transcribe audio using the local Whisper model.
    
    Args:
        file_path: Path to the audio file
        model_name: Whisper model name (tiny, base, small, medium, large)
        language: Language code (optional)
        show_progress: Whether to show a progress bar
        
    Returns:
        Dict[str, Any]: Transcription result
    """
    # Check dependencies first
    all_deps_available, missing_deps = check_dependencies()
    if not all_deps_available:
        logger.error(f"Missing dependencies: {', '.join(missing_deps)}")
        
        # Try to install missing dependencies
        if install_missing_dependencies(missing_deps):
            logger.info("Successfully installed missing dependencies")
        else:
            logger.error("Failed to install all required dependencies")
            return {
                "text": "",
                "error": f"Missing dependencies: {', '.join(missing_deps)}",
                "success": False
            }
    
    # Import whisper here since we already checked if it's available
    import whisper
    
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            return {
                "text": "",
                "error": f"Audio file not found: {file_path}",
                "success": False
            }
        
        logger.info(f"Loading Whisper model: {model_name}")
        model = whisper.load_model(model_name)
        
        logger.info(f"Transcribing audio: {file_path}")
        transcribe_options = {"fp16": False}
        
        if language:
            transcribe_options["language"] = language
        
        result = model.transcribe(file_path, **transcribe_options)
        
        # Add success flag
        result["success"] = True
        return result
    
    except Exception as e:
        logger.exception(f"Error transcribing audio: {e}")
        return {
            "text": "",
            "error": str(e),
            "success": False
        }


def main():
    """Command-line interface for the whisper helper."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Whisper Helper Script")
    parser.add_argument("--audio", "-a", required=True, help="Path to audio file")
    parser.add_argument("--model", "-m", default="base", 
                        choices=["tiny", "base", "small", "medium", "large"],
                        help="Whisper model to use")
    parser.add_argument("--language", "-l", help="Language code (optional)")
    parser.add_argument("--check", "-c", action="store_true", 
                        help="Only check dependencies without transcribing")
    
    args = parser.parse_args()
    
    if args.check:
        all_deps_available, missing_deps = check_dependencies()
        if all_deps_available:
            print("All dependencies are available! Whisper is ready to use.")
        else:
            print(f"Missing dependencies: {', '.join(missing_deps)}")
            print("Please install the missing dependencies.")
        return
    
    result = transcribe_audio(args.audio, args.model, args.language)
    
    if result["success"]:
        print("\nTranscription result:")
        print("---------------------")
        print(result["text"])
        print("\nAdditional information:")
        print(f"Language: {result.get('language', 'unknown')}")
        segments = result.get("segments", [])
        print(f"Segments: {len(segments)}")
        if segments:
            total_duration = segments[-1]["end"] if segments else 0
            print(f"Duration: {total_duration:.2f} seconds")
    else:
        print(f"\nError: {result.get('error', 'Unknown error')}")


if __name__ == "__main__":
    main() 