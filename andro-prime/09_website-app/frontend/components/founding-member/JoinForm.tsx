'use client'

import { useState, FormEvent } from 'react'

interface JoinFormProps {
  source?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error'

export function JoinForm({ source = 'founding_member_page' }: JoinFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [lowTFlag, setLowTFlag] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/founding-member/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          source: lowTFlag ? `${source}__low_t` : source,
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
      <div className="bg-white border-4 border-black p-10 md:p-12 text-left shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="data-label mb-4">{status === 'already' ? 'Already on the list' : 'You’re on the list'}</div>
        <h3 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mb-4">
          {status === 'already' ? 'Good news — we already had you.' : 'Thanks. We’ll be in touch.'}
        </h3>
        <p className="font-serif text-lg leading-relaxed">
          You&rsquo;ll be one of the first contacted when our regulated TRT programme is live. No payment was taken. You can unsubscribe at any time by emailing{' '}
          <a href="mailto:hello@andro-prime.com" className="font-bold underline">hello@andro-prime.com</a>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="data-label block mb-2">First name</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-2 border-black px-4 py-3 font-serif text-base bg-white focus:outline-none focus:bg-gray-50"
            autoComplete="given-name"
          />
        </label>
        <label className="block">
          <span className="data-label block mb-2">Last name</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-2 border-black px-4 py-3 font-serif text-base bg-white focus:outline-none focus:bg-gray-50"
            autoComplete="family-name"
          />
        </label>
      </div>

      <label className="block">
        <span className="data-label block mb-2">Email</span>
        <input
          type="email"
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
          checked={lowTFlag}
          onChange={(e) => setLowTFlag(e.target.checked)}
          className="mt-1 w-5 h-5 border-2 border-black accent-black"
        />
        <span className="font-serif text-base">I had a low-T result on a recent kit (under 12 nmol/L).</span>
      </label>

      {errorMessage && (
        <p className="font-serif text-sm text-red-700 border-2 border-red-700 bg-red-50 p-3">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Joining…' : 'Join the founding-member list'}
      </button>

      <p className="font-serif text-sm text-gray-600">
        No payment. No commitment. We email you when our regulated TRT programme is live.
      </p>
    </form>
  )
}
