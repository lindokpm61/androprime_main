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
    // Carry an optional ?discount= code (e.g. SUBSCRIBER10) from the landing URL
    // through checkout. Read at click time so the page stays statically rendered.
    const discount = new URLSearchParams(window.location.search).get('discount') ?? undefined
    try {
      const res = await fetch('/api/checkout/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kitType, discount }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      if (data.needsDetails) {
        const q = new URLSearchParams({ kit: kitType })
        if (discount) q.set('discount', discount)
        window.location.href = `/checkout/details?${q.toString()}`
        return
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
