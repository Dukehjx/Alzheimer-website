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
// Removed imports for setAiModel, setWhisperModelSize as backend endpoints do not exist
// import { setAiModel, setWhisperModelSize } from '../api/aiService';

const AIModelSettings = () => {
    const [apiKey, setApiKey] = useState('');
    const [whisperModelSize, setWhisperModelSize] = useState('base');
    const [loading, setLoading] = useState(false);
    const [whisperLoading, setWhisperLoading] = useState(false);

    const [error, setError] = useState('API key configuration is now handled on the backend via environment variables. This section is for display purposes only and does not submit data.');
    const [whisperError, setWhisperError] = useState('Whisper model selection is currently managed by the backend. This section is for display purposes only.');
    const [success, setSuccess] = useState(null);
    const [whisperSuccess, setWhisperSuccess] = useState(null);

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
        // setError(null); // No need to clear if form is disabled
        // setSuccess(null);
    };

    const handleWhisperModelChange = (e) => {
        setWhisperModelSize(e.target.value);
        // setWhisperError(null);
        // setWhisperSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setError('API key configuration is handled on the backend.');
        // setLoading(false);
        // Functionality disabled as backend endpoint does not exist
        console.warn('Attempted to submit API key, but this functionality is disabled.');
    };

    const handleWhisperSubmit = async (e) => {
        e.preventDefault();
        // setWhisperError('Whisper model selection is handled on the backend.');
        // setWhisperLoading(false);
        // Functionality disabled as backend endpoint does not exist
        console.warn('Attempted to submit Whisper model size, but this functionality is disabled.');
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Model configurations such as API keys and Whisper model versions are managed by the backend.
                    This page is currently a placeholder and does not actively configure the AI models.
                </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardHeader
                        title="OpenAI API Configuration (Display Only)"
                        subheader="API key is set via backend environment variables"
                    />
                    <Divider />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        GPT-4o API Key (Informational)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        variant="outlined"
                                        label="OpenAI API Key (Not Submitted)"
                                        value={apiKey}
                                        onChange={handleApiKeyChange}
                                        placeholder="API Key is managed by backend"
                                        required
                                        disabled // Disable the form field
                                        autoComplete="off"
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        The OpenAI API key is configured securely on the server.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled // Disable the button
                                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                                    >
                                        Save API Key (Disabled)
                                    </Button>
                                </Grid>

                                {error && (
                                    <Grid item xs={12}>
                                        <Alert severity="warning">{error}</Alert>
                                    </Grid>
                                )}
                                {/* {success && (...)} */}
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card variant="outlined">
                    <CardHeader
                        title="Speech-to-Text Model (Display Only)"
                        subheader="Whisper model is configured on the backend"
                    />
                    <Divider />
                    <CardContent>
                        <form onSubmit={handleWhisperSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Whisper Model Size (Informational)
                                    </Typography>
                                    <FormControl fullWidth disabled> {/* Disable the form control */}
                                        <InputLabel>Model Size</InputLabel>
                                        <Select
                                            value={whisperModelSize}
                                            onChange={handleWhisperModelChange}
                                            label="Model Size (Not Submitted)"
                                        >
                                            <MenuItem value="tiny">Tiny</MenuItem>
                                            <MenuItem value="base">Base (Current Backend Default)</MenuItem>
                                            <MenuItem value="small">Small</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="large">Large</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        The Whisper model is configured on the server.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled // Disable the button
                                        startIcon={whisperLoading && <CircularProgress size={20} color="inherit" />}
                                    >
                                        Save Settings (Disabled)
                                    </Button>
                                </Grid>

                                {whisperError && (
                                    <Grid item xs={12}>
                                        <Alert severity="warning">{whisperError}</Alert>
                                    </Grid>
                                )}
                                {/* {whisperSuccess && (...)} */}
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AIModelSettings; 