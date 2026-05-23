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

export async function identifyUser(userId: string, traits: Record<string, unknown>): Promise<void> {
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
