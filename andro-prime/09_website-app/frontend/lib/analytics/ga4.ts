const MP_ENDPOINT = 'https://www.google-analytics.com/mp/collect'

export type Ga4Event = {
  name: string
  params?: Record<string, unknown>
}

/**
 * Forward events to GA4 via the Measurement Protocol.
 *
 * Server-side only: no cookies, no client SDK, so no PECR consent banner is required.
 * The caller supplies a pseudonymous `clientId` (e.g. sha256 of email/session) — never
 * raw PII. `non_personalized_ads` is set because we have no ads consent.
 *
 * Best-effort: returns false on any failure and never throws, so analytics can never
 * break the calling request. If GA4 env vars are unset the mirror is silently skipped
 * (the first-party events table stays authoritative).
 */
export async function sendGa4Event(clientId: string, events: Ga4Event[]): Promise<boolean> {
  const measurementId = process.env.GA4_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if (!measurementId || !apiSecret) return false

  try {
    const res = await fetch(
      `${MP_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          non_personalized_ads: true,
          events: events.map((e) => ({ name: e.name, params: e.params ?? {} })),
        }),
      },
    )
    return res.ok
  } catch {
    return false
  }
}
