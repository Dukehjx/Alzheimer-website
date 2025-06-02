import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClockIcon,
    TrophyIcon,
    ArrowPathIcon,
    HomeIcon,
    CheckCircleIcon,
    PlayIcon,
    LightBulbIcon,
    PaperAirplaneIcon,
    StarIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    ArrowLeftIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import {
    CATEGORIES,
    DIFFICULTY_LEVELS,
    TIME_LIMITS,
    getRandomCategory,
    isValidCategoryEntry,
    calculateScore,
    getPerformanceFeedback,
    getCategoryHints
} from '../../data/categoryNamingData';
import { submitCategoryNamingResults } from '../../api/cognitiveTrainingService';

// Game states
const GAME_STATES = {
    SETUP: 'setup',
    PLAYING: 'playing',
    COMPLETED: 'completed'
};

export default function CategoryNamingGame() {
    // Navigation
    const navigate = useNavigate();

    // Refs
    const inputRef = useRef(null);
    const entryListRef = useRef(null);
    const timerIntervalRef = useRef(null);

    // Game state
    const [gameState, setGameState] = useState(GAME_STATES.SETUP);
    const [difficulty, setDifficulty] = useState('MEDIUM');
    const [categorySelection, setCategorySelection] = useState('random');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [timeLimit, setTimeLimit] = useState(TIME_LIMITS.MEDIUM);
    const [timeRemaining, setTimeRemaining] = useState(TIME_LIMITS.MEDIUM);
    const [currentEntry, setCurrentEntry] = useState('');
    const [correctEntries, setCorrectEntries] = useState([]);
    const [rareEntries, setRareEntries] = useState([]);
    const [message, setMessage] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [hints, setHints] = useState([]);
    const [hintAvailable, setHintAvailable] = useState(false);

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Score state
    const [scoreData, setScoreData] = useState(null);

    // Set time limit based on difficulty
    useEffect(() => {
        if (difficulty === 'EASY') {
            setTimeLimit(TIME_LIMITS.EASY);
            setTimeRemaining(TIME_LIMITS.EASY);
        } else if (difficulty === 'MEDIUM') {
            setTimeLimit(TIME_LIMITS.MEDIUM);
            setTimeRemaining(TIME_LIMITS.MEDIUM);
        } else if (difficulty === 'HARD') {
            setTimeLimit(TIME_LIMITS.HARD);
            setTimeRemaining(TIME_LIMITS.HARD);
        }
    }, [difficulty]);

    // Timer effect
    useEffect(() => {
        if (gameState === GAME_STATES.PLAYING && timeRemaining > 0) {
            timerIntervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current);
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });

                // Make hint available after 15 seconds
                if (timeRemaining === timeLimit - 15 && !hintAvailable) {
                    setHintAvailable(true);
                }
            }, 1000);

            return () => clearInterval(timerIntervalRef.current);
        }
    }, [gameState, timeRemaining, timeLimit, hintAvailable]);

    // Focus input on game start
    useEffect(() => {
        if (gameState === GAME_STATES.PLAYING && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);

    // Initialize game
    const initializeGame = useCallback(() => {
        // Reset game state
        setCorrectEntries([]);
        setRareEntries([]);
        setMessage(null);
        setCurrentEntry('');
        setShowHint(false);
        setHintAvailable(false);
        setSubmissionError(null);
        setSubmissionSuccess(false);
        setScoreData(null);

        // Reset timer
        if (difficulty === 'EASY') {
            setTimeRemaining(TIME_LIMITS.EASY);
        } else if (difficulty === 'MEDIUM') {
            setTimeRemaining(TIME_LIMITS.MEDIUM);
        } else {
            setTimeRemaining(TIME_LIMITS.HARD);
        }

        // Select category
        let category;
        if (categorySelection === 'random' || !selectedCategory) {
            category = getRandomCategory();
            setSelectedCategory(category);
        } else {
            category = CATEGORIES.find(cat => cat.id === selectedCategory.id) || getRandomCategory();
            setSelectedCategory(category);
        }

        // Generate hints
        setHints(getCategoryHints(category.id));

    }, [difficulty, categorySelection, selectedCategory]);

    // Start game
    const startGame = () => {
        initializeGame();
        setGameState(GAME_STATES.PLAYING);
    };

    // Handle input change
    const handleInputChange = (e) => {
        setCurrentEntry(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentEntry.trim() || gameState !== GAME_STATES.PLAYING) {
            return;
        }

        // Check if already submitted
        const normalizedEntry = currentEntry.trim().toLowerCase();
        if (correctEntries.some(entry => entry.toLowerCase() === normalizedEntry)) {
            showMessage('duplicate', normalizedEntry);
            return;
        }

        // Validate entry
        const result = isValidCategoryEntry(normalizedEntry, selectedCategory.words);

        if (result.isValid) {
            // Add to correct entries
            setCorrectEntries(prev => [...prev, result.word]);

            // Check if rare
            if (result.isRare) {
                setRareEntries(prev => [...prev, result.word]);
                showMessage('rare', result.word);
            } else {
                showMessage('correct', result.word);
            }

            // Clear input
            setCurrentEntry('');

            // Scroll to bottom of list
            setTimeout(() => {
                if (entryListRef.current) {
                    entryListRef.current.scrollTop = entryListRef.current.scrollHeight;
                }
            }, 100);
        } else {
            showMessage('invalid', normalizedEntry);
        }
    };

    // Show message with auto-clearing
    const showMessage = (type, word) => {
        let messageText = '';
        let messageClass = '';

        switch (type) {
            case 'correct':
                messageText = '✓ Correct!';
                messageClass = 'text-green-600 dark:text-green-400';
                break;
            case 'rare':
                messageText = '★ Rare word! +2 pts';
                messageClass = 'text-blue-600 dark:text-blue-400';
                break;
            case 'duplicate':
                messageText = 'Already entered!';
                messageClass = 'text-orange-600 dark:text-orange-400';
                break;
            case 'invalid':
                messageText = `✗ Not in ${selectedCategory.name}`;
                messageClass = 'text-red-600 dark:text-red-400';
                break;
            default:
                return;
        }

        setMessage({ text: messageText, class: messageClass });

        // Clear message after 1.5 seconds
        setTimeout(() => {
            setMessage(null);
        }, 1500);
    };

    // End game
    const endGame = () => {
        // Clear timer
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        // Calculate score
        const score = calculateScore(
            correctEntries.length,
            rareEntries.length,
            difficulty
        );

        setScoreData(score);
        setGameState(GAME_STATES.COMPLETED);

        // Submit results
        submitGameResults(score);
    };

    // Show hint
    const handleShowHint = () => {
        if (hintAvailable) {
            setShowHint(true);
        }
    };

    // Submit game results
    const submitGameResults = async (score) => {
        try {
            setIsSubmitting(true);
            setSubmissionError(null);

            // Generate exercise ID
            const exerciseId = `category-naming-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Prepare results
            const gameResults = {
                exercise_id: exerciseId,
                category_id: selectedCategory.id,
                difficulty: difficulty,
                time_limit: timeLimit,
                time_elapsed: timeLimit - timeRemaining,
                correct_entries: correctEntries,
                rare_entries_count: rareEntries.length,
                base_score: score.baseScore,
                rare_bonus: score.rareBonus,
                milestone_bonus: score.milestoneBonus,
                final_score: score.finalScore
            };

            console.log('Submitting Category Naming results:', gameResults);

            // Submit to API
            const response = await submitCategoryNamingResults(gameResults);

            console.log('Category Naming submission successful:', response);
            setSubmissionSuccess(true);

        } catch (error) {
            console.error('Failed to submit Category Naming results:', error);
            setSubmissionError(error.message || 'Failed to save your progress');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset game
    const resetGame = () => {
        setGameState(GAME_STATES.SETUP);
    };

    // Navigate back to cognitive training page
    const goBackToCognitiveTraining = () => {
        navigate('/cognitive-training');
    };

    // Format time for display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Render setup screen
    const renderSetup = () => (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <TrophyIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Category Naming Game
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Name as many items as you can in a given category within the time limit.
                    Improve your verbal fluency and semantic memory with this cognitive training exercise.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Difficulty Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Choose Difficulty
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                            <button
                                key={key}
                                onClick={() => setDifficulty(key)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${difficulty === key
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {level.name}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {level.description} • {level.timeLimit} seconds
                                        </div>
                                    </div>
                                    {difficulty === key && (
                                        <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Choose Category Option
                    </h3>
                    <div className="space-y-4">
                        <button
                            onClick={() => setCategorySelection('random')}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${categorySelection === 'random'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Random Category</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        System selects a random category for you
                                    </div>
                                </div>
                                {categorySelection === 'random' && (
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                )}
                            </div>
                        </button>

                        <button
                            onClick={() => setCategorySelection('choose')}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${categorySelection === 'choose'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Choose Category</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Select a specific category from the list
                                    </div>
                                </div>
                                {categorySelection === 'choose' && (
                                    <CheckCircleIcon className="h-6 w-6 text-purple-500" />
                                )}
                            </div>
                        </button>

                        {categorySelection === 'choose' && (
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Select Category
                                </label>
                                <select
                                    id="category-select"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    onChange={(e) => {
                                        const selected = CATEGORIES.find(cat => cat.id === e.target.value);
                                        setSelectedCategory(selected || null);
                                    }}
                                    value={selectedCategory?.id || ''}
                                >
                                    <option value="">Select a category</option>
                                    {CATEGORIES.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={startGame}
                    disabled={categorySelection === 'choose' && !selectedCategory}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center ${categorySelection === 'choose' && !selectedCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Start Game
                </button>

                <div className="mt-4">
                    <button
                        onClick={goBackToCognitiveTraining}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium flex items-center mx-auto"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Cognitive Training
                    </button>
                </div>
            </div>
        </div>
    );

    // Render playing screen
    const renderPlaying = () => (
        <div className="max-w-4xl mx-auto">
            {/* Game header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {selectedCategory?.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Name as many {selectedCategory?.name.toLowerCase()} as you can
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                            <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                            <span className="text-blue-800 dark:text-blue-300 font-semibold">
                                {formatTime(timeRemaining)}
                            </span>
                        </div>

                        <div className="flex items-center bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                            <span className="text-green-800 dark:text-green-300 font-semibold">
                                {correctEntries.length} named
                            </span>
                        </div>

                        {rareEntries.length > 0 && (
                            <div className="flex items-center bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                                <StarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                                <span className="text-purple-800 dark:text-purple-300 font-semibold">
                                    {rareEntries.length} rare
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Game content */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Input section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={currentEntry}
                                onChange={handleInputChange}
                                placeholder={`Type a ${selectedCategory?.name.toLowerCase()} name...`}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoComplete="off"
                                disabled={gameState !== GAME_STATES.PLAYING}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1"
                                disabled={!currentEntry.trim() || gameState !== GAME_STATES.PLAYING}
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </form>

                    {/* Feedback message */}
                    {message && (
                        <div className={`text-center p-2 rounded-lg mb-4 ${message.class}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Hint section */}
                    <div className="mt-4">
                        {!showHint && hintAvailable && (
                            <button
                                onClick={handleShowHint}
                                className="flex items-center justify-center w-full py-2 px-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                            >
                                <LightBulbIcon className="h-5 w-5 mr-2" />
                                Show Hint
                            </button>
                        )}

                        {showHint && hints.length > 0 && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <div className="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-1">
                                    Hints:
                                </div>
                                <div className="text-yellow-700 dark:text-yellow-400">
                                    e.g., {hints.join(', ')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Entries list */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Your Entries
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {correctEntries.length} total
                        </span>
                    </div>

                    {correctEntries.length === 0 ? (
                        <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                            Start typing to add entries
                        </div>
                    ) : (
                        <div
                            ref={entryListRef}
                            className="h-60 overflow-y-auto pr-2 space-y-1"
                        >
                            {correctEntries.map((entry, index) => {
                                const isRare = rareEntries.includes(entry);
                                return (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-md ${isRare ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300' : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">
                                                {index + 1}.
                                            </span>
                                            <span className="flex-grow">{entry}</span>
                                            {isRare && (
                                                <StarIcon className="h-4 w-4 text-purple-500 dark:text-purple-400 ml-1" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Render completed screen
    const renderCompleted = () => {
        // Get performance feedback
        const feedback = getPerformanceFeedback(correctEntries.length);

        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="text-center mb-6">
                        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 
                            ${feedback.type === 'excellent' ? 'bg-green-100 dark:bg-green-900' :
                                feedback.type === 'good' ? 'bg-blue-100 dark:bg-blue-900' :
                                    feedback.type === 'fair' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                        'bg-orange-100 dark:bg-orange-900'}`}
                        >
                            <TrophyIcon className={`h-10 w-10 
                                ${feedback.type === 'excellent' ? 'text-green-600 dark:text-green-400' :
                                    feedback.type === 'good' ? 'text-blue-600 dark:text-blue-400' :
                                        feedback.type === 'fair' ? 'text-yellow-600 dark:text-yellow-400' :
                                            'text-orange-600 dark:text-orange-400'}`}
                            />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Time's Up!
                        </h2>

                        <p className="text-xl text-gray-700 dark:text-gray-300">
                            You named {correctEntries.length} {selectedCategory.name.toLowerCase()} in {formatTime(timeLimit)} seconds!
                        </p>
                    </div>

                    {/* Score breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {scoreData?.finalScore || 0}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Final Score</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {correctEntries.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Words Named</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {rareEntries.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Rare Words</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {timeLimit}s
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Time Limit</div>
                        </div>
                    </div>

                    {/* Score details */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Score Breakdown
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">Base Score ({correctEntries.length} × 1pt):</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{scoreData?.baseScore || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">Rare Word Bonus ({rareEntries.length} × 2pts):</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">+{scoreData?.rareBonus || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">Milestone Bonus:</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">+{scoreData?.milestoneBonus || 0}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2 flex justify-between items-center">
                                <span className="font-semibold text-gray-900 dark:text-white">Final Score:</span>
                                <span className="font-bold text-lg text-gray-900 dark:text-white">{scoreData?.finalScore || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Feedback message */}
                    <div className={`p-4 rounded-lg mb-6 
                        ${feedback.type === 'excellent' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                            feedback.type === 'good' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                                feedback.type === 'fair' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                                    'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'}`}
                    >
                        <p className={`font-medium 
                            ${feedback.type === 'excellent' ? 'text-green-800 dark:text-green-200' :
                                feedback.type === 'good' ? 'text-blue-800 dark:text-blue-200' :
                                    feedback.type === 'fair' ? 'text-yellow-800 dark:text-yellow-200' :
                                        'text-orange-800 dark:text-orange-200'}`}
                        >
                            {feedback.message}
                        </p>
                    </div>

                    {/* Submission status */}
                    {isSubmitting && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                                <p className="text-blue-800 dark:text-blue-200 font-medium">
                                    Saving your progress...
                                </p>
                            </div>
                        </div>
                    )}

                    {submissionSuccess && !isSubmitting && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                                <p className="text-green-800 dark:text-green-200 font-medium">
                                    Progress saved successfully!
                                </p>
                            </div>
                        </div>
                    )}

                    {submissionError && !isSubmitting && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <XCircleIcon className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-red-800 dark:text-red-200 font-medium">
                                        Failed to save progress
                                    </p>
                                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                                        {submissionError}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Entries */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Your Entries
                            </h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {correctEntries.length} total
                            </span>
                        </div>

                        <div className="max-h-60 overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {correctEntries.map((entry, index) => {
                                    const isRare = rareEntries.includes(entry);
                                    return (
                                        <div
                                            key={index}
                                            className={`p-2 rounded-md flex items-center ${isRare ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-white dark:bg-gray-800'}`}
                                        >
                                            <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">
                                                {index + 1}.
                                            </span>
                                            <span className={`flex-grow ${isRare ? 'text-purple-800 dark:text-purple-300' : 'text-gray-800 dark:text-gray-300'}`}>
                                                {entry}
                                            </span>
                                            {isRare && (
                                                <StarIcon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={startGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                            Play Again
                        </button>

                        <button
                            onClick={resetGame}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                            <HomeIcon className="h-5 w-5 mr-2" />
                            Change Settings
                        </button>

                        <button
                            onClick={goBackToCognitiveTraining}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Back to Cognitive Games
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                {gameState === GAME_STATES.SETUP && renderSetup()}
                {gameState === GAME_STATES.PLAYING && renderPlaying()}
                {gameState === GAME_STATES.COMPLETED && renderCompleted()}
            </div>
        </div>
    );
} 