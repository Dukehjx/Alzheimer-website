"""Simple test script to verify imports are working correctly."""

# Import modules to verify they can be imported
import uvicorn
import fastapi
from fastapi import FastAPI
from app.api.language_analysis import router as language_router

print("All imports successful!")
print(f"FastAPI version: {fastapi.__version__}")
print(f"Language router routes: {[route.path for route in language_router.routes]}") 