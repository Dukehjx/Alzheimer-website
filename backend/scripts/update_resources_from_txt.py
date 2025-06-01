"""
Script to update MongoDB resources from resourcehub.txt file
This script parses the resourcehub.txt file and populates the database with all resources.
"""

import os
import sys
import asyncio
import re
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# MongoDB connection info
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "alzheimer_db")
COLLECTION_RESOURCES = "resources"

if not MONGODB_URI:
    print("ERROR: MONGODB_URI environment variable is not set")
    sys.exit(1)

def parse_resourcehub_txt(file_path):
    """Parse the resourcehub.txt file and extract resources."""
    resources = []
    current_category = ""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        print(f"ERROR: File {file_path} not found")
        return []
    
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            i += 1
            continue
        
        # Check if this is a category header (doesn't start with space and doesn't contain ':')
        if not lines[i].startswith(' ') and ':' not in line:
            current_category = line
            print(f"Found category: {current_category}")
            i += 1
            continue
        
        # Check if this is a resource entry (doesn't start with space and contains ':')
        if not lines[i].startswith(' ') and ':' in line:
            # Split on the first colon to separate source from title
            parts = line.split(':', 1)
            if len(parts) == 2:
                source = parts[0].strip()
                title = parts[1].strip()
                
                # Initialize variables
                description = ""
                url = ""
                
                # Look ahead for description and URL
                j = i + 1
                
                # Check next line for description (starts with space, no http)
                if j < len(lines) and lines[j].startswith(' ') and 'http' not in lines[j]:
                    description = lines[j].strip()
                    j += 1
                
                # Check next line for URL (starts with space, contains http)
                if j < len(lines) and lines[j].startswith(' ') and 'http' in lines[j]:
                    url = lines[j].strip()
                    j += 1
                
                # Create resource entry if we have required fields
                if title and current_category:
                    resource = {
                        "title": title,
                        "description": description,
                        "url": url,
                        "category": current_category
                    }
                    resources.append(resource)
                    print(f"Parsed: {title} -> {current_category}")
                
                # Move to the line after the resource entry and its associated data
                i = j - 1  # j-1 because the main loop will increment i
        
        i += 1
    
    return resources

async def update_resources_from_txt():
    """Update the database with resources from resourcehub.txt."""
    # Get the path to resourcehub.txt (should be in the root directory)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    txt_file_path = os.path.join(project_root, 'resourcehub.txt')
    
    print(f"Looking for resourcehub.txt at: {txt_file_path}")
    
    # Parse the text file
    resources = parse_resourcehub_txt(txt_file_path)
    
    if not resources:
        print("No resources found in the text file")
        return
    
    print(f"Parsed {len(resources)} resources from resourcehub.txt")
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]
    
    # Clear existing resources
    await db[COLLECTION_RESOURCES].delete_many({})
    print(f"Cleared existing resources from the {COLLECTION_RESOURCES} collection")
    
    # Add each resource to the database
    now = datetime.utcnow()
    added_count = 0
    
    for resource_data in resources:
        # Add timestamps
        resource_data["created_at"] = now
        resource_data["updated_at"] = now
        
        try:
            # Insert into database
            await db[COLLECTION_RESOURCES].insert_one(resource_data.copy())
            print(f"Added resource: {resource_data['title']}")
            added_count += 1
        except Exception as e:
            print(f"Error adding resource '{resource_data['title']}': {str(e)}")
    
    print(f"Successfully added {added_count} resources to the database.")
    
    # Print categories summary
    categories = {}
    for resource in resources:
        category = resource['category']
        categories[category] = categories.get(category, 0) + 1
    
    print("\nResources by category:")
    for category, count in categories.items():
        print(f"  {category}: {count} resources")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    # Run the update script
    try:
        # Create event loop and run the async function
        loop = asyncio.get_event_loop()
        loop.run_until_complete(update_resources_from_txt())
        print("Resource database update completed successfully.")
    except Exception as e:
        print(f"Error updating resources: {str(e)}")
        sys.exit(1) 