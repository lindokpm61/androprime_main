/**
 * Local end-to-end simulation of the Vitall inbound flow (ClickUp task 12).
 *
 * Proves OUR code, with zero calls to Vitall, against a LOCAL Supabase:
 *   seed user + kit_order
 *     → webhook status walk (order-placed → kit-sent → sample-received
 *       → tests-analysis → results-available), asserting kit_orders.status
 *     → results processing via processVitallResult (the QStash job's core),
 *       asserting lab_results + biomarker_values + classify() (the dashboard path)
 *     → failed-sample cases: 'sample-issue' status + an all-null results payload
 *   for each kit type (kit1/kit2/kit3).
 *
 * It does NOT exercise the outbound /order/create half — that fires a real order
 * at Vitall production and is gated on confirming "don't fulfil orders" mode.
 *
 * Two modes:
 *   SIM (default) — drives our code in-process, simulating the QStash hop. Proves
 *     today's (possibly uncommitted) code synchronously. Scoped to e2e+*@androprime.test.
 *   --real-qstash — POSTs signed webhooks over HTTP to the DEPLOYED site, letting
 *     the deployed webhook → real QStash → deployed job run, then polls the DB.
 *     Tests the genuine queue hop on DEPLOYED code. Run AFTER deploy.
 *
 * ── SIM run (PowerShell) ──────────────────────────────────────────────────────
 *   Against this repo's local stack (project_id "09_website-app"):
 *     npm run db:start ; npm run db:status   # copy API URL + service_role key
 *     $env:E2E_SUPABASE_URL = "http://127.0.0.1:54321"
 *     $env:E2E_SUPABASE_SERVICE_KEY = "<service_role key>"
 *     npx tsx scripts/e2e-vitall-local.ts
 *   Against the remote project: set E2E_SUPABASE_URL/KEY from .env.local and add
 *     --force-remote (sim refuses a non-local DB without it).
 *
 * ── REAL-QSTASH run (post-deploy) ─────────────────────────────────────────────
 *     $env:E2E_SUPABASE_URL / E2E_SUPABASE_SERVICE_KEY = the deployment's DB
 *     $env:E2E_SITE_URL = "https://<deployment>"     # public; QStash can't reach localhost
 *     $env:E2E_WEBHOOK_SECRET = "<deployed VITALL_WEBHOOK_SECRET>"
 *     npx tsx scripts/e2e-vitall-local.ts --real-qstash
 */

import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'
import type { Database } from '@/lib/supabase/types'
import type { KitType, NormalisedBiomarker } from '@/lib/results/types'
import type { VitallRawPanel, VitallOrderStatusCode } from '@/lib/vitall/types'

// ── Modes ─────────────────────────────────────────────────────────────────────
// Default: SIM — drives our code in-process, simulating the QStash hop. Validates
//   today's (possibly uncommitted) code synchronously. Safe against any DB.
// --real-qstash — POSTs signed webhooks over HTTP to the DEPLOYED site, letting the
//   deployed webhook → real QStash → deployed job run for real, then POLLS the DB
//   for the row. Tests the genuine queue hop on DEPLOYED code. Run AFTER deploy.
const REAL_QSTASH = process.argv.includes('--real-qstash')

const SUPABASE_URL = process.env.E2E_SUPABASE_URL ?? ''
const SERVICE_KEY = process.env.E2E_SUPABASE_SERVICE_KEY ?? ''
const FORCE_REMOTE = process.argv.includes('--force-remote')

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    'Missing E2E_SUPABASE_URL and/or E2E_SUPABASE_SERVICE_KEY.\n' +
      'Get them from `npm run db:status` (local) or .env.local (remote) and export them.',
  )
  process.exit(1)
}

const admin = createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

if (REAL_QSTASH) {
  // ── Real-QStash config ──────────────────────────────────────────────────────
  // The deployed webhook verifies with the deployed VITALL_WEBHOOK_SECRET, so we
  // must sign with that exact value (NOT the sim test secret). QStash delivers to
  // the deployment's own NEXT_PUBLIC_SITE_URL, so the SITE_URL we POST to must be
  // the public deployment — localhost is unreachable from QStash's servers.
  const SITE_URL = (process.env.E2E_SITE_URL ?? '').replace(/\/$/, '')
  const REAL_SECRET = process.env.E2E_WEBHOOK_SECRET ?? ''
  if (!SITE_URL || /localhost|127\.0\.0\.1/.test(SITE_URL)) {
    console.error(
      '--real-qstash needs E2E_SITE_URL set to the PUBLIC deployment URL ' +
        '(QStash cannot reach localhost).',
    )
    process.exit(1)
  }
  if (!REAL_SECRET) {
    console.error('--real-qstash needs E2E_WEBHOOK_SECRET = the deployed VITALL_WEBHOOK_SECRET.')
    process.exit(1)
  }
} else {
  // ── Sim config ──────────────────────────────────────────────────────────────
  const IS_LOCAL = /^(https?:\/\/)?(127\.0\.0\.1|localhost|\[::1\])(:\d+)?/.test(SUPABASE_URL)
  if (!IS_LOCAL && !FORCE_REMOTE) {
    console.error(
      `Refusing to run: E2E_SUPABASE_URL (${SUPABASE_URL}) is not local.\n` +
        'This harness seeds + deletes rows. Point it at local Supabase, or pass ' +
        '--force-remote if you really mean it.',
    )
    process.exit(1)
  }

  // Override env BEFORE importing route handlers so their internal
  // createSupabaseAdminClient() / secret reads resolve to our target DB, and so
  // CIO emits are skipped (no creds → emit.ts early-returns).
  process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = SERVICE_KEY
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY
  process.env.VITALL_WEBHOOK_SECRET = process.env.E2E_WEBHOOK_SECRET ?? 'e2e-test-secret'
  delete process.env.CUSTOMERIO_SITE_ID
  delete process.env.CUSTOMERIO_API_KEY
  delete process.env.QSTASH_TOKEN // force the webhook's enqueue boundary to be deterministic
}

const WEBHOOK_SECRET = REAL_QSTASH
  ? (process.env.E2E_WEBHOOK_SECRET as string)
  : (process.env.VITALL_WEBHOOK_SECRET as string)
const SITE_URL = (process.env.E2E_SITE_URL ?? '').replace(/\/$/, '')

// ── Assertions / reporting ───────────────────────────────────────────────────
let passed = 0
let failed = 0
function check(label: string, cond: boolean, detail = '') {
  if (cond) {
    passed++
    console.log(`  ✓ ${label}`)
  } else {
    failed++
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

// ── Kit fixtures ─────────────────────────────────────────────────────────────
interface KitFixture {
  arg: string
  kitType: KitType
  age: number
  panels: VitallRawPanel[]
}

const row = (
  code: string,
  name: string,
  result: string,
  units: string,
  reference: string,
  flag = '',
) => ({ code, name, name_simple: name, result, units, reference, flag, note: '', comment: '', created_at: '' })

const KITS: KitFixture[] = [
  {
    arg: 'kit1',
    kitType: 'testosterone',
    age: 41,
    panels: [
      {
        panel_code: 'testosterone-panel',
        panel_name: 'Testosterone Panel',
        results: [
          row('TT', 'Total Testosterone', '11.2', 'nmol/L', '8.6 - 29.0', 'L'),
          row('SHBG', 'SHBG', '32.0', 'nmol/L', '18 - 54'),
          row('FT', 'Free Testosterone', '0.21', 'nmol/L', '0.2 - 0.62'),
          row('ALB', 'Albumin', '43.0', 'g/L', '35 - 50'),
          row('FAI', 'Free Androgen Index', '35.0', '%', '24 - 104'),
        ],
      },
    ],
  },
  {
    arg: 'kit2',
    kitType: 'energy-recovery',
    age: 38,
    panels: [
      {
        panel_code: 'energy-panel',
        panel_name: 'Energy & Recovery Panel',
        results: [
          row('VD', 'Vitamin D', '32.0', 'nmol/L', '75 - 200', 'L'),
          row('HSCRP', 'hs-CRP', '1.8', 'mg/L', '<1.0', 'H'),
          row('FERR', 'Ferritin', '24.0', 'ug/L', '30 - 400', 'L'),
          row('AB12', 'Holotranscobalamin', '41.0', 'pmol/L', '37.5 - 188'),
        ],
      },
    ],
  },
  {
    arg: 'kit3',
    kitType: 'hormone-recovery',
    age: 45,
    panels: [
      {
        panel_code: 'testosterone-panel',
        panel_name: 'Testosterone Panel',
        results: [row('TT', 'Total Testosterone', '18.4', 'nmol/L', '8.6 - 29.0')],
      },
      {
        panel_code: 'energy-panel',
        panel_name: 'Energy & Recovery Panel',
        results: [
          row('VD', 'Vitamin D', '85.0', 'nmol/L', '75 - 200'),
          row('FERR', 'Ferritin', '68.0', 'ug/L', '30 - 400'),
        ],
      },
    ],
  },
]

// Vitall status code → expected kit_orders.status after the webhook fires
const EXPECTED_STATUS: Record<string, string> = {
  'order-placed': 'dispatched',
  'kit-sent': 'dispatched',
  'sample-received': 'sample_registered',
  'tests-analysis': 'processing',
}
const WALK: VitallOrderStatusCode[] = ['order-placed', 'kit-sent', 'sample-received', 'tests-analysis']

let seq = 0
function makePayload(
  orderId: string,
  userId: string,
  email: string,
  statusCode: VitallOrderStatusCode,
  panels: VitallRawPanel[] | null,
) {
  seq++
  return {
    vitall_order_id: `vitall-e2e-${seq}`,
    partner: 'andro-prime',
    partner_order_id: orderId,
    partner_user_id: userId,
    laboratory_order_id: `lab-e2e-${seq}`,
    order_status: { code: statusCode, name: statusCode },
    comment: '',
    warning: '',
    user: { sex: 'male', email, firstname: 'E2E', surname: 'Test', dob: '1990/01/15', phone: '' },
    tests: [],
    collection: 'self-collection',
    results: statusCode === 'results-available' && panels ? panels : '[]',
    results_pdf: '',
    results_html: '',
  }
}

// ── Seed / cleanup helpers ───────────────────────────────────────────────────
async function cleanupUser(email: string) {
  const { data } = await admin.auth.admin.listUsers()
  const u = data?.users.find((x) => x.email === email)
  if (!u) return
  const { data: orders } = await admin.from('kit_orders').select('id').eq('user_id', u.id)
  const orderIds = (orders ?? []).map((o) => o.id)
  if (orderIds.length) {
    const { data: lrs } = await admin.from('lab_results').select('id').in('order_id', orderIds)
    const lrIds = (lrs ?? []).map((r) => r.id)
    if (lrIds.length) await admin.from('biomarker_values').delete().in('result_id', lrIds)
    await admin.from('lab_results').delete().in('order_id', orderIds)
    await admin.from('kit_orders').delete().in('id', orderIds)
  }
  await admin.from('users').delete().eq('id', u.id)
  await admin.auth.admin.deleteUser(u.id)
}

async function seedUser(email: string, age: number): Promise<string> {
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: 'e2e-not-used',
  })
  if (error || !created.user) throw new Error(`createUser failed: ${error?.message}`)
  const userId = created.user.id
  const { error: ue } = await admin.from('users').upsert(
    {
      id: userId,
      email,
      age,
      marketing_consent: false,
      first_name: 'E2E',
      last_name: 'Test',
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

async function seedOrder(userId: string, kitType: KitType): Promise<string> {
  const { data, error } = await admin
    .from('kit_orders')
    .insert({ user_id: userId, kit_type: kitType, status: 'paid' })
    .select('id')
    .single()
  if (error || !data) throw new Error(`kit_orders insert failed: ${error?.message}`)
  return data.id
}

async function orderStatus(orderId: string): Promise<string | null> {
  const { data } = await admin.from('kit_orders').select('status, vitall_order_id').eq('id', orderId).single()
  return data?.status ?? null
}

// ── SIM driver: in-process, QStash simulated ─────────────────────────────────
async function runSim() {
  // Imported AFTER env override so they bind to the sim target.
  const { POST: webhookPost } = await import('@/app/api/webhooks/vitall/route')
  const { processVitallResult } = await import('@/lib/results/processResult')
  const { classify } = await import('@/lib/results/classifier')
  const { NextRequest } = await import('next/server')

  function signedRequest(payload: unknown) {
    const body = JSON.stringify(payload)
    const signature = createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
    return new NextRequest('http://localhost/api/webhooks/vitall', {
      method: 'POST',
      headers: { 'content-type': 'application/json', signature },
      body,
    })
  }

  console.log(`\nVitall local E2E → ${SUPABASE_URL}\n`)

  for (const kit of KITS) {
    const email = `e2e+${kit.arg}@androprime.test`
    console.log(`── ${kit.arg} (${kit.kitType}) ──`)
    await cleanupUser(email)
    const userId = await seedUser(email, kit.age)
    const orderId = await seedOrder(userId, kit.kitType)

    // 1. Status walk through the real webhook handler (signed)
    for (const code of WALK) {
      const res = await webhookPost(signedRequest(makePayload(orderId, userId, email, code, null)))
      const status = await orderStatus(orderId)
      check(
        `webhook ${code} → kit_orders.status = ${EXPECTED_STATUS[code]}`,
        res.status === 202 && status === EXPECTED_STATUS[code],
        `got http ${res.status}, status "${status}"`,
      )
    }

    // 2. results-available through the webhook: it sets status=results_received,
    //    then hits the enqueue boundary. QSTASH_TOKEN is unset, so the handler
    //    returns 500 "Queue not configured" — the QStash hop is simulated below.
    const resultsPayload = makePayload(orderId, userId, email, 'results-available', kit.panels)
    const whRes = await webhookPost(signedRequest(resultsPayload))
    const whBody = (await whRes.json()) as { error?: string }
    check(
      'webhook results-available → status=results_received (enqueue boundary reached)',
      (await orderStatus(orderId)) === 'results_received' &&
        whRes.status === 500 &&
        whBody.error === 'Queue not configured',
      `got http ${whRes.status}, body ${JSON.stringify(whBody)}`,
    )

    // 3. The QStash job's core, driven directly (this is what process-result runs)
    const outcome = await processVitallResult(resultsPayload as never, admin as never)
    check(
      'processVitallResult → 200 received',
      outcome.status === 200 && outcome.body.received === true,
      `got ${outcome.status} ${JSON.stringify(outcome.body)}`,
    )

    // 4. Idempotency: a second run must skip
    const repeat = await processVitallResult(resultsPayload as never, admin as never)
    check('processVitallResult is idempotent', repeat.body.skipped === true)

    // 5. Biomarkers persisted + dashboard classify() produces markers
    const { data: lr } = await admin.from('lab_results').select('id').eq('order_id', orderId).single()
    const { data: bvs } = await admin
      .from('biomarker_values')
      .select('marker_name, value, unit, reference_low, reference_high')
      .eq('result_id', lr?.id ?? '')
    const expectedCount = kit.panels.reduce((n, p) => n + p.results.length, 0)
    check(
      `biomarker_values rows persisted (${bvs?.length ?? 0})`,
      (bvs?.length ?? 0) > 0 && (bvs?.length ?? 0) <= expectedCount,
    )

    const biomarkers: NormalisedBiomarker[] = (bvs ?? []).map((b) => ({
      markerName: b.marker_name,
      value: b.value,
      unit: b.unit,
      referenceLow: b.reference_low,
      referenceHigh: b.reference_high,
    }))
    const markers = classify({
      kitType: kit.kitType,
      biomarkers,
      symptomAnswers: [],
      qualifierResponses: [],
      userAge: kit.age,
    })
    check(`dashboard classify() yields ${markers.length} markers`, markers.length > 0)

    await cleanupUser(email)
  }

  // ── Failed-sample cases (own user, kit1) ─────────────────────────────────────
  console.log('── failed-sample handling ──')
  const failEmail = 'e2e+fail@androprime.test'
  await cleanupUser(failEmail)
  const failUser = await seedUser(failEmail, 40)
  const failOrder = await seedOrder(failUser, 'testosterone')

  // 6. Top-level 'sample-issue' status: graceful 202, status unchanged, no crash
  await webhookPost(signedRequest(makePayload(failOrder, failUser, failEmail, 'sample-received', null)))
  const beforeStatus = await orderStatus(failOrder)
  const siRes = await webhookPost(signedRequest(makePayload(failOrder, failUser, failEmail, 'sample-issue', null)))
  const siBody = (await siRes.json()) as { sampleIssue?: boolean }
  check(
    "webhook 'sample-issue' → 202 sampleIssue, status unchanged",
    siRes.status === 202 && siBody.sampleIssue === true && (await orderStatus(failOrder)) === beforeStatus,
    `got http ${siRes.status}, body ${JSON.stringify(siBody)}, status ${await orderStatus(failOrder)}`,
  )

  // 7. results-available carrying only null markers (per-marker failure):
  //    raw payload persisted, no biomarkers, graceful sampleIssue (not a 422/500)
  const nullPanels: VitallRawPanel[] = [
    {
      panel_code: 'testosterone-panel',
      panel_name: 'Testosterone Panel',
      results: [row('TT', 'Total Testosterone', '', 'nmol/L', '8.6 - 29.0')],
    },
  ]
  const nullPayload = makePayload(failOrder, failUser, failEmail, 'results-available', nullPanels)
  const nullOutcome = await processVitallResult(nullPayload as never, admin as never)
  const { data: failLr } = await admin.from('lab_results').select('id').eq('order_id', failOrder).single()
  const { data: failBvs } = await admin.from('biomarker_values').select('id').eq('result_id', failLr?.id ?? '')
  check(
    'all-null results → 200 sampleIssue, raw persisted, no biomarkers',
    nullOutcome.status === 200 &&
      nullOutcome.body.sampleIssue === true &&
      !!failLr?.id &&
      (failBvs?.length ?? 0) === 0,
    `got ${nullOutcome.status} ${JSON.stringify(nullOutcome.body)}`,
  )

  await cleanupUser(failEmail)
}

// ── REAL-QSTASH driver: HTTP → deployed webhook → real QStash → deployed job ──
// Tests the genuine queue hop against DEPLOYED code. We only seed + observe the
// DB here; processing happens on the deployment, asynchronously, so we poll.
async function runRealQstash() {
  async function postWebhook(payload: unknown): Promise<number> {
    const body = JSON.stringify(payload)
    const signature = createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
    const res = await fetch(`${SITE_URL}/api/webhooks/vitall`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Signature: signature },
      body,
    })
    return res.status
  }

  // Poll lab_results for the order until a row appears (QStash delivered + job ran)
  async function waitForResult(orderId: string, timeoutMs = 90_000): Promise<string | null> {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      const { data } = await admin.from('lab_results').select('id').eq('order_id', orderId).limit(1).maybeSingle()
      if (data?.id) return data.id
      await new Promise((r) => setTimeout(r, 3000))
    }
    return null
  }

  console.log(`\nVitall REAL-QSTASH E2E → webhook ${SITE_URL} | db ${SUPABASE_URL}\n`)

  for (const kit of KITS) {
    const email = `e2e+${kit.arg}@androprime.test`
    console.log(`── ${kit.arg} (${kit.kitType}) ──`)
    await cleanupUser(email)
    const userId = await seedUser(email, kit.age)
    const orderId = await seedOrder(userId, kit.kitType)

    // Status walk over HTTP — deployed webhook writes status before responding
    for (const code of WALK) {
      const status = await postWebhook(makePayload(orderId, userId, email, code, null))
      check(
        `POST webhook ${code} → 202, kit_orders.status = ${EXPECTED_STATUS[code]}`,
        status === 202 && (await orderStatus(orderId)) === EXPECTED_STATUS[code],
        `http ${status}, status "${await orderStatus(orderId)}"`,
      )
    }

    // results-available → deployed webhook enqueues to REAL QStash → deployed job
    const httpStatus = await postWebhook(makePayload(orderId, userId, email, 'results-available', kit.panels))
    check('POST webhook results-available → 202 (enqueued to QStash)', httpStatus === 202, `http ${httpStatus}`)

    const resultId = await waitForResult(orderId)
    check('QStash delivered → lab_results row appeared', !!resultId)

    if (resultId) {
      // lab_results and biomarker_values are inserted non-atomically by the job,
      // so poll briefly for the biomarker rows rather than reading once.
      const expectedCount = kit.panels.reduce((n, p) => n + p.results.length, 0)
      let count = 0
      for (let i = 0; i < 6; i++) {
        const { data: bvs } = await admin.from('biomarker_values').select('id').eq('result_id', resultId)
        count = bvs?.length ?? 0
        if (count > 0) break
        await new Promise((r) => setTimeout(r, 2500))
      }
      check(
        `biomarker_values persisted via deployed job (${count})`,
        count > 0 && count <= expectedCount,
      )
    }

    await cleanupUser(email)
  }
}

// ── Dispatch ─────────────────────────────────────────────────────────────────
async function main() {
  if (REAL_QSTASH) await runRealQstash()
  else await runSim()
  console.log(`\n${failed === 0 ? '✅ PASS' : '❌ FAIL'} — ${passed} passed, ${failed} failed\n`)
  process.exit(failed === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('\nHarness crashed:', err)
  process.exit(1)
})
