/**
 * DOES STRIPE CHARGE WHAT THIS REPO SAYS IT CHARGES? Defect P3.
 *
 *   npx tsx scripts/verify-stripe-prices.ts              (report, fail on anything wrong)
 *   npx tsx scripts/verify-stripe-prices.ts --switch-on  (also fail on anything unset)
 *
 * ── WHY THIS IS A SCRIPT AND NOT A TEST ───────────────────────────────────
 * It needs `STRIPE_SECRET_KEY` and a network call, so it cannot live in
 * `npm test` without making the suite require secrets and an internet
 * connection. A test that needs both is a test that gets skipped, and a skipped
 * test reports green. The pure half IS unit-tested, in
 * `scripts/test-price-expectations.ts`; this half is the live read.
 *
 * ── WHY IT EXISTS AT ALL, WHEN P3 ASKED FOR A CHECKLIST ───────────────────
 * P3's recommendation was to move the item onto a switch-on checklist. That is
 * necessary and it is not sufficient: a checklist line saying *"check the
 * membership price is £47"* is a human comparing two numbers on two screens at
 * the end of a long sitting, which is the moment people are worst at it. The
 * checklist line now says **run this**, and the script is the thing that
 * actually compares. Prose for the decision, a command for the mechanics.
 *
 * ── THE TWO MODES, AND WHY THE DEFAULT IS THE LENIENT ONE ─────────────────
 * Today `MEMBERSHIP_ENABLED` is off and no membership price need exist yet, so
 * a plain run does not fail on a price that is merely absent behind a flag that
 * is also off. **It does still fail on a price that exists and is wrong**,
 * because a wrong price is wrong now whether or not anything can spend it.
 * `--switch-on` removes the leniency: at the moment the flag flips, an unset
 * price is exactly the defect P3 is about.
 *
 * Exit 0 = every price judged is correct. Exit 1 = at least one is not, or the
 * run could not be completed. **Exit 1 is never a pass**, including when the
 * cause is a missing key rather than a bad price.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import Stripe from 'stripe'
import {
  priceExpectations,
  judgePrice,
  PROBLEM_TEXT,
  type ObservedPrice,
  type PriceExpectation,
  type PriceProblem,
} from '../lib/stripe/priceExpectations'

const SWITCH_ON = process.argv.includes('--switch-on')

function money(pence: number | null, currency = 'GBP'): string {
  if (pence === null) return '—'
  const sign = currency.toLowerCase() === 'gbp' ? '£' : `${currency.toUpperCase()} `
  return `${sign}${(pence / 100).toFixed(2)}`
}

function shapeText(o: ObservedPrice): string {
  if (!o.recurringInterval) return 'one-off'
  const n = o.recurringIntervalCount ?? 1
  return n === 1 ? `every ${o.recurringInterval}` : `every ${n} ${o.recurringInterval}s`
}

/** Is the surface that spends this price currently switched on? */
function gateIsOpen(expected: PriceExpectation): boolean {
  if (!expected.gatedBy) return true
  return process.env[expected.gatedBy] === 'true'
}

async function main(): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('✗ STRIPE_SECRET_KEY is not set. Nothing was checked.')
    process.exit(1)
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
  })

  // Which account is being read, printed before any verdict. A perfect report
  // against the test account is the failure this line exists to prevent.
  const mode = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')
    ? 'LIVE'
    : process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')
      ? 'TEST'
      : 'UNKNOWN'

  console.log('')
  console.log(`Stripe price check  ·  key mode: ${mode}  ·  ${SWITCH_ON ? 'switch-on (strict)' : 'default'}`)
  console.log('─'.repeat(96))

  const expectations = priceExpectations()
  let failures = 0
  let checked = 0
  let skipped = 0

  for (const expected of expectations) {
    const envValue = process.env[expected.env]
    let observed: ObservedPrice | null = null
    let retrieveError: string | null = null

    if (envValue) {
      try {
        const p = await stripe.prices.retrieve(envValue)
        observed = {
          active: p.active,
          currency: p.currency,
          unitAmount: p.unit_amount,
          recurringInterval: p.recurring?.interval ?? null,
          recurringIntervalCount: p.recurring?.interval_count ?? null,
        }
      } catch (err) {
        retrieveError = err instanceof Error ? err.message : String(err)
      }
    }

    const problems: PriceProblem[] = retrieveError
      ? ['not-found']
      : judgePrice(expected, observed, envValue)

    // A price that is only absent, behind a gate that is also shut, is not yet
    // a defect outside the switch-on run. Anything else is judged normally.
    const lenient =
      !SWITCH_ON &&
      problems.length === 1 &&
      problems[0] === 'env-unset' &&
      !gateIsOpen(expected)

    const expectedText =
      expected.pence === null
        ? `${expected.shape === 'monthly' ? 'monthly' : 'one-off'}, GBP, amount not claimed`
        : `${money(expected.pence)} ${expected.shape === 'monthly' ? 'per month' : 'one-off'}`

    const observedText = observed
      ? `${money(observed.unitAmount, observed.currency)} ${shapeText(observed)}${observed.active ? '' : ' [ARCHIVED]'}`
      : envValue
        ? 'could not be read'
        : 'not set'

    if (problems.length === 0) {
      checked += 1
      console.log(`✓ ${expected.label.padEnd(30)} ${observedText.padEnd(26)} ${expected.env}`)
      if (expected.pence === null && observed) {
        console.log(`    ↳ amount reported, not asserted: ${expected.source}`)
      }
    } else if (lenient) {
      skipped += 1
      console.log(`· ${expected.label.padEnd(30)} ${'not set'.padEnd(26)} ${expected.env}`)
      console.log(`    ↳ skipped: ${expected.gatedBy} is off, so no price is owed yet. Use --switch-on to require it.`)
    } else {
      failures += 1
      console.log(`✗ ${expected.label.padEnd(30)} ${observedText.padEnd(26)} ${expected.env}`)
      console.log(`    ↳ expected: ${expectedText}`)
      console.log(`    ↳ source:   ${expected.source}`)
      for (const problem of problems) {
        console.log(`    ↳ PROBLEM:  ${PROBLEM_TEXT[problem]}`)
      }
      if (retrieveError) console.log(`    ↳ Stripe:   ${retrieveError}`)
    }
  }

  console.log('─'.repeat(96))
  console.log(`${checked} correct, ${failures} wrong, ${skipped} not yet configured (gated).`)

  // ── The appendix, printed only when something needs setting or fixing ─────
  //
  // Without this the operator is told a variable is wrong and left to go and
  // find the right id in the Stripe dashboard, at the exact moment they are
  // least inclined to be careful. Listing the account's own active prices beside
  // the failures turns the check into something that can be acted on in place.
  // It is a read of the same account the verdicts came from, so it cannot
  // disagree with them.
  if (failures > 0 || skipped > 0) {
    try {
      const live = await stripe.prices.list({ limit: 100, expand: ['data.product'] })
      const active = live.data.filter((p) => p.active)
      console.log('')
      console.log(`Active prices on this ${mode} account, for setting the variables above:`)
      console.log('─'.repeat(96))
      for (const p of active) {
        const product =
          typeof p.product === 'object' && p.product && !('deleted' in p.product && p.product.deleted)
            ? (p.product as Stripe.Product).name
            : String(p.product)
        const amount = p.unit_amount === null ? 'n/a' : money(p.unit_amount, p.currency)
        const shape = p.recurring
          ? `every ${p.recurring.interval_count} ${p.recurring.interval}`
          : 'one-off'
        console.log(`  ${p.id}  ${amount.padEnd(10)} ${shape.padEnd(16)} ${product}`)
      }
      if (active.length === 0) console.log('  (none)')
    } catch (err) {
      console.log('')
      console.log(`  (could not list account prices: ${err instanceof Error ? err.message : String(err)})`)
    }
  }

  if (failures > 0) {
    console.log('')
    console.log('✗ FAILED. Do not switch anything on until every line above is ✓.')
    console.log('  A price wrong here charges a real card the wrong amount at the first sale.')
    process.exit(1)
  }

  if (skipped > 0 && !SWITCH_ON) {
    console.log('')
    console.log(`✓ Nothing configured is wrong. ${skipped} price(s) are still unset behind an off flag.`)
    console.log('  Re-run with --switch-on in the same sitting as flipping the flag.')
  } else {
    console.log('')
    console.log('✓ Every price matches what the repo states.')
  }
}

main().catch((err) => {
  console.error('✗ The check did not complete, so nothing is verified:', err)
  process.exit(1)
})
