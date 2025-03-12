"""
User Models

This module defines the data models for users of the Alzheimer's detection platform.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    """Base user model with common attributes."""
    email: EmailStr
    first_name: str
    last_name: str
    date_of_birth: Optional[datetime] = None
    is_active: bool = True
    
class UserCreate(UserBase):
    """User model for creation, including password."""
    password: str

class UserResponse(UserBase):
    """User model for API responses, excluding sensitive data."""
    id: str
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True

class UserProfile(UserResponse):
    """Extended user model with profile information."""
    age: Optional[int] = None
    gender: Optional[str] = None
    education_level: Optional[str] = None
    medical_history: Optional[List[str]] = Field(default_factory=list)
    family_history_of_alzheimers: Optional[bool] = None
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True

class UserSettings(BaseModel):
    """User preferences and settings."""
    user_id: str
    notification_preferences: dict = Field(default_factory=dict)
    privacy_settings: dict = Field(default_factory=dict)
    theme: str = "light"
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True

class UserInDB(UserBase):
    """User model as stored in the database, including hashed password."""
    id: str
    hashed_password: str
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True 