"""
Vercel serverless function entry point for the Alzheimer's Detection Platform API.
This file is the main entry point for Vercel's Python serverless functions.
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import sys
import os

# Add the parent directory to the path so we can import from the main application
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the main application
from main import app

# Function that will be called by Vercel
async def handler(request: Request):
    """Process incoming request and route it through the FastAPI application."""
    return await app(request.scope, request._receive, request._send)

# Add a simple health check endpoint
@app.get("/api/healthcheck")
async def healthcheck():
    """Simple health check endpoint for Vercel."""
    return {"status": "healthy", "deployment": "vercel"} 