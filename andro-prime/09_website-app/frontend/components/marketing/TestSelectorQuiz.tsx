'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { PRICING } from '@/lib/pricing'
import { panelSentenceList } from '@/lib/kits/panel'
import { getPageAttribution } from '@/lib/analytics/page-attribution'
import {
  AGE_BANDS,
  buildWtpProps,
  isMonotonic,
  parseWtpAnswers,
} from '@/lib/quiz/wtp'

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
  // The un-priced bundle concept the WTP block asks about (test now + retest
  // later, one order). Per-kit because Full-picture's second kit is an Energy
  // & Recovery retest off a Kit 3 base, not "the same test again": the
  // description must stay accurate per bundle (ASA pricing-accuracy rail).
  wtpConcept: string
}

const RESULTS: Record<string, QuizResult> = {
  kit1: {
    kit: 'kit1',
    slug: 'testosterone',
    label: 'Kit 1',
    title: 'Start with the Testosterone Health Check.',
    href: '/kits/testosterone',
    price: `£${PRICING.KIT_1.rrp}`,
    reason: `Your answers point most strongly at hormonal health. Kit 1 tests ${panelSentenceList('testosterone')} so you can see not just what your level is, but how much of that testosterone your body can actually use.`,
    wtpConcept: 'the Testosterone Health Check now, plus the same testosterone retest later, as one order',
  },
  kit2: {
    kit: 'kit2',
    slug: 'energy-recovery',
    label: 'Kit 2',
    title: 'Start with the Energy and Recovery Check.',
    href: '/kits/energy-recovery',
    price: `£${PRICING.KIT_2.rrp}`,
    reason: `Your answers point toward recovery, inflammation, and common deficiencies. Kit 2 tests ${panelSentenceList('energy-recovery')}.`,
    wtpConcept: 'the Energy and Recovery Check now, plus the same retest later, as one order',
  },
  kit3: {
    kit: 'kit3',
    slug: 'hormone-recovery',
    label: 'Kit 3',
    title: 'Get the complete picture with Hormone & Recovery.',
    href: '/kits/hormone-recovery',
    price: `£${PRICING.KIT_3.rrp}`,
    reason: 'Your picture is broad or mixed enough that the full panel is the right call. Kit 3 combines hormone markers with the energy and recovery panel in one test.',
    wtpConcept: 'the full Hormone and Recovery panel now, plus an energy and recovery retest later, as one order',
  },
}

// Scoring map approved 2026-05-18, updated 2026-05-26 for the Kit-3-as-upsell
// repositioning (see kit-3-hormone-recovery-check.md §9). Q1 = main reason
// (a=hormonal symptoms, b=recovery/energy, c=no complaint). Q2 = active
// (a=trains hard, b=desk-based). Q3 = test history (a=never, b=prior
// low/borderline T, c=general bloods only). Kit 3 is now a Kit 1 post-result
// upsell, not a standalone entry product: the quiz only routes to Kit 3 when
// the two-panel overlap is genuinely the right call. The "Or get full picture
// (Kit 3)" secondary CTA renders on every non-Kit-3 result and carries the
// upsell surface.
// Exported for scripts/test-quiz-routing.ts. Deliberately left in this file
// rather than moved to lib/: this is an approved scoring map (2026-05-18,
// updated 2026-05-26 and 2026-08-12), and relocating approved logic makes the
// diff harder to re-approve than adding one keyword to it.
export function getResult(q1: string, q2: string, q3: string): QuizResult {
  // Fatigue or brain fog with no hormonal presentation → Kit 2, never Kit 1.
  //
  // Added 2026-08-12 (Keith, CA-033). Q1 option (a) used to read "I am
  // knackered, my drive has gone, or I just do not feel like myself anymore",
  // which is two different presentations in one option: "drive has gone" is
  // hormonal, "knackered" and "not myself" are the general fatigue picture that
  // CA-025 says Kit 1 must never be offered as the answer to. A reader arriving
  // from the brain fog, B12 or tiredness carousels picked (a), answered
  // desk-based on Q2, and was routed to a testosterone-only kit. The 30-day run
  // points at this quiz from close A, so that path was about to carry real
  // traffic. Split rather than rewritten: (a) keeps its approved outcomes for
  // anyone actually presenting hormonally, and the fatigue half gets its own
  // option routed at the four markers that answer it.
  if (q1 === 'd') return RESULTS.kit2
  // Hormonal symptoms + trains hard → genuine Kit-1+Kit-2 overlap, Kit 3 fits.
  if (q1 === 'a') return q2 === 'a' ? RESULTS.kit3 : RESULTS.kit1
  // Recovery/energy + prior low/borderline T → both panels are relevant, Kit 3 fits.
  if (q1 === 'b') return q3 === 'b' ? RESULTS.kit3 : RESULTS.kit2
  // No specific complaint → always Kit 1 (the cheapest entry baseline). Kit 3
  // surfaces as the "or get full picture" secondary CTA on the result card.
  // Previously this branch routed q3=c → Kit 3 as primary; that contradicted
  // the upsell positioning and is reversed 2026-05-26.
  if (q1 === 'c') return RESULTS.kit1
  // Fallback: never the dearest kit.
  return RESULTS.kit1
}

function getSymptomFlags(q1: string, q2: string, q3: string): string[] {
  const flags: string[] = []
  if (q1 === 'a') flags.push('hormonal_symptoms')
  if (q1 === 'b') flags.push('recovery_energy')
  if (q1 === 'c') flags.push('no_specific_complaint')
  // Distinct from recovery_energy: this reader presents fatigue or cognitive
  // symptoms with no training context and no hormonal complaint.
  if (q1 === 'd') flags.push('fatigue_cognitive')
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

  // WTP block state (step 4). Raw input strings; parsed + validated by
  // lib/quiz/wtp.ts. The block is optional and non-gating: skip advances to
  // the price reveal exactly like submit.
  const [wtpTooCheap, setWtpTooCheap] = useState('')
  const [wtpBargain, setWtpBargain] = useState('')
  const [wtpExpensive, setWtpExpensive] = useState('')
  const [wtpTooExpensive, setWtpTooExpensive] = useState('')
  const [ageBand, setAgeBand] = useState('')
  // Guards double-fire (submit then back-nav, React StrictMode re-invoke).
  const wtpFired = useRef(false)

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
    setWtpTooCheap(''); setWtpBargain(''); setWtpExpensive(''); setWtpTooExpensive('')
    setAgeBand('')
    wtpFired.current = false
  }

  const result = step >= 4 ? getResult(q1, q2, q3) : null
  const progressPercent = (step / 3) * 100

  // Van Westendorp answers, parsed live. Submit enables only when all four
  // parse AND an age band is chosen; ordering is deliberately NOT enforced
  // (non-monotonic rows are filtered at read time, and hard-enforcing would
  // coach answers). A soft nudge renders instead.
  const wtpAnswers = parseWtpAnswers({
    tooCheap: wtpTooCheap,
    bargain: wtpBargain,
    expensive: wtpExpensive,
    tooExpensive: wtpTooExpensive,
  })
  const wtpComplete = wtpAnswers !== null && ageBand !== ''
  const wtpShowNudge = wtpAnswers !== null && !isMonotonic(wtpAnswers)

  // Fire-and-forget: the anonymous quiz_wtp event (public /api/events sink,
  // no email, no identity). Never blocks navigation to the price reveal; a
  // failed POST is silently dropped. Skip fires skipped:true with no answers
  // so the block's completion rate has a denominator.
  const fireWtpEvent = (skipped: boolean) => {
    if (wtpFired.current || !result) return
    wtpFired.current = true
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'quiz_wtp',
        kit_id: result.slug,
        ...getPageAttribution(),
        props: buildWtpProps({
          recommendedKit: result.slug,
          symptomFlags: getSymptomFlags(q1, q2, q3),
          answers: skipped ? null : wtpAnswers,
          ageBand,
        }),
      }),
    }).catch(() => {})
  }

  const handleWtpSubmit = () => {
    if (!wtpComplete) return
    fireWtpEvent(false)
    setStep(5)
  }
  const handleWtpSkip = () => {
    fireWtpEvent(true)
    setStep(5)
  }

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
          ...getPageAttribution(),
        }),
      })
      setCaptureStatus(res.ok ? 'done' : 'error')
    } catch {
      setCaptureStatus('error')
    }
  }

  /* THE CARD IS A TRAY, AND UNDER THE CONTAINMENT RULING IT HAS EARNED ONE: it
     holds a transaction. `.f-qcard` adds the crop the position numeral is cut by
     (`.f-core` already clips, so the numeral is bled deliberately, not by
     accident) and lifts the content above it. */
  return (
    <div id="quiz-card" className="f-tray">
      <div className="f-core f-qcard">
        {/* THE POSITION NUMERAL. The visible counter on steps 1 to 3, and absent
            from 4 and 5 for the reason Frame N2 gives: what follows question 3 is
            not a fourth question, and telling a reader they are on question 4 of
            3 is how an optional block starts feeling compulsory. */}
        {step < 4 && (
          <span className="f-qnum" aria-hidden="true">
            {step}
          </span>
        )}

        {step < 4 && (
          <div className="f-qprog">
            {/* Rendered sr-only rather than dropped: an 8px bar states progress to
                a sighted reader and states nothing at all to a screen reader. */}
            <span className="sr-only">Question {step} of 3</span>
            <span className="f-qbar">
              <i style={{ width: `${progressPercent}%` }} />
            </span>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="f-h2">What is your main reason for testing?</h2>
            <div className="f-opts">
              {/* DISPLAY LETTER IS NOT THE STORED VALUE. Options render in the
                  order a reader should meet them; the values stay a/b/c/d so
                  every answer already captured keeps its meaning. Option B
                  below stores 'd'. */}
              <button type="button" onClick={() => handleQ1('a')} className="f-opt">
                <span className="f-opt-k">Option A</span>
                <span className="f-opt-t">My drive has gone, or I have lost my edge in a way that feels hormonal.</span>
              </button>
              <button type="button" onClick={() => handleQ1('d')} className="f-opt">
                <span className="f-opt-k">Option B</span>
                <span className="f-opt-t">I am knackered, foggy, or just do not feel like myself anymore.</span>
              </button>
              <button type="button" onClick={() => handleQ1('b')} className="f-opt">
                <span className="f-opt-k">Option C</span>
                <span className="f-opt-t">I am training hard but not recovering like I used to. Tired, sore, or running on empty.</span>
              </button>
              <button type="button" onClick={() => handleQ1('c')} className="f-opt">
                <span className="f-opt-k">Option D</span>
                <span className="f-opt-t">No specific complaint. I just want to know where I stand.</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="f-h2">Are you physically active?</h2>
            <div className="f-opts">
              <button type="button" onClick={() => handleQ2('a')} className="f-opt">
                <span className="f-opt-k">Option A</span>
                <span className="f-opt-t">Yes. I train regularly.</span>
              </button>
              <button type="button" onClick={() => handleQ2('b')} className="f-opt">
                <span className="f-opt-k">Option B</span>
                <span className="f-opt-t">Not much. Mostly desk-based and not training consistently.</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="f-h2">Have you had blood tests like this before?</h2>
            <div className="f-opts">
              <button type="button" onClick={() => handleQ3('a')} className="f-opt">
                <span className="f-opt-k">Option A</span>
                <span className="f-opt-t">Not in years, or never.</span>
              </button>
              <button type="button" onClick={() => handleQ3('b')} className="f-opt">
                <span className="f-opt-k">Option B</span>
                <span className="f-opt-t">Yes. I have had testosterone tested and it came back borderline or low.</span>
              </button>
              <button type="button" onClick={() => handleQ3('c')} className="f-opt">
                <span className="f-opt-k">Option C</span>
                <span className="f-opt-t">Yes. I have had general health bloods done but nothing specific.</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: recommendation (PRICE HIDDEN) + optional WTP block. The
            Van Westendorp read is only clean if it is un-anchored, so no £
            appears anywhere on this step (07_sales/funnel/site-funnel-model.md
            §4). Skip and submit both advance to the price reveal at step 5.

            🔴 THE ONLY POUND SIGNS ON THIS STEP ARE THE READER'S OWN, in the four
            input prefixes. Nothing renders `result.price` here, and nothing may. */}
        {step === 4 && result && (
          <div>
            <p className="f-blab">Your result</p>
            <div className="f-rescap">
              <div>
                {/* `.f-flagchip`, the ink-filled pill, on every kit's result and
                    not just one of them. The old markup gave Kit 3 an inverted
                    chip and the other two a plain one, so the dearest kit was the
                    only recommendation that arrived emphasised. A reader routed
                    to Kit 1 got the quieter answer for no reason they could see. */}
                <span className="f-flagchip">{result.label}</span>
                <h2 className="f-h2" style={{ marginTop: 12 }}>{result.title}</h2>
              </div>
            </div>

            <p className="f-sub">{result.reason}</p>

            <div className="f-well">
              <p className="f-blab">Optional: 60 seconds before your price</p>
              <h3 className="f-h4" style={{ marginTop: 10 }}>Help us price this fairly.</h3>
              <p className="f-sub" style={{ marginTop: 10, marginBottom: 20 }}>
                Many men choose to retest later to see how their numbers
                have moved. We are working out a fair price for {result.wtpConcept}. Before
                we show you our price, tell us what feels right to you. It changes nothing
                about your recommendation.
              </p>

              <p className="f-blab" style={{ marginBottom: 12 }}>What price would feel:</p>
              {([
                ['So cheap you would doubt the quality', wtpTooCheap, setWtpTooCheap],
                ['A bargain: great value for the money', wtpBargain, setWtpBargain],
                ['Getting expensive, but you would still consider it', wtpExpensive, setWtpExpensive],
                ['Too expensive to consider', wtpTooExpensive, setWtpTooExpensive],
              ] as const).map(([label, value, setter]) => (
                <label key={label} className="f-wtprow">
                  <span className="f-pinput">
                    <span aria-hidden="true">&pound;</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      aria-label={`Price in pounds: ${label}`}
                    />
                  </span>
                  <span className="f-wtplab">{label}</span>
                </label>
              ))}

              <label className="block" style={{ marginTop: 20 }}>
                <span className="f-blab" style={{ display: 'block', marginBottom: 9 }}>Your age band</span>
                <select
                  className="f-sel"
                  value={ageBand}
                  onChange={(e) => setAgeBand(e.target.value)}
                >
                  <option value="">Select your age band</option>
                  {AGE_BANDS.map((band) => (
                    <option key={band} value={band}>{band}</option>
                  ))}
                </select>
              </label>

              {wtpShowNudge && (
                <p className="f-nudge">
                  Just checking: these usually run lowest to highest. Adjust if you like, or carry on.
                </p>
              )}

              <div className="f-btns" style={{ marginTop: 22 }}>
                <button
                  type="button"
                  onClick={handleWtpSubmit}
                  disabled={!wtpComplete}
                  className="f-btn"
                >
                  See the price
                </button>
                <button type="button" onClick={handleWtpSkip} className="f-btn f-btn-ghost">
                  Skip, just show the price
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 5 && result && (
          <div>
            <p className="f-blab">Your result</p>
            <div className="f-rescap">
              <div>
                <span className="f-flagchip">{result.label}</span>
                <h2 className="f-h2" style={{ marginTop: 12 }}>{result.title}</h2>
              </div>
              <span className="f-price">{result.price}</span>
            </div>

            <p className="f-sub">{result.reason}</p>

            <div className="f-btns" style={{ marginTop: 24 }}>
              <Link href={result.href} className="f-btn">
                Order {result.label} <span className="f-pip" aria-hidden="true">&rarr;</span>
              </Link>
              {result.kit !== 'kit3' ? (
                <Link href="/kits/hormone-recovery" className="f-btn f-btn-ghost">
                  Or get full picture (Kit 3)
                </Link>
              ) : (
                <Link href="/kits/hormone-recovery" className="f-btn f-btn-ghost">
                  Read more about Kit 3
                </Link>
              )}
            </div>

            {/* Soft inline email capture: result is already shown above, this is
                optional. Consent is unticked by default (UK GDPR); the result is
                visible whether or not they opt in. */}
            {captureStatus === 'done' ? (
              <div className="f-well">
                <p className="f-blab">Sent</p>
                <p className="f-sub" style={{ marginTop: 10 }}>
                  Check your inbox. Your result and what to do next are on the way.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCaptureSubmit} className="f-well">
                <h3 className="f-h4">Want this emailed to you?</h3>
                <p className="f-sub" style={{ marginTop: 8, marginBottom: 18 }}>
                  We&rsquo;ll send your result and a short series on what to do next.
                </p>
                <div className="f-btns">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    aria-label="Your email address"
                    className="f-inp"
                  />
                  <button type="submit" disabled={!canSubmit} className="f-btn">
                    {captureStatus === 'submitting' ? 'Sending…' : 'Send it to me'}
                  </button>
                </div>
                <label className="f-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    Yes, email me my result and a short series on next steps. I can
                    unsubscribe at any time. See our{' '}
                    <Link href="/privacy">Privacy Policy</Link>.
                  </span>
                </label>
                {/* role="alert" rather than a red tint. The saturation ruling
                    (tokens/colours.css, 2026-09-03) leaves this ink, so the
                    announcement has to do the work the colour used to. */}
                {captureStatus === 'error' && (
                  <p className="f-err" role="alert">Something went wrong. Please try again.</p>
                )}
              </form>
            )}

            <p style={{ marginTop: 22 }}>
              <button type="button" onClick={reset} className="f-tlink">
                Retake the quiz
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
