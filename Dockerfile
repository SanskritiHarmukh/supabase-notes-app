FROM node:18-alpine3.19

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app (build happens at runtime, reads .env via Docker Compose)
CMD ["npm", "run", "start:prod"]
