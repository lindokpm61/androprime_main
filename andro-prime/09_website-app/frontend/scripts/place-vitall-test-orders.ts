/**
 * Places LIVE Vitall test orders for the end-to-end run (ClickUp 869d99m1k).
 *
 * Ben Starling (2026-06-16): "Place the orders via the API and let me know and we
 * will advance them through the different stages (you can't do this). We won't
 * fulfil or bill anything and I'll attach some dummy results."
 *
 * So this script:
 *   1. Seeds a throwaway test user + kit_order (status 'paid') in the TARGET DB,
 *   2. Calls the real Vitall /order/create (production unless VITALL_SANDBOX=true),
 *   3. Stores the returned vitall_order_id and flips the order to 'dispatched'
 *      (exactly what app/api/vitall/dispatch/route.ts does in production),
 *   4. Prints the partner_order_id (our id) + vitall_order_id for each, plus a
 *      paste-ready block for the email to Ben.
 *
 * These are REAL orders on Vitall production. They are not fulfilled or billed
 * (Ben advances them manually), but they exist on Vitall's side, so run this
 * deliberately. Test rows use the email prefix `vitall-live-test+` and are left
 * in place (Ben needs them to persist while he advances them). Clean up AFTER the
 * run with:  npx tsx scripts/place-vitall-test-orders.ts --cleanup
 *
 * Env (from .env.local): VITALL_CLIENT_ID, VITALL_CLIENT_SECRET, (VITALL_SANDBOX),
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 *
 * Run from andro-prime/09_website-app/frontend:
 *   npx tsx scripts/place-vitall-test-orders.ts
 *   npx tsx scripts/place-vitall-test-orders.ts --cleanup
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import type { KitType } from '@/lib/results/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const admin = createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const EMAIL_PREFIX = 'vitall-live-test+'

// Kit → Vitall shortCode (Ben Starling 2026-05-08), mirrors app/api/vitall/dispatch/route.ts.
const KIT_TEST_CODES: Record<KitType, string[]> = {
  testosterone: ['andro-prime-hormone-check'],
  'energy-recovery': ['andro-prime-energy-metabolism'],
  'hormone-recovery': ['andro-prime-combo-test'],
}

// The batch: one happy-path order per kit + one extra (kit1) earmarked for the
// sample-issue failure-path test.
interface OrderSpec {
  label: string
  kitType: KitType
  purpose: 'happy-path → results-available' | 'failure-path → sample-issue'
}
const ORDER_SPECS: OrderSpec[] = [
  { label: 'kit1', kitType: 'testosterone', purpose: 'happy-path → results-available' },
  { label: 'kit2', kitType: 'energy-recovery', purpose: 'happy-path → results-available' },
  { label: 'kit3', kitType: 'hormone-recovery', purpose: 'happy-path → results-available' },
  { label: 'kit1-fail', kitType: 'testosterone', purpose: 'failure-path → sample-issue' },
]

async function cleanup() {
  const { data } = await admin.auth.admin.listUsers()
  const users = (data?.users ?? []).filter((u) => (u.email ?? '').startsWith(EMAIL_PREFIX))
  let orders = 0
  for (const u of users) {
    const { data: os } = await admin.from('kit_orders').select('id').eq('user_id', u.id)
    const ids = (os ?? []).map((o) => o.id)
    if (ids.length) {
      const { data: lrs } = await admin.from('lab_results').select('id').in('order_id', ids)
      const lrIds = (lrs ?? []).map((r) => r.id)
      if (lrIds.length) await admin.from('biomarker_values').delete().in('result_id', lrIds)
      await admin.from('lab_results').delete().in('order_id', ids)
      await admin.from('kit_orders').delete().in('id', ids)
      orders += ids.length
    }
    await admin.from('users').delete().eq('id', u.id)
    await admin.auth.admin.deleteUser(u.id)
  }
  console.log(`Cleanup: removed ${users.length} test user(s), ${orders} order(s).`)
}

async function seedUser(email: string): Promise<string> {
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: 'vitall-live-test-not-used',
  })
  if (error || !created.user) throw new Error(`createUser failed: ${error?.message}`)
  const userId = created.user.id
  const { error: ue } = await admin.from('users').upsert(
    {
      id: userId,
      email,
      age: 41,
      marketing_consent: false,
      first_name: 'Andro',
      last_name: 'Tester',
      phone: '07000000000',
      date_of_birth: '1990-01-15',
      sex: 'male',
      address_line1: '1 Test Street',
      address_city: 'London',
      address_postal_code: 'EC1A 1BB',
      address_country: 'GB',
    },
    { onConflict: 'id' },
  )
  if (ue) throw new Error(`users upsert failed: ${ue.message}`)
  return userId
}

async function main() {
  if (process.argv.includes('--cleanup')) {
    await cleanup()
    return
  }

  if (!process.env.VITALL_CLIENT_ID || !process.env.VITALL_CLIENT_SECRET) {
    console.error('Missing VITALL_CLIENT_ID / VITALL_CLIENT_SECRET in .env.local')
    process.exit(1)
  }
  // Dynamic import AFTER dotenv so the client's module-level BASE_URL reads the
  // right VITALL_SANDBOX value.
  const { createOrder } = await import('@/lib/vitall/client')
  const sandbox = process.env.VITALL_SANDBOX === 'true'

  console.log(`\nPlacing ${ORDER_SPECS.length} LIVE Vitall test orders`)
  console.log(`  Vitall env : ${sandbox ? 'SANDBOX (vitallsync.com)' : 'PRODUCTION (vitall.co.uk)'}`)
  console.log(`  DB         : ${SUPABASE_URL}\n`)

  const placed: Array<{ label: string; kitType: string; purpose: string; partnerOrderId: string; vitallOrderId: string }> = []

  for (const spec of ORDER_SPECS) {
    const email = `${EMAIL_PREFIX}${spec.label}@androprime.test`
    try {
      const userId = await seedUser(email)
      const { data: order, error: oe } = await admin
        .from('kit_orders')
        .insert({ user_id: userId, kit_type: spec.kitType, status: 'paid' })
        .select('id')
        .single()
      if (oe || !order) throw new Error(`kit_orders insert failed: ${oe?.message}`)

      const res = await createOrder({
        partnerOrderId: order.id,
        collection: 'self-collection',
        tests: KIT_TEST_CODES[spec.kitType],
        patient: {
          partnerUserId: userId,
          email,
          firstName: 'Andro',
          lastName: 'Tester',
          sex: 'male',
          birthDate: '1990-01-15',
          phone: '07000000000',
          address: { line1: '1 Test Street', city: 'London', county: '', postCode: 'EC1A 1BB' },
        },
      })
      const vitallOrderId = res.order.orderId

      await admin
        .from('kit_orders')
        .update({ status: 'dispatched', vitall_order_id: vitallOrderId })
        .eq('id', order.id)

      placed.push({
        label: spec.label,
        kitType: spec.kitType,
        purpose: spec.purpose,
        partnerOrderId: order.id,
        vitallOrderId,
      })
      console.log(`  ✓ ${spec.label.padEnd(10)} ${spec.kitType.padEnd(16)} partner=${order.id}  vitall=${vitallOrderId}`)
    } catch (err) {
      console.error(`  ✗ ${spec.label} FAILED: ${err instanceof Error ? err.message : err}`)
    }
  }

  if (placed.length) {
    console.log('\n── Paste-ready block for Ben ──────────────────────────────────')
    for (const p of placed) {
      console.log(`${p.purpose === 'failure-path → sample-issue' ? '[SAMPLE-ISSUE]' : '[advance to results]'}  ${p.kitType}  Vitall order ${p.vitallOrderId}  (our ref ${p.partnerOrderId})`)
    }
    console.log('───────────────────────────────────────────────────────────────')
    console.log('\nAfter the test, remove these rows: npx tsx scripts/place-vitall-test-orders.ts --cleanup')
  }
}

main().catch((err) => {
  console.error('\nScript crashed:', err)
  process.exit(1)
})
