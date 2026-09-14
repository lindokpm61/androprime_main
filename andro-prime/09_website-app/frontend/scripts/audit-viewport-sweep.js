#!/usr/bin/env node
/**
 * Every route at every breakpoint: horizontal overflow, and light-ground contrast.
 *
 * ── TWO GAPS, ONE PAGE LOAD ───────────────────────────────────────────────
 * `shot.js` asserts overflow per capture, which is right for a human looking at
 * one picture and useless as a gate: nothing walks routes x widths, so a layout
 * that breaks only at 390 breaks silently. And `audit-dark-contrast.js` opens by
 * saying light-ground contrast "is a separate sweep" — that sweep was never
 * built, so the ~90% of this site that is ink-on-paper has never been measured.
 *
 * They are merged because the page load is the expensive part and because the
 * contrast REQUIREMENT itself moves with the viewport: the `f-` type ramps are
 * `clamp()`-based, so a heading that is 26px at 1320 (large text, needs 3.0) can
 * be 21px at 390 (needs 4.5). Measuring contrast at one width and overflow at
 * three would miss exactly the cells where the two interact.
 *
 * ── THE FALSE POSITIVE THAT WOULD HAVE KILLED THIS CHECK ─────────────────
 * Chrome must launch with `--hide-scrollbars`. Without it the Direction F
 * full-bleed idiom (`width: 100vw` with a negative margin) overflows by the
 * scrollbar width on EVERY page, and the first run reports the entire site as
 * broken. A check that cries wolf on correct markup is a check somebody
 * switches off, taking the half that worked with it. It is a launch flag rather
 * than an option for that reason.
 *
 * Overflow exclusions are computed, never listed: an element inside an ancestor
 * with `overflow-x: auto|scroll|hidden` is in a deliberate scroller and is
 * correct. That lives in `page-walk.js` so this script and any future one agree.
 *
 * ── WHAT THIS CANNOT SEE, PRINTED ON EVERY RUN ───────────────────────────
 * The contrast probe reads `backgroundColor` only, so TEXT OVER AN IMAGE is
 * invisible to it — and to `audit-dark-contrast.js`, which has always had the
 * same blind spot and never said so. A reader told "0 failures" and not told
 * what was not looked at will draw the wrong conclusion, and this is the single
 * most likely place a real contrast defect hides from both sweeps.
 *
 * ── NOT IN test:design:live, DELIBERATELY ────────────────────────────────
 * 48 routes x 3 widths is ~144 page loads and eight to twelve minutes. A gate
 * that slow stops being run, so it has its own `test:design:sweep` and sits in
 * the pre-merge chain rather than the per-change one.
 *
 * Usage:
 *   node scripts/audit-viewport-sweep.js
 *   node scripts/audit-viewport-sweep.js --widths 390,1320
 *   node scripts/audit-viewport-sweep.js --only overflow
 *   node scripts/audit-viewport-sweep.js --only contrast
 *   MSYS_NO_PATHCONV=1 node scripts/audit-viewport-sweep.js --routes "/kits" --verbose
 *
 * Exit: 0 clean · 1 overflow or sub-AA text · 2 the probe could not run.
 */
'use strict'

const {
  discoverRoutes, SYNTHETIC, FLAG_GATED, TOKEN_GATED, hrefFor,
  onAppHost, hostRouting, browserDriver, chromePath,
} = require('./route-list.js')
const { walkToRest, diagnose, judgeDiagnosis } = require('./page-walk.js')
const { PROBE, GROUND, LIMITATION } = require('./contrast-probe.js')

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
const WIDTHS = (opt('--widths', '390,768,1320')).split(',').map((w) => parseInt(w.trim(), 10))
const ONLY = opt('--only', null)
const ONLY_ROUTES = opt('--routes', null)
const VERBOSE = has('--verbose')

const routing = hostRouting(BASE)
const bail = (m) => { console.error(`\n🔴 CANNOT RUN: ${m}`); process.exit(2) }

/* The ratchet, same shape as the sibling sweeps: dated, shrinking, with a
   reason a human wrote. EMPTY on 2026-09-14. */
const ALLOW = {}

/* ------------------------------------------------------------------ main */

async function main() {
  console.log('Viewport sweep: overflow and light-ground contrast\n')
  console.log(`  base    ${BASE}`)
  if (routing.note) console.log(`  hosts   ${routing.note}`)
  console.log(`  widths  ${WIDTHS.join(', ')}`)
  console.log(`  ⚠ ${LIMITATION}`)
  console.log()

  const driver = browserDriver()
  const browser = await driver.launch({
    executablePath: chromePath(),
    headless: 'new',
    // --hide-scrollbars is load-bearing; see the header.
    args: ['--hide-scrollbars', '--disable-gpu', ...routing.resolverArgs],
  })

  let routes = discoverRoutes().concat(SYNTHETIC.map((s) => ({ url: s.url, file: s.file, href: s.href })))
  if (ONLY_ROUTES) {
    const want = new Set(ONLY_ROUTES.split(',').map((s) => s.trim()))
    routes = routes.filter((r) => want.has(r.url))
    if (!routes.length) { await browser.close(); return bail('--routes matched no known route (under Git Bash, prefix MSYS_NO_PATHCONV=1)') }
  }

  const overflow = []
  const contrast = []
  const notMeasured = []
  const broken = []
  let cells = 0

  for (const r of routes) {
    const href = r.href || hrefFor(r.url, 'audit-viewport-sweep')
    const origin = onAppHost(r.url) ? routing.appFetchOrigin : BASE

    for (const width of WIDTHS) {
      const page = await browser.newPage()
      await page.setViewport({ width, height: 1100 })
      // setCacheEnabled(false): Chrome answers a revisited route 304, and a status test written as === 200 reads that as a failure. Root-cause fix; see audit-rendered-markup.js.
      await page.setCacheEnabled(false)
      /* 🔴 REDUCED MOTION IS EMULATED, AND IT IS THE MECHANISM RATHER THAN A TRICK.
         `.f-rise` is hidden only under `.js`, and this design system honours
         `prefers-reduced-motion: reduce` by never adding `.js` at all — see the
         @layer reveal block and the belt-and-braces media query in
         f-primitives.css. So under reduced motion every element renders AT REST,
         by design, which is exactly the state a contrast measurement needs.

         Without this the first full run reported four "contrast failures" at
         a ratio of 1:1 — foreground identical to background, which is not a
         colour defect, it is an element at opacity 0 that the scroll walk had
         not reached at that width. They appeared at 390 and 768 and vanished at
         1320, which is the tell: a real colour problem does not care how wide
         the window is. `shot.js` has emulated this by default since it was
         written, for the same reason and after the same confusion. */
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
      await page.evaluateOnNewDocument(() => {
        try { localStorage.setItem('ap_cookie_consent', 'denied') } catch { /* private mode */ }
      })
      let status = 0
      try {
        const res = await page.goto(origin + href, { waitUntil: 'domcontentloaded', timeout: 25000 })
        status = res ? res.status() : 0
      } catch (e) {
        notMeasured.push(`${r.url} @${width}: navigation failed (${e.message.split('\n')[0]})`)
        await page.close(); continue
      }
      if (status === 304) { /* cached and served */ }
      else if (status >= 300 && status < 400) { notMeasured.push(`${r.url} @${width}: redirected (${status}) for an anonymous client`); await page.close(); continue }
      else if (status === 404 && r.url !== '/not-found') {
        const why = FLAG_GATED[r.url] ? `needs ${FLAG_GATED[r.url]}` : TOKEN_GATED[r.url] ? TOKEN_GATED[r.url] : 'returned 404'
        notMeasured.push(`${r.url} @${width}: ${why}`)
        await page.close(); continue
      }

      await walkToRest(page)
      const d = await diagnose(page)
      const verdicts = judgeDiagnosis(d, width)

      // "the measurement is untrustworthy" is a different outcome from "the page
      // is wrong", and conflating them is how a tooling fault gets filed as a
      // CSS regression.
      const brokenHere = verdicts.filter((v) => v.level === 'broken')
      if (brokenHere.length) {
        for (const b of brokenHere) broken.push(`${r.url} @${width}: ${b.message}`)
        await page.close(); continue
      }

      cells++
      if (!ONLY || ONLY === 'overflow') {
        for (const v of verdicts.filter((x) => x.level === 'defect')) overflow.push(`${r.url} @${width}: ${v.message}`)
      }

      let examined = 0
      if (!ONLY || ONLY === 'contrast') {
        const res = await page.evaluate(PROBE, GROUND.light)
        examined = (res && res.examined) || 0
        /* 🔴 THE FAULT IS ZERO, NOT "FEWER THAN TWENTY". The first version set an
           absolute floor of 20 and failed 33 cells with it — every `/auth/*`
           page, `/go`, both internal boards. None of them was broken: an auth
           card legitimately owns about fifteen text-bearing elements (a heading,
           a standfirst, three labels, a button, four cross-links) and `/go`'s
           empty-state owns seven. The floor had been calibrated on the marketing
           pages, which own 127 to 134, and a number taken from one population
           does not transfer to another.

           It was also comparing two different units against one threshold:
           `diagnose().textNodes` counts non-empty TEXT NODES, while this counts
           ELEMENTS THAT OWN text, and the second is always much smaller. So the
           whole-page "did it render" question already has an answer, from
           judgeDiagnosis, which passed these cells. Given that, the only thing
           this count can still tell us is whether the probe reached the DOM at
           all — and that is zero-versus-nonzero. */
        if (examined === 0 && d.textNodes > 0) {
          broken.push(`${r.url} @${width}: the page has ${d.textNodes} text nodes and the contrast probe examined 0 — the probe did not reach the DOM`)
        } else {
          for (const b of res.findings) contrast.push(`${r.url} @${width}: ${b.tag}.${b.cls} ${b.ratio}:1 (needs ${b.need}) ${b.size}px "${b.text}" ${b.color} on ${b.bg}`)
        }
      }

      if (VERBOSE) console.log(`  · ${r.url} @${width}: ${d.scrollWidth}px wide, ${examined} text nodes, ${d.excusedInScrollers} excused in scrollers`)
      await page.close()
    }
  }

  /* -------------------------------------------------- the positive control */

  // Plant both defects on a real page and assert both probes find them. A sweep
  // that finds nothing has two explanations and one is that it cannot see.
  const page = await browser.newPage()
  await page.setViewport({ width: 1320, height: 1100 })
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {})
  await page.evaluate(() => {
    const bad = document.createElement('p')
    bad.id = '__probe_contrast__'
    bad.textContent = 'planted low contrast sample text for the control'
    bad.style.cssText = 'color:#ff8888;background:#ffffff;font-size:14px'
    document.body.appendChild(bad)
    const wide = document.createElement('div')
    wide.id = '__probe_overflow__'
    wide.style.cssText = 'width:200vw;height:8px;background:#000'
    document.body.appendChild(wide)
  })
  const ctlDiag = await diagnose(page)
  const ctlContrast = await page.evaluate(PROBE, GROUND.light)
  await page.close()
  await browser.close()

  const sawOverflow = ctlDiag && ctlDiag.scrollWidth > ctlDiag.innerWidth + 1
  const sawContrast = ctlContrast && Array.isArray(ctlContrast.findings)
    && ctlContrast.findings.some((c) => /planted low contrast/.test(c.text))
    && ctlContrast.examined >= 20
  if (!sawOverflow || !sawContrast) {
    return bail(`positive control failed: overflow ${sawOverflow ? 'seen' : 'MISSED'}, low contrast ${sawContrast ? 'seen' : 'MISSED'}.\n  The probes cannot find defects planted deliberately, so every clean cell above proves nothing.`)
  }

  /* ----------------------------------------------------------- the verdict */

  const planned = routes.length * WIDTHS.length
  console.log(`\n  ${routes.length} routes x ${WIDTHS.length} widths = ${planned} cells; ${cells} measured`)
  if (notMeasured.length) {
    console.log(`  NOT MEASURED (${notMeasured.length}):`)
    for (const n of notMeasured) console.log(`    - ${n}`)
  }
  console.log('  ✓ positive control: both probes found a planted overflow and a planted 1.9:1 text node')
  console.log(`  ⚠ ${LIMITATION}`)
  console.log()

  if (broken.length) {
    console.log(`🔴 ${broken.length} cell(s) could not be measured reliably:\n`)
    for (const b of broken) console.log(`  ! ${b}`)
    console.log('\n  These are measurement faults, not page defects. Fix them before reading the rest.')
    process.exit(2)
  }

  let failures = 0
  if (overflow.length) {
    failures += overflow.length
    console.log(`  ✗ HORIZONTAL OVERFLOW (${overflow.length}):\n`)
    for (const o of overflow) console.log(`  ${o}\n`)
  }
  if (contrast.length) {
    failures += contrast.length
    console.log(`  ✗ LIGHT-GROUND CONTRAST BELOW AA (${contrast.length}):\n`)
    for (const c of contrast.slice(0, 40)) console.log(`    ${c}`)
    if (contrast.length > 40) console.log(`    ...and ${contrast.length - 40} more`)
    console.log()
  }

  if (failures) { console.log(`🔴 ${failures} finding(s) across ${cells} measured cells.`); process.exit(1) }
  console.log(`🟢 no overflow and no sub-AA light-ground text across ${cells} cells.`)
}

main().catch((e) => bail(e.stack || String(e)))
