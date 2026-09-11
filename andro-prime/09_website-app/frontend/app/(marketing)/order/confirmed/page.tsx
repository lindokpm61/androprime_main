import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { getCurrentUser } from '@/lib/auth/session'
import { getOrderRefForCheckoutSession } from '@/lib/orders/getOrderRefForCheckoutSession'

/**
 * /order/confirmed, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FRAME W AND W2, `design/mockups/journey/buy-F.html`. Layout ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY WORD IS VERBATIM. The eyebrow, the headline, the standfirst, both order
 * reference states, all three step titles and bodies, both account-block
 * headings and bodies, all four button labels and all four trust items are
 * byte-identical to the V2.0 page. The one section label the F grammar requires
 * is "What happens next", which was already on the page as its own heading.
 *
 * 🔴 THE REDIRECT AND ITS LOOP GUARD ARE UNTOUCHED. A signed-out arrival
 * carrying a `session_id` goes to `/auth/post-checkout` and renders nothing;
 * `post_checkout=1` is what stops that becoming a loop, and the comment below
 * records the scar. Frame W2 writes it down precisely because a frame cannot
 * draw a redirect and an inventory that counts screens will miss it. Not one
 * branch here changed.
 *
 * 🔴 THE ORDER REFERENCE MOVES INTO THE HERO ASIDE, and that is the one
 * structural departure from Frame W, which draws it in a tray directly under the
 * hero. Three reasons. It is the single value a customer returns to this page
 * for, and the `.f-herogrid` right column is where `/contact` puts the same kind
 * of thing (its inbox address, also set in the mono face, for the same reason).
 * It arrives beside the confirmation rather than after it, which is the order a
 * receipt is read in. And the frame's own layout predates `FHero`, so it had no
 * aside to draw into. See `.f-oref` in f-primitives.css for why only the
 * resolved state wears the mono readout.
 *
 * 🔴 STEP 03 IS NO LONGER AN INK PANEL. On the V2.0 page the third step sat on
 * `bg-black` while its two siblings were white, which under this direction is an
 * inverted panel, and the direction spends one per page at most, on a conformity
 * statement. This one was not spending it on a conformity statement; it was
 * spending it on the third of three equal steps. The containment ruling of
 * 2026-09-02 settles the rest: the four prose grids all take one treatment, a
 * rule above and nothing else, so a step that is also a black slab is a second
 * grammar inside one grid. Frame W draws all three the same. No words changed.
 * THE PAGE THEREFORE SPENDS NO INVERTED PANEL, which is allowed ("once per page
 * at most"), and nothing else here is a conformity statement.
 *
 * ⚠ `.f-steps-3`, ADDED FOR THIS PAGE. `.f-steps` turns four-up at 1040px and
 * this section has three steps, so the base grid would leave a quarter of the row
 * empty and the sequence would read as a step somebody forgot. Argued in
 * f-primitives.css.
 *
 * ⚠ THE FRAME DROPS "ISO 15189" FROM STEP 03 AND FROM THE TRUST ROW, AND THE
 * PAGE KEEPS IT. Frame W writes "Our UKAS accredited lab" and "UKAS ISO 15189
 * lab"; the shipped page writes "Our UKAS ISO 15189 accredited lab" and "UKAS ISO
 * 15189 Lab". The accreditation scope is a claim, the frame is a drawing, and the
 * copy rule wins over both. The frame's lower-cased "lab" and "doctor" in the
 * trust row are not adopted either, for the same reason: the words on the page
 * are the ones that were approved.
 */

export const metadata: Metadata = {
  title: 'Order Confirmed | Andro Prime',
  description: 'Your kit is on its way.',
  robots: { index: false, follow: false },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

const STEPS = [
  {
    num: '01',
    title: 'Kit arrives',
    body: 'Dispatched the same working day. Fits through your letterbox. Everything you need is inside.',
  },
  {
    num: '02',
    title: 'Collect and return',
    body: 'Five-minute finger-prick at home. Drop it back in any postbox using the prepaid return envelope in your kit.',
  },
  {
    num: '03',
    title: 'Results in 2 to 5 working days',
    body: 'Our UKAS ISO 15189 accredited lab processes your sample. Results go to your dashboard with a plain-English explanation and a specific next step.',
  },
]

const TRUST = [
  'UKAS ISO 15189 Lab',
  'Same-day dispatch',
  'GMC-Registered Doctor',
  'Results in 2 to 5 working days',
]

interface PageProps {
  searchParams: Promise<{
    session_id?: string | string[]
    post_checkout?: string | string[]
  }>
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function OrderConfirmedPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sessionId = first(params.session_id)

  // Stamped by /auth/post-checkout on its way back here. It means "the sign-in
  // round trip has already been attempted for this session_id", and it is what
  // stops the redirect below becoming a loop: that route now preserves
  // session_id (it used to drop it, which is why this page could never resolve a
  // reference for a first-time buyer), so without this guard a failed sign-in
  // would bounce the customer between the two routes forever.
  const cameFromPostCheckout = first(params.post_checkout) === '1'

  const user = await getCurrentUser()

  if (!user && sessionId && !cameFromPostCheckout) {
    redirect(`/auth/post-checkout?session_id=${encodeURIComponent(sessionId)}&next=/order/confirmed`)
  }

  const isLoggedIn = Boolean(user)

  // Until 2026-08-04 this page read session_id and rendered nothing from it, so a
  // customer who closed the confirmation email had no way to find their reference.
  const orderRef = isLoggedIn ? await getOrderRefForCheckoutSession(sessionId) : null

  return (
    <FPage>
      <FHero
        aside={
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Your order reference</p>
              {orderRef ? (
                <>
                  <span className="f-oref">{orderRef}</span>
                  <p className="f-sub" style={{ fontSize: 14.5, marginTop: 0 }}>
                    Quote this if you contact us. It is also on your receipt and in your account.
                  </p>
                </>
              ) : (
                /* The fallback is what a FIRST-TIME buyer actually sees, because
                   resolving a reference requires being signed in. It stays in
                   `.f-sub` and does not wear `.f-oref`: there is no code to read
                   here, and giving an apology the same readout treatment as the
                   real thing is how a design starts lying about which state is
                   which. Frame W2. */
                <p className="f-sub" style={{ fontSize: 14.5, marginTop: 10 }}>
                  Your reference is on the confirmation email we have just sent you, and in your
                  account under Test history.
                </p>
              )}
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Order confirmed</span>
        </div>
        <h1 className="f-h1">Kit on its way.</h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Your order is confirmed and your kit will be dispatched the same working day. Check your email for your receipt.
        </p>
      </FHero>

      {/* ---------- 01 · WHAT HAPPENS NEXT ---------- */}
      <FSection>
        <p className="f-blab">What happens next</p>

        <div className="f-steps f-steps-3 f-rise" style={{ marginTop: 24 }}>
          {STEPS.map(({ num, title, body }) => (
            <div className="f-step" key={num}>
              <span className="f-no">{num}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- 02 · THE ACCOUNT HANDOVER ----------
          Not `FClose`, and this is the one place the closing ask does not take
          the system's closing component. `.f-close` is centred and carries a
          single ask; this ask has two states that differ in label, heading, body
          and both buttons, and a two-state block centred reads as two different
          pages rather than as one page in one of two conditions. Frame W draws it
          left-aligned in a tray, which is what it gets. */}
      <FSection>
        <p className="f-blab">{isLoggedIn ? 'You’re all set' : 'One more thing'}</p>

        {isLoggedIn ? (
          <>
            <h2 className="f-h2">
              Results land in<br /><span className="f-grey">your dashboard.</span>
            </h2>
            <div className="f-tray f-rise" style={{ marginTop: 24, marginBottom: 0 }}>
              <div className="f-core">
                <p className="f-sub" style={{ marginTop: 0 }}>
                  Your kit is linked to your account. The moment your sample is processed, your results, recommendations, and next steps will appear on your private dashboard.
                </p>
                <div className="f-btns" style={{ marginTop: 20 }}>
                  <Link href="/results-dashboard" className="f-btn">
                    Go to dashboard {ARROW}
                  </Link>
                  <Link href="/kits" className="f-btn f-btn-ghost">
                    Browse other tests
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="f-h2">
              Sign in to see<br /><span className="f-grey">your results.</span>
            </h2>
            <div className="f-tray f-rise" style={{ marginTop: 24, marginBottom: 0 }}>
              <div className="f-core">
                <p className="f-sub" style={{ marginTop: 0 }}>
                  We&rsquo;ve created your account from your order. Get a one-time sign-in link by email to reach your private dashboard. No password to remember.
                </p>
                <div className="f-btns" style={{ marginTop: 20 }}>
                  <Link href="/auth/link?next=/results-dashboard" className="f-btn">
                    Get a sign-in link {ARROW}
                  </Link>
                  <Link href="/auth/login" className="f-btn f-btn-ghost">
                    Use a password instead
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="f-trustrow">
          {TRUST.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </FSection>
    </FPage>
  )
}
