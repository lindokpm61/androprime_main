# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# ── Stage 1: install all deps ──────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build ─────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars must be baked in at build time.
# Coolify passes environment variables as Docker build secrets when
# "Use Docker Build Secrets" is enabled — read them via /run/secrets/.
RUN --mount=type=secret,id=NEXT_PUBLIC_SITE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_ANON_KEY \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
    --mount=type=secret,id=NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    --mount=type=secret,id=NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID \
    --mount=type=secret,id=NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN \
    export NEXT_PUBLIC_SITE_URL=$(cat /run/secrets/NEXT_PUBLIC_SITE_URL 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SUPABASE_URL=$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_URL 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SUPABASE_ANON_KEY=$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_ANON_KEY 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$(cat /run/secrets/NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID=$(cat /run/secrets/NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$(cat /run/secrets/NEXT_PUBLIC_PLAUSIBLE_DOMAIN 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SENTRY_DSN=$(cat /run/secrets/NEXT_PUBLIC_SENTRY_DSN 2>/dev/null || echo '') && \
    npm run build

# ── Stage 3: production runtime ────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone output + static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
