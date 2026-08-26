import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { isMembershipEnabled } from '@/lib/flags'
import { getMembershipView } from '@/lib/membership/getMembershipView'
import { firstRetestDueAt } from '@/lib/membership/entitlement'
import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import { CheckinRow } from '@/components/membership/CheckinRow'
import { AdherenceChart } from '@/components/membership/AdherenceChart'
import { TrendRail } from '@/components/membership/TrendRail'
import { JoinButton } from '@/components/membership/JoinButton'
import Link from 'next/link'
import { urlFor } from '@/lib/hosts'

export const metadata: Metadata = {
  title: 'Membership',
  robots: { index: false, follow: false },
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** "1 day", "2 days". A member on day one should not be told "1 days". */
function plural(n: number, word: string): string {
  return n === 1 ? word : `${word}s`
}

/**
 * The membership screen. ONE route, THREE top-level states:
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

  // The daily loop, shown to a member AND inside the paywall. It is what builds
  // the case the paywall then makes, and it is what the member keeps paying
  // for; hiding it behind the paywall would leave the paywall arguing from
  // nothing.
  const loop = marker && checkin && (
    <>
      <section className="membership__block">
        <p className="data-label text-xs">Today · {marker.questions.length} taps</p>
        <CheckinRow questions={marker.questions} answeredToday={checkin.answeredToday} />
        <p className="membership__logged">
          {checkin.logged === 0
            ? 'Nothing logged yet'
            : `Logged ${checkin.logged} of ${checkin.loggedOf} ${plural(checkin.loggedOf, 'day')}`}
          {checkin.streak > 0 && <> · {checkin.streak} day streak</>}
        </p>
      </section>

      <section className="membership__block">
        <p className="data-label text-xs">Your one number to move</p>
        <div className="membership__counter">
          <span className="membership__counter-n">{marker.value}</span>
          {/* Marker names keep the engine's casing ("Vitamin D", "Active B12"),
              so this line reads the same as the result card it came from. */}
          <span className="membership__counter-unit">
            {marker.unit} {marker.displayName}
          </span>
        </div>
        {/* Ewa-approved copy from the results engine, reused rather than rewritten. */}
        <p className="membership__counter-sub">{marker.explanation}</p>
      </section>

      {checkin.series.length >= 3 && (
        <section className="membership__block membership__block--tint">
          <p className="data-label text-xs">
            Adherence, {checkin.series.length} {plural(checkin.series.length, 'day')}
          </p>
          <AdherenceChart series={checkin.series} />
        </section>
      )}
    </>
  )

  // ── 1. Member ────────────────────────────────────────────────────────────
  if (view.isMember) {
    const pendingRetestAt = entitlement.kind === 'pending' ? entitlement.dueAt : null

    return (
      <div className="membership">
        <div className="membership__inner">
          <p className="data-label text-xs mb-8">Your membership</p>

          {marker && (
            <section className="membership__block">
              <p className="data-label text-xs">{marker.displayName}, your points so far</p>
              <TrendRail
                markerName={marker.displayName}
                trend={marker.trend}
                pendingRetestAt={pendingRetestAt}
              />
            </section>
          )}

          <section className="membership__block">
            <p className="data-label text-xs">Your retest</p>
            {entitlement.kind === 'pending' && (
              <>
                <p className="membership__retest">{formatDate(entitlement.dueAt)}</p>
                <p className="membership__retest-note">
                  {entitlement.daysRemaining} days away. Included while you are a member: you need to
                  be a member on that date. It is not a credit, there is no balance, and there is
                  nothing to keep track of.
                </p>
              </>
            )}
            {entitlement.kind === 'due' && (
              <>
                <p className="membership__retest">Due now</p>
                <p className="membership__retest-note">
                  Your retest kit is being prepared. We will email you before it ships so you can
                  check the delivery address we hold.
                </p>
              </>
            )}
            {entitlement.kind === 'claimed' && (
              <>
                <p className="membership__retest">On its way</p>
                <p className="membership__retest-note">
                  Your retest kit was released on {formatDate(entitlement.claimedAt)}. Your next one
                  is a year after that, while you are still a member.
                </p>
              </>
            )}
            {entitlement.kind === 'none' && (
              <p className="membership__retest-note">
                Your retest date is set once your first payment clears. We will show it here.
              </p>
            )}
          </section>

          {loop}

          <section className="membership__block membership__block--tint">
            <p className="data-label text-xs">Ask the clinician</p>
            <p className="membership__retest-note">
              Nothing published yet this month. Members ask a question, a registered clinician
              answers it generally, and every member sees the answer.
            </p>
            <p className="membership__fineprint">
              General health information, not advice about your own results.
            </p>
          </section>

          <p className="membership__fineprint">
            Manage or cancel your membership from{' '}
            <Link href="/subscriptions" className="underline">
              your subscriptions
            </Link>
            .
          </p>
        </div>
      </div>
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
      <div className="membership">
        <div className="membership__inner">
          <p className="data-label text-xs mb-8">Membership</p>

          <section className="membership__hero">
            <p className="membership__eyebrow">
              {offer.kind === 'closed' ? 'Not open right now' : 'Starts with a test'}
            </p>
            <h1 className="membership__heading">
              {offer.kind === 'closed'
                ? 'Membership opens when a result comes back.'
                : 'Membership starts with a number to track.'}
            </h1>
          </section>

          <section className="membership__block">
            <p className="membership__retest-note">
              {offer.kind === 'closed' ? (
                <>
                  Membership is offered for the 30 days after a result lands, because what it keeps
                  running is a number and a dated retest. That window closed on{' '}
                  {formatDate(offer.closedAt)}. Your next test opens a new one.
                </>
              ) : (
                <>
                  There is nothing to track yet. Take a test first, and when the result comes back
                  you will have 30 days to decide whether you want it kept running.
                </>
              )}
            </p>
            {/* Cross-host: /kits is MARKETING on the apex, so a plain anchor. */}
            <a href={urlFor('/kits')} className="membership__cta membership__cta--link">
              Choose your test
            </a>
          </section>

          <section className="membership__block membership__decline">
            <p className="membership__decline-head">Your results are yours either way</p>
            <p>Nothing is locked. Download them whenever you want, member or not.</p>
            <Link href="/results-dashboard" className="underline">
              Go to your results
            </Link>
          </section>
        </div>
      </div>
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

  return (
    <div className="membership">
      <div className="membership__inner">
        <p className="data-label text-xs mb-8">Membership</p>

        {/*
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
        */}
        <section className="membership__hero">
          {marker ? (
            <>
              <p className="membership__eyebrow">One number to move</p>
              <h1 className="membership__heading">
                You have one number to move, and a dated retest to move it by.
              </h1>
            </>
          ) : view.anyFlagged ? (
            <>
              <p className="membership__eyebrow">Your result, tracked</p>
              <h1 className="membership__heading">
                Your result is on record. Membership dates the next one.
              </h1>
            </>
          ) : (
            <>
              <p className="membership__eyebrow">Your baseline, kept</p>
              <h1 className="membership__heading">
                Nothing is flagged today. Next year&rsquo;s test has something to be measured
                against.
              </h1>
            </>
          )}
        </section>

        {checkin && checkin.logged > 0 && (
          <div className="membership__built">
            <div>
              <span className="membership__built-n">{checkin.logged}</span>
              <span className="membership__built-k">Days logged</span>
            </div>
            <div>
              <span className="membership__built-n">{checkin.streak}</span>
              <span className="membership__built-k">Day streak</span>
            </div>
            <div>
              <span className="membership__built-n">{marker ? 1 : 0}</span>
              <span className="membership__built-k">Marker to move</span>
            </div>
          </div>
        )}

        {loop}

        <section className="membership__block">
          <p className="membership__price">{price}</p>

          <div className="membership__entitle">
            <p className="membership__entitle-head">
              Join today and your retest falls on {formatDate(projectedRetest)}
            </p>
            <p>
              Included while you are a member. You need to be a member on that date. It is not a
              credit, it does not expire, and there is no balance to keep track of.
            </p>
          </div>

          {/*
            Three benefits, not four. "Member price on kits" came off on
            2026-08-26: kits are never discounted, for anyone, because the
            member's benefit is the included retest and discounting on top of it
            undercuts the economics the offer window protects. Member pricing is
            for supplements, and a paywall must not list a benefit that has no
            delivery path yet.
          */}
          <ul className="membership__includes">
            <li>Your plan, your streak and your daily data, kept running.</li>
            <li>Every marker explained against both ranges, ours and your lab&rsquo;s.</li>
            <li>Ask the clinician. Questions answered every month, published for all members.</li>
          </ul>

          <JoinButton>Keep going</JoinButton>
          {/*
            The deadline is stated plainly, because it is real: miss it and the
            way back in is another kit at full retail. Saying so is fairer than
            a limit that only reveals itself once it has passed.
          */}
          <p className="membership__cta-sub">
            Cancel any time &middot; this offer closes on {formatDate(offer.closesAt)}
          </p>
        </section>

        <section className="membership__block membership__decline">
          <p className="membership__decline-head">Not right now</p>
          <p>
            Your results are yours either way. Download them whenever you want, member or not. If
            you change your mind after {formatDate(offer.closesAt)}, your next test opens a new 30
            days.
          </p>
          <Link href="/results-dashboard" className="underline">
            Go to your results
          </Link>
        </section>
      </div>
    </div>
  )
}
