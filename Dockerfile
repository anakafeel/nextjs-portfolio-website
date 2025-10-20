# ---------- 1. Builder Stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy all source code
COPY . .

# Build the Next.js production bundle
RUN npm run build


# ---------- 2. Runner Stage ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Copy only necessary build artifacts and node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the same port your app listens on
EXPOSE 3000

# Healthcheck (optional but useful for Portainer & Watchtower)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://localhost:3000 || exit 1

# Start the server
CMD ["npm", "start"]
