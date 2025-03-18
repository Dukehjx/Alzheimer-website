"""
Database module initialization.
"""
from app.db.mongodb import connect_to_mongodb, close_mongodb_connection, get_database
from app.db.mongodb import (
    COLLECTION_USERS,
    COLLECTION_ANALYSIS_RESULTS,
    COLLECTION_COGNITIVE_TRAINING,
    COLLECTION_RESOURCES
)

__all__ = [
    "connect_to_mongodb",
    "close_mongodb_connection",
    "get_database",
    "COLLECTION_USERS",
    "COLLECTION_ANALYSIS_RESULTS",
    "COLLECTION_COGNITIVE_TRAINING",
    "COLLECTION_RESOURCES"
] 