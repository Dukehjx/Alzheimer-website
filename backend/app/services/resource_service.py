"""
Resource service for MongoDB
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.db.mongodb import get_database, COLLECTION_RESOURCES
from app.schemas.resource import ResourceCreate, ResourceUpdate

class ResourceService:
    """
    Service for handling resource operations with MongoDB.
    """
    
    @staticmethod
    async def get_all() -> List[Dict[str, Any]]:
        """
        Get all resources.
        """
        db = get_database()
        resources = await db[COLLECTION_RESOURCES].find().sort([("category", 1), ("title", 1)]).to_list(length=None)
        return resources
    
    @staticmethod
    async def get_by_id(resource_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a resource by its ID.
        """
        db = get_database()
        resource = await db[COLLECTION_RESOURCES].find_one({"_id": resource_id})
        return resource
    
    @staticmethod
    async def get_by_category(category: str) -> List[Dict[str, Any]]:
        """
        Get resources by category.
        """
        db = get_database()
        resources = await db[COLLECTION_RESOURCES].find(
            {"category": category}
        ).sort("title", 1).to_list(length=None)
        return resources
    
    @staticmethod
    async def search(query: str) -> List[Dict[str, Any]]:
        """
        Search resources by title or description.
        """
        db = get_database()
        search_regex = {"$regex": query, "$options": "i"}
        resources = await db[COLLECTION_RESOURCES].find(
            {"$or": [
                {"title": search_regex},
                {"description": search_regex}
            ]}
        ).sort([("category", 1), ("title", 1)]).to_list(length=None)
        return resources
    
    @staticmethod
    async def create(resource_in: ResourceCreate) -> Dict[str, Any]:
        """
        Create a new resource.
        """
        db = get_database()
        now = datetime.utcnow()
        
        resource = {
            "title": resource_in.title,
            "description": resource_in.description,
            "url": resource_in.url,
            "category": resource_in.category,
            "created_at": now,
            "updated_at": now
        }
        
        result = await db[COLLECTION_RESOURCES].insert_one(resource)
        resource["_id"] = result.inserted_id
        
        return resource
    
    @staticmethod
    async def update(resource_id: str, resource_in: ResourceUpdate) -> Optional[Dict[str, Any]]:
        """
        Update a resource.
        """
        db = get_database()
        resource = await ResourceService.get_by_id(resource_id)
        
        if not resource:
            return None
        
        update_data = resource_in.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await db[COLLECTION_RESOURCES].update_one(
            {"_id": resource_id},
            {"$set": update_data}
        )
        
        return await ResourceService.get_by_id(resource_id)
    
    @staticmethod
    async def delete(resource_id: str) -> bool:
        """
        Delete a resource.
        """
        db = get_database()
        result = await db[COLLECTION_RESOURCES].delete_one({"_id": resource_id})
        return result.deleted_count > 0 