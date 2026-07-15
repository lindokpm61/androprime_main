/**
 * Seed-Pipeline — the manual on-ramp for a hand-authored article.
 *
 * The autonomous pipeline creates content_pipeline rows from the keyword queue
 * (csv-to-queue -> brief-architect). An article authored by hand (brief written
 * by hand, drafted via the /article skill straight into article-drafts/) never
 * passes through that queue, so it has NO content_pipeline row, so Draft-Writer
 * and Signoff-Concierge never see it and no ClickUp review task is ever created.
 *
 * This is the one missing link: it seeds a single content_pipeline row for a
 * hand-authored slug at stage='brief_ready' (the exact stage Draft-Writer scans),
 * mirroring the insert shape brief-architect.ts uses. It does NOT re-implement
 * Draft-Writer or Signoff-Concierge: those stay the single source of truth for
 * file->DB registration and the ClickUp hand-off. With --run it just calls their
 * exported run functions in sequence for convenience.
 *
 * Flow once seeded:
 *   brief_ready -> [draft-writer] registers article-drafts/{slug}.mdx into
 *   blog_articles (status=draft) + advances to 'drafted' -> [signoff-concierge]
 *   compile-gates + creates the ClickUp "Review:" task with the preview link ->
 *   Ewa completes the task -> syncApprovals flips the DB row to published ->
 *   live on the blog, NO Coolify redeploy (the live site reads blog_articles).
 *
 * Idempotent: if a content_pipeline row already exists for the slug it is not
 * duplicated. A row still parked at 'briefed' is advanced to 'brief_ready';
 * a row already at 'brief_ready' or beyond is left untouched.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/seed-pipeline.ts --slug free-androgen-index --dry
 *   npx tsx scripts/content-engine/seed-pipeline.ts --slug free-androgen-index
 *   npx tsx scripts/content-engine/seed-pipeline.ts --slug free-androgen-index --run
 *
 * Options:
 *   --slug <slug>          required. The article slug (= article-drafts/{slug}.mdx).
 *   --brief <repo-rel>     optional. Repo-root-relative brief path. If omitted, the
 *                          brief is located by matching frontmatter slug in article-briefs/.
 *   --pillar <pillar-X>    optional. Defaults to the pillar parsed from the brief's
 *                          `brief:` frontmatter (e.g. "pillar-C-hub" -> "pillar-C").
 *   --target-date <date>   optional YYYY-MM-DD. Sets the ClickUp review due date.
 *   --run                  after seeding, run draft-writer then signoff-concierge.
 *   --dry                  report without writing (also passed through to --run stages).
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()

const argv = process.argv.slice(2)
const DRY = argv.includes('--dry')
const RUN = argv.includes('--run')
function arg(name: string): string | null {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null
}

const REPO_ROOT = path.resolve(process.cwd(), '../../..')
const BRIEFS_REL = 'andro-prime/06_marketing/seo-ai-search/article-briefs'
const DRAFTS_REL = 'andro-prime/06_marketing/seo-ai-search/article-drafts'

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

/** Find the brief whose frontmatter `slug:` matches, returning its repo-root-relative path. */
function findBriefBySlug(slug: string): string | null {
  const dir = path.join(REPO_ROOT, BRIEFS_REL)
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    try {
      const fm = matter(fs.readFileSync(path.join(dir, f), 'utf-8')).data as { slug?: string }
      if (fm.slug === slug) return `${BRIEFS_REL}/${f}`
    } catch {
      // ignore unparseable files
    }
  }
  return null
}

/** "pillar-C-hub" / "pillar-C-spoke" / "pillar-C" -> "pillar-C". */
function pillarFromBrief(briefAbsPath: string): string | null {
  try {
    const fm = matter(fs.readFileSync(briefAbsPath, 'utf-8')).data as { brief?: string; pillar?: string }
    const src = fm.pillar || fm.brief || ''
    const m = /pillar-[A-Z]/.exec(src)
    return m ? m[0] : null
  } catch {
    return null
  }
}

async function seed(): Promise<'seeded' | 'promoted' | 'exists' | 'error'> {
  const slug = arg('slug')
  if (!slug) {
    console.error('Missing --slug. Usage: seed-pipeline.ts --slug <slug> [--brief <repo-rel>] [--pillar pillar-X] [--target-date YYYY-MM-DD] [--run] [--dry]')
    return 'error'
  }

  const briefRef = arg('brief') || findBriefBySlug(slug)
  if (!briefRef) {
    console.error(`No brief found for slug '${slug}' (pass --brief <repo-rel path>, or ensure a brief in ${BRIEFS_REL} has frontmatter slug: ${slug}).`)
    return 'error'
  }
  const briefAbs = path.join(REPO_ROOT, briefRef)
  if (!fs.existsSync(briefAbs)) {
    console.error(`Brief file not found: ${briefRef}`)
    return 'error'
  }

  const pillar = arg('pillar') || pillarFromBrief(briefAbs)
  const targetDate = arg('target-date') // nullable; drives the ClickUp due date
  const draftRel = `${DRAFTS_REL}/${slug}.mdx`
  const draftExists = fs.existsSync(path.join(REPO_ROOT, draftRel))
  if (!draftExists) {
    log(`WARN     no draft at ${draftRel} yet. Seeding is fine, but draft-writer will just wait until the /article draft exists.`)
  }

  // Idempotency: never duplicate a pipeline row for a slug.
  const { data: existing, error: readErr } = await admin()
    .from('content_pipeline')
    .select('id, stage')
    .eq('slug', slug)
    .maybeSingle()
  if (readErr) {
    console.error(`read content_pipeline: ${readErr.message}`)
    return 'error'
  }

  if (existing) {
    // Stages before brief_ready (keyword_selected, briefed) are advanced; brief_ready and
    // beyond (drafted, in_review, approved, scheduled, published) are already in the pipeline.
    if (existing.stage === 'keyword_selected' || existing.stage === 'briefed') {
      log(`PROMOTE  ${slug}  content_pipeline row exists at '${existing.stage}' -> 'brief_ready'`)
      if (DRY) return 'promoted'
      await admin().from('content_pipeline').update({ stage: 'brief_ready', blocked_on: null, notes: null }).eq('id', existing.id)
      await logRun({ agent: 'seed-pipeline', itemRef: slug, status: 'ok', detail: { action: 'promoted', from: existing.stage, to: 'brief_ready' } })
      return 'promoted'
    }
    log(`exists   ${slug}  content_pipeline row already at stage '${existing.stage}' (brief_ready or beyond). Nothing to seed.`)
    return 'exists'
  }

  log(`SEED     ${slug}  -> content_pipeline (stage=brief_ready, pillar=${pillar ?? 'null'}, brief_ref=${briefRef}${targetDate ? `, target_date=${targetDate}` : ''})`)
  if (DRY) return 'seeded'

  const { error: insErr } = await admin()
    .from('content_pipeline')
    .insert({ slug, pillar, stage: 'brief_ready', brief_ref: briefRef, target_date: targetDate, blocked_on: null })
  if (insErr) {
    console.error(`insert content_pipeline: ${insErr.message}`)
    await logRun({ agent: 'seed-pipeline', itemRef: slug, status: 'error', error: insErr.message })
    return 'error'
  }
  await logRun({ agent: 'seed-pipeline', itemRef: slug, status: 'ok', detail: { action: 'seeded', stage: 'brief_ready', brief_ref: briefRef } })
  return 'seeded'
}

async function main() {
  log(`seed-pipeline (repo ${REPO_ROOT})`)
  const result = await seed()
  if (result === 'error') process.exit(1)

  if (RUN) {
    if (result === 'exists') {
      log('SKIP-RUN row already past brief_ready; run draft-writer / signoff-concierge directly if it stalled.')
    } else {
      log('--run: chaining draft-writer then signoff-concierge (existing stages, single source of truth) ...')
      // Imported lazily so a plain seed run never touches their env requirements (e.g. PREVIEW_SECRET).
      const { runDraftWriter } = await import('./draft-writer')
      const { runSignoffConcierge } = await import('./signoff-concierge')
      await runDraftWriter()
      await runSignoffConcierge()
    }
  } else {
    log('Next: `npx tsx scripts/content-engine/draft-writer.ts` then `npx tsx scripts/content-engine/signoff-concierge.ts` (or re-run with --run). signoff-concierge needs a reachable CONTENT_ENGINE_BASE_URL + PREVIEW_SECRET for the compile-gate preview render.')
  }
  log('done.')
}

if (process.argv[1]?.endsWith('seed-pipeline.ts')) {
  main().catch(async (e) => {
    console.error('SEED-PIPELINE ERROR:', (e as Error).message)
    if (!DRY) await logRun({ agent: 'seed-pipeline', status: 'error', error: (e as Error).message })
    process.exit(1)
  })
}

export { seed }
