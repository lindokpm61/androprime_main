# Kit 3 Plus — Men's Hormone, Recovery & Metabolic Check (DRAFT SPEC)

## Provisional Product Spec | V0.1 — 2026-05-26

**Owner:** Keith Antony
**Status:** **DRAFT — not approved, not specced for build, not priced.** Active workstream for T+1-2 week post-Phase-0 launch. Inputs from `kit-4-metabolic-health-check.md` (now superseded) — marker analysis, Vitall feasibility questions, and Ewa compliance gates carried forward.
> **Post-result cross-sell note (2026-07-08):** the "Kit 3 as Kit 1 upsell" framing referenced in this draft is superseded for **post-result** routing — Kit 3 is a front-of-funnel default, and a Kit 1 buyer's post-result cross-sell is **Kit 2** (the complement). The "Kit 1 → Kit 3 → Kit 3 Plus" ladder below is **product-tier breadth ordering**, not a post-result cross-sell path. See `results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`.

**Cross-references:**

- [[project-kit3-repositioning]] (memory) — the parent decision: Kit 3 repositioning + Kit 3 Plus deferred
- `kits/kit-4-metabolic-health-check.md` (superseded) — original Semrush demand evidence + Vitall question list + Ewa gate list
- `kits/kit-3-hormone-recovery-check.md` — Kit 3 Standard spec (unchanged by this doc)
- `icp-kit-supplement-alignment-april2026.md` — ICP and selling-frame source of truth
- `03_compliance/CONTEXT.md` — claim restrictions for metabolic / cardiovascular / pre-diabetes framing
- [[feedback-no-bespoke-clinician-interpretation]] — no per-customer GP interpretation; Ewa signs off the SYSTEM

---

## 1. Why Kit 3 Plus (the strategic case)

Two converging signals make this the right next product:

1. **Kit 3 Standard has a panel-breadth-vs-price gap.** £179 / 9 markers vs Medichecks Well Man Advanced at ~£139 / ~20 markers. The differentiator can't be panel breadth at the current spec, and (per [[feedback-no-bespoke-clinician-interpretation]]) it also can't be "GP-built per-customer interpretation" anymore. Kit 3 Plus closes the breadth gap without forcing a re-spec of Kit 3 Standard.
2. **The metabolic stack is the largest validated UK demand gap.** Semrush UK sweep (2026-05-26) — `hba1c blood test` 12,100 vol KD 46, `apob test` 590 vol KD 13, `homocysteine test uk` 260 vol KD 12, `cholesterol test at home` 1,000 vol KD 15, `fasting insulin test` 480 vol KD 15. ~18,000 combined vol/mo. No UK men-focused commercial specialist currently ranks. Full demand analysis in the superseded kit-4 doc §1.

Why a tiered SKU (Standard + Plus) rather than a new product line:

- One Vitall integration workstream, not two
- One LP family (`/lp/hormone-recovery` covers Standard, `/lp/hormone-recovery-plus` or `/lp/men-complete` covers Plus)
- Clean product-breadth tiering: Kit 1 (T only) → Kit 3 Standard (both panels) → Kit 3 Plus (adds metabolic), each a coherent breadth increase (tier ordering, not a post-result cross-sell path — see the 2026-07-08 note above)
- Avoids cannibalising the Kit 3 Standard launch — Standard ships first, Plus arrives once Standard is stable

---

## 2. Provisional product summary

| Field | Provisional value | Decision needed from |
|---|---|---|
| Product name | "Kit 3 Plus — Men's Hormone, Recovery & Metabolic Check" (provisional) | Keith |
| SKU position | Second tier under the Kit 3 product line | — |
| Tagline | "Everything Kit 3 tests, plus the metabolic markers your GP runs only when you're already sick." (provisional) | Keith + compliance pre-flight |
| Markers | All 9 Kit 3 markers + the metabolic stack (§3) | Ewa + Ben |
| Price | **£239 provisional** (Kit 3 + ~£60 marker uplift; final pending COGS) | Keith + Ben |
| Format | At-home finger-prick, **fasted morning sample required** | Ben — confirm dried-blood-spot viability for HbA1c, insulin, ApoB, Homocysteine |
| Lab partner | Vitall | Ben confirmation |
| COGS | TBD (request quote from Ben at locked marker stack) | Ben |
| Turnaround | Match Kit 3 (2-5 working days) | Ben |
| Results delivery | Andro Prime dashboard — adds metabolic recommendation logic + GP-referral CTA for out-of-range results | Existing dashboard + new logic (Ewa-signed) |
| Regulatory position | Wellness product. **No diagnosis. No "diabetic" labelling — flag elevated-risk with GP-referral, never call it diabetes.** | Ewa |
| Launch phase | **Phase 0 + 1-2 weeks** (after Phase 0 main launch is stable) | Keith — confirmed |
| Strategic role | Closes panel-breadth gap with Medichecks Well Man Advanced. Captures ICP 4 (high-performance seeker, currently unserved). Natural cross-sell from Kit 3 Standard buyers + retest cohort. | — |

---

## 3. Marker stack (carried forward from kit-4 §3)

**Kit 3 Plus = Kit 3 Standard (9 markers) + metabolic add-ons.**

**Kit 3 Standard markers (unchanged):**
Total Testosterone, SHBG, Free Androgen Index (FAI), Albumin, Free Testosterone, Vitamin D, Active B12, hs-CRP, Ferritin.

**Metabolic add-ons (V1 candidate set — Keith + Ewa + Ben to lock):**

| Marker | What it measures | NHS run for healthy adults? | Andro Prime differentiator |
|---|---|---|---|
| **HbA1c** | 3-month average blood sugar; pre-diabetes / diabetes risk | Sometimes (only if symptomatic) | Standard |
| **Fasting Insulin** | Insulin resistance (with glucose → HOMA-IR) | Rarely | YES — most home tests don't include |
| **Fasting Glucose** | Current blood sugar | Sometimes | Standard |
| **Total Cholesterol** | Cardiovascular risk | Sometimes (NHS Health Check 40+) | Standard |
| **HDL Cholesterol** | "Good" cholesterol | Sometimes | Standard |
| **LDL Cholesterol** | "Bad" cholesterol | Sometimes | Standard |
| **Triglycerides** | Fat in blood, metabolic syndrome | Sometimes | Standard |
| **ApoB** | The actual particle count carrying cholesterol — more predictive than LDL | **No, NHS does not test** | **STRONG DIFFERENTIATOR** |
| **Homocysteine** | Cardiovascular + cognitive risk marker | **No, NHS does not test** | **STRONG DIFFERENTIATOR** |

**V1 marker count: 9 (Standard) + 9 (metabolic) = 18 markers.** Resolves the breadth comparison with Medichecks Well Man Advanced (~20 markers).

**Open decisions (Keith + Ewa):**

- **Lp(a)** — genetic CV risk marker, NHS doesn't test, biohacker-favourite. Probably YES for V1 if Vitall COGS allows.
- **Liver markers (ALT, GGT, ALP, bilirubin)** — **DECISION: IN (locked 2026-05-30, hybrid liver play).** NAFLD ties directly to the metabolic story, and the standalone demand is large and underserved (`liver function blood test` 18,100/mo, SERP has no UK men's specialist). Per the hybrid decision these markers ship BOTH inside Kit 3 Plus (here) AND as a standalone low-price Liver Health Check — see `liver-health-opportunity.md`. Add to Ben's COGS request. Albumin is already in the Kit 3 panel.
- **TSH** — sometimes requested by ICP 4. Cleaner to reserve for Kit 5 Thyroid (per [[project-future-kit-opportunities]]).

---

## 4. Target ICP

**Primary (acquisition):** ICP 4 — High-Performance Seeker (currently unserved by any AP product).
- Age 35-50, tech/finance/founders, biohacker-adjacent, follows Attia/Huberman.
- Buying trigger: "ApoB" and "HOMA-IR" are language they actively use.
- ApoB inclusion is what attracts this ICP.

**Secondary (cross-sell):** Kit 3 Standard buyers at retest moment.
- M+3 or M+6 retest prompt offers Kit 3 Plus as the upgrade rather than identical Kit 3.
- Email sequence: T-09 retest variant for Kit 3 Standard buyers.

**Tertiary (direct):** ICP 3 — Curious Maintainer.
- Repositioned away from Kit 3 Standard in the upsell-only frame (per [[project-kit3-repositioning]]), Kit 3 Plus offers the genuinely-comprehensive proposition ICP 3 was reaching for.
- Validated SEO doesn't exist for ICP-3 direct queries — acquisition is paid + organic via metabolic-pillar content + direct LP traffic.

---

## 5. Compliance gates (Ewa decisions — drafted in kit-4 §5, carried forward)

| Risk area | Issue | Resolution path |
|---|---|---|
| "Pre-diabetes" framing | HbA1c 42-47 mmol/mol is pre-diabetic per NICE — can we say "your result suggests pre-diabetic range"? | Ewa to draft EFSA-compliant + ASA-safe language |
| Cardiovascular risk framing | ApoB / Homocysteine elevated → "your CV risk markers are elevated" vs "you have heart disease" | Ewa to draft hedged language with GP-referral CTA |
| Cancer-screening adjacency | Some HbA1c elevations correlate with pancreatic cancer risk — **MUST NOT mention** | Pre-flight HARD rule |
| Daily Stack cross-sell from metabolic results | Zinc / Vit D / B12 don't have EFSA claims for "metabolic health" — can we cross-sell? | Likely NO direct cross-sell. Route metabolic results to lifestyle guidance + GP-referral. Future metabolic-specific supplement is a separate product question. |
| Statin recommendation | LDL/ApoB elevated → cannot recommend statins (POM) | Hard rule — GP-referral only |
| TRT availability | Phase 0 boundary — metabolic kit must not imply TRT availability | Standard rule |

---

## 6. Operational feasibility (Ben at Vitall — drafted in kit-4 §6, carried forward)

Send Ben the email at `05_partners/labs/vitall/correspondence/2026-05-26-keith-kit-3-plus-feasibility-draft.md` (see workstream draft). Core questions:

1. Can Vitall run HbA1c on dried blood spot / capillary, or does it require venous draw?
2. Can Vitall run Fasting Insulin on capillary sample?
3. Does Vitall offer ApoB testing? Per-test cost addition?
4. Does Vitall offer Homocysteine? Cost?
5. Does the panel require fasted sampling? (If yes, what morning-collection guidance do we ship in the box?)
6. All-in COGS at the proposed marker stack?
7. Lead time to add new markers to existing dispatch route?
8. Can the Vitall integration handle a ~18-marker panel via the existing API?
9. New Vitall `shortCode` or extension of `andro-prime-combo-test`?
10. Result-delivery SLA — same 2-5 working days as Kit 1/2/3?

---

## 7. Open decisions for Keith

1. Confirm provisional name "Kit 3 Plus — Men's Hormone, Recovery & Metabolic Check" or amend.
2. Confirm V1 marker cut (specifically Lp(a), Liver markers).
3. Confirm price band — final pending Ben's COGS reply.
4. URL strategy — `/lp/hormone-recovery-plus`, `/lp/kit-3-plus`, or a fresh `/lp/men-complete` name. Affects FirstPromoter setup.
5. Quiz routing — when does Kit 3 Plus surface in the test-selector quiz (if at all)?
6. Retest sequence — Kit 3 Standard buyers offered Kit 3 Plus at retest vs identical Kit 3 retest. Probably yes, but copy needs drafting.

---

## 8. SEO content plan (if Kit 3 Plus launches)

Top hub candidates already in `keywords.csv` as `assigned_to=future-kit-metabolic`:

- `hba1c blood test` — 12,100 vol KD 46 (hub article)
- `apob test` — 590 vol KD 13 (anchor differentiator)
- `homocysteine test uk` — 260 vol KD 12 (anchor differentiator)
- `cholesterol test at home` — 1,000 vol KD 15 (commercial LP target)
- `fasting insulin test` — 480 vol KD 15 (HOMA-IR explainer)

Pre-launch, content can ship under existing Pillar D (markers explained) framing to seed demand, then re-route to Kit 3 Plus LP at launch.

After launch, update `keywords.csv` to reassign `future-kit-metabolic` rows → `lp-kit-3-plus` (or chosen LP slug).

---

## 9. Next actions (this workstream)

1. **Keith:** Confirm marker V1 cut + URL strategy (decisions §7 items 1, 2, 4, 5).
2. **Keith → Ben at Vitall:** Send §6 feasibility questions (email drafted at `05_partners/labs/vitall/correspondence/`).
3. **Keith → Ewa:** Send §5 compliance gates (email drafted at `03_compliance/correspondence/`).
4. **Once Ben's COGS returns:** Lock price band + update §2.
5. **Once Ewa's framing returns:** Draft dashboard recommendation copy + LP copy + pre-flight.
6. **Build:** new Vitall dispatch shortCode, classifier additions for metabolic markers, dashboard layout, Stripe product.
7. **Launch:** T+1-2 weeks after Phase 0 main launch — gated on Kit 3 Standard being stable and Ben + Ewa returning.

---

*Created: 2026-05-26 from the Kit 3 repositioning decision (see [[project-kit3-repositioning]]).*
*Owner: Keith Antony.*
*Status: Draft spec. Not approved. Not built. Not priced.*
