import Link from 'next/link'
import { getAllArticles, type ArticleMeta } from '@/lib/blog'

/**
 * Related reading, rendered in the world of whichever page hosts it.
 *
 * 🔴 WHY THIS TAKES A VARIANT INSTEAD OF A RESTYLE, and it is the whole point of
 * the 2026-09-06 change. This component has SIX call sites spanning three
 * deliberately different worlds: the three Direction F kit pages, the two V2.0
 * supplement pages, and `ArticleLayout`, which is every blog article. What it
 * used to render on all six was the BLOG's ruled aesthetic -- hard black
 * borders, `font-black uppercase tracking-tighter`, Merriweather body, a drawn
 * square-cap chevron -- hand-coded in raw utility classes.
 *
 * That is not V2.0 drift and the earlier wording that called it drift sent this
 * toward the wrong fix. `styles/base/blog-skin.css` opens by calling itself "a
 * narrow, documented exception to two brand non-negotiables" and is namespaced
 * under `.blog-skin` SPECIFICALLY so it cannot leak into `/kits`. The namespace
 * does its job. This component simply did not use it, so the language walked
 * onto the kit pages on foot: roughly 1,200px of a different website at 390,
 * sitting between the FAQ and the buy CTA.
 *
 * So restyling it in F would have moved the seam rather than closed it -- the
 * blog would break, where this look is the ruled one, and two V2.0 supplement
 * pages would be stranded with an F component. The editorial rendering below is
 * unchanged, byte for byte, and stays the default for exactly that reason.
 *
 * ⚠ THIS DOES NOT PRE-EMPT THE BLOG REBUILD. `blog-F.html` Frame AO covers
 * "ArticleToc, ArticleFaq, RelatedArticles, NewsletterForm" by name, but states
 * of itself that it "does not overturn the 2026-08-27 ruling on its own". If
 * that ruling is revisited and the blog moves to F, this file's answer is to
 * change `ArticleLayout`'s variant, not to rewrite the component again.
 */

interface RelatedArticlesProps {
  // Preferred article slugs in priority order. Only those currently visible
  // (published in production; drafts also show in dev) are rendered, so a
  // draft slug never produces a broken link. The section auto grows as more
  // articles are published.
  slugs: string[]
  heading?: string
  intro?: string
  limit?: number
  /**
   * Which design world to render in.
   *
   * `editorial` is the blog's own ruled aesthetic and is the DEFAULT, so a call
   * site that says nothing keeps exactly what it had. `f` is Direction F, for
   * product surfaces built on `f-primitives.css`.
   *
   * There is deliberately no auto-detection. A server component cannot read
   * React context, and sniffing the pathname would put the routing table and the
   * design system in a coupling that nothing would maintain: a page moved from
   * `/kits/x` to `/tests/x` would silently change appearance. The host declares
   * its own world, which is the one thing the host reliably knows.
   */
  variant?: 'editorial' | 'f'
}

/* The F arrow is a pip, never a bare glyph. Same construction as every `.f-btn`
   on the five F routes; `.f-btn-sm:has(.f-pip)` retunes the padding for it. */
const PIP = <span className="f-pip" aria-hidden="true">&rarr;</span>

// Server component. Reads the published-article index and renders contextual
// links from a product page into the blog. Returns null when none of the
// preferred articles are live, so the section simply doesn't appear.
export async function RelatedArticles({
  slugs,
  heading = 'Related reading',
  intro,
  limit = 3,
  variant = 'editorial',
}: RelatedArticlesProps) {
  const bySlug = new Map((await getAllArticles()).map((a) => [a.slug, a]))
  const picks = slugs
    .map((s) => bySlug.get(s))
    .filter((a): a is ArticleMeta => Boolean(a))
    .slice(0, limit)

  if (picks.length === 0) return null

  return variant === 'f'
    ? <FieldRelated picks={picks} heading={heading} intro={intro} />
    : <EditorialRelated picks={picks} heading={heading} intro={intro} />
}

/**
 * DIRECTION F. Built on `.f-bio` rows, which is the primitive the kit pages
 * already use for a set of short items under one label: a hairline above,
 * Newsreader h3, `--ink-2` body, and columns that turn at 760 and 1040.
 *
 * NO `SectionRule`, and that is deliberate rather than an omission. This block
 * sits in the page's TAIL, beside `.f-close` and the cross-sell tray, and none
 * of those is in the numbered spine on any F route. `.f-blab` without a rule is
 * the established grammar for a tail block -- `.f-close` carries exactly that on
 * `/` and `/how-it-works`. Numbering it would change every `of={n}` on three
 * pages to make a related-reading list a peer of the panel.
 */
function FieldRelated({ picks, heading, intro }: { picks: ArticleMeta[]; heading: string; intro?: string }) {
  return (
    <section className="f-wrap f-sec">
      <p className="f-blab">{heading}</p>
      {intro && <p className="f-sub" style={{ marginTop: 0, marginBottom: 0 }}>{intro}</p>}
      <div className="f-bios f-rise" style={{ marginTop: 26 }}>
        {picks.map((a) => (
          /* Column flex so the button is pinned to the bottom of the row rather
             than to the end of its own excerpt. Excerpt lengths differ by two
             lines across a typical set, so without this the three ghost buttons
             land at three heights under three hairlines that are perfectly
             level, which reads as a mistake rather than as variation.
             `.f-bios` is a grid and its items stretch, so each `.f-bio` already
             has the row's full height for `margin-top: auto` to work against. */
          <div className="f-bio" key={a.slug} style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="f-blab" style={{ marginBottom: 0 }}>{a.category}</p>
            <h3>{a.title}</h3>
            {/* The gap above the button lives HERE, not as padding on the button
                and not as its margin-top: `margin-top: auto` is what pins the
                button, and a length cannot be auto and 16px at once. On the
                tallest row, where auto resolves to zero, this is the only thing
                keeping the button off the excerpt. */}
            <p style={{ marginBottom: 16 }}>{a.excerpt}</p>
            {/* 🔴 `alignSelf` IS LOAD-BEARING, NOT TIDINESS. A column flex parent
                stretches its children on the cross axis and `inline-flex` does
                not save them: this is the same mechanism that rendered `.f-kchip`
                as a 316px banner inside the homepage kit cards, recorded on
                `.f-kbody` in `f-primitives.css`. Without it the ghost button
                spans the whole column. */}
            <Link
              href={`/blog/${a.slug}`}
              className="f-btn f-btn-ghost f-btn-sm"
              style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
            >
              Read the guide {PIP}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * THE BLOG'S OWN RULED AESTHETIC, unchanged. This is what every call site
 * rendered before 2026-09-06 and it remains the default. Do not "tidy" these
 * utilities toward the F tokens: on `/blog/*` and the two supplement pages this
 * IS the approved look, and `styles/base/blog-skin.css` documents the exception
 * it belongs to.
 */
function EditorialRelated({ picks, heading, intro }: { picks: ArticleMeta[]; heading: string; intro?: string }) {
  return (
    <section className="py-24 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="data-label flex items-center gap-4 mb-8">
          <span className="w-12 h-[2px] bg-black" />
          {heading}
        </div>
        {intro && (
          <p className="text-xl font-serif text-black mb-12 max-w-2xl leading-relaxed">{intro}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {picks.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="border-2 border-black bg-white p-8 flex flex-col hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="data-label text-gray-500 mb-4">
                {a.category}
              </div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 leading-tight">
                {a.title}
              </h3>
              <p className="font-serif text-base text-black leading-relaxed mb-6">
                {a.excerpt}
              </p>
              <div className="mt-auto data-label flex items-center gap-2 text-black">
                Read the guide
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
