import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClockIcon,
    TrophyIcon,
    ArrowPathIcon,
    HomeIcon,
    PlayIcon,
    PauseIcon,
    QuestionMarkCircleIcon,
    CheckCircleIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import {
    DIFFICULTY_LEVELS,
    GAME_MODES,
    getRandomPairs,
    createGameCards,
    calculateScore,
    getFeedbackMessage
} from '../../data/memoryMatchData';
import { submitMemoryMatchResults } from '../../api/cognitiveTrainingService';

const GAME_STATES = {
    SETUP: 'setup',
    PLAYING: 'playing',
    PAUSED: 'paused',
    COMPLETED: 'completed'
};

export default function MemoryMatchGame() {
    // Navigation
    const navigate = useNavigate();

    // Game state
    const [gameState, setGameState] = useState(GAME_STATES.SETUP);
    const [difficulty, setDifficulty] = useState('BEGINNER');
    const [gameMode, setGameMode] = useState(GAME_MODES.RELAXED);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [lives, setLives] = useState(3);
    const [lockBoard, setLockBoard] = useState(false);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [timerInterval, setTimerInterval] = useState(null);

    // Submission tracking
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Game configuration
    const currentDifficulty = DIFFICULTY_LEVELS[difficulty];
    const totalPairs = currentDifficulty.pairs;
    const gridCols = currentDifficulty.gridSize.cols;
    const gridRows = currentDifficulty.gridSize.rows;

    // Timer effect
    useEffect(() => {
        if (gameState === GAME_STATES.PLAYING && gameStartTime) {
            const interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
            }, 1000);
            setTimerInterval(interval);
            return () => clearInterval(interval);
        } else if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    }, [gameState, gameStartTime, timerInterval]);

    // Initialize game
    const initializeGame = useCallback(() => {
        const selectedPairs = getRandomPairs(totalPairs);
        const gameCards = createGameCards(selectedPairs);
        setCards(gameCards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setTimeElapsed(0);
        setLives(gameMode === GAME_MODES.CHALLENGE ? 3 : Infinity);
        setLockBoard(false);
        setGameStartTime(null);

        // Reset submission state
        setIsSubmitting(false);
        setSubmissionError(null);
        setSubmissionSuccess(false);

        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    }, [totalPairs, gameMode, timerInterval]);

    // Start game
    const startGame = () => {
        initializeGame();
        setGameState(GAME_STATES.PLAYING);
        setGameStartTime(Date.now());
    };

    // Pause/Resume game
    const togglePause = () => {
        if (gameState === GAME_STATES.PLAYING) {
            setGameState(GAME_STATES.PAUSED);
        } else if (gameState === GAME_STATES.PAUSED) {
            setGameState(GAME_STATES.PLAYING);
            setGameStartTime(Date.now() - (timeElapsed * 1000));
        }
    };

    // Reset game
    const resetGame = () => {
        setGameState(GAME_STATES.SETUP);
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    };

    // Handle card flip
    const flipCard = useCallback((cardIndex) => {
        if (lockBoard || gameState !== GAME_STATES.PLAYING) return;

        const card = cards[cardIndex];
        if (card.isFlipped || card.isMatched) return;
        if (flippedCards.includes(cardIndex)) return;

        // Start timer on first flip
        if (!gameStartTime) {
            setGameStartTime(Date.now());
        }

        const newFlippedCards = [...flippedCards, cardIndex];
        setFlippedCards(newFlippedCards);

        // Update card state
        const newCards = [...cards];
        newCards[cardIndex].isFlipped = true;
        setCards(newCards);

        // Check for match when two cards are flipped
        if (newFlippedCards.length === 2) {
            setLockBoard(true);
            setMoves(prev => prev + 1);

            const [firstIndex, secondIndex] = newFlippedCards;
            const firstCard = newCards[firstIndex];
            const secondCard = newCards[secondIndex];

            setTimeout(() => {
                checkForMatch(firstCard, secondCard, firstIndex, secondIndex, newCards);
            }, 600);
        }
    }, [cards, flippedCards, lockBoard, gameState, gameStartTime]);

    // Check if two cards match
    const checkForMatch = (firstCard, secondCard, firstIndex, secondIndex, currentCards) => {
        const isMatch = firstCard.pairId === secondCard.pairId;

        if (isMatch) {
            // Cards match
            const updatedCards = [...currentCards];
            updatedCards[firstIndex].isMatched = true;
            updatedCards[secondIndex].isMatched = true;
            setCards(updatedCards);
            setMatchedPairs(prev => [...prev, firstCard.pairId]);

            // Add match animation class
            setTimeout(() => {
                const cardElements = document.querySelectorAll(`[data-card-index="${firstIndex}"], [data-card-index="${secondIndex}"]`);
                cardElements.forEach(el => el.classList.add('matched-animation'));
            }, 100);

        } else {
            // Cards don't match
            if (gameMode === GAME_MODES.CHALLENGE) {
                setLives(prev => Math.max(0, prev - 1));
            }

            // Add shake animation
            setTimeout(() => {
                const cardElements = document.querySelectorAll(`[data-card-index="${firstIndex}"], [data-card-index="${secondIndex}"]`);
                cardElements.forEach(el => el.classList.add('shake-animation'));

                setTimeout(() => {
                    cardElements.forEach(el => el.classList.remove('shake-animation'));
                    const updatedCards = [...currentCards];
                    updatedCards[firstIndex].isFlipped = false;
                    updatedCards[secondIndex].isFlipped = false;
                    setCards(updatedCards);
                }, 400);
            }, 200);
        }

        setFlippedCards([]);
        setLockBoard(false);
    };

    // Check for game completion
    useEffect(() => {
        if (matchedPairs.length === totalPairs && gameState === GAME_STATES.PLAYING) {
            setGameState(GAME_STATES.COMPLETED);
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
            // Submit results when game is completed successfully
            submitGameResults();
        }
    }, [matchedPairs.length, totalPairs, gameState, timerInterval]);

    // Submit game results to backend
    const submitGameResults = async () => {
        try {
            setIsSubmitting(true);
            setSubmissionError(null);

            // Generate a unique exercise ID
            const exerciseId = `memorymatch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Calculate final score and accuracy
            const finalScore = calculateScore(totalPairs, moves, timeElapsed, difficulty);
            const accuracy = (matchedPairs.length / totalPairs) * 100;

            // Prepare submission data
            const gameResults = {
                exercise_id: exerciseId,
                difficulty: difficulty.toLowerCase(),
                game_mode: gameMode,
                total_pairs: totalPairs,
                matched_pairs: matchedPairs.length,
                moves_used: moves,
                time_elapsed: timeElapsed,
                final_score: finalScore,
                accuracy: accuracy
            };

            console.log('Submitting Memory Match results:', gameResults);

            // Submit to backend
            const response = await submitMemoryMatchResults(gameResults);

            console.log('Memory Match submission successful:', response);
            setSubmissionSuccess(true);

        } catch (error) {
            console.error('Failed to submit Memory Match results:', error);
            setSubmissionError(error.message || 'Failed to save your progress');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check for game over (challenge mode)
    useEffect(() => {
        if (gameMode === GAME_MODES.CHALLENGE && lives === 0 && gameState === GAME_STATES.PLAYING) {
            setGameState(GAME_STATES.COMPLETED);
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
        }
    }, [lives, gameMode, gameState, timerInterval]);

    // Navigate back to cognitive training page
    const goBackToCognitiveTraining = () => {
        navigate('/cognitive-training');
    };

    // Calculate final score and feedback
    const getFinalResults = () => {
        const accuracy = (matchedPairs.length / totalPairs) * 100;
        const score = calculateScore(totalPairs, moves, timeElapsed, difficulty);
        const feedback = getFeedbackMessage(
            accuracy,
            moves,
            timeElapsed,
            currentDifficulty.idealMoves,
            currentDifficulty.timeBonus
        );

        return { accuracy, score, feedback };
    };

    // Format time display
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
                    Memory Match Game
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Match question cards with their corresponding answer cards. Improve your memory,
                    attention, and cognitive processing skills through this engaging brain training exercise.
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
                                            {level.description} • {level.pairs} pairs • {level.gridSize.rows}×{level.gridSize.cols} grid
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

                {/* Game Mode Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Choose Game Mode
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setGameMode(GAME_MODES.RELAXED)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${gameMode === GAME_MODES.RELAXED
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Relaxed Mode</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        No time pressure, focus on matching pairs
                                    </div>
                                </div>
                                {gameMode === GAME_MODES.RELAXED && (
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                )}
                            </div>
                        </button>

                        <button
                            onClick={() => setGameMode(GAME_MODES.TIMED)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${gameMode === GAME_MODES.TIMED
                                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Timed Mode</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Race against time for bonus points
                                    </div>
                                </div>
                                {gameMode === GAME_MODES.TIMED && (
                                    <CheckCircleIcon className="h-6 w-6 text-yellow-500" />
                                )}
                            </div>
                        </button>

                        <button
                            onClick={() => setGameMode(GAME_MODES.CHALLENGE)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${gameMode === GAME_MODES.CHALLENGE
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Challenge Mode</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Limited lives - 3 mistakes allowed
                                    </div>
                                </div>
                                {gameMode === GAME_MODES.CHALLENGE && (
                                    <CheckCircleIcon className="h-6 w-6 text-red-500" />
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={startGame}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center"
                >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Start Game
                </button>
            </div>
        </div>
    );

    // Render game stats
    const renderGameStats = () => (
        <div className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-6">
                <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-900 dark:text-white font-medium">
                        {formatTime(timeElapsed)}
                    </span>
                </div>

                <div className="flex items-center">
                    <TrophyIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-900 dark:text-white font-medium">
                        Moves: {moves}
                    </span>
                </div>

                <div className="flex items-center">
                    <span className="text-gray-900 dark:text-white font-medium">
                        Matched: {matchedPairs.length}/{totalPairs}
                    </span>
                </div>

                {gameMode === GAME_MODES.CHALLENGE && (
                    <div className="flex items-center">
                        <span className="text-gray-900 dark:text-white font-medium">
                            Lives: {lives}
                        </span>
                        <div className="ml-2 flex">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full mr-1 ${i < lives ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={togglePause}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    aria-label={gameState === GAME_STATES.PAUSED ? "Resume game" : "Pause game"}
                >
                    {gameState === GAME_STATES.PAUSED ? (
                        <PlayIcon className="h-5 w-5" />
                    ) : (
                        <PauseIcon className="h-5 w-5" />
                    )}
                </button>

                <button
                    onClick={resetGame}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    aria-label="Reset game"
                >
                    <ArrowPathIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );

    // Render game grid
    const renderGameGrid = () => (
        <div
            className="game-grid mx-auto"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gap: '20px',
                maxWidth: `${Math.min(gridCols * 180, 1200)}px`
            }}
        >
            {cards.map((card, index) => (
                <button
                    key={card.id}
                    data-card-index={index}
                    onClick={() => flipCard(index)}
                    disabled={lockBoard || card.isFlipped || card.isMatched || gameState !== GAME_STATES.PLAYING}
                    className={`memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                    aria-label={`Card ${index + 1}: ${card.isFlipped ? card.content : 'Hidden'}`}
                    style={{
                        height: '180px',
                        minHeight: '180px'
                    }}
                >
                    <div className="card-inner">
                        <div className="card-back">
                            <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="card-front">
                            <div className="card-content">
                                <div className={`card-icon ${card.type === 'question' ? 'question-icon' : 'answer-icon'}`}>
                                    {card.type === 'question' ? '?' : '✓'}
                                </div>
                                <div className="card-text">
                                    {card.content}
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );

    // Render pause screen
    const renderPauseScreen = () => (
        <div className="text-center py-12">
            <PauseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Game Paused</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Take a break and resume when you're ready.
            </p>
            <button
                onClick={togglePause}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
            >
                <PlayIcon className="h-5 w-5 mr-2" />
                Resume Game
            </button>
        </div>
    );

    // Render completion screen
    const renderCompletionScreen = () => {
        const { accuracy, score, feedback } = getFinalResults();
        const isSuccess = matchedPairs.length === totalPairs;

        return (
            <div className="max-w-2xl mx-auto text-center py-8">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isSuccess
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-red-100 dark:bg-red-900'
                    }`}>
                    {isSuccess ? (
                        <TrophyIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                    ) : (
                        <ArrowPathIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
                    )}
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {isSuccess ? 'Congratulations!' : 'Game Over'}
                </h2>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {Math.round(score)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {Math.round(accuracy)}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {moves}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Moves</div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {formatTime(timeElapsed)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg ${feedback.type === 'excellent' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                        feedback.type === 'good' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                            feedback.type === 'fair' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                                'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                        }`}>
                        <p className={`font-medium ${feedback.type === 'excellent' ? 'text-green-800 dark:text-green-200' :
                            feedback.type === 'good' ? 'text-blue-800 dark:text-blue-200' :
                                feedback.type === 'fair' ? 'text-yellow-800 dark:text-yellow-200' :
                                    'text-orange-800 dark:text-orange-200'
                            }`}>
                            {feedback.message}
                        </p>
                    </div>
                </div>

                {/* Submission Status */}
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
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
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
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                {gameState === GAME_STATES.SETUP && renderSetup()}

                {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) && (
                    <>
                        {renderGameStats()}
                        {gameState === GAME_STATES.PAUSED ? renderPauseScreen() : renderGameGrid()}
                    </>
                )}

                {gameState === GAME_STATES.COMPLETED && renderCompletionScreen()}
            </div>
        </div>
    );
} 