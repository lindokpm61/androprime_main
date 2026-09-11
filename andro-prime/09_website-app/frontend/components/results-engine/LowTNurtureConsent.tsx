'use client'

import { useState } from 'react'

// Low-T nurture explicit opt-in (Art 9(2)(a)). Renders ONLY on the
// low-testosterone marker card, separate from and below the "Speak to your GP"
// CTA. The checkbox is un-pre-ticked and un-bundled — explicit consent is the
// gate that lets the `low_testosterone` trait reach Customer.io. The wording
// here must stay in lockstep with LOWT_NURTURE_CONSENT_VERSION in
// lib/results/lowtNurtureConsent.ts. Lawful basis + conditions:
// 03_compliance/2026-06-04-lowt-nurture-lawful-basis.md.
//
// Copy APPROVED 2026-06-04 (CA-014, Ewa + Keith) — version-locked to
// LOWT_NURTURE_CONSENT_VERSION. Any wording change needs a new version string +
// a fresh CA record. Copy approval is NOT a ship authorisation: deploy is still
// gated on the migration, the Customer.io IDTA/SCCs + special-category DPA, and
// the nurture sequence build.
export function LowTNurtureConsent() {
  const [checked, setChecked] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!checked || status === 'submitting') return
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/lowt-nurture/consent', {
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
    <section>
      <p className="f-blab">OPTIONAL — STAY INFORMED</p>
      {status === 'done' ? (
        <p role="status" aria-live="polite" className="f-sub">
          Thanks. We have your consent on file and will keep you informed. You can unsubscribe
          from any email we send, or ask us to remove you at any time.
        </p>
      ) : (
        <>
          <label className="f-chkrow">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="f-chk"
            />
            <span className="f-sub">
              Keep my result on file and email me occasional updates about Andro Prime&rsquo;s
              future men&rsquo;s health service, including when it becomes available. This is
              optional, I can unsubscribe any time, and I consent to Andro Prime processing my
              testosterone result for this purpose.
            </span>
          </label>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={submit}
              disabled={!checked || status === 'submitting'}
              className="f-btn"
            >
              {status === 'submitting' ? 'Saving…' : 'Confirm'}
            </button>
            {status === 'error' && error && (
              <span role="status" aria-live="polite" className="f-fine">
                {error}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  )
}
