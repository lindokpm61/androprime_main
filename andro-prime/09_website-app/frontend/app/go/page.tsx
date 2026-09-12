import type { Metadata } from 'next'
import { trackEvent } from '@/lib/analytics/events'
import { getAllArticles } from '@/lib/blog'
import { CLOSES, visiblePosts } from '@/lib/bio-grid'
import { SLA_COPY } from '@/lib/pricing'

/**
 * /go, the Instagram link-in-bio grid. Rebuilt in Direction F on 2026-09-12.
 *
 * 🔴 THIS ROUTE IS CUSTOMER-FACING AND WAS EXCLUDED FROM ROUTE CONFORMANCE AS
 * "internal redirect, no UI". That description belongs to `/go/[slug]`, which is
 * a `route.ts` handler that records a click and redirects. `/go` itself is a
 * rendered page with a headline, a standfirst, a list of every post in the
 * 30-day carousel run and a conflict-free footer statement, and it is the page
 * every Instagram profile visitor lands on. It sat on V2.0 (8px black rules,
 * uppercase black sans, `hover:bg-black`) for the whole rebuild because the
 * exclusion answered a question nobody had asked again.
 *
 * **A route excluded from a count on a stated reason needs that reason checked,
 * not inherited.** Corrected in `scripts/route-conformance.js`.
 *
 * EVERY WORD IS UNCHANGED except one substitution: the turnaround was the string
 * "2 to 5 working days" typed into this file, and it now reads `SLA_COPY` from
 * `lib/pricing.ts`, which is the same value every other surface quotes and the
 * one place the Vitall confirmation is recorded. Same rule the `/faq` closing
 * block and `/waitlist` already follow.
 *
 * ⚠ NO NAV AND NO FOOTER, kept from the original. This is a bio link opened
 * inside the Instagram in-app browser, with one job: find the post you just saw.
 * A site nav on it would offer five ways to leave before it offers the one thing
 * the reader came for. `.f-page` is here because it is the type ramp: without it
 * `globals.css`'s V2.0 `p { font-serif }` applies and the page renders in a face
 * the direction does not use.
 *
 * ⚠ NO HERO FIELD. `FHero`'s default ground is the shared `HeroField`, and
 * CA-045 questions 6 and 7 are open against exactly that layer on five surfaces
 * already. Adding a sixth while the packet is unsent widens an open compliance
 * question for decoration, so the hero here is plain.
 *
 * ⚠ IT STAYS OUT OF THE CONFORMANCE SWEEP, for a reason that is now true rather
 * than wrong: the page fires `bio_grid_view` server-side on every render, so a
 * sweep that loads all forty-odd routes would seed the campaign's own baseline
 * with its own traffic. The exclusion reason records that, and records that the
 * page is Direction F as of today.
 */

export const metadata: Metadata = {
  title: 'Andro Prime',
  // noindex: this is a routing surface for one Instagram profile link, not a page
  // anyone should reach from search. Deliberately NOT added to robots.ts disallow,
  // because a disallowed page cannot be crawled, so the crawler never reads this
  // directive and the page can still be indexed from an inbound link. Blocking
  // the crawler and asking it not to index are mutually exclusive; this picks the
  // one that actually works. It is absent from app/sitemap.ts, which is an
  // explicit allowlist, so nothing else needs changing.
  robots: { index: false, follow: false },
}

// Per-request: the grid grows by one tile a day and records a view each time.
export const dynamic = 'force-dynamic'

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

export default async function BioGridPage() {
  const posts = visiblePosts()

  // Titles come from `blog_articles` via getAllArticles, never from the repo MDX.
  // content/blog/*.mdx is a lagging mirror: at the time of writing it still held
  // the pre-correction Free Androgen Index headline that the 2026-07-30 ruling
  // overturned, so hardcoding titles here would have put a retracted framing on a
  // live page. Reading through means a re-titled article corrects itself.
  const titles = new Map((await getAllArticles()).map((a) => [a.slug, a.title]))

  await trackEvent('bio_grid_view', {
    utm_source: 'instagram',
    utm_medium: 'bio',
    utm_campaign: 'carousel30',
    landing_path: '/go',
    props: { tiles: posts.length },
  })

  return (
    <div className="f-page">
      <main id="main-content">
        <section className="f-narrow f-sec f-sec-hero">
          <div className="f-btns" style={{ marginBottom: 18 }}>
            <span className="f-eyebrow">Andro Prime</span>
          </div>
          <h1 className="f-h1">
            Every post,<br /><span className="f-grey">and where it goes.</span>
          </h1>
          <p className="f-stand" style={{ marginTop: 20 }}>
            Find the one you just saw. UKAS ISO 15189 accredited lab, finger-prick at home, results
            in {SLA_COPY}.
          </p>
        </section>

        <section className="f-narrow f-sec f-sec-cont">
          {posts.length === 0 ? (
            <>
              <p className="f-sub" style={{ marginTop: 0 }}>
                Nothing posted yet. In the meantime, three questions will point you at the right test.
              </p>
              {/* Deliberately NOT /go/d01. That slug belongs to the first carousel, so
                  every pre-run click would be recorded against a post nobody has seen,
                  seeding the baseline with fake data before the run starts. `start`
                  matches no post, so the handler routes it to the quiz and records it
                  as unmatched, which is both true and separable at read time. */}
              <div className="f-btns" style={{ marginTop: 26 }}>
                <a href="/go/start" className="f-btn">
                  Find the right test {ARROW}
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="f-blab">The run so far</p>
              <div style={{ marginTop: 8 }}>
                {posts.map((post) => {
                  const close = CLOSES[post.close]
                  return (
                    /* `.f-rstep` is the direction's plain bordered list row, the
                       one the homepage uses for a list of statements. A tile here
                       is the same object: a rule above, a label, a line, no card.
                       The whole row is the link, which is the only target size
                       worth offering a thumb in an in-app browser. */
                    <a key={post.slug} href={`/go/${post.slug}`} className="f-rstep" style={{ display: 'block' }}>
                      <p className="f-blab">
                        {String(post.day).padStart(2, '0')} · {close.label}
                      </p>
                      <h2 className="f-h4" style={{ marginTop: 8 }}>
                        {titles.get(post.topic.slug) ?? post.topic.slug} {ARROW}
                      </h2>
                      <p>{close.hint}</p>
                    </a>
                  )
                })}
              </div>
            </>
          )}

          <p className="f-fine" style={{ marginTop: 40 }}>
            Andro Prime sells at-home blood tests. Any result that needs a doctor goes to your GP and
            earns us nothing, and no result changes what we offer or what it costs.
          </p>
        </section>
      </main>
    </div>
  )
}
