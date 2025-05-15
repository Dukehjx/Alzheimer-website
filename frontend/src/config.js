/**
 * Application Configuration
 * 
 * Central configuration settings for the NeuroAegis Platform
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Feature Flags
export const FEATURES = {
    DETAILED_ANALYSIS: true,
    ANALYSIS_HISTORY: true,
    USER_PROFILES: true,
    COGNITIVE_EXERCISES: true, // Updated from false, as features seem to exist
    GPT_INTEGRATION: true      // Updated from false, as backend AI relies on GPT
};

// UI Configuration
export const UI_CONFIG = {
    THEME: 'light',            // 'light' or 'dark'
    ANIMATIONS_ENABLED: true,
    CHART_COLORS: {
        language: '#4299E1',     // blue
        memory: '#ED8936',       // orange
        executive: '#48BB78',    // green
        attention: '#9F7AEA',    // purple
        overall: '#2D3748'       // dark gray
    }
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'token',
    USER_PROFILE: 'user_profile',
    THEME_PREFERENCE: 'theme_preference',
    RECENT_ANALYSES: 'recent_analyses'
}; 