import { ReactNode } from 'react'

interface CaveatProps {
  children: ReactNode
}

/**
 * RUNG 1 of the emphasis ladder (styles/components/f-blog.css): the quietest
 * aside. No fill at all, a hairline rule, italic, `--ink-3`.
 *
 * This is the "suggestive, not diagnostic" caveat that recurs through the
 * articles. It has to be the quietest piece in the system because it appears
 * most often, and a caveat that shouts stops being read.
 *
 * Rendered as a <div>, not a <p>: MDX wraps text children in <p>, and a
 * <p>-inside-<p> is invalid HTML and triggers a React hydration error.
 */
export default function Caveat({ children }: CaveatProps) {
  return <div className="fb-mx fb-caveat">{children}</div>
}
