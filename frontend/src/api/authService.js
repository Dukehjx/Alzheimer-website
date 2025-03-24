import apiClient from './apiClient';

/**
 * Authentication Service
 * Handles authentication-related API calls
 */
const authService = {
    /**
     * Login user with email and password
     * @param {string} email User's email
     * @param {string} password User's password
     * @returns {Promise} Response with user data and token
     */
    login: async (email, password) => {
        try {
            // Use FormData for OAuth2 compatibility
            const formData = new URLSearchParams();
            formData.append('username', email); // OAuth2 uses 'username' field
            formData.append('password', password);

            const response = await apiClient.post('/api/v1/auth/login', formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            // Store token in localStorage
            if (response.data.access_token) {
                const token = response.data.access_token.trim(); // Ensure no whitespace
                localStorage.setItem('token', token);

                // Set the token for immediate use in the next request
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Clear any previous token from sessionStorage to avoid conflicts
                sessionStorage.removeItem('token');

                // Since the OAuth2 response doesn't include user data, we need to fetch it
                try {
                    const userResponse = await authService.getCurrentUser();
                    localStorage.setItem('user', JSON.stringify(userResponse));
                    return {
                        token: token,
                        user: userResponse
                    };
                } catch (error) {
                    console.error('Error fetching user data after login:', error);

                    // Even if we can't get the user data, consider the login successful
                    // The token is valid, we just couldn't fetch the user profile
                    return {
                        token: token,
                        user: { email }  // Return minimal user info
                    };
                }
            } else {
                throw new Error('No access token received from server');
            }
        } catch (error) {
            console.error('Login error in service:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Register a new user
     * @param {Object} userData User data (name, email, password)
     * @returns {Promise} Response with user data and token
     */
    register: async (userData) => {
        try {
            // Convert name to full_name as expected by the backend
            const modifiedUserData = {
                ...userData,
                full_name: userData.name
            };

            // Remove name as it's not expected by the backend
            delete modifiedUserData.name;

            const response = await apiClient.post('/api/v1/auth/register', modifiedUserData);

            // Store user data
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));

                // Try to log in automatically after registration
                try {
                    return await authService.login(userData.email, userData.password);
                } catch (loginError) {
                    console.error('Auto-login after registration failed:', loginError);
                    // Continue with registration even if auto-login fails
                    return response.data;
                }
            }

            return response.data;
        } catch (error) {
            console.error('Registration error in service:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Logout user - clear tokens and storage
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');

        // Clear the authorization header
        delete apiClient.defaults.headers.common['Authorization'];

        // Also reset axios instance just to be safe
        apiClient.defaults.headers.common = {
            'Content-Type': 'application/json'
        };
    },

    /**
     * Get current authenticated user info
     * @returns {Promise} Response with user data
     */
    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Debug the token
            const cleanToken = token.trim();

            // Ensure the Authorization header is set
            const response = await apiClient.get('/api/v1/auth/me', {
                headers: {
                    'Authorization': `Bearer ${cleanToken}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Get user error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Check if user is logged in
     * @returns {Boolean} Authentication status
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get current user data from localStorage
     * @returns {Object|null} User data or null
     */
    getUserData: () => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }
};

export default authService; 