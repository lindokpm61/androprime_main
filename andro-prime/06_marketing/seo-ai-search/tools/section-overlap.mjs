#!/usr/bin/env node
/**
 * Does a candidate spoke duplicate a SECTION that is already published?
 *
 * The sibling of `coverage-collision.mjs`, and it exists because that tool cannot answer
 * this question. Collision-checking compares CLAIMED QUERIES: the candidate against the
 * `primary_query` and `csv_rows_covered` a live article declares. On 2026-08-15 a spoke
 * passed that check correctly (its hub had never claimed the query) and was then found at
 * drafting time to duplicate every section of the hub, including the one fact reserved as
 * its differentiator. Query-level novelty and section-level novelty are different
 * questions, and a search engine only judges the second.
 *
 * So this reads the article BODIES, not the coverage metadata.
 *
 * Method, and its limits stated up front. For each candidate it computes two things
 * against every published article:
 *   H2 match   - the best token overlap between the candidate and any H2 heading. A high
 *                score means a dedicated section already answers this query.
 *   body cover - the share of the candidate's content words that appear anywhere in the
 *                article body. High body cover with a LOW H2 match is the legitimate spoke
 *                case: the ground is touched in passing but no section owns it.
 * This is lexical, not semantic. It will miss a section that answers the same question in
 * different words, so a CLEAR verdict is "no evidence of duplication", never a guarantee.
 * Read the flagged ones; spot-check a sample of the clear ones.
 *
 * Usage (from this directory):
 *   node section-overlap.mjs                 # every role=fanout row at priority 1-2
 *   node section-overlap.mjs --all           # every role=fanout row
 *   node section-overlap.mjs "some query"    # ad hoc
 * Exit: 0 nothing flagged, 2 duplicates/covered found, 1 could not run (never a pass).
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

// Content words only. Question scaffolding carries no topic, and leaving it in makes every
// "what does it mean when..." query look similar to every other one.
const SCAFFOLD = new Set(['what', 'how', 'why', 'when', 'where', 'which', 'who', 'is', 'are', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will', 'my', 'me', 'i', 'you', 'your', 'the', 'a', 'an', 'of', 'in', 'on', 'to', 'for', 'and', 'it', 'its', 'that', 'this', 'be', 'been', 'am', 'get', 'got', 'have', 'has', 'if', 'so', 'no', 'not', 'uk', 'mean', 'means', 'meaning', 'much', 'many', 'take', 'takes', 'about', 'from', 'with', 'by', 'at', 'or', 'actually', 'without', 'textbook'])
const SYN = { raise: 'increase', boost: 'increase', high: 'high', elevated: 'high', raised: 'high', abnormal: 'high', bad: 'high', low: 'low', foods: 'food', eat: 'food', diet: 'food', supplements: 'supplement', tablets: 'supplement', symptoms: 'sign', signs: 'sign', warning: 'sign', normal: 'range', ranges: 'range', values: 'range', chart: 'range', results: 'result', explained: 'result', interpretation: 'result', reading: 'result', read: 'result', tests: 'test', levels: 'level' }
const toks = (s) => [...new Set(String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
  .map((w) => w.replace(/s$/, '')).map((w) => SYN[w] || SYN[w + 's'] || w)
  .filter((w) => w && w.length > 1 && !SCAFFOLD.has(w)))]

let lines, files
try { lines = fs.readFileSync(CSV, 'utf-8').replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim()) }
catch (e) { console.error(`could not read keywords.csv: ${e.message}`); process.exit(1) }
try { files = fs.readdirSync(BLOG).filter((f) => f.endsWith('.mdx')) }
catch (e) { console.error(`could not read ${BLOG}: ${e.message}`); process.exit(1) }
if (!files.length) { console.error('no published articles read: refusing to report a clean sweep'); process.exit(1) }

const articles = files.map((f) => {
  const raw = fs.readFileSync(path.join(BLOG, f), 'utf-8')
  const body = raw.replace(/^---[\s\S]*?\n---\n/, '')
  return {
    slug: f.replace(/\.mdx$/, ''),
    h2: [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].replace(/[:(].*$/, '').trim())
      .filter((h) => h !== 'Your next move' && h !== 'References'),
    bodyToks: new Set(toks(body)),
  }
})

// PRODUCT PAGES TOO. Reading only content/blog/ is how a check for "do we already cover
// this?" answers no about a query our own kit page is built on. It matters most for
// commercial queries, which never resolve to an article and always resolve to /kits/*.
// TSX, so the text is extracted rather than parsed: the metadata title and description
// (which are what actually compete in a SERP), plus visible copy with JSX tags stripped.
const MKT = path.resolve(HERE, '../../../09_website-app/frontend/app/(marketing)')
for (const dir of ['kits', 'supplements']) {
  const base = path.join(MKT, dir)
  if (!fs.existsSync(base)) continue
  const entries = fs.readdirSync(base, { withFileTypes: true })
  const pages = entries.filter((e) => e.isDirectory()).map((e) => path.join(base, e.name, 'page.tsx'))
  if (fs.existsSync(path.join(base, 'page.tsx'))) pages.push(path.join(base, 'page.tsx'))
  for (const p of pages) {
    if (!fs.existsSync(p)) continue
    const raw = fs.readFileSync(p, 'utf-8')
    const metas = [...raw.matchAll(/(?:title|description):\s*(['"`])((?:\\.|(?!\1).)*)\1/g)].map((m) => m[2].replace(/\\'/g, "'"))
    const text = raw
      .replace(/^\s*(import|export)\s+.*$/gm, '')
      .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
      .replace(/[{}()[\];]/g, ' ')
    articles.push({
      // leading slash marks it as a product page, so the reporter does not prefix it /blog/
      slug: '/' + path.relative(MKT, path.dirname(p)).replace(/\\/g, '/'),
      h2: metas.map((t) => t.replace(/[|:(].*$/, '').trim()).filter(Boolean),
      bodyToks: new Set(toks(metas.join(' ') + ' ' + text)),
    })
  }
}

// --file, same reason as coverage-collision.mjs: multi-word queries passed as argv get
// split on spaces by the shell and silently check the wrong string.
const fileIdx = process.argv.indexOf('--file')
const argv = process.argv.slice(2).filter((a) => !a.startsWith('--') && a !== process.argv[fileIdx + 1])
const rows = lines.slice(1).map(parseCsvLine)
const byQuery = new Map(rows.filter((r) => r[15] === 'fanout').map((r) => {
  const m = /fanout child of "([^"]+)"/.exec(r[10] || '')
  return [r[0].toLowerCase(), { hub: m ? m[1].split(' | ')[0] : '', vol: r[1] }]
}))
const cands = fileIdx >= 0
  ? fs.readFileSync(process.argv[fileIdx + 1], 'utf-8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      .map((q) => ({ query: q, ...(byQuery.get(q.toLowerCase()) || { hub: '', vol: '' }) }))
  : argv.length
  ? argv.map((q) => ({ query: q, hub: '', vol: '' }))
  : rows.filter((r) => r[15] === 'fanout' && (process.argv.includes('--all') || (parseInt(r[7], 10) || 9) <= 2))
      .map((r) => {
        const m = /fanout child of "([^"]+)"/.exec(r[10] || '')
        return { query: r[0], hub: m ? m[1].split(' | ')[0] : '', vol: r[1] }
      })

const score = (a, b) => { // share of the candidate's words present in b
  if (!a.length) return 0
  const B = b instanceof Set ? b : new Set(b)
  return a.filter((t) => B.has(t)).length / a.length
}

const out = []
for (const c of cands) {
  const t = toks(c.query)
  // Namespaced keys, NOT two spreads. Both of these objects naturally want a `slug` and
  // spreading them together silently reports the best-BODY article as the owner of the
  // best-H2 heading, which produced lines like "What a thyroid test actually measures" in
  // /blog/14-signs-of-vitamin-d-deficiency. Second time this exact shape has bitten in one
  // session: when two records describe different things, never merge them into one flat object.
  let h2Slug = '', h2Text = '', h2Score = 0
  let bodySlug = '', bodyCover = 0
  for (const a of articles) {
    for (const h of a.h2) {
      const s = score(t, toks(h))
      if (s > h2Score) { h2Score = s; h2Text = h; h2Slug = a.slug }
    }
    const cover = score(t, a.bodyToks)
    if (cover > bodyCover) { bodyCover = cover; bodySlug = a.slug }
  }
  const verdict = h2Score >= 0.75 ? 'DUPLICATE'
    : bodyCover >= 0.99 && h2Score >= 0.5 ? 'COVERED'
    : bodyCover >= 0.99 ? 'IN-BODY'
    : 'CLEAR'
  out.push({ ...c, h2Slug, h2Text, h2Score, bodySlug, bodyCover, verdict })
}

const order = { DUPLICATE: 0, COVERED: 1, 'IN-BODY': 2, CLEAR: 3 }
out.sort((a, b) => order[a.verdict] - order[b.verdict] || (Number(b.vol) || 0) - (Number(a.vol) || 0))

const n = (v) => out.filter((o) => o.verdict === v).length
console.log(`${articles.length} published articles read, ${cands.length} candidate(s) checked\n`)
console.log(`  DUPLICATE ${n('DUPLICATE')}   a published H2 already answers this query`)
console.log(`  COVERED   ${n('COVERED')}   every content word is in one article AND a section half-matches`)
console.log(`  IN-BODY   ${n('IN-BODY')}   words all present but no section owns it: the legitimate spoke case`)
console.log(`  CLEAR     ${n('CLEAR')}   no lexical evidence of duplication\n`)

for (const o of out) {
  if (o.verdict === 'CLEAR') continue
  console.log(`  ${o.verdict.padEnd(9)} "${o.query}"${o.vol ? ` (${o.vol}/mo)` : ''}`)
  const url = (s) => (s.startsWith('/') ? s : `/blog/${s}`)
  console.log(`            section: "${o.h2Text}" in ${url(o.h2Slug)}  (${Math.round(o.h2Score * 100)}% word match)`)
  console.log(`            body:    ${url(o.bodySlug)} contains ${Math.round(o.bodyCover * 100)}% of the query's words${o.hub ? `   |   hub: ${o.hub}` : ''}`)
}
console.log('\nLexical, not semantic: CLEAR means no evidence found, not proof of novelty.')
process.exit(n('DUPLICATE') + n('COVERED') > 0 ? 2 : 0)
