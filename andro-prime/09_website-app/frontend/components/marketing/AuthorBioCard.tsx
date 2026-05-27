import Link from 'next/link'
import type { Author } from '@/lib/authors'

interface Props {
  author: Author
  // variant: 'page' for the full author page rendering; 'inline' for an article-footer card.
  variant?: 'page' | 'inline'
  // showLongBio: defaults to true for 'page' variant, false for 'inline'.
  showLongBio?: boolean
}

// Renders Keith / Ewa author card. Used on /authors/[slug] (variant='page')
// and can be embedded under article bodies as an inline byline-credentials block.
export default function AuthorBioCard({ author, variant = 'page', showLongBio }: Props) {
  const renderLong = showLongBio ?? variant === 'page'
  const paragraphs = author.longBio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  const isPage = variant === 'page'

  return (
    <section className={isPage ? 'border-b-4 border-black pb-12 mb-12' : 'mt-16 pt-12 border-t-4 border-black not-prose'}>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="shrink-0">
          {/* TODO: replace with real photo. Falls back to placeholder. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={author.imgSrc}
            alt={`${author.name} — ${author.bylineRole}`}
            className={`${isPage ? 'w-40 h-40 md:w-48 md:h-48' : 'w-24 h-24'} border-2 border-black object-cover bg-gray-100`}
          />
        </div>
        <div className="flex-1">
          {!isPage && (
            <p className="data-label text-[10px] mb-2">
              {author.role === 'medical-reviewer' ? 'Reviewed by' : 'Written by'}
            </p>
          )}
          {isPage ? (
            <h1 className="text-3xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-[0.95] mb-3">
              {author.name}
            </h1>
          ) : (
            <h2 className="text-2xl font-sans font-black text-black uppercase tracking-tighter mb-2">
              <Link href={`/authors/${author.slug}`} className="hover:underline">
                {author.name}
              </Link>
            </h2>
          )}
          <p className="font-sans font-black uppercase text-sm tracking-widest text-black mb-1">
            {author.bylineRole}
          </p>
          {author.credentials && (
            <p className="data-label text-[11px] text-gray-700 mb-4">{author.credentials}</p>
          )}

          {renderLong ? (
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="font-serif text-base md:text-lg text-black leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="font-serif text-base text-black leading-relaxed">{author.bio}</p>
          )}

          {isPage && author.sameAs.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3 not-prose">
              {author.sameAs.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-block border-2 border-black px-4 py-2 font-sans font-black uppercase tracking-widest text-xs text-black hover:bg-black hover:text-white transition-colors"
                  >
                    {labelForSameAs(url)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function labelForSameAs(url: string): string {
  if (url.includes('gmc-uk.org')) return 'Verify on GMC register'
  if (url.includes('linkedin.com')) return 'LinkedIn'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'X / Twitter'
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
