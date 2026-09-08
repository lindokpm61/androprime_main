import { ReactNode } from 'react'

interface NoteProps {
  children: ReactNode
}

/**
 * RUNG 2: the first rung with a ground. `--sunk` fill behind an ink rule.
 *
 * The "for further context" pointer block: louder than a Caveat, quieter than
 * a PullQuote. Author it with blank lines so the markdown body (including
 * links) parses inside.
 */
export default function Note({ children }: NoteProps) {
  return <div className="fb-mx fb-note">{children}</div>
}
