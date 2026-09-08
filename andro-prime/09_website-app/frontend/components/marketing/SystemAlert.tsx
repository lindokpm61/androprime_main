import { ReactNode } from 'react'
import { slugify } from '@/lib/slug'

interface SystemAlertProps {
  // Box title, e.g. "When to see your GP, not us".
  title?: string
  // Optional emphasis banner pinned to the bottom (the solid ink action bar).
  footer?: string
  // Body content authored in MDX (paragraphs, h4 subheads, bullet lists).
  children: ReactNode
}

/**
 * RUNG 7: the `--core` object again, this time ringed in the ACCENT.
 *
 * 🔴 DELIBERATELY NOT RED, and this is a compliance constraint rather than a
 * taste one. Red is reserved for the results dashboard's critical / GP-block
 * status (Keith, 2026-08-29), and a red box beside health copy would collide
 * with that meaning and carry ASA risk. The V2.0 version drew it in black for
 * the same reason. This is neutral clinical guidance, not an alarm.
 *
 * The solid action bar is the one piece of the brutalist original carried over
 * literally: a pinned bar at the foot of a safety block does a job no softer
 * treatment does.
 *
 * Inner markdown (h4 / p / ul / li) is styled by `.fb-alert` descendants in
 * f-blog.css rather than by `.fb-prose`, because this content is NOT a direct
 * child of the prose container.
 */
export default function SystemAlert({ title, footer, children }: SystemAlertProps) {
  return (
    <aside
      id={title ? slugify(title) : undefined}
      className="fb-mx fb-alert scroll-mt-24"
    >
      <div className="fb-alert-bd">
        <span className="fb-alert-k">System alert</span>
        {title && <h2 className="fb-alert-h">{title}</h2>}
        {children}
      </div>
      {/* `f-on-ink` supplies BOTH the dark ground and the light text ramp. It is
          not decoration: without it this line rendered at 2.39:1 and it is the
          line that says "call 999". See the class in f-primitives.css. */}
      {footer && <p className="fb-alert-act f-on-ink">{footer}</p>}
    </aside>
  )
}
