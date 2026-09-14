#!/usr/bin/env node
/**
 * The WCAG contrast probe, extracted so there is exactly one of it.
 *
 * ── WHY IT MOVED ──────────────────────────────────────────────────────────
 * `audit-dark-contrast.js` measures text on DARK grounds and its own header
 * says light-ground contrast "is a separate sweep". When that sweep was finally
 * written (`audit-viewport-sweep.js`), the obvious shortcut was to copy the
 * compositing machinery across and flip one comparison. That would have put two
 * independently-maintained WCAG implementations in the same repo, and two
 * implementations that disagree is a worse outcome than either of them alone:
 * the disagreement is invisible while they agree, and the first time one is
 * corrected the other becomes the wrong answer nobody is looking at.
 *
 * So the machinery lives here, parameterised by the one thing that actually
 * differs between the two sweeps — which grounds they care about — and both
 * import it. `audit-dark-contrast.js` keeps its threshold, its output and its
 * place in `test:design:live` unchanged; only its source of `AUDIT` moved.
 *
 * ── WHAT IT MEASURES, AND THE ONE THING IT CANNOT ────────────────────────
 * For every element that owns visible text, it composites the real backdrop —
 * every translucent ancestor folded down onto the root's own ground — and
 * compares against the element's own colour, folding in `opacity`. That is the
 * colour a reader actually sees, not the colour the stylesheet declares.
 *
 * 🔴 IT READS `backgroundColor` ONLY, SO TEXT OVER AN IMAGE IS INVISIBLE TO IT.
 * A white heading on a hero photograph composites against whatever CSS colour
 * sits behind the `<img>`, which is usually the page ground and usually passes.
 * `audit-dark-contrast.js` has always had this blind spot and never said so.
 * Every caller MUST print the limitation on every run: a reader who is told
 * "0 failures" and not told what was not looked at will conclude the wrong
 * thing, and this is the single most likely place a real contrast defect hides
 * from both sweeps.
 *
 * Exports:
 *   AUDIT_SOURCE  the probe as a string, to be passed to page.evaluate with a
 *                 ground predicate. A string rather than a function because it
 *                 is serialised into the page, where this module does not exist.
 *   GROUND        { dark, light, any } — the predicates.
 */
'use strict'

/**
 * `ground` arrives in the page as a number: 0 = dark only, 1 = light only,
 * 2 = both. A predicate function cannot be used because the probe is
 * serialised, and a closure would not survive the boundary.
 */
const GROUND = { dark: 0, light: 1, any: 2 }

/* eslint-disable no-undef */
function PROBE(groundMode) {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
  const parse = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(',').map((v) => parseFloat(v.trim()))
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 }
  }
  const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a))

  // The backdrop is whatever actually ends up behind the glyphs: every
  // translucent ancestor composited down onto the root's own ground.
  const bgOf = (el) => {
    let n = el
    let acc = [255, 255, 255]
    const chain = []
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0) chain.push(c)
      n = n.parentElement
    }
    const root = parse(getComputedStyle(document.documentElement).backgroundColor)
    if (root && root.a > 0) chain.push(root)
    for (let i = chain.length - 1; i >= 0; i--) acc = over(chain[i], acc)
    return acc
  }

  const out = []
  let examined = 0
  for (const el of document.querySelectorAll('*')) {
    // Only elements that own their text: otherwise every ancestor is reported
    // for the same string.
    if (el.children.length > 0) {
      const hasOwnText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
      if (!hasOwnText) continue
    }
    const txt = (el.textContent || '').trim()
    if (txt.length < 2) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    /* WCAG 2.2 SC 1.4.3 exempts an INACTIVE user interface component outright:
       "text or images of text that are part of an inactive user interface
       component ... have no contrast requirement". A disabled control is dimmed
       ON PURPOSE, and dimming is how a sighted reader is told it is disabled, so
       requiring 4.5:1 of it would be requiring the design to stop communicating.

       Found because the sweep reported `.fb-pager button:disabled` ("← Prev" on
       page 1 of /blog, --ink-2 at opacity 0.38) as a 1.9:1 failure on every
       width. That is the check contradicting the spec it claims to implement,
       and it is the shape of false positive that gets a check switched off. */
    if (el.disabled === true || el.getAttribute('aria-disabled') === 'true' || el.closest('[disabled], [aria-disabled="true"], fieldset:disabled')) continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    const opa = parseFloat(cs.opacity)
    const col = parse(cs.color)
    if (!col) continue
    examined++
    const bg = bgOf(el)
    const eff = { rgb: col.rgb, a: col.a * (isNaN(opa) ? 1 : opa) }
    const fg = over(eff, bg)
    const cr = ratio(fg, bg)
    const size = parseFloat(cs.fontSize)
    const weight = parseInt(cs.fontWeight, 10) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const need = large ? 3 : 4.5
    const isDark = lum(bg) < 0.2
    const wanted = groundMode === 2 || (groundMode === 0 ? isDark : !isDark)
    if (cr < need && wanted) {
      const cls = el.className && (el.className.baseVal !== undefined ? el.className.baseVal : String(el.className))
      out.push({
        cls: String(cls || '').slice(0, 46),
        tag: el.tagName,
        ratio: Math.round(cr * 100) / 100,
        need,
        size: Math.round(size * 10) / 10,
        opacity: isNaN(opa) ? 1 : opa,
        color: cs.color,
        bg: 'rgb(' + bg.map((v) => Math.round(v)).join(',') + ')',
        text: txt.slice(0, 46),
      })
    }
  }
  const seen = new Set()
  const deduped = out.filter((o) => { const k = o.cls + o.ratio; if (seen.has(k)) return false; seen.add(k); return true })
  /* 🔴 AN OBJECT, NOT AN ARRAY WITH A PROPERTY HUNG ON IT. The first version
     returned the array and set `deduped.examined = examined`; a page.evaluate
     return value is serialised, and JSON drops non-index properties of an
     array, so `examined` arrived as undefined and every cell reported "0 text
     nodes examined". The guard that reads it then correctly refused to call
     those cells clean — which is the guard working, and is also how the bug was
     found, but it would have been a silently permissive 0 in any caller that
     treated a falsy count as "no data, carry on".

     `examined` is what lets a caller tell "nothing failed" from "nothing was
     looked at", so it has to survive the boundary. */
  return { findings: deduped, examined }
}
/* eslint-enable no-undef */

const LIMITATION =
  'contrast is read from backgroundColor only, so TEXT OVER AN IMAGE is not measured by this probe'

module.exports = { PROBE, GROUND, LIMITATION }
