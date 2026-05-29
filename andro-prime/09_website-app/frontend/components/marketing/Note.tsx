import { ReactNode } from 'react'

interface NoteProps {
  children: ReactNode
}

// Soft gray "for further context" pointer block — lighter weight than Punchline.
// Author with blank lines so the markdown body (incl. links) parses inside.
export default function Note({ children }: NoteProps) {
  return (
    <div className="my-12 bg-gray-100 p-6 border-l-4 border-black [&_p]:font-serif [&_p]:text-base md:[&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p]:my-0 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-2 [&_a]:text-black [&_strong]:font-bold">
      {children}
    </div>
  )
}
