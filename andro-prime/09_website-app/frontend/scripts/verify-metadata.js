#!/usr/bin/env node
/**
 * Every page's own `metadata` export agrees with the root title template, and
 * every INDEXABLE page's title and description fit inside what a search result
 * will actually show.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-metadata.js
 *   node andro-prime/09_website-app/frontend/scripts/verify-metadata.js --report
 *
 * WHY THIS EXISTS. Defect register M1 and M7, and M1 is the one that bites.
 *
 * `app/layout.tsx` sets `title.template: "%s | Andro Prime"`, so Next appends
 * the brand to every page title. Four pages then typed the brand into their own
 * title as well, and the tab read the brand TWICE:
 *
 *   /order/confirmed   Order Confirmed | Andro Prime | Andro Prime
 *   /checkout/details  A few details for the lab | Andro Prime | Andro Prime
 *   /how-to-sample     How to take your sample | Andro Prime | Andro Prime
 *   /go                Andro Prime | Andro Prime
 *
 * Two of those are the pages a man is looking at while paying, and `/go` is the
 * Instagram link-in-bio grid, so its tab, its share preview and its bookmark all
 * read as the company name typed twice and nothing else. It was live, not
 * branch-only: production `/order/confirmed` returned the doubled title on
 * 2026-09-12.
 *
 * 🔴 THE KNOWLEDGE ALREADY EXISTED IN THE CODEBASE AND DID NOT TRAVEL. Both
 * `app/(marketing)/page.tsx` and `app/(marketing)/blog/[slug]/page.tsx` carry a
 * comment above their own metadata explaining the rule, one of them saying in
 * so many words that setting the brand here too produced a double-branded
 * `<title>`. One file's comment cannot reach another file's author. That is the
 * whole argument for this being a check rather than a fifth comment.
 *
 * ⚠ WHAT IT READS, AND THE BLIND SPOT IT CANNOT CLOSE. This is a STATIC read of
 * `export const metadata` object literals under `app/`. Two routes build their
 * metadata in `generateMetadata` from data this script cannot see —
 * `/blog/[slug]` (from `blog_articles`) and `/authors/[slug]` (from
 * `lib/authors.ts`) — and M7's two longest descriptions are on exactly those
 * routes. They are named in SKIPPED below so the gap is printed on every run
 * rather than inferred from silence, and they are measured for real by
 * `scripts/audit-rendered-markup.js`, which reads the rendered `<head>`.
 *
 * ⚠ THE BRAND RULE IS CHECKED ON EVERY PAGE; THE LENGTH RULES ONLY ON INDEXABLE
 * ONES. A doubled title is a defect in the browser tab, which a `noindex` page
 * still has. A 210-character description on a `noindex` page is read by nothing,
 * and failing the build over it would be the check crying wolf on work that does
 * not matter — which is how a check gets switched off, taking the half that did
 * work with it. `robots: { index: false }` in a page's own metadata is what
 * marks it, because that is where this repo states it.
 *
 * Exits 1 on any failure.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const APP = path.join(ROOT, 'app')

const argv = process.argv.slice(2)
if (argv.includes('--help') || argv.includes('-h')) {
  const src = fs.readFileSync(__filename, 'utf8')
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n')
  process.exit(0)
}
const REPORT = argv.includes('--report')

/* The root template is read from the file rather than typed here, so that
   changing the template is not a way of silently disarming the brand rule. */
const ROOT_LAYOUT = path.join(APP, 'layout.tsx')

/* Google truncates a title around 580px and a description around 920px, which
   is characters only by approximation. These are the numbers M7 measured
   against and they are deliberately the same ones, so a figure printed here can
   be compared with a figure on the register. */
const TITLE_MAX = 60
const DESC_MAX = 160

/* Routes whose metadata is computed at request time. Listed, not detected, so
   that a NEW dynamic route does not join the blind spot in silence: the scan
   fails if a file here has gained a static `metadata`, or has gone. */
const SKIPPED = [
  {
    file: 'app/(marketing)/blog/[slug]/page.tsx',
    why: 'title and description come from blog_articles; the DB is the copy source',
  },
  {
    file: 'app/(marketing)/authors/[slug]/page.tsx',
    why: 'description is author.bio from lib/authors.ts, which is also the Person schema description',
  },
]

/*
 * THE LENGTH ALLOWLIST, and it is a ratchet in the same shape as
 * `verify-retired-vocabulary.js`: file, the date it was listed, the measured
 * length on that date, and why it is not simply fixed. A cap may be lowered and
 * never raised, and an entry that has stopped offending is a failure, because a
 * stale exemption is how the next real one hides.
 *
 * Everything on this list is here for ONE reason: shortening it is a copy
 * change to text that is approved, clinical, or owed to somebody. A build check
 * is not the place to launder a copy decision.
 */
const LENGTH_ALLOW = []

/* ---------------------------------------------------------------- scanning */

/**
 * Mark which characters are STRUCTURE rather than string content or comment.
 *
 * m[i] = 1 for a code character, and for the OPENING quote of a string (so a
 * value's start can be found), 0 for everything inside a string or a comment.
 * Brace counting and key detection only ever look at marked characters, which
 * is what stops a `{` inside a description, or inside one of this repo's very
 * long header comments, from being counted as structure.
 */
function markCode(src) {
  const m = new Uint8Array(src.length)
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2)
      i = e === -1 ? src.length : e + 2
      continue
    }
    if (c === '/' && src[i + 1] === '/') {
      const e = src.indexOf('\n', i)
      i = e === -1 ? src.length : e
      continue
    }
    if (c === '"' || c === "'") {
      m[i] = 1
      const q = c
      i++
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue }
        if (src[i] === q) { i++; break }
        i++
      }
      continue
    }
    if (c === '`') {
      m[i] = 1
      i++
      let depth = 0
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue }
        if (src[i] === '$' && src[i + 1] === '{') { depth++; i += 2; continue }
        if (src[i] === '}' && depth > 0) { depth--; i++; continue }
        if (src[i] === '`' && depth === 0) { i++; break }
        i++
      }
      continue
    }
    m[i] = 1
    i++
  }
  return m
}

function balancedEnd(src, m, open) {
  let d = 0
  for (let i = open; i < src.length; i++) {
    if (!m[i]) continue
    if (src[i] === '{') d++
    else if (src[i] === '}') { d--; if (d === 0) return i }
  }
  return -1
}

/** Read a single- or double-quoted literal starting at `i`, or null. */
function readString(src, i) {
  const q = src[i]
  if (q !== '"' && q !== "'") return null
  let out = ''
  let j = i + 1
  while (j < src.length) {
    const c = src[j]
    if (c === '\\') {
      const n = src[j + 1]
      out += n === 'n' ? '\n' : n === 't' ? '\t' : n
      j += 2
      continue
    }
    if (c === q) return { value: out, end: j + 1 }
    out += c
    j++
  }
  return null
}

/**
 * The top-level entries of an object literal: key, and the raw span of its
 * value. Nested objects, arrays and calls are stepped over by depth, so
 * `openGraph.title` is never mistaken for the page's own title — which is the
 * distinction the whole M1 check turns on, since almost every page in this repo
 * DOES correctly carry the brand inside `openGraph` and `twitter`.
 */
function topLevelEntries(src, m, open, close) {
  const out = []
  let d = 0
  let i = open + 1
  while (i < close) {
    if (!m[i]) { i++; continue }
    const c = src[i]
    if (c === '{' || c === '[' || c === '(') { d++; i++; continue }
    if (c === '}' || c === ']' || c === ')') { d--; i++; continue }
    if (d === 0 && /[A-Za-z_$]/.test(c)) {
      let j = i
      while (j < close && m[j] && /[\w$]/.test(src[j])) j++
      const key = src.slice(i, j)
      let k = j
      while (k < close && (!m[k] || /\s/.test(src[k]))) k++
      if (src[k] !== ':') { i = j; continue }
      let v = k + 1
      while (v < close && (!m[v] || /\s/.test(src[v]))) v++
      // Walk to the comma that closes this entry at depth 0.
      let e = v
      let vd = 0
      while (e < close) {
        if (!m[e]) { e++; continue }
        const ch = src[e]
        if (ch === '{' || ch === '[' || ch === '(') vd++
        else if (ch === '}' || ch === ']' || ch === ')') vd--
        else if (ch === ',' && vd === 0) break
        e++
      }
      out.push({ key, start: v, end: e })
      i = e + 1
      continue
    }
    i++
  }
  return out
}

/* ------------------------------------------------------------------- pages */

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!e.name.startsWith('_') && e.name !== 'api') walk(p, acc)
    } else if (e.name === 'page.tsx' || e.name === 'layout.tsx') {
      acc.push(p)
    }
  }
  return acc
}

/** `app/(marketing)/kits/page.tsx` -> `/kits`. A (group) is not a path segment. */
function urlFor(file) {
  const parts = path.relative(APP, path.dirname(file)).split(path.sep).filter(Boolean)
  const u = '/' + parts.filter((s) => !(s.startsWith('(') && s.endsWith(')'))).join('/')
  return u === '/' ? '/' : u.replace(/\/$/, '')
}

const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')

function readMetadata(file) {
  const src = fs.readFileSync(file, 'utf8')
  const m = markCode(src)
  const decl = /export\s+const\s+metadata\b/g
  let hit = null
  let mm
  while ((mm = decl.exec(src))) { if (m[mm.index]) { hit = mm.index + mm[0].length; break } }
  if (hit === null) return null
  let i = hit
  while (i < src.length && src[i] !== '=') i++
  while (i < src.length && src[i] !== '{') i++
  if (i >= src.length) return null
  const close = balancedEnd(src, m, i)
  if (close === -1) return null
  return { src, m, open: i, close, entries: topLevelEntries(src, m, i, close) }
}

/* ------------------------------------------------------------------- rules */

const failures = []
const rows = []
const fail = (where, msg) => failures.push(`${where}\n    ${msg}`)

/* The template is read rather than assumed. If it stops appending the brand,
   the brand rule below is measuring something that no longer happens. */
const rootMeta = readMetadata(ROOT_LAYOUT)
if (!rootMeta) {
  console.error('ERROR: no `export const metadata` in app/layout.tsx. The title template is the premise of this whole check.')
  process.exit(1)
}
const titleEntry = rootMeta.entries.find((e) => e.key === 'title')
const rootTitleRaw = titleEntry ? rootMeta.src.slice(titleEntry.start, titleEntry.end) : ''
const tmplMatch = /template\s*:\s*(['"])([^'"]*)\1/.exec(rootTitleRaw)
if (!tmplMatch) {
  console.error('ERROR: app/layout.tsx metadata has no title.template. Either the template was removed (and the pages this check protects should take their brand back), or it moved. Fix that file rather than this line.')
  process.exit(1)
}
const TEMPLATE = tmplMatch[2]
const SUFFIX = TEMPLATE.replace('%s', '')
const BRAND = SUFFIX.replace(/^\s*\|\s*/, '').trim()
if (!BRAND) {
  console.error(`ERROR: could not read a brand out of the title template ${JSON.stringify(TEMPLATE)}.`)
  process.exit(1)
}

/* The dynamic routes: assert the blind spot is still the shape it was. */
for (const s of SKIPPED) {
  const abs = path.join(ROOT, s.file)
  if (!fs.existsSync(abs)) {
    fail(s.file, 'listed in SKIPPED as a generateMetadata route, and the file has gone. Remove the entry.')
    continue
  }
  if (readMetadata(abs)) {
    fail(s.file, 'listed in SKIPPED as a generateMetadata route, but it now exports a static `metadata`. Delete the SKIPPED entry so the file is scanned.')
  }
}
const skippedFiles = new Set(SKIPPED.map((s) => s.file))

const seenAllow = new Set()

for (const file of walk(APP)) {
  const r = rel(file)
  if (skippedFiles.has(r)) continue
  if (file === ROOT_LAYOUT) continue
  const meta = readMetadata(file)
  if (!meta) continue

  const url = urlFor(file)
  const get = (k) => meta.entries.find((e) => e.key === k)

  // robots: { index: false } is how this repo says noindex on a page.
  const robots = get('robots')
  const robotsRaw = robots ? meta.src.slice(robots.start, robots.end) : ''
  const indexable = !/index\s*:\s*false/.test(robotsRaw)

  const tEntry = get('title')
  const dEntry = get('description')

  let title = null
  let titleDynamic = false
  if (tEntry) {
    const lit = readString(meta.src, tEntry.start)
    if (lit && lit.end >= tEntry.end - 1) title = lit.value
    else { titleDynamic = true; title = meta.src.slice(tEntry.start, tEntry.end) }
  }

  let desc = null
  let descDynamic = false
  if (dEntry) {
    const lit = readString(meta.src, dEntry.start)
    if (lit && lit.end >= dEntry.end - 1) desc = lit.value
    else { descDynamic = true; desc = meta.src.slice(dEntry.start, dEntry.end) }
  }

  const allow = LENGTH_ALLOW.find((a) => a.file === r)
  if (allow) seenAllow.add(r)

  /* ---- rule 1: the brand is appended by the template, never typed ---- */
  if (title !== null && !titleDynamic && title.includes(BRAND)) {
    fail(`${r}  (${url})`,
      `title contains ${JSON.stringify(BRAND)}, and the root template appends ${JSON.stringify(SUFFIX)}.\n` +
      `    Renders as: ${JSON.stringify(title + SUFFIX)}\n` +
      `    Fix: drop the brand from the page title. openGraph.title and twitter.title DO carry it and are not read by this rule.`)
  }

  /* ---- rules 2 and 3: lengths, indexable pages only ---- */
  const full = title !== null && !titleDynamic ? title + SUFFIX : null
  if (indexable && full !== null && full.length > TITLE_MAX) {
    const cap = allow && allow.title
    if (cap === undefined) {
      fail(`${r}  (${url})`, `title is ${full.length} characters with the suffix, over ${TITLE_MAX}: ${JSON.stringify(full)}`)
    } else if (full.length > cap) {
      fail(`${r}  (${url})`, `title is ${full.length} characters, and the allowlist pinned it at ${cap} on ${allow.since}. The ratchet only turns down.`)
    }
  }
  if (indexable && desc !== null && !descDynamic && desc.length > DESC_MAX) {
    const cap = allow && allow.description
    if (cap === undefined) {
      fail(`${r}  (${url})`, `description is ${desc.length} characters, over ${DESC_MAX}. Search results cut it.`)
    } else if (desc.length > cap) {
      fail(`${r}  (${url})`, `description is ${desc.length} characters, and the allowlist pinned it at ${cap} on ${allow.since}. The ratchet only turns down.`)
    }
  }

  rows.push({
    url,
    file: r,
    indexable,
    titleLen: full === null ? null : full.length,
    descLen: desc === null || descDynamic ? null : desc.length,
  })
}

/* ---- rule 4: no stale exemption ---- */
for (const a of LENGTH_ALLOW) {
  if (!seenAllow.has(a.file)) {
    fail(a.file, `on the length allowlist since ${a.since}, and the scan did not reach it (moved, deleted, or its metadata export has gone). Remove the entry.`)
  }
}

/* ----------------------------------------------------------------- output */

if (REPORT) {
  const sorted = rows.slice().sort((a, b) => a.url.localeCompare(b.url))
  const w = Math.max(...sorted.map((r) => r.url.length), 5)
  console.log(`${'ROUTE'.padEnd(w)}  IDX  TITLE  DESC`)
  for (const r of sorted) {
    console.log(
      `${r.url.padEnd(w)}  ${r.indexable ? ' Y ' : ' n '}  ` +
      `${String(r.titleLen === null ? '-' : r.titleLen).padStart(5)}  ${String(r.descLen === null ? '-' : r.descLen).padStart(4)}` +
      `${r.titleLen !== null && r.titleLen > TITLE_MAX ? '  <- title' : ''}` +
      `${r.descLen !== null && r.descLen > DESC_MAX ? '  <- desc' : ''}`
    )
  }
  console.log('')
}

const scanned = rows.length
if (failures.length) {
  console.error(`verify-metadata: ${failures.length} failure${failures.length === 1 ? '' : 's'} over ${scanned} metadata exports.\n`)
  for (const f of failures) console.error(`  ${f}\n`)
  console.error(`  Not scanned (metadata computed at request time, measured by audit-rendered-markup.js instead):`)
  for (const s of SKIPPED) console.error(`    ${s.file}\n      ${s.why}`)
  process.exit(1)
}

console.log(
  `verify-metadata: ${scanned} metadata exports clean ` +
  `(brand appended by the template, not typed; indexable titles <= ${TITLE_MAX}, descriptions <= ${DESC_MAX}).`
)
console.log(`  ${SKIPPED.length} routes not scanned, metadata computed at request time: ${SKIPPED.map((s) => s.file.replace(/^app/, '')).join(', ')}`)
if (LENGTH_ALLOW.length) console.log(`  ${LENGTH_ALLOW.length} on the length allowlist.`)
