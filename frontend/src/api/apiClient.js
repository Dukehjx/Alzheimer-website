import axios from 'axios';
import { API_BASE_URL } from '../config';

// Debug API URL configuration
console.log('API_BASE_URL configured as:', API_BASE_URL);

// Function to ensure URLs have consistent format
const formatBaseUrl = (url) => {
    if (!url) return '';
    // Remove trailing slash if present
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const formattedBaseUrl = formatBaseUrl(API_BASE_URL);
console.log('Formatted API URL:', formattedBaseUrl);

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: formattedBaseUrl,
    timeout: 30000, // 30 seconds default timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
    config => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to the headers
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Ensure proper API path formatting
        if (config.url && !config.url.startsWith('/api/v1') && !config.url.includes('://')) {
            // Add the API prefix if not already present and not a full URL
            config.url = `/api/v1${config.url.startsWith('/') ? config.url : `/${config.url}`}`;
            console.log(`Updated API URL to ensure API prefix: ${config.url}`);
        }

        // Log the complete URL in development for debugging
        if (process.env.NODE_ENV === 'development') {
            const fullUrl = config.baseURL
                ? `${config.baseURL}${config.url}`
                : config.url;
            console.log(`Making API request to: ${fullUrl}`);
        }

        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
    response => response,
    error => {
        // Log any error for debugging
        console.error('API error:', error);

        // Handle specific error status codes
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const status = error.response.status;

            if (status === 401) {
                console.log('Authentication error (401) - redirecting to login');
                error.userMessage = 'Your session has expired. Please log in again.';
                // Clear token and redirect to login
                localStorage.removeItem('token');
                // Ensure this only runs in the browser context
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                console.log('Authorization error (403) - user lacks permission');
                error.userMessage = 'You do not have permission to access this resource.';
            } else if (status === 404) {
                console.log('Resource not found (404)');
                console.log(`Attempted URL: ${error.config.url}`);
                error.userMessage = `The requested resource (${error.config.url}) was not found on the server.`;
            } else if (status >= 500) {
                console.log(`Server error (${status})`);
                error.userMessage = 'A server error occurred. Please try again later or contact support.';
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.log('Network error - no response received');
            error.userMessage = 'Could not connect to the server. Please check your internet connection.';
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Request configuration error:', error.message);
            error.userMessage = 'An error occurred while preparing the request.';
        }

        return Promise.reject(error);
    }
);

// Special client for audio/form uploads with different default headers and longer timeout
export const uploadClient = axios.create({
    baseURL: formattedBaseUrl,
    timeout: 120000, // 120 seconds timeout for file uploads (increased for larger files)
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    maxContentLength: 25 * 1024 * 1024, // Allow up to 25MB of content
    maxBodyLength: 25 * 1024 * 1024,    // Allow up to 25MB in the request body
});

// Add auth token and logging to upload client as well
uploadClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Ensure proper API path formatting
        if (config.url && !config.url.startsWith('/api/v1') && !config.url.includes('://')) {
            // Add the API prefix if not already present and not a full URL
            config.url = `/api/v1${config.url.startsWith('/') ? config.url : `/${config.url}`}`;
            console.log(`Updated URL to ensure API prefix: ${config.url}`);
        }

        // Log the complete URL in development for debugging
        if (process.env.NODE_ENV !== 'production') {
            const fullUrl = config.baseURL
                ? `${config.baseURL}${config.url}`
                : config.url;
            console.log(`Making upload request to: ${fullUrl}`);
            console.log('Content type:', config.headers['Content-Type']);
        }

        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor to upload client to handle upload-specific errors
uploadClient.interceptors.response.use(
    response => response,
    error => {
        console.error('Upload API error:', error);

        if (error.response) {
            if (error.response.status === 413) {
                console.error('File too large for server');
            }
            // Log details about the request that failed
            console.log(`Failed upload request: ${error.config.method} ${error.config.url}`);
        }

        return Promise.reject(error);
    }
);

// Test connection function
export const testApiConnection = async () => {
    try {
        console.log('Running API connectivity test...');
        console.log('Testing API connection to diagnostic endpoint');

        // Try the proper diagnostic endpoint first
        try {
            const response = await apiClient.get('/api/v1/diagnostic');
            console.log('API diagnostic successful:', response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (initialError) {
            console.error('API diagnostic failed:', initialError);

            // If the first attempt fails, try without the /api prefix
            // (in case the API is mounted at the root level)
            try {
                console.log('Trying alternative diagnostic check...');
                const rootResponse = await apiClient.get('/api/v1/health');
                if (rootResponse.status === 200) {
                    console.log('Alternative API check successful');
                    return {
                        success: true,
                        data: {
                            status: "available",
                            message: "API health endpoint available",
                            diagnostic_endpoint: "missing"
                        },
                        partial: true
                    };
                }
            } catch (fallbackError) {
                console.log('Alternative diagnostic also failed:', fallbackError.message);

                // Try one more fallback to AI health endpoint
                try {
                    const aiHealthResponse = await apiClient.get('/api/v1/ai/process-audio-health');
                    if (aiHealthResponse.status === 200) {
                        console.log('AI health endpoint available');
                        return {
                            success: true,
                            data: {
                                status: "available",
                                message: "AI health endpoint available",
                                diagnostic_endpoint: "missing"
                            },
                            partial: true
                        };
                    }
                } catch (aiHealthError) {
                    console.log('All diagnostic attempts failed');
                }
            }

            // All attempts failed
            return {
                success: false,
                error: initialError.message,
                config: initialError.config,
                response: initialError.response?.data
            };
        }
    } catch (error) {
        console.error('API connectivity test failed:', error);
        return {
            success: false,
            error: error.message,
            config: error.config,
            response: error.response?.data
        };
    }
};

export default apiClient; 