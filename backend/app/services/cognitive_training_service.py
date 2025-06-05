"""
Service for cognitive training exercises.

Provides methods for generating and evaluating exercises.
"""
from datetime import datetime
from typing import Dict, List, Optional
import random
import string

from app.models.training import (
    DifficultyLevel,
    Exercise,
    ExerciseSession,
    ExerciseType,
    ProgressMetrics
)
from app.db import get_database, COLLECTION_USER_METRICS

class CognitiveTrainingService:
    """Service for cognitive training exercises."""
    
    @staticmethod
    def generate_word_recall_exercise(difficulty: DifficultyLevel) -> Exercise:
        """
        Generate a Word Recall exercise.
        
        Args:
            difficulty: Difficulty level of the exercise.
            
        Returns:
            Exercise: The generated exercise.
        """
        # Difficulty-based parameters
        if difficulty == DifficultyLevel.BEGINNER:
            word_count = 10
            display_time = 30
            recall_time = 60
            min_score = 0.6
            word_pool = [
                "house", "tree", "dog", "car", "book", "chair", "water", 
                "food", "sun", "ball", "cup", "door", "bird", "shoe", "fish", 
                "table", "hat", "cat", "ring", "baby"
            ]
        elif difficulty == DifficultyLevel.INTERMEDIATE:
            word_count = 15
            display_time = 25
            recall_time = 50
            min_score = 0.65
            word_pool = [
                "freedom", "science", "journey", "knowledge", "universe", 
                "beautiful", "dangerous", "important", "happiness", "education",
                "adventure", "mountain", "terrible", "wonderful", "discovery",
                "excitement", "community", "challenging", "brilliant", "peaceful"
            ]
        elif difficulty == DifficultyLevel.ADVANCED:
            word_count = 20
            display_time = 20
            recall_time = 45
            min_score = 0.7
            word_pool = [
                "algorithm", "philosophy", "correlation", "phenomenon", "microscopic",
                "innovation", "sustainability", "renaissance", "psychology", "civilization",
                "perspective", "magnificent", "substantial", "controversy", "extraordinary",
                "theoretical", "spectacular", "celebration", "imagination", "fundamental",
                "demonstration", "revolutionary", "appreciation", "consciousness", "intellectual"
            ]
        else:  # Expert
            word_count = 25
            display_time = 15
            recall_time = 40
            min_score = 0.75
            word_pool = [
                "verisimilitude", "juxtaposition", "serendipity", "magnanimous", "idiosyncrasy",
                "sycophantic", "ephemeral", "perspicacious", "obfuscation", "sesquipedalian",
                "pusillanimous", "mellifluous", "parsimonious", "quintessential", "fastidious",
                "antediluvian", "cacophonous", "prevarication", "grandiloquent", "perfunctory",
                "supercilious", "insouciance", "ubiquitous", "deleterious", "vituperative",
                "obsequious", "loquacious", "irascible", "dilettante", "surreptitious"
            ]
        
        # Randomly select words from the pool
        selected_words = random.sample(word_pool, min(word_count, len(word_pool)))
        
        # Generate a unique ID
        exercise_id = f"wordrecall-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        
        return Exercise(
            id=exercise_id,
            title=f"{difficulty.capitalize()} Word Recall Challenge",
            description="Memorize a list of words, then recall as many as you can.",
            exercise_type=ExerciseType.WORD_RECALL,
            difficulty=difficulty,
            estimated_duration=display_time + recall_time + 15,  # Extra time for setup
            instructions=f"You will be shown {word_count} words for {display_time} seconds. Memorize as many as you can, then try to recall them in any order.",
            content={
                "words": selected_words,
                "display_time": display_time,
                "recall_time": recall_time,
                "min_score": min_score
            },
            cognitive_domains=["memory", "recall", "verbal processing"]
        )
    
    @staticmethod
    def generate_language_fluency_exercise(difficulty: DifficultyLevel) -> Exercise:
        """
        Generate a Language Fluency exercise.
        
        Args:
            difficulty: Difficulty level of the exercise.
            
        Returns:
            Exercise: The generated exercise.
        """
        # Define categories for different difficulty levels
        category_pools = {
            DifficultyLevel.BEGINNER: ["animals", "foods", "colors", "clothing", "cities"],
            DifficultyLevel.INTERMEDIATE: ["professions", "sports", "countries", "musical instruments", "vehicles", "body parts"],
            DifficultyLevel.ADVANCED: ["scientific terms", "historical figures", "literary works", "medical conditions", "geographical features"],
            DifficultyLevel.EXPERT: ["philosophical concepts", "rare plants", "chemical compounds", "neurological terms", "architectural elements"]
        }
        
        # Define letter probabilities (easier vs. harder letters)
        easy_letters = list("ASBEMPTR")
        medium_letters = list("FGHLNOWJKV")
        hard_letters = list("ICDQUXYZ")
        
        # Set difficulty parameters
        if difficulty == DifficultyLevel.BEGINNER:
            category_count = 1
            time_limit = 60
            min_words = 3
            letter_pool = easy_letters
        elif difficulty == DifficultyLevel.INTERMEDIATE:
            category_count = 2
            time_limit = 50
            min_words = 4
            letter_pool = easy_letters + medium_letters
        elif difficulty == DifficultyLevel.ADVANCED:
            category_count = 3
            time_limit = 45
            min_words = 5
            letter_pool = medium_letters + hard_letters
        else:  # Expert
            category_count = 4
            time_limit = 40
            min_words = 6
            letter_pool = hard_letters
        
        # Select random categories based on difficulty
        available_categories = category_pools[difficulty]
        selected_categories = random.sample(available_categories, min(category_count, len(available_categories)))
        
        # Select a random letter
        selected_letter = random.choice(letter_pool)
        
        # Generate a unique ID
        exercise_id = f"langfluency-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        
        return Exercise(
            id=exercise_id,
            title=f"{difficulty.capitalize()} Language Fluency Game",
            description=f"Generate words starting with the letter '{selected_letter}' in different categories.",
            exercise_type=ExerciseType.LANGUAGE_FLUENCY,
            difficulty=difficulty,
            estimated_duration=time_limit + 15,  # Extra time for setup
            instructions=f"You will have {time_limit} seconds to come up with at least {min_words} words for each category that start with the letter '{selected_letter}'.",
            content={
                "letter": selected_letter,
                "categories": selected_categories,
                "time_limit": time_limit,
                "min_words_per_category": min_words
            },
            cognitive_domains=["verbal fluency", "executive function", "processing speed", "semantic memory"]
        )
    
    @staticmethod
    def generate_memory_match_exercise(difficulty: DifficultyLevel) -> Exercise:
        """
        Generate a Memory Match exercise.
        
        Args:
            difficulty: Difficulty level of the exercise.
            
        Returns:
            Exercise: The generated exercise.
        """
        # Difficulty-based parameters matching frontend implementation
        if difficulty == DifficultyLevel.BEGINNER:
            grid_size = {"rows": 2, "cols": 2}
            pairs = 2
            time_bonus = 15
            ideal_moves = 4
        elif difficulty == DifficultyLevel.INTERMEDIATE:
            grid_size = {"rows": 4, "cols": 4}
            pairs = 8
            time_bonus = 60
            ideal_moves = 16
        elif difficulty == DifficultyLevel.ADVANCED:
            grid_size = {"rows": 6, "cols": 6}
            pairs = 18
            time_bonus = 120
            ideal_moves = 36
        else:  # Expert
            grid_size = {"rows": 8, "cols": 8}
            pairs = 32
            time_bonus = 240
            ideal_moves = 64
        
        # Generate a unique ID
        exercise_id = f"memorymatch-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}-{difficulty.value}"
        
        return Exercise(
            id=exercise_id,
            title=f"{difficulty.capitalize()} Memory Match Game",
            description="Match question cards with their corresponding answer cards to improve memory and attention.",
            exercise_type=ExerciseType.MEMORY_MATCH,
            difficulty=difficulty,
            estimated_duration=time_bonus + 60,  # Time bonus threshold plus setup time
            instructions=f"Match {pairs} pairs of question and answer cards in a {grid_size['rows']}×{grid_size['cols']} grid.",
            content={
                "grid_size": grid_size,
                "pairs": pairs,
                "time_bonus": time_bonus,
                "ideal_moves": ideal_moves
            },
            cognitive_domains=["working memory", "visual processing", "attention", "executive function"]
        )
    
    @staticmethod
    def evaluate_word_recall_session(exercise: Exercise, user_answers: List[str]) -> Dict:
        """
        Evaluate a Word Recall exercise session.
        
        Args:
            exercise: The exercise that was completed.
            user_answers: List of words recalled by the user.
            
        Returns:
            Dict: Evaluation results containing score, accuracy, and feedback.
        """
        target_words = exercise.content["words"]
        min_score = exercise.content["min_score"]
        
        # Normalize target words for comparison
        normalized_targets = [word.lower().strip() for word in target_words]
        
        # Count correctly recalled words (case-insensitive and trim whitespace)
        correctly_recalled = []
        for word in user_answers:
            # Normalize user's answer
            normalized_word = word.lower().strip()
            
            # Check if the normalized word matches any target word
            if normalized_word in normalized_targets:
                # Find the original casing from target_words
                original_index = normalized_targets.index(normalized_word)
                correctly_recalled.append(target_words[original_index])
            elif any(normalized_word == target.lower().strip() for target in target_words):
                # This is a fallback in case the first check doesn't catch it
                # Get the original case version
                for target in target_words:
                    if normalized_word == target.lower().strip():
                        correctly_recalled.append(target)
                        break
        
        # Get words that were missed (using normalized comparison)
        missed_words = []
        normalized_correct = [word.lower().strip() for word in correctly_recalled]
        for target in target_words:
            if target.lower().strip() not in normalized_correct:
                missed_words.append(target)
        
        # Calculate accuracy and score
        accuracy = len(correctly_recalled) / len(target_words) if target_words else 0
        score = accuracy * 100  # Convert to percentage
        
        # Generate feedback based on performance
        if accuracy >= min_score:
            feedback = "Great job! Your memory performance is strong."
        elif accuracy >= min_score * 0.75:
            feedback = "Good effort! With practice, your recall ability will improve."
        else:
            feedback = "You might benefit from memory-enhancing strategies. Try categorizing or creating visual associations with words."
        
        return {
            "score": score,
            "accuracy": accuracy,
            "feedback": feedback,
            "correctly_recalled": correctly_recalled,
            "missed_words": missed_words
        }
    
    @staticmethod
    def evaluate_language_fluency_session(exercise: Exercise, user_answers: Dict[str, List[str]]) -> Dict:
        """
        Evaluate a Language Fluency exercise session.
        
        Args:
            exercise: The exercise that was completed.
            user_answers: Dictionary mapping categories to lists of words provided by the user.
            
        Returns:
            Dict: Evaluation results containing score, accuracy, and feedback.
        """
        target_letter = exercise.content["letter"].lower()
        categories = exercise.content["categories"]
        min_words_per_category = exercise.content["min_words_per_category"]
        
        # Process results for each category
        category_results = {}
        total_score = 0
        categories_achieved_minimum = 0
        
        for category in categories:
            # Get user's answers for this category (default to empty list if missing)
            user_answers_for_category = user_answers.get(category, [])
            
            # Filter for valid words (starting with the target letter)
            valid_words = [
                word for word in user_answers_for_category
                if word.lower().startswith(target_letter)
            ]
            
            # Remove duplicates (case-insensitive)
            seen = set()
            unique_valid_words = []
            for word in valid_words:
                if word.lower() not in seen:
                    seen.add(word.lower())
                    unique_valid_words.append(word)
            
            # Calculate category metrics
            achieved_minimum = len(unique_valid_words) >= min_words_per_category
            if achieved_minimum:
                categories_achieved_minimum += 1
            
            # Calculate score (cap at 100%)
            category_score = min(100, (len(unique_valid_words) / min_words_per_category) * 100)
            total_score += category_score
            
            # Store category results
            category_results[category] = {
                "words": unique_valid_words,
                "valid_count": len(unique_valid_words),
                "achieved_minimum": achieved_minimum,
                "score": category_score
            }
        
        # Calculate overall metrics
        average_score = total_score / len(categories) if categories else 0
        accuracy = categories_achieved_minimum / len(categories) if categories else 0
        
        # Generate feedback based on performance
        if accuracy >= 0.8:
            feedback = "Excellent verbal fluency! Your ability to generate words quickly is impressive."
        elif accuracy >= 0.6:
            feedback = "Good verbal fluency. With practice, you can improve your word generation speed."
        else:
            feedback = "Your verbal fluency could use some improvement. Try reading more and playing word games to enhance your vocabulary."
        
        return {
            "score": average_score,
            "accuracy": accuracy,
            "feedback": feedback,
            "category_results": category_results
        }
    
    @staticmethod
    def evaluate_memory_match_session(exercise: Exercise, matched_pairs: int, total_pairs: int,
                                    moves_used: int, time_elapsed: int, final_score: int, accuracy: float) -> Dict:
        """
        Evaluate a Memory Match session.
        
        Args:
            exercise: The memory match exercise.
            matched_pairs: Number of pairs successfully matched.
            total_pairs: Total number of pairs in the game.
            moves_used: Number of moves (card flips) used.
            time_elapsed: Time taken in seconds.
            final_score: Final score calculated.
            accuracy: Percentage accuracy.
            
        Returns:
            Dict: Evaluation results with score, accuracy, feedback, etc.
        """
        # Calculate efficiency ratio
        content = exercise.content
        ideal_moves = content.get("ideal_moves", total_pairs * 2)
        efficiency = max(0, min(100, (ideal_moves / moves_used) * 100)) if moves_used > 0 else 100
        
        # Calculate speed rating
        time_bonus_threshold = content.get("time_bonus", 60)
        if time_elapsed <= time_bonus_threshold * 0.5:
            speed_rating = "excellent"
        elif time_elapsed <= time_bonus_threshold * 0.75:
            speed_rating = "good"
        elif time_elapsed <= time_bonus_threshold:
            speed_rating = "average"
        else:
            speed_rating = "slow"
        
        # Generate contextual feedback
        if accuracy >= 100:
            feedback = f"🎉 Perfect score! You matched all {total_pairs} pairs with {speed_rating} speed and {efficiency:.1f}% efficiency."
        elif accuracy >= 80:
            feedback = f"👍 Great job! You matched {matched_pairs}/{total_pairs} pairs. Your efficiency was {efficiency:.1f}%."
        elif accuracy >= 60:
            feedback = f"🔄 Good effort! You matched {matched_pairs}/{total_pairs} pairs. Try to be more systematic in your approach."
        elif accuracy >= 40:
            feedback = f"💪 Keep practicing! You matched {matched_pairs}/{total_pairs} pairs. Focus on remembering card positions."
        else:
            feedback = f"📚 Don't give up! Memory games improve with practice. Try starting with an easier difficulty."
        
        # Add move efficiency tip
        if moves_used > ideal_moves * 1.5:
            feedback += " Tip: Try to remember where you've seen cards to reduce moves."
        
        return {
            "score": final_score,
            "accuracy": accuracy,
            "feedback": feedback,
            "efficiency": efficiency,
            "speed_rating": speed_rating,
            "pairs_matched": matched_pairs,
            "moves_used": moves_used,
            "time_taken": time_elapsed
        }

    @staticmethod
    def evaluate_sequence_ordering_session(exercise: Exercise, user_order: List[str], moves_used: int,
                                         time_elapsed: int, correct_count: int, total_steps: int,
                                         accuracy: float, base_points: int, perfect_bonus: int, 
                                         timed_bonus: int) -> Dict:
        """
        Evaluate a Sequence Ordering session.
        
        Args:
            exercise: The sequence ordering exercise.
            user_order: Order of step IDs as arranged by user.
            moves_used: Number of moves/swaps made.
            time_elapsed: Time taken in seconds.
            correct_count: Number of correctly placed steps.
            total_steps: Total number of steps in the sequence.
            accuracy: Percentage accuracy (correct_count / total_steps * 100).
            base_points: Base points from correct placements.
            perfect_bonus: Perfect sequence bonus points.
            timed_bonus: Time bonus points.
            
        Returns:
            Dict: Evaluation results with score, accuracy, feedback, etc.
        """
        # Calculate efficiency ratio (fewer moves is better)
        ideal_moves = max(1, total_steps - 1)  # Minimum moves for perfect ordering
        efficiency = max(0, min(100, (ideal_moves / moves_used) * 100)) if moves_used > 0 else 100
        
        # Calculate speed rating based on difficulty
        content = exercise.content
        difficulty = content.get("difficulty", "MEDIUM")
        game_mode = content.get("game_mode", "untimed")
        
        # Time thresholds based on difficulty
        time_thresholds = {
            "EASY": {"excellent": 30, "good": 60, "average": 90},
            "MEDIUM": {"excellent": 45, "good": 90, "average": 120},
            "HARD": {"excellent": 60, "good": 120, "average": 180}
        }
        
        thresholds = time_thresholds.get(difficulty, time_thresholds["MEDIUM"])
        
        if time_elapsed <= thresholds["excellent"]:
            speed_rating = "excellent"
        elif time_elapsed <= thresholds["good"]:
            speed_rating = "good"
        elif time_elapsed <= thresholds["average"]:
            speed_rating = "average"
        else:
            speed_rating = "needs improvement"
        
        # Calculate final score
        final_score = base_points + perfect_bonus + timed_bonus
        
        # Generate contextual feedback
        if accuracy >= 100:
            feedback = f"🎉 Perfect sequence! You correctly arranged all {total_steps} steps"
            if game_mode == "timed":
                feedback += f" with {speed_rating} speed"
            if efficiency >= 90:
                feedback += f" and excellent efficiency ({efficiency:.1f}%)"
            feedback += "."
        elif accuracy >= 80:
            feedback = f"👍 Excellent work! You got {correct_count} out of {total_steps} steps correct ({accuracy:.1f}% accuracy)."
            if efficiency >= 70:
                feedback += f" Your move efficiency was good at {efficiency:.1f}%."
        elif accuracy >= 60:
            feedback = f"🔄 Good effort! You arranged {correct_count} out of {total_steps} steps correctly. "
            feedback += "Try to think about the logical flow between steps."
        elif accuracy >= 40:
            feedback = f"💪 Keep practicing! You got {correct_count} out of {total_steps} steps right. "
            feedback += "Focus on understanding the cause-and-effect relationships."
        else:
            feedback = f"📚 Don't give up! You placed {correct_count} steps correctly. "
            feedback += "Try reading through all steps first to understand the overall process."
        
        # Add efficiency tip if needed
        if moves_used > ideal_moves * 2:
            feedback += " Tip: Plan your moves before starting to improve efficiency."
        
        # Add cognitive benefits note
        cognitive_note = " This exercise enhances executive function and sequential reasoning skills."
        
        return {
            "score": final_score,
            "accuracy": accuracy,
            "feedback": feedback + cognitive_note,
            "efficiency": efficiency,
            "speed_rating": speed_rating,
            "correct_count": correct_count,
            "total_steps": total_steps,
            "moves_used": moves_used,
            "time_taken": time_elapsed,
            "cognitive_domains": ["executive function", "sequential reasoning", "temporal understanding", "working memory"]
        }
    
    @staticmethod
    async def update_progress_metrics(user_id: str, exercise_session: ExerciseSession, 
                                    evaluation_result: Dict, exercise_type: ExerciseType) -> None:
        """
        Update a user's progress metrics after completing an exercise.
        
        Args:
            user_id: ID of the user.
            exercise_session: The completed exercise session.
            evaluation_result: Evaluation results from the session.
            exercise_type: Type of exercise (word_recall, language_fluency)
        """
        db = get_database()
        
        # Get current metrics or create new ones
        user_metrics = await db[COLLECTION_USER_METRICS].find_one({"user_id": user_id})
        
        if not user_metrics:
            # Create default metrics for new user
            user_metrics = {
                "user_id": user_id,
                "total_sessions": 0,
                "total_time_spent": 0,
                "average_scores": {},
                "performance_trends": {},
                "strengths": [],
                "areas_for_improvement": [],
                "consistency_score": 0.0,
                "exercise_history": {},
                "last_updated": datetime.utcnow()
            }
        
        # Convert exercise_type to string if needed
        exercise_type_str = exercise_type if isinstance(exercise_type, str) else exercise_type.value
        
        # Update total sessions and time spent
        user_metrics["total_sessions"] = user_metrics.get("total_sessions", 0) + 1
        
        # Calculate session duration 
        duration = 0
        if hasattr(exercise_session, "start_time") and hasattr(exercise_session, "end_time"):
            if exercise_session.start_time and exercise_session.end_time:
                duration = (exercise_session.end_time - exercise_session.start_time).total_seconds()
        
        user_metrics["total_time_spent"] = user_metrics.get("total_time_spent", 0) + duration
        
        # Record session timestamp for consistency tracking
        if "session_timestamps" not in user_metrics:
            user_metrics["session_timestamps"] = []
        
        # Add current timestamp
        user_metrics["session_timestamps"].append(datetime.utcnow().isoformat())
        
        # Keep only the last 20 timestamps
        user_metrics["session_timestamps"] = user_metrics["session_timestamps"][-20:]
        
        # Update performance trends for this exercise type
        if "performance_trends" not in user_metrics:
            user_metrics["performance_trends"] = {}
        
        if exercise_type_str not in user_metrics["performance_trends"]:
            user_metrics["performance_trends"][exercise_type_str] = []
        
        # Add the latest score, keeping only the last 10 scores
        user_metrics["performance_trends"][exercise_type_str].append(evaluation_result["score"])
        user_metrics["performance_trends"][exercise_type_str] = user_metrics["performance_trends"][exercise_type_str][-10:]
        
        # Update average scores
        if "average_scores" not in user_metrics:
            user_metrics["average_scores"] = {}
        
        # Calculate new average
        scores = user_metrics["performance_trends"][exercise_type_str]
        user_metrics["average_scores"][exercise_type_str] = sum(scores) / len(scores)
        
        # Determine strengths and areas for improvement
        strengths = []
        areas_for_improvement = []
        
        for ex_type, avg_score in user_metrics["average_scores"].items():
            if avg_score >= 80:
                if ex_type == ExerciseType.WORD_RECALL or ex_type == "word_recall":
                    strengths.append("word recall")
                elif ex_type == ExerciseType.LANGUAGE_FLUENCY or ex_type == "language_fluency":
                    strengths.append("verbal fluency")
                elif ex_type == ExerciseType.MEMORY_MATCH or ex_type == "memory_match":
                    strengths.append("memory match")
                elif ex_type == ExerciseType.SEQUENCE_ORDERING or ex_type == "sequence_ordering":
                    strengths.append("sequence ordering")
                elif ex_type == ExerciseType.CATEGORY_NAMING or ex_type == "category_naming":
                    strengths.append("category naming")
            elif avg_score <= 60:
                if ex_type == ExerciseType.WORD_RECALL or ex_type == "word_recall":
                    areas_for_improvement.append("word recall")
                elif ex_type == ExerciseType.LANGUAGE_FLUENCY or ex_type == "language_fluency":
                    areas_for_improvement.append("verbal fluency")
                elif ex_type == ExerciseType.MEMORY_MATCH or ex_type == "memory_match":
                    areas_for_improvement.append("memory match")
                elif ex_type == ExerciseType.SEQUENCE_ORDERING or ex_type == "sequence_ordering":
                    areas_for_improvement.append("sequence ordering")
                elif ex_type == ExerciseType.CATEGORY_NAMING or ex_type == "category_naming":
                    areas_for_improvement.append("category naming")
        
        user_metrics["strengths"] = list(set(strengths))  # Remove duplicates
        user_metrics["areas_for_improvement"] = list(set(areas_for_improvement))  # Remove duplicates
        
        # Update last_updated timestamp
        user_metrics["last_updated"] = datetime.utcnow()
        
        # Save the updated metrics
        await db[COLLECTION_USER_METRICS].update_one(
            {"user_id": user_id},
            {"$set": user_metrics},
            upsert=True
        ) 