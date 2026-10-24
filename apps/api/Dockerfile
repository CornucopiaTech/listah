# Stage 1: Builder stage to compile the Go application
FROM golang:1.26-alpine AS builder

WORKDIR /app

RUN apk update && apk add git

# Copy go.mod and go.sum files and download dependencies
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Copy the rest of the application source code and build the binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o listah-api .


# Stage 2: Final minimal production image (e.g., from scratch)
FROM alpine:3.20
# Add a non-root user for enhanced Kubernetes security
RUN adduser -D -u 10001 appuser
USER appuser


# Copy the compiled binary from the builder stage
COPY --from=builder /app/listah-api /listah-api
COPY --from=builder /app/public /public

# Set the entry point to run the application
CMD ["/listah-api"]
