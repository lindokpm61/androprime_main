import type { ArticleFaqItem } from '@/lib/blog'

interface Props {
  items: ArticleFaqItem[]
  // headingLevel: pass 2 (default) for an article-body FAQ where H1 is the article title.
  headingLevel?: 2 | 3
}

/**
 * The article FAQ, rebuilt in Direction F.
 *
 * Still real <details>/<summary>: search engines and AI crawlers parse this the
 * same as FAQPage schema and it works with JS off. That was right and is kept.
 *
 * The construction is the hairline-gapped stack `.fb-faq`, the same device as
 * `.fb-bylines`: the 1px gap between rows IS the divider, drawn by the parent's
 * background showing through, so there are no border rules to keep in sync.
 * The V2.0 version drew 4px black rules top and bottom of every row.
 */
export default function ArticleFaq({ items, headingLevel = 2 }: Props) {
  if (!items || items.length === 0) return null

  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <section aria-labelledby="article-faq-heading" className="mt-14">
      <p className="f-blab">Common questions</p>
      <Heading id="article-faq-heading" className="f-h2">
        Frequently asked.
      </Heading>
      <div className="fb-faq">
        {items.map((item, i) => (
          <details key={i}>
            <summary>{item.q}</summary>
            <div className="fb-faq-a">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
