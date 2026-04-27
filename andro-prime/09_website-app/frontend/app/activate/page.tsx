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
    title: 'Wash your hands',
    body: 'Wash with warm water for 30 seconds to increase blood flow. Dry completely.',
  },
  {
    title: 'Use the lancet',
    body: 'Twist off the cap. Press it firmly against the side of your fingertip until you hear a click.',
  },
  {
    title: 'Fill the tube',
    body: 'Gently squeeze your finger. Wipe away the first drop, then fill the tube to the top line. Massage from palm to fingertip if slow.',
  },
  {
    title: 'Seal and pack',
    body: 'Snap the lid closed tightly. Place the tube in the biohazard bag, then into the original return box.',
  },
  {
    title: 'Post today',
    body: 'Use the pre-paid return envelope. Drop it in a priority postbox before the last collection of the day.',
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

      <div className="flex justify-center w-full pb-24">
        <div className="w-full max-w-[448px] px-6 pt-12 flex flex-col gap-10">

          {/* Confirmation banner */}
          <section className="bg-black text-white py-8 px-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white shrink-0 inline-block" />
              <span className="font-mono text-xs tracking-widest uppercase mt-0.5">Kit Activated</span>
            </div>
            <h1 className="font-black font-sans text-[1.6rem] leading-tight uppercase tracking-tight">
              Your kit is registered.
            </h1>
            <div className="mt-2">
              <span className="border border-white px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase inline-block">
                {kitName}
              </span>
            </div>
          </section>

          {/* Instructions section */}
          <section className="border-t-4 border-black pt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs font-bold tracking-widest uppercase border-b-2 border-black pb-1 w-fit">
                Next Steps
              </span>
              <h2 className="font-black font-sans text-3xl uppercase tracking-tight mt-1">
                How to take your sample.
              </h2>
              <p className="text-[15px] leading-relaxed mt-2 font-serif">
                Takes about 5 minutes. Do this in the morning before 10am if possible. Testosterone
                levels are highest earlier in the day.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              {INSTRUCTIONS.map((step, i) => (
                <article key={step.title} className="relative border-2 border-black p-5 overflow-hidden">
                  <span
                    className="absolute font-black font-sans text-[100px] leading-none text-gray-200 select-none pointer-events-none z-0"
                    style={{ top: '-24px', right: '-8px' }}
                  >
                    {i + 1}
                  </span>
                  <div className="relative z-10 flex flex-col gap-2">
                    <h3 className="font-black font-sans text-lg uppercase tracking-tight">{step.title}</h3>
                    <p className="text-sm leading-relaxed font-serif">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-l-4 border-black pl-4 py-1 mt-4">
              <p className="text-sm italic leading-relaxed font-serif font-bold">
                If you can't get enough blood, use the spare lancets provided on a different finger.
                Standing up and swinging your arm can help increase flow.
              </p>
            </div>

            <Link
              href="/results-dashboard"
              className="w-full bg-black text-white border-2 border-black py-5 px-6 font-black font-sans text-lg uppercase tracking-wide hover:bg-white hover:text-black transition-colors duration-150 flex items-center justify-between group mt-2 focus:outline-none"
            >
              <span>Go to my dashboard</span>
              <span className="transform group-hover:translate-x-1 transition-transform font-mono text-xl leading-none pt-1">
                →
              </span>
            </Link>
          </section>

        </div>
      </div>
    </>
  )
}
