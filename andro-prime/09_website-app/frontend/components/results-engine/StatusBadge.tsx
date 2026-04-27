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
      return { label: 'Monitor', filled: true }
    case 'high-crp':
    case 'low-albumin':
    case 'low-ferritin':
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
        'shrink-0 border-2 border-black group-hover:border-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest transition-colors w-max',
        filled
          ? 'bg-black text-white group-hover:bg-white group-hover:text-black'
          : 'bg-white text-black group-hover:bg-black group-hover:text-white',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
