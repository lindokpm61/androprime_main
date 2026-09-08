import Link from 'next/link'
import type { Author } from '@/lib/authors'

interface Props {
  author: Author
  // variant: 'page' for the full author page; 'inline' for an article-footer card.
  variant?: 'page' | 'inline'
  // showLongBio: defaults to true for 'page', false for 'inline'.
  showLongBio?: boolean
}

/**
 * The author card, rebuilt in Direction F on 2026-09-08 (blog-F.html frame AQ).
 *
 * Renders Keith or Ewa. Used on /authors/[slug] (variant='page') and available
 * as an inline byline-credentials block under an article body.
 *
 * ▶ WHAT CHANGED: the 2px black photo frame, the uppercase black sans name, the
 * `data-label` V2.0 label class and the bordered-box `sameAs` links. The name is
 * now the display serif, the photo takes the same grayscale plate treatment as
 * every other photograph on the site, and the links are `.f-btn-ghost` pills so
 * they match the buttons on the page the reader arrived from.
 *
 * ⚠ THE GMC LINK IS NOT DECORATION. `labelForSameAs` renders "Verify on GMC
 * register" for the gmc-uk.org URL, and that link is the substantiation behind
 * every "GMC-registered GP" claim on the site (registration 4758565, filed at
 * 03_compliance/credentials/). Keep it visible and keep it labelled as a
 * verification route, not as a generic social link.
 *
 * Raw <img>: `author.imgSrc` is currently a local placeholder path, but this
 * matches the rest of the blog surface, which cannot use next/image because the
 * article photography is remote and unconfigured. Consistency here is cheap.
 */
export default function AuthorBioCard({ author, variant = 'page', showLongBio }: Props) {
  const renderLong = showLongBio ?? variant === 'page'
  const paragraphs = author.longBio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const isPage = variant === 'page'

  return (
    <section className={isPage ? '' : 'mt-14'}>
      <div className="fb-authhead">
        <div
          className="fb-shot shrink-0"
          style={{
            width: isPage ? 150 : 96,
            height: isPage ? 150 : 96,
            aspectRatio: 'auto',
            borderRadius: isPage ? 26 : 18,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={author.imgSrc} alt={`${author.name}, ${author.bylineRole}`} loading="lazy" decoding="async" />
        </div>

        <div className="flex-1 min-w-[260px]">
          {!isPage && (
            <p className="f-blab">
              {author.role === 'medical-reviewer' ? 'Reviewed by' : 'Written by'}
            </p>
          )}
          {isPage ? (
            <h1 className="f-h2" style={{ marginBottom: 8 }}>{author.name}</h1>
          ) : (
            <h2 className="f-h4" style={{ marginBottom: 6 }}>
              <Link href={`/authors/${author.slug}`}>{author.name}</Link>
            </h2>
          )}

          <p className="fb-byline-role" style={{ marginTop: 0 }}>{author.bylineRole}</p>
          {author.credentials && (
            <p className="f-fine" style={{ marginTop: 6 }}>{author.credentials}</p>
          )}

          <div style={{ marginTop: 16 }}>
            {renderLong ? (
              paragraphs.map((p, i) => (
                <p key={i} className="f-sub" style={{ marginBottom: 12 }}>{p}</p>
              ))
            ) : (
              <p className="f-sub">{author.bio}</p>
            )}
          </div>

          {isPage && author.sameAs.length > 0 && (
            <div className="f-btns" style={{ marginTop: 20 }}>
              {author.sameAs.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="f-btn f-btn-ghost f-btn-sm"
                >
                  {labelForSameAs(url)}
                </a>
              ))}
            </div>
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
