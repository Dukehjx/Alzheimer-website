import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // In a real app, this would make an API call to your backend
    // For demo purposes, we'll simulate a successful login
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
        id: '123456',
        email,
        name: 'Demo User',
        profilePicture: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  // Register function
  const register = async (name, email, password) => {
    // In a real app, this would make an API call to your backend
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData = {
        id: '123456',
        email,
        name,
        profilePicture: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 