# Stage 1: build
FROM node:18-alpine3.19 AS builder
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: production runtime
FROM node:18-alpine3.19
WORKDIR /app

# Copy built assets and node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/src ./src

# Expose port
EXPOSE 3000

# Start app (Next.js binds to 0.0.0.0)
CMD ["npm", "start"]
