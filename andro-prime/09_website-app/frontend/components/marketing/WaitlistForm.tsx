'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface WaitlistFormProps {
  align?: 'left' | 'center'
}

// Client form for the waitlist page (server component, so the interactive
// bits live here). POSTs to /api/forms/waitlist, which upserts the user with
// marketing_consent: true — so submission is gated on an explicit, unticked
// consent checkbox (UK GDPR; no implied/pre-ticked consent for marketing).
export function WaitlistForm({ align = 'left' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const emailValid = EMAIL_REGEX.test(email)
  const canSubmit = emailValid && consent && status !== 'submitting'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/forms/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`max-w-lg border-4 border-black bg-gray-50 p-8 ${align === 'center' ? 'mx-auto text-center' : ''}`}>
        <div className="data-label mb-3">You&rsquo;re on the list</div>
        <p className="text-lg font-serif text-black">
          Thanks. We&rsquo;ll email you the moment Andro Prime launches.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`max-w-lg ${align === 'center' ? 'mx-auto' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4">
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
          className="form-button-brutal bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-4 transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-white"
        >
          {status === 'submitting' ? 'Joining…' : 'Join Waitlist'}
        </button>
      </div>
      <label className={`mt-4 flex items-start gap-3 text-sm font-serif text-black cursor-pointer ${align === 'center' ? 'text-left' : ''}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 shrink-0 accent-black"
        />
        <span>
          Email me launch updates and early-access offers. I can unsubscribe at
          any time. See our{' '}
          <Link href="/privacy" className="underline hover:no-underline">Privacy Policy</Link>.
        </span>
      </label>
      {status === 'error' && (
        <p className="mt-4 text-sm font-sans font-black uppercase tracking-widest text-black">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
