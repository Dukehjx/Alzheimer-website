"""
User models for authentication and profile data.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, validator
import uuid

class UserBase(BaseModel):
    """Base user model with common fields."""
    email: EmailStr
    is_active: bool = True
    is_verified: bool = False
    full_name: str
    age: Optional[int] = None
    
    class Config:
        """Model configuration."""
        populate_by_name = True

class UserCreate(UserBase):
    """User creation model with password."""
    password: str
    
    @validator('password')
    def password_strength(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

class UserInDB(UserBase):
    """User model as stored in database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        """Model configuration."""
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            uuid.UUID: lambda id: str(id)
        }

class UserUpdate(BaseModel):
    """User update model with optional fields."""
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    is_active: Optional[bool] = None
    
    class Config:
        """Model configuration."""
        populate_by_name = True

class UserResponse(UserBase):
    """User data for API responses."""
    id: str
    created_at: datetime
    
    class Config:
        """Model configuration."""
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            uuid.UUID: lambda id: str(id)
        }

class UserProfile(UserResponse):
    """Extended user model with profile information."""
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