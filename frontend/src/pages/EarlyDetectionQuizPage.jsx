import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import {
    QUIZ_TYPES,
    DOMAINS,
    DOMAIN_WEIGHTS,
    quickTestQuestions,
    comprehensiveTestQuestions,
    QUICK_TEST_THRESHOLDS,
    COMPREHENSIVE_TEST_THRESHOLDS,
    DISCLAIMER_TEXT
} from '../data/quizData';

const QUIZ_STATES = {
    SELECTION: 'selection',
    DISCLAIMER: 'disclaimer',
    QUIZ: 'quiz',
    RESULTS: 'results'
};

export default function EarlyDetectionQuizPage() {
    const [currentState, setCurrentState] = useState(QUIZ_STATES.SELECTION);
    const [selectedQuizType, setSelectedQuizType] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);

    const currentQuestions = selectedQuizType === QUIZ_TYPES.QUICK
        ? quickTestQuestions
        : comprehensiveTestQuestions;

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
    const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined;

    // Reset quiz when type changes
    useEffect(() => {
        if (selectedQuizType) {
            setCurrentQuestionIndex(0);
            setAnswers({});
            setQuizResults(null);
        }
    }, [selectedQuizType]);

    const handleQuizTypeSelection = (type) => {
        setSelectedQuizType(type);
        setCurrentState(QUIZ_STATES.DISCLAIMER);
    };

    const startQuiz = () => {
        setCurrentState(QUIZ_STATES.QUIZ);
    };

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const nextQuestion = () => {
        if (isLastQuestion) {
            calculateResults();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const calculateResults = () => {
        let totalScore = 0;
        const domainScores = {};

        // Initialize domain scores
        Object.values(DOMAINS).forEach(domain => {
            domainScores[domain] = { raw: 0, weighted: 0 };
        });

        // Calculate scores
        currentQuestions.forEach(question => {
            const answer = answers[question.id];
            let questionScore = 0;

            if (question.type === 'number_input' && question.getScore) {
                questionScore = question.getScore(answer);
            } else if (question.options) {
                const selectedOption = question.options.find(opt => opt.value === answer);
                questionScore = selectedOption ? selectedOption.score : 0;
            }

            domainScores[question.domain].raw += questionScore;
        });

        // Apply weights for comprehensive test
        if (selectedQuizType === QUIZ_TYPES.COMPREHENSIVE) {
            Object.keys(domainScores).forEach(domain => {
                const weight = DOMAIN_WEIGHTS[domain] || 1;
                domainScores[domain].weighted = domainScores[domain].raw * weight;
                totalScore += domainScores[domain].weighted;
            });
        } else {
            // Quick test - no weights
            totalScore = Object.values(domainScores).reduce((sum, domain) => sum + domain.raw, 0);
        }

        // Determine interpretation
        const thresholds = selectedQuizType === QUIZ_TYPES.QUICK
            ? QUICK_TEST_THRESHOLDS
            : COMPREHENSIVE_TEST_THRESHOLDS;

        let interpretation = thresholds.NORMAL;
        if (totalScore >= thresholds.ALZHEIMERS.min) {
            interpretation = thresholds.ALZHEIMERS;
        } else if (totalScore >= thresholds.MCI.min) {
            interpretation = thresholds.MCI;
        }

        setQuizResults({
            totalScore,
            domainScores,
            interpretation,
            totalQuestions: currentQuestions.length
        });

        setCurrentState(QUIZ_STATES.RESULTS);
    };

    const resetQuiz = () => {
        setCurrentState(QUIZ_STATES.SELECTION);
        setSelectedQuizType(null);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setQuizResults(null);
    };

    const renderQuizSelection = () => (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <ClipboardDocumentListIcon className="mx-auto h-16 w-16 text-primary-600 dark:text-primary-400 mb-6" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Early Detection Quiz
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Take our scientifically-designed quiz to assess potential signs of Mild Cognitive Impairment (MCI)
                    or early Alzheimer's disease. Choose between a quick screening or comprehensive assessment.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Quick Test */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow">
                    <div className="text-center mb-6">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">6</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quick Test</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Rapid 6-question screening for immediate insights
                        </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-gray-700 dark:text-gray-300">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            Takes 2-3 minutes
                        </li>
                        <li className="flex items-center text-gray-700 dark:text-gray-300">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            Yes/No questions only
                        </li>
                        <li className="flex items-center text-gray-700 dark:text-gray-300">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            Basic cognitive screening
                        </li>
                    </ul>

                    <button
                        onClick={() => handleQuizTypeSelection(QUIZ_TYPES.QUICK)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Start Quick Test
                    </button>
                </div>

                {/* Comprehensive Test */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow">
                    <div className="text-center mb-6">
                        <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">20</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Comprehensive Test</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Detailed 20-question assessment with domain analysis
                        </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-gray-700 dark:text-gray-300">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            Takes 10-15 minutes
                        </li>
                        <li className="flex items-center text-gray-700 dark:text-gray-300">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            Multiple choice & input questions
                        </li>
                        <li className="flex items-center text-gray-700 dark:text-gray-300">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            Detailed domain breakdown
                        </li>
                    </ul>

                    <button
                        onClick={() => handleQuizTypeSelection(QUIZ_TYPES.COMPREHENSIVE)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Start Comprehensive Test
                    </button>
                </div>
            </div>

            <div className="mt-12 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Disclaimer</h4>
                        <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                            {DISCLAIMER_TEXT}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDisclaimer = () => (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center mb-8">
                    <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-amber-500 mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Before You Begin
                    </h2>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-4 text-lg">
                        Important Medical Disclaimer
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed mb-4">
                        {DISCLAIMER_TEXT}
                    </p>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                        This assessment is designed for educational purposes and should not replace professional medical advice,
                        diagnosis, or treatment. Results are based on self-reported information and may not reflect actual cognitive status.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        You are about to take: {selectedQuizType === QUIZ_TYPES.QUICK ? 'Quick Test (6 questions)' : 'Comprehensive Test (20 questions)'}
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                            Answer all questions honestly and to the best of your ability
                        </li>
                        <li className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                            Take your time - there's no time limit
                        </li>
                        <li className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                            You can go back to previous questions if needed
                        </li>
                    </ul>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setCurrentState(QUIZ_STATES.SELECTION)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Back to Selection
                    </button>
                    <button
                        onClick={startQuiz}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        I Understand, Start Quiz
                    </button>
                </div>
            </div>
        </div>
    );

    const renderQuestion = () => (
        <div className="max-w-4xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question {currentQuestionIndex + 1} of {currentQuestions.length}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)}% Complete
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                {/* Domain badge */}
                <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                        {currentQuestion.domain}
                    </span>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed">
                    {currentQuestion.text}
                </h2>

                {/* Answer options */}
                <div className="space-y-4 mb-8">
                    {currentQuestion.type === 'number_input' ? (
                        <div>
                            <input
                                type="number"
                                min="0"
                                placeholder={currentQuestion.placeholder}
                                value={answers[currentQuestion.id] || ''}
                                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Enter the number of animals you can name in one minute
                            </p>
                        </div>
                    ) : (
                        currentQuestion.options.map((option, index) => (
                            <button
                                key={option.value}
                                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion.id] === option.value
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 mr-4 flex-shrink-0 ${answers[currentQuestion.id] === option.value
                                            ? 'border-primary-500 bg-primary-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {answers[currentQuestion.id] === option.value && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                    <span className="font-medium">{option.label}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${currentQuestionIndex === 0
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                            }`}
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Previous
                    </button>

                    <button
                        onClick={nextQuestion}
                        disabled={!hasAnsweredCurrent}
                        className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${!hasAnsweredCurrent
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 text-white'
                            }`}
                    >
                        {isLastQuestion ? 'View Results' : 'Next'}
                        {!isLastQuestion && <ArrowRightIcon className="h-5 w-5 ml-2" />}
                        {isLastQuestion && <ChartBarIcon className="h-5 w-5 ml-2" />}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderResults = () => (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${quizResults.interpretation.color === 'green' ? 'bg-green-100 dark:bg-green-900' :
                        quizResults.interpretation.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900' :
                            'bg-red-100 dark:bg-red-900'
                    }`}>
                    {quizResults.interpretation.color === 'green' ? (
                        <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
                    ) : (
                        <ExclamationTriangleIcon className={`h-12 w-12 ${quizResults.interpretation.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                            }`} />
                    )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Quiz Results
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    {selectedQuizType === QUIZ_TYPES.QUICK ? 'Quick Test' : 'Comprehensive Test'} Complete
                </p>
            </div>

            <div className="grid gap-8">
                {/* Score Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Score Summary</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                {quizResults.totalScore}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                Total Score (out of {selectedQuizType === QUIZ_TYPES.QUICK ? '6' : '20'})
                            </div>
                        </div>

                        <div className={`p-6 rounded-lg ${quizResults.interpretation.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                                quizResults.interpretation.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                                    'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            }`}>
                            <h3 className={`font-semibold mb-2 ${quizResults.interpretation.color === 'green' ? 'text-green-800 dark:text-green-200' :
                                    quizResults.interpretation.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' :
                                        'text-red-800 dark:text-red-200'
                                }`}>
                                Interpretation
                            </h3>
                            <p className={`${quizResults.interpretation.color === 'green' ? 'text-green-700 dark:text-green-300' :
                                    quizResults.interpretation.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                                        'text-red-700 dark:text-red-300'
                                }`}>
                                {quizResults.interpretation.label}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Domain Breakdown (Comprehensive Test Only) */}
                {selectedQuizType === QUIZ_TYPES.COMPREHENSIVE && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Domain Analysis</h2>

                        <div className="grid gap-4">
                            {Object.entries(quizResults.domainScores).map(([domain, scores]) => (
                                <div key={domain} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{domain}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Weight: {DOMAIN_WEIGHTS[domain]}x
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                                            {scores.weighted}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            ({scores.raw} raw × {DOMAIN_WEIGHTS[domain]})
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                    <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Remember</h4>
                            <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                                {DISCLAIMER_TEXT}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={resetQuiz}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Take Another Quiz
                    </button>
                    <Link
                        to="/screening"
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                        Try AI Screening
                    </Link>
                    <Link
                        to="/resources"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                {currentState === QUIZ_STATES.SELECTION && renderQuizSelection()}
                {currentState === QUIZ_STATES.DISCLAIMER && renderDisclaimer()}
                {currentState === QUIZ_STATES.QUIZ && renderQuestion()}
                {currentState === QUIZ_STATES.RESULTS && renderResults()}
            </div>
        </div>
    );
} 