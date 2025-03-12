"""
Alzheimer's Detection Platform - Backend API
Main application entry point for the FastAPI application.
"""

import os
import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add the directory containing this file to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Check if running on Vercel
is_vercel = os.getenv("VERCEL", "0") == "1"

# Import routers - use try/except to handle potential import errors gracefully
try:
    from backend.app.api.language_analysis import router as language_router
    ROUTER_IMPORT_SUCCESS = True
except ImportError as e:
    print(f"Warning: Could not import language_router: {e}")
    ROUTER_IMPORT_SUCCESS = False

# Create FastAPI app
app = FastAPI(
    title="Alzheimer's Detection Platform API",
    description="Backend API for the AI-powered Alzheimer's detection and prevention platform",
    version="0.1.0",
)

# Configure CORS - Adjust for production
frontend_url = os.getenv("FRONTEND_URL", "*")
allowed_origins = [frontend_url]
if frontend_url == "*":
    allowed_origins = ["*"]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers only if import was successful
if ROUTER_IMPORT_SUCCESS:
    app.include_router(language_router)

# Add error handler for graceful error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": f"An unexpected error occurred: {str(exc)}",
            "type": str(type(exc).__name__)
        }
    )

# Root endpoint
@app.get("/api")
async def root():
    """Root endpoint that returns API status."""
    return {
        "status": "online",
        "message": "Welcome to the Alzheimer's Detection Platform API",
        "version": "0.1.0",
        "environment": os.getenv("VERCEL_ENV", "development"),
        "router_import_success": ROUTER_IMPORT_SUCCESS,
        "deployment_type": "lightweight" if is_vercel else "full"
    }

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify API is functioning."""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True) 