"""
Main FastAPI application for Alzheimer's detection backend.

This module sets up the FastAPI application with all routes and middleware.
"""

import sys
import os
from pathlib import Path

# Add the parent directory to the path so we can import ai_models
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Import our API routers
from app.api import language_analysis

# Create FastAPI app
app = FastAPI(
    title="Alzheimer's Early Detection API",
    description="API for detecting early signs of cognitive decline through language analysis",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(language_analysis.router)

# Serve static files for the frontend
static_files_dir = Path(__file__).parent / "static"
if not os.path.exists(static_files_dir):
    os.makedirs(static_files_dir)

app.mount("/static", StaticFiles(directory=static_files_dir), name="static")

# Serve index.html for root route
@app.get("/", include_in_schema=False)
async def serve_frontend():
    """Serve the frontend application."""
    frontend_path = static_files_dir / "index.html"
    
    # If frontend is not built yet, return a message
    if not os.path.exists(frontend_path):
        return {"message": "Frontend not built yet. Please build the frontend and copy it to the 'static' directory."}
    
    return FileResponse(frontend_path)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}

# Version endpoint
@app.get("/version", tags=["Info"])
async def version():
    """Get API version information."""
    return {
        "version": app.version,
        "title": app.title,
        "description": app.description
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 