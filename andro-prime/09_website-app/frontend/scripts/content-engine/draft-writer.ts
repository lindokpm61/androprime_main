/**
 * Draft-Writer — Phase 3b. The brief_ready -> drafted stage: it ingests an
 * /article-produced MDX draft into the engine so the Signoff-Concierge can pick it up.
 *
 * DESIGN: this does NOT generate prose. The /article skill (LLM + human judgment: live
 * source verification, voice pass, compliance pre-flight, hand-picked photo) authors the
 * draft into 06_marketing/seo-ai-search/article-drafts/. Draft-Writer is the deterministic
 * bridge that registers that draft as a blog_articles draft + advances the pipeline. Keeping
 * authorship in /article is deliberate: the source/compliance judgement must not run headless.
 *
 * Per tick, for each content_pipeline row stage='brief_ready' with a slug + brief_ref:
 *   1. derive the draft path from brief_ref (…/article-briefs/X.md -> …/article-drafts/X.mdx).
 *      Missing file -> the author hasn't drafted yet; skip quietly.
 *   2. cheap pre-gates: no unknown MDX components, no unresolved citation placeholders
 *      (the full real-render compile-gate still runs later in the Signoff-Concierge).
 *      Fail -> blocked_on='keith', skip.
 *   3. upsert_blog_article(status='draft', editor='draft-writer') — row + revision + pointer.
 *   4. flip pipeline stage='drafted' (+ article_id), clear blocked_on.
 *
 * Idempotent: the filter (stage='brief_ready') excludes anything already drafted. --dry mode.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/draft-writer.ts --dry
 *   npx tsx scripts/content-engine/draft-writer.ts
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { loadEnvLocal, admin, logRun } from './_shared'
import { unknownComponents } from './compile-gate'

loadEnvLocal()
const DRY = process.argv.includes('--dry')

// Repo root = three up from frontend/ (frontend -> 09_website-app -> andro-prime -> repo root).
// brief_ref is stored repo-root-relative (e.g. 'andro-prime/06_marketing/.../X.md').
const REPO_ROOT = path.resolve(process.cwd(), '../../..')

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

const DRAFTS_REL = 'andro-prime/06_marketing/seo-ai-search/article-drafts'

/** Locate the /article draft for a pipeline row. Prefer the slug-named file
 * (article-drafts/{slug}.mdx — the published + brief-architect convention), and
 * fall back to the brief's basename. Slug-first means a hand-authored HUB brief
 * named pillar-X-hub-{slug}.md still resolves to {slug}.mdx with no brief_ref hack. */
function resolveDraftPath(slug: string, briefRef: string | null): string | null {
  const bySlug = path.join(REPO_ROOT, DRAFTS_REL, `${slug}.mdx`)
  if (fs.existsSync(bySlug)) return bySlug
  if (briefRef) {
    const byBrief = path.join(
      REPO_ROOT,
      briefRef.replace('/article-briefs/', '/article-drafts/').replace(/\.md$/, '.mdx'),
    )
    if (fs.existsSync(byBrief)) return byBrief
  }
  return null
}

/** Match import-blog-to-db.ts: coerce YAML Date objects to YYYY-MM-DD so stored FM renders identically. */
function coerceDates(fm: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...fm }
  for (const k of ['date', 'dateModified', 'isoDate']) {
    const v = out[k]
    if (v instanceof Date) out[k] = v.toISOString().slice(0, 10)
    else if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) out[k] = v.slice(0, 10)
  }
  return out
}

/** Unresolved citation/placeholder markers the /article skill forbids shipping (invariant 3). */
function placeholderMarkers(body: string): string[] {
  const found: string[] = []
  if (/SOURCE TODO/i.test(body)) found.push('SOURCE TODO marker')
  if (/\]\(URL\)/.test(body)) found.push('unresolved ](URL) link')
  if (/\bTKTK\b/.test(body)) found.push('TKTK placeholder')
  return found
}

async function blockOnKeith(id: string, slug: string, reason: string) {
  log(`BLOCKED  ${slug}  ${reason}`)
  if (DRY) return
  await admin().from('content_pipeline').update({ blocked_on: 'keith', notes: reason }).eq('id', id)
  await logRun({ agent: 'draft-writer', itemRef: slug, status: 'blocked', error: reason })
}

async function runDraftWriter() {
  const { data, error } = await admin()
    .from('content_pipeline')
    .select('id, slug, brief_ref, pillar')
    .eq('stage', 'brief_ready')
  if (error) throw new Error(`read brief_ready: ${error.message}`)

  for (const row of data ?? []) {
    const slug = row.slug
    if (!slug) {
      log(`SKIP     (pipeline ${row.id}: missing slug)`)
      continue
    }

    const draftPath = resolveDraftPath(slug, row.brief_ref)
    if (!draftPath) {
      log(`waiting  ${slug}  (no draft at ${DRAFTS_REL}/${slug}.mdx)`)
      continue
    }

    const raw = fs.readFileSync(draftPath, 'utf-8')
    const { data: fmRaw, content: body } = matter(raw)

    // (2) cheap pre-gates (the real-render compile-gate runs later in the Signoff-Concierge).
    const unknown = unknownComponents(body)
    if (unknown.length) {
      await blockOnKeith(row.id, slug, `unknown MDX component(s): ${unknown.join(', ')}`)
      continue
    }
    const placeholders = placeholderMarkers(body)
    if (placeholders.length) {
      await blockOnKeith(row.id, slug, `unresolved placeholders: ${placeholders.join(', ')}`)
      continue
    }

    // JSON round-trip drops Date objects to ISO, then coerce date fields to date-only.
    const fm = coerceDates(JSON.parse(JSON.stringify(fmRaw)))
    fm.status = 'draft' // never ingest as published; the preview banner reads this
    const keywordCoverage = (fm.keyword_coverage as unknown) ?? null

    log(`DRAFT    ${slug}  <- ${path.relative(REPO_ROOT, draftPath)}`)
    if (DRY) continue

    // (3) write the draft (row + immutable revision + current pointer) in one transaction.
    const { data: articleId, error: rpcErr } = await admin().rpc('upsert_blog_article', {
      p_slug: slug,
      p_status: 'draft',
      p_body: body,
      p_frontmatter: fm as never,
      p_keyword_coverage: keywordCoverage as never,
      p_editor: 'draft-writer',
    })
    if (rpcErr) {
      await blockOnKeith(row.id, slug, `upsert_blog_article: ${rpcErr.message}`)
      continue
    }

    // (4) advance the pipeline -> Signoff-Concierge takes it from here.
    await admin()
      .from('content_pipeline')
      .update({ stage: 'drafted', article_id: articleId as string, blocked_on: null, notes: null })
      .eq('id', row.id)

    await logRun({
      agent: 'draft-writer',
      itemRef: slug,
      status: 'ok',
      detail: { action: 'drafted', article_id: articleId, source: path.relative(REPO_ROOT, draftPath) },
    })
  }
}

async function main() {
  log(`draft-writer tick (repo ${REPO_ROOT})`)
  await runDraftWriter()
  log('done.')
}

export { runDraftWriter }

if (process.argv[1]?.endsWith('draft-writer.ts')) {
  main().catch(async (e) => {
    console.error('DRAFT-WRITER ERROR:', (e as Error).message)
    if (!DRY) await logRun({ agent: 'draft-writer', status: 'error', error: (e as Error).message })
    process.exit(1)
  })
}
