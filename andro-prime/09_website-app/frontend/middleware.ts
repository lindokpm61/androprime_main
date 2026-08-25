import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { updateSupabaseSession } from '@/lib/supabase/middleware'
import { CUTOVER_PHASE, routeDecision, urlFor } from '@/lib/hosts'

/**
 * Two jobs, in this order:
 *
 *   1. HOST ROUTING. One app, two hostnames — marketing on andro-prime.com, the
 *      authenticated app on app.andro-prime.com. The rule itself lives in
 *      lib/hosts.ts as a pure function so it can be exhaustively tested
 *      (scripts/test-host-routing.ts); this file only applies the verdict.
 *
 *   2. THE AUTH GATE, unchanged in behaviour: an unauthenticated request for a
 *      protected route is sent to the login page.
 *
 * Routing runs FIRST. A request for an app route arriving on the wrong host has
 * to move before anything reads a session, because the Supabase cookie is
 * host-only by design and would simply be absent on the other host.
 */

const protectedRoutes = [
  '/results-dashboard',
  '/subscriptions',
  '/account',
  '/founding-member-status',
  '/supplement-waitlist-status',
]

function isProtectedPath(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // `host` is the forwarded hostname behind the Coolify proxy. Prefer
  // x-forwarded-host: the proxy rewrites Host on the way through, and reading
  // the wrong one is how a two-host setup silently collapses back into one.
  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host')

  const decision = routeDecision({
    host,
    pathname,
    search,
    phase: CUTOVER_PHASE,
  })

  if (decision.kind === 'redirect') {
    return NextResponse.redirect(decision.url, decision.status)
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  // Absolute, via urlFor: login must happen on the host that will hold the
  // session. During phase 1 the apex still serves these routes, so without this
  // a visitor could sign in on the apex and set the cookie on the wrong host.
  const loginUrl = new URL(urlFor('/auth/login'))
  loginUrl.searchParams.set('next', `${pathname}${search}`)

  if (!isSupabaseConfigured()) {
    loginUrl.searchParams.set(
      'error',
      'Supabase keys are missing. Add them to .env.local before testing auth.'
    )
    return NextResponse.redirect(loginUrl)
  }

  const { response, user } = await updateSupabaseSession(request)

  if (user) {
    return response
  }

  loginUrl.searchParams.set(
    'message',
    'Please log in to access your Andro Prime dashboard'
  )

  return NextResponse.redirect(loginUrl)
}

export const config = {
  /**
   * Broadened from the five protected routes to (almost) everything, because
   * host routing has to see marketing paths too — previously middleware never
   * ran on them at all.
   *
   * Excluded: `api` (dual-served on purpose — Stripe, Vitall and QStash
   * webhooks are registered against the apex and must keep resolving there),
   * `_next/static` and `_next/image` (build assets), `monitoring` (the Sentry
   * tunnel), and any path containing a dot, which covers /favicon.ico,
   * /robots.txt, /sitemap.xml and every file in /public.
   *
   * lib/hosts.ts re-checks these exemptions itself, so the rule is enforced in
   * both places and the matcher is an optimisation rather than the guarantee.
   */
  matcher: ['/((?!api|_next/static|_next/image|monitoring|.*\\..*).*)'],
}
