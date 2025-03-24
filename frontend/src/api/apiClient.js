import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create an Axios instance with default configs
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Clean the token and ensure proper formatting
            const cleanToken = token.trim();

            // Ensure there's exactly one space after "Bearer"
            config.headers.Authorization = `Bearer ${cleanToken}`;

            // Debug token issues in development
            if (process.env.NODE_ENV === 'development') {
                console.log('Authorization header:', config.headers.Authorization);
            }
        }

        // Don't override Content-Type if it's already set in the request
        if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            // Keep the existing Content-Type
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle expired tokens
        if (error.response && error.response.status === 401) {
            console.log('Received 401 Unauthorized response:', error.response.data);

            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');

            // Reset headers
            delete apiClient.defaults.headers.common['Authorization'];

            // If needed, redirect to login or dispatch logout action
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Handle server errors
        if (error.response && error.response.status >= 500) {
            console.error('Server Error:', error.response.data);
            // You could dispatch to an error-handling service here
        }

        return Promise.reject(error);
    }
);

export default apiClient; 