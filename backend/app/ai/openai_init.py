"""
OpenAI API initialization module.

This module initializes the OpenAI API with the API key from environment variables.
It should be imported and used during application startup.
"""

import os
import logging
from typing import Optional

# Initialize logger
logger = logging.getLogger(__name__)

def initialize_openai_api() -> bool:
    """
    Initialize the OpenAI API with the API key from environment variables.
    
    Returns:
        True if initialization was successful, False otherwise
    """
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        logger.warning("OpenAI API key is not set in environment variables.")
        return False
    
    try:
        # Import OpenAI package
        import openai
        
        # Set API key
        openai.api_key = api_key
        
        logger.info("OpenAI API initialized successfully.")
        
        # Register GPT model if needed
        from app.ai.factory import register_gpt_model, set_model
        
        # Register the GPT-4o model
        if register_gpt_model(api_key):
            logger.info("GPT-4o model registered successfully.")
            
            # Set GPT-4o as the default model
            if set_model("gpt4o"):
                logger.info("GPT-4o model set as default.")
            else:
                logger.warning("Failed to set GPT-4o as default model.")
        
        return True
    except ImportError:
        logger.error("Failed to import OpenAI package. Please install it with 'pip install openai'.")
        return False
    except Exception as e:
        logger.error(f"Error initializing OpenAI API: {str(e)}")
        return False 