# Sales: Context

**Read before any funnel, lifecycle, or sequence work:**

1. `../04_products/icp-kit-supplement-alignment-april2026.md`: defines the correct trigger logic, cross-sell direction, supplement copy hooks, and the retest loop mechanic. Supersedes V7 product docs on all conversion and CTA decisions.
2. `../06_marketing/positioning/product-marketing-context.md`: master marketing context. Read before any skill file.
3. The relevant skill context file (see Skill Context Files table below).

**Owner workspace:** `07_sales`
**Integration:** Funnel logic defined here drives the trigger rules in `/04_products/results-engine/`, the email sequence build in `/09_website-app/frontend/email-templates/`, and the CRM automation structure in `/09_website-app/automations/`. Changes to funnel stages or conversion rules must be reflected in those workspaces.

This workspace defines conversion logic, lifecycle stages, CRM structure, and post-click movement through the funnel. Email sequence copy lives in `/09_website-app/frontend/email-templates/`; this workspace defines the logic and trigger rules those sequences must follow.

---

## Directory Structure

```text
07_sales/
├── growth-retention-context.md   ← Skill context: referral-program, churn-prevention, free-tool-strategy
├── sales-gtm-context.md          ← Skill context: revops, sales-enablement, launch-strategy, pricing-strategy
├── funnel/
│   ├── kit-purchase.md            ← Kit purchase funnel: first touch → order → dispatch → flow-4 handoff
│   ├── supplement-conversion.md   ← Supplement attach logic + trigger rules (+ all-clear maintenance offer)
│   ├── all-clear-maintenance-offer-copy.md  ← All-clear maintenance CTA copy (DRAFT, pending Ewa)
│   ├── all-clear-offer-signoff-pack.md      ← One-page Ewa sign-off pack for the all-clear offer
│   ├── founding-member.md         ← Founding-member funnel: DECOMMISSIONED 2026-06-04 (historical only)
│   └── post-cqc-clinical-conversion.md  ← Post-CQC clinical conversion flow (placeholder, post-CQC only)
├── crm/                 ← intentionally-empty placeholder (no files yet)
├── email-sequences/     ← intentionally-empty placeholder (see note below)
├── lifecycle/           ← intentionally-empty placeholder (no files yet)
└── referral-programme/  ← intentionally-empty placeholder (no files yet)
```

The `crm/`, `email-sequences/`, `lifecycle/`, and `referral-programme/` subdirs exist on disk but are empty scaffolding: they hold no files and are placeholders only. In particular, the empty `email-sequences/` dir is NOT where sequence copy lives; despite the folder name, no copy is stored under `07_sales`.

Email sequence copy is not stored here. It lives in:

```text
09_website-app/frontend/email-templates/
├── transactional/   ← T-01 through T-10: event-triggered one-off sends
└── sequences/       ← seq-01 through seq-07: multi-email series (delays + triggers) and single-email sends (e.g. seq-07 newsletter welcome, plus the all-clear retest reminder and bundle address-check)
```

---

## How to Work Here

### Defining or updating funnel stages

1. Read `../04_products/icp-kit-supplement-alignment-april2026.md` first: the selling logic and cross-sell direction flow from product rules, not marketing assumptions.
2. Update the relevant `funnel/` file for the stage being changed.
3. If the change affects an email sequence trigger or delay, update the corresponding sequence file in `09_website-app/frontend/email-templates/sequences/` and the build spec in `09_website-app/automations/customerio/sequences.md`.
4. If the change adds a new Liquid variable or user attribute, update the Liquid Variables Reference in `09_website-app/frontend/email-templates/CONTEXT.md` and the `identifyUser()` call in `09_website-app/frontend/lib/results/classifier.ts`.

### Working on the referral programme or retention

1. Read `growth-retention-context.md` first: it defines referral structure, rewards, churn prevention strategy, and the retest loop mechanic.
2. Referral code setup and tracking lives in `06_marketing/affiliates/codes-and-tracking/`.
3. Churn prevention email sequence is seq-05; build specs are in `09_website-app/frontend/email-templates/sequences/seq-05-churn-prevention.md`.

### Working on GTM, launch strategy, or pricing

1. Read `sales-gtm-context.md` first.
2. GTM is **v4: two co-primary engines (affiliate + owned content/DTC), zero paid media** (`../06_marketing/master-plan/phase0-gtm-v4.md`). The old "affiliate-first, ads-second" framing is superseded: there are no paid ads in Phase 0, and the **PT/affiliate programme is currently FROZEN** (2026-06-07; see `../06_marketing/affiliates/CONTEXT.md`), so owned content/DTC carries the near-term load. Don't reintroduce a paid-ads-second assumption without a strategy decision in `01_strategy/`.
3. Pricing changes must be reflected in `04_products/catalogue/product-catalogue-v7-1.md` and the financial model in `01_strategy/master-implementation-blueprint.md`.

### Adding or editing an email sequence (logic only)

1. Sequence copy and Customer.io build specs belong in `09_website-app/frontend/email-templates/`; do not store copy here.
2. Define the trigger logic, delay rules, stop goals, and suppression conditions here in the relevant `funnel/` file.
3. Cross-reference the email templates CONTEXT.md to confirm the Liquid variables and user attributes exist before defining a new trigger.

---

## Funnel Stage Reference

This is the **post-click lifecycle funnel** (what happens after a purchase or opt-in). The **pre-click content/acquisition funnel** (which content does which TOFU/MOFU/BOFU job) lives in `../06_marketing/content-machine/content-funnel-map.md`. The two connect at two seams: the **email rung** (content routes cold/warm viewers to the quiz to "Quiz complete, no purchase" / seq-06 and "Waitlist" / seq-01 below) and the **kit purchase** (the `purchase` event = "Kit purchased, result pending" below). Keep the two in sync; do not redefine acquisition stages here.

| Stage | Entry trigger | Primary offer | Sequence | Handoff rule |
| --- | --- | --- | --- | --- |
| Waitlist | `waitlist_signed_up` event | Kit purchase on launch | seq-01 (4 emails) | Exits on `purchase` |
| Kit purchased, result pending | `purchase` event | None (result pending) | seq-02 (3 emails) | Exits on `result_received` |
| Result: low T (< 12 nmol/L) | `result_received`, T < 12 | **GP referral** (no upsell) + consent-gated nurture opt-in | seq-03b: Part A result notification (all low-T) + Part B education-only nurture (fires ONLY on `lowt_nurture_consented`, CIO campaign 5, DRAFT) | Nurture is consent-gated; no FM. **Routing changed 2026-06-04 (Ewa CA-014), deployed (see below).** |
| Result: borderline T (12–15) | `result_received`, T 12–15 | Daily Stack | seq-03d (4 emails) | Exits on `subscription_started` |
| Result: normal, all in range | `result_received`, all normal | Daily Stack; retest | seq-03c (4 emails) | Exits on `subscription_started` |
| Result: energy/recovery markers | `result_received`, Kit 2/3 | Daily Stack or Collagen | seq-03a (6 emails) | Exits on `subscription_started` |
| Supplement subscriber | `subscription_started` | Retest kit (Day 75) | seq-04 (5 emails) | Exits on `subscription_cancelled` |
| Churn risk | `viewed_cancel_page` event | Pause option; save offer | seq-05 (3 emails) | Exits on retention or cancellation |
| Quiz complete, no purchase | `quiz_complete`, no purchase | Recommended kit | seq-06 (4 emails) | Exits on `purchase` |
| Newsletter subscriber (non-customer opt-in) | `newsletter_signup` event | None (soft kit pointer only) | seq-07 (single welcome email) | No exit trigger; one-time send |
| All-clear retest reminder | `retest_due_at` date attribute (stamped on any whole-result all-clear) | Retest kit (plain reorder) | retest-reminder-all-clear.md (single send, CIO campaign 23 DRAFT) | Copy APPROVED 2026-07-18 (CA-022); sends to ALL all-clear kit buyers, not just subscribers; flag-gated on `RETEST_REMINDER_ENABLED` |
| Bundle second-kit dispatch | `bundle_address_check` event (bundle sweep, `trigger_met` → `awaiting_window`) | None (logistics/address confirmation only) | bundle-address-check.md (single send, SPEC/DRAFT, not built) | Gated on `BUNDLES_ENABLED`; needs Ewa sign-off + compliance pre-flight before build |

---

## Two-Kit Bundle Funnel

Recent commits ("finalize Recheck bundle", "two-kit bundle mechanism") added a two-kit bundle path (Confirmation / Prove-It / Full-picture SKUs) where a second kit ships on a later, automated dispatch. The only customer touchpoint before that unattended second dispatch is the **bundle address-check** email (`bundle_address_check` event, `ADDRESS_CHECK_WINDOW_DAYS = 4` soft window before auto-dispatch). Copy lives in `09_website-app/frontend/email-templates/sequences/bundle-address-check.md` (SPEC/DRAFT only). The whole mechanism is dark behind `BUNDLES_ENABLED` and gated on the solicitor D2 bundle-terms decision plus an address-update surface in the account area.

## Supplement Waitlist Capture

Because the supplement range is not live in Phase 0, a waitlist captures intent. Joining fires `supplement_waitlist_joined`, which triggers the transactional confirmation **T-10 (Supplement Waitlist Confirmed)**. This is a single confirmation send, not a nurture sequence; the waitlist population converts when the range ships.

---

## Skill Context Files

Read `../06_marketing/positioning/product-marketing-context.md` before either of these.

| Task | Skill context file | Skills covered |
| --- | --- | --- |
| Referral programme, churn prevention, free tools | `growth-retention-context.md` | referral-program, churn-prevention, free-tool-strategy |
| GTM, launch strategy, pricing, sales enablement | `sales-gtm-context.md` | revops, sales-enablement, launch-strategy, pricing-strategy, marketing-psychology |

---

## Special Cases

**seq-04 retest prompt (Day 75):** The subscriber onboarding sequence must include a retest prompt at Day 75–80 as email 5. Offer: **10% off** the relevant retest kit using the **`SUBSCRIBER10`** Stripe coupon (valid 14 days; must be created before seq-04 activates). _(`SUBSCRIBER20` is retired: it doesn't exist in live; the >10% discount also breaches the discount cap.)_ Subject options: "3 months in, time to check your numbers" / "Has your Vitamin D moved? Let's find out." Framing: "find out how your levels have changed", never "find out if the supplement fixed you." Three outcomes are all wins: improved (confirms it's working), unchanged (investigate why, keeps engagement), worsened (route to GP per the low-T rule below). Build spec: `09_website-app/frontend/email-templates/sequences/seq-04-subscriber-onboarding.md`.

**Low-T routing (changed 2026-06-04, Ewa CA-014, deployed):** A confirmed testosterone result < 12 nmol/L (Kit 1 or Kit 3) routes to a **GP referral with no kit/supplement upsell**, **NOT** the founding-member list (that routing is superseded; FM was taken down: join route returns 410, `/founding-member` → `/kits`). A consent-gated nurture opt-in sits alongside the referral (seq-03b Part B / CIO campaign 5, DRAFT). Never infer low T from Kit 2 energy/recovery markers. The FM list survives only as a dormant, standalone non-cash opt-in, never a content/sequence destination. Authoritative routing: `../04_products/CONTEXT.md`; compliance: `../03_compliance/CONTEXT.md`.

**Joint & Recovery Collagen CTA gate:** The Collagen CTA in any sequence requires two conditions: elevated hs-CRP (1–10 mg/L) AND joint symptoms confirmed via the dashboard qualifier. Do not fire the Collagen CTA without the qualifier gate.

**hs-CRP > 10 mg/L:** If hs-CRP exceeds 10 mg/L, the sequence must prompt a GP referral, not a supplement CTA. This is a clinical signal that requires investigation.

**Post-CQC clinical conversion:** `funnel/post-cqc-clinical-conversion.md` is a placeholder. Do not build or activate any clinical conversion funnel until CQC registration is live. The founding-member list funnel is Phase 0: it is not a clinical intake flow, and it captures email opt-ins only (no payment).

**Retest framing (all sequences):** Always "find out how your levels have changed", never language that implies the supplement cured or fixed anything.

**Supplement attach (kit buyer → subscriber), the first-order lever:** Attach rate + tenure are the two levers that decide profitability (LTV:CAC model), swinging LTV ~2–2.6×, far more than price or paid spend. **Canonical attach-rate target: ≥15%** of kit buyers (locked 2026-07-02), measured `subscription_started ÷ result_received` and segmented by result state (deficiency vs all-clear vs low-T). Restructure trigger: **<10% after 80 results → rework the result flow.** Instrument with the new `supplement_offer_shown` / `supplement_offer_clicked` events. Strategy/levers/measurement owner: `funnel/supplement-conversion.md`; the conversion _mechanics_ stay in `08_customer-journey/flows/flow-4-results-to-action.md` Part C.

**All-clear attach cap (open decision, needs Ewa + compliance sign-off):** flow-4 gives all-clear results (normal Vit D / B12, T > 20) **no supplement CTA**: correct on the data-led thesis, but it structurally caps attach at ~0% for the largest Kit 2 segment (healthy men come back in range). The proposed fix is a **maintenance-framed** Daily Stack offer on the all-clear path (EFSA "maintenance of normal…" claims support it). This is a genuine thesis tension (the brand sells _against_ guess-pills), so **do not resolve it unilaterally: it needs explicit Ewa + compliance sign-off** (a claims _and_ positioning call, not a copy tweak). Currently switched off. Detail: `funnel/supplement-conversion.md`.

---

## Skills, tools & MCPs

MCP servers and tools most relevant when working in this workspace. Repo-wired servers are in the root `.mcp.json` (graphify, context7, dataforseo, supabase, clickup); the rest are claude.ai account connectors, some of which need authorising in an interactive session before use.

**Skills** (repo skills invoke as `/name`; the rest ship with plugins):

- `/cio-sequence-build`: build or finish a sequence as a DRAFT Customer.io campaign from its copy file (never activates).
- `/compliance-preflight`: run on any lifecycle email copy before it ships.
- `email-sequence`, `cold-email`: design nurture/lifecycle flows and outbound copy.
- `churn-prevention`, `referral-program`, `revops`, `signup-flow-cro`, `sales-enablement`: retention/save-flows, the referral programme, funnel ops, signup conversion, and sales collateral.

**MCPs & tools:**

- **Customer.io** (MCP, connector): the core tool here: campaigns, sequences, segments, broadcasts, transactional sends (workspace 219186). Preview writes with a dry run before applying; never activate a campaign without sign-off.
- **clickup** (MCP, wired): sales/lifecycle task tracking (workspace 90121729875).

---

## Do Not Use This Workspace For

- Channel acquisition strategy or paid media planning (→ `/06_marketing`)
- Email sequence copy and Customer.io build specs (→ `/09_website-app/frontend/email-templates/`)
- UI or visual design (→ `/09_website-app` or `/02_brand`)
- Compliance sign-off as the primary task (→ `/03_compliance`)
- Clinical workflow ownership (→ `/11_clinical-plugin_post-cqc`)
- Product threshold logic or biomarker rules (→ `/04_products`)
