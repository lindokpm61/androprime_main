import { ReactNode } from 'react'

interface PullQuoteProps {
  quote?: string
  children?: ReactNode
  className?: string
}

export default function PullQuote({ quote, children, className = '' }: PullQuoteProps) {
  // Inner element is a <div>, not a <p>, because MDX auto-wraps text children in <p>.
  // A <p>-inside-<p> is invalid HTML and triggers a React hydration error.
  return (
    <div className={`pl-6 border-l-[6px] border-black py-2 my-8 bg-gray-50 ${className}`}>
      <div className="font-bold italic text-2xl leading-snug font-serif">{quote || children}</div>
    </div>
  )
}
