/**
 * Reopt-Concierge — Phase 3b, the re-optimisation sign-off bridge. Sibling of the
 * Signoff-Concierge, but for a CHANGE to a live article rather than a new draft.
 *
 * A re-opt is staged as a proposed revision (blog_articles.proposed_revision_id) — the live
 * page is untouched. Per tick, for each content_pipeline row stage='reoptimising' with a
 * staged revision and no review task yet:
 *   1. compile-gate the PROPOSED revision (rendered via preview ?rev=, not the live row).
 *      Fail -> blocked_on='keith', skip.
 *   2. create a ClickUp review task on "Content Review — Ewa" linking the proposed-revision
 *      preview (the diff is in the proposal file; Ewa signs off the new copy as rendered).
 *   3. write content_review_log('submitted', scope='reopt') pinned to the proposed revision.
 *   4. park on Ewa: blocked_on='ewa', store the task id (stage stays 'reoptimising').
 *
 * On approval the orchestrator promotes proposed -> current + revalidates (syncReoptApprovals).
 * Idempotent: the filter excludes anything already submitted. --dry mode. Standalone + exported.
 */
import { loadEnvLocal, admin, requireEnv, logRun } from './_shared'
import { createReviewTask } from './clickup'
import { compileGate } from './compile-gate'

loadEnvLocal()
const DRY = process.argv.includes('--dry')
const BASE_URL = (
  process.env.CONTENT_ENGINE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://andro-prime.com'
).replace(/\/$/, '')

const REVIEWER_NAME = 'Dr Ewa Lindo'
const REVIEWER_GMC = '4758565'

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

function dateToMs(d: string | null): number | null {
  if (!d) return null
  const ms = Date.parse(`${d}T00:00:00Z`)
  return Number.isFinite(ms) ? ms : null
}

function reviewMarkdown(slug: string, previewUrl: string, briefRef: string | null): string {
  return [
    `**Re-optimisation of a LIVE article:** \`${slug}\``,
    `**Reviewer:** ${REVIEWER_NAME} (GMC ${REVIEWER_GMC})`,
    '',
    `**Review the proposed copy (rendered, not yet live):** ${previewUrl}`,
    briefRef ? `**Change rationale + diff:** \`${briefRef}\`` : '',
    '',
    'The live page is unchanged until you approve. Mark this task **complete** to publish the new copy; comment to request changes (it stays parked until complete).',
    '',
    'Sign-off checks (changed/new copy only):',
    '- [ ] New/changed claims are EFSA-approved or non-claim wellness language',
    '- [ ] No Phase-0 / clinical (TRT, prescribing) boundary crossings',
    '- [ ] No Ashwagandha mention anywhere',
    '- [ ] Any new thresholds / numbers are clinically sound + sourced',
    '- [ ] No em dashes, brand voice intact',
  ].filter(Boolean).join('\n')
}

async function runReoptConcierge() {
  const { data, error } = await admin()
    .from('content_pipeline')
    .select('id, slug, target_date, brief_ref, blocked_on')
    .eq('stage', 'reoptimising')
    .is('clickup_task_id', null)
  if (error) throw new Error(`read reoptimising: ${error.message}`)

  for (const row of data ?? []) {
    const slug = row.slug
    if (!slug) {
      log(`SKIP     (pipeline ${row.id} has no slug)`)
      continue
    }
    // Held for Keith to review the applied copy before it goes to Ewa (stage-reopt parks
    // it on 'keith'; `stage-reopt --release` clears it).
    if (row.blocked_on === 'keith') {
      log(`held     ${slug}  (awaiting Keith release before Ewa)`)
      continue
    }

    const { data: art } = await admin()
      .from('blog_articles')
      .select('id, proposed_revision_id, frontmatter')
      .eq('slug', slug)
      .maybeSingle()
    if (!art) {
      log(`MISSING  ${slug}  (no blog_articles row)`)
      if (!DRY) await logRun({ agent: 'reopt-concierge', itemRef: slug, status: 'error', error: 'no blog_articles row' })
      continue
    }
    if (!art.proposed_revision_id) {
      log(`waiting  ${slug}  (no proposed revision staged)`)
      continue
    }
    const revId = art.proposed_revision_id

    const { data: rev } = await admin()
      .from('blog_article_revisions')
      .select('body')
      .eq('id', revId)
      .maybeSingle()
    if (!rev) {
      log(`MISSING  ${slug}  (proposed revision ${revId} not found)`)
      if (!DRY) await logRun({ agent: 'reopt-concierge', itemRef: slug, status: 'error', error: 'proposed revision missing' })
      continue
    }

    // (1) gate the PROPOSED revision via the preview ?rev= path.
    const gate = await compileGate({
      slug,
      body: rev.body,
      baseUrl: BASE_URL,
      previewSecret: requireEnv('PREVIEW_SECRET'),
      rev: revId,
    })
    if (!gate.ok) {
      log(`BLOCKED  ${slug}  ${gate.errors.join('; ')}`)
      if (!DRY) {
        await admin().from('content_pipeline').update({ blocked_on: 'keith', notes: `compile-gate: ${gate.errors.join('; ')}` }).eq('id', row.id)
        await logRun({ agent: 'reopt-concierge', itemRef: slug, status: 'blocked', error: gate.errors.join('; ') })
      }
      continue
    }

    const fm = (art.frontmatter ?? {}) as { title?: string }
    const title = fm.title || slug
    const previewUrl = `${BASE_URL}/blog/preview/${slug}?token=${encodeURIComponent(requireEnv('PREVIEW_SECRET'))}&rev=${encodeURIComponent(revId)}`

    log(`SUBMIT   ${slug}  re-opt -> Ewa  (rev ${revId.slice(0, 8)})`)
    if (DRY) continue

    const task = await createReviewTask({
      name: `Re-opt: ${title}`,
      markdown: reviewMarkdown(slug, previewUrl, row.brief_ref),
      dueDateMs: dateToMs(row.target_date),
    })

    await admin()
      .from('content_review_log')
      .insert({
        title,
        content_type: 'blog',
        channel: 'website',
        status: 'submitted',
        reviewer_name: REVIEWER_NAME,
        reviewer_gmc: REVIEWER_GMC,
        scope: 'reopt',
        article_id: art.id,
        revision_id: revId,
        clickup_task_id: task.id,
        content_url: `${BASE_URL}/blog/preview/${slug}`,
      })

    await admin()
      .from('content_pipeline')
      .update({ blocked_on: 'ewa', clickup_task_id: task.id, notes: null })
      .eq('id', row.id)

    await logRun({
      agent: 'reopt-concierge',
      itemRef: slug,
      status: 'ok',
      detail: { action: 'submitted', clickup_task_id: task.id, revision_id: revId },
    })
  }
}

async function main() {
  log(`reopt-concierge tick @ ${BASE_URL}`)
  await runReoptConcierge()
  log('done.')
}

export { runReoptConcierge }

if (process.argv[1]?.endsWith('reopt-concierge.ts')) {
  main().catch(async (e) => {
    console.error('REOPT-CONCIERGE ERROR:', (e as Error).message)
    if (!DRY) await logRun({ agent: 'reopt-concierge', status: 'error', error: (e as Error).message })
    process.exit(1)
  })
}
