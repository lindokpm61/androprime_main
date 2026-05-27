import type { ArticleFaqItem } from '@/lib/blog'

interface Props {
  items: ArticleFaqItem[]
  // headingLevel: pass 2 (default) for an article-body FAQ where H1 is the article title.
  headingLevel?: 2 | 3
}

// Accessible details/summary FAQ block for blog articles.
// Renders semantically (HTML <details>) — search engines and AI crawlers parse this
// the same as FAQPage schema, no JS required. Matches the visual style of FaqAccordion
// used on LPs while staying a server component.
export default function ArticleFaq({ items, headingLevel = 2 }: Props) {
  if (!items || items.length === 0) return null

  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <section
      aria-labelledby="article-faq-heading"
      className="mt-16 pt-12 border-t-4 border-black not-prose"
    >
      <Heading
        id="article-faq-heading"
        className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter text-black mb-8"
      >
        Frequently asked questions
      </Heading>
      <div className="border-t-4 border-black">
        {items.map((item, i) => (
          <details
            key={i}
            className="group border-b-4 border-black"
          >
            <summary
              className="cursor-pointer list-none flex items-center justify-between gap-6 py-6 font-sans font-black uppercase text-lg md:text-xl tracking-tighter text-black"
            >
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 w-8 h-8 border-2 border-black flex items-center justify-center font-sans font-black text-xl transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="pb-6 pr-14">
              <p className="font-serif text-lg text-black leading-relaxed">{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
