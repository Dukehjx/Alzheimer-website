"""API endpoints for the Alzheimer's detection platform."""

# Make all modules importable
from . import language_analysis
from . import cognitive_training
from . import resources

"""
API routes initialization.
"""
from app.api.auth import router as auth_router
from app.api.language_analysis import router as language_router
from app.api.cognitive_training import router as cognitive_training_router
from app.api.resources import router as resources_router
from app.routes.ai import router as ai_router

__all__ = ["auth_router", "language_router", "cognitive_training_router", "resources_router", "ai_router"] 