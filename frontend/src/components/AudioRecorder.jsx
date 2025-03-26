import React, { useState, useRef, useEffect, useCallback } from 'react';
import { processAudio } from '../api/aiService';

/**
 * Component for recording audio or uploading audio files
 * and processing them for speech-to-text and analysis.
 */
const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [includeAnalysis, setIncludeAnalysis] = useState(true);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Stop recording audio - using useCallback to make it stable across renders
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            clearInterval(timerRef.current);
        }
    }, [isRecording]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            stopRecording();
            clearInterval(timerRef.current);

            // Revoke object URL to prevent memory leaks
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl, stopRecording]);

    // Handle click on start recording button
    const handleStartRecording = (e) => {
        e.preventDefault();
        startRecording();
    };

    // Handle click on stop recording button
    const handleStopRecording = (e) => {
        e.preventDefault();
        stopRecording();
    };

    // Handle click on file upload button
    const handleFileButtonClick = (e) => {
        e.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Start recording audio
    const startRecording = async () => {
        try {
            // Reset previous recordings
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
            }
            setAudioBlob(null);
            setResults(null);
            setError(null);

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Create media recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            // Reset chunks array
            chunksRef.current = [];

            // Setup event handlers
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Create blob from audio chunks
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                setAudioBlob(audioBlob);
                setAudioUrl(audioUrl);
                setIsRecording(false);

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }

                // Reset timer
                clearInterval(timerRef.current);
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingDuration(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Could not access microphone. Please ensure you have granted permission.');
        }
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        console.log('File selected:', file);

        if (!file) {
            console.log('No file selected');
            return;
        }

        // Check file type
        const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm'];
        if (!validTypes.includes(file.type)) {
            console.error('Invalid file type:', file.type);
            setError('Invalid file type. Please upload a WAV, MP3, OGG, or WebM audio file.');
            return;
        }

        // Check file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
            console.error('File too large:', file.size);
            setError('File too large. Maximum file size is 20MB.');
            return;
        }

        // Reset state
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        // Create URL for audio playback
        const newAudioUrl = URL.createObjectURL(file);
        console.log('Created URL for file:', newAudioUrl);

        setUploadedFile(file);
        setAudioBlob(null);
        setAudioUrl(newAudioUrl);
        setResults(null);
        setError(null);
    };

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Handle click on process audio button
    const handleProcessClick = (e) => {
        e.preventDefault();
        console.log('Process audio button clicked');
        handleProcessAudio();
    };

    // Process audio for transcription and analysis
    const handleProcessAudio = async () => {
        // Check if we have audio to process
        if (!audioBlob && !uploadedFile) {
            console.error('No audio to process');
            setError('No audio to process. Please record or upload an audio file.');
            return;
        }

        console.log('Processing audio:', {
            hasBlob: !!audioBlob,
            uploadedFile: uploadedFile?.name,
            includeAnalysis
        });

        setLoading(true);
        setError(null);

        try {
            // Prepare file for upload
            const audioFile = uploadedFile || new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
            console.log('Audio file prepared for upload:', audioFile.name, audioFile.size, audioFile.type);

            // Process audio with real API (no demo mode)
            const response = await processAudio(audioFile, {
                includeAnalysis,
                demoMode: false // Use real API to get actual transcription results
            });

            console.log('Process audio response:', response);

            if (!response.success) {
                console.error('API Error:', response.error);
                const errorMsg = response.error || 'Failed to process audio';

                // Show error to user
                setError(errorMsg);

                // If the error is a backend connection issue, offer option to try demo mode
                if (response.status === 503 || response.status === 504 || response.status === 500) {
                    if (window.confirm('Could not connect to the backend speech processing server. Would you like to try demo mode instead?')) {
                        await processDemoAudio(audioFile);
                    }
                }
                return;
            }

            // Set results if successful
            setResults(response);
            // Show success notification for real transcription
            setError(null);
            // Set a notification message indicating real transcription was used
            const infoMessage = document.createElement('div');
            infoMessage.className = 'info-message';
            infoMessage.textContent = '✓ Successfully processed audio with real Whisper transcription.';
            infoMessage.style.color = 'green';
            infoMessage.style.marginBottom = '10px';
            const resultElement = document.querySelector('.results-container');
            if (resultElement && !resultElement.querySelector('.info-message')) {
                resultElement.prepend(infoMessage);
                // Remove after 5 seconds
                setTimeout(() => {
                    if (infoMessage.parentNode) {
                        infoMessage.parentNode.removeChild(infoMessage);
                    }
                }, 5000);
            }

        } catch (err) {
            console.error('Error processing audio:', err);
            setError(err.message || 'An error occurred while processing the audio');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to process audio in demo mode
    const processDemoAudio = async (audioFile) => {
        try {
            console.log('Falling back to demo mode for audio processing');
            setError('Using demo mode - showing simulated results instead of actual transcription');

            const demoResponse = await processAudio(audioFile, {
                includeAnalysis,
                demoMode: true
            });

            if (demoResponse.success) {
                console.log('Demo processing successful:', demoResponse);
                setResults(demoResponse);
            } else {
                throw new Error('Failed to process audio in demo mode');
            }
        } catch (err) {
            console.error('Demo mode error:', err);
            setError('Failed to process audio even in demo mode: ' + err.message);
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
            <div className="mb-6 space-y-4">
                {/* Recording Controls */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1 p-4 border border-gray-300 rounded-md dark:border-gray-600">
                        <h3 className="text-lg font-medium mb-3">Record Audio</h3>
                        <div className="flex items-center space-x-4">
                            {!isRecording ? (
                                <button
                                    onClick={handleStartRecording}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
                                    disabled={loading}
                                    type="button"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Start Recording
                                </button>
                            ) : (
                                <button
                                    onClick={handleStopRecording}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                                    type="button"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                    </svg>
                                    Stop Recording ({formatTime(recordingDuration)})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="flex-1 p-4 border border-gray-300 rounded-md dark:border-gray-600">
                        <h3 className="text-lg font-medium mb-3">Upload Audio File</h3>
                        <div className="flex items-center">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                className="hidden"
                                disabled={loading || isRecording}
                            />
                            <button
                                onClick={handleFileButtonClick}
                                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md flex items-center"
                                disabled={loading || isRecording}
                                type="button"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                Choose File
                            </button>
                            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                                {uploadedFile ? uploadedFile.name : 'No file selected'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Audio Player */}
                {audioUrl && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">Audio Preview</h3>
                        <audio
                            controls
                            src={audioUrl}
                            className="w-full"
                        />
                    </div>
                )}

                {/* Processing Options */}
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="includeAnalysis"
                        checked={includeAnalysis}
                        onChange={e => setIncludeAnalysis(e.target.checked)}
                        className="rounded mr-2 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="includeAnalysis" className="text-sm">
                        Include cognitive analysis of transcribed speech
                    </label>
                </div>

                {/* Process Button */}
                <button
                    onClick={handleProcessClick}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md flex justify-center items-center"
                    disabled={loading || (!audioBlob && !uploadedFile)}
                    type="button"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Audio...
                        </>
                    ) : 'Process Audio'}
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 dark:bg-red-900 dark:text-red-200" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {/* Results Display */}
            {results && results.success && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transcription Results</h3>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                            {results.transcription.text}
                        </p>
                        <div className="mt-2 text-right">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Language: {results.transcription.language || 'auto-detected'}
                            </span>
                        </div>
                    </div>

                    {/* Cognitive Analysis Results */}
                    {results.analysis && (
                        <>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cognitive Analysis</h3>

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
                                            stroke={results.analysis.overall_score < 0.3 ? "#4caf50" : results.analysis.overall_score < 0.6 ? "#ff9800" : "#f44336"}
                                            strokeWidth="3"
                                            strokeDasharray={`${results.analysis.overall_score * 100}, 100`}
                                        />
                                        <text x="18" y="20.35" className="text-center text-lg font-bold" textAnchor="middle" fill="currentColor">
                                            {Math.round(results.analysis.overall_score * 100)}%
                                        </text>
                                    </svg>
                                    <div className="ml-4">
                                        <p className="text-lg font-semibold">
                                            Risk Level: {getRiskLevel(results.analysis.overall_score)}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Confidence: {Math.round((results.analysis.confidence_score || 0.75) * 100)}%
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Model: {results.analysis.model_type || 'Default'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-4 py-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cognitive Domain Scores</h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                                    {Object.entries(results.analysis.domain_scores || {}).map(([domain, score]) => (
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
                                    {results.analysis.recommendations?.map((recommendation, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300">
                                            {recommendation}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudioRecorder; 