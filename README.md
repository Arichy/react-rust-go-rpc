# Person CRUD gRPC Application

This is a full-stack application with a React TypeScript frontend using Vite and a Rust backend, communicating via gRPC.

## Project Structure

- `/frontend`: React TypeScript frontend built with Vite
- `/backend`: Rust backend with gRPC
- `/proto`: Protocol buffer definitions shared between frontend and backend

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [pnpm](https://pnpm.io/) 
- [Rust and Cargo](https://www.rust-lang.org/tools/install)
- [Protobuf Compiler](https://grpc.io/docs/protoc-installation/) (protoc)

## Setup Instructions

### Initial Setup

1. Clone the repository
2. Install dependencies:

```bash
# Install root and frontend dependencies
pnpm install:all

# Install Rust backend dependencies
cd backend
cargo build
```

### Generate Protocol Buffers

```bash
# Generate TypeScript code from proto files
pnpm generate-proto
```

### Run the Application

1. Start the backend:

```bash
pnpm start:backend
```

2. Start the frontend in a new terminal:

```bash
pnpm start:frontend
```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Features

- Create, Read, Update, Delete operations for people
- Type-safe communication between frontend and backend using gRPC
- Real-time data updates

## Technologies Used

- **Frontend**:
  - React with TypeScript
  - Vite for fast development
  - gRPC-Web for communication

- **Backend**:
  - Rust
  - Tonic for gRPC implementation
  - In-memory storage (can be extended to use a database)

- **Shared**:
  - Protocol Buffers for type definitions
  - gRPC for API communication