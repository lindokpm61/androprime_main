import { ReactNode } from 'react'

interface ReferencesProps {
  // A markdown list of sources. Entries are auto-numbered [01], [02]... via the
  // `.references-box` counter styles in blog-skin.css.
  children: ReactNode
}

// Brutalist "SYSTEM DB // REFERENCES" source box — bordered, gray, monospace.
export default function References({ children }: ReferencesProps) {
  return (
    <section id="references" aria-label="References" className="scroll-mt-24 my-16">
      <div className="references-box p-6 md:p-8 border-4 border-black bg-gray-50 font-mono text-xs leading-relaxed text-gray-700 [&_a]:underline [&_a]:underline-offset-2 [&_a]:break-all hover:[&_a]:text-black [&_em]:italic">
        <h2 className="font-mono font-bold uppercase tracking-widest text-black mb-4 border-b-2 border-gray-300 pb-2 inline-block">
          System DB // References
        </h2>
        {children}
      </div>
    </section>
  )
}
