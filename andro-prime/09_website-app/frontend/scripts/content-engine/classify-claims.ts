/**
 * classify-claims — plan step 5.3. The tier ladder, computed instead of remembered.
 *
 * WHAT 5.2 LEFT BEHIND. A derivative is pinned to a signed claim set, which records that the set
 * GOVERNS it. Nothing recorded which of that set's claims the copy actually carries, so a populated
 * `claim_set_id` read as a checked one. This walks the copy that ships (`content_renditions.body`,
 * never the asset markdown, which is craft) against the claims in the pinned set, and writes one
 * verdict per claim into `content_asset_claims`.
 *
 * THE LADDER, RULED BY DR EWA LINDO 2026-08-18 (Q14), as written and without amendment:
 *
 *   Tier 1  carried verbatim, or reworded with no proposition added   AUTO-PASSES, no Ewa at all
 *   Tier 2  compressed, or on a surface that cannot carry the qualifier   to Ewa, ITEMISED
 *   Tier 3  net-new: the copy asserts something no signed claim covers   back to the ARTICLE
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * WHAT THIS TOOL CAN AND CANNOT SEE, STATED FIRST BECAUSE A GREEN RUN WILL BE READ AS A CLAIM
 * CHECK AND IT IS NOT ONE.
 *
 * It reads the MECHANICAL surface of a claim: the numbers, their units, the threshold words in
 * front of them, the named authority behind them, and the hedges around them. That is where these
 * failures actually happen — a threshold that drifts, an attribution dropped to save characters, a
 * "consider" that becomes a "recommends". It is deterministic, it is repeatable, and it is the same
 * axis `scan.js` works on one layer down.
 *
 * It does NOT read meaning. It cannot tell you that a sentence carrying no number and no authority
 * has quietly added a proposition. So it is built to FAIL CLOSED in three ways, and each one is a
 * deliberate refusal to let silence read as a pass:
 *
 *   1. An unmatched clinical number or authority becomes a TIER 3 ROW, not a note. Absence of a
 *      mapping is the finding, and the database gate refuses the schedule until a human closes it.
 *   2. A sentence carrying an assertion shape the classifier cannot map — a prevalence claim, a
 *      mechanism with no number in it — is printed as UNACCOUNTED. It is not written as a row,
 *      because a noisy gate teaches people to route around it, and it is not hidden either.
 *   3. An asset with no shippable copy is reported UNCHECKED and never classified. Zero verdicts
 *      on an asset with no body would otherwise look exactly like zero problems.
 *
 * So: this replaces the hand-typed `## Claim inheritance check` table with something a gate can
 * read, and it narrows the human's job to the lines it could not account for. It does not remove
 * the human, and `sop-compliance-route.md` step 3 still owns the judgement half.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 *
 * NO AUTOMATION MAY CLOSE A TIER 2 OR A TIER 3. It writes `resolution = 'auto-pass'` on tier 1 and
 * nothing else, because Ewa ruled the TIER rather than the instance. Tier 2 and tier 3 rows arrive
 * unresolved by construction and only a human writes their reference. The database enforces this
 * independently (`content_asset_claims_tier1_auto`), so a future caller cannot loosen it here.
 *
 * A RE-RUN NEVER DESTROYS A HUMAN'S DECISION. Rows a person resolved are kept and reported, even
 * where the copy has since moved: deleting a cleared verdict would delete the trail that made it
 * clearable. Only classifier-written, unresolved rows are rewritten.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/classify-claims.ts --slug x-w02-1-the-uk-bands-in-nmol
 *   npx tsx scripts/content-engine/classify-claims.ts --all            (every pinned asset, dry)
 *   npx tsx scripts/content-engine/classify-claims.ts --all --apply
 */
import { loadEnvLocal, admin, logRun } from './_shared'

// ═══════════════════════════════════════════════════════════════════ vocabulary
//
// Three closed lists. They are the whole reason this is deterministic, and every one of them is a
// claim about our own copy rather than about English: a unit we never use cannot appear, and an
// authority we never cite cannot be dropped.

/** Units that make a number clinical. A bare number is an illustration; a number with one of these
 *  is a threshold, and a threshold that is not in the signed set is a net-new claim. */
export const CLINICAL_UNITS = [
  'nmol/l', 'pmol/l', 'mmol/l', 'µg/l', 'ug/l', 'mcg/l', 'micrograms per litre',
  'micrograms', 'microgram', 'mcg', 'iu', 'mg', 'g/l', '%', 'units', 'hours', 'hour',
] as const

/** A number in front of one of these is a boundary even with no unit attached ("under 25", "75 to
 *  125"), which is exactly how a threshold gets written on a character-capped surface. */
export const THRESHOLD_WORDS = [
  'under', 'over', 'above', 'below', 'between', 'less than', 'more than', 'up to', 'at least',
  'lower than', 'higher than', 'from', 'to',
] as const

/**
 * Bodies we cite, keyed to the ORGANISATION rather than to the string. Dropping the attribution is
 * the commonest tier 2 in this repo's history: it is the first thing to go when copy is squeezed,
 * and it is the half that makes a claim checkable.
 *
 * THE ALIASES ARE THE POINT. A signed claim sourced from "NICE CKS" and a post that says "NICE" are
 * citing one body; matching on the literal string made `cks` a second authority the copy had
 * "dropped", and every NICE-sourced claim came back tier 2 for want of a word no social post has
 * ever contained. Same for NG239, which is a NICE guideline number, and for two NHS trust labs whose
 * names appear in a source line and never in copy.
 */
export const AUTHORITIES: { canonical: string; patterns: string[] }[] = [
  { canonical: 'NICE', patterns: ['nice', 'cks', 'ng239'] },
  { canonical: 'the NHS', patterns: ['nhs', 'gloucestershire', 'south tees'] },
  { canonical: 'Public Health England', patterns: ['phe', 'public health england'] },
  { canonical: 'SACN', patterns: ['sacn'] },
  { canonical: 'the Endocrine Society', patterns: ['endocrine society'] },
  { canonical: 'the BMJ', patterns: ['bmj'] },
  { canonical: 'the British Heart Foundation', patterns: ['british heart foundation', 'bhf'] },
  { canonical: 'the Royal Osteoporosis Society', patterns: ['royal osteoporosis society'] },
  { canonical: 'the British Society of Gastroenterology', patterns: ['british society of gastroenterology'] },
  { canonical: 'Lab Tests Online UK', patterns: ['lab tests online'] },
]

/** Words that hold a claim down to what the source actually says. A claim whose signed sentence
 *  carries one, repeated in copy without it, is compression: "consider a supplement" becoming
 *  "take a supplement" is the exact case Q1 settled on 2026-08-18. */
export const HEDGES = [
  'consider', 'may', 'can', 'usually', 'often', 'about', 'around', 'roughly', 'broadly',
  'associated', 'association', 'observational', 'modestly', 'some', 'most', 'generally',
  'up to', 'not a treatment', 'among', 'tends', 'suggests', 'linked',
] as const

/** Shapes that assert something checkable with no number and no authority in them. Reported, never
 *  written as a row: they are where the classifier's reach ends and it says so. */
export const ASSERTION_SHAPES: { name: string; re: RegExp }[] = [
  { name: 'prevalence', re: /\b(most|majority of|many|few)\s+(uk\s+)?(men|people|adults|women)\b/i },
  { name: 'proportion', re: /\b(\d+\s+in\s+\d+|a (third|quarter|half|fifth) of)\b/i },
  { name: 'comparative', re: /\b(better|worse|more|less) (than|at) \b/i },
]

const STOPWORDS = new Set([
  'the', 'and', 'that', 'this', 'with', 'from', 'for', 'are', 'was', 'were', 'has', 'have', 'had',
  'not', 'but', 'its', 'it', 'is', 'a', 'an', 'of', 'in', 'on', 'to', 'as', 'at', 'by', 'or', 'be',
  'been', 'than', 'them', 'they', 'their', 'there', 'which', 'what', 'when', 'who', 'how', 'you',
  'your', 'our', 'we', 'so', 'if', 'can', 'may', 'more', 'less', 'one', 'two', 'about', 'into',
  'over', 'under', 'out', 'up', 'down', 'only', 'also', 'other', 'some', 'any', 'all', 'both',
  'does', 'do', 'did', 'because', 'while', 'still', 'even', 'much', 'many', 'most', 'own', 'same',
])

// ═══════════════════════════════════════════════════════════════════ text tools

/**
 * One spelling per fact, so a comparison never fails on typography. `percent` and `%` are the same
 * unit, `1,000` and `1000` the same number, and a curly apostrophe is not a different word.
 */
export function normalise(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/–|—/g, '-')
    .toLowerCase()
    .replace(/\bper\s*cent\b|\bpercent\b/g, '%')
    .replace(/\bmicrogrammes?\b/g, 'micrograms')
    .replace(/(\d),(\d)/g, '$1$2')
    .replace(/[ \t]+/g, ' ')
}

/**
 * Sentences, and a newline counts as one boundary: a carousel slide and an X post both use line
 * breaks where prose would use a full stop, and a quote that spans four slides is not evidence.
 *
 * A COLON IS NOT A BOUNDARY, and that is not a style preference. "Under 25 nmol/L: deficient" is one
 * assertion written the way a capped surface writes it, and splitting there produced a quote reading
 * `under 25 nmol/l:` with the meaning in the fragment nobody would be shown.
 */
export function sentences(text: string): string[] {
  return normalise(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12)
}

export interface NumToken {
  /** Normalised numeric string, so 4000 and 4,000 compare equal. */
  value: string
  unit: string | null
  /** The boundary word in front of it, if any. */
  threshold: string | null
}

/**
 * Every number in the text, with the unit behind it and the boundary word in front. The three
 * together are what make a number a claim: `25 nmol/L` and `under 25` are thresholds, and the `40`
 * in "a 40 sits inside normal" is an illustration, which is why a bare number is not collected.
 */
export function numTokens(text: string): NumToken[] {
  const t = normalise(text)
  const unitAlt = CLINICAL_UNITS.map((u) => u.replace(/[/%]/g, (c) => `\\${c}`)).join('|')
  const re = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unitAlt})?`, 'g')
  const out: NumToken[] = []
  for (const m of t.matchAll(re)) {
    const before = t.slice(Math.max(0, m.index - 14), m.index)
    const after = t.slice(m.index + m[0].length, m.index + m[0].length + 8)
    const threshold = THRESHOLD_WORDS.find((w) => new RegExp(`\\b${w}\\s*$`).test(before)) ?? null
    // The OPENING number of a range carries its boundary word after it, not before: "75 to 125" and
    // "25 to 50" are how every threshold on a capped surface is written, and reading only backwards
    // collected the second number of each pair and dropped the first.
    const rangeStart = /^\s*(to|-|and)\s*\d/.test(after) ? 'range' : null
    const unit = m[2] ?? null
    // A number that is neither measured nor bounded asserts nothing on its own: the 40 in "a 40 sits
    // inside normal" is an illustration, and collecting it would manufacture a net-new claim.
    if (!unit && !threshold && !rangeStart) continue
    out.push({ value: m[1], unit, threshold: threshold ?? rangeStart })
  }
  return out
}

/** Two figures are the same figure when the values agree and neither side contradicts the other's
 *  unit. A capped surface prints "25 to 50" for what the signed claim calls "25 to 50 nmol/L", so
 *  demanding a unit on both sides would read every compressed range as net-new. */
export function sameFigure(a: NumToken, b: NumToken): boolean {
  if (a.value !== b.value) return false
  if (a.unit && b.unit) return a.unit === b.unit
  return true
}

/** The organisations a piece of text cites, canonicalised, so an alias is never read as a second
 *  body the copy failed to name. */
export function authoritiesIn(text: string): string[] {
  const t = normalise(text)
  return AUTHORITIES
    .filter((a) => a.patterns.some((p) => new RegExp(`\\b${p}\\b`).test(t)))
    .map((a) => a.canonical)
}

export function hedgesIn(text: string): string[] {
  const t = normalise(text)
  return HEDGES.filter((h) => new RegExp(`\\b${h}\\b`).test(t))
}

/** Content words, four letters or more, stopwords out. The overlap of these is what carries a claim
 *  that has no number in it at all. */
export function termsOf(text: string): Set<string> {
  const words = normalise(text).replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/)
  return new Set(words.filter((w) => w.length >= 4 && !STOPWORDS.has(w)))
}

// ═══════════════════════════════════════════════════════════════════ matching

export interface ClaimIn {
  id: string
  position: number
  claim: string
  source_name: string | null
}

export interface SurfaceIn {
  /** platform/format, or 'asset' when the copy is not surface-specific. */
  label: string
  body: string
  /** The channel's hard character ceiling, when it has one. */
  maxChars: number | null
}

export interface Fingerprint {
  numbers: NumToken[]
  authorities: string[]
  hedges: string[]
  terms: Set<string>
}

export function fingerprint(claim: ClaimIn): Fingerprint {
  // The source NAME counts as an authority the claim carries even when the sentence does not spell
  // it out, because that is where the attribution lives in the signed set.
  const withSource = `${claim.claim} ${claim.source_name ?? ''}`
  return {
    numbers: numTokens(claim.claim),
    authorities: authoritiesIn(withSource),
    hedges: hedgesIn(claim.claim),
    terms: termsOf(claim.claim),
  }
}

/**
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * THE DIRECTION OF THE WALK, WHICH IS THE DESIGN DECISION IN THIS FILE.
 *
 * The obvious build asks, of each of the 40 signed claims, "does this copy carry it". That was
 * written first and it over-matched badly: on a four-line X post about vitamin D thresholds it
 * reported five inherited claims, two of which (osteomalacia at 25 nmol/L, and the 4,000 IU
 * toxicity ceiling) appear nowhere in the post. They matched because clinical claims about one
 * marker SHARE their figures — four of the 40 claims mention 25 — and because a claim's own
 * distinctive language is exactly what a compressed derivative drops. Loosen the thresholds and it
 * invents inheritance; tighten them and it loses the real ones. There is no setting that does both,
 * because the question needs meaning and this tool does not have any.
 *
 * So it walks the other way: for each ASSERTION IN THE COPY, does the signed set cover it. That
 * question is mechanical, it is the question an ASA complaint asks (what did the copy say, not what
 * did it omit), and it fails in the safe direction — an assertion whose figure is nowhere in the set
 * is tier 3 and blocks, while a signed claim the copy never touches simply produces no row, which
 * is the truth about it.
 *
 * A claim with no figure in it cannot be reached from this direction at all. That is stated in the
 * report as coverage rather than hidden, and it is the human's half.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 */

export interface Assertion {
  quote: string
  surface: string
  figures: NumToken[]
  authorities: string[]
}

/** Every line of shipping copy that asserts something checkable. */
export function assertionsIn(surface: SurfaceIn): Assertion[] {
  const out: Assertion[] = []
  for (const s of sentences(surface.body)) {
    const figures = numTokens(s)
    const authorities = authoritiesIn(s)
    if (!figures.length && !authorities.length) continue
    out.push({ quote: s, surface: surface.label, figures, authorities })
  }
  return out
}

export interface Coverage {
  /** Figures stated in the copy that no claim in the signed set carries. */
  uncoveredFigures: NumToken[]
  /** Bodies cited in the copy that the signed set does not cite. */
  uncoveredAuthorities: string[]
  /** The signed claim this assertion most plausibly inherits from: the one sharing the most of its
   *  figures, earliest position breaking a tie. Null when the assertion states no covered figure. */
  source: ClaimIn | null
  sharedFigures: number
}

/**
 * Trace one assertion back to the signed set.
 *
 * TIES BREAK ON POSITION, DELIBERATELY. Where two signed claims carry the same figure the choice
 * between them is a judgement, and the tool does not have one; taking the earliest is arbitrary but
 * STABLE, so a re-run does not silently re-attribute a verdict a human has already read. The quote
 * is stored beside it, so the attribution is checkable by the person the packet goes to.
 */
export function trace(assertion: Assertion, claims: ClaimIn[], fps: Map<string, Fingerprint>): Coverage {
  const uncoveredFigures = assertion.figures.filter(
    (f) => !claims.some((c) => fps.get(c.id)!.numbers.some((n) => sameFigure(f, n))))
  const setAuthorities = new Set(claims.flatMap((c) => fps.get(c.id)!.authorities))
  const uncoveredAuthorities = assertion.authorities.filter((a) => !setAuthorities.has(a))

  let source: ClaimIn | null = null
  let sharedFigures = 0
  for (const c of claims) {
    const shared = assertion.figures.filter(
      (f) => fps.get(c.id)!.numbers.some((n) => sameFigure(f, n))).length
    if (shared > sharedFigures) { source = c; sharedFigures = shared }
  }
  return { uncoveredFigures, uncoveredAuthorities, source, sharedFigures }
}

// ═══════════════════════════════════════════════════════════════════ the ladder

export interface Verdict {
  claimId: string | null
  position: number | null
  tier: 1 | 2 | 3
  quote: string
  surface: string
  reason: string
}

export interface Unaccounted {
  surface: string
  quote: string
  shape: string
}

/**
 * One line per distinct quote, listing the surfaces it appears on.
 *
 * A CAROUSEL SHIPS THE SAME BODY THREE TIMES. The A/B/C variants of one deck are one piece of copy
 * tested three ways, so an un-deduplicated report printed every finding three times and made a
 * three-item review look like a nine-item one. The plan's own measure of this step is that it turns
 * a hand-assembled seven-item packet into three items; a report that inflates its own count fails
 * that on the first run.
 */
export function dedupeUnaccounted(items: Unaccounted[]): Unaccounted[] {
  const byQuote = new Map<string, { item: Unaccounted; surfaces: Set<string> }>()
  for (const u of items) {
    const seen = byQuote.get(u.quote)
    if (seen) seen.surfaces.add(u.surface)
    else byQuote.set(u.quote, { item: u, surfaces: new Set([u.surface]) })
  }
  return [...byQuote.values()].map(({ item, surfaces }) => ({
    ...item,
    surface: [...surfaces].sort().join(', '),
  }))
}

export interface Classification {
  verdicts: Verdict[]
  unaccounted: Unaccounted[]
  /** Non-null means nothing was classified and why. Never silently empty. */
  unchecked: string | null
  /** How much of the signed set this direction of walk can reach at all. Reported, never implied. */
  coverage: { claimsInSet: number; claimsWithFigures: number; assertionsRead: number }
}

/** Tier 2's second half, ruled explicitly: "on a surface that cannot carry the qualifier". */
export function surfaceIsCramped(surface: SurfaceIn): boolean {
  return surface.maxChars !== null && surface.maxChars <= 400
}

/**
 * Tier 1 or tier 2 for a claim the copy carries.
 *
 * The dropped attribution and the dropped hedge are the same failure seen from two sides: the copy
 * says the thing without saying what holds it up. Either one is tier 2 and goes to Ewa itemised,
 * because whether a squeezed line still means what she signed is the judgement she reserved.
 */
export function tierFor(
  source: ClaimIn, surface: SurfaceIn, assertion: Assertion, fp: Fingerprint,
): { tier: 1 | 2; reason: string } {
  const surfaceAuthorities = authoritiesIn(surface.body)
  const surfaceHedges = hedgesIn(surface.body)
  // Read against the WHOLE surface, not the sentence: a post that names NICE in its opening line and
  // states the threshold in its third has not dropped the attribution, and marking it tier 2 would
  // send Ewa a packet full of items that are fine.
  const authoritiesDropped = fp.authorities.filter((a) => !surfaceAuthorities.includes(a))
  const hedgesDropped = fp.hedges.filter((h) => !surfaceHedges.includes(h))

  const problems: string[] = []
  if (authoritiesDropped.length) {
    problems.push(`the attribution is nowhere on the surface (the signed claim rests on ${authoritiesDropped.join(', ')})`)
  }
  if (hedgesDropped.length) {
    problems.push(`the qualifier "${hedgesDropped.join('", "')}" is in the signed claim and nowhere in the copy`)
  }
  if (!problems.length) {
    return {
      tier: 1,
      reason: `states claim ${source.position}'s figure(s) with the attribution and qualifiers still on the surface. Tier 1 auto-passes with no Ewa, ruled 2026-08-18 (Q14).`,
    }
  }
  const cramped = surfaceIsCramped(surface)
    ? ` The surface caps at ${surface.maxChars} characters, which is the "on a surface that cannot carry the qualifier" half of tier 2 rather than an authoring choice.`
    : ''
  return { tier: 2, reason: `compressed against claim ${source.position}: ${problems.join('; ')}.${cramped}` }
}

/** Tier 3, from one traced assertion: the copy states a figure, or cites a body, that the signed set
 *  does not carry. It goes back to the ARTICLE rather than to Ewa as a derivative, per the ladder. */
export function netNewReason(cov: Coverage): string {
  const bits: string[] = []
  if (cov.uncoveredFigures.length) {
    bits.push(`figure(s) ${cov.uncoveredFigures.map((f) => f.unit ? `${f.value} ${f.unit}` : f.value).join(', ')} appear in no claim in the signed set`)
  }
  if (cov.uncoveredAuthorities.length) {
    bits.push(`cites ${cov.uncoveredAuthorities.join(', ')}, which the signed set does not`)
  }
  return `net-new: ${bits.join('; ')}. Tier 3 goes back to the article for clearance, not to Ewa as a derivative.`
}

/** Assertion shapes the classifier cannot map. Reported to a human, never written as a verdict. */
export function unaccountedIn(surface: SurfaceIn, accountedQuotes: Set<string>): Unaccounted[] {
  const out: Unaccounted[] = []
  for (const s of sentences(surface.body)) {
    if (accountedQuotes.has(s)) continue
    const shape = ASSERTION_SHAPES.find((sh) => sh.re.test(s))
    if (shape) out.push({ surface: surface.label, quote: s, shape: shape.name })
  }
  return out
}

/** One asset, every surface, the whole ladder. Pure: no database, no clock, no credentials. */
export function classify(claims: ClaimIn[], surfaces: SurfaceIn[]): Classification {
  const fps = new Map(claims.map((c) => [c.id, fingerprint(c)]))
  const coverage = {
    claimsInSet: claims.length,
    claimsWithFigures: claims.filter((c) => fps.get(c.id)!.numbers.length > 0).length,
    assertionsRead: 0,
  }
  const shippable = surfaces.filter((s) => s.body.trim().length > 0)
  if (!shippable.length) {
    return {
      verdicts: [], unaccounted: [], coverage,
      unchecked: `no rendition carries a body, so there is no shipping copy to classify. ${surfaces.length} surface(s) were offered and every one was empty. This is NOT a clean result: bridge the copy first (bridge-post-body.ts) and re-run.`,
    }
  }
  if (!claims.length) {
    return {
      verdicts: [], unaccounted: [], coverage,
      unchecked: 'the pinned claim set holds no claims, so nothing could be inherited from it.',
    }
  }

  // One verdict per (asset, claim), which is the shape the database enforces. A claim whose figures
  // appear on three surfaces is one inheritance, and the WORST tier decides: a threshold stated with
  // its attribution on LinkedIn and without it on X is a tier 2, because the tier has to describe the
  // weakest place the claim actually appears rather than the kindest.
  const byClaim = new Map<string, Verdict>()
  const netNew = new Map<string, Verdict>()
  const accounted = new Set<string>()

  for (const surface of shippable) {
    for (const assertion of assertionsIn(surface)) {
      coverage.assertionsRead += 1
      accounted.add(assertion.quote)
      const cov = trace(assertion, claims, fps)

      // An assertion can be BOTH: a covered threshold in the same line as an uncovered one. Both
      // rows are written, because closing the tier 2 would otherwise close the tier 3 with it.
      if (cov.uncoveredFigures.length || cov.uncoveredAuthorities.length) {
        if (!netNew.has(assertion.quote)) {
          netNew.set(assertion.quote, {
            claimId: null, position: null, tier: 3, quote: assertion.quote,
            surface: assertion.surface, reason: netNewReason(cov),
          })
        }
      }

      if (!cov.source) continue
      const { tier, reason } = tierFor(cov.source, surface, assertion, fps.get(cov.source.id)!)
      const existing = byClaim.get(cov.source.id)
      if (!existing || tier > existing.tier) {
        byClaim.set(cov.source.id, {
          claimId: cov.source.id, position: cov.source.position, tier,
          quote: assertion.quote, surface: assertion.surface, reason,
        })
      }
    }
  }

  const raw: Unaccounted[] = []
  for (const surface of shippable) raw.push(...unaccountedIn(surface, accounted))
  const unaccounted = dedupeUnaccounted(raw)

  const verdicts = [...byClaim.values(), ...netNew.values()]
  verdicts.sort((a, b) => a.tier - b.tier || (a.position ?? 999) - (b.position ?? 999))
  return { verdicts, unaccounted, unchecked: null, coverage }
}

// ═══════════════════════════════════════════════════════════════════ report

export const AUTO_PASS_REF = "Tier 1 auto-pass, ruled by Dr Ewa Lindo 2026-08-18 (Q14, consolidated packet)"

export interface AssetReport {
  slug: string
  topic: string
  setVersion: number
  setStatus: string
  surfaces: string[]
  result: Classification
  /** Rows a human resolved that this run would otherwise have rewritten. */
  keptResolved: { position: number | null; tier: number; resolution: string; ref: string }[]
}

export function render(reports: AssetReport[]): string {
  const L: string[] = []
  L.push('')
  L.push('classify-claims — plan step 5.3, the tier ladder (Ewa Q14, 2026-08-18)')
  L.push('')
  for (const r of reports) {
    const t = (n: number) => r.result.verdicts.filter((v) => v.tier === n).length
    // A ZERO-VERDICT ASSET IS NOT A PASSED ONE, and it gets its own label for that reason. Copy that
    // states no figure and cites nothing is copy this tool cannot reach at all, and labelling it
    // "tier 1 only" would be the empty-read-looks-clean failure the whole content machine is built
    // against: the ferritin carousel makes six mechanism claims and contains not one number.
    const nothingReachable = !r.result.unchecked && r.result.verdicts.length === 0
    const head = r.result.unchecked
      ? '⚪ UNCHECKED'
      : t(3) ? '🔴 TIER 3'
      : t(2) ? '🟠 TIER 2'
      : nothingReachable ? '⚫ NOTHING REACHABLE'
      : '🟢 TIER 1 ONLY'
    L.push(`${head}  ${r.slug}   [topic ${r.topic}, set v${r.setVersion} ${r.setStatus}]`)
    L.push(`             surfaces: ${r.surfaces.length ? r.surfaces.join(', ') : '(none)'}`)
    if (r.result.unchecked) {
      L.push(`             not measured: ${r.result.unchecked}`)
      L.push('')
      continue
    }
    L.push(`             ${t(1)} auto-passed, ${t(2)} for Ewa, ${t(3)} back to the article`)
    L.push(`             read ${r.result.coverage.assertionsRead} assertion(s) in the copy against ${r.result.coverage.claimsWithFigures} of ${r.result.coverage.claimsInSet} signed claims that carry a figure`)
    if (nothingReachable) {
      L.push('             the copy states no figure this tool could trace and cites nothing the set does not.')
      L.push('             THAT IS NOT A PASS: the whole claim-inheritance judgement on this asset is still a human\'s.')
    }
    for (const v of r.result.verdicts.filter((x) => x.tier === 3)) {
      L.push(`   ✗ tier 3  [${v.surface}] "${v.quote}"`)
      L.push(`               ${v.reason}`)
    }
    for (const v of r.result.verdicts.filter((x) => x.tier === 2)) {
      L.push(`   ! tier 2  claim ${v.position} [${v.surface}] "${v.quote}"`)
      L.push(`               ${v.reason}`)
    }
    const ones = r.result.verdicts.filter((x) => x.tier === 1).map((v) => v.position).join(', ')
    if (ones) L.push(`   · tier 1  claims ${ones} — auto-passed, no Ewa (Q14)`)
    for (const u of r.result.unaccounted) {
      L.push(`   ? unaccounted [${u.surface}, ${u.shape}] "${u.quote}"`)
      L.push('               carries an assertion shape with no figure and no attribution, so this tool cannot map it. A human decides; it is deliberately not a row.')
    }
    for (const k of r.keptResolved) {
      L.push(`   ✓ kept    claim ${k.position ?? '(net-new)'} tier ${k.tier} — ${k.resolution}, ${k.ref}. A human closed this; the run left it alone.`)
    }
    L.push('')
  }

  const checked = reports.filter((r) => !r.result.unchecked)
  const reachable = checked.filter((r) => r.result.verdicts.length > 0)
  const tally = (n: number) => checked.reduce((a, r) => a + r.result.verdicts.filter((v) => v.tier === n).length, 0)
  L.push(`${reports.length} asset(s): ${reachable.length} classified, ${checked.length - reachable.length} with NOTHING REACHABLE, ${reports.length - checked.length} UNCHECKED.`)
  L.push(`${tally(1)} tier 1 (auto-passed), ${tally(2)} tier 2 (to Ewa, itemised), ${tally(3)} tier 3 (back to the article).`)
  L.push(`${checked.reduce((a, r) => a + r.result.unaccounted.length, 0)} line(s) UNACCOUNTED: not classified, not cleared, and a human's to read.`)
  L.push('')
  L.push('This is the MECHANICAL half of the claim-inheritance check: figures, units, attributions and')
  L.push('qualifiers. It does not read meaning, so a tier-1-only verdict is not a claim check on its own.')
  return L.join('\n')
}

// ═══════════════════════════════════════════════════════════════════ IO

interface Row { [k: string]: unknown }

async function run() {
  loadEnvLocal()
  const argv = process.argv.slice(2)
  const APPLY = argv.includes('--apply')
  const ALL = argv.includes('--all')
  const slugAt = argv.indexOf('--slug')
  const slug = slugAt >= 0 ? argv[slugAt + 1] : ''
  if (!ALL && !slug) throw new Error('need --slug <asset-slug> or --all')

  const db = admin()

  let q = db.from('content_assets')
    .select('id, slug, claim_set_id, status')
    .not('claim_set_id', 'is', null)
  if (!ALL) q = q.eq('slug', slug)
  const { data: assets, error: aErr } = await q.order('slug')
  if (aErr) throw new Error(`read content_assets: ${aErr.message}`)
  if (!assets?.length) {
    throw new Error(ALL
      ? 'no asset is pinned to a claim set. Step 5.2 pins them; nothing to classify.'
      : `asset "${slug}" is not pinned to a claim set. Pin it first (step 5.2), or it has no signed set to inherit from.`)
  }

  const setIds = [...new Set(assets.map((a) => String(a.claim_set_id)))]
  const [setsRes, claimsRes, rendsRes, chRes] = await Promise.all([
    db.from('content_claim_sets').select('id, version, status, topic_id, content_topics(slug)').in('id', setIds),
    db.from('content_claims').select('id, claim_set_id, position, claim, source_name').in('claim_set_id', setIds).order('position'),
    db.from('content_renditions').select('asset_id, platform, format, variant, body').in('asset_id', assets.map((a) => a.id)),
    db.from('content_channels').select('platform, format, body_max_chars'),
  ])
  for (const [what, res] of [['content_claim_sets', setsRes], ['content_claims', claimsRes],
    ['content_renditions', rendsRes], ['content_channels', chRes]] as const) {
    if (res.error) throw new Error(`read ${what}: ${res.error.message}`)
  }

  const sets = new Map((setsRes.data ?? []).map((s: Row) => [String(s.id), s]))
  const claimsBySet = new Map<string, ClaimIn[]>()
  for (const c of (claimsRes.data ?? []) as Row[]) {
    const k = String(c.claim_set_id)
    const list = claimsBySet.get(k) ?? []
    list.push({ id: String(c.id), position: Number(c.position), claim: String(c.claim), source_name: (c.source_name as string) ?? null })
    claimsBySet.set(k, list)
  }
  const limits = new Map((chRes.data ?? []).map((c: Row) =>
    [`${c.platform}/${c.format}`, c.body_max_chars === null ? null : Number(c.body_max_chars)]))
  const rendsByAsset = new Map<string, Row[]>()
  for (const r of (rendsRes.data ?? []) as Row[]) {
    const k = String(r.asset_id)
    const list = rendsByAsset.get(k) ?? []
    list.push(r)
    rendsByAsset.set(k, list)
  }

  const reports: AssetReport[] = []
  for (const a of assets) {
    const setId = String(a.claim_set_id)
    const set = sets.get(setId) as Row | undefined
    const claims = claimsBySet.get(setId) ?? []
    // The variant is part of the label because three carousel rows carry three copies of one body,
    // and a report that cannot tell them apart says "instagram/carousel" three times.
    const surfaces: SurfaceIn[] = (rendsByAsset.get(String(a.id)) ?? []).map((r) => ({
      label: `${r.platform}/${r.format}${r.variant ? `(${String(r.variant).toLowerCase()})` : ''}`,
      body: String(r.body ?? ''),
      maxChars: limits.get(`${r.platform}/${r.format}`) ?? null,
    }))
    const result = classify(claims, surfaces)

    // What a human has already decided on this asset, read BEFORE writing anything.
    const { data: existing, error: eErr } = await db.from('content_asset_claims')
      .select('id, claim_id, tier, resolution, resolution_ref, quote')
      .eq('asset_id', String(a.id))
    if (eErr) throw new Error(`read content_asset_claims: ${eErr.message}`)
    const humanResolved = (existing ?? []).filter(
      (r: Row) => r.resolution !== null && r.resolution !== 'auto-pass')

    const posOf = new Map(claims.map((c) => [c.id, c.position]))
    reports.push({
      slug: String(a.slug),
      topic: String((set?.content_topics as Row | undefined)?.slug ?? '(unknown)'),
      setVersion: Number(set?.version ?? 0),
      setStatus: String(set?.status ?? '(unknown)'),
      surfaces: surfaces.filter((s) => s.body.trim()).map((s) => s.label),
      result,
      keptResolved: humanResolved.map((r: Row) => ({
        position: r.claim_id ? posOf.get(String(r.claim_id)) ?? null : null,
        tier: Number(r.tier),
        resolution: String(r.resolution),
        ref: String(r.resolution_ref ?? ''),
      })),
    })

    if (!APPLY) continue

    // ── Write. Never touches a row a human resolved, and never writes a resolution except the
    // tier 1 auto-pass, which is Ewa's ruling rather than this tool's opinion.
    const keepIds = new Set(humanResolved.map((r: Row) => String(r.id)))
    const staleIds = (existing ?? []).filter((r: Row) => !keepIds.has(String(r.id))).map((r: Row) => String(r.id))
    if (staleIds.length) {
      const { error } = await db.from('content_asset_claims').delete().in('id', staleIds)
      if (error) throw new Error(`clear previous classification for ${a.slug}: ${error.message}`)
    }
    const keptClaimIds = new Set(humanResolved.filter((r: Row) => r.claim_id).map((r: Row) => String(r.claim_id)))
    const keptQuotes = new Set(humanResolved.filter((r: Row) => !r.claim_id).map((r: Row) => String(r.quote)))
    const rows = result.verdicts
      .filter((v) => (v.claimId ? !keptClaimIds.has(v.claimId) : !keptQuotes.has(v.quote)))
      .map((v) => ({
        asset_id: String(a.id),
        claim_set_id: setId,
        claim_id: v.claimId,
        tier: v.tier,
        quote: v.quote,
        surface: v.surface,
        reason: v.reason,
        resolution: v.tier === 1 ? 'auto-pass' : null,
        resolution_ref: v.tier === 1 ? AUTO_PASS_REF : null,
        resolved_at: v.tier === 1 ? new Date().toISOString() : null,
      }))
    if (rows.length) {
      const { error } = await db.from('content_asset_claims').insert(rows as never)
      if (error) throw new Error(`write classification for ${a.slug}: ${error.message}`)
    }

    // STAMPED EVEN WHEN NOTHING WAS FOUND, and especially then. Copy with no figure in it classifies
    // perfectly and writes no rows, so the row count cannot tell "we looked and there was nothing"
    // from "nobody has ever looked". This column is the only thing that can.
    //
    // NOT STAMPED WHEN THE RUN WAS UNCHECKED. An asset with no shippable copy was not classified, it
    // was skipped, and writing the date would turn the one honest gap in this table into a green one.
    if (result.unchecked) continue
    const { error: stampErr } = await db.from('content_assets')
      .update({ claims_classified_at: new Date().toISOString() } as never)
      .eq('id', String(a.id))
    if (stampErr) throw new Error(`stamp claims_classified_at for ${a.slug}: ${stampErr.message}`)
  }

  console.log(render(reports))
  if (!APPLY) {
    console.log('\n[dry] nothing was written. Re-run with --apply to record these verdicts.\n')
  } else {
    const t2 = reports.reduce((n, r) => n + r.result.verdicts.filter((v) => v.tier === 2).length, 0)
    const t3 = reports.reduce((n, r) => n + r.result.verdicts.filter((v) => v.tier === 3).length, 0)
    console.log(`\n[live] written. ${t2 + t3} open verdict(s) above tier 1 now BLOCK their rendition from`)
    console.log('scheduling or publishing, by database gate. Tier 2 goes to Ewa itemised; tier 3 goes')
    console.log('back to the article. Nothing was approved and no sign-off was recorded.\n')
    await logRun({
      agent: 'classify-claims',
      itemRef: ALL ? 'all-pinned' : slug,
      status: 'ok',
      detail: {
        assets: reports.length,
        unchecked: reports.filter((r) => r.result.unchecked).length,
        tier1: reports.reduce((n, r) => n + r.result.verdicts.filter((v) => v.tier === 1).length, 0),
        tier2: t2, tier3: t3,
        unaccounted: reports.reduce((n, r) => n + r.result.unaccounted.length, 0),
      },
    })
  }
}

// Only run when invoked directly, so the pure functions above can be imported by the test.
if (process.argv[1] && /classify-claims\.ts$/.test(process.argv[1])) {
  run().catch(async (e) => {
    console.error('CLASSIFY-CLAIMS ERROR:', (e as Error).message)
    process.exit(1)
  })
}
