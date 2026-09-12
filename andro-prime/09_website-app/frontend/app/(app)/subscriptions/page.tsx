import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth/session'
import { markViewedCancelPage } from '@/lib/customerio/emit'
import { getSubscriptions } from '@/lib/subscriptions/getSubscriptions'
import type { SubscriptionRow, SubscriptionStatus } from '@/lib/subscriptions/getSubscriptions'
import { BillingPortalButton } from '@/components/commerce/BillingPortalButton'
import { AppStrip, AppShell } from '@/components/app/AppShell'
import { urlFor } from '@/lib/hosts'
import { formatLongDate } from '@/lib/date/format'

export const metadata: Metadata = {
  title: 'Your Subscriptions',
  robots: { index: false, follow: false },
}

/*
 * /subscriptions, REBUILT IN DIRECTION F ON 2026-09-11. Batch 3.
 *
 * Frame: design/mockups/journey/account-F.html, Frames L (one active
 * subscription) and L2 (all six status badges). Pictures, not a spec.
 *
 * 🔴 THE MOST IMPORTANT THING ABOUT THIS PAGE IS INVISIBLE ON IT. Opening it
 * calls `markViewedCancelPage`, which flags the Customer.io profile with
 * `viewed_cancel_page`, which feeds segment 20, which enrols the customer into
 * the seq-05 churn-prevention campaign. VIEWING THIS SCREEN IS THE CANCEL-INTENT
 * SIGNAL. Two consequences the rebuild has to carry, both from the frame:
 *
 *   The page is a retention surface whether it looks like one or not, so the
 *   empty and cancelled states must not read as an exit sign.
 *
 *   "Manage billing" hands the customer to Stripe's hosted portal, which is the
 *   one place in the authenticated app where the design system stops. The button
 *   says where it goes rather than pretending the journey continues inside our
 *   own pages.
 *
 * ⚠ COLOUR SEPARATES THE TWO STATES THAT NEED AN ACTION FROM THE FOUR THAT DO
 * NOT, and that is the whole reason it is spent here. The live page drew all six
 * statuses identically as a black or white slab, so "Payment due", which the
 * customer can fix in a minute, looked exactly like "Cancelled", which he chose.
 * Cancelled is deliberately grey and not red: a customer who chose it does not
 * need it shouted at him.
 *
 * 🔴 TWO THINGS THE FRAME RAISES ARE NOT BUILT HERE, DELIBERATELY.
 *
 *   A "What stops if you cancel" block. The frame marks it NOT ON THE LIVE PAGE
 *   and proposes rather than assumes it. It is new customer-facing copy about
 *   what a membership entitles someone to, which is exactly the material the
 *   auto-renew ruling is still being swept through, so a rebuild inventing it
 *   would be writing unreviewed entitlement copy. Owed to Keith as a decision.
 *
 *   The empty state reads identically to someone who has just cancelled and to
 *   someone who never subscribed. The frame names it and does not resolve it,
 *   and resolving it needs a cancelled-recently signal this page does not have.
 *
 * 🔴 AND A LIVE BLOCKER THAT IS NOT THIS PAGE'S TO FIX, RECORDED SO IT IS NOT
 * LOST: `getSubscriptions` queries `supplement_subscriptions` only, while a
 * membership owns a row in `memberships`. Under the 2026-09-07 auto-renew ruling
 * every kit buyer becomes a membership-only customer, so every one of them would
 * reach the EMPTY state on the page that is supposed to let them cancel, and the
 * portal route 404s for them. See 09_website-app/STATE.md.
 */

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active:     'Active',
  trialing:   'Trial',
  past_due:   'Payment due',
  incomplete: 'Incomplete',
  unpaid:     'Unpaid',
  cancelled:  'Cancelled',
}

/*
 * `o` paying or about to pay. `w` needs the customer and he can fix it. `c`
 * stopped and not by choice, so the entitlements and the retest date went with
 * it. `n` stopped BY choice.
 *
 * The class names are written out at the call site rather than held here, for
 * the reason `/account`'s header sets out at length: the class checker reads
 * literals inside `className`, so a name that only ever lives in a lookup table
 * is invisible to it and its rule is reported as unused for ever after.
 */
const STATUS_TONE: Record<SubscriptionStatus, 'n' | 'o' | 'w' | 'c'> = {
  active:     'o',
  trialing:   'o',
  past_due:   'w',
  incomplete: 'w',
  unpaid:     'c',
  cancelled:  'n',
}

const ACTIVE_FOR_COUNT: ReadonlySet<SubscriptionStatus> = new Set<SubscriptionStatus>([
  'active',
  'trialing',
])

function SubscriptionCard({ sub }: { sub: SubscriptionRow }) {
  const tone = STATUS_TONE[sub.status]
  return (
    <div className="f-tray f-rise">
      <div className="f-core">
        <div className="f-subtop">
          <div>
            <h2>{sub.productName}</h2>
            {sub.price && <p className="f-subprice">{sub.price}</p>}
          </div>
          <span
            className={
              tone === 'o'
                ? 'f-stat f-stat-o'
                : tone === 'w'
                  ? 'f-stat f-stat-w'
                  : tone === 'c'
                    ? 'f-stat f-stat-c'
                    : 'f-stat f-stat-n'
            }
          >
            {STATUS_LABELS[sub.status]}
          </span>
        </div>
        <p className="f-fine">Started {formatLongDate(sub.startedAt)}</p>
        <div className="f-subfoot">
          <BillingPortalButton className="f-btn">
            Manage billing <span aria-hidden="true">&#8599;</span>
          </BillingPortalButton>
          {/* Says where it goes. Stripe is outside this design system and is the
              only place in the signed-in app where that happens. */}
          <span className="f-fine" style={{ maxWidth: '34ch' }}>
            Opens Stripe, which handles our billing.
          </span>
        </div>
      </div>
    </div>
  )
}

export default async function SubscriptionsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  // Viewing the billing/subscriptions screen is a cancel-intent signal. Flag the
  // CIO profile (viewed_cancel_page) so segment 20 can enrol the customer into
  // the seq-05 churn-prevention campaign. Resilient + idempotent (see helper);
  // run alongside the data fetch so it doesn't add serial latency.
  const [subscriptions] = await Promise.all([
    getSubscriptions(user.id),
    markViewedCancelPage(user.email),
  ])

  const activeCount = subscriptions.filter((s) => ACTIVE_FOR_COUNT.has(s.status)).length

  return (
    <>
      <AppStrip
        label="Your subscriptions"
        right={
          subscriptions.length === 0
            ? 'None'
            : `${activeCount} active`
        }
      />
      <AppShell
        chip="Billing"
        heading="What you pay for, and how to stop."
        intro="Everything you currently pay us for, and what it costs. Managing or cancelling happens in Stripe, which handles our billing."
      >
        {subscriptions.length === 0 ? (
          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-blab">Your subscriptions</p>
              <p className="f-sub">You do not have an active subscription.</p>
              {/* Cross-host: /supplements is MARKETING on the apex. */}
              <a href={urlFor('/supplements')} className="f-btn" style={{ marginTop: 20 }}>
                Browse supplements <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        ) : (
          subscriptions.map((sub) => <SubscriptionCard key={sub.id} sub={sub} />)
        )}
      </AppShell>
    </>
  )
}
