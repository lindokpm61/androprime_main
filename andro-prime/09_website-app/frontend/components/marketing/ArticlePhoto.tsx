/**
 * The article's editorial photograph, sourced from Unsplash.
 *
 * 🔴 DERIVED, NOT PORTED. design/mockups/journey/blog-F.html draws the article,
 * the twelve editorial pieces, the tail, the index and the author page, and it
 * draws NO photograph, while 10 of the 18 published articles carry one. So this
 * treatment is derived from `.f-shot` in f-primitives rather than invented:
 * same grayscale, same radius, same caption furniture, same hover
 * de-saturation as every photograph on `/`, `/kits` and `/how-it-works`. A blog
 * photo that looked unlike a marketing photo would reintroduce the exact seam
 * this rebuild exists to close.
 *
 * 🔴 TWO UNSPLASH API ToS REQUIREMENTS ARE ENFORCED HERE AND MAY NOT BE REMOVED:
 *   1. Visible attribution: "Photo by <photographer> on Unsplash".
 *   2. Both links carry UTM params.
 * The download-trigger requirement is handled at authoring time by
 * scripts/unsplash.mjs, not here.
 *
 * The grayscale is also the BRAND mitigation, not only a look: stock
 * photography sits in the brand DON'T column, so it has to read as editorial
 * rather than as generic stock.
 *
 * 🔴 A RAW <img>, NOT next/image, AND THAT IS DELIBERATE. Two reasons, and the
 * first one is fatal on its own:
 *
 *   1. Every `photoSrc` is a remote `images.unsplash.com` URL and
 *      `next.config.ts` declares NO `images.remotePatterns`. next/image throws
 *      at request time on an unconfigured host, so swapping it in without also
 *      editing the config would 500 all ten photo articles. This was tried
 *      during the rebuild and caught before it shipped.
 *   2. Even with the host allowed it would be the wrong trade. The URLs already
 *      carry `w=1600&q=80&auto=format&fit=crop`, so Unsplash's own CDN is
 *      already doing the resizing and the WebP/AVIF negotiation. Routing them
 *      through our optimiser adds a proxy hop and server CPU to re-optimise an
 *      optimised image.
 *
 * What the V2.0 version was missing and this adds: `loading="lazy"` and
 * `decoding="async"`. The photo sits below the headline and bylines, so it is
 * never the LCP element, and it was previously eager-loaded. Layout shift is
 * already prevented by `aspect-ratio` on `.fb-shot`, not by width/height here.
 */

const UTM = 'utm_source=andro-prime&utm_medium=referral'

function withUtm(url: string): string {
  return url + (url.includes('?') ? '&' : '?') + UTM
}

interface Props {
  src: string
  alt: string
  credit?: string
  creditUrl?: string
  // Object-position for the crop, e.g. "50% 30%". Set it rather than letting it
  // default, per the ruling written the day two portraits were decapitated: a
  // neutral crop today is still a crop the next reshape can silently centre.
  focal?: string
}

export default function ArticlePhoto({ src, alt, credit, creditUrl, focal }: Props) {
  return (
    <figure className="fb-figure">
      <div
        className="fb-shot"
        style={focal ? ({ '--focal': focal } as React.CSSProperties) : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {credit && (
        <figcaption className="fb-credit">
          <span>Photo by</span>
          {creditUrl ? (
            <a href={withUtm(creditUrl)} target="_blank" rel="noopener noreferrer">
              {credit}
            </a>
          ) : (
            <span>{credit}</span>
          )}
          <span>on</span>
          <a href={withUtm('https://unsplash.com/')} target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>
        </figcaption>
      )}
    </figure>
  )
}
