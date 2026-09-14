#!/usr/bin/env tsx
/**
 * Every article's search result, measured against the live corpus.
 *
 *   npm run verify:article-seo
 *   npm run verify:article-seo -- --report      # the whole table, pass or fail
 *
 * WHY THIS EXISTS. Defect register M7, and it exists because the check that
 * raised M7 could not have found what M7 actually is.
 *
 * `scripts/audit-rendered-markup.js` sweeps every ROUTE in a browser, and
 * `/blog/[slug]` is ONE route. It renders one sampled article, so it can speak
 * for the template and never for the corpus. It reported an 89-character title
 * and a 192-character description and those numbers were correct — and they were
 * the 5th and the 7th worst of nineteen. Measured here on 2026-09-14:
 *
 *   17 of 19 articles are over on at least one field.
 *   Worst description 260 characters. Worst rendered title 94.
 *
 * 🔴 THE GENERAL SHAPE IS WORTH MORE THAN THE NUMBER. A route sweep's unit is a
 * URL, and a dynamic route collapses a whole corpus into one of them. Anything
 * that varies per ROW rather than per ROUTE is invisible to it, and invisible in
 * the flattering direction: the sample passes or fails on its own merits and the
 * report reads as coverage either way. The unit here is the ARTICLE.
 *
 * ⚠ IT IS A COMMAND, NOT A TEST, AND THAT IS THE P3 PRECEDENT. It needs the
 * Supabase service key and a network call, so putting it in `npm test` would
 * make the suite require both — and a test that needs secrets is a test that
 * gets skipped, and a skipped test reports green. The PURE half is unit-tested
 * in `npm test` by `scripts/test-article-seo.ts`; this half is the live read.
 *
 * ⚠ IT RESOLVES NOTHING ITSELF. `resolveArticleSeo` in `lib/blog.ts` is the same
 * function `generateMetadata` calls, so this measures the page rather than a
 * second model of the page. A check carrying its own copy of the rule under test
 * is how a green run comes to mean nothing.
 *
 * Exit 1 on any failure. Exit 1 is never a pass, including when the cause is a
 * missing key rather than a long title.
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import {
  resolveArticleSeo,
  SEO_TITLE_MAX,
  SEO_DESCRIPTION_MAX,
  type ArticleFrontmatter,
} from '../lib/blog'
// Read from the layout that appends it, so changing the template cannot silently
// change what this measures. Shared with `check-seo-drafts.ts`.
import { brandSuffix } from './brand-suffix'

/* `next` loads `.env.local`; a plain tsx script does not, and the first run of
   this check died on a key that was sitting in the file two directories up.
   That is P9's defect exactly — a gate reading the process environment while the
   thing it measures reads the file. dotenv does NOT override a variable already
   present in the environment, which is also Next's precedence, so an explicit
   `SUPABASE_SERVICE_ROLE_KEY=... npm run verify:article-seo` still wins. */
config({ path: path.resolve(__dirname, '..', '.env.local') })

const ROOT = path.resolve(__dirname, '..')
const argv = process.argv.slice(2)
const REPORT = argv.includes('--report')

/*
 * 🔴 NOTHING HERE CALLS `process.exit()`, AND THAT IS NOT A STYLE PREFERENCE.
 *
 * The first version did, and on the FAILING path it aborted:
 *
 *   Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), src\win\async.c:76
 *
 * `process.exit()` tears the loop down while the Supabase client's fetch socket
 * is mid-close, Node aborts instead of exiting, and the shell sees **127**. The
 * check reported the right findings under a status that meant "command not
 * found". It only ever happened on the failing path, so a check that had only
 * been watched to PASS would have looked perfect.
 *
 * `process.exitCode` plus a natural return lets the loop drain and produces a
 * real 1. Same lesson as R1's aside, one layer down: output that looks right and
 * a status that disagrees with it.
 */
class Fatal extends Error {}
function die(m: string): never {
  throw new Fatal(m)
}

/*
 * THE BASELINE, and it is a ratchet in the same shape as
 * `verify-retired-vocabulary.js`: every entry is an article that was over a
 * bound on the day it was listed, with the length it had. A number may be
 * LOWERED and never raised, and an article that has gone clean is a FAILURE,
 * because a stale exemption is how the next real one hides.
 *
 * 🔴 THIS LIST IS THE DELIVERABLE, NOT AN APOLOGY. It is a commission: 17
 * articles, 15 seoTitles and 14 seoDescriptions — 29 fields, NOT 34. The run
 * prints both numbers at the end, and prose should quote those lines rather than
 * multiply 17 by 2, which is where "34 sentences" came from and why it appeared
 * in four documents on the day this list was written. Five of the seventeen are
 * over on one field only.
 *
 * ⚠ THEY NO LONGER TAKE THE CLINICAL ROUTE, AND THAT IS KEITH'S RULING OF
 * 2026-09-14: "review a revision of this type as it is an SEO description and
 * tag, not a clinical observation." An SEO field is staged as a scope='seo'
 * revision, which `stage_blog_revision` will only record if the article body and
 * every other frontmatter key are byte-identical, and which `reopt-concierge`
 * routes to Keith's approvals list rather than to Dr Ewa Lindo.
 *
 * The one qualification is mechanical, not a matter of anyone's judgement:
 * `scripts/content-engine/seo-revision-guard.ts` reads each proposed field
 * against the article's own approved copy, and a field that arrives carrying a
 * net-new figure, a net-new citation, a net-new prevalence claim or a dropped
 * qualifier falls through to the clinical route after all. That is Ewa's own tier
 * ladder (2026-08-18, Q14) applied to a 160-character surface, and a 260-to-160
 * cut is her tier 2 almost word for word. Drafting and Guardrail #1 pre-flight
 * are unchanged.
 *
 * Every number below was read from the live database on 2026-09-14, not
 * estimated. `title` is the RENDERED length including the " | Andro Prime" the
 * root layout appends.
 */
const SINCE = '2026-09-14'
type Baseline = { slug: string; title?: number; description?: number }
const BASELINE: Baseline[] = [
  /* 🟢 FIFTEEN ARTICLES AND 26 FIELDS CAME OFF THIS LIST ON 2026-09-14, WHICH IS
     THE RATCHET DOING THE ONLY THING IT WAS BUILT TO DO. Keith approved the
     commission and `apply-seo-drafts.ts` wrote the fields onto the live rows; the
     next run failed, correctly, on the stale-exemption rule — "baselined at 83
     and it now renders at 57, remove `title` from its baseline entry" — for every
     article that had gone clean. This is that removal.

     The two that remain are blocked on something other than copy, and neither is
     a length problem:
       · `cortisol-belly` is status='draft', sitting with the clinical reviewer
         with three unticked rulings. A snippet compresses approved copy and a
         draft has none.
       · `14-signs-of-vitamin-d-deficiency` is published with no per-article
         ClickUp task and no approved `content_review_log` row. It IS signed off,
         by the blanket email of 2026-05-27 recorded in commit `6d2da5b` and
         transcribed in `03_compliance/STATE.md`, which already calls it the
         weakest sign-off trail in the blog set with remediation owed since
         2026-07-31. The block is about retrievability, not about the words.

     Both numbers below stay at their 2026-09-14 readings. The ratchet only turns
     down, so neither may be raised, and either going clean without its entry
     being removed is a failure. */
  { slug: 'cortisol-belly', title: 89, description: 221 },
  { slug: '14-signs-of-vitamin-d-deficiency', description: 166 },
]


async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    die(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are both required.\n' +
        '  This reads every article including drafts, which the anon key cannot see —\n' +
        '  and a run that silently measured published-only would report a smaller\n' +
        '  corpus than there is, which is the one answer worse than an error.',
    )
  }

  const sb = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await sb
    .from('blog_articles')
    .select('id,slug,status,frontmatter')
    .neq('status', 'archived')
  if (error) die(`blog_articles read failed: ${error.message}`)
  if (!data || data.length === 0) die('read 0 articles. Fix this reader rather than trusting a pass.')

  /* Which articles have a recorded clinical sign-off. Read here rather than
     inferred from `status`, because the two disagree in the live corpus. */
  const { data: reviewRows, error: rErr } = await sb
    .from('content_review_log')
    .select('article_id')
    .eq('status', 'approved')
  if (rErr) die(`content_review_log read failed: ${rErr.message}`)
  const approvedArticleIds = new Set((reviewRows ?? []).map((r) => r.article_id as string))
  const approvedSlugs = new Set(
    data.filter((r) => approvedArticleIds.has(r.id as string)).map((r) => r.slug as string),
  )

  const SUFFIX = brandSuffix()
  const rows = data
    .map((r) => {
      const fm = (r.frontmatter ?? {}) as ArticleFrontmatter
      const seo = resolveArticleSeo(fm)
      return {
        slug: r.slug as string,
        status: r.status as string,
        titleLen: (seo.title + SUFFIX).length,
        descLen: seo.description.length,
        titleFrom: seo.titleFrom,
        descriptionFrom: seo.descriptionFrom,
      }
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))

  const failures: string[] = []
  const fail = (slug: string, msg: string) => failures.push(`  ${slug}\n    ${msg}`)
  const seen = new Set<string>()

  for (const r of rows) {
    const base = BASELINE.find((b) => b.slug === r.slug)
    if (base) seen.add(r.slug)

    if (r.titleLen > SEO_TITLE_MAX) {
      const cap = base?.title
      if (cap === undefined) {
        fail(r.slug, `title renders at ${r.titleLen} characters, over ${SEO_TITLE_MAX}, from \`${r.titleFrom}\`. Set \`seoTitle\` in its frontmatter.`)
      } else if (r.titleLen > cap) {
        fail(r.slug, `title is ${r.titleLen} characters and the baseline pinned it at ${cap} on ${SINCE}. The ratchet only turns down.`)
      }
    } else if (base?.title !== undefined) {
      fail(r.slug, `baselined at a ${base.title}-character title since ${SINCE}, and it now renders at ${r.titleLen}, inside the bound. Remove \`title\` from its baseline entry.`)
    }

    if (r.descLen > SEO_DESCRIPTION_MAX) {
      const cap = base?.description
      if (cap === undefined) {
        fail(r.slug, `description is ${r.descLen} characters, over ${SEO_DESCRIPTION_MAX}, from \`${r.descriptionFrom}\`. Set \`seoDescription\` in its frontmatter.`)
      } else if (r.descLen > cap) {
        fail(r.slug, `description is ${r.descLen} characters and the baseline pinned it at ${cap} on ${SINCE}. The ratchet only turns down.`)
      }
    } else if (base?.description !== undefined) {
      fail(r.slug, `baselined at a ${base.description}-character description since ${SINCE}, and it is now ${r.descLen}, inside the bound. Remove \`description\` from its baseline entry.`)
    }
  }

  for (const b of BASELINE) {
    if (!seen.has(b.slug)) {
      fail(b.slug, `on the baseline since ${SINCE}, and the corpus read did not reach it (renamed, archived, or deleted). Remove the entry.`)
    }
  }

  if (REPORT) {
    const w = Math.max(...rows.map((r) => r.slug.length))
    console.log(`${'ARTICLE'.padEnd(w)}  STATUS     TITLE  DESC  SOURCE`)
    for (const r of rows) {
      const over =
        (r.titleLen > SEO_TITLE_MAX ? ' title' : '') + (r.descLen > SEO_DESCRIPTION_MAX ? ' desc' : '')
      console.log(
        `${r.slug.padEnd(w)}  ${r.status.padEnd(9)}  ${String(r.titleLen).padStart(5)}  ` +
          `${String(r.descLen).padStart(4)}  ${r.titleFrom}/${r.descriptionFrom}${over ? '  <-' + over : ''}`,
      )
    }
    console.log('')
  }

  const explicit = rows.filter((r) => r.titleFrom === 'seoTitle' || r.descriptionFrom === 'seoDescription')

  /* TWO NUMBERS, BOTH PRINTED, BECAUSE THE SECOND ONE GOT MULTIPLIED BY HAND AND
     CAME OUT WRONG. `BASELINE.length` counts ARTICLES; the commission is counted
     in FIELDS, and the two are not related by a factor of two because five of the
     seventeen are over on only one field. Three documents and this file's own
     header said "34 sentences" (17 x 2) on the day the list was written, when the
     list said 29. A count nobody can derive by hand is a count nobody can get
     wrong, so both are printed and prose quotes these lines rather than
     recomputing them. */
  const owed = BASELINE.length
  const titlesOwed = BASELINE.filter((b) => b.title !== undefined).length
  const descriptionsOwed = BASELINE.filter((b) => b.description !== undefined).length
  const fieldsOwed = titlesOwed + descriptionsOwed

  /* ⚠ AND THE COMMISSIONABLE COUNT IS SMALLER STILL, BECAUSE THIS CHECK MEASURES
     DRAFTS TOO. The read is `.neq('status', 'archived')`, which is right for
     MEASUREMENT — an unpublished article's head is worth knowing about before it
     ships — and wrong for the COMMISSION. An SEO snippet is routed to Keith
     rather than to clinical review because it compresses already-approved copy,
     so a draft cannot have one written for it yet.
     Batch 1 was drafted straight off this list and included `cortisol-belly`,
     which is a draft sitting with the clinical reviewer; nothing here said so,
     and an independent compliance review caught it. Now it says so. */
  const fieldsOf = (b: Baseline) =>
    (b.title !== undefined ? 1 : 0) + (b.description !== undefined ? 1 : 0)

  const draftSlugs = new Set(rows.filter((r) => r.status !== 'published').map((r) => r.slug))
  const draftBaseline = BASELINE.filter((b) => draftSlugs.has(b.slug))
  const draftFields = draftBaseline.reduce((n, b) => n + fieldsOf(b), 0)

  /* ⚠ AND PUBLISHED IS NOT APPROVED, WHICH IS A SECOND SUBTRACTION.
     `status` says the row is served; `content_review_log` is where a clinical
     sign-off actually lands. They came apart in the live corpus:
     `14-signs-of-vitamin-d-deficiency` is published and has no approved row and no
     ClickUp review task. It was found one batch after the draft gap, and it is the
     same defect in a different column — so the number reports both rather than
     waiting to be surprised a third time. */
  const unapprovedSlugs = new Set(
    rows.filter((r) => r.status === 'published' && !approvedSlugs.has(r.slug)).map((r) => r.slug),
  )
  const unapprovedBaseline = BASELINE.filter((b) => unapprovedSlugs.has(b.slug))
  const unapprovedFields = unapprovedBaseline.reduce((n, b) => n + fieldsOf(b), 0)

  if (failures.length) {
    console.error(`verify-article-seo: ${failures.length} failure${failures.length === 1 ? '' : 's'} over ${rows.length} articles.\n`)
    for (const f of failures) console.error(`${f}\n`)
    process.exitCode = 1
    return
  }

  console.log(
    `verify-article-seo: ${rows.length} articles measured, ` +
      `titles <= ${SEO_TITLE_MAX} and descriptions <= ${SEO_DESCRIPTION_MAX} or within their baseline.`,
  )
  console.log(`  ${explicit.length} article${explicit.length === 1 ? '' : 's'} set an explicit seoTitle or seoDescription.`)
  console.log(`  ${owed} still on the baseline, dated ${SINCE}. That number is the copy still owed, and it may only fall.`)
  console.log(
    `  ${fieldsOwed} fields owed across those ${owed} articles ` +
      `(${titlesOwed} seoTitle, ${descriptionsOwed} seoDescription). Quote THIS line, not a product of the other.`,
  )
  if (draftBaseline.length) {
    console.log(
      `  - ${draftFields} field(s) on ${draftBaseline.length} UNPUBLISHED article(s) ` +
        `(${draftBaseline.map((b) => b.slug).join(', ')}): a snippet compresses approved copy, ` +
        `and a draft has none.`,
    )
  }
  if (unapprovedBaseline.length) {
    console.log(
      `  - ${unapprovedFields} field(s) on ${unapprovedBaseline.length} PUBLISHED article(s) with ` +
        `no approved content_review_log row ` +
        `(${unapprovedBaseline.map((b) => b.slug).join(', ')}): published is not approved, and ` +
        `the whole routing rule rests on approved.`,
    )
  }
  if (draftBaseline.length || unapprovedBaseline.length) {
    console.log(
      `  => Commissionable now: ${fieldsOwed - draftFields - unapprovedFields} fields across ` +
        `${owed - draftBaseline.length - unapprovedBaseline.length} articles.`,
    )
  }
}

main().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e)
  console.error(`ERROR: ${msg}`)
  process.exitCode = 1
})
