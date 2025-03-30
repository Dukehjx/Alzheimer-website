"""
GPT Module Initialization.

This module provides interfaces for GPT-4o based language analysis.
It will be initialized when an API key is provided.
"""

from app.ai.gpt.risk_assessment import (
    initialize_gpt,
    calculate_cognitive_risk
)

__all__ = [
    "initialize_gpt",
    "calculate_cognitive_risk"
] 