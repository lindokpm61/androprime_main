import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Founding Member Confirmed — Andro Prime',
  description: 'Your £75 deposit is confirmed. Founding member status active.',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ session_id?: string | string[] }>
}

export default async function DepositConfirmedPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sessionIdParam = params.session_id
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam

  const user = await getCurrentUser()

  if (!user && sessionId) {
    redirect(`/auth/post-checkout?session_id=${encodeURIComponent(sessionId)}&next=/deposit/confirmed`)
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
            <span className="data-label !text-white !text-[10px]">Founding member</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            You&rsquo;re in.
          </h1>

          <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-2xl">
            Your £75 deposit is confirmed. Founding member status is now active on your account.
          </p>
        </div>
      </section>

      {/* WHAT THIS MEANS */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="data-label flex items-center gap-4 mb-12">
            <span className="w-12 h-[2px] bg-black" />
            What this means
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-6 leading-none">01</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-black mb-3">First in line</h3>
              <p className="font-serif text-sm text-black leading-relaxed">
                When we launch TRT, you&rsquo;re at the front of the queue. No waitlist, no cold inquiry &mdash; your place is already confirmed.
              </p>
            </div>

            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
              <div className="font-sans font-black text-5xl text-gray-200 mb-6 leading-none">02</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-black mb-3">£75 applied as credit</h3>
              <p className="font-serif text-sm text-black leading-relaxed">
                Your deposit goes straight toward your first month of TRT when we launch. You&rsquo;re paying early, not extra.
              </p>
            </div>

            <div className="p-8 bg-black">
              <div className="font-sans font-black text-5xl text-white/20 mb-6 leading-none">03</div>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-white mb-3">Founding pricing locked</h3>
              <p className="font-serif text-sm text-gray-300 leading-relaxed">
                A lower monthly rate than standard, locked in for as long as you&rsquo;re an active member.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATUS CTA */}
      <section className="py-24 bg-gray-50 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">

          <div className="border-4 border-black p-10 md:p-14 bg-white">
            <div className="data-label flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-black" />
              Stay in the loop
            </div>

            <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-6">
              Track your<br />founding status.
            </h2>

            <p className="text-lg text-black font-serif leading-relaxed mb-10 max-w-xl">
              View your founding member position, refund details, and CQC progress updates from your dashboard. We send a monthly update by email so you always know where things stand.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                href="/founding-member-status"
                className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all"
              >
                Founding member status
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
              'GMC-Registered Prescriber',
              'Fully refundable',
              'Direct line to Dr Ewa',
              'UK regulated',
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
