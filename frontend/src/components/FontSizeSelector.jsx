import React from 'react';
import { useFontSize } from '../contexts/ThemeContext';

export default function FontSizeSelector({ className = '' }) {
    const { fontSize, setFontSize } = useFontSize();

    const fontSizes = [
        { value: 'small', label: 'A', size: 'text-sm' },
        { value: 'medium', label: 'A', size: 'text-base' },
        { value: 'large', label: 'A', size: 'text-lg' }
    ];

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {fontSizes.map((size) => (
                <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`
                        relative inline-flex items-center justify-center w-8 h-8 rounded-md font-bold transition-colors
                        ${fontSize === size.value
                            ? 'bg-primary-600 text-white dark:bg-primary-500'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        }
                        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
                        ${size.size}
                    `}
                    aria-label={`Set font size to ${size.value}`}
                    title={`Font size: ${size.value}`}
                >
                    {size.label}
                </button>
            ))}
        </div>
    );
} 