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

const file = process.argv[2]
if (!file) {
  console.error('usage: check-seo-drafts.ts <drafts.json>')
  process.exit(1)
}

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

  const drafts: Draft[] = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'))
  if (!Array.isArray(drafts) || drafts.length === 0) {
    throw new Error(`${file} holds no drafts. Fix the file rather than reading a pass into it.`)
  }

  const db = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await db
    .from('blog_articles')
    .select('slug, body, frontmatter, status')
    .in('slug', drafts.map((d) => d.slug))
  if (error) throw new Error(`blog_articles read failed: ${error.message}`)

  const bySlug = new Map((data ?? []).map((r) => [r.slug as string, r]))
  const SUFFIX = brandSuffix()
  const titleBudget = SEO_TITLE_MAX - SUFFIX.length
  const failures: string[] = []

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

    const fm = (row.frontmatter ?? {}) as ArticleFrontmatter
    const live = resolveArticleSeo(fm)
    const next = resolveArticleSeo({ ...fm, seoTitle: d.seoTitle, seoDescription: d.seoDescription })

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
    const mine = failures.length - failuresBefore
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
    console.error(`check-seo-drafts: ${failures.length} failure(s) over ${drafts.length} drafts.\n`)
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
