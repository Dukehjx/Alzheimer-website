"""
Vercel serverless function handler for the Alzheimer's Detection Platform API.
This file adapts our FastAPI application to work with Vercel's serverless functions.
"""

# Use absolute imports for Vercel serverless environment
import sys
import os

# Add the current directory to the path so imports work correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now import the app
from backend.main import app

# Export the handler for Vercel
def handler(request, context):
    return app(request, context) 