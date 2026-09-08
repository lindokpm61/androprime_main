#!/usr/bin/env node
/**
 * Every `f-` / `fb-` class a component renders must exist in the stylesheets.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-f-classes.js
 *
 * WHY THIS EXISTS. A class name is a string, and a string that matches nothing
 * is not an error anywhere in this stack. React renders it, the build ships it,
 * `tsc` cannot see it, and the browser applies no rule — so the element falls
 * back to whatever it inherits and the page renders. A typo in `className` and
 * a deleted rule produce exactly the same symptom, which is a page that looks
 * ALMOST right.
 *
 * That matters more here than in a Tailwind-only codebase because Direction F
 * is a hand-written component layer: 3,250 lines of `f-` rules that nothing
 * generates and nothing type-checks. `.f-tray` is one letter from `.f-tray-`
 * and two from `.f-trey`, and only one of the three is real.
 *
 * DIRECTION. The failing direction is used-but-undefined: the component asks
 * for styling it will not get. Defined-but-unused is reported at the end and
 * does NOT fail, because a rule can be waiting for a page that is not rebuilt
 * yet — 32 routes are still on the old design as of 2026-09-08.
 *
 * WHAT IS SCANNED. `className="..."`, `className={...}` (every string literal
 * inside the expression, so conditionals and template literals are covered),
 * and the DOM APIs that carry a class as a string: classList.add/remove/toggle
 * /contains, and the `.f-x` selector arguments of querySelector(All), closest
 * and matches.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const PREFIX = /^(?:f|fb)-[a-z][a-z0-9-]*$/

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

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

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')
const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ')

/* ---------- what the stylesheets define ---------- */

const cssFiles = [
  ...walk(path.join(ROOT, 'styles'), ['.css']),
  ...walk(path.join(ROOT, 'app'), ['.css']),
  ...walk(path.join(ROOT, 'components'), ['.css']),
]
if (cssFiles.length < 10) die(`found only ${cssFiles.length} stylesheets — the layout changed; fix this collector rather than trusting a pass.`)

const defined = new Map() // class -> file it is first declared in
// A selector prelude is the run of text since the last `{`, `}` or `;`. Scanned
// character by character rather than by one global regex, because a regex has to
// CONSUME the opening brace of `@media (...) {` and then cannot use that same
// brace as the anchor for the nested rule inside it — which silently hid every
// selector living in a media query, `.f-shot-tall` among them.
for (const f of cssFiles) {
  const src = stripCssComments(read(f))
  let prelude = ''
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (ch === '{') {
      if (!/^\s*@/.test(prelude)) {
        for (const c of prelude.matchAll(/\.((?:f|fb)-[a-z][a-z0-9-]*)/g)) {
          if (!defined.has(c[1])) defined.set(c[1], rel(f))
        }
      }
      prelude = ''
    } else if (ch === '}' || ch === ';') {
      prelude = ''
    } else {
      prelude += ch
    }
  }
}
if (!defined.size) die('parsed no f- class selectors out of the stylesheets. Fix this parser rather than trusting a pass.')

/* ---------- what the components render ---------- */

const codeFiles = [
  ...walk(path.join(ROOT, 'app'), ['.tsx', '.ts']),
  ...walk(path.join(ROOT, 'components'), ['.tsx', '.ts']),
  ...walk(path.join(ROOT, 'content'), ['.mdx']),
]

// Read a balanced `{...}` starting at `i` (which points at the `{`).
function balanced(src, i) {
  let depth = 0
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') depth++
    else if (src[j] === '}') { depth--; if (depth === 0) return src.slice(i, j + 1) }
  }
  return src.slice(i, i + 400)
}

const used = new Map() // class -> Set("file:line")
const use = (cls, f, line) => {
  if (!used.has(cls)) used.set(cls, new Set())
  used.get(cls).add(`${rel(f)}:${line}`)
}
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length

// Class names are pulled out of a string literal on WORD BOUNDARIES rather than
// by splitting on whitespace. A template literal writes them flush against the
// interpolation — `` `f-navshell${scrolled ? ' f-scrolled' : ''}` `` — so a
// whitespace split yields `f-navshell${scrolled`, which matches nothing and
// silently drops both classes from the used set.
const CLASS_IN_STRING = /(?<![A-Za-z0-9_-])((?:f|fb)-[a-z][a-z0-9-]*)(?![A-Za-z0-9_-])/g

function harvest(text, f, line) {
  for (const lit of text.matchAll(/'([^']*)'|"([^"]*)"|`([^`]*)`/g)) {
    const s = lit[1] ?? lit[2] ?? lit[3] ?? ''
    for (const m of s.matchAll(CLASS_IN_STRING)) if (PREFIX.test(m[1])) use(m[1], f, line)
  }
}

for (const f of codeFiles) {
  const src = read(f)
  for (const m of src.matchAll(/className\s*=\s*/g)) {
    const at = m.index + m[0].length
    const text = src[at] === '{' ? balanced(src, at) : src.slice(at).match(/^"[^"]*"|^'[^']*'/)?.[0] || ''
    harvest(text, f, lineOf(src, m.index))
  }
  for (const m of src.matchAll(/classList\.(?:add|remove|toggle|contains)\(([^)]*)\)/g)) harvest(m[1], f, lineOf(src, m.index))
  for (const m of src.matchAll(/(?:querySelectorAll|querySelector|closest|matches)\(([^)]*)\)/g)) harvest(m[1], f, lineOf(src, m.index))
}

if (!used.size) die('parsed no f- classes out of the components. Fix this parser rather than trusting a pass.')

/* ---------- verdict ---------- */

console.log('Direction F classes: every class rendered has a rule\n')
console.log(`  ${defined.size} classes defined across ${cssFiles.length} stylesheets`)
console.log(`  ${used.size} distinct classes rendered by ${codeFiles.length} source files\n`)

let fail = 0
for (const [cls, sites] of [...used].sort()) {
  if (defined.has(cls)) continue
  fail++
  console.log(`  FAIL .${cls} — rendered but no rule defines it`)
  for (const s of [...sites].slice(0, 6)) console.log(`       ${s}`)
  if (sites.size > 6) console.log(`       ... and ${sites.size - 6} more`)
}

const unused = [...defined.keys()].filter((c) => !used.has(c)).sort()
if (unused.length) {
  console.log(`\n  ${unused.length} defined and not rendered anywhere:`)
  console.log(`  ${unused.join(', ')}`)
  console.log('  (informational — 32 routes are still on the old design, so a rule may be waiting for its page)')
}

console.log(`\n${used.size - fail} rendered classes resolved, ${fail} undefined`)
process.exit(fail > 0 ? 1 : 0)
