# Dual-Mode Whisper Implementation

This project implements a dual-mode approach to speech-to-text processing using OpenAI's Whisper, allowing users to choose between local processing and API-based transcription.

## Overview

The dual-mode implementation provides two options for speech-to-text processing:

1. **Local Mode**: Uses the local Whisper model running on your machine
   - Advantages: Privacy, no API costs, works offline
   - Limitations: Depends on local hardware, potentially slower

2. **API Mode**: Uses OpenAI's Whisper API
   - Advantages: Potentially higher accuracy, faster processing
   - Limitations: Requires internet, API key, and has usage costs

## Implementation Details

The dual-mode functionality is implemented in several key components:

### 1. WhisperSTT Class

The `WhisperSTT` class in `ai_models/whisper_stt.py` is the core component that handles both modes:

```python
from ai_models.whisper_stt import WhisperSTT

# Local mode
local_stt = WhisperSTT(mode="local", model_name="base")
result = await local_stt.transcribe_audio("audio.wav")

# API mode
api_stt = WhisperSTT(api_key="your_api_key", mode="api")
result = await api_stt.transcribe_audio("audio.wav")
```

### 2. CognitiveAssessment Class

The `CognitiveAssessment` class in `ai_models/cognitive_assessment.py` integrates the dual-mode functionality:

```python
from ai_models.cognitive_assessment import CognitiveAssessment

# Local mode assessment
assessment = CognitiveAssessment(whisper_mode="local", whisper_model="base")
result = await assessment.assess_from_speech("audio.wav")

# API mode assessment
assessment = CognitiveAssessment(
    openai_api_key="your_api_key",
    whisper_mode="api"
)
result = await assessment.assess_from_speech("audio.wav")
```

### 3. Configuration

The system uses environment variables to configure the default mode:

```
WHISPER_MODE=local  # or "api"
WHISPER_MODEL=base  # options: tiny, base, small, medium, large
OPENAI_API_KEY=your_api_key  # required for API mode
```

## Testing Tools

Several tools are provided to test and demonstrate the dual-mode functionality:

1. **Whisper Helper**: A utility script to check dependencies and test transcription
   ```
   python ai_models/whisper_helper.py --audio test_files/sample_audio.wav --model tiny
   ```

2. **Test Whisper Modes**: A script to compare both modes
   ```
   python ai_models/test_whisper_modes.py --audio test_files/sample_audio.wav --api-key your_api_key
   ```

3. **Audio Recorder**: A utility to record test audio
   ```
   python ai_models/audio_recorder.py --seconds 10 --output test_files/recording.wav
   ```

## Installation Requirements

To use the dual-mode functionality, you need:

1. For local mode:
   - Python 3.8+
   - OpenAI Whisper package (`openai-whisper`)
   - FFmpeg installed on your system
   - PyTorch

2. For API mode:
   - OpenAI API key with access to the Whisper API
   - Internet connection

Install the required packages:
```
pip install -r ai_models/requirements.txt
```

## Troubleshooting

Common issues and solutions:

1. **FFmpeg not found**: Install FFmpeg following the instructions in `FFmpeg_Installation_Guide.md`

2. **API authentication errors**: Check your API key and ensure it has access to the Whisper API

3. **Out of memory errors**: Use a smaller Whisper model (tiny or base) for local processing

4. **Slow transcription**: Consider using API mode for faster processing or a smaller local model

## Performance Considerations

- Local mode performance depends heavily on your hardware (CPU/GPU)
- For large audio files, consider pre-processing or splitting into smaller segments
- API mode has usage limits and costs based on OpenAI's pricing structure

## Security and Privacy

- When using API mode, audio is sent to OpenAI's servers
- Store API keys securely and never hardcode them
- Consider data privacy regulations when processing sensitive audio

## Future Enhancements

Planned improvements to the dual-mode implementation:

1. Automatic fallback between modes if one fails
2. Caching of transcription results for efficiency
3. Batch processing capabilities for multiple audio files
4. Enhanced audio preprocessing for better transcription quality