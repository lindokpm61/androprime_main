import { NextResponse } from 'next/server'
import { trackEvent, type EventName } from '@/lib/analytics/events'

export const runtime = 'nodejs'

// Public sink for CLIENT-only events. Authoritative server events (kit_purchase,
// email_signup) are emitted from their own server routes, not here. No raw email is
// accepted on this endpoint by design — keeps PII off the public sink.
const ALLOWED = new Set<EventName>(['quiz_complete', 'affiliate_click', 'content_cta_click'])

function str(value: unknown, max: number): string | null {
  return typeof value === 'string' && value.length > 0 && value.length <= max ? value : null
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = body.event
  if (typeof event !== 'string' || !ALLOWED.has(event as EventName)) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
  }

  const props =
    body.props && typeof body.props === 'object' && !Array.isArray(body.props)
      ? (body.props as Record<string, unknown>)
      : {}

  await trackEvent(event as EventName, {
    anonymousId: str(body.anonymousId, 100),
    utm_source: str(body.utm_source, 100),
    utm_medium: str(body.utm_medium, 100),
    utm_campaign: str(body.utm_campaign, 100),
    utm_term: str(body.utm_term, 100),
    utm_content: str(body.utm_content, 100),
    fpr_tid: str(body.fpr, 100),
    referrer: str(body.referrer, 500),
    landing_path: str(body.landing_path, 500),
    kitId: str(body.kit_id, 50),
    sku: str(body.sku, 50),
    props,
  })

  return NextResponse.json({ ok: true })
}
