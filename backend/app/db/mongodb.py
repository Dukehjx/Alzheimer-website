"""
MongoDB connection and configuration module.
"""
import os
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# MongoDB connection variables
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "alzheimer_db")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is not set")

# MongoDB Client
mongodb_client: Optional[AsyncIOMotorClient] = None
database = None

async def connect_to_mongodb():
    """Connect to MongoDB Atlas."""
    global mongodb_client, database
    try:
        mongodb_client = AsyncIOMotorClient(MONGODB_URI)
        # Verify the connection is successful
        await mongodb_client.admin.command("ping")
        database = mongodb_client[MONGODB_DB_NAME]
        logger.info(f"Connected to MongoDB database: {MONGODB_DB_NAME}")
        return database
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongodb_connection():
    """Close MongoDB connection."""
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()
        logger.info("MongoDB connection closed")

def get_database():
    """Get database instance."""
    if database is None:
        raise ConnectionError("Database connection not established. Call connect_to_mongodb() first.")
    return database

# Define collection names as constants for better maintainability
COLLECTION_USERS = "users"
COLLECTION_ANALYSIS_RESULTS = "analysis_results"
COLLECTION_COGNITIVE_TRAINING = "cognitive_training"
COLLECTION_RESOURCES = "resources"
COLLECTION_TRAINING_SESSIONS = "training_sessions"
COLLECTION_USER_METRICS = "user_metrics"
COLLECTION_JOURNAL_ENTRIES = "journal_entries" 