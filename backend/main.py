"""
Alzheimer's Detection Platform - Backend API
Main application entry point for the FastAPI application.
"""

import logging
import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from dotenv import load_dotenv

# Import routers
from app.api import auth_router, language_router

# Import database utilities
from app.db import connect_to_mongodb, close_mongodb_connection

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.getLevelName(os.getenv("LOG_LEVEL", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

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
api_prefix = os.getenv("API_PREFIX", "/api/v1")
app.include_router(auth_router, prefix=api_prefix)
app.include_router(language_router, prefix=api_prefix)

# Error handling
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions."""
    logger.error(f"HTTP error: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors."""
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": "Validation error", "details": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal server error"},
    )

# Database connection events
@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on application startup."""
    logger.info("Connecting to MongoDB...")
    await connect_to_mongodb()

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on application shutdown."""
    logger.info("Closing MongoDB connection...")
    await close_mongodb_connection()

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
    import uvicorn
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=int(os.getenv("PORT", 8000)), 
        reload=os.getenv("ENVIRONMENT") == "development"
    ) 