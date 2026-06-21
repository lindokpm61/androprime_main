/**
 * keyword_queue/DB → keywords.csv reconciler — Phase 9 of the single-source rebuild.
 * Closes the back of the loop: writes live status from blog_articles + content_pipeline
 * back into the master's coverage_status (and backfills primary_article_slug), so the
 * CSV plan stops drifting from runtime reality.
 *
 * Mapping (DB -> keyword_coverage_status vocab the CSV uses):
 *   blog_articles.status = published       -> 'published'
 *   pipeline stage published/reoptimising  -> 'published'
 *   pipeline approved/scheduled/in_review/drafted -> 'drafted'
 *   pipeline keyword_selected/briefed/brief_ready -> 'briefed'
 * A CSV row matches an article when slugify(query) == slug, or its primary_article_slug
 * contains / is contained by the slug (same loose match the coverage audit uses).
 *
 * Row-stable: only coverage_status (col 12) and a blank primary_article_slug (col 11) are
 * mutated; row order + all other columns are preserved (keeps article line-number refs valid).
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/reconcile-coverage.ts --dry
 *   npx tsx scripts/content-engine/reconcile-coverage.ts
 */
import fs from 'fs'
import path from 'path'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()
const DRY = process.argv.includes('--dry')
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
const esc = (s: string) => { s = String(s ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
const slugify = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const norm = (s: string) => slugify(s)

const PIPE_COV: Record<string, string> = {
  published: 'published', reoptimising: 'published',
  approved: 'drafted', scheduled: 'drafted', in_review: 'drafted', drafted: 'drafted',
  keyword_selected: 'briefed', briefed: 'briefed', brief_ready: 'briefed',
}

async function main() {
  const arts = (await admin().from('blog_articles').select('slug,status')).data ?? []
  const pipe = (await admin().from('content_pipeline').select('slug,stage')).data ?? []

  // desired coverage per slug (published wins over pipeline stage)
  const cov = new Map<string, string>()
  for (const p of pipe) { const c = PIPE_COV[(p.stage ?? '') as string]; if (p.slug && c) cov.set(p.slug, c) }
  for (const a of arts) { if (a.slug && a.status === 'published') cov.set(a.slug, 'published') }
  const slugs = [...cov.keys()]
  log(`DB state: ${arts.length} articles, ${pipe.length} pipeline rows -> ${slugs.length} owned slug(s)`)

  const lines = fs.readFileSync(CSV, 'utf-8').split(/\r?\n/)
  const header = lines[0]
  const out = [header]
  const changes: string[] = []
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const c = parseCsv(lines[i]); while (c.length < 20) c.push('')
    const qSlug = slugify(c[0])
    const priorSlug = norm(c[11] || '')
    // find owning slug: exact query-slug match, else loose primary_article_slug match
    const match = slugs.find((s) => qSlug === s) ||
      slugs.find((s) => priorSlug && (priorSlug.includes(s) || s.includes(priorSlug)))
    if (match) {
      const want = cov.get(match) as string
      if (c[12] !== want) { changes.push(`${c[0]}: coverage "${c[12] || '—'}" -> "${want}" (${match})`); c[12] = want }
      if (!c[11]) c[11] = match // backfill primary_article_slug
    }
    out.push(c.map(esc).join(','))
  }

  log(`${changes.length} row(s) to update`)
  for (const ch of changes) console.log(`  ${ch}`)
  if (DRY) { log('dry: keywords.csv not written'); return }
  if (!changes.length) { log('already in sync'); return }
  fs.writeFileSync(CSV, out.join('\n') + '\n')
  log(`keywords.csv reconciled (${changes.length} rows updated, row order preserved)`)
  await logRun({ agent: 'reconcile-coverage', status: 'ok', detail: { updated: changes.length } })
}

main().catch(async (e) => {
  console.error('RECONCILE-COVERAGE ERROR:', (e as Error).message)
  if (!DRY) await logRun({ agent: 'reconcile-coverage', status: 'error', error: (e as Error).message })
  process.exit(1)
})
