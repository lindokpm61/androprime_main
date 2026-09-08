import { ReactNode } from 'react'

interface PullQuoteProps {
  quote?: string
  children?: ReactNode
  className?: string
}

/**
 * RUNG 3: same `--sunk` ground as Note, heavier rule, larger italic.
 *
 * The rung is shared with Note deliberately: a pull quote is the same KIND of
 * interruption, just louder, so it earns weight rather than a new colour.
 *
 * Inner element is a <div>, not a <p>, because MDX auto-wraps text children in
 * <p> and a <p>-inside-<p> is invalid HTML.
 */
export default function PullQuote({ quote, children, className = '' }: PullQuoteProps) {
  return (
    <div className={`fb-mx fb-quote ${className}`.trim()}>
      <div>{quote || children}</div>
    </div>
  )
}
