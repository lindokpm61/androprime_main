// Pure logic for the Van Westendorp WTP block inside the test-selector quiz
// (07_sales/funnel/site-funnel-model.md §4). Client-safe: no server imports, no
// env reads — the quiz component and the test script both import from here.
//
// The block prices the BUNDLE concept matching the recommended kit (test now,
// the same retest later, one order), asked BEFORE any price is shown so the
// read is un-anchored. Bundle prices are dark behind BUNDLES_ENABLED and have
// never been shown publicly, which is what makes this read clean. Ratified by
// Keith 2026-07-25 (resolves the §4 bundle-alignment flag).

export type QuizKitSlug = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

// Mirrors BUNDLE_CONFIG in lib/bundles/config.ts (baseKitType → bundle type).
// Kept as a local literal so the client bundle does not pull in the bundles
// module (it imports the results classifier). scripts/test-quiz-wtp.ts asserts
// this map stays in sync with BUNDLE_CONFIG.
export const KIT_TO_BUNDLE: Record<QuizKitSlug, 'confirmation' | 'prove_it' | 'full_picture'> = {
  'testosterone': 'confirmation',
  'energy-recovery': 'prove_it',
  'hormone-recovery': 'full_picture',
}

export const AGE_BANDS = ['18-24', '25-34', '35-44', '45-54', '55+'] as const
export type AgeBand = (typeof AGE_BANDS)[number]

// Upper sanity cap on a single WTP answer. Well above any plausible bundle
// price; anything higher is treated as noise/typo and rejected client-side.
export const WTP_MAX_GBP = 999

/**
 * Parse a raw £ input into pounds. Accepts "£120", "120.50", "1,200" style
 * input; strips currency symbol, commas, and whitespace. Returns null unless
 * the result is a finite number in (0, WTP_MAX_GBP]. Rounded to pennies.
 */
export function parsePrice(raw: string): number | null {
  const n = Number.parseFloat(raw.replace(/[£,\s]/g, ''))
  if (!Number.isFinite(n) || n <= 0 || n > WTP_MAX_GBP) return null
  return Math.round(n * 100) / 100
}

export interface WtpAnswers {
  tooCheap: number
  bargain: number
  expensive: number
  tooExpensive: number
}

/**
 * Parse all four raw inputs; null if any single answer fails parsePrice.
 * Deliberately does NOT enforce monotonic ordering — Van Westendorp analysis
 * filters non-monotonic responses at read time, and hard-enforcing it here
 * would coach answers into our expected shape.
 */
export function parseWtpAnswers(raw: {
  tooCheap: string
  bargain: string
  expensive: string
  tooExpensive: string
}): WtpAnswers | null {
  const tooCheap = parsePrice(raw.tooCheap)
  const bargain = parsePrice(raw.bargain)
  const expensive = parsePrice(raw.expensive)
  const tooExpensive = parsePrice(raw.tooExpensive)
  if (tooCheap === null || bargain === null || expensive === null || tooExpensive === null) {
    return null
  }
  return { tooCheap, bargain, expensive, tooExpensive }
}

/** True when answers run lowest→highest (soft nudge only; never blocks). */
export function isMonotonic(a: WtpAnswers): boolean {
  return a.tooCheap <= a.bargain && a.bargain <= a.expensive && a.expensive <= a.tooExpensive
}

/**
 * Build the quiz_wtp event props. Answered rows carry the four prices + age
 * band + a client-computed monotonic flag; skip rows carry skipped:true only
 * (denominator for block completion, no answers). Anonymous by design — no
 * email, no identity keys, ever.
 */
export function buildWtpProps(input: {
  recommendedKit: QuizKitSlug
  symptomFlags: string[]
  answers: WtpAnswers | null
  ageBand: string
}): Record<string, unknown> {
  const base = {
    recommended_kit: input.recommendedKit,
    bundle_concept: KIT_TO_BUNDLE[input.recommendedKit],
    symptom_flags: input.symptomFlags,
  }
  if (!input.answers) return { ...base, skipped: true }
  return {
    ...base,
    skipped: false,
    wtp_too_cheap: input.answers.tooCheap,
    wtp_bargain: input.answers.bargain,
    wtp_expensive: input.answers.expensive,
    wtp_too_expensive: input.answers.tooExpensive,
    age_band: input.ageBand,
    monotonic: isMonotonic(input.answers),
  }
}
