FROM golang:latest AS builder

WORKDIR /app

COPY ./go-connect-backend/go.mod ./go-connect-backend/go.sum ./go-connect-backend/
WORKDIR /app/go-connect-backend
RUN go mod download
RUN go install github.com/bufbuild/buf/cmd/buf@latest && \
  go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
  go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest

WORKDIR /app
COPY ./go-connect-backend ./go-connect-backend
COPY ./proto ./proto

WORKDIR /app/go-connect-backend
RUN buf generate
RUN CGO_ENABLED=0 GOOS=linux go build -o app

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/go-connect-backend/app .

EXPOSE 8081

CMD ["./app"]