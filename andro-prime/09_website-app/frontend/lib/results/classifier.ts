import { BIOMARKER_COPY } from './biomarker-copy'
import type {
  NormalisedBiomarker,
  ClassifiedResult,
  ResultState,
  RecommendationStrategy,
  Cta,
  KitType,
  BarZone,
} from './types'

export interface ClassifierInput {
  kitType: KitType
  biomarkers: NormalisedBiomarker[]
  symptomAnswers: Array<{ questionKey: string; answer: unknown }>
  qualifierResponses: Array<{ questionKey: string; answer: unknown }>
  userAge: number | null
}

const CTAS: Record<string, Cta> = {
  dailyStackZinc: {
    type: 'daily-stack-zinc',
    label: 'Try the Daily Stack',
    href: '/supplements/daily-stack',
  },
  dailyStackD3: {
    type: 'daily-stack-d3',
    label: 'Try the Daily Stack',
    href: '/supplements/daily-stack',
  },
  dailyStackB12: {
    type: 'daily-stack-b12',
    label: 'Try the Daily Stack',
    href: '/supplements/daily-stack',
  },
  completeMensStack: {
    type: 'complete-mens-stack',
    label: "Try the Complete Men's Stack",
    href: '/supplements/complete-mens-stack',
  },
  collagen: {
    type: 'collagen',
    label: 'Try Joint & Recovery Collagen',
    href: '/supplements/collagen',
  },
  lifestyleGuidance: {
    type: 'lifestyle-guidance',
    label: 'Read our lifestyle guidance',
    href: '/guides/lifestyle',
  },
  kit2CrossSell: {
    type: 'kit-2-cross-sell',
    label: 'Test your energy markers',
    href: '/kits/energy-recovery',
  },
  kit1CrossSell: {
    type: 'kit-1-cross-sell',
    label: 'Test your testosterone',
    href: '/kits/testosterone',
  },
  retestReminder: {
    type: 'retest-reminder',
    label: 'Retest in 6–12 months',
    href: '/kits',
  },
  gpReferral: {
    type: 'gp-referral',
    label: 'Speak to your GP',
    href: '/gp-referral',
  },
  // Phase 0a opt-in CTA: the supplement range is deferred behind the kit
  // launch, so the result cards that would have promoted Daily Stack,
  // Collagen, or Complete Men's Stack now route to a single email-capture
  // form instead. The result card receives the marker `state` via the
  // `ClassifiedResult.state` field and passes it down to
  // `SupplementWaitlistForm` as `sourceMarker`; the CTA object itself
  // stays pure (no per-marker variation) so the `Cta` type does not need
  // to grow a payload field.
  supplementWaitlist: {
    type: 'supplement-waitlist',
    label: 'Join the supplement early-access list',
    href: '/supplement-waitlist',
  },
  // All-clear maintenance offer (dark, behind MAINTENANCE_OFFER_ENABLED). Only
  // ever emitted on the all-clear path when the flag is ON. Label/destination
  // are waitlist-honest (Phase 0a has no purchasable supplements). The per-kit
  // claims block is chosen at render time by kit type (see maintenanceOfferCopy).
  maintenanceOffer: {
    type: 'maintenance-offer',
    label: 'Join the supplement waitlist',
    href: '/supplement-waitlist',
  },
}

// Feature flag (dark launch) for the all-clear maintenance offer. Read LIVE from
// the environment on every call so flag-OFF is provably inert: the value must be
// exactly the string 'true' to enable. Absent / any other value → false → the
// classifier can never emit the maintenance-offer CTA, and output is byte-
// identical to before this feature existed. The classifier runs server-side
// (getDashboardData / processResult), so a server-side env read is correct and
// the flag value never ships to the client bundle. Pending Ewa + compliance
// sign-off before it is ever turned on. See
// 07_sales/funnel/all-clear-maintenance-offer-copy.md.
export function isMaintenanceOfferEnabled(): boolean {
  return process.env.MAINTENANCE_OFFER_ENABLED === 'true'
}

// In-range ("clear") result states. A result is all-clear only when EVERY
// measured marker resolves to one of these AND (where testosterone is measured)
// testosterone is all-clear rather than borderline. Any deficiency, GP-block,
// low-T, borderline-T, or otherwise out-of-band state is deliberately excluded,
// so those results never reach the maintenance offer.
const CLEAR_STATES: ResultState[] = [
  'normal-testosterone',
  'optimal-testosterone',
  'shbg-normal',
  'ft-normal',
  'normal-vitamin-d',
  'normal-crp',
  'normal-ferritin',
  'normal-b12',
  'normal-albumin',
  'normal',
]

// Whole-result all-clear test used only by the maintenance-offer branch.
//   Kit 1 / Kit 3: testosterone present → isTestosteroneAllClear() true (≥ 15,
//                  so neither low < 12 nor borderline 12–<15) AND every other
//                  measured marker in its normal band.
//   Kit 2:         no testosterone marker → all energy markers normal.
// Borderline testosterone (12–<15) resolves to `normal-testosterone` but is NOT
// all-clear, so it is caught by the explicit isTestosteroneAllClear() check.
function isResultAllClear(input: ClassifierInput): boolean {
  for (const b of input.biomarkers) {
    if (!CLEAR_STATES.includes(resolveState(b))) return false
  }
  const t = input.biomarkers.find((b) => b.markerName === 'Testosterone')
  if (t && !isTestosteroneAllClear(t.value)) return false
  return true
}

// GP-block states route straight to a GP referral, never a product. Ewa
// threshold sign-off 2026-06-16 added `critically-low-vitamin-d` (<25 nmol/L is
// clinician-managed, not OTC) and `high-ferritin` (>300 µg/L was previously
// silent: a markedly raised ferritin now flags for GP work-up).
const GP_BLOCK_STATES: ResultState[] = [
  'high-crp',
  'low-ferritin',
  'low-albumin',
  'critically-low-vitamin-d',
  'high-ferritin',
]

// All sub-bands of clinically low total testosterone (< 12 nmol/L). Ewa
// sign-off 2026-06-16 split the old single `< 12` low band into three
// (severely-low < 5.2, low 5.2–8, equivocal 8–12). All route to GP; the
// severely-low band additionally flags for endocrinology in its copy. Kept
// out of GP_BLOCK_STATES so the dedicated low-T branch (no upsell + nurture
// consent) still owns the routing.
const LOW_T_STATES: ResultState[] = [
  'severely-low-testosterone',
  'low-testosterone',
  'equivocal-testosterone',
]

// Borderline total testosterone (12 ≤ T < 15 nmol/L): a low-end-of-normal
// result. This is deliberately NOT a classifier ResultState — it overlaps
// `normal-testosterone` (12–20) and does not change the result card's clinical
// classification or copy. It exists only to (a) gate the borderline nurture
// opt-in shown on the dashboard, which feeds seq-03d, and (b) exclude these
// profiles from the `results_all_clear` reassurance signal that drives seq-03c.
// T < 12 is the clinically-low band (LOW_T_STATES, GP-routed); T ≥ 15 is
// all-clear. See docs/seq-03-results-signal-fix-spec-2026-06-26.md.
export const BORDERLINE_T_FLOOR = 12
export const BORDERLINE_T_CEILING = 15

export function isBorderlineTestosterone(value: number): boolean {
  return value >= BORDERLINE_T_FLOOR && value < BORDERLINE_T_CEILING
}

// All-clear for testosterone = neither low (< 12) nor borderline (12–<15).
export function isTestosteroneAllClear(value: number): boolean {
  return value >= BORDERLINE_T_CEILING
}

// Kit 3 defect fix (2026-05-23): `low-testosterone` and `normal-testosterone`
// were previously counted as deficiencies, which caused Kit 3 results with a
// low-T plus any other low marker to trip the multi-deficiency branch and
// surface the Complete Men's Stack CTA on every card — including the
// testosterone card, where the correct CTA is the GP referral (low-T routing
// decision 2026-06-04; was the founding-member list). Removing them here keeps
// testosterone routing on its own (GP referral or supplement-waitlist) and
// reserves multi-deficiency for genuine nutrient-deficiency stacking
// (Vitamin D + B12 + CRP).
// `critically-low-vitamin-d` was removed here on 2026-06-16: it is now a GP
// block (clinician-managed), so it should not also feed a supplement
// multi-deficiency upsell. `borderline-b12` (the new NG239 25–70 indeterminate
// band) is added so it keeps the multi-deficiency stacking signal the old
// single `< 37.5` low-B12 cut used to carry.
const DEFICIENCY_STATES: ResultState[] = [
  'ft-low',
  'low-vitamin-d',
  'elevated-crp',
  'moderate-crp',
  'low-b12',
  'borderline-b12',
]

function resolveState(b: NormalisedBiomarker): ResultState {
  const { markerName, value, referenceLow, referenceHigh } = b
  switch (markerName) {
    // Testosterone bands (Ewa sign-off 2026-06-16, CA-014): the old single
    // `< 12` low band is split into severely-low (< 5.2, endocrinology flag),
    // low/clear-deficiency (5.2–8) and equivocal (8–12). All three GP-route.
    case 'Testosterone':
      if (value < 5.2) return 'severely-low-testosterone'
      if (value < 8) return 'low-testosterone'
      if (value < 12) return 'equivocal-testosterone'
      if (value <= 20) return 'normal-testosterone'
      return 'optimal-testosterone'
    // SHBG is assay-specific and has no UK consensus range, so band against the
    // lab's own reference interval (Ewa sign-off 2026-06-16: "match the lab, no
    // fixed numbers"). Fall back to the prior 17–55 only if the lab omits a
    // reference range.
    case 'SHBG': {
      const low = referenceLow ?? 17
      const high = referenceHigh ?? 55
      if (value < low) return 'shbg-low'
      if (value <= high) return 'shbg-normal'
      return 'shbg-high'
    }
    case 'Free Testosterone':
      if (referenceLow !== null && value < referenceLow) return 'ft-low'
      return 'ft-normal'
    case 'Albumin':
      if (value < 35) return 'low-albumin'
      return 'normal-albumin'
    case 'Vitamin D':
      if (value < 25) return 'critically-low-vitamin-d'
      if (value < 50) return 'low-vitamin-d'
      return 'normal-vitamin-d'
    case 'hs-CRP':
      if (value > 10) return 'high-crp'
      if (value > 3) return 'moderate-crp'
      if (value > 1) return 'elevated-crp'
      return 'normal-crp'
    // Ferritin (Ewa sign-off 2026-06-16): added a high band (> 300 µg/L) that
    // routes to GP — previously anything over 100 was silently "normal", so a
    // markedly raised ferritin (haemochromatosis, liver, inflammation) was
    // never flagged. 300 chosen from Ewa's "300–400 is fine"; conservative end.
    case 'Ferritin':
      if (value < 30) return 'low-ferritin'
      if (value <= 100) return 'suboptimal-ferritin'
      if (value <= 300) return 'normal-ferritin'
      return 'high-ferritin'
    // Active B12 (Ewa sign-off 2026-06-16): NICE NG239 three-band scheme
    // replaces the old single `< 37.5` cut. < 25 low, 25–70 indeterminate,
    // > 70 normal.
    case 'Active B12':
      if (value < 25) return 'low-b12'
      if (value <= 70) return 'borderline-b12'
      return 'normal-b12'
    default:
      return 'normal'
  }
}

interface CtaResolution {
  primaryCta: Cta | null
  secondaryCta: Cta | null
  requiresQualifier: boolean
  qualifierKey: string | null
}

function resolveCtas(
  state: ResultState,
  recommendationStrategy: RecommendationStrategy,
  input: ClassifierInput
): CtaResolution {
  const base: CtaResolution = {
    primaryCta: null,
    secondaryCta: null,
    requiresQualifier: false,
    qualifierKey: null,
  }

  // GP hard blocks always override — no supplement CTA
  if (GP_BLOCK_STATES.includes(state)) {
    return { ...base, primaryCta: CTAS.gpReferral }
  }

  // Multi-deficiency overrides individual supplement CTAs (but not GP blocks).
  // Phase 0a (2026-05-23): supplement range deferred — was completeMensStack,
  // now routes to the supplement waitlist instead. Kit 2 still keeps the
  // kit-1 cross-sell as secondary.
  if (recommendationStrategy === 'multi-deficiency') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery') {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.supplementWaitlist, secondaryCta }
  }

  if (LOW_T_STATES.includes(state)) {
    // Low-T routing decision 2026-06-04 (Ewa signed off): a clinically-low
    // result routes to GP referral, not the founding-member list. No kit or
    // supplement upsell on this card (a definitive low-T has no ambiguity to
    // resolve). Covers all three sub-bands (severely-low / low / equivocal)
    // added by the 2026-06-16 sign-off; the severely-low card additionally
    // flags endocrinology in its copy. The consent-gated nurture capture that
    // sits alongside GP referral is built separately, pending the solicitor's
    // lawful basis. See 04_products/results-engine/2026-06-04-low-t-routing-decision.md.
    return {
      ...base,
      primaryCta: CTAS.gpReferral,
      secondaryCta: null,
    }
  }

  // All-clear maintenance offer (DARK — behind MAINTENANCE_OFFER_ENABLED,
  // default OFF, pending Ewa + compliance sign-off). Positioned deliberately
  // BELOW every GP-block (line ~237) and low-T (above) check, so those always
  // win; it is only reached when the WHOLE result is in range (isResultAllClear
  // re-derives that from all biomarkers, so a single out-of-band / borderline /
  // GP-routed marker suppresses it). When the flag is OFF this branch is skipped
  // entirely and classifier output is byte-identical to before the feature.
  if (isMaintenanceOfferEnabled() && isResultAllClear(input)) {
    return { ...base, primaryCta: CTAS.maintenanceOffer }
  }

  if (state === 'normal-testosterone') {
    if (input.kitType === 'testosterone') {
      // A normal-T Kit 1 buyer is offered the complementary Kit 2 (the
      // energy/recovery markers Kit 1 does not measure). The post-result
      // cross-sell is always the complement, never the superset Kit 3, which
      // would re-sell the testosterone panel he just bought.
      return {
        ...base,
        primaryCta: CTAS.supplementWaitlist,
        secondaryCta: CTAS.kit2CrossSell,
      }
    }
    // Kit 2 (energy-recovery) and Kit 3 (hormone-recovery): waitlist only, no
    // kit cross-sell.
    return { ...base, primaryCta: CTAS.supplementWaitlist }
  }

  if (state === 'optimal-testosterone') {
    return { ...base, primaryCta: CTAS.retestReminder }
  }

  // SHBG — no direct product CTA per spec
  if (state === 'shbg-low' || state === 'shbg-normal' || state === 'shbg-high') {
    return { ...base, primaryCta: CTAS.retestReminder }
  }

  // Free T — CTA logic follows Total T (FT-LOW with T-LOW handled by T-LOW card; no duplicate)
  if (state === 'ft-low' || state === 'ft-normal') {
    return { ...base, primaryCta: null }
  }

  // Note: `critically-low-vitamin-d` (< 25) is now a GP-block state (handled
  // above, 2026-06-16 sign-off), so it no longer reaches a supplement CTA here.

  if (state === 'low-vitamin-d') {
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.supplementWaitlist, secondaryCta }
  }

  if (state === 'elevated-crp' || state === 'moderate-crp') {
    const jointAnswer = input.qualifierResponses.find(
      (r) => r.questionKey === 'crp_joint_symptoms'
    )
    if (!jointAnswer) {
      return {
        ...base,
        requiresQualifier: true,
        qualifierKey: 'crp_joint_symptoms',
      }
    }
    // Phase 0a: joints=true was collagen, now supplement waitlist.
    // joints=false unchanged (lifestyle guidance, no supplement claim).
    return {
      ...base,
      primaryCta: jointAnswer.answer === true ? CTAS.supplementWaitlist : CTAS.lifestyleGuidance,
    }
  }

  if (state === 'suboptimal-ferritin') {
    // Dietary guidance only — no supplement CTA per spec
    return { ...base, primaryCta: null }
  }

  if (state === 'low-b12' || state === 'borderline-b12') {
    // Phase 0a: was dailyStackB12, now supplement waitlist. Kit 2 + 40+
    // kit-1 cross-sell secondary preserved. `borderline-b12` (NG239 25–70
    // indeterminate band, 2026-06-16 sign-off) shares this routing.
    let secondaryCta: Cta | null = null
    if (input.kitType === 'energy-recovery' && input.userAge !== null && input.userAge >= 40) {
      secondaryCta = CTAS.kit1CrossSell
    }
    return { ...base, primaryCta: CTAS.supplementWaitlist, secondaryCta }
  }

  // normal state
  return { ...base, primaryCta: CTAS.retestReminder }
}

const FT_LOW_WITH_LOW_T_RECOMMENDATION =
  'Your free testosterone is below range, and your total testosterone is also low. This combination is more significant than either in isolation. The most appropriate next step is to speak to your GP, who can confirm these results and discuss what they mean for you. Take your results with you.'

function resolveBarZones(b: NormalisedBiomarker): BarZone[] {
  switch (b.markerName) {
    case 'Testosterone':
      return [
        { color: 'critical', upTo: 12 },
        { color: 'warning', upTo: 20 },
        { color: 'optimal', upTo: null },
      ]
    case 'SHBG': {
      // Assay-matched to the lab reference range (2026-06-16 sign-off);
      // fall back to 17–55 only when the lab omits a range.
      const low = b.referenceLow ?? 17
      const high = b.referenceHigh ?? 55
      return [
        { color: 'warning', upTo: low },
        { color: 'optimal', upTo: high },
        { color: 'warning', upTo: null },
      ]
    }
    case 'Free Testosterone':
      return b.referenceLow !== null
        ? [{ color: 'critical', upTo: b.referenceLow }, { color: 'optimal', upTo: null }]
        : [{ color: 'optimal', upTo: null }]
    case 'Albumin':
      return [
        { color: 'critical', upTo: 35 },
        { color: 'optimal', upTo: null },
      ]
    case 'Vitamin D':
      return [
        { color: 'critical', upTo: 25 },
        { color: 'warning', upTo: 50 },
        { color: 'optimal', upTo: null },
      ]
    case 'hs-CRP':
      return [
        { color: 'optimal', upTo: 1.0 },
        { color: 'warning', upTo: 10.0 },
        { color: 'critical', upTo: null },
      ]
    case 'Ferritin':
      // High band (> 300) added 2026-06-16 — markedly raised ferritin now
      // shows as critical and routes to GP.
      return [
        { color: 'critical', upTo: 30 },
        { color: 'warning', upTo: 100 },
        { color: 'optimal', upTo: 300 },
        { color: 'critical', upTo: null },
      ]
    case 'Active B12':
      // NG239 three-band (2026-06-16): < 25 low, 25–70 indeterminate, > 70 normal.
      return [
        { color: 'critical', upTo: 25 },
        { color: 'warning', upTo: 70 },
        { color: 'optimal', upTo: null },
      ]
    default:
      // Fallback: derive from lab reference range
      return b.referenceLow !== null
        ? [{ color: 'critical', upTo: b.referenceLow }, { color: 'optimal', upTo: null }]
        : [{ color: 'optimal', upTo: null }]
  }
}

export function classify(input: ClassifierInput): ClassifiedResult[] {
  // Pass 1 — resolve state for each biomarker
  const withStates = input.biomarkers.map((b) => ({
    ...b,
    state: resolveState(b),
  }))

  // Pass 2 — deficiency count, set recommendation strategy
  const deficiencyCount = withStates.filter((b) =>
    DEFICIENCY_STATES.includes(b.state)
  ).length
  const hasMultiDeficiency = deficiencyCount >= 2

  const tState = withStates.find((b) => b.markerName === 'Testosterone')?.state

  // Pass 3 — resolve CTAs, copy, and build ClassifiedResult[]
  return withStates.map((b) => {
    const strategy: RecommendationStrategy =
      hasMultiDeficiency && DEFICIENCY_STATES.includes(b.state)
        ? 'multi-deficiency'
        : 'single'

    const copy = BIOMARKER_COPY[b.state]
    const ctaResolution = resolveCtas(b.state, strategy, input)

    // When FT-LOW and Total T is also low (any sub-band), override the default
    // FT recommendation with the combined low-T + low-free-T message.
    const recommendation =
      b.state === 'ft-low' && tState !== undefined && LOW_T_STATES.includes(tState)
        ? FT_LOW_WITH_LOW_T_RECOMMENDATION
        : copy.recommendation

    return {
      markerName: b.markerName,
      value: b.value,
      unit: b.unit,
      referenceLow: b.referenceLow,
      referenceHigh: b.referenceHigh,
      displayZones: resolveBarZones(b),
      state: b.state,
      stateLabel: copy.stateLabel,
      explanation: copy.explanation,
      educationContext: copy.educationContext,
      recommendation,
      recommendationStrategy: strategy,
      primaryCta: ctaResolution.primaryCta,
      secondaryCta: ctaResolution.secondaryCta,
      requiresQualifier: ctaResolution.requiresQualifier,
      qualifierKey: ctaResolution.qualifierKey,
    }
  })
}
