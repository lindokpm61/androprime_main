'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { getPageAttribution } from '@/lib/analytics/page-attribution'
import { MAINTENANCE_OFFER_COPY } from '@/lib/results/maintenanceOfferCopy'

// Segment property required by the attach-measurement spec
// (07_sales/funnel/supplement-conversion.md ~33-42) so attach can later be
// split deficiency vs all-clear vs low-T. This offer is only ever the all-clear
// path, so the segment is constant.
const SEGMENT = 'all_clear'

// Fire a first-party + GA4 event through the existing public client sink
// (/api/events → trackEvent → Supabase events + GA4 Measurement Protocol).
// Best-effort and non-blocking: keepalive lets `supplement_offer_clicked` flush
// during the navigation to the waitlist page; failures are swallowed so tracking
// can never break the click.
function emitOfferEvent(event: 'supplement_offer_shown' | 'supplement_offer_clicked'): void {
  try {
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, props: { segment: SEGMENT }, ...getPageAttribution() }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // analytics must never break the UI
  }
}

// Client button for the all-clear maintenance offer. This component only mounts
// when the classifier returned the `maintenance-offer` CTA, which only happens
// when MAINTENANCE_OFFER_ENABLED is ON — so both events fire ONLY when the flag
// is on (no client-side flag read needed). `supplement_offer_shown` fires once
// on mount (the card render); `supplement_offer_clicked` fires on the button tap.
export function MaintenanceOfferCta() {
  const shownFired = useRef(false)

  useEffect(() => {
    if (shownFired.current) return
    shownFired.current = true
    emitOfferEvent('supplement_offer_shown')
  }, [])

  return (
    <Link
      href={MAINTENANCE_OFFER_COPY.href}
      onClick={() => emitOfferEvent('supplement_offer_clicked')}
      className="inline-flex items-center justify-center bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors"
    >
      {MAINTENANCE_OFFER_COPY.buttonLabel}
    </Link>
  )
}
