import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Alert,
    Divider,
    CircularProgress,
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';
import { setAiModel, setWhisperModelSize } from '../api/aiService';

const AIModelSettings = () => {
    const [selectedModel, setSelectedModel] = useState('spacy');
    const [apiKey, setApiKey] = useState('');
    const [whisperModelSize, setWhisperModelSize] = useState('base');
    const [loading, setLoading] = useState(false);
    const [whisperLoading, setWhisperLoading] = useState(false);
    const [error, setError] = useState(null);
    const [whisperError, setWhisperError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [whisperSuccess, setWhisperSuccess] = useState(null);

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        // Clear messages when model changes
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
        // Clear messages when API key changes
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleWhisperModelChange = (e) => {
        setWhisperModelSize(e.target.value);
        // Clear messages when Whisper model changes
        if (whisperError) setWhisperError(null);
        if (whisperSuccess) setWhisperSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (selectedModel === 'gpt4' && !apiKey.trim()) {
            setError('API key is required for GPT-4 model');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Only pass API key if GPT-4 is selected
            const apiKeyToSend = selectedModel === 'gpt4' ? apiKey : null;
            const response = await setAiModel(selectedModel, apiKeyToSend);

            if (response.success) {
                setSuccess(`Successfully set AI model to ${selectedModel.toUpperCase()}`);
                // Clear API key field after successful submission
                if (selectedModel === 'spacy') {
                    setApiKey('');
                }
            } else {
                setError('Failed to update AI model settings');
            }
        } catch (err) {
            console.error('Error setting AI model:', err);
            setError(err.response?.data?.detail || 'Failed to update AI model settings');
        } finally {
            setLoading(false);
        }
    };

    const handleWhisperSubmit = async (e) => {
        e.preventDefault();

        setWhisperLoading(true);
        setWhisperError(null);
        setWhisperSuccess(null);

        try {
            const response = await setWhisperModelSize(whisperModelSize);

            if (response.success) {
                setWhisperSuccess(`Successfully set Whisper model size to ${whisperModelSize.toUpperCase()}`);
            } else {
                setWhisperError('Failed to update Whisper model settings');
            }
        } catch (err) {
            console.error('Error setting Whisper model size:', err);
            setWhisperError(err.response?.data?.detail || 'Failed to update Whisper model settings');
        } finally {
            setWhisperLoading(false);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardHeader
                        title="Text Analysis Model"
                        subheader="Configure which model to use for cognitive analysis"
                    />
                    <Divider />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Select Model
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            name="model-type"
                                            value={selectedModel}
                                            onChange={handleModelChange}
                                        >
                                            <FormControlLabel
                                                value="spacy"
                                                control={<Radio />}
                                                label="SpaCy NLP (Default)"
                                            />
                                            <FormControlLabel
                                                value="gpt4"
                                                control={<Radio />}
                                                label="GPT-4 (Requires API Key)"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                {selectedModel === 'gpt4' && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            OpenAI API Key
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            variant="outlined"
                                            label="OpenAI API Key"
                                            value={apiKey}
                                            onChange={handleApiKeyChange}
                                            placeholder="Enter your OpenAI API key"
                                            required
                                            autoComplete="off"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                            Your API key is not stored permanently and is only used to initialize the model.
                                        </Typography>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading || (selectedModel === 'gpt4' && !apiKey.trim())}
                                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                                    >
                                        {loading ? 'Updating...' : 'Save Settings'}
                                    </Button>
                                </Grid>

                                {error && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{error}</Alert>
                                    </Grid>
                                )}

                                {success && (
                                    <Grid item xs={12}>
                                        <Alert severity="success">{success}</Alert>
                                    </Grid>
                                )}
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardHeader
                        title="Speech-to-Text Model"
                        subheader="Configure Whisper model settings for speech processing"
                    />
                    <Divider />
                    <CardContent>
                        <form onSubmit={handleWhisperSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Whisper Model Size
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Model Size</InputLabel>
                                        <Select
                                            value={whisperModelSize}
                                            onChange={handleWhisperModelChange}
                                            label="Model Size"
                                        >
                                            <MenuItem value="tiny">Tiny (Fastest, Least Accurate)</MenuItem>
                                            <MenuItem value="base">Base (Default)</MenuItem>
                                            <MenuItem value="small">Small</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="large">Large (Slowest, Most Accurate)</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        Larger models provide better accuracy but require more processing power and memory.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={whisperLoading}
                                        startIcon={whisperLoading && <CircularProgress size={20} color="inherit" />}
                                    >
                                        {whisperLoading ? 'Updating...' : 'Save Settings'}
                                    </Button>
                                </Grid>

                                {whisperError && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{whisperError}</Alert>
                                    </Grid>
                                )}

                                {whisperSuccess && (
                                    <Grid item xs={12}>
                                        <Alert severity="success">{whisperSuccess}</Alert>
                                    </Grid>
                                )}
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AIModelSettings; 