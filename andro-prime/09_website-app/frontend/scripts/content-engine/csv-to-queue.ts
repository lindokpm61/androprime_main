/**
 * CSV → keyword_queue importer — Phase 9 of the single-source rebuild. Closes the
 * front of the loop: selection becomes a deterministic, priority-ordered query against
 * the DFS master (keywords.csv), not a hand-typed DB insert.
 *
 * Generates a deterministic, priority-ordered SHORTLIST: inserts rows into keyword_queue
 * as status='candidate' (NOT 'accepted'). A human then promotes candidate->accepted — the
 * system's existing content gate, and the right place to make the one judgment auto-dedup
 * can't: "is this a standalone article, or coverage under an existing hub?" (e.g. the FBC
 * red-cell family — mch/mchc/mcv/haematocrit — is coverage for one FBC explainer, not 5
 * articles). This kills the "lucky guess" selection problem while keeping that call human.
 * Brief-Architect only scaffolds 'accepted' rows, so candidates never auto-cascade.
 *
 * Selection filters (all from the rebuilt 20-col keywords.csv):
 *   - priority (col 7) <= --max-priority  (default 2)
 *   - kd_source = 'dfs'        (skip legacy/not-DFS-revalidated rows)
 *   - compliance != 'gate'     (Ewa-gated terms are NOT auto-queued)
 *   - serp_verdict != 'NHS-NAV' (navigational/NHS intent — not for us)
 *   - coverage_status is empty/'unassigned' (skip anything already owned)
 *   - not already in keyword_queue, and not already a content_pipeline slug
 * Sorted priority asc, volume desc; capped at --limit (default 15).
 *
 * Default ACTS (matches the content-engine family); --dry previews. Importing only
 * creates 'accepted' queue rows — Brief-Architect scaffolding stays manual, so this
 * does NOT auto-cascade into Ewa tasks.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/csv-to-queue.ts --dry
 *   npx tsx scripts/content-engine/csv-to-queue.ts --limit 10 --max-priority 2
 *   npx tsx scripts/content-engine/csv-to-queue.ts --pillar D
 */
import fs from 'fs'
import path from 'path'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()
const argv = process.argv.slice(2)
const DRY = argv.includes('--dry')
const opt = (n: string, d: string) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const LIMIT = parseInt(opt('--limit', '15'), 10) || 15
const MAX_PRI = parseInt(opt('--max-priority', '2'), 10) || 2
const PILLAR = opt('--pillar', '')

const REPO_ROOT = path.resolve(process.cwd(), '../../..')
const CSV = path.join(REPO_ROOT, 'andro-prime/06_marketing/seo-ai-search/keywords.csv')
const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

function parseCsv(line: string): string[] {
  const o: string[] = []; let c = '', q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (q) { if (ch === '"') { if (line[i + 1] === '"') { c += '"'; i++ } else q = false } else c += ch }
    else { if (ch === ',') { o.push(c); c = '' } else if (ch === '"') q = true; else c += ch }
  }
  o.push(c); return o
}
const slugify = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
// stemmed cluster key (despace single letters, drop stopwords, strip plurals, token-sort) —
// collapses near-dups like "mcv test" / "m c v test" / "mean corpuscular haemoglobin" variants
// so the importer queues ONE representative per concept, not five.
const STOP = new Set(['in', 'of', 'for', 'and', 'the', 'a', 'to', 'vs', 'on', 'is', 'my', 'me', 'you', 'your', 'do', 'does', 'i', 'what', 'how', 'at', 'with', 'an'])
const clusterKey = (q: string) => {
  const t = q.toLowerCase().replace(/\b([a-z]) (?=[a-z]\b)/g, '$1')
    .replace(/hemoglob/g, 'haemoglob').replace(/hematocrit/g, 'haematocrit').replace(/anemia/g, 'anaemia') // US->UK
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/).filter((w) => w && !STOP.has(w)).map((w) => w.replace(/s$/, ''))
  return [...new Set(t)].sort().join(' ')
}
const intOrNull = (s: string) => { const n = parseInt(s, 10); return Number.isFinite(n) ? n : null }
const numOrNull = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : null }

async function main() {
  const lines = fs.readFileSync(CSV, 'utf-8').split(/\r?\n/).filter((l) => l.trim())
  const rows = lines.slice(1).map(parseCsv)
  // 20-col indices: 0 query,1 vol,2 kd,6 assigned_to,7 priority,9 compliance_risk,
  // 12 coverage_status,13 kd_source,16 compliance,18 serp_verdict
  const candidates = rows
    .map((c) => ({
      query: c[0], vol: c[1], kd: c[2], cpc: c[3], pillar: c[6] || null, priority: parseInt(c[7], 10) || 9,
      compliance_risk: c[9] || null, coverage: (c[12] || '').trim(), kd_source: c[13], compliance: c[16], serp: c[18],
    }))
    .filter((r) => r.query && r.priority <= MAX_PRI && r.kd_source === 'dfs')
    .filter((r) => r.compliance !== 'gate' && r.serp !== 'NHS-NAV')
    .filter((r) => !/\bnear me\b|\bnear you\b/.test(r.query.toLowerCase())) // local intent — not for us
    .filter((r) => r.coverage === '' || r.coverage === 'unassigned')
    .filter((r) => !PILLAR || (r.pillar || '').toLowerCase().includes(PILLAR.toLowerCase()))
    .sort((a, b) => a.priority - b.priority || (Number(b.vol) || 0) - (Number(a.vol) || 0))

  // dedup against existing queue + pipeline
  const queued = new Set(((await admin().from('keyword_queue').select('query')).data ?? []).map((r) => r.query.toLowerCase()))
  const piped = new Set(((await admin().from('content_pipeline').select('slug')).data ?? []).map((r) => (r.slug ?? '').toLowerCase()))
  const pick = []
  const seenCluster = new Set<string>()
  for (const r of candidates) {
    if (queued.has(r.query.toLowerCase())) continue
    if (piped.has(slugify(r.query))) continue
    const ck = clusterKey(r.query)
    if (seenCluster.has(ck)) continue // one representative per concept (candidates are pre-sorted best-first)
    seenCluster.add(ck)
    pick.push(r)
    if (pick.length >= LIMIT) break
  }

  log(`selected ${pick.length} (max-priority ${MAX_PRI}, limit ${LIMIT}${PILLAR ? `, pillar ${PILLAR}` : ''}) of ${candidates.length} eligible`)
  for (const r of pick) console.log(`  P${r.priority} vol ${r.vol || '?'} kd ${r.kd || '?'} [${r.pillar || '?'}] ${r.query}`)
  if (DRY) { log('dry: no inserts'); return }
  if (!pick.length) { log('nothing to import'); return }

  const insert = pick.map((r) => ({
    query: r.query, vol: intOrNull(r.vol), kd: intOrNull(r.kd), cpc: numOrNull(r.cpc),
    pillar: r.pillar, compliance_risk: r.compliance_risk, proposed_slug: slugify(r.query),
    status: 'candidate' as const, coverage_status: 'unassigned' as const,
    notes: `imported from keywords.csv (priority ${r.priority}, DFS) 2026-06-21 — promote to 'accepted' to brief`,
  }))
  const { error } = await admin().from('keyword_queue').insert(insert)
  if (error) throw new Error(`insert keyword_queue: ${error.message}`)
  log(`imported ${insert.length} candidate(s) -> keyword_queue. Promote candidate->accepted to brief.`)
  await logRun({ agent: 'csv-to-queue', status: 'ok', detail: { imported: insert.length, max_priority: MAX_PRI } })
}

main().catch(async (e) => {
  console.error('CSV-TO-QUEUE ERROR:', (e as Error).message)
  if (!DRY) await logRun({ agent: 'csv-to-queue', status: 'error', error: (e as Error).message })
  process.exit(1)
})
