'use client'

import { useState } from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

export function BillingPortalButton({ className, children }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/portal', {
        method: 'POST',
      })

      if (res.status === 401) {
        window.location.href = '/auth/login'
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // network error — allow retry
    }
    setLoading(false)
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? 'Opening portal\u2026' : children}
    </button>
  )
}
