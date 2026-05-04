'use client'

import { useState } from 'react'

interface Props {
  kitType: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
  className?: string
  children: React.ReactNode
}

export function KitCheckoutButton({ kitType, className, children }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kitType }),
      })

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
      {loading ? 'Redirecting to checkout\u2026' : children}
    </button>
  )
}
