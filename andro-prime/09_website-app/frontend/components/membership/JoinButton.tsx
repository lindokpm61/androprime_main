'use client'

import { useState } from 'react'

/**
 * Starts the membership Stripe Checkout session.
 *
 * A membership is a subscription SLUG, not a new subsystem, so this posts to
 * the same route every other recurring product uses. That route re-checks
 * MEMBERSHIP_ENABLED server-side: this button being on screen is never what
 * authorises the sale.
 */
export function JoinButton({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function handleClick() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: 'membership' }),
      })

      if (res.status === 401) {
        window.location.href = '/auth/login?next=/membership'
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(true)
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading} className="membership__cta">
        {loading ? 'Redirecting to checkout…' : children}
      </button>
      {error && (
        <p role="alert" className="membership__checkin-error">
          We could not start checkout. Please try again.
        </p>
      )}
    </>
  )
}
