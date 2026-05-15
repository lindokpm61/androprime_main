/**
 * Sends a signed mock Vitall webhook payload to the local endpoint.
 * Usage: npx tsx scripts/test-vitall-webhook.ts [kit1|kit2|kit3]
 *
 * Requires:
 *   VITALL_WEBHOOK_SECRET in .env.local (currently set to client secret for testing)
 *   Dev server running on http://localhost:3000
 *   A valid kit_orders.id to use as partner_order_id (update below)
 */

import { createHmac } from 'crypto'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const WEBHOOK_SECRET = process.env.VITALL_WEBHOOK_SECRET!
const ENDPOINT = 'http://localhost:3000/api/webhooks/vitall'

// ── swap this for a real kit_orders.id from your DB ──────────────────────────
const PARTNER_ORDER_ID = 'df8f6db8-199e-43f8-ba84-91d86ff33023'
const PARTNER_USER_ID  = 'ef26f29f-f5f6-4025-8261-02b0924c0a14'
// ─────────────────────────────────────────────────────────────────────────────

const kitArg = process.argv[2] ?? 'kit1'

const KIT_PAYLOADS: Record<string, object> = {
  kit1: [
    {
      panel_code: 'testosterone-panel',
      panel_name: 'Testosterone Panel',
      results: [
        { code: 'TT',   name: 'Total Testosterone', name_simple: 'Testosterone',       result: '11.2', units: 'nmol/L', reference: '8.6 - 29.0', flag: 'L', note: '', comment: '' },
        { code: 'SHBG', name: 'SHBG',               name_simple: 'SHBG',               result: '32.0', units: 'nmol/L', reference: '18 - 54',    flag: '',  note: '', comment: '' },
        { code: 'FT',   name: 'Free Testosterone',  name_simple: 'Free Testosterone',  result: '0.21', units: 'nmol/L', reference: '0.2 - 0.62', flag: '',  note: '', comment: '' },
        { code: 'ALB',  name: 'Albumin',             name_simple: 'Albumin',            result: '43.0', units: 'g/L',    reference: '35 - 50',    flag: '',  note: '', comment: '' },
        { code: 'FAI',  name: 'Free Androgen Index', name_simple: 'Free Androgen Index',result: '35.0', units: '%',     reference: '24 - 104',   flag: '',  note: '', comment: '' },
      ],
    },
  ],
  kit2: [
    {
      panel_code: 'energy-panel',
      panel_name: 'Energy & Recovery Panel',
      results: [
        { code: 'VD',      name: 'Vitamin D',           name_simple: 'Vitamin D',  result: '32.0',  units: 'nmol/L', reference: '75 - 200',  flag: 'L', note: '', comment: '' },
        { code: 'HSCRP',   name: 'hs-CRP',              name_simple: 'hs-CRP',     result: '1.8',   units: 'mg/L',   reference: '<1.0',      flag: 'H', note: '', comment: '' },
        { code: 'FERR',    name: 'Ferritin',             name_simple: 'Ferritin',   result: '24.0',  units: 'ug/L',   reference: '30 - 400',  flag: 'L', note: '', comment: '' },
        { code: 'AB12',    name: 'Holotranscobalamin',   name_simple: 'Active B12', result: '41.0',  units: 'pmol/L', reference: '37.5 - 188',flag: '',  note: '', comment: '' },
      ],
    },
  ],
  kit3: [
    {
      panel_code: 'testosterone-panel',
      panel_name: 'Testosterone Panel',
      results: [
        { code: 'TT', name: 'Total Testosterone', name_simple: 'Testosterone', result: '18.4', units: 'nmol/L', reference: '8.6 - 29.0', flag: '', note: '', comment: '' },
      ],
    },
    {
      panel_code: 'energy-panel',
      panel_name: 'Energy & Recovery Panel',
      results: [
        { code: 'VD',   name: 'Vitamin D', name_simple: 'Vitamin D', result: '85.0', units: 'nmol/L', reference: '75 - 200', flag: '', note: '', comment: '' },
        { code: 'FERR', name: 'Ferritin',  name_simple: 'Ferritin',  result: '68.0', units: 'ug/L',   reference: '30 - 400', flag: '', note: '', comment: '' },
      ],
    },
  ],
}

const results = KIT_PAYLOADS[kitArg]
if (!results) {
  console.error(`Unknown kit arg "${kitArg}". Use: kit1, kit2, or kit3`)
  process.exit(1)
}

const payload = {
  vitall_order_id: `vitall-test-${Date.now()}`,
  partner: 'andro-prime',
  partner_order_id: PARTNER_ORDER_ID,
  partner_user_id: PARTNER_USER_ID,
  laboratory_order_id: `lab-test-${Date.now()}`,
  order_status: { code: 'results-available', name: 'Results Available' },
  comment: '',
  warning: '',
  user: {
    sex: 'male',
    email: 'test@andro-prime.com',
    firstname: 'Test',
    surname: 'User',
    dob: '1990/01/15',
    phone: '',
  },
  tests: [],
  collection: 'self-collection',
  results,
  results_pdf: '',
  results_html: '',
}

const body = JSON.stringify(payload)
const signature = createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')

console.log(`\nPosting ${kitArg} results-available webhook to ${ENDPOINT}`)
console.log(`Signature: ${signature.slice(0, 20)}...`)

void (async () => {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'identity',
      'x-vitall-signature': signature,
    },
    body,
  })

  const text = await res.text()
  console.log(`\nStatus: ${res.status}`)
  console.log(`Response: ${text}`)
})()
