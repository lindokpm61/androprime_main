'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Newsletter capture for the blog "Health Intelligence Newsletter" card.
// The card is on a dark (bg-black) surface, so styling is white-on-black.
// POSTs to /api/forms/newsletter, which upserts with marketing_consent: true
// — so submission is gated on an explicit, unticked consent box (UK GDPR;
// no implied/pre-ticked consent for marketing). Mirrors WaitlistForm.
export function NewsletterForm() {
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
      const res = await fetch('/api/forms/newsletter', {
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
      <div className="w-full mt-auto border-2 border-white p-4 text-center">
        <p className="font-serif text-sm text-white">
          You&rsquo;re subscribed. Look out for the next deep-dive in your inbox.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-auto">
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ENTER EMAIL ADDRESS"
        className="w-full bg-transparent border-2 border-white p-3 font-mono text-xs uppercase tracking-widest text-white placeholder-gray-500 focus:outline-none focus:border-gray-300"
      />
      <label className="flex items-start gap-2 text-left text-[11px] font-serif text-gray-300 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 shrink-0 accent-white"
        />
        <span>
          Email me the newsletter. I can unsubscribe at any time. See our{' '}
          <Link href="/privacy" className="underline hover:no-underline">Privacy Policy</Link>.
        </span>
      </label>
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-white text-black border-4 border-white font-sans font-black uppercase tracking-widest text-sm p-3 hover:bg-black hover:text-white transition-colors disabled:bg-transparent disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
      >
        {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-[11px] font-sans font-black uppercase tracking-widest text-white">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
