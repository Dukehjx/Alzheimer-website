# FFmpeg Installation Guide

FFmpeg is required for the Whisper speech-to-text functionality. This guide explains how to install FFmpeg on different operating systems.

## Windows Installation

### Method 1: Using Chocolatey (Recommended)

1. Install Chocolatey (if not already installed):
   - Open PowerShell as Administrator
   - Run the following command:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. Install FFmpeg using Chocolatey:
   - Open PowerShell as Administrator
   - Run the following command:
   ```powershell
   choco install ffmpeg
   ```

### Method 2: Manual Installation

1. Download FFmpeg from the official website:
   - Go to [ffmpeg.org](https://ffmpeg.org/download.html)
   - Click on "Windows" under "Get packages & executable files"
   - Download the latest build (e.g., "ffmpeg-git-full.7z")

2. Extract the downloaded archive to a location on your computer (e.g., `C:\ffmpeg`)

3. Add FFmpeg to your PATH:
   - Open the Start menu and search for "Environment Variables"
   - Click on "Edit the system environment variables"
   - Click on the "Environment Variables" button
   - Under "System variables", find the "Path" variable, select it, and click "Edit"
   - Click "New" and add the path to the "bin" folder in your FFmpeg directory (e.g., `C:\ffmpeg\bin`)
   - Click "OK" on all dialogs to save the changes

4. Verify the installation:
   - Open a new Command Prompt or PowerShell window
   - Run `ffmpeg -version`

## macOS Installation

### Using Homebrew

1. Install Homebrew (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install FFmpeg:
   ```bash
   brew install ffmpeg
   ```

3. Verify the installation:
   ```bash
   ffmpeg -version
   ```

## Linux Installation

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install ffmpeg
ffmpeg -version
```

### CentOS/RHEL

```bash
sudo yum install epel-release
sudo yum update
sudo yum install ffmpeg ffmpeg-devel
ffmpeg -version
```

### Fedora

```bash
sudo dnf install ffmpeg
ffmpeg -version
```

## Verifying FFmpeg Installation

After installing FFmpeg, run the following command to ensure it's properly installed:

```bash
ffmpeg -version
```

You should see output with the FFmpeg version information, which indicates a successful installation.

## Troubleshooting

### FFmpeg is installed but not found

If you've installed FFmpeg but it's not recognized in your terminal, try the following:

1. Restart your terminal/command prompt
2. Restart your computer
3. Check that the FFmpeg binaries are in your system PATH:
   - On Windows, verify the PATH environment variable includes the FFmpeg bin directory
   - On macOS/Linux, run `echo $PATH` to check if the FFmpeg directory is included

### Installation fails

- If installation fails on Windows, try the manual installation method
- If installation fails on macOS, try updating Homebrew: `brew update`
- If installation fails on Linux, ensure your package repositories are up to date

## Using FFmpeg with Python

In Python, you can check if FFmpeg is installed and available with:

```python
import subprocess
import shutil

def is_ffmpeg_available():
    return shutil.which("ffmpeg") is not None

# Check if FFmpeg is available
if not is_ffmpeg_available():
    print("FFmpeg not found. Please install FFmpeg.")
else:
    print("FFmpeg is installed and available.")
```

This code can be used in your application to verify FFmpeg availability before attempting to use Whisper for transcription. 