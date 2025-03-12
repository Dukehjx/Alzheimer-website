"""
Vercel serverless function handler for the Alzheimer's Detection Platform API.
This file adapts our FastAPI application to work with Vercel's serverless functions.
"""

from main import app

# Export the app handler for Vercel
handler = app 