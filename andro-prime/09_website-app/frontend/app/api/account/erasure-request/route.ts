import { type NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { emitOpsAlert } from '@/lib/customerio/emit'
import { isAccountDataControlsEnabled } from '@/lib/flags'

// POST /api/account/erasure-request
//
// Records an erasure REQUEST. It does NOT delete anything.
//
// Automated deletion is deliberately not built here: the retention/deletion
// policy (03_compliance/deletion-policy/) does not exist yet, and an automated
// cascade would have to invent retention rules that are legal decisions, not
// engineering ones -
//   - UK tax law requires proof-of-purchase records be kept for 6 years;
//   - Vitall holds an independent-controller copy of the lab record we cannot
//     compel to delete (05_partners/labs/vitall/CONTEXT.md);
//   - Stripe and Customer.io hold their own records keyed on email.
//
// So the request reaches ops via the same alert channel the lab-cancel flow
// uses (emitOpsAlert → internal ops profile), and a human actions it within the
// UK GDPR 30-day window. When the retention policy is written and signed off,
// the automated cascade can replace this. Gated behind
// ACCOUNT_DATA_CONTROLS_ENABLED; 404 when OFF.
export async function POST(request: NextRequest) {
  if (!isAccountDataControlsEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const userOrResponse = await requireAuthenticatedApiUser(request)
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  await emitOpsAlert({
    name: 'account_erasure_requested',
    data: {
      user_id: user.id,
      email: user.email ?? '',
      requested_at: new Date().toISOString(),
    },
  })

  return NextResponse.json({ ok: true })
}
