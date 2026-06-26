'use client'

import { useState } from 'react'

// Borderline-testosterone nurture explicit opt-in (Art 9(2)(a)). Direct clone of
// LowTNurtureConsent for the low-end-of-normal cohort (total T 12–<15 nmol/L).
// Renders ONLY on the testosterone marker card when the value falls in the
// borderline band, separate from and below the recommendation. The checkbox is
// un-pre-ticked and un-bundled — explicit consent is the gate that lets the
// `borderline_nurture_consent` flag + `borderline_nurture_consented` event reach
// Customer.io (which is what seq-03d triggers on). The wording here must stay in
// lockstep with BORDERLINE_NURTURE_CONSENT_VERSION in
// lib/results/borderlineNurtureConsent.ts.
//
// Copy carries NO value/number (CA-020) — it speaks only to "a lower-end result",
// matching the consented framing of seq-03d.
//
// ⚠️ COPY PENDING EWA SIGN-OFF (cf. CA-014/CA-018). Bump
// BORDERLINE_NURTURE_CONSENT_VERSION + add a CA record when the final wording is
// approved; the version string must point at exactly what was shown.
export function BorderlineNurtureConsent() {
  const [checked, setChecked] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!checked || status === 'submitting') return
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/borderline-nurture/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: true }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Could not record your choice')
      }
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <section className="border-2 border-black bg-white text-black p-6 lg:px-8 lg:py-7 relative z-10">
      <div className="font-mono text-xs font-bold tracking-widest mb-3">OPTIONAL — STAY INFORMED</div>
      {status === 'done' ? (
        <p className="font-serif text-sm lg:text-base leading-relaxed">
          Thanks. We have your consent on file and will keep you informed. You can unsubscribe
          from any email we send, or ask us to remove you at any time.
        </p>
      ) : (
        <>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-black"
            />
            <span className="font-serif text-sm lg:text-base leading-relaxed">
              Keep my result on file and email me occasional updates about what a lower-end
              result can mean and how Andro Prime&rsquo;s future men&rsquo;s health service may
              help. This is optional, I can unsubscribe any time, and I consent to Andro Prime
              processing my testosterone result for this purpose.
            </span>
          </label>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={submit}
              disabled={!checked || status === 'submitting'}
              className="inline-flex items-center justify-center bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Saving…' : 'Confirm'}
            </button>
            {status === 'error' && error && (
              <span className="font-serif text-sm text-red-700">{error}</span>
            )}
          </div>
        </>
      )}
    </section>
  )
}
