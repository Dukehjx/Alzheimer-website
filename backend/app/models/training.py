"""
Models for cognitive training exercises and user progress.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field
import uuid

class ExerciseType(str, Enum):
    """Types of cognitive training exercises."""
    WORD_RECALL = "word_recall"
    LANGUAGE_FLUENCY = "language_fluency"
    READING_COMPREHENSION = "reading_comprehension"
    VERBAL_MEMORY = "verbal_memory"
    SEMANTIC_ASSOCIATION = "semantic_association"
    ATTENTION_TASK = "attention_task"

class DifficultyLevel(str, Enum):
    """Difficulty levels for exercises."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class Exercise(BaseModel):
    """Base model for a cognitive training exercise."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    exercise_type: ExerciseType
    difficulty: DifficultyLevel
    estimated_duration: int  # In seconds
    instructions: str
    content: Dict  # Exercise-specific content structure
    cognitive_domains: List[str]  # Cognitive domains targeted
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        """Model configuration."""
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            uuid.UUID: lambda id: str(id)
        }

class ExerciseSession(BaseModel):
    """Record of a user's exercise session."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    exercise_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    completed: bool = False
    score: Optional[float] = None
    accuracy: Optional[float] = None
    response_times: Optional[List[float]] = None  # In milliseconds
    answers: Optional[Dict] = None  # Exercise-specific answer format
    feedback: Optional[str] = None
    
    class Config:
        """Model configuration."""
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            uuid.UUID: lambda id: str(id)
        }

class TrainingPlan(BaseModel):
    """Personalized training plan for a user."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    exercises: List[str]  # List of exercise IDs
    schedule: Dict  # Recommended training schedule
    focus_areas: List[str]  # Cognitive domains to focus on
    difficulty_adjustments: Dict[str, DifficultyLevel]  # Per exercise type
    
    class Config:
        """Model configuration."""
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            uuid.UUID: lambda id: str(id)
        }

class ProgressMetrics(BaseModel):
    """User's cognitive training progress metrics."""
    user_id: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    total_sessions: int = 0
    total_time_spent: int = 0  # In seconds
    average_scores: Dict[ExerciseType, float] = Field(default_factory=dict)
    performance_trends: Dict[str, List[float]] = Field(default_factory=dict)
    strengths: List[str] = Field(default_factory=list)
    areas_for_improvement: List[str] = Field(default_factory=list)
    consistency_score: float = 0.0  # Measure of training consistency
    
    class Config:
        """Model configuration."""
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            uuid.UUID: lambda id: str(id)
        } 