"""
Pydantic schemas for resources
"""
from typing import Optional, List, Any, Annotated
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field, HttpUrl, BeforeValidator, ConfigDict

# Custom validator for ObjectId
def validate_object_id(v: Any) -> ObjectId:
    if isinstance(v, ObjectId):
        return v
    if isinstance(v, str) and ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")

# Annotated type for ObjectId
PyObjectId = Annotated[ObjectId, BeforeValidator(validate_object_id)]

# Base Resource schema
class ResourceBase(BaseModel):
    title: str
    description: str
    url: str
    category: str

# Schema for creating a new resource
class ResourceCreate(ResourceBase):
    pass

# Schema for updating a resource
class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    category: Optional[str] = None

# Schema for resource in DB
class Resource(ResourceBase):
    id: PyObjectId = Field(default_factory=ObjectId, alias="_id")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    )

# Schema for listing resources
class ResourceList(BaseModel):
    resources: List[Resource]

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    ) 