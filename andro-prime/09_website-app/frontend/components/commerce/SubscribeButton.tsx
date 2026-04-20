'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface Props {
  productSlug: 'daily-stack' | 'collagen' | 'complete-mens-stack'
  className?: string
  children: React.ReactNode
}

export function SubscribeButton({ productSlug, className, children }: Props) {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug }),
      })

      if (res.status === 401) {
        window.location.href = `/auth/login?next=${encodeURIComponent(pathname)}`
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
      {loading ? 'Redirecting to checkout\u2026' : children}
    </button>
  )
}
