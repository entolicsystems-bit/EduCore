#!/bin/bash
set -ex  # Exit on error and print commands for debugging

echo "Running AfterInstall..."

# Go to backend folder
cd /home/ec2-user/EduCore/backend || { echo "Backend folder not found"; exit 1; }

# Install Node dependencies (uses existing package.json/package-lock.json)
npm install

echo "AfterInstall completed successfully"
