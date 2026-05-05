import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Order Confirmed — Andro Prime',
  description: 'Your kit is on its way.',
  robots: { index: false, follow: false },
}

export default function OrderConfirmedPage() {
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

          <h1 className="text-6xl md:text-8xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            Kit on its way.
          </h1>

          <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-2xl">
            Your order is confirmed and your kit will be dispatched the same working day. Check your email for your receipt.
          </p>
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
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-white mb-3">Results in 48 hours</h3>
              <p className="font-serif text-sm text-gray-300 leading-relaxed">
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
              One more thing
            </div>

            <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-6">
              Your results need<br />somewhere to go.
            </h2>

            <p className="text-lg text-black font-serif leading-relaxed mb-10 max-w-xl">
              Create a free account now and your results will appear in your private dashboard the moment they&rsquo;re ready. No account means we can&rsquo;t link your results to you.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all"
              >
                Create your account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/auth/login"
                className="data-label text-black hover:underline flex items-center gap-2"
              >
                Already have an account? Log in
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
              'UKAS ISO 15189 Lab',
              'Same-day dispatch',
              'GMC-Registered Doctor',
              'Results in 48h',
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
