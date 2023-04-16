#!/bin/bash
set -e

# NPM install
export PATH="/app/lib/nodejs/bin:$PATH"

# Build the app with --no-sandbox flag
echo "Packaging app..."
electron-packager ./icloud-for-linux --platform=linux --arch=x64 --out=release-build --overwrite --electron-version=24.1.2 --executableName=icloud-for-linux --no-sandbox

# Copy the rest of the application files
echo "Copying build files..."
mkdir -p /app/icloud-for-linux
cp -r release-build/icloud-for-linux-linux-x64/* /app/icloud-for-linux

echo "Removing chrome-sandbox..."
rm /app/icloud-for-linux/chrome-sandbox
