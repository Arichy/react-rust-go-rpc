# Person CRUD gRPC Application

This is a full-stack application with a React TypeScript frontend using Vite, a Rust gRPC backend, and a Go connect backend.

![alt text](imgs/preview.png)

## Project Structure

- `/frontend`: React TypeScript frontend built with Vite
- `/rust-grpc-backend`: Rust backend with gRPC
- `/go-connect-backend`: Go backend with connect
- `/proto`: Protocol buffer definitions shared between frontend and backend

## Architecture

![alt text](imgs/architecture.png)

## Prerequisites

- Docker


```bash
# production
docker-compose up

# development
docker-compose -f docker-compose.dev.yml up
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Features

- Create, Read, Update, Delete operations for people
- Type-safe communication between frontend and backend using gRPC/connect
- Real-time data updates

## Technologies Used

- **Frontend**:

  - React with TypeScript
  - Vite for fast development
  - Buf for compiling protocol buffers
  - Connect for communication

- **Rust gRPC Backend**:

  - Rust
  - Tonic for gRPC implementation
  - In-memory storage (can be extended to use a database)

- **Go Connect Backend**:

  - Go
  - Buf for compiling protocol buffers
  - Connect for gRPC implementation
  - In-memory storage (can be extended to use a database)

- **Shared**:
  - Protocol Buffers for type definitions
