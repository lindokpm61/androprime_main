import type { Metadata } from 'next'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import { DEMO_RESULTS, resolveDemoResult, getDemoDashboard } from '@/lib/results/demo'

/*
 * /demo -- THE DEMO ACCOUNT, AS THE REAL THING.
 * Built 2026-09-06, replacing `design/prototypes/demo-account-interactive.html`.
 *
 * WHAT CHANGED, AND IT IS NOT THE DESIGN. The prototype was a hand-drawn mockup
 * whose bands were TRANSCRIBED from `lib/results/classifier.ts`. This page runs
 * that classifier. Every verdict on screen is computed at request time from
 * fixture values against `04_products/results-engine/thresholds.md`, through the
 * same `classify()` that serves a paying customer.
 *
 * THE PRESENTATION IS THE PROTOTYPE'S, REBUILT (`components/app-shell/`). The
 * logged-in dashboard renders nine markers as nine full-page essays, which is
 * 15,736px of scroll at 390 with no overview at any point. The prototype's
 * answer -- a grouped list, one line per marker, the essay one tap away -- is
 * what a customer actually needs on a phone, and it is what this shows.
 *
 * 🔴 NO DATABASE, NO USER, NO WRITES. `lib/results/demo.ts` builds the dashboard
 * from a closed set of fixtures with no Supabase client anywhere on the path.
 * That is what makes the homepage's promise -- "We never put your data in it" --
 * a property of the code rather than a policy. Do not add a call here that takes
 * a user id, and do not widen the scenario set to read the query string.
 *
 * 🔴 `robots: noindex` UNTIL THE COMPLIANCE GATE CLEARS. This is the first time
 * a full results report -- verdict badges, action bands, recommendation copy --
 * is rendered on an ungated public surface. The copy in `biomarker-copy.ts` was
 * signed for a logged-in customer reading their own result, which is a different
 * context from a stranger reading a fabricated one. The route is built, the
 * links are wired, and it stays out of the index until that is ruled on. Flip
 * this line and delete this paragraph when it is.
 *
 * ⚠ THREE THINGS THE PROTOTYPE SHOWED THAT THIS DOES NOT: the plan tab, the
 * record tab and the member screens. Two of those are membership surfaces and
 * `/membership` is dark behind `MEMBERSHIP_ENABLED`. Demonstrating them would
 * mean marketing something that cannot currently be bought, which is the exact
 * prohibition the homepage's free-layer section already carries.
 */

export const metadata: Metadata = {
  title: 'See a real result before you buy',
  description:
    'A working demonstration of the Andro Prime results dashboard, loaded with sample results. No account, no email, nothing to buy.',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ r?: string }>
}

export default async function DemoPage({ searchParams }: PageProps) {
  const { r } = await searchParams
  const current = resolveDemoResult(r)
  const data = getDemoDashboard(current)

  // A listed scenario always produces results; this is a type guard, not a state
  // the page can reach.
  if (data.state !== 'ready') return null

  return (
    <div className="mx-auto w-full max-w-[520px] px-4 pb-16">
      <DemoNotice />
      {/* THE CONTROLS SIT OUTSIDE THE PRODUCT, which is the prototype's own
          arrangement and the reason it works: it draws a rail BESIDE the phone
          labelled "Not part of the product", because a real customer cannot move
          his own result and must not be shown a UI that implies he can. My first
          version put the switcher inside the app chrome, which quietly claimed
          the product has a scenario picker. */}
      <DemoSwitcher currentId={current.id} blurb={current.blurb} />
      <div className="ap-frame">
        <AppShell kits={data.kits} />
      </div>
      <DemoFooter />
    </div>
  )
}

/*
 * Not dismissible: a reader who arrives from a shared link must still be able to
 * tell that these numbers are nobody's.
 */
function DemoNotice() {
  return (
    <div className="ap-note">
      <span className="ap-note__tag">Demonstration</span>
      <p>
        These results are a sample. They do not belong to a real person, and no customer&rsquo;s data
        is used here. Everything else below is the report you would get: the same laboratory ranges,
        the same action bands, and the same explanations.
      </p>
    </div>
  )
}

/*
 * THE SWITCHER IS AN ARGUMENT, NOT A CONTROL. Three results: one where the
 * laboratory and our bands disagree, one with nothing to act on, and one that
 * routes to a GP. It exists so the demo cannot be read as the flattering case,
 * which is the first thing a sceptical reader assumes about a vendor's demo.
 *
 * Plain links, not a client component: each scenario is a distinct URL, so it is
 * shareable, back-buttonable, and works with JavaScript off.
 */
function DemoSwitcher({ currentId, blurb }: { currentId: string; blurb: string }) {
  return (
    <nav aria-label="Sample results" className="ap-controls">
      <p className="ap-controls__lbl">Demo controls &middot; not part of the product</p>
      <ul>
        {DEMO_RESULTS.map((demo) => (
          <li key={demo.id}>
            <Link
              href={`/demo?r=${demo.id}`}
              aria-current={demo.id === currentId ? 'true' : undefined}
              className="ap-controls__opt"
            >
              {demo.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="ap-controls__blurb">{blurb}</p>
    </nav>
  )
}

/*
 * Replaces the logged-in footer, which invites support email about your results.
 * A visitor here has no results and no order, so the useful thing is the way in.
 */
function DemoFooter() {
  return (
    <footer className="ap-close">
      <div>
        <div className="ap-controls__lbl">This is what you get</div>
        <p>
          A finger-prick at home, a UKAS ISO 15189-accredited lab, and this report in your dashboard
          within 2 to 5 working days of the lab receiving your sample.
        </p>
      </div>
      <Link href="/kits" className="ap-close__cta">
        See the tests &nbsp;&rarr;
      </Link>
    </footer>
  )
}
