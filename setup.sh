#!/bin/bash
# Make script executable: chmod +x setup.sh
set -e

echo "Setting up Person CRUD gRPC Application..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
yarn install


# Generate TypeScript files from proto definitions
echo "Generating TypeScript code from proto files..."
yarn gen-proto

# Install backend dependencies
echo "Building Rust backend..."
cd backend
cargo build

# Return to the root directory
cd ..

echo "Setup complete! You can now run the application:"
echo "- Start backend: yarn start:backend"
echo "- Start frontend: yarn start:frontend"
echo "- Start envoy: docker-compose up"