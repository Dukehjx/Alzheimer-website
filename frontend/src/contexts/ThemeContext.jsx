import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    // Check for user preference in localStorage, default to 'light' if none exists
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        // Check if user has previously selected a theme
        if (savedTheme) {
            return savedTheme;
        }
        // Check for system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        // Default to light theme
        return 'light';
    });

    // Update localStorage and apply theme class to document when theme changes
    useEffect(() => {
        localStorage.setItem('theme', theme);

        // Apply or remove dark class based on theme
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Toggle between light and dark themes
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Set a specific theme
    const setThemeMode = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setTheme(mode);
        }
    };

    const value = {
        theme,
        isDarkMode: theme === 'dark',
        toggleTheme,
        setTheme: setThemeMode
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
} 