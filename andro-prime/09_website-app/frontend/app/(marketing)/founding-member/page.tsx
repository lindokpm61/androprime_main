import type { Metadata } from 'next'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import { JoinForm } from '@/components/founding-member/JoinForm'

export const metadata: Metadata = {
  title: 'Founding Member List | Andro Prime',
  description:
    "Join the Andro Prime founding-member list. No payment, no commitment — just an opt-in so we can contact you as soon as our regulated TRT programme is live.",
}

const faqItems = [
  {
    q: 'When does the TRT service launch?',
    a: "We're not publishing a specific date while CQC registration is in progress. Founding-member-list members will be the first to know.",
  },
  {
    q: 'Do I have to commit to anything?',
    a: 'No. Joining the list is just an opt-in. No payment is taken. You are not signing up for treatment, paying a deposit, or agreeing to anything — you are simply telling us you want to be contacted when our regulated TRT programme is live.',
  },
  {
    q: 'Can I unsubscribe later?',
    a: 'Yes. Email hello@andro-prime.com any time and we will remove you from the list. You can also unsubscribe via the footer of any email we send you.',
  },
  {
    q: 'Is there a low-T threshold?',
    a: "If you have done an Andro Prime kit and your result was below 12 nmol/L, we'll prioritise you for an early invitation. Anyone else who wants priority access at launch is welcome to join the list too.",
  },
  {
    q: 'What does it cost to join?',
    a: 'Nothing. The list is free.',
  },
  {
    q: 'Will Andro Prime offer TRT to me?',
    a: "We can't say in advance. Whether anyone receives a regulated TRT prescription depends on a clinical assessment by our GP at launch. Joining the list does not guarantee any particular outcome.",
  },
]

export default function FoundingMemberPage() {
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
                <span className="data-label !text-black">Founding-Member List</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-6">
                Be first when our<br />clinical TRT service<br />launches.
              </h1>
              <p className="text-lg md:text-xl text-black font-serif mb-8 max-w-2xl leading-relaxed">
                Join the founding-member list. No payment, no commitment &mdash; just an opt-in so we can contact you as soon as our regulated TRT programme is live.
              </p>
              <ul className="space-y-3 font-serif text-base text-black mb-4">
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> Free to join.</li>
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> Unsubscribe any time.</li>
                <li className="flex items-start gap-3"><span className="mt-2 w-2 h-2 bg-black" /> No clinical service is currently available.</li>
              </ul>
            </div>
            <div className="lg:col-span-5" id="join">
              <JoinForm source="founding_member_page" />
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-24 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <SectionEyebrow label="Who This Is For" />
          <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-12 max-w-3xl">
            Two paths in.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-10 border-l-[12px] border-l-black">
              <div className="data-label mb-4">Path A</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">Men who scored below 12 nmol/L</h3>
              <p className="font-serif text-base leading-relaxed">
                If your testosterone came back below 12 nmol/L on Kit 1 or Kit 3, we want to know. You&rsquo;ll be prioritised for an early invitation when the regulated TRT service launches.
              </p>
            </div>
            <div className="glass-panel p-10 border-l-[12px] border-l-black">
              <div className="data-label mb-4">Path B</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">Anyone who wants priority access</h3>
              <p className="font-serif text-base leading-relaxed">
                Haven&rsquo;t taken a kit, or your result was in range and you still want first notice? Join the list. You&rsquo;ll hear from us when launch milestones are confirmed.
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
              { num: '01', title: 'Priority invitation', body: 'When the regulated TRT service launches, list members are contacted before public availability.' },
              { num: '02', title: 'Founding-member rate', body: 'A founding-member rate will apply at launch. We will confirm pricing before launch — no commitment is asked from you in the meantime.' },
              { num: '03', title: 'Launch milestones', body: 'You hear about CQC progress, the launch date, and any other milestones as they happen.' },
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
            Add your email to the list and we&rsquo;ll be in touch when the regulated TRT service is live.
          </p>
          <a href="#join" className="inline-flex items-center gap-3 bg-white text-black hover:bg-transparent hover:text-white border-4 border-white font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all">
            Join the list
          </a>
        </div>
      </section>
    </>
  )
}
