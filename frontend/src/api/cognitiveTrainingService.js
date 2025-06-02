import { apiClient } from './apiClient';

/**
 * Cognitive Training API Service
 * Handles API calls for cognitive training exercises and progress tracking
 */

/**
 * Submit Memory Match game results
 * @param {Object} gameResults - The game results data
 * @param {string} gameResults.exercise_id - Unique exercise ID
 * @param {string} gameResults.difficulty - Difficulty level (beginner, novice, intermediate, advanced, expert)
 * @param {string} gameResults.game_mode - Game mode (relaxed, timed, challenge)
 * @param {number} gameResults.total_pairs - Total number of pairs in the game
 * @param {number} gameResults.matched_pairs - Number of pairs successfully matched
 * @param {number} gameResults.moves_used - Total number of moves/flips made
 * @param {number} gameResults.time_elapsed - Time taken to complete the game in seconds
 * @param {number} gameResults.final_score - Final score calculated by the frontend
 * @param {number} gameResults.accuracy - Percentage of pairs matched (0-100)
 * @returns {Promise<Object>} API response with evaluation results
 */
export const submitMemoryMatchResults = async (gameResults) => {
    try {
        console.log('Submitting Memory Match results:', gameResults);

        const response = await apiClient.post('/cognitive-training/memory-match/submit', gameResults);

        console.log('Memory Match submission successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting Memory Match results:', error);

        // Provide user-friendly error message
        if (error.response?.status === 400) {
            throw new Error('Invalid game data. Please try playing the game again.');
        } else if (error.response?.status === 401) {
            throw new Error('Please log in to save your progress.');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error. Your progress could not be saved. Please try again later.');
        } else {
            throw new Error('Failed to save your progress. Please check your connection and try again.');
        }
    }
};

/**
 * Submit Category Naming game results
 * @param {Object} gameResults - The game results data
 * @param {string} gameResults.exercise_id - Unique exercise ID
 * @param {string} gameResults.category_id - Category ID played
 * @param {string} gameResults.difficulty - Difficulty level (EASY, MEDIUM, HARD)
 * @param {number} gameResults.time_limit - Time limit in seconds
 * @param {number} gameResults.time_elapsed - Time taken in seconds
 * @param {string[]} gameResults.correct_entries - List of correct entries
 * @param {number} gameResults.rare_entries_count - Number of rare entries
 * @param {number} gameResults.base_score - Base score from correct entries
 * @param {number} gameResults.rare_bonus - Bonus points from rare entries
 * @param {number} gameResults.milestone_bonus - Milestone bonus points
 * @param {number} gameResults.final_score - Final score calculated by the frontend
 * @returns {Promise<Object>} API response with evaluation results
 */
export const submitCategoryNamingResults = async (gameResults) => {
    try {
        console.log('Submitting Category Naming results:', gameResults);

        const response = await apiClient.post('/cognitive-training/category-naming/submit', gameResults);

        console.log('Category Naming submission successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting Category Naming results:', error);

        if (error.response?.status === 400) {
            throw new Error('Invalid game data. Please try playing the game again.');
        } else if (error.response?.status === 401) {
            throw new Error('Please log in to save your progress.');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error. Your progress could not be saved. Please try again later.');
        } else {
            throw new Error('Failed to save your progress. Please check your connection and try again.');
        }
    }
};

/**
 * Submit Word Recall exercise results
 * @param {Object} exerciseResults - The exercise results data
 * @param {string} exerciseResults.exercise_id - Unique exercise ID
 * @param {string[]} exerciseResults.recalled_words - List of words recalled by the user
 * @param {number} exerciseResults.duration - Time taken in seconds
 * @returns {Promise<Object>} API response with evaluation results
 */
export const submitWordRecallResults = async (exerciseResults) => {
    try {
        console.log('Submitting Word Recall results:', exerciseResults);

        const response = await apiClient.post('/cognitive-training/word-recall/submit', exerciseResults);

        console.log('Word Recall submission successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting Word Recall results:', error);

        if (error.response?.status === 400) {
            throw new Error('Invalid exercise data. Please try the exercise again.');
        } else if (error.response?.status === 401) {
            throw new Error('Please log in to save your progress.');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error. Your progress could not be saved. Please try again later.');
        } else {
            throw new Error('Failed to save your progress. Please check your connection and try again.');
        }
    }
};

/**
 * Submit Language Fluency exercise results
 * @param {Object} exerciseResults - The exercise results data
 * @param {string} exerciseResults.exercise_id - Unique exercise ID
 * @param {Object} exerciseResults.answers - Dictionary mapping categories to lists of words
 * @param {number} exerciseResults.duration - Time taken in seconds
 * @returns {Promise<Object>} API response with evaluation results
 */
export const submitLanguageFluencyResults = async (exerciseResults) => {
    try {
        console.log('Submitting Language Fluency results:', exerciseResults);

        const response = await apiClient.post('/cognitive-training/language-fluency/submit', exerciseResults);

        console.log('Language Fluency submission successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting Language Fluency results:', error);

        if (error.response?.status === 400) {
            throw new Error('Invalid exercise data. Please try the exercise again.');
        } else if (error.response?.status === 401) {
            throw new Error('Please log in to save your progress.');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error. Your progress could not be saved. Please try again later.');
        } else {
            throw new Error('Failed to save your progress. Please check your connection and try again.');
        }
    }
};

/**
 * Get user's cognitive training progress metrics
 * @returns {Promise<Object>} Progress metrics including scores, trends, and insights
 */
export const getProgressMetrics = async () => {
    try {
        console.log('Fetching cognitive training progress metrics...');

        const response = await apiClient.get('/cognitive-training/progress');

        console.log('Progress metrics fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching progress metrics:', error);

        if (error.response?.status === 401) {
            throw new Error('Please log in to view your progress.');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error. Could not load your progress. Please try again later.');
        } else {
            throw new Error('Failed to load your progress. Please check your connection and try again.');
        }
    }
};

/**
 * Generate a new cognitive training exercise
 * @param {Object} exerciseRequest - The exercise generation request
 * @param {string} exerciseRequest.difficulty - Difficulty level (beginner, intermediate, advanced, expert)
 * @param {string} exerciseRequest.exercise_type - Type of exercise (word_recall, language_fluency, memory_match)
 * @returns {Promise<Object>} Generated exercise data
 */
export const generateExercise = async (exerciseRequest) => {
    try {
        console.log('Generating new exercise:', exerciseRequest);

        const response = await apiClient.post('/cognitive-training/exercises', exerciseRequest);

        console.log('Exercise generated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error generating exercise:', error);

        if (error.response?.status === 400) {
            throw new Error('Invalid exercise parameters. Please try again.');
        } else if (error.response?.status === 401) {
            throw new Error('Please log in to access exercises.');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error. Could not generate exercise. Please try again later.');
        } else {
            throw new Error('Failed to generate exercise. Please check your connection and try again.');
        }
    }
};

/**
 * Get a specific exercise by ID
 * @param {string} exerciseId - The exercise ID
 * @returns {Promise<Object>} Exercise data
 */
export const getExercise = async (exerciseId) => {
    try {
        console.log('Fetching exercise:', exerciseId);

        const response = await apiClient.get(`/cognitive-training/exercises/${exerciseId}`);

        console.log('Exercise fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching exercise:', error);

        if (error.response?.status === 404) {
            throw new Error('Exercise not found. It may have expired or been removed.');
        } else if (error.response?.status === 401) {
            throw new Error('Please log in to access exercises.');
        } else if (error.response?.status >= 500) {
            throw new Error('Server error. Could not load exercise. Please try again later.');
        } else {
            throw new Error('Failed to load exercise. Please check your connection and try again.');
        }
    }
}; 