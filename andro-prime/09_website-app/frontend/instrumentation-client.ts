import * as Sentry from '@sentry/nextjs'

// Error + performance monitoring only. Session Replay is deliberately NOT enabled:
// its browser-side DOM recorder adds ~40-50 KB (gzipped) to the shared client chunk
// plus ongoing main-thread work on every page, which was a measurable mobile TBT
// cost on a pre-launch marketing site. Omitting both replay sample rates lets the
// Sentry SDK tree-shake the replay integration out entirely. To restore on-error
// replay later, add back `replaysOnErrorSampleRate: 1.0` (and drop the matching
// excludeReplay* flags in next.config.ts).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
