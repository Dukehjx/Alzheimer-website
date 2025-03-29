"""MongoDB database connection and utilities."""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from typing import Optional

# Database constants
COLLECTION_USERS = "users"
COLLECTION_ASSESSMENTS = "assessments"
COLLECTION_RESOURCES = "resources"
COLLECTION_TRAINING_SESSIONS = "training_sessions"
COLLECTION_USER_METRICS = "user_metrics"
COLLECTION_JOURNAL_ENTRIES = "journal_entries"
COLLECTION_ANALYSIS_RESULTS = "analysis_results"
COLLECTION_COGNITIVE_TRAINING = "cognitive_training"

# Global db client
_db_client: Optional[AsyncIOMotorClient] = None
_db = None

def get_database():
    """Get MongoDB database instance."""
    if _db is None:
        initialize_db()
    return _db

def initialize_db():
    """Initialize MongoDB connection."""
    global _db_client, _db
    
    # Get connection string from environment variables
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB", "alzheimer_app")
    
    # Create MongoDB client
    _db_client = AsyncIOMotorClient(mongo_uri)
    _db = _db_client[db_name]
    
    try:
        # Verify connection
        _db_client.admin.command('ping')
        print(f"Connected to MongoDB: {mongo_uri}")
    except ConnectionFailure:
        print("Failed to connect to MongoDB")
        raise

async def close_db():
    """Close MongoDB connection."""
    if _db_client is not None:
        _db_client.close()
        print("Closed MongoDB connection") 