"""
Security utilities for JWT authentication and password handling.
"""
import os
from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import ValidationError
from dotenv import load_dotenv

from app.models.user import UserInDB
from app.db import connect_to_mongodb, get_database, COLLECTION_USERS

# Load environment variables
load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET environment variable not set")

ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# OAuth2 scheme for token validation
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify if the provided password matches the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a hash for the provided password."""
    return pwd_context.hash(password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with the provided data and expiration.
    
    Args:
        data: The data to include in the token payload
        expires_delta: Optional expiration delta; defaults to ACCESS_TOKEN_EXPIRE_MINUTES
        
    Returns:
        The encoded JWT token
    """
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Encode and return the JWT token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    """
    Get a user from the database by email.
    
    Args:
        email: The email of the user to find
        
    Returns:
        The user if found, otherwise None
    """
    db = get_database()
    user_data = await db[COLLECTION_USERS].find_one({"email": email})
    
    if user_data:
        return UserInDB(**user_data)
    return None

async def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    """
    Authenticate a user with email and password.
    
    Args:
        email: The user's email
        password: The user's password
        
    Returns:
        The authenticated user if credentials are valid, otherwise None
    """
    user = await get_user_by_email(email)
    
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    """
    Get the current user from a JWT token.
    
    Args:
        token: The JWT token from the request
        
    Returns:
        The current user
        
    Raises:
        HTTPException: If the token is invalid or the user is not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception
    
    # Get the user from the database
    db = get_database()
    user_data = await db[COLLECTION_USERS].find_one({"_id": user_id})
    
    if user_data is None:
        raise credentials_exception
    
    return UserInDB(**user_data)

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """
    Get the current active user from a JWT token.
    
    Args:
        current_user: The current user from get_current_user
        
    Returns:
        The current active user
        
    Raises:
        HTTPException: If the user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return current_user 