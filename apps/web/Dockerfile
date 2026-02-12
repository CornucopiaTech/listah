# Build stage
FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci


# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
# CMD ["npm", "run", "dev"]


COPY . .
RUN npm run build

# Runtime stage
FROM nginx:stable-alpine AS production


# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config template
COPY ./public/config.template.json /usr/share/nginx/html/config.template.json

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
