'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { getPageAttribution } from '@/lib/analytics/page-attribution'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Newsletter capture for the blog "Health Intelligence Newsletter" card.
// `theme` adapts the brutalist styling to the surface it sits on: 'dark' is
// white-on-black, 'light' is black-on-white.
// POSTs to /api/forms/newsletter, which upserts with marketing_consent: true
// — so submission is gated on an explicit, unticked consent box (UK GDPR;
// no implied/pre-ticked consent for marketing). Mirrors WaitlistForm.
interface NewsletterFormProps {
  theme?: 'dark' | 'light'
  // Where this form sits, recorded as the signup source on both the CIO profile
  // and the first-party `events` row so capture points can be compared.
  source?: string
}

export function NewsletterForm({ theme = 'dark', source = 'blog' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const dark = theme === 'dark'
  const t = {
    successBorder: dark ? 'border-white' : 'border-black',
    successText: dark ? 'text-white' : 'text-black',
    input: dark
      ? 'border-white text-white placeholder-gray-500 focus:border-gray-300'
      : 'border-black text-black placeholder-gray-400 focus:border-gray-600',
    label: dark ? 'text-gray-300' : 'text-gray-600',
    checkbox: dark ? 'accent-white' : 'accent-black',
    button: dark
      ? 'bg-white text-black border-white hover:bg-black hover:text-white disabled:bg-transparent disabled:text-gray-500 disabled:border-gray-600'
      : 'bg-black text-white border-black hover:bg-white hover:text-black disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-300',
    error: dark ? 'text-white' : 'text-black',
  }

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
        body: JSON.stringify({ email, source, ...getPageAttribution() }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`w-full mt-auto border-2 ${t.successBorder} p-4 text-center`}>
        <p className={`font-serif text-sm ${t.successText}`}>
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
        className={`w-full bg-transparent border-2 p-3 font-mono text-xs uppercase tracking-widest focus:outline-none ${t.input}`}
      />
      <label className={`flex items-start gap-2 text-left text-[11px] font-serif cursor-pointer ${t.label}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className={`mt-0.5 w-3.5 h-3.5 shrink-0 ${t.checkbox}`}
        />
        <span>
          Email me the newsletter. I can unsubscribe at any time. See our{' '}
          <Link href="/privacy" className="underline hover:no-underline">Privacy Policy</Link>.
        </span>
      </label>
      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full border-4 font-sans font-black uppercase tracking-widest text-sm p-3 transition-colors disabled:cursor-not-allowed ${t.button}`}
      >
        {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className={`text-[11px] font-sans font-black uppercase tracking-widest ${t.error}`}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
