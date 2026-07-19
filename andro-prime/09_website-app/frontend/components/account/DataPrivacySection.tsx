'use client'

import { useState } from 'react'

// Account "Data & privacy" section. Rendered only when
// ACCOUNT_DATA_CONTROLS_ENABLED is on (the account page reads the flag and
// decides whether to mount this). Three parts:
//   1. Data-use statement (Theme 6: privacy anxiety, "we do not sell your data")
//   2. Results download (CSV): read-only, GET /api/account/export
//   3. Erasure request: records a request, does NOT delete (see the route)
//
// COPY STATUS: APPROVED (CA-024, Ewa via Keith's in-session representation
// 2026-07-19; countersignature recommended; pre-flight 0 HARD after one benign
// "treat"->"handle" hygiene edit). Flipping the flag on is separately gated on
// Keith confirming the erasure ops-alert address + 30-day SLA. The wording is
// written to be
// factual against 03_compliance (health data = special category, Art 9(2)(a)
// consent captured at checkout, EU/Ireland residency, Vitall = independent
// controller) and to avoid every red-flag term. No em dashes (AI-tell rule).

type RequestState = 'idle' | 'submitting' | 'done' | 'error'

export function DataPrivacySection() {
  const [requestState, setRequestState] = useState<RequestState>('idle')

  async function requestErasure() {
    setRequestState('submitting')
    try {
      const res = await fetch('/api/account/erasure-request', { method: 'POST' })
      setRequestState(res.ok ? 'done' : 'error')
    } catch {
      setRequestState('error')
    }
  }

  return (
    <div className="account__section">
      <h2 className="account__section-heading">Data &amp; privacy</h2>

      {/* 1. Data-use statement */}
      <div className="account__data-statement font-serif text-sm leading-relaxed text-gray-800 space-y-3">
        <p>
          Your blood results are personal health data, and we handle them as
          special-category data under UK GDPR. We process them only with the
          explicit consent you gave when you bought your kit.
        </p>
        <p>
          Your data is stored in the European Union (Ireland). We do not sell it,
          and we do not share it for advertising. Our testing partner, Vitall,
          processes your sample as an independent data controller for the
          laboratory work.
        </p>
        <p>
          You can download your own results below, or ask us to erase your
          account data.
        </p>
      </div>

      {/* 2. Download */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <a
          href="/api/account/export?format=csv"
          className="inline-block bg-black text-white font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-gray-800 transition-colors"
        >
          Download my results (CSV)
        </a>
      </div>

      {/* 3. Erasure request */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        {requestState === 'done' ? (
          <p className="font-serif text-sm text-gray-800">
            Your request has been received. We will action it within 30 days and
            email you to confirm. Some records, such as proof of purchase, may be
            kept where the law requires it.
          </p>
        ) : (
          <>
            <p className="font-serif text-sm leading-relaxed text-gray-800 mb-4">
              Request that we erase your account data. We will action your
              request within 30 days. Some records, such as proof of purchase,
              may be kept where the law requires it.
            </p>
            <button
              type="button"
              onClick={requestErasure}
              disabled={requestState === 'submitting'}
              className="inline-block border-2 border-black bg-white text-black font-mono text-xs uppercase tracking-wider px-6 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {requestState === 'submitting' ? 'Sending request' : 'Request data erasure'}
            </button>
            {requestState === 'error' && (
              <p className="font-serif text-sm text-red-700 mt-3">
                Something went wrong. Please email support@andro-prime.com and we
                will action your request.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
