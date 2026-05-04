import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth/session'
import { getDashboardData } from '@/lib/results/getDashboardData'
import { KitTabs } from '@/components/results-engine'
import { DevFixtureBar } from '@/components/results-engine'
import { PasswordBanner } from '@/components/app/PasswordBanner'
import type { PreResultsOrderStatus, KitType } from '@/lib/results/types'

export const metadata: Metadata = {
  title: 'Your Results',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ dev?: string }>
}

// ── Tracker config ──────────────────────────────────────────────────────────

const TRACKER_STEPS = ['KIT DISPATCHED', 'SAMPLE RECEIVED', 'ANALYSING', 'RESULTS READY'] as const

const STATUS_TO_STEP: Record<PreResultsOrderStatus, number> = {
  'order-placed':    0,
  'kit-sent':        1,
  'sample-received': 2,
  'analysing':       3,
}

const STATUS_COPY: Record<PreResultsOrderStatus, { heading: string; subtext: string }> = {
  'order-placed': {
    heading: 'Your kit is being prepared.',
    subtext: "We've placed your order with the lab. Your kit will be dispatched within 1–2 working days.",
  },
  'kit-sent': {
    heading: 'Your kit is on its way.',
    subtext: 'Your kit has been dispatched. It should arrive within 2–3 working days.',
  },
  'sample-received': {
    heading: "We've got your sample.",
    subtext: 'Your sample has arrived at the lab. Analysis takes 1–3 working days.',
  },
  'analysing': {
    heading: 'Your sample is being analysed.',
    subtext: "The lab is processing your results. You'll get an email as soon as they're ready.",
  },
}

const KIT_CARD_BODY: Record<KitType, string> = {
  'testosterone':
    "Your kit tests Total Testosterone and Sex Hormone Binding Globulin. These are the two markers that tell you where your testosterone actually stands, not just whether you're 'in range'.",
  'energy-recovery':
    'Your kit tests Vitamin D, Active B12, hs-CRP, and Ferritin, the four markers most directly linked to energy, recovery, and inflammation in active men.',
  'hormone-recovery':
    'Your kit tests a full hormone and recovery panel including testosterone, cortisol, and key nutrient markers linked to fatigue and inflammation.',
}

// ── StatusTracker ────────────────────────────────────────────────────────────

function StatusTracker({ orderStatus }: { orderStatus: PreResultsOrderStatus }) {
  const currentStep = STATUS_TO_STEP[orderStatus]

  return (
    <>
      {/* Mobile: vertical stepper */}
      <div className="sm:hidden mt-10 flex flex-col">
        {TRACKER_STEPS.map((label, i) => {
          const isComplete = i < currentStep
          const isCurrent = i === currentStep
          const isLast = i === TRACKER_STEPS.length - 1
          return (
            <div key={label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'w-6 h-6 border-4 border-black flex items-center justify-center shrink-0',
                    isComplete ? 'bg-black' : 'bg-white',
                  ].join(' ')}
                >
                  {isCurrent && <span className="w-2 h-2 bg-black" />}
                </div>
                {!isLast && <div className="w-1 bg-black flex-1 min-h-[2rem]" />}
              </div>
              <span
                className={[
                  'font-mono font-bold tracking-[0.05em] uppercase pb-6 text-[0.75rem]',
                  !isComplete && !isCurrent ? 'text-gray-400' : 'text-black',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* sm+: horizontal tracker */}
      <div className="hidden sm:block overflow-x-auto mt-16">
        <div className="relative pt-8 min-w-[520px]">
          <div
            className="absolute bg-black"
            style={{ top: '2.75rem', left: '3rem', right: '3rem', height: '4px', zIndex: 0 }}
          />
          <div className="relative flex justify-between" style={{ zIndex: 1 }}>
            {TRACKER_STEPS.map((label, i) => {
              const isComplete = i < currentStep
              const isCurrent = i === currentStep
              return (
                <div key={label} className="flex flex-col items-center gap-6 bg-white px-4">
                  <span className="font-mono font-bold tracking-[0.05em] uppercase whitespace-nowrap" style={{ fontSize: '0.75rem' }}>
                    {label}
                  </span>
                  <div
                    className={[
                      'w-6 h-6 border-4 border-black flex items-center justify-center shrink-0',
                      isComplete ? 'bg-black' : 'bg-white',
                    ].join(' ')}
                  >
                    {isCurrent && <span className="w-2 h-2 bg-black" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

// ── EducationCards ───────────────────────────────────────────────────────────

function EducationCards({ kitType }: { kitType: KitType }) {
  const kitBody = KIT_CARD_BODY[kitType] ?? KIT_CARD_BODY['testosterone']

  const cards = [
    {
      id: 'DOC.01',
      title: "What's in your kit",
      subtitle: kitType === 'testosterone' ? '(Kit 1: Testosterone + SHBG)' : undefined,
      body: kitBody,
    },
    {
      id: 'DOC.02',
      title: 'Testosterone and you',
      body: "Testosterone is one of the body's core regulatory hormones. Most men know it matters. But very few know their actual number. The 'normal' range is 8–35 nmol/L. That's a 4x difference. Where you sit in that range matters.",
    },
    {
      id: 'DOC.03',
      title: 'At the lab',
      body: "Your sample is tested by a UKAS-accredited laboratory. Each biomarker is measured against a calibrated reference range. Your results are released automatically once processing is complete. You'll get a notification the moment they're ready.",
    },
    {
      id: 'DOC.04',
      title: 'Reading your results',
      body: 'Your results will show your number, what it means in plain English, and what options exist if you want to act on it. No jargon. No generic advice. Everything you see will be specific to your numbers.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {cards.map((card) => (
        <article key={card.id} className="relative border-2 border-black p-8 flex flex-col gap-6">
          <span
            className="absolute font-mono font-bold tracking-[0.05em] uppercase"
            style={{ top: '2rem', right: '2rem', fontSize: '0.75rem' }}
          >
            {card.id}
          </span>
          <h3
            className="font-black font-sans uppercase tracking-tight leading-tight"
            style={{ fontSize: '1.5rem', maxWidth: '80%' }}
          >
            {card.title}
            {card.subtitle && (
              <span className="block font-sans font-normal text-sm mt-2 normal-case tracking-normal">
                {card.subtitle}
              </span>
            )}
          </h3>
          <div className="mt-auto pt-6 border-t border-black font-serif text-base leading-relaxed">
            {card.body}
          </div>
        </article>
      ))}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ResultsDashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) return null

  const { dev } = await searchParams
  const data = await getDashboardData(user.id, dev)

  const jar = await cookies()
  const showPasswordBanner = !jar.get('ap_pwd_prompt_dismissed')?.value

  // ── No orders ─────────────────────────────────────────────────────────────
  if (data.state === 'no-results') {
    return (
      <div className="results-dashboard">
        {showPasswordBanner && <PasswordBanner />}
        <div className="results-dashboard__inner">
          {process.env.NODE_ENV !== 'production' && <DevFixtureBar currentScenario={dev} />}
          <div className="results-holding">
            <p className="data-label text-xs mb-4">Your results</p>
            <h1 className="font-black font-sans text-3xl uppercase tracking-tight mb-4">
              No kit purchased yet
            </h1>
            <p className="font-serif text-base text-gray-600 max-w-md mx-auto mb-8">
              Once you've purchased a kit, your results and order status will appear here.
            </p>
            <a
              href="/shop/kit-1-testosterone-health-check"
              className="inline-block font-sans font-black text-xs uppercase tracking-widest bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors"
            >
              Buy a kit →
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── State A: Pre-results ──────────────────────────────────────────────────
  if (data.state === 'pre-results') {
    const { orderStatus, kitType } = data
    const copy = STATUS_COPY[orderStatus]
    const statusBadgeLabel = `STATUS: ${orderStatus.toUpperCase().replace(/-/g, '.')}`

    return (
      <div className="bg-white min-h-[calc(100vh-5rem)]">
        {showPasswordBanner && <PasswordBanner />}
        {process.env.NODE_ENV !== 'production' && <DevFixtureBar currentScenario={dev} />}

        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12 lg:py-16 flex flex-col gap-24">

          {/* Order status section */}
          <section aria-label="Order Status">
            <div className="flex flex-col gap-4">
              <span className="inline-flex border-4 border-black px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase self-start">
                {statusBadgeLabel}
              </span>
              <h1
                className="font-black font-sans uppercase tracking-tight leading-none"
                style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', maxWidth: '20ch' }}
              >
                {copy.heading}
              </h1>
              <p className="font-serif text-base max-w-lg" style={{ color: 'var(--color-gray-600, #4b5563)' }}>
                {copy.subtext}
              </p>
            </div>
            <StatusTracker orderStatus={orderStatus} />
          </section>

          {/* Educational content section */}
          <section aria-label="Educational Materials">
            <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-12">
              <h2 className="font-black font-sans text-4xl uppercase tracking-tight">WHILE YOU WAIT</h2>
              <span className="font-mono text-xs font-bold tracking-widest uppercase hidden sm:block">
                WHAT WE'RE TESTING
              </span>
            </div>
            <EducationCards kitType={kitType} />
          </section>

        </div>
      </div>
    )
  }

  // ── State B: Results ready ────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-[calc(100vh-5rem)]">
      {showPasswordBanner && <PasswordBanner />}

      {/* Scrolling ticker */}
      <div className="w-full bg-black text-white overflow-hidden h-8 flex items-center border-b-4 border-black">
        <div className="flex whitespace-nowrap animate-marquee font-mono text-[11px] font-bold uppercase tracking-widest">
          <span className="mx-8">/// ANDRO PRIME SYS.READY</span>
          <span className="mx-8">/// SEC: AES-256</span>
          <span className="mx-8">/// ANALYSIS COMPLETE</span>
          <span className="mx-8">/// REPORT GENERATED</span>
          <span className="mx-8">/// BIOMARKERS PROCESSED</span>
          <span className="mx-8">/// ANDRO PRIME SYS.READY</span>
          <span className="mx-8">/// SEC: AES-256</span>
          <span className="mx-8">/// ANALYSIS COMPLETE</span>
          <span className="mx-8">/// REPORT GENERATED</span>
          <span className="mx-8">/// BIOMARKERS PROCESSED</span>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-5rem-2rem)]">

        {/* Left sidebar */}
        <aside className="hidden md:flex md:w-[25%] lg:w-[30%] xl:w-[28%] border-r-4 border-black bg-white flex-col sticky top-20 self-start h-[calc(100vh-5rem)]">
          <div className="p-6 lg:p-8 xl:p-10 flex-1 flex flex-col overflow-y-auto">
            {process.env.NODE_ENV !== 'production' && <DevFixtureBar currentScenario={dev} />}

            <div className="inline-flex items-center gap-3 px-4 py-2 border-2 border-black mb-8 w-max">
              <span className="w-3 h-3 bg-black animate-pulse" />
              <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase">
                Report Generated
              </span>
            </div>

            <h1 className="font-black font-sans text-black uppercase tracking-tighter leading-[0.85] mb-6" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
              Your<br />Results
            </h1>

            <p className="font-serif text-base leading-relaxed border-l-4 border-black pl-4 mb-8">
              We've processed your latest blood panel. Review your personalised biomarker insights
              and what they mean for you.
            </p>

            <div className="mt-auto pt-8 border-t-2 border-black">
              <svg className="w-24 h-24 animate-spin-slow" viewBox="0 0 100 100" aria-hidden>
                <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="2" strokeDasharray="4 8" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="black" strokeWidth="4" strokeDasharray="15 15" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="black" strokeWidth="2" />
                <line x1="50" y1="50" x2="50" y2="5" stroke="black" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </aside>

        {/* Right content */}
        <main className="w-full md:w-[75%] lg:w-[70%] xl:w-[72%] flex flex-col bg-gray-100">
          <KitTabs kits={data.kits} />

          <footer className="bg-white border-t-4 border-black p-8 lg:px-12 xl:px-16 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <p className="font-mono text-xs font-bold tracking-widest uppercase">
              Questions about your results?{' '}
              <a
                href="mailto:support@andro-prime.com"
                className="underline hover:bg-black hover:text-white transition-colors px-1 ml-1"
              >
                Speak to our team
              </a>
            </p>
            <div className="flex gap-8 font-mono text-xs font-bold tracking-widest uppercase">
              <span>SYS.STAT: ONLINE</span>
              <span>SEC: AES-256</span>
            </div>
          </footer>
        </main>

      </div>
    </div>
  )
}
