/**
 * What the recurring-payments surface is CALLED, which is not the same question
 * as what it lists.
 *
 * ── WHY THIS EXISTS (Keith, 2026-09-16) ───────────────────────────────────
 * *"Subscriptions don't exist anymore. Actually, membership. The subscription
 * model was attributed to the supplements."*
 *
 * "Subscription" is the SUPPLEMENT product: Daily Stack, Joint & Recovery
 * Collagen, Complete Men's Stack. It was deferred out of Phase 0a on 2026-05-23
 * and the Stripe subscription route returns a clean 400 by design, so nobody can
 * buy one. Membership is the separate GBP 47/month product that auto-renews on
 * day 31 under the 2026-09-07 ruling. Two products, two tables, and until now one
 * set of labels naming only the product nobody can hold.
 *
 * Ruling: `01_strategy/2026-09-16-membership-is-not-a-subscription.md`.
 *
 * ── WHY THE LABELS ARE FLAG-DEPENDENT RATHER THAN JUST RENAMED ────────────
 * 🔴 WITH `MEMBERSHIP_ENABLED` OFF, "Subscriptions" IS THE CORRECT WORD. The
 * only rows `getSubscriptions` can return with the flag off are supplement
 * subscriptions, so renaming unconditionally would replace an accurate label
 * with an inaccurate one and break the standing rule that with the flag off the
 * app is byte-identical to before membership existed. **Every flag-off string
 * below is the exact string that shipped before this module.**
 *
 * With the flag on, a kit buyer holds a membership and nothing else, and being
 * sent to a page called "Subscriptions" to cancel it — whose empty state denies
 * he has one — is the defect the ruling names.
 *
 * This is the same shape as the interlock in
 * `scripts/verify-subscription-claims.js`: the two states are each coherent, and
 * what must never happen is them coexisting on one screen.
 *
 * ── WHY A BOOLEAN ARGUMENT AND NOT `isMembershipEnabled()` INSIDE ─────────
 * `components/shared/Nav.tsx` is a client component and already receives the
 * flag as a prop from `app/(app)/layout.tsx`. Reading `process.env` in here
 * would make this module unimportable from the one surface that most needs it.
 * Pure function, boolean in, labels out.
 *
 * ⚠ PHASE 0B REVISIT. `emptySentence` names only the membership, which is right
 * while supplements are deferred: with the flag on, membership is the only thing
 * a customer can hold. When supplements reinstate (`04_products/CONTEXT.md`,
 * Phase 0b, live Stripe Price IDs) a customer can hold either or both, and this
 * one line has to name both. Nothing else in here changes.
 */

export interface RecurringLabels {
  /** The app nav item pointing at `/subscriptions`. */
  navItem: string
  /** `<title>` for the page. Noindex either way. */
  pageTitle: string
  /** The `AppStrip` label above the page. */
  strip: string
  /** The empty-state card's heading. */
  emptyHeading: string
  /** The empty-state sentence, and the only one that asserts a fact. */
  emptySentence: string
  /** Inline link text, wherever another screen points here. */
  linkText: string
}

export function recurringLabels(membershipEnabled: boolean): RecurringLabels {
  if (!membershipEnabled) {
    return {
      navItem: 'Subscriptions',
      pageTitle: 'Your Subscriptions',
      strip: 'Your subscriptions',
      emptyHeading: 'Your subscriptions',
      emptySentence: 'You do not have an active subscription.',
      linkText: 'Your subscriptions',
    }
  }

  return {
    navItem: 'Billing',
    pageTitle: 'Billing',
    strip: 'Billing',
    emptyHeading: 'Billing',
    emptySentence: 'You do not have an active membership.',
    linkText: 'Billing',
  }
}
