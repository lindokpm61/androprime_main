'use client'

import { useEffect } from 'react'

export function KitActivator({ kitCode }: { kitCode: string }) {
  useEffect(() => {
    fetch('/api/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kitCode }),
    }).catch(() => {})
  }, [kitCode])

  return null
}
