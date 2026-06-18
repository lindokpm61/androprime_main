// Editorial hero photo for articles sourced from Unsplash.
//
// Two non-negotiables from the Unsplash API ToS are enforced here:
//   1. Visible attribution — "Photo by <photographer> on Unsplash".
//   2. Both links carry UTM params (the download-trigger requirement is handled
//      at authoring time by scripts/unsplash.mjs, not here).
// The grayscale + contrast treatment is the brand mitigation: stock photography
// is in the brand DON'T column, so it must read as editorial, not generic stock.

const UTM = 'utm_source=andro-prime&utm_medium=referral'

function withUtm(url: string): string {
  return url + (url.includes('?') ? '&' : '?') + UTM
}

interface Props {
  src: string
  alt: string
  credit?: string
  creditUrl?: string
}

export default function ArticlePhoto({ src, alt, credit, creditUrl }: Props) {
  return (
    <figure className="max-w-3xl mx-auto px-6 mt-12">
      <div className="relative bg-black p-2 border-4 border-black brutal-shadow">
        <span className="absolute inset-2 border-2 border-white z-20 pointer-events-none" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover grayscale contrast-125 opacity-90"
        />
      </div>
      {credit && (
        <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-widest text-gray-500 text-right">
          Photo by{' '}
          {creditUrl ? (
            <a
              href={withUtm(creditUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black underline decoration-1 underline-offset-2"
            >
              {credit}
            </a>
          ) : (
            <span className="text-gray-700">{credit}</span>
          )}{' '}
          on{' '}
          <a
            href={withUtm('https://unsplash.com/')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-black underline decoration-1 underline-offset-2"
          >
            Unsplash
          </a>
        </figcaption>
      )}
    </figure>
  )
}
