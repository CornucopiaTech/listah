# Stage 1: Builder stage to compile the Go application
FROM --platform=$BUILDPLATFORM golang:1.26-alpine AS builder

WORKDIR /app

RUN apk update && apk add git

# Copy go.mod and go.sum files and download dependencies
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Docker Buildx automatically populates these variables
ARG TARGETOS
ARG TARGETARCH

# Copy the rest of the application source code and build the binary
COPY . .
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -ldflags="-w -s" -o listah-api .

# Add a non-root user for enhanced Kubernetes security
RUN adduser -D -u 10001 appuser
USER appuser


# Generate passwd and group files cleanly for the non-root user
RUN echo "appuser:x:10001:10001:App User:/home/appuser:/sbin/nologin" > /tmp/passwd && \
    echo "appuser:x:10001:" > /tmp/group


# Stage 2: Final minimal production image (e.g., from scratch)
FROM alpine:3.20
# # Add a non-root user for enhanced Kubernetes security
# RUN adduser -D -u 10001 appuser
# USER appuser

# Copy the non-root user details created in the native builder stage
COPY --from=builder /tmp/passwd /etc/passwd
COPY --from=builder /tmp/group /etc/group

# Copy the compiled binary from the builder stage
COPY --from=builder /app/listah-api /listah-api
COPY --from=builder /app/public /public

# Set the entry point to run the application
CMD ["/listah-api"]
