import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { isMembershipEnabled } from '@/lib/flags'
import { getMembershipView } from '@/lib/membership/getMembershipView'
import { firstRetestDueAt } from '@/lib/membership/entitlement'
import { MEMBERSHIP_INCLUDES, MEMBERSHIP_RETEST_TERMS } from '@/lib/membership/includes'
import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import { CheckinRow } from '@/components/membership/CheckinRow'
import { AdherenceChart } from '@/components/membership/AdherenceChart'
import { TrendPlot } from '@/components/membership/TrendPlot'
import { JoinButton } from '@/components/membership/JoinButton'
import { AppStrip, AppShell } from '@/components/app/AppShell'
import Link from 'next/link'
import { urlFor } from '@/lib/hosts'
import { formatLongDate } from '@/lib/date/format'

export const metadata: Metadata = {
  title: 'Membership',
  robots: { index: false, follow: false },
}

/** "1 day", "2 days". A member on day one should not be told "1 days". */
function plural(n: number, word: string): string {
  return n === 1 ? word : `${word}s`
}

/**
 * The membership screen, the MEMBER-FACING one. ONE route, THREE top-level
 * states.
 *
 * ⚠ MOVED 2026-09-08 from /membership to /account/membership. The bare
 * /membership is now the PUBLIC marketing explainer that discloses the price and
 * the day-31 charge (`app/(marketing)/membership/page.tsx`), and Next.js cannot
 * serve two pages at one path. Nothing about this screen changed. Its auth gate
 * still comes from middleware's '/account' prefix, which covers this by the
 * startsWith arm, and its host routing from APP_ROUTE_PREFIXES' '/account' for
 * the same reason; both files carry a note saying '/membership' must NOT be
 * re-added, because doing so would drag the public page onto the app host.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REBUILT IN DIRECTION F ON 2026-09-11. Batch 3.
 *
 * 🔴 IT IS NOT FRAMELESS, WHICH IS WHAT THE ROUTE LIST SAID. The batch-2 handoff
 * and the conformance report both record `/account/membership` as postdating the
 * journey set. That is true of the PATH and false of the SCREEN:
 * `design/mockups/journey/membership-F.html` draws all three of its states as
 * Frames H (member, retest pending), H2 (the retest block in all four
 * entitlement states), I (paywall, inside the window), I2 (the paywall hero in
 * all three variants) and J (window shut). The route was renamed on 2026-09-08
 * and the frame kept the old name, so a lookup by path found nothing. A frame
 * index keyed on a path goes stale the first time a route moves.
 *
 * 🔴 EVERY WORD IS VERBATIM, AND ON THIS SCREEN THAT MATTERS MORE THAN ANYWHERE
 * ELSE IN THE BATCH. Almost every sentence here is load-bearing and argued in
 * the comments below: the three paywall headings and why the middle one exists,
 * the entitlement wording that says it is not a credit, the three benefits and
 * why there is no fourth, the deadline stated plainly. This rebuild changed the
 * shell around them and nothing inside it.
 *
 * The three states:
 *
 *   1. MEMBER: the retest date, the trend, the loop, the clinician column.
 *   2. NOT A MEMBER, INSIDE THE 30-DAY OFFER WINDOW: the paywall.
 *   3. NOT A MEMBER, OUTSIDE IT: his results are still his, and the way back
 *      in is another kit at full retail.
 *
 * State 3 is not an error and must not read like one. The membership is offered
 * for 30 days after a result comes back (Keith, 2026-08-26) because what it
 * keeps running is a number and a dated retest; outside that window there is
 * nothing honest to sell. It also closes the hole where someone buys a kit,
 * declines, waits, then subscribes purely to collect an included retest and
 * cancels. The rule is enforced in app/api/checkout/subscription/route.ts;
 * this page only renders it.
 *
 * Behind MEMBERSHIP_ENABLED as one unit. With the flag off this route 404s, the
 * check-in API 404s, and no membership surface exists anywhere, so the app is
 * byte-identical to before membership existed. The flag stays off until the
 * compliance read on the framing clears, the membership terms are drafted, and
 * the Stripe price is verified.
 */
interface PageProps {
  searchParams: Promise<{ dev?: string }>
}

export default async function MembershipPage({ searchParams }: PageProps) {
  if (!isMembershipEnabled()) notFound()

  const user = await getCurrentUser()
  if (!user) return null

  // Same `?dev=` fixture channel the results dashboard uses, and inert in
  // production for the same reason: getDashboardData refuses to read it there.
  const { dev } = await searchParams

  const now = new Date()
  const view = await getMembershipView(user.id, now, dev)

  const { marker, checkin, entitlement, offer } = view

  /*
   * THE MARKER BLOCK IS SEPARATE FROM THE LOOP, SPLIT 2026-09-12.
   *
   * 🔴 THEY WERE ONE FRAGMENT AND IT PUT THE BIOMARKER IN THE MIDDLE OF THE
   * DAILY LOOP. The variable was called `loop`, its comment called it the daily
   * loop, and its middle third was this readout: taps and streak line, then the
   * marker, then the adherence chart that draws that same streak. The action and
   * the picture of the action were separated by the one block that is not about
   * either.
   *
   * It was not an oversight, which is why splitting is the fix rather than
   * reordering in place. The fragment serves BOTH surfaces, and on the paywall
   * the marker belongs exactly where it was: mid-argument, between what the
   * reader does daily and the chart of him doing it, because there the sequence
   * is a case for subscribing. The member screen inherited the paywall's order
   * along with the component. Each surface composes its own now.
   *
   * `membership-F.html` draws them interleaved too, and that is not a defence:
   * its own header records that it was "ENUMERATED BEFORE IT WAS DRAWN" from
   * this file, so the frame inherited the order rather than proposing it.
   */
  const markerBlock = marker && (
    <div className="f-tray f-rise">
      <div className="f-core">
        <p className="f-blab">Your one number to move</p>
        <p className="f-read">
          {marker.value}{' '}
          {/* Marker names keep the engine's casing ("Vitamin D", "Active B12"),
              so this line reads the same as the result card it came from. */}
          <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>
            {marker.unit} {marker.displayName}
          </span>
        </p>
        {/* Ewa-approved copy from the results engine, reused rather than rewritten. */}
        <p className="f-read-s">{marker.explanation}</p>
      </div>
    </div>
  )

  /*
   * The daily loop, in its two halves, shown to a member AND inside the paywall.
   * It is what builds the case the paywall then makes, and it is what the member
   * keeps paying for; hiding it behind the paywall would leave the paywall
   * arguing from nothing.
   *
   * TWO CONSTS RATHER THAN ONE FRAGMENT, because the two surfaces genuinely want
   * different orders and a single fragment cannot be interleaved. The member gets
   * them adjacent, so the streak line and the chart of that streak sit together.
   * The paywall puts `markerBlock` between them, which is where it has always
   * sat and where it belongs: mid-argument, between what the reader does daily
   * and the picture of him doing it.
   */
  const taps = marker && checkin && (
    <div className="f-tray f-rise">
      <div className="f-core">
        <p className="f-blab">Today &middot; {marker.questions.length} taps</p>
        <CheckinRow questions={marker.questions} answeredToday={checkin.answeredToday} />
        <p className="f-fine" style={{ marginTop: 16 }}>
          {checkin.logged === 0
            ? 'Nothing logged yet'
            : `Logged ${checkin.logged} of ${checkin.loggedOf} ${plural(checkin.loggedOf, 'day')}`}
          {checkin.streak > 0 && <> &middot; {checkin.streak} day streak</>}
        </p>
      </div>
    </div>
  )

  const adherenceBlock = marker && checkin && checkin.series.length >= 3 && (
    <div className="f-tray f-rise">
      <div className="f-core">
        <p className="f-blab">
          Adherence, {checkin.series.length} {plural(checkin.series.length, 'day')}
        </p>
        <AdherenceChart series={checkin.series} />
      </div>
    </div>
  )

  // ── 1. Member ────────────────────────────────────────────────────────────
  if (view.isMember) {
    const pendingRetestAt = entitlement.kind === 'pending' ? entitlement.dueAt : null

    return (
      <>
        <AppStrip label="Your membership" right="Member" />
        <AppShell
          chip="Member"
          heading="What your membership is keeping running."
          /*
           * 🔴 "THE DAILY LOOP THAT MOVES IT" WAS THE FIRST DRAFT AND IT MADE THE
           * LOOP THE AGENT. That attributes movement of a biomarker to a paid
           * product feature, at GBP 47 a month, which is the neighbour of the
           * retest-framing rule in 03_compliance/CONTEXT.md ("never language
           * implying the supplement fixed or cured anything"). The pre-existing
           * copy on this same screen never does it: "You have one number to move,
           * and a dated retest to move it by" makes the number the target and the
           * man the agent. Reduced to match. Claim reduction onto the framing the
           * screen already uses, so no fresh sign-off, CA-001 / CA-003 precedent.
           * Caught by the independent pre-flight, 2026-09-11.
           */
          intro="Your dated retest, the trend behind your number, and the daily loop you log against. Manage or cancel from your subscriptions at any time."
        >
          {/*
            * THE ORDER, DECIDED 2026-09-12, and it is the first time anybody has
            * decided it rather than inherited it: the number, then what it has
            * done, then when it is measured again, then what you do daily.
            *
            * 🔴 THE PAGE USED TO OPEN ON A CHART OF A MARKER IT HAD NOT NAMED.
            * The trend panel is headed "Vitamin D, your points so far" and plots
            * two readings; the block that says what the number IS and what it
            * means arrived three panels later, inside the loop. A reader met the
            * history before the fact. The marker block leads now, so the chart
            * that follows is a chart of something the page has introduced.
            */}
          {markerBlock}

          {marker && (
            <div className="f-tray f-rise">
              <div className="f-core">
                <p className="f-blab">{marker.displayName}, your points so far</p>
                <TrendPlot
                  markerName={marker.displayName}
                  trend={marker.trend}
                  pendingRetestAt={pendingRetestAt}
                />
              </div>
            </div>
          )}

          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-blab">Your retest</p>
              {entitlement.kind === 'pending' && (
                <>
                  <p className="f-read">{formatLongDate(entitlement.dueAt)}</p>
                  <p className="f-read-s">
                    {entitlement.daysRemaining} days away. Included while you are a member: you need
                    to be a member on that date. It is not a credit, there is no balance, and there
                    is nothing to keep track of.
                  </p>
                </>
              )}
              {entitlement.kind === 'due' && (
                <>
                  <p className="f-read">Due now</p>
                  <p className="f-read-s">
                    Your retest kit is being prepared. We will email you before it ships so you can
                    check the delivery address we hold.
                  </p>
                </>
              )}
              {entitlement.kind === 'claimed' && (
                <>
                  <p className="f-read">On its way</p>
                  <p className="f-read-s">
                    Your retest kit was released on {formatLongDate(entitlement.claimedAt)}. Your next
                    one is a year after that, while you are still a member.
                  </p>
                </>
              )}
              {entitlement.kind === 'none' && (
                <p className="f-read-s" style={{ marginTop: 0 }}>
                  Your retest date is set once your first payment clears. We will show it here.
                </p>
              )}
            </div>
          </div>

          {taps}
          {adherenceBlock}

          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-blab">Ask the clinician</p>
              <p className="f-sub">
                Nothing published yet this month. Members ask a question, a registered clinician
                answers it generally, and every member sees the answer.
              </p>
              <p className="f-fine" style={{ marginTop: 14 }}>
                General health information, not advice about your own results.
              </p>
            </div>
          </div>

          <p className="f-fine">
            Manage or cancel your membership from{' '}
            <Link href="/subscriptions" className="f-tlink">
              your subscriptions
            </Link>
            .
          </p>
        </AppShell>
      </>
    )
  }

  // ── 3. Not a member, and the offer window is shut ────────────────────────
  //
  // Handled BEFORE the paywall so the paywall branch below can assume a result
  // exists. `no-result` lands here too: a man with no baseline has nothing for
  // a membership to date or interpret, so he is never sold one.
  //
  // The tone matters. This is a door, not a refusal: his results are still his,
  // and another kit at full retail opens a new 30 days.
  if (offer.kind !== 'open') {
    return (
      <>
        <AppStrip label="Membership" right={offer.kind === 'closed' ? 'Window closed' : 'Not started'} />
        <AppShell
          chip={offer.kind === 'closed' ? 'Not open right now' : 'Starts with a test'}
          heading={
            offer.kind === 'closed'
              ? 'Membership opens when a result comes back.'
              : 'Membership starts with a number to track.'
          }
          intro="Your results stay yours either way, and nothing about them is locked behind this."
        >
          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-sub">
                {offer.kind === 'closed' ? (
                  <>
                    Membership is offered for the 30 days after a result lands, because what it
                    keeps running is a number and a dated retest. That window closed on{' '}
                    {formatLongDate(offer.closedAt)}. Your next test opens a new one.
                  </>
                ) : (
                  <>
                    There is nothing to track yet. Take a test first, and when the result comes back
                    you will have 30 days to decide whether you want it kept running.
                  </>
                )}
              </p>
              {/* Cross-host: /kits is MARKETING on the apex, so a plain anchor. */}
              <a href={urlFor('/kits')} className="f-btn" style={{ marginTop: 22 }}>
                Choose your test <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-blab">Your results are yours either way</p>
              <p className="f-sub">Nothing is locked. Download them whenever you want, member or not.</p>
              <Link href="/results-dashboard" className="f-tlink">
                Go to your results
              </Link>
            </div>
          </div>
        </AppShell>
      </>
    )
  }

  // ── 2. Not a member, inside the 30-day window: the paywall ───────────────
  //
  // `hasResults`, NOT `marker`, decides the projected retest date, because that
  // is exactly the question lib/membership/sync.ts asks when the webhook stamps
  // the real one. Projecting from a different rule would show a date here and
  // then write a different one on payment. It is always true in this branch: an
  // open window means a result came back within the last 30 days.
  const projectedRetest = firstRetestDueAt(now, view.hasResults)
  const price = PRODUCT_MAP.membership.price

  /*
    THREE headings, and the middle one is why.

    `marker` answers "is there something you can log against daily". It is
    null both for the all-clear member AND for a man whose flagged marker
    has no honest daily behaviour, such as low testosterone. Folding those
    two together would print "nothing is wrong today" to a man we have
    just told to see his GP. `anyFlagged` is the separate question, taken
    from the same map that badges his result card.

    There is no "before your first result" case here any more: the offer
    window is shut for anyone without one, so this branch is only ever
    reached by someone who has a result.
  */
  const heroChip = marker ? 'One number to move' : view.anyFlagged ? 'Your result, tracked' : 'Your baseline, kept'
  const heroHeading = marker
    ? 'You have one number to move, and a dated retest to move it by.'
    : view.anyFlagged
      ? 'Your result is on record. Membership dates the next one.'
      : 'Nothing is flagged today. Next year’s test has something to be measured against.'

  return (
    <>
      <AppStrip label="Membership" right={`Closes ${formatLongDate(offer.closesAt)}`} />
      <AppShell
        chip={heroChip}
        heading={heroHeading}
        /*
         * 🔴 A SECOND SENTENCE WAS CUT HERE AND THE REASON IS NOT COSMETIC.
         * It read "It is offered for the 30 days after a result lands." Against
         * the offer-window ruling (2026-08-26 §3) that is exact. Against the
         * auto-renew ruling (2026-09-07 §1) it is the superseded model: nobody is
         * OFFERED a membership any more, the first 30 days are in the kit price
         * and the card is charged on day 31 with no re-consent step. The two
         * rulings are in tension on this screen, which is register rows 12a and
         * 42a one surface further in, and picking a side is a payment-terms
         * decision and therefore Keith's. So the claim is removed rather than
         * restated, leaving only the half both rulings agree on.
         *
         * ⚠ `scripts/verify-subscription-claims.js` REPORTED GREEN ON IT. This
         * file is inside the script's `app/` scope, but its CLAIMS set is four
         * literal phrases about there being no subscription and its
         * RENEWAL_CLAIMS set is five about the charge; the sentence matched
         * neither. The gate built on 2026-09-11 to stop exactly this class does
         * not cover the in-app phrasing of it. Owed to Keith, not widened here:
         * making that gate stricter fails the build whenever the flag is on, and
         * which assertions it should catch is his call, not a mid-batch one.
         */
        intro="Membership keeps your number, your plan and your dated retest running."
      >
        {checkin && checkin.logged > 0 && (
          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-blab">What you have already built</p>
              <div className="f-counts">
                <div>
                  <span className="f-counts-n">{checkin.logged}</span>
                  <span className="f-counts-k">Days logged</span>
                </div>
                <div>
                  <span className="f-counts-n">{checkin.streak}</span>
                  <span className="f-counts-k">Day streak</span>
                </div>
                <div>
                  <span className="f-counts-n">{marker ? 1 : 0}</span>
                  <span className="f-counts-k">Marker to move</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {taps}
        {markerBlock}
        {adherenceBlock}

        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Membership</p>
            <p className="f-read">{price}</p>

            <div style={{ marginTop: 22 }}>
              <p className="f-blab" style={{ marginBottom: 8 }}>
                Join today and your retest falls on {formatLongDate(projectedRetest)}
              </p>
              <p className="f-sub">{MEMBERSHIP_RETEST_TERMS}</p>
            </div>

            {/*
              Three benefits, not four, and the argument for that moved with the
              strings to `lib/membership/includes.ts` on 2026-09-12. This list,
              the public `/membership` page and `/subscription/confirmed` now read
              one export, so the paywall's promise and the confirmation of it
              cannot drift apart. No word changed in the move.
            */}
            <ul className="f-inclu">
              {MEMBERSHIP_INCLUDES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div style={{ marginTop: 26 }}>
              <JoinButton>Keep going</JoinButton>
            </div>
            {/*
              The deadline is stated plainly, because it is real: miss it and the
              way back in is another kit at full retail. Saying so is fairer than
              a limit that only reveals itself once it has passed.
            */}
            <p className="f-fine" style={{ marginTop: 14 }}>
              Cancel any time &middot; this offer closes on {formatLongDate(offer.closesAt)}
            </p>
          </div>
        </div>

        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Not right now</p>
            <p className="f-sub">
              Your results are yours either way. Download them whenever you want, member or not. If
              you change your mind after {formatLongDate(offer.closesAt)}, your next test opens a new 30
              days.
            </p>
            <Link href="/results-dashboard" className="f-tlink">
              Go to your results
            </Link>
          </div>
        </div>
      </AppShell>
    </>
  )
}
