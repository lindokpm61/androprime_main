'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export interface SupplementWaitlistFormProps {
  sourceMarker?: string
  sourceKit?: string
  interestedInProduct?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phase 0a supplement early-access opt-in form. No payment, no commitment.
// Submission is gated on an explicit, unticked GDPR consent checkbox (UK
// GDPR rules out pre-ticked marketing consent). Copy avoids medicinal
// claims, EFSA-restricted wording, and em-dashes per the Andro Prime
// brand voice rules.
export function SupplementWaitlistForm({
  sourceMarker,
  sourceKit,
  interestedInProduct,
}: SupplementWaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const emailValid = EMAIL_RE.test(email)
  const canSubmit = emailValid && consent && status !== 'submitting'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/supplement-waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: true,
          source_marker: sourceMarker,
          source_kit: sourceKit,
          interested_in_product: interestedInProduct,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data?.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      const data = await res.json()
      setStatus(data.alreadyListed ? 'already' : 'success')
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success' || status === 'already') {
    return (
      <div className="bg-white border-4 border-black p-8 md:p-10 text-left shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="data-label mb-3">
          {status === 'already' ? 'Already on the list' : 'You’re on the list'}
        </div>
        <h3 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tighter mb-3">
          {status === 'already'
            ? 'Good news. We already had you.'
            : 'Thanks. We’ll be in touch.'}
        </h3>
        <p className="font-serif text-base leading-relaxed">
          You will be one of the first to know when our supplement range is
          ready. No payment was taken. You can unsubscribe at any time by
          emailing{' '}
          <a href="mailto:hello@andro-prime.com" className="font-bold underline">
            hello@andro-prime.com
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-5"
    >
      <label className="block">
        <span className="data-label block mb-2">Email</span>
        <input
          type="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-black px-4 py-3 font-serif text-base bg-white focus:outline-none focus:bg-gray-50"
          autoComplete="email"
        />
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-5 h-5 shrink-0 border-2 border-black accent-black"
        />
        <span className="font-serif text-sm leading-relaxed">
          Email me when the supplement range is ready, plus occasional
          early-access offers. I can unsubscribe at any time. See our{' '}
          <Link href="/privacy" className="underline hover:no-underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {errorMessage && (
        <p className="font-serif text-sm text-red-700 border-2 border-red-700 bg-red-50 p-3">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
      >
        {status === 'submitting' ? 'Joining…' : 'Join the early-access list'}
      </button>

      <p className="font-serif text-xs text-gray-600">
        No payment. No commitment. We email you when the supplement range is
        ready.
      </p>

      {(sourceMarker || sourceKit || interestedInProduct) && (
        <>
          {sourceMarker && (
            <input type="hidden" name="source_marker" value={sourceMarker} />
          )}
          {sourceKit && (
            <input type="hidden" name="source_kit" value={sourceKit} />
          )}
          {interestedInProduct && (
            <input
              type="hidden"
              name="interested_in_product"
              value={interestedInProduct}
            />
          )}
        </>
      )}
    </form>
  )
}
