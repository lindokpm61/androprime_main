#!/usr/bin/env node
/**
 * The dark-panel mechanism: the ramp stays readable, stays in one voice, and
 * the three traps that make a dark panel fail silently stay shut.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-on-ink.js
 *
 * WHY THIS EXISTS. On 2026-09-08 Keith reported text on black panels as
 * unreadable. The worst node measured 2.39:1 against a 4.5 requirement, and it
 * was the line that says CALL 999. The cause was not a bad colour choice: it was
 * `.fb-alert p`, written for a light card and inherited by a dark bar nobody
 * re-checked. The fix was `.f-on-ink`, one class a dark panel opts into that
 * re-points `--ink`/`--ink-2`/`--ink-3` at a light ramp, so every descendant
 * rule already saying `var(--ink-2)` fixes itself.
 *
 * A mechanism like that has exactly three ways to break, all of them silent, and
 * all three were hit while building it. This script holds each one shut:
 *
 *   1. THE RAMP GOES DARK. Someone edits `--on-ink-2` for looks and drops it
 *      under 4.5:1. Nothing errors; the text just gets harder to read, which is
 *      the original defect returning through the door built to fix it.
 *
 *   2. THE RAMP SPLITS IN TWO. colours.css says the on-ink values are "lifted
 *      verbatim from the dark table in styles/pages/app-shell.css... If the
 *      app's dark table changes, change these with it." That is a fact stored in
 *      FOUR places, and a duplicated fact is invisible exactly while the copies
 *      agree. Nothing but a check notices the day one moves.
 *
 *   3. THE PANEL PAINTS ITSELF WITH THE TOKEN IT REMAPS. `.f-on-ink` remaps
 *      `--ink` ON ITSELF, so `background: var(--ink)` on the same element
 *      resolves to the remapped near-WHITE and the panel inverts. The ground has
 *      to come from `--ink-ground`.
 *
 * Two further traps are reported the same way, because both produced real
 * defects on /demo: text `opacity` over a dark ground composites TOWARD the
 * background, so it darkens grey text on black rather than quieting it; and a
 * hardcoded colour literal cannot be remapped by anything, which is what both
 * /demo failures actually were.
 *
 * WHAT THIS IS NOT. It is a check on the MECHANISM, which is static and cheap
 * enough to run in `npm test`. It cannot see a rendered page, so it cannot find
 * the next `.fb-alert p` — a light-card rule inherited by a dark bar. That needs
 * a browser: `scripts/audit-dark-contrast.js` walks 16 routes and measures every
 * text node against its composited backdrop. Run that when a dark panel is added
 * or moved.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const COLOURS = path.join(ROOT, 'styles', 'tokens', 'colours.css')
const APP_SHELL = path.join(ROOT, 'styles', 'pages', 'app-shell.css')
const F_PRIMITIVES = path.join(ROOT, 'styles', 'components', 'f-primitives.css')

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }
for (const f of [COLOURS, APP_SHELL, F_PRIMITIVES]) if (!fs.existsSync(f)) die(`missing ${f}`)

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')
const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))

let pass = 0
let fail = 0
const t = (d, ok, detail) => {
  if (ok) { pass++; console.log(`  ok   ${d}`) }
  else { fail++; console.log(`  FAIL ${d}${detail ? `\n       ${detail}` : ''}`) }
}

/* ---------- parse blocks ---------- */

function matchingBrace(src, open) {
  let d = 0
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') d++
    else if (src[i] === '}') { d--; if (d === 0) return i }
  }
  return src.length - 1
}

function blocks(file) {
  const src = stripCssComments(read(file))
  const out = []
  const atStack = []
  let buf = ''
  let i = 0
  const lineAt = (idx) => src.slice(0, idx).split('\n').length
  while (i < src.length) {
    const ch = src[i]
    if (ch === '{') {
      const prelude = buf.trim().replace(/\s+/g, ' ')
      buf = ''
      if (prelude.startsWith('@')) { atStack.push({ prelude, closeAt: matchingBrace(src, i) }); i++; continue }
      const end = matchingBrace(src, i)
      const body = src.slice(i + 1, end)
      const decls = new Map()
      for (const m of body.matchAll(/(?:^|[;{])\s*([-A-Za-z0-9]+)\s*:\s*([^;}]+)/g)) decls.set(m[1], m[2].trim())
      out.push({ sel: prelude, decls, body, file: rel(file), line: lineAt(i), at: atStack.filter((a) => a.closeAt > i).map((a) => a.prelude) })
      i = end + 1
      continue
    }
    if (ch === '}') { buf = ''; i++; continue }
    buf += ch
    i++
  }
  return out
}

const colourBlocks = blocks(COLOURS)
const shellBlocks = blocks(APP_SHELL)
const fBlocks = blocks(F_PRIMITIVES)
if (!colourBlocks.length || !shellBlocks.length || !fBlocks.length) die('parsed no blocks. Fix this parser rather than trusting a pass.')

const rootDecls = new Map()
for (const b of colourBlocks) if (b.sel === ':root') for (const [k, v] of b.decls) rootDecls.set(k, v)
if (!rootDecls.size) die(`parsed no :root declarations out of ${rel(COLOURS)}. Fix this parser rather than trusting a pass.`)

/* ---------- colour maths ---------- */

function toRgb(v) {
  const s = String(v).trim()
  let m = s.match(/^#([0-9a-f]{6})$/i)
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16))
  m = s.match(/^#([0-9a-f]{3})$/i)
  if (m) return [0, 1, 2].map((i) => parseInt(m[1][i] + m[1][i], 16))
  m = s.match(/^rgba?\(([^)]+)\)$/i)
  if (m) { const p = m[1].split(',').map((x) => parseFloat(x)); return [p[0], p[1], p[2]] }
  return null
}
const lum = (rgb) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const r2 = (n) => Math.round(n * 100) / 100

/* ---------- 1. the ramp is readable on its own ground ---------- */

console.log('The dark-panel mechanism (.f-on-ink)\n')
console.log('1. The on-ink ramp measured against the ground it is used on\n')

// --ink-ground is declared as var(--ink) so the hex is not duplicated; resolve
// one level of indirection rather than hardcoding the value here.
let groundRaw = rootDecls.get('--ink-ground')
const indirect = groundRaw && groundRaw.match(/^var\(\s*(--[A-Za-z0-9_-]+)\s*\)$/)
if (indirect) groundRaw = rootDecls.get(indirect[1])
const ground = toRgb(groundRaw)
if (!ground) die(`could not resolve --ink-ground to a colour (got ${groundRaw}). Fix this resolver rather than trusting a pass.`)

// Every step of the ramp carries small text somewhere, so all three are held to
// the 4.5 small-text floor rather than the 3.0 large-text one.
const FLOOR = 4.5
for (const tok of ['--on-ink', '--on-ink-2', '--on-ink-3']) {
  const rgb = toRgb(rootDecls.get(tok))
  if (!rgb) { t(`${tok} is a resolvable colour`, false, `got ${rootDecls.get(tok)}`); continue }
  const cr = r2(ratio(rgb, ground))
  t(`${tok} on the dark ground: ${cr}:1 (floor ${FLOOR})`, cr >= FLOOR, `measured ${cr}:1 against ${groundRaw}`)
}

/* ---------- 2. the ramp has not split in two ---------- */

console.log('\n2. The same ramp in all four places it is written down\n')

// colours.css states these are lifted verbatim from app-shell.css's dark table.
const MIRROR = [
  ['--on-ink', '--ap-ink', '--ink'],
  ['--on-ink-2', '--ap-ink-2', '--ink-2'],
  ['--on-ink-3', '--ap-ink-3', '--ink-3'],
  ['--on-ink-hair', '--ap-hair', '--hair'],
  ['--on-ink-hair-2', '--ap-hair-2', '--hair-2'],
]
const same = (a, b) => a && b && a.replace(/\s+/g, '').toLowerCase() === b.replace(/\s+/g, '').toLowerCase()

const darkBlocks = shellBlocks.filter(
  (b) => /data-ap-theme/.test(b.sel) || b.at.some((a) => /prefers-color-scheme\s*:\s*dark/.test(a))
)
const darkTables = darkBlocks.filter((b) => MIRROR.some(([, ap, plain]) => b.decls.has(ap) || b.decls.has(plain)))
t(`app-shell.css still declares its dark table (${darkTables.length} blocks found)`, darkTables.length >= 3,
  'expected the stage table, the .ap-themed table and its prefers-color-scheme copy — if the file was restructured, fix this collector rather than trusting a pass')

for (const b of darkTables) {
  for (const [onInk, ap, plain] of MIRROR) {
    const mine = b.decls.get(ap) ?? b.decls.get(plain)
    if (mine === undefined) continue
    const theirs = rootDecls.get(onInk)
    t(`${b.file}:${b.line} ${b.decls.has(ap) ? ap : plain} equals ${onInk}`, same(mine, theirs),
      `app-shell: ${mine}   colours.css ${onInk}: ${theirs}`)
  }
}

/* ---------- 3. the class itself ---------- */

console.log('\n3. The class that carries the mechanism\n')

const onInk = fBlocks.find((b) => b.sel === '.f-on-ink')
t('.f-on-ink exists in f-primitives.css', !!onInk)
if (onInk) {
  for (const tok of ['--ink', '--ink-2', '--ink-3', '--hair', '--hair-2']) {
    t(`.f-on-ink re-points ${tok}`, onInk.decls.has(tok),
      'a token left un-remapped keeps its light-ground value and renders near-black on black')
  }
  const bg = onInk.decls.get('background') || onInk.decls.get('background-color') || ''
  t('.f-on-ink paints its ground from --ink-ground, not --ink', /var\(\s*--ink-ground\s*\)/.test(bg),
    `background is \`${bg}\` — this class remaps --ink on itself, so var(--ink) here resolves to the remapped near-WHITE and the panel inverts`)
}

/* ---------- 4. the traps, across every stylesheet ---------- */

console.log('\n4. The traps, in every rule scoped to a dark panel\n')

const SKIP_DIR = new Set(['node_modules', '.next', '.git', '.impeccable', 'out'])
function walk(dir, exts, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(path.join(dir, e.name), exts, acc) }
    else if (exts.some((x) => e.name.endsWith(x))) acc.push(path.join(dir, e.name))
  }
  return acc
}

const scoped = []
for (const f of walk(path.join(ROOT, 'styles'), ['.css'])) {
  for (const b of blocks(f)) if (/\.f-on-ink(?![A-Za-z0-9_-])/.test(b.sel)) scoped.push(b)
}

const selfPaint = scoped.filter((b) => b.sel !== '.f-on-ink' && /(?:^|[;{])\s*background(?:-color)?\s*:[^;}]*var\(\s*--ink\s*\)/.test(b.body))
t(`no .f-on-ink rule paints its ground with var(--ink) (${scoped.length} scoped rules)`, selfPaint.length === 0,
  selfPaint.map((b) => `${b.file}:${b.line} ${b.sel}`).join('\n       '))

const dimmed = scoped.filter((b) => b.decls.has('opacity') && b.decls.get('opacity') !== '1')
t('no .f-on-ink rule quiets text with opacity', dimmed.length === 0,
  `${dimmed.map((b) => `${b.file}:${b.line} ${b.sel} → opacity: ${b.decls.get('opacity')}`).join('\n       ')}\n       opacity over a dark ground composites toward the BACKGROUND, so it darkens grey text instead of quieting it. Step down the ramp (--ink-2, --ink-3) instead.`)

const literal = scoped.filter((b) => {
  const c = b.decls.get('color')
  return c && /#[0-9a-f]{3,8}\b|\brgba?\(/i.test(c)
})
t('no .f-on-ink rule sets a colour literal', literal.length === 0,
  `${literal.map((b) => `${b.file}:${b.line} ${b.sel} → color: ${b.decls.get('color')}`).join('\n       ')}\n       a literal cannot be remapped by anything, which is what both /demo failures were`)

console.log(`\n${pass} passed, ${fail} failed`)
if (fail === 0) console.log('\nThis checks the MECHANISM only. For rendered contrast on real pages, run scripts/audit-dark-contrast.js against a dev server.')
process.exit(fail > 0 ? 1 : 0)
