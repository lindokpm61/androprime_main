#!/usr/bin/env node
/**
 * Every link the site renders, harvested from the real DOM and resolved over
 * real HTTP.
 *
 * ── WHY A BROWSER AND NOT A GREP ──────────────────────────────────────────
 * Roughly a third of this site's internal links are template literals —
 * `/kits/${slug}`, `/blog/${a.slug}`, `/authors/${author.slug}` — so a grep
 * over the source finds the SHAPE of a link and never its VALUE. The browser
 * resolves them for free, because by the time a page is rendered every href is
 * a real URL. That is the entire reason this is a browser check.
 *
 * ── WHAT NOBODY HAD ───────────────────────────────────────────────────────
 * Nothing in this repo crawls hrefs. `test-kit-cta.ts` checks a static map,
 * `route-conformance.js` counts classes, `publish-article` has the only link
 * assertions and they are prose for a human to run. So a dead internal link, a
 * fragment pointing at an id that was renamed, or a citation that 404s would
 * all ship silently. Before a migration that is worth closing.
 *
 * ── THE TWO-HOST TRAP ─────────────────────────────────────────────────────
 * A link to `/account` rendered on the apex is NOT a 404: it is a legitimate
 * cross-host 308 to the app host. And `hrefFor()` in lib/hosts.ts emits an
 * ABSOLUTE `https://app.andro-prime.com/account`, so against a plain-HTTP local
 * server the scheme has to be normalised or every cross-host link dies as an
 * SSL error and reads as a broken link. Both handled below; both were real
 * traps in the sibling scripts before they were.
 *
 * ── EXTERNAL LINKS ARE A DIFFERENT KIND OF QUESTION ──────────────────────
 * The blog carries ~120 citations, mostly NHS, PubMed, DOI resolvers and
 * journals. Those hosts rate-limit and block datacentre user agents as a matter
 * of policy, so 403 / 429 / timeout says nothing about whether the link is
 * good. ONLY 404, 410 and DNS failure are treated as failures; everything else
 * prints as UNVERIFIED and does not touch the exit code. `--strict-external`
 * promotes them for a human who is investigating. External checking is off by
 * default and out of every chain, because it is slow and flaky and a gate that
 * is slow and flaky stops being run.
 *
 * ⚠ `--routes` UNDER GIT BASH NEEDS `MSYS_NO_PATHCONV=1`. MSYS rewrites any
 * shell argument beginning with `/` into a Windows path before the script sees
 * it, so `--routes /kits,/blog` arrives as
 * `C:/Program Files/Git/kits,/blog` and silently measures ONE route while
 * reporting "1 of 1 routes" — a subset that looks like a complete run. This is
 * the documented repo-wide trap; it bit this script on its first invocation.
 * Either prefix the command or quote nothing and pass paths without the
 * leading slash.
 *
 * Usage:
 *   node scripts/audit-link-integrity.js
 *   MSYS_NO_PATHCONV=1 node scripts/audit-link-integrity.js --routes "/blog,/kits" --verbose
 *   node scripts/audit-link-integrity.js --external
 *   node scripts/audit-link-integrity.js --external-only
 *   node scripts/audit-link-integrity.js --strict-external
 *   node scripts/audit-link-integrity.js --base http://localhost:3100
 *   node scripts/audit-link-integrity.js --concurrency 6 --timeout 15000
 *
 * Exit: 0 clean · 1 a real link defect · 2 the probe could not run.
 */
'use strict'

const http = require('http')
const https = require('https')

const {
  discoverRoutes, SYNTHETIC, FLAG_GATED, TOKEN_GATED, hrefFor,
  onAppHost, hostRouting, browserDriver, chromePath, die,
} = require('./route-list.js')
const { CONTRACT } = require('./redirect-contract.js')
const { walkToRest } = require('./page-walk.js')
const { articleSlugs } = require('./article-corpus.js')

/* ------------------------------------------------------------- arguments */

const argv = process.argv.slice(2)
const opt = (f, d = null) => {
  const i = argv.indexOf(f)
  return i === -1 || i === argv.length - 1 ? d : argv[i + 1]
}
const has = (f) => argv.includes(f)

if (has('--help') || has('-h')) {
  const src = require('fs').readFileSync(__filename, 'utf8')
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n')
  process.exit(0)
}

const BASE = (opt('--base', 'http://localhost:3000')).replace(/\/+$/, '')
const ONLY_ROUTES = opt('--routes', null)
const VERBOSE = has('--verbose')
const WANT_EXTERNAL = has('--external') || has('--external-only')
const EXTERNAL_ONLY = has('--external-only')
const STRICT_EXTERNAL = has('--strict-external')
const CONCURRENCY = parseInt(opt('--concurrency', '6'), 10)
const TIMEOUT = parseInt(opt('--timeout', '15000'), 10)

const routing = hostRouting(BASE)
const BASE_ORIGIN = new URL(BASE).origin

/* Floors are DISARMED by --routes, because a subset legitimately harvests less.
   Same reasoning audit-rendered-markup.js already applies. */
const FLOORS_ARMED = !ONLY_ROUTES

/* ------------------------------------------------------------- reporting */

let hard = 0
const findings = []
const addFail = (msg, detail) => { hard++; findings.push({ msg, detail }) }
const bail = (m) => { console.error(`\n🔴 CANNOT RUN: ${m}`); process.exit(2) }

/* ---------------------------------------------------------------- client */

function head(url, hostHeader) {
  return new Promise((resolve) => {
    let u
    try { u = new URL(url) } catch { return resolve({ status: 0, error: 'invalid URL' }) }
    const mod = u.protocol === 'https:' ? https : http
    const r = mod.request({
      protocol: u.protocol, hostname: u.hostname, port: u.port,
      path: u.pathname + u.search, method: 'GET',
      headers: {
        // A browser-shaped UA, because several of the citation hosts serve a
        // hard 403 to anything that looks automated and that is not evidence
        // about the link.
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
        accept: 'text/html,*/*',
        'accept-encoding': 'identity',
        ...(hostHeader ? { host: hostHeader } : {}),
      },
    }, (res) => {
      res.resume() // drain; we only need the status line
      resolve({ status: res.statusCode || 0, location: res.headers.location || null })
    })
    r.on('error', (e) => resolve({ status: 0, error: e.code || e.message }))
    r.setTimeout(TIMEOUT, () => r.destroy(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })))
    r.end()
  })
}

/**
 * Where to actually CONNECT for an own-site URL, and what Host to claim.
 *
 * 🔴 `app.andro-prime.com` IS A REAL DOMAIN THAT RESOLVES TO PRODUCTION. Chrome
 * gets `--host-resolver-rules` from route-list.js and is redirected locally;
 * node's http client does not, so connecting to that hostname reaches the LIVE
 * SITE. The first version of this function kept the hostname and only swapped
 * the scheme and port, which sent every cross-host link check to production and
 * timed out — a link reported as broken because the checker left the building.
 *
 * So: connect to the local server's authority, and claim the app hostname in
 * the Host header, which is what the middleware reads. Same mechanism
 * verify-http-contract.ts uses.
 */
function connectTo(url) {
  const u = new URL(url)
  if (u.hostname === routing.appHostname) {
    return { url: `${BASE}${u.pathname}${u.search}`, host: routing.appHostname }
  }
  return { url, host: undefined }
}

/* Every published article path, from the sitemap — the site's own answer.
   Moved to scripts/article-corpus.js on 2026-09-15 so audit-runtime-errors.js
   can expand the same corpus from the same resolver instead of a second copy. */

/* --------------------------------------------------------------- harvest */

async function harvest() {
  const driver = browserDriver()
  const browser = await driver.launch({
    executablePath: chromePath(),
    headless: 'new',
    args: ['--hide-scrollbars', '--disable-gpu', ...routing.resolverArgs],
  })

  let routes = discoverRoutes()
    .map((r) => ({ url: r.url, file: r.file }))
    .concat(SYNTHETIC.map((s) => ({ url: s.url, file: s.file, href: s.href, expectStatus: s.expectStatus })))

  /* 🔴 THE CORPUS, NOT THE SAMPLE — BUT ONLY WHEN IT MATTERS.
     `route-list.js` renders ONE article for `/blog/[slug]`, which is right for
     a conformance count and wrong for citations: the ~120 external links are
     spread across 18 articles, so a sample of one harvested 9 of them and the
     floor would have called that a collapsed corpus. This is the same shape as
     defect M7, where a dynamic route collapsed seventeen articles into one URL.
     Expanded only under --external, because rendering 18 more pages to re-check
     the same internal nav on each is 18 page loads for nothing. */
  if (WANT_EXTERNAL) {
    const slugs = await articleSlugs({ base: BASE, timeout: TIMEOUT })
    if (slugs.length < 5) bail(`only ${slugs.length} article slugs found in the sitemap; external coverage would be a sample pretending to be a corpus.`)
    routes = routes.filter((r) => r.url !== '/blog/[slug]')
      .concat(slugs.map((p) => ({ url: p, file: 'app/(marketing)/blog/[slug]/page.tsx', href: p })))
    console.log(`  expanded /blog/[slug] to all ${slugs.length} published articles for citation coverage\n`)
  }

  if (ONLY_ROUTES) {
    const want = new Set(ONLY_ROUTES.split(',').map((s) => s.trim()))
    routes = routes.filter((r) => want.has(r.url))
    if (!routes.length) bail(`--routes matched no known route. Known: ${discoverRoutes().map((r) => r.url).join(' ')}`)
  }

  const anchors = []          // {from, href, text, raw}
  const idsByPath = new Map() // path -> Set(id)
  const notMeasured = []
  let measured = 0

  for (const r of routes) {
    const href = r.href || hrefFor(r.url, 'audit-link-integrity')
    const origin = onAppHost(r.url) ? routing.appFetchOrigin : BASE
    const page = await browser.newPage()
    await page.setViewport({ width: 1320, height: 1100 })
    // setCacheEnabled(false): Chrome answers a revisited route 304, and a status test written as === 200 reads that as a failure. Root-cause fix; see audit-rendered-markup.js.
    await page.setCacheEnabled(false)
    // The cookie banner is `fixed` and overlays nothing we measure, but seeding
    // consent keeps the DOM in one deterministic state across runs.
    await page.evaluateOnNewDocument(() => {
      try { localStorage.setItem('ap_cookie_consent', 'denied') } catch { /* private mode */ }
    })
    /* 🔴 THIRD-PARTY RESOURCES ARE BLOCKED DURING HARVEST, AND THAT IS NOT AN
       OPTIMISATION. Links are read out of the DOM, not off the network, so
       fonts.googleapis.com and images.unsplash.com contribute nothing to what
       is being measured — but waiting for them made a 48-route sweep take tens
       of minutes, because a resource that never settles burns the full
       navigation timeout on every page that references it. The hrefs of
       external links are still harvested: an <a href> exists in the markup
       whether or not anything was fetched from that host. Whether those hosts
       ANSWER is the --external pass's question, asked there with a plain HTTP
       client rather than by making 48 page loads wait. */
    await page.setRequestInterception(true)
    page.on('request', (rq) => {
      const h = (() => { try { return new URL(rq.url()).hostname } catch { return '' } })()
      if (h && h !== new URL(BASE).hostname && h !== routing.appHostname) { rq.abort().catch(() => {}); return }
      rq.continue().catch(() => {})
    })

    let status = 0
    try {
      /* `domcontentloaded`, not `networkidle2`: the links are in the served
         markup and the RSC payload, and walkToRest below is what brings the
         lazy content in. networkidle2 waits for a quiet network, which on a
         page with a video poster or a lazy image is a wait for nothing. */
      const res = await page.goto(origin + href, { waitUntil: 'domcontentloaded', timeout: 20000 })
      status = res ? res.status() : 0
    } catch (e) {
      notMeasured.push(`${r.url}: navigation failed (${e.message.split('\n')[0]})`)
      await page.close(); continue
    }

    // A 404 on a flag- or token-gated route is the design, not a defect. A 404
    // anywhere else means this route rendered nothing and must not be counted
    // as clean.
    if (status === 404 && r.expectStatus !== 404) {
      if (r.url in FLAG_GATED) { notMeasured.push(`${r.url}: 404 by design — needs ${FLAG_GATED[r.url]}`); await page.close(); continue }
      if (r.url in TOKEN_GATED) { notMeasured.push(`${r.url}: 404 by design — ${TOKEN_GATED[r.url]}`); await page.close(); continue }
      notMeasured.push(`${r.url}: returned 404`)
      await page.close(); continue
    }
    /* An auth-gated route serves the login page to an anonymous client. Its
       links are the login page's links, not this route's, so harvesting them
       would attribute one page's links to another.

       🔴 304 IS NOT A REDIRECT. Chrome reports `304 Not Modified` when it
       serves from its own cache, and the first version of this range check
       swallowed it: `/kits` and `/activate` were both reported as "redirected
       (304) for an anonymous client" and silently dropped from a sweep that
       then called itself complete. A 304 means the page is exactly what we
       already have, which is the opposite of unmeasurable. */
    if (status === 304) { /* cached — the page is served, carry on */ }
    else if (status >= 300 && status < 400) { notMeasured.push(`${r.url}: redirected (${status}) for an anonymous client`); await page.close(); continue }

    await walkToRest(page)

    const got = await page.evaluate(() => {
      const out = []
      for (const a of document.querySelectorAll('a[href]')) {
        out.push({
          href: a.href,                                  // fully resolved by the browser
          raw: a.getAttribute('href'),
          text: (a.textContent || '').trim().slice(0, 60),
        })
      }
      const ids = []
      for (const el of document.querySelectorAll('[id]')) ids.push(el.id)
      for (const el of document.querySelectorAll('a[name]')) ids.push(el.getAttribute('name'))
      return { links: out, ids }
    })

    idsByPath.set(href, new Set(got.ids))
    for (const l of got.links) anchors.push({ from: r.url, ...l })
    measured++
    if (VERBOSE) console.log(`  · ${r.url}: ${got.links.length} links, ${got.ids.length} ids`)

    // Every page wears the nav, so a route with no links did not render.
    if (!got.links.length) addFail(`${r.url} rendered zero links. Every page wears the nav, so this page did not render.`)

    await page.close()
  }

  await browser.close()
  return { anchors, idsByPath, notMeasured, measured, routeCount: routes.length }
}

/* ------------------------------------------------------------- classify */

function classify(anchors) {
  const internal = new Map()   // path -> [{from, text}]
  const fragments = []          // {from, path, frag, text}
  const external = new Map()    // url -> [{from, text}]
  const inert = []              // href="#" / "" / javascript:
  const mailtel = []

  for (const a of anchors) {
    const raw = (a.raw || '').trim()
    if (raw === '' || raw === '#' || /^javascript:/i.test(raw)) { inert.push(a); continue }
    if (/^(mailto|tel):/i.test(raw)) { mailtel.push(a); continue }

    let u
    try { u = new URL(a.href) } catch { inert.push(a); continue }

    const isOwn = u.origin === BASE_ORIGIN || u.hostname === routing.appHostname
    if (!isOwn) {
      if (!external.has(u.href)) external.set(u.href, [])
      external.get(u.href).push(a)
      continue
    }

    const path = u.pathname.replace(/\/$/, '') || '/'
    if (u.hash) fragments.push({ from: a.from, path, frag: decodeURIComponent(u.hash.slice(1)), text: a.text })
    if (!u.hash || u.pathname) {
      const key = u.hostname === routing.appHostname ? `${u.protocol}//${u.hostname}${u.pathname}${u.search}` : path + u.search
      if (!internal.has(key)) internal.set(key, [])
      internal.get(key).push(a)
    }
  }
  return { internal, fragments, external, inert, mailtel }
}

/* -------------------------------------------------------------- resolve */

async function pool(items, worker, n) {
  const out = []
  let i = 0
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++
      out[k] = await worker(items[k], k)
    }
  }))
  return out
}

const declaredRedirect = (path) => CONTRACT.find((r) => r.from === path)

async function resolveInternal(internal) {
  const keys = [...internal.keys()]
  const results = await pool(keys, async (key) => {
    const isAbs = /^https?:\/\//.test(key)
    const { url: target, host } = isAbs ? connectTo(key) : { url: BASE + key, host: undefined }
    const pathOnly = isAbs ? new URL(key).pathname : key.split('?')[0]
    const r = await head(target, host)
    return { key, pathOnly, isAbs, ...r }
  }, CONCURRENCY)

  for (const r of results) {
    const sources = internal.get(r.key)
    const where = sources.slice(0, 3).map((s) => `${s.from} ("${s.text}")`).join(', ')
    const more = sources.length > 3 ? ` and ${sources.length - 3} more` : ''

    /* The synthetic 404 probe is the href that REACHES /not-found; it is meant
       to 404 and the 404 page's own skip link points back at it. Treating it as
       a broken link reports the instrument as a defect. */
    if (SYNTHETIC.some((s) => s.href === r.key && s.expectStatus === r.status)) continue

    if (r.status === 0) { addFail(`${r.key} could not be fetched (${r.error})`, `linked from ${where}${more}`); continue }
    if (r.status === 200 || r.status === 304) continue

    if (r.status >= 300 && r.status < 400) {
      const declared = declaredRedirect(r.pathOnly)
      if (declared && declared.status === r.status) continue

      /* A cross-host bounce that KEEPS THE PATHNAME is the two-host routing
         working, and it happens in BOTH directions:
           - apex -> app host, for a path lib/hosts.ts calls an app path;
           - app host -> apex, for everything else.
         The first version only exempted the first direction, so every footer
         link on /order/confirmed and /subscription/confirmed — which are served
         on the app host and link to /about, /faq, /terms with relative hrefs —
         was reported as an undeclared redirect. Sixteen findings, all of them
         the routing doing exactly what it is for. */
      if (r.location) {
        let loc
        try { loc = new URL(r.location, BASE) } catch { loc = null }
        const samePath = loc && loc.pathname.replace(/\/$/, '') === r.pathOnly.replace(/\/$/, '')
        if (samePath && loc) {
          const wentToApp = loc.hostname === routing.appHostname
          const predictedApp = onAppHost(r.pathOnly)
          // Either direction, as long as it agrees with lib/hosts.ts.
          if (wentToApp === predictedApp) continue
        }
        // An auth-gated route bouncing an anonymous client to login is the gate
        // working, not a broken link.
        if (loc && /\/auth\/login/.test(loc.pathname)) continue
      }
      addFail(`${r.key} returns an UNDECLARED ${r.status} -> ${r.location || '(no Location)'}`,
        `linked from ${where}${more}\nA redirect nobody wrote down is either a typo in the href or an undocumented rule. Add a redirect-contract.js row, or fix the link.`)
      continue
    }
    addFail(`${r.key} returns ${r.status}`, `linked from ${where}${more}`)
  }
  return results.length
}

async function resolveFragments(fragments, idsByPath, browser) {
  // Same-page fragments resolve against the page we already harvested.
  const needed = new Map()
  for (const f of fragments) {
    if (!f.frag) continue
    if (idsByPath.has(f.path)) {
      if (!idsByPath.get(f.path).has(f.frag)) {
        addFail(`fragment #${f.frag} does not exist on ${f.path}`, `linked from ${f.from} ("${f.text}")`)
      }
      continue
    }
    if (!needed.has(f.path)) needed.set(f.path, [])
    needed.get(f.path).push(f)
  }

  // A target outside the measured set gets one id-only render. Bounded at one
  // hop: an unbounded crawl finds the same 404 forty times and becomes a
  // rate-limiter rather than a check.
  for (const [path, list] of needed) {
    const page = await browser.newPage()
    try {
      const origin = onAppHost(path) ? routing.appFetchOrigin : BASE
      const res = await page.goto(origin + path, { waitUntil: 'domcontentloaded', timeout: 20000 })
      if (!res || res.status() !== 200) { await page.close(); continue }
      const ids = new Set(await page.evaluate(() => [...document.querySelectorAll('[id]')].map((e) => e.id)))
      for (const f of list) {
        if (!ids.has(f.frag)) addFail(`fragment #${f.frag} does not exist on ${f.path}`, `linked from ${f.from} ("${f.text}")`)
      }
    } catch { /* the path itself is covered by the internal resolve */ }
    await page.close()
  }
}

async function resolveExternal(external) {
  const keys = [...external.keys()]
  const results = await pool(keys, async (url) => ({ url, ...(await head(url)) }), Math.min(CONCURRENCY, 4))
  const unverified = []
  for (const r of results) {
    const sources = external.get(r.url)
    const where = sources.slice(0, 2).map((s) => s.from).join(', ')
    if (r.status === 404 || r.status === 410) { addFail(`EXTERNAL ${r.url} returns ${r.status}`, `cited from ${where}`); continue }
    if (r.status === 0 && /ENOTFOUND|EAI_AGAIN/.test(String(r.error))) { addFail(`EXTERNAL ${r.url} does not resolve (${r.error})`, `cited from ${where}`); continue }
    if (r.status === 200 || (r.status >= 300 && r.status < 400)) continue
    // 403 / 429 / 503 / timeout: policy, not evidence about the link.
    unverified.push(`${r.status || r.error}  ${r.url}`)
    if (STRICT_EXTERNAL) addFail(`EXTERNAL ${r.url} returned ${r.status || r.error} (--strict-external)`, `cited from ${where}`)
  }
  return { checked: results.length, unverified }
}

/* ----------------------------------------------------------------- main */

async function main() {
  console.log('Link integrity\n')
  console.log(`  base   ${BASE}`)
  if (routing.note) console.log(`  hosts  ${routing.note}`)
  console.log(`  mode   internal${WANT_EXTERNAL ? ' + external' : ''}${EXTERNAL_ONLY ? ' (external only)' : ''}`)
  console.log()

  const { anchors, idsByPath, notMeasured, measured, routeCount } = await harvest()

  const { internal, fragments, external, inert, mailtel } = classify(anchors)

  console.log(`  harvested ${anchors.length} anchors from ${measured} of ${routeCount} routes`)
  console.log(`            ${internal.size} distinct internal targets · ${fragments.length} fragment links · ${external.size} distinct external URLs`)
  if (inert.length) console.log(`            ${inert.length} inert href (# or empty or javascript:)`)
  if (mailtel.length) console.log(`            ${mailtel.length} mailto:/tel: (shape only, never fetched)`)
  console.log()

  /* FLOORS. A harvest that collapses passes every per-link assertion, so the
     size of what was measured is asserted before anything is concluded from it. */
  if (FLOORS_ARMED) {
    if (anchors.length < 400) bail(`only ${anchors.length} anchors harvested; a full sweep of this site yields several hundred. The harvest, not the site, is what failed.`)
    if (internal.size < 25) bail(`only ${internal.size} distinct internal targets; expected 25+.`)
    if (WANT_EXTERNAL && external.size < 60) bail(`only ${external.size} distinct external URLs; the blog corpus alone cites ~120, so the article bodies did not render.`)
  }

  if (notMeasured.length) {
    console.log('  NOT MEASURED:')
    for (const n of notMeasured) console.log(`    - ${n}`)
    console.log()
  }

  if (!EXTERNAL_ONLY) {
    const n = await resolveInternal(internal)
    console.log(`  resolved ${n} distinct internal targets`)

    const driver = browserDriver()
    const browser = await driver.launch({ executablePath: chromePath(), headless: 'new', args: ['--hide-scrollbars', ...routing.resolverArgs] })
    await resolveFragments(fragments, idsByPath, browser)
    await browser.close()
    console.log(`  resolved ${fragments.length} fragment links against their targets' real id sets`)
  }

  if (WANT_EXTERNAL) {
    const { checked, unverified } = await resolveExternal(external)
    console.log(`  resolved ${checked} external URLs`)
    if (unverified.length) {
      console.log(`\n  UNVERIFIED (${unverified.length}) — blocked, rate-limited or slow. NOT failures:`)
      for (const u of unverified.slice(0, 20)) console.log(`    ${u}`)
      if (unverified.length > 20) console.log(`    ...and ${unverified.length - 20} more`)
    }
  }

  console.log()
  if (findings.length) {
    console.log(`🔴 ${findings.length} link defect(s):\n`)
    for (const f of findings) {
      console.log(`  ✗ ${f.msg}`)
      if (f.detail) for (const l of f.detail.split('\n')) console.log(`      ${l}`)
    }
    process.exit(1)
  }
  console.log(`🟢 no broken links. ${internal.size} internal targets, ${fragments.length} fragments${WANT_EXTERNAL ? `, ${external.size} external` : ''} — all resolved.`)
  if (!WANT_EXTERNAL) console.log('   External citations were NOT checked. Run with --external-only for those.')
}

main().catch((e) => bail(e.stack || String(e)))
