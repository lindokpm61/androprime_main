import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'

export const metadata: Metadata = {
  title: 'Contact | Andro Prime',
  description:
    'Get in touch with the Andro Prime team. Real humans, not bots. Email us and hear back within two working days.',
}

const contactFaqs = [
  { question: "My results haven't appeared in my dashboard. What do I do?", answer: "Results typically appear within 48 hours of the lab receiving your sample. If it's been longer than that, email us with your order number and we'll look into it." },
  { question: 'I want to cancel my subscription. How do I do that?', answer: "Log in to your account, go to Subscriptions, and cancel from there. Cancel before your next billing date and you won't be charged for the following month. If you're having trouble, email us and we'll sort it." },
  { question: 'I want a refund on my founding member deposit.', answer: 'Your deposit is fully refundable. No questions asked. Email hello@andro-prime.com with "Founding Member Refund" in the subject line. We\'ll process it to your original payment method within 5 working days.' },
  { question: 'Can I speak to a doctor about my results?', answer: "Dr Ewa Lindo reviews our clinical protocols and results report copy. At this stage, we're not offering one-to-one clinical consultations. If your results raise something that needs medical attention, we'll tell you that clearly in your dashboard, and we'd encourage you to speak to your GP." },
  { question: 'I have a complaint.', answer: "We'd rather hear it than not. Email hello@andro-prime.com and we'll deal with it properly. If you're not satisfied with how we handle it, you can escalate to an approved ADR scheme or the relevant regulatory authority." },
]

const routingCards = [
  { title: 'Kit orders and delivery', desc: 'Questions about your order status, delivery, or kit contents. Include your order number if you have it.', icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></> },
  { title: 'Results and your dashboard', desc: "If your results haven't appeared, something looks wrong, or you want to understand what a result means.", icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
  { title: 'Supplements and subscriptions', desc: 'Questions about your subscription, billing, cancellations, or pausing deliveries.', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
  { title: 'Founding member programme', desc: 'Questions about your deposit, the clinical launch timeline, or what happens next.', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, dark: true },
  { title: 'Privacy and data', desc: <>Requests to access, correct, or delete your data. See also our <Link href="/privacy" className="font-black underline underline-offset-2">Privacy Policy</Link>.</>, icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
  { title: 'Everything else', desc: 'Media, partnerships, or anything else. hello@andro-prime.com covers it all.', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
]

export default function ContactPage() {
  return (
    <>
      {/* HERO + PRIMARY CONTACT */}
      <section className="max-w-7xl mx-auto px-6 mb-24 pt-32">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-black bg-white mb-8">
              <span className="w-2 h-2 bg-black" />
              <span className="data-label !text-[10px] !text-black">GET IN TOUCH</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
              Got a question?<br /><span className="text-black">We&rsquo;ll answer it.</span>
            </h1>
            <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-2xl">
              This isn&rsquo;t a bot. There&rsquo;s a real person on the other end. Email us and you&rsquo;ll hear back within two working days.
            </p>
          </div>

          {/* Primary inbox card */}
          <div className="lg:col-span-5 lg:mt-12">
            <div className="glass-panel p-10 bg-white relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-black text-white flex items-center justify-center pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div className="data-label flex items-center gap-2 mb-6 text-black border-b-2 border-black pb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                PRIMARY INBOX
              </div>
              <a href="mailto:hello@andro-prime.com" className="block group mb-8">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black tracking-tighter text-black break-all group-hover:underline decoration-4 underline-offset-4">
                  hello@<br />andro-prime.com
                </div>
              </a>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 border-2 border-black mb-10">
                <span className="w-2 h-2 bg-black" />
                <span className="data-label text-black">Within 2 working days. Usually faster.</span>
              </div>
              <a href="mailto:hello@andro-prime.com" className="w-full bg-black hover:bg-white border-2 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all flex items-center justify-center gap-2 text-center">
                Send us an email
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ROUTING */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t-4 border-black bg-white">
        <div className="mb-16 max-w-3xl">
          <SectionEyebrow label="Routing" />
          <h2 className="text-4xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">What to contact us about</h2>
          <p className="text-xl font-serif text-black leading-relaxed">Use these to route your question to the right place before you write to us.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {routingCards.map(({ title, desc, icon, dark }) => (
            <div key={title} className="glass-panel p-8 flex flex-col h-full hover:bg-gray-50 transition-colors">
              <div className={`w-12 h-12 border-2 border-black flex items-center justify-center mb-6 ${dark ? 'bg-black text-white' : 'bg-white'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">{icon}</svg>
              </div>
              <h3 className="font-sans font-black uppercase text-xl text-black mb-4 tracking-tighter border-b-2 border-black pb-4">{title}</h3>
              <p className="font-serif text-base text-black leading-relaxed mt-auto">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS / DR EWA */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t-4 border-black bg-white">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <SectionEyebrow label="Process" />
            <h2 className="text-4xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-8 leading-[0.9]">What happens when you email us</h2>
            <div className="space-y-8 text-xl text-black font-serif leading-relaxed">
              <p>We read every email. You won&rsquo;t get an auto-reply that closes your ticket and tells you to check the FAQs.</p>
              <div className="pl-8 border-l-[6px] border-black py-4 bg-gray-50 mt-8">
                <p className="text-black font-serif italic text-2xl leading-snug">
                  If you&rsquo;re asking about your results, we may ask Dr Ewa to weigh in. She&rsquo;s involved in the business, not a name on a website, so if your question needs a clinical eye, it gets one.
                </p>
              </div>
            </div>
          </div>
          {/* Dr Ewa card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0">
            <div className="glass-panel p-4 flex flex-col min-h-[300px] border-2 border-black bg-white relative">
              <div className="w-full h-full bg-gray-50 border-2 border-black relative overflow-hidden flex flex-col">
                <div className="flex-grow flex items-center justify-center text-black py-16">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="23" y2="12" /><line x1="23" y1="8" x2="19" y2="12" />
                  </svg>
                </div>
                <div className="p-6 bg-white border-t-2 border-black flex flex-col gap-2">
                  <div className="data-label flex items-center gap-2 text-black mb-1">
                    <span className="w-2 h-2 bg-black" /> Identity Verified
                  </div>
                  <div className="text-2xl font-sans font-black uppercase tracking-tight text-black">Dr Ewa Lindo</div>
                  <div className="font-serif text-sm italic text-gray-600">GMC-Registered, Harley Street TRT-trained GP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-32 border-t-4 border-black bg-white">
        <div className="mb-16 text-center">
          <SectionEyebrow label="FAQ" centered />
          <h2 className="text-4xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Frequently Asked</h2>
          <p className="text-xl font-serif text-black leading-relaxed">These are the questions we get most often. Worth checking before you write to us.</p>
        </div>
        <FaqAccordion items={contactFaqs} />
      </section>

      {/* DATA & PRESS */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t-4 border-black">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* GDPR */}
          <div className="glass-panel p-10 lg:p-12 flex flex-col bg-white">
            <div className="data-label flex items-center gap-2 mb-8 text-black border-b-2 border-black pb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              GDPR
            </div>
            <h3 className="text-4xl font-sans font-black uppercase tracking-tighter text-black mb-6 leading-none">Data &amp; Privacy</h3>
            <p className="text-lg font-serif text-black leading-relaxed mb-8">For data-related requests including access requests, deletion, and corrections:</p>
            <div className="mt-auto space-y-6">
              <a href="mailto:privacy@andro-prime.com" className="block group">
                <div className="text-xl sm:text-2xl font-mono font-black tracking-tighter text-black group-hover:underline decoration-2 underline-offset-4 break-all">privacy@andro-prime.com</div>
              </a>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 border border-black">
                <span className="w-2 h-2 bg-black rounded-full" />
                <span className="data-label text-black">Within 1 calendar month.</span>
              </div>
              <p className="text-sm font-serif text-gray-600 pt-4 border-t-2 border-black">
                Full details of your rights are in our <Link href="/privacy" className="text-black font-bold underline hover:no-underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          {/* Media / Press */}
          <div className="glass-panel p-10 lg:p-12 flex flex-col bg-white">
            <div className="data-label flex items-center gap-2 mb-8 text-black border-b-2 border-black pb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              MEDIA
            </div>
            <h3 className="text-4xl font-sans font-black uppercase tracking-tighter text-black mb-6 leading-none">Business &amp; Press</h3>
            <p className="text-lg font-serif text-black leading-relaxed mb-8">Working on a story about men&rsquo;s health, hormones, or the state of GP testing? We&rsquo;re happy to talk.</p>
            <div className="mt-auto space-y-6">
              <a href="mailto:hello@andro-prime.com?subject=Press" className="block group">
                <div className="text-xl sm:text-2xl font-mono font-black tracking-tighter text-black group-hover:underline decoration-2 underline-offset-4 break-all">hello@andro-prime.com</div>
              </a>
              <div className="inline-flex items-center gap-2 bg-black px-3 py-2 border-2 border-black text-white">
                <span className="w-2 h-2 bg-white" />
                <span className="data-label text-white">USE SUBJECT: &ldquo;PRESS&rdquo;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="bg-black border-y-4 border-black py-24 md:py-32 px-6 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-sans font-black uppercase tracking-tighter text-white mb-8 leading-[0.9]">
            No chatbot.<br />No ticket system.<br /><span className="text-gray-400">No hold music.</span>
          </h2>
          <div className="inline-flex items-center gap-4 bg-white border-4 border-white text-black px-6 py-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12" /></svg>
            <p className="font-serif font-bold text-xl md:text-2xl">Just an inbox and two working days.</p>
          </div>
        </div>
      </div>
    </>
  )
}
