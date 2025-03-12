"""API endpoints for the Alzheimer's detection platform."""

# Make all modules importable
try:
    from . import language_analysis
except ImportError:
    # When running in Vercel's serverless environment, relative imports might fail
    # This provides a fallback
    pass 