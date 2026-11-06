# Build stage
FROM --platform=$BUILDPLATFORM node:25 AS build
WORKDIR /app

# Docker Buildx automatically populates these variables
ARG TARGETOS
ARG TARGETARCH

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM --platform=${TARGETPLATFORM} nginx:stable-alpine AS production


# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config template
COPY ./public/config.template.json /usr/share/nginx/html/config.template.json

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Install ONLY production dependencies.
# # If you have native C++ bindings, add --build-from-source flag
# RUN npm ci --omit=dev

EXPOSE 80

# Copy entrypoint
COPY --chown=10001:10001 --chmod=0755 entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# CMD ["bash", "/entrypoint.sh"]
