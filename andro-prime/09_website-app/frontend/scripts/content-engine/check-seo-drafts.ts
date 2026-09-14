#!/usr/bin/env tsx
/**
 * check-seo-drafts — the pre-flight for M7's copy commission, before a word of it
 * reaches a person.
 *
 *   npx tsx scripts/content-engine/check-seo-drafts.ts scripts/content-engine/seo-drafts/batch-1.json
 *
 * 29 fields are owed across 17 articles (`npm run verify:article-seo` prints the
 * count). Each one has to clear three hurdles, and two of them are arithmetic
 * that a human does badly and a machine does exactly:
 *
 *   1. LENGTH. A `seoTitle` is measured RENDERED, with the " | Andro Prime" the
 *      root layout appends — so the bare string an author types has a smaller
 *      budget than the bound suggests, and that subtraction is the single easiest
 *      thing to forget. Printed here as the bare budget, not the rendered one.
 *   2. THE CLAIM GUARD. `seo-revision-guard.ts`, the same function
 *      `reopt-concierge` routes on, so a draft that would be bounced to clinical
 *      review is known BEFORE it is submitted rather than after.
 *   3. HOUSE STYLE. No em dash, which is banned in customer-facing copy.
 *
 * ⚠ IT IS NOT A COMPLIANCE PRE-FLIGHT AND DOES NOT REPLACE ONE. Guardrail #1
 * still applies to every one of these strings: this checks what is mechanical,
 * and says nothing about whether a sentence is a good one or a permitted claim.
 * A green run here means "worth a human's time", never "approved".
 *
 * ⚠ IT WRITES NOTHING. No revision is staged, no task is created, no article is
 * touched. It reads the live corpus and prints. Staging is a separate, deliberate
 * act, and Keith's sign-off sits between the two.
 *
 * Exit 1 on any failure, including a missing key. Exit 1 is never a pass.
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
} from '../../lib/blog'
import { brandSuffix } from '../brand-suffix'
import { guardSeoRevision } from './seo-revision-guard'

/* `next` loads `.env.local`; a plain tsx script does not. Same note as
   `verify-article-seo.ts`, same reason. */
config({ path: path.resolve(__dirname, '..', '..', '.env.local') })

interface Draft {
  slug: string
  seoTitle?: string
  seoDescription?: string
  /** Free text for the reviewer: what this trims and why. Never rendered. */
  note?: string
}

const argv = process.argv.slice(2)
const file = argv.find((a) => !a.startsWith('--'))
const emitIdx = argv.indexOf('--emit-sources')
const emitDir = emitIdx >= 0 ? argv[emitIdx + 1] : null
if (!file || (emitIdx >= 0 && !emitDir)) {
  console.error('usage: check-seo-drafts.ts <drafts.json> [--emit-sources <dir>]')
  process.exit(1)
}
/* Narrowed at module level: control-flow narrowing does not cross into `main`. */
const draftsFile: string = file

function fail(slug: string, msg: string, failures: string[]): void {
  failures.push(`${slug}: ${msg}`)
}

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required. ' +
        'A missing key is a failure, not a skip.',
    )
  }

  const raw: unknown = JSON.parse(fs.readFileSync(path.resolve(draftsFile), 'utf8'))
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`${draftsFile} holds no drafts. Fix the file rather than reading a pass into it.`)
  }

  /* 🔴 VALIDATE THE SHAPE UP FRONT, AND DO NOT LET ONE BAD ENTRY END THE RUN.
   *
   * `"seoDescription": null` — the natural way to write "this article needs no
   * description" — reached `.trim()` and threw. The throw escaped the per-draft
   * loop, so the run died after the FIRST article and the other three were never
   * examined. It exited 1, which reads as "found problems with the batch" rather
   * than "checked one of four and crashed", and the difference matters: a batch
   * is handed to a person on the strength of this output.
   *
   * A null is not an error worth stopping for either — it means the same thing as
   * an absent key, which the baseline uses for every title-only article. So: null
   * is normalised to absent, a non-string is a reported failure rather than an
   * exception, and every draft gets looked at whatever its neighbours contain. */
  const drafts: Draft[] = []
  const shapeErrors: string[] = []
  /* Keyed by slug as well as listed, because a failure that is not attributable to
     a draft cannot be counted into that draft's label — and an unlabelled failure
     is how a PASS ends up printed beside a broken entry. That has now happened
     three times in this file, each time in a new place, so the count is carried
     per slug rather than recomputed from list length at the point of printing. */
  const shapeErrorsBySlug = new Map<string, number>()
  const bump = (slug: string) =>
    shapeErrorsBySlug.set(slug, (shapeErrorsBySlug.get(slug) ?? 0) + 1)

  raw.forEach((entry, i) => {
    const e = entry as Record<string, unknown>
    if (typeof e?.slug !== 'string' || !e.slug) {
      shapeErrors.push(`entry ${i} has no slug. A batch entry without one cannot be checked.`)
      return
    }
    const clean: Draft = { slug: e.slug }
    for (const field of ['seoTitle', 'seoDescription'] as const) {
      const v = e[field]
      if (v === undefined || v === null) continue // absent and null mean the same here
      if (typeof v !== 'string') {
        shapeErrors.push(`${e.slug}: ${field} is ${typeof v}, not a string or null.`)
        bump(e.slug)
        continue
      }
      clean[field] = v
    }

    /* 🔴 AN ENTRY WHERE NOTHING COULD BE CHECKED MUST NOT REPORT AS CHECKED, AND
     * THIS IS THE FOURTH TIME THAT FAMILY HAS APPEARED IN THIS FILE.
     *
     * Demonstrated by an independent review, on real copy: a 56-character
     * description under the key `seoDescripton` was never measured, never
     * guarded, never scanned, and printed as PASS under a summary line asserting
     * three checks — exit 0. So did an entry proposing no field at all.
     *
     * The previous three instances were all about the LABEL being computed from
     * the wrong thing. This one is different in kind and worse: the label was
     * correct, because genuinely zero failures were recorded. The defect is that
     * zero checks had run. A gate that reports success for work it never did is
     * the one failure mode that cannot be caught by looking at its output.
     *
     * Two conditions, both about the INPUT rather than the verdict:
     *   · an unknown key is a typo, not an extension — the schema is closed;
     *   · a draft must propose at least one field, or there is nothing to check
     *     and "checked" is a false statement about it. */
    const known = new Set(['slug', 'seoTitle', 'seoDescription', 'note'])
    for (const key of Object.keys(e)) {
      if (!known.has(key)) {
        shapeErrors.push(
          `${e.slug}: unknown key "${key}". The schema is closed, so this is a typo rather than ` +
            `an extension — and a value under a key nothing reads is never checked, never ` +
            `measured, and reports as a clean draft.`,
        )
        bump(e.slug)
      }
    }
    if (clean.seoTitle === undefined && clean.seoDescription === undefined) {
      shapeErrors.push(
        `${e.slug}: proposes neither seoTitle nor seoDescription, so nothing about it can be ` +
          `checked. An entry with nothing in it must not report as a cleared draft.`,
      )
      bump(e.slug)
    }

    if (typeof e.note === 'string') clean.note = e.note
    drafts.push(clean)
  })
  const skipped = raw.length - drafts.length

  const db = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await db
    .from('blog_articles')
    .select('id, slug, body, frontmatter, status')
    .in('slug', drafts.map((d) => d.slug))
  if (error) throw new Error(`blog_articles read failed: ${error.message}`)

  const bySlug = new Map((data ?? []).map((r) => [r.slug as string, r]))

  /* The SECOND half of the premise, and it is a different question from `status`.
     `published` says the row is served; it does not say a clinician ever signed
     it. `content_review_log` is where the sign-off actually lands, written by the
     concierge and the sign-off sync, so it answers the question without needing a
     ClickUp token — which matters, because a check that needs a second credential
     is a check that gets skipped, and a skipped check reports green. */
  const ids = (data ?? []).map((r) => r.id as string)
  const { data: reviews, error: rErr } = await db
    .from('content_review_log')
    .select('article_id, status, reviewed_at')
    .in('article_id', ids)
    .eq('status', 'approved')
  if (rErr) throw new Error(`content_review_log read failed: ${rErr.message}`)
  const approvedIds = new Set((reviews ?? []).map((r) => r.article_id as string))
  const SUFFIX = brandSuffix()
  const titleBudget = SEO_TITLE_MAX - SUFFIX.length
  const failures: string[] = [...shapeErrors]

  console.log(
    `\nBare seoTitle budget: ${titleBudget} characters ` +
      `(${SEO_TITLE_MAX} rendered, minus "${SUFFIX}"). Description: ${SEO_DESCRIPTION_MAX}.\n`,
  )

  for (const d of drafts) {
    const row = bySlug.get(d.slug)
    if (!row) {
      fail(d.slug, 'no article with this slug. A typo here reads as a clean run.', failures)
      continue
    }
    const failuresBefore = failures.length

    /* 🔴 THE SOURCE MUST BE PUBLISHED, AND THIS IS THE CHECK THAT WAS MISSING.
     *
     * Batch 1 was drafted straight off the ratchet baseline, which measures every
     * non-archived article — so it includes DRAFTS. One of the six, `cortisol-belly`,
     * was an unapproved draft sitting with the clinical reviewer with three
     * unticked rulings against it. Nothing mechanical caught that; an
     * independent compliance review did, by fetching the URL and getting a 404.
     *
     * It matters because of exactly what Keith's ruling says. A snippet routes to
     * him rather than to a clinician BECAUSE it is a compression of copy that has
     * already been through clinical review. Against a draft that premise is false,
     * and worse, if the reviewer then changes the title or excerpt when she rules,
     * the snippet becomes a compression of superseded copy that was signed off on
     * a "carried over, previously cleared" basis which was never true.
     *
     * So the premise is now tested rather than assumed. `status` is the column the
     * live page gates on, so this asks the same question the site asks. */
    if (row.status !== 'published') {
      fail(
        d.slug,
        `article status is '${row.status}', not 'published'. An SEO snippet is routed to Keith ` +
          `rather than to clinical review because it compresses ALREADY-APPROVED copy; against a ` +
          `draft that premise is false, and a later clinical change to the title or excerpt would ` +
          `leave this snippet compressing superseded copy. Draft the field after the article ships.`,
        failures,
      )
    }

    /* 🔴 AND PUBLISHED IS NOT THE SAME QUESTION AS APPROVED.
     *
     * `status='published'` says the row is served. It says nothing about whether a
     * clinician ever signed it, and those two came apart in the live corpus:
     * `14-signs-of-vitamin-d-deficiency` is published, live, and has ZERO rows in
     * `content_review_log` — no ClickUp review task either. It was found while
     * assembling batch 2, one batch after the draft-status gap, and it is the same
     * defect wearing a different column: the premise behind routing a snippet away
     * from clinical review was assumed rather than tested.
     *
     * ⚠ BUT THE ABSENCE OF A ROW IS NOT THE ABSENCE OF A SIGN-OFF, and the first
     * version of the message said it was. That article IS signed off — by a
     * blanket email of 2026-05-27 recorded only in commit `6d2da5b` and
     * transcribed in `03_compliance/STATE.md`, which already calls it the weakest
     * sign-off trail in the blog set and has had the remediation owed since
     * 2026-07-31. A check that reads one table and concludes something about the
     * whole sign-off universe is making a claim it did not test; the message now
     * asserts only what this query saw. The block is still right, because the
     * routing rests on a trail that can be retrieved per article.
     *
     * Two tests, because one of them would have passed this article. */
    if (!approvedIds.has(row.id as string)) {
      fail(
        d.slug,
        `no approved row in content_review_log, even though it is '${row.status}'. That is the ` +
          `only store this check reads, and a sign-off can exist outside it — ` +
          `14-signs-of-vitamin-d-deficiency is covered by a blanket approval email recorded in a ` +
          `commit message and transcribed in 03_compliance/STATE.md. So this is not "never signed ` +
          `off"; it is "no per-article record here". Resolve the article's sign-off TRAIL before ` +
          `writing a snippet, because the snippet's whole routing rests on it being retrievable.`,
        failures,
      )
    }

    const fm = (row.frontmatter ?? {}) as ArticleFrontmatter
    const live = resolveArticleSeo(fm)

    /* 🔴 EMIT THE SOURCE THE FRAGMENT SCANNER SHOULD READ, BECAUSE THE OBVIOUS
     * FILE IS THE WRONG ONE AND IT IS WRONG IN BOTH DIRECTIONS.
     *
     * `fragment-scan.js` needs a --source: the signed-off copy a snippet
     * compresses. The tempting file is `content/blog/<slug>.mdx`, and pointing at
     * it gives materially different findings from pointing at the database,
     * because the scanner reads a whole file as prose and an MDX carries a large
     * YAML frontmatter block. Measured on this batch:
     *
     *   · FALSE POSITIVES. `ferritin` and `fbc` each raise the scanner's
     *     strongest tier against the MDX — "NOTHING on this slide hedges it",
     *     83% overlap — by pairing the proposed TITLE against an `faq:` ANSWER in
     *     the frontmatter. A title is not a compression of an FAQ answer.
     *   · FALSE NEGATIVES. `how-to-read` raises a real finding against the
     *     database and none against the MDX, because there the approved title is
     *     a `title:` YAML key rather than a sentence, so nothing pairs with it.
     *
     * Two reviewers using the two files reached opposite conclusions about the
     * same four strings, and neither report said which file it had read. So the
     * correct source is produced here, from the same database read that backs
     * every other check in this file, rather than assembled by hand each time.
     * Title, excerpt and body, one clean text, no apparatus. */
    if (emitDir) {
      fs.mkdirSync(emitDir, { recursive: true })
      fs.writeFileSync(
        path.join(emitDir, `${d.slug}-source.md`),
        `${fm.title ?? ''}\n\n${fm.excerpt ?? ''}\n\n${row.body ?? ''}`,
        'utf8',
      )
    }
    /* ⚠ ONLY OVERRIDE A FIELD THE DRAFT ACTUALLY PROPOSES.
     *
     * This was `{ ...fm, seoTitle: d.seoTitle, seoDescription: d.seoDescription }`,
     * which sets an ABSENT field to `undefined` as an own property, clobbering any
     * value the article already carries. `resolveArticleSeo` then falls back to
     * the editorial field and the run prints a `description X -> Y` mark for a
     * change nobody proposed — a measurement of a page that does not exist.
     *
     * Latent through this whole commission, because none of the 17 articles has
     * either key set yet. It fires the first time a pass revises ONE field on an
     * article that already carries the other, which is exactly what a
     * re-optimisation does. Found by an independent review reading the code
     * rather than by any run. */
    const next = resolveArticleSeo({
      ...fm,
      ...(d.seoTitle !== undefined ? { seoTitle: d.seoTitle } : {}),
      ...(d.seoDescription !== undefined ? { seoDescription: d.seoDescription } : {}),
    })

    const renderedTitle = (next.title + SUFFIX).length
    const descLen = next.description.length
    const marks: string[] = []

    if (d.seoTitle !== undefined) {
      if (d.seoTitle.trim() !== d.seoTitle) {
        fail(d.slug, 'seoTitle has leading or trailing whitespace, which falls back silently.', failures)
      }
      if (renderedTitle > SEO_TITLE_MAX) {
        fail(d.slug, `seoTitle renders at ${renderedTitle}, over ${SEO_TITLE_MAX}. Bare budget is ${titleBudget}, this is ${d.seoTitle.length}.`, failures)
      } else {
        marks.push(`title ${(live.title + SUFFIX).length} -> ${renderedTitle}`)
      }
    }

    if (d.seoDescription !== undefined) {
      if (d.seoDescription.trim() !== d.seoDescription) {
        fail(d.slug, 'seoDescription has leading or trailing whitespace, which falls back silently.', failures)
      }
      if (descLen > SEO_DESCRIPTION_MAX) {
        fail(d.slug, `seoDescription is ${descLen}, over ${SEO_DESCRIPTION_MAX}.`, failures)
      } else {
        marks.push(`description ${live.description.length} -> ${descLen}`)
      }
    }

    /* House style, and it is here rather than in a reviewer's eye because it is a
       character comparison. The em dash is banned in customer-facing copy. */
    for (const [field, value] of [['seoTitle', d.seoTitle], ['seoDescription', d.seoDescription]] as const) {
      if (value && /[—–]/.test(value)) {
        fail(d.slug, `${field} contains an em or en dash, which is banned in customer-facing copy.`, failures)
      }
    }

    const verdict = guardSeoRevision({
      seoTitle: d.seoTitle,
      seoDescription: d.seoDescription,
      approved: {
        title: fm.title ?? '',
        excerpt: fm.excerpt ?? '',
        body: row.body ?? '',
      },
    })

    if (verdict.route !== 'seo') {
      fail(d.slug, `guard routes this to clinical review: ${verdict.findings.length} finding(s).`, failures)
    }

    /* 🔴 THE LABEL IS COMPUTED FROM THIS DRAFT'S OWN FAILURES, NOT FROM THE GUARD
       VERDICT ALONE, AND NOTHING PRINTS UNTIL THE LABEL HAS. Two bugs lived here,
       both of the same kind: output that reads as being about something other
       than what it is about.
         - The first version printed PASS whenever the claim guard was happy, so
           an 81-character title already recorded as a failure was announced as
           PASS and contradicted four lines later by the summary. A reader
           scanning a column of PASS does not read the summary.
         - The second printed each draft's guard findings BEFORE its own heading,
           so they appeared under the PREVIOUS article's name — which is worse
           than not printing them, because it attributes a clinical finding to the
           wrong article.
       Same lesson both times, and the same one as the 127 exit code in
       `verify-article-seo.ts`: output that looks right beside a status, or a
       heading, that disagrees with it. Heading first, then everything about it. */
    const mine = (failures.length - failuresBefore) + (shapeErrorsBySlug.get(d.slug) ?? 0)
    const label = mine === 0 ? 'PASS' : verdict.route !== 'seo' ? 'EWA ' : 'FAIL'
    console.log(`  ${label}  ${d.slug}${mine ? `  (${mine} failure${mine > 1 ? 's' : ''}, see below)` : ''}`)
    if (marks.length) console.log(`        ${marks.join(', ')}`)
    if (d.note) console.log(`        note: ${d.note}`)
    for (const f of verdict.findings) {
      console.log(`        tier ${f.tier}  ${f.field}: ${f.reason}`)
    }
  }

  console.log('')
  if (failures.length) {
    console.error(
      `check-seo-drafts: ${failures.length} failure(s) over ${drafts.length} draft(s)` +
        // Say when entries were unreadable, so "N drafts" is never mistaken for
        // "the whole file". A count that silently excludes what it could not parse
        // reads as coverage.
        (skipped ? `, plus ${skipped} entr${skipped === 1 ? 'y' : 'ies'} too malformed to check` : '') +
        `.\n`,
    )
    for (const f of failures) console.error(`  ${f}`)
    console.error('')
    process.exitCode = 1
    return
  }
  console.log(
    `check-seo-drafts: ${drafts.length} draft(s) clear length, the claim guard and house style.\n` +
      `  This is a mechanical pass, NOT a compliance pre-flight and NOT an approval.\n`,
  )
}

main().catch((e: unknown) => {
  console.error(`ERROR: ${e instanceof Error ? e.message : String(e)}`)
  process.exitCode = 1
})
