'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { CONSENT_EVENT, getConsent, type ConsentValue } from '@/lib/analytics/consent'

/**
 * Client-side GA4 (gtag.js) gated by Google Consent Mode v2.
 *
 * This is the consent-GATED Phase 2 tag. It complements (does not replace) the
 * server-side Measurement Protocol mirror in `lib/analytics/ga4.ts`, which runs
 * cookie-free regardless of consent. This tag adds the missing piece the server
 * side can't get: tying conversions to the originating web session.
 *
 * Consent Mode v2: analytics + ad storage default to `denied` BEFORE gtag.js loads,
 * so no analytics cookies are written until the visitor opts in. On opt-in we flip
 * only `analytics_storage` to `granted`; ad storage/personalisation stay denied (we
 * run no ad pixels). While denied, GA still sends cookieless, non-identifying pings.
 *
 * Renders nothing if `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is unset (soft fail in dev).
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
  const pathname = usePathname()

  // React to consent changes made via the banner: flip Consent Mode at runtime.
  useEffect(() => {
    if (!measurementId) return
    const onChange = (e: Event) => {
      const value = (e as CustomEvent<ConsentValue>).detail
      window.gtag?.('consent', 'update', {
        analytics_storage: value === 'granted' ? 'granted' : 'denied',
      })
    }
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [measurementId])

  // SPA page_view on client-side navigation (the initial view is sent by config).
  useEffect(() => {
    if (!measurementId || !pathname) return
    window.gtag?.('event', 'page_view', { page_path: pathname })
  }, [measurementId, pathname])

  if (!measurementId) return null

  // Bootstrap runs before gtag.js drains the queue: init dataLayer, set the
  // denied-by-default consent state, re-apply any stored opt-in, then config.
  const initialConsent: ConsentValue = getConsent() === 'granted' ? 'granted' : 'denied'
  const bootstrap =
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments);}` +
    `window.gtag=gtag;` +
    `gtag('js',new Date());` +
    `gtag('consent','default',{` +
    `ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',` +
    `analytics_storage:'denied',wait_for_update:500});` +
    (initialConsent === 'granted'
      ? `gtag('consent','update',{analytics_storage:'granted'});`
      : '') +
    `gtag('config',${JSON.stringify(measurementId)},{anonymize_ip:true});`

  return (
    <>
      <Script id="ga-consent-bootstrap" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="lazyOnload"
      />
    </>
  )
}
