"""API endpoints for the Alzheimer's detection platform."""

# Make all modules importable
from . import language_analysis 

"""
API routes initialization.
"""
from app.api.auth import router as auth_router
from app.api.language_analysis import router as language_router
from app.routes.ai import router as ai_router

__all__ = ["auth_router", "language_router", "ai_router"] 