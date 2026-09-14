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
 * 🔴 THIS LIST IS THE DELIVERABLE, NOT AN APOLOGY. Writing 17 SEO titles and 17
 * SEO descriptions is a commission: they are customer-facing copy on clinical
 * articles, and the descriptions summarise clinical content, so they take the
 * article route (drafted, pre-flighted, Ewa where a claim moves) rather than
 * being generated in a build pass. What shipped on 2026-09-14 is the MECHANISM
 * plus this list, so the debt is counted and visible rather than unmeasured.
 *
 * Every number below was read from the live database on 2026-09-14, not
 * estimated. `title` is the RENDERED length including the " | Andro Prime" the
 * root layout appends.
 */
const SINCE = '2026-09-14'
type Baseline = { slug: string; title?: number; description?: number }
const BASELINE: Baseline[] = [
  { slug: 'how-to-increase-testosterone-naturally', title: 94, description: 260 },
  { slug: 'free-androgen-index', title: 93, description: 258 },
  { slug: 'signs-of-stress-in-men', title: 76, description: 232 },
  { slug: 'why-am-i-always-tired', title: 83, description: 229 },
  { slug: 'brain-fog', title: 72, description: 224 },
  { slug: 'cortisol-belly', title: 89, description: 221 },
  { slug: 'andropause-male-menopause', title: 89, description: 192 },
  { slug: 'myth-of-normal-range', title: 83, description: 174 },
  { slug: 'liver-function-blood-test', title: 73, description: 173 },
  { slug: 'cholesterol-test', title: 80, description: 173 },
  { slug: 'thyroid-test', title: 78, description: 171 },
  { slug: '14-signs-of-vitamin-d-deficiency', description: 166 },
  { slug: 'b12-blood-test', description: 165 },
  { slug: 'ferritin-blood-test', title: 61, description: 164 },
  { slug: 'inflammatory-markers-blood-test', title: 63 },
  { slug: 'fbc-blood-test', title: 63 },
  { slug: 'how-to-read-blood-test-results', title: 69 },
]

/* The brand suffix is READ from the layout that appends it, for the same reason
   `verify-metadata.js` reads it: changing the template must not be a way of
   silently changing what this check measures. One fact, one home, two readers. */
function brandSuffix(): string {
  const src = fs.readFileSync(path.join(ROOT, 'app', 'layout.tsx'), 'utf8')
  const m = /template\s*:\s*(['"])([^'"]*)\1/.exec(src)
  if (!m) die('no title.template in app/layout.tsx. Fix that file rather than this line.')
  return m[2].replace('%s', '')
}

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
    .select('slug,status,frontmatter')
    .neq('status', 'archived')
  if (error) die(`blog_articles read failed: ${error.message}`)
  if (!data || data.length === 0) die('read 0 articles. Fix this reader rather than trusting a pass.')

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
  const owed = BASELINE.length

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
}

main().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e)
  console.error(`ERROR: ${msg}`)
  process.exitCode = 1
})
