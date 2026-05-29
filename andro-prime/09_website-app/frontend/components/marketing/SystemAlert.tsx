import { ReactNode } from 'react'

interface SystemAlertProps {
  // Box title, e.g. "When to see your GP, not us".
  title?: string
  // Optional emphasis banner pinned to the bottom (black bar).
  footer?: string
  // Body content authored in MDX (paragraphs, h4 subheads, bullet lists).
  children: ReactNode
}

// Brutalist "System Alert" callout — used for GP-referral / safety guidance.
// Deliberately black/white (no red): this is neutral clinical guidance, not an
// alarm. Inner markdown (h4 / p / ul / li) is styled locally because it is NOT
// a direct child of `.article-prose`.
export default function SystemAlert({ title, footer, children }: SystemAlertProps) {
  return (
    <aside className="my-16 border-4 border-black bg-white relative p-8">
      <div className="absolute -top-4 left-6 bg-white px-4 font-mono font-bold text-sm uppercase tracking-widest border-2 border-black">
        System Alert
      </div>

      {title && (
        <h2 className="font-sans font-black uppercase text-2xl tracking-tighter mb-4 mt-2 text-black">
          {title}
        </h2>
      )}

      <div
        className="
          text-black
          [&_p]:font-serif [&_p]:text-base md:[&_p]:text-lg [&_p]:leading-relaxed [&_p]:my-4
          [&_h4]:font-sans [&_h4]:font-black [&_h4]:uppercase [&_h4]:tracking-widest [&_h4]:text-lg [&_h4]:mt-6 [&_h4]:mb-2
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:font-serif [&_ul]:text-base md:[&_ul]:text-lg [&_ul]:leading-relaxed
          [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-2 hover:[&_a]:decoration-4
          [&_strong]:font-bold
        "
      >
        {children}
      </div>

      {footer && (
        <p className="font-sans font-bold uppercase tracking-widest text-sm bg-black text-white p-4 text-center mt-6">
          {footer}
        </p>
      )}
    </aside>
  )
}
