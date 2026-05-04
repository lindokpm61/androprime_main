import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description: 'Be first to know when Andro Prime launches. Join the waitlist for early access to at-home blood tests for men.',
}

const CheckSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function WaitlistPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
                <span className="w-2 h-2 bg-black" />
                <span className="data-label !text-[10px]">Early Access</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-[85px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Be first to know your numbers.
              </h1>
              <p className="text-xl text-black font-serif mb-12 leading-relaxed max-w-lg">
                Andro Prime is launching soon. Join the waitlist and get early access to at-home blood tests that tell you exactly where you stand. No GP needed.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-lg">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="form-input-brutal flex-1 border-4 border-black px-6 py-4 font-sans text-base focus:outline-none placeholder-gray-400 bg-white"
                />
                <button
                  type="submit"
                  className="form-button-brutal bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 transition-all whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </form>

              <div className="mt-8 flex flex-wrap items-center gap-6 data-label">
                {['No spam', 'Early access', 'Launch discount'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckSvg />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-4 border-black p-10 bg-gray-50">
              <div className="data-label mb-8 border-b-2 border-black pb-6">What&rsquo;s coming</div>
              <div className="space-y-0 divide-y-2 divide-black">
                {[
                  { title: 'Kit 1: Testosterone Health Check', price: '£99', tag: 'Base' },
                  { title: 'Kit 2: Energy & Recovery Check', price: '£119', tag: 'Targeted' },
                  { title: 'Kit 3: Hormone & Recovery Check', price: '£179', tag: 'Most complete' },
                ].map(({ title, price, tag }) => (
                  <div key={title} className="py-6 flex justify-between items-center">
                    <div>
                      <div className="font-sans font-black uppercase tracking-tight text-lg text-black">{title}</div>
                      <div className="data-label text-gray-500 mt-1">{tag}</div>
                    </div>
                    <div className="font-mono font-black text-2xl text-black">{price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-32 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="data-label flex items-center gap-3 mb-8">
                <span className="w-12 h-[2px] bg-black" />
                The Problem
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
                Normal isn&rsquo;t the same as optimal.
              </h2>
              <div className="space-y-6 text-xl text-black font-serif leading-relaxed">
                <p>The NHS sets testosterone thresholds to catch clinical deficiency. If you&rsquo;re above that threshold, you&rsquo;re &ldquo;fine&rdquo;. Even if you feel terrible.</p>
                <p>Millions of men sit technically in range but far below the levels that make them feel like themselves. They&rsquo;re told to get on with it.</p>
                <p>Andro Prime gives you the actual data. Not a reassurance. Your numbers, in plain English, with a specific recommendation based on where you sit.</p>
              </div>
            </div>
            <div className="border-4 border-black bg-black text-white p-10">
              <div className="space-y-6">
                {[
                  'Persistent fatigue despite full sleep',
                  'Recovery taking 3 days instead of 1',
                  'Brain fog and lost focus',
                  'Low drive and motivation',
                  '"GP said I\'m fine," but you know you\'re not',
                ].map((symptom) => (
                  <div key={symptom} className="flex items-start gap-4 border-b border-gray-700 pb-6">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="shrink-0 mt-1 text-white">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-serif text-lg text-white leading-relaxed">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-32 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black" />
              The Process
              <span className="w-12 h-[2px] bg-black" />
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Four steps.<br />Results in 48 hours.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-black -translate-y-1/2 z-0" />
            {[
              { num: '01', title: 'Order', body: 'Dispatched same day. Fits through your letterbox.' },
              { num: '02', title: 'Collect', body: 'A simple finger-prick sample you can do at the kitchen table.' },
              { num: '03', title: 'Return', body: 'Drop it in a postbox using the prepaid return envelope.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="group border-2 border-black p-10 relative z-10 bg-white hover:bg-black transition-colors duration-200">
                <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-gray-100 group-hover:text-white leading-none select-none pointer-events-none -mt-6 -mr-2">{num[1]}</div>
                <div className="w-12 h-12 bg-white border-4 border-black text-black group-hover:bg-black group-hover:border-white group-hover:text-white flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 transition-colors duration-200">{num}</div>
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black group-hover:text-white mb-4 relative z-20 transition-colors duration-200">{title}</h3>
                <p className="text-black group-hover:text-gray-300 font-serif text-base leading-relaxed relative z-20 transition-colors duration-200">{body}</p>
              </div>
            ))}
            <div className="border-4 border-black p-10 relative z-10 bg-black text-white">
              <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-white leading-none select-none pointer-events-none -mt-6 -mr-2">4</div>
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20">04</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-white mb-4 relative z-20">Read</h3>
              <p className="text-gray-300 font-serif text-base leading-relaxed relative z-20">Results in your private dashboard within 48 hours. Plain English. Specific recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter text-black leading-[0.85] mb-10">
            Don&rsquo;t wait for your GP to tell you you&rsquo;re fine.
          </h2>
          <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 border-4 border-black px-6 py-4 font-sans text-base focus:outline-none placeholder-gray-400 bg-white"
            />
            <button type="submit" className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-base px-8 py-4 transition-all whitespace-nowrap">
              Join Waitlist
            </button>
          </form>
          <p className="mt-6 data-label text-gray-500">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  )
}
