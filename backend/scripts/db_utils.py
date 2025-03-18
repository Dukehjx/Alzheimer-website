"""
Database utilities for maintenance and administration.
"""
import asyncio
import logging
import os
import sys
import argparse

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import connect_to_mongodb, close_mongodb_connection
from app.db import (
    COLLECTION_USERS,
    COLLECTION_ANALYSIS_RESULTS,
    COLLECTION_COGNITIVE_TRAINING,
    COLLECTION_RESOURCES
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

async def list_collections():
    """List all collections in the database."""
    try:
        db = await connect_to_mongodb()
        collections = await db.list_collection_names()
        logger.info(f"Collections in database: {collections}")
        await close_mongodb_connection()
    except Exception as e:
        logger.error(f"Error listing collections: {e}")

async def count_documents():
    """Count documents in each collection."""
    try:
        db = await connect_to_mongodb()
        
        collections_to_check = [
            COLLECTION_USERS,
            COLLECTION_ANALYSIS_RESULTS,
            COLLECTION_COGNITIVE_TRAINING,
            COLLECTION_RESOURCES
        ]
        
        for collection_name in collections_to_check:
            count = await db[collection_name].count_documents({})
            logger.info(f"Collection '{collection_name}' has {count} documents")
        
        await close_mongodb_connection()
    except Exception as e:
        logger.error(f"Error counting documents: {e}")

async def delete_collection(collection_name):
    """Delete a collection from the database."""
    try:
        db = await connect_to_mongodb()
        
        if collection_name == "all":
            collections = await db.list_collection_names()
            for coll in collections:
                await db.drop_collection(coll)
                logger.info(f"Dropped collection: {coll}")
        else:
            await db.drop_collection(collection_name)
            logger.info(f"Dropped collection: {collection_name}")
        
        await close_mongodb_connection()
    except Exception as e:
        logger.error(f"Error deleting collection: {e}")

def main():
    """Parse arguments and run the appropriate function."""
    parser = argparse.ArgumentParser(description="Database utilities")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # List collections command
    subparsers.add_parser("list", help="List all collections")
    
    # Count documents command
    subparsers.add_parser("count", help="Count documents in each collection")
    
    # Delete collection command
    delete_parser = subparsers.add_parser("delete", help="Delete a collection")
    delete_parser.add_argument("collection", help="Collection name or 'all' to delete all collections")
    
    args = parser.parse_args()
    
    if args.command == "list":
        asyncio.run(list_collections())
    elif args.command == "count":
        asyncio.run(count_documents())
    elif args.command == "delete":
        asyncio.run(delete_collection(args.collection))
    else:
        parser.print_help()

if __name__ == "__main__":
    main() 