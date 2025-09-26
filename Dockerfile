FROM node:20-alpine3.20 AS base

WORKDIR /app

# Build-time args for Next.js
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Promote args to env (needed for both build + runtime)
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js at image build time
RUN npm run build

EXPOSE 3000

# Run Next.js server
CMD ["npm", "start"]
