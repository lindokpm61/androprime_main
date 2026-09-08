import { ReactNode } from 'react'

interface ReferencesProps {
  // A markdown list of sources. Entries are auto-numbered [01], [02]... via the
  // `.fb-refs` CSS counter, so authors keep writing a plain markdown list and
  // the numbering cannot drift from the list.
  children: ReactNode
}

/**
 * Not on the ladder: this is the article's APPARATUS. It sits at the foot,
 * where nobody is reading for emphasis, so it takes the quiet `--sunk` ground
 * and mono type and gets out of the way.
 *
 * The counter is carried over from blog-skin.css unchanged in behaviour, only
 * renamed, because it was the right mechanism: numbering in CSS means an
 * author reordering the list cannot produce wrong numbers.
 */
export default function References({ children }: ReferencesProps) {
  return (
    <section id="references" aria-label="References" className="fb-refs scroll-mt-24">
      <h2 className="fb-refs-h">References</h2>
      {children}
    </section>
  )
}
