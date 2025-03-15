# Whisper Speech-to-Text Usage Guide

This guide explains how to use our dual-mode Whisper implementation for speech-to-text processing in the Alzheimer's detection platform.

## Overview

Our system supports two modes for speech-to-text processing using Whisper:

1. **Local Mode**: Uses the local OpenAI Whisper model running on your machine. This mode is free to use but depends on your machine's computational capabilities.

2. **API Mode**: Uses the OpenAI Whisper API for transcription. This requires an API key and has usage costs, but offers faster processing and potentially higher accuracy for complex audio.

## Prerequisites

### For Local Mode
- Python 3.8+
- OpenAI Whisper package installed (`openai-whisper`)
- FFmpeg installed on your system
- Sufficient computational resources (preferably a GPU for larger models)

### For API Mode
- OpenAI API key with access to the Whisper API
- Internet connection

## Installation

1. Install the required packages:
```bash
pip install -r ai_models/requirements.txt
```

2. Install FFmpeg (if not already installed):
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH
   - **MacOS**: `brew install ffmpeg`
   - **Linux**: `apt-get install ffmpeg`

3. Set environment variables (optional):
```bash
# For API mode
export OPENAI_API_KEY=your_api_key_here

# To set default mode
export WHISPER_MODE=local  # or 'api'
export WHISPER_MODEL=base  # options: tiny, base, small, medium, large
```

## Basic Usage

### Using the WhisperSTT Class Directly

```python
from ai_models.whisper_stt import WhisperSTT

# For local mode
stt = WhisperSTT(mode="local", model_name="base")
result = await stt.transcribe_audio("path/to/audio.wav")

# For API mode
stt = WhisperSTT(api_key="your_api_key", mode="api")
result = await stt.transcribe_audio("path/to/audio.wav")

# Access the transcription
if result.is_successful:
    print(f"Transcription: {result.text}")
    print(f"Duration: {result.duration} seconds")
    print(f"Metadata: {result.metadata}")
else:
    print(f"Error: {result.error_message}")
```

### Using the CognitiveAssessment Class

```python
from ai_models.cognitive_assessment import CognitiveAssessment

# Create an assessment object with local Whisper
assessment = CognitiveAssessment(
    whisper_mode="local",
    whisper_model="base"
)

# Process speech with the local model
result = await assessment.assess_from_speech("path/to/audio.wav")

# Create an assessment object with API Whisper
assessment_api = CognitiveAssessment(
    openai_api_key="your_api_key",
    whisper_mode="api"
)

# Process speech with the API
result_api = await assessment_api.assess_from_speech("path/to/audio.wav")
```

## Testing the Whisper Modes

We provide a testing script to compare both modes:

```bash
python ai_models/test_whisper_modes.py --audio test_files/sample_audio.wav --api-key your_api_key
```

If no API key is provided, only the local mode will be tested.

## Recording Test Audio

You can use our utility to record audio for testing:

```bash
python ai_models/audio_recorder.py --seconds 10 --output test_files/my_recording.wav
```

## Model Selection Guide

For local Whisper, there are several model sizes available:

| Model | Parameters | Required VRAM | Relative Speed | Accuracy |
|-------|------------|---------------|----------------|----------|
| tiny  | 39M        | ~1GB          | 32x            | Basic    |
| base  | 74M        | ~1GB          | 16x            | Good     |
| small | 244M       | ~2GB          | 6x             | Better   |
| medium| 769M       | ~5GB          | 2x             | Great    |
| large | 1550M      | ~10GB         | 1x             | Best     |

Choose based on your hardware capabilities and accuracy needs.

## Environment Configuration

You can configure the default behavior using environment variables:

```bash
# Set default mode
export WHISPER_MODE=local  # or 'api'

# Set default model for local mode
export WHISPER_MODEL=base  # tiny, base, small, medium, large

# Set API key for API mode
export OPENAI_API_KEY=your_api_key
```

## Troubleshooting

### Local Mode Issues

- **Error: "FFmpeg not found"** - Install FFmpeg and ensure it's in your PATH
- **CUDA out of memory** - Choose a smaller model or increase GPU memory
- **Slow transcription** - Use a smaller model or switch to API mode

### API Mode Issues

- **Authentication error** - Check your API key
- **Rate limit exceeded** - Wait and try again or reduce request frequency
- **Connection error** - Check your internet connection

## Performance Considerations

- Local mode performance depends heavily on your hardware
- For large audio files (>10MB), consider pre-processing (splitting, noise reduction)
- API mode has usage limits and costs based on OpenAI's pricing

## Security Notes

- When using API mode, audio is sent to OpenAI's servers
- Store API keys securely and never hardcode them
- Consider data privacy regulations when processing sensitive audio 