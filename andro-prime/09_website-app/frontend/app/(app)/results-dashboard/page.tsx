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

// ── Status tracker config ───────────────────────────────────────────────────

const TRACKER_STEPS = ['KIT DISPATCHED', 'SAMPLE RECEIVED', 'ANALYSING', 'RESULTS READY'] as const

const STATUS_TO_STEP: Record<PreResultsOrderStatus, number> = {
  'order-placed':    0,
  'kit-sent':        1,
  'sample-received': 2,
  'analysing':       3,
}

const STATUS_COPY: Record<PreResultsOrderStatus, { heading: string; subtext: string }> = {
  'order-placed': {
    heading: "Your kit is being prepared.",
    subtext: "We've placed your order with the lab. Your kit will be dispatched within 1-2 working days.",
  },
  'kit-sent': {
    heading: "Your kit is on its way.",
    subtext: "Your kit has been dispatched. It should arrive within 2-3 working days.",
  },
  'sample-received': {
    heading: "We've got your sample.",
    subtext: "Your sample has arrived at the lab. Analysis takes 1-3 working days.",
  },
  'analysing': {
    heading: "Your sample is being analysed.",
    subtext: "The lab is processing your results. You'll get an email as soon as they're ready.",
  },
}

const KIT_CARD_BODY: Record<KitType, string> = {
  'testosterone':
    "Your kit tests Total Testosterone and Sex Hormone Binding Globulin — the two markers that tell you where your testosterone actually stands, not just whether you're in range.",
  'energy-recovery':
    "Your kit tests Vitamin D, Active B12, hs-CRP, and Ferritin — the four markers most directly linked to energy, recovery, and inflammation in active men.",
  'hormone-recovery':
    "Your kit tests a full hormone and recovery panel including testosterone, cortisol, and key nutrient markers linked to fatigue and inflammation.",
}

// ── StatusTracker component ─────────────────────────────────────────────────

function StatusTracker({ orderStatus }: { orderStatus: PreResultsOrderStatus }) {
  const currentStep = STATUS_TO_STEP[orderStatus]

  return (
    <>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-center mt-8">
        {TRACKER_STEPS.map((label, i) => {
          const isComplete = i < currentStep
          const isCurrent = i === currentStep

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={[
                    'w-2 h-2',
                    isComplete
                      ? 'bg-black'
                      : isCurrent
                        ? 'bg-black ring-2 ring-black ring-offset-2'
                        : 'bg-gray-200',
                  ].join(' ')}
                />
                <span
                  className={[
                    'font-mono text-[10px] tracking-[0.15em] uppercase whitespace-nowrap',
                    isCurrent
                      ? 'font-black text-black underline'
                      : isComplete
                        ? 'font-black text-black'
                        : 'text-gray-400',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {i < TRACKER_STEPS.length - 1 && (
                <div
                  className={['flex-1 h-[2px] mx-3', i < currentStep ? 'bg-black' : 'bg-gray-200'].join(' ')}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex flex-col gap-6 mt-8 md:hidden">
        {TRACKER_STEPS.map((label, i) => {
          const isComplete = i < currentStep
          const isCurrent = i === currentStep

          return (
            <div key={label} className="flex items-center gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={[
                    'w-2 h-2',
                    isComplete
                      ? 'bg-black'
                      : isCurrent
                        ? 'bg-black ring-2 ring-black ring-offset-2'
                        : 'bg-gray-200',
                  ].join(' ')}
                />
                {i < TRACKER_STEPS.length - 1 && (
                  <div
                    className={['w-[2px] h-6 mt-1', i < currentStep ? 'bg-black' : 'bg-gray-200'].join(' ')}
                  />
                )}
              </div>
              <span
                className={[
                  'font-mono text-[10px] tracking-[0.15em] uppercase',
                  isCurrent
                    ? 'font-black text-black underline'
                    : isComplete
                      ? 'font-black text-black'
                      : 'text-gray-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ── EducationCards component ────────────────────────────────────────────────

function EducationCards({ kitType }: { kitType: KitType }) {
  const kitBody = KIT_CARD_BODY[kitType] ?? KIT_CARD_BODY['testosterone']

  const cards = [
    { title: "WHAT'S IN YOUR KIT", body: kitBody },
    {
      title: 'TESTOSTERONE AND YOU',
      body: "Testosterone affects energy, mood, sleep quality, body composition, and libido. Most men know it matters — but very few know their actual number. The normal range is 8-35 nmol/L. That's a 4x difference. Where you sit in that range matters.",
    },
    {
      title: 'AT THE LAB',
      body: "Your sample is tested by a UKAS-accredited laboratory. Each biomarker is measured against a calibrated reference range. Your results are reviewed before they're released — you'll get a notification the moment they're ready.",
    },
    {
      title: 'READING YOUR RESULTS',
      body: "Your results will show your number, what it means in plain English, and what — if anything — we'd recommend doing about it. No jargon. No generic advice. Everything you see will be specific to your numbers.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {cards.map((card) => (
        <div key={card.title} className="border-2 border-black p-8">
          <p className="font-sans font-black text-xs uppercase tracking-[0.15em] mb-3">
            {card.title}
          </p>
          <p className="font-serif text-sm text-gray-600 leading-relaxed">{card.body}</p>
        </div>
      ))}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function ResultsDashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) return null

  const { dev } = await searchParams
  const data = await getDashboardData(user.id, dev)

  const jar = await cookies()
  const showPasswordBanner = !jar.get('ap_pwd_prompt_dismissed')?.value

  // ── No orders ──────────────────────────────────────────────────────────
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
            <p className="font-serif text-base text-stone-600 max-w-md mx-auto mb-8">
              Once you've purchased a kit, your results and order status will appear here.
            </p>
            <a
              href="/shop/kit-1-testosterone-health-check"
              className="inline-block font-sans font-black text-xs uppercase tracking-widest bg-black text-white px-8 py-4 hover:bg-stone-800 transition-colors"
            >
              Buy a kit →
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── State A: Pre-results ────────────────────────────────────────────────
  if (data.state === 'pre-results') {
    const { orderStatus, kitType } = data
    const copy = STATUS_COPY[orderStatus]

    return (
      <div className="bg-white">
        {showPasswordBanner && <PasswordBanner />}
        {process.env.NODE_ENV !== 'production' && <DevFixtureBar currentScenario={dev} />}

        {/* Section 1 — Status tracker */}
        <section className="border-b-4 border-black py-12 px-6">
          <div className="mx-auto max-w-3xl">
            <p className="data-label mb-4">YOUR ORDER</p>
            <h1 className="font-black font-sans text-4xl md:text-5xl uppercase tracking-tight leading-tight mb-4">
              {copy.heading}
            </h1>
            <p className="font-serif text-base text-gray-600 max-w-lg">{copy.subtext}</p>
            <StatusTracker orderStatus={orderStatus} />
          </div>
        </section>

        {/* Section 2 — Educational content */}
        <section className="py-12 px-6">
          <div className="mx-auto max-w-3xl">
            <p className="data-label mb-4">WHILE YOU WAIT</p>
            <h2 className="font-black font-sans text-3xl uppercase tracking-tight mb-2">
              What we're testing.
            </h2>
            <EducationCards kitType={kitType} />
          </div>
        </section>
      </div>
    )
  }

  // ── State B: Results ready ──────────────────────────────────────────────
  return (
    <div className="results-dashboard">
      {showPasswordBanner && <PasswordBanner />}
      <div className="results-dashboard__inner">
        {process.env.NODE_ENV !== 'production' && <DevFixtureBar currentScenario={dev} />}

        <KitTabs kits={data.kits} />

        <div className="results-dashboard__footer">
          <p className="data-label text-xs mb-2">About these results</p>
          <p className="font-serif text-sm" style={{ color: 'var(--color-gray-600)' }}>
            Results are analysed by a UKAS ISO 15189 accredited laboratory. If any marker prompts
            concern, speak to your GP. These results are for information only and do not constitute
            medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
