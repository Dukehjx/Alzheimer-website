#!/usr/bin/env python
"""
Setup script for the Alzheimer's Early Detection Platform.

This script:
1. Installs backend Python dependencies
2. Installs spaCy language models
3. Installs frontend Node.js dependencies (if Node.js is available)
4. Builds the frontend and copies it to the backend static directory (if Node.js is available)
5. Ensures other required dependencies like FFmpeg are installed

Usage:
    python setup.py [--skip-frontend] [--skip-backend] [--dev]

Options:
    --skip-frontend: Skip frontend setup and build
    --skip-backend: Skip backend dependencies installation
    --dev: Install development dependencies
"""

import os
import sys
import subprocess
import argparse
import platform
import shutil
from pathlib import Path


def print_header(message):
    """Print a formatted header message."""
    print("\n" + "=" * 80)
    print(f" {message}")
    print("=" * 80)


def run_command(command, cwd=None):
    """Run a shell command and print its output."""
    print(f"Running: {' '.join(command)}")
    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            check=True,
            text=True,
            capture_output=True
        )
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        if e.stdout:
            print(e.stdout)
        if e.stderr:
            print(e.stderr)
        return False


def check_dependency(name, command):
    """Check if a command-line dependency is installed."""
    print(f"Checking for {name}...")
    try:
        subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print(f"✅ {name} is installed")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"❌ {name} is not installed or not in PATH")
        return False


def setup_backend(dev=False):
    """Install backend Python dependencies."""
    print_header("Setting up backend")
    
    # Check for Python
    if not check_dependency("Python 3.8+", [sys.executable, "--version"]):
        return False
    
    # Install Python dependencies
    print("Installing Python dependencies...")
    
    requirements_file = "requirements.txt"
    if dev:
        requirements_file = "requirements-dev.txt"
        # Check if dev requirements exist, if not use regular requirements
        if not os.path.exists(requirements_file):
            print(f"Dev requirements file not found, using {requirements_file}")
            requirements_file = "requirements.txt"
    
    if not run_command([sys.executable, "-m", "pip", "install", "-r", requirements_file]):
        print("Failed to install Python dependencies")
        return False
    
    # Check for and install spaCy language models
    print("Installing spaCy language models...")
    if not run_command([sys.executable, "-m", "spacy", "download", "en_core_web_md"]):
        print("Failed to install spaCy language models")
        print("Trying to install spaCy first...")
        if run_command([sys.executable, "-m", "pip", "install", "spacy"]):
            if not run_command([sys.executable, "-m", "spacy", "download", "en_core_web_md"]):
                print("Failed to install spaCy language models even after installing spaCy")
                return False
        else:
            print("Failed to install spaCy")
            return False
    
    # Check for FFmpeg
    if not check_dependency("FFmpeg", ["ffmpeg", "-version"]):
        print("\nFFmpeg is required for audio processing. Please install it and add it to your PATH.")
        print("For Windows: Download from https://ffmpeg.org/download.html and add to PATH")
        print("For macOS: Use Homebrew with 'brew install ffmpeg'")
        print("For Linux: Use your package manager, e.g., 'apt install ffmpeg'")
        return False
    
    print("✅ Backend setup completed successfully")
    return True


def setup_frontend():
    """Install frontend dependencies and build the app."""
    print_header("Setting up frontend")
    
    # Check for Node.js
    if not check_dependency("Node.js", ["node", "--version"]):
        print("\nNode.js is required for frontend setup. Please install it and add it to your PATH.")
        print("Download from https://nodejs.org/")
        return False
    
    # Check for npm
    if not check_dependency("npm", ["npm", "--version"]):
        print("\nnpm is required for frontend setup. It usually comes with Node.js.")
        print("If you have Node.js installed but not npm, try reinstalling Node.js.")
        return False
    
    # Install frontend dependencies
    print("Installing frontend dependencies...")
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    if not run_command(["npm", "install"], cwd=frontend_dir):
        print("Failed to install frontend dependencies")
        return False
    
    # Build frontend
    print("Building frontend...")
    if not run_command(["npm", "run", "build"], cwd=frontend_dir):
        print("Failed to build frontend")
        return False
    
    # Create static directory in backend if it doesn't exist
    backend_static_dir = os.path.join(os.getcwd(), "backend", "static")
    os.makedirs(backend_static_dir, exist_ok=True)
    
    # Copy built frontend to backend static directory
    print("Copying frontend build to backend static directory...")
    frontend_build_dir = os.path.join(frontend_dir, "build")
    
    # Check if build directory exists
    if not os.path.exists(frontend_build_dir):
        print(f"Frontend build directory not found at {frontend_build_dir}")
        return False
    
    # Copy files
    try:
        for item in os.listdir(frontend_build_dir):
            source = os.path.join(frontend_build_dir, item)
            destination = os.path.join(backend_static_dir, item)
            
            if os.path.isdir(source):
                if os.path.exists(destination):
                    shutil.rmtree(destination)
                shutil.copytree(source, destination)
            else:
                shutil.copy2(source, destination)
        
        print("✅ Frontend files copied successfully")
    except Exception as e:
        print(f"Error copying frontend files: {e}")
        return False
    
    print("✅ Frontend setup completed successfully")
    return True


def main():
    """Main function to set up the project."""
    parser = argparse.ArgumentParser(description="Setup script for the Alzheimer's Early Detection Platform")
    parser.add_argument("--skip-frontend", action="store_true", help="Skip frontend setup and build")
    parser.add_argument("--skip-backend", action="store_true", help="Skip backend dependencies installation")
    parser.add_argument("--dev", action="store_true", help="Install development dependencies")
    args = parser.parse_args()
    
    print_header("Setting up Alzheimer's Early Detection Platform")
    
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    if not args.skip_backend:
        backend_success = setup_backend(args.dev)
        if not backend_success:
            print("\n⚠️ Backend setup had issues. The system may not function correctly.")
    else:
        print("Skipping backend setup as requested")
    
    if not args.skip_frontend:
        frontend_success = setup_frontend()
        if not frontend_success:
            print("\n⚠️ Frontend setup had issues. The system may not function correctly.")
    else:
        print("Skipping frontend setup as requested")
    
    print_header("Setup Completed")
    print("\nTo run the application:")
    print("1. Start the backend server:")
    print("   cd backend")
    print("   python main.py")
    print("\n2. In a separate terminal, start the frontend development server (optional):")
    print("   cd frontend")
    print("   npm start")
    print("\nThe application should be available at:")
    print("- Backend API: http://localhost:8000")
    print("- Frontend (if using npm start): http://localhost:3000")
    print("- Frontend (via backend): http://localhost:8000")
    

if __name__ == "__main__":
    main() 