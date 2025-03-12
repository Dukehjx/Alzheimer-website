#!/bin/bash

# Print Python version
python --version

# Install Python dependencies
pip install -r backend/requirements.txt

# Create __init__.py files in case they're missing
mkdir -p backend/app
touch backend/app/__init__.py
mkdir -p backend/app/api
touch backend/app/api/__init__.py
mkdir -p backend/app/models
touch backend/app/models/__init__.py
mkdir -p backend/app/services
touch backend/app/services/__init__.py
mkdir -p backend/app/utils
touch backend/app/utils/__init__.py

# Check file structure
echo "Checking file structure:"
find backend -type f -name "*.py" | sort

echo "Build completed successfully" 