import React, { useState, useRef } from 'react';
import axios from 'axios';

// API base URL - change this to your backend URL when deploying
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CognitiveAssessment = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [whisperMode, setWhisperMode] = useState('local');
    const [config, setConfig] = useState({ whisper_mode: 'local', whisper_model: 'base', has_openai_key: false });

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Fetch configuration on component mount
    React.useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get(`${API_URL}/language-analysis/config`);
            setConfig(response.data);
            setWhisperMode(response.data.whisper_mode);
        } catch (error) {
            console.error('Failed to fetch config:', error);
            setError('Failed to fetch configuration. Using default settings.');
        }
    };

    const startRecording = async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                setUploadedFile(new File([audioBlob], 'recording.wav', { type: 'audio/wav' }));
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access your microphone. Please check your browser permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop all tracks in the stream
            if (mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            setAudioURL(URL.createObjectURL(file));
        }
    };

    const analyzeSpeech = async () => {
        if (!uploadedFile) {
            setError('Please record or upload an audio file first');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('audio_file', uploadedFile);
            formData.append('whisper_mode', whisperMode);

            const response = await axios.post(`${API_URL}/language-analysis/analyze-speech`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResults(response.data);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(`Analysis failed: ${err.response?.data?.detail || err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleTextInput = async (event) => {
        event.preventDefault();
        const text = event.target.text.value.trim();

        if (!text) {
            setError('Please enter some text to analyze');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('text', text);

            const response = await axios.post(`${API_URL}/language-analysis/analyze-text`, formData);
            setResults(response.data);
        } catch (err) {
            console.error('Text analysis error:', err);
            setError(`Text analysis failed: ${err.response?.data?.detail || err.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderResults = () => {
        if (!results) return null;

        const { transcription, risk_assessment, linguistic_features } = results;

        return (
            <div className="results-container">
                <h3>Results</h3>

                {transcription && (
                    <div className="result-section">
                        <h4>Transcription</h4>
                        <p>{transcription}</p>
                    </div>
                )}

                <div className="result-section">
                    <h4>Risk Assessment</h4>
                    <p><strong>Overall Risk Score:</strong> {(risk_assessment.overall_score * 100).toFixed(1)}%</p>
                    <p><strong>Risk Level:</strong> {risk_assessment.risk_level}</p>

                    <h5>Risk Categories</h5>
                    <ul>
                        {risk_assessment.categories.map((category, index) => (
                            <li key={index}>
                                <strong>{category.name}:</strong> {(category.score * 100).toFixed(1)}% - {category.description}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="result-section">
                    <h4>Linguistic Features</h4>
                    <ul>
                        <li><strong>Vocabulary Size:</strong> {linguistic_features.vocabulary_size}</li>
                        <li><strong>Type-Token Ratio:</strong> {linguistic_features.type_token_ratio?.toFixed(4)}</li>
                        <li><strong>Average Sentence Length:</strong> {linguistic_features.avg_sentence_length?.toFixed(2)} words</li>
                        <li><strong>Average Word Length:</strong> {linguistic_features.avg_word_length?.toFixed(2)} characters</li>
                        <li><strong>Readability Score:</strong> {linguistic_features.readability_score?.toFixed(2)}</li>
                        {linguistic_features.semantic_coherence && (
                            <li><strong>Semantic Coherence:</strong> {linguistic_features.semantic_coherence?.toFixed(4)}</li>
                        )}
                    </ul>
                </div>

                <div className="result-section">
                    <h4>Recommendations</h4>
                    <ol>
                        {risk_assessment.recommendations.map((recommendation, index) => (
                            <li key={index}>{recommendation}</li>
                        ))}
                    </ol>
                </div>

                <div className="result-section">
                    <h4>Explanation</h4>
                    <p>{risk_assessment.explanations?.explanation}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="cognitive-assessment">
            <h2>Cognitive Assessment Tool</h2>
            <p>
                This tool analyzes speech patterns for potential signs of cognitive decline.
                You can either record your voice or upload an audio file.
            </p>

            <div className="mode-selection">
                <label>
                    Analysis Mode:
                    <select
                        value={whisperMode}
                        onChange={(e) => setWhisperMode(e.target.value)}
                        disabled={!config.has_openai_key}
                    >
                        <option value="local">Local Processing</option>
                        <option value="api" disabled={!config.has_openai_key}>API Processing (Higher Accuracy)</option>
                    </select>
                </label>
                {!config.has_openai_key && (
                    <p className="note">API mode unavailable: OpenAI API key not configured</p>
                )}
            </div>

            <div className="assessment-options">
                <div className="option-card">
                    <h3>Option 1: Record Speech</h3>
                    <div className="recording-controls">
                        {!isRecording ? (
                            <button
                                onClick={startRecording}
                                disabled={isAnalyzing}
                                className="record-btn"
                            >
                                Start Recording
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className="stop-btn"
                            >
                                Stop Recording
                            </button>
                        )}

                        {isRecording && <div className="recording-indicator">Recording...</div>}

                        {audioURL && (
                            <div className="audio-preview">
                                <audio src={audioURL} controls />
                            </div>
                        )}
                    </div>
                </div>

                <div className="option-card">
                    <h3>Option 2: Upload Audio</h3>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="audio/*"
                        disabled={isAnalyzing || isRecording}
                    />
                </div>

                <div className="option-card">
                    <h3>Option 3: Enter Text</h3>
                    <form onSubmit={handleTextInput}>
                        <textarea
                            name="text"
                            placeholder="Enter text to analyze..."
                            rows={5}
                            disabled={isAnalyzing}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isAnalyzing}
                            className="analyze-btn"
                        >
                            Analyze Text
                        </button>
                    </form>
                </div>
            </div>

            {uploadedFile && (
                <div className="analysis-actions">
                    <button
                        onClick={analyzeSpeech}
                        disabled={isAnalyzing || isRecording || !uploadedFile}
                        className="analyze-btn"
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Speech Recording'}
                    </button>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {isAnalyzing && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Analyzing your speech pattern. This may take a moment...</p>
                </div>
            )}

            {renderResults()}
        </div>
    );
};

export default CognitiveAssessment; 