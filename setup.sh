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
cd ..

# Install rust dependencies
echo "Building Rust backend..."
cd rust-grpc-backend
cargo build
cd ..

# Install Go tools for building and generating connect code (installed globally)
echo "Installing Go tools..."
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
go install github.com/bufbuild/buf/cmd/buf@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest

# Build proto files for Go
cd go-connect-backend
buf generate
cd ..

echo "Setup complete! You can now run the application:"
echo "- Start envoy: docker-compose up"
echo "- Start frontend: yarn start:frontend"
echo "- Start Rust server: yarn start:rust"
echo "- Start Go server: yarn start:go"
