#!/usr/bin/env python
"""
Dependency Check Script

This script checks for all required dependencies for the Alzheimer's detection tools
and attempts to install any missing packages.
"""

import sys
import subprocess
import pkg_resources
import shutil
from pathlib import Path

REQUIRED_PACKAGES = [
    "openai-whisper",
    "spacy",
    "textstat",
    "pydantic",
    "numpy",
    "torch",
    "pyaudio",
    "ffmpeg-python",
    "scikit-learn",
    "python-dotenv"
]

SPACY_MODEL = "en_core_web_sm"

def check_ffmpeg():
    """Check if FFmpeg is available in the system path."""
    if shutil.which("ffmpeg") is None:
        print("❌ FFmpeg not found in system path.")
        print("   Please ensure FFmpeg is installed and available in your PATH.")
        print("   See FFmpeg_Installation_Guide.md for installation instructions.")
        return False
    print("✅ FFmpeg found in system path")
    return True

def check_python_packages():
    """Check if required Python packages are installed."""
    missing = []
    for package in REQUIRED_PACKAGES:
        try:
            pkg_resources.get_distribution(package)
            print(f"✅ {package} is installed")
        except pkg_resources.DistributionNotFound:
            print(f"❌ {package} is NOT installed")
            missing.append(package)
    return missing

def check_spacy_model():
    """Check if the required spaCy model is installed."""
    try:
        import spacy
        try:
            spacy.load(SPACY_MODEL)
            print(f"✅ spaCy model {SPACY_MODEL} is installed")
            return True
        except OSError:
            print(f"❌ spaCy model {SPACY_MODEL} is NOT installed")
            return False
    except ImportError:
        print("❌ spaCy is not installed, cannot check for model")
        return False

def install_missing_packages(packages):
    """Install missing Python packages."""
    if not packages:
        return True
    
    print("\nAttempting to install missing packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + packages)
        print("✅ Successfully installed missing packages")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install some packages")
        return False

def install_spacy_model():
    """Install the required spaCy model."""
    print(f"\nAttempting to install spaCy model {SPACY_MODEL}...")
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", SPACY_MODEL])
        print(f"✅ Successfully installed spaCy model {SPACY_MODEL}")
        return True
    except subprocess.CalledProcessError:
        print(f"❌ Failed to install spaCy model {SPACY_MODEL}")
        return False

def ensure_directories():
    """Ensure necessary directories exist."""
    project_root = Path(__file__).parent
    
    # Ensure models directory exists
    models_dir = project_root / "models"
    models_dir.mkdir(exist_ok=True)
    print(f"✅ Models directory exists: {models_dir}")
    
    # Ensure test_files directory exists
    test_files_dir = project_root / "test_files"
    test_files_dir.mkdir(exist_ok=True)
    print(f"✅ Test files directory exists: {test_files_dir}")
    
    # Ensure results directory exists
    results_dir = project_root / "results"
    results_dir.mkdir(exist_ok=True)
    print(f"✅ Results directory exists: {results_dir}")

def main():
    """Main function to check dependencies."""
    print("Checking dependencies for Alzheimer's detection tools...\n")
    
    # Check FFmpeg
    ffmpeg_ok = check_ffmpeg()
    
    # Check Python packages
    print("\nChecking required Python packages:")
    missing_packages = check_python_packages()
    
    # Install missing packages if needed
    if missing_packages:
        install_missing_packages(missing_packages)
    
    # Check spaCy model (after potentially installing spaCy)
    print("\nChecking spaCy model:")
    spacy_model_ok = check_spacy_model()
    
    # Install spaCy model if needed
    if not spacy_model_ok and "spacy" not in missing_packages:
        install_spacy_model()
    
    # Ensure directories exist
    print("\nChecking directories:")
    ensure_directories()
    
    # Overall status
    print("\nDependency check complete:")
    if not ffmpeg_ok:
        print("⚠️  WARNING: FFmpeg is not available, audio transcription will not work properly.")
    
    if missing_packages:
        print("⚠️  Some packages may not have been installed. Please review the output above.")
    else:
        print("✅ All required Python packages are installed.")
    
    if not spacy_model_ok and "spacy" not in missing_packages:
        print(f"⚠️  spaCy model {SPACY_MODEL} might not be installed properly.")
    
    print("\nIf you see any warnings above, please fix those issues before running the application.")
    print("Otherwise, you're good to go!")

if __name__ == "__main__":
    main() 