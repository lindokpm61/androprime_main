import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { getCurrentUser } from '@/lib/auth/session'
import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import { MEMBERSHIP_INCLUDES, MEMBERSHIP_RETEST_TERMS } from '@/lib/membership/includes'
import { latestMembershipForUser } from '@/lib/membership/latestMembership'
import { entitlementState } from '@/lib/membership/entitlement'
import { urlFor } from '@/lib/hosts'
import { formatLongDate } from '@/lib/date/format'

/**
 * /subscription/confirmed, rebuilt in Direction F on 2026-09-12.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO FRAME EXISTS. This page postdates the journey set, so the layout is
 * decided here rather than ported, and the decisions are written down below.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 🔴 THE PAGE WAS CONFIRMING A PRODUCT THAT CANNOT BE BOUGHT. It read "Your
 * stack is starting", "First box dispatching this week", "First box ships …
 * Free UK delivery. Letterbox-friendly", "Auto-renews monthly … same delivery",
 * "UK manufactured". Every one of those sentences describes a supplement
 * subscription, and `lib/subscriptions/products.ts` marks all three supplement
 * subscriptions `purchasable: false` — they are retired, kept only so an
 * existing holder's row still renders a name, and structurally impossible to
 * check out because a retired entry has no `stripePriceEnv` to resolve.
 *
 * THE ONLY PURCHASABLE SUBSCRIPTION IS THE MEMBERSHIP, and the membership has
 * NO PHYSICAL GOODS (Keith, 2026-08-26): it is the retest entitlement, the
 * dashboard and trend, the check-in loop and member pricing. So the single
 * success page of `app/api/checkout/subscription/route.ts` was promising a
 * letterbox-friendly box to the only customer who can ever reach it. The page
 * carried no row in `redesign-copy-register.md` and no CA record, so this is a
 * correctness fix to unregistered copy rather than a rewrite of approved copy.
 * Registered as row 45.
 *
 * ⚠ IT IS NOT A LIVE MIS-STATEMENT TODAY, on two counts, and both can change.
 * `MEMBERSHIP_ENABLED` is off in production (checked 2026-09-12), and the flag
 * gates the checkout POST on the server as well as the UI, so no subscription
 * of any kind can currently be started. This branch also deploys nothing. The
 * moment the flag goes on, a joining member lands here.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THE FOUR DECISIONS THE MISSING FRAME WOULD HAVE MADE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 1. 🔴 WHAT PROVES A MEMBERSHIP IS THE `session_id`, NOT THE DATABASE ROW.
 *    The `memberships` row is written by the Stripe webhook (`createMembership`),
 *    and a customer returning from Checkout can beat that webhook by a second or
 *    two. Gating the confirmation on the row would show a real, paying new member
 *    a screen saying he has nothing — which is the same defect batch 3 found on
 *    the gated routes, a screen announcing a state it had not verified. Stripe
 *    only ever redirects to `success_url` after payment, so arriving WITH a
 *    session_id is the proof. The row is read only for the retest DATE.
 *
 * 2. THE RETEST DATE GETS THE TWO-STATE TREATMENT `/order/confirmed` GIVES THE
 *    ORDER REFERENCE, including its rule: the fallback does NOT wear the readout
 *    class. There is no date to read in that state, and giving an apology the
 *    same treatment as the real thing is how a design starts lying about which
 *    state is which.
 *
 * 3. THE MONEY IS IN THE HERO ASIDE, not in the body. It is the one fact a
 *    reader returns to a confirmation page for, and `/order/confirmed` and
 *    `/contact` both put that kind of thing in the `.f-herogrid` right column.
 *    The renewal sentence is carried from `/membership`, where it is approved and
 *    where its last clause is the whole point of it.
 *
 * 4. NO "WHAT HAPPENS NEXT" STEP GRID. `/order/confirmed` has one because a
 *    physical thing is moving: kit arrives, collect, results. Nothing is moving
 *    here. The membership's one dated event is the retest, and the rest is a
 *    thing that is already true. A three-step grid would have had to invent
 *    stages to fill itself.
 *
 * ⚠ THE PRICE IS NEVER TYPED. It comes from `PRODUCT_MAP.membership.price`,
 * the same source as `MEMBERSHIP_DISCLOSURE` on the seven kit surfaces, so a
 * price change cannot leave a stale figure on the page that confirms it.
 *
 * ⚠ THE CLINICIAN QUALIFIER IS CARRIED FROM `/membership`, where the Guardrail
 * #1 pre-flight added it (register row 32c). Item 3 of the includes list is read
 * here by someone who has just paid for it, which is the strongest possible
 * moment for "answers are general, not individual medical advice" to be present
 * rather than implied.
 *
 * 🔴 THE REDIRECT AND ITS LOOP GUARD ARE UNTOUCHED. A signed-out arrival
 * carrying a `session_id` goes to `/auth/post-checkout`, and `post_checkout=1`
 * is what stops that becoming a loop. Not one branch of it changed.
 */

export const metadata: Metadata = {
  title: 'Membership Confirmed | Andro Prime',
  description: 'Your membership is live.',
  robots: { index: false, follow: false },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

const MEMBERSHIP_PRICE = PRODUCT_MAP.membership.price

/* The three call sites of this format are `/account/membership`, `/account` and
   this page. Not shared yet: the other two are inside pages verified by
   screenshot in batches 3 and 4, and a shared formatter is worth one pass
   through all three rather than a third definition and two untouched siblings.
   Recorded in STATE.md as owed. */
interface PageProps {
  searchParams: Promise<{
    session_id?: string | string[]
    post_checkout?: string | string[]
  }>
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function SubscriptionConfirmedPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sessionId = first(params.session_id)

  // /auth/post-checkout preserves session_id on its way back (see that route and
  // /order/confirmed). Without this guard, a sign-in that fails after the round
  // trip would bounce the customer between the two routes forever. This page has
  // no use for the reference itself; it only needs the loop guard.
  const cameFromPostCheckout = first(params.post_checkout) === '1'

  const user = await getCurrentUser()

  if (!user && sessionId && !cameFromPostCheckout) {
    redirect(`/auth/post-checkout?session_id=${encodeURIComponent(sessionId)}&next=/subscription/confirmed`)
  }

  const membership = user ? await latestMembershipForUser(user.id) : null
  const entitlement = entitlementState(membership, new Date())

  // Decision 1 above: the checkout session proves the payment, the row proves
  // only the date. A member arriving without a session_id (a bookmark, a back
  // button) is still a member and still gets the confirmation.
  const isMember = entitlement.kind !== 'none' || Boolean(membership?.retest_claimed_at)
  const confirmed = Boolean(sessionId) || isMember

  const retestDueAt = entitlement.kind === 'pending' || entitlement.kind === 'due' ? entitlement.dueAt : null

  if (!confirmed) {
    return (
      <FPage>
        <FHero narrow>
          <div className="f-btns" style={{ marginBottom: 18 }}>
            <span className="f-eyebrow">Nothing to confirm</span>
          </div>
          <h1 className="f-h1">
            There is nothing<br /><span className="f-grey">to confirm here.</span>
          </h1>
          <p className="f-stand" style={{ marginTop: 20 }}>
            This page confirms a membership at the moment it starts. You have reached it without
            one, which usually means a bookmark or a back button rather than anything going wrong.
          </p>
          {/* One button when signed out, because both of the signed-in
              destinations are gated: offering "Your results" to someone with no
              session is offering him the login page twice under two names. */}
          <div className="f-btns" style={{ marginTop: 26 }}>
            {user ? (
              <>
                <Link href="/account" className="f-btn">
                  Your account {ARROW}
                </Link>
                <Link href="/results-dashboard" className="f-btn f-btn-ghost">
                  Your results
                </Link>
              </>
            ) : (
              <a href={urlFor('/auth/login')} className="f-btn">
                Sign in {ARROW}
              </a>
            )}
          </div>
        </FHero>
      </FPage>
    )
  }

  return (
    <FPage>
      <FHero
        aside={
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">What you are paying</p>
              <span className="f-price">{MEMBERSHIP_PRICE}</span>
              {/* Carried from `/membership`, whose §04 inverted panel states the
                  renewal in these words. The last clause is the reason the
                  sentence exists and it is not softened here. */}
              <p className="f-sub" style={{ fontSize: 14.5, marginTop: 12 }}>
                Charged each month until you cancel. That is an automatic renewal and we are not
                going to describe it as anything else.
              </p>
              <p className="f-fine" style={{ marginTop: 14 }}>
                Cancelling is self-serve in your account and takes no longer than joining did.
              </p>
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Membership active</span>
        </div>
        <h1 className="f-h1">You&rsquo;re a member.</h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Your receipt is in your email. From here the record keeps running, and there is a retest
          on a date rather than a credit in an account.
        </p>
      </FHero>

      {/* ---------- 01 · THE RETEST ---------- */}
      <FSection>
        <p className="f-blab">The retest</p>
        {/* The heading is `/membership`'s own, verbatim: it is the one thing
            about membership most worth reading twice, and a member who has just
            joined should meet the same sentence the page that sold it used. */}
        <h2 className="f-h2">
          A test on a date,<br /><span className="f-grey">not a credit in an account.</span>
        </h2>

        <div className="f-tray f-rise" style={{ marginTop: 24, marginBottom: 0 }}>
          <div className="f-core">
            {retestDueAt ? (
              <>
                <p className="f-blab">Your retest falls on</p>
                <span className="f-rdue">{formatLongDate(retestDueAt)}</span>
                <p className="f-sub" style={{ fontSize: 14.5, marginTop: 12 }}>
                  {MEMBERSHIP_RETEST_TERMS}
                </p>
              </>
            ) : (
              /* Decision 2. No readout class here: there is no date to read
                 yet. The row is written by the Stripe webhook and a customer
                 can arrive ahead of it, so this state is a genuine new member
                 a second early, not an error. */
              <>
                <p className="f-blab">Your retest date</p>
                <p className="f-sub" style={{ marginTop: 10 }}>
                  It is set from today and appears on your membership page as soon as the payment
                  confirms. {MEMBERSHIP_RETEST_TERMS}
                </p>
              </>
            )}

            {/*
              🔴 A SIGNED-OUT ARRIVAL IS POSSIBLE HERE AND MUST NOT BE SENT TO A
              PAGE THAT BOUNCES HIM. `/auth/post-checkout` stamps `post_checkout=1`
              when the sign-in round trip has already been attempted, which is
              what stops the redirect above looping — and it means a customer
              whose session did not survive Stripe lands on this page signed out,
              holding a `session_id` that proves he paid. Deep links to the
              membership and the dashboard would both 307 him to a login page
              from a screen that has just told him he is a member. He had an
              account before he got here (the checkout POST requires auth), so
              the ask is simply to sign in again, not to create one.
            */}
            <div className="f-btns" style={{ marginTop: 20 }}>
              {user ? (
                <>
                  <Link href="/account/membership" className="f-btn">
                    Go to your membership {ARROW}
                  </Link>
                  <Link href="/results-dashboard" className="f-btn f-btn-ghost">
                    Go to your dashboard
                  </Link>
                </>
              ) : (
                <>
                  <a href={urlFor('/auth/login')} className="f-btn">
                    Sign in to your membership {ARROW}
                  </a>
                  <a href={urlFor('/auth/link')} className="f-btn f-btn-ghost">
                    Get a sign-in link
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · WHAT IT INCLUDES ---------- */}
      <FSection>
        <p className="f-blab">What membership includes</p>

        <div className="f-tray f-rise" style={{ marginTop: 24, marginBottom: 0 }}>
          <div className="f-core">
            <div className="f-numlist">
              {MEMBERSHIP_INCLUDES.map((item, i) => (
                <div key={item}>
                  <span className="f-numdot">{i + 1}</span>
                  <div>
                    <p className="f-sub" style={{ fontSize: 15, marginTop: 2 }}>{item}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="f-fine" style={{ marginTop: 18 }}>
              Clinician answers are general and published to every member; they are not individual
              medical advice and they do not replace your GP.
            </p>
          </div>
        </div>
      </FSection>
    </FPage>
  )
}
