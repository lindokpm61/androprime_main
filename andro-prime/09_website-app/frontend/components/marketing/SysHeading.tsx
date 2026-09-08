import { ReactNode } from 'react'

interface SysHeadingProps {
  children: ReactNode
}

/**
 * Not a ladder rung: this is a HEADING, so it competes with the article's H2s
 * rather than with its asides. A mono chip on ink above a display H2.
 *
 * Opt-in decorative section opener, NOT applied to every H2. Wrapped in a
 * <div> so the `.fb-prose > h2` rules do not double-apply; the styling here is
 * self-contained.
 *
 * ⚠ The "SYS:" literal is gone. It was a brutalist affectation that read as a
 * machine prefix on a page that no longer speaks that way, and it forced every
 * heading using this component to be parsed as "SYS: <thing>". The chip now
 * carries the section word itself.
 */
export default function SysHeading({ children }: SysHeadingProps) {
  return (
    <div className="fb-sys">
      <span className="fb-sys-chip">Section</span>
      <h2>{children}</h2>
    </div>
  )
}
