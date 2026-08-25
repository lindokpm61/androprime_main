import { headers } from 'next/headers'

/**
 * The hostname this request arrived on.
 *
 * SERVER ONLY. It lives apart from lib/hosts.ts on purpose: that module is
 * imported by client components (Nav, OAuthButtons), and pulling `next/headers`
 * into it would break the client build. Keep the pure rules there and the
 * request-reading here.
 *
 * Prefer x-forwarded-host: the Coolify proxy rewrites Host on the way through,
 * and reading the wrong header is how a two-host setup silently collapses back
 * into one. Same precedence as middleware.ts, deliberately.
 */
export async function getCurrentHost(): Promise<string | null> {
  const headerStore = await headers()
  return headerStore.get('x-forwarded-host') ?? headerStore.get('host')
}
