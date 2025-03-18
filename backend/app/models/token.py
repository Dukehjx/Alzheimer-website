"""
Token models for authentication.
"""
from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    """Token model for API responses."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token data model for validation."""
    user_id: Optional[str] = None 