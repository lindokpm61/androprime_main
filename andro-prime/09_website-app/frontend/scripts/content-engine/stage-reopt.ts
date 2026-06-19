/**
 * stage-reopt — Phase 3b. The author-side of a re-optimisation: ingest a new MDX body for a
 * LIVE article as a PROPOSED revision (not live) and queue it for review, HELD on Keith.
 *
 *   stage:    stage_blog_revision(slug, new body) -> proposed_revision_id; upsert the
 *             content_pipeline row to stage='reoptimising', blocked_on='keith' (held). Prints
 *             the proposed-revision preview link so Keith can eyeball the applied copy. The
 *             live page is untouched and nothing reaches Ewa yet.
 *   release:  clears blocked_on so the next orchestrator tick's Reopt-Concierge submits it
 *             to Ewa. (Keith's checkpoint between "applied" and "sent to Ewa".)
 *
 * Applying the proposal copy into the new MDX is human/LLM work (it edits signed clinical
 * copy); this tool only ingests + stages the result. Run from frontend/:
 *   npx tsx scripts/content-engine/stage-reopt.ts --slug crp-blood-test --body /path/new.mdx --brief <ref>
 *   npx tsx scripts/content-engine/stage-reopt.ts --release --slug crp-blood-test
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()
const argv = process.argv.slice(2)
const DRY = argv.includes('--dry')
const RELEASE = argv.includes('--release')
function opt(name: string): string {
  const i = argv.indexOf(name)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : ''
}
const SLUG = opt('--slug')
const BODY_PATH = opt('--body')
const BRIEF = opt('--brief') || null

// Preview links must be clickable by Keith -> always prod (NEXT_PUBLIC_SITE_URL is localhost in dev).
const BASE_URL = (process.env.CONTENT_ENGINE_BASE_URL || 'https://andro-prime.com').replace(/\/$/, '')
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || ''

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

function coerceDates(fm: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...fm }
  for (const k of ['date', 'dateModified', 'isoDate']) {
    const v = out[k]
    if (v instanceof Date) out[k] = v.toISOString().slice(0, 10)
    else if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) out[k] = v.slice(0, 10)
  }
  return out
}

async function release() {
  if (!SLUG) throw new Error('--release needs --slug')
  const { data: row } = await admin().from('content_pipeline').select('id, stage, blocked_on').eq('slug', SLUG).maybeSingle()
  if (!row || row.stage !== 'reoptimising') throw new Error(`no reoptimising pipeline row for ${SLUG}`)
  log(`RELEASE  ${SLUG}  (blocked_on ${row.blocked_on ?? 'null'} -> null) -> Reopt-Concierge will submit to Ewa next tick`)
  if (DRY) return
  await admin().from('content_pipeline').update({ blocked_on: null }).eq('id', row.id)
  await logRun({ agent: 'stage-reopt', itemRef: SLUG, status: 'ok', detail: { action: 'released' } })
}

async function stage() {
  if (!SLUG || !BODY_PATH) throw new Error('stage needs --slug <slug> --body <new-mdx-path>')
  const bodyFile = path.isAbsolute(BODY_PATH) ? BODY_PATH : path.join(process.cwd(), BODY_PATH)
  if (!fs.existsSync(bodyFile)) throw new Error(`body file not found: ${bodyFile}`)

  const { data: art } = await admin().from('blog_articles').select('id, status').eq('slug', SLUG).maybeSingle()
  if (!art) throw new Error(`no blog_articles row for ${SLUG}`)
  if (art.status !== 'published') log(`note: article status is '${art.status}' (re-opt normally targets a published article)`)

  const { data: fmRaw, content: body } = matter(fs.readFileSync(bodyFile, 'utf-8'))
  const fm = coerceDates(JSON.parse(JSON.stringify(fmRaw)))
  const keywordCoverage = (fm.keyword_coverage as unknown) ?? null

  log(`STAGE    ${SLUG}  <- ${path.relative(process.cwd(), bodyFile)}`)
  if (DRY) { log('dry: would stage revision + queue (held on Keith)'); return }

  const { data: revId, error: stageErr } = await admin().rpc('stage_blog_revision', {
    p_slug: SLUG,
    p_body: body,
    p_frontmatter: fm as never,
    p_keyword_coverage: keywordCoverage as never,
    p_editor: 'reopt',
  })
  if (stageErr) throw new Error(`stage_blog_revision: ${stageErr.message}`)

  // Upsert the pipeline row to reoptimising, HELD on Keith (clear any stale task).
  const { data: existing } = await admin().from('content_pipeline').select('id').eq('slug', SLUG).maybeSingle()
  const patch = { slug: SLUG, stage: 'reoptimising' as const, brief_ref: BRIEF, blocked_on: 'keith' as const, clickup_task_id: null, notes: null }
  if (existing) await admin().from('content_pipeline').update(patch).eq('id', existing.id)
  else await admin().from('content_pipeline').insert(patch)

  const previewUrl = `${BASE_URL}/blog/preview/${SLUG}?token=${encodeURIComponent(PREVIEW_SECRET)}&rev=${revId}`
  await logRun({ agent: 'stage-reopt', itemRef: SLUG, status: 'ok', detail: { action: 'staged', revision_id: revId } })

  log(`staged proposed revision ${revId}`)
  log(`REVIEW (Keith, live page unchanged): ${previewUrl}`)
  log(`when happy: npx tsx scripts/content-engine/stage-reopt.ts --release --slug ${SLUG}`)
}

;(RELEASE ? release() : stage()).catch(async (e) => {
  console.error('STAGE-REOPT ERROR:', (e as Error).message)
  if (!DRY) await logRun({ agent: 'stage-reopt', itemRef: SLUG || null, status: 'error', error: (e as Error).message })
  process.exit(1)
})
