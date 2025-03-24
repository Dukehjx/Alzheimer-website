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
    CircularProgress
} from '@mui/material';
import { setAiModel } from '../api/aiService';

const AIModelSettings = () => {
    const [selectedModel, setSelectedModel] = useState('spacy');
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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

    return (
        <Card variant="outlined">
            <CardHeader
                title="AI Model Settings"
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
    );
};

export default AIModelSettings; 