import { ReactNode } from 'react'

interface CaveatProps {
  children: ReactNode
}

// Muted, italic, left-bordered caveat note — the "be careful, this is suggestive
// not diagnostic" aside that recurs through the articles. Rendered as a <div>
// (MDX wraps text children in <p>, so a <p> wrapper would nest invalidly).
export default function Caveat({ children }: CaveatProps) {
  return (
    <div className="my-8 border-l-4 border-gray-300 pl-4 font-serif text-base md:text-lg leading-relaxed italic text-gray-600 [&_p]:my-0 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-2 [&_a]:text-gray-700 hover:[&_a]:text-black">
      {children}
    </div>
  )
}
