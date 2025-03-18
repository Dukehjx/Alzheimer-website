"""
Test importing modules to verify they are correctly set up.
"""
import importlib
import pkgutil

def test_imports():
    """Test importing all modules."""
    # Test importing database modules
    from app.db import connect_to_mongodb, close_mongodb_connection
    
    # Test importing models
    from app.models.user import UserCreate, UserInDB, UserResponse
    from app.models.token import Token, TokenData
    from app.models.analysis import AnalysisType, LanguageMetrics
    
    # Test importing API routes
    from app.api import auth_router, language_router
    
    # Test importing security utilities
    from app.utils.security import (
        verify_password,
        get_password_hash,
        create_access_token,
        get_user_by_email,
        authenticate_user
    )
    
    print("All imports successful!")

if __name__ == "__main__":
    test_imports() 