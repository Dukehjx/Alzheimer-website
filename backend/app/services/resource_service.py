"""
Resource service for MongoDB
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId
from app.db.mongodb import get_database, COLLECTION_RESOURCES
from app.schemas.resource import ResourceCreate, ResourceUpdate, Resource

class ResourceService:
    """
    Service for handling resource operations with MongoDB.
    """
    
    @staticmethod
    async def get_all() -> List[Resource]:
        """
        Get all resources.
        """
        db = get_database()
        resources_data = await db[COLLECTION_RESOURCES].find().sort([("category", 1), ("title", 1)]).to_list(length=None)
        return [Resource(**data) for data in resources_data]
    
    @staticmethod
    async def get_by_id(resource_id: str) -> Optional[Resource]:
        """
        Get a resource by its ID.
        """
        db = get_database()
        try:
            obj_id = ObjectId(resource_id)
        except Exception:
            return None
        resource_data = await db[COLLECTION_RESOURCES].find_one({"_id": obj_id})
        return Resource(**resource_data) if resource_data else None
    
    @staticmethod
    async def get_by_category(category: str) -> List[Resource]:
        """
        Get resources by category.
        """
        db = get_database()
        resources_data = await db[COLLECTION_RESOURCES].find(
            {"category": category}
        ).sort("title", 1).to_list(length=None)
        return [Resource(**data) for data in resources_data]
    
    @staticmethod
    async def search(query: str) -> List[Resource]:
        """
        Search resources by title or description.
        """
        db = get_database()
        search_regex = {"$regex": query, "$options": "i"}
        resources_data = await db[COLLECTION_RESOURCES].find(
            {"$or": [
                {"title": search_regex},
                {"description": search_regex}
            ]}
        ).sort([("category", 1), ("title", 1)]).to_list(length=None)
        return [Resource(**data) for data in resources_data]
    
    @staticmethod
    async def create(resource_in: ResourceCreate) -> Resource:
        """
        Create a new resource.
        """
        db = get_database()
        now = datetime.utcnow()
        
        resource_dict = {
            "title": resource_in.title,
            "description": resource_in.description,
            "url": resource_in.url,
            "category": resource_in.category,
            "created_at": now,
            "updated_at": now
        }
        
        result = await db[COLLECTION_RESOURCES].insert_one(resource_dict)
        created_resource_data = await db[COLLECTION_RESOURCES].find_one({"_id": result.inserted_id})
        return Resource(**created_resource_data) if created_resource_data else None
    
    @staticmethod
    async def update(resource_id: str, resource_in: ResourceUpdate) -> Optional[Resource]:
        """
        Update a resource.
        """
        db = get_database()
        try:
            obj_id = ObjectId(resource_id)
        except Exception:
            return None
        
        update_data = resource_in.dict(exclude_unset=True)
        if not update_data:
            existing_resource_data = await db[COLLECTION_RESOURCES].find_one({"_id": obj_id})
            return Resource(**existing_resource_data) if existing_resource_data else None

        update_data["updated_at"] = datetime.utcnow()
        
        result = await db[COLLECTION_RESOURCES].update_one(
            {"_id": obj_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0 and result.matched_count == 0:
            return None

        updated_resource_data = await db[COLLECTION_RESOURCES].find_one({"_id": obj_id})
        return Resource(**updated_resource_data) if updated_resource_data else None
    
    @staticmethod
    async def delete(resource_id: str) -> bool:
        """
        Delete a resource.
        """
        db = get_database()
        try:
            obj_id = ObjectId(resource_id)
        except Exception:
            return False
            
        result = await db[COLLECTION_RESOURCES].delete_one({"_id": obj_id})
        return result.deleted_count > 0 