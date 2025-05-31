import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();
const FontSizeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function useFontSize() {
    return useContext(FontSizeContext);
}

export function ThemeProvider({ children }) {
    // Theme state
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
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

    // Font size state
    const [fontSize, setFontSize] = useState(() => {
        const saved = localStorage.getItem('fontSize');
        return saved || 'medium';
    });
    useEffect(() => {
        localStorage.setItem('fontSize', fontSize);
        document.documentElement.setAttribute('data-font-size', fontSize);
    }, [fontSize]);

    const value = {
        theme,
        isDarkMode: theme === 'dark',
        toggleTheme,
        setTheme: setThemeMode
    };
    const fontSizeValue = {
        fontSize,
        setFontSize
    };

    return (
        <ThemeContext.Provider value={value}>
            <FontSizeContext.Provider value={fontSizeValue}>
                {children}
            </FontSizeContext.Provider>
        </ThemeContext.Provider>
    );
} 