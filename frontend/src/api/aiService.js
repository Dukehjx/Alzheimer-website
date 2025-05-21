/**
 * AI analysis service module
 * 
 * This module provides functions for interacting with the AI analysis API endpoints.
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { uploadClient } from './apiClient';
import { apiClient } from './apiClient';

// Helper function to get auth headers from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper to construct error messages
const createError = (message, status = null, details = null) => {
    const error = new Error(message);
    if (status) error.status = status;
    if (details) error.details = details;
    return error;
};

/**
 * Analyzes a single block of text.
 *
 * @param {string} text - The text to analyze.
 * @param {string} [language='en'] - The language of the text.
 * @param {boolean} [includeFeatures=false] - Whether to include detailed linguistic features in the response.
 * @returns {Promise<object>} The analysis result from the API.
 * @throws {Error} If the API request fails.
 */
export const analyzeText = async (text, language = 'en', includeFeatures = false) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
        throw createError('Text to analyze cannot be empty.', 400);
    }

    const payload = {
        text,
        language,
        include_features: includeFeatures,
    };

    try {
        // console.log('Sending payload to /ai/analyze-text:', payload);
        const response = await apiClient.post('/ai/analyze', payload);
        // console.log('Received response from /ai/analyze-text:', response);
        return response;
    } catch (error) {
        // console.error('Error in analyzeText:', error.response?.data || error.message);
        throw createError(
            error.response?.data?.detail || 'Failed to analyze text.',
            error.response?.status,
            error.response?.data
        );
    }
};

/**
 * Retrieves the analysis history for a given user.
 *
 * @param {string} userId - The ID of the user to fetch history for.
 * @param {number} [limit=10] - The maximum number of history items to return.
 * @returns {Promise<Array<object>>} A list of analysis history items.
 * @throws {Error} If the API request fails.
 */
export const getAnalysisHistory = async (userId, limit = 10) => {
    if (!userId) {
        throw createError('User ID is required to fetch analysis history.', 400);
    }
    try {
        // console.log(`Fetching analysis history for user ${userId} with limit ${limit}`);
        // The backend endpoint is /api/language-analysis/history/{user_id}
        // It currently returns mock data and doesn't use a limit parameter.
        const response = await apiClient.get(`/language-analysis/history/${userId}`);
        // console.log('Received analysis history:', response);

        // The mock backend returns an object like: { user_id: "...": analysis_history: [...] }
        // We should return the analysis_history array directly.
        // Also, apply limit if the backend doesn't support it yet.
        const history = response.analysis_history || [];
        return history.slice(0, limit);
    } catch (error) {
        // console.error('Error fetching analysis history:', error.response?.data || error.message);
        throw createError(
            error.response?.data?.detail || 'Failed to fetch analysis history.',
            error.response?.status,
            error.response?.data
        );
    }
};

/**
 * Analyzes text by breaking it into segments.
 *
 * @param {string} text - The text to analyze.
 * @param {number} segmentLength - The desired length of each text segment.
 * @param {number} segmentOverlap - The overlap between consecutive segments.
 * @param {string} [language='en'] - The language of the text.
 * @param {boolean} [includeFeatures=false] - Whether to include detailed linguistic features in the response.
 * @returns {Promise<object>} The analysis result from the API.
 * @throws {Error} If the API request fails.
 */
export const analyzeTextSegments = async (text, segmentLength, segmentOverlap, language = 'en', includeFeatures = false) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
        throw createError('Text to analyze cannot be empty.', 400);
    }
    if (typeof segmentLength !== 'number' || segmentLength <= 0) {
        throw createError('Segment length must be a positive number.', 400);
    }
    if (typeof segmentOverlap !== 'number' || segmentOverlap < 0) {
        throw createError('Segment overlap must be a non-negative number.', 400);
    }
    if (segmentOverlap >= segmentLength) {
        throw createError('Segment overlap cannot be greater than or equal to segment length.', 400);
    }

    const payload = {
        text,
        segment_length: segmentLength,
        segment_overlap: segmentOverlap,
        language,
        include_features: includeFeatures,
    };

    try {
        // console.log('Sending payload to /ai/analyze-text-segments:', payload);
        const response = await apiClient.post('/ai/analyze-text-segments', payload);
        // console.log('Received response from /ai/analyze-text-segments:', response);
        return response;
    } catch (error) {
        // console.error('Error in analyzeTextSegments:', error.response?.data || error.message);
        throw createError(
            error.response?.data?.detail || 'Failed to analyze text segments.',
            error.response?.status,
            error.response?.data
        );
    }
};

/**
 * Analyzes spoken language from an audio file.
 * The backend now processes this synchronously and returns the result directly.
 *
 * @param {FormData} formData - The FormData object containing the audio file and other parameters.
 *                            Expected field for audio: 'audio_file'.
 *                            Query parameters 'language' and 'include_features' are typically appended to the URL by apiClient
 *                            or should be part of the config if handled differently.
 * @param {object} [options={}] - Optional parameters.
 * @param {string} [options.language='en'] - The language of the speech in the audio.
 * @param {boolean} [options.include_features=false] - Whether to include detailed features in the analysis.
 * @returns {Promise<object>} The analysis result from the API.
 * @throws {Error} If the API request fails or if input is invalid.
 */
export const analyzeSpeech = async (formData, options = {}) => {
    if (!(formData instanceof FormData)) {
        throw createError('Input must be a FormData object.', 400);
    }
    if (!formData.has('audio_file')) {
        throw createError('FormData must contain an "audio_file".', 400);
    }

    const queryParams = {
        language: options.language || 'en', // Default to 'en' if not provided
        include_features: options.include_features || false,
    };

    try {
        // console.log('Sending FormData to /ai/analyze-speech with query params:', queryParams);
        // The apiClient's post method should handle queryParams correctly if its 'config.params' is used.
        // Ensure apiClient is configured to send queryParams appropriately for POST requests if not standard.
        const response = await apiClient.post('/ai/analyze-speech', formData, {
            params: queryParams, // Pass query parameters here
            headers: {
                'Content-Type': 'multipart/form-data', // Let browser set boundary
            },
        });
        // console.log('Received response from /ai/analyze-speech:', response);
        return response;
    } catch (error) {
        // console.error('Error in analyzeSpeech:', error.response?.data || error.message, error.response?.status);
        const errorMessage = error.response?.data?.detail ||
            (error.response?.status === 422 ? "Validation error. Ensure audio file is valid and parameters are correct." : 'Failed to analyze speech.');
        throw createError(
            errorMessage,
            error.response?.status,
            error.response?.data
        );
    }
};

// Removed setAiModel, processAudio, setWhisperModelSize,
// and their mock data helper functions (generateMockAudioResults, generateMockSpeechAnalysisResults)
// as their corresponding backend /api/v1/... endpoints do not exist in the current backend API.
// If these functionalities are required, backend endpoints need to be created first. 