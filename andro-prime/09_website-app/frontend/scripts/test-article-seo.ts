/*
 * `resolveArticleSeo` in `lib/blog.ts`: what a search result shows for an
 * article, and which field it came from. Defect M7, Keith's decision 2026-09-14.
 *
 *   npx tsx scripts/test-article-seo.ts
 *
 * This is the half of M7 that can be tested without secrets or a network. The
 * live corpus read is `scripts/verify-article-seo.ts`, a command rather than a
 * test, for the reason its header records.
 *
 * Four things here are load-bearing and the rest are worked examples:
 *
 *   (1) THE FALLBACK IS THE OLD BEHAVIOUR. An article that sets neither field
 *       must render exactly the title and excerpt it rendered before. That is
 *       what made it safe to ship the mechanism with 17 articles still owed
 *       copy, so it is asserted rather than assumed. Section 1.
 *
 *   (2) AN EMPTY STRING IS NOT A TITLE. The value arrives from a YAML block a
 *       human types, where `seoTitle: ""`, `seoTitle:` and a line of spaces are
 *       all easy to produce and none of them means "the title is empty". Each
 *       must fall back, not render a blank tab. Section 2.
 *
 *   (3) THE PAGE AND THE CHECK READ THE SAME FUNCTION. Section 4 reads the
 *       SOURCE of `app/(marketing)/blog/[slug]/page.tsx` and of
 *       `scripts/verify-article-seo.ts` and asserts both call
 *       `resolveArticleSeo`. If either grew its own copy of the rule, the live
 *       check would be measuring its own model of the page rather than the page
 *       — which is how a green run comes to mean nothing.
 *
 *   (4) THE SHARE CARD AND THE SCHEMA KEEP THE EDITORIAL COPY. A social card has
 *       no 60/160 truncation and the headline is what a reader recognises, so
 *       openGraph, twitter and the Article schema must go on ignoring the SEO
 *       fields. Asserted from the same source read, because "do not tidy this"
 *       in a comment is a request and this is a control. Section 5.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { resolveArticleSeo, SEO_TITLE_MAX, SEO_DESCRIPTION_MAX } from '../lib/blog'

let failures = 0
let passes = 0

function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`  ✗ ${label}`)
  }
}

function section(name: string): void {
  console.log(`\n${name}`)
}

const EDITORIAL = {
  title: 'Andropause (the "male menopause"): what it is, the symptoms, and what to do',
  excerpt:
    'Is the male menopause real? What andropause feels like, why a symptom list cannot tell you the cause, and how to find out where your testosterone actually sits.',
}

// ── 1. The fallback is the old behaviour ────────────────────────────────────
section('1. No SEO fields set: the page renders exactly what it rendered before')
{
  const seo = resolveArticleSeo(EDITORIAL)
  check('title falls back to the headline', seo.title === EDITORIAL.title)
  check('description falls back to the excerpt', seo.description === EDITORIAL.excerpt)
  check('titleFrom names the editorial field', seo.titleFrom === 'title')
  check('descriptionFrom names the editorial field', seo.descriptionFrom === 'excerpt')
}

// ── 2. An empty or blank value is not a title ───────────────────────────────
section('2. Empty, missing and whitespace-only values all fall back')
for (const [label, value] of [
  ['an empty string', ''],
  ['whitespace only', '   '],
  ['a newline', '\n'],
] as const) {
  const seo = resolveArticleSeo({ ...EDITORIAL, seoTitle: value, seoDescription: value })
  check(`${label} falls back for the title`, seo.title === EDITORIAL.title)
  check(`${label} falls back for the description`, seo.description === EDITORIAL.excerpt)
  check(`${label} is reported as coming from the editorial field`, seo.titleFrom === 'title')
}
{
  const seo = resolveArticleSeo({ ...EDITORIAL, seoTitle: undefined })
  check('an absent seoTitle falls back', seo.title === EDITORIAL.title)
}

// ── 3. A set value wins, and is reported as such ────────────────────────────
section('3. A set value wins, is trimmed, and says where it came from')
{
  const seo = resolveArticleSeo({
    ...EDITORIAL,
    seoTitle: '  Andropause: symptoms and what to do  ',
    seoDescription: '  What andropause feels like and how to find out where your testosterone sits.  ',
  })
  check('seoTitle wins over the headline', seo.title === 'Andropause: symptoms and what to do')
  check('seoDescription wins over the excerpt', seo.description.startsWith('What andropause feels like'))
  check('surrounding whitespace is trimmed off the title', !seo.title.startsWith(' ') && !seo.title.endsWith(' '))
  check('titleFrom names seoTitle', seo.titleFrom === 'seoTitle')
  check('descriptionFrom names seoDescription', seo.descriptionFrom === 'seoDescription')
}
{
  // One set and one not: the fields are independent, which is the common case
  // while the corpus is being worked through one article at a time.
  const seo = resolveArticleSeo({ ...EDITORIAL, seoDescription: 'A shorter description.' })
  check('setting only the description leaves the title on the headline', seo.titleFrom === 'title')
  check('setting only the description moves the description', seo.descriptionFrom === 'seoDescription')
}

// ── 4. The page and the live check resolve through this function ────────────
section('4. Both consumers call the resolver rather than reimplementing it')
{
  const pagePath = resolve(__dirname, '..', 'app', '(marketing)', 'blog', '[slug]', 'page.tsx')
  const page = readFileSync(pagePath, 'utf8')
  check('the article page imports resolveArticleSeo', page.includes('resolveArticleSeo'))
  check('the article page sets title from the resolver', /title:\s*seo\.title/.test(page))
  check('the article page sets description from the resolver', /description:\s*seo\.description/.test(page))

  const checker = readFileSync(resolve(__dirname, 'verify-article-seo.ts'), 'utf8')
  check('the live check imports resolveArticleSeo', checker.includes('resolveArticleSeo'))
  check('the live check imports the bounds rather than typing them', checker.includes('SEO_TITLE_MAX') && checker.includes('SEO_DESCRIPTION_MAX'))
  check(
    'the live check does not carry its own bound numbers',
    !/\b(?:60|160)\b/.test(checker.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ').replace(/^import[\s\S]*?from[^\n]*$/gm, ' ')),
  )
}

// ── 5. The share card and the schema keep the editorial copy ────────────────
section('5. openGraph, twitter and the Article schema still use the headline')
{
  const pagePath = resolve(__dirname, '..', 'app', '(marketing)', 'blog', '[slug]', 'page.tsx')
  const page = readFileSync(pagePath, 'utf8')
  const og = page.slice(page.indexOf('openGraph:'), page.indexOf('alternates:') > page.indexOf('openGraph:') ? page.length : page.length)
  const cardBlock = page.slice(page.indexOf('openGraph:'), page.indexOf('export default'))
  check('openGraph is present to be judged', og.length > 0)
  check('the share card titles come from the headline', (cardBlock.match(/\$\{frontmatter\.title\} \| Andro Prime/g) ?? []).length === 2)
  check('the share card descriptions come from the excerpt', (cardBlock.match(/description:\s*frontmatter\.excerpt/g) ?? []).length === 2)
  check('no share-card field was tidied onto the resolver', !/openGraph:[\s\S]*?seo\.(title|description)/.test(cardBlock))
  check('the Article schema headline is the editorial title', /headline:\s*frontmatter\.title/.test(page))
  check('the Article schema description is the editorial excerpt', /description:\s*frontmatter\.excerpt/.test(page))
}

// ── 6. The bounds are the ones the rest of the system uses ──────────────────
section('6. The bounds match the static metadata check')
{
  check(`the title bound is ${SEO_TITLE_MAX}`, SEO_TITLE_MAX === 60)
  check(`the description bound is ${SEO_DESCRIPTION_MAX}`, SEO_DESCRIPTION_MAX === 160)
  const staticCheck = readFileSync(resolve(__dirname, 'verify-metadata.js'), 'utf8')
  check(
    'verify-metadata.js uses the same title bound',
    new RegExp(`const TITLE_MAX = ${SEO_TITLE_MAX}\\b`).test(staticCheck),
  )
  check(
    'verify-metadata.js uses the same description bound',
    new RegExp(`const DESC_MAX = ${SEO_DESCRIPTION_MAX}\\b`).test(staticCheck),
  )
}

// ── 7. They stay frontmatter keys, because Keith ruled they should ──────────
//
// KEITH, 2026-09-14: frontmatter keys, not columns. He asked for `seo_title` /
// `seo_description` columns, the keys were raised as an engineering call inside
// his decision, and he ratified them. The reasons are recorded in `lib/blog.ts`,
// `CONTEXT.md` and `STATE.md`, and the strongest of them is load-bearing at
// runtime: `stage_blog_revision` proves a revision is metadata-only with the
// single expression `frontmatter - 'seoTitle' - 'seoDescription'`, and with
// columns that becomes a hand-maintained list of every other column.
//
// "Do not tidy these into columns" is the kind of instruction that gets walked
// past, because the moment of violation is one line of a migration nobody pauses
// at. Section 5 already sets the precedent for holding a "do not tidy" rule with
// an assertion rather than a comment; this does the same one layer down.
section('7. The SEO fields are frontmatter keys and no column shadows them')
{
  const types = readFileSync(resolve(__dirname, '..', 'lib', 'supabase', 'types.ts'), 'utf8')
  const start = types.indexOf('      blog_articles: {')
  const end = types.indexOf('      borderline_nurture_consent: {', start)
  const blogArticles = types.slice(start, end)

  check(
    'blog_articles has no seo_title column',
    start > 0 && end > start && !/\bseo_title\b/.test(blogArticles),
  )
  check(
    'blog_articles has no seo_description column',
    start > 0 && end > start && !/\bseo_description\b/.test(blogArticles),
  )

  const blog = readFileSync(resolve(__dirname, '..', 'lib', 'blog.ts'), 'utf8')
  check('ArticleFrontmatter declares seoTitle', /\n\s*seoTitle\?: string/.test(blog))
  check('ArticleFrontmatter declares seoDescription', /\n\s*seoDescription\?: string/.test(blog))

  // The invariant the keys buy. If this expression ever leaves the migration,
  // the metadata-only guarantee behind the whole SEO review route has changed
  // shape and the ruling above needs revisiting rather than quietly outliving it.
  const migration = readFileSync(
    resolve(__dirname, '..', '..', 'database', 'migrations', '20260914_blog_revision_scope.sql'),
    'utf8',
  )
  check(
    'the scope guard still proves metadata-only with one jsonb subtraction',
    /frontmatter - 'seoTitle' - 'seoDescription'/.test(migration),
  )
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log('')
if (failures > 0) {
  console.error(`✗ ${failures} failed, ${passes} passed`)
  process.exit(1)
}
console.log(`✓ ${passes} assertions passed`)
