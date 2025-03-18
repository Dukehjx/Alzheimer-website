"""
Models for language analysis results and cognitive assessments.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field
import uuid

class AnalysisType(str, Enum):
    """Type of language analysis performed."""
    TEXT = "text"
    SPEECH = "speech"

class LanguageMetrics(BaseModel):
    """Linguistic metrics extracted from text or speech samples."""
    lexical_diversity: float = Field(..., ge=0.0, le=1.0, description="Ratio of unique words to total words")
    syntactic_complexity: float = Field(..., ge=0.0, le=1.0, description="Measure of sentence structure complexity")
    hesitations: float = Field(..., ge=0.0, le=1.0, description="Frequency of filler words or pauses")
    repetitions: float = Field(..., ge=0.0, le=1.0, description="Frequency of repeated words or phrases")
    speech_rate: Optional[float] = Field(None, ge=0.0, description="Words per minute (speech only)")
    pause_patterns: Optional[float] = Field(None, ge=0.0, le=1.0, description="Analysis of pause duration and frequency")

class CognitiveDomain(str, Enum):
    """Cognitive domains assessed in analysis."""
    MEMORY = "memory"
    EXECUTIVE_FUNCTION = "executive_function"
    ATTENTION = "attention"
    LANGUAGE = "language"
    VISUOSPATIAL = "visuospatial"

class DomainScore(BaseModel):
    """Score for a specific cognitive domain."""
    domain: CognitiveDomain
    score: float = Field(..., ge=0.0, le=1.0)
    percentile: Optional[float] = Field(None, ge=0.0, le=100.0)
    
class AnalysisResult(BaseModel):
    """Results of language analysis for cognitive assessment."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    analysis_type: AnalysisType
    sample_duration: Optional[float] = None  # In seconds for speech
    text_length: Optional[int] = None  # Character count for text
    
    # Raw text data (original or transcribed)
    raw_text: str
    
    # Analysis results
    metrics: LanguageMetrics
    domain_scores: Dict[CognitiveDomain, float]
    risk_score: float = Field(..., ge=0.0, le=1.0, description="Overall risk score (0-1)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence in assessment")
    
    # Recommendations based on analysis
    recommendations: List[str]
    
    # Comparison to previous results (if available)
    change_from_baseline: Optional[Dict[str, float]] = None
    
    # Metadata
    model_version: str = "0.1.0"
    processing_time: float  # In seconds
    
    class Config:
        """Model configuration."""
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            uuid.UUID: lambda id: str(id)
        }

class AnalysisRequest(BaseModel):
    """Request for language analysis."""
    user_id: str
    analysis_type: AnalysisType
    text: Optional[str] = None
    audio_file_id: Optional[str] = None  # Reference to uploaded audio file
    
    class Config:
        """Model configuration."""
        extra = "forbid"  # Prevent additional properties 