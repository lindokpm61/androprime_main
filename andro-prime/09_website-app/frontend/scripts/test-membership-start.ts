/**
 * `lib/membership/startOnResult.ts` — the mechanic behind the sentence.
 *
 * WHY THESE CASES AND NOT OTHERS. Every branch in that module is a refusal, and
 * the refusals are the product: the module's job is to start a membership in one
 * narrow circumstance and to decline in every other, because not starting one is
 * recoverable and charging a man who should not be charged is not. So the happy
 * path gets three assertions and the nine ways of saying no get the rest.
 *
 *   npx tsx scripts/test-membership-start.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase/types'
import {
  startMembershipOnResult,
  type StripeSeam,
} from '../lib/membership/startOnResult'
import { MEMBERSHIP_INCLUDED_DAYS } from '../lib/membership/disclosure'

let passes = 0
let failures = 0

function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`[FAIL] ${label}`)
  }
}

// --- Fake Supabase ----------------------------------------------------------
// Covers the four chains the module and `createMembership` actually use:
//   kit_orders    .select().eq().maybeSingle()
//   memberships   .select().eq().in().limit()
//   lab_results   .select().eq().limit()     (via memberHasMarkerToMove)
//   memberships   .insert().select().single()
interface Cfg {
  order?: { data: unknown; error: unknown }
  memberships?: { data: unknown; error: unknown }
  insert?: { data: unknown; error: unknown }
}

function fakeSupabase(cfg: Cfg): SupabaseClient<Database> {
  let table = ''
  const builder: Record<string, unknown> = {}
  Object.assign(builder, {
    select: () => builder,
    eq: () => builder,
    in: () => builder,
    insert: () => builder,
    // lab_results and memberships both terminate on .limit(); the table tells
    // them apart. lab_results always returns empty, which resolves the retest
    // cadence to the no-result branch and keeps these cases about this module.
    limit: async () =>
      table === 'lab_results'
        ? { data: [], error: null }
        : (cfg.memberships ?? { data: [], error: null }),
    maybeSingle: async () => cfg.order ?? { data: null, error: null },
    single: async () => cfg.insert ?? { data: { id: 'mem_1' }, error: null },
  })
  return {
    from: (t: string) => {
      table = t
      return builder
    },
  } as unknown as SupabaseClient<Database>
}

// --- Fake Stripe ------------------------------------------------------------
interface StripeCalls {
  created: Record<string, unknown>[]
  cancelled: string[]
}

function fakeStripe(
  opts: {
    customer?: string | null
    paymentMethod?: string | null
    retrieveThrows?: boolean
    createThrows?: boolean
    cancelThrows?: boolean
  } = {},
): { seam: StripeSeam; calls: StripeCalls } {
  const calls: StripeCalls = { created: [], cancelled: [] }
  const seam = {
    paymentIntents: {
      retrieve: async () => {
        if (opts.retrieveThrows) throw new Error('simulated Stripe outage')
        return {
          customer: opts.customer === undefined ? 'cus_1' : opts.customer,
          payment_method: opts.paymentMethod === undefined ? 'pm_1' : opts.paymentMethod,
        }
      },
    },
    subscriptions: {
      create: async (args: Record<string, unknown>) => {
        if (opts.createThrows) throw new Error('card_declined')
        calls.created.push(args)
        return { id: 'sub_test_1' }
      },
      cancel: async (id: string) => {
        if (opts.cancelThrows) throw new Error('already cancelled')
        calls.cancelled.push(id)
        return {}
      },
    },
  }
  return { seam: seam as unknown as StripeSeam, calls }
}

const PAID = { data: { stripe_payment_intent: 'pi_1' }, error: null }
const ASOF = new Date('2026-10-01T09:00:00.000Z')

async function run(): Promise<void> {
  const priceWas = process.env.STRIPE_PRICE_MEMBERSHIP

  // (a) No price configured -> refuse, and refuse FIRST, before anything else
  //     is read. This is the live state today: the go-live plan lists
  //     STRIPE_PRICE_MEMBERSHIP as still unset.
  {
    delete process.env.STRIPE_PRICE_MEMBERSHIP
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, null, {
      stripe: seam,
    })
    check('(a) no price -> refused', !out.started)
    check('(a) reason is no-price-configured', !out.started && out.reason === 'no-price-configured')
    check('(a) nothing was created in Stripe', calls.created.length === 0)
  }

  process.env.STRIPE_PRICE_MEMBERSHIP = 'price_test'

  // (b) Already a member -> refuse before touching Stripe. The partial unique
  //     index would reject the row anyway, but only after a subscription existed.
  {
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(
      fakeSupabase({ order: PAID, memberships: { data: [{ id: 'mem_existing' }], error: null } }),
      'u1',
      'o1',
      ASOF,
      null,
      { stripe: seam },
    )
    check('(b) already a member -> refused', !out.started)
    check('(b) reason is already-a-member', !out.started && out.reason === 'already-a-member')
    check('(b) no subscription was created', calls.created.length === 0)
  }

  // (c) Memberships table unreadable -> FAIL CLOSED, treated as already a member.
  {
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(
      fakeSupabase({ order: PAID, memberships: { data: null, error: { message: 'boom' } } }),
      'u1',
      'o1',
      ASOF,
      null,
      { stripe: seam },
    )
    check('(c) unreadable memberships -> refused', !out.started)
    check('(c) fails CLOSED as already-a-member', !out.started && out.reason === 'already-a-member')
    check('(c) no subscription was created', calls.created.length === 0)
  }

  // (d) An UNPAID kit -> refuse. This is the included retest and the bundle's
  //     second kit: dispatch inserts its row with no payment intent, and that is
  //     the whole reason a member's own retest cannot start a second membership.
  {
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(
      fakeSupabase({ order: { data: { stripe_payment_intent: null }, error: null } }),
      'u1',
      'o1',
      ASOF,
      null,
      { stripe: seam },
    )
    check('(d) unpaid kit -> refused', !out.started)
    check('(d) reason is kit-was-not-paid-for', !out.started && out.reason === 'kit-was-not-paid-for')
    check('(d) no subscription was created', calls.created.length === 0)
  }

  // (e) Order unreadable -> FAIL CLOSED. A bad read is never a purchase.
  {
    const { seam } = fakeStripe()
    const out = await startMembershipOnResult(
      fakeSupabase({ order: { data: null, error: { message: 'boom' } } }),
      'u1',
      'o1',
      ASOF,
      null,
      { stripe: seam },
    )
    check('(e) unreadable order fails closed', !out.started && out.reason === 'kit-was-not-paid-for')
  }

  // (f) Paid, but no saved card -> refuse. A kit bought before the checkout
  //     started saving cards must not be enrolled with no way to charge him.
  {
    const { seam, calls } = fakeStripe({ customer: null, paymentMethod: null })
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, null, {
      stripe: seam,
    })
    check('(f) no saved card -> refused', !out.started && out.reason === 'no-saved-card')
    check('(f) no subscription was created', calls.created.length === 0)
  }

  // (f2) A customer but no payment method is equally unusable. Both are required.
  {
    const { seam } = fakeStripe({ customer: 'cus_1', paymentMethod: null })
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, null, {
      stripe: seam,
    })
    check('(f2) customer without a payment method -> no-saved-card', !out.started && out.reason === 'no-saved-card')
  }

  // (g) Stripe refuses the subscription -> refuse, no row written.
  {
    const { seam } = fakeStripe({ createThrows: true })
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, null, {
      stripe: seam,
    })
    check('(g) Stripe failure -> refused', !out.started && out.reason === 'stripe-failed')
  }

  // (g2) A failed payment-intent read is also stripe-failed, not a silent pass.
  {
    const { seam } = fakeStripe({ retrieveThrows: true })
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, null, {
      stripe: seam,
    })
    check('(g2) payment-intent read failure -> stripe-failed', !out.started && out.reason === 'stripe-failed')
  }

  // (h) THE HAPPY PATH, and the three things that matter about it.
  {
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, null, {
      stripe: seam,
    })
    check('(h) started', out.started)
    check('(h) one subscription created', calls.created.length === 1)
    const args = calls.created[0] ?? {}
    // H3: the included days are the SAME constant the copy renders, so the
    // trial cannot drift from the promise on the page.
    check(
      `(h) trial_period_days is MEMBERSHIP_INCLUDED_DAYS (${MEMBERSHIP_INCLUDED_DAYS})`,
      args.trial_period_days === MEMBERSHIP_INCLUDED_DAYS,
    )
    check('(h) billed to the saved customer', args.customer === 'cus_1')
    check('(h) billed to the saved card', args.default_payment_method === 'pm_1')
    check('(h) priced from STRIPE_PRICE_MEMBERSHIP', JSON.stringify(args.items) === JSON.stringify([{ price: 'price_test' }]))
    // A trial that ends with no payment method must cancel, never pause: pausing
    // leaves a man a member without paying, which is not what the copy says.
    check(
      '(h) trial end behaviour on a missing card is cancel',
      JSON.stringify(args.trial_settings) === JSON.stringify({ end_behavior: { missing_payment_method: 'cancel' } }),
    )
    check('(h) nothing was cancelled', calls.cancelled.length === 0)
  }

  // (i) THE COMPENSATING CANCEL. Row insert fails after the subscription exists,
  //     so nothing in the product knows he is a member while Stripe prepares to
  //     charge him. That is the one outcome here that reaches a customer as
  //     money, and it must be undone.
  {
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(
      fakeSupabase({ order: PAID, insert: { data: null, error: { message: 'constraint' } } }),
      'u1',
      'o1',
      ASOF,
      null,
      { stripe: seam },
    )
    check('(i) insert failure -> refused', !out.started && out.reason === 'insert-failed')
    check('(i) the orphan subscription was cancelled', calls.cancelled.length === 1)
    check('(i) it cancelled the one it just made', calls.cancelled[0] === 'sub_test_1')
  }

  // (j) And if the cancel ALSO fails, it still returns rather than throwing:
  //     a throw here would reach processResult and could touch the customer's
  //     result, which is the one thing this hook may never do.
  {
    const { seam } = fakeStripe({ cancelThrows: true })
    const out = await startMembershipOnResult(
      fakeSupabase({ order: PAID, insert: { data: null, error: { message: 'constraint' } } }),
      'u1',
      'o1',
      ASOF,
      null,
      { stripe: seam },
    )
    check('(j) an uncancellable orphan still returns insert-failed', !out.started && out.reason === 'insert-failed')
  }

  // (k) THE LOW-T RULE (Keith, 2026-09-17). A reading under 12 routes to the GP
  //     and starts nothing. It is the FIRST guard, ahead of every plumbing check,
  //     because it is a statement about the customer rather than about config.
  {
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, 9.4, {
      stripe: seam,
    })
    check('(k) under 12 -> refused', !out.started)
    check('(k) reason is low-t-routes-to-gp', !out.started && out.reason === 'low-t-routes-to-gp')
    check('(k) no subscription was created', calls.created.length === 0)
  }

  // (k2) It outranks the plumbing. With NO price configured a low reading still
  //      reports the clinical reason, not the config one: the man is not a
  //      membership case at all, and which env var is unset is beside the point.
  {
    const priceNow = process.env.STRIPE_PRICE_MEMBERSHIP
    delete process.env.STRIPE_PRICE_MEMBERSHIP
    const { seam } = fakeStripe()
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, 9.4, {
      stripe: seam,
    })
    check('(k2) low-T outranks the price check', !out.started && out.reason === 'low-t-routes-to-gp')
    process.env.STRIPE_PRICE_MEMBERSHIP = priceNow
  }

  // (k3) EXACTLY 12 enrols. The boundary is "under 12", and borderline 12 to
  //      under 15 is a member like anyone else. Ewa owns this line.
  {
    const { seam, calls } = fakeStripe()
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, 12, {
      stripe: seam,
    })
    check('(k3) exactly 12 enrols', out.started)
    check('(k3) one subscription created', calls.created.length === 1)
  }

  // (k4) NULL IS NOT LOW. An energy-recovery panel carries no testosterone, and
  //      inferring low T from its markers is a named red flag, so null enrols.
  {
    const { seam } = fakeStripe()
    const out = await startMembershipOnResult(fakeSupabase({ order: PAID }), 'u1', 'o1', ASOF, null, {
      stripe: seam,
    })
    check('(k4) a kit with no testosterone marker enrols', out.started)
  }

  if (priceWas === undefined) delete process.env.STRIPE_PRICE_MEMBERSHIP
  else process.env.STRIPE_PRICE_MEMBERSHIP = priceWas

  console.log(`\ntest-membership-start: ${passes} passed, ${failures} failed`)
  if (failures > 0) process.exit(1)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
