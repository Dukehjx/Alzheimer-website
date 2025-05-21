import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Optional: Show a loading spinner or a blank page while auth state is being determined
        // For now, returning null for simplicity during loading.
        return null;
    }

    if (!currentUser) {
        // User not logged in, redirect to login page
        // Pass the current location so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is logged in, render the child components
    return children;
};

export default ProtectedRoute; 