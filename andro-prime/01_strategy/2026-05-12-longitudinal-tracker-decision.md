# Longitudinal Member Dashboard — Strategic Decision

**Date:** 2026-05-12
**Owner:** Keith Antony
**Status:** Decided
**Decision authority:** Founder call
**Workspace home:** `01_strategy` (this file). Feature implementation lives in `09_website-app/`.

---

## 1. Decision

Andro Prime will extend the existing results dashboard into a **longitudinal member health record**, built in two phases:

- **v1 — Passive tracker (Phase 0):** Aggregates the customer's blood results, reference ranges, and supplement subscription history across time. Surfaces trends as observations. No interpretation, no recommendations, no clinical claims.
- **v2 — Intelligence layer (post-Gate-v2):** Adds correlation analysis between supplement subscriptions and marker movement, retest prompts driven by marker trends, and (post-CQC) integration of clinical data and Ewa's notes.

v1 is a layer on top of the existing `09_website-app/` results-dashboard architecture, not a parallel build. The existing schema (`biomarker_values`, `lab_results`, `supplement_subscriptions`, `lifecycle_events`) already supports it.

---

## 2. Strategic rationale

Three convergent threads drive this decision.

### 2.1 Retention

Affiliate and PT-driven acquisition produces customers whose attachment to Andro Prime is borrowed from the referrer. When affiliate posting slows or PT recommendations fade, those customers have no intrinsic reason to remain subscribed unless the brand has earned its own engagement loop with them.

The 8 May kit strategy brief identifies tenure as the single largest LTV swing variable: 3-month tenure produces £37.50 LTV; 12-month tenure produces £77.32. Every additional month of tenure compounds. A longitudinal tracker is the simplest mechanism for converting a passive subscription into an active relationship — the customer logs in to see their data, not to receive marketing.

### 2.2 Marketing budget reality

Phase 0 marketing spend is constrained. Acquisition channels are primarily affiliate (low CAC, low predictability) plus organic content. Under these constraints, LTV must do the heavy lifting that paid acquisition cannot. Retention features earn their place in the build sequence as a direct consequence of budget structure, not as nice-to-haves.

### 2.3 Whitespace and moat

No UK at-home men's-health brand currently owns the data-visualisation layer for both wellness and (eventually) clinical customers. Numan, Voy, Manual, Bioniq, Forth, Medichecks, MyHealthChecked — none of them surface the customer's longitudinal record back to the customer with a supplement-correlation overlay.

The moat is not "we built a dashboard first." Competitors can build dashboards in 8–12 weeks. The moat is owning the data layer that makes the dashboard valuable, and accruing that data from launch while competitors start from zero. The dashboard is the visible surface of the moat. The moat itself is the closed-loop architecture (test → result → supplement → retest → longitudinal data).

This moat extends post-CQC into the clinical tier. Traditional UK private clinical practice holds the longitudinal patient record on the clinician's side. Patients see results piecemeal at appointments. Andro Prime inverts this: the patient's view and the clinician's view are roughly one-to-one. Same data, same trends, same record. The brand becomes "we treat you like an adult who can see your own data" — a positioning claim that operates against the entire conventional private-clinic model, not just against direct competitors.

This also aligns with the Reddit demand signal already documented in the 8 May brief: the most common UK consumer complaint about private testing is "results came back fast but lack of real help understanding them" and "doctors notes seem automated." The longitudinal record, properly designed, addresses both.

---

## 3. Architectural decisions (locked)

### 3.1 Location: single dashboard, progressive states

The longitudinal view lives inside `/dashboard/` as an extension of the existing pre-results / current-results state pattern. Not a separate route. Not `/dashboard/history/`. Not `/account/results/`.

This preserves the single-destination mental model already decided on 2026-04-24 ("the dashboard is the customer's single destination throughout the entire journey").

### 3.2 Activation: progressive enrichment from result 1

The longitudinal section is visible from the customer's first result. It is not hidden behind a "you need ≥2 results" gate.

On result 1 the section contains the supplement subscription timeline (when the customer started Daily Stack or Collagen, any cancellations or pauses) and a single marker point per biomarker. The marker timeline is sparse but meaningful — the customer can see "I started Daily Stack on this date, my Vit D was X on this date, my next test will appear here."

By result 2 the marker timeline becomes a genuine trend. By result 3+ it becomes the retention killer.

The decision to show the timeline from day one is what creates engagement before retest data exists. A locked or empty timeline communicates "come back later." A timeline that shows the customer's supplement journey forming communicates "this is your record, starting now."

### 3.3 Compliance posture: observation only

The v1 tracker presents data. It does not interpret data. It does not recommend interventions. It does not generate "drop / review / keep" verdicts on supplements.

Specifically:

- Marker values are shown alongside reference ranges. The customer can see whether they are in or out of range.
- Trend direction across ≥2 readings is shown as a visual sparkline plus a neutral indicator ("improving / declining / stable"). The indicator describes the data, it does not interpret it.
- Supplement subscriptions are shown as timeline events overlaid on the marker chart. The customer can see the temporal correlation themselves. The tracker does not assert causation.
- No prescriptive language. No "you should" / "we recommend you stop" / "this isn't working."

The customer-facing framing is **"your health record, tracked properly"** — not "AI health insights" or "AI-powered tracker." AI may be used in the back end for parsing lab data, normalising marker names across panel versions, or generating natural-language summary copy reviewed by Ewa, but the customer-facing story is human: Ewa interprets, the dashboard shows what she'd want you to see, you make decisions with full information.

This framing decision is made deliberately and is not subject to A/B testing or copy iteration. Changing it requires a strategic review, not a marketing decision.

### 3.4 Data model: existing schema sufficient

The existing Supabase schema supports v1 without structural changes:

- `biomarker_values` already stores per-marker data with reference ranges
- `lab_results` already links to `user_id`, `kit_type`, and `received_at`
- `supplement_subscriptions` already records `started_at` and `status` transitions
- `qualifier_responses` already links to specific result events
- `lifecycle_events` already provides the audit trail

What may need adding (as views or computed fields, not new tables):

- A view that joins `biomarker_values` to `lab_results.received_at` for per-marker timeline queries
- A view that surfaces `supplement_subscriptions` state changes as timeline events
- A trend classifier (≥2 readings, same-direction movement) implemented in `lib/results/` — not stored in DB

Schema decisions that anticipate the post-CQC clinical extension can be deferred to v2. The current schema does not block them.

### 3.5 Marker panel evolution

The schema must handle panels evolving over time. Kit 1 in March 2026 had 3 testosterone markers (Total T, SHBG, Free T calculated). Kit 1 in May 2026 has 5 markers (adds FAI, Albumin). Kit 2 in March 2026 included Magnesium. Kit 2 in April 2026 swaps Magnesium for Active B12.

The timeline view must:

- Show each marker on its own timeline, independent of which panel version produced it
- Handle gaps (a marker present in some panels and not others) without breaking the visualisation
- Not retroactively reinterpret old results when reference ranges change

The existing `biomarker_values` schema supports this — each row is per-marker with its own reference range at time of test. The frontend logic must respect that range may differ across rows for the same marker.

---

## 4. Phasing

### 4.1 v1 — Passive tracker

**Scope:**
- Per-marker timeline view across all of a customer's test results
- Reference range overlay (using the range from each individual result, not a single canonical range)
- Trend direction indicator (≥2 readings)
- Supplement subscription timeline overlay (subscription start, cancel, pause events)
- Retest prompt logic (≥90 days since last test on a given panel triggers a soft prompt)

**Out of scope (deferred to v2):**
- Supplement audit logic ("is this doing anything")
- Correlation analysis between subscription and marker movement
- Predictive prompts ("your Vit D is trending down, consider retesting")
- Clinical data integration (TRT, prescription history, Ewa's notes)
- Third-party blood data upload (Medichecks, Numan, NHS panels imported by customer)

**Build sequence (within `09_website-app/`):**
1. Database views and trend classifier in `lib/results/`
2. Timeline component in `frontend/components/results-engine/`
3. Integration into `/dashboard/` as the post-results state extension
4. QA against compliance constraints (observation-only language, no interpretation)
5. Ewa sign-off on all copy, trend indicator language, and retest prompt copy

**Resolves the open implementation question in `app-requirements.md`:** *"how much result history and comparison is shown in account versus dashboard"* — answer: all of it, in the dashboard.

### 4.2 v2 — Intelligence layer

**Gate condition (all three must be met before v2 build begins):**
- 100+ customers with ≥2 test results on file
- 6 months elapsed since v1 launch
- ≥50% of paying customers have logged in to view their dashboard at least once between tests

If v1 engagement is below 50%, the gate is not met. v2 does not get built. The product roadmap forks based on what v1 engagement data actually shows, not on what we assume it will show.

**v2 scope (sketched, subject to revision based on v1 data):**
- Correlation analysis: "Vit D moved from 42 to 78 over 4 months while on Daily Stack"
- Marker-driven retest prompts (not just time-driven)
- Supplement subscription audit (only against Andro Prime products, only with Ewa-signed-off logic, only in observation framing)
- Customer-uploaded third-party data (post-CQC consideration; not in v2 scope unless gate-condition data warrants it)

### 4.3 v3 — Clinical record (post-CQC)

Out of scope for current decision. To be specced as part of post-CQC clinical plugin work in `/11_clinical-plugin_post-cqc/`. Architectural anticipation: the data model from v1 can extend to include clinical interactions without refactor.

---

## 5. Compliance and regulatory posture

### 5.1 Phase 0 (current)

The v1 tracker is a data visualisation tool that surfaces a customer's own purchased lab data back to them. It is not a medical device, not a diagnostic aid, and not a clinical decision-support tool. The framing must remain consistent with this throughout: observation, not interpretation.

All copy on the dashboard — including marker labels, trend indicators, retest prompts, and supplement timeline event descriptions — is subject to the same EFSA / ASA / compliance discipline as the rest of the Phase 0 experience. Read `/03_compliance/CONTEXT.md` before drafting any of it. Ewa signs off all dashboard copy before release.

### 5.2 Specific compliance pitfalls to avoid

- Do not use the words "diagnose", "treat", "cure", "deficient" (use "below reference range" instead), or "abnormal"
- Do not say "your supplement is working" or "your supplement isn't working" — show the data, let the customer infer
- Do not show projected future values or predicted trends — only observed data
- Do not aggregate cohort data into customer-facing comparisons ("you're in the bottom 20% of men your age") without Ewa review and explicit compliance sign-off
- Do not reference TRT availability or imply future clinical care in any v1 surface

### 5.3 CQC regulatory upside (not a near-term decision)

When CQC inspection eventually happens, full customer access to their own longitudinal record is a defensible quality marker, not a risk. CQC quality standards explicitly value patient empowerment, informed consent, and transparent communication. A clinic where patients have continuous access to their own longitudinal data is materially easier to defend on these dimensions than one where data is held clinician-side.

This is a downstream benefit, not a near-term build driver, but it informs the long-term direction.

---

## 6. What this decision is **not** authorising

- A v2 build inside Phase 0 — v2 is gated on v1 engagement data
- A separate dashboard product brand or sub-brand
- Customer-uploaded third-party data ingestion
- AI-labelled customer-facing copy
- Any interpretation, recommendation, or audit logic in v1
- Diverting Phase 0 critical-path bandwidth before launch gates are addressed

The bandwidth question is explicit: v1 is built **after** the Phase 0 launch is stable, not before. Pricing reconciliation, Ewa threshold sign-off, results-engine completion, seq-03b/seq-03c copy, the Option 4 implementation work, and the existing `09_website-app/` Phase 5-7 plans take priority. v1 of the tracker enters the build queue at the point where it does not displace Phase 0 critical-path work.

A reasonable target window: build v1 in M3–M4 post-launch, once kit volume is producing real subscription data and retest cycles are starting to land. Not earlier.

---

## 7. Open questions to resolve before build

These must be answered before any v1 code is written. None of them block this decision being filed — they are downstream resolution items.

| Question | Owner | Resolution path |
|---|---|---|
| Exact trend classifier logic (how many readings, how much delta, how to handle missing markers across panels) | Ewa + dev | Spec in `09_website-app/docs/` once v1 enters build queue |
| Retest prompt cadence and copy | Ewa + Keith | Lives in `frontend/email-templates/` and dashboard copy |
| How supplement subscription events are visualised (icons, colours, density) | Design | `09_website-app/design/` |
| Whether to surface symptom-quiz answers alongside biomarker results in the longitudinal view | Product | Probably yes; requires UX work |
| Whether to expose qualifier-response history (joint symptoms over time) | Product | Probably yes for transparency, no for clinical risk; needs Ewa view |
| Privacy export / customer data download (UK GDPR right of access) — does the v1 surface this? | Compliance + dev | Probably yes; check `/03_compliance/CONTEXT.md` |

---

## 8. Downstream document updates

This decision triggers updates to the following documents. Updates to be made by Keith (or delegated) before v1 build begins.

| Document | Update required |
|---|---|
| `09_website-app/CONTEXT.md` | Add longitudinal view to dashboard section; reference this memo |
| `09_website-app/docs/app-requirements.md` | Resolve the open question on result history in dashboard vs account; reference this memo |
| `09_website-app/docs/implementation-plan.md` | Add v1 tracker build as a post-launch phase, sequenced after Phase 0 critical-path |
| `02_brand/` (brand pillars) | Consider adding "patient-owned data" as a stated brand pillar; founder + brand review |
| `03_compliance/CONTEXT.md` | Add tracker-specific compliance constraints (observation-only language, no interpretation) to the existing rules |
| `04_products/results-engine/` | Note that results-engine output now feeds into longitudinal view in addition to per-result dashboard |

---

## 9. Cross-references

- Root routing: [`CLAUDE.md`](../CLAUDE.md)
- Strategy context: [`CONTEXT.md`](CONTEXT.md)
- Kit strategy decision brief: [`kit-strategy-decision-brief-2026-05-08.md`](kit-strategy-decision-brief-2026-05-08.md) (LTV math and tenure-as-swing-variable evidence)
- Product catalogue (V7.2): [`../04_products/catalogue/product-catalogue-v7-1.md`](../04_products/catalogue/product-catalogue-v7-1.md)
- App requirements: [`../09_website-app/docs/app-requirements.md`](../09_website-app/docs/app-requirements.md)
- Database schema: [`../09_website-app/database/schema/schema.md`](../09_website-app/database/schema/schema.md)
- Compliance context: [`../03_compliance/CONTEXT.md`](../03_compliance/CONTEXT.md)

---

*End of memo. Decision logged 2026-05-12. Implementation work begins post-Phase-0-launch, sequenced into `09_website-app/` build plan at that point.*
