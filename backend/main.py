"""
Alzheimer's Detection Platform - Backend API
Main application entry point for the FastAPI application.
"""

import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

# Import routers
from app.api import auth_router, language_router, cognitive_training_router, resources_router, ai_router

# Import database utilities
from app.db import connect_to_mongodb, close_mongodb_connection

# Import OpenAI initialization
from app.ai.openai_init import initialize_openai_api

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.getLevelName(os.getenv("LOG_LEVEL", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Define lifespan context manager for database connections
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for database connections and API initialization."""
    # Startup: Connect to MongoDB
    logger.info("Connecting to MongoDB...")
    await connect_to_mongodb()
    
    # Initialize OpenAI API
    logger.info("Initializing OpenAI API with your API key...")
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        logger.info(f"API key found (starts with: {api_key[:8]}...)")
        if initialize_openai_api():
            logger.info("OpenAI API initialized successfully and GPT-4o model is set as default.")
            
            # Display current model configuration
            from app.ai.factory import model_factory
            current_model = model_factory.get_current_model_type()
            logger.info(f"Current AI model set to: {current_model}")
        else:
            logger.warning("Failed to initialize OpenAI API. Some features may not work properly.")
    else:
        logger.warning("No OpenAI API key found in environment variables.")
    
    yield
    
    # Shutdown: Close MongoDB connection
    logger.info("Closing MongoDB connection...")
    await close_mongodb_connection()

# Create FastAPI app
app = FastAPI(
    title="NeuroAegis Platform API",
    description="Backend API for the AI-powered Alzheimer's detection and prevention platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Favicon endpoint
@app.get("/favicon.ico")
async def get_favicon():
    """Serve the favicon.ico file."""
    return FileResponse("static/favicon.ico")

# Include routers
api_prefix = os.getenv("API_PREFIX", "/api/v1")
app.include_router(auth_router, prefix=api_prefix)
app.include_router(language_router, prefix=api_prefix)
app.include_router(cognitive_training_router, prefix=api_prefix)
app.include_router(resources_router, prefix=f"{api_prefix}/resources")
app.include_router(ai_router)  # AI router already has prefix defined

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
    
    # Convert validation errors to a serializable format
    error_details = []
    for error in exc.errors():
        error_dict = {
            "loc": error.get("loc", []),
            "msg": error.get("msg", ""),
            "type": error.get("type", "")
        }
        error_details.append(error_dict)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": "Validation error", "details": error_details},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal server error"},
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint that returns API status."""
    return {
        "status": "online",
        "message": "Welcome to the NeuroAegis Platform API",
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