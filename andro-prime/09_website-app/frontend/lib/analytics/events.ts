import { createHash, randomUUID } from 'node:crypto'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/lib/supabase/types'
import { sendGa4Event } from '@/lib/analytics/ga4'

export type EventName =
  | 'kit_purchase'
  | 'supplement_subscribe'
  | 'email_signup'
  | 'quiz_complete'
  | 'kit_activate'
  | 'result_view'
  | 'affiliate_click'
  | 'content_cta_click'

export type TrackInput = {
  /** Raw email — hashed before storage, NEVER sent to GA4. */
  email?: string | null
  /** First-party pseudonymous id, if available. */
  anonymousId?: string | null
  /** Used as GA4 transaction_id for revenue events (dedupe). */
  transactionId?: string | null

  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  fpr_tid?: string | null
  referrer?: string | null
  landing_path?: string | null

  value?: number | null
  currency?: string | null
  kitId?: string | null
  sku?: string | null

  props?: Record<string, unknown>
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

function hashEmail(email?: string | null): string | null {
  if (!email) return null
  return sha256(email.trim().toLowerCase())
}

// Revenue events map to GA4's standard `purchase` so they populate GA4 ecommerce reports.
const GA4_NAME: Partial<Record<EventName, string>> = {
  kit_purchase: 'purchase',
  supplement_subscribe: 'purchase',
}

/**
 * Record a first-party analytics event (Supabase `events`) and mirror it to GA4 via the
 * Measurement Protocol (pseudonymised, no PII in params).
 *
 * Best-effort and fully isolated: a DB or network failure is swallowed so tracking can
 * never break the calling request. The first-party row is authoritative; GA4 is a mirror.
 */
export async function trackEvent(name: EventName, input: TrackInput = {}): Promise<void> {
  const emailHash = hashEmail(input.email)

  // stable per-person where possible (groups a user's events in GA4); else random.
  const clientId =
    input.anonymousId ||
    emailHash ||
    (input.fpr_tid ? sha256(input.fpr_tid) : null) ||
    randomUUID()

  // 1) first-party store (authoritative, vendor-neutral)
  try {
    const admin = createSupabaseAdminClient()
    await admin.from('events').insert({
      event_name: name,
      anonymous_id: input.anonymousId ?? null,
      email_hash: emailHash,
      utm_source: input.utm_source ?? null,
      utm_medium: input.utm_medium ?? null,
      utm_campaign: input.utm_campaign ?? null,
      utm_term: input.utm_term ?? null,
      utm_content: input.utm_content ?? null,
      fpr_tid: input.fpr_tid ?? null,
      referrer: input.referrer ?? null,
      landing_path: input.landing_path ?? null,
      value: input.value ?? null,
      currency: input.currency ?? null,
      kit_id: input.kitId ?? null,
      sku: input.sku ?? null,
      props: (input.props ?? {}) as unknown as Json,
    })
  } catch {
    // analytics must never break the request
  }

  // 2) GA4 mirror (pseudonymised; no PII in params)
  const ga4Name = GA4_NAME[name] ?? name
  const params: Record<string, unknown> = {
    ...(input.value != null ? { value: input.value } : {}),
    ...(input.currency ? { currency: input.currency.toUpperCase() } : {}),
    ...(input.kitId ? { kit_id: input.kitId } : {}),
    ...(input.utm_source ? { source: input.utm_source } : {}),
    ...(input.utm_medium ? { medium: input.utm_medium } : {}),
    ...(input.utm_campaign ? { campaign: input.utm_campaign } : {}),
    ...(input.fpr_tid ? { affiliate: true } : {}),
    ...(input.props ?? {}),
  }
  if (ga4Name === 'purchase') {
    if (input.transactionId) params.transaction_id = input.transactionId
    const itemId = input.sku ?? input.kitId
    if (itemId) {
      params.items = [
        {
          item_id: itemId,
          item_name: input.kitId ?? input.sku ?? itemId,
          price: input.value ?? undefined,
          quantity: 1,
        },
      ]
    }
  }

  await sendGa4Event(clientId, [{ name: ga4Name, params }])
}
