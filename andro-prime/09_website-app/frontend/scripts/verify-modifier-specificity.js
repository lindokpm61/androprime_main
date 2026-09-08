#!/usr/bin/env node
/**
 * A modifier must out-specify the base it modifies. It may not depend on
 * where it happens to sit in the file.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-modifier-specificity.js
 *
 * WHY THIS EXISTS. This is the most-repeated defect in the Direction F
 * stylesheet, and DESIGN.md names four instances of it by hand:
 *
 *   .f-btn-ghost   shipped transparent
 *   .f-blab        shipped 30% oversized
 *   .f-tray-flag   Kit 3's accent ring NEVER RENDERED ONCE on the live page
 *   .f-tray:hover  the card lift died wherever .f-rise was also present
 *
 * Every one of them is the same mechanism: two rules of EQUAL specificity set
 * the same property, so source order decides, so whichever sits lower wins. The
 * symptom is never an error. `.f-tray-flag` lost its ring and kept a perfectly
 * good ambient shadow, so the only evidence was an emphasis nobody could see was
 * missing. DESIGN.md's own conclusion after the fourth: "Four is enough evidence
 * that the instance is not the bug" — the pattern needs a detector, not a fifth
 * hand-written note.
 *
 * WHAT IT CHECKS. A class `f-tray-flag` is treated as a modifier of `f-tray`
 * when (a) `f-tray` is also a defined class and (b) the two are rendered on the
 * SAME element somewhere in the app — read out of the real className strings, so
 * the pairing is grounded in markup rather than in a naming guess. `.f-shot-cap`
 * is not a modifier of `.f-shot` because no element wears both.
 *
 * For each such pair, every rule that could style the same element and sets the
 * same property is compared. The modifier must win on SPECIFICITY. A tie is a
 * failure even when the modifier currently happens to be declared later and so
 * currently works: that is the exact latent state `.f-tray-flag` was in, and it
 * breaks the next time somebody reorders a stylesheet.
 *
 * THE TWO FIX SHAPES, and picking the wrong one breaks pages. A modifier always
 * worn WITH its base compounds onto it: `.f-tray.f-tray-pick`. A modifier that
 * can stand alone must raise ITSELF by repeating its class:
 * `.f-sec-hero.f-sec-hero`. `.f-sec-hero` is worn with `.f-sec` on two routes and
 * alone on three; it was compounded on 2026-09-08 and the three kit heroes
 * silently lost their padding, 62px to 0, because the selector stopped matching
 * them. Each finding below names which of the two applies, counted from the
 * call sites.
 *
 * CASCADE LAYERS. Unlayered beats layered regardless of specificity, so a base
 * inside `@layer` cannot beat an unlayered modifier and the pair passes. The
 * reverse — a layered modifier against an unlayered base — always loses, and is
 * reported however specific it is.
 *
 * SCOPE. The F component layer, `styles/components/f-primitives.css` and
 * `styles/components/f-blog.css`, in the order globals.css imports them. That is
 * where the `f-`/`fb-` convention lives and where all four instances happened.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const F_CSS = [
  path.join(ROOT, 'styles', 'components', 'f-primitives.css'),
  path.join(ROOT, 'styles', 'components', 'f-blog.css'),
]

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')
const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))

for (const f of F_CSS) if (!fs.existsSync(f)) die(`missing ${f}`)

/* ---------- parse the F layer into rules ---------- */

function matchingBrace(src, open) {
  let d = 0
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') d++
    else if (src[i] === '}') { d--; if (d === 0) return i }
  }
  return src.length - 1
}

const rules = [] // {sel, props:Set, file, line, order, layered}
let order = 0

for (const f of F_CSS) {
  const src = stripCssComments(read(f))
  const lineAt = (idx) => src.slice(0, idx).split('\n').length
  const atStack = []
  let buf = ''
  let i = 0
  while (i < src.length) {
    const ch = src[i]
    if (ch === '{') {
      const prelude = buf.trim()
      buf = ''
      if (prelude.startsWith('@')) {
        atStack.push({ prelude, closeAt: matchingBrace(src, i) })
        i++
        continue
      }
      const end = matchingBrace(src, i)
      const body = src.slice(i + 1, end)
      const props = new Set([...body.matchAll(/(?:^|[;{])\s*([-A-Za-z0-9]+)\s*:/g)].map((m) => m[1]))
      const open = atStack.filter((a) => a.closeAt > i)
      const layered = open.some((a) => /^@layer\b/.test(a.prelude))
      const line = lineAt(i)
      for (const sel of prelude.split(',')) {
        const s = sel.trim().replace(/\s+/g, ' ')
        if (s) rules.push({ sel: s, props, file: rel(f), line, order: order++, layered })
      }
      i = end + 1
      continue
    }
    if (ch === '}') { buf = ''; i++; continue }
    buf += ch
    i++
  }
}

if (rules.length < 100) die(`parsed only ${rules.length} rules out of the F layer. Fix this parser rather than trusting a pass.`)

/* ---------- specificity ---------- */

// (ids, classes+attributes+pseudo-classes, elements+pseudo-elements).
// :not()/:is()/:where() are handled the way the spec does for the first two;
// :where() contributes nothing. Nothing in this layer uses an id.
function specificity(sel) {
  let s = sel
  let a = 0, b = 0, c = 0
  s = s.replace(/:where\([^)]*\)/g, ' ')
  s = s.replace(/:(?:not|is|has)\(([^)]*)\)/g, (_, inner) => {
    const [ia, ib, ic] = specificity(inner.split(',')[0] || '')
    a += ia; b += ib; c += ic
    return ' '
  })
  a += (s.match(/#[A-Za-z0-9_-]+/g) || []).length
  b += (s.match(/\.[A-Za-z0-9_-]+/g) || []).length
  b += (s.match(/\[[^\]]*\]/g) || []).length
  b += (s.match(/(?<!:):[a-z-]+(?:\([^)]*\))?/gi) || []).length
  c += (s.match(/::[a-z-]+/gi) || []).length
  s = s.replace(/::?[a-z-]+(?:\([^)]*\))?/gi, ' ').replace(/\.[A-Za-z0-9_-]+/g, ' ').replace(/#[A-Za-z0-9_-]+/g, ' ').replace(/\[[^\]]*\]/g, ' ')
  c += (s.match(/(?:^|[\s>+~])([a-z][a-z0-9]*)/gi) || []).length
  return [a, b, c]
}
const cmpSpec = (x, y) => (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2])
const showSpec = (s) => `(${s.join(',')})`

/* ---------- which classes are worn together ---------- */

const SKIP_DIR = new Set(['node_modules', '.next', '.git', '.impeccable', 'out'])
function walk(dir, exts, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(path.join(dir, e.name), exts, acc) }
    else if (exts.some((x) => e.name.endsWith(x))) acc.push(path.join(dir, e.name))
  }
  return acc
}
function balanced(src, i) {
  let d = 0
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') d++
    else if (src[j] === '}') { d--; if (d === 0) return src.slice(i, j + 1) }
  }
  return src.slice(i, i + 400)
}

const CLASS_TOK = /(?<![A-Za-z0-9_-])((?:f|fb)-[a-z][a-z0-9-]*)(?![A-Za-z0-9_-])/g
const together = new Set() // "base|modifier" — seen on one element at least once
const sites = new Map() // class -> {total, withOthers:Map(class -> count)}
const codeFiles = [
  ...walk(path.join(ROOT, 'app'), ['.tsx']),
  ...walk(path.join(ROOT, 'components'), ['.tsx']),
  ...walk(path.join(ROOT, 'content'), ['.mdx']),
]
for (const f of codeFiles) {
  const src = read(f)
  for (const m of src.matchAll(/className\s*=\s*/g)) {
    const at = m.index + m[0].length
    const text = src[at] === '{' ? balanced(src, at) : (src.slice(at).match(/^"[^"]*"|^'[^']*'/) || [''])[0]
    // Every class named anywhere in one className expression is treated as
    // co-worn. A conditional puts alternatives in the same expression, which
    // over-pairs slightly; over-pairing costs a comparison, under-pairing costs
    // a missed defect.
    const cls = [...new Set([...text.matchAll(CLASS_TOK)].map((x) => x[1]))]
    for (const a of cls) for (const b of cls) if (a !== b) together.add(`${a}|${b}`)
    for (const a of cls) {
      if (!sites.has(a)) sites.set(a, { total: 0, withOthers: new Map() })
      const s = sites.get(a)
      s.total++
      for (const b of cls) if (a !== b) s.withOthers.set(b, (s.withOthers.get(b) || 0) + 1)
    }
  }
}
if (!together.size) die('found no co-worn class pairs in the markup. Fix this collector rather than trusting a pass.')

/* ---------- pairs ---------- */

const definedClasses = new Set()
for (const r of rules) for (const m of r.sel.matchAll(/\.((?:f|fb)-[a-z][a-z0-9-]*)/g)) definedClasses.add(m[1])

const pairs = []
for (const cls of definedClasses) {
  const parts = cls.split('-')
  for (let n = parts.length - 1; n >= 2; n--) {
    const base = parts.slice(0, n).join('-')
    if (base !== cls && definedClasses.has(base) && together.has(`${base}|${cls}`)) pairs.push([base, cls])
  }
}

/* ---------- compare ---------- */

const hasClass = (sel, cls) => new RegExp(`\\.${cls}(?![A-Za-z0-9_-])`).test(sel)
// Strip the pair's own classes so two selectors can be compared for shape: the
// rest of the selector must describe the same element in the same context.
const shape = (sel, classes) => {
  let s = sel
  for (const c of classes) s = s.replace(new RegExp(`\\.${c}(?![A-Za-z0-9_-])`, 'g'), '')
  return s.replace(/\s+/g, ' ').trim()
}

console.log('Modifier specificity: a modifier must out-specify its base\n')
console.log(`  ${rules.length} rules parsed from the F layer`)
console.log(`  ${pairs.length} base/modifier pairs, confirmed co-worn in the markup\n`)

let fail = 0
let compared = 0
const seen = new Set()

for (const [base, mod] of pairs) {
  // The modifier may sit anywhere in the selector, not only on the element it
  // names: `.f-btn-ghost .f-pip` against `.f-btn .f-pip` is the same tie one
  // level down, and it is the shape comparison below that keeps the pairing
  // honest rather than the position of the class.
  const baseRules = rules.filter((r) => hasClass(r.sel, base) && !hasClass(r.sel, mod))
  const modRules = rules.filter((r) => hasClass(r.sel, mod))
  for (const rm of modRules) {
    for (const rb of baseRules) {
      if (shape(rm.sel, [base, mod]) !== shape(rb.sel, [base, mod])) continue
      const shared = [...rm.props].filter((p) => rb.props.has(p))
      if (!shared.length) continue
      compared++
      // Unlayered beats layered whatever the specificity says.
      if (rb.layered && !rm.layered) continue
      const sm = specificity(rm.sel)
      const sb = specificity(rb.sel)
      const layerLoss = rm.layered && !rb.layered
      if (!layerLoss && cmpSpec(sm, sb) > 0) continue
      // Keyed on the rule SITES, not the selector text. `.f-tray` appears twice
      // — once inside a reduced-motion query and once as the real base 90 lines
      // later — and keying on the selector alone reported the harmless one and
      // hid the one that was actually killing `.f-tray-pick`'s transition.
      const k = `${rm.file}:${rm.line}:${rm.sel}::${rb.file}:${rb.line}:${rb.sel}`
      if (seen.has(k)) continue
      seen.add(k)
      fail++
      // WHICH FIX. Compounding the modifier onto its base — `.f-tray.f-tray-pick`
      // — only works if the base is on the element EVERY time the modifier is.
      // `.f-sec-hero` is worn with `.f-sec` on two routes and alone on three; it
      // was compounded on 2026-09-08 and the three kit heroes silently lost their
      // padding, 62px to 0, because the selector stopped matching them. A
      // stand-alone variant has to raise itself instead, by repeating its class.
      const st = sites.get(mod) || { total: 0, withOthers: new Map() }
      const withBase = st.withOthers.get(base) || 0
      const alwaysWithBase = st.total > 0 && withBase === st.total
      const fix = alwaysWithBase
        ? `write it as \`.${base}.${mod}\` — every one of the ${st.total} call sites wears both`
        : `write it as \`.${mod}.${mod}\` — ${st.total - withBase} of ${st.total} call sites do NOT wear .${base}, so compounding onto the base would stop matching them`
      const verdict = layerLoss
        ? 'the modifier is in a cascade layer and the base is not, so the base always wins'
        : cmpSpec(sm, sb) === 0
          ? (rm.order > rb.order
              ? 'a tie, currently won by source order alone — it breaks on the next reorder'
              : 'a tie, and the base is declared LATER, so the modifier is dead right now')
          : 'the base out-specifies the modifier, so the modifier never applies'
      console.log(`  FAIL .${mod} over .${base} — ${verdict}`)
      console.log(`       modifier  ${showSpec(sm)}  ${rm.sel}   ${rm.file}:${rm.line}`)
      console.log(`       base      ${showSpec(sb)}  ${rb.sel}   ${rb.file}:${rb.line}`)
      console.log(`       both set: ${shared.join(', ')}`)
      console.log(`       fix: ${fix}`)
    }
  }
}

console.log(`\n${compared} overlapping rule pairs compared, ${fail} where the modifier does not out-specify its base`)
process.exit(fail > 0 ? 1 : 0)
