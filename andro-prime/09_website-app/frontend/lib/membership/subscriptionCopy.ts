import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import { MEMBERSHIP_INCLUDED_DAYS, MEMBERSHIP_FIRST_CHARGE_DAY } from '@/lib/membership/disclosure'

/**
 * THE EIGHTEEN SENTENCES THE AUTO-RENEW RULING MADE FALSE, AND WHAT THEY SAY
 * INSTEAD. Register rows 42a and 12a. One export, nine consumers.
 *
 * Approved by Keith on 2026-09-16 from the 2026-09-11 draft
 * (`09_website-app/2026-09-11-subscription-copy-rewrite-draft.md`), together
 * with the vocabulary ruling in
 * `01_strategy/2026-09-16-membership-is-not-a-subscription.md`.
 *
 * ── 🔴 WHY EVERY STRING IS FLAG-DEPENDENT RATHER THAN REPLACED ────────────
 * This is the second HARD finding of the 2026-09-11 independent pre-flight and
 * it is the reason the rewrite could not simply be applied:
 *
 *   "The rewritten copy must inherit the MEMBERSHIP_ENABLED interlock.
 *    A page promising thirty included days in front of a checkout that bills
 *    immediately is WORSE than saying nothing, because it is a promise rather
 *    than an omission. The new sentences are that promise in richer form."
 *
 * `app/api/checkout/kit/route.ts` is `mode: 'payment'` with no `subscription_data`
 * and no `trial_period_days`, so today the mechanic these sentences describe does
 * not exist. With the flag OFF there is no membership, nothing renders the
 * disclosure, and the ORIGINAL sentences are true. With it ON the new ones are.
 * **What must never happen is the two states coexisting on one screen**, which is
 * exactly the rule `scripts/verify-subscription-claims.js` enforces and the same
 * shape as `components/commerce/MembershipDisclosure.tsx`.
 *
 * ⚠ **EVERY FLAG-OFF STRING BELOW IS BYTE-IDENTICAL TO WHAT SHIPPED BEFORE.**
 * That is checkable and is the point: with the flag off this module changes
 * nothing at all, including CA-026 C1, which is approved verbatim copy.
 *
 * ── 🔴 CALL IT PER REQUEST, NEVER AT MODULE SCOPE ─────────────────────────
 * `isMembershipEnabled()` reads `process.env` on each call. A module-level
 * `const copy = subscriptionCopy(isMembershipEnabled())` bakes the value in at
 * process start, which is the trap `MembershipDisclosure`'s header records. Two
 * landing pages had to turn their `FAQ_ITEMS` and `lpSchema` constants into
 * functions for exactly this reason, and the JSON-LD has to be built from the
 * same call as the rendered answer or the structured data stops matching the
 * visible content.
 *
 * ⚠ **NUMBERS ARE DERIVED, NEVER TYPED** (pre-flight finding F5). The draft was
 * written with "GBP 47" while the built disclosure derives "£47" from
 * `PRODUCT_MAP`, and on `/kits` the two would render within a screen of each
 * other. Both now come from the same place, so a price change moves all of it.
 *
 * ── WHAT IS NOT IN HERE ───────────────────────────────────────────────────
 * - **`public/llms.txt`** carries the C1 paragraph verbatim and is a static file
 *   that cannot read a flag. It takes the deletion treatment instead: the false
 *   clause is dropped and nothing replaces it, which is true in BOTH states.
 * - **`components/commerce/BundleChoice.tsx`'s "One-off test" chip.** Keith ruled
 *   it a false positive on 2026-09-16: it sits above "Just this test. One sample,
 *   one result." and counts tests, not payments. Left exactly as it was.
 */

/** "£47", from the same source as the disclosure line. */
const MEMBERSHIP_PRICE = PRODUCT_MAP.membership.price.replace('/mo', '')

/**
 * The sentence every surface with room for it carries, word for word. Three
 * consumers, one wording: that was a deliberate choice in the draft, so a man
 * comparing two pages sees the same fact stated the same way.
 */
const RENEWAL_SENTENCE =
  `The price also includes your first ${MEMBERSHIP_INCLUDED_DAYS} days of membership, ` +
  `and on day ${MEMBERSHIP_FIRST_CHARGE_DAY} it becomes ${MEMBERSHIP_PRICE} a month unless you stop it first.`

export interface SubscriptionCopy {
  /** `/kits` inverted panel, CA-026 C1. Kicker is unchanged in both states. */
  c1Kicker: string
  /** Rendered as two lines with a `<br />` between them. */
  c1Heading: [string, string]
  /** One paragraph with the flag off, two with it on: the GP sentence separates. */
  c1Paragraphs: string[]
  /** `/kits` step 01 of the how-it-works strip. */
  orderStep01: string
  /** The footnote under the kit CTAs. Seven instances. */
  kitFootnote: string
  /** `/lp/testosterone`'s own footnote, which words it differently. */
  lpTestosteroneFootnote: string
  /** The two `/lp/` secure-checkout footnotes. */
  secureCheckout: string
  /** The price chip beside £119 and £179. */
  allInChip: string
  /** `/lp/testosterone` FAQ, "Does the £99 cover everything?" */
  faqTestosterone: string
  /** `/lp/hormone-recovery` FAQ, "Does the £179 cover everything?" */
  faqHormoneRecovery: string
  /** The homepage membership sentence. Register row 12a. */
  homepageMembership: string
}

/**
 * 🔴 THE GP SENTENCE IS BYTE-IDENTICAL IN BOTH STATES AND IS THE REASON EWA IS
 * NOT IN THIS LOOP. CA-026 C1's fourth sentence is the conflict-free principle
 * and the only part of the paragraph inside her remit; the register records her
 * C1 remit as "clinical/principle" and Keith ruled the rewrite business-only on
 * 2026-09-11 (CA-021 precedent). It is kept as its own paragraph with the flag
 * on, which raises its prominence rather than reducing it. **Rework that
 * sentence and she re-enters.**
 */
const GP_SENTENCE =
  'If a result needs action, the next step is a GP conversation, and we earn nothing from it.'

export function subscriptionCopy(membershipEnabled: boolean): SubscriptionCopy {
  if (!membershipEnabled) {
    return {
      c1Kicker: 'What you pay',
      c1Heading: ['One price.', 'Nothing hidden.'],
      c1Paragraphs: [
        'The price on the card is everything you pay. No charge to see your own results, no ' +
          'surprise second test, no subscription unless you choose one. ' + GP_SENTENCE,
      ],
      orderStep01: 'Choose your kit. Pay once. Kit dispatched the same working day.',
      kitFootnote: 'One-off purchase. Results in your personal dashboard. No GP needed.',
      lpTestosteroneFootnote: 'One-off purchase. Includes lab fees & delivery. No subscription.',
      secureCheckout: 'Secure checkout. No subscription.',
      allInChip: 'all-in, one-off',
      faqTestosterone:
        'Yes. The kit, the lab analysis, and the prepaid return postage are all included. ' +
        'No hidden fees. This is a one-off purchase.',
      faqHormoneRecovery:
        'Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, ' +
        'and access to your results dashboard are all included. It is a one-off payment, not a subscription.',
      homepageMembership:
        'Holding that record over time is an optional membership. It is offered once your first ' +
        'result is back, never before, and you never need it to buy a kit or to read your own results.',
    }
  }

  return {
    c1Kicker: 'What you pay',
    /* "One price" is the part that does not survive: there are two prices now,
       and it was the weakest sentence on the page. "Nothing hidden" is kept and
       is now doing real work, because the renewal is the thing being un-hidden. */
    c1Heading: ['Nothing hidden.', 'Not even the renewal.'],
    c1Paragraphs: [
      `The price on the card is everything you pay today, and it includes your first ` +
        `${MEMBERSHIP_INCLUDED_DAYS} days of membership. On day ${MEMBERSHIP_FIRST_CHARGE_DAY} ` +
        `that card is charged ${MEMBERSHIP_PRICE} a month unless you stop it first. ` +
        `No charge to see your own results, and no surprise second test.`,
      GP_SENTENCE,
    ],
    /* Deletion. "Pay once" describes the whole commercial relationship in a
       numbered how-it-works step, and it stops being true on day 31. */
    orderStep01: 'Choose your kit. Kit dispatched the same working day.',
    /* Slot 2 is pure deletion throughout: each keeps its true half and drops its
       false half, so it introduces no word that was not already approved. */
    kitFootnote: 'Results in your personal dashboard. No GP needed.',
    lpTestosteroneFootnote: 'Includes lab fees and delivery.',
    secureCheckout: 'Secure checkout.',
    allInChip: 'all-in',
    faqTestosterone:
      'Yes. The kit, the lab analysis, and the prepaid return postage are all included. ' +
      'No hidden fees. ' + RENEWAL_SENTENCE,
    faqHormoneRecovery:
      'Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, ' +
      'and access to your results dashboard are all included. ' + RENEWAL_SENTENCE,
    /* "You never need it to buy a kit" is dropped because it is now nonsense: it
       comes WITH the kit. "You never need it to read your own results" is kept
       because it is still true and is the thing worth saying. */
    homepageMembership:
      `Holding that record over time is a membership, and your first ${MEMBERSHIP_INCLUDED_DAYS} ` +
      `days are included in the price of every kit. It starts when your first result lands, and on ` +
      `day ${MEMBERSHIP_FIRST_CHARGE_DAY} it becomes ${MEMBERSHIP_PRICE} a month unless you stop it. ` +
      `You never need it to read your own results.`,
  }
}
