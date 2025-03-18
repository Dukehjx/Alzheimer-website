"""
Authentication API routes for user registration and login.
"""
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.models.user import UserCreate, UserResponse, UserInDB
from app.utils.security import (
    authenticate_user, 
    create_access_token, 
    get_current_active_user,
    get_password_hash,
    get_user_by_email,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.db import connect_to_mongodb, get_database, COLLECTION_USERS
from app.models.token import Token, TokenData

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    responses={401: {"description": "Unauthorized"}},
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate) -> Any:
    """
    Register a new user.
    
    Args:
        user_data: The user data for registration
        
    Returns:
        The created user
        
    Raises:
        HTTPException: If a user with the same email already exists
    """
    # Check if user already exists
    db = get_database()
    existing_user = await db[COLLECTION_USERS].find_one({"email": user_data.email})
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Create user
    user_in_db = UserInDB(
        **user_data.dict(exclude={"password"}),
        hashed_password=get_password_hash(user_data.password)
    )
    
    # Insert user into database
    await db[COLLECTION_USERS].insert_one(user_in_db.dict())
    
    return UserResponse(
        id=user_in_db.id,
        email=user_in_db.email,
        full_name=user_in_db.full_name,
        is_active=user_in_db.is_active,
        is_verified=user_in_db.is_verified,
        age=user_in_db.age,
        created_at=user_in_db.created_at
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    
    Args:
        form_data: The OAuth2 form data containing username (email) and password
        
    Returns:
        An access token and token type
        
    Raises:
        HTTPException: If the credentials are invalid
    """
    user = await authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    # Update last login timestamp
    db = get_database()
    await db[COLLECTION_USERS].update_one(
        {"_id": user.id},
        {"$set": {"last_login": user.updated_at}}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserInDB = Depends(get_current_active_user)) -> Any:
    """
    Get current user information.
    
    Args:
        current_user: The current user from the JWT token
        
    Returns:
        The current user information
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        age=current_user.age,
        created_at=current_user.created_at
    ) 