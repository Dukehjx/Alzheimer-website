"""
AI analysis API routes.

This module provides endpoints for AI-powered text analysis and cognitive risk assessment.
"""

from fastapi import APIRouter, Depends, HTTPException, Body, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer
from typing import Dict, Any, Optional
import logging
from datetime import datetime
import uuid
from pydantic import BaseModel, Field

from app.models.analysis import AnalysisResult, AnalysisType, CognitiveDomain
from app.utils.security import get_current_user
from app.db import get_database
from app.models.user import UserInDB
from app.ai.factory import analyze_text, set_model

# Initialize router
router = APIRouter(
    prefix="/api/ai",
    tags=["AI Analysis"],
    responses={404: {"description": "Not found"}},
)

# Initialize logger
logger = logging.getLogger(__name__)

# Analysis database model
class AnalysisInDB(BaseModel):
    """Analysis record for database storage."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    text: str
    cognitive_score: float
    domain_scores: Dict[CognitiveDomain, float]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    analysis_type: AnalysisType
    confidence_score: float
    recommendations: list[str]

@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_text_endpoint(
    text: str = Body(..., embed=True),
    analysis_type: AnalysisType = Body(AnalysisType.TEXT, embed=True),
    include_features: bool = Body(False, embed=True),
    request_id: Optional[str] = Body(None, embed=True),
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Analyze text for cognitive risk assessment.
    
    This endpoint uses AI models to analyze text input and
    return a cognitive risk assessment.
    
    Args:
        text: The text to analyze
        analysis_type: The type of analysis to perform
        include_features: Whether to include detailed linguistic features in response
        request_id: Unique identifier for the request to avoid caching
        current_user: The authenticated user
        db: Database connection
        
    Returns:
        Analysis results
    """
    try:
        # Log the request
        logger.info(f"Analysis request received: ID={request_id}, length={len(text)}, start={text[:20]}")
        
        # Validate input
        if not text or len(text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Text input too short. Please provide at least 10 characters."
            )
        
        # Call AI model to analyze text
        results = analyze_text(text, include_features)
        
        if not results.get("success", False):
            logger.error(f"Analysis failed: {results.get('error')}")
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {results.get('error', 'Unknown error')}"
            )
        
        # Create analysis record
        domain_scores = {
            CognitiveDomain(k): float(v) 
            for k, v in results.get("domain_scores", {}).items()
        }
        
        # Store results in database
        analysis_record = AnalysisInDB(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            text=text,
            cognitive_score=results.get("overall_score", 0.0),
            domain_scores=domain_scores,
            timestamp=datetime.now(),
            analysis_type=analysis_type,
            confidence_score=results.get("confidence_score", 0.0),
            recommendations=results.get("recommendations", [])
        )
        
        await db.analyses.insert_one(analysis_record.dict())
        
        # Return the analysis results
        response = {
            "success": True,
            "analysis_id": analysis_record.id,
            "overall_score": results.get("overall_score", 0.0),
            "confidence_score": results.get("confidence_score", 0.0),
            "domain_scores": results.get("domain_scores", {}),
            "recommendations": results.get("recommendations", []),
            "timestamp": analysis_record.timestamp.isoformat()
        }
        
        # Include detailed features if requested
        if include_features:
            response["features"] = results.get("features", {})
        
        return response
    
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        logger.error(f"Error in analysis endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during analysis: {str(e)}"
        )

@router.post("/set-model")
async def set_model_endpoint(
    model_type: str = Body(..., embed=True),
    api_key: Optional[str] = Body(None, embed=True),
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Set the AI model to use for analysis.
    
    Args:
        model_type: The type of model to use ('spacy' or 'gpt4')
        api_key: API key for GPT-4 (required if model_type is 'gpt4')
        current_user: The authenticated user
        
    Returns:
        Success message
    """
    # Check if user has admin role
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can change the AI model"
        )
    
    try:
        success = set_model(model_type, api_key)
        
        if not success:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to set model to {model_type}. Check if API key is valid."
            )
        
        return {"success": True, "message": f"Model set to {model_type}"}
    
    except Exception as e:
        logger.error(f"Error setting model: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while setting the model: {str(e)}"
        )

@router.get("/history")
async def get_analysis_history(
    limit: int = 10,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Get analysis history for the current user.
    
    Args:
        limit: Maximum number of results to return
        current_user: The authenticated user
        db: Database connection
        
    Returns:
        List of analysis results
    """
    try:
        # Get analysis history from database
        cursor = db.analyses.find(
            {"user_id": current_user.id}
        ).sort("timestamp", -1).limit(limit)
        
        history = []
        async for doc in cursor:
            # Convert ObjectId to string for JSON serialization
            doc["_id"] = str(doc["_id"])
            # Convert datetime to ISO format
            if "timestamp" in doc:
                doc["timestamp"] = doc["timestamp"].isoformat()
            history.append(doc)
        
        return history
    
    except Exception as e:
        logger.error(f"Error fetching analysis history: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching analysis history: {str(e)}"
        ) 