# Sales — Context

**Read before any funnel, lifecycle, or sequence work:**

1. `../04_products/icp-kit-supplement-alignment-april2026.md` — defines the correct trigger logic, cross-sell direction, supplement copy hooks, and the retest loop mechanic. Supersedes V7 product docs on all conversion and CTA decisions.
2. `../06_marketing/positioning/product-marketing-context.md` — master marketing context. Read before any skill file.
3. The relevant skill context file (see Skill Context Files table below).

**Owner workspace:** `07_sales`
**Integration:** Funnel logic defined here drives the trigger rules in `/04_products/results-engine/`, the email sequence build in `/09_website-app/frontend/email-templates/`, and the CRM automation structure in `/09_website-app/automations/`. Changes to funnel stages or conversion rules must be reflected in those workspaces.

This workspace defines conversion logic, lifecycle stages, CRM structure, and post-click movement through the funnel. Email sequence copy lives in `/09_website-app/frontend/email-templates/` — this workspace defines the logic and trigger rules those sequences must follow.

---

## Directory Structure

```text
07_sales/
├── growth-retention-context.md   ← Skill context: referral-program, churn-prevention, free-tool-strategy
├── sales-gtm-context.md          ← Skill context: revops, sales-enablement, launch-strategy, pricing-strategy
└── funnel/
    ├── kit-purchase.md            ← Kit purchase funnel: first touch → order → dispatch → flow-4 handoff
    ├── supplement-conversion.md   ← Supplement attach logic + trigger rules (+ all-clear maintenance offer)
    ├── all-clear-maintenance-offer-copy.md  ← All-clear maintenance CTA copy (DRAFT, pending Ewa)
    ├── all-clear-offer-signoff-pack.md      ← One-page Ewa sign-off pack for the all-clear offer
    ├── founding-member.md         ← Founding-member funnel — DECOMMISSIONED 2026-06-04 (historical only)
    └── post-cqc-clinical-conversion.md  ← Post-CQC clinical conversion flow (placeholder — post-CQC only)
```

Email sequence copy is not stored here. It lives in:

```text
09_website-app/frontend/email-templates/
├── transactional/   ← T-01 through T-08: event-triggered one-off sends
└── sequences/       ← seq-01 through seq-06: multi-email series with delays and triggers
```

---

## How to Work Here

### Defining or updating funnel stages

1. Read `../04_products/icp-kit-supplement-alignment-april2026.md` first — the selling logic and cross-sell direction flow from product rules, not marketing assumptions.
2. Update the relevant `funnel/` file for the stage being changed.
3. If the change affects an email sequence trigger or delay, update the corresponding sequence file in `09_website-app/frontend/email-templates/sequences/` and the build spec in `09_website-app/automations/customerio/sequences.md`.
4. If the change adds a new Liquid variable or user attribute, update the Liquid Variables Reference in `09_website-app/frontend/email-templates/CONTEXT.md` and the `identifyUser()` call in `lib/results/classifier.ts`.

### Working on the referral programme or retention

1. Read `growth-retention-context.md` first — it defines referral structure, rewards, churn prevention strategy, and the retest loop mechanic.
2. Referral code setup and tracking lives in `06_marketing/affiliates/codes-and-tracking/`.
3. Churn prevention email sequence is seq-05 — build specs are in `09_website-app/frontend/email-templates/sequences/seq-05-churn-prevention.md`.

### Working on GTM, launch strategy, or pricing

1. Read `sales-gtm-context.md` first.
2. GTM is **v4: two co-primary engines (affiliate + owned content/DTC), zero paid media** (`../06_marketing/master-plan/phase0-gtm-v4.md`). The old "affiliate-first, ads-second" framing is superseded — there are no paid ads in Phase 0, and the **PT/affiliate programme is currently FROZEN** (2026-06-07; see `../06_marketing/affiliates/CONTEXT.md`), so owned content/DTC carries the near-term load. Don't reintroduce a paid-ads-second assumption without a strategy decision in `01_strategy/`.
3. Pricing changes must be reflected in `04_products/catalogue/product-catalogue-v7-1.md` and the financial model in `01_strategy/master-implementation-blueprint.md`.

### Adding or editing an email sequence (logic only)

1. Sequence copy and Customer.io build specs belong in `09_website-app/frontend/email-templates/` — do not store copy here.
2. Define the trigger logic, delay rules, stop goals, and suppression conditions here in the relevant `funnel/` file.
3. Cross-reference the email templates CONTEXT.md to confirm the Liquid variables and user attributes exist before defining a new trigger.

---

## Funnel Stage Reference

| Stage | Entry trigger | Primary offer | Sequence | Handoff rule |
| --- | --- | --- | --- | --- |
| Waitlist | `waitlist_signed_up` event | Kit purchase on launch | seq-01 (4 emails) | Exits on `purchase` |
| Kit purchased, result pending | `purchase` event | — (result pending) | seq-02 (3 emails) | Exits on `result_received` |
| Result: low T (< 12 nmol/L) | `result_received`, T < 12 | **GP referral** (no upsell) + consent-gated nurture opt-in | seq-03b: Part A result notification (all low-T) + Part B education-only nurture (fires ONLY on `lowt_nurture_consented`, CIO campaign 5, DRAFT) | Nurture is consent-gated; no FM. **Routing changed 2026-06-04 (Ewa CA-014), deployed — see below.** |
| Result: borderline T (12–15) | `result_received`, T 12–15 | Daily Stack | seq-03d (4 emails) | Exits on `subscription_started` |
| Result: normal, all in range | `result_received`, all normal | Daily Stack; retest | seq-03c (4 emails) | Exits on `subscription_started` |
| Result: energy/recovery markers | `result_received`, Kit 2/3 | Daily Stack or Collagen | seq-03a (6 emails) | Exits on `subscription_started` |
| Supplement subscriber | `subscription_started` | Retest kit (Day 75) | seq-04 (5 emails) | Exits on `subscription_cancelled` |
| Churn risk | `viewed_cancel_page` event | Pause option; save offer | seq-05 (3 emails) | Exits on retention or cancellation |
| Quiz complete, no purchase | `quiz_complete`, no purchase | Recommended kit | seq-06 (4 emails) | Exits on `purchase` |

---

## Skill Context Files

Read `../06_marketing/positioning/product-marketing-context.md` before either of these.

| Task | Skill context file | Skills covered |
| --- | --- | --- |
| Referral programme, churn prevention, free tools | `growth-retention-context.md` | referral-program, churn-prevention, free-tool-strategy |
| GTM, launch strategy, pricing, sales enablement | `sales-gtm-context.md` | revops, sales-enablement, launch-strategy, pricing-strategy, marketing-psychology |

---

## Special Cases

**seq-04 retest prompt (Day 75):** The subscriber onboarding sequence must include a retest prompt at Day 75–80 as email 5. Offer: **10% off** the relevant retest kit using the **`SUBSCRIBER10`** Stripe coupon (valid 14 days — must be created before seq-04 activates). _(`SUBSCRIBER20` is retired — it doesn't exist in live; the >10% discount also breaches the discount cap.)_ Subject options: "3 months in — time to check your numbers" / "Has your Vitamin D moved? Let's find out." Framing: "find out how your levels have changed" — never "find out if the supplement fixed you." Three outcomes are all wins: improved (confirms it's working), unchanged (investigate why — keeps engagement), worsened (route to GP per the low-T rule below). Build spec: `09_website-app/frontend/email-templates/sequences/seq-04-subscriber-onboarding.md`.

**Low-T routing (changed 2026-06-04, Ewa CA-014, deployed):** A confirmed testosterone result < 12 nmol/L (Kit 1 or Kit 3) routes to a **GP referral with no kit/supplement upsell** — **NOT** the founding-member list (that routing is superseded; FM was taken down — join route returns 410, `/founding-member` → `/kits`). A consent-gated nurture opt-in sits alongside the referral (seq-03b Part B / CIO campaign 5, DRAFT). Never infer low T from Kit 2 energy/recovery markers. The FM list survives only as a dormant, standalone non-cash opt-in — never a content/sequence destination. Authoritative routing: `../04_products/CONTEXT.md`; compliance: `../03_compliance/CONTEXT.md`.

**Joint & Recovery Collagen CTA gate:** The Collagen CTA in any sequence requires two conditions: elevated hs-CRP (1–10 mg/L) AND joint symptoms confirmed via the dashboard qualifier. Do not fire the Collagen CTA without the qualifier gate.

**hs-CRP > 10 mg/L:** If hs-CRP exceeds 10 mg/L, the sequence must prompt a GP referral — not a supplement CTA. This is a clinical signal that requires investigation.

**Post-CQC clinical conversion:** `funnel/post-cqc-clinical-conversion.md` is a placeholder. Do not build or activate any clinical conversion funnel until CQC registration is live. The founding-member list funnel is Phase 0 — it is not a clinical intake flow, and it captures email opt-ins only (no payment).

**Retest framing (all sequences):** Always "find out how your levels have changed" — never language that implies the supplement cured or fixed anything.

**Supplement attach (kit buyer → subscriber) — the first-order lever:** Attach rate + tenure are the two levers that decide profitability (LTV:CAC model), swinging LTV ~2–2.6× — far more than price or paid spend. **Canonical attach-rate target: ≥15%** of kit buyers (locked 2026-07-02), measured `subscription_started ÷ result_received` and segmented by result state (deficiency vs all-clear vs low-T). Restructure trigger: **<10% after 80 results → rework the result flow.** Instrument with the new `supplement_offer_shown` / `supplement_offer_clicked` events. Strategy/levers/measurement owner: `funnel/supplement-conversion.md`; the conversion _mechanics_ stay in `08_customer-journey/flows/flow-4-results-to-action.md` Part C.

**All-clear attach cap (open decision — needs Ewa + compliance sign-off):** flow-4 gives all-clear results (normal Vit D / B12, T > 20) **no supplement CTA** — correct on the data-led thesis, but it structurally caps attach at ~0% for the largest Kit 2 segment (healthy men come back in range). The proposed fix is a **maintenance-framed** Daily Stack offer on the all-clear path (EFSA "maintenance of normal…" claims support it). This is a genuine thesis tension (the brand sells _against_ guess-pills), so **do not resolve it unilaterally — it needs explicit Ewa + compliance sign-off** (a claims _and_ positioning call, not a copy tweak). Currently switched off. Detail: `funnel/supplement-conversion.md`.

---

## Do Not Use This Workspace For

- Channel acquisition strategy or paid media planning (→ `/06_marketing`)
- Email sequence copy and Customer.io build specs (→ `/09_website-app/frontend/email-templates/`)
- UI or visual design (→ `/09_website-app` or `/02_brand`)
- Compliance sign-off as the primary task (→ `/03_compliance`)
- Clinical workflow ownership (→ `/11_clinical-plugin_post-cqc`)
- Product threshold logic or biomarker rules (→ `/04_products`)
