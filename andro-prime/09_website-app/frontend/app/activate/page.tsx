import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { getKitActivation } from '@/lib/activate/getKitActivation'
import { sendActivationLink } from '@/lib/activate/sendActivationLink'
import { KitActivator } from '@/components/activate/KitActivator'
import { ScanAgainButton } from '@/components/activate/ScanAgainButton'

export const metadata: Metadata = {
  title: 'Activate Your Kit',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{
    kit?: string
    email_sent?: string
    error?: string
  }>
}

const INSTRUCTIONS = [
  {
    title: 'WASH YOUR HANDS',
    body: 'Warm water for 30 seconds. This improves blood flow to your fingertips.',
  },
  {
    title: 'USE THE LANCET',
    body: "Press it firmly against the side of a fingertip — not the pad. Rotate fingers between samples.",
  },
  {
    title: 'FILL THE TUBE',
    body: 'Gently squeeze your finger and collect blood to the fill line. Takes 1–2 minutes.',
  },
  {
    title: 'SEAL AND PACK',
    body: 'Seal the tube, place it in the biohazard bag, and put the bag in the pre-paid envelope.',
  },
  {
    title: 'POST TODAY',
    body: 'Use the pre-paid envelope provided. Post before 2pm for same-day collection where possible.',
  },
]

export default async function ActivatePage({ searchParams }: PageProps) {
  const params = await searchParams
  const kitCode = params.kit ?? ''
  const emailSent = params.email_sent ?? ''
  const errorMsg = params.error ?? ''

  const user = await getCurrentUser()

  // ── State A: Unauthenticated ───────────────────────────────────────────────
  if (!user) {
    return (
      <div className="activate-container">
        <p className="data-label mb-4">YOUR KIT</p>

        {emailSent ? (
          <>
            <h1 className="activate-heading">Check your email.</h1>
            <p className="activate-subtext">
              We've sent a sign-in link to {emailSent}. Click it to come back here and activate your
              kit.
            </p>
          </>
        ) : (
          <>
            <h1 className="activate-heading">Sign in to activate your kit.</h1>
            <p className="activate-subtext">
              Enter your email address. We'll send a sign-in link — it takes 30 seconds.
            </p>

            {errorMsg && (
              <p className="activate-error">{decodeURIComponent(errorMsg)}</p>
            )}

            <form action={sendActivationLink} className="activate-form">
              <input type="hidden" name="kitCode" value={kitCode} />
              <label className="block">
                <span className="data-label mb-2 block">EMAIL ADDRESS</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="activate-input"
                  placeholder="your@email.com"
                />
              </label>
              <button type="submit" className="activate-btn-primary">
                SEND LINK &nbsp;→
              </button>
            </form>
          </>
        )}
      </div>
    )
  }

  // No kit code supplied
  if (!kitCode) {
    return (
      <div className="activate-container">
        <h1 className="activate-heading">We couldn't find this kit.</h1>
        <p className="activate-subtext">
          Try scanning the QR code again. If you're still seeing this, contact us.
        </p>
        <a href="mailto:support@andro-prime.com" className="activate-btn-primary mt-8 inline-block">
          CONTACT SUPPORT &nbsp;→
        </a>
      </div>
    )
  }

  const activation = await getKitActivation(kitCode, user.id)

  // ── State E: Not found ────────────────────────────────────────────────────
  if (activation.state === 'not-found') {
    return (
      <div className="activate-container">
        <h1 className="activate-heading">We couldn't find this kit.</h1>
        <p className="activate-subtext">
          Try scanning the QR code again. If you're still seeing this, contact us.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
          <ScanAgainButton />
          <a
            href="mailto:support@andro-prime.com"
            className="activate-btn-primary"
          >
            CONTACT SUPPORT &nbsp;→
          </a>
        </div>
      </div>
    )
  }

  // ── State D: Wrong account ────────────────────────────────────────────────
  if (activation.state === 'wrong-account') {
    return (
      <div className="activate-container">
        <h1 className="activate-heading">This kit doesn't match your account.</h1>
        <p className="activate-subtext">
          If you think this is wrong, contact us and we'll sort it out.
        </p>
        <a
          href="mailto:support@andro-prime.com"
          className="activate-btn-primary mt-8 inline-block"
        >
          CONTACT SUPPORT &nbsp;→
        </a>
      </div>
    )
  }

  // ── State C: Already activated ────────────────────────────────────────────
  if (activation.state === 'already-activated') {
    return (
      <div className="activate-container">
        <h1 className="activate-heading">This kit has already been activated.</h1>
        <p className="activate-subtext">
          If you're looking for your results, go to your dashboard.
        </p>
        <Link
          href="/results-dashboard"
          className="activate-btn-primary mt-8 inline-block"
        >
          GO TO MY DASHBOARD &nbsp;→
        </Link>
      </div>
    )
  }

  // ── State B: Valid — show instructions ────────────────────────────────────
  const { kitName, orderId } = activation

  return (
    <>
      {/* Records activation asynchronously after page load */}
      <KitActivator kitCode={orderId} />

      {/* Section 1 — Confirmation banner */}
      <div className="activate-banner">
        <div className="activate-banner-inner">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-white inline-block shrink-0" />
            <span className="data-label text-white">KIT ACTIVATED</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <h1 className="activate-banner-heading">Your kit is registered.</h1>
            <span className="activate-kit-tag">{kitName}</span>
          </div>
        </div>
      </div>

      {/* Section 2 — Sample instructions */}
      <div className="activate-container pt-10">
        <p className="data-label mb-3">NEXT STEPS</p>
        <h2 className="text-3xl font-black font-sans uppercase tracking-tight mb-4">
          How to take your sample.
        </h2>
        <p className="font-serif text-base text-gray-600 mb-10 max-w-lg">
          Takes about 5 minutes. Do this in the morning before 10am if possible — testosterone
          levels are highest earlier in the day.
        </p>

        <div className="flex flex-col gap-4 mb-10">
          {INSTRUCTIONS.map((step, i) => (
            <div
              key={step.title}
              className="relative border-2 border-black p-5 overflow-hidden"
            >
              <span className="hidden md:block absolute top-0 right-2 text-[80px] font-sans font-black text-gray-100 select-none pointer-events-none leading-none">
                {i + 1}
              </span>
              <p className="font-sans font-black text-sm uppercase tracking-wide mb-1">
                {step.title}
              </p>
              <p className="font-serif text-sm text-gray-600">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="border-l-4 border-black pl-4 font-serif text-sm text-gray-600 mb-10">
          If you can't get enough blood from your fingertip, try warming your hands again or gently
          swinging your arm downward a few times before retrying.
        </div>

        <Link
          href="/results-dashboard"
          className="activate-btn-primary inline-block w-full sm:w-auto sm:px-8"
        >
          GO TO MY DASHBOARD &nbsp;→
        </Link>
      </div>
    </>
  )
}
