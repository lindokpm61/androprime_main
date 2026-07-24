// Ops: cancel a banked/owed second kit (refund-on-request path).
//
// Support runs this AFTER issuing the manual £70 Stripe refund of the second-
// test portion, to stop the banked/owed kit from ever shipping. It flips a
// bundle_dispatches row to 'cancelled' — only from a NON-dispatched state (a kit
// already dispatched cannot be un-shipped; that is a separate manual decision).
// Prints the row before and after so the operator can confirm the right one.
//
// Usage: npx tsx scripts/ops/cancel-bundle.ts <bundle_dispatch_id>

import { createSupabaseAdminClient } from '@/lib/supabase/admin'

// A dispatched kit is already in the post; a cancelled row is a no-op.
const NON_CANCELLABLE = ['dispatched', 'cancelled']

async function main(): Promise<void> {
  const id = process.argv[2]
  if (!id) {
    console.error('Usage: npx tsx scripts/ops/cancel-bundle.ts <bundle_dispatch_id>')
    process.exit(1)
  }

  const supabase = createSupabaseAdminClient()

  const { data: before, error: readError } = await supabase
    .from('bundle_dispatches')
    .select('*')
    .eq('id', id)
    .single()

  if (readError || !before) {
    console.error(`No bundle_dispatches row with id ${id}:`, readError?.message ?? 'not found')
    process.exit(1)
  }

  console.log('Before:', JSON.stringify(before, null, 2))

  if (NON_CANCELLABLE.includes(before.status)) {
    console.error(
      `\nRefusing to cancel: row is '${before.status}'. Only a non-dispatched, non-cancelled row can be cancelled.`,
    )
    process.exit(1)
  }

  // Guard the update on the status we just read so a concurrent sweep that moved
  // the row (e.g. into 'dispatched') is not silently overwritten.
  const { data: after, error: updateError } = await supabase
    .from('bundle_dispatches')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('status', before.status)
    .select('*')
    .single()

  if (updateError || !after) {
    console.error('Failed to cancel row (it may have changed status concurrently):', updateError?.message ?? 'no row updated')
    process.exit(1)
  }

  console.log('\nAfter:', JSON.stringify(after, null, 2))
  console.log(`\nBundle ${id} cancelled (was '${before.status}'). The sweep will never dispatch it.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
