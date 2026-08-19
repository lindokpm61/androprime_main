# Products: Current State

Volatile status for the products workspace. Durable rules + routing are in `CONTEXT.md`. Update the date on each change.

_Last updated: 2026-08-20 (**SUPPLIER AVAILABILITY SOLVED FOR ALL FOUR SUPPLEMENT LOOPS**; the liver "no EFSA claim" assumption CORRECTED; the bottleneck on the loops has moved from the supplement side to the lab. Earlier: **Kit 1 marketing-page scope DECIDED**: split and route, delete nothing; copy drafted and pre-flighted, not shipped. Earlier: kit-1's FAI row corrected: it is returned by the lab, not calculated by us, and is reported without interpretation. Earlier: Vitall cost-vs-retail margin chart filed; stale retail table found in the v7 catalogue)._

---


## Supplement loops: supplier availability SOLVED, bottleneck moved to the lab (2026-08-20)

**Verified** against Nutribl's full trade catalogue (Keith's logged-in Tier 1 pricing, supplied 2026-08-20) and their published product pages. Not yet confirmed by a purchase or a sample: no order has been placed.

Every loop in `supplements/biomarker-supplement-loops.md` now has a stock product, a price and a 4-to-5-working-day lead time at MOQ 10. The full table is in that doc under "Supplier availability: SOLVED for every loop". Headlines:

- **Omega-3 Index → EPA/DHA**, the loop that doc ranks strongest, is available off the shelf: Vegan Omega 3 Algal Oil, 90 softgels, GBP 9.73, giving DHA 400 mg + EPA 200 mg per 2 softgels. This had been assessed as unbuildable the previous day against Rawcreation, who run dry powders only.
- **Two Daily Stack actives match our spec exactly**: B12 Methylcobalamin 1,000 mcg (GBP 3.95 / 120 caps) and Vitamin D3 4,000 IU (GBP 3.00 / 365 tabs). KSM-66 is stocked at 500 mg against our 600 mg. **Zinc is the only gap**: they carry citrate and bisglycinate, never gluconate.
- **Indicative Daily Stack ingredient cost is about GBP 5.01/month** buying the four actives as separate finished private-label products, against a modelled COGS of ~GBP 8. Ashwagandha is ~62% of it. **Inferred from finished-product retail-ready prices, not a blend quote** — a custom blend carries its own setup, MOQ and stability costs and has not been quoted.
- **Selenium is the right form and the wrong dose**: L-selenomethionine at 200 µg against our ~100 µg spec, and the diabetes signal at 200 µg is already noted in the loops doc. Needs a 100 µg run.

**What is now blocking each loop is a marker, not a manufacturer.** Open with Ben at Vitall, draft written this session at `../05_partners/labs/vitall/correspondence/2026-08-20-keith-omega3-index-and-tsh-feasibility-draft.md`, **not sent**:

- **Omega-3 Index on dried blood spot, plus COGS.** Outstanding as next-step (a) in the loops doc since 2026-05-30, never actioned. Now the only blocker on that loop.
- **TSH feasibility for Kit 5 Thyroid.** Bundled into the same draft. Kit 5's sequence was locked 2026-05-27 and **still has no spec doc**.

## Liver Health Check: the "no EFSA liver-supplement claim" assumption was WRONG (2026-08-20)

`kits/liver-health-opportunity.md` recorded the Liver Health Check as "NOT a ... supplement driver (no EFSA liver-supplement claim)". **Choline carries an authorised claim for the maintenance of normal liver function**, at a condition of 82.5 mg per serving, and Nutribl's Liver Support Choline Complex is formulated to exactly that threshold. **Verified** against the product's own nutrition panel; the claim's existence is asserted from the authorised-claims register and should be re-checked by Ewa against the register text before any use.

That line now carries a correction banner. **This is a correction, not a green light**: our stated route for elevated liver markers is a GP referral, only the choline in that 12-ingredient blend carries a claim, and selling a supplement off a raised ALT is an **Ewa gate**. Recorded so the assumption stops propagating, not so the product gets built.

---
## Kit 1 fatigue framing on the marketing pages: DECIDED, split and route (2026-08-15)

Open since 2026-08-02. Full decision, the four located instances and the drafted copy:
[`2026-08-15-kit1-scope-marketing-pages-decision.md`](./2026-08-15-kit1-scope-marketing-pages-decision.md).

- **The contradiction:** `CONTEXT.md` §5 and CA-025 scope Kit 1 to testosterone only, and that rule is
  **live in the results engine** behind `KIT_SCOPE_NOTE_ENABLED`. Four marketing pages sell Kit 1 as
  the fatigue answer anyway: `/kits/testosterone` (L264, L281-282), `/lp/testosterone` (L254,
  L271-272, and it is the **paid-ad** LP), `/kits` (L226), `/` (L358).
- ✅ **Decision: apply the CA-033 remedy one layer up.** Narrow the Kit 1 copy to the hormonal
  presentation and add an explicit routing card handing the fatigue reader to Kit 2, exactly as CA-033
  split the quiz option and added value `d` rather than rewriting the map. **Deleting the words was
  rejected**: it strips the hook from the highest-intent page and leaves the fatigue reader routed to
  Kit 1 anyway, which is the negative-review scenario `CONTEXT.md` names.
- **The replacement wording already ships on our own site.** `/kits` L287, the **Kit 2** row, reads
  *"If the issue is hormones, Kit 1 or Kit 3 is the better fit."* The Kit 1 entries get the mirror of
  it, so this is a claim reduction on approved-direction wording rather than new claims copy.
- **Ewa NOT required**, on the CA-033 reasoning exactly: the remedy removes the out-of-scope outcome
  rather than accepting it, so the CA-025 clinical question does not reopen. `compliance-preflight` on
  the extracted customer copy: **0 HARD / 0 REVIEW**, zero em dashes.
- ✅ **APPLIED AND VERIFIED 2026-08-15 (Keith's go).** All four pages edited, `tsc --noEmit` exit 0,
  `compliance-preflight` **0 HARD** (2 REVIEW, both pre-existing homepage items, confirmed against the
  diff). **Checked in a real browser render, not asserted from the diff**: all four pages 200, the new
  strings present and `exhausted by 3pm` / `brain fog` / `low energy, low drive` / `essential for men
  experiencing fatigue` all gone, 0 failures. Screenshots read as images at 1400px and at a true 390px
  mobile viewport with no horizontal overflow. `test-quiz-routing.ts` 21/21, `test-kit-cta.ts` clean.
  ⚠️ **Working tree only, not pushed, therefore not deployed.**
- 🔴 **Found while verifying, unrelated:** the dev server on `localhost:3000` **500s on every page**,
  including four this change never touched. A clean server on another port serves all four at 200.
- 🔜 **Flagged, not decided:** `/kits/testosterone` L503 offers Kit 3 (£179) as the sideways option
  where Kit 2 (£119) is the complement under the 2026-07-08 complement rule. Offering only the dearer
  kit to a reader we have just sent elsewhere reads as an upsell. Kit-ladder question, not a scope one.
- ⚠️ **The recommendation worth more than the copy fix:** CA-033 shipped 21 assertions so no fatigue
  combination can return Kit 1 again. **Prose has no equivalent guard, and four weeks of drift on an
  approved rule is exactly what that absence looks like.** A string-level check is proposed in the doc.

## kit-1's FAI row said the opposite of what the product does (2026-08-12)

Found by the carousel per-post pre-flight, ruled by Keith the same day (**CA-034 item K1**).

`kit-1-testosterone-health-check.md` line 72 described Free Androgen Index as *"calculated"* and as giving *"clinical picture beyond Total T alone"*. Both halves were wrong, and the second was already recorded in the repo as contradicting `thresholds.md`.

- **It is not calculated by us.** `05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md:26`: *"FAI is returned by Vitall, we do not calculate it"*, reference range 35.0 to 92.6%. It is priced into the Kit 1 all-in lab cost.
- **It is deliberately not interpreted.** `frontend/lib/results/classifier.ts:295` maps it to a dedicated `fai-reported` state whose customer copy reads *"Reported for reference, not interpreted"* and says in terms that in men it is not a reliable stand-in for free testosterone. It returns no CTA and is excluded from vetoing an all-clear.

**Ruling (Keith, 2026-08-12): FAI stays on the panel.** The lab returns it, the customer receives the value, we simply draw no conclusion from it, and it has been advertised. **Nothing was deleted and no marker left the advertised list.** The row now states the arithmetic (ratio of total T to SHBG) and the reporting position, matching the engine's own wording.

**The same framing was live on the Kit 1 landing page** and is fixed there too, recorded in `09_website-app/STATE.md`: the sample report card showed FAI with a `Borderline` verdict badge on the one marker the engine refuses to grade.

---

## Vitall cost vs retail margin chart, and a stale price table it exposed (2026-08-09)

**Chart:** [`pricing/2026-08-09-vitall-cost-vs-retail-margins.html`](pricing/2026-08-09-vitall-cost-vs-retail-margins.html).
Published (private) at `https://claude.ai/code/artifact/8856f106-e81d-400d-9e04-129ff29652d8`.
First file in `04_products/pricing/`, which existed empty until now.

**Figures, taken from the two authoritative sources rather than the doc layer.** Lab cost from the signed
Vitall services agreement 2026-06-02, Schedule 1 §5; retail from `09_website-app/frontend/lib/pricing.ts`,
which is what actually charges the customer.

| Kit | Vitall | Retail | Gross | Margin | After 2.5% card fee | Via affiliate code |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Testosterone | £58.50 | £99 | £40.50 | 40.9% | £38.02 (38.4%) | £13.37 (15.0%) |
| 2 Energy & Recovery | £63.00 | £119 | £56.00 | 47.1% | £53.03 (44.6%) | £26.42 (24.7%) |
| 3 Hormone & Recovery | £98.00 | £179 | £81.00 | 45.3% | £76.53 (42.8%) | £34.07 (21.1%) |

**Kit 2 is the best-margin kit, not Kit 3.** Kit 3 earns the most cash per sale (£81) and Kit 2 keeps the
largest share of its price (47.1%). **Affiliate Kit 1 is close to marginal at £13.37**, and a single £12
replacement kit would take almost all of it.

**CLOSED same day by a decision sweep (2026-08-09).** Keith: suspend the old pricing table, and no
reference to the old prices is to be used. Decision doc: [`2026-08-09-v71-pricing-suspended.md`](2026-08-09-v71-pricing-suspended.md).

**The live customer-facing surface was clean and that was verified, not assumed.** A grep for every
suspended figure across `09_website-app/frontend` (excluding build output) returns no kit pricing at all,
only the unrelated £29.95 collagen subscription. The v2.2 site migration is genuinely finished; its audit
doc is history rather than open work.

**One file carried all of it.** `catalogue/non-regulated-tier-v7.md` presented the transitional
£89 / £99 / £149 as current retail in three unmarked tables (§5.1 margins, the 6-month revenue table, and
the V7.1-to-V7.2 variance table) and stated V7.1 prices as bare `Price:` fields in two product sections.
Now carries a file-level suspension banner, and every superseded figure is struck through with the live
value beside it. Struck spans are the existing convention and `content-doctor` I7 already masks them, so a
suspended price cannot be read as a live assertion by a person or by tooling.

**It was also wrong on its own terms, which the sweep only found by reading rather than grepping:** Kit 2's
price was given as £99 (canonical is £119) and described as "updated from £35", which is Kit 1's old
standard price, not Kit 2's £44. Both corrected in place.

**Deliberately left as labelled history**, and flagged for Keith rather than removed: `Was (V7.1)` columns
in `kits/kit-1-launch-guide.md`, and `(was £44 — v2.2)` annotations in `07_sales/sales-gtm-context.md` and
`01_strategy/master-implementation-blueprint.md`. Each leads with the live price and names the old one as
superseded, so it records the change rather than offering a usable price. Say the word if those should go too.

**NOT verifiable from the repo:** two-kit bundle pricing. `lib/bundles/config.ts` holds Stripe price IDs in
env vars by design (single-swap reprice pending the Van Westendorp read), so the live bundle prices are not
in source and are deliberately absent from the chart. A code comment references a "£169/£199/£259 bundle
reprice decision at n≈50"; that is a comment, not a price.

---

## Ewa ruled on all five open band questions, and two new upper bands are built (2026-08-07)

**Decided by Dr Ewa Lindo, 2026-08-07, by email**, put to her with Vitall's per-assay reference ranges
beside each band, which is what she did not have on 2026-06-16. Her answers verbatim:

| Question | Ewa | Outcome |
|---|---|---|
| Active B12: our NG239 25/70 vs the assay's own 37.5 cut | "Keep NICE NG239" | No change; re-ratified with 37.5 visible |
| Ferritin high band: our `>300` vs the lab's 442 ceiling | "Keep 300" | No change; re-ratified with 442 visible |
| High testosterone (no band existed) | "over 29+" | **New band `> 29` → GP referral** |
| The redrafted FAI report-only wording | "wording is fine for now" | Approved. Her "for now" is preserved; treat as provisional |
| Upper bands for Vitamin D / Albumin | Vitamin D yes, Albumin no | **New band `> 250` → GP referral**; albumin left open |

On Vitamin D she specified the shape, not just the number: *"can we treat >250 nmol/L as a high/clinical
review flag rather than just a technical out-of-range result?"* So it is a GP-block state, which also
suppresses every supplement CTA on that card. That matters here more than anywhere, because the card it
suppresses is the one offering our own 4,000 IU D3.

**Card copy for both new states is DRAFTED, NOT APPROVED.** She gave numbers and routing; the wording was
put to her as her call and she sent none. A reply asking for a line on each is drafted in Gmail, unsent.
Both blocks are marked pending in `biomarker-copy.ts` and in `thresholds.md`.

Full record, including the four range-comparison rows that previously read "conflicts" or "no high band
exists": `results-engine/thresholds.md`.

## The results-engine badge vocabulary is written down for the first time (2026-08-07)

`results-engine/dashboard-copy.md` was an empty placeholder ("Placeholder item 1"). It now holds the six
status-badge labels, what each applies to, and the outline-versus-filled rule. **"Optimal" is retired as
the label for merely in-range (Keith, 2026-08-07)** because it contradicted our own `myth-of-normal-range`
article on the page where it matters most; it survives on testosterone alone, where the `>20` band is a
signed positive-framing product choice. In-range markers now read "In range". The rest of the dashboard
copy is still owed and listed in that file.

## `thresholds.md` now carries its assay provenance; the hs-CRP question was re-opened twice for want of it (2026-08-04)

`results-engine/thresholds.md` bands on assay identities (hs-CRP not standard CRP, Active B12 as holotranscobalamin, albumin measured not assumed) that were **confirmed in writing by Vitall on 2026-04-30** and recorded in `05_partners/labs/vitall/correspondence/2026-04-30-ben-service-agreement-thread.md`. The thresholds file cited none of it: zero references to Ben, Vitall, or any correspondence. It said only "confirm against Vitall's assay", with no indication whether that had already happened.

**Consequence:** the CRP assay was surfaced as an open, material risk twice, and on the second occasion was one step from an email asking Vitall to re-confirm something they had answered three months earlier in reply to a question that named the exact distinction ("hs-CRP, not standard CRP"). Keith caught it both times from memory.

- **Added:** an assay-provenance table at the head of `thresholds.md`, citing the 2026-04-30 confirmation and the 2026-07-20/21 unit confirmations, with the Gmail thread ID.
- **Deliberately NOT closed:** the reference-range items. Ben has confirmed marker identity and units; he has **never** supplied per-assay reference ranges. SHBG (code still carries a generic 17–55 fallback against Ewa's 2026-06-16 ruling 7 "match the lab assay"), Active B12's NG239 range, and Vitall's albumin range behind `<35` all remain genuinely owed. The new note says so explicitly so the table is not misread as closing them.
- **Noted, not fixed:** `thresholds.md` still carries the pre-approval sentence "they have never had a documented clinical sign-off, which is why this task is open" directly under a header reading "Status: ✅ APPROVED — Dr Ewa Lindo, 2026-06-16". Same class of stale artifact; left for whoever next touches the file with Ewa.

Sweep context and the parallel shelf-life finding: `01_strategy/STATE.md` (2026-08-04 entry).

---

## Supplement formulation: PROPOSED changes (the two zinc items RULED 2026-08-02; the rest still UNAPPROVED)

From `supplements/formulation-evidence-review-2026-07-02.md` (RCT/meta evidence base). **Except where marked APPROVED or DECLINED below, nothing here is approved.** Live specs stand; every dose/form change needs **Ewa (safety + claims) + manufacturer sign-off**. Trials inform the product, not the claims (EFSA list still governs all copy).

### Daily Stack (capsules)

- ✅ **Zinc 30 mg → 25 mg — APPROVED (Ewa, 2026-08-02, email).** 30 mg exceeds the EU supplemental UL of 25 mg. Gluconate form fine. **Applied the same day** to `supplements/daily-stack.md` and to all three site surfaces (`lp/daily-stack` ×2, `supplements/daily-stack`); the site had been publishing 30 mg. Logged under CA-030.
- ❌ **Add copper — DECLINED (Ewa, 2026-08-02):** _"25mg zinc low enough."_ The depletion rationale was put to her alongside the reduction and she ruled the lower dose removes the need. **Consequence: the clean 4-active spec holds, so Gate 0A's capped-downside condition is undisturbed.** Note this doc said ~1 mg and `supplements/daily-stack.md` said ~2 mg; the discrepancy is now moot, but do not re-propose either figure without new evidence.
- **Vitamin D3: keep 4,000 IU.** Best-evidenced cofactor is **magnesium** (Dai 2018), NOT K2. ⚠️ See the K2 + magnesium open decisions below.
- **Active B12: keep 1,000 mcg methylcobalamin** (already optimal; do NOT upgrade to 5,000 mcg; no added benefit). Keep "active form" positioning but never claim clinical superiority over cyanocobalamin.
- **Ashwagandha KSM-66: keep exactly 600 mg** (validated dose). See the hepatotoxicity safety flag below.

### Joint & Recovery Collagen (powder): biggest fixes

- **Pick one lane (open decision):** **A** = UC-II 40 mg standalone (best-matched evidence for active men + exercise-induced joint discomfort; drop hydrolysed collagen) **or B** = hydrolysed collagen 10 g + fix MSM + HA (remove UC-II). **Do NOT ship both at current doses**: UC-II 20 mg + hydrolysed is the one configuration with a failed RCT behind it (Sci Rep 2025, null).
- If lane B: **MSM 500 mg → 3 g** (500 mg is sub-therapeutic; no RCT supports it) and **HA 5 mg → ~80–120 mg** (5 mg has no oral RCT support).
- Vitamin C 80 mg: keep (adequate cofactor).
- **Free upgrade:** add a **"take ~1 h before training"** usage instruction (Shaw 2017: collagen + vit C pre-exercise drives tendon/ligament synthesis). Evidence-based, costs nothing.

### Pipeline loops (pre-launch, not built)

- **Omega-3:** rTG form, 2 g EPA/DHA, EPA-forward ratio. Frame around triglycerides / Omega-3-Index correction + mood: **NOT** heart-disease prevention (primary-prevention CV trials null). Vegan algal SKU is a softgel (Rawcreation can't make it).
- **Thyroid (Se + I):** **selenomethionine ~100 mcg** (not selenite; 200 mcg has a diabetes signal). **Reconsider/minimise iodine**: high-dose iodine can flare autoimmune thyroiditis in exactly the target population. Ewa gate mandatory.
- **Homocysteine B-complex:** **5-MTHF (methylfolate) 400–800 mcg** + **B12 methylcobalamin 250–500 mcg** + **token B6 only**. Marker/retest framing only: hard clinical endpoints are null.

## Product-safety flags: require Ewa review

These are real product-safety issues (silent externally, but material for formulation/label sign-off):

- **Ashwagandha hepatotoxicity**: NIH LiverTox rates it a "probable" cause of liver injury (score C); 2023 case series; trials only ran 8–12 wks. Consider a liver caution + duration/cycling note.
- **Omega-3 → atrial fibrillation**: dose-dependent (Gencer 2021 meta HR 1.25; >1 g/day HR 1.49). At 2 g the risk is intermediate but non-zero: add a label caution for anyone with prior AFib/palpitations.
- **B6 neuropathy**: EFSA cut the UL to **12 mg/day (2023)**; keep total B6 well under it (the 25–50 mg in old trials is unsafe for chronic use).
- **Folic acid → prostate-cancer signal** (Figueiredo 2009, HR 2.63): a specific reason to use **5-MTHF at modest dose, never high folic acid** in a male product. (Folic acid also masks B12 deficiency; dose B12 adequately.)

## Open decisions (Keith / Ewa)

1. **Collagen lane**: UC-II standalone (A) vs hydrolysed route (B). Biggest single decision; blocks MSM/HA dosing.
2. **⚠️ K2 contradiction in the source doc**: the evidence row says K2 is speculative/marketing with a possible-harm hint and "never claim K2 is needed"; the doc's own Priority-changes list says "add K2 100 mcg." Resolve. Evidence-based default = **do not add K2**; if any D3 cofactor, magnesium is the supported one.
3. **⚠️ Magnesium vs V7.2**: magnesium is the best-evidenced D3 cofactor, but V7.2 *removed* Mg from the Daily Stack (a marketing-logic call: no kit trigger, and Mg is unreliable on finger-prick per the haemolysis constraint). Reconcile the formulation-science case against the removal decision.
4. **Iodine** in the thyroid loop: include at all? Safety liability in the autoimmune-thyroid target population.
5. **Ashwagandha**: duration/cycling policy + liver caution wording.

## Results-engine & product decisions: recent status

Recent swept decisions now reflected in `CONTEXT.md`; live/sign-off status tracked here.

- **2026-07-08: post-result cross-sell = complement, not superset (LIVE in `classifier.ts`).** A normal-T Kit 1 result cross-sells **Kit 2** unconditionally (the old `energy_symptoms` gate was removed); Kit 2 → Kit 1 stays gated (multi-deficiency, or Vit-D/B12 deficiency at age ≥40); Kit 3 carries no post-result kit cross-sell and is now a front-of-funnel default only. Classifier suite green, tsc + build clean. Decision: `results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`.
- **2026-07-09: Gate 0A criteria RESTATED** (canonical in `01_strategy/CONTEXT.md` → "Gates Reference"). The old "25+ supplement pre-orders" bar is retired; 0A is now a capped-downside spend authorisation (first-run exposure capped ~£5,950, small MOQ, clean 4-active spec). The "not ordered until Gate 0A" rule is unchanged; only the criteria that define 0A moved.
- **2026-07-17: retest cadence table drafted (PROPOSED, pending Ewa sign-off).** All-clear (Bucket C) cadence is **6–12 months** (already agreed and live on the marketing site; the dashboard button's "3 months" and card copy's "3–6 months" are drift to correct down to it). Bucket B ("acting on a finding") retest is ~3 months; Bucket A (GP-routed) carries no Andro Prime interval. Two narrow items still need Ewa's tick before the feature is customer-facing: the red-flag GP-first line, and the symptom → panel wordings. Nothing ships against any row until Ewa signs. Table: `results-engine/2026-07-17-retest-cadence-table.md`.
