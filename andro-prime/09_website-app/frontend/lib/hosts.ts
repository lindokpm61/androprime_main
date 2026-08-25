/**
 * Which host serves which route.
 *
 * The site is ONE Next.js app served on TWO hostnames (Keith, 2026-08-25):
 *
 *   andro-prime.com      marketing, blog, LPs, checkout entry — public, indexed
 *   app.andro-prime.com  the authenticated app + the whole auth flow — noindex
 *
 * Auth lives on the app host so the Supabase session cookie is host-only and a
 * wildcard `.andro-prime.com` cookie is never set. That cookie gates
 * special-category health data, and a wildcard would be readable by every
 * present and future subdomain. See 09_website-app/STATE.md.
 *
 * THIS MODULE IS THE SINGLE SOURCE OF TRUTH for the route→host mapping.
 * `middleware.ts` routes with it and `hrefFor`/`urlFor` generate links with it,
 * so routing and link generation cannot drift apart. Moving a route between
 * hosts should be an edit to APP_ROUTE_PREFIXES and nothing else.
 *
 * `routeDecision` is deliberately PURE — no NextRequest, no header objects, no
 * env reads at call time — so scripts/test-host-routing.ts can drive it over a
 * full table of hosts × paths. Same pattern as lib/quiz/wtp.ts and
 * lib/vitall/identity.ts.
 */

import { SITE_URL } from '@/lib/site-url'

/**
 * Routes served by the app host. Order is irrelevant; matching is exact-or-
 * segment-boundary (see `matchesPrefix`), never a bare `startsWith`.
 *
 * `/order/confirmed` and `/subscription/confirmed` are here because they are
 * authenticated pages despite living in the (marketing) route group: both call
 * getCurrentUser(), and the order reference is read through the USER-scoped
 * Supabase client (lib/orders/getOrderRefForCheckoutSession.ts), so RLS needs
 * the session. Left on the apex they would render permanently logged-out and
 * the customer would never see their order reference.
 */
export const APP_ROUTE_PREFIXES = [
  '/auth',
  '/results-dashboard',
  '/account',
  '/subscriptions',
  '/founding-member-status',
  '/supplement-waitlist-status',
  '/order/confirmed',
  '/subscription/confirmed',
] as const

/** Where the app host lives. NEXT_PUBLIC_ is inlined at BUILD time. */
export const APP_URL: string = (
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.andro-prime.com'
).replace(/\/+$/, '')

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

export const APP_HOSTNAME = hostnameOf(APP_URL)
export const SITE_HOSTNAME = hostnameOf(SITE_URL)

/**
 * Segment-boundary prefix match.
 *
 * A bare `pathname.startsWith('/auth')` would capture `/authors/keith-antony`,
 * a real marketing route (app/(marketing)/authors/[slug]/page.tsx), and quietly
 * move every author page to the app host. Match the exact path or the prefix
 * followed by a `/`, never a partial segment.
 */
function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

/** True when this path belongs to the app host. */
export function isAppPath(pathname: string): boolean {
  return APP_ROUTE_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix))
}

/**
 * True when the request arrived on the app hostname. The Host header can carry
 * a port (`app.andro-prime.com:3000` in local testing), so strip it. An unknown
 * or missing host is NOT the app host: Coolify healthchecks and internal
 * container traffic arrive by IP, and they must fall through untouched rather
 * than be redirected somewhere.
 */
export function isAppHost(host: string | null | undefined): boolean {
  if (!host) return false
  return host.split(':')[0].toLowerCase() === APP_HOSTNAME
}

/** The absolute origin that serves this path. */
export function originFor(pathname: string): string {
  return isAppPath(pathname) ? APP_URL : SITE_URL
}

/**
 * Absolute URL for a path, on whichever host actually serves it.
 *
 * Use this anywhere a URL leaves the process — Stripe success/cancel URLs,
 * Supabase emailRedirectTo, anything handed to Customer.io. Those callers have
 * no request context and an absolute URL is mandatory.
 */
export function urlFor(path: string): string {
  const [pathname] = path.split(/[?#]/, 1)
  return new URL(path, `${originFor(pathname)}/`).toString()
}

/**
 * Href for a link RENDERED on `currentHost`.
 *
 * Returns a relative path when the target is served by the same host (so
 * next/link client-side navigation still works), and an absolute URL when the
 * link crosses hosts. A cross-host link must also be rendered as a plain <a>,
 * never next/link: Link cannot client-navigate across origins, and left as a
 * Link it would client-render the app page on the marketing host, bypassing the
 * middleware redirect entirely.
 */
export function hrefFor(path: string, currentHost: string | null | undefined): string {
  const [pathname] = path.split(/[?#]/, 1)
  const targetIsApp = isAppPath(pathname)
  return targetIsApp === isAppHost(currentHost) ? path : urlFor(path)
}

/** True when the link at `path` crosses a host boundary from `currentHost`. */
export function isCrossHost(path: string, currentHost: string | null | undefined): boolean {
  const [pathname] = path.split(/[?#]/, 1)
  return isAppPath(pathname) !== isAppHost(currentHost)
}

/**
 * Paths middleware must never redirect, checked defensively even though the
 * matcher already excludes most of them.
 *
 * `/api` is DUAL-SERVED on purpose and is the important one: Stripe, Vitall and
 * QStash webhooks are all registered against the apex and must keep resolving
 * there, while app pages fetch the same routes from the app host. Redirecting
 * either direction breaks live payment and lab-result delivery.
 */
function isExempt(pathname: string): boolean {
  if (matchesPrefix(pathname, '/api')) return true
  if (matchesPrefix(pathname, '/_next')) return true
  if (matchesPrefix(pathname, '/.well-known')) return true
  if (matchesPrefix(pathname, '/monitoring')) return true // Sentry tunnel
  // Any file with an extension: /favicon.ico, /robots.txt, /sitemap.xml, media.
  if (/\.[a-z0-9]+$/i.test(pathname)) return true
  return false
}

export type RouteDecision =
  | { kind: 'pass' }
  | { kind: 'redirect'; url: string; status: 307 | 308 }

/**
 * The whole host-routing rule, as one pure function.
 *
 * `phase` stages the cutover (see the plan):
 *   1  The app host serves the app; the apex STILL serves it too. Nothing can
 *      break, and the first real session on a new cookie domain has a rollback
 *      point. Redirects are 307 (temporary) so nothing caches while we verify.
 *   2  The apex hands over: app paths there 308 to the app host.
 *
 * 308 rather than 301 because it preserves method and query, which matters for
 * the /auth/callback?token_hash=… links already sitting in customers' inboxes.
 */
export function routeDecision(input: {
  host: string | null | undefined
  pathname: string
  search?: string
  phase: 1 | 2
}): RouteDecision {
  const { host, pathname, phase } = input
  const search = input.search ?? ''

  if (isExempt(pathname)) return { kind: 'pass' }

  const permanence: 307 | 308 = phase === 2 ? 308 : 307

  if (isAppHost(host)) {
    // The app host's front door. Deliberately ALWAYS 307, never 308, even in
    // phase 2: this is a placeholder until the membership home exists, and a
    // permanent redirect cached in browsers would have to be fought later.
    if (pathname === '/') {
      return { kind: 'redirect', url: `${APP_URL}/results-dashboard`, status: 307 }
    }

    // Marketing served on the app host is the duplicate-content problem the
    // Cloudflare noindex rule currently covers. Send it home.
    if (!isAppPath(pathname)) {
      return { kind: 'redirect', url: `${SITE_URL}${pathname}${search}`, status: permanence }
    }

    return { kind: 'pass' }
  }

  // Apex, or any unrecognised host (healthchecks, direct IP): behave as the
  // marketing host. In phase 1 it still serves everything.
  if (phase === 2 && isAppPath(pathname)) {
    return { kind: 'redirect', url: `${APP_URL}${pathname}${search}`, status: 308 }
  }

  return { kind: 'pass' }
}

/**
 * Current cutover phase. Flip to 2 to make the apex hand over (Deploy 2).
 * Kept as a module constant rather than an env var so the change is a reviewed
 * commit rather than a dashboard edit nobody can see in the diff.
 */
export const CUTOVER_PHASE: 1 | 2 = 1
