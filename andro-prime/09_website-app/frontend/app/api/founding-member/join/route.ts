import { NextResponse } from 'next/server'

// DISABLED 2026-06-04 (low-T routing decision). The founding-member opt-in is
// taken down pending a lawful basis for storing low-T results + nurture
// (Art 6(1)(a) + 9(2)(a), solicitor task 869d99kzh). This route accepted public
// opt-ins into `founding_member_list`; it now returns 410 Gone. To re-enable,
// restore the implementation preserved in the block comment below and revert the
// public surfaces (homepage section, nav link, /founding-member page, account
// link). See 04_products/results-engine/2026-06-04-low-t-routing-decision.md §6.
export async function POST() {
  return NextResponse.json(
    { error: 'The founding-member list is not currently open.' },
    { status: 410 },
  )
}

/* ORIGINAL IMPLEMENTATION — restore to re-open the list
import { NextRequest } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth/session'
import { emitEvent } from '@/lib/customerio/emit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface JoinBody {
  email?: string
  firstName?: string
  lastName?: string
  source?: string
}

export async function POST(request: NextRequest) {
  let body: JoinBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  const firstName = body.firstName?.trim() || null
  const lastName = body.lastName?.trim() || null
  const source = (body.source?.trim() || 'public_form').slice(0, 64)

  const user = await getCurrentUser()
  const userId = user?.id ?? null

  const supabase = createSupabaseAdminClient()

  // Idempotency: if there's already an active listing for this email, return success.
  const { data: existing, error: existingError } = await supabase
    .from('founding_member_list')
    .select('id, user_id')
    .ilike('email', email)
    .is('unlisted_at', null)
    .limit(1)
    .maybeSingle()

  if (existingError) {
    console.error('[founding-member/join] Lookup failed:', existingError.message)
    // Fall through and try insert anyway.
  }

  if (existing) {
    return NextResponse.json({ ok: true, alreadyListed: true })
  }

  const { data: inserted, error: insertError } = await supabase
    .from('founding_member_list')
    .insert({
      user_id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      source,
    })
    .select('id')
    .single()

  if (insertError) {
    // Handle race condition: a duplicate may have been inserted concurrently.
    if (/duplicate key|already exists/i.test(insertError.message)) {
      return NextResponse.json({ ok: true, alreadyListed: true })
    }
    console.error('[founding-member/join] Insert failed:', insertError.message)
    return NextResponse.json({ error: 'Could not add to list' }, { status: 500 })
  }

  // Fire Customer.io event. If the user is authed, key on user id; otherwise
  // key on the email so an anonymous opt-in is still trackable.
  const cioId = userId ?? email
  await emitEvent(cioId, {
    name: 'founding_member_listed',
    data: {
      email,
      source,
      has_account: Boolean(userId),
    },
  })

  return NextResponse.json({ ok: true, alreadyListed: false, id: inserted?.id })
}
*/
