import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    XCircleIcon,
    ArrowLeftIcon,
    Bars3Icon
} from '@heroicons/react/24/outline';
import {
    DIFFICULTY_LEVELS,
    GAME_MODES,
    SEQUENCE_CHALLENGES,
    getRandomChallenge,
    createShuffledChallenge,
    shuffleArray,
    calculateScore,
    getFeedbackMessage
} from '../../data/sequenceOrderingData';
import { submitSequenceOrderingResults } from '../../api/cognitiveTrainingService';

const GAME_STATES = {
    SETUP: 'setup',
    PLAYING: 'playing',
    PAUSED: 'paused',
    COMPLETED: 'completed'
};

export default function SequenceOrderingGame() {
    // Navigation
    const navigate = useNavigate();

    // Add custom styles for drag animations
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .sequence-card {
                user-select: none;
                will-change: transform, opacity, box-shadow;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .sequence-card:hover {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .sequence-card.dragging {
                z-index: 1000;
                cursor: grabbing !important;
                transform: scale(0.95) rotate(2deg) !important;
                opacity: 0.3 !important;
                pointer-events: none;
            }
            
            .sequence-container {
                position: relative;
            }
            
            .sequence-card.live-reordering {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .sequence-card.drop-placeholder {
                border: 2px dashed #60A5FA;
                background: rgba(96, 165, 250, 0.1);
                transform: scale(1.02);
                opacity: 0.7;
                animation: placeholderPulse 1.5s ease-in-out infinite;
            }
            
            .sequence-card.mobile-selected {
                animation: mobileSelectPulse 2s ease-in-out infinite;
            }
            
            @keyframes placeholderPulse {
                0%, 100% { 
                    opacity: 0.5;
                    border-color: #60A5FA;
                }
                50% { 
                    opacity: 0.8;
                    border-color: #3B82F6;
                }
            }
            
            @keyframes mobileSelectPulse {
                0%, 100% { 
                    transform: scale(1.02);
                }
                50% { 
                    transform: scale(1.04);
                }
            }
            
            /* Smooth transitions for reordering */
            .sequence-card:not(.dragging) {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                           opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                           box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Enhanced drag preview */
            .drag-ghost-preview {
                filter: drop-shadow(0 10px 20px rgba(59, 130, 246, 0.25));
                transform: rotate(3deg) scale(1.05);
                border: 3px solid #2563EB !important;
                background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%) !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Game state
    const [gameState, setGameState] = useState(GAME_STATES.SETUP);
    const [difficulty, setDifficulty] = useState('EASY');
    const [gameMode, setGameMode] = useState(GAME_MODES.UNTIMED);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [userOrder, setUserOrder] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [timerInterval, setTimerInterval] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [evaluationResults, setEvaluationResults] = useState(null);
    const [stepResults, setStepResults] = useState({});

    // Mobile detection
    const [isMobile, setIsMobile] = useState(false);

    // Drag and drop state
    const [draggedCard, setDraggedCard] = useState(null);
    const [dragOverCard, setDragOverCard] = useState(null);
    const [dragGhost, setDragGhost] = useState(null);
    const [previewOrder, setPreviewOrder] = useState([]); // For live preview of card positions

    // Submission tracking
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Refs
    const gameContainerRef = useRef(null);
    const dragPreviewRef = useRef(null);

    // Mobile detection effect
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Timer effect
    useEffect(() => {
        if (gameState === GAME_STATES.PLAYING && gameStartTime) {
            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
                setTimeElapsed(elapsed);

                // Auto-submit if time limit reached in timed mode
                if (gameMode === GAME_MODES.TIMED && currentChallenge) {
                    const timeLimit = DIFFICULTY_LEVELS[currentChallenge.difficulty].timeLimit;
                    if (elapsed >= timeLimit) {
                        handleSubmit();
                    }
                }
            }, 1000);
            setTimerInterval(interval);
            return () => clearInterval(interval);
        } else if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    }, [gameState, gameStartTime, gameMode, currentChallenge, timerInterval]);

    // Initialize game
    const initializeGame = useCallback(() => {
        const challenge = getRandomChallenge(difficulty);
        const shuffledChallenge = createShuffledChallenge(challenge.id);

        setCurrentChallenge(shuffledChallenge);
        setUserOrder([...shuffledChallenge.shuffledOrder]);
        setMoves(0);
        setTimeElapsed(0);
        setGameStartTime(null);
        setSelectedCard(null);
        setEvaluationResults(null);
        setStepResults({});
        setIsSubmitting(false);
        setSubmissionError(null);
        setSubmissionSuccess(false);

        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    }, [difficulty, timerInterval]);

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

    // Shuffle and restart
    const shuffleAndRestart = () => {
        if (currentChallenge) {
            const shuffledOrder = shuffleArray(currentChallenge.steps.map(s => s.stepId));
            setUserOrder(shuffledOrder);
            setMoves(0);
            setSelectedCard(null);
            setEvaluationResults(null);
            setStepResults({});
        }
    };

    // Handle card swap (used by both drag-drop and mobile tap)
    const swapCards = useCallback((fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;

        const newOrder = [...userOrder];
        [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
        setUserOrder(newOrder);
        setMoves(prev => prev + 1);

        // Clear selection on mobile
        setSelectedCard(null);
    }, [userOrder]);

    // Desktop drag handlers
    const handleDragStart = (e, cardIndex) => {
        if (gameState !== GAME_STATES.PLAYING) return;

        setDraggedCard(cardIndex);
        e.dataTransfer.effectAllowed = 'move';

        // Create a custom drag image
        const draggedElement = e.currentTarget;
        const rect = draggedElement.getBoundingClientRect();

        // Create ghost element with enhanced styling
        const ghost = draggedElement.cloneNode(true);
        ghost.style.position = 'absolute';
        ghost.style.top = '-1000px';
        ghost.style.left = '-1000px';
        ghost.style.width = (rect.width + 20) + 'px';
        ghost.style.height = (rect.height + 10) + 'px';
        ghost.style.transform = 'rotate(3deg) scale(1.05)';
        ghost.style.opacity = '0.9';
        ghost.style.zIndex = '9999';
        ghost.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 2px #3B82F6';
        ghost.style.border = '3px solid #2563EB';
        ghost.style.backgroundColor = '#DBEAFE';
        ghost.style.borderRadius = '12px';
        ghost.style.pointerEvents = 'none';

        // Add a subtle glow effect
        ghost.style.filter = 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))';

        // Enhance the content styling
        const ghostContent = ghost.querySelector('div');
        if (ghostContent) {
            ghostContent.style.color = '#1E40AF';
            ghostContent.style.fontWeight = '600';
        }

        document.body.appendChild(ghost);
        setDragGhost(ghost);

        // Set the custom drag image with better positioning
        e.dataTransfer.setDragImage(ghost, (rect.width + 20) / 2, (rect.height + 10) / 2);

        // Clean up ghost element after the drag image is captured
        setTimeout(() => {
            if (document.body.contains(ghost)) {
                document.body.removeChild(ghost);
            }
        }, 50);

        // Add haptic feedback for mobile devices
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    const handleDragOver = (e, cardIndex) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedCard !== null && draggedCard !== cardIndex) {
            setDragOverCard(cardIndex);
        }
    };

    const handleDragLeave = (e) => {
        // Only clear drag over if we're actually leaving the card and container
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            // Check if we're still within the container
            const container = gameContainerRef.current;
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const isInContainer = x >= containerRect.left && x <= containerRect.right &&
                    y >= containerRect.top && y <= containerRect.bottom;

                if (!isInContainer) {
                    setDragOverCard(null);
                }
            }
        }
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();

        if (draggedCard !== null && draggedCard !== targetIndex) {
            swapCards(draggedCard, targetIndex);
        }

        setDraggedCard(null);
        setDragOverCard(null);
    };

    const handleDragEnd = () => {
        setDraggedCard(null);
        setDragOverCard(null);

        // Clean up any remaining ghost elements
        if (dragGhost && document.body.contains(dragGhost)) {
            document.body.removeChild(dragGhost);
        }
        setDragGhost(null);
    };

    // Mobile tap handlers
    const handleCardTap = (cardIndex) => {
        if (gameState !== GAME_STATES.PLAYING) return;

        if (selectedCard === null) {
            setSelectedCard(cardIndex);
        } else if (selectedCard === cardIndex) {
            setSelectedCard(null);
        } else {
            swapCards(selectedCard, cardIndex);
        }
    };

    // Submit sequence
    const handleSubmit = useCallback(async () => {
        if (!currentChallenge || gameState !== GAME_STATES.PLAYING) return;

        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            // Calculate results
            const results = calculateScore(currentChallenge, userOrder, timeElapsed, gameMode);
            setEvaluationResults(results);

            // Evaluate each step for visual feedback
            const stepResultsMap = {};
            currentChallenge.steps.forEach(step => {
                const currentIndex = userOrder.indexOf(step.stepId);
                stepResultsMap[step.stepId] = currentIndex === step.correctIndex;
            });
            setStepResults(stepResultsMap);

            setGameState(GAME_STATES.COMPLETED);

            // Format data for backend submission
            const exerciseId = `sequence-${Date.now()}-${currentChallenge.id}`;
            const submissionData = {
                exercise_id: exerciseId,
                challenge_id: currentChallenge.id,
                difficulty: currentChallenge.difficulty,
                game_mode: gameMode,
                user_order: userOrder,
                moves_used: moves,
                time_elapsed: timeElapsed,
                correct_count: results.correctCount,
                total_steps: results.totalSteps,
                accuracy: results.accuracy,
                base_points: results.basePoints,
                perfect_bonus: results.perfectBonus,
                timed_bonus: results.timedBonus,
                final_score: results.finalScore
            };

            // Submit results to backend
            await submitSequenceOrderingResults(submissionData);
            setSubmissionSuccess(true);

        } catch (error) {
            console.error('Error submitting sequence ordering results:', error);
            setSubmissionError('Failed to submit results. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [currentChallenge, userOrder, timeElapsed, gameMode, gameState, moves]);

    // Navigation functions
    const goBackToCognitiveTraining = () => {
        navigate('/cognitive-training');
    };

    // Helper functions
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeLeft = () => {
        if (gameMode !== GAME_MODES.TIMED || !currentChallenge) return null;
        const timeLimit = DIFFICULTY_LEVELS[currentChallenge.difficulty].timeLimit;
        return Math.max(0, timeLimit - timeElapsed);
    };

    const getStepText = (stepId) => {
        if (!currentChallenge) return '';
        const step = currentChallenge.steps.find(s => s.stepId === stepId);
        return step ? step.text : '';
    };

    const getCardClassName = (cardIndex, stepId) => {
        let className = "sequence-card relative p-4 mb-3 rounded-lg border-2 transition-all duration-300 ";

        if (evaluationResults) {
            // Show results
            if (stepResults[stepId]) {
                className += "border-green-500 bg-green-50 dark:bg-green-900 ";
            } else {
                className += "border-red-500 bg-red-50 dark:bg-red-900 ";
            }
        } else {
            // Normal state
            className += "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:scale-[1.02] ";

            // Selection state (mobile)
            if (selectedCard === cardIndex) {
                className += "border-yellow-400 bg-yellow-50 dark:bg-yellow-900 ring-2 ring-yellow-400 ring-opacity-50 mobile-selected ";
            }

            // Drop target state
            if (dragOverCard === cardIndex && draggedCard !== cardIndex) {
                className += "border-blue-500 bg-blue-50 dark:bg-blue-800 border-dashed ring-2 ring-blue-400 ring-opacity-30 scale-105 ";
            }

            // Add hover effects when not being dragged
            if (draggedCard === null && !isMobile) {
                className += "hover:transform hover:-translate-y-1 cursor-grab ";
            }
        }

        return className;
    };

    // Helper function to calculate preview order
    const calculatePreviewOrder = (draggedIndex, targetIndex, currentOrder) => {
        if (draggedIndex === null || targetIndex === null || draggedIndex === targetIndex) {
            return currentOrder;
        }

        const newOrder = [...currentOrder];
        const draggedItem = newOrder[draggedIndex];

        // Remove the dragged item
        newOrder.splice(draggedIndex, 1);

        // Insert at the target position
        newOrder.splice(targetIndex, 0, draggedItem);

        return newOrder;
    };

    // Reset preview order to match actual order
    const resetPreviewOrder = () => {
        setPreviewOrder([...userOrder]);
    };

    // Update preview order when userOrder changes
    useEffect(() => {
        setPreviewOrder([...userOrder]);
    }, [userOrder]);

    // Render functions
    const renderSetup = () => (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    🔄 Sequence Ordering Game
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Arrange the shuffled steps in their correct chronological or logical order.
                    This exercise enhances executive function, sequential reasoning, and temporal understanding.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                {/* Difficulty Selection */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Choose Difficulty
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                            <button
                                key={key}
                                onClick={() => setDifficulty(key)}
                                className={`p-4 rounded-lg border-2 transition-all ${difficulty === key
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                            >
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    {level.name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {level.description}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {level.stepCount} steps • {level.timeLimit}s limit
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Game Mode Selection */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Choose Mode
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setGameMode(GAME_MODES.UNTIMED)}
                            className={`p-4 rounded-lg border-2 transition-all ${gameMode === GAME_MODES.UNTIMED
                                ? 'border-green-500 bg-green-50 dark:bg-green-900'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                }`}
                        >
                            <div className="font-semibold text-gray-900 dark:text-white">
                                Untimed Mode
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                Focus on accuracy without time pressure
                            </div>
                        </button>
                        <button
                            onClick={() => setGameMode(GAME_MODES.TIMED)}
                            className={`p-4 rounded-lg border-2 transition-all ${gameMode === GAME_MODES.TIMED
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                }`}
                        >
                            <div className="font-semibold text-gray-900 dark:text-white">
                                Timed Mode
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                Race against time for bonus points
                            </div>
                        </button>
                    </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                    <button
                        onClick={startGame}
                        className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlayIcon className="w-5 h-5 mr-2" />
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );

    const renderGameStats = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {currentChallenge?.icon || '🔄'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {currentChallenge?.category}
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {moves}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Moves</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {gameMode === GAME_MODES.TIMED && getTimeLeft() !== null
                            ? formatTime(getTimeLeft())
                            : formatTime(timeElapsed)
                        }
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {gameMode === GAME_MODES.TIMED ? 'Time Left' : 'Time Elapsed'}
                    </div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {currentChallenge?.steps.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Steps</div>
                </div>
            </div>
        </div>
    );

    const renderSequenceCards = () => {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Arrange these steps in the correct order:
                    </h3>
                    {!isMobile && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Drag and drop cards to reorder them
                        </p>
                    )}
                    {isMobile && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tap a card to select, then tap another to swap positions
                        </p>
                    )}
                </div>

                <div ref={gameContainerRef} className="sequence-container max-w-2xl mx-auto">
                    {userOrder.map((stepId, index) => {
                        const isBeingDragged = draggedCard === index;

                        return (
                            <div
                                key={stepId}
                                data-card-index={index}
                                data-step-id={stepId}
                                className={getCardClassName(index, stepId)}
                                draggable={!isMobile && gameState === GAME_STATES.PLAYING}
                                onDragStart={!isMobile ? (e) => handleDragStart(e, index) : undefined}
                                onDragOver={!isMobile ? (e) => handleDragOver(e, index) : undefined}
                                onDragLeave={!isMobile ? handleDragLeave : undefined}
                                onDrop={!isMobile ? (e) => handleDrop(e, index) : undefined}
                                onDragEnd={!isMobile ? handleDragEnd : undefined}
                                onClick={isMobile ? () => handleCardTap(index) : undefined}
                                style={{
                                    transform: isBeingDragged ? 'scale(0.95) rotate(2deg)' : 'none',
                                    opacity: isBeingDragged ? 0.3 : 1,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: isBeingDragged ? 'grabbing' : draggedCard === null ? 'grab' : 'default'
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {index + 1}. {getStepText(stepId)}
                                        </div>
                                    </div>
                                    <div className="flex items-center ml-4">
                                        {evaluationResults && (
                                            <div className="mr-2">
                                                {stepResults[stepId] ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <XCircleIcon className="w-6 h-6 text-red-500" />
                                                )}
                                            </div>
                                        )}
                                        {!isMobile && gameState === GAME_STATES.PLAYING && !isBeingDragged && (
                                            <Bars3Icon className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Game Controls */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    {gameState === GAME_STATES.PLAYING && (
                        <>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                {isSubmitting ? 'Submitting...' : 'Submit Sequence'}
                            </button>
                            <button
                                onClick={shuffleAndRestart}
                                className="inline-flex items-center px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                <ArrowPathIcon className="w-5 h-5 mr-2" />
                                Shuffle & Restart
                            </button>
                            <button
                                onClick={togglePause}
                                className="inline-flex items-center px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <PauseIcon className="w-5 h-5 mr-2" />
                                Pause
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderPauseScreen = () => (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">⏸️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Game Paused</h2>
            <button
                onClick={togglePause}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
                <PlayIcon className="w-5 h-5 mr-2" />
                Resume Game
            </button>
        </div>
    );

    const renderCompletionScreen = () => {
        if (!evaluationResults || !currentChallenge) return null;

        const { correctCount, totalSteps, accuracy, basePoints, perfectBonus, timedBonus, finalScore } = evaluationResults;
        const feedbackMessage = getFeedbackMessage(correctCount, totalSteps, accuracy);

        return (
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="text-6xl mb-4">
                        {correctCount === totalSteps ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Sequence Complete!
                    </h2>

                    <div className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        {feedbackMessage}
                    </div>

                    {/* Score Breakdown */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Score Breakdown
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="flex justify-between">
                                <span>Steps Correctly Placed:</span>
                                <span className="font-semibold">{correctCount} / {totalSteps}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Accuracy:</span>
                                <span className="font-semibold">{accuracy.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Base Points:</span>
                                <span className="font-semibold">{basePoints}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Perfect Bonus:</span>
                                <span className="font-semibold">{perfectBonus}</span>
                            </div>
                            {gameMode === GAME_MODES.TIMED && (
                                <div className="flex justify-between">
                                    <span>Time Bonus:</span>
                                    <span className="font-semibold">{timedBonus}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Final Score:</span>
                                <span className="text-blue-600 dark:text-blue-400">{finalScore}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={startGame}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                            Play Again
                        </button>
                        <button
                            onClick={resetGame}
                            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                            Change Settings
                        </button>
                        <button
                            onClick={goBackToCognitiveTraining}
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <HomeIcon className="w-5 h-5 mr-2" />
                            Back to Training
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={goBackToCognitiveTraining}
                        className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Cognitive Training
                    </button>

                    {gameState !== GAME_STATES.SETUP && (
                        <button
                            onClick={resetGame}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <HomeIcon className="w-4 h-4 mr-2" />
                            Setup
                        </button>
                    )}
                </div>

                {/* Error Display */}
                {submissionError && (
                    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
                        <p className="text-red-800 dark:text-red-200">{submissionError}</p>
                    </div>
                )}

                {/* Game Content */}
                {gameState === GAME_STATES.SETUP && renderSetup()}
                {gameState === GAME_STATES.PLAYING && (
                    <>
                        {renderGameStats()}
                        {renderSequenceCards()}
                    </>
                )}
                {gameState === GAME_STATES.PAUSED && renderPauseScreen()}
                {gameState === GAME_STATES.COMPLETED && renderCompletionScreen()}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .sequence-card {
                    min-height: 60px;
                    touch-action: manipulation;
                }
                
                .matched-animation {
                    animation: matchPulse 0.6s ease-in-out;
                }
                
                .shake-animation {
                    animation: shake 0.5s ease-in-out;
                }
                
                @keyframes matchPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                @media (max-width: 768px) {
                    .sequence-card {
                        min-height: 44px;
                        font-size: 16px;
                    }
                }
            `}</style>
        </div>
    );
} 