# Use Bun runtime
FROM oven/bun:1 AS base
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port
EXPOSE 5001

# Set environment
ENV NODE_ENV=production
ENV PORT=5001

# Start the server directly with Bun (no build step needed - Bun runs TS natively)
CMD ["bun", "run", "src/index.ts"]
