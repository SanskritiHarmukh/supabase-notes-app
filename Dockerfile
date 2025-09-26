FROM node:20-alpine3.20

WORKDIR /app

# Accept build arguments for Supabase env vars
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set them as environment variables for the build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# Build the Next.js app at image build time
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
