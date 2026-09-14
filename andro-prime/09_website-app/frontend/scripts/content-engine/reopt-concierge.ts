/**
 * Reopt-Concierge — Phase 3b, the re-optimisation sign-off bridge. Sibling of the
 * Signoff-Concierge, but for a CHANGE to a live article rather than a new draft.
 *
 * A re-opt is staged as a proposed revision (blog_articles.proposed_revision_id) — the live
 * page is untouched. Per tick, for each content_pipeline row stage='reoptimising' with a
 * staged revision and no review task yet:
 *   1. compile-gate the PROPOSED revision (rendered via preview ?rev=, not the live row).
 *      Fail -> blocked_on='keith', skip.
 *   2. ROUTE ON THE REVISION'S SCOPE (see below).
 *   3. create the ClickUp review task, linking the proposed-revision preview.
 *   4. write content_review_log('submitted') pinned to the proposed revision.
 *   5. park on the reviewer, store the task id (stage stays 'reoptimising').
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO ROUTES SINCE 2026-09-14, BECAUSE A SEARCH SNIPPET IS NOT A CLINICAL
 * OBSERVATION. Keith's ruling, defect register M7.
 *
 *   scope='content'  the body or the editorial copy moved
 *                    -> "Content Review — Blog Articles", blocked_on='ewa',
 *                       content_review_log.scope='reopt'
 *
 *   scope='seo'      only `seoTitle` / `seoDescription` moved
 *                    -> "Approvals & Sign-offs", blocked_on='keith',
 *                       content_review_log.scope='seo-reopt', reviewer Keith
 *
 * Until this existed every staged revision went to the clinical list, so a change
 * to the `<title>` tag arrived at a GMC-registered reviewer under a checklist
 * about EFSA claims and TRT boundaries — none of which it could have touched.
 *
 * 🔴 THE SCOPE IS NOT TAKEN ON TRUST, AND NEITHER IS THE LABEL. Metadata-only is
 * enforced by `stage_blog_revision`, which refuses to record scope='seo' if the
 * body or any other frontmatter key moved. Whether the new text adds a
 * PROPOSITION is a separate question that no jsonb comparison can answer, and
 * `seo-revision-guard.ts` answers it against Ewa's tier ladder (2026-08-18, Q14):
 * a rewording is tier 1 and takes the metadata route; a net-new figure, a
 * net-new citation, a net-new prevalence claim or a dropped qualifier falls
 * through to the clinical route carrying its findings. The two rulings compose —
 * a 260-character description cut to 160 is Ewa's tier 2 almost word for word.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * On approval the orchestrator promotes proposed -> current + revalidates (syncReoptApprovals).
 * Idempotent: the filter excludes anything already submitted. --dry mode. Standalone + exported.
 */
import { loadEnvLocal, admin, requireEnv, logRun } from './_shared'
import {
  createReviewTask,
  addRulingsChecklist,
  RULINGS_CHECKLIST,
  APPROVALS_LIST_ID,
} from './clickup'
import { compileGate } from './compile-gate'
// One definition of the ruling-parsing rule, shared with the new-article track.
import { rulingsFrom } from './signoff-concierge'
import { guardSeoRevision, type SeoGuardVerdict } from './seo-revision-guard'

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

export function reviewMarkdown(
  slug: string,
  previewUrl: string,
  briefRef: string | null,
  rulings: string[] = [],
  /* Present only when this arrived labelled as an SEO revision and the guard sent
     it here anyway. Ewa needs to know she is seeing it BECAUSE something stopped
     being metadata, and which line did it — otherwise a metadata-shaped diff
     lands on her queue looking like an administrative mistake. */
  escalation: SeoGuardVerdict | null = null,
): string {
  return [
    `**Re-optimisation of a LIVE article:** \`${slug}\``,
    `**Reviewer:** ${REVIEWER_NAME} (GMC ${REVIEWER_GMC})`,
    '',
    ...(escalation
      ? [
          `⚠️ **This was staged as an SEO-only change and has been sent to you anyway.** Keith's ` +
            `ruling of 2026-09-14 routes a title tag and meta description away from clinical ` +
            `review as metadata. This one did not qualify: the guard found ` +
            `${escalation.findings.length} thing${escalation.findings.length > 1 ? 's' : ''} that ` +
            `read as more than a rewording. **The article body is unchanged** — only the two SEO ` +
            `fields moved, so the whole question is whether the shorter line still means what you ` +
            `signed.`,
          '',
          ...escalation.findings.map((f) => `- **${f.field}, tier ${f.tier}:** ${f.reason}`),
          '',
        ]
      : []),
    `**Review the proposed copy (rendered, not yet live):** ${previewUrl}`,
    briefRef ? `**Change rationale + diff:** \`${briefRef}\`` : '',
    '',
    ...(rulings.length
      ? [
          `⚠️ **This re-opt needs ${rulings.length} specific ruling${rulings.length > 1 ? 's' : ''} from you, not just an approval.** See the **${RULINGS_CHECKLIST}** checklist on this task. Tick each item to confirm it, or comment to redline it.`,
          '',
          'Completing the task with those items unticked will **not** promote the new copy: the pipeline parks it and comes back to you. That is deliberate. A completed task with an unanswered question is indistinguishable from one that never saw the question.',
          '',
        ]
      : []),
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

/**
 * The task body for a revision that is metadata and nothing else.
 *
 * KEITH'S RULING, 2026-09-14 (defect register M7). It is deliberately NOT the
 * clinical checklist: this revision cannot have touched a claim, a threshold, a
 * dose or a boundary, because `stage_blog_revision` refuses to record it under
 * scope='seo' if the body or any other frontmatter key moved by a byte. Sending
 * the EFSA/TRT/ashwagandha checklist with it would be asking a reviewer to
 * confirm things the database has already made impossible — which is how a
 * checklist stops being read.
 *
 * What it asks instead is the only question this change can get wrong: does the
 * shorter line still say what the article says.
 */
export function seoReviewMarkdown(
  slug: string,
  previewUrl: string,
  before: { title: string; description: string },
  after: { title: string; description: string },
  verdict: SeoGuardVerdict,
): string {
  const row = (label: string, was: string, now: string) =>
    was === now
      ? `**${label}** — unchanged (${now.length} characters)\n\n> ${now}\n`
      : `**${label}** — ${was.length} → ${now.length} characters\n\n` +
        `> was: ${was}\n>\n> now: ${now}\n`

  return [
    `**SEO-only revision of a LIVE article:** \`${slug}\``,
    '',
    `**Reviewed as metadata, not clinically.** Your ruling of 2026-09-14: this is an SEO ` +
      `description and tag, not a clinical observation. Dr Ewa Lindo has not been asked.`,
    '',
    `**What a search result will show:** ${previewUrl}`,
    '',
    '---',
    '',
    row('Title', before.title, after.title),
    '',
    row('Description', before.description, after.description),
    '',
    '---',
    '',
    `**The article text is untouched, and that is enforced rather than asserted.** ` +
      `\`stage_blog_revision\` refuses to record this revision at all if the body differs from ` +
      `the live body by one byte, or if any frontmatter key other than \`seoTitle\` and ` +
      `\`seoDescription\` has moved. Nothing on the page itself changes.`,
    '',
    `**Claim check:** ${verdict.summary}`,
    '',
    'Sign-off checks (metadata only):',
    '- [ ] The shorter line still says what the article says',
    '- [ ] The title reads as this article, not as a generic one',
    '- [ ] No em dashes, brand voice intact',
    '',
    'Mark this task **complete** to promote the new metadata; comment to request changes.',
  ].filter((l) => l !== null).join('\n')
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
      .select('id, proposed_revision_id, frontmatter, body')
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

    // Frontmatter comes from the PROPOSED revision, not the live row: a re-opt can change
    // the title, and `ewa_rulings` only exists on the proposal. Reading the live row here
    // meant the task was named after the old title and any ruling request was invisible.
    const { data: rev } = await admin()
      .from('blog_article_revisions')
      .select('body, frontmatter, scope')
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

    const liveFm = (art.frontmatter ?? {}) as Record<string, unknown> & { title?: string }
    const propFm = (rev.frontmatter ?? {}) as Record<string, unknown> & { title?: string }
    const title = propFm.title || liveFm.title || slug
    const rulings = rulingsFrom(propFm)
    const previewUrl = `${BASE_URL}/blog/preview/${slug}?token=${encodeURIComponent(requireEnv('PREVIEW_SECRET'))}&rev=${encodeURIComponent(revId)}`

    /* ─────────────────────────────────────────────────────────────────────────
     * (2) THE METADATA ROUTE. Keith, 2026-09-14, defect register M7: a revision
     * that changes only `seoTitle` / `seoDescription` is an SEO description and
     * tag, not a clinical observation, and is reviewed as such.
     *
     * Two things have to be true before this branch is taken, and they are
     * checked in different places on purpose. That the revision is metadata-only
     * is STRUCTURAL and was settled by `stage_blog_revision`, which would have
     * refused to write scope='seo' over a changed body — so it is not re-checked
     * here, where a second copy of the rule could drift from the first. That the
     * new text adds no proposition is MEANING, and `guardSeoRevision` settles it
     * against Ewa's tier ladder. A revision that fails the guard falls through to
     * the clinical route below carrying its findings, rather than being blocked:
     * the answer to "this stopped being metadata" is the clinician, not a halt.
     * ───────────────────────────────────────────────────────────────────────── */
    let seoVerdict: SeoGuardVerdict | null = null
    if (rev.scope === 'seo') {
      const approved = {
        title: String(liveFm.title ?? ''),
        excerpt: String((liveFm as { excerpt?: unknown }).excerpt ?? ''),
        body: art.body ?? '',
      }
      seoVerdict = guardSeoRevision({
        seoTitle: (propFm as { seoTitle?: string }).seoTitle,
        seoDescription: (propFm as { seoDescription?: string }).seoDescription,
        approved,
      })

      if (seoVerdict.route === 'seo') {
        const before = {
          title: String(liveFm.title ?? ''),
          description: String((liveFm as { excerpt?: unknown }).excerpt ?? ''),
        }
        const after = {
          title: (propFm as { seoTitle?: string }).seoTitle?.trim() || before.title,
          description:
            (propFm as { seoDescription?: string }).seoDescription?.trim() || before.description,
        }

        log(`SUBMIT   ${slug}  SEO-only -> Keith  (rev ${revId.slice(0, 8)})`)
        log(`           title ${before.title.length} -> ${after.title.length}, ` +
            `description ${before.description.length} -> ${after.description.length}`)
        if (DRY) continue

        const seoTask = await createReviewTask({
          name: `SEO metadata: ${title}`,
          markdown: seoReviewMarkdown(slug, previewUrl, before, after, seoVerdict),
          dueDateMs: dateToMs(row.target_date),
          listId: APPROVALS_LIST_ID,
        })

        await admin()
          .from('content_review_log')
          .insert({
            title,
            content_type: 'blog',
            channel: 'website',
            status: 'submitted',
            // The reviewer is Keith, and the log has to say so. Writing Ewa's name
            // and GMC against a review she was never asked for would put a
            // clinician's sign-off in the record for copy she never saw, which is
            // the one thing this whole route must not do.
            reviewer_name: 'Keith Lindo',
            reviewer_gmc: null,
            scope: 'seo-reopt',
            article_id: art.id,
            revision_id: revId,
            clickup_task_id: seoTask.id,
            content_url: `${BASE_URL}/blog/preview/${slug}`,
            notes: seoVerdict.summary,
          })

        await admin()
          .from('content_pipeline')
          .update({ blocked_on: 'keith', clickup_task_id: seoTask.id, notes: null })
          .eq('id', row.id)

        await logRun({
          agent: 'reopt-concierge',
          itemRef: slug,
          status: 'ok',
          detail: {
            action: 'submitted',
            route: 'seo',
            clickup_task_id: seoTask.id,
            revision_id: revId,
          },
        })
        continue
      }

      // Fell through: this is labelled SEO but no longer reads as metadata.
      log(`ESCALATE ${slug}  SEO revision -> Ewa  (${seoVerdict.findings.length} finding(s))`)
      for (const f of seoVerdict.findings) log(`           tier ${f.tier}  ${f.field}: ${f.reason}`)
    }

    log(
      `SUBMIT   ${slug}  re-opt -> Ewa  (rev ${revId.slice(0, 8)})` +
        (rulings.length ? `  [${rulings.length} ruling(s) required]` : ''),
    )
    for (const r of rulings) log(`           [ ] ${r}`)
    if (DRY) continue

    const task = await createReviewTask({
      name: `Re-opt: ${title}`,
      markdown: reviewMarkdown(slug, previewUrl, row.brief_ref, rulings, seoVerdict),
      dueDateMs: dateToMs(row.target_date),
    })

    // Named rulings become real checklist items; syncReoptApprovals requires them ticked
    // before the proposed revision is promoted over live copy. Non-fatal but loud.
    if (rulings.length) {
      try {
        await addRulingsChecklist(task.id, rulings)
      } catch (e) {
        log(`WARNING  ${slug}  rulings checklist failed: ${(e as Error).message}`)
        await logRun({
          agent: 'reopt-concierge',
          itemRef: slug,
          status: 'error',
          error: `rulings checklist failed (task ${task.id}): ${(e as Error).message}`,
        })
      }
    }

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
        notes: rulings.length
          ? `${rulings.length} ruling(s) requested at submission: ${rulings.join(' | ')}`
          : null,
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
