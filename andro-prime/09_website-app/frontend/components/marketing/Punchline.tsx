import { ReactNode } from 'react'

interface PunchlineProps {
  children: ReactNode
}

/**
 * RUNG 4: the `--sunk` ground a third time, and the ACCENT rule is what lifts
 * it. This is the first piece a reader's eye is PULLED to rather than led to.
 *
 * The emphatic one-liner that lands a section. Author it inline with no blank
 * lines so MDX passes raw text rather than wrapping it in a <p>.
 *
 * ⚠ Note it is no longer uppercase. The V2.0 version set it in uppercase black
 * sans; under the Direction F typography ruling the display face carries the
 * emphasis, and uppercasing a display serif at this size reads as shouting
 * rather than as landing.
 */
export default function Punchline({ children }: PunchlineProps) {
  return <div className="fb-mx fb-punch">{children}</div>
}
