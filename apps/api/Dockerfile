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
# CGO_ENABLED=0 disables dynamic dependencies (important for alpine/scratch)
# GOOS=linux ensures the binary targets Linux kernels
# RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o listah-api .
# RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o listah-api .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o listah-api .


# Stage 2: Final minimal production image (e.g., from scratch)
# The 'scratch' image is the smallest possible base, so we must copy the certificates manually
# FROM scratch AS final
FROM alpine:3.20
# Add a non-root user for enhanced Kubernetes security
RUN adduser -D -u 10001 appuser
USER appuser

WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/listah-api .
COPY --from=builder /app/public .

# Set the entry point to run the application
# CMD ["./listah-api"]
ENTRYPOINT ["./listah-api"]
