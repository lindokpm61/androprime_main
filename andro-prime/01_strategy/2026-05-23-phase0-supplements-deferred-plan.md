# Phase 0a / Phase 0b — Supplements-Deferred Adjustment Plan

**Owner:** Keith Antony
**Status:** APPROVED 2026-05-23 (Keith). Execution in progress.
**Trigger:** 2026-05-23. Phase 0 supplements (Daily Stack, Joint & Recovery Collagen, Complete Men's Stack) will not be available at launch. Sourcing not complete; estimated 2 to 3 months out. Kits, Vitall integration, founding-member list, results engine, and CIO sequences were all drafted assuming supplements ship in tandem. They don't.
**Decisions logged 2026-05-23:** Keith approved the §2 mechanic, the §4 recommendations (one combined list with attributes, vague launch timing, post-result waitlist promotion only, kits-only Phase 0a commissions), and the §5 sequencing. Three-attribute design adopted: `source_marker` + `source_kit` + `interested_in_product`.

---

## 1. The problem

The whole Phase 0 results-to-action funnel was built on the assumption that a customer with a non-optimal result lands on the dashboard and can click straight through to a supplement subscription. That assumption is in code (`classifier.ts` returns Daily Stack / Complete Stack / Collagen as primary CTAs on most non-FM result states), in copy (seq-03a/b/c/d all pitch supplements; `/supplements/*` pages are wired for checkout), and in the marketing master plan (Kit 2's strategic role is "primary driver of supplement subscriptions").

If we launch as-is with supplements deferred:

- Kit 1 low-T customers still work (founding-member CTA is primary).
- Kit 3 low-T customers still work (same CTA, once the Kit 3 combined-result rule is fixed).
- **Everyone else hits a dead end.** Kit 2 customers, normal-T Kit 1 customers, normal-T Kit 3 customers, energy-deficiency customers, collagen-eligible CRP customers, multi-deficiency customers: they all land on dashboard cards that say "Try the Daily Stack" / "Try the Complete Men's Stack" / "Try Collagen", and clicking goes to a `/supplements/*` page whose Subscribe button hits `/api/checkout/subscription` which returns a clean 400 "Price ID not configured" (because the live env vars are intentionally unset until supplements ship).

The customer experience is broken in the segments Kit 2 was designed to monetise.

---

## 2. Proposed solution: Supplement Waitlist (mirrors the founding-member list)

Replace every "buy supplement now" CTA, in the results engine and the supplement marketing pages, with a non-cash opt-in to a single combined waitlist. Honest about the timeline, captures email + CIO consent + the source marker that drove the opt-in, gives us a real list to broadcast to when supplements ship.

### 2.1 Pattern

Mirror `founding_member_list` exactly. It is already built, already approved, and already lives in customers' heads as the same non-cash mechanic.

| Layer | FM list (existing) | Supplement waitlist (new) |
|---|---|---|
| DB table | `founding_member_list` | `supplement_waitlist` |
| Identifying attribute | `email`, `user_id` nullable | same, plus `source_marker`, `source_kit`, `interested_in_product` |
| API route | `/api/founding-member/join` | `/api/supplement-waitlist/join` |
| Form component | `JoinForm` | `SupplementWaitlistForm` (mirror) |
| CIO event | `founding_member_listed` | `supplement_waitlist_joined` |
| CIO identify trait | `is_founding_member: true` | `supplement_waitlist: true`, `supplement_waitlist_source_marker`, `supplement_waitlist_source_kit`, `supplement_waitlist_interested_in_product` |
| Confirmation email | T-04 (transactional, already live) | T-10 (new transactional, draft) |
| Launch broadcast | (future) FM list when clinical opens | Supplement Waitlist when each supplement ships |

One list, three attributes. Two segmentation axes are kept: `source_marker` (which biomarker triggered the opt-in, implies the relevant product) and `interested_in_product` (`'daily-stack' | 'collagen' | 'complete-mens-stack' | 'any'`, set explicitly by the form based on which page or result card the opt-in came from). The page-form mapping:

| Opt-in source | source_marker | interested_in_product |
|---|---|---|
| Vit D result card | `low-vitamin-d` | `daily-stack` |
| B12 result card | `low-b12` | `daily-stack` |
| CRP-with-joints result card | `moderate-crp` (or `elevated-crp`) | `collagen` |
| Multi-deficiency dashboard panel | `multi-deficiency` | `complete-mens-stack` |
| `/lp/daily-stack` form | (none) | `daily-stack` |
| `/lp/collagen` form | (none) | `collagen` |
| `/supplements/*` generic page | (none) | `any` |

### 2.2 Customer-facing framing

Honest, no medicinal claims, no specific launch date. One reusable block:

> Your Vitamin D is below the optimal range. Vitamin D3 from any chemist will support this marker; the dose your card recommends is the relevant target.
>
> We are also building the Andro Prime Daily Stack, a curated supplement designed around the markers Kit 2 and Kit 3 cover. It launches as soon as our manufacturing partner is confirmed. Join the early-access list and you will be the first to dispatch, with a founding-customer discount when it ships.
>
> [Join the early-access list]

The OTC suggestion gives the customer something they can act on today, so the marker advice is not blocked by our supply chain. The waitlist captures intent. The discount is the same lever we already use elsewhere; it does not promise a date we cannot hit.

For markers where OTC is not applicable (CRP with joint symptoms, Complete Men's Stack scenarios), drop the OTC sentence and keep the waitlist block alone.

### 2.3 Compliance

This is a new customer-facing mechanic, so Ewa needs to eyeball the standard wording template once. It is structurally identical to the FM list, which she has already approved (CA-008). Should be straightforward. One approval record covers the template; per-page uses inherit.

---

## 3. Inventory of surfaces requiring adjustment

### 3.1 Code

| File | Change |
|---|---|
| `lib/results/classifier.ts` | Rewire CTA matrix (table in §3.2). Also apply the Kit 3 combined-result fix (remove `low-testosterone`/`normal-testosterone` from `DEFICIENCY_STATES`). Add a new CTA constant `supplementWaitlist`. |
| `lib/results/types.ts` | Add `'supplement-waitlist'` to the CTA `type` union. |
| `lib/subscriptions/products.ts` | No change. Still the source of truth for when supplements ship. |
| `app/api/checkout/subscription/route.ts` | No change. Returns clean 400 if env unset; harmless. |
| **New:** `app/api/supplement-waitlist/join/route.ts` | Mirror `/api/founding-member/join`. |
| **New:** `lib/supplement-waitlist/getSupplementWaitlistStatus.ts` | Mirror FM status lookup. |
| **New:** `components/supplement-waitlist/SupplementWaitlistForm.tsx` | Mirror `JoinForm`. |
| **New:** `database/migrations/2026MMDD_create_supplement_waitlist.sql` | Mirror `20260509_create_founding_member_list.sql`. |
| **New:** `lib/customerio/events.ts` (or equivalent) | Emit `supplement_waitlist_joined`, identify with the two new traits. |

### 3.2 Result-card CTA matrix (the heart of the change)

| Result state | Now: primary | Now: secondary | v1 primary | v1 secondary |
|---|---|---|---|---|
| `low-testosterone` | foundingMember | dailyStackZinc | foundingMember | **remove** (FM is the focus; do not split attention) |
| `normal-testosterone` (Kit 1, energy symptoms) | dailyStackZinc | kit2CrossSell | **supplementWaitlist** | kit2CrossSell |
| `normal-testosterone` (Kit 1, no symptoms) | dailyStackZinc | — | **supplementWaitlist** | — |
| `normal-testosterone` (Kit 2/3) | dailyStackZinc | — | **supplementWaitlist** | — |
| `optimal-testosterone` | retestReminder | — | unchanged | — |
| `critically-low-vitamin-d` | dailyStackD3 | kit1CrossSell (if Kit2 + 40+) | **supplementWaitlist** | kit1CrossSell (unchanged) |
| `low-vitamin-d` | dailyStackD3 | kit1CrossSell (if Kit2 + 40+) | **supplementWaitlist** | kit1CrossSell (unchanged) |
| `elevated-crp` / `moderate-crp` (joints=yes) | collagen | — | **supplementWaitlist** (Collagen source_marker) | — |
| `elevated-crp` / `moderate-crp` (joints=no) | lifestyleGuidance | — | unchanged | — |
| `low-b12` | dailyStackB12 | kit1CrossSell (if Kit2 + 40+) | **supplementWaitlist** | kit1CrossSell (unchanged) |
| multi-deficiency branch | completeMensStack | kit1CrossSell (if Kit2) | **supplementWaitlist** | kit1CrossSell (unchanged) |
| GP block (`high-crp`, `low-ferritin`, `low-albumin`) | gpReferral | — | unchanged | — |
| `suboptimal-ferritin`, `ft-low`, `ft-normal`, SHBG, `normal` | unchanged | — | unchanged | — |

All Kit cross-sells, retest reminders, GP referrals, and lifestyle guidance CTAs survive untouched. Only supplement CTAs flip.

### 3.3 Results-engine + product docs

| File | Change |
|---|---|
| `04_products/results-engine/kit3-combined-result-rule.md` | Redraft as v1. Tier 2 secondary becomes waitlist; Tiers 3 to 4 primary becomes waitlist. §5 dashboard copy rephrases the "supporting these basics" line so it does not imply we have a buyable product today. v2 (post-supplements) added later. |
| `04_products/results-engine/results-to-product-mapping.md` | Replace supplement product columns with waitlist source_marker mapping. |
| `04_products/results-engine/biomarker-copy.md` | Adjust marker-level copy lines that name Daily Stack. |
| `04_products/results-engine/conversion-rules.md` | Update conversion targets (waitlist opt-in, not subscription start). |
| `04_products/CONTEXT.md` (results-engine trigger table) | Annotate Phase 0a vs Phase 0b CTA targets. |
| `04_products/kits/kit-2-energy-recovery-check.md` | Annotate the "primary driver of supplement subscriptions" strategic role with a Phase 0a footnote: in Phase 0a, Kit 2 drives waitlist opt-ins instead. Do not rewrite. |
| `04_products/kits/kit-3-hormone-recovery-check.md` | Same annotation. |
| `04_products/icp-kit-supplement-alignment-april2026.md` | Footnote only. |

### 3.4 Email sequences

| Sequence | Change | Files |
|---|---|---|
| seq-03a Energy Results | Replace supplement CTAs with waitlist CTAs in Emails 3 and 5 | `.md` + 2 HTML |
| seq-03b Low-T | Email 3 Daily Stack mention. Option A: replace with waitlist. Option B: remove the secondary entirely (FM list is the focus). Recommend B for v1, restore for v2. | `.md` + 1 HTML |
| seq-03c Normal Results | Replace Daily Stack CTA with waitlist | `.md` + 1 HTML |
| seq-03d Borderline T | Replace Daily Stack CTA with waitlist | `.md` + 1 HTML |
| seq-04 Subscriber Onboarding | No change. Inert in Phase 0a (trigger `subscription_started` cannot fire). Re-activates in Phase 0b. | none |
| **New:** T-10 Waitlist Confirmation | Build new transactional. Single email. Triggered by `supplement_waitlist_joined`. | `seq-07`-style |

### 3.5 Marketing / app pages

| Page | Change |
|---|---|
| `app/(marketing)/supplements/page.tsx` | Convert to "Coming soon" landing with `SupplementWaitlistForm`. |
| `app/(marketing)/supplements/daily-stack/page.tsx` | Same. Keep the product story (what it is, what it does). Subscribe button becomes the waitlist form. |
| `app/(marketing)/supplements/collagen/page.tsx` | Same. |
| `app/lp/daily-stack/page.tsx` | Same (this is the one currently dead-button-on-click). |
| `app/lp/collagen/page.tsx` | Same. |
| `app/lp/testosterone/page.tsx` | Audit for any supplement references; should be FM-list focused already. |
| `app/(marketing)/page.tsx` (home), `/how-it-works`, `/faq`, `/kits` | Sweep: remove any "and then subscribe to the Daily Stack" follow-ons or rephrase to "and we will recommend supplements; our own Daily Stack launches shortly, and you can join the early list at any time". |
| `canonical-site/supplements/*` (static mirror) | Either apply the same waitlist conversion, or add a meta-noindex + redirect to the live Next.js page. Cleaner to redirect. |
| `app/sitemap.ts` | Confirm supplement pages still indexable (yes, they are; just with new content). |

### 3.6 Affiliate / partner docs

This is the awkward one. These already exist as approved content:

- `06_marketing/affiliates/PT-Brief-v2.3.md` (CA-001, awaiting solicitor)
- `06_marketing/affiliates/PT-Attestation-v2.3.md` (CA-002, awaiting solicitor)
- `06_marketing/affiliates/Influencer-Brief-v2.3.md` (CA-003, approved)
- `06_marketing/affiliates/Influencer-Attestation-v2.3.md` (CA-004, approved)
- `06_marketing/affiliates/Gym-Partnership-Onepager-v2.3.md` (CA-005, approved)
- `06_marketing/affiliates/partner-activation-comms.md` (CA-006, approved)
- `06_marketing/affiliates/commission-structure.md`
- `06_marketing/affiliates/pt-programme.md`
- `06_marketing/affiliates/influencer-programme.md`

They all reference supplement subscription commissions in the partner economics.

**Do not reopen the approved CAs.** Instead: write one short Phase 0a addendum (`06_marketing/affiliates/phase0a-supplements-deferred-addendum-2026-05-23.md`) that says "between Phase 0a launch and Phase 0b (~2 to 3 months), partner commissions are kits only; supplement subscription commissions activate when the supplements ship, on the rates and rules already in the briefs". Forward to the existing partner cohort via a single seq message. CA-001/002 solicitor pass can ride this addendum in.

### 3.7 Customer-journey + strategic + marketing-plan docs

Footnote-only changes, no rewrites:

- `08_customer-journey/flows/flow-4-results-to-action.md`
- `07_sales/funnel/founding-member.md` (cross-link to the new supplement-waitlist mechanic)
- `07_sales/sales-gtm-context.md`
- `06_marketing/master-plan/phase0-marketing-plan.md`
- `06_marketing/master-plan/phase0-acquisition-strategy.md`
- `01_strategy/master-implementation-blueprint.md`
- `01_strategy/financial-model/option-4-financial-model-2026-05-08.md` (Phase 0a vs Phase 0b revenue lever note)

### 3.8 New CIO objects

| Object | Spec |
|---|---|
| Segment 25 "Supplement Waitlist" | `supplement_waitlist = true` (or filter on `event:supplement_waitlist_joined`). |
| Event `supplement_waitlist_joined` | Payload: `email`, `source_marker`, `source_kit`. |
| Identify traits | `supplement_waitlist: true`, `supplement_waitlist_source_marker`, `supplement_waitlist_source_kit`, `supplement_waitlist_joined_at`. |
| Transactional T-10 | Confirmation email triggered by the event. Plain Keith voice, no medicinal claim, restates the OTC option + the discount-on-launch promise. |
| Future broadcast | Manual, on supplement launch. Optionally segmented by source_marker (Daily Stack ships first → target VitD/B12/multi-deficiency source markers first). |

---

## 4. Decisions (logged 2026-05-23)

| Q | Decision |
|---|---|
| One list or per-product? | **DECIDED: one combined list**, three attributes (`source_marker`, `source_kit`, `interested_in_product`). The page→form mapping is in §2.1. |
| State a launch month or stay vague? | **DECIDED: vague.** "launches shortly" / "as soon as our manufacturing partner is confirmed". No specific month. |
| Promote the waitlist on `/kits` (pre-purchase) or post-result only? | **DECIDED: post-result only.** Pre-purchase mention only as a "we will also recommend supplements" reassurance, never as a CTA. |
| Phase 0a partner commissions on kits only or include the waitlist? | **DECIDED: kits only.** Documented in the Phase 0a partner addendum (§3.6). |
| Kit 2 economic case in Phase 0a? | OPEN, side note for the financial model rather than a blocker. To be revisited after the v1 build settles. |

---

## 5. Sequencing

**Phase 0a — pre-launch, blocking (this plan):**

1. Approve the waitlist mechanic (this doc). Keith.
2. Approve waitlist copy template + T-10. Ewa (new approval record CA-009).
3. Build supplement_waitlist table, API route, form component, get-status helper.
4. Rewire `classifier.ts` CTA matrix (§3.2) + apply the Kit 3 `DEFICIENCY_STATES` fix in the same commit, with the Kit 3 regression fixture.
5. Redraft `kit3-combined-result-rule.md` as v1 (waitlist secondary) and send to Ewa (new approval record CA-010).
6. Update remaining results-engine docs (§3.3).
7. Update email sequences seq-03a / 03b / 03c / 03d (§3.4).
8. Convert `/supplements/*` and `/lp/daily-stack` + `/lp/collagen` pages (§3.5).
9. Sweep home / how-it-works / faq / kits supplement mentions (§3.5).
10. Build CIO segment 25, event, transactional T-10.
11. Write partner addendum (§3.6) and queue for partner activation comms.
12. QA: full results → waitlist path end-to-end, all 8 affected result states.
13. Phase 0 launch.

**Phase 0b — when supplements ship (parallel doc, not in this plan):**

1. Create live Stripe products + Price IDs, add to Coolify.
2. Convert waitlist landing pages back to checkout pages (preserve the waitlist form as a secondary opt-in).
3. Rewire `classifier.ts` CTA matrix back to v2 (real supplement CTAs).
4. Restore email-sequence supplement CTAs.
5. Reactivate seq-04 (subscriber onboarding); confirm trigger fires.
6. Broadcast to segment 25, optionally segmented by source_marker.
7. Reactivate supplement-commission portion of partner programmes.

---

## 6. Risks

- **Already-signed CAs.** CA-001 to CA-006 reference supplement economics. Reopening them invites re-approval delays we cannot afford. The Phase 0a addendum is the workaround; the addendum itself needs Ewa + solicitor only for the parts touching CA-001/002 money clauses, which she is reviewing anyway.
- **Ewa bottleneck.** Ewa is already gating threshold sign-off (blocker #1), the Kit 3 combined-result rule, and a sub-set of partner-doc reapprovals. Adding the waitlist template and the redrafted Kit 3 rule increases her queue. Bundle the asks into one packet.
- **Trust risk if Phase 0b slips.** Waitlist customers expect supplements eventually. If sourcing slips beyond ~3 months, write a candid update broadcast to the segment. The vague-launch-date framing buys some headroom; do not abuse it.
- **Kit 2 unit economics in Phase 0a.** Kit 2 was the supplement-conversion engine. Its Phase 0a contribution margin is lower. Re-check whether to soft-deprioritise Kit 2 marketing spend in Phase 0a or accept the gap as a known cost of sequencing.
- **Dashboard cognitive load.** The post-result dashboard for a customer with two non-optimal markers now shows: card 1 (with waitlist CTA), card 2 (with waitlist CTA), card 3 (cross-sell or GP referral). Confirm the waitlist CTA dedupes across cards (single "Join the early-access list" CTA at the panel level, not one per card) to avoid CTA-spam. Spec the dedupe in §3.2 implementation.

---

## 7. Recommendation

Approve. The mechanic is small, copies a pattern that already works and is already compliance-approved, gives every dead-end customer segment a real next step, and keeps the launch on schedule. The downside is a manageable Ewa packet and one partner-comms addendum.

Estimated effort:

- 1.5 to 2 days engineering (DB + API + form + classifier rewire + Kit 3 fixture)
- 1 day copy (sequence updates + page conversions + T-10 + Kit 3 redraft + partner addendum)
- 1 to 2 days Ewa review + Keith sign-off
- 0.5 day QA

Critical path: Ewa review. Bundle the asks into one packet.

---

*Created 2026-05-23 · Owner: Keith Antony · Decision required to unblock Phase 0 launch.*
