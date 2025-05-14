"""
GPT-4o integration module for cognitive assessment.

This module provides GPT-4o powered analysis for detecting cognitive decline
through language analysis.
"""

from app.ai.gpt.analyzer import analyze_with_gpt
from app.ai.gpt.risk_assessment import (
    initialize_gpt,
    calculate_cognitive_risk,
    VALID_DOMAINS
)

__all__ = [
    "analyze_with_gpt",
    "initialize_gpt",
    "calculate_cognitive_risk",
    "VALID_DOMAINS"
] 