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
  /*
   * Rebuilt in Direction F on 2026-09-11. The two class strings are written out
   * rather than composed, so `verify-f-classes.js` can see both: a name that only
   * ever exists inside a joined array reaches it as nothing, and its rule is then
   * reported unused for ever after. See `/account`'s header for the long version.
   *
   * 🔴 `.f-mkbadge`, NOT `.f-stat`. That one is the PROCESS badge for orders and
   * billing. This carries the engine's clinical verdict vocabulary, and the two
   * must not share a class.
   */
  return (
    <span className={filled ? 'f-mkbadge f-mkbadge-on' : 'f-mkbadge'}>{label}</span>
  )
}
