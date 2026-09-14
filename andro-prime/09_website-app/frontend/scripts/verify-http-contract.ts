#!/usr/bin/env tsx
/**
 * The site's HTTP contract, driven over real HTTP: sitemap, robots, redirects,
 * and the handful of static surfaces that are production facts.
 *
 * ── WHY THIS EXISTS ───────────────────────────────────────────────────────
 * `test-host-routing.ts` proves `routeDecision()` returns the right verdict for
 * a given host and path, and it is a good test. **It has never fetched a URL,
 * and neither has anything else in this repo.** So every one of these could be
 * true today and no check would notice:
 *
 *   - the middleware matcher stops matching and the host split silently dies
 *   - a `redirect()` becomes a `notFound()` in a refactor
 *   - `sitemap.ts` lists a URL that 404s, or one that is `noindex`
 *   - a public page is missing from the sitemap entirely
 *   - `robots.txt` grows a `Disallow: /`
 *
 * The last one deindexes a site taking orders, and one stray character does it.
 * That single assertion justifies the file; the rest is the same idea applied
 * to the other things only a real request can see.
 *
 * ── IT COMPUTES ITS EXPECTATIONS, IT DOES NOT TYPE THEM ───────────────────
 * This is `.ts` rather than `.js` for one reason: it imports `lib/hosts.ts` and
 * asks `routeDecision()` what should happen, then checks that against the wire.
 * A typed-out copy of the routing rules would be a second source of truth that
 * is invisible while it agrees and wrong the moment it does not. Same for the
 * redirect table (`redirect-contract.js`), the route set (`route-list.js`) and
 * the disallow list (parsed from the live `robots.txt`).
 *
 * ── THE SELF-TESTS ARE NOT CEREMONY ───────────────────────────────────────
 * Two of the three exist because without them this script passes vacuously:
 *
 *   1. If the HTTP client drops the `Host` header, every app-host assertion is
 *      evaluated against the apex, where the verdict for those paths is `pass`.
 *      The redirect half would be green while measuring nothing at all.
 *   2. If anything in front of the server answers 200 for unknown paths, every
 *      "returns 200" assertion is worthless.
 *
 * Both exit 2, not 1. "The check is broken" must never read as "the site is
 * broken" — see the exit codes at the bottom.
 *
 * Usage:
 *   npx tsx scripts/verify-http-contract.ts
 *   npx tsx scripts/verify-http-contract.ts --base http://localhost:3100
 *   npx tsx scripts/verify-http-contract.ts --only sitemap|robots|redirects|headers
 *   npx tsx scripts/verify-http-contract.ts --base https://andro-prime.com --allow-remote
 *   npx tsx scripts/verify-http-contract.ts --verbose
 *
 * Exit: 0 clean · 1 a contract violation · 2 the probe could not run.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as http from 'node:http'
import * as https from 'node:https'

/* 🔴 EVERY OTHER MODULE IS `require`d BELOW, AFTER loadEnvLocal(), AND THAT IS
   DELIBERATE. `import` is hoisted and evaluated before any statement in this
   file, and BOTH `route-list.js` and `lib/hosts.ts` read the environment at
   module scope. Imported, they would compute their hostnames from the
   production fallbacks before `.env.local` had been read, and this script would
   then drive a local server while believing it was talking to two production
   hostnames — passing, and measuring the wrong thing. Only node: builtins,
   which read nothing, are safe to import. */

/* ------------------------------------------------------------------- env */

/* `next start` loads .env.local; a bare tsx process does not, so without this
   the script's idea of APP_URL is the production fallback while the server it
   is measuring uses the local one. Loaded BEFORE lib/hosts.ts is imported,
   because that module reads the environment at module scope. */
function loadEnvLocal(): string[] {
  const f = path.resolve(__dirname, '..', '.env.local')
  const loaded: string[] = []
  if (!fs.existsSync(f)) return loaded
  for (const raw of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 1) continue
    const k = line.slice(0, eq).trim()
    let v = line.slice(eq + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (process.env[k] === undefined) { process.env[k] = v; loaded.push(k) }
  }
  return loaded
}
const ENV_LOADED = loadEnvLocal()

/* eslint-disable @typescript-eslint/no-var-requires */
/* APP_HOSTNAME and SITE_HOSTNAME are exported by hosts.ts already — derived
   there from the same values routeDecision uses, so deriving them again here
   would be a second copy of a fact that is invisible while it agrees.
   SITE_URL is NOT in hosts.ts; it lives in lib/site-url.ts, which is the single
   source for the public origin and strips trailing slashes. */
const { routeDecision, APP_URL, APP_HOSTNAME, SITE_HOSTNAME, isAppPath, CUTOVER_PHASE } =
  require('../lib/hosts') as typeof import('../lib/hosts')
const { SITE_URL } = require('../lib/site-url') as typeof import('../lib/site-url')

const routeListPkg = require('./route-list.js')
const redirectContractPkg = require('./redirect-contract.js')

const { discoverRoutes, hrefFor, FLAG_GATED, TOKEN_GATED, onAppHost } = routeListPkg as {
  discoverRoutes: (dir?: string, acc?: unknown[]) => { url: string; file: string }[]
  hrefFor: (url: string, who: string) => string
  FLAG_GATED: Record<string, string>
  TOKEN_GATED: Record<string, string>
  onAppHost: (url: string) => boolean
}
const { CONTRACT, judgeRedirectContract } = redirectContractPkg as {
  CONTRACT: ContractRow[]
  judgeRedirectContract: () => string[]
}

type ContractRow = {
  from: string; to: string; status: number; host: 'apex' | 'app'
  file: string; why: string; evidence?: RegExp[]; locationMust?: RegExp[]
}

/* ------------------------------------------------------------- arguments */

const argv = process.argv.slice(2)
const opt = (f: string, d: string | null = null) => {
  const i = argv.indexOf(f)
  return i === -1 || i === argv.length - 1 ? d : argv[i + 1]
}
const has = (f: string) => argv.includes(f)

if (has('--help') || has('-h')) {
  const src = fs.readFileSync(__filename, 'utf8')
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n')
  process.exit(0)
}

const BASE = (opt('--base', 'http://localhost:3000') as string).replace(/\/+$/, '')
const ONLY = opt('--only', null)
const VERBOSE = has('--verbose')
const ALLOW_REMOTE = has('--allow-remote')

const baseUrl = new URL(BASE)
const IS_LOCAL = /^(localhost|127\.|\[?::1)/.test(baseUrl.hostname)

/* A checker that CAN be pointed at production will be, and during a cutover it
   would then read the live phase rather than the branch's. Make it deliberate. */
if (!IS_LOCAL && !ALLOW_REMOTE) {
  console.error(`REFUSING: --base ${BASE} is not local and --allow-remote was not passed.`)
  console.error('Pointing this at production is a legitimate post-deploy step; it is not a default.')
  process.exit(2)
}

/* APP_HOSTNAME / SITE_HOSTNAME come from lib/hosts.ts (see the require above). */

/* -------------------------------------------------------------- reporting */

let failures = 0
let checks = 0
const fail = (m: string, detail?: string) => {
  failures++
  console.log(`  ✗ ${m}`)
  if (detail) for (const l of detail.split('\n')) console.log(`      ${l}`)
}
const pass = (m: string) => { checks++; if (VERBOSE) console.log(`  ✓ ${m}`) }
const info = (m: string) => console.log(`  · ${m}`)
const bail = (m: string): never => { console.error(`\n🔴 CANNOT RUN: ${m}`); process.exit(2) }

/* ----------------------------------------------------------------- client */

type Res = { status: number; headers: Record<string, string | string[] | undefined>; body: string; location: string | null }

/**
 * One request, NEVER auto-following. Following a redirect is how a 404 behind
 * one reads as a 200. `hostHeader` is the whole point of using node:http here:
 * it is what the middleware reads, and it is what lets one local server be
 * driven as two hostnames.
 */
function req(url: string, hostHeader?: string, method = 'GET'): Promise<Res> {
  const u = new URL(url)
  const mod = u.protocol === 'https:' ? https : http
  const headers: Record<string, string> = {
    'user-agent': 'andro-prime-http-contract/1.0',
    accept: '*/*',
    'accept-encoding': 'identity',
  }
  if (hostHeader) headers.host = hostHeader
  return new Promise((resolve, reject) => {
    const r = mod.request(
      { protocol: u.protocol, hostname: u.hostname, port: u.port, path: u.pathname + u.search, method, headers },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (c) => chunks.push(c as Buffer))
        res.on('end', () => resolve({
          status: res.statusCode || 0,
          headers: res.headers as Res['headers'],
          body: Buffer.concat(chunks).toString('utf8'),
          location: (res.headers.location as string) || null,
        }))
      },
    )
    r.on('error', reject)
    r.setTimeout(20000, () => { r.destroy(new Error(`timeout after 20s: ${url}`)) })
    r.end()
  })
}

/** Fetch a path as the apex host. */
const apex = (p: string) => req(`${BASE}${p}`, IS_LOCAL ? undefined : undefined)
/** Fetch a path as the app host, by overriding Host on the same server. */
const app = (p: string) => req(`${BASE}${p}`, APP_HOSTNAME)

/* A Location may be absolute or root-relative, and `new URL` throws on the
   second. Resolving against the request's own origin is what a browser does. */
const locPath = (loc: string) => {
  try { return new URL(loc, BASE).pathname } catch { return loc.split('?')[0] }
}

const isNoindex = (r: Res) => {
  const xr = String(r.headers['x-robots-tag'] || '')
  if (/noindex/i.test(xr)) return true
  return /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(r.body)
}

/* ------------------------------------------------------------- self-tests */

async function selfTests() {
  console.log('Self-tests — without these the run can pass while measuring nothing\n')

  // 1. THE HOST-HEADER TEST. If this mechanism does not work, every app-host
  //    assertion below is evaluated against the apex, where the verdict for
  //    those same paths is `pass`, and the redirect half goes green vacuously.
  let r: Res
  try { r = await app('/') } catch (e) { return bail(`could not reach ${BASE} — is the server up?\n  ${(e as Error).message}`) }
  const expect = routeDecision({ host: APP_HOSTNAME, pathname: '/', phase: CUTOVER_PHASE })
  if (expect.kind !== 'redirect') return bail(`routeDecision says the app host's "/" is a pass, which contradicts lib/hosts.ts as written. Fix this reader.`)
  if (r.status !== expect.status || !r.location || !r.location.includes('/results-dashboard')) {
    return bail(
      `the Host header is not reaching the server, so app-host routing cannot be measured.\n` +
      `  sent   Host: ${APP_HOSTNAME} to ${BASE}/\n` +
      `  wanted ${expect.status} -> ${expect.url}\n` +
      `  got    ${r.status} -> ${r.location ?? '(no Location)'}\n` +
      `  Every app-host assertion would pass vacuously, so this is a hard stop.`)
  }
  console.log(`  ✓ Host: ${APP_HOSTNAME} reaches the server (/ -> ${r.status} ${r.location})`)

  // 2. Unknown paths must 404. If a proxy answers 200 for everything, every
  //    "returns 200" assertion below is worthless.
  const probe = await apex('/__contract_probe_404__')
  if (probe.status !== 404) {
    return bail(`GET /__contract_probe_404__ returned ${probe.status}, not 404. Something answers for unknown paths, so "returns 200" proves nothing.`)
  }
  console.log('  ✓ an unknown path 404s, so a 200 means something')

  // 3. The sitemap must be non-trivial. A generator returning one entry passes
  //    every per-entry assertion.
  const sm = await apex('/sitemap.xml')
  if (sm.status !== 200) return bail(`/sitemap.xml returned ${sm.status}`)
  const n = (sm.body.match(/<loc>/g) || []).length
  if (n < 20 || n > 200) return bail(`/sitemap.xml has ${n} <loc> entries, outside the sane band 20-200. Either the generator broke or this band is stale.`)
  console.log(`  ✓ sitemap has ${n} entries, inside the expected band`)
  console.log()
  return sm
}

/* ------------------------------------------------------------- A. sitemap */

/**
 * Public, apex-owned, 200, non-noindex routes that are CORRECTLY absent from
 * the sitemap. Same shape as route-exclusions.js: a reason that names a fact,
 * so the row can be judged rather than believed.
 */
const SITEMAP_OMITTED: Record<string, string> = {
  '/how-to-sample': 'robots {index:false, follow:true} — reachable from a kit insert, deliberately not a search entry point',
  '/checkout/details': 'noindex; a step inside a purchase, not a landing page',
  '/order/confirmed': 'noindex; post-purchase, served on the app host',
  '/subscription/confirmed': 'noindex; post-purchase, served on the app host',
  '/founding-member': 'retired 2026-06-04; 307s to /kits and was removed from the sitemap deliberately',
  '/activate': 'retired 2026-09-12; 307s to /how-to-sample',
  '/go': 'the Instagram link-in-bio grid — an entry point for a campaign, not for search',
  '/demo': 'noindex, nofollow until CA-046 signs',
  '/not-found': 'not a route; the 404 body',
}

async function checkSitemap(sm: Res) {
  console.log('A. Sitemap\n')

  // Shape. No XML parser exists here and adding one would be a second thing to
  // maintain; a tag-balance walk catches the failures that actually happen.
  if (!/^\s*<\?xml/.test(sm.body)) fail('/sitemap.xml does not start with an XML declaration')
  if (!/<urlset[^>]+xmlns=/.test(sm.body)) fail('/sitemap.xml has no xmlns on <urlset>')
  else pass('sitemap declares a namespace')

  const urlBlocks = sm.body.match(/<url>[\s\S]*?<\/url>/g) || []
  const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (urlBlocks.length !== locs.length) {
    fail(`${urlBlocks.length} <url> blocks but ${locs.length} <loc> elements — every <url> must carry exactly one <loc>`)
  } else pass(`${locs.length} <url> blocks, one <loc> each`)

  const bareAmp = sm.body.match(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g)
  if (bareAmp) fail(`sitemap contains ${bareAmp.length} unescaped "&" — the XML will not parse in a strict reader`)
  else pass('no unescaped ampersands')

  /* 🔴 THE SITEMAP'S HOSTNAME IS NOT `SITE_URL`, AND THAT IS DELIBERATE.
     `app/sitemap.ts` hardcodes `https://andro-prime.com` for the same reason
     `app/layout.tsx` hardcodes the schema.org @id values: a stable global
     identifier must not change on a preview deployment. So locally, where
     NEXT_PUBLIC_SITE_URL is http://localhost:3000, the sitemap correctly emits
     production URLs and comparing the two is the CHECK being wrong, not the
     site. (The first version of this file did exactly that and reported all 38
     entries as defects.)

     What is worth asserting is that the generator's own declared base is what it
     emits, everywhere, with no drift — so the expected host is READ OUT of
     app/sitemap.ts rather than typed here. That catches the real failure: a
     preview deploy, or a half-done parameterisation, publishing a second
     hostname into the middle of the production sitemap. */
  const sitemapSrc = fs.readFileSync(path.resolve(__dirname, '..', 'app', 'sitemap.ts'), 'utf8')
  const declaredBase = sitemapSrc.match(/const\s+BASE_URL\s*=\s*['"]([^'"]+)['"]/)?.[1]
  if (!declaredBase) {
    fail('could not read BASE_URL out of app/sitemap.ts — fix this reader rather than trusting a pass')
  } else {
    const want = new URL(declaredBase).hostname
    const offHost = locs.filter((l) => new URL(l).hostname !== want)
    if (offHost.length) fail(`${offHost.length} of ${locs.length} <loc> are not on ${want}, which app/sitemap.ts declares as its BASE_URL`, offHost.slice(0, 8).join('\n'))
    else pass(`all ${locs.length} entries on ${want} (the BASE_URL app/sitemap.ts declares)`)
    if (want !== 'andro-prime.com') {
      fail(`app/sitemap.ts declares BASE_URL ${declaredBase}. The production sitemap must publish andro-prime.com; anything else deindexes or mis-attributes the corpus.`)
    } else pass('the declared BASE_URL is the production apex')
  }

  // robots.txt is the authority on what is disallowed — parsed, not re-typed.
  const robots = await apex('/robots.txt')
  const disallows = [...robots.body.matchAll(/^\s*Disallow:\s*(\S+)\s*$/gim)].map((m) => m[1])

  const paths = locs.map((l) => new URL(l).pathname.replace(/\/$/, '') || '/')
  let notOk = 0, noindexed = 0, disallowed = 0
  for (const p of paths) {
    const r = await apex(p)
    if (r.status !== 200) { fail(`sitemap lists ${p} which returns ${r.status}`); notOk++; continue }
    if (isNoindex(r)) { fail(`sitemap lists ${p} which renders noindex`); noindexed++ }
    const d = disallows.find((x) => x !== '/' && p.startsWith(x))
    if (d) { fail(`sitemap lists ${p}, which robots.txt disallows via "${d}"`); disallowed++ }
  }
  if (!notOk) pass(`all ${paths.length} sitemap entries return 200`)
  if (!noindexed) pass('no sitemap entry is noindex')
  if (!disallowed) pass('no sitemap entry is robots-disallowed')

  // THE REVERSE CHECK, which is the half nobody writes: a public page missing
  // from the sitemap is invisible to every per-entry assertion above.
  const inSitemap = new Set(paths)
  const routes = discoverRoutes()
  let missing = 0, considered = 0
  for (const r of routes) {
    const url = r.url
    if (onAppHost(url)) continue
    if (url in SITEMAP_OMITTED) continue
    if (url in FLAG_GATED || url in TOKEN_GATED) continue
    if (url.startsWith('/lp/') || url.startsWith('/admin') || url.startsWith('/ops')) continue
    const href = hrefFor(url, 'verify-http-contract sitemap reverse check')
    const res = await apex(href)
    if (res.status !== 200 || isNoindex(res)) continue // not a public indexable page
    considered++
    // A dynamic route is in the sitemap under its real slugs, not its pattern.
    if (url.includes('[')) { if (!paths.some((p) => p.startsWith(url.split('[')[0]))) { fail(`no sitemap entry under ${url.split('[')[0]} though ${href} returns 200`); missing++ } ; continue }
    if (!inSitemap.has(url)) { fail(`${url} returns 200 and is indexable, and is NOT in the sitemap. Add it, or add a SITEMAP_OMITTED row saying why not.`); missing++ }
  }
  if (!missing) pass(`every one of the ${considered} public indexable routes appears in the sitemap`)

  // The blog corpus, from the listing page rather than from the MDX mirror: the
  // listing is what is published, the files are the source. Counting files
  // reports the corpus the repo has, not the one the site serves.
  const blog = await apex('/blog')
  const listed = [...new Set([...blog.body.matchAll(/href="(\/blog\/[a-z0-9-]+)"/g)].map((m) => m[1]))]
    .filter((p) => !p.startsWith('/blog/preview'))
  const sitemapArticles = paths.filter((p) => p.startsWith('/blog/'))

  if (listed.length < 5) {
    fail(`only ${listed.length} article links in the server-rendered /blog — either the corpus collapsed or this scraper stopped working`)
  } else {
    const absent = listed.filter((p) => !inSitemap.has(p))
    if (absent.length) fail(`${absent.length} server-rendered /blog links are missing from the sitemap`, absent.join('\n'))
    else pass(`all ${listed.length} server-rendered /blog links are in the sitemap`)
  }

  /* 🔴 SAY WHAT WAS MEASURED, BECAUSE IT IS A SUBSET AND THE PASS ABOVE LOOKS
     LIKE A CORPUS CHECK. `BlogListings` is a client component that paginates
     with useState (1 featured + PAGE_SIZE 6), so the server-rendered HTML
     carries 7 links however many articles exist. The first version of this
     check scraped those 7, found them all in the sitemap, and printed a pass —
     a report answering "did these pass" about a set it never established was
     the set. Production renders the same 7, so this is long-standing behaviour
     and not a Direction F regression; it is reported, not failed.

     The direction that IS a defect is asserted above: a link the server renders
     that the sitemap does not carry. The reverse — a sitemap entry not linked
     from the index — is a crawl-depth question, not a broken page, and every
     one of those URLs is still in the sitemap and still returns 200 (checked
     earlier in this function). */
  if (sitemapArticles.length > listed.length) {
    info(`/blog server-renders ${listed.length} of the ${sitemapArticles.length} articles in the sitemap; the rest are behind client-side pagination (BlogListings PAGE_SIZE=6 + 1 featured). Discovery is via the sitemap, which carries all ${sitemapArticles.length}.`)
  }

  // /membership is checked against the SERVER's behaviour, never against a copy
  // of the flag: if it serves, it must be listed; if it 404s, it must not be.
  const mem = await apex('/membership')
  if (mem.status === 200 && !inSitemap.has('/membership')) fail('/membership returns 200 but is not in the sitemap')
  else if (mem.status === 404 && inSitemap.has('/membership')) fail('/membership 404s but is listed in the sitemap')
  else pass(`/membership is ${mem.status} and its sitemap presence matches`)

  info(`${locs.length} locs · ${considered} public routes cross-checked · robots declares ${disallows.length} Disallow rules`)
  console.log()
}

/* -------------------------------------------------------------- B. robots */

async function checkRobots() {
  console.log('B. Robots\n')
  const r = await apex('/robots.txt')
  if (r.status !== 200) return fail(`/robots.txt returned ${r.status}`)
  pass('robots.txt returns 200')
  if (!/text\/plain/.test(String(r.headers['content-type']))) fail(`robots.txt content-type is ${r.headers['content-type']}, not text/plain`)
  else pass('robots.txt is text/plain')

  // THE ASSERTION THAT JUSTIFIES THE FILE. One stray character here deindexes a
  // site that is taking orders, and nothing else in the repo would notice.
  const lines = r.body.split(/\r?\n/).map((l) => l.trim())
  let agent = ''
  let blanket: string | null = null
  for (const l of lines) {
    const a = l.match(/^User-agent:\s*(\S+)/i)
    if (a) { agent = a[1]; continue }
    if (/^Disallow:\s*\/\s*$/i.test(l)) blanket = agent || '(no preceding User-agent)'
  }
  if (blanket !== null) fail(`robots.txt contains a blanket "Disallow: /" under User-agent: ${blanket}. This deindexes the site.`)
  else pass('no blanket Disallow: / for any user-agent')

  const sitemapLine = r.body.match(/^\s*Sitemap:\s*(\S+)\s*$/im)
  if (!sitemapLine) fail('robots.txt declares no Sitemap:')
  else {
    const declared = sitemapLine[1]
    const p = new URL(declared).pathname
    const got = await apex(p)
    if (got.status !== 200) fail(`robots.txt declares Sitemap: ${declared}, and ${p} returns ${got.status}`)
    else pass(`robots.txt declares ${declared}, which answers 200`)
  }

  const disallows = [...r.body.matchAll(/^\s*Disallow:\s*(\S+)\s*$/gim)].map((m) => m[1])
  for (const needed of ['/api/', '/auth/', '/lp/']) {
    if (!disallows.some((d) => d === needed || needed.startsWith(d))) fail(`robots.txt does not disallow ${needed}`)
    else pass(`robots.txt disallows ${needed}`)
  }

  /* The app host serves the same policy, because app/robots.ts is one route. Whether
     app.andro-prime.com SHOULD be Disallow: / is an open question for Keith, and a
     check that fails on an open decision is a check that gets switched off. Report it. */
  const appRobots = await req(`${BASE}/robots.txt`, APP_HOSTNAME)
  info(`app host robots.txt: ${appRobots.status}, ${appRobots.body.split(/\r?\n/).filter(Boolean).length} lines (same policy — whether it should differ is an open decision, not asserted here)`)
  console.log()
}

/* ----------------------------------------------------------- C. redirects */

async function checkRedirects() {
  console.log('C. Redirects\n')

  // The offline half first: a row that no longer describes the tree would send
  // a real failure to the wrong conclusion.
  const problems = judgeRedirectContract()
  if (problems.length) {
    for (const p of problems) fail(`redirect contract: ${p}`)
  } else pass(`${CONTRACT.length} contract rows still match their source files`)

  for (const row of CONTRACT) {
    const r = row.host === 'app' ? await app(row.from) : await apex(row.from)
    if (r.status !== row.status) {
      fail(`${row.host} ${row.from}: expected ${row.status}, got ${r.status}`, `declared in ${row.file}`)
      continue
    }
    if (!r.location) { fail(`${row.host} ${row.from}: ${r.status} with no Location header`); continue }
    const gotPath = locPath(r.location)
    if (gotPath !== row.to) {
      fail(`${row.host} ${row.from}: expected -> ${row.to}, got -> ${r.location}`)
      continue
    }
    let ok = true
    for (const re of row.locationMust || []) {
      if (!re.test(r.location)) { fail(`${row.from}: Location is missing ${re} — got ${r.location}`); ok = false }
    }
    if (!ok) continue
    // And the destination has to be real. A redirect to a 404 is a 404 with a
    // hop in front of it, which is exactly what an auto-following client hides.
    const dest = onAppHost(row.to) ? await app(row.to) : await apex(row.to)
    if (dest.status !== 200) fail(`${row.from} -> ${row.to}, and ${row.to} returns ${dest.status}`)
    else pass(`${row.host} ${row.from} -> ${row.status} ${row.to} (destination 200)`)
  }

  // The host split, computed from lib/hosts.ts rather than typed. Every app
  // prefix must bounce from the apex, and a marketing path must bounce back.
  const routes = discoverRoutes()
  let hostOk = 0, hostBad = 0
  for (const r of routes) {
    const href = hrefFor(r.url, 'verify-http-contract host split')
    const onApp = onAppHost(r.url)
    const want = routeDecision({ host: onApp ? SITE_HOSTNAME : APP_HOSTNAME, pathname: href, phase: CUTOVER_PHASE })
    if (want.kind !== 'redirect') continue
    const got = onApp ? await apex(href) : await app(href)
    /* Compare against routeDecision's own `url`, never against an assumption
       that the pathname survives. Most of these bounces DO preserve it, and the
       app host's "/" front door does not — it sends the reader to
       /results-dashboard — so a pathname-equality test reported the one route
       whose behaviour is most deliberate as the only broken one. Where the
       expectation is computed, compare the computed thing. */
    const wantHref = new URL(want.url).pathname + new URL(want.url).search
    const gotHref = got.location ? locPath(got.location) + (got.location.includes('?') ? '?' + got.location.split('?')[1] : '') : null
    if (got.status !== want.status || gotHref !== wantHref) {
      fail(`host split for ${href} from the ${onApp ? 'apex' : 'app'} host: wanted ${want.status} -> ${want.url}, got ${got.status} -> ${got.location ?? '(none)'}`)
      hostBad++
    } else hostOk++
  }
  if (!hostBad) pass(`${hostOk} routes bounce to their owning host exactly as routeDecision predicts (phase ${CUTOVER_PHASE})`)

  // A route that isAppPath says is NOT an app path must not bounce. Without this
  // the check above is satisfied by a server that redirects everything.
  const control = await apex('/kits')
  if (control.status !== 200) fail(`/kits on the apex returned ${control.status} — a marketing route must be served, not redirected`)
  else pass('/kits is served on the apex, so the split is a split and not a blanket redirect')
  if (isAppPath('/kits')) fail('lib/hosts.ts thinks /kits is an app path, which contradicts the control above')

  console.log()
}

/* ------------------------------------------------------------- D. headers */

async function checkHeaders() {
  console.log('D. Headers and static surfaces\n')

  // The rewrite. It must be a 200 image, never a redirect: it is the default OG
  // image and a social scraper that does not follow redirects shows nothing.
  const og = await apex('/og/default.png')
  if (og.status !== 200) fail(`/og/default.png returned ${og.status} — the next.config.ts rewrite is not serving`)
  else if (!/^image\//.test(String(og.headers['content-type']))) fail(`/og/default.png is ${og.headers['content-type']}, not an image`)
  else pass(`/og/default.png -> 200 ${og.headers['content-type']}`)

  const llms = await apex('/llms.txt')
  if (llms.status !== 200) fail(`/llms.txt returned ${llms.status}`)
  else pass('/llms.txt -> 200')

  // The one-year cache headers next.config.ts declares. A missing header is not
  // a broken page, so this is reported as a failure only where the config
  // promises it — the config is the contract.
  const cfg = fs.readFileSync(path.resolve(__dirname, '..', 'next.config.ts'), 'utf8')
  if (/\/videos\/:path\*/.test(cfg)) {
    const vids = fs.existsSync(path.resolve(__dirname, '..', 'public', 'videos'))
      ? fs.readdirSync(path.resolve(__dirname, '..', 'public', 'videos')).filter((f) => !f.startsWith('.'))
      : []
    if (!vids.length) info('next.config.ts sets a 1y cache on /videos/* and public/videos is empty — nothing to check')
    else {
      const v = await apex(`/videos/${vids[0]}`)
      if (!/max-age=31536000/.test(String(v.headers['cache-control']))) fail(`/videos/${vids[0]} cache-control is "${v.headers['cache-control']}", and next.config.ts promises max-age=31536000`)
      else pass(`/videos/${vids[0]} carries the 1y cache header`)
    }
  }
  console.log()
}

/* ----------------------------------------------------------------- driver */

async function main() {
  console.log('HTTP contract\n')
  console.log(`  base        ${BASE}${IS_LOCAL ? '' : '   ⚠ REMOTE'}`)
  console.log(`  apex host   ${SITE_HOSTNAME}`)
  console.log(`  app host    ${APP_HOSTNAME}  (driven by overriding the Host header on the same server)`)
  console.log(`  phase       ${CUTOVER_PHASE}  (from lib/hosts.ts, not typed here)`)
  console.log(`  env         ${ENV_LOADED.length} keys read from .env.local`)
  console.log()

  const sm = await selfTests()

  if (!ONLY || ONLY === 'sitemap') await checkSitemap(sm as Res)
  if (!ONLY || ONLY === 'robots') await checkRobots()
  if (!ONLY || ONLY === 'redirects') await checkRedirects()
  if (!ONLY || ONLY === 'headers') await checkHeaders()

  console.log('-'.repeat(70))
  if (failures) {
    console.log(`🔴 ${failures} contract violation(s); ${checks} assertions passed.`)
    process.exit(1)
  }
  console.log(`🟢 HTTP contract clean. ${checks} assertions passed against ${BASE}.`)
  console.log('   Self-tests confirmed the Host header reaches the server and an unknown path 404s,')
  console.log('   so the app-host half and the "returns 200" half both measured something.')
}

main().catch((e) => bail((e as Error).stack || String(e)))
