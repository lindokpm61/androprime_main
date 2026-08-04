import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getOrderRefForCheckoutSession } from '@/lib/orders/getOrderRefForCheckoutSession'

export const metadata: Metadata = {
  title: 'Order Confirmed | Andro Prime',
  description: 'Your kit is on its way.',
  robots: { index: false, follow: false },
}

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
    <>
      {/* CONFIRMATION HERO */}
      <section className="pt-40 pb-24 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-black mb-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="square">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="data-label !text-white !text-[10px]">Order confirmed</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            Kit on its way.
          </h1>

          <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-2xl">
            Your order is confirmed and your kit will be dispatched the same working day. Check your email for your receipt.
          </p>

          {orderRef ? (
            <div className="mt-10 inline-block border-2 border-black px-8 py-5">
              <span className="data-label text-[10px] block mb-2">Your order reference</span>
              <span className="font-mono font-black text-3xl tracking-tight text-black">
                {orderRef}
              </span>
              <span className="block mt-3 font-serif text-sm text-black">
                Quote this if you contact us. It is also on your receipt and in your account.
              </span>
            </div>
          ) : (
            <div className="mt-10 inline-block border-2 border-black px-8 py-5">
              <span className="data-label text-[10px] block mb-2">Your order reference</span>
              <span className="block font-serif text-sm text-black max-w-md">
                Your reference is on the confirmation email we have just sent you, and in your
                account under Test history.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* NEXT STEPS */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="data-label flex items-center gap-4 mb-12">
            <span className="w-12 h-[2px] bg-black" />
            What happens next
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-6 leading-none">01</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-black mb-3">Kit arrives</h3>
              <p className="font-serif text-sm text-black leading-relaxed">
                Dispatched the same working day. Fits through your letterbox. Everything you need is inside.
              </p>
            </div>

            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-6 leading-none">02</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-black mb-3">Collect and return</h3>
              <p className="font-serif text-sm text-black leading-relaxed">
                Five-minute finger-prick at home. Drop it back in any postbox using the prepaid return envelope in your kit.
              </p>
            </div>

            <div className="p-8 bg-black">
              <div className="font-sans font-black text-5xl text-white/20 mb-6 leading-none">03</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-white mb-3">Results in 2 to 5 working days</h3>
              <p className="font-serif text-sm text-gray-400 leading-relaxed">
                Our UKAS accredited lab processes your sample. Results go to your dashboard with a plain-English explanation and a specific next step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT CTA */}
      <section className="py-24 bg-gray-50 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="border-4 border-black p-10 md:p-14 bg-white">
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-black" />
              {isLoggedIn ? 'You’re all set' : 'One more thing'}
            </div>

            {isLoggedIn ? (
              <>
                <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-6">
                  Results land in<br />your dashboard.
                </h2>

                <p className="text-lg text-black font-serif leading-relaxed mb-10 max-w-xl">
                  Your kit is linked to your account. The moment your sample is processed, your results, recommendations, and next steps will appear on your private dashboard.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Link
                    href="/results-dashboard"
                    className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-colors"
                  >
                    Go to dashboard
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/kits"
                    className="data-label text-black hover:underline flex items-center gap-2"
                  >
                    Browse other tests
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-6">
                  Sign in to see<br />your results.
                </h2>

                <p className="text-lg text-black font-serif leading-relaxed mb-10 max-w-xl">
                  We&rsquo;ve created your account from your order. Get a one-time sign-in link by email to reach your private dashboard. No password to remember.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Link
                    href="/auth/link?next=/results-dashboard"
                    className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-colors"
                  >
                    Get a sign-in link
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/auth/login"
                    className="data-label text-black hover:underline flex items-center gap-2"
                  >
                    Use a password instead
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* REASSURANCE STRIP */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-8 justify-center">
            {[
              'UKAS ISO 15189 Lab',
              'Same-day dispatch',
              'GMC-Registered Doctor',
              'Results in 2 to 5 working days',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 data-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
