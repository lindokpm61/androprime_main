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
//
// ─────────────────────────────────────────────────────────────────────────
// RESTYLED IN DIRECTION F ON 2026-09-11 (batch 3). NOT ONE WORD CHANGED: every
// sentence below is the CA-024 approved text, including the two that differ only
// in tense between the idle and the done state.
//
// 🔴 IT CARRIES `id="data-privacy"` NOW, AND THE FOOTER DEPENDS ON IT. The app
// footer added in this batch links "Your data" and "Request erasure" here, and
// both links are gated on the SAME flag that mounts this component, so the
// anchor and the links appear and disappear together. A link to an anchor that
// is not on the page is the defect the `/lp` rebuild found in the nav's "Order
// Now" button; it is not repeated here.
//
// ⚠ THE FRAME LABELS THIS SECTION AS UNREVIEWED AND SO DOES THE HEADING. Frame K
// draws it with "wording not signed off" on its own label, on the grounds that a
// redesign must not make unreviewed copy look finished. The countersignature is
// still recommended and still outstanding, so the flag-dark note stays visible
// to whoever is looking at this screen with the flag on, which is only ever us.

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
    <div className="f-tray f-rise" id="data-privacy">
      <div className="f-core">
        <p className="f-blab">Data and privacy</p>

        {/* 1. Data-use statement */}
        <div className="f-dstate">
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
        <div className="f-dsplit">
          <a href="/api/account/export?format=csv" className="f-btn">
            Download my results (CSV)
          </a>
        </div>

        {/* 3. Erasure request */}
        <div className="f-dsplit">
          {requestState === 'done' ? (
            <p className="f-sub">
              Your request has been received. We will action it within 30 days and
              email you to confirm. Some records, such as proof of purchase, may be
              kept where the law requires it.
            </p>
          ) : (
            <>
              <p className="f-sub">
                Request that we erase your account data. We will action your
                request within 30 days. Some records, such as proof of purchase,
                may be kept where the law requires it.
              </p>
              <button
                type="button"
                onClick={requestErasure}
                disabled={requestState === 'submitting'}
                className="f-btn f-btn-ghost"
                style={{ marginTop: 20 }}
              >
                {requestState === 'submitting' ? 'Sending request' : 'Request data erasure'}
              </button>
              {requestState === 'error' && (
                <p className="f-err" role="alert">
                  Something went wrong. Please email support@andro-prime.com and we
                  will action your request.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
