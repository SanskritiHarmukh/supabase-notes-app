FROM node:18-alpine3.19

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port 3000 
EXPOSE 3000

# Start the application (build happens at runtime)
CMD ["npm", "run", "start:prod"]
