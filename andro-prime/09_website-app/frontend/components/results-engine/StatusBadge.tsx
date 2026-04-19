import type { ResultState } from '@/lib/results/types'

interface StatusBadgeProps {
  state: ResultState
}

interface BadgeConfig {
  label: string
  className: string
}

function getBadgeConfig(state: ResultState): BadgeConfig {
  switch (state) {
    case 'optimal-testosterone':
    case 'normal':
      return { label: 'Optimal', className: 'status-badge--optimal' }
    case 'normal-testosterone':
    case 'elevated-crp':
      return { label: 'Keep an eye on it', className: 'status-badge--warning' }
    case 'high-crp':
    case 'low-albumin':
      return { label: 'See your GP', className: 'status-badge--critical' }
    default:
      return { label: 'Needs attention', className: 'status-badge--attention' }
  }
}

export function StatusBadge({ state }: StatusBadgeProps) {
  const { label, className } = getBadgeConfig(state)
  return <span className={`status-badge ${className}`}>{label}</span>
}
