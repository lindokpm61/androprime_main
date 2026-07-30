/**
 * Signoff-Concierge — Phase 3b. The bridge between the creative end and the publish
 * end of the pipeline: it hands a finished draft to Dr Ewa Lindo for sign-off and
 * parks the item on her gate. This is the ONLY way an item enters 'in_review', so the
 * Phase-3a orchestrator (syncApprovals) has something to approve.
 *
 * Per tick, for each content_pipeline row stage='drafted' with no review task yet:
 *   1. compile-gate the draft (don't waste Ewa's time on a body that won't render).
 *      Fail -> block on Keith (it's a draft/build problem, not a clinical one), skip.
 *   2. create a ClickUp review task on "Content Review — Ewa" (the article markdown is
 *      the review surface; due date = the scheduled slot if set).
 *   2b. if the draft's frontmatter carries `ewa_rulings`, add each as a real checklist
 *      item under RULINGS_CHECKLIST. These are named questions ("does CA-028 §4 govern
 *      this phrase, or redline it") that a yes/no gate cannot express, so syncApprovals
 *      refuses to approve until each is ticked. Before this existed the question went in
 *      a hand-written comment and a bare 'complete' silently answered it yes.
 *   3. write a content_review_log row: status='submitted', pinned to the article +
 *      current revision + reviewer GMC + scope='full' (the CQC/ASA audit trail), with any
 *      rulings recorded in notes so the trail shows what was asked.
 *   4. flip pipeline: stage='in_review', blocked_on='ewa', store the task id.
 *
 * Idempotent: the filter (stage='drafted' AND clickup_task_id IS NULL) excludes anything
 * already submitted, so re-running never double-submits. --dry reports without writing.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/signoff-concierge.ts --dry
 *   npx tsx scripts/content-engine/signoff-concierge.ts
 */
import { loadEnvLocal, admin, requireEnv, logRun } from './_shared'
import { createReviewTask, addRulingsChecklist, RULINGS_CHECKLIST } from './clickup'
import { compileGate } from './compile-gate'

loadEnvLocal()
const DRY = process.argv.includes('--dry')
const BASE_URL = (
  process.env.CONTENT_ENGINE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://andro-prime.com'
).replace(/\/$/, '')

// Dr Ewa Lindo — GMC-registered GP, signs off all results/article copy (project record).
const REVIEWER_NAME = 'Dr Ewa Lindo'
const REVIEWER_GMC = '4758565'

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

/** YYYY-MM-DD -> epoch ms at UTC midnight (ClickUp due_date, date-only). */
function dateToMs(d: string | null): number | null {
  if (!d) return null
  const ms = Date.parse(`${d}T00:00:00Z`)
  return Number.isFinite(ms) ? ms : null
}

/** Named ruling requests from the draft's `ewa_rulings` frontmatter: specific questions
 * the submission needs answered, not just a yes/no on the article. Each becomes a real
 * ClickUp checklist item, which `syncApprovals` requires ticked before it will approve. */
export function rulingsFrom(fm: Record<string, unknown>): string[] {
  const raw = fm.ewa_rulings
  if (!Array.isArray(raw)) return []
  return raw.map((r) => String(r).trim()).filter(Boolean)
}

/** The review surface Ewa sees in ClickUp: a sign-off checklist + a link to the draft
 * rendered exactly as it will publish (the noindex, token-gated preview route). */
export function reviewMarkdown(slug: string, previewUrl: string, rulings: string[]): string {
  const lines = [
    `**Article for sign-off:** \`${slug}\``,
    `**Reviewer:** ${REVIEWER_NAME} (GMC ${REVIEWER_GMC})`,
    '',
    `**Review the rendered draft:** ${previewUrl}`,
    '',
  ]
  if (rulings.length) {
    // Stated before the completion instruction on purpose: the old body put the
    // ruling request in a separate comment, which is easy to close past.
    lines.push(
      `⚠️ **This article needs ${rulings.length} specific ruling${rulings.length > 1 ? 's' : ''} from you, not just an approval.** See the **${RULINGS_CHECKLIST}** checklist on this task. Tick each item to confirm it, or comment to redline it.`,
      '',
      `Completing the task with those items unticked will **not** publish it: the pipeline parks it and comes back to you. That is deliberate. A completed task with an unanswered question is indistinguishable from one that never saw the question.`,
      '',
    )
  }
  lines.push(
    'Mark this task **complete** to approve and release for publishing. Add a comment to request changes (it stays parked here until complete).',
    '',
    'Sign-off checks:',
    '- [ ] Health claims are EFSA-approved or non-claim wellness language',
    '- [ ] No Phase-0 / clinical (TRT, prescribing) boundary crossings',
    '- [ ] No Ashwagandha mention anywhere',
    '- [ ] Thresholds / recommendation logic are clinically sound',
    '- [ ] No em dashes, brand voice intact',
  )
  return lines.join('\n')
}

async function runSignoffConcierge() {
  const { data, error } = await admin()
    .from('content_pipeline')
    .select('id, slug, article_id, target_date, pillar')
    .eq('stage', 'drafted')
    .is('clickup_task_id', null)
  if (error) throw new Error(`read drafted: ${error.message}`)

  for (const row of data ?? []) {
    const slug = row.slug
    if (!slug) {
      log(`SKIP     (pipeline ${row.id} has no slug)`)
      continue
    }

    // The draft must exist in blog_articles and still be a draft.
    const { data: art } = await admin()
      .from('blog_articles')
      .select('id, slug, body, status, frontmatter, current_revision_id')
      .eq('slug', slug)
      .maybeSingle()
    if (!art) {
      log(`MISSING  ${slug}  (no blog_articles row)`)
      if (!DRY) await logRun({ agent: 'signoff-concierge', itemRef: slug, status: 'error', error: 'no blog_articles row' })
      continue
    }
    if (art.status !== 'draft') {
      log(`SKIP     ${slug}  (article status '${art.status}', not draft)`)
      continue
    }

    // (1) compile-gate before bothering Ewa — a body that won't render isn't reviewable.
    const gate = await compileGate({
      slug,
      body: art.body,
      baseUrl: BASE_URL,
      previewSecret: requireEnv('PREVIEW_SECRET'),
    })
    if (!gate.ok) {
      log(`BLOCKED  ${slug}  ${gate.errors.join('; ')}`)
      if (!DRY) {
        await admin()
          .from('content_pipeline')
          .update({ blocked_on: 'keith', notes: `compile-gate: ${gate.errors.join('; ')}` })
          .eq('id', row.id)
        await logRun({ agent: 'signoff-concierge', itemRef: slug, status: 'blocked', error: gate.errors.join('; ') })
      }
      continue
    }

    const fm = (art.frontmatter ?? {}) as Record<string, unknown> & { title?: string }
    const title = fm.title || slug
    const dueMs = dateToMs(row.target_date)
    const previewUrl = `${BASE_URL}/blog/preview/${slug}?token=${encodeURIComponent(requireEnv('PREVIEW_SECRET'))}`
    const rulings = rulingsFrom(fm)

    log(
      `SUBMIT   ${slug}  -> Ewa${row.target_date ? `  (slot ${row.target_date})` : ''}` +
        (rulings.length ? `  [${rulings.length} ruling(s) required]` : ''),
    )
    for (const r of rulings) log(`           [ ] ${r}`)
    if (DRY) continue

    // (2) create the review task — Ewa reviews the rendered draft via the preview link.
    const task = await createReviewTask({
      name: `Review: ${title}`,
      markdown: reviewMarkdown(slug, previewUrl, rulings),
      dueDateMs: dueMs,
    })

    // (2b) named rulings become real checklist items, which syncApprovals requires ticked.
    // Non-fatal: a checklist failure must not strand a submitted article, but it MUST be
    // loud, because a missing checklist silently reopens the silent-yes hole.
    if (rulings.length) {
      try {
        await addRulingsChecklist(task.id, rulings)
      } catch (e) {
        log(`WARNING  ${slug}  rulings checklist failed: ${(e as Error).message}`)
        await logRun({
          agent: 'signoff-concierge',
          itemRef: slug,
          status: 'error',
          error: `rulings checklist failed (task ${task.id}): ${(e as Error).message}`,
        })
      }
    }

    // (3) audit trail: a submitted review-log row pinned to this article + revision.
    await admin()
      .from('content_review_log')
      .insert({
        title,
        content_type: 'blog',
        channel: 'website',
        status: 'submitted',
        reviewer_name: REVIEWER_NAME,
        reviewer_gmc: REVIEWER_GMC,
        scope: 'full',
        article_id: art.id,
        revision_id: art.current_revision_id,
        clickup_task_id: task.id,
        content_url: `${BASE_URL}/blog/preview/${slug}`, // draft location (token added in the task, not stored)
        // The rulings go in the trail at submission time, so the record shows what was
        // asked even if the answer never arrives.
        notes: rulings.length
          ? `${rulings.length} ruling(s) requested at submission: ${rulings.join(' | ')}`
          : null,
      })

    // (4) park on Ewa's gate — syncApprovals (Phase 3a) takes it from here.
    await admin()
      .from('content_pipeline')
      .update({ stage: 'in_review', blocked_on: 'ewa', clickup_task_id: task.id, notes: null })
      .eq('id', row.id)

    await logRun({
      agent: 'signoff-concierge',
      itemRef: slug,
      status: 'ok',
      detail: { action: 'submitted', clickup_task_id: task.id, task_url: task.url },
    })
  }
}

async function main() {
  log(`signoff-concierge tick @ ${BASE_URL}`)
  if (/localhost|127\.0\.0\.1/.test(BASE_URL)) {
    log(
      'WARNING: base URL is localhost. The compile-gate renders each draft via this host, so with no dev server running it fails as "preview render request failed: fetch failed" and blocks the item on Keith. For a prod draft set CONTENT_ENGINE_BASE_URL=https://andro-prime.com.',
    )
  }
  await runSignoffConcierge()
  log('done.')
}

// Run standalone; also re-exported so the orchestrator can call it as the tick's first step.
export { runSignoffConcierge }

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('signoff-concierge.ts')) {
  main().catch(async (e) => {
    console.error('SIGNOFF-CONCIERGE ERROR:', (e as Error).message)
    if (!DRY) await logRun({ agent: 'signoff-concierge', status: 'error', error: (e as Error).message })
    process.exit(1)
  })
}
