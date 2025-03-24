import React, { useState } from 'react';
import { analyzeText } from '../api/aiService';

const TextAnalysis = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const handleTextChange = (e) => {
        setText(e.target.value);
        // Clear results when text changes
        if (results) setResults(null);
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim() || text.trim().length < 10) {
            setError('Please enter at least 10 characters of text to analyze.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await analyzeText(text, 'text', false, true); // Use demo mode for now
            console.log("Analysis response:", response);
            setResults(response);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.response?.data?.detail || 'An error occurred during analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Format domain name for display
    const formatDomain = (domain) => {
        return domain
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Map score to risk level text
    const getRiskLevel = (score) => {
        if (score < 0.3) return 'Low';
        if (score < 0.6) return 'Moderate';
        return 'High';
    };

    // Map score to color
    const getScoreColor = (score) => {
        if (score < 0.3) return 'text-green-500 border-green-500';
        if (score < 0.6) return 'text-yellow-500 border-yellow-500';
        return 'text-red-500 border-red-500';
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
                    rows="6"
                    placeholder="Type or paste text here for analysis. The more text you provide, the more accurate the analysis."
                    value={text}
                    onChange={handleTextChange}
                />
                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'} dark:bg-primary-700 dark:hover:bg-primary-600 flex justify-center items-center`}
                    disabled={loading || !text.trim() || text.trim().length < 10}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : 'Analyze Text'}
                </button>
            </form>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 dark:bg-red-900 dark:text-red-200" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {results && results.success && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analysis Results</h3>

                    <div className="flex flex-col md:flex-row items-center justify-center my-6">
                        <div className="relative inline-flex m-4">
                            <svg className="w-24 h-24" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e6e6e6"
                                    strokeWidth="3"
                                    strokeDasharray="100, 100"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={results.overall_score < 0.3 ? "#4caf50" : results.overall_score < 0.6 ? "#ff9800" : "#f44336"}
                                    strokeWidth="3"
                                    strokeDasharray={`${results.overall_score * 100}, 100`}
                                />
                                <text x="18" y="20.35" className="text-center text-lg font-bold" textAnchor="middle" fill="currentColor">
                                    {Math.round(results.overall_score * 100)}%
                                </text>
                            </svg>
                            <div className="ml-4">
                                <p className="text-lg font-semibold">
                                    Risk Level: {getRiskLevel(results.overall_score)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Confidence: {Math.round((results.confidence_score || 0.75) * 100)}%
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Model: {results.model_type || 'Demo'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-4 py-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cognitive Domain Scores</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                            {Object.entries(results.domain_scores || {}).map(([domain, score]) => (
                                <div
                                    key={domain}
                                    className={`p-4 text-center rounded-lg shadow-sm border-t-4 ${getScoreColor(score)}`}
                                >
                                    <p className="text-sm font-medium">{formatDomain(domain)}</p>
                                    <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                        {Math.round(score * 100)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recommendations</h4>

                        <ul className="list-disc pl-5 space-y-2">
                            {results.recommendations?.map((recommendation, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">
                                    {recommendation}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextAnalysis; 