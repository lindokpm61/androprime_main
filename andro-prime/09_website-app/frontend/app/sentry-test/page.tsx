'use client'

import * as Sentry from '@sentry/nextjs'
import { useState } from 'react'

export default function SentryTestPage() {
  const [shouldCrash, setShouldCrash] = useState(false)
  const [serverStatus, setServerStatus] = useState<string>('')

  if (shouldCrash) {
    throw new Error('Sentry test — uncaught render error')
  }

  return (
    <main style={{ padding: 32, fontFamily: 'system-ui', maxWidth: 640 }}>
      <h1>Sentry verification</h1>
      <p>Each button exercises a different capture path. Refresh the Sentry Issues page after clicking — events typically appear within 30s.</p>

      <section style={{ marginTop: 24, display: 'grid', gap: 12 }}>
        <button
          onClick={() => Sentry.captureException(new Error('Sentry test — captureException from handler'))}
          style={btnStyle}
        >
          1. Direct captureException (most reliable)
        </button>

        <button
          onClick={() => {
            throw new Error('Sentry test — uncaught throw from event handler')
          }}
          style={btnStyle}
        >
          2. Throw from event handler
        </button>

        <button onClick={() => setShouldCrash(true)} style={btnStyle}>
          3. Throw during render (triggers global-error boundary)
        </button>

        <button
          onClick={async () => {
            setServerStatus('calling…')
            try {
              const res = await fetch('/api/dev/sentry-test')
              setServerStatus(`status ${res.status}`)
            } catch (e) {
              setServerStatus(`fetch failed: ${(e as Error).message}`)
            }
          }}
          style={btnStyle}
        >
          4. Server-side error (Node SDK)
        </button>
        {serverStatus && <p style={{ fontSize: 14, opacity: 0.7 }}>Server response: {serverStatus}</p>}
      </section>

      <p style={{ marginTop: 32, fontSize: 13, opacity: 0.6 }}>
        Delete this route (<code>app/sentry-test/</code> + <code>app/api/dev/sentry-test/</code>) once verification is complete.
      </p>
    </main>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '12px 16px',
  border: '1px solid #444',
  borderRadius: 6,
  background: '#111',
  color: '#fff',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: 15,
}
