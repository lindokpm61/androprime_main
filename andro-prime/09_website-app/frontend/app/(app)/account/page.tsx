import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { getAccountData } from '@/lib/account/getAccountData'
import type { KitOrderSummary, OrderStatus } from '@/lib/account/getAccountData'
import { isAccountDataControlsEnabled, isAccountAddressEnabled } from '@/lib/flags'
import { DataPrivacySection } from '@/components/account/DataPrivacySection'
import { AddressSection } from '@/components/account/AddressSection'
import { AppStrip, AppShell } from '@/components/app/AppShell'
import { getAddress } from '@/lib/account/getAddress'
import { urlFor } from '@/lib/hosts'

export const metadata: Metadata = {
  title: 'Your Account',
  robots: { index: false, follow: false },
}

/*
 * /account, REBUILT IN DIRECTION F ON 2026-09-11. Batch 3, the seven gated app
 * routes.
 *
 * Frame: design/mockups/journey/account-F.html, Frames K (populated, both
 * flag-dark sections) and K2 (the nine order statuses, and the empty state).
 * Those frames are PICTURES, NOT A SPEC (Keith, 2026-09-08): the arrangement and
 * the content are taken from them, the CSS is the app's own.
 *
 * NOT A WORD OF THE EXISTING COPY CHANGED. Every label, every status string,
 * every CTA and the two flag-dark sections' wording are as they were. What is
 * new is the sidebar's heading and its one paragraph, which the frame drafted
 * for this screen and which had no equivalent on the live page. New
 * customer-facing sentences, so they go through the compliance pre-flight before
 * this batch is called done; they make no health claim and name no product.
 *
 * 🔴 ONE BEHAVIOUR CHANGED, AND THE FRAME IS WHY IT WAS FOUND. A cancelled or
 * refunded order rendered "Awaiting results" in the action column, because the
 * live code branches on `hasResults` alone and those two statuses never have
 * them. So the page told a customer whose order was refunded that his results
 * were on the way. The frame drew all nine statuses in one place, which is the
 * only reason two of them were ever seen side by side. Ended orders now render a
 * dash, and the ORDER_STATUS_LABELS entry already says why.
 *
 * ⚠ COLOUR IS SPENT ON PROCESS, NEVER ON A VERDICT. Six of the nine statuses are
 * fulfilment steps and carry no colour at all, because a kit being in the post is
 * neither good news nor bad. Green is the one that changed something, amber the
 * one that asks the customer to act, red the two that ended it. Every badge also
 * states its status as a word, so colour is never the only carrier. Ruling:
 * Keith, 2026-08-28 on membership-F.
 */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:           'Order placed',
  paid:              'Payment confirmed',
  dispatched:        'Kit dispatched',
  sample_registered: 'Sample registered',
  processing:        'Processing',
  results_received:  'Results ready',
  sample_failed:     'Sample issue: recollection',
  cancelled:         'Cancelled',
  refunded:          'Refunded',
}

/*
 * The tone of each status, and it is the only place the mapping lives.
 *
 * `n` for the five fulfilment steps: an order moving through the post is not an
 * event. `o` for the one that changed something. `w` for the one that asks the
 * customer to collect again, which is recoverable and he is the one who
 * recovers it. `c` for the two that ended the order.
 *
 * recovers it. `c` for the two that ended the order.
 */
type StatusTone = 'n' | 'o' | 'w' | 'c'

const ORDER_STATUS_TONE: Record<OrderStatus, StatusTone> = {
  pending:           'n',
  paid:              'n',
  dispatched:        'n',
  sample_registered: 'n',
  processing:        'n',
  results_received:  'o',
  sample_failed:     'w',
  cancelled:         'c',
  refunded:          'c',
}

/*
 * ⚠ THE FOUR CLASS NAMES ARE WRITTEN OUT INSIDE THE `className` EXPRESSION, AND
 * THAT IS NOT STYLE PREFERENCE.
 *
 * `verify-f-classes.js` reads string literals out of `className="..."` and
 * `className={...}`. It cannot see a class name that lives in a module-level
 * constant, and it does not claim to. Two different mistakes follow from that,
 * and this shape is the only one that avoids both:
 *
 *   Interpolating the tone into a template literal reaches the checker as the
 *   truncated stem, which matches no rule, so the build FAILS. That happened
 *   here and is the check working.
 *
 *   Holding the whole string in a lookup table and passing the table's value
 *   reaches the checker as nothing at all. The build passes, and all four
 *   modifiers are then reported in the "defined and not rendered anywhere" list
 *   for the rest of their lives. That list is the one somebody prunes from, and
 *   this repository has already lost `.f-tray-flag`'s accent ring once to a rule
 *   that looked unused. A silent pass is worse than the failure above.
 *
 * A helper returning the literals does not fix it either, for the same reason: a
 * `return 'f-stat f-stat-o'` is not inside a `className`, so the scanner reads
 * none of it. The literals have to sit in the attribute, so they do.
 */

/** An order that ended has no result coming, so it gets no waiting line. */
const ENDED_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>(['cancelled', 'refunded'])

function OrderRow({ order }: { order: KitOrderSummary }) {
  const ended = ENDED_STATUSES.has(order.status)
  const tone = ORDER_STATUS_TONE[order.status]
  return (
    <div className="f-histrow">
      <span className="f-histkit">
        {order.kitName}
        {order.orderRef && <span className="f-histref">{order.orderRef}</span>}
      </span>
      <span>
        <span className="f-histlab">Status</span>
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
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </span>
      <span className="f-histwhen">
        <span className="f-histlab">Date</span>
        {formatDate(order.orderedAt)}
      </span>
      {/*
        THE ACTION CELL IS OMITTED ENTIRELY FOR AN ORDER THAT ENDED, its phone
        label included.

        Not "Awaiting results", which is what the live page rendered: it branched
        on `hasResults` alone, and a cancelled or refunded order never has them,
        so the page told a customer whose order was refunded that his results
        were on the way. Not a dash either. The frame's note says "blank or say
        why", the status badge one column to the left already says why, and a
        dash would be a rendered em dash in customer-facing UI, which the house
        rule bans outright. Dropping the label with the value is what stops a 390
        reader getting an orphaned "ACTION" key over nothing.
      */}
      {ended ? (
        <span />
      ) : (
        <span>
          <span className="f-histlab">Action</span>
          {order.hasResults ? (
            <Link href="/results-dashboard" className="f-tlink">
              View results
            </Link>
          ) : (
            <span className="f-histwait">Awaiting results</span>
          )}
        </span>
      )}
    </div>
  )
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const account = await getAccountData(user.id, user.email ?? '')

  // Delivery-address surface: dark behind ACCOUNT_ADDRESS_ENABLED (default OFF),
  // so the address is only queried when the section is actually rendered and the
  // page is byte-identical to before when the flag is unset. Flip on alongside
  // BUNDLES_ENABLED so the bundle address-check email links to a live surface.
  const address = isAccountAddressEnabled() ? await getAddress(user.id) : null

  const orderCount = account.orders.length
  const resultCount = account.orders.filter((o) => o.hasResults).length

  return (
    <>
      <AppStrip label="Your account" right={account.email} />
      <AppShell
        chip={
          orderCount === 0
            ? 'No kits yet'
            : `${orderCount} ${orderCount === 1 ? 'kit' : 'kits'}, ${resultCount} ${resultCount === 1 ? 'result' : 'results'}`
        }
        heading="Everything we hold, and what you can do with it."
        intro="This is the one screen that has to answer a question we would rather it never had to: what have you got on me, and how do I get it back or get rid of it. It reads better when that answer is not buried."
      >
        {/* 02. PROFILE */}
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Profile</p>
            <div className="f-pfield">
              <span className="f-pfield-k">Email</span>
              <span className="f-pfield-v">{account.email}</span>
            </div>
            {account.age !== null && (
              <div className="f-pfield">
                <span className="f-pfield-k">Age</span>
                <span className="f-pfield-v">{account.age}</span>
              </div>
            )}
          </div>
        </div>

        {/* 03 + 04. TEST HISTORY */}
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Test history</p>
            {orderCount === 0 ? (
              <>
                <p className="f-sub">No tests ordered yet.</p>
                {/* Cross-host: /kits is MARKETING on the apex, this page is on
                    the app host. Must be a plain <a>, never next/link, which
                    cannot client-navigate across origins. */}
                <a href={urlFor('/kits')} className="f-btn" style={{ marginTop: 20 }}>
                  Browse tests <span aria-hidden="true">&rarr;</span>
                </a>
              </>
            ) : (
              <>
                <div className="f-histhead">
                  <span>Kit</span>
                  <span>Status</span>
                  <span>Date</span>
                  <span>Action</span>
                </div>
                {account.orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* 07. MANAGE */}
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Manage</p>
            {/* One link, two labels, decided by the same flag that decides where
                it goes. Founding-member quick-link removed 2026-06-04 (FM
                take-down: low-T routing decision); account.isOnFoundingMemberList
                still resolves if the list reopens. */}
            <Link href="/subscriptions" className="f-qlink">
              {account.hasActiveSubscription ? 'Your subscriptions' : 'Browse supplements'}
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <a href="mailto:support@andro-prime.com" className="f-qlink">
              Contact support
              <span className="f-qlink-n">support@andro-prime.com</span>
            </a>
          </div>
        </div>

        {/* Delivery address (dark behind ACCOUNT_ADDRESS_ENABLED). Edits the
            same users-row columns the bundle second-kit dispatch reads. */}
        {address && <AddressSection initial={address} />}

        {/* Data & privacy (export + data-use statement + erasure request).
            Dark behind ACCOUNT_DATA_CONTROLS_ENABLED (default OFF): the account
            page is byte-identical to before when the flag is unset. Pending a
            compliance read of the data-use wording + Keith confirming the
            erasure ops-alert address/SLA. See
            docs/2026-07-17-bucket-ab-implementation-plan.md.

            The app footer links to `#data-privacy` and is gated on the same
            flag, so the anchor and the links appear and disappear together. */}
        {isAccountDataControlsEnabled() && <DataPrivacySection />}
      </AppShell>
    </>
  )
}
