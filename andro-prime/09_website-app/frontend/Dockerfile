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
#
# 🔴 THIS LIST IS LOAD-BEARING AND ITS FAILURE MODE IS SILENT. `|| echo ''` means
# a variable the app reads but this list omits compiles to the empty string: no
# build error, no boot error, no request error — the feature is simply absent in
# production while working locally, where .env.local supplies it. That is how
# NEXT_PUBLIC_GA4_MEASUREMENT_ID went unbaked from the first deploy to
# 2026-09-15, so GA4 never fired in production and the cookie banner (gated on
# the same variable) never rendered there either.
#
# `scripts/verify-env-contract.js` now holds this list against the app's actual
# `process.env.NEXT_PUBLIC_*` reads, in both directions. It runs in `prebuild`,
# so it fails inside THIS build rather than in a later audit of the result, and
# again in `npm test`. Do not add a mount here without a reader, or a reader
# without a mount.
#
# ⚠ A mount is not a value. Every name below must also exist in Coolify, or it
# still arrives as the empty string and nothing here can tell.
#
# 🔴 THE LIST IS NOT ONLY ABOUT `NEXT_PUBLIC_*`, AND ASSUMING IT WAS COST A DAY.
# The prefix governs CLIENT EXPOSURE, not WHEN a value is needed. Anything read
# while `next build` runs is build-time input whatever it is called — and a
# feature flag read by a statically prerendered page is read exactly then.
# `MEMBERSHIP_ENABLED` is the case in point: six of the nine consumers of
# `subscriptionCopy.ts` are `○ (Static)` — `/`, `/kits`, `/about`,
# `/how-it-works` and the `/lp/*` pages — so `isMembershipEnabled()` is
# evaluated during the build there, however correctly the call site reads it per
# request. Until 2026-09-17 this list omitted it, which means **setting it in
# Coolify could not have flipped those six pages at all**: with no mount there
# is nothing for a build argument to flow into, so the build baked flag-OFF copy
# and the runtime variable only ever reached the three dynamic consumers.
# Measured, not reasoned about: built with the flag on, `/kits` bakes `£47` and
# drops "One price."; with the flag off it bakes "One price." Two states of one
# site, decided here rather than in Coolify.
RUN --mount=type=secret,id=NEXT_PUBLIC_SITE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_APP_URL \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_ANON_KEY \
    --mount=type=secret,id=NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
    --mount=type=secret,id=NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID \
    --mount=type=secret,id=NEXT_PUBLIC_GA4_MEASUREMENT_ID \
    --mount=type=secret,id=NEXT_PUBLIC_SENTRY_DSN \
    --mount=type=secret,id=MEMBERSHIP_ENABLED \
    export NEXT_PUBLIC_SITE_URL=$(cat /run/secrets/NEXT_PUBLIC_SITE_URL 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_APP_URL=$(cat /run/secrets/NEXT_PUBLIC_APP_URL 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SUPABASE_URL=$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_URL 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SUPABASE_ANON_KEY=$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_ANON_KEY 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$(cat /run/secrets/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID=$(cat /run/secrets/NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_GA4_MEASUREMENT_ID=$(cat /run/secrets/NEXT_PUBLIC_GA4_MEASUREMENT_ID 2>/dev/null || echo '') && \
    export NEXT_PUBLIC_SENTRY_DSN=$(cat /run/secrets/NEXT_PUBLIC_SENTRY_DSN 2>/dev/null || echo '') && \
    export MEMBERSHIP_ENABLED=$(cat /run/secrets/MEMBERSHIP_ENABLED 2>/dev/null || echo '') && \
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
