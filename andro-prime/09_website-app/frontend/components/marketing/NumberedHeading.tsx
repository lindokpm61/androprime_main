import { ReactNode } from 'react'

interface NumberedHeadingProps {
  // Badge label, e.g. "01". Passed as a string so leading zeros are preserved.
  n: string
  // feature: the emphasised inverted variant, for the final or pivotal item.
  feature?: boolean
  children: ReactNode
}

/**
 * Not a ladder rung, for the same reason as SysHeading: it is an H3.
 *
 * The numeral takes the ACCENT, which is the one place in the article body
 * where the accent marks sequence rather than emphasis. `feature` inverts the
 * whole row for the pivotal item in a numbered run.
 *
 * Wrapped in a <div> so the `.fb-prose > h3` rules do not double-apply.
 */
export default function NumberedHeading({ n, feature = false, children }: NumberedHeadingProps) {
  return (
    <div className={feature ? 'fb-num fb-num-feat f-on-ink' : 'fb-num'}>
      <span className="fb-num-n">{n}</span>
      <h3>{children}</h3>
    </div>
  )
}
