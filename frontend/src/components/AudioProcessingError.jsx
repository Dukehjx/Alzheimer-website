import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced error display component for audio processing errors
 * Provides detailed technical information for debugging in production
 */
const AudioProcessingError = ({
    error,
    apiError = null,
    serviceStatus = { status: 'unknown', message: null },
    onRetry = null
}) => {
    const [showDetails, setShowDetails] = useState(false);

    // Extract relevant error information
    const errorMessage = error || 'Unknown error occurred';
    const isApiError = !!apiError;

    // Format API error details for display
    const getErrorDetails = () => {
        if (!apiError) return {};

        return {
            status: apiError.response?.status,
            statusText: apiError.response?.statusText,
            url: apiError.config?.url,
            method: apiError.config?.method,
            headers: apiError.config?.headers,
            responseData: apiError.response?.data,
            stack: apiError.stack
        };
    };

    const errorDetails = getErrorDetails();

    // Determine error severity for UI styling
    const getSeverityClass = () => {
        if (serviceStatus.status === 'offline') {
            return 'border-red-500 bg-red-100 dark:bg-red-900/40';
        } else if (serviceStatus.status === 'degraded') {
            return 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/40';
        }
        return 'border-orange-500 bg-orange-100 dark:bg-orange-900/40';
    };

    // Format error request details for display
    const formatJson = (obj) => {
        try {
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return 'Unable to format object';
        }
    };

    return (
        <div className={`border-l-4 p-4 mb-6 ${getSeverityClass()}`} role="alert">
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <svg
                        className="w-5 h-5 mr-2 text-red-600 dark:text-red-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <div>
                        <p className="font-semibold text-red-700 dark:text-red-400">{errorMessage}</p>
                        {serviceStatus.message && (
                            <p className="text-sm mt-1">{serviceStatus.message}</p>
                        )}
                    </div>
                </div>

                {isApiError && (
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 ml-2 text-sm font-medium flex items-center"
                    >
                        {showDetails ? 'Hide' : 'Show'} Details
                        <svg
                            className={`w-4 h-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Troubleshooting suggestions based on error type */}
            {serviceStatus.status === 'degraded' && (
                <div className="mt-3 pl-7 text-sm">
                    <p className="font-medium mb-1">Troubleshooting steps:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Check your internet connection</li>
                        <li>Try uploading a smaller or different audio file</li>
                        <li>Refresh the page and try again</li>
                        <li>The speech service may be experiencing high demand</li>
                    </ul>
                </div>
            )}

            {serviceStatus.status === 'offline' && (
                <div className="mt-3 pl-7 text-sm">
                    <p>The audio processing service appears to be unavailable. Please try again later or contact support if this persists.</p>
                </div>
            )}

            {/* Display retry button if provided */}
            {onRetry && (
                <div className="mt-3 pl-7">
                    <button
                        onClick={onRetry}
                        className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Collapsible technical details section */}
            {isApiError && showDetails && (
                <div className="mt-4 pl-7 overflow-auto">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono">
                        <h4 className="font-bold mb-2 text-sm">Technical Error Details:</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {errorDetails.status && (
                                <div>
                                    <span className="font-semibold">Status:</span> {errorDetails.status} {errorDetails.statusText && `(${errorDetails.statusText})`}
                                </div>
                            )}

                            {errorDetails.url && (
                                <div>
                                    <span className="font-semibold">Endpoint:</span> {errorDetails.url}
                                </div>
                            )}

                            {errorDetails.method && (
                                <div>
                                    <span className="font-semibold">Method:</span> {errorDetails.method}
                                </div>
                            )}
                        </div>

                        {errorDetails.responseData && (
                            <div className="mt-2">
                                <h5 className="font-semibold mb-1">Response Data:</h5>
                                <pre className="bg-white dark:bg-gray-900 p-2 rounded overflow-x-auto max-h-40">
                                    {formatJson(errorDetails.responseData)}
                                </pre>
                            </div>
                        )}

                        {/* Display stack trace in production for admin users */}
                        {errorDetails.stack && (
                            <div className="mt-2">
                                <details>
                                    <summary className="cursor-pointer font-semibold mb-1 text-xs">Stack Trace</summary>
                                    <pre className="bg-white dark:bg-gray-900 p-2 rounded overflow-x-auto max-h-40 text-xs">
                                        {errorDetails.stack}
                                    </pre>
                                </details>
                            </div>
                        )}

                        <p className="mt-3 text-xs text-gray-500">
                            Error ID: {`err_${Date.now().toString(36)}`} • Timestamp: {new Date().toISOString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

AudioProcessingError.propTypes = {
    error: PropTypes.string.isRequired,
    apiError: PropTypes.object,
    serviceStatus: PropTypes.shape({
        status: PropTypes.oneOf(['online', 'offline', 'degraded', 'unknown']),
        message: PropTypes.string
    }),
    onRetry: PropTypes.func
};

export default AudioProcessingError; 