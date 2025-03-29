"""
API routes for cognitive training exercises.
Implements endpoints for Word Recall Challenge and Language Fluency Game.
"""
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from pydantic import BaseModel

from app.models.training import (
    DifficultyLevel,
    Exercise,
    ExerciseSession,
    ExerciseType,
    ProgressMetrics
)
from app.services.cognitive_training_service import CognitiveTrainingService
from app.utils.security import get_current_user
from app.models.user import UserInDB
from app.db import get_database, COLLECTION_TRAINING_SESSIONS

router = APIRouter(prefix="/cognitive-training", tags=["cognitive-training"])

# Request and response models
class ExerciseRequest(BaseModel):
    """Request model for generating exercises."""
    difficulty: DifficultyLevel
    exercise_type: ExerciseType

class WordRecallAnswerRequest(BaseModel):
    """Request model for submitting word recall answers."""
    exercise_id: str
    recalled_words: List[str]
    duration: Optional[int] = None  # Time taken in seconds

class LanguageAnswerData(BaseModel):
    """Model for language fluency answers for a single category."""
    words: List[str]

class LanguageFluencyAnswerRequest(BaseModel):
    """Request model for submitting language fluency answers."""
    exercise_id: str
    answers: Dict[str, List[str]]  # Category name -> list of words
    duration: Optional[int] = None  # Time taken in seconds

class ExerciseResultResponse(BaseModel):
    """Response model for exercise evaluation results."""
    score: float
    accuracy: float
    feedback: str
    details: Dict  # Exercise-specific details
    session_id: str

@router.post("/exercises", response_model=Exercise, summary="Generate a new cognitive training exercise")
async def generate_exercise(
    request: ExerciseRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Generate a new cognitive training exercise based on type and difficulty.
    
    - **difficulty**: Difficulty level of the exercise (beginner, intermediate, advanced, expert)
    - **exercise_type**: Type of exercise (word_recall, language_fluency)
    """
    if request.exercise_type == ExerciseType.WORD_RECALL:
        exercise = CognitiveTrainingService.generate_word_recall_exercise(request.difficulty)
    elif request.exercise_type == ExerciseType.LANGUAGE_FLUENCY:
        exercise = CognitiveTrainingService.generate_language_fluency_exercise(request.difficulty)
    else:
        raise HTTPException(status_code=400, detail="Unsupported exercise type")
    
    # In a real implementation, save the exercise to a database here
    return exercise

@router.get("/exercises/{exercise_id}", response_model=Exercise, summary="Get a specific exercise")
async def get_exercise(
    exercise_id: str = Path(..., description="The ID of the exercise to retrieve"),
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Retrieve a specific cognitive training exercise by ID.
    
    - **exercise_id**: The ID of the exercise to retrieve
    """
    # In a real implementation, fetch the exercise from a database
    # For now, we'll return a mock error since we don't have a database implementation
    raise HTTPException(status_code=404, detail="Exercise not found")

@router.post("/word-recall/submit", response_model=ExerciseResultResponse, summary="Submit Word Recall Challenge answers")
async def submit_word_recall(
    request: WordRecallAnswerRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Submit answers for a Word Recall Challenge and get evaluation results.
    
    - **exercise_id**: ID of the Word Recall exercise
    - **recalled_words**: List of words recalled by the user
    - **duration**: Time taken to complete the exercise in seconds
    """
    # Extract difficulty from exercise_id (format: wordrecall-[timestamp]-[random]-[difficulty])
    exercise_parts = request.exercise_id.split('-')
    if len(exercise_parts) >= 4:
        difficulty_str = exercise_parts[-1]
    else:
        difficulty_str = 'beginner'
    
    # Map the difficulty string to the enum
    difficulty_map = {
        'beginner': DifficultyLevel.BEGINNER,
        'intermediate': DifficultyLevel.INTERMEDIATE,
        'advanced': DifficultyLevel.ADVANCED,
        'expert': DifficultyLevel.EXPERT
    }
    difficulty = difficulty_map.get(difficulty_str.lower(), DifficultyLevel.BEGINNER)
    
    # We need to extract the words to evaluate from the request
    # Format: wordrecall-timestamp-random-difficulty-word1-word2-word3...
    target_words = []
    if len(exercise_parts) > 4:
        # Words are included in the exercise ID
        target_words = exercise_parts[4:]
    else:
        # No words in ID, generate fallback words based on difficulty
        exercise = CognitiveTrainingService.generate_word_recall_exercise(difficulty)
        target_words = exercise.content["words"]
    
    # Create a simplified exercise with just the necessary fields for evaluation
    exercise = Exercise(
        id=request.exercise_id,
        title=f"{difficulty.capitalize()} Word Recall Challenge",
        description="Memorize a list of words, then recall as many as you can.",
        exercise_type=ExerciseType.WORD_RECALL,
        difficulty=difficulty,
        estimated_duration=90,  # Default
        instructions="Recall the words you memorized.",
        content={
            "words": target_words,
            "min_score": 0.6 if difficulty == DifficultyLevel.BEGINNER else 
                       0.65 if difficulty == DifficultyLevel.INTERMEDIATE else
                       0.7 if difficulty == DifficultyLevel.ADVANCED else 0.75
        },
        cognitive_domains=["memory", "recall", "verbal processing"]
    )
    
    # Evaluate the session
    evaluation_result = CognitiveTrainingService.evaluate_word_recall_session(
        exercise=exercise,
        user_answers=request.recalled_words
    )
    
    # Calculate actual duration
    display_time = 30 if difficulty == DifficultyLevel.BEGINNER else 25 if difficulty == DifficultyLevel.INTERMEDIATE else 20 if difficulty == DifficultyLevel.ADVANCED else 15
    recall_time = 60 if difficulty == DifficultyLevel.BEGINNER else 50 if difficulty == DifficultyLevel.INTERMEDIATE else 45 if difficulty == DifficultyLevel.ADVANCED else 40
    duration = request.duration if request.duration is not None else display_time + recall_time
    
    # Calculate start time from end time and duration
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(seconds=duration)
    
    # Create session record
    session = ExerciseSession(
        user_id=current_user.id,
        exercise_id=request.exercise_id,
        start_time=start_time,
        end_time=end_time,
        completed=True,
        score=evaluation_result["score"],
        accuracy=evaluation_result["accuracy"],
        answers={"recalled_words": request.recalled_words}
    )
    
    # Save session to database
    db = get_database()
    session_data = {
        "user_id": current_user.id,
        "exercise_id": request.exercise_id,
        "exercise_type": ExerciseType.WORD_RECALL,
        "difficulty": difficulty,
        "start_time": session.start_time,
        "end_time": session.end_time,
        "duration": duration,
        "completed": True,
        "score": evaluation_result["score"],
        "accuracy": evaluation_result["accuracy"],
        "answers": {"recalled_words": request.recalled_words},
        "details": {
            "correctly_recalled": evaluation_result["correctly_recalled"],
            "missed_words": evaluation_result["missed_words"]
        },
        "feedback": evaluation_result["feedback"],
        "created_at": datetime.utcnow()
    }
    
    result = await db[COLLECTION_TRAINING_SESSIONS].insert_one(session_data)
    session_id = str(result.inserted_id)
    
    # Update user's progress metrics
    await CognitiveTrainingService.update_progress_metrics(
        user_id=current_user.id,
        exercise_session=session,
        evaluation_result=evaluation_result,
        exercise_type=ExerciseType.WORD_RECALL
    )
    
    # Return the results
    return ExerciseResultResponse(
        score=evaluation_result["score"],
        accuracy=evaluation_result["accuracy"],
        feedback=evaluation_result["feedback"],
        details={
            "correctly_recalled": evaluation_result["correctly_recalled"],
            "missed_words": evaluation_result["missed_words"]
        },
        session_id=session_id
    )

@router.post("/language-fluency/submit", response_model=ExerciseResultResponse, summary="Submit Language Fluency Game answers")
async def submit_language_fluency(
    request: LanguageFluencyAnswerRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Submit answers for a Language Fluency Game and get evaluation results.
    
    - **exercise_id**: ID of the Language Fluency exercise
    - **answers**: Dictionary mapping categories to lists of words
    - **duration**: Time taken to complete the exercise in seconds
    """
    # Parse the exercise ID
    # Format: langfluency-timestamp-random-difficulty-letter-cat1-cat2-cat3...
    exercise_parts = request.exercise_id.split('-')
    
    # Default values in case of parsing issues
    difficulty_str = 'beginner'
    selected_letter = 'A'
    categories = []
    
    # Extract structured data from the exercise ID
    if len(exercise_parts) >= 4:
        difficulty_str = exercise_parts[3]
        
        if len(exercise_parts) >= 5:
            selected_letter = exercise_parts[4]
            
            if len(exercise_parts) >= 6:
                # Categories may contain hyphens, so we need to handle this carefully
                categories = []
                for i in range(5, len(exercise_parts)):
                    categories.append(exercise_parts[i])
    
    # Map the difficulty string to the enum
    difficulty_map = {
        'beginner': DifficultyLevel.BEGINNER,
        'intermediate': DifficultyLevel.INTERMEDIATE,
        'advanced': DifficultyLevel.ADVANCED,
        'expert': DifficultyLevel.EXPERT
    }
    difficulty = difficulty_map.get(difficulty_str.lower(), DifficultyLevel.BEGINNER)
    
    # If no categories were extracted, use fallback by generating a new exercise
    if not categories:
        fallback_exercise = CognitiveTrainingService.generate_language_fluency_exercise(difficulty)
        categories = fallback_exercise.content["categories"]
        selected_letter = fallback_exercise.content["letter"]
    
    # Set minimum words per category based on difficulty
    min_words_per_category = 3
    if difficulty == DifficultyLevel.INTERMEDIATE:
        min_words_per_category = 4
    elif difficulty == DifficultyLevel.ADVANCED:
        min_words_per_category = 5
    elif difficulty == DifficultyLevel.EXPERT:
        min_words_per_category = 6
    
    # Set time limit based on difficulty
    time_limit = 60
    if difficulty == DifficultyLevel.INTERMEDIATE:
        time_limit = 50
    elif difficulty == DifficultyLevel.ADVANCED:
        time_limit = 45
    elif difficulty == DifficultyLevel.EXPERT:
        time_limit = 40
    
    # Create a structured exercise object for evaluation
    exercise = Exercise(
        id=request.exercise_id,
        title=f"{difficulty.capitalize()} Language Fluency Game",
        description=f"Generate words starting with the letter '{selected_letter}' in different categories.",
        exercise_type=ExerciseType.LANGUAGE_FLUENCY,
        difficulty=difficulty,
        estimated_duration=time_limit + 15,
        instructions=f"You will have {time_limit} seconds to come up with at least {min_words_per_category} words for each category that start with the letter '{selected_letter}'.",
        content={
            "letter": selected_letter,
            "categories": categories,
            "time_limit": time_limit,
            "min_words_per_category": min_words_per_category
        },
        cognitive_domains=["verbal fluency", "executive function", "processing speed", "semantic memory"]
    )
    
    # Evaluate the session
    evaluation_result = CognitiveTrainingService.evaluate_language_fluency_session(
        exercise=exercise,
        user_answers=request.answers
    )
    
    # Calculate actual duration
    duration = request.duration if request.duration is not None else time_limit
    
    # Calculate start time from end time and duration
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(seconds=duration)
    
    # Create session record
    session = ExerciseSession(
        user_id=current_user.id,
        exercise_id=request.exercise_id,
        start_time=start_time,
        end_time=end_time,
        completed=True,
        score=evaluation_result["score"],
        accuracy=evaluation_result["accuracy"],
        answers={"category_answers": request.answers}
    )
    
    # Save session to database
    db = get_database()
    session_data = {
        "user_id": current_user.id,
        "exercise_id": request.exercise_id,
        "exercise_type": ExerciseType.LANGUAGE_FLUENCY,
        "difficulty": difficulty,
        "start_time": session.start_time,
        "end_time": session.end_time,
        "duration": duration,
        "completed": True,
        "score": evaluation_result["score"],
        "accuracy": evaluation_result["accuracy"],
        "answers": {"category_answers": request.answers},
        "details": {"category_results": evaluation_result["category_results"]},
        "feedback": evaluation_result["feedback"],
        "created_at": datetime.utcnow()
    }
    
    result = await db[COLLECTION_TRAINING_SESSIONS].insert_one(session_data)
    session_id = str(result.inserted_id)
    
    # Update user's progress metrics
    await CognitiveTrainingService.update_progress_metrics(
        user_id=current_user.id,
        exercise_session=session,
        evaluation_result=evaluation_result,
        exercise_type=ExerciseType.LANGUAGE_FLUENCY
    )
    
    # Return the results
    return ExerciseResultResponse(
        score=evaluation_result["score"],
        accuracy=evaluation_result["accuracy"],
        feedback=evaluation_result["feedback"],
        details={"category_results": evaluation_result["category_results"]},
        session_id=session_id
    )

@router.get("/progress", response_model=ProgressMetrics, summary="Get user's training progress metrics")
async def get_progress_metrics(
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Get the current user's cognitive training progress metrics.
    """
    # Fetch metrics from the database
    db = get_database()
    
    # Get all user's training sessions
    user_sessions = await db[COLLECTION_TRAINING_SESSIONS].find({"user_id": current_user.id}).to_list(length=100)
    
    if not user_sessions:
        # Return default metrics if user has no sessions
        return ProgressMetrics(
            user_id=current_user.id,
            total_sessions=0,
            total_time_spent=0,
            average_scores={},
            performance_trends={},
            strengths=[],
            areas_for_improvement=[],
            consistency_score=0.0
        )
    
    # Calculate metrics from sessions
    total_sessions = len(user_sessions)
    total_time_spent = sum(session.get("duration", 0) for session in user_sessions)
    
    # Calculate average scores per exercise type
    exercise_scores = {}
    for session in user_sessions:
        exercise_type = session.get("exercise_type")
        if exercise_type:
            if exercise_type not in exercise_scores:
                exercise_scores[exercise_type] = []
            exercise_scores[exercise_type].append(session.get("score", 0))
    
    average_scores = {
        ex_type: sum(scores) / len(scores) if scores else 0 
        for ex_type, scores in exercise_scores.items()
    }
    
    # Calculate performance trends (last 5 sessions per exercise type)
    performance_trends = {}
    for ex_type, scores in exercise_scores.items():
        performance_trends[ex_type] = scores[-5:] if len(scores) > 5 else scores
    
    # Determine strengths and areas for improvement
    strengths = []
    areas_for_improvement = []
    
    for ex_type, avg_score in average_scores.items():
        if avg_score >= 80:
            if ex_type == ExerciseType.WORD_RECALL:
                strengths.append("word recall")
            elif ex_type == ExerciseType.LANGUAGE_FLUENCY:
                strengths.append("verbal fluency")
        elif avg_score <= 60:
            if ex_type == ExerciseType.WORD_RECALL:
                areas_for_improvement.append("word recall")
            elif ex_type == ExerciseType.LANGUAGE_FLUENCY:
                areas_for_improvement.append("verbal fluency")
    
    # Calculate consistency score (improved implementation)
    consistency_score = 0.0
    if len(user_sessions) >= 3:
        # First, sort sessions by date
        sessions_by_date = sorted(user_sessions, key=lambda x: x.get("created_at", datetime.min))
        
        # Look at time between sessions
        time_diffs = []
        for i in range(1, len(sessions_by_date)):
            current = sessions_by_date[i].get("created_at")
            previous = sessions_by_date[i-1].get("created_at")
            if current and previous:
                diff_days = (current - previous).days
                # Cap individual differences at 14 days to prevent extreme outliers
                capped_diff = min(diff_days, 14)
                time_diffs.append(capped_diff)
        
        if time_diffs:
            # Calculate average time between sessions
            avg_diff = sum(time_diffs) / len(time_diffs)
            
            # Score formula: decreases as average gap increases (ideal is daily = 1)
            # 1 day = 1.0, 2 days = 0.9, 3 days = 0.8, etc.
            # Minimum is 0.0 if avg_diff >= 10 days
            consistency_score = max(0.0, 1.0 - (avg_diff / 10.0))
            
            # Bonus for recent activity (if most recent session is within 3 days)
            most_recent = sessions_by_date[-1].get("created_at")
            if most_recent and (datetime.utcnow() - most_recent).days <= 3:
                consistency_score = min(1.0, consistency_score + 0.1)
        else:
            consistency_score = 0.1  # Minimum if we can't calculate time diffs
    elif len(user_sessions) > 0:
        # If there are sessions but not enough for a trend
        # Give a score based on recency of the last session
        sessions_by_date = sorted(user_sessions, key=lambda x: x.get("created_at", datetime.min))
        most_recent = sessions_by_date[-1].get("created_at")
        if most_recent:
            days_since_last = (datetime.utcnow() - most_recent).days
            if days_since_last <= 1:
                consistency_score = 0.3  # Session within last day
            elif days_since_last <= 3:
                consistency_score = 0.2  # Session within last 3 days
            else:
                consistency_score = 0.1  # Older session
    
    # Ensure consistency score is between 0 and 1
    consistency_score = max(0.0, min(1.0, consistency_score))
    
    return ProgressMetrics(
        user_id=current_user.id,
        last_updated=datetime.utcnow(),
        total_sessions=total_sessions,
        total_time_spent=total_time_spent,
        average_scores=average_scores,
        performance_trends=performance_trends,
        strengths=strengths,
        areas_for_improvement=areas_for_improvement,
        consistency_score=consistency_score
    ) 