"""
API endpoints for resources
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.errors import InvalidId

from app.services.resource_service import ResourceService
from app.schemas.resource import Resource, ResourceCreate, ResourceUpdate, ResourceList

router = APIRouter()

@router.get("/", response_model=ResourceList)
async def get_resources():
    """
    Retrieve all resources.
    """
    resources = await ResourceService.get_all()
    return {"resources": resources}

@router.get("/categories/{category}", response_model=ResourceList)
async def get_resources_by_category(category: str):
    """
    Retrieve resources by category.
    """
    resources = await ResourceService.get_by_category(category)
    return {"resources": resources}

@router.get("/search", response_model=ResourceList)
async def search_resources(query: str = Query(..., min_length=1)):
    """
    Search resources by title or description.
    """
    resources = await ResourceService.search(query)
    return {"resources": resources}

@router.get("/{resource_id}", response_model=Resource)
async def get_resource(resource_id: str):
    """
    Get a specific resource by ID.
    """
    try:
        obj_id = ObjectId(resource_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid resource ID format")
    
    resource = await ResourceService.get_by_id(obj_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.post("/", response_model=Resource)
async def create_resource(resource_in: ResourceCreate):
    """
    Create a new resource.
    """
    return await ResourceService.create(resource_in)

@router.put("/{resource_id}", response_model=Resource)
async def update_resource(resource_id: str, resource_in: ResourceUpdate):
    """
    Update a resource.
    """
    try:
        obj_id = ObjectId(resource_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid resource ID format")
    
    resource = await ResourceService.update(obj_id, resource_in)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.delete("/{resource_id}")
async def delete_resource(resource_id: str):
    """
    Delete a resource.
    """
    try:
        obj_id = ObjectId(resource_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid resource ID format")
    
    result = await ResourceService.delete(obj_id)
    if not result:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"status": "success"} 