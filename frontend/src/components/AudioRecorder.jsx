import React, { useState, useRef, useEffect, useCallback } from 'react';
import { processAudio } from '../api/aiService';
import apiClient, { uploadClient, testApiConnection } from '../api/apiClient';
import ScoreExplanation from './ScoreExplanation';
import AudioProcessingError from './AudioProcessingError';
import axios from 'axios';

/**
 * Status indicator component for service availability
 */
const StatusIndicator = ({ status, message }) => {
    let bgColor = 'bg-gray-200';
    let textColor = 'text-gray-700';
    let statusText = 'Unknown';
    let icon = null;

    if (status === 'online') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        statusText = 'Online';
        icon = (
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
        );
    } else if (status === 'degraded') {
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        statusText = 'Degraded';
        icon = (
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        );
    } else if (status === 'offline') {
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        statusText = 'Offline';
        icon = (
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        );
    }

    return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
            {icon}
            <span>{statusText}</span>
            {message && <span className="ml-1 text-xs opacity-75">({message})</span>}
        </div>
    );
};

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
    const [apiError, setApiError] = useState(null);
    const [results, setResults] = useState(null);
    const [includeAnalysis, setIncludeAnalysis] = useState(true);
    const [serviceStatus, setServiceStatus] = useState({ status: 'unknown', message: null });

    // Audio player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [seekValue, setSeekValue] = useState(0);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const audioRef = useRef(null);

    // Stop recording audio - using useCallback to make it stable across renders
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            // No need to clear the timer here as it's handled by the useEffect when isRecording becomes false
        }
    }, [isRecording]);

    // Start timer effect that updates when isRecording changes
    useEffect(() => {
        let timerId = null;

        if (isRecording) {
            // Reset to zero when starting recording
            setRecordingDuration(0);
            console.log('Timer reset to 0s');

            // Create function to update recording duration
            const updateDuration = () => {
                setRecordingDuration(prevDuration => {
                    // Ensure we're using integer seconds
                    const newDuration = Math.round(prevDuration) + 1;
                    console.log(`Timer tick: ${newDuration}s`);
                    return newDuration;
                });
            };

            // Only start interval, don't call updateDuration immediately
            timerId = setInterval(updateDuration, 1000);
            console.log('Recording timer started with ID:', timerId);

            // Store timer ID in ref for potential external access
            timerRef.current = timerId;
        }

        // Cleanup function
        return () => {
            if (timerId) {
                console.log('Cleaning up timer with ID:', timerId);
                clearInterval(timerId);
                timerRef.current = null;
            }
        };
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

    // Reset audio player state
    const resetAudioPlayerState = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setSeekValue(0);
        setAudioDuration(0);
    };

    // Reset error state
    const resetErrorState = () => {
        setError(null);
        setApiError(null);
        setServiceStatus({ status: 'unknown', message: null });
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

            // Reset audio player state
            resetAudioPlayerState();

            // Check if we're in a secure context (HTTPS) which is required for getUserMedia
            if (window.isSecureContext === false) {
                throw new Error('Audio recording requires a secure context (HTTPS). Please use HTTPS to enable this feature.');
            }

            // Request microphone access with specific audio constraints
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 44100,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            streamRef.current = stream;

            // Create media recorder with specific MIME type
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : 'audio/ogg';

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                audioBitsPerSecond: 128000
            });
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
                // Create a new Blob from the recorded chunks with specific mime type
                const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                    ? 'audio/webm'
                    : 'audio/ogg';

                // Create a new blob with the recorded audio data
                const blob = new Blob(chunksRef.current, { type: mimeType });

                // Reset the chunks array
                chunksRef.current = [];

                // Create a URL for the audio blob
                const audioURL = URL.createObjectURL(blob);

                // Update state with the recorded audio
                setAudioBlob(blob);
                setAudioUrl(audioURL);
                setIsRecording(false);

                // Stop all tracks in the stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);

            // Set a maximum recording duration of 5 minutes (300,000 ms)
            setTimeout(() => {
                if (isRecording && mediaRecorderRef.current) {
                    stopRecording();
                }
            }, 5 * 60 * 1000);

        } catch (error) {
            console.error('Error starting recording:', error);

            // Handle specific error cases with user-friendly messages
            let errorMessage = 'An error occurred while trying to record audio.';

            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMessage = 'Microphone access was denied. Please allow microphone access in your browser settings to use the audio recording feature.';
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                errorMessage = 'No microphone was found. Please connect a microphone and try again.';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Your microphone is busy or unavailable. Please close other applications that might be using your microphone.';
            } else if (error.name === 'SecurityError' || error.message.includes('secure context')) {
                errorMessage = 'Audio recording requires a secure connection (HTTPS). Please ensure you are using HTTPS to access this site.';
            } else if (error.name === 'AbortError') {
                errorMessage = 'Recording was aborted. This might be due to a hardware error or system issue.';
            }

            setError(errorMessage);
            setIsRecording(false);
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

        // Reset audio player state for the new file
        resetAudioPlayerState();

        // Create URL for audio playback
        const newAudioUrl = URL.createObjectURL(file);
        console.log('Created URL for file:', newAudioUrl);

        setUploadedFile(file);
        setAudioBlob(null);
        setAudioUrl(newAudioUrl);
        setResults(null);
        setError(null);
        setRecordingDuration(0); // Reset recording duration for uploaded files
    };

    // Format seconds to MM:SS (only integer seconds)
    const formatTime = (seconds) => {
        // Round to nearest integer to avoid decimal places
        const roundedSeconds = Math.round(seconds);
        const mins = Math.floor(roundedSeconds / 60).toString().padStart(2, '0');
        const secs = (roundedSeconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Handle click on process button
    const handleProcessClick = (e) => {
        e.preventDefault();
        console.log('Process audio button clicked');
        // Add debugging to track flow
        if (!uploadedFile && !audioBlob) {
            console.log('No audio available to process');
            setError('No audio available. Please record or upload an audio file first.');
            return;
        }
        console.log('Audio available, proceeding to process');
        handleProcessAudio();
    };

    // Process audio for transcription and analysis
    const handleProcessAudio = async () => {
        setLoading(true);
        resetErrorState();
        console.log('Processing audio...');

        // Determine which file to use
        const audioFile = uploadedFile || audioBlob;
        if (!audioFile) {
            console.error('No audio file available');
            setError('No audio file available. Please record or upload an audio file.');
            setLoading(false);
            return;
        }

        try {
            // First run a diagnostic test to check API connectivity
            console.log('Running API connectivity test...');
            const diagnosticResult = await testApiConnection();

            if (!diagnosticResult.success) {
                console.error('API connectivity test failed:', diagnosticResult);
                setError(`API connectivity issue detected: ${diagnosticResult.error}. The API may be unavailable or misconfigured.`);
                setServiceStatus({ status: 'offline', message: 'Connection failed' });
                setLoading(false);
                return;
            }

            console.log('API connectivity test successful:', diagnosticResult.data);

            // Now check if the audio processing endpoint is available
            try {
                console.log('Verifying audio processing endpoint availability...');
                // Directly use the process-audio endpoint with a HEAD request instead of the health endpoint
                const endpoint = '/api/v1/ai/process-audio';
                console.log(`Checking process-audio endpoint at: ${endpoint}`);

                // Try to check if the endpoint exists
                try {
                    // Use OPTIONS request which is lightweight
                    const healthCheck = await uploadClient.options(endpoint);
                    console.log('Endpoint check result:', healthCheck.status);

                    // If we get here, the endpoint exists
                    setServiceStatus({
                        status: 'online',
                        message: 'Ready'
                    });
                } catch (endpointError) {
                    // If it's a 405 Method Not Allowed, it means the endpoint exists but doesn't support OPTIONS
                    if (endpointError.response && endpointError.response.status === 405) {
                        console.log('Endpoint exists but OPTIONS not supported - this is fine');
                        setServiceStatus({
                            status: 'online',
                            message: 'Ready'
                        });
                    } else if (endpointError.response && endpointError.response.status === 404) {
                        // Try an alternative health check endpoint
                        try {
                            console.log('Endpoint not found, trying health check...');
                            const healthResponse = await apiClient.get('/api/v1/ai/process-audio-health');
                            if (healthResponse.status === 200) {
                                console.log('Health check successful, API available');
                                setServiceStatus({
                                    status: 'online',
                                    message: 'Ready'
                                });
                            }
                        } catch (healthCheckError) {
                            console.warn('Audio processing health check failed:', healthCheckError.message);
                            setServiceStatus({
                                status: 'degraded',
                                message: 'Health check failed'
                            });
                            // We'll continue with processing in demo/fallback mode
                        }
                    } else {
                        // For any other error, we'll treat it as if the service is degraded
                        // but still proceed with the upload
                        console.warn('Non-critical endpoint check error:', endpointError.message);
                        setServiceStatus({
                            status: 'degraded',
                            message: 'Endpoint check failed'
                        });
                    }
                }
            } catch (healthError) {
                console.error('Audio processing endpoint health check failed:', healthError);
                console.error('Health check error details:', {
                    message: healthError.message,
                    status: healthError.response?.status,
                    data: healthError.response?.data,
                    config: healthError.config,
                });

                // We'll continue anyway with a warning
                setServiceStatus({
                    status: 'degraded',
                    message: 'Health check failed'
                });
                console.log('Continuing despite health check failure');
            }

            console.log(`Processing ${uploadedFile ? 'uploaded' : 'recorded'} audio file:`,
                { name: uploadedFile?.name, size: audioFile.size });

            // Check if we have an auth token
            const hasToken = !!localStorage.getItem('token');
            const demoMode = !hasToken;

            // If in demo mode, notify the user but continue processing
            if (demoMode) {
                console.log('Using public mode for processing (no login)');
                // We'll show a demo mode message only after successful processing
            }

            // For uploaded files, create a proper File object if needed
            let fileToProcess = audioFile;
            if (uploadedFile) {
                fileToProcess = uploadedFile;
            } else if (audioBlob) {
                // Ensure we have a named File object for recorded audio
                fileToProcess = new File([audioBlob], "recorded-audio.wav", {
                    type: audioBlob.type,
                    lastModified: new Date().getTime()
                });
            }

            const options = {
                includeAnalysis: includeAnalysis,
                language: null, // Auto-detect language
                demoMode: demoMode // Use demo mode without authentication
            };

            // Direct call to processAudio API service with explicit endpoint
            const endpoint = '/api/v1/ai/process-audio';
            console.log('Calling API for audio processing at:', endpoint);

            try {
                // Log detailed request info for debugging
                console.log('Audio file details:', {
                    name: fileToProcess.name || 'unnamed file',
                    type: fileToProcess.type,
                    size: fileToProcess.size,
                    lastModified: fileToProcess.lastModified ? new Date(fileToProcess.lastModified).toISOString() : 'unknown'
                });

                console.log('Starting upload and processing with uploadClient');
                const result = await processAudio(fileToProcess, options);
                console.log('Audio processing result:', result);

                // Display info message for demo mode
                if (demoMode && result.success) {
                    setError('Note: Using public mode - your results are not saved to an account. Create an account to save your history.');
                }

                // If we have error_info, it means we're using fallback mode
                if (result.error_info) {
                    // Check if it's a 404 error specifically
                    if (result.error_info.original_error.includes("404")) {
                        setError('The audio processing service is currently unavailable (404). Using simulated results instead. Please try again later or contact support if this persists.');
                    } else {
                        setError(`Using simulated results due to API error: ${result.error_info.original_error}`);
                    }
                    setServiceStatus({ status: 'degraded', message: 'Using fallback' });

                    // Create a synthetic API error for the detailed view
                    const syntheticError = new Error(result.error_info.original_error);
                    syntheticError.response = {
                        data: {
                            detail: result.error_info.original_error,
                            fallback_mode: true,
                            timestamp: result.error_info.timestamp
                        }
                    };
                    setApiError(syntheticError);
                }

                // Handle success
                if (result && result.success) {
                    setResults(result);
                    // Only set status to online if we're not in fallback mode
                    if (!result.error_info) {
                        setServiceStatus({ status: 'online', message: null });
                    }
                } else {
                    // Handle API error
                    const errorObj = new Error(result?.error || 'Audio processing failed. Please try again.');
                    errorObj.response = { data: result };
                    setApiError(errorObj);
                    throw errorObj;
                }
            } catch (apiError) {
                console.error('API call error:', apiError);
                console.error('API error details:', {
                    message: apiError.message,
                    status: apiError.response?.status,
                    data: apiError.response?.data,
                    config: apiError.config
                });

                // Store the full API error object for detailed debugging
                setApiError(apiError);

                // Check if this is an Axios error with a response
                if (apiError.response) {
                    const status = apiError.response.status;
                    const errorData = apiError.response.data;

                    if (status === 404) {
                        setError(`The audio processing endpoint (${endpoint}) could not be found (404). The API may be misconfigured or unavailable.`);
                        setServiceStatus({ status: 'offline', message: 'Not found (404)' });
                    } else {
                        // Extract detailed error information from API response
                        let errorMessage = 'Unknown error';

                        // Try to extract the most useful error message
                        if (errorData?.detail) {
                            errorMessage = errorData.detail;
                        } else if (errorData?.message) {
                            errorMessage = errorData.message;
                        } else if (errorData?.error) {
                            errorMessage = errorData.error;
                        } else if (typeof errorData === 'string') {
                            errorMessage = errorData;
                        }

                        // Check for specific Whisper API errors
                        if (errorMessage.includes('Whisper') || errorMessage.includes('audio')) {
                            if (errorMessage.includes('too short')) {
                                errorMessage = 'The audio file is too short. Please record a longer message.';
                            } else if (errorMessage.includes('too long')) {
                                errorMessage = 'The audio file is too long. Please limit recordings to under 10 minutes.';
                            } else if (errorMessage.includes('format')) {
                                errorMessage = 'The audio format is not supported. Please use WAV, MP3, or M4A files.';
                            }
                        }

                        setError(`Audio processing error (${status}): ${errorMessage}`);
                        setServiceStatus({ status: 'degraded', message: `Error ${status}` });
                    }
                } else {
                    throw apiError; // Re-throw to be caught by the outer catch
                }
            }
        } catch (err) {
            console.error('Error processing audio:', err);

            // Store the error object for detailed debugging
            if (!apiError) {
                setApiError(err);
            }

            // Provide more user-friendly error messages based on the type of error
            let errorMessage = err.message || 'An error occurred during audio processing. Please try again.';

            // If it's a network error, suggest it might be a CORS or HTTPS issue
            if (errorMessage.includes('Network Error') || errorMessage.includes('CORS')) {
                errorMessage = 'Network error: Could not connect to the audio processing service. This might be due to connection issues or HTTPS restrictions.';
                setServiceStatus({ status: 'offline', message: 'Network error' });
            }

            // If it mentions OpenAI or Whisper, it's likely an AI service issue
            if (errorMessage.includes('OpenAI') || errorMessage.includes('Whisper')) {
                errorMessage = 'AI service error: The speech recognition service is currently unavailable. Please try again later.';
                setServiceStatus({ status: 'degraded', message: 'AI service issue' });
            }

            setError(errorMessage);
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

    // RecordButton component to optimize updates
    const RecordButton = React.memo(({ isRecording, duration, onStart, onStop }) => {
        // Format seconds to MM:SS (integers only)
        const formatTime = (seconds) => {
            // Ensure we're working with integers
            const roundedSeconds = Math.round(seconds);
            const mins = Math.floor(roundedSeconds / 60).toString().padStart(2, '0');
            const secs = (roundedSeconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        };

        const formattedTime = formatTime(duration);

        return isRecording ? (
            <button
                onClick={onStop}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                type="button"
            >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Stop Recording ({formattedTime})
            </button>
        ) : (
            <button
                onClick={onStart}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={false}
                type="button"
            >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start Recording
            </button>
        );
    });

    // Audio player event handlers
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            console.log('Audio metadata loaded - checking duration');

            if (isNaN(audioRef.current.duration) || audioRef.current.duration === Infinity) {
                // If duration is not available, try to seek to get it
                console.log('Audio duration not available, trying to load...');
                try {
                    // First try seeking to end
                    audioRef.current.currentTime = 24 * 60 * 60; // Seek far ahead (24 hours)
                    setTimeout(() => {
                        audioRef.current.currentTime = 0; // Then back to start

                        // Try again to get duration after seeking
                        if (!isNaN(audioRef.current.duration) && audioRef.current.duration !== Infinity) {
                            const duration = Math.round(audioRef.current.duration);
                            console.log(`Audio duration loaded after seeking: ${duration}s`);
                            setAudioDuration(duration);
                        } else if (recordingDuration > 0 && !uploadedFile) {
                            // If still no duration and we have recording duration, use that
                            const duration = Math.round(recordingDuration);
                            console.log(`Using recording duration as fallback: ${duration}s`);
                            setAudioDuration(duration);
                        } else {
                            // Last resort - set a reasonable default duration
                            console.log('Setting default duration of 30s as last resort');
                            setAudioDuration(30);
                        }
                    }, 300); // Give a bit more time for seeking to complete
                } catch (err) {
                    console.warn('Error seeking audio:', err);
                    // Fallback to recording duration
                    if (recordingDuration > 0 && !uploadedFile) {
                        const duration = Math.round(recordingDuration);
                        console.log(`Using recording duration after seek error: ${duration}s`);
                        setAudioDuration(duration);
                    } else {
                        // Set a default duration as last resort
                        console.log('Setting default duration of 30s after error');
                        setAudioDuration(30);
                    }
                }
            } else {
                // Round duration to integer seconds
                const duration = Math.round(audioRef.current.duration);
                console.log(`Audio duration loaded directly: ${duration}s`);
                setAudioDuration(duration);

                // If this is a recording and duration seems off, use recording duration
                if (!uploadedFile && recordingDuration > 0 && (duration < 0.5 || duration > 3600)) {
                    const recordDuration = Math.round(recordingDuration);
                    console.log(`Using recording duration instead: ${recordDuration}s`);
                    setAudioDuration(recordDuration);
                }
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            // Round to integer seconds for display
            const current = Math.round(audioRef.current.currentTime);
            const duration = Math.round(audioRef.current.duration || audioDuration);

            // Only update state when integer seconds change to avoid too many rerenders
            if (Math.floor(current) !== Math.floor(currentTime)) {
                setCurrentTime(current);
                const progress = duration ? (current / duration) * 100 : 0;
                setSeekValue(progress);
            }
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        // Set to integer zero for consistency
        setCurrentTime(0);
        setSeekValue(0);
    };

    const handleSeekChange = (e) => {
        if (!audioRef.current) return;

        try {
            const value = parseFloat(e.target.value);
            setSeekValue(value);

            const duration = Math.round(audioRef.current.duration || audioDuration);
            if (duration > 0) {
                // Calculate seek time and round to integer seconds
                const seekTime = Math.round((value / 100) * duration);

                // Only update if integer second position has changed
                if (Math.floor(seekTime) !== Math.floor(audioRef.current.currentTime)) {
                    console.log(`Seeking to ${seekTime}s (${value}%)`);
                    audioRef.current.currentTime = seekTime;
                    setCurrentTime(seekTime);
                }
            }
        } catch (err) {
            console.error('Error seeking:', err);
        }
    };

    // Update seek value when audio time changes (for smoother progress bar)
    useEffect(() => {
        if (audioRef.current && audioDuration > 0) {
            // Use integer values for current time and duration for consistent progress calculation
            const roundedCurrentTime = Math.round(currentTime);
            const roundedDuration = Math.round(audioDuration);

            // Calculate progress percentage based on integers
            const progress = (roundedCurrentTime / roundedDuration) * 100;
            setSeekValue(progress);
        }
    }, [currentTime, audioDuration]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => {
                    console.error('Error playing audio:', err);
                });
            }
        }
    };

    // Set initial audio duration when recording completes
    useEffect(() => {
        if (audioBlob && recordingDuration > 0 && !audioDuration) {
            const duration = Math.round(recordingDuration);
            console.log(`Setting audioDuration from recording: ${duration}s`);
            setAudioDuration(duration);
        }
    }, [audioBlob, recordingDuration, audioDuration]);

    // Clean up audio resources on unmount
    useEffect(() => {
        // Capture current value of refs to use in cleanup
        const audio = audioRef.current;
        const mediaRecorder = mediaRecorderRef.current;
        const stream = streamRef.current;
        const timer = timerRef.current;
        const audioUrlCurrent = audioUrl;

        return () => {
            // Stop and clean up any playing audio
            if (audio) {
                if (!audio.paused) {
                    audio.pause();
                }
                audio.src = '';
            }

            // Clean up media recorder and stream
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }

            // Stop all media tracks
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Clear timers
            if (timer) {
                clearInterval(timer);
            }

            // Revoke object URLs
            if (audioUrlCurrent) {
                URL.revokeObjectURL(audioUrlCurrent);
            }
        };
    }, [audioUrl]); // stopRecording removed from dependencies to avoid the warning

    return (
        <div className="w-full">
            <div className="mb-6 space-y-4">
                {/* Recording Controls */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1 p-4 border border-gray-300 rounded-md dark:border-gray-600">
                        <h3 className="text-lg font-medium mb-3">Record Audio</h3>
                        <div className="flex items-center space-x-4">
                            <RecordButton isRecording={isRecording} duration={recordingDuration} onStart={handleStartRecording} onStop={handleStopRecording} />
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

                        {/* Hidden native audio element for browser audio API */}
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            className="hidden"
                            preload="metadata"
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={handleTimeUpdate}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onEnded={handleEnded}
                            onError={(e) => {
                                console.error('Audio player error:', e.target.error);
                                setError('Error playing audio. The file may be corrupted or in an unsupported format.');
                            }}
                        />

                        {/* Custom audio player UI */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            {/* Play/Pause button and time display */}
                            <div className="flex items-center mb-2">
                                <button
                                    onClick={togglePlayPause}
                                    className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full mr-3"
                                    type="button"
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? (
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>

                                <div className="text-sm font-mono text-gray-600 dark:text-gray-300">
                                    {formatTime(currentTime)} / {formatTime(audioDuration || 0)}
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={seekValue}
                                    onChange={handleSeekChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    aria-label="Seek audio position"
                                />
                                <div
                                    className="h-full bg-primary-600 rounded-full"
                                    style={{ width: `${seekValue}%` }}
                                ></div>
                            </div>

                            {/* File info */}
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                                <span>{uploadedFile ? uploadedFile.name : 'Recorded Audio'}</span>
                                <span>
                                    {uploadedFile ?
                                        `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB` :
                                        `${recordingDuration}s recording`}
                                </span>
                            </div>
                        </div>
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
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={handleProcessClick}
                            className="flex-grow bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md flex justify-center items-center"
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

                        {/* Service status indicator */}
                        {serviceStatus.status !== 'unknown' && (
                            <div className="ml-2">
                                <StatusIndicator status={serviceStatus.status} message={serviceStatus.message} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Replace simple error display with enhanced error component */}
            {error && (
                <AudioProcessingError
                    error={error}
                    apiError={apiError}
                    serviceStatus={serviceStatus}
                    onRetry={handleProcessClick}
                />
            )}

            {/* Results Display */}
            {results && results.success && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6 results-container">
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

                    {results && results.analysis && results.analysis.domain_scores && (
                        <div className="score-explanation-section mt-8">
                            <h3 className="section-title text-xl font-semibold mb-4">Understanding Your Results</h3>
                            <ScoreExplanation
                                scores={{
                                    lexicalDiversity: Math.round((1 - results.analysis.domain_scores.LANGUAGE) * 100),
                                    syntacticComplexity: Math.round((1 - results.analysis.domain_scores.EXECUTIVE_FUNCTION) * 100),
                                    semanticCoherence: results.analysis.domain_scores.VISUOSPATIAL ?
                                        Math.round((1 - results.analysis.domain_scores.VISUOSPATIAL) * 100) : 80,
                                    speechFluency: Math.round((1 - results.analysis.domain_scores.ATTENTION) * 100),
                                    memoryCues: Math.round((1 - results.analysis.domain_scores.MEMORY) * 100)
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudioRecorder; 