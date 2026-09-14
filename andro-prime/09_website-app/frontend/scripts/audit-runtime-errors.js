#!/usr/bin/env node
/**
 * Every route, loaded in a real browser, watched for errors nobody was watching.
 *
 * ── THE GAP ───────────────────────────────────────────────────────────────
 * `shot.js` prints page and console errors ONLY when the body has zero height —
 * that is, only once you already know something is catastrophically wrong. A
 * page that hydrates with a React key warning, throws inside an event handler,
 * or silently 404s its own JSON endpoint looks perfect in a screenshot and
 * scores full marks on `route-conformance.js`. Nothing collects those.
 *
 * ── THE "ROUTES THAT LEGITIMATELY LOG" PROBLEM, SOLVED BY CHOOSING ───────
 * The usual way to cope with noisy pages is an allowlist, and an allowlist wide
 * enough to absorb analytics chatter is wide enough to hide a real TypeError.
 * So this script removes the noise at the source instead:
 *
 *   - Consent is SEEDED, not left to chance: `ap_cookie_consent=denied` before
 *     the first navigation, so the page is in one deterministic state on every
 *     run. `--consent granted` runs the other arm.
 *   - Third-party origins are ABORTED by request interception. This checker's
 *     subject is our own errors; whether Google Tag Manager is reachable from
 *     this machine is a different question and belongs to the link checker.
 *     `--allow-third-party` includes them.
 *
 * With both, the allowlist starts EMPTY and stays a ratchet: dated, shrinking,
 * and a listed route that has gone clean is itself a failure, so entries cannot
 * quietly become permanent. Same shape `audit-rendered-markup.js` uses.
 *
 * ── WARNINGS ARE COUNTED, NOT GATED — WITH A NAMED EXCEPTION LIST ────────
 * React and Next emit legitimate `console.warn`, and a warn-level gate is the
 * fastest route to a check somebody switches off. But a handful of warn-level
 * texts are real defects wearing a warning's clothes — hydration mismatches
 * above all, which are invisible in a screenshot and change what the user sees.
 * Those are listed and they fail.
 *
 * ── THE POSITIVE CONTROL IS THE POINT ────────────────────────────────────
 * A sweep that finds no errors has two explanations and one of them is that the
 * recorder was never wired up. So after the sweep this script plants a
 * console.error, a thrown exception and a 404 on about:blank and asserts it
 * catches all three. If it cannot see a defect it created deliberately, every
 * clean route above is meaningless and the exit code is 2, not 0.
 *
 * Usage:
 *   node scripts/audit-runtime-errors.js
 *   MSYS_NO_PATHCONV=1 node scripts/audit-runtime-errors.js --routes "/demo,/blog" --verbose
 *   node scripts/audit-runtime-errors.js --consent granted
 *   node scripts/audit-runtime-errors.js --allow-third-party
 *   node scripts/audit-runtime-errors.js --warn-strict --settle 1500
 *
 * Exit: 0 clean · 1 real errors · 2 the probe could not run.
 */
'use strict'

const {
  discoverRoutes, SYNTHETIC, FLAG_GATED, TOKEN_GATED, hrefFor,
  onAppHost, hostRouting, browserDriver, chromePath,
} = require('./route-list.js')
const { walkToRest, diagnose } = require('./page-walk.js')

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
const CONSENT = opt('--consent', 'denied')
const ALLOW_THIRD_PARTY = has('--allow-third-party')
const WARN_STRICT = has('--warn-strict')
const SETTLE = parseInt(opt('--settle', '800'), 10)

const routing = hostRouting(BASE)
const OWN_HOSTS = new Set([new URL(BASE).hostname, routing.appHostname])

/* ------------------------------------------------------------- allowlist */

/**
 * The ratchet. `{ route: { since, max, why } }` — `max` is the number of
 * first-party findings tolerated on that route, lowered and never raised. A
 * route listed here that has gone CLEAN is a failure: the entry is stale and
 * leaving it teaches the next reader to trust a check that stopped checking.
 *
 * EMPTY on 2026-09-14, deliberately. If it needs an entry, the entry needs a
 * reason a human wrote.
 */
const ALLOW = {}

/**
 * Warn-level texts that are real defects. A hydration mismatch is the reason
 * this list exists: it logs at warn, it is invisible in a screenshot, and it
 * means the server and the client disagreed about what the user should see.
 */
const WARN_IS_DEFECT = [
  /hydration failed/i,
  /did not match/i,
  /text content does not match/i,
  /unique "?key"? prop/i,
  /validateDOMNesting/i,
  /cannot update a component/i,
  /maximum update depth/i,
]

/* ------------------------------------------------------------- reporting */

const bail = (m) => { console.error(`\n🔴 CANNOT RUN: ${m}`); process.exit(2) }

/* ------------------------------------------------------------------ core */

/**
 * Attach every recorder to a page and return the collector.
 *
 * `expectStatus` is the synthetic-route escape hatch: `/not-found` is REACHED by
 * requesting a path that matches nothing, so a 404 on its own href is the route
 * working. Without this the instrument reports itself as a defect.
 */
function record(page, expect = {}) {
  const errors = []   // hard
  const warns = []    // counted
  const logs = { thirdPartyAborted: 0, responses: 0 }

  page.on('pageerror', (e) => errors.push({ kind: 'pageerror', text: `${e.message.split('\n')[0]}` }))
  page.on('dialog', async (d) => {
    errors.push({ kind: 'dialog', text: `${d.type()}: ${d.message()}` })
    try { await d.dismiss() } catch { /* already gone */ }
  })
  page.on('console', (m) => {
    const type = m.type()
    const text = m.text()
    /* 🔴 ATTRIBUTE A CONSOLE ERROR TO ITS SOURCE, OR THIS CHECK REPORTS ITS OWN
       INTERFERENCE AS A DEFECT. Chrome logs `Failed to load resource:
       net::ERR_FAILED` for every request the harness aborts, and the message
       text carries NO url — so the first run of this script reported four
       identical errors on all 46 routes, every one of them a third-party
       request that this script had blocked itself. A checker whose own
       instrument generates the findings is worse than no checker: the noise is
       uniform, which makes it look like a real systemic defect.

       `m.location().url` is the resource that failed, which is the discriminator
       the message text lacks. Errors sourced off-origin are not this check's
       business; errors from our own scripts are exactly its business. This is
       attribution, not an allowlist — nothing is excused by name. */
    const src = m.location && m.location() ? m.location().url : ''
    const srcHost = safeHost(src)
    if (srcHost && !OWN_HOSTS.has(srcHost)) return
    if (expect.href && src.endsWith(expect.href)) return

    if (type === 'error') { errors.push({ kind: 'console.error', text, at: src }); return }
    if (type === 'warning') {
      if (WARN_IS_DEFECT.some((re) => re.test(text))) errors.push({ kind: 'console.warn (real defect)', text })
      else warns.push(text)
    }
    // log / info / debug are ignored entirely: they are diagnostics, not defects.
  })
  page.on('requestfailed', (r) => {
    const u = safeHost(r.url())
    if (!OWN_HOSTS.has(u)) return                     // third party, not our business
    const t = r.failure() && r.failure().errorText
    // A request the page itself cancelled on navigation is not a failure.
    if (/ERR_ABORTED/.test(String(t))) return
    errors.push({ kind: 'requestfailed', text: `${t} ${r.url()}` })
  })
  page.on('response', (r) => {
    logs.responses++
    if (!OWN_HOSTS.has(safeHost(r.url()))) return
    const s = r.status()
    if (s >= 400) {
      // The synthetic 404 probe is how /not-found is reached; a 404 there is the
      // route working, and the matching console.error is Chrome narrating it.
      if (expect.status === s && r.url().endsWith(expect.href || ' ')) return
      errors.push({ kind: 'response', text: `${s} ${r.url()}` })
    }
  })
  return { errors, warns, logs }
}

function safeHost(u) { try { return new URL(u).hostname } catch { return '' } }

async function preparePage(browser) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1320, height: 1100 })
  // setCacheEnabled(false): Chrome answers a revisited route 304, and a status test written as === 200 reads that as a failure. Root-cause fix; see audit-rendered-markup.js.
  await page.setCacheEnabled(false)
  await page.evaluateOnNewDocument((consent) => {
    try { localStorage.setItem('ap_cookie_consent', consent) } catch { /* private mode */ }
  }, CONSENT)
  if (!ALLOW_THIRD_PARTY) {
    await page.setRequestInterception(true)
    page.on('request', (r) => {
      const h = safeHost(r.url())
      if (h && !OWN_HOSTS.has(h)) { r.abort().catch(() => {}); return }
      r.continue().catch(() => {})
    })
  }
  return page
}

/* -------------------------------------------------------- positive control */

async function positiveControl(browser) {
  const page = await preparePage(browser)
  const rec = record(page)
  await page.goto('about:blank')
  await page.evaluate(() => { console.error('__probe_console_error__') })
  await page.evaluate(() => { setTimeout(() => { throw new Error('__probe_pageerror__') }, 0) })
  await new Promise((r) => setTimeout(r, 400))
  await page.close()

  const sawConsole = rec.errors.some((e) => e.kind === 'console.error' && /__probe_console_error__/.test(e.text))
  const sawThrow = rec.errors.some((e) => e.kind === 'pageerror' && /__probe_pageerror__/.test(e.text))
  return { sawConsole, sawThrow }
}

/* ------------------------------------------------------------------ main */

async function main() {
  console.log('Runtime errors\n')
  console.log(`  base        ${BASE}`)
  if (routing.note) console.log(`  hosts       ${routing.note}`)
  console.log(`  consent     ${CONSENT} (seeded before first navigation, so the page state is chosen rather than incidental)`)
  console.log(`  third party ${ALLOW_THIRD_PARTY ? 'allowed' : 'aborted — this check is about OUR errors'}`)
  console.log()

  const driver = browserDriver()
  const browser = await driver.launch({
    executablePath: chromePath(), headless: 'new',
    args: ['--hide-scrollbars', '--disable-gpu', ...routing.resolverArgs],
  })

  // THE CONTROL RUNS FIRST. If the recorder cannot see a planted defect there
  // is no point measuring 48 routes with it.
  const ctl = await positiveControl(browser)
  if (!ctl.sawConsole || !ctl.sawThrow) {
    await browser.close()
    return bail(`the positive control failed: console.error ${ctl.sawConsole ? 'seen' : 'MISSED'}, thrown error ${ctl.sawThrow ? 'seen' : 'MISSED'}.\n  The recorder cannot see a defect it planted itself, so a clean sweep would prove nothing.`)
  }
  console.log('  ✓ positive control: the recorder catches a planted console.error and a planted throw\n')

  let routes = discoverRoutes().concat(SYNTHETIC.map((s) => ({ url: s.url, file: s.file, href: s.href })))
  if (ONLY_ROUTES) {
    const want = new Set(ONLY_ROUTES.split(',').map((s) => s.trim()))
    routes = routes.filter((r) => want.has(r.url))
    if (!routes.length) { await browser.close(); return bail('--routes matched no known route (under Git Bash, prefix MSYS_NO_PATHCONV=1)') }
  }

  const notMeasured = []
  const perRoute = []
  let measured = 0

  for (const r of routes) {
    const href = r.href || hrefFor(r.url, 'audit-runtime-errors')
    const origin = onAppHost(r.url) ? routing.appFetchOrigin : BASE
    const page = await preparePage(browser)
    const syn = SYNTHETIC.find((x) => x.url === r.url)
    const rec = record(page, syn ? { status: syn.expectStatus, href: syn.href } : {})
    let status = 0
    try {
      const res = await page.goto(origin + href, { waitUntil: 'networkidle2', timeout: 30000 })
      status = res ? res.status() : 0
    } catch (e) {
      notMeasured.push(`${r.url}: navigation failed (${e.message.split('\n')[0]})`)
      await page.close(); continue
    }

    /* 304 IS NOT A REDIRECT — it is Chrome serving from its own cache, and the
       page is exactly what we already have. Swallowing it into the 3xx range
       dropped /kits and /activate from a sweep that then called itself
       complete. Same defect as in audit-link-integrity.js. */
    if (status === 304) { /* cached, and served — carry on */ }
    else if (status >= 300 && status < 400) { notMeasured.push(`${r.url}: redirected (${status}) for an anonymous client`); await page.close(); continue }
    if (status === 404 && r.url !== '/not-found') {
      if (r.url in FLAG_GATED) notMeasured.push(`${r.url}: 404 by design — needs ${FLAG_GATED[r.url]}`)
      else if (r.url in TOKEN_GATED) notMeasured.push(`${r.url}: 404 by design — ${TOKEN_GATED[r.url]}`)
      else notMeasured.push(`${r.url}: returned 404`)
      await page.close(); continue
    }

    await walkToRest(page)
    await new Promise((res) => setTimeout(res, SETTLE))
    const d = await diagnose(page)
    await page.close()

    // A route that recorded no responses at all was not measured; it did not
    // pass. Same for one that rendered nothing.
    if (rec.logs.responses === 0) { notMeasured.push(`${r.url}: zero responses observed — not measured`); continue }
    if (!d || !d.bodyHeight) { notMeasured.push(`${r.url}: rendered no body — not measured`); continue }

    measured++
    perRoute.push({ url: r.url, errors: rec.errors, warns: rec.warns, responses: rec.logs.responses })
    if (VERBOSE) {
      console.log(`  · ${r.url}: ${rec.errors.length} error(s), ${rec.warns.length} warning(s), ${rec.logs.responses} responses`)
    }
  }

  await browser.close()

  /* ------------------------------------------------------------- verdict */

  console.log(`\n  measured ${measured} of ${routes.length} routes`)
  if (notMeasured.length) {
    console.log('  NOT MEASURED:')
    for (const n of notMeasured) console.log(`    - ${n}`)
  }
  console.log()

  let failures = 0
  let totalWarns = 0
  for (const p of perRoute) {
    totalWarns += p.warns.length
    const allowed = ALLOW[p.url] ? ALLOW[p.url].max : 0
    if (p.errors.length > allowed) {
      failures++
      console.log(`  ✗ ${p.url}: ${p.errors.length} error(s)${allowed ? ` (allowlist tolerates ${allowed})` : ''}`)
      for (const e of p.errors.slice(0, 8)) console.log(`      [${e.kind}] ${e.text}${e.at ? `\n          at ${e.at}` : ''}`)
      if (p.errors.length > 8) console.log(`      ...and ${p.errors.length - 8} more`)
    }
  }

  // A stale allowlist entry is a check that has stopped checking.
  for (const [url, entry] of Object.entries(ALLOW)) {
    const p = perRoute.find((x) => x.url === url)
    if (p && p.errors.length === 0) {
      failures++
      console.log(`  ✗ ALLOW carries ${url} (since ${entry.since}: ${entry.why}) and that route is now clean. Delete the entry.`)
    }
  }

  if (totalWarns) {
    console.log(`\n  ${totalWarns} console warning(s) across ${measured} routes — counted, not gated.`)
    if (WARN_STRICT) {
      const shown = perRoute.filter((p) => p.warns.length)
      for (const p of shown) for (const w of p.warns.slice(0, 5)) console.log(`      ${p.url}: ${w.slice(0, 160)}`)
    } else console.log('  (--warn-strict lists them; the named hydration/key/nesting warnings already fail above)')
  }

  console.log()
  if (failures) { console.log(`🔴 ${failures} route(s) with runtime errors.`); process.exit(1) }
  console.log(`🟢 no runtime errors across ${measured} routes.`)
  console.log('   The positive control confirmed the recorder sees planted defects, so this is a measurement, not a silence.')
}

main().catch((e) => bail(e.stack || String(e)))
