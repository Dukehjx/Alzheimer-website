# Alzheimer's Early Detection Tool - Usage Instructions

This document provides instructions for using the Alzheimer's Early Detection Tool, which records speech, transcribes it using Whisper, and analyzes it for potential cognitive markers.

## Prerequisites

Before using the tool, ensure you have:

1. Python 3.8+ installed
2. FFmpeg installed and available in your PATH
3. All required Python packages installed

To verify and install all dependencies, run:

```bash
python ensure_dependencies.py
```

## Basic Usage

To use the tool in its simplest form:

```bash
python run_analysis.py --record
```

This will:
1. Record 15 seconds of audio (default duration)
2. Transcribe it using the local Whisper model
3. Analyze the transcription for cognitive markers
4. Display comprehensive results

## Command Line Options

The tool supports various command line options:

| Option | Description |
|--------|-------------|
| `--record` or `-r` | Record a new audio sample |
| `--audio PATH` or `-a PATH` | Use an existing audio file instead of recording |
| `--seconds N` or `-s N` | Set recording duration (in seconds, default: 15) |
| `--whisper-mode MODE` or `-wm MODE` | Set Whisper mode ('local' or 'api') |
| `--whisper-model MODEL` or `-wmod MODEL` | Set Whisper model ('tiny', 'base', 'small', etc.) |
| `--language LANG` or `-l LANG` | Set language code (e.g., 'en' for English) |
| `--output DIR` or `-o DIR` | Set output directory for recordings |

## Examples

1. Record a 10-second audio sample using the tiny Whisper model:
   ```bash
   python run_analysis.py --record --seconds 10 --whisper-model tiny
   ```

2. Analyze an existing audio file:
   ```bash
   python run_analysis.py --audio path/to/audio.wav
   ```

3. Set a specific language for better transcription:
   ```bash
   python run_analysis.py --record --language en
   ```

4. Use API mode (requires an OpenAI API key):
   ```bash
   python run_analysis.py --record --whisper-mode api
   ```

## Understanding the Results

The tool provides comprehensive results with several sections:

1. **Transcription**: The text transcribed from your speech.

2. **Risk Assessment**: 
   - Overall risk score (0-1) and risk level (low, moderate, high)
   - Breakdown by different categories of language features
   - Higher risk scores indicate potential cognitive concerns

3. **Linguistic Features**:
   - Vocabulary size and diversity metrics
   - Sentence structure complexity
   - Various other language patterns

4. **Recommendations**: Personalized suggestions based on the analysis.

5. **Explanation**: A plain-language explanation of the results.

## Important Notes

- This tool is for educational and research purposes only. It is not a medical diagnostic tool.
- The risk assessment is based on linguistic patterns and should not replace professional medical advice.
- Local Whisper models provide varying accuracy based on their size. Larger models (base, small, medium, large) provide better accuracy but require more computational resources.
- The tiny model is fastest but may have lower transcription accuracy.

## Troubleshooting

- If you encounter issues with FFmpeg, ensure it's properly installed and in your PATH. See `FFmpeg_Installation_Guide.md` for instructions.
- If the speech transcription quality is poor, try:
  - Speaking more clearly
  - Reducing background noise
  - Using a larger Whisper model (e.g., `--whisper-model base` instead of `tiny`)
  - Using the API mode if you have an OpenAI API key

## Privacy Considerations

- When using local mode, all processing happens on your machine, and no data is sent to external servers.
- When using API mode, audio is sent to OpenAI's servers for transcription.

For more detailed information about the dual-mode Whisper implementation, see `WHISPER_USAGE_GUIDE.md`. 