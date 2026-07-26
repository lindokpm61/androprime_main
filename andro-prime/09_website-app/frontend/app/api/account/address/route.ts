import { type NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isAccountAddressEnabled } from '@/lib/flags'

// PUT /api/account/address
// Updates the authenticated user's delivery address on their `users` row (the
// exact columns the bundle second-kit dispatch snapshots, lib/bundles/dispatch.ts).
// Gated behind ACCOUNT_ADDRESS_ENABLED so the whole address surface ships as one
// reviewed unit; 404 when OFF. Writes ONLY the caller's own row (keyed by the
// authenticated user id, never a client-supplied id).

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function PUT(request: NextRequest) {
  if (!isAccountAddressEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const userOrResponse = await requireAuthenticatedApiUser(request)
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const line1 = clean(body.line1)
  const city = clean(body.city)
  const postalCode = clean(body.postalCode)

  if (!line1 || !city || !postalCode) {
    return NextResponse.json(
      { error: 'Address line 1, town or city, and postcode are required.' },
      { status: 422 },
    )
  }

  // Optional fields collapse to null when blank. Country is forced to GB
  // (UK-only dispatch); the client field is display-only, so it is not trusted.
  const line2 = clean(body.line2) || null
  const county = clean(body.county) || null
  const firstName = clean(body.firstName) || null
  const lastName = clean(body.lastName) || null

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('users')
    .update({
      first_name: firstName,
      last_name: lastName,
      address_line1: line1,
      address_line2: line2,
      address_city: city,
      address_county: county,
      address_postal_code: postalCode,
      address_country: 'GB',
    })
    .eq('id', user.id)

  if (error) {
    console.error('[account-address] Failed to update address for', user.id, error.message)
    return NextResponse.json({ error: 'Could not save address.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
