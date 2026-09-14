/*
 * `guardSeoRevision` in `seo-revision-guard.ts`: whether a metadata revision is
 * still only metadata. Keith's ruling 2026-09-14, defect register M7, qualified
 * by Ewa's tier ladder of 2026-08-18 (Q14).
 *
 *   npx tsx scripts/content-engine/test-seo-revision-guard.ts
 *
 * The guard's whole value is the boundary, so the cases here are pairs: one that
 * must route 'seo' and a near neighbour that must route 'clinical'. A guard that
 * only ever sees its happy path is a guard nobody has tested.
 *
 * Five things are load-bearing:
 *
 *   (1) THE ORDINARY CASE MUST PASS. A description that reworks approved copy
 *       into 160 characters is tier 1 and gets no clinical review. If this
 *       regressed, Keith's ruling would be dead letter and all 29 owed fields
 *       would silently queue behind Ewa again. Section 1.
 *
 *   (2) A NET-NEW FIGURE IS CAUGHT. Section 2.
 *   (3) A NET-NEW CITATION IS CAUGHT. Section 3.
 *   (4) A DROPPED QUALIFIER IS CAUGHT — the "linked to" -> "causes" case, which
 *       is the reason the guard exists at all. Section 4.
 *   (5) THE VOCABULARY IS NOT COPIED. Section 6 reads the source and asserts the
 *       guard imports from classify-claims.ts rather than restating the closed
 *       lists, because two copies of a claim vocabulary drift on the first
 *       addition to either.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { guardSeoRevision, type ApprovedCopy } from './seo-revision-guard'

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

/* A stand-in for a real article, carrying the three things the guard reads: a
   figure with a unit, a cited body, and hedged language around both. Drawn from
   the shape of the vitamin D article rather than its exact copy, so a later edit
   to the live article cannot silently change what this test means. */
const APPROVED: ApprovedCopy = {
  title: '14 signs of vitamin D deficiency, and what your blood test actually shows',
  excerpt:
    'Low vitamin D is associated with tiredness, low mood and aching bones. Here is what the ' +
    'symptoms may point to and where your level sits.',
  body:
    'The NHS considers a level under 25 nmol/L to be deficient. Levels between 25 and 50 nmol/L ' +
    'are often described as insufficient. Tiredness is commonly linked to low vitamin D, though ' +
    'it can have other causes, and SACN suggests adults consider a supplement in winter.',
}

// ── 1. The ordinary case: a rewording, which is what this ruling is for ─────
section('1. A reworded description with no new proposition routes to SEO review')
{
  const v = guardSeoRevision({
    seoTitle: '14 signs of vitamin D deficiency',
    seoDescription:
      'Low vitamin D is associated with tiredness, low mood and aching bones. What the symptoms ' +
      'may point to, and where your level sits.',
    approved: APPROVED,
  })
  check('routes to SEO review', v.route === 'seo')
  check('raises no findings', v.findings.length === 0)
  check('summary names the tier-1 auto-pass', /Tier 1/.test(v.summary))
}

section('1b. A revision with neither field set is trivially metadata')
{
  const v = guardSeoRevision({ approved: APPROVED })
  check('routes to SEO review', v.route === 'seo')
  check('says there was nothing to read', /nothing to read/.test(v.summary))
}

section('1c. A figure the article DOES carry is fine on the snippet')
{
  const v = guardSeoRevision({
    seoDescription:
      'The NHS considers a level under 25 nmol/L deficient. What the symptoms may point to, and ' +
      'where your own level sits.',
    approved: APPROVED,
  })
  check('routes to SEO review', v.route === 'seo')
}

// ── 2. A figure the article never cleared ───────────────────────────────────
section('2. A net-new figure routes to clinical review as tier 3')
{
  const v = guardSeoRevision({
    seoDescription:
      'Vitamin D levels under 75 nmol/L may leave you tired. What the symptoms point to and ' +
      'where your level sits.',
    approved: APPROVED,
  })
  check('routes to clinical review', v.route === 'clinical')
  check('is tier 3', v.findings.some((f) => f.tier === 3))
  check('names the field', v.findings.some((f) => f.field === 'seoDescription'))
  check('quotes the offending figure', v.findings.some((f) => /75/.test(f.reason)))
}

section('2b. A net-new figure in the TITLE is caught too, not just the description')
{
  const v = guardSeoRevision({
    seoTitle: 'Vitamin D under 75 nmol/L: 14 signs',
    approved: APPROVED,
  })
  check('routes to clinical review', v.route === 'clinical')
  check('names seoTitle', v.findings.some((f) => f.field === 'seoTitle'))
}

// ── 3. An attribution the article has not earned ────────────────────────────
section('3. A net-new citation routes to clinical review as tier 3')
{
  const v = guardSeoRevision({
    seoDescription:
      'NICE says low vitamin D may be associated with tiredness and aching bones. What the ' +
      'symptoms point to.',
    approved: APPROVED,
  })
  check('routes to clinical review', v.route === 'clinical')
  check('names NICE', v.findings.some((f) => /NICE/.test(f.reason)))
}

// ── 4. The dropped qualifier: the case this guard exists for ────────────────
section('4. A compressed claim that drops every qualifier routes to clinical review')
{
  const v = guardSeoRevision({
    seoDescription:
      'A level under 25 nmol/L causes tiredness, low mood and aching bones. Get your 14 signs ' +
      'checked today.',
    approved: APPROVED,
  })
  check('routes to clinical review', v.route === 'clinical')
  check('is tier 2', v.findings.some((f) => f.tier === 2))
  check('cites Ewa\'s Q14 ruling by date', v.findings.some((f) => /2026-08-18/.test(f.reason)))
}

section('4b. The same sentence keeping one qualifier is a trim, not a claim move')
{
  const v = guardSeoRevision({
    seoDescription:
      'A level under 25 nmol/L may leave you tired, low and aching. What your 14 signs point to.',
    approved: APPROVED,
  })
  check('routes to SEO review', v.route === 'seo')
}

// ── 5. A claim with no number and no citation in it at all ──────────────────
section('5. A net-new prevalence claim is caught despite carrying no figure')
{
  const v = guardSeoRevision({
    seoDescription:
      'Most men are low on vitamin D, and it may leave you tired. What the symptoms point to ' +
      'and where your level sits.',
    approved: APPROVED,
  })
  check('routes to clinical review', v.route === 'clinical')
  check('names the shape', v.findings.some((f) => /prevalence/.test(f.reason)))
}

// ── 6. One vocabulary, one home ─────────────────────────────────────────────
section('6. The guard imports the claim vocabulary rather than restating it')
{
  const src = readFileSync(resolve(__dirname, 'seo-revision-guard.ts'), 'utf8')
  check(
    'imports from classify-claims',
    /from '\.\/classify-claims'/.test(src),
  )
  for (const symbol of ['numTokens', 'authoritiesIn', 'hedgesIn', 'ASSERTION_SHAPES']) {
    check(`imports ${symbol} rather than defining it`, new RegExp(`\\b${symbol}\\b`).test(src) &&
      !new RegExp(`(const|function)\\s+${symbol}\\b`).test(src))
  }
  check(
    'does not restate the hedge list',
    !/'consider',\s*'may',\s*'can'/.test(src),
  )
}

// ── 7. The structural test belongs to the database, and is not duplicated ───
section('7. The guard does not re-implement the metadata-only check')
{
  const src = readFileSync(resolve(__dirname, 'seo-revision-guard.ts'), 'utf8')
  const sql = readFileSync(
    resolve(__dirname, '..', '..', '..', 'database', 'migrations', '20260914_blog_revision_scope.sql'),
    'utf8',
  )
  check(
    'the migration enforces body equality for scope=seo',
    /p_body is distinct from v_live_body/.test(sql),
  )
  check(
    'the migration enforces frontmatter equality outside the two SEO keys',
    /- 'seoTitle' - 'seoDescription'/.test(sql),
  )
  check(
    'the guard says the structural test lives in the database',
    /stage_blog_revision/.test(src),
  )
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log('')
if (failures > 0) {
  console.error(`✗ ${failures} failed, ${passes} passed`)
  process.exit(1)
}
console.log(`✓ ${passes} assertions passed`)
