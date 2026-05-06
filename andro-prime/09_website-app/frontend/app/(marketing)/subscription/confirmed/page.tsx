import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { generatePostCheckoutSignInUrl } from '@/lib/auth/postCheckoutSignIn'

export const metadata: Metadata = {
  title: 'Subscription Active — Andro Prime',
  description: 'Your subscription is confirmed.',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ session_id?: string | string[] }>
}

export default async function SubscriptionConfirmedPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sessionIdParam = params.session_id
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam

  const user = await getCurrentUser()

  if (!user && sessionId) {
    const signInUrl = await generatePostCheckoutSignInUrl(sessionId, '/subscription/confirmed')
    if (signInUrl) redirect(signInUrl)
  }

  return (
    <>
      {/* CONFIRMATION HERO */}
      <section className="pt-40 pb-24 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-black mb-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="square">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="data-label !text-white !text-[10px]">Subscription active</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            Your stack<br />is starting.
          </h1>

          <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-2xl">
            First box dispatching this week. Renewal date and receipt are in your email.
          </p>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="data-label flex items-center gap-4 mb-12">
            <span className="w-12 h-[2px] bg-black" />
            What happens next
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-6 leading-none">01</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-black mb-3">First box ships</h3>
              <p className="font-serif text-sm text-black leading-relaxed">
                Posted within 2 working days. Free UK delivery. Letterbox-friendly so you don&rsquo;t need to be in.
              </p>
            </div>

            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-6 leading-none">02</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-black mb-3">Auto-renews monthly</h3>
              <p className="font-serif text-sm text-black leading-relaxed">
                Same products, same delivery, same date each month. A receipt lands in your inbox every renewal.
              </p>
            </div>

            <div className="p-8 bg-black">
              <div className="font-sans font-black text-5xl text-white/20 mb-6 leading-none">03</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-white mb-3">Skip, pause, cancel</h3>
              <p className="font-serif text-sm text-gray-300 leading-relaxed">
                Manage everything from your account. No phone calls, no email chains, no dark patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MANAGE CTA */}
      <section className="py-24 bg-gray-50 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="border-4 border-black p-10 md:p-14 bg-white">
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-black" />
              You&rsquo;re in control
            </div>

            <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-6">
              Pause, skip, or<br />cancel anytime.
            </h2>

            <p className="text-lg text-black font-serif leading-relaxed mb-10 max-w-xl">
              Manage your subscription from your account. Change your renewal date, skip a month, or cancel completely &mdash; whatever works for you.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                href="/subscriptions"
                className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all"
              >
                Manage subscription
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/account"
                className="data-label text-black hover:underline flex items-center gap-2"
              >
                Your account
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REASSURANCE STRIP */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-8 justify-center">
            {[
              'UK manufactured',
              'Free UK delivery',
              'Cancel anytime',
              'Pause from account',
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
