export interface CioEvent {
  name: string
  data?: Record<string, unknown>
}

const CIO_BASE = process.env.CUSTOMERIO_EU === 'true'
  ? 'https://track-eu.customer.io'
  : 'https://track.customer.io'

// Customer.io Track API endpoints. `/api/v1/track` and `/api/v1/identify` do
// not exist on the Track API and return a 404 HTML page — every event the
// older code emitted was silently dropped (the catch below swallows the error
// and the route returns 200 to the client). The correct shapes are:
//   identify : PUT  /api/v1/customers/{id}                 body = traits
//   event    : POST /api/v1/customers/{id}/events          body = {name, data, timestamp}
// Discovered 2026-05-23 during the Phase 0a supplement-waitlist E2E test.
function customerUrl(userId: string): string {
  return `${CIO_BASE}/api/v1/customers/${encodeURIComponent(userId)}`
}

function getAuthHeader(): string {
  const siteId = process.env.CUSTOMERIO_SITE_ID ?? ''
  const apiKey = process.env.CUSTOMERIO_API_KEY ?? ''
  return 'Basic ' + Buffer.from(`${siteId}:${apiKey}`).toString('base64')
}

export async function emitEvent(userId: string, event: CioEvent): Promise<void> {
  // No creds configured (e.g. local E2E harness) — skip the call entirely
  // rather than firing an unauthenticated request that 401s and is swallowed.
  if (!process.env.CUSTOMERIO_SITE_ID || !process.env.CUSTOMERIO_API_KEY) return
  try {
    const res = await fetch(`${customerUrl(userId)}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        name: event.name,
        data: event.data,
        timestamp: Math.floor(Date.now() / 1000),
      }),
    })
    if (!res.ok) {
      console.error(
        '[customerio] emitEvent non-OK:',
        res.status,
        event.name,
        await res.text().catch(() => ''),
      )
    }
  } catch (err) {
    console.error('[customerio] emitEvent failed:', err)
  }
}

/**
 * Flag a customer as having viewed a cancellation-intent page (the billing /
 * subscriptions screen). Drives the `viewed_cancel_page` attribute_change
 * condition in Customer.io segment 20 ("seq-05 Churn Trigger"), which is the
 * trigger for the churn-prevention campaign (campaign 10 / seq-05).
 *
 * Sets the profile attribute (the segment keys off the attribute transition
 * not-true -> true) and emits a matching page event for analytics/journey use.
 *
 * Idempotent by design: the segment condition is `to=true, from!=true`, so the
 * campaign only fires on the first true-transition — repeated visits do not
 * re-enter it. The attribute is intentionally NOT reset here; resetting on
 * re-engagement (so a later cancel-intent re-triggers) is a future refinement.
 */
export async function markViewedCancelPage(userId: string): Promise<void> {
  await Promise.all([
    identifyUser(userId, { viewed_cancel_page: true }),
    emitEvent(userId, { name: 'viewed_cancel_page' }),
  ])
}

export async function identifyUser(userId: string, traits: Record<string, unknown>): Promise<void> {
  if (!process.env.CUSTOMERIO_SITE_ID || !process.env.CUSTOMERIO_API_KEY) return
  try {
    const res = await fetch(customerUrl(userId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(traits),
    })
    if (!res.ok) {
      console.error(
        '[customerio] identifyUser non-OK:',
        res.status,
        await res.text().catch(() => ''),
      )
    }
  } catch (err) {
    console.error('[customerio] identifyUser failed:', err)
  }
}
