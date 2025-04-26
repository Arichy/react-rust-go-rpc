FROM rust:latest AS builder

RUN apt-get update && apt-get install -y protobuf-compiler

WORKDIR /app

# Cache the build dependencies
COPY ./rust-grpc-backend/Cargo.toml ./rust-grpc-backend/Cargo.toml
COPY ./rust-grpc-backend/Cargo.lock ./rust-grpc-backend/Cargo.lock
WORKDIR /app/rust-grpc-backend
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release

WORKDIR /app
COPY ./rust-grpc-backend ./rust-grpc-backend
COPY ./proto ./proto

WORKDIR /app/rust-grpc-backend
ENV SQLX_OFFLINE=true
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/rust-grpc-backend/target/release/person-crud-rust-grpc-backend .

RUN ls /

EXPOSE 50051

CMD ["./person-crud-rust-grpc-backend"]