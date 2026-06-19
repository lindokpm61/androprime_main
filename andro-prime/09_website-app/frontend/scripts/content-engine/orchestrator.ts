/**
 * Content-engine orchestrator — the daily tick (PULL model). Drives the ingest, sign-off
 * and PUBLISH end of the pipeline:
 *
 *   runDraftWriter()       stage='brief_ready' -> ingest the /article-produced MDX draft
 *                          (upsert_blog_article) -> stage='drafted'. Phase 3b; draft-writer.ts.
 *   runSignoffConcierge()  stage='drafted' -> compile-gate -> create Ewa review task +
 *                          content_review_log('submitted') -> stage='in_review'
 *                          (blocked_on='ewa'). Phase 3b; see signoff-concierge.ts.
 *   syncApprovals()  content_pipeline.stage='in_review' + ClickUp task 'complete'
 *                    -> mark approved (content_review_log + pipeline.stage='approved',
 *                       capture the task due date as the publish slot)
 *   publishDue()     stage='approved' + due date <= today
 *                    -> compile-gate (real-render) -> exactly-once publish -> revalidate
 *                       -> stage='published'. Compile failure -> blocked + ClickUp comment.
 *
 * State-driven + idempotent: re-running re-reads rows; the publish flip is a conditional
 * update (WHERE status='draft') so two ticks can't double-publish. Every action writes an
 * agent_runs row. Remaining Phase 3b creative agents (Brief-Architect, Draft-Writer,
 * Keyword-Scout, Measurement-Analyst) land separately.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/orchestrator.ts --dry   # report only, no writes
 *   npx tsx scripts/content-engine/orchestrator.ts         # act
 */
import { loadEnvLocal, admin, requireEnv, logRun, ISO_TODAY } from './_shared'
import { getTask, isApproved, addComment } from './clickup'
import { compileGate } from './compile-gate'
import { runDraftWriter } from './draft-writer'
import { runSignoffConcierge } from './signoff-concierge'

loadEnvLocal()
const DRY = process.argv.includes('--dry')
const BASE_URL = (
  process.env.CONTENT_ENGINE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://andro-prime.com'
).replace(/\/$/, '')

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

async function revalidate(slug: string) {
  const res = await fetch(`${BASE_URL}/api/revalidate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-revalidate-secret': requireEnv('REVALIDATE_SECRET') },
    body: JSON.stringify({ slug }),
  })
  if (!res.ok) throw new Error(`revalidate -> HTTP ${res.status}`)
}

// in_review + ClickUp 'complete' -> approved
async function syncApprovals() {
  const { data, error } = await admin()
    .from('content_pipeline')
    .select('id, slug, article_id, clickup_task_id')
    .eq('stage', 'in_review')
    .not('clickup_task_id', 'is', null)
  if (error) throw new Error(`read in_review: ${error.message}`)

  for (const row of data ?? []) {
    const task = await getTask(row.clickup_task_id as string)
    if (!isApproved(task)) {
      log(`pending  ${row.slug}  (ClickUp '${task.statusName}')`)
      continue
    }
    log(`APPROVE  ${row.slug}  due=${task.dueDate ?? 'unset'}`)
    if (DRY) continue
    if (row.article_id) {
      await admin()
        .from('content_review_log')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('article_id', row.article_id)
        .eq('status', 'submitted')
    }
    await admin()
      .from('content_pipeline')
      .update({ stage: 'approved', target_date: task.dueDate, blocked_on: null })
      .eq('id', row.id)
    await logRun({ agent: 'orchestrator', itemRef: row.slug as string, status: 'ok', detail: { action: 'approved' } })
  }
}

// approved + due <= today -> compile-gate -> publish -> revalidate
async function publishDue() {
  const today = ISO_TODAY()
  const { data, error } = await admin()
    .from('content_pipeline')
    .select('id, slug, article_id, target_date, clickup_task_id')
    .eq('stage', 'approved')
  if (error) throw new Error(`read approved: ${error.message}`)

  for (const row of data ?? []) {
    const slug = row.slug as string
    if (row.target_date && row.target_date > today) {
      log(`scheduled ${slug}  (due ${row.target_date})`)
      continue
    }
    const { data: art } = await admin()
      .from('blog_articles')
      .select('slug, body, status')
      .eq('slug', slug)
      .maybeSingle()
    if (!art) {
      log(`MISSING  ${slug}  (no blog_articles row)`)
      if (!DRY) await logRun({ agent: 'publisher', itemRef: slug, status: 'error', error: 'no blog_articles row' })
      continue
    }
    if (art.status === 'published') {
      log(`already  ${slug}  (published) -> mark pipeline`)
      if (!DRY) await admin().from('content_pipeline').update({ stage: 'published' }).eq('id', row.id)
      continue
    }

    // compile-gate (real render via preview)
    const gate = await compileGate({
      slug,
      body: art.body,
      baseUrl: BASE_URL,
      previewSecret: requireEnv('PREVIEW_SECRET'),
    })
    if (!gate.ok) {
      log(`BLOCKED  ${slug}  ${gate.errors.join('; ')}`)
      if (!DRY) {
        await logRun({ agent: 'publisher', itemRef: slug, status: 'blocked', error: gate.errors.join('; ') })
        if (row.clickup_task_id) {
          await addComment(row.clickup_task_id as string, `Publish blocked by compile-gate: ${gate.errors.join('; ')}`)
        }
      }
      continue
    }

    log(`PUBLISH  ${slug}  (gate ok)`)
    if (DRY) continue

    // exactly-once: only the writer that flips draft->published wins
    const { data: upd } = await admin()
      .from('blog_articles')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('slug', slug)
      .eq('status', 'draft')
      .select('slug')
    if (!upd || upd.length === 0) {
      log(`raced    ${slug}  (already flipped by another run)`)
      await admin().from('content_pipeline').update({ stage: 'published' }).eq('id', row.id)
      continue
    }
    await revalidate(slug)
    await admin().from('content_pipeline').update({ stage: 'published' }).eq('id', row.id)
    await logRun({ agent: 'publisher', itemRef: slug, status: 'ok', detail: { action: 'published' } })
  }
}

async function main() {
  log(`orchestrator tick @ ${BASE_URL}`)
  await runDraftWriter() //       brief_ready -> drafted (ingest /article output)
  await runSignoffConcierge() // drafted -> in_review (submit to Ewa)
  await syncApprovals() //        in_review + ClickUp complete -> approved
  await publishDue() //           approved + due<=today -> compile-gate -> published
  log('done.')
}

main().catch(async (e) => {
  console.error('ORCHESTRATOR ERROR:', (e as Error).message)
  if (!DRY) await logRun({ agent: 'orchestrator', status: 'error', error: (e as Error).message })
  process.exit(1)
})
