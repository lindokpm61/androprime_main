import type { Metadata } from 'next'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { SupplementWaitlistForm } from '@/components/supplement-waitlist/SupplementWaitlistForm'

export const metadata: Metadata = {
  title: 'Supplement Waitlist',
  description:
    'Join the Andro Prime supplement waitlist. No payment, no commitment. Get early dispatch and a founding-customer discount as soon as our manufacturing partner is confirmed and the range launches.',
}

const faqItems = [
  {
    q: 'When will the supplements launch?',
    a: "We're not publishing a specific date. The range launches as soon as our manufacturing partner is confirmed. Waitlist members will be the first to know.",
  },
  {
    q: 'Do I have to commit to anything?',
    a: 'No. Joining the waitlist is just an opt-in. No payment is taken. You can leave the list at any time.',
  },
  {
    q: 'What do I get for being on the list?',
    a: 'Two things. First, early dispatch when stock arrives, so you can subscribe before the public range opens. Second, a founding-customer discount on your first order.',
  },
  {
    q: 'Can I choose which product I want updates about?',
    a: 'Yes. The form lets you tell us whether you are interested in the Daily Stack, the Joint and Recovery Collagen, or both. You can change your mind later.',
  },
  {
    q: 'Can I unsubscribe later?',
    a: 'Yes. Email hello@andro-prime.com any time and we will remove you from the list. You can also unsubscribe via the footer of any email we send you.',
  },
  {
    q: 'Are the supplements available now?',
    a: 'Not yet. We are not taking supplement orders or payments at this time. The waitlist is how we let you know the moment that changes.',
  },
]

export default function SupplementWaitlistPage() {
  return (
    <>
      {/* HERO + FORM */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-white border-b-4 border-black">
        <div className="hidden absolute inset-0 opacity-[0.03] pointer-events-none md:block" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
                <span className="w-2 h-2 bg-black" />
                <span className="data-label !text-black">Supplement Waitlist</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-6">
                Be first when our<br />supplement range<br />launches.
              </h1>
              <p className="text-lg md:text-xl text-black font-serif mb-8 max-w-2xl leading-relaxed">
                Join the waitlist. No payment, no commitment. We email you the moment our manufacturing partner is confirmed and the range is ready to ship.
              </p>
              <ul className="space-y-3 font-serif text-base text-black mb-4">
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> Free to join.</li>
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> Early dispatch ahead of the public launch.</li>
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> A founding-customer discount on your first order.</li>
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> No supplement orders or payments are being taken right now.</li>
              </ul>
            </div>
            <div className="lg:col-span-5" id="join">
              <SupplementWaitlistForm interestedInProduct="any" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT THIS IS */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <SectionEyebrow label="What This Is" />
          <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-12 max-w-3xl">
            A waitlist. Not a pre-order.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-10 border-l-[12px] border-l-black">
              <div className="data-label mb-4">What it is</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">An email opt-in</h3>
              <p className="font-serif text-base leading-relaxed">
                A simple list. No payment is taken. You are telling us you want to hear when the range is live. We email you when it is.
              </p>
            </div>
            <div className="glass-panel p-10 border-l-[12px] border-l-black">
              <div className="data-label mb-4">What it is not</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">A purchase or a deposit</h3>
              <p className="font-serif text-base leading-relaxed">
                No card details, no charge, no contract. You are not buying a supplement today. You are getting in line for the launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-24 bg-gray-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <SectionEyebrow label="What You Get" />
          <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-12 max-w-3xl">
            Three things, no money.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Early dispatch', body: 'Waitlist members are invited to subscribe and ship ahead of the public range opening.' },
              { num: '02', title: 'Founding-customer discount', body: 'A founding-customer discount on your first order when the range launches. We will confirm the exact discount in your invitation email.' },
              { num: '03', title: 'Launch updates', body: 'You hear about manufacturing-partner sign-off, formulation finalisation, and the launch date as they happen.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="glass-panel p-8 bg-white">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-sans font-black mb-6">{num}</div>
                <h3 className="text-xl font-sans font-black uppercase tracking-tighter mb-3">{title}</h3>
                <p className="font-serif text-base leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS COMING */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <SectionEyebrow label="What Is Coming" />
          <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-12 max-w-3xl">
            Targeted, not generic.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-10 border-l-[12px] border-l-black">
              <div className="data-label mb-4">Daily Stack</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">Daily deficiency and recovery support</h3>
              <p className="font-serif text-base leading-relaxed">
                Built for men whose blood data shows the common gaps behind energy, recovery, and training output. Zinc contributes to the maintenance of normal testosterone levels. Vitamin D3 contributes to normal muscle function. Active B12 contributes to normal energy-yielding metabolism.
              </p>
            </div>
            <div className="glass-panel p-10 border-l-[12px] border-l-black">
              <div className="data-label mb-4">Joint and Recovery Collagen</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">Joint stress and inflammation support</h3>
              <p className="font-serif text-base leading-relaxed">
                A recovery-focused collagen formula for active men with confirmed elevated inflammation markers and joint symptoms. Vitamin C contributes to normal collagen formation for the normal function of cartilage.
              </p>
            </div>
          </div>
          <p className="mt-10 font-serif text-base text-gray-700 max-w-3xl">
            A Complete Men&rsquo;s Stack bundle pairing both products is also planned. None of these are available to buy right now.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <SectionEyebrow label="Common Questions" />
          <div className="border-t-4 border-black mt-10">
            {faqItems.map(({ q, a }) => (
              <details key={q} className="group border-b-2 border-black">
                <summary className="flex justify-between items-center font-sans font-black text-lg md:text-xl uppercase tracking-tighter py-6 cursor-pointer list-none hover:bg-gray-50 px-4 -mx-4 transition-colors">
                  <span>{q}</span>
                  <span className="transition-transform duration-300 group-open:rotate-45 font-mono text-3xl leading-none">+</span>
                </summary>
                <div className="pb-8 pt-2 px-4 -mx-4 font-serif text-base leading-relaxed text-black">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-sans font-black uppercase tracking-tighter leading-[0.95] mb-6">
            Ready when we are.
          </h2>
          <p className="text-lg font-serif mb-8 text-gray-300">
            Add your email to the list and we&rsquo;ll be in touch when the supplement range is live.
          </p>
          <a href="#join" className="inline-flex items-center gap-3 bg-white text-black hover:bg-transparent hover:text-white border-4 border-white font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all">
            Join the waitlist
          </a>
        </div>
      </section>
    </>
  )
}
