"""
Audio Recording Utility.

A simple utility for recording audio from a microphone to test speech-to-text functionality.
"""

import os
import sys
import wave
import time
import logging
import argparse
import tempfile
from pathlib import Path
import pyaudio
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Default settings
DEFAULT_CHUNK = 1024
DEFAULT_FORMAT = pyaudio.paInt16
DEFAULT_CHANNELS = 1
DEFAULT_RATE = 16000
DEFAULT_RECORD_SECONDS = 5
DEFAULT_OUTPUT_DIR = Path(tempfile.gettempdir()) / "alzheimer_recordings"


def record_audio(
    output_path: str = None,
    seconds: int = DEFAULT_RECORD_SECONDS,
    sample_rate: int = DEFAULT_RATE,
    chunk: int = DEFAULT_CHUNK,
    format_type: int = DEFAULT_FORMAT,
    channels: int = DEFAULT_CHANNELS
) -> str:
    """
    Record audio from the microphone and save to a WAV file.
    
    Args:
        output_path: Path to save the audio file. If None, a temporary file is created.
        seconds: Number of seconds to record.
        sample_rate: Sample rate for recording.
        chunk: Recording chunk size.
        format_type: PyAudio format type.
        channels: Number of audio channels.
        
    Returns:
        str: Path to the recorded audio file.
    """
    if output_path is None:
        # Create output directory if it doesn't exist
        os.makedirs(DEFAULT_OUTPUT_DIR, exist_ok=True)
        
        # Generate a timestamped filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = str(DEFAULT_OUTPUT_DIR / f"recording_{timestamp}.wav")
    
    logger.info(f"Recording {seconds} seconds of audio to {output_path}...")
    
    # Initialize PyAudio
    p = pyaudio.PyAudio()
    
    try:
        # Open stream
        stream = p.open(
            format=format_type,
            channels=channels,
            rate=sample_rate,
            input=True,
            frames_per_buffer=chunk
        )
        
        # Start recording
        logger.info("Recording started...")
        frames = []
        
        for i in range(0, int(sample_rate / chunk * seconds)):
            data = stream.read(chunk)
            frames.append(data)
            
            # Display progress
            if i % 10 == 0:
                sys.stdout.write(f"\rRecording: {i * chunk / sample_rate:.1f}s / {seconds}s")
                sys.stdout.flush()
        
        print("\nRecording complete.")
        
        # Stop and close the stream
        stream.stop_stream()
        stream.close()
        
        # Save the recorded data as a WAV file
        wf = wave.open(output_path, 'wb')
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(format_type))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))
        wf.close()
        
        logger.info(f"Audio saved to {output_path}")
        return output_path
    
    finally:
        # Terminate PyAudio
        p.terminate()


def main():
    """Run the audio recorder as a standalone script."""
    parser = argparse.ArgumentParser(description="Record audio from microphone")
    parser.add_argument("--output", "-o", help="Output file path")
    parser.add_argument("--seconds", "-s", type=int, default=DEFAULT_RECORD_SECONDS,
                        help=f"Recording duration in seconds (default: {DEFAULT_RECORD_SECONDS})")
    parser.add_argument("--rate", "-r", type=int, default=DEFAULT_RATE,
                        help=f"Sample rate (default: {DEFAULT_RATE})")
    
    args = parser.parse_args()
    
    try:
        output_path = record_audio(
            output_path=args.output,
            seconds=args.seconds,
            sample_rate=args.rate
        )
        print(f"Recording saved to: {output_path}")
    except KeyboardInterrupt:
        print("\nRecording canceled by user")
    except Exception as e:
        logger.exception(f"Error during recording: {e}")


if __name__ == "__main__":
    main() 