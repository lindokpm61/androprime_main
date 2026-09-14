#!/usr/bin/env node
/**
 * The retired V2.0 vocabulary does not appear in a className anywhere under
 * `app/` or `components/`, except on a dated, shrinking allowlist.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-retired-vocabulary.js
 *
 * WHY THIS EXISTS. Defect register C4, and it is C1 to C3 stated once as a
 * mechanism rather than three times as instances.
 *
 * The repo owns ten design checks and EVERY ONE OF THEM IS A PRESENCE TEST OVER
 * A ROUTE OR A STYLESHEET. `verify-f-classes` confirms the `f-` classes a file
 * asks for exist. `verify-design-tokens` holds the token ladder.
 * `verify-f-scaffold` checks a route's root. `route-conformance` counts F
 * classes per rendered route. `audit-dark-contrast` measures 16 named URLs.
 * None of them asks the ABSENCE question, and none has a component as its unit,
 * so a V2.0 component rendered inside a conformant route passed all ten without
 * being looked at once.
 *
 * That is not hypothetical. On 2026-09-12 `route-conformance.md` read 36 of 36
 * routes Direction F while `BundleChoice` (41 V2.0 tokens, 0 F classes) was on
 * all three kit detail pages, `PasswordBanner` (32) opened the results
 * dashboard, `NewsletterForm` (27) was the blog's only capture, and both error
 * boundaries (18 and 21) were untouched. The count was not wrong. It was
 * answering a different question from the one its headline implied.
 *
 * 🔴 THE DIRECTION IS THE POINT. A count that RISES is a report; an allowlist
 * that SHRINKS is a plan. So every exemption below carries a file, a date, a
 * recorded number of offences and a reason, and the check fails three ways:
 *
 *   1. A file NOT on the list uses the retired vocabulary at all.
 *   2. A file ON the list uses MORE of it than the day it was listed. The
 *      ratchet only turns one way.
 *   3. A file on the list has stopped offending, or no longer exists. A stale
 *      exemption is how the next real one gets hidden.
 *
 * ⚠ IT READS className ATTRIBUTES, NOT FILES, AND THAT DISTINCTION IS THE WHOLE
 * CORRECTNESS ARGUMENT. Measured the day this shipped: a naive
 * `grep -rlE 'font-black|border-[24]|tracking-widest|bg-gray-|text-gray-|
 * bg-black|text-white|font-serif'` over the same two trees named SIXTEEN files.
 * THREE of them render it. The other thirteen match inside a COMMENT, and
 * almost all of those comments are recording that the V2.0 class was removed,
 * or explaining which `globals.css` V2.0 rule a page is overriding. Writing
 * down a removal is what would have kept the file failing forever — the
 * identical defect that kept four dead components alive through the sweep that
 * existed to find them (register C3). So comments are blanked by a scanner
 * before anything is matched, and only the text of a `className` is read.
 *
 * ⚠ WHAT IS NOT IN THE LIST, AND WHY. `text-black` and `bg-white` are V2.0 too,
 * and they are deliberately absent: BANNED below is the exact set C1's
 * measurement used, so the numbers this check prints can be compared against the
 * numbers on the register. Widening it is a decision to take on purpose, with
 * the allowlist re-measured in the same pass — not a tightening to slip in.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const TREES = ['app', 'components']

/* The retired vocabulary, as C1 measured it. A class is matched after its
   variant prefixes are stripped, so `hover:bg-gray-50`, `md:border-4` and
   `disabled:hover:bg-black` all count. */
const BANNED = [
  { re: /^font-black$/, name: 'font-black' },
  { re: /^border(?:-[trblxy])?-[24]$/, name: 'border-2 / border-4' },
  { re: /^tracking-widest$/, name: 'tracking-widest' },
  { re: /^bg-gray-\d+$/, name: 'bg-gray-*' },
  { re: /^text-gray-\d+$/, name: 'text-gray-*' },
  { re: /^bg-black$/, name: 'bg-black' },
  { re: /^text-white$/, name: 'text-white' },
  { re: /^font-serif$/, name: 'font-serif' },
]

/*
 * THE ALLOWLIST. Every entry is a file that has not been migrated yet, the date
 * it was listed, the number of offences it had on that date, and why it is not
 * done. `max` is a ratchet: lower it when the file improves, and the check fails
 * if it ever climbs.
 *
 * Two of these are named in defect register C1's own aside as "a lower order of
 * problem, listed so the sweep is complete rather than a sample". They are the
 * next two to take, and they are the reason this list is not empty.
 */
const ALLOW = [
  {
    file: 'components/supplement-waitlist/SupplementWaitlistForm.tsx',
    since: '2026-09-14',
    max: 21,
    why: 'Half-migrated: 25 F classes against 30 V2.0, on seven routes. Named in C1 as the larger of the two deferred rebuilds. It is a form, so it takes the same treatment NewsletterForm just had.',
  },
  {
    file: 'components/marketing/RelatedArticles.tsx',
    since: '2026-09-14',
    max: 8,
    why: 'Half-migrated: 25 F classes against 14 V2.0, on every article and six marketing pages. It already takes a `variant="f"` prop, so the V2.0 branch is the one still standing rather than the whole component.',
  },
  {
    file: 'app/layout.tsx',
    since: '2026-09-14',
    max: 2,
    why: 'The root <body> ground, `bg-white text-black` plus the selection colours. It is under every surface in the app INCLUDING the routes still on V2.0, so repointing it at the F tokens is a site-wide change with its own rendered check, not a component rebuild.',
  },
]

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

/* ---------- comments out, strings kept ----------
   A className value IS a string literal, so strings have to survive; comments
   must not, because eleven of the twenty-two naive matches in this tree are
   comments recording that the class was removed. Character-scanned rather than
   regex-replaced: `href="https://..."` contains `//` and an apostrophe in prose
   is not a quote. The scanner asserts it has not lost its place, because a
   scanner that has is silent and reports a clean file. */
function stripComments(src) {
  const out = src.split('')
  const blank = (i) => { if (out[i] !== '\n') out[i] = ' ' }
  const stack = []
  let prev = ''
  let prevWord = ''
  const KEYWORD_BEFORE_REGEX = new Set([
    'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void',
    'case', 'do', 'else', 'yield', 'await', 'throw',
  ])
  const canPrecedeRegex = (p) =>
    p === '' || !/[A-Za-z0-9_$)\]]/.test(p) || KEYWORD_BEFORE_REGEX.has(prevWord)
  let i = 0
  const n = src.length
  while (i < n) {
    const c = src[i]
    const top = stack[stack.length - 1]
    if (!top || top === '${') {
      if (top === '${' && c === '}') { stack.pop(); i++; continue }
      if (c === '/' && src[i + 1] === '/') { stack.push('//'); blank(i); i++; continue }
      if (c === '/' && src[i + 1] === '*') { stack.push('/*'); blank(i); i++; continue }
      if (c === '/' && canPrecedeRegex(prev)) {
        // A regex literal's body is not a className and its slashes are not a
        // comment. Skipped whole. `/[",\n\r]/` is the live example.
        let j = i + 1
        let inClass = false
        for (; j < n; j++) {
          const d = src[j]
          if (d === '\\') { j++; continue }
          if (d === '\n') break
          if (d === '[') inClass = true
          else if (d === ']') inClass = false
          else if (d === '/' && !inClass) break
        }
        if (j < n && src[j] === '/') { prev = '/'; prevWord = ''; i = j + 1; continue }
      }
      if (c === "'" || c === '"' || c === '`') { stack.push(c); prevWord = ''; i++; continue }
      if (/[A-Za-z_$]/.test(c)) {
        let j = i
        while (j < n && /[\w$]/.test(src[j])) j++
        prevWord = src.slice(i, j)
        prev = src[j - 1]
        i = j
        continue
      }
      if (!/\s/.test(c)) { prev = c; prevWord = '' }
      i++
      continue
    }
    if (top === '//') {
      if (c === '\n') stack.pop()
      else blank(i)
      i++
      continue
    }
    if (top === '/*') {
      blank(i)
      if (c === '*' && src[i + 1] === '/') { blank(i + 1); stack.pop(); i += 2; continue }
      i++
      continue
    }
    // inside a string or template: kept, because a className lives here
    if (c === '\\') { i += 2; continue }
    if (top === '`' && c === '$' && src[i + 1] === '{') { stack.push('${'); i += 2; continue }
    if (c === top) { stack.pop(); prev = 'x'; prevWord = '' }
    i++
  }
  while (stack.length && stack[stack.length - 1] === '//') stack.pop()
  return { text: out.join(''), unterminated: stack.length ? stack[stack.length - 1] : null }
}

/* Balance a `{ ... }` expression so a conditional or a template className is
   read whole. Same shape as verify-f-classes.js, which reads the same attribute
   for the opposite question. */
function balanced(src, at) {
  let depth = 0
  for (let i = at; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(at, i + 1) }
  }
  return ''
}

const lineOf = (src, idx) => src.slice(0, idx).split('\n').length

/* ---------- scan ---------- */

const files = []
for (const tree of TREES) files.push(...walk(path.join(ROOT, tree), ['.tsx', '.ts']))
if (files.length < 100) {
  die(`found only ${files.length} source files — the trees moved. Fix this collector rather than trusting a pass.`)
}

const perFile = new Map() // rel path -> [{ line, cls, name }]
let attributes = 0

for (const f of files) {
  const { text, unterminated } = stripComments(read(f))
  if (unterminated) {
    die(`${rel(f)} left a literal open at end of file (${unterminated}). That is this scanner ` +
        `losing its place, not the file being broken. Everything after it was read as prose, so ` +
        `a pass here would mean nothing.`)
  }
  for (const m of text.matchAll(/className\s*=\s*/g)) {
    const at = m.index + m[0].length
    const value = text[at] === '{'
      ? balanced(text, at)
      : text.slice(at).match(/^"[^"]*"|^'[^']*'/)?.[0] || ''
    if (!value) continue
    attributes++
    const line = lineOf(text, m.index)
    for (const lit of value.matchAll(/'([^']*)'|"([^"]*)"|`([^`]*)`/g)) {
      const s = lit[1] ?? lit[2] ?? lit[3] ?? ''
      for (const raw of s.split(/[\s`${}]+/)) {
        if (!raw) continue
        // strip Tailwind variant prefixes: hover:, md:, disabled:hover:, ...
        const cls = raw.slice(raw.lastIndexOf(':') + 1)
        const hit = BANNED.find((b) => b.re.test(cls))
        if (!hit) continue
        const key = rel(f)
        if (!perFile.has(key)) perFile.set(key, [])
        perFile.get(key).push({ line, cls, name: hit.name })
      }
    }
  }
}

if (!attributes) die('parsed no className attributes at all. Fix this parser rather than trusting a pass.')

/* ---------- verdict ---------- */

const allowed = new Map(ALLOW.map((a) => [a.file, a]))
const total = [...perFile.values()].reduce((n, v) => n + v.length, 0)

console.log('Retired V2.0 vocabulary: not in a className, except where allowed\n')
console.log(`  ${files.length} files scanned, ${attributes} className attributes read`)
console.log(`  ${total} retired class${total === 1 ? '' : 'es'} in ${perFile.size} file${perFile.size === 1 ? '' : 's'}, ${ALLOW.length} allowed\n`)

let fail = 0

// 3. stale exemptions, checked first: they are the ones that hide the rest.
for (const a of ALLOW) {
  const abs = path.join(ROOT, a.file)
  if (!fs.existsSync(abs)) {
    console.error(`  FAIL ${a.file} is on the allowlist and does not exist. Remove the entry.`)
    fail++
    continue
  }
  const hits = perFile.get(a.file)
  if (!hits || !hits.length) {
    console.error(
      `  FAIL ${a.file} is on the allowlist and is now CLEAN. Remove the entry — ` +
      `an exemption that is not exempting anything hides the next real one.`,
    )
    fail++
    continue
  }
  if (hits.length > a.max) {
    console.error(
      `  FAIL ${a.file} has ${hits.length} retired classes, allowed ${a.max} since ${a.since}. ` +
      `The ratchet only turns one way: this file may improve, never regress.`,
    )
    for (const h of hits.slice(0, 8)) console.error(`       :${h.line}  ${h.cls}`)
    fail++
    continue
  }
  console.log(`  ALLOWED ${a.file} — ${hits.length}/${a.max} since ${a.since}`)
  console.log(`          ${a.why}`)
}

// 1 and 2. anything not on the list.
const offenders = [...perFile.entries()].filter(([f]) => !allowed.has(f)).sort()
if (offenders.length) {
  console.error(`\nERROR: the retired vocabulary is rendered by ${offenders.length} file${offenders.length === 1 ? '' : 's'} that is not on the allowlist:\n`)
  for (const [file, hits] of offenders) {
    console.error(`  ${file}  (${hits.length})`)
    for (const h of hits.slice(0, 10)) console.error(`       :${h.line}  ${h.cls}   [${h.name}]`)
    if (hits.length > 10) console.error(`       ... and ${hits.length - 10} more`)
  }
  console.error(
    `\nRebuild the file on the Direction F component layer, or add it to ALLOW in this ` +
    `check with a date, a count and a reason. Do not reach for the second option twice ` +
    `in a row: the list is a plan, and a plan that grows is a report.\n`,
  )
  fail += offenders.length
}

if (fail) process.exit(1)

console.log(`\n${files.length} files clean, ${ALLOW.length} allowed and shrinking\n`)
