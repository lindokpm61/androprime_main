import type { ResultState } from '@/lib/results/types'
import { badgeFor } from '@/lib/results/resultSeverity'

interface StatusBadgeProps {
  state: ResultState
}

// The badge map moved to lib/results/resultSeverity.ts on 2026-08-26, verbatim
// and with no copy changes. The membership screen needs the same "is anything
// wrong here" answer, and the alternative was a second list of states that
// would be invisible exactly while it agreed with this one. Rendering is all
// that is left in this file; the decision lives in one place and both surfaces
// read it.
export function StatusBadge({ state }: StatusBadgeProps) {
  const { label, filled } = badgeFor(state)
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
