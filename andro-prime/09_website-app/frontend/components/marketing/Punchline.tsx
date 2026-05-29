import { ReactNode } from 'react'

interface PunchlineProps {
  children: ReactNode
}

// Big, uppercase, left-bordered statement — the emphatic one-liner that lands a
// section (e.g. "The test is the only honest answer."). Author inline, no blank
// lines, so MDX passes raw text rather than wrapping it in a <p>.
export default function Punchline({ children }: PunchlineProps) {
  return (
    <div className="my-12 px-6 py-4 border-l-8 border-black bg-gray-100 font-sans font-black uppercase tracking-tighter text-2xl md:text-3xl leading-tight text-black">
      {children}
    </div>
  )
}
