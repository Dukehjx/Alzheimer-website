"""
OpenAI API initialization module.

This module initializes a shared OpenAI API client and registers necessary models
with the AI factory. It should be imported and called during application startup.
"""

import os
import logging
from typing import Optional

# Import OpenAI package earlier for type hinting if needed, actual import later
import openai

# Initialize logger
logger = logging.getLogger(__name__)

# Shared OpenAI client instance, initialized by initialize_openai_api()
shared_openai_client: Optional[openai.OpenAI] = None

def get_openai_client() -> Optional[openai.OpenAI]:
    """Returns the shared OpenAI client instance."""
    if shared_openai_client is None:
        logger.warning("OpenAI client accessed before initialization or initialization failed.")
    return shared_openai_client

def initialize_openai_api() -> bool:
    """
    Initialize a shared OpenAI API client and register AI models.
    
    Returns:
        True if initialization and model registration were successful, False otherwise.
    """
    global shared_openai_client
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        logger.warning("OpenAI API key is not set in environment variables. AI features will be disabled.")
        return False
    
    if not api_key.startswith("sk-"):
        logger.warning("OpenAI API key format appears incorrect (should start with 'sk-'). Proceeding with caution.")
    else:
        logger.info(f"Found OpenAI API key starting with: {api_key[:8]}...")
    
    try:
        # Initialize the shared client
        shared_openai_client = openai.OpenAI(api_key=api_key, timeout=60.0, max_retries=3)
        logger.info("Shared OpenAI client created.")
        
        # Test API connection with a simple request using the shared client
        try:
            shared_openai_client.chat.completions.create(
                model="gpt-4o", # Using a known common model for testing
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5
            )
            logger.info("Successfully tested OpenAI API connection with shared client.")
        except Exception as api_error:
            logger.error(f"OpenAI API connection test failed: {str(api_error)}")
            shared_openai_client = None # Nullify client on test failure
            return False
        
        logger.info("OpenAI API initialized successfully.")
        
        # Register GPT model with the factory
        # This now uses the standalone register_gpt_model from factory.py which should handle specifics
        from app.ai.factory import register_gpt_model as standalone_register_gpt_model
        from app.ai.factory import model_factory, ModelType # For setting default

        if standalone_register_gpt_model(api_key): # Pass api_key for gpt module init if needed by it
            logger.info("GPT-4o model pathway registered successfully via factory's standalone function.")
            # Optionally set as default if the factory's set_model is robust
            if model_factory.set_model(ModelType.GPT4O): # Directly use factory instance method
                 logger.info(f"Model {ModelType.GPT4O.value} set as current in factory.")
            else:
                 logger.warning(f"Failed to set {ModelType.GPT4O.value} as current model in factory.")
        else:
            logger.error("Failed to register GPT-4o model pathway.")
            return False # If core model registration fails, consider init as failed
        
        return True
        
    except ImportError:
        logger.error("Failed to import OpenAI package. Please install it with 'pip install openai'.")
        return False
    except Exception as e:
        logger.error(f"Error initializing OpenAI API or registering models: {str(e)}")
        shared_openai_client = None
        return False 