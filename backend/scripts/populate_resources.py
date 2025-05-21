"""
Script to populate the database with resource data from resourcehub.txt
Run this script to initialize the resources in the database.
"""

import os
import sys
import asyncio
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

# Resource data from resourcehub.txt
RESOURCES = [
    # Lifestyle Changes to Prevent or Slow Alzheimer's
    {
        "title": "How to Slow Alzheimer's with Lifestyle Changes",
        "description": "An intensive lifestyle program involving a vegan diet, exercise, stress management, and support groups can significantly slow cognitive decline in individuals with mild cognitive impairment or early Alzheimer's.",
        "url": "https://time.com/6986373/how-to-slow-alzheimers-lifestyle/",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    {
        "title": "Alzheimer's: Lifestyle Habit Changes Improved Brain Function",
        "description": "A study found that a vegan diet, regular walking, social connection, supplements, and stress reduction improved cognitive function in older adults with early Alzheimer's.",
        "url": "https://fortune.com/well/2024/06/07/alzheimers-lifestyle-habit-changes-improved-brain-function/",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    {
        "title": "Lifestyle Changes May Slow or Prevent Alzheimer's in People at High Risk",
        "description": "Adopting a whole-foods plant-based diet, regular exercise, stress management, and support groups can help maintain cognitive function in those with mild cognitive impairment or early dementia.",
        "url": "https://www.usnews.com/news/health-news/articles/2024-06-07/lifestyle-changes-may-slow-or-prevent-alzheimers-in-people-at-high-risk",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    {
        "title": "Can Health & Lifestyle Changes Protect Elders From Alzheimer's?",
        "description": "This article discusses how lifestyle changes such as diet, exercise, and cognitive stimulation may help protect elders from Alzheimer's disease.",
        "url": "https://www.ucsf.edu/news/2023/11/426636/can-health-lifestyle-changes-protect-elders-alzheimers",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    {
        "title": "Reducing Risk for Dementia",
        "description": "Staying physically active, managing diabetes and blood pressure, and preventing hearing loss can help reduce dementia risk.",
        "url": "https://www.cdc.gov/alzheimers-dementia/prevention/index.html",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    {
        "title": "Association of Healthy Lifestyles With Risk of Alzheimer Disease",
        "description": "Engaging in nonsmoking, regular exercise, healthy diets, and moderate alcohol intake can reduce Alzheimer's risk.",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9502739/",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    {
        "title": "Dietary and Lifestyle Guidelines for the Prevention of Alzheimer's",
        "description": "Minimizing saturated and trans fats, found in dairy products and processed foods, is recommended to prevent Alzheimer's.",
        "url": "https://www.sciencedirect.com/science/article/pii/S0197458014003480",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    {
        "title": "Alzheimer's Study Finds Diet, Lifestyle Changes Yield Improvements",
        "description": "Intensive diet and lifestyle changes, including aerobic exercise and stress reduction, can improve cognitive outcomes related to Alzheimer's.",
        "url": "https://news.harvard.edu/gazette/story/2024/07/alzheimers-study-finds-diet-lifestyle-changes-yield-improvements/",
        "category": "Lifestyle Changes to Prevent or Slow Alzheimer's"
    },
    
    # Activities and Therapies for Alzheimer's
    {
        "title": "Activities for Alzheimer's: What to Do",
        "description": "Engaging in stimulating activities can help people with Alzheimer's maintain cognitive function and improve their quality of life.",
        "url": "https://www.healthline.com/health/alzheimers/activities-for-alzheimers",
        "category": "Activities and Therapies for Alzheimer's"
    },
    {
        "title": "Therapeutic Activities for Alzheimer's Disease",
        "description": "This article explores various therapeutic activities that can benefit individuals with Alzheimer's disease by promoting cognitive and emotional well-being.",
        "url": "https://www.webmd.com/alzheimers/therapeutic-activities-alzheimers-disease",
        "category": "Activities and Therapies for Alzheimer's"
    },
    {
        "title": "Activity Ideas for Dementia",
        "description": "This resource provides a list of activity ideas to help people with dementia stay engaged and independent.",
        "url": "https://www.alzheimers.org.uk/get-support/staying-independent/activity-ideas-dementia",
        "category": "Activities and Therapies for Alzheimer's"
    },
    
    # Detection and Symptoms of Alzheimer's
    {
        "title": "10 Early Signs and Symptoms of Alzheimer's",
        "description": "This page lists ten common warning signs of Alzheimer's disease.",
        "url": "https://www.alz.org/alzheimers-dementia/10_signs",
        "category": "Detection and Symptoms of Alzheimer's"
    },
    {
        "title": "All About the SAGE Test for Alzheimer's and Dementia Detection",
        "description": "The Self-Administered Gerocognitive Exam (SAGE) is a test that can help detect early signs of Alzheimer's and dementia.",
        "url": "https://www.everydayhealth.com/alzheimers-disease/all-about-the-sage-test-for-alzheimers-and-dementia-detection/",
        "category": "Detection and Symptoms of Alzheimer's"
    },
    {
        "title": "Alzheimer's Disease Symptoms",
        "description": "This page describes the symptoms of Alzheimer's disease, including memory problems, confusion, and changes in behavior.",
        "url": "https://www.nhs.uk/conditions/alzheimers-disease/symptoms/",
        "category": "Detection and Symptoms of Alzheimer's"
    },
    {
        "title": "SAGE Test",
        "description": "The SAGE test is a self-administered test used to evaluate cognitive function and detect early signs of memory disorders like Alzheimer's.",
        "url": "https://wexnermedical.osu.edu/brain-spine-neuro/memory-disorders/sage",
        "category": "Detection and Symptoms of Alzheimer's"
    },
    {
        "title": "Memory Self-Test via Smartphone",
        "description": "A smartphone-based memory self-test can help identify early signs of Alzheimer's disease.",
        "url": "https://www.dzne.de/en/news/press-releases/press/memory-self-test-via-smartphone-can-identify-early-signs-of-alzheimers-disease/",
        "category": "Detection and Symptoms of Alzheimer's"
    },
    {
        "title": "Checklist for Dementia Symptoms",
        "description": "This checklist helps identify potential dementia symptoms and suggests seeking professional evaluation.",
        "url": "https://www.alzheimers.org.uk/form/checklist-for-dementia-symptoms",
        "category": "Detection and Symptoms of Alzheimer's"
    },
    {
        "title": "What Are the Signs of Alzheimer's Disease?",
        "description": "This resource outlines the signs and symptoms of Alzheimer's disease, as well as how the disease is diagnosed.",
        "url": "https://www.nia.nih.gov/health/alzheimers-symptoms-and-diagnosis/what-are-signs-alzheimers-disease",
        "category": "Detection and Symptoms of Alzheimer's"
    }
]

async def populate_resources():
    """Populate the database with resource data."""
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]
    
    # Clear existing resources
    await db[COLLECTION_RESOURCES].delete_many({})
    print(f"Cleared existing resources from the {COLLECTION_RESOURCES} collection")
    
    # Add each resource to the database
    now = datetime.utcnow()
    
    for resource_data in RESOURCES:
        # Add timestamps
        resource_data["created_at"] = now
        resource_data["updated_at"] = now
        
        # Insert into database
        await db[COLLECTION_RESOURCES].insert_one(resource_data)
        
        print(f"Added resource: {resource_data['title']}")
    
    print(f"Successfully added {len(RESOURCES)} resources to the database.")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    # Run the population script
    try:
        # Create event loop and run the async function
        loop = asyncio.get_event_loop()
        loop.run_until_complete(populate_resources())
        print("Resource database population completed successfully.")
    except Exception as e:
        print(f"Error populating resources: {str(e)}")
        sys.exit(1) 