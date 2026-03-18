# ── Storefront Dockerfile ──
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

# Copy storefront package
COPY apps/storefront/package.json ./apps/storefront/

RUN npm ci --legacy-peer-deps

# ── Builder ──────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# Workspace packages may not have their own node_modules (deps are hoisted)
# Create empty dirs to ensure COPY does not fail, then overlay if they exist
RUN mkdir -p packages/shared-types/node_modules packages/config/node_modules apps/storefront/node_modules
COPY --from=deps /app/apps/storefront/node_modules ./apps/storefront/node_modules

# Copy source
COPY packages/shared-types ./packages/shared-types
COPY packages/config ./packages/config
COPY apps/storefront ./apps/storefront

WORKDIR /app/apps/storefront
RUN npm run build

# ── Runner ───────────────────────────────────────────────
FROM base AS runner
WORKDIR /app/apps/storefront

ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/storefront/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/static ./.next/static

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]
