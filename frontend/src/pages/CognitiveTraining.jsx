import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProgressMetrics } from '../api/cognitiveTrainingService';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Fallback metrics in case API call fails - empty values
const DEFAULT_METRICS = {
    user_id: "",
    total_sessions: 0,
    total_time_spent: 0,
    average_scores: {},
    performance_trends: {},
    strengths: [],
    areas_for_improvement: [],
    consistency_score: 0.0
};

const CognitiveTraining = () => {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user's training progress metrics
    useEffect(() => {
        const fetchMetrics = async () => {
            setIsLoading(true);

            try {
                const response = await getProgressMetrics();

                setMetrics(response);
                setError(null);

            } catch (err) {
                console.error('Error fetching metrics:', err);
                setError('Failed to load your progress metrics. Using default values.');
                // Use default metrics if API fails
                setMetrics(DEFAULT_METRICS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    // Available cognitive exercises
    const exercises = [
        {
            id: 'word-recall',
            title: 'Word Recall Challenge',
            description: 'Memorize and recall a series of words to improve memory performance.',
            icon: <span className="text-blue-500 text-3xl">🧠</span>,
            path: '/cognitive-training/word-recall',
            benefits: ['Improves working memory', 'Enhances verbal recall', 'Builds focus and attention'],
            difficulty: 'Beginner to Expert',
            duration: '3-5 minutes'
        },
        {
            id: 'language-fluency',
            title: 'Language Fluency Game',
            description: 'Generate words that start with a specific letter across different categories.',
            icon: <span className="text-green-500 text-3xl">📝</span>,
            path: '/cognitive-training/language-fluency',
            benefits: ['Boosts verbal fluency', 'Improves cognitive flexibility', 'Enhances vocabulary'],
            difficulty: 'Beginner to Expert',
            duration: '2-4 minutes'
        },
        {
            id: 'memory-match',
            title: 'Memory Match Game',
            description: 'Match question cards with their corresponding answers to improve memory and attention.',
            icon: <span className="text-purple-500 text-3xl">🃏</span>,
            path: '/cognitive-training/memory-match',
            benefits: ['Strengthens working memory', 'Improves visual processing', 'Enhances executive function'],
            difficulty: 'Beginner to Expert',
            duration: '2-10 minutes'
        },
        {
            id: 'category-naming',
            title: 'Category Naming Game',
            description: 'Name as many items as possible within a specific category to boost semantic fluency.',
            icon: <span className="text-blue-500 text-3xl">📊</span>,
            path: '/cognitive-training/category-naming',
            benefits: ['Enhances semantic memory', 'Improves word retrieval', 'Boosts cognitive processing speed'],
            difficulty: 'Beginner to Expert',
            duration: '1-3 minutes'
        }
    ];

    // Function to format duration in minutes and seconds
    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}m ${secs}s`;
    };

    // Calculate overall average accuracy across all exercise types
    const calculateOverallAccuracy = (metrics) => {
        if (!metrics || !metrics.average_scores || Object.keys(metrics.average_scores).length === 0) {
            return '0%';
        }

        const scores = Object.values(metrics.average_scores);
        const avgAccuracy = scores.reduce((sum, score) => sum + score, 0) / scores.length;

        return `${Math.round(avgAccuracy)}%`;
    };

    // Render performance chart based on actual user data
    const renderPerformanceChart = (performanceTrends) => {
        if (!performanceTrends || Object.keys(performanceTrends).length === 0) {
            return (
                <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                    No performance data available yet. Complete more exercises to see your progress.
                </p>
            );
        }

        // Colors for different exercise types
        const colors = {
            word_recall: {
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
            },
            language_fluency: {
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'rgba(16, 185, 129, 1)',
            },
            memory_match: {
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                borderColor: 'rgba(147, 51, 234, 1)',
            },
            category_naming: {
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
            }
        };

        // Exercise type display names
        const exerciseNames = {
            word_recall: 'Word Recall',
            language_fluency: 'Language Fluency',
            memory_match: 'Memory Match',
            category_naming: 'Category Naming'
        };

        // Generate datasets from user data
        const datasets = Object.entries(performanceTrends).map(([type, scores], index) => {
            const color = colors[type] || {
                backgroundColor: `rgba(${index * 100}, 99, 132, 0.2)`,
                borderColor: `rgba(${index * 100}, 99, 132, 1)`,
            };

            return {
                label: exerciseNames[type] || type,
                data: scores,
                fill: false,
                backgroundColor: color.backgroundColor,
                borderColor: color.borderColor,
                tension: 0.1
            };
        });

        // Generate labels (session numbers)
        const maxLength = Math.max(...Object.values(performanceTrends).map(arr => arr.length));
        const labels = Array.from({ length: maxLength }, (_, i) => `Session ${i + 1}`);

        const chartData = {
            labels,
            datasets
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
                        callback: function (value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Score (%)',
                        color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                },
                x: {
                    ticks: {
                        color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        };

        return (
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem]">
                <Line data={chartData} options={chartOptions} />
            </div>
        );
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Cognitive Training Exercises
            </h1>

            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Training Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Total Sessions</h3>
                        <p className="text-3xl font-bold">{metrics?.total_sessions || 0}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Time Spent</h3>
                        <p className="text-3xl font-bold">{formatDuration(metrics?.total_time_spent || 0)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Consistency Score</h3>
                        <p className="text-3xl font-bold">
                            {metrics?.consistency_score > 0
                                ? `${Math.round(metrics.consistency_score * 100)}%`
                                : '0%'}
                        </p>
                        <p className="text-sm mt-1 opacity-80">
                            {metrics?.consistency_score >= 0.7
                                ? 'Excellent consistency!'
                                : metrics?.consistency_score >= 0.4
                                    ? 'Good progress, keep it up!'
                                    : 'Complete exercises regularly to improve'}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Average Accuracy</h3>
                        <p className="text-3xl font-bold">
                            {calculateOverallAccuracy(metrics)}
                        </p>
                        <p className="text-sm mt-1 opacity-80">
                            Across all exercise types
                        </p>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
                    <p>{error}</p>
                </div>
            )}

            {/* New User Welcome Message */}
            {metrics && metrics.total_sessions === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 mb-6 rounded-r">
                    <p className="font-medium">Welcome to Cognitive Training!</p>
                    <p className="mt-1">Complete your first exercise to start tracking your progress.</p>
                </div>
            )}

            {/* Exercise Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {exercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex items-start mb-4">
                                <div className="mr-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                    {exercise.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        {exercise.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                                        {exercise.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Benefits:
                                </h3>
                                <ul className="space-y-1">
                                    {exercise.benefits.map((benefit, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300 flex items-center">
                                            <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <div className="flex items-center">
                                    <span className="mr-1">🏋️</span>
                                    <span>Difficulty: {exercise.difficulty}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-1">⏱️</span>
                                    <span>Duration: {exercise.duration}</span>
                                </div>
                            </div>

                            {metrics?.average_scores && exercise.id === 'word-recall' && metrics.average_scores.word_recall && (
                                <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                                        <span className="font-medium">Your Average Score:</span> {metrics.average_scores.word_recall.toFixed(1)}%
                                    </p>
                                </div>
                            )}

                            {metrics?.average_scores && exercise.id === 'language-fluency' && metrics.average_scores.language_fluency && (
                                <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                                        <span className="font-medium">Your Average Score:</span> {metrics.average_scores.language_fluency.toFixed(1)}%
                                    </p>
                                </div>
                            )}

                            {metrics?.average_scores && exercise.id === 'memory-match' && metrics.average_scores.memory_match && (
                                <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                                        <span className="font-medium">Your Average Score:</span> {metrics.average_scores.memory_match.toFixed(1)}%
                                    </p>
                                </div>
                            )}

                            <Link
                                to={exercise.path}
                                className="w-full inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                Start Exercise
                                <span className="ml-1 text-lg">→</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {metrics && (metrics.strengths.length > 0 || metrics.areas_for_improvement.length > 0 ||
                (metrics.performance_trends && Object.keys(metrics.performance_trends).length > 0)) ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Your Cognitive Profile
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {metrics.strengths.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">
                                    Cognitive Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {metrics.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1 rounded-full mr-2 mt-0.5">
                                                <span className="text-sm">+</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 capitalize">
                                                {strength}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {metrics.areas_for_improvement.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-amber-600 dark:text-amber-400 mb-2">
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-2">
                                    {metrics.areas_for_improvement.map((area, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-1 rounded-full mr-2 mt-0.5">
                                                <span className="text-sm">↑</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 capitalize">
                                                {area}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {metrics.performance_trends && Object.keys(metrics.performance_trends).length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Performance Trends
                            </h3>

                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                {renderPerformanceChart(metrics.performance_trends)}
                            </div>
                        </div>
                    )}
                </div>
            ) : null}

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                    Why Cognitive Training Matters
                </h2>
                <p className="text-indigo-700 dark:text-indigo-400 mb-4">
                    Regular cognitive training has been shown to support brain health and may help reduce the risk of cognitive decline. These exercises target specific cognitive domains including memory, attention, language, and executive function.
                </p>
                <p className="text-indigo-700 dark:text-indigo-400">
                    For best results, aim to complete at least 3-4 training sessions per week, varying the types of exercises to challenge different cognitive abilities.
                </p>
            </div>
        </div>
    );
};

export default CognitiveTraining; 