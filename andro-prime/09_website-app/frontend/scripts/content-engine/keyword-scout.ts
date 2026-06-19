/**
 * Keyword-Scout — Phase 3b. The funnel top: expands seed keywords via DataForSEO,
 * filters by demand/difficulty, drops clinical/regulated terms and anything already
 * covered, and inserts the survivors into keyword_queue as CANDIDATES. The
 * candidate -> accepted promotion stays a human decision (a content gate), so this never
 * auto-commits work — it only fills the queue Keith/Brief-Architect choose from.
 *
 * MANUAL / PERIODIC (not on the daily cron): DataForSEO is pay-per-call, so this is run by
 * hand against chosen seeds. Reuses tools/dataforseo.mjs (the single source of DFS truth);
 * creds come from the repo-root .env, same as that tool.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/keyword-scout.ts --seed "cortisol blood test" --pillar D --dry
 *   npx tsx scripts/content-engine/keyword-scout.ts --seed "ferritin levels" --mode related --limit 40
 *   npx tsx scripts/content-engine/keyword-scout.ts --from-json fixture.json --pillar TEST   # no API spend
 */
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()

const REPO_ROOT = path.resolve(process.cwd(), '../../..')
const DFS_TOOL = path.join(REPO_ROOT, 'andro-prime/06_marketing/seo-ai-search/tools/dataforseo.mjs')
const KEYWORDS_CSV = path.join(REPO_ROOT, 'andro-prime/06_marketing/seo-ai-search/keywords.csv')

// --- args ---
const argv = process.argv.slice(2)
const DRY = argv.includes('--dry')
function opt(name: string, fallback = ''): string {
  const i = argv.indexOf(name)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
function optAll(name: string): string[] {
  const out: string[] = []
  for (let i = 0; i < argv.length; i++) if (argv[i] === name && argv[i + 1]) out.push(argv[i + 1])
  return out
}
const SEEDS = optAll('--seed')
const FROM_JSON = opt('--from-json')
const PILLAR = opt('--pillar') || null
const MODE = (opt('--mode', 'suggest') as 'suggest' | 'related' | 'overview')
const LIMIT = parseInt(opt('--limit', '40'), 10) || 40
const MIN_VOL = parseInt(opt('--min-vol', '100'), 10) || 100
const MAX_KD = parseInt(opt('--max-kd', '40'), 10) || 40

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

// Clinical / regulated vocabulary the Phase-0 wellness funnel must never chase (CLAUDE.md
// guardrail 2: wellness/clinical split). Matches drop the term entirely — not even a candidate.
const CLINICAL = [
  'trt', 'testosterone replacement', 'testosterone therapy', 'hrt', 'prescription', 'prescribe',
  'prescribed', 'steroid', 'anabolic', 'clomid', 'nebido', 'sustanon', 'enclomiphene', 'clomiphene',
  'hcg', 'peptide', 'ozempic', 'wegovy', 'semaglutide', 'tirzepatide', 'mounjaro', 'viagra', 'tadalafil',
]

interface DfsRow { query: string; vol: number | ''; kd: number | ''; cpc: number | ''; competition?: string; intent?: string }

function slugify(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

/** First CSV field of each data line (handles a leading quoted field). */
function existingCsvQueries(): Set<string> {
  const set = new Set<string>()
  if (!fs.existsSync(KEYWORDS_CSV)) return set
  const lines = fs.readFileSync(KEYWORDS_CSV, 'utf-8').split(/\r?\n/).slice(1)
  for (const line of lines) {
    if (!line.trim()) continue
    let q: string
    if (line.startsWith('"')) {
      const end = line.indexOf('"', 1)
      q = line.slice(1, end < 0 ? undefined : end)
    } else {
      q = line.slice(0, line.indexOf(','))
    }
    if (q) set.add(q.trim().toLowerCase())
  }
  return set
}

/** Pull rows from DataForSEO via the existing tool (single source of DFS truth). */
function fetchFromDfs(seed: string): DfsRow[] {
  const out = execFileSync('node', [DFS_TOOL, MODE, seed, '--json', '--limit', String(LIMIT)], {
    encoding: 'utf-8',
    cwd: REPO_ROOT,
    maxBuffer: 8 * 1024 * 1024,
  })
  return JSON.parse(out) as DfsRow[]
}

function gather(): DfsRow[] {
  if (FROM_JSON) {
    const p = path.isAbsolute(FROM_JSON) ? FROM_JSON : path.join(process.cwd(), FROM_JSON)
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as DfsRow[]
  }
  const rows: DfsRow[] = []
  for (const seed of SEEDS) {
    log(`DFS ${MODE} "${seed}" (limit ${LIMIT})`)
    rows.push(...fetchFromDfs(seed))
  }
  return rows
}

async function main() {
  if (!FROM_JSON && SEEDS.length === 0) {
    console.error('Keyword-Scout needs --seed "<phrase>" (repeatable) or --from-json <file>.')
    process.exit(1)
  }
  log(`keyword-scout: min-vol ${MIN_VOL}, max-kd ${MAX_KD}, pillar ${PILLAR ?? '—'}`)

  const raw = gather()

  // De-dup within the batch by lower(query), keep the highest-volume instance.
  const byQuery = new Map<string, DfsRow>()
  for (const r of raw) {
    if (!r.query) continue
    const k = r.query.trim().toLowerCase()
    const prev = byQuery.get(k)
    if (!prev || (Number(r.vol) || 0) > (Number(prev.vol) || 0)) byQuery.set(k, r)
  }

  const seenQueue = new Set(
    ((await admin().from('keyword_queue').select('query')).data ?? []).map((r) => r.query.toLowerCase())
  )
  const seenCsv = existingCsvQueries()

  const counts = { found: byQuery.size, clinical: 0, lowVol: 0, highKd: 0, dupQueue: 0, dupCsv: 0, kept: 0 }
  const keep: Array<{ query: string; vol: number | null; kd: number | null; cpc: number | null; pillar: string | null; compliance_risk: string; proposed_slug: string; status: 'candidate'; notes: string }> = []
  const skippedClinical: string[] = []

  for (const [k, r] of byQuery) {
    if (CLINICAL.some((t) => k.includes(t))) { counts.clinical++; skippedClinical.push(r.query); continue }
    const vol = Number(r.vol)
    const kd = Number(r.kd)
    if (!Number.isFinite(vol) || vol < MIN_VOL) { counts.lowVol++; continue }
    if (Number.isFinite(kd) && kd > MAX_KD) { counts.highKd++; continue }
    if (seenQueue.has(k)) { counts.dupQueue++; continue }
    if (seenCsv.has(k)) { counts.dupCsv++; continue }
    counts.kept++
    keep.push({
      query: r.query.trim(),
      vol: Number.isFinite(vol) ? vol : null,
      kd: Number.isFinite(kd) ? kd : null,
      cpc: Number.isFinite(Number(r.cpc)) ? Number(r.cpc) : null,
      pillar: PILLAR,
      compliance_risk: 'medium',
      proposed_slug: slugify(r.query),
      status: 'candidate',
      notes: `keyword-scout ${MODE}${r.intent ? ` · intent:${r.intent}` : ''}`,
    })
  }

  // Report
  log(
    `found ${counts.found} → kept ${counts.kept}  (skipped: clinical ${counts.clinical}, lowVol ${counts.lowVol}, highKd ${counts.highKd}, dupQueue ${counts.dupQueue}, dupCsv ${counts.dupCsv})`
  )
  if (skippedClinical.length) log(`  clinical/regulated dropped: ${skippedClinical.slice(0, 10).join(', ')}${skippedClinical.length > 10 ? ' …' : ''}`)
  for (const k of keep.slice(0, 30)) console.log(`  + ${k.query}  (vol ${k.vol ?? '?'}, kd ${k.kd ?? '?'})`)
  if (keep.length > 30) console.log(`  …and ${keep.length - 30} more`)

  if (DRY) { log('dry: no inserts'); return }
  if (keep.length === 0) { log('nothing to insert'); await logRun({ agent: 'keyword-scout', status: 'ok', detail: counts as never }); return }

  const { error } = await admin().from('keyword_queue').insert(keep)
  if (error) throw new Error(`insert keyword_queue: ${error.message}`)
  log(`inserted ${keep.length} candidate(s) into keyword_queue`)
  await logRun({ agent: 'keyword-scout', status: 'ok', detail: { ...counts, inserted: keep.length } as never })
}

main().catch(async (e) => {
  console.error('KEYWORD-SCOUT ERROR:', (e as Error).message)
  if (!DRY) await logRun({ agent: 'keyword-scout', status: 'error', error: (e as Error).message })
  process.exit(1)
})
