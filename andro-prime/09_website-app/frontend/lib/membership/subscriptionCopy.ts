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
 * ── 🔴 AND "PER REQUEST" IS NOT WHEN IT IS READ ON SIX OF THE NINE ────────
 * The rule above is necessary and **it is not sufficient**, which nothing here
 * said until 2026-09-17. On a STATICALLY PRERENDERED route "each call" happens
 * once, during `next build`, so the flag is baked into HTML however correct the
 * call site is. As at 2026-09-17 the build marks `/`, `/kits`, `/lp/testosterone`,
 * `/lp/energy-recovery`, `/lp/hormone-recovery`, `/about`, `/how-it-works`,
 * `/lp/collagen` and `/lp/daily-stack` as `○ (Static)`; only the three
 * `/kits/*` pages and `/membership` are `ƒ (Dynamic)` and read it per request.
 *
 * **This is the coexistence condition, reached through the deploy rather than
 * through the copy, and it was measured rather than reasoned about.** With
 * `MEMBERSHIP_ENABLED=true` set in the shell and the server RESTARTED but NOT
 * rebuilt: `/kits` served the flag-OFF heading *"One price."* while
 * `/kits/testosterone` served the flag-ON footnote. One site, one flag, two
 * states, one click apart — on the page that takes the money.
 *
 * ⚠ **SO THE FLIP IS A REBUILD AND REDEPLOY, NEVER AN ENV CHANGE AND A
 * RESTART.** Coolify bakes `MEMBERSHIP_ENABLED` at build time for these routes
 * exactly as it does every `NEXT_PUBLIC_*`. `verify-subscription-claims.js`
 * cannot see this: it reads source, and in source every call site is correct.
 *
 * ⚠ **AND IT IS WHY A FLAG-ON SCREENSHOT NEEDS ITS OWN BUILD.** Restarting with
 * the flag on and shooting a static route captures the flag-OFF copy and looks
 * exactly like a capture that worked. Build with the flag set (`npx next build`
 * directly — `npm run build`'s prebuild gate fails by design with the flag on),
 * shoot, then rebuild flag-off to restore the shipping artefact.
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
 *
 * 🔴 THE CANCEL CLAUSE IS RULED AND IS NOT A WRITING CHOICE (Keith, 2026-09-17,
 * register item F4). The draft said "unless you stop it first" while
 * `MEMBERSHIP_DISCLOSURE` said "Cancel anytime", and both rendered on `/kits`
 * and all three kit landing pages: one fact, two vocabularies, one screen.
 * Keith ruled for **"Cancel anytime"**, which is the wording the 2026-09-07
 * auto-renew ruling already specified and the one carrying the DMCC Act 2024
 * Part 4 prominence function. Every surface now states the cancel right in the
 * ruled words, so the disclosure line and the prose beside it agree.
 */
const RENEWAL_SENTENCE =
  `The price also includes your first ${MEMBERSHIP_INCLUDED_DAYS} days of membership, ` +
  `and on day ${MEMBERSHIP_FIRST_CHARGE_DAY} it becomes ${MEMBERSHIP_PRICE} a month. Cancel anytime.`

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
  /** CA-026 A1, the standing claim. Four page stores. Register row 42b. */
  standingClaim: string
  /** `/about`'s fourth spec chip: label and sub. Register row 42b. */
  aboutFactLabel: string
  aboutFactSub: string
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

/**
 * 🔴 CA-026 A1, THE STANDING CLAIM, AND THE MIDDLE SENTENCE THAT STOPS BEING
 * TRUE. Register row 42b, defect H2b.
 *
 * A1 is approved verbatim copy and it renders on FOUR page stores — `/about`
 * (that page's one inverted panel), `/how-it-works`, `/lp/collagen` and
 * `/lp/daily-stack` — plus `public/llms.txt`, which took the deletion
 * treatment on 2026-09-17 because a static file cannot read a flag. The four
 * pages CAN read one, so they take the interlock instead and keep the approved
 * words byte for byte with the flag off.
 *
 * ⚠ IT IS THREE SENTENCES, NOT FOUR. Do not read C1's structure onto it. The
 * sentence that dies is the MIDDLE one, *"You pay one price for the test"*, for
 * the same reason C1's heading lost "One price": there are two prices now.
 *
 * 🔴 THE THIRD SENTENCE IS THE CONFLICT-FREE GP CLAIM AND IT IS EWA'S, the same
 * way `GP_SENTENCE` is in C1. It is kept byte-identical and held in its own
 * constant so a future edit has to mean it. **Rework it and she re-enters.**
 *
 * ✅ THE FLAG-ON STRING IS NOT NEW WORDING. It is byte-identical to what
 * `public/llms.txt:7` already serves on this branch, so this introduces no word
 * that has not already been applied under the same ruling. That is the slot-2
 * property restated: keep the true half, drop the false half, add nothing.
 */
const STANDING_CLAIM_OPENING = 'Testing and selling are kept apart at Andro Prime.'
const STANDING_CLAIM_GP =
  'Any result that needs a doctor, low testosterone included, goes to a GP, and those results earn us nothing.'

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
      standingClaim:
        STANDING_CLAIM_OPENING + ' You pay one price for the test. ' + STANDING_CLAIM_GP,
      aboutFactLabel: 'One price',
      aboutFactSub: 'For the test, and nothing after it',
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
        `that card is charged ${MEMBERSHIP_PRICE} a month. Cancel anytime. ` +
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
      `day ${MEMBERSHIP_FIRST_CHARGE_DAY} it becomes ${MEMBERSHIP_PRICE} a month. Cancel anytime. ` +
      `You never need it to read your own results.`,
    /* Pure deletion of the middle sentence. The result is byte-identical to
       `public/llms.txt:7`, which took the same cut on 2026-09-17. */
    standingClaim: STANDING_CLAIM_OPENING + ' ' + STANDING_CLAIM_GP,
    /* 🔵 KEITH'S CALL, AND THE ONE PLACE IN THIS MODULE WITH NO PURE-DELETION
       FORM. The chip is `{ label, sub }` and BOTH halves die together: "One
       price" is false on its own and "nothing after it" is the false half, so
       deleting the false half deletes the chip and leaves `/about` with three
       spec rows instead of four.

       What is here instead introduces NO NEW WORD: it is C1's flag-on heading,
       `c1Heading` above, with the full stops dropped to match the chip row's
       own convention (no other label or sub on that strip carries one). The
       alternative is dropping the chip. Recorded for ruling in register row
       42b; if Keith prefers the deletion, remove the fourth entry of `facts`
       in the flag-on branch of `/about` rather than rewording this. */
    aboutFactLabel: 'Nothing hidden',
    aboutFactSub: 'Not even the renewal',
  }
}
