import type { ResultState } from '@/lib/results/types'

interface StatusBadgeProps {
  state: ResultState
}

interface BadgeConfig {
  label: string
  filled: boolean
}

function getBadgeConfig(state: ResultState): BadgeConfig {
  switch (state) {
    case 'optimal-testosterone':
    case 'ft-normal':
    case 'shbg-normal':
    case 'normal':
      return { label: 'Optimal', filled: false }
    case 'normal-testosterone':
    case 'shbg-low':
    case 'shbg-high':
    case 'elevated-crp':
    case 'moderate-crp':
    case 'suboptimal-ferritin':
    case 'borderline-b12':
      return { label: 'Monitor', filled: true }
    // Report-only (FAI). Not "Optimal", which is what it badged as while
    // falling through to `normal`, and not the "Action Needed" default either.
    // The badge is the most prominent verdict on the card, so a marker we do
    // not interpret needs a label that grades nothing.
    case 'fai-reported':
      return { label: 'Reported', filled: false }
    case 'high-crp':
    case 'low-albumin':
    case 'low-ferritin':
    case 'high-ferritin':
    case 'critically-low-vitamin-d':
    case 'severely-low-testosterone':
    case 'low-testosterone':
    case 'equivocal-testosterone':
      return { label: 'See Your GP', filled: true }
    default:
      return { label: 'Action Needed', filled: true }
  }
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
