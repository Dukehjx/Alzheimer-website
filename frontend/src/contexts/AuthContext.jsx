import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Clear any error message
    const clearError = () => {
        setError(null);
    };

    // Check if user is logged in from localStorage on component mount
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                if (authService.isAuthenticated()) {
                    // Get user data from localStorage
                    const userData = authService.getUserData();
                    setCurrentUser(userData);

                    // Optionally verify token with backend
                    try {
                        const freshUserData = await authService.getCurrentUser();
                        // Update user data with fresh data from server
                        setCurrentUser(freshUserData);
                        localStorage.setItem('user', JSON.stringify(freshUserData));
                    } catch (err) {
                        console.error('Token validation error:', err);
                        // If token is invalid, logout
                        if (err.response?.status === 401) {
                            authService.logout();
                            setCurrentUser(null);
                        }
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(email, password);

            // Even if we couldn't get full user data, we'll consider login successful
            // if we have a valid token
            if (data.token) {
                setCurrentUser(data.user || { email });
                return data;
            } else {
                throw new Error('Login failed: No token received');
            }
        } catch (err) {
            console.error('Login error in context:', err.response?.data || err.message);

            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError(err.response?.data?.message || 'Login failed');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register(userData);
            // If we have a token, we've successfully logged in after registration
            if (data.token) {
                setCurrentUser(data.user || { email: userData.email });
            } else {
                // Otherwise, set the user from registration response
                setCurrentUser(data);
            }
            return data;
        } catch (err) {
            console.error('Registration error in context:', err.response?.data || err.message);

            if (err.response?.data?.details) {
                // Handle validation errors
                const validationErrors = err.response.data.details;
                const errorMessages = validationErrors.map(error => error.msg);
                setError(errorMessages.join('. '));
            } else {
                setError(err.response?.data?.message || err.response?.data?.detail || 'Registration failed');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setCurrentUser(null);
        setError(null);
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        loading,
        error,
        clearError,
        isAuthenticated: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
} 