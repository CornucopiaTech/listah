# Stage 1: Builder stage to compile the Go application
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install ca-certificates and git (if needed for go get) in the builder stage
RUN apk update && apk add --no-cache ca-certificates git

# Copy your CA certificate file into the system's trust store
COPY db_ca.crt /usr/local/share/ca-certificates/
# Update the CA certificates in the builder environment
RUN update-ca-certificates

# Copy go.mod and go.sum files and download dependencies
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Copy the rest of the application source code and build the binary
COPY . .
RUN go build -o listah-api .

# Stage 2: Final minimal production image (e.g., from scratch)
# The 'scratch' image is the smallest possible base, so we must copy the certificates manually
FROM scratch AS final

# Import necessary certificates from the builder stage
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

# Copy the compiled binary from the builder stage
COPY --from=builder /app/listah-api /listah-api

# Set the entry point to run the application
CMD ["/listah-api"]
