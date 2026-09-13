/**
 * The reorder path (defect 3e, Keith 2026-09-13: *"reorder at the same price"*).
 * PURE: no database, no env, no clock.
 *
 * ── WHAT WAS ACTUALLY WRONG ───────────────────────────────────────────────
 * The register said *"No order history, no repurchase, no 'order again'"*.
 * **The first third of that is wrong and was wrong when it was written**: the
 * account page has carried an order history since the batch-3 rebuild, with a
 * Kit / Status / Date / Action table. What it has never carried is a way to buy
 * the same kit again. The claim was made from the Manage block's three links
 * rather than from the whole page, and it made the defect look larger and more
 * expensive than it is.
 *
 * So the gap is narrower than recorded: a returning customer can SEE what he
 * took and cannot ORDER it. His only pointer was the dashboard's retest CTA,
 * which sent him to the public catalogue index to start again as a stranger.
 *
 * ── SAME PRICE, DELIBERATELY ──────────────────────────────────────────────
 * No returning-customer discount. A discount here is a pricing decision that
 * needs the willingness-to-pay work behind it, and one shipped now would set an
 * anchor that cannot be quietly removed later. It also agrees with the standing
 * rule already enforced at kit checkout: kits are never discounted, for members
 * or anyone else (Keith, 2026-08-26). The friction was never the price. It was
 * that he had to work out which kit he took and start from the catalogue.
 */

import type { Cta, KitType } from '@/lib/results/types'

/** Kit slugs are the kit_type values themselves, so the product page is direct. */
const KIT_SLUGS: readonly KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']

export function isKnownKit(kitType: string | null | undefined): kitType is KitType {
  return !!kitType && (KIT_SLUGS as readonly string[]).includes(kitType)
}

/**
 * Where "order this again" should point.
 *
 * Falls back to the catalogue index for an unknown or missing kit, which is
 * exactly the behaviour that exists today, so a new kit slug added to the
 * database and not to this list degrades to the old dead end rather than to a
 * 404. Silent and safe beats clever here: the fallback is the status quo.
 */
export function reorderHref(kitType: string | null | undefined): string {
  return isKnownKit(kitType) ? `/kits/${kitType}` : '/kits'
}

/**
 * POINT A RETEST CTA AT THE KIT HE ACTUALLY TOOK.
 *
 * 🔴 WHY THIS IS A RESOLVER AND NOT AN EDIT TO THE CTA TABLE. The obvious fix
 * is to change `retestReminder.href` in `lib/results/classifier.ts` from
 * `/kits` to the right kit. It cannot be done there: that table is a single
 * shared constant, it is rendered on LOGGED-OUT surfaces as well as the
 * signed-in dashboard, and a static string cannot know whose result it is
 * attached to. Editing it would either break the logged-out case or require
 * the classifier to take a viewer, which it deliberately does not.
 *
 * So the CTA table keeps the catalogue index as its correct DEFAULT, and this
 * resolves it per viewer at the point where the viewer is known. Every other
 * CTA type passes through untouched.
 *
 * Same-object return when nothing changes, so a caller can cheaply tell whether
 * anything was resolved.
 */
export function resolveRetestCta(cta: Cta | null, kitType: string | null | undefined): Cta | null {
  if (!cta || cta.type !== 'retest-reminder') return cta
  if (!isKnownKit(kitType)) return cta

  const href = reorderHref(kitType)
  if (href === cta.href) return cta

  // Label untouched. "Retest in 6-12 months" is approved copy and says nothing
  // about which kit; only the destination becomes specific.
  return { ...cta, href }
}
