import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import languageFluencyWordBanks from './languageFluencyWordBanks';

// Difficulty level options
const DIFFICULTY_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
];

const LanguageFluencyGame = () => {
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState('beginner');
    const [exercise, setExercise] = useState(null);
    const [gameState, setGameState] = useState('setup'); // setup, playing, results
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState({});
    const [currentWords, setCurrentWords] = useState({});
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [totalDuration, setTotalDuration] = useState(0);

    const timerRef = useRef(null);
    const inputRef = useRef(null);

    // Submit answers for evaluation
    const handleSubmit = useCallback(async () => {
        // Clear any running timers
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setIsLoading(true);
        setError(null);

        // Calculate total duration in seconds
        const endTime = Date.now();
        const duration = startTime ? Math.floor((endTime - startTime) / 1000) : null;
        setTotalDuration(duration);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/cognitive-training/language-fluency/submit`,
                {
                    exercise_id: exercise?.id,
                    answers,
                    duration: duration
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setResults(response.data);
            setGameState('results');

        } catch (err) {
            console.error('Error submitting answers:', err);

            // Generate hardcoded results in case of API failure
            if (exercise && exercise.content) {
                const targetLetter = exercise.content.letter.toLowerCase();
                const categories = exercise.content.categories;
                const minWordsPerCategory = exercise.content.min_words_per_category;

                const categoryResults = {};
                let totalScore = 0;
                let categoriesAchievedMinimum = 0;

                categories.forEach(category => {
                    // Get valid words (starting with the correct letter)
                    const userAnswersForCategory = answers[category] || [];
                    const validWords = userAnswersForCategory.filter(word =>
                        word.toLowerCase().startsWith(targetLetter)
                    );
                    const uniqueValidWords = [...new Set(validWords)]; // Remove duplicates

                    // Calculate category metrics
                    const achievedMinimum = uniqueValidWords.length >= minWordsPerCategory;
                    if (achievedMinimum) categoriesAchievedMinimum++;

                    const categoryScore = Math.min(100, (uniqueValidWords.length / minWordsPerCategory) * 100);
                    totalScore += categoryScore;

                    categoryResults[category] = {
                        words: uniqueValidWords,
                        valid_count: uniqueValidWords.length,
                        achieved_minimum: achievedMinimum,
                        score: categoryScore
                    };
                });

                // Calculate overall metrics
                const averageScore = totalScore / categories.length;
                const accuracy = categoriesAchievedMinimum / categories.length;

                // Determine feedback based on performance
                let feedback;
                if (accuracy >= 0.8) {
                    feedback = "Excellent verbal fluency! Your ability to generate words quickly is impressive.";
                } else if (accuracy >= 0.6) {
                    feedback = "Good verbal fluency. With practice, you can improve your word generation speed.";
                } else {
                    feedback = "Your verbal fluency could use some improvement. Try reading more and playing word games to enhance your vocabulary.";
                }

                const mockResults = {
                    score: averageScore,
                    accuracy: accuracy,
                    feedback: feedback,
                    details: {
                        category_results: categoryResults
                    },
                    session_id: 'session-' + Date.now()
                };

                setResults(mockResults);
                setGameState('results');
            }
        } finally {
            setIsLoading(false);
        }
    }, [exercise, answers, startTime, timerRef]);

    // Generate a new exercise based on selected difficulty
    const generateExercise = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.post(
                `${API_BASE_URL}/api/v1/cognitive-training/exercises`,
                {
                    difficulty,
                    exercise_type: 'language_fluency'
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Define parameters based on selected difficulty
            let timeLimit, minWordsPerCategory, categoryCount;
            let categoryPool = [];
            let letterPool = [];

            switch (difficulty) {
                case 'beginner':
                    timeLimit = 60;
                    minWordsPerCategory = 3;
                    categoryCount = 1;
                    categoryPool = ["animals", "foods", "colors", "clothing", "cities"];
                    letterPool = ["A", "S", "B", "E", "M", "P", "T", "R"];
                    break;
                case 'intermediate':
                    timeLimit = 50;
                    minWordsPerCategory = 4;
                    categoryCount = 2;
                    categoryPool = ["professions", "sports", "countries", "musical instruments", "vehicles", "body parts"];
                    letterPool = ["F", "G", "H", "L", "N", "O", "W", "A", "B"];
                    break;
                case 'advanced':
                    timeLimit = 45;
                    minWordsPerCategory = 5;
                    categoryCount = 3;
                    categoryPool = ["scientific terms", "historical figures", "literary works", "medical conditions", "geographical features"];
                    letterPool = ["I", "C", "D", "Q", "U", "X", "Y", "Z"];
                    break;
                case 'expert':
                    timeLimit = 40;
                    minWordsPerCategory = 6;
                    categoryCount = 4;
                    categoryPool = ["philosophical concepts", "rare plants", "chemical compounds", "neurological terms", "architectural elements"];
                    letterPool = ["J", "K", "V", "W", "X", "Y", "Z"];
                    break;
                default:
                    timeLimit = 60;
                    minWordsPerCategory = 3;
                    categoryCount = 1;
                    categoryPool = ["animals", "foods", "colors", "clothing", "cities"];
                    letterPool = ["A", "S", "B", "E", "M", "P", "T", "R"];
            }

            // Randomly select categories for the exercise
            const shuffledCategories = [...categoryPool].sort(() => 0.5 - Math.random());
            const selectedCategories = shuffledCategories.slice(0, categoryCount);

            // Randomly select a letter for the exercise
            const randomLetter = letterPool[Math.floor(Math.random() * letterPool.length)];

            // Create exercise ID with timestamp, random number and difficulty
            const timestamp = Date.now();
            const randomId = Math.floor(Math.random() * 9000) + 1000;
            const exerciseId = `langfluency-${timestamp}-${randomId}-${difficulty}-${randomLetter}-${selectedCategories.join('-')}`;

            // Create a hardcoded exercise with the parameters
            const hardcodedExercise = {
                id: exerciseId,
                title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Language Fluency Game`,
                description: `Generate words starting with the letter '${randomLetter}' in different categories.`,
                exercise_type: "language_fluency",
                difficulty: difficulty,
                estimated_duration: timeLimit + 15,  // Extra time for setup
                instructions: `You will have ${timeLimit} seconds to come up with at least ${minWordsPerCategory} words for each category that start with the letter '${randomLetter}'.`,
                content: {
                    letter: randomLetter,
                    categories: selectedCategories,
                    time_limit: timeLimit,
                    min_words_per_category: minWordsPerCategory
                },
                cognitive_domains: ["verbal fluency", "executive function", "processing speed", "semantic memory"]
            };

            // Initialize answers object with empty arrays for each category
            const initialAnswers = {};
            const initialCurrentWords = {};
            selectedCategories.forEach(category => {
                initialAnswers[category] = [];
                initialCurrentWords[category] = '';
            });

            setExercise(hardcodedExercise);
            setAnswers(initialAnswers);
            setCurrentWords(initialCurrentWords);
            setActiveCategory(hardcodedExercise.content.categories[0]);
            setGameState('playing');
            setTimeLeft(hardcodedExercise.content.time_limit);
            // Record start time when beginning the exercise
            setStartTime(Date.now());

        } catch (err) {
            console.error('Error generating exercise:', err);
            setError('Failed to generate a new exercise. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Start the timer for the game
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearTimeout(timerRef.current);
        } else if (gameState === 'playing' && timeLeft === 0) {
            // Submit answers when time is up
            handleSubmit();
        }
    }, [gameState, timeLeft, handleSubmit]);

    // Focus on the input field when active category changes
    useEffect(() => {
        if (gameState === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState, activeCategory]);

    // Handle input change for the current category
    const handleInputChange = (e) => {
        setCurrentWords({
            ...currentWords,
            [activeCategory]: e.target.value
        });
    };

    // Get the correct word list for the current difficulty, category, and letter
    const getWordBank = (difficulty, category, letter) => {
        const diff = difficulty.toLowerCase();
        // Normalize category key (snake_case)
        const catKey = Object.keys(languageFluencyWordBanks[diff]).find(
            k => k.replace(/_/g, ' ').toLowerCase() === category.replace(/_/g, ' ').toLowerCase()
        ) || category;
        const bank = languageFluencyWordBanks[diff]?.[catKey]?.[letter.toUpperCase()];
        return Array.isArray(bank) ? new Set(bank.map(w => w.toLowerCase())) : new Set();
    };

    // Add a word to the current category
    const addWord = (e) => {
        e.preventDefault();

        const word = currentWords[activeCategory].trim();
        if (!word) return;

        // Get the correct word list for the current difficulty, category, and letter
        const wordBank = getWordBank(difficulty, activeCategory, exercise.content.letter);
        if (!wordBank.has(word.toLowerCase())) {
            setError(`"${word}" is not in the accepted word list for this category and letter.`);
            setTimeout(() => setError(null), 2000);
            return;
        }

        // Add the word if it's not already in the list (case-insensitive)
        if (!answers[activeCategory].some(w => w.toLowerCase() === word.toLowerCase())) {
            setAnswers({
                ...answers,
                [activeCategory]: [...answers[activeCategory], word]
            });
        }

        setCurrentWords({
            ...currentWords,
            [activeCategory]: ''
        });
    };

    // Remove a word from a category
    const removeWord = (category, wordToRemove) => {
        setAnswers({
            ...answers,
            [category]: answers[category].filter(word => word !== wordToRemove)
        });
    };

    // Change the active category
    const changeCategory = (category) => {
        setActiveCategory(category);
    };

    // Reset the game to setup state
    const resetGame = () => {
        setExercise(null);
        setGameState('setup');
        setAnswers({});
        setCurrentWords({});
        setResults(null);
        setError(null);
        setActiveCategory(null);
        setStartTime(null);
        setTotalDuration(0);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    // Render setup screen to select difficulty
    const renderSetup = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Language Fluency Game
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Generate words that start with a specific letter across different categories.
                This exercise helps improve your verbal fluency and language skills.
            </p>

            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Select Difficulty:
                </label>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {DIFFICULTY_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>
                            {level.label}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={generateExercise}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isLoading ? 'Loading...' : 'Start Game'}
            </button>

            {error && (
                <div className="mt-4 text-red-500 text-center">
                    {error}
                </div>
            )}
        </div>
    );

    // Render the main game screen
    const renderPlaying = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Words Starting with "{exercise.content.letter}"
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Enter at least {exercise.content.min_words_per_category} words per category
                    </p>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <span className="font-semibold">{timeLeft}s</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Category tabs */}
                <div className="md:w-1/4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Categories:
                    </h3>
                    <div className="flex flex-col gap-2">
                        {exercise.content.categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => changeCategory(category)}
                                className={`
                  px-4 py-3 rounded-md text-left font-medium transition-colors
                  ${activeCategory === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}
                  ${answers[category].length >= exercise.content.min_words_per_category
                                        ? 'border-l-4 border-green-500'
                                        : ''}
                `}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{category}</span>
                                    <span className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-xs px-2 py-1 rounded-full">
                                        {answers[category].length}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit All'}
                    </button>
                </div>

                {/* Active category input and word list */}
                <div className="md:w-3/4 bg-gray-50 dark:bg-gray-750 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white capitalize mb-4">
                        {activeCategory}
                    </h3>

                    <form onSubmit={addWord} className="mb-6">
                        <div className="flex">
                            <div className="bg-blue-500 text-white font-bold px-4 py-2 rounded-l-md flex items-center">
                                {exercise.content.letter}
                            </div>
                            <input
                                type="text"
                                ref={inputRef}
                                value={currentWords[activeCategory] || ''}
                                onChange={handleInputChange}
                                placeholder={`Enter a ${activeCategory} that starts with "${exercise.content.letter}"...`}
                                className="flex-grow px-4 py-2 border-y border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
                            />
                            <button
                                type="submit"
                                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                +
                            </button>
                        </div>
                    </form>

                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your {activeCategory} Words ({answers[activeCategory]?.length || 0}):
                        </h4>

                        {answers[activeCategory]?.length > 0 ? (
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                                <div className="flex flex-wrap gap-2">
                                    {answers[activeCategory].map((word, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full"
                                        >
                                            <span className="text-gray-800 dark:text-white mr-1">{word}</span>
                                            <button
                                                onClick={() => removeWord(activeCategory, word)}
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                            >
                                                -
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">
                                No words added yet.
                            </p>
                        )}
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-r-md">
                        <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                            <strong>Tip:</strong> Try to think of less common words. Be creative!
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 text-red-500 text-center">
                    {error}
                </div>
            )}
        </div>
    );

    // Render results screen
    const renderResults = () => {
        // Adaptive feedback
        let adaptiveMessage = '';
        if (results && results.score >= 90 && difficulty !== 'expert') {
            const nextLevel = DIFFICULTY_LEVELS[DIFFICULTY_LEVELS.findIndex(l => l.value === difficulty) + 1];
            adaptiveMessage = `Excellent! Try the ${nextLevel.label} level next for a bigger challenge.`;
        } else if (results && results.score === 100) {
            adaptiveMessage = 'Perfect fluency! You are on a streak!';
        }

        const wordBank = getWordBank(difficulty, exercise.content.categories[0], exercise.content.letter);
        const userWords = answers[exercise.content.categories[0]] || [];
        const validWords = userWords.filter(w => wordBank.has(w.toLowerCase()));
        const invalidWords = userWords.filter(w => !wordBank.has(w.toLowerCase()));

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Game Results
                    </h2>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {Math.round(results.score)}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Overall Score
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Difficulty:</span> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Time Taken:</span> {totalDuration ? `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s` : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Categories:</span> {exercise.content.categories.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Total Words:</span> {Object.values(answers).flat().length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Performance by Category:
                    </h3>

                    <div className="space-y-4">
                        {exercise.content.categories.map((category, index) => {
                            const categoryResults = results.details.category_results || {};
                            const categoryResult = categoryResults[category] || {
                                words: [],
                                valid_count: 0,
                                achieved_minimum: false,
                                score: 0
                            };
                            const metMinimum = categoryResult.achieved_minimum;
                            return (
                                <div
                                    key={index}
                                    className={
                                        `border-l-4 rounded-r-md p-4
                                        ${metMinimum
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'}
                                        `
                                    }
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className={
                                            `font-semibold text-lg capitalize
                                            ${metMinimum
                                                ? 'text-green-800 dark:text-green-300'
                                                : 'text-red-800 dark:text-red-300'}
                                            `
                                        }>
                                            {category}
                                        </h4>
                                        <span className={
                                            `px-3 py-1 rounded-full text-sm font-medium
                                            ${metMinimum
                                                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                                : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'}
                                            `
                                        }>
                                            {Math.round(categoryResult.score)}%
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-medium">Valid Words:</span>
                                        <span className="ml-2">
                                            {validWords.length > 0 ? validWords.join(', ') : <span className="italic text-gray-400">None</span>}
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-medium">Invalid Words:</span>
                                        <span className="ml-2">
                                            {invalidWords.length > 0 ? invalidWords.join(', ') : <span className="italic text-gray-400">None</span>}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
                    <p className="text-blue-800 dark:text-blue-300">
                        <span className="font-medium">Feedback:</span> {results.feedback}
                    </p>
                    {adaptiveMessage && (
                        <p className="mt-2 text-green-700 dark:text-green-300 font-semibold">{adaptiveMessage}</p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={resetGame}
                        className="md:flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        ↺ Play Again
                    </button>
                    <button
                        onClick={() => navigate('/cognitive-training')}
                        className="md:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Return to Cognitive Training
                    </button>
                </div>
            </div>
        );
    };

    // Render the appropriate view based on game state
    const renderGameState = () => {
        switch (gameState) {
            case 'setup':
                return renderSetup();
            case 'playing':
                return renderPlaying();
            case 'results':
                return renderResults();
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {renderGameState()}
        </div>
    );
};

export default LanguageFluencyGame; 