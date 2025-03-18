"""
Add a user to the MongoDB database.
For initial setup and admin user creation.
"""
import asyncio
import logging
import uuid
import os
import sys

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from passlib.context import CryptContext
from app.db import connect_to_mongodb, close_mongodb_connection, COLLECTION_USERS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def add_user(email, full_name, password):
    """Add a user to the database."""
    try:
        # Connect to MongoDB
        db = await connect_to_mongodb()
        
        # Check if user already exists
        user_collection = db[COLLECTION_USERS]
        existing_user = await user_collection.find_one({"email": email})
        
        if existing_user:
            logger.info(f"User already exists with ID: {existing_user['_id']}")
            logger.info(f"User email: {existing_user['email']}")
        else:
            # Create a new user
            user_id = str(uuid.uuid4())
            hashed_password = pwd_context.hash(password)
            
            new_user = {
                "_id": user_id,
                "email": email,
                "full_name": full_name,
                "is_active": True,
                "is_verified": True,
                "age": None,
                "hashed_password": hashed_password,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
            
            # Insert the user
            result = await user_collection.insert_one(new_user)
            logger.info(f"Created user with ID: {result.inserted_id}")
        
        # Close connection
        await close_mongodb_connection()
        logger.info("User operation completed")
    except Exception as e:
        logger.error(f"Error adding user: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python add_user.py <email> <full_name> <password>")
        print("Example: python add_user.py duke@example.com 'Duke' 'Duke0111'")
        sys.exit(1)
        
    email = sys.argv[1]
    full_name = sys.argv[2]
    password = sys.argv[3]
    
    asyncio.run(add_user(email, full_name, password)) 