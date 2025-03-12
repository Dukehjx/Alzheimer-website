"""
Alzheimer's Detection Platform - Backend API
Main application entry point for the FastAPI application.
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.api.language_analysis import router as language_router

# Create FastAPI app
app = FastAPI(
    title="Alzheimer's Detection Platform API",
    description="Backend API for the AI-powered Alzheimer's detection and prevention platform",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(language_router)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint that returns API status."""
    return {
        "status": "online",
        "message": "Welcome to the Alzheimer's Detection Platform API",
        "version": "0.1.0",
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is functioning."""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 