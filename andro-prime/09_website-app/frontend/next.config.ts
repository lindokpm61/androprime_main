import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: '/og/default.png', destination: '/opengraph-image' },
    ]
  },
  async redirects() {
    return [
      { source: '/lp/foundations', destination: '/lp/hormone-recovery', permanent: true },
    ]
  },
  // Long-lived caching for static media in /public. Hashed /_next/static assets are
  // already immutable; these files are served by stable path, so a long max-age wins
  // back the repeat-visit download. Update rule: rename the file (e.g. hero-v2.webm)
  // to bust the cache, since there is no content hash in the URL.
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }],
      },
      {
        source: '/:path*.(jpg|jpeg|png|gif|webp|avif|svg|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }],
      },
    ]
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Shrink the client SDK: strip debug/logger code and any residual Session Replay
  // machinery (replay is disabled in instrumentation-client.ts) from the bundle.
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeReplayShadowDom: true,
    excludeReplayIframe: true,
    excludeReplayWorker: true,
  },
});
