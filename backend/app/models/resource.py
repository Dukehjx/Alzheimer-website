"""
Resource model schema for MongoDB
"""
from datetime import datetime
from typing import Dict, Any

class Resource:
    """
    Resource model for MongoDB.
    This is just a schema definition, not an actual model class like in SQLAlchemy.
    """
    
    @staticmethod
    def get_schema() -> Dict[str, Any]:
        """
        Get the schema for a resource document.
        """
        return {
            "title": str,  # Title of the resource
            "description": str,  # Description of the resource
            "url": str,  # URL of the resource
            "category": str,  # Category of the resource
            "created_at": datetime,  # Creation timestamp
            "updated_at": datetime,  # Last update timestamp
        } 