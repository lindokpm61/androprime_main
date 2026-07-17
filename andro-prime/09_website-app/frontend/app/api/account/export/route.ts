import { type NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedApiUser } from '@/lib/auth/session'
import { getDashboardData } from '@/lib/results/getDashboardData'
import { resultsToCsv } from '@/lib/account/exportResults'
import { isAccountDataControlsEnabled } from '@/lib/flags'

// GET /api/account/export?format=csv
// Returns the authenticated user's own results as a downloadable file. Read-only
// (no writes, no deletion). Gated behind ACCOUNT_DATA_CONTROLS_ENABLED so the
// whole Data & Privacy surface ships as one reviewed unit; 404 when OFF.
export async function GET(request: NextRequest) {
  if (!isAccountDataControlsEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const userOrResponse = await requireAuthenticatedApiUser(request)
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  const data = await getDashboardData(user.id)
  const csv = resultsToCsv(data)
  const stamp = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="andro-prime-results-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
