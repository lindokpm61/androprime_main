import { ReactNode } from 'react'

interface ClinicalInsightProps {
  // Quote body. MDX wraps bare text in <p>, so the inner element is a <div>.
  children?: ReactNode
  quote?: string
  author?: string
  role?: string
}

/**
 * RUNG 8: the full tray. The only piece that leaves the page plane and takes
 * the ambient shadow, which makes it the loudest NON-inverted rung.
 *
 * It is the reviewer's voice, so it earns the height: a clinician speaking is
 * a different kind of interruption from the article explaining itself.
 *
 * The V2.0 version got its lift from an 8px hard offset shadow behind a 4px
 * black border, which only existed because `.blog-skin` carved a documented
 * exception to the global box-shadow ban. That exception is retired: the
 * 2026-08-29 token release permits the ambient shadow site-wide, so this now
 * uses the same tray/core pair as every other raised surface on the site.
 */
export default function ClinicalInsight({
  children,
  quote,
  author = 'Dr Ewa Lindo',
  role = 'GMC-registered GP, Andro Prime medical reviewer',
}: ClinicalInsightProps) {
  return (
    <div className="fb-mx fb-clin">
      <div className="fb-clin-in">
        <span className="fb-clin-k">Clinical insight</span>
        <div className="fb-clin-q">{quote || children}</div>
        <footer className="fb-clin-foot">
          <b>{author}</b>
          {role && <span>{role}</span>}
        </footer>
      </div>
    </div>
  )
}
