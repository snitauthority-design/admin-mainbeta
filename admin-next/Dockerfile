# ── Admin Dashboard (admin-next) Dockerfile ──
# Build context is the repository root so that the shared packages
# are available during the build.

FROM node:20-alpine AS base

# ── Dependencies ─────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy root workspace config
COPY package.json package-lock.json* ./

# Copy shared packages
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/config/package.json ./packages/config/

# Copy admin-next package
COPY admin-next/package.json ./admin-next/

RUN npm ci --legacy-peer-deps

# ── Builder ──────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# Workspace packages may not have their own node_modules (deps are hoisted)
# Create empty dirs to ensure COPY does not fail, then overlay if they exist
RUN mkdir -p packages/shared-types/node_modules packages/config/node_modules admin-next/node_modules
COPY --from=deps /app/admin-next/node_modules ./admin-next/node_modules

# Copy source
COPY packages/shared-types ./packages/shared-types
COPY packages/config ./packages/config
COPY admin-next ./admin-next

WORKDIR /app/admin-next
RUN npm run build

# ── Runner ───────────────────────────────────────────────
FROM base AS runner
WORKDIR /app/admin-next

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/admin-next/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/admin-next/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/admin-next/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
