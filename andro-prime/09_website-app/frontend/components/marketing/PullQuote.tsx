import { ReactNode } from 'react'

interface PullQuoteProps {
  quote?: string
  children?: ReactNode
  className?: string
}

export default function PullQuote({ quote, children, className = '' }: PullQuoteProps) {
  return (
    <div className={`pl-6 border-l-[6px] border-black py-2 my-8 bg-gray-50 ${className}`}>
      <p className="font-bold italic text-2xl leading-snug">{quote || children}</p>
    </div>
  )
}
