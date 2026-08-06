import type { ResultState } from '@/lib/results/types'

interface StatusBadgeProps {
  state: ResultState
}

interface BadgeConfig {
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
const BADGES: Record<ResultState, BadgeConfig> = {
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

  // See your GP: the GP-block set plus every low-testosterone sub-band.
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
const UNKNOWN_STATE: BadgeConfig = { label: 'Reported', filled: false }

function getBadgeConfig(state: ResultState): BadgeConfig {
  return BADGES[state] ?? UNKNOWN_STATE
}

export function StatusBadge({ state }: StatusBadgeProps) {
  const { label, filled } = getBadgeConfig(state)
  return (
    <span
      className={[
        'shrink-0 border-2 border-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.15em] w-max',
        filled ? 'bg-black text-white' : 'bg-white text-black',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
