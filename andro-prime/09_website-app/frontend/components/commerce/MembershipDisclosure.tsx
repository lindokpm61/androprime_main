import { MEMBERSHIP_DISCLOSURE } from '@/lib/membership/disclosure'
import { isMembershipEnabled } from '@/lib/flags'

/**
 * THE SUBSCRIPTION PRICE LINE THAT SITS UNDER A KIT CTA.
 *
 * Built 2026-09-11. Ruled in three parts: `2026-09-07-auto-renew-at-day-30.md` §4
 * put it on the four `/kits/` routes and left the three `/lp/` kit landing pages
 * NOT DECIDED; Keith closed that on 2026-09-11 and they get the same line; and on
 * 2026-09-17 he ruled item F1, **the obligation follows the buy button**.
 *
 * 🔴 F1 IS A RULE ABOUT PLACEMENT, NOT A LIST OF PAGES, WHICH IS WHY IT IS STATED
 * AS A RULE HERE. The line was mounted once per route, in the hero, and the three
 * `/kits/*` product pages each end on a second buy button in their `#order` close
 * block, which a hero-mounted line is nowhere near. Slot 2 of the copy rewrite was
 * pure deletion, so that block's footnote had stopped mentioning billing at all: a
 * price and a button, and nothing in view about a recurring charge. **Every kit buy
 * button carries it, not every route**, so a new CTA inherits the obligation rather
 * than needing someone to remember it. The `/lp/` pages already satisfied the rule,
 * because their single CTA lives inside `#order`.
 *
 * 🔴 IT RENDERS NOTHING WHEN `MEMBERSHIP_ENABLED` IS OFF, AND THAT IS A SAFETY
 * INTERLOCK RATHER THAN A FEATURE FLAG. `01_strategy/STATE.md` states the hazard
 * directly: the live site is safe today only because it says nothing about
 * membership, and the moment this branch merges a kit page would promise an
 * included month while checkout has **no `trial_period_days` anywhere in the
 * repo** and `createMembership` charges from day one. A page promising thirty
 * included days in front of a checkout that bills immediately is a worse
 * position than saying nothing, because it is a promise rather than an omission.
 * So the line is tied to the same flag as every other membership surface, and it
 * cannot appear before the mechanic it describes exists.
 *
 * ⚠ THE FLAG IS READ PER REQUEST, NOT AT MODULE SCOPE. `isMembershipEnabled()`
 * reads `process.env` on each call; hoisting it to a module constant would bake
 * the build-time value into every render, which is the trap `/membership`'s own
 * header records for `notFound()`.
 *
 * WHY A COMPONENT RATHER THAN A SHARED STRING. Every call site needs the same
 * three things: the sentence, the flag check, and one register (`.f-fine`, the
 * price furniture weight the ruling specifies). A shared string would leave the
 * other two to be re-typed correctly at each one, and the flag is the one that
 * must never be forgotten.
 *
 * ⚠ THIS HEADER USED TO SAY "SEVEN CALL SITES" AND F1 MADE IT THIRTEEN, so it
 * states the rule instead. The count is `grep -c '<MembershipDisclosure' -r app`,
 * and it moves whenever a buy button is added. A figure written into prose beside
 * the code that produces it is a second call site for one fact, and the copy that
 * cannot be executed is the one that goes stale: `verify-subscription-claims.js`
 * learned the same lesson on 2026-09-16 and stopped stating its own count.
 *
 * 🔴 IT IS PRICE COPY, NOT A LEGAL BLOCK, AND THE REGISTER CARRIES THAT. §3 of
 * the ruling settles the question against a disclosure-statement treatment:
 * Spotify, Audible and Amazon Prime all carry exactly this line at the CTA and
 * it reads as price information because it is set as price information. A boxed
 * notice would make it a warning about the thing being bought. `.f-fine` is the
 * site's own fine-print register and sits directly under the button.
 */
export function MembershipDisclosure({ style }: { style?: React.CSSProperties }) {
  if (!isMembershipEnabled()) return null
  return (
    <p className="f-fine" style={{ marginTop: 10, ...style }}>
      {MEMBERSHIP_DISCLOSURE}
    </p>
  )
}
