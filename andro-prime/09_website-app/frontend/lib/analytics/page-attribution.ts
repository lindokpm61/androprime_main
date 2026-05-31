// Client-safe attribution capture. Reads marketing parameters from the CURRENT
// page at submit time: the URL query string, the document referrer, and the
// path. It does NOT read or write cookies or storage, so it needs no PECR
// consent — it only uses the URL the visitor is already on. (Cross-page,
// first-touch attribution that persists across navigations is the consent-gated
// Phase 2 work; this is the consent-free floor.)
//
// Because the cold-to-warm bridge tags the quiz link with
// `?utm_source=newsletter&...`, a quiz submitted from a newsletter click lands
// on `/test-selector?utm_source=newsletter` and this captures that hop.

export interface PageAttribution {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  fpr: string | null
  referrer: string | null
  landing_path: string | null
}

const EMPTY: PageAttribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
  fpr: null,
  referrer: null,
  landing_path: null,
}

export function getPageAttribution(): PageAttribution {
  if (typeof window === 'undefined') return { ...EMPTY }

  const params = new URLSearchParams(window.location.search)
  const val = (key: string): string | null => {
    const v = params.get(key)
    return v && v.length > 0 && v.length <= 200 ? v : null
  }

  return {
    utm_source: val('utm_source'),
    utm_medium: val('utm_medium'),
    utm_campaign: val('utm_campaign'),
    utm_term: val('utm_term'),
    utm_content: val('utm_content'),
    // FirstPromoter uses ?fpr= (and historically ?ref=); accept either.
    fpr: val('fpr') ?? val('ref'),
    referrer: document.referrer || null,
    landing_path: window.location.pathname || null,
  }
}
