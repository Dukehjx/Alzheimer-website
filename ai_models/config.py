"""
Configuration module for AI models.

This module provides configuration settings for the AI models,
including Whisper mode settings, model paths, and API keys.
"""

import os
import logging
from typing import Literal, Dict, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

# Whisper configuration
WHISPER_MODES = Literal["local", "api"]
WHISPER_MODE: WHISPER_MODES = os.getenv("WHISPER_MODE", "local")
WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")
OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")

# Base directory for model storage
BASE_DIR = Path(__file__).parent.parent
MODEL_DIR = BASE_DIR / "models"
RESULTS_DIR = BASE_DIR / "results"

# Create directories if they don't exist
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# Default settings
DEFAULT_SETTINGS = {
    "save_results": True,
    "debug_mode": False,
    "whisper_mode": WHISPER_MODE,
    "whisper_model": WHISPER_MODEL,
}


def get_config() -> Dict[str, Any]:
    """
    Get the current configuration settings.
    
    Returns:
        Dict[str, Any]: Dictionary of configuration settings
    """
    config = {
        "whisper": {
            "mode": WHISPER_MODE,
            "model": WHISPER_MODEL,
            "has_api_key": bool(OPENAI_API_KEY),
        },
        "paths": {
            "model_dir": str(MODEL_DIR),
            "results_dir": str(RESULTS_DIR),
            "base_dir": str(BASE_DIR),
        },
        "settings": DEFAULT_SETTINGS,
    }
    
    return config


def validate_config() -> bool:
    """
    Validate the current configuration.
    
    Returns:
        bool: True if configuration is valid, False otherwise
    """
    if WHISPER_MODE == "api" and not OPENAI_API_KEY:
        logger.warning("WHISPER_MODE set to 'api' but OPENAI_API_KEY is not set")
        return False
    
    if WHISPER_MODE not in ["local", "api"]:
        logger.error(f"Invalid WHISPER_MODE: {WHISPER_MODE}. Must be 'local' or 'api'.")
        return False
    
    return True


# Validate configuration on module import
is_valid = validate_config()
if not is_valid:
    logger.warning("Configuration validation failed. Some features may not work as expected.") 