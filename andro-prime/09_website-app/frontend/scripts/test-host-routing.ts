// Unit tests for the host-routing rule (lib/hosts.ts). Same runner-free style
// as the other suites: assert loudly, exit non-zero on any failure. Run with
// `npm test` or `npx tsx scripts/test-host-routing.ts`.
//
// This suite is the reason routeDecision is a pure function. The rule it
// encodes is only ever exercised in production behind a proxy, on two
// hostnames, across a staged cutover — none of which is reachable from a test
// otherwise. Every case below is a request shape that really occurs.
//
// Covers:
//   (1) isAppPath: segment-boundary matching, and the /authors trap.
//   (2) isAppHost: port stripping, case, and unknown hosts.
//   (3) routeDecision on the APP host.
//   (4) routeDecision on the APEX, phase 1 (dual-serve) and phase 2 (handover).
//   (5) Exemptions — /api above all, which carries live webhooks.
//   (6) Query strings survive every redirect.
//   (7) urlFor / hrefFor / isCrossHost link generation.

import {
  APP_ROUTE_PREFIXES,
  APP_URL,
  hrefFor,
  isAppHost,
  isAppPath,
  isCrossHost,
  routeDecision,
  urlFor,
} from '../lib/hosts'
import { SITE_URL } from '../lib/site-url'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`[FAIL] ${label}`)
  }
}

const APP_HOST = new URL(APP_URL).hostname
const SITE_HOST = new URL(SITE_URL).hostname

// (1) isAppPath — segment-boundary matching.
check('(1a) exact prefix', isAppPath('/account'))
check('(1b) child path', isAppPath('/results-dashboard/handoff'))
check('(1c) auth flow', isAppPath('/auth/callback'))
check('(1d) marketing path', !isAppPath('/kits/testosterone'))
check('(1e) blog', !isAppPath('/blog/how-to-read-blood-test-results'))
check('(1f) root is not an app path', !isAppPath('/'))
// THE TRAP: a bare startsWith('/auth') captures /authors/<slug>, a real
// marketing route (app/(marketing)/authors/[slug]/page.tsx). If this ever goes
// red, every author page has been moved to the app host and deindexed.
check('(1g) /authors is NOT /auth', !isAppPath('/authors'))
check('(1h) /authors/<slug> is NOT /auth', !isAppPath('/authors/keith-antony'))
check('(1i) /accounts-payable is NOT /account', !isAppPath('/accounts-payable'))
// The two post-purchase pages are authenticated despite living in (marketing):
// they read the order reference through the USER-scoped Supabase client, so RLS
// needs the session, which only exists on the app host.
check('(1j) order confirmation is an app path', isAppPath('/order/confirmed'))
check('(1k) subscription confirmation is an app path', isAppPath('/subscription/confirmed'))
check('(1l) /order alone is not', !isAppPath('/order'))

// (2) isAppHost
check('(2a) app hostname', isAppHost(APP_HOST))
check('(2b) with port', isAppHost(`${APP_HOST}:3000`))
check('(2c) uppercase', isAppHost(APP_HOST.toUpperCase()))
check('(2d) apex is not the app host', !isAppHost(SITE_HOST))
check('(2e) null host', !isAppHost(null))
check('(2f) empty host', !isAppHost(''))
// Coolify healthchecks and internal container traffic arrive by IP. They must
// fall through, never be redirected somewhere they cannot follow.
check('(2g) direct IP is not the app host', !isAppHost('10.0.0.4:3000'))
check('(2h) localhost is not the app host', !isAppHost('localhost:3000'))

// (3) APP host behaviour
const appRoot = routeDecision({ host: APP_HOST, pathname: '/', phase: 1 })
check('(3a) app root redirects', appRoot.kind === 'redirect')
check(
  '(3b) app root goes to the dashboard',
  appRoot.kind === 'redirect' && appRoot.url === `${APP_URL}/results-dashboard`
)
// Deliberately 307 in BOTH phases: this is a placeholder until the membership
// home exists, and a cached 308 would have to be fought later.
check('(3c) app root is temporary in phase 1', appRoot.kind === 'redirect' && appRoot.status === 307)
const appRootP2 = routeDecision({ host: APP_HOST, pathname: '/', phase: 2 })
check(
  '(3d) app root is STILL temporary in phase 2',
  appRootP2.kind === 'redirect' && appRootP2.status === 307
)

const appMarketing = routeDecision({ host: APP_HOST, pathname: '/kits', phase: 1 })
check(
  '(3e) marketing on the app host goes home',
  appMarketing.kind === 'redirect' && appMarketing.url === `${SITE_URL}/kits`
)
check('(3f) ...temporarily in phase 1', appMarketing.kind === 'redirect' && appMarketing.status === 307)
const appMarketingP2 = routeDecision({ host: APP_HOST, pathname: '/kits', phase: 2 })
check(
  '(3g) ...permanently in phase 2',
  appMarketingP2.kind === 'redirect' && appMarketingP2.status === 308
)

for (const phase of [1, 2] as const) {
  const d = routeDecision({ host: APP_HOST, pathname: '/results-dashboard', phase })
  check(`(3h/p${phase}) app route on the app host passes`, d.kind === 'pass')
}

// (4) APEX behaviour across the cutover
const apexAppP1 = routeDecision({ host: SITE_HOST, pathname: '/account', phase: 1 })
check('(4a) phase 1: apex STILL serves app routes', apexAppP1.kind === 'pass')

const apexAppP2 = routeDecision({ host: SITE_HOST, pathname: '/account', phase: 2 })
check('(4b) phase 2: apex hands over', apexAppP2.kind === 'redirect')
check(
  '(4c) ...to the app host',
  apexAppP2.kind === 'redirect' && apexAppP2.url === `${APP_URL}/account`
)
// 308 not 301: preserves method and query for the /auth/callback?token_hash=…
// links already sitting in customers' inboxes.
check('(4d) ...as a 308', apexAppP2.kind === 'redirect' && apexAppP2.status === 308)

for (const phase of [1, 2] as const) {
  const d = routeDecision({ host: SITE_HOST, pathname: '/kits/testosterone', phase })
  check(`(4e/p${phase}) marketing on the apex always passes`, d.kind === 'pass')
}
// Unknown hosts behave as the apex, so they never get bounced.
const unknown = routeDecision({ host: '10.0.0.4', pathname: '/kits', phase: 2 })
check('(4f) unknown host behaves as the apex', unknown.kind === 'pass')

// (5) Exemptions. /api is the one that carries live money and lab results:
// Stripe, Vitall and QStash webhooks are registered against the apex and must
// keep resolving there, while app pages fetch the same routes from the app host.
const exempt = [
  '/api/webhooks/stripe',
  '/api/webhooks/vitall',
  '/api/jobs/process-result',
  '/api/checkout/kit',
  '/_next/static/chunks/main.js',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/videos/hero.webm',
  '/.well-known/acme-challenge/token',
]
for (const pathname of exempt) {
  for (const host of [APP_HOST, SITE_HOST]) {
    for (const phase of [1, 2] as const) {
      const d = routeDecision({ host, pathname, phase })
      check(`(5) exempt ${pathname} on ${host} p${phase}`, d.kind === 'pass')
    }
  }
}

// (6) Query strings survive. Losing these silently breaks magic links
// (?token_hash=…) and the order reference (?session_id=…).
const withQuery = routeDecision({
  host: SITE_HOST,
  pathname: '/auth/callback',
  search: '?token_hash=abc123&type=email',
  phase: 2,
})
check(
  '(6a) apex→app keeps the query',
  withQuery.kind === 'redirect' &&
    withQuery.url === `${APP_URL}/auth/callback?token_hash=abc123&type=email`
)
const backQuery = routeDecision({
  host: APP_HOST,
  pathname: '/kits',
  search: '?utm_source=newsletter',
  phase: 2,
})
check(
  '(6b) app→apex keeps the query',
  backQuery.kind === 'redirect' && backQuery.url === `${SITE_URL}/kits?utm_source=newsletter`
)
const noQuery = routeDecision({ host: SITE_HOST, pathname: '/account', search: '', phase: 2 })
check(
  '(6c) no query adds no stray ?',
  noQuery.kind === 'redirect' && noQuery.url === `${APP_URL}/account`
)

// (7) Link generation reads the SAME prefix list as the routing, which is the
// point of the module: routing and links cannot disagree.
check('(7a) urlFor app path', urlFor('/results-dashboard') === `${APP_URL}/results-dashboard`)
check('(7b) urlFor marketing path', urlFor('/kits') === `${SITE_URL}/kits`)
check(
  '(7c) urlFor keeps the query',
  urlFor('/auth/login?next=/account') === `${APP_URL}/auth/login?next=/account`
)
check('(7d) hrefFor same-host stays relative', hrefFor('/account', APP_HOST) === '/account')
check('(7e) hrefFor same-host marketing stays relative', hrefFor('/kits', SITE_HOST) === '/kits')
check(
  '(7f) hrefFor cross-host goes absolute',
  hrefFor('/auth/login', SITE_HOST) === `${APP_URL}/auth/login`
)
check(
  '(7g) hrefFor marketing from the app host goes absolute',
  hrefFor('/kits', APP_HOST) === `${SITE_URL}/kits`
)
check('(7h) isCrossHost true across', isCrossHost('/account', SITE_HOST))
check('(7i) isCrossHost false within', !isCrossHost('/account', APP_HOST))

// (8) Every declared prefix actually routes to the app host. Guards against a
// prefix being added with a typo, which would silently do nothing.
for (const prefix of APP_ROUTE_PREFIXES) {
  check(`(8) ${prefix} routes to the app host`, urlFor(prefix).startsWith(APP_URL))
}

console.log(`test-host-routing: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
