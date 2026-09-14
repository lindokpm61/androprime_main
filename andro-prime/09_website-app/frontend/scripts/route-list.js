#!/usr/bin/env node
/**
 * The route set, the host that serves each route, and the browser that renders
 * it — in one place, because two scripts now need all three.
 *
 * WHY THIS EXISTS. `route-conformance.js` grew a route walk, a dynamic-segment
 * sample map, a dark-launch flag list, a copy of `lib/hosts.ts`'s app-host
 * prefixes with a guard against that copy rotting, and a Chrome locator.
 * `audit-rendered-markup.js` (defect register M4, M5, M6) needs every one of
 * them and would otherwise have been a second copy.
 *
 * 🔴 A DUPLICATED FACT IS INVISIBLE EXACTLY WHILE THE COPIES AGREE, and the
 * first correction to one of them is what makes it visible. This repo has been
 * bitten by that shape often enough to have written the rule down; adding a
 * second `APP_PREFIXES` while writing a check FOR consistency would have been a
 * poor joke. So the shared machinery moved here and both scripts read it.
 *
 * ⚠ THIS MODULE TAKES NO VIEW ON WHAT IS MEASURED. It hands back every route
 * with a `page.tsx`, EXCLUSIONS included, because the two consumers want
 * different sets: conformance counts the public rebuilt surface and excludes
 * `/go`, while the markup audit must measure `/go` precisely because M1's
 * doubled title was on it. Filtering is the caller's job, and each caller says
 * why in its own header.
 *
 * Nothing here renders, fetches or asserts. It is data plus two locators.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const APP = path.join(ROOT, 'app')

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

/* ---------------------------------------------------------------- routes */

/**
 * Every route with a `page.tsx`, as `{ url, file }`. A `(group)` folder is an
 * organisational device and not a path segment; `_private` folders and `api/`
 * are not routes at all.
 */
function discoverRoutes(dir = APP, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!e.name.startsWith('_') && e.name !== 'api') discoverRoutes(p, acc)
    } else if (e.name === 'page.tsx') {
      const rel = path.relative(APP, path.dirname(p)).split(path.sep).filter(Boolean)
      const url = '/' + rel.filter((s) => !(s.startsWith('(') && s.endsWith(')'))).join('/')
      acc.push({
        url: url === '/' ? '/' : url.replace(/\/$/, ''),
        file: path.relative(ROOT, p).split(path.sep).join('/'),
      })
    }
  }
  return acc
}

// A dynamic segment needs a real value to render. Declared rather than guessed,
// so a missing sample is a loud failure instead of a 404 measured as a page.
const SAMPLES = {
  '/authors/[slug]': 'dr-ewa-lindo',
  '/blog/[slug]': 'andropause-male-menopause',
  '/blog/preview/[slug]': 'andropause-male-menopause',
}

// Routes with no `page.tsx` of their own that still render markup a reader
// meets. `/not-found` is reached by requesting a path that matches nothing.
const SYNTHETIC = [
  { url: '/not-found', href: '/__conformance_probe_404__', file: 'app/not-found.tsx', expectStatus: 404 },
]

// Dark-launch flags call `notFound()` on the route itself, so with the flag off
// the page 404s BY DESIGN. A 404 on one of these reads as "not measured" and
// names what would measure it; a 404 anywhere else stays an error.
const FLAG_GATED = {
  '/membership': 'MEMBERSHIP_ENABLED=true',
  '/account/membership': 'MEMBERSHIP_ENABLED=true',
  '/results-dashboard/handoff': 'GP_HANDOFF_ENABLED=true',
}

// Routes that answer 404 to anyone without a secret, BY DESIGN — a 404 rather
// than a 401 so the route does not reveal that it exists. Same treatment as
// FLAG_GATED: the 404 reads as "not measured" and names what would measure it,
// rather than as a broken page. Listed rather than inferred, so a route that
// starts 404-ing for a real reason is still an error.
const TOKEN_GATED = {
  '/blog/preview/[slug]': '?token=<PREVIEW_SECRET>; the route 404s rather than reveal itself',
}

/** Fill a dynamic segment from SAMPLES, or die naming the route. */
function hrefFor(url, who) {
  if (!url.includes('[')) return url
  if (!(url in SAMPLES)) {
    die(`no sample value for the dynamic route ${url} (needed by ${who}). Add one to SAMPLES in scripts/route-list.js rather than letting it render a 404 and be measured as a page.`)
  }
  return url.replace(/\[[^\]]+\]/, () => SAMPLES[url])
}

/* ------------------------------------------------------------------ hosts */

/* WHICH HOST SERVES WHAT. Mirrors APP_ROUTE_PREFIXES in lib/hosts.ts, which is
   the single source of truth for the route→host mapping. Duplicated here rather
   than imported because this is plain CJS and that module is TS with path
   aliases; the guard below fails loudly if the two ever diverge, so the copy
   cannot rot silently. */
const APP_HOST = (process.env.NEXT_PUBLIC_APP_URL || 'https://app.andro-prime.com').replace(/\/+$/, '')
const APP_PREFIXES = ['/auth', '/results-dashboard', '/account', '/subscriptions', '/founding-member-status', '/supplement-waitlist-status', '/order/confirmed', '/subscription/confirmed']
{
  // The copy above must equal the real list. A route silently added to
  // lib/hosts.ts and not here would be measured on the wrong host and reported
  // with confidence.
  const ts = fs.readFileSync(path.join(ROOT, 'lib', 'hosts.ts'), 'utf8')
  const block = ts.match(/export const APP_ROUTE_PREFIXES = \[([\s\S]*?)\] as const/)
  if (!block) die('could not find APP_ROUTE_PREFIXES in lib/hosts.ts. Fix this reader rather than trusting a pass.')
  // Comments FIRST. The real array carries a long comment explaining why
  // '/membership' is NOT in it, and a bare string match reads that quoted path
  // as a member, so the guard failed on its own reader and reported a list
  // containing the one route the comment exists to exclude.
  const body = block[1].replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ')
  const real = [...new Set([...body.matchAll(/'([^']+)'/g)].map((m) => m[1]))].sort()
  const mine = [...APP_PREFIXES].sort()
  if (JSON.stringify(real) !== JSON.stringify(mine)) {
    die(`APP_PREFIXES in scripts/route-list.js disagrees with lib/hosts.ts.\n  hosts.ts: ${real.join(' ')}\n  here:     ${mine.join(' ')}\nUpdate this module's copy.`)
  }
}

/* Exact-or-segment-boundary, never a bare startsWith: '/accounts-payable' must
   not match '/account'. Same rule lib/hosts.ts matchesPrefix applies. */
const onAppHost = (url) => APP_PREFIXES.some((p) => url === p || url.startsWith(p + '/'))

/* 🔴 THE HOSTNAME IS THE APP HOST'S; THE SCHEME AND PORT ARE THE DEV SERVER'S.
   Chrome's resolver MAP redirects where the NAME resolves to and changes
   nothing else, so navigating to the app hostname reaches the dev server while
   the Host header still says `app.andro-prime.com`, which is what the
   middleware reads. Without it an app-host route 308s to production and the
   script measures the LIVE site while reporting on the branch. */
const APP_RESOLVABLE = !/^(localhost|127\.|\[?::1)/.test(new URL(APP_HOST).hostname)

/**
 * Given the dev-server base, return `{ originFor, resolverArgs, note }`:
 * which origin to fetch each route from, the Chrome flags that make the
 * mapping work, and a line to print so a reader of the output knows it happened.
 */
function hostRouting(BASE) {
  const appFetchOrigin = APP_RESOLVABLE
    ? `${new URL(BASE).protocol}//${new URL(APP_HOST).hostname}`
    : APP_HOST
  const appHostname = new URL(APP_HOST).hostname
  const baseAuthority = new URL(BASE).host
  return {
    appHost: APP_HOST,
    appHostname,
    appFetchOrigin,
    originFor: (url) => (onAppHost(url) ? appFetchOrigin : BASE),
    resolverArgs: APP_RESOLVABLE ? [`--host-resolver-rules=MAP ${appHostname} ${baseAuthority}`] : [],
    note: APP_RESOLVABLE
      ? `${appHostname} mapped to ${baseAuthority}; app-host routes fetched from ${appFetchOrigin}`
      : '',
  }
}

/* ---------------------------------------------------------------- browser */

/* Neither the driver nor Chrome is a declared dependency of this repo, so both
   are found at run time and named if missing. Same resolution the other design
   scripts use. */
function browserDriver() {
  let driver = null
  for (const c of ['puppeteer-core', path.join(ROOT, 'node_modules', 'puppeteer-core')]) {
    try { driver = require(c); break } catch { /* next */ }
  }
  if (!driver) die('puppeteer-core not found. Fix: npm install puppeteer-core')
  return driver
}

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean)
  const found = candidates.find((c) => fs.existsSync(c))
  if (!found) die('no Chrome binary found. Fix: set CHROME_PATH to the executable.')
  return found
}

module.exports = {
  ROOT,
  APP,
  die,
  discoverRoutes,
  SAMPLES,
  SYNTHETIC,
  FLAG_GATED,
  TOKEN_GATED,
  hrefFor,
  APP_HOST,
  APP_PREFIXES,
  APP_RESOLVABLE,
  onAppHost,
  hostRouting,
  browserDriver,
  chromePath,
}
