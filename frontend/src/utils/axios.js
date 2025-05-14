import axios from 'axios';

// Create axios instance with default config
const instance = axios.create({
    // Not setting baseURL allows it to use relative URLs
    // which will work with both HTTP and HTTPS
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to apply common headers
instance.interceptors.request.use(
    config => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Handle unauthorized errors (401)
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default instance; 