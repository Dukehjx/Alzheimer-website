#!/usr/bin/env python
"""
Script to build the React app and copy it to the backend/static directory
for the FastAPI server to serve.
"""

import os
import shutil
import subprocess
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and print output."""
    print(f"Running: {command}")
    result = subprocess.run(
        command, 
        shell=True, 
        check=True, 
        cwd=cwd,
        capture_output=True,
        text=True
    )
    print(result.stdout)
    return result

def main():
    # Get the project root directory
    project_root = Path(__file__).parent
    frontend_dir = project_root / "frontend"
    
    # Check if frontend directory exists
    if not os.path.exists(frontend_dir):
        print(f"Error: Frontend directory not found at {frontend_dir}")
        return
    
    # Install dependencies if node_modules doesn't exist
    if not os.path.exists(frontend_dir / "node_modules"):
        print("Installing frontend dependencies...")
        run_command("npm install", cwd=frontend_dir)
    
    # Build the React app
    print("Building React app...")
    run_command("npm run build", cwd=frontend_dir)
    
    # Define the source and destination directories
    build_dir = frontend_dir / "build"
    static_dir = project_root / "backend" / "static"
    
    # Ensure the destination directory exists
    os.makedirs(static_dir, exist_ok=True)
    
    # Clear the static directory
    print(f"Clearing {static_dir}...")
    for item in os.listdir(static_dir):
        item_path = os.path.join(static_dir, item)
        if os.path.isfile(item_path):
            os.remove(item_path)
        elif os.path.isdir(item_path):
            shutil.rmtree(item_path)
    
    # Copy all files from build directory to static directory
    print(f"Copying files from {build_dir} to {static_dir}...")
    for item in os.listdir(build_dir):
        src = os.path.join(build_dir, item)
        dst = os.path.join(static_dir, item)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
    
    print("Setup complete! You can now run the server with: python simple_server.py")

if __name__ == "__main__":
    main() 