#!/usr/bin/env node
/**
 * Does a candidate query collide with something a PUBLISHED article already claims?
 *
 * This is the check `article-to-review` Phase A failure mode 2 describes, made runnable.
 * The authoritative answer to "has this already been done?" is the `keyword_coverage`
 * block in each live article's frontmatter, which names the primary query and the
 * keywords.csv rows the article covers. The keyword_queue cannot answer it: nothing
 * writes coverage back into the queue, and `promote-keyword`'s existing-claim check reads
 * `primary_article_slug`, which is EMPTY on a row the hub merely planned to cover. So a
 * hub that already owns "abnormal liver function test" does not stop a spoke being
 * promoted for the same intent, and the collision surfaces only after the article is written.
 *
 * Caught live on 2026-08-15: two of three promoted liver spokes duplicated queries the
 * liver hub had claimed since June.
 *
 * Usage (from this directory):
 *   node coverage-collision.mjs                      # check every role=fanout row
 *   node coverage-collision.mjs "some query" ...     # check specific queries
 * Exit: 0 clean, 2 collisions found, 1 could not run (never a pass).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CSV = path.join(HERE, '..', 'keywords.csv')
const BLOG = path.resolve(HERE, '../../../09_website-app/frontend/content/blog')

const parseCsvLine = (l) => {
  const o = []; let c = '', q = false
  for (let i = 0; i < l.length; i++) {
    const ch = l[i]
    if (q) { if (ch === '"') { if (l[i + 1] === '"') { c += '"'; i++ } else q = false } else c += ch }
    else if (ch === '"') q = true
    else if (ch === ',') { o.push(c); c = '' }
    else c += ch
  }
  o.push(c); return o
}

// Intent stem: content words only, question scaffolding and synonyms folded. Two queries
// with the same stem are the same article no matter how the question is phrased.
const SCAFFOLD = new Set(['what', 'how', 'why', 'when', 'where', 'which', 'who', 'is', 'are', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will', 'my', 'me', 'i', 'you', 'your', 'the', 'a', 'an', 'of', 'in', 'on', 'to', 'for', 'and', 'it', 'its', 'that', 'this', 'be', 'been', 'am', 'get', 'got', 'have', 'has', 'if', 'so', 'no', 'not', 'uk', 'mean', 'means', 'meaning', 'much', 'many', 'take', 'takes', 'about', 'from', 'with', 'by', 'at', 'or', 'test', 'tests', 'testing', 'blood', 'levels', 'level'])
const SYN = { raise: 'increase', boost: 'increase', high: 'high', elevated: 'high', raised: 'high', abnormal: 'high', bad: 'high', red: 'high', flag: 'high', low: 'low', foods: 'food', eat: 'food', drink: 'food', diet: 'food', supplements: 'supplement', tablets: 'supplement', symptoms: 'sign', signs: 'sign', warning: 'sign', normal: 'range', ranges: 'range', values: 'range', chart: 'range', results: 'result', explained: 'result', interpretation: 'result', reading: 'result', read: 'result' }
const stem = (q) => [...new Set(String(q).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
  .map((w) => w.replace(/s$/, '')).map((w) => SYN[w] || SYN[w + 's'] || w)
  .filter((w) => w && !SCAFFOLD.has(w)))].sort().join(' ')

let lines
try {
  lines = fs.readFileSync(CSV, 'utf-8').replace(/^﻿/, '').split(/\r?\n/)
} catch (e) {
  console.error(`could not read keywords.csv: ${e.message}`)
  process.exit(1)
}
const rows = lines.filter((l) => l.trim()).slice(1).map(parseCsvLine)
// csv_rows_covered are FILE line numbers, 1-indexed, header included.
const queryAtFileLine = (n) => (lines[n - 1] ? parseCsvLine(lines[n - 1])[0] : null)

let files
try {
  files = fs.readdirSync(BLOG).filter((f) => f.endsWith('.mdx'))
} catch (e) {
  console.error(`could not read ${BLOG}: ${e.message}`)
  process.exit(1)
}
if (!files.length) { console.error('no published articles read — refusing to report a clean corpus'); process.exit(1) }

// Build the claim index from every live article's keyword_coverage block.
const claims = new Map() // stem -> {slug, query, how}
let blocks = 0
for (const f of files) {
  const slug = f.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(BLOG, f), 'utf-8')
  const kc = /^keyword_coverage:\s*$([\s\S]*?)^(?=[a-zA-Z_]+:|---)/m.exec(raw)
  const add = (q, how) => { if (q) claims.set(stem(q), { slug, query: q, how }) }
  add(slug.replace(/-/g, ' '), 'slug')
  if (!kc) continue
  blocks++
  const body = kc[1]
  const pq = /primary_query:\s*(.+)/.exec(body)
  if (pq) add(pq[1].trim().replace(/^['"]|['"]$/g, ''), 'primary_query')
  const rowsBlock = /csv_rows_covered:\s*$([\s\S]*?)(?=^\s{2}[a-z_]+:|\Z)/m.exec(body)
  if (rowsBlock) {
    for (const m of rowsBlock[1].matchAll(/^\s*-\s*(\d+)\s*$/gm)) {
      add(queryAtFileLine(+m[1]), `csv row ${m[1]}`)
    }
  }
  for (const key of ['hub_also_targets', 'spoke_also_targets']) {
    const b = new RegExp(`${key}:\\s*$([\\s\\S]*?)(?=^\\s{2}[a-z_]+:|\\Z)`, 'm').exec(body)
    if (b) for (const m of b[1].matchAll(/^\s*-\s*(.+)$/gm)) add(m[1].trim().replace(/^['"]|['"]$/g, ''), key)
  }
}

// --file is the reliable way to pass many multi-word queries: passing them as argv
// through a shell splits every one of them on spaces unless each is separately quoted,
// and a half-split query silently checks the wrong string rather than erroring.
const fileIdx = process.argv.indexOf('--file')
const argv = process.argv.slice(2).filter((a) => !a.startsWith('--') && a !== process.argv[fileIdx + 1])
let targets
if (fileIdx >= 0) {
  targets = fs.readFileSync(process.argv[fileIdx + 1], 'utf-8').split(/\r?\n/)
    .map((s) => s.trim()).filter(Boolean).map((q) => ({ query: q, role: 'file' }))
} else if (argv.length) {
  targets = argv.map((q) => ({ query: q, role: 'cli' }))
} else {
  targets = rows.filter((r) => r[15] === 'fanout').map((r) => ({ query: r[0], role: 'fanout', vol: r[1] }))
}

console.log(`claim index: ${claims.size} stems from ${files.length} published articles (${blocks} with a keyword_coverage block)`)
console.log(`checking ${targets.length} candidate(s)\n`)

const hits = []
for (const t of targets) {
  const c = claims.get(stem(t.query))
  // Keep the candidate and the claim in SEPARATE fields. Spreading the claim over the
  // candidate silently overwrote `query`, so every line reported the claim's wording as
  // though it were the candidate's: the two queries a collision is about are exactly the
  // two things the reader needs to tell apart.
  if (c) hits.push({ candidate: t.query, vol: t.vol, claimedBy: c.slug, claim: c.query, how: c.how })
}
for (const h of hits) {
  console.log(`  COLLISION  "${h.candidate}"${h.vol ? ` (${h.vol}/mo)` : ''}`)
  console.log(`             = "${h.claim}", already claimed by /blog/${h.claimedBy} via ${h.how}`)
}

if (!hits.length) { console.log('  no collisions.'); process.exit(0) }
console.log(`\n${hits.length} collision(s). These are coverage under an article that exists, not new articles.`)
console.log('Disposition per coverage-rules 4b: set coverage_status=excluded with a note naming the owner.')
process.exit(2)
