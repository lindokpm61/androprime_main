'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PRICING } from '@/lib/pricing'

interface QuizResult {
  kit: 'kit1' | 'kit2' | 'kit3'
  // slug matches the values seq-06 (Quiz Nurture) branches on:
  // testosterone | energy-recovery | hormone-recovery
  slug: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
  title: string
  href: string
  price: string
  reason: string
  label: string
}

const RESULTS: Record<string, QuizResult> = {
  kit1: {
    kit: 'kit1',
    slug: 'testosterone',
    label: 'Kit 1',
    title: 'Start with the Testosterone Health Check.',
    href: '/kits/testosterone',
    price: `£${PRICING.KIT_1.rrp}`,
    reason: 'Your answers point most strongly at hormonal health. Kit 1 tests Total T, SHBG, and Free Testosterone so you can see not just what your level is, but how much of that testosterone your body can actually use.',
  },
  kit2: {
    kit: 'kit2',
    slug: 'energy-recovery',
    label: 'Kit 2',
    title: 'Start with the Energy and Recovery Check.',
    href: '/kits/energy-recovery',
    price: `£${PRICING.KIT_2.rrp}`,
    reason: 'Your answers point toward recovery, inflammation, and common deficiencies. Kit 2 tests Vitamin D, Active B12, hs-CRP, and Ferritin.',
  },
  kit3: {
    kit: 'kit3',
    slug: 'hormone-recovery',
    label: 'Kit 3',
    title: 'Get the complete picture with Hormone & Recovery.',
    href: '/kits/hormone-recovery',
    price: `£${PRICING.KIT_3.rrp}`,
    reason: 'Your picture is broad or mixed enough that the full panel is the right call. Kit 3 combines hormone markers with the energy and recovery panel in one test.',
  },
}

// Scoring map approved 2026-05-18, updated 2026-05-26 for the Kit-3-as-upsell
// repositioning (see kit-3-hormone-recovery-check.md §9). Q1 = main reason
// (a=hormonal symptoms, b=recovery/energy, c=no complaint). Q2 = active
// (a=trains hard, b=desk-based). Q3 = test history (a=never, b=prior
// low/borderline T, c=general bloods only). Kit 3 is now a Kit 1 post-result
// upsell, not a standalone entry product — the quiz only routes to Kit 3 when
// the two-panel overlap is genuinely the right call. The "Or get full picture
// (Kit 3)" secondary CTA renders on every non-Kit-3 result and carries the
// upsell surface.
function getResult(q1: string, q2: string, q3: string): QuizResult {
  // Hormonal symptoms + trains hard → genuine Kit-1+Kit-2 overlap, Kit 3 fits.
  if (q1 === 'a') return q2 === 'a' ? RESULTS.kit3 : RESULTS.kit1
  // Recovery/energy + prior low/borderline T → both panels are relevant, Kit 3 fits.
  if (q1 === 'b') return q3 === 'b' ? RESULTS.kit3 : RESULTS.kit2
  // No specific complaint → always Kit 1 (the cheapest entry baseline). Kit 3
  // surfaces as the "or get full picture" secondary CTA on the result card.
  // Previously this branch routed q3=c → Kit 3 as primary; that contradicted
  // the upsell positioning and is reversed 2026-05-26.
  if (q1 === 'c') return RESULTS.kit1
  // Fallback — never the dearest kit.
  return RESULTS.kit1
}

function getSymptomFlags(q1: string, q2: string, q3: string): string[] {
  const flags: string[] = []
  if (q1 === 'a') flags.push('hormonal_symptoms')
  if (q1 === 'b') flags.push('recovery_energy')
  if (q1 === 'c') flags.push('no_specific_complaint')
  if (q2 === 'a') flags.push('physically_active')
  if (q3 === 'b') flags.push('prior_low_or_borderline_t')
  return flags
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type CaptureStatus = 'idle' | 'submitting' | 'done' | 'error'

export function TestSelectorQuiz() {
  const [step, setStep] = useState(1)
  const [q1, setQ1] = useState('')
  const [q2, setQ2] = useState('')
  const [q3, setQ3] = useState('')

  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>('idle')

  const handleQ1 = (val: string) => {
    setQ1(val)
    setStep(2)
  }
  const handleQ2 = (val: string) => {
    setQ2(val)
    setStep(3)
  }
  const handleQ3 = (val: string) => {
    setQ3(val)
    setStep(4)
  }
  const reset = () => {
    setQ1(''); setQ2(''); setQ3('')
    setStep(1)
    setEmail(''); setConsent(false); setCaptureStatus('idle')
  }

  const result = step === 4 ? getResult(q1, q2, q3) : null
  const progressPercent = (step / 3) * 100

  const emailValid = EMAIL_REGEX.test(email)
  const canSubmit = emailValid && consent && captureStatus !== 'submitting'

  const handleCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!result || !canSubmit) return
    setCaptureStatus('submitting')
    try {
      const res = await fetch('/api/forms/test-selector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          recommendedKit: result.slug,
          symptomFlags: getSymptomFlags(q1, q2, q3),
        }),
      })
      setCaptureStatus(res.ok ? 'done' : 'error')
    } catch {
      setCaptureStatus('error')
    }
  }

  return (
    <div id="quiz-card" className="bg-white border-4 border-black p-8 md:p-16">

      {/* Progress Bar Header */}
      {step < 4 && (
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-8 border-b-4 border-black">
          <span className="data-label text-sm shrink-0 w-40">Question {step} of 3</span>
          <div className="flex-grow h-3 bg-gray-200 border-2 border-black relative w-full">
              <div
                className="absolute top-0 left-0 h-full bg-black transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="quiz-step is-active animate-[fadeIn_0.4s_ease-out_forwards]">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-10 leading-[0.9]">What is your main reason for testing?</h2>
            <div className="grid gap-4">
                <button type="button" onClick={() => handleQ1('a')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option A</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">I am knackered, my drive has gone, or I just do not feel like myself anymore.</span>
                </button>
                <button type="button" onClick={() => handleQ1('b')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option B</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">I am training hard but not recovering like I used to. Tired, sore, or running on empty.</span>
                </button>
                <button type="button" onClick={() => handleQ1('c')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option C</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">No specific complaint. I just want to know where I stand.</span>
                </button>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="quiz-step is-active animate-[fadeIn_0.4s_ease-out_forwards]">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-10 leading-[0.9]">Are you physically active?</h2>
            <div className="grid gap-4">
                <button type="button" onClick={() => handleQ2('a')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option A</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Yes. I train regularly.</span>
                </button>
                <button type="button" onClick={() => handleQ2('b')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option B</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Not much. Mostly desk-based and not training consistently.</span>
                </button>
            </div>
        </div>
      )}

      {step === 3 && (
        <div className="quiz-step is-active animate-[fadeIn_0.4s_ease-out_forwards]">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-10 leading-[0.9]">Have you had blood tests like this before?</h2>
            <div className="grid gap-4">
                <button type="button" onClick={() => handleQ3('a')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option A</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Not in years, or never.</span>
                </button>
                <button type="button" onClick={() => handleQ3('b')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option B</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Yes. I have had testosterone tested and it came back borderline or low.</span>
                </button>
                <button type="button" onClick={() => handleQ3('c')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option C</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Yes. I have had general health bloods done but nothing specific.</span>
                </button>
            </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="result-card is-active animate-[slideUp_0.5s_ease-out_forwards]">
            <div className="data-label mb-8 flex items-center gap-4">
                <span className="w-12 h-[2px] bg-black"></span>
                Your Result
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b-4 border-black pb-8">
                <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black font-sans font-black uppercase text-xs tracking-widest mb-4 ${result.kit === 'kit3' ? 'bg-black text-white' : 'text-black'}`}>
                        <span className={`w-2 h-2 rounded-none ${result.kit === 'kit3' ? 'bg-white' : 'bg-black'}`}></span> {result.label}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-[0.9]">{result.title}</h2>
                </div>
                <div className="text-5xl font-sans font-black text-black shrink-0">{result.price}</div>
            </div>

            <p className="text-xl font-serif text-black mb-12 leading-relaxed">
                {result.reason}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href={result.href} className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 text-center transition-colors">
                  Order {result.label}
                </Link>
                {result.kit !== 'kit3' ? (
                  <Link href="/kits/hormone-recovery" className="bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 text-center transition-colors">
                    Or get full picture (Kit 3)
                  </Link>
                ) : (
                  <Link href="/kits/hormone-recovery" className="bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 text-center transition-colors">
                    Read more about Kit 3
                  </Link>
                )}
            </div>

            {/* Soft inline email capture — result is already shown above, this is
                optional. Consent is unticked by default (UK GDPR); the result is
                visible whether or not they opt in. */}
            {captureStatus === 'done' ? (
              <div className="border-4 border-black bg-gray-50 p-8 mb-10">
                <div className="data-label mb-3">Sent</div>
                <p className="text-lg font-serif text-black">
                  Check your inbox. Your result and what to do next are on the way.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCaptureSubmit} className="border-4 border-black bg-gray-50 p-8 mb-10">
                <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-2 leading-[0.95]">
                  Want this emailed to you?
                </h3>
                <p className="text-base font-serif text-black mb-6">
                  We&rsquo;ll send your result and a short series on what to do next.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-5">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="form-input-brutal flex-1 border-4 border-black px-6 py-4 font-sans text-base focus:outline-none placeholder-gray-400 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
                  >
                    {captureStatus === 'submitting' ? 'Sending…' : 'Send it to me'}
                  </button>
                </div>
                <label className="flex items-start gap-3 text-sm font-serif text-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 shrink-0 accent-black"
                  />
                  <span>
                    Yes, email me my result and a short series on next steps. I can
                    unsubscribe at any time. See our{' '}
                    <Link href="/privacy" className="underline hover:no-underline">Privacy Policy</Link>.
                  </span>
                </label>
                {captureStatus === 'error' && (
                  <p className="mt-4 text-sm font-sans font-black uppercase tracking-widest text-black">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}

            <button type="button" onClick={reset} className="data-label text-gray-500 hover:text-black transition-colors underline">Retake the quiz</button>
        </div>
      )}
    </div>
  )
}
