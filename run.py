#!/usr/bin/env python
"""
Run script for the Alzheimer's Early Detection Platform.

This script starts the backend server which serves both the API and frontend.
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path

def main():
    """Start the backend server."""
    parser = argparse.ArgumentParser(description="Run the Alzheimer's Early Detection Platform")
    parser.add_argument("--host", default="0.0.0.0", help="Host to run the server on")
    parser.add_argument("--port", type=int, default=8000, help="Port to run the server on")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for development")
    args = parser.parse_args()
    
    # Ensure we're in the project root directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    # Check if the backend static directory exists
    static_dir = project_root / "backend" / "static"
    if not os.path.exists(static_dir):
        print("Warning: Static directory not found. The frontend may not be available.")
        print("Run 'python setup.py' to set up the application properly.")
    
    # Check if index.html exists in the static directory
    index_path = static_dir / "index.html"
    if not os.path.exists(index_path):
        print("Warning: Frontend files not found. The web interface may not be available.")
        print("Run 'python setup.py' to build and deploy the frontend.")
    
    # Start the backend server
    print(f"Starting server on http://{args.host}:{args.port}")
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.main:app",
        "--host", args.host,
        "--port", str(args.port)
    ]
    
    if args.reload:
        cmd.append("--reload")
    
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\nServer stopped")

if __name__ == "__main__":
    main() 