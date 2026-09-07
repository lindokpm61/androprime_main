import type { Metadata } from 'next'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/AppShell'
import {
  DEMO_RESULTS,
  DEMO_JOURNEYS,
  resolveDemoResult,
  resolveDemoJourney,
  journeyAvailable,
  getDemoDashboard,
  getDemoDates,
} from '@/lib/results/demo'
import type { DemoJourney, DemoResult } from '@/lib/results/demo'

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
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔄 2026-09-07: THE THREE THINGS THE PROTOTYPE SHOWED AND THIS DID NOT ARE NOW
 * HERE, AND SO IS A FOURTH NOBODY HAD LISTED.
 *
 * This comment used to read: "THREE THINGS THE PROTOTYPE SHOWED THAT THIS DOES
 * NOT: the plan tab, the record tab and the member screens. Two of those are
 * membership surfaces and `/membership` is dark behind `MEMBERSHIP_ENABLED`."
 * Comparing the two artefacts properly on 2026-09-07 found a FOURTH gap that
 * neither this file nor `AppShell.tsx` had ever listed: the DAY 3 WAITING STATE.
 * Nothing gated it. It was simply missed, and `state !== 'ready'` returning null
 * is what made it unreachable.
 *
 * 🔴 KEITH'S RULING, which is why the membership surfaces are here rather than
 * behind the flag: "This is a demo, so surely it isn't dependent on the
 * membership flag being enabled as part of the website. So it should demonstrate
 * everything that is available that we're planning to do, as a potential
 * customer will look at that and have a real visual of what's behind the
 * membership program." `MEMBERSHIP_ENABLED` exists to stop someone BUYING an
 * unfinished membership; it is not a reason to stop him SEEING one.
 *
 * ⚠ THAT WIDENS THE OPEN COMPLIANCE ITEM AND DOES NOT CLEAR IT. CA-046 was
 * raised about a full results report on an ungated surface. The member state
 * adds a membership PRICE to that same surface, which is a different question
 * and has not been asked. `noindex` stays until both are answered.
 */

export const metadata: Metadata = {
  title: 'See a real result before you buy',
  description:
    'A working demonstration of the Andro Prime results dashboard, loaded with sample results. No account, no email, nothing to buy.',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ r?: string; s?: string }>
}

export default async function DemoPage({ searchParams }: PageProps) {
  const { r, s } = await searchParams
  const current = resolveDemoResult(r)
  const journey = resolveDemoJourney(s, current)
  const data = getDemoDashboard(current, journey)

  // A listed scenario always produces results; this is a type guard, not a state
  // the page can reach.
  if (data.state !== 'ready') return null

  /* Anchored to the FIRST result, which is the one that started the membership.
     In the member state there are two, and the second is the retest. */
  const dates = getDemoDates(data.kits[0]?.results[0]?.collectedAt)

  return (
    <div className="mx-auto w-full max-w-[520px] px-4 pb-16">
      <DemoNotice />
      {/* THE CONTROLS SIT OUTSIDE THE PRODUCT, which is the prototype's own
          arrangement and the reason it works: it draws a rail BESIDE the phone
          labelled "Not part of the product", because a real customer cannot move
          his own result and must not be shown a UI that implies he can. My first
          version put the switcher inside the app chrome, which quietly claimed
          the product has a scenario picker. */}
      <DemoSwitcher current={current} journey={journey} />
      <JourneySwitcher current={current} journey={journey} />
      <div className="ap-frame">
        <AppShell kits={data.kits} journey={journey.id} dates={dates} />
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
function DemoSwitcher({ current, journey }: { current: DemoResult; journey: DemoJourney }) {
  return (
    <nav aria-label="Sample results" className="ap-controls">
      <p className="ap-controls__lbl">Demo controls &middot; not part of the product</p>
      <ul>
        {DEMO_RESULTS.map((demo) => (
          <li key={demo.id}>
            <Link
              href={`/demo?r=${demo.id}&s=${journeyAvailable(journey, demo) ? journey.id : 'result'}`}
              aria-current={demo.id === current.id ? 'true' : undefined}
              className="ap-controls__opt"
            >
              {demo.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="ap-controls__blurb">{current.blurb}</p>
    </nav>
  )
}

/*
 * THE SECOND AXIS: WHEN, not what. Added 2026-09-07.
 *
 * The three results are all the same moment -- the day the first result lands --
 * and that hid the two states a customer spends most of his time in: waiting for
 * the lab, and being a member with a record. Most of this product is empty on
 * day 3, and showing that honestly is a stronger demonstration than hiding it.
 *
 * ⚠ THE MEMBER STATE NEEDS A SECOND RESULT and only the headline scenario has a
 * retest fixture, so it is disabled rather than hidden on the other two. Hiding
 * it would silently change the control set between scenarios; disabling it says
 * why. `resolveDemoJourney` also refuses the combination if it is typed straight
 * into the URL.
 */
function JourneySwitcher({ current, journey }: { current: DemoResult; journey: DemoJourney }) {
  return (
    <nav aria-label="Point in the journey" className="ap-controls">
      <p className="ap-controls__lbl">Where he is &middot; not part of the product</p>
      <ul>
        {DEMO_JOURNEYS.map((j) => {
          const ok = journeyAvailable(j, current)
          return (
            <li key={j.id}>
              {ok ? (
                <Link
                  href={`/demo?r=${current.id}&s=${j.id}`}
                  aria-current={j.id === journey.id ? 'true' : undefined}
                  className="ap-controls__opt"
                >
                  {j.label}
                </Link>
              ) : (
                <span
                  className="ap-controls__opt"
                  aria-disabled="true"
                  data-disabled="true"
                  title="This result has no retest written for it, so there is no second point to show."
                >
                  {j.label}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="ap-controls__blurb">{journey.blurb}</p>
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
