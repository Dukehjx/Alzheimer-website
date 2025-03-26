/**
 * AI analysis service module
 * 
 * This module provides functions for interacting with the AI analysis API endpoints.
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

// Helper function to get auth headers from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Analyze text for cognitive indicators
 * 
 * @param {string} text - The text to analyze
 * @param {string} analysisType - The type of analysis (default: "text")
 * @param {boolean} includeFeatures - Whether to include detailed features in response
 * @param {boolean} demoMode - Whether to run in demo mode without authentication
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeText = async (text, analysisType = 'text', includeFeatures = false, demoMode = false) => {
    console.log(`Analyzing text (${text.length} chars): ${text.substring(0, 50)}...`);

    try {
        // Check if authentication token exists (bypass in demo mode)
        const token = localStorage.getItem('token');
        if (!token && !demoMode) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        // In demo mode, generate mock analysis results
        if (demoMode) {
            return generateMockAnalysisResults(text, includeFeatures);
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('text', text);
        formData.append('include_features', includeFeatures);
        formData.append('include_raw_text', false);

        // Use detect_patterns if analysis type is pattern
        if (analysisType === 'pattern') {
            formData.append('detect_patterns', true);
        }

        // Use the new language-analysis endpoint
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/language-analysis/analyze-text`,
            formData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Cache-Control': 'no-cache, no-store',
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        console.log('Analysis response:', response.data);

        // Ensure we have domain_scores for consistency with our UI
        if (response.data.success && !response.data.domain_scores) {
            // If the API didn't provide domain scores, map any available scores to maintain UI compatibility
            response.data.domain_scores = {};

            // Use any scored domains from the response if available
            if (response.data.cognitive_scores) {
                response.data.domain_scores = response.data.cognitive_scores;
            }

            // Add an overall score if not present but required by UI
            if (!response.data.overall_score && response.data.risk_score) {
                response.data.overall_score = response.data.risk_score;
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error analyzing text:', error);

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        return {
            success: false,
            error: error.response?.data?.detail || 'An error occurred during analysis.',
            status: error.response?.status || 500
        };
    }
};

/**
 * Generate mock analysis results for demo purposes when user is not authenticated
 * 
 * @param {string} text - The text to analyze
 * @param {boolean} includeFeatures - Whether to include detailed features
 * @returns {Object} Simulated analysis results
 */
function generateMockAnalysisResults(text, includeFeatures) {
    // Calculate a deterministic but pseudo-random score based on text
    const calculateScore = (base, seed) => {
        // Use text length as a seed for some variability
        const variability = (text.length * seed) % 20 / 100;
        return Math.max(0.1, Math.min(0.9, base - variability));
    };

    const textLength = text.length;
    // Shorter texts get higher risk scores (worse)
    const overallBase = textLength < 100 ? 0.5 : textLength < 300 ? 0.35 : 0.25;

    const domainScores = {
        "LANGUAGE": calculateScore(overallBase, 1),
        "MEMORY": calculateScore(overallBase, 2),
        "EXECUTIVE_FUNCTION": calculateScore(overallBase, 3),
        "ATTENTION": calculateScore(overallBase, 4),
        "VISUOSPATIAL": calculateScore(overallBase, 5)
    };

    // Calculate overall score as average of domain scores
    const overallScore = Object.values(domainScores).reduce((a, b) => a + b, 0) /
        Object.values(domainScores).length;

    // Generate recommendations based on scores
    let recommendations = [
        "Regular cognitive training exercises can help maintain brain health",
        "Stay mentally active by reading, solving puzzles, and learning new skills",
        "Physical exercise has been shown to improve cognitive function"
    ];

    if (overallScore > 0.4) {
        recommendations.push("Consider increasing variety in your daily activities and speech patterns");
    }

    // Add detailed linguistic features if requested
    const features = includeFeatures ? {
        "lexical_diversity": {
            "ttr": 0.65 + (Math.random() * 0.2),
            "hapax_legomena_ratio": 0.3 + (Math.random() * 0.1)
        },
        "syntactic_complexity": {
            "mean_sentence_length": 12 + (Math.random() * 8),
            "complex_sentence_ratio": 0.4 + (Math.random() * 0.3)
        },
        "hesitation_patterns": {
            "hesitation_score": 0.2 + (Math.random() * 0.2)
        },
        "repetition_patterns": {
            "word_repetition_rate": 0.1 + (Math.random() * 0.1)
        }
    } : null;

    return {
        success: true,
        overall_score: overallScore,
        domain_scores: domainScores,
        confidence_score: 0.75,
        recommendations: recommendations,
        features: features,
        model_type: "demo",
        timestamp: new Date().toISOString()
    };
}

/**
 * Set the AI model to use for analysis
 * 
 * @param {string} modelType - The type of model to use ('spacy' or 'gpt4')
 * @param {string} apiKey - API key for GPT-4 (required if modelType is 'gpt4')
 * @returns {Promise<Object>} Success message
 */
export const setAiModel = async (modelType, apiKey = null) => {
    try {
        // Check if authentication token exists
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        const response = await axios.post(
            `${API_BASE_URL}/api/ai/set-model`,
            { model_type: modelType, api_key: apiKey },
            {
                headers: getAuthHeaders(),
                // Add timestamp to prevent caching
                params: { t: new Date().getTime() }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error setting AI model:', error);

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        return {
            success: false,
            error: error.response?.data?.detail || 'An error occurred while setting the model.',
            status: error.response?.status || 500
        };
    }
};

/**
 * Get analysis history for the current user
 * 
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise} - The analysis history
 */
export const getAnalysisHistory = async (limit = 10) => {
    try {
        // Check if authentication token exists
        const token = localStorage.getItem('token');
        if (!token) {
            return [];  // Return empty array if not authenticated
        }

        // Add timestamp parameter to prevent caching
        const timestamp = Date.now();
        const response = await axios.get(
            `${API_BASE_URL}/api/ai/history?limit=${limit}&_t=${timestamp}`,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Cache-Control': 'no-cache, no-store'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching analysis history:', error);

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            console.warn('User not authenticated for history fetch');
            return [];  // Return empty array if not authenticated
        }

        // For other errors, return empty array with error logging
        console.error('Failed to fetch history:', error.message);
        return [];
    }
};

/**
 * Process audio file for speech-to-text conversion and optional analysis
 * 
 * @param {File} audioFile - The audio file to process 
 * @param {Object} options - Processing options
 * @param {string} options.language - Optional language code
 * @param {boolean} options.includeAnalysis - Whether to analyze the transcribed text
 * @param {boolean} options.demoMode - Whether to run in demo mode without authentication
 * @returns {Promise<Object>} Processing results
 */
export const processAudio = async (audioFile, options = {}) => {
    const { language = null, includeAnalysis = false, demoMode = false } = options;

    console.log(`Processing audio file: ${audioFile.name} (${audioFile.size} bytes)`);

    try {
        // Check if authentication token exists (bypass in demo mode)
        const token = localStorage.getItem('token');
        if (!token && !demoMode) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        // In demo mode, generate mock results
        if (demoMode) {
            return generateMockAudioResults(includeAnalysis);
        }

        // Generate a unique request ID
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Create FormData to send the file
        const formData = new FormData();
        formData.append('audio_file', audioFile);
        formData.append('request_id', requestId);
        formData.append('include_analysis', includeAnalysis.toString());  // Convert boolean to string

        if (language) {
            formData.append('language', language);
        }

        const response = await axios.post(
            `${API_BASE_URL}/api/ai/process-audio`,
            formData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        console.log('Audio processing response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error processing audio:', error);

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        return {
            success: false,
            error: error.response?.data?.detail || 'An error occurred during audio processing.',
            status: error.response?.status || 500
        };
    }
};

/**
 * Set the Whisper model size to use
 * 
 * @param {string} modelSize - The model size to use ('tiny', 'base', 'small', 'medium', 'large')
 * @returns {Promise<Object>} Success message
 */
export const setWhisperModelSize = async (modelSize) => {
    try {
        // Check if authentication token exists
        const token = localStorage.getItem('token');
        if (!token) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        const response = await axios.post(
            `${API_BASE_URL}/api/ai/set-whisper-model`,
            { model_size: modelSize },
            {
                headers: getAuthHeaders(),
                // Add timestamp to prevent caching
                params: { t: new Date().getTime() }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error setting Whisper model size:', error);

        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            return {
                success: false,
                error: 'Authentication required. Please log in.',
                status: 401
            };
        }

        return {
            success: false,
            error: error.response?.data?.detail || 'An error occurred while setting the model size.',
            status: error.response?.status || 500
        };
    }
};

/**
 * Generate mock audio processing results for demo purposes
 * 
 * @param {boolean} includeAnalysis - Whether to include analysis results
 * @returns {Object} Simulated audio processing results
 */
function generateMockAudioResults(includeAnalysis) {
    const transcribedText = "I went to the store yesterday to buy some groceries. I forgot what I was looking for when I got there. The clerk helped me remember that I needed milk and bread. My memory is not as good as it used to be, but I'm still getting by.";

    const result = {
        success: true,
        transcription: {
            text: transcribedText,
            language: "en",
            segments: [
                {
                    id: 0,
                    start: 0.0,
                    end: 4.5,
                    text: "I went to the store yesterday to buy some groceries."
                },
                {
                    id: 1,
                    start: 4.8,
                    end: 8.2,
                    text: "I forgot what I was looking for when I got there."
                },
                {
                    id: 2,
                    start: 8.5,
                    end: 12.3,
                    text: "The clerk helped me remember that I needed milk and bread."
                },
                {
                    id: 3,
                    start: 12.7,
                    end: 17.9,
                    text: "My memory is not as good as it used to be, but I'm still getting by."
                }
            ]
        }
    };

    // Add analysis results if requested
    if (includeAnalysis) {
        result.analysis = generateMockSpeechAnalysisResults(transcribedText);
    }

    return result;
}

/**
 * Generate mock analysis results for speech text
 * 
 * @param {string} text - The text to analyze
 * @returns {Object} Simulated analysis results
 */
function generateMockSpeechAnalysisResults(text) {
    // Calculate a deterministic but pseudo-random score based on text
    const calculateScore = (base, seed) => {
        // Use text length as a seed for some variability
        const variability = (text.length * seed) % 20 / 100;
        return Math.max(0.1, Math.min(0.9, base - variability));
    };

    const textLength = text.length;
    // Shorter texts get higher risk scores (worse)
    const overallBase = textLength < 100 ? 0.5 : textLength < 300 ? 0.35 : 0.25;

    const domainScores = {
        "LANGUAGE": calculateScore(overallBase, 1),
        "MEMORY": calculateScore(overallBase, 2),
        "EXECUTIVE_FUNCTION": calculateScore(overallBase, 3),
        "ATTENTION": calculateScore(overallBase, 4),
        "VISUOSPATIAL": calculateScore(overallBase, 5)
    };

    // Calculate overall score as average of domain scores
    const overallScore = Object.values(domainScores).reduce((a, b) => a + b, 0) /
        Object.values(domainScores).length;

    return {
        analysis_id: `demo_${Date.now()}`,
        overall_score: overallScore,
        confidence_score: 0.75,
        domain_scores: domainScores,
        recommendations: [
            "Regular cognitive training exercises can help maintain brain health",
            "Stay mentally active by reading, solving puzzles, and learning new skills",
            "Physical exercise has been shown to improve cognitive function"
        ],
        model_type: "demo",
        timestamp: new Date().toISOString()
    };
} 