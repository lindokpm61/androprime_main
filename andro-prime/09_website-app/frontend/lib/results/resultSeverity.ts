/**
 * How serious a result state is, as one exhaustive decision.
 *
 * MOVED HERE from components/results-engine/StatusBadge.tsx (2026-08-26),
 * verbatim and with no copy changes. It lived in the badge component because
 * the badge was the only thing that needed it; the membership screen now needs
 * the same answer, and the alternative was a second list of "which states mean
 * something is wrong". A duplicated fact is invisible exactly while the copies
 * agree, and the first correction is what makes it visible.
 *
 * The badge still renders from this map, so the two surfaces cannot disagree
 * about whether a man has a problem.
 */

import type { ResultState } from './types'

export interface BadgeConfig {
  label: string
  filled: boolean
}

// The badge is the most prominent verdict on a result card, so every state gets
// a label chosen for it. `Record<ResultState, BadgeConfig>` makes that a
// compile-time requirement: adding a state to the union without deciding its
// badge fails the build.
//
// This was a switch with `default: { label: 'Action Needed' }` until 2026-08-07.
// Eight states had quietly accumulated behind that default and five of them mean
// the result is FINE: a normal albumin, vitamin D, CRP, ferritin or B12 each
// badged ACTION NEEDED in solid black, sitting directly above Ewa-approved copy
// saying no action was needed. An all-clear Kit 2, the most common result we
// ship, showed four black alarms on four in-range markers. Nobody chose that;
// the default did. `BIOMARKER_COPY` in lib/results is already an exhaustive
// Record, which is exactly why the same class of bug never reached it.
//
// Vocabulary (Keith, 2026-08-07): "Optimal" is retired as the label for merely
// in-range, because we publish an article arguing that in-range is not the same
// as optimal and the badge should not contradict it. "In range" describes the
// number and claims nothing. "Optimal" survives on testosterone alone, where
// thresholds.md records the >20 band as a deliberate positive-framing product
// choice Ewa signed off.
export const BADGES: Record<ResultState, BadgeConfig> = {
  // Optimal: testosterone only. Not a clinical band, a signed product choice.
  'optimal-testosterone': { label: 'Optimal', filled: false },

  // In range: the result is fine, and the card says so underneath.
  'ft-normal': { label: 'In range', filled: false },
  'shbg-normal': { label: 'In range', filled: false },
  'normal-vitamin-d': { label: 'In range', filled: false },
  'normal-crp': { label: 'In range', filled: false },
  'normal-ferritin': { label: 'In range', filled: false },
  'normal-b12': { label: 'In range', filled: false },
  'normal-albumin': { label: 'In range', filled: false },
  // Generic fallback state, now only reachable by a marker the engine does not
  // recognise. Its copy still asserts "within the normal range" for anything
  // unknown, which is a separate fail-unsafe default worth closing.
  normal: { label: 'In range', filled: false },

  // Reported: carries no verdict at all (Ewa ruling 8, FAI is not banded in men).
  'fai-reported': { label: 'Reported', filled: false },

  // Monitor: in range but at an end of it, or an indeterminate band.
  'normal-testosterone': { label: 'Monitor', filled: true },
  'shbg-low': { label: 'Monitor', filled: true },
  'shbg-high': { label: 'Monitor', filled: true },
  'elevated-crp': { label: 'Monitor', filled: true },
  'moderate-crp': { label: 'Monitor', filled: true },
  'suboptimal-ferritin': { label: 'Monitor', filled: true },
  'borderline-b12': { label: 'Monitor', filled: true },

  // Action needed: a genuine deficiency the card routes to a next step. These
  // three previously landed on the default, so they read correctly by accident
  // rather than by decision. Listed explicitly now.
  'ft-low': { label: 'Action Needed', filled: true },
  'low-vitamin-d': { label: 'Action Needed', filled: true },
  'low-b12': { label: 'Action Needed', filled: true },

  // See your GP: the GP-block set plus every low-testosterone sub-band. The two
  // upper bands (Ewa, 2026-08-07) sit here too: above the lab's ceiling is a
  // clinical-review flag, not a "Monitor".
  'high-testosterone': { label: 'See Your GP', filled: true },
  'high-vitamin-d': { label: 'See Your GP', filled: true },
  'high-crp': { label: 'See Your GP', filled: true },
  'low-albumin': { label: 'See Your GP', filled: true },
  'low-ferritin': { label: 'See Your GP', filled: true },
  'high-ferritin': { label: 'See Your GP', filled: true },
  'critically-low-vitamin-d': { label: 'See Your GP', filled: true },
  'severely-low-testosterone': { label: 'See Your GP', filled: true },
  'low-testosterone': { label: 'See Your GP', filled: true },
  'equivocal-testosterone': { label: 'See Your GP', filled: true },
}

// The map is exhaustive over the type, but a stored result could still carry a
// state string this build does not know. Fail QUIET rather than loud: an
// unrecognised state gets the verdict-free badge, never an alarm. That is the
// runtime half of the same lesson, since the old default failed loud.
export const UNKNOWN_STATE: BadgeConfig = { label: 'Reported', filled: false }

export function badgeFor(state: ResultState): BadgeConfig {
  return BADGES[state] ?? UNKNOWN_STATE
}

/**
 * Does this state mean something needs attention?
 *
 * `filled` is already exactly that decision: the badge is solid black for
 * Monitor, Action Needed and See Your GP, and outlined for Optimal, In range
 * and Reported. Deriving from it rather than listing the states again means
 * this answer can never drift from what the customer sees on the result card.
 *
 * An unknown state is NOT flagged, matching the badge's fail-quiet rule. On a
 * membership screen that is the safe direction: it withholds a "one number to
 * move" claim rather than inventing one.
 */
export function isFlaggedState(state: ResultState): boolean {
  return badgeFor(state).filled
}

/** True when ANY of these states needs attention. The all-clear test, inverted. */
export function anyFlagged(states: readonly ResultState[]): boolean {
  return states.some(isFlaggedState)
}
