import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  // An escape hatch for building while `next dev` is listening. Both write the
  // same `.next` by default, and the corruption that follows does NOT present
  // as a build error — it presents as an unstyled page or a route returning
  // 500, which reads as a CSS regression and has been misdiagnosed as one five
  // times. Unset, this is byte-identical to the default; set, the build gets
  // its own directory and the dev server is left alone:
  //   NEXT_DIST_DIR=.next-build npm run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
