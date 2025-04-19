FROM rust:latest as builder

WORKDIR /usr/src/app
COPY ./backend ./backend
COPY ./proto ./proto

WORKDIR /usr/src/app/backend

RUN apt-get update && apt-get install -y protobuf-compiler
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/backend/target/release/person-crud-backend /usr/local/bin/person-crud-backend

EXPOSE 50051

CMD ["person-crud-backend"]