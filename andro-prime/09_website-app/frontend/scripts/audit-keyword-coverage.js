#!/usr/bin/env node
/**
 * audit-keyword-coverage.js
 *
 * Closes the loop between the validated keyword universe (keywords.csv) and the
 * articles that claim to target it. Two audits in one pass:
 *
 *   A. ON-PAGE PRESENCE (the enforcement that was missing) — for every CSV row an
 *      article declares in `keyword_coverage`, verify the query string actually
 *      appears on the page, and that the PRIMARY query sits in a strong slot
 *      (title or a heading). Declared coverage that isn't on the page is the bug.
 *
 *   B. BOOKKEEPING (coverage-rules.md Section 9) — primary-row overlaps between
 *      articles, and primary_article_slug disagreements between the article
 *      frontmatter and keywords.csv.
 *
 * Row numbers in `keyword_coverage` are 1-based keywords.csv LINE numbers
 * (header = line 1, first data row = line 2).
 *
 * Usage:  node scripts/audit-keyword-coverage.js
 * Exit:   2 if any PUBLISHED article is missing its primary query from title+headings
 *         (a hard defect, gate-able); 0 otherwise. WARN-level findings never fail.
 */
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const FRONTEND = path.resolve(__dirname, '..')
const BLOG_DIR = path.join(FRONTEND, 'content', 'blog')
const CSV_PATH = path.resolve(FRONTEND, '../../06_marketing/seo-ai-search/keywords.csv')

// --- normalisation: lowercase, strip punctuation to spaces, collapse whitespace.
// Applied identically to query and haystack so a contiguous phrase matches.
const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const tokens = (s) => norm(s).split(' ').filter(Boolean)

// Generic tokens that don't identify a topic — stripped when deriving an
// article's "theme" so the opportunity scan doesn't treat e.g. "blood test"
// or "symptoms" as on-topic with every other cluster keyword.
const GENERIC = new Set(('the a an of for to in on is are what how why and or your you i my men man uk health check '
  + 'blood test tests symptoms symptom deficiency signs sign levels level range normal best supplement supplements daily').split(' '))
// coverage_status values that mean "another article already owns this row"
const OWNED = new Set(['planned', 'briefed', 'drafted', 'published'])

// --- load keywords.csv into { lineNo -> {query, vol, kd} } (1-based incl. header)
function loadCsv() {
  const raw = fs.readFileSync(CSV_PATH, 'utf-8').replace(/^﻿/, '')
  const lines = raw.split(/\r?\n/)
  const byRow = {}
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const f = line.split(',')
    // CSV line N corresponds to file line (i+1): header is line 1, lines[1] is line 2.
    byRow[i + 1] = { query: f[0], vol: f[1], kd: f[2], pillar: f[6] || '', slug: f[11] || '', cov: (f[12] || '').trim() }
  }
  return byRow
}

// --- pull the strong-placement zones (title + headings) and the full haystack
function extractZones(data, body) {
  const title = data.title || ''
  const headings = []
  // markdown ATX headings
  for (const m of body.matchAll(/^#{1,6}\s+(.+)$/gm)) headings.push(m[1])
  // component + html headings (SysHeading, NumberedHeading, h1-h6)
  for (const m of body.matchAll(/<(?:Sys|Numbered)?Heading[^>]*>([\s\S]*?)<\/(?:Sys|Numbered)?Heading>/g)) headings.push(m[1])
  for (const m of body.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)) headings.push(m[1])
  const faqQs = Array.isArray(data.faq) ? data.faq.map((x) => x && x.q).filter(Boolean) : []
  const strong = norm([title, ...headings].join('  ')) // title + headings
  const full = norm([title, data.excerpt, ...headings, ...faqQs, body].join('  '))
  return { strong, full }
}

// phrase present (contiguous) / all-tokens-present (loose) helpers
const hasPhrase = (hay, q) => hay.includes(norm(q))
const hasAllTokens = (hay, q) => tokens(q).every((t) => hay.includes(t))

function audit() {
  if (!fs.existsSync(CSV_PATH)) { console.error('keywords.csv not found at ' + CSV_PATH); process.exit(1) }
  const csv = loadCsv()
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const primaryClaims = {} // csvRow -> [slugs] (for overlap detection)
  let hardFail = 0
  const reports = []

  for (const file of files.sort()) {
    const slug = file.replace(/\.mdx$/, '')
    const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8'))
    const kc = data.keyword_coverage
    const status = data.status || 'unknown'
    const r = { slug, status, lines: [] }

    if (!kc) { r.lines.push(['WARN', 'no keyword_coverage block — cannot audit']); reports.push(r); continue }

    const zones = extractZones(data, content)

    // --- PRIMARY query: must be in title or a heading (strong slot)
    const primaryRow = kc.primary_query_csv_row
    const primaryQ = kc.primary_query || (csv[primaryRow] && csv[primaryRow].query)
    // GEO carve-out: some articles target an LLM-prompt set, not a search phrase
    // (primary_query like "(GEO universe: 5 LLM-prompt queries)"). Skip the
    // strong-placement requirement for those — it doesn't apply.
    const isGeo = primaryQ && (/\b(geo|llm|prompt|universe)\b/i.test(primaryQ) || primaryQ.trim().startsWith('('))
    if (isGeo) {
      r.lines.push(['INFO', `GEO article — primary "${primaryQ}" is an LLM-prompt set, not a search phrase; strong-placement check skipped`])
    } else if (primaryQ) {
      ;(primaryClaims[primaryRow] = primaryClaims[primaryRow] || []).push(slug)
      const inStrong = hasPhrase(zones.strong, primaryQ)
      const inBody = hasPhrase(zones.full, primaryQ)
      if (inStrong) r.lines.push(['PASS', `primary "${primaryQ}" in title/heading`])
      else if (inBody) r.lines.push(['WARN', `primary "${primaryQ}" in body but NOT in title or any heading`])
      else { r.lines.push(['FAIL', `primary "${primaryQ}" absent from page entirely`]); if (status === 'published') hardFail++ }
      // slug agreement: CSV stores the brief slug (pillar-A-hub-low-vitamin-d-symptoms),
      // the article file uses the short slug (low-vitamin-d-symptoms) — treat
      // one-contains-the-other as a match.
      const csvSlug = csv[primaryRow] && csv[primaryRow].slug
      const slugMatch = csvSlug && (norm(csvSlug).includes(norm(slug)) || norm(slug).includes(norm(csvSlug)))
      if (csvSlug && !slugMatch) r.lines.push(['WARN', `csv row ${primaryRow} primary_article_slug="${csvSlug}" != article slug`])
    } else {
      r.lines.push(['WARN', `primary_query_csv_row ${primaryRow} not found in csv`])
    }

    // --- COVERED rows: each declared query should appear somewhere on-page
    const rows = Array.isArray(kc.csv_rows_covered) ? kc.csv_rows_covered : []
    const missing = []
    let present = 0
    for (const row of rows) {
      const entry = csv[row]
      if (!entry) { r.lines.push(['WARN', `csv_rows_covered lists row ${row} which is not in csv`]); continue }
      const q = entry.query
      if (hasPhrase(zones.full, q)) present++
      else if (hasAllTokens(zones.full, q)) present++ // tokens scattered = partial credit
      else missing.push({ row, q, vol: entry.vol, kd: entry.kd })
    }
    r.lines.push([missing.length ? 'WARN' : 'PASS', `covered queries on-page: ${present}/${rows.length}`])
    for (const m of missing.sort((a, b) => (Number(b.vol) || 0) - (Number(a.vol) || 0))) {
      r.lines.push(['MISS', `row ${m.row} "${m.q}" (vol ${m.vol || '?'}, kd ${m.kd || '?'}) — declared but not on page`])
    }

    // --- OPPORTUNITY: cluster keywords this article doesn't cover, that nobody
    // else owns and that are on-topic. Filters out (a) roadmap rows already
    // assigned to another article (cov in OWNED or has a primary_article_slug),
    // and (b) off-topic adjacency (shares no theme token with the primary).
    const pillar = csv[primaryRow] && csv[primaryRow].pillar
    const theme = primaryQ ? tokens(primaryQ).filter((t) => t.length > 1 && !GENERIC.has(t)) : []
    const oppSeen = new Set()
    if (pillar && !isGeo && theme.length) {
      const opps = Object.values(csv)
        .filter((e) => e.pillar === pillar)
        .filter((e) => !hasPhrase(zones.full, e.query) && !hasAllTokens(zones.full, e.query)) // not already on-page
        .filter((e) => tokens(e.query).some((t) => theme.includes(t)))                         // on-topic
        .filter((e) => !(OWNED.has(e.cov) || e.slug))                                          // genuinely unowned
        .filter((e) => { const k = norm(e.query); if (oppSeen.has(k)) return false; oppSeen.add(k); return true }) // dedupe intentional CSV dups
        .sort((a, b) => (Number(b.vol) || 0) - (Number(a.vol) || 0))
      if (opps.length) {
        r.lines.push(['OPP', `unowned on-topic gaps in ${pillar}: ${opps.length} (could be captured here or via a new spoke)`])
        for (const o of opps.slice(0, 5)) r.lines.push(['OPP', `  ${o.vol || '?'}/mo  kd ${o.kd || '?'}  "${o.query}"`])
      }
    }
    reports.push(r)
  }

  // --- print per-article
  const icon = { PASS: '✓', WARN: '⚠', FAIL: '✗', MISS: '  -', INFO: 'ℹ', OPP: '+' }
  for (const r of reports) {
    console.log(`\n=== ${r.slug}  [${r.status}] ===`)
    for (const [lvl, msg] of r.lines) console.log(`  ${icon[lvl] || lvl} ${lvl.padEnd(4)} ${msg}`)
  }

  // --- bookkeeping: primary overlaps
  console.log('\n=== cross-article bookkeeping ===')
  let overlaps = 0
  for (const [row, slugs] of Object.entries(primaryClaims)) {
    if (slugs.length > 1) { overlaps++; console.log(`  ✗ OVERLAP  csv row ${row} claimed as primary by: ${slugs.join(', ')}`) }
  }
  if (!overlaps) console.log('  ✓ no primary-row overlaps')

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Audited ${reports.length} article(s).  Published primary-missing (hard): ${hardFail}  Primary overlaps: ${overlaps}`)
  console.log('FAIL = published article missing its primary query (gate-able). WARN/MISS = review.')
  process.exit(hardFail > 0 ? 2 : 0)
}

audit()
