#!/usr/bin/env node
/**
 * faq-dedupe.mjs — FAQ question duplication check across every article at once.
 *
 * Replaces the per-article manual grep in `coverage-rules.md` §5, and is the FAQ
 * half of the §9 "Phase 2 audit script" that has been deferred since the 3-article
 * threshold it was gated on (there are now 18).
 *
 * Why a whole-corpus check beats the grep it replaces:
 *   - The grep needs the candidate question string, so it can only ever find EXACT
 *     matches. The expensive collisions are near-matches ("What is a normal CRP
 *     level in the UK?" vs "What is a normal hs-CRP level in the UK?"), which the
 *     grep cannot see and this does.
 *   - The grep's target list includes `article-drafts/`, which is the STALE
 *     drafting workspace (nothing syncs it; see 06_marketing/STATE.md 2026-08-12).
 *     This defaults to the real git mirror `content/blog/` + `article-briefs/`,
 *     and reads drafts only behind an explicit flag that warns.
 *   - Per-article cost is zero: it reads the whole corpus in well under a second.
 *
 * Exit codes follow the house convention (see wrap/reconcile-observations.js):
 *   0 = clean, 2 = duplicates found, 1 = could not run (which is never a pass).
 *
 * Usage:
 *   node faq-dedupe.mjs                 # published mirror + briefs
 *   node faq-dedupe.mjs --drafts        # also read the stale article-drafts/
 *   node faq-dedupe.mjs --threshold 0.5 # loosen near-duplicate sensitivity
 *   node faq-dedupe.mjs --json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const SEO = path.resolve(here, '..')
const REPO = path.resolve(here, '../../../..')

const args = process.argv.slice(2)
const flag = (n, d) => {
  const i = args.indexOf(n)
  return i >= 0 && args[i + 1] ? args[i + 1] : d
}
const THRESHOLD = Number(flag('--threshold', '0.6'))
const AS_JSON = args.includes('--json')
const WITH_DRAFTS = args.includes('--drafts')

const SOURCES = [
  { label: 'published', dir: path.join(REPO, 'andro-prime/09_website-app/frontend/content/blog'), ext: '.mdx' },
  { label: 'brief', dir: path.join(SEO, 'article-briefs'), ext: '.md' },
]
if (WITH_DRAFTS) {
  SOURCES.push({ label: 'draft (STALE SOURCE)', dir: path.join(SEO, 'article-drafts'), ext: '.mdx' })
}

/**
 * Pull `q:` values out of a frontmatter block, including YAML folded/literal
 * scalars (`q: >-` followed by an indented continuation), which is how every
 * real FAQ entry in this repo is actually written. A regex that only handles
 * `q: inline text` silently reads zero questions from a correct file.
 */
function questionsFrom(text) {
  const parts = text.split(/^---$/m)
  if (parts.length < 2) return []
  const lines = parts[1].split(/\r?\n/)
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const m = /^(\s*)-?\s*q:\s*(.*)$/.exec(lines[i])
    if (!m) continue
    let val = m[2].trim()
    if (['>', '>-', '|', '|-'].includes(val)) {
      const indent = m[1].length
      val = ''
      for (let j = i + 1; j < lines.length; j++) {
        if (!lines[j].trim()) continue
        if (lines[j].match(/^\s*/)[0].length <= indent) break
        val += (val ? ' ' : '') + lines[j].trim()
      }
    }
    val = val.replace(/^['"]|['"]$/g, '').trim()
    if (val) out.push(val)
  }
  return out
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const STOP = new Set(['what', 'is', 'a', 'the', 'does', 'do', 'my', 'your', 'of', 'in', 'for',
  'to', 'and', 'it', 'mean', 'are', 'how', 'can', 'i', 'on', 'be', 'if', 'should', 'you', 'about'])
const tokens = (s) => new Set(norm(s).split(' ').filter((w) => w.length > 2 && !STOP.has(w)))

const all = []
let read = 0
for (const src of SOURCES) {
  if (!fs.existsSync(src.dir)) continue
  for (const f of fs.readdirSync(src.dir).filter((f) => f.endsWith(src.ext))) {
    read++
    const slug = f.replace(src.ext, '')
    for (const q of questionsFrom(fs.readFileSync(path.join(src.dir, f), 'utf-8'))) {
      all.push({ slug, source: src.label, q })
    }
  }
}

if (!read) {
  console.error('faq-dedupe: read 0 files. Check the source paths; a zero-file run is not a pass.')
  process.exit(1)
}

const byNorm = new Map()
for (const e of all) {
  const k = norm(e.q)
  if (!byNorm.has(k)) byNorm.set(k, [])
  byNorm.get(k).push(e)
}

// An article legitimately repeats its own question across a redraft; only
// cross-article collisions matter, so dedupe by slug within each group.
const exact = [...byNorm.values()]
  .map((g) => g.filter((e, i, a) => a.findIndex((x) => x.slug === e.slug) === i))
  .filter((g) => g.length > 1)

const near = []
for (let i = 0; i < all.length; i++) {
  for (let j = i + 1; j < all.length; j++) {
    if (all[i].slug === all[j].slug) continue
    if (norm(all[i].q) === norm(all[j].q)) continue
    const a = tokens(all[i].q)
    const b = tokens(all[j].q)
    if (!a.size || !b.size) continue
    const inter = [...a].filter((x) => b.has(x)).length
    const jac = inter / (a.size + b.size - inter)
    if (jac >= THRESHOLD) near.push({ score: Number(jac.toFixed(2)), a: all[i], b: all[j] })
  }
}
near.sort((x, y) => y.score - x.score)

if (AS_JSON) {
  console.log(JSON.stringify({ files: read, questions: all.length, exact, near }, null, 2))
} else {
  console.log(`faq-dedupe: ${read} files, ${all.length} FAQ questions, near-duplicate threshold ${THRESHOLD}`)
  console.log(`\nEXACT duplicates across articles: ${exact.length}`)
  for (const g of exact) {
    console.log(`  "${g[0].q}"`)
    for (const e of g) console.log(`     ${e.slug}  [${e.source}]`)
  }
  console.log(`\nNEAR duplicates across articles: ${near.length}`)
  for (const n of near) {
    console.log(`  ${n.score}  [${n.a.slug}] "${n.a.q}"`)
    console.log(`        [${n.b.slug}] "${n.b.q}"`)
  }
  console.log(
    '\nNeither list is automatically a defect. Hub and spoke articles on the same marker are' +
    '\nEXPECTED to collide, and §5 already permits it when the answers are scope-different (one' +
    '\ncanonical, one brief and linking). What §5 forbids is two articles answering the same' +
    '\nquestion in the same words. Judge each pair; do not bulk-reword.'
  )
}

process.exit(exact.length || near.length ? 2 : 0)
