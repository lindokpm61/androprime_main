/**
 * promote-keyword — the guarded candidate -> accepted gate (coverage-rules.md Section 4b).
 *
 * Replaces the hand-typed `update keyword_queue set status='accepted'` SQL with a command
 * that runs the §4b cannibalisation checks FIRST and refuses the flip if any trips. The
 * promotion is the cheapest place to stop a duplicate: before a brief is ever scaffolded.
 *
 * The two gaps csv-to-queue's own dedup misses (and that shipped duplicates on 2026-06-22):
 *   A. SAME-INTENT, DIFFERENT SLUG. "ferritin test" is coverage under the already-drafted
 *      "ferritin blood test" — same entity, the candidate's tokens are a subset of the
 *      owner's. Slug-equality never catches it; entity+token-subset does.
 *   B. WRONG CHANNEL. "vitamin d test" is commercial intent the Pillar A hub explicitly
 *      routed to the Kit 2 page ("...better as a Kit 2 LP optimisation"). The hub brief
 *      already said "not a blog article" — we just has to read it.
 * Plus the existing-claim check (a row whose primary_article_slug is already a different
 * article) and a soft same-entity warning.
 *
 * HARD trip (any) -> refuse, exit 2 (override with --force, which logs the override).
 * Clean -> flip to accepted (skip the write with --dry).
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/promote-keyword.ts --query "ferritin test" --dry
 *   npx tsx scripts/content-engine/promote-keyword.ts --query "cortisol blood test"
 *   npx tsx scripts/content-engine/promote-keyword.ts --query "vitamin d test" --force   # promote anyway
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()
const argv = process.argv.slice(2)
const DRY = argv.includes('--dry')
const FORCE = argv.includes('--force')
const opt = (n: string, d = '') => {
  const i = argv.indexOf(n)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d
}
const QUERY = opt('--query').trim()
const PILLAR_OVERRIDE = opt('--pillar').trim()

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

const REPO_ROOT = path.resolve(process.cwd(), '../../..')
const SEO_DIR = path.join(REPO_ROOT, 'andro-prime/06_marketing/seo-ai-search')
const BRIEFS_DIR = path.join(SEO_DIR, 'article-briefs')
const DRAFTS_DIR = path.join(SEO_DIR, 'article-drafts')
const BLOG_DIR = path.join(REPO_ROOT, 'andro-prime/09_website-app/frontend/content/blog')
const KEYWORDS_CSV = path.join(SEO_DIR, 'keywords.csv')

// Words that are noise for "what is the entity being tested" — stripping them collapses
// "ferritin test" / "ferritin blood test" / "serum ferritin levels" to the same entity.
const GENERIC = new Set([
  'test', 'tests', 'blood', 'levels', 'level', 'kit', 'kits', 'check', 'results', 'result',
  'range', 'ranges', 'normal', 'count', 'serum', 'reading', 'number', 'profile', 'panel', 'uk',
])
// Pure stopwords (dropped from every token comparison).
const STOP = new Set(['the', 'a', 'an', 'of', 'for', 'your', 'my', 'and', 'to', 'in', 'on', 'is', 'with'])
// Markers in a hub brief that mean "this query was deliberately routed off the blog".
const ROUTE_MARKERS = [
  'lp-grade', 'lp variant', 'lp territory', 'better as', '/kits/', '/supplements/', 'kit 1', 'kit 2',
  'kit 3', 'kit 4', 'hook not', 'hooks not', 'hook-only', 'hooked only', 'link out', 'not a pillar',
  'not a blog', 'not targeted', 'lp optimisation', 'lp optimization',
]

const tokens = (s: string): string[] =>
  s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t && !STOP.has(t))
const entity = (s: string): string =>
  tokens(s).filter((t) => !GENERIC.has(t)).join(' ')
const isSubset = (a: string[], b: string[]) => a.every((t) => b.includes(t))

/** Same search intent: same entity, and one query's tokens contain the other's (generic-extension). */
function sameIntent(candidate: string, owned: string): boolean {
  const ce = entity(candidate)
  const oe = entity(owned)
  if (!ce || !oe || ce !== oe) return false
  const ct = tokens(candidate)
  const ot = tokens(owned)
  return isSubset(ct, ot) || isSubset(ot, ct)
}

type Owned = { source: string; file: string; slug: string; primaryQuery: string }
const parseWarnings: string[] = []

/** Pull a single scalar value out of a raw frontmatter block by key (survives YAML that
 *  won't fully parse — a malformed line elsewhere must not blind us to this file). */
function rawField(raw: string, key: string): string {
  const m = new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm').exec(raw)
  return m ? m[1].trim() : ''
}

/** Strip the pillar/hub/spoke scaffolding off a slug -> the human entity slug, as words.
 *  "pillar-I-hub-cholesterol-test" -> "cholesterol test". */
function deScaffold(slug: string): string {
  return slug
    .replace(/^pillar-[a-j]-(hub|spoke)-/i, '')
    .replace(/^pillar-[a-j]-/i, '')
    .replace(/-/g, ' ')
    .trim()
}

/** Gather every owned intent across briefs + drafts + live blog. Robust to unparseable
 *  frontmatter: falls back to regex + slug so a malformed brief can't hide a duplicate. */
function gatherOwned(): Owned[] {
  const out: Owned[] = []
  const scan = (dir: string, source: string, ext: string) => {
    if (!fs.existsSync(dir)) return
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(ext)) continue
      const raw = fs.readFileSync(path.join(dir, name), 'utf-8')
      let data: Record<string, unknown> = {}
      try {
        data = matter(raw).data as Record<string, unknown>
      } catch {
        parseWarnings.push(name) // frontmatter won't parse — we fall back, but make it visible
      }
      const cov = (data.keyword_coverage ?? {}) as Record<string, unknown>
      const slug = String(data.slug || rawField(raw, 'slug') || name.replace(/\.(md|mdx)$/, ''))
      const primaryQuery = String(
        data.target_query || cov.primary_query || rawField(raw, 'target_query') || data.title || ''
      )
      // Two owned-intent entries per file: the declared primary query AND the de-scaffolded
      // slug. Either can carry the entity; using both means a missing/garbled primary query
      // still gets matched via the slug.
      if (primaryQuery) out.push({ source, file: name, slug, primaryQuery })
      const slugQuery = deScaffold(slug)
      if (slugQuery && slugQuery !== primaryQuery) out.push({ source, file: name, slug, primaryQuery: slugQuery })
    }
  }
  scan(BRIEFS_DIR, 'brief', '.md')
  scan(DRAFTS_DIR, 'draft', '.mdx')
  scan(BLOG_DIR, 'blog', '.mdx')
  return out
}

/** Normalise a pillar value ('pillar-A', 'A', 'D/B12') to a single hub letter, or ''. */
function pillarLetter(p: string): string {
  const m = /([A-J])\b/.exec(p.replace(/^pillar-/i, '').toUpperCase())
  return m ? m[1] : ''
}

type Trip = { check: string; hard: boolean; detail: string }

async function main() {
  if (!QUERY) {
    console.error('Usage: promote-keyword.ts --query "<keyword>" [--pillar X] [--dry] [--force]')
    process.exit(1)
  }

  // 0. Load the candidate.
  const { data: cand, error } = await admin()
    .from('keyword_queue')
    .select('id, query, status, pillar, proposed_slug, coverage_status')
    .eq('query', QUERY)
    .maybeSingle()
  if (error) throw new Error(`read keyword_queue: ${error.message}`)
  if (!cand) {
    console.error(`No keyword_queue row for query "${QUERY}".`)
    process.exit(1)
  }
  if (cand.status !== 'candidate') {
    console.error(`"${QUERY}" is status='${cand.status}', not 'candidate' — nothing to promote.`)
    process.exit(1)
  }

  const pillar = PILLAR_OVERRIDE || (cand.pillar ?? '')
  const letter = pillarLetter(pillar)
  log(`gate: "${QUERY}"  pillar=${pillar || '?'}  entity="${entity(QUERY)}"`)

  const trips: Trip[] = []
  const owned = gatherOwned()
  if (parseWarnings.length) {
    log(`note: ${parseWarnings.length} brief(s) have unparseable frontmatter (used regex/slug fallback): ${parseWarnings.join(', ')}`)
  }

  // A. Same-intent check (the duplicate gap).
  for (const o of owned) {
    if (sameIntent(QUERY, o.primaryQuery)) {
      trips.push({
        check: 'A:same-intent',
        hard: true,
        detail: `same intent as ${o.source} "${o.slug}" (primary: "${o.primaryQuery}") — this is coverage, not a standalone article`,
      })
    } else if (entity(QUERY) && entity(QUERY) === entity(o.primaryQuery)) {
      // Same entity, different intent (e.g. a how-to vs the test explainer) — soft warn.
      trips.push({
        check: 'A:same-entity',
        hard: false,
        detail: `same entity "${entity(QUERY)}" as ${o.source} "${o.slug}" but different intent — confirm it is a genuinely distinct article`,
      })
    }
  }

  // B. Parent-hub coverage-decision check (the wrong-channel gap).
  if (letter) {
    const hubBriefs = fs.existsSync(BRIEFS_DIR)
      ? fs.readdirSync(BRIEFS_DIR).filter((n) => new RegExp(`^pillar-${letter}-hub`, 'i').test(n))
      : []
    for (const hb of hubBriefs) {
      const body = fs.readFileSync(path.join(BRIEFS_DIR, hb), 'utf-8')
      for (const rawLine of body.split(/\r?\n/)) {
        // Only read the coverage-map TABLE rows (markdown `| ... |`), where routing
        // decisions are recorded — not arbitrary prose, which would false-positive on
        // any pillar whose vocabulary (e.g. "testosterone") saturates the hub copy.
        if (!/^\s*\|/.test(rawLine)) continue
        const cells = rawLine.split('|').map((c) => c.trim()).filter(Boolean)
        // Trip only when one of the row's cells is the SAME INTENT as the candidate (the
        // row is about this query, not merely sharing a head word) AND the row records a
        // route-elsewhere decision.
        const queryCellMatches = cells.some((c) => sameIntent(QUERY, c))
        if (!queryCellMatches) continue
        const marker = ROUTE_MARKERS.find((m) => rawLine.toLowerCase().includes(m))
        if (marker) {
          trips.push({
            check: 'B:hub-route',
            hard: true,
            detail: `hub ${hb} routes this intent elsewhere (marker "${marker}"): ${rawLine.trim().slice(0, 160)}`,
          })
          break
        }
      }
    }
  } else {
    log('note: no pillar on the candidate -> hub-route check (B) skipped; assign a pillar to enable it')
  }

  // C. Existing-claim check (CSV primary_article_slug already filled with a different slug).
  if (fs.existsSync(KEYWORDS_CSV)) {
    const lines = fs.readFileSync(KEYWORDS_CSV, 'utf-8').split(/\r?\n/)
    for (const line of lines) {
      const cols = line.split(',')
      if (cols[0]?.trim().toLowerCase() !== QUERY.toLowerCase()) continue
      const claimed = (cols[11] ?? '').trim() // primary_article_slug (col 12, 0-indexed 11)
      if (claimed) {
        trips.push({
          check: 'C:existing-claim',
          hard: true,
          detail: `keywords.csv already maps this row to primary_article_slug="${claimed}"`,
        })
      }
      break
    }
  }

  // D. Pipeline slug collision (a pipeline row whose slug is the same intent).
  const candSlug = cand.proposed_slug || QUERY.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const { data: pipe } = await admin().from('content_pipeline').select('slug, stage')
  for (const row of pipe ?? []) {
    const s = row.slug as string
    if (s === candSlug) continue // exact match would be its own row; intent overlap is what we want
    if (sameIntent(candSlug.replace(/-/g, ' '), s.replace(/-/g, ' '))) {
      trips.push({
        check: 'D:pipeline-collision',
        hard: true,
        detail: `content_pipeline already has "${s}" (stage=${row.stage}) at the same intent`,
      })
    }
  }

  // --- verdict ---
  const hard = trips.filter((t) => t.hard)
  const soft = trips.filter((t) => !t.hard)
  for (const t of soft) log(`  WARN  ${t.check}: ${t.detail}`)
  for (const t of hard) log(`  STOP  ${t.check}: ${t.detail}`)

  if (hard.length && !FORCE) {
    log(`REFUSED  "${QUERY}" — ${hard.length} hard trip(s). Disposition: set coverage_status='excluded' (+ note), or --force to override.`)
    if (!DRY) {
      await logRun({
        agent: 'promote-keyword',
        itemRef: QUERY,
        status: 'blocked',
        error: hard.map((t) => t.check).join(','),
        detail: { trips: hard },
      })
    }
    process.exit(2)
  }

  if (hard.length && FORCE) log(`OVERRIDE  promoting despite ${hard.length} hard trip(s) (--force)`)
  else log(`CLEAR    no hard trips${soft.length ? ` (${soft.length} soft warning(s) — your call)` : ''}`)

  if (DRY) {
    log(`would promote "${QUERY}" -> accepted`)
    return
  }

  const { error: updErr } = await admin()
    .from('keyword_queue')
    .update({ status: 'accepted' })
    .eq('id', cand.id)
    .eq('status', 'candidate')
  if (updErr) throw new Error(`promote: ${updErr.message}`)
  log(`PROMOTED "${QUERY}" -> accepted. Run brief-architect.ts to scaffold the brief.`)
  await logRun({
    agent: 'promote-keyword',
    itemRef: QUERY,
    status: 'ok',
    detail: { action: 'promoted', forced: FORCE, soft_warnings: soft.length },
  })
}

main().catch(async (e) => {
  console.error('PROMOTE ERROR:', (e as Error).message)
  if (!DRY) await logRun({ agent: 'promote-keyword', itemRef: QUERY, status: 'error', error: (e as Error).message })
  process.exit(1)
})
