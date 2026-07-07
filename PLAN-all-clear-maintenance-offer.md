# PLAN: All-Clear Maintenance Offer — Build Dark, Prep Ewa Sign-Off

**Rank:** 5 of 5
**Type:** Copy draft + compliance pre-flight + dark code build (feature-flagged OFF)
**Effort:** ~4-6 hours
**Dependencies:** none hard. Ships (flag ON) only after Ewa signs off — this plan makes that sign-off a 15-minute yes/no.

---

## Goal

The single largest attach-rate lever in the funnel is currently unaddressed: customers whose results come back all in range get **no supplement CTA at all** (flow-4: Normal Vit D → no CTA, Normal B12 → no CTA, T > 20 → no CTA). That is the *largest* Kit 2 segment, so the biggest buyer group has a structural ~0% attach. `07_sales/funnel/supplement-conversion.md` ~21-29 defines the fix: reframe all-clear as **maintenance** using exact EFSA-approved claims ("contributes to the maintenance of normal testosterone levels" etc.), and it explicitly says this needs Ewa + compliance sign-off before shipping — "a claims and positioning decision, not a copy tweak."

This plan does everything except the sign-off: draft the copy, pre-flight it, build the CTA branch dark behind a flag (default OFF), add the two measurement events the doc requires, and produce a one-page sign-off pack so the pending Ewa session can approve it on the spot. Canonical attach target: ≥15% of kit buyers (locked 2026-07-02).

## Read FIRST

1. `andro-prime/03_compliance/CONTEXT.md` — full file. Copy the **exact** EFSA-approved claim wordings from its allowlist; you may not paraphrase an EFSA claim.
2. `andro-prime/07_sales/funnel/supplement-conversion.md` — full file (the spec, the thesis tension at ~29, measurement at ~33-42).
3. `andro-prime/08_customer-journey/flows/flow-4-results-to-action.md` — Part C mechanics.
4. `andro-prime/04_products/supplements/daily-stack.md` — the formulation: which nutrients are actually in the product (claims may only attach to ingredients present, and never the silent ingredient).
5. `andro-prime/02_brand/CONTEXT.md` + `02_brand/messaging-framework.md` — voice. **No em dashes anywhere in customer-facing copy.**
6. Code: `frontend/lib/results/classifier.ts` (CTA registry ~20-74, `resolveCtas()` ~224, `isTestosteroneAllClear()` ~131), `frontend/lib/results/types.ts` (CtaType union), `frontend/components/results-engine/ResultRecommend.tsx` (kit-2-cross-sell render branch ~57 — your model to copy).

## Step 1 — Claims mapping table (foundation for everything else)

Build a table: in-range marker → Daily Stack nutrient → **verbatim** EFSA claim from the compliance allowlist. Examples of the right shape (verify each against the allowlist; do not trust this plan's memory): vitamin D → maintenance of normal bones/muscle function/immune function; B12 → reduction of tiredness and fatigue; zinc → maintenance of normal testosterone levels. Only markers the kit actually measured and only nutrients actually in the formulation. **Ashwagandha is never named, hinted at, or claimed for — anywhere.**

## Step 2 — Draft the copy

Create `andro-prime/07_sales/funnel/all-clear-maintenance-offer-copy.md`, status header "DRAFT — pending Ewa + compliance sign-off; built dark behind flag". Contents:

- Dashboard CTA card: headline, 2-3 body lines, button label. Positioning: "your levels are good, here is how to keep them there" — maintenance, never deficiency, never fear. Must not imply the customer needs treatment or that anything is wrong.
- One optional supporting line for the seq-03c normal-results email (note: seq-03c already carries a "Normal doesn't mean optimal" angle — read `email-templates/sequences/seq-03c-normal-results.md` and align tone; do NOT edit that approved sequence itself).
- Every claim sentence footnoted to a row of the Step 1 table.
- Phase 0a button destination: the supplement **waitlist** (`/supplement-waitlist`) — see edge case 1.

Run the `/compliance-preflight` skill on the draft; record its findings in the file and fix them.

## Step 3 — Build dark

1. `types.ts`: add a new CtaType `'maintenance-offer'`. (Do NOT confuse this with the separate, unbuilt `kit-3-cross-sell` engine gap noted in `09_website-app/STATE.md` — leave that alone.)
2. `classifier.ts`: add a `maintenanceOffer` CTA to the registry and a branch in `resolveCtas()` for the all-clear path. Define all-clear precisely from the existing state helpers: every measured marker in its normal band — for Kit 1/3, `isTestosteroneAllClear()` true and nothing borderline; for Kit 2, all energy markers normal. The branch must sit AFTER (lower priority than) every GP-block/GP-referral check — study the existing priority ordering in `resolveCtas()` and match it.
3. Feature flag: environment variable (e.g. `MAINTENANCE_OFFER_ENABLED`), default OFF/absent → classifier never returns the CTA. Follow whatever config pattern the codebase already uses for env flags (check `next.config.ts` / existing `process.env` usage; use a server-side read if the classifier runs server-side).
4. `ResultRecommend.tsx`: render branch modeled on the `kit-2-cross-sell` branch (~57), using the approved copy file's text.
5. Events (names must match the spec at supplement-conversion.md ~38-39 exactly): `supplement_offer_shown` fires when the card renders; `supplement_offer_clicked` on button click. Emit through the existing first-party events + GA4 pattern — find how current results-dashboard events are emitted and copy that mechanism. Include a property distinguishing segment (`all_clear`) so attach can later be measured per segment (deficiency vs all-clear vs low-T). Events fire only when the flag is ON.

## Step 4 — Tests

Fixtures exist in `lib/results/fixtures/`. Add: (a) all-clear result + flag ON → maintenance CTA returned/rendered; (b) flag OFF → identical output to today (zero diff in behaviour); (c) low-T, borderline-T, GP-block, and any-deficiency states NEVER get the maintenance CTA regardless of flag. Run suite, typecheck, build.

## Step 5 — Sign-off pack

Create `andro-prime/07_sales/funnel/all-clear-offer-signoff-pack.md`, one page:

1. The CTA copy verbatim.
2. The claims mapping table.
3. The thesis tension, quoted from supplement-conversion.md ~29, so Ewa sees the counter-argument (does offering supplements to healthy customers undercut the "honest diagnostics" brand?).
4. What happens on "yes": flip the env flag + deploy (one-line change, no new code).
5. What happens on "no": nothing ships; code stays dark; zero customer impact.

## Step 6 — Doc layer + commit

1. `supplement-conversion.md`: update the all-clear section status — "Copy drafted + pre-flighted, CTA built dark behind MAINTENANCE_OFFER_ENABLED (default off), events wired. Pending: Ewa sign-off (see all-clear-offer-signoff-pack.md)."
2. `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`: annotate (do not tick) the "[BUILD] All-clear maintenance offer branch" and the two attach-event items — "(built dark 2026-07-XX, pending Ewa sign-off)".
3. `09_website-app/STATE.md`: add the dark build + flag under DRAFT/owed; bump date.
4. Commit to main, explicit paths only: `feat(results): all-clear maintenance offer built dark behind flag + attach events; copy pending Ewa sign-off`.

## Edge cases a weaker model would miss

1. **Phase 0a has no purchasable supplements** — the Stripe subscription route deliberately returns 400 until Phase 0b. The CTA button must go to the existing supplement waitlist page (`/supplement-waitlist`, event `supplement_waitlist_joined`, CIO segment 24), NOT to a checkout. The one-click Stripe sub version is a Phase 0b follow-up; do not build it.
2. **All-clear ≠ "not low-T".** Borderline testosterone (12-15 band) is its own state with its own nurture (seq-03d); it must not receive the maintenance offer. Same for any GP-block state — note that critically-low vitamin D and high ferritin route to GP referral (recent ruling, commit 16d7a4d); those are GP paths even though they're "energy" markers.
3. **EFSA claims are verbatim or nothing.** "Supports healthy testosterone" is a prohibited paraphrase; the approved form is "contributes to the maintenance of normal testosterone levels". Pull exact strings from the compliance allowlist.
4. **Never "referral" wording in any supplement→TRT-adjacent copy** (strategy STATE rule), and never name the silent ingredient.
5. **Kit 1 measures only testosterone** — its all-clear card can only carry T-maintenance-relevant claims (zinc etc.). Kit 2 has no T marker — its card leads with vitamin D/B12 claims. Build the copy per kit, or write one card whose claims block is selected per kit type; state which approach you took.
6. **Flag OFF must be provably inert** — that is test (b). If the flag plumbing can't guarantee zero behaviour change when off, stop and simplify until it can.
7. **Do not edit seq-03c** (approved, activation-ready under CA-020). The optional email line goes in the sign-off pack as a proposal only.

## Acceptance criteria

- [ ] `all-clear-maintenance-offer-copy.md` exists: pre-flight run, findings addressed, claims all footnoted to the mapping table, no em dashes, no silent ingredient.
- [ ] `all-clear-offer-signoff-pack.md` exists and fits one page.
- [ ] Flag OFF: test proves output identical to current behaviour; build + typecheck + suite pass.
- [ ] Flag ON (local only): all-clear fixtures show the card; low-T/borderline/GP-block/deficiency fixtures never do.
- [ ] Events named exactly `supplement_offer_shown` / `supplement_offer_clicked`, only firing when flag ON, carrying a segment property.
- [ ] supplement-conversion.md, tier2 backlog annotations, and 09_website-app/STATE.md updated with bumped dates; nothing ticked as done that isn't.
- [ ] Nothing deployed; flag defaults OFF; one commit on main staged by explicit paths.
