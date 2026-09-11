import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth/session'
import { getSupplementWaitlistStatus } from '@/lib/supplement-waitlist/getSupplementWaitlistStatus'
import { AppStrip, AppShell } from '@/components/app/AppShell'
import { urlFor } from '@/lib/hosts'

export const metadata: Metadata = {
  title: 'Supplement Waitlist Status',
  robots: { index: false, follow: false },
}

/*
 * /supplement-waitlist-status, REBUILT IN DIRECTION F ON 2026-09-11. Batch 3.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * account-F.html enumerates `/account` and `/subscriptions` and results-F.html
 * draws the dashboard; this route appears in neither, and the inventory never
 * listed it. So the shell came from `components/app/AppShell` like every other
 * screen in this batch and the arrangement is decided against DESIGN.md.
 *
 * 🔴 IT WAS WEARING ANOTHER PAGE'S CLOTHES, AND THAT PAGE IS RETIRED. Every
 * class on the old markup was `founding-member-status__*`, served by
 * `styles/pages/founding-member-status.css`. The founding-member programme
 * closed on 2026-07-22 and `/founding-member-status` is now an eleven-line
 * `redirect('/account')` with no markup at all, so this route was the only thing
 * keeping that stylesheet alive. A borrowed class name is invisible until
 * somebody deletes the page it was named after.
 *
 * EVERY WORD OF COPY IS VERBATIM. Both headings, both bodies, the CTA label and
 * the removal line are unchanged, including "No payment is required." and
 * "Joining is free. No payment, no commitment." Nothing here is a claim a
 * rebuild may restate.
 *
 * ⚠ ONE LINK CHANGED AND IT IS A CROSS-HOST FIX, NOT A STYLING ONE. The join CTA
 * pointed at `/supplement-waitlist` through `next/link`. That route is MARKETING
 * on the apex and this page is on the app host, so a client-side navigation
 * cannot reach it: it takes a middleware round trip at best. It is a plain
 * anchor through `urlFor` now, which is the rule `/account` and
 * `/subscriptions` already follow and the comment in each says why.
 */

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function SupplementWaitlistStatusPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const status = await getSupplementWaitlistStatus(user.id)

  const heading = status.listed
    ? "You're on the supplement waitlist."
    : 'Not on the waitlist yet.'
  const body = status.listed
    ? `You were added on ${status.listedAt ? formatDate(new Date(status.listedAt)) : 'an earlier date'}. We'll email you the moment our supplement range is ready to ship. No payment is required.`
    : 'You are not on the supplement waitlist yet. Joining is free. No payment, no commitment. We email you when the range is live.'

  return (
    <>
      <AppStrip label="Supplement waitlist" right={status.listed ? 'On the list' : 'Not listed'} />
      <AppShell
        chip={status.listed ? 'Listed' : 'Not listed'}
        heading="Where you stand on the supplement waitlist."
        /*
         * 🔴 "NOTHING HAPPENS AUTOMATICALLY WHEN THE RANGE GOES LIVE" WAS THE
         * FIRST DRAFT AND IT CONTRADICTED THE APPROVED COPY TWO LINES BELOW IT.
         * Something does happen automatically: we email you, which is the entire
         * mechanic the customer opted into, and the CA-009 body on this same
         * screen says so twice. The intended meaning was no charge and no order,
         * so it now says that, in the terms the approved body already uses
         * ("No payment, no commitment"). Caught by the independent pre-flight.
         */
        intro="The list is how we decide how much to make and who hears first. It costs nothing to be on it, and being on it commits you to nothing."
      >
        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Your status</p>
            <h2 className="f-h4">{heading}</h2>
            <p className="f-sub">{body}</p>
            {!status.listed && (
              /* Cross-host: /supplement-waitlist is MARKETING on the apex. */
              <a href={urlFor('/supplement-waitlist')} className="f-btn" style={{ marginTop: 22 }}>
                Join the supplement waitlist <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        </div>

        <div className="f-tray f-rise">
          <div className="f-core">
            <p className="f-blab">Coming off the list</p>
            <p className="f-sub">
              Want to be removed from the list? Email{' '}
              <a href="mailto:hello@andro-prime.com" className="f-tlink">
                hello@andro-prime.com
              </a>{' '}
              and we&rsquo;ll take you off.
            </p>
          </div>
        </div>
      </AppShell>
    </>
  )
}
