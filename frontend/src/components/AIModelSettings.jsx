import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
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
    // Always use GPT-4o model
    const [apiKey, setApiKey] = useState('');
    const [whisperModelSize, setWhisperModelSize] = useState('base');
    const [loading, setLoading] = useState(false);
    const [whisperLoading, setWhisperLoading] = useState(false);
    const [error, setError] = useState(null);
    const [whisperError, setWhisperError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [whisperSuccess, setWhisperSuccess] = useState(null);

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
        if (!apiKey.trim()) {
            setError('API key is required for GPT-4o model');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Always set model to GPT-4o
            const response = await setAiModel('gpt4o', apiKey);

            if (response.success) {
                setSuccess('Successfully set API key for GPT-4o model');
            } else {
                setError('Failed to update API key');
            }
        } catch (err) {
            console.error('Error setting AI model:', err);
            setError(err.response?.data?.detail || 'Failed to update API key');
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
                        title="OpenAI API Configuration"
                        subheader="Set your API key for GPT-4o powered cognitive analysis"
                    />
                    <Divider />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        GPT-4o API Key
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
                                        Your API key is required for GPT-4o powered analysis and is only used to initialize the model.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading || !apiKey.trim()}
                                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                                    >
                                        {loading ? 'Updating...' : 'Save API Key'}
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