"""
Script to clean up resources that have URLs as titles
"""
import asyncio
import sys
import os

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.mongodb import connect_to_mongodb, close_mongodb_connection, get_database, COLLECTION_RESOURCES

async def cleanup_resources():
    """Remove resources that have URLs as titles."""
    try:
        print("Connecting to MongoDB...")
        await connect_to_mongodb()
        
        db = get_database()
        
        # Find resources where title starts with "http" or "//"
        url_title_resources = await db[COLLECTION_RESOURCES].find({
            "$or": [
                {"title": {"$regex": "^https?://"}},
                {"title": {"$regex": "^//"}}
            ]
        }).to_list(length=None)
        
        print(f"Found {len(url_title_resources)} resources with URLs as titles")
        
        if url_title_resources:
            # Delete these resources
            result = await db[COLLECTION_RESOURCES].delete_many({
                "$or": [
                    {"title": {"$regex": "^https?://"}},
                    {"title": {"$regex": "^//"}}
                ]
            })
            
            print(f"Deleted {result.deleted_count} resources with URL titles")
        
        # Count remaining resources
        remaining_count = await db[COLLECTION_RESOURCES].count_documents({})
        print(f"Remaining resources: {remaining_count}")
        
        return True
        
    except Exception as e:
        print(f"Error cleaning up resources: {str(e)}")
        return False
    finally:
        await close_mongodb_connection()

if __name__ == "__main__":
    success = asyncio.run(cleanup_resources())
    if success:
        print("✅ Resource cleanup completed successfully!")
    else:
        print("❌ Resource cleanup failed!")
        sys.exit(1) 