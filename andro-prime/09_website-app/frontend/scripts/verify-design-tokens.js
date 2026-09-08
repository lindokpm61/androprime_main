#!/usr/bin/env node
/**
 * Every `var(--token)` must resolve to a token that is actually declared.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-design-tokens.js
 *
 * WHY THIS EXISTS. An undefined custom property is a SILENT ZERO, not an
 * error. `var(--ink-4)` where the ramp stops at `--ink-3` does not warn in the
 * browser, does not fail the build, and does not fail `tsc`; the declaration is
 * simply dropped and the element keeps whatever it inherited. So a mistyped
 * token produces a page that renders, looks nearly right, and is wrong in a way
 * no existing check can see. The 2026-09-08 session wrote THIRTEEN wrong token
 * names on its first pass and found them only by rendering pages and reading
 * pixels.
 *
 * That is the whole argument for a mechanical check: this is a class of defect
 * where the failure and the success are visually adjacent, so eyes are the
 * wrong instrument, and prose in DESIGN.md ("use a token, never a literal")
 * cannot enforce the token being a REAL one.
 *
 * WHAT COUNTS AS A DECLARATION. Anywhere the property is actually set:
 *   - `--x: value` in any stylesheet, at :root or on any selector or @media
 *   - a React inline style, `style={{ '--x': v }}` or `setProperty('--x', v)`
 *   - a next/font `variable: "--font-x"` binding in app/layout.tsx
 *
 * TWO USES ARE REPORTED BUT DO NOT FAIL, because neither is silent:
 *   - `var(--x, fallback)` — an undefined token with a deliberate default
 *   - `var(--x-${expr})` — a name composed at runtime, which is a PREFIX rather
 *     than a token. It is checked against the declared set by prefix instead.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

/* ---------- file collection ---------- */

const SKIP_DIR = new Set(['node_modules', '.next', '.git', '.impeccable', 'out'])

function walk(dir, exts, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue
      walk(path.join(dir, e.name), exts, acc)
    } else if (exts.some((x) => e.name.endsWith(x))) {
      acc.push(path.join(dir, e.name))
    }
  }
  return acc
}

const cssFiles = [
  ...walk(path.join(ROOT, 'styles'), ['.css']),
  ...walk(path.join(ROOT, 'app'), ['.css']),
  ...walk(path.join(ROOT, 'components'), ['.css']),
]
const codeFiles = [
  ...walk(path.join(ROOT, 'app'), ['.tsx', '.ts']),
  ...walk(path.join(ROOT, 'components'), ['.tsx', '.ts']),
  ...walk(path.join(ROOT, 'lib'), ['.tsx', '.ts']),
  path.join(ROOT, 'tailwind.config.ts'),
].filter((f) => fs.existsSync(f))

if (cssFiles.length < 10) {
  die(`found only ${cssFiles.length} stylesheets under ${ROOT}/styles — the layout changed; fix this collector rather than trusting a pass.`)
}

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ')
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')

/* ---------- declarations ---------- */

const declared = new Map() // name -> [where]
const declare = (name, where) => {
  if (!declared.has(name)) declared.set(name, [])
  declared.get(name).push(where)
}

for (const f of cssFiles) {
  const src = stripCssComments(read(f))
  // A declaration is a custom property followed by a colon at the start of a
  // statement. Anchoring to `{`, `;` or a line start keeps `var(--x)` and
  // `url(data:...)` out.
  for (const m of src.matchAll(/(?:^|[;{])\s*(--[A-Za-z0-9_-]+)\s*:/gm)) declare(m[1], rel(f))
}

for (const f of codeFiles) {
  const src = read(f)
  for (const m of src.matchAll(/['"](--[A-Za-z0-9_-]+)['"]\s*:/g)) declare(m[1], rel(f))
  for (const m of src.matchAll(/\[\s*['"](--[A-Za-z0-9_-]+)['"]\s+as\s+string\s*\]\s*:/g)) declare(m[1], rel(f))
  for (const m of src.matchAll(/setProperty\(\s*['"](--[A-Za-z0-9_-]+)['"]/g)) declare(m[1], rel(f))
  // next/font bindings: `variable: "--font-x"`
  for (const m of src.matchAll(/variable\s*:\s*['"](--[A-Za-z0-9_-]+)['"]/g)) declare(m[1], rel(f))
}

if (!declared.size) die('parsed no custom-property declarations at all. Fix this parser rather than trusting a pass.')

/* ---------- uses ---------- */

const uses = [] // {name, file, line, hasFallback, dynamic}
function collectUses(f, src) {
  src.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)\s*(,)?/g)) {
      const after = line.slice(m.index + m[0].length)
      const dynamic = !m[2] && after.startsWith('${')
      uses.push({ name: m[1], file: rel(f), line: i + 1, hasFallback: !!m[2], dynamic })
    }
  })
}
for (const f of cssFiles) collectUses(f, stripCssComments(read(f)))
for (const f of codeFiles) collectUses(f, read(f))

if (!uses.length) die('parsed no var() uses at all. Fix this parser rather than trusting a pass.')

/* ---------- verdict ---------- */

console.log('Design tokens: every var(--token) resolves to a declaration\n')
console.log(`  ${declared.size} tokens declared across ${cssFiles.length} stylesheets and ${codeFiles.length} source files`)
console.log(`  ${uses.length} var() uses examined\n`)

const names = [...declared.keys()]
const resolves = (u) => (u.dynamic ? names.some((n) => n.startsWith(u.name)) : declared.has(u.name))

const missing = uses.filter((u) => !resolves(u))
const hard = missing.filter((u) => !u.hasFallback && !u.dynamic)
const soft = missing.filter((u) => u.hasFallback || u.dynamic)

for (const u of hard) {
  console.log(`  FAIL ${u.name}`)
  console.log(`       ${u.file}:${u.line} — undefined, no fallback, so this declaration is silently dropped`)
}
for (const u of soft) {
  console.log(`  warn ${u.name}`)
  console.log(`       ${u.file}:${u.line} — ${u.dynamic ? 'composed at runtime and no declared token starts with this prefix' : 'undefined but carries a fallback, so it renders the fallback'}`)
}

const usedNames = new Set(uses.map((u) => u.name))
const unused = names.filter((n) => !usedNames.has(n) && !uses.some((u) => u.dynamic && n.startsWith(u.name))).sort()
if (unused.length) {
  console.log(`\n  ${unused.length} declared and never read via var(): ${unused.join(', ')}`)
  console.log('  (informational — a token may be read by Tailwind, by name, or be a deliberate handle)')
}

const dyn = uses.filter((u) => u.dynamic).length
console.log(`\n${uses.length - missing.length} uses resolved (${dyn} of them by prefix), ${hard.length} undefined without a fallback`)
process.exit(hard.length > 0 ? 1 : 0)
