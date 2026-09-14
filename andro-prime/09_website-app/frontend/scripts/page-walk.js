#!/usr/bin/env node
/**
 * Bring a page to REST, then measure whether the measurement is trustworthy.
 *
 * ── WHY THIS IS SHARED ────────────────────────────────────────────────────
 * Every browser check in this repo needs the same two things before it can
 * believe anything it sees:
 *
 *   1. the page walked to the bottom and back, because scroll-triggered reveals
 *      start at `opacity: 0` and a headless browser never scrolls, so everything
 *      below the fold is captured in its pre-reveal state;
 *   2. a handful of integrity assertions that distinguish "the page is broken"
 *      from "the capture is broken" — which a picture, a class count or a
 *      contrast reading cannot do on its own.
 *
 * Both were written once, in `shot.js`, and proved there against four separate
 * "the page is broken" reports that were all tooling artefacts. Rather than
 * each new checker reimplementing them slightly differently, they live here.
 *
 * ⚠ HONESTY ABOUT THE DUPLICATION THIS DOES NOT REMOVE. `shot.js` still holds
 * its own copy and this module does not collapse it. That file lives in
 * `12_operations/automation/`, is invoked from other workspaces, and is guarded
 * by the hand-rolled-puppeteer hook; making it depend on `frontend/scripts/`
 * reverses its dependency direction, which is a decision rather than a
 * refactor. Named here rather than left for a reader to infer from silence.
 *
 * ── ONE DELIBERATE DIFFERENCE FROM shot.js ───────────────────────────────
 * `diagnose()` here excludes elements that overflow INSIDE a deliberate
 * horizontal scroller (an ancestor with `overflow-x: auto | scroll | hidden`).
 * A wide table in its own `overflow-x: auto` container is correct, not a
 * defect, and shot.js reports it because its check is per-capture and a human
 * reads the result. A sweep across 48 routes x 3 widths has no human in the
 * loop, and a check that cries wolf on correct markup is a check that gets
 * switched off. The exclusion is computed by walking ancestors, never by a
 * class allowlist, which would rot the first time a class was renamed.
 *
 * Exports:
 *   walkToRest(page)        scroll to the bottom in 70%-viewport steps and back
 *   diagnose(page)          integrity + overflow measurements, after the walk
 *   judgeDiagnosis(d, w)    turn a diagnosis into [{level, message}]
 */
'use strict'

const REVEAL_SELECTOR = '[class*="reveal"], [data-reveal], .f-reveal'

/**
 * Walk the page to the bottom and back so every IntersectionObserver has fired.
 * Never throws: a page that cannot be scrolled is a finding for diagnose(), not
 * an exception here.
 */
async function walkToRest(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms))
    const frame = () => new Promise((r) => requestAnimationFrame(() => r()))
    // Recomputed every step: a reveal can ADD height, and body.scrollHeight
    // under-reports when the scroll container is the documentElement, which
    // silently truncates the walk and leaves the tail unrevealed.
    const full = () => Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    )
    const step = Math.max(1, Math.round(window.innerHeight * 0.7))
    for (let y = 0; y <= full(); y += step) { window.scrollTo(0, y); await frame(); await pause(120) }
    window.scrollTo(0, full()); await frame(); await pause(200)
    // Back up: some observers only fire on entry from the other edge.
    for (let y = full(); y >= 0; y -= step) { window.scrollTo(0, y); await frame(); await pause(60) }
    window.scrollTo(0, 0); await frame(); await pause(200)
  }).catch(() => {})
}

/**
 * Measure the page AFTER walkToRest. Returns null only if the evaluate itself
 * failed, which is itself a finding — a null diagnosis must never be read as a
 * clean one.
 */
async function diagnose(page) {
  return page.evaluate((revealSel) => {
    const d = document.documentElement
    const name = (el) => {
      const id = el.id ? '#' + el.id : ''
      const cls = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
        : ''
      return el.tagName.toLowerCase() + id + cls
    }

    // Still-hidden reveal elements. After a full walk this is a real defect;
    // without one it is an artefact of the capture, and only the caller knows
    // which it did.
    const hidden = []
    for (const el of document.querySelectorAll(revealSel)) {
      const cs = getComputedStyle(el)
      if (parseFloat(cs.opacity) < 0.05 || cs.visibility === 'hidden') hidden.push(name(el))
    }

    // An ancestor that scrolls horizontally ON PURPOSE makes a wide child
    // correct. Walk up rather than match a class.
    const insideScroller = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX
        if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true
      }
      return false
    }

    const wide = []
    let excused = 0
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      // position:fixed cannot make the DOCUMENT scroll, so it is not this
      // check's business even when it sticks out.
      if (cs.position === 'fixed') continue
      const r = el.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) continue
      if (r.right > window.innerWidth + 1 || r.left < -1) {
        if (insideScroller(el)) { excused++; continue }
        wide.push(`${name(el)} (right ${Math.round(r.right)}px, ${Math.round(r.right - window.innerWidth)} over)`)
      }
    }

    return {
      innerWidth: window.innerWidth,
      bodyHeight: document.body ? document.body.scrollHeight : 0,
      sheets: document.styleSheets.length,
      scrollWidth: d.scrollWidth,
      hidden: hidden.slice(0, 12),
      hiddenTotal: hidden.length,
      wide: wide.slice(0, 8),
      wideTotal: wide.length,
      excusedInScrollers: excused,
      textNodes: document.evaluate('count(//text()[normalize-space()])', document, null, 1, null).numberValue || 0,
    }
  }, REVEAL_SELECTOR).catch(() => null)
}

/**
 * Turn a diagnosis into findings. `level` is 'broken' when the MEASUREMENT
 * cannot be trusted (caller should exit 2) and 'defect' when the PAGE is wrong
 * (caller should exit 1). Keeping those apart is the whole point: "the check is
 * broken" must never be reported as "the site is broken".
 */
function judgeDiagnosis(d, requestedWidth) {
  const out = []
  if (!d) {
    out.push({ level: 'broken', message: 'the page could not be measured at all (evaluate threw). A null diagnosis is not a clean one.' })
    return out
  }
  if (d.innerWidth !== requestedWidth) {
    out.push({ level: 'broken', message: `laid out at ${d.innerWidth}px but requested ${requestedWidth}px — every measurement taken off this page is wrong` })
  }
  if (d.sheets === 0) {
    out.push({ level: 'broken', message: 'the document has NO stylesheets. This is almost always `next dev` and `next build` sharing .next, not a CSS regression. Rebuild with NEXT_DIST_DIR set, or kill the dev server.' })
  }
  if (!d.bodyHeight) {
    out.push({ level: 'broken', message: 'the body has zero height — nothing rendered' })
  }
  if (d.textNodes < 20) {
    out.push({ level: 'broken', message: `only ${d.textNodes} non-empty text nodes; a rendered page of this site has far more. This cell did not render.` })
  }
  if (d.scrollWidth > d.innerWidth + 1) {
    out.push({
      level: 'defect',
      message: `the document scrolls horizontally at ${requestedWidth}px (content is ${d.scrollWidth}px)`
        + (d.wideTotal ? `\n  overflowing: ${d.wide.join('\n               ')}`
          + (d.wideTotal > d.wide.length ? `\n  ...and ${d.wideTotal - d.wide.length} more` : '') : ''),
    })
  } else if (d.wideTotal) {
    // Something sticks out without making the document scroll — usually a
    // clipped decoration. Worth naming, not worth failing.
    out.push({ level: 'note', message: `${d.wideTotal} element(s) extend past the viewport without making the document scroll: ${d.wide.slice(0, 3).join(', ')}` })
  }
  if (d.hiddenTotal) {
    out.push({ level: 'defect', message: `${d.hiddenTotal} reveal element(s) are still invisible after a full scroll walk: ${d.hidden.join(', ')}` })
  }
  return out
}

module.exports = { walkToRest, diagnose, judgeDiagnosis, REVEAL_SELECTOR }
