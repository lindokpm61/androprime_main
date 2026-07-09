# Flow 4 — Results to Action

**Version:** 1.1 (routing partially superseded — see banner)
**Date:** 2026-05-09 (routing reconciled 2026-07-02)
**Status:** Flow mechanics (Parts A, B, D1, D3) active. **Part C/D routing is superseded on two axes — see banner.**

> ⛔ **ROUTING SUPERSEDED ON TWO AXES (reconciled 2026-07-02) — `../../04_products/CONTEXT.md` (Results-Engine Trigger Rules) + `../../04_products/results-engine/results-to-product-mapping.md` are authoritative. This doc's flow mechanics (Parts A, B, D1, D3) are current; its Part C/D *routing* is not.**
>
> 1. **Low-T → GP referral (2026-06-04, Ewa CA-013/CA-014).** T < 12 routes to a **GP referral with no kit/supplement upsell** + an optional consent-gated nurture opt-in — **NOT** the founding-member list, and **NOT** the "join the list, we'll contact you when the clinic opens" TRT-recruitment copy that used to appear in Branch D2 (that framing is exactly what the FM-takedown + no-FM-from-content decisions removed for CQC/ASA reasons). The founding-member list is **decommissioned** (join route 410, page redirects); Branch D2 is historical.
> 2. **Supplements → waitlist in Phase 0a (supplements deferred).** Every "Daily Stack / Collagen / Complete Men's Stack" *direct* CTA in Part C/D is, in **Phase 0a**, a **supplement-waitlist opt-in** (`supplement_waitlist_joined`), not a Stripe subscription. Direct subscription CTAs (and the `subscription_started` event) return in **Phase 0b** when live Stripe Price IDs ship. Per `results-to-product-mapping.md` + `conversion-rules.md`.
>
> The low-T table row and copy below have been corrected in place; the supplement-routing tables are left as the Phase-0b end-state with this Phase-0a note governing. (£75 deposit shelved 2026-05-08; FM was briefly a non-cash opt-in, now removed entirely.)

## Purpose

Maps the journey from results arriving via Vitall webhook through to the customer viewing their results and taking the correct next action. This is the core product flow — every revenue outcome depends on it executing correctly.

---

## Prerequisites

- Customer has an existing authenticated account
- Kit order is in progress with Vitall
- Vitall `results-available` webhook has been received and processed

---

## Part A — Results Arrive (Background)

### Step A1 — Vitall webhook received

**Trigger:** Vitall fires `results-available` webhook to the Andro Prime webhook endpoint.

**System actions:**
1. Verify HMAC signature — reject and alert if invalid
2. Parse payload: extract `partner_order_id`, `results` array, `results_pdf`, `results_html`, `comment`, `warning`, `partnerComment`
3. Look up order in Supabase by `partner_order_id`
4. Store full results payload against the order record in Supabase
5. Update order status to `results-available`
6. Check `warning` field — if populated, fire internal alert to Andro Prime team (Vitall's clinical team handles direct patient escalation; this is internal notification only)
7. Fire `result_received` event to Customer.io → triggers T-03 "Your results are ready" email

---

### Step A2 — Results email sent

**Trigger:** Customer.io `result_received` event.

**Email:** T-03 "Your results are ready."

Content:
- Results are ready notification
- "View your results" CTA — routes to `/app/dashboard`
- No results data in the email itself — customers must log in to view results (health data privacy)

---

## Part B — Customer Views Results

### Step B1 — Customer arrives at dashboard

**Trigger:** Customer clicks "View your results" in email, or navigates directly to the app.

**Authentication:** If not authenticated, goes through Flow 2 (Returning Customer) first, then redirects to `/app/dashboard`.

**Screen:** `/app/dashboard` — post-results state.

Dashboard switches from pre-results state (status tracker) to post-results state (results view). The status tracker is replaced by:

- Panel summary headline — plain English, covers the overall picture across all biomarkers. Examples:
  - "Your testosterone is in range. Your Vitamin D needs attention."
  - "Your testosterone is below the optimal range. Here's what that means."
  - "All markers in range. Here's what to do next."
- Scrollable list of per-biomarker result cards below the summary

---

### Step B2 — Per-biomarker result cards

Each biomarker is shown as a card following the 5-part structure:

**1. Result**
- Biomarker name (plain English, not the lab code)
- Their number and unit (e.g. "14.2 nmol/L")
- Visual range indicator: a horizontal zone showing where their result sits relative to the reference range. Colour coded per brand guidelines: green (optimal), amber (borderline), black fill used for marketing contexts only. The indicator uses a needle or marker rather than a filled bar.
- Flag indicator if `flag` field is `H` (high) or `L` (low)

**2. Explain**
- 2–3 sentences. What does this number mean for them specifically.
- Language: "Your results indicate..." not "You have..."
- Personalised to their number relative to the range (e.g. "lower half of the normal range" vs "just outside the normal range")

**3. Educate**
- Brief, evidence-based context. What does this biomarker do? Why does it matter for a man?
- Non-sales. Builds trust. No product mentioned.

**4. Recommend**
- Conditional — determined by result state (see Part C below)
- The Andro Prime product or action recommended based on their specific result

**5. Convert**
- Primary CTA and optional secondary CTA
- Determined by result state (see Part C below)

---

## Part C — Conditional Logic by Result State

### Testosterone (Kit 1 and Kit 3)

| Result | Qualifier | Primary CTA | Secondary CTA |
|---|---|---|---|
| T < 12 nmol/L | None | **GP referral — no upsell** (optional consent-gated nurture opt-in alongside) | **None** (no kit/supplement CTA on a low-T card) |
| T 12–20 nmol/L | Energy symptoms reported at checkout | Daily Stack (Zinc-led copy) | Kit 2 cross-sell |
| T 12–20 nmol/L | No energy symptoms reported | Daily Stack (Zinc-led copy) | None |
| T > 20 nmol/L | None | Retest reminder (no supplement CTA) | None |

**T < 12 — GP-referral framing (2026-06-04, Ewa CA-013/CA-014):**
The low-T card recommends the customer speak to their GP, with **no kit or supplement upsell** on that card — a definitive low-T result has no ambiguity to resolve, so it is not cross-sold. The approved card copy lives in `09_website-app/frontend/lib/results/biomarker-copy.ts` (low-testosterone; CA-013) — do not re-author it here. An **optional consent-gated nurture opt-in** sits alongside the referral (version-locked; CA-014), with activation pending the solicitor's lawful-basis sign-off. The `<12` band splits into three sub-bands in `classifier.ts` (severely-low <5.2 → endocrinology flag in copy; low 5.2–8; equivocal 8–12), all GP-routed. The founding-member list is decommissioned and is **not** the low-T CTA.

**T > 20 — Retest framing:**
"Your testosterone is in a good range. The most useful thing you can do is retest in 3–6 months to track whether it stays there. Results naturally vary — one reading is useful, but a trend tells you more."

---

### Vitamin D (Kit 2 and Kit 3)

| Result | Primary CTA | Secondary CTA |
|---|---|---|
| Low Vitamin D | Daily Stack (D3-led copy) | Kit 1 if age 40+ or 2+ deficiencies |
| Normal Vitamin D | No CTA | None |

---

### Active B12 (Kit 2 and Kit 3)

| Result | Primary CTA | Secondary CTA |
|---|---|---|
| Low B12 | Daily Stack (B12-led copy) | None |
| Normal B12 | No CTA | None |

---

### hs-CRP (Kit 2 and Kit 3)

hs-CRP requires a qualifier question before a recommendation is shown.

**Qualifier gate — fires when hs-CRP is elevated (> 1 mg/L):**

**Screen:** Inline question card between the hs-CRP Educate section and the Recommend section.

Question: "Do you experience joint stiffness or soreness after training?"

Options: "Yes" / "No"

Customer must answer before the recommendation section unlocks. Answer is saved to Supabase against the customer account.

| hs-CRP level | Joint symptoms | Action |
|---|---|---|
| 1–3 mg/L | Yes | Collagen recommendation (full copy) |
| 1–3 mg/L | No | Lifestyle guidance only. No supplement CTA. |
| > 3 mg/L | Yes | Collagen recommendation + note to review with GP if persistent |
| > 3 mg/L | No | Lifestyle guidance + "If this stays elevated on your next test, speak to your GP." |
| > 10 mg/L | Either | GP referral only. No supplement CTA. Copy: "This level of inflammation warrants a conversation with your doctor. We'd recommend booking an appointment before taking any supplement." |
| Normal hs-CRP | N/A | No qualifier shown. No CTA. |

---

### Ferritin (Kit 2 and Kit 3)

| Result | Action |
|---|---|
| Low Ferritin < 30 µg/L | GP referral + dietary guidance. No supplement CTA. Copy: "Your iron stores are lower than they should be. We don't sell iron supplements — iron overdose is a real clinical risk and it needs to be dosed based on your specific numbers by a GP. Here's what your result means and a letter template you can take to your NHS appointment." |
| Normal Ferritin | No CTA |

---

### Multiple deficiencies (any kit)

| Condition | Primary CTA | Secondary CTA |
|---|---|---|
| 2+ deficiencies across any markers | Complete Men's Stack (Daily Stack + Collagen) at £54.95/month | Individual products as fallback |

The 2+ deficiency trigger overrides individual biomarker CTAs and surfaces the bundle as the primary recommendation.

---

### Cross-sell rules

**Kit 1 → Kit 2:**
Shown when T is 12–20 nmol/L AND buyer reported energy or fatigue symptoms at checkout.
Placement: after T interpretation, before the Daily Stack CTA.
Copy: "Good news — your testosterone is in range. That rules out one of the main causes. But Vitamin D, B12, and inflammation are the other major drivers of exactly what you're describing — and we can't see those from this test. A lot of men who get a normal T result find their actual answer in Kit 2. It checks all four energy and recovery markers for £119."
CTA: "Check your energy markers — Kit 2, £119" (secondary button)

**Kit 2 → Kit 1:**
Shown when 2+ deficiencies OR single deficiency AND age 40+.
Placement: after supplement recommendation section, in a separate section titled "One more thing worth knowing."
Copy: "Your energy markers explain a lot of what you've been experiencing. One more thing worth knowing: testosterone also directly affects recovery speed and how your body responds to training — especially after 40. We haven't tested it here. Kit 1 checks your testosterone in 5 minutes for £99."
CTA: "Check your testosterone — Kit 1, £99" (secondary button)

**Cross-sell rules (updated 2026-07-02):**

- **Post-result cross-sell is the complement, never the superset (2026-07-08).** A normal-T **Kit 1 → Kit 2** (unconditional: adds the energy/recovery markers Kit 1 did not measure). **Kit 2 → Kit 1** (multi-deficiency, or Vit-D/B12 + age ≥40). **Kit 3 → no kit cross-sell** (already has both panels). Kit 3 is a front-of-funnel default (the quiz's broaden-up), **not** a post-result upsell — a man who just tested testosterone is not sold a kit that re-tests it. This supersedes the earlier "Kit 3 IS the Kit 1 upsell" rule. Canonical: `../../04_products/results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`. A definitive low-T (T < 12) does **not** cross-sell at all (GP referral). Never present a cross-sell as a discount bundle.
- Founding-member opt-in is **retired** entirely (FM decommissioned 2026-06-04) — no longer a CTA from any result.
- No generic supplement CTAs detached from results.

> **Note on the Testosterone table above (row "T 12–20 + energy symptoms → Kit 2 cross-sell"):** as of 2026-07-08 the Kit 2 cross-sell fires for **every** normal-T Kit 1 result, not only when energy symptoms are reported. The `energy_symptoms` gate was dropped (the signal was never captured, and Kit 2 is the honest default regardless — see the decision doc). Treat the "energy symptoms" qualifier in that row as historical.

**Implementation status (built + verified 2026-07-08; authority = `classifier.ts` + `07_sales/funnel/kit-purchase.md`):**

- **Kit 1 → Kit 2 — LIVE, unconditional.** Normal-T Kit 1 returns Kit 2 as secondary.
- **Kit 2 → Kit 1 — FIXED.** The CTA had pointed at a 404 (`/kits/testosterone-health`); corrected to `/kits/testosterone`.
- **Kit 3 cross-sell — removed.** The briefly-added `kit-3-cross-sell` CtaType was deleted; Kit 3 has no post-result cross-sell role.

---

## Part D — Customer Takes Action

### Branch D1 — Customer starts supplement subscription

**Trigger:** Customer taps primary or secondary supplement CTA.

**Screen:** Supplement product page or inline checkout — routes to Stripe.

> **Phase 0a:** supplements are deferred, so the supplement CTAs in Part C are **waitlist opt-ins** — they POST to the supplement waitlist and fire `supplement_waitlist_joined` (payload `email`, `source_marker`, `source_kit`), NOT a Stripe subscription. The direct-subscription flow below is the **Phase 0b** end-state (reactivates when live Stripe Price IDs ship). Source: `../../04_products/results-engine/results-to-product-mapping.md` + `conversion-rules.md`.

**System actions on payment success (Phase 0b):**
- Create subscription record in Supabase
- Fire `subscription_started` event to Customer.io
- Return customer to dashboard with subscription confirmed state

---

### Branch D2 — Customer joins the founding-member list  ⛔ SUPERSEDED (2026-06-04)

> ⛔ **SUPERSEDED 2026-06-04 — historical only.** The founding-member list is decommissioned (join route 410, page redirects) and is no longer the low-T CTA. Low-T now routes to GP referral + optional consent-gated nurture (see the Testosterone section in Part C). The mechanics below describe the retired flow.

**Trigger:** Customer taps "Join the founding-member list" CTA. Trigger gate: T < 12 nmol/L on Kit 1 or Kit 3 only — Kit 2 results alone CANNOT route here.

**Screen:** `/founding-member` — email-capture form (no payment). Form fields: email (pre-filled if authenticated), optional postcode, consent checkbox.

**System actions on form submission:**
- POST to `/api/founding-member/join`
- Insert row into Supabase `founding_member_list` table (email, user_id if logged in, source = `results-flow`, kit_id, timestamp, consent flag)
- Set `founding_member_listed = true` on the user record in Supabase `users`
- Fire `founding_member_listed` event to Customer.io → triggers founding-member nurture sequence
- Return customer to dashboard with "On founding-member list" state confirmed
- Dashboard `founding-member-status` section updates to show "On the list — we'll be in touch when the clinic opens"

**Compliance guards (preserved):**
- No clinical promise. Copy must not imply TRT is available now or guarantee eligibility.
- No payment, no implied future price commitment.
- Consent recorded for marketing email under UK GDPR.

---

### Branch D3 — Customer takes no action

Customer reads results and leaves. No forced action. Dashboard remains accessible. Lifecycle emails in Customer.io handle re-engagement.

---

## End State

Customer has viewed their results and either taken an action (subscription, founding-member list opt-in, cross-sell) or left. All actions are recorded in Supabase and Customer.io lifecycle events are fired for downstream email automation.

---

## Error States Summary

| Error | Handling |
|---|---|
| Webhook signature invalid | Reject request, fire internal alert, do not process |
| Results payload missing fields | Log error, fire internal alert, do not surface broken results to customer |
| `warning` field populated | Internal alert fired to Andro Prime team — do not surface warning text directly in the customer dashboard unless clinical review confirms it should be shown |
| Stripe payment fails on subscription | Stripe handles retry logic — Customer.io handles failed payment email |
| `/api/founding-member/join` fails (network or DB error) | Surface inline error to customer with retry CTA. Do not fire `founding_member_listed` event. Log and alert internally. |
| Duplicate submission to `/api/founding-member/join` | Endpoint is idempotent on email — no duplicate row, no duplicate event fired. Return success state to customer. |
| Qualifier question not answered | Recommendation section remains locked. Soft prompt after 5 seconds: "Answer the question above to see your recommendation." |

---

## Data Written During This Flow

| Data point | Written to | When |
|---|---|---|
| Full results payload | Supabase `results` | Step A1 — webhook received |
| Order status `results-available` | Supabase `orders` | Step A1 |
| Qualifier answer (hs-CRP) | Supabase `users` or `results` | Step B2 — on answer |
| Subscription record | Supabase `subscriptions` | Branch D1 |
| Founding-member list row | Supabase `founding_member_list` | Branch D2 — on `/api/founding-member/join` success |
| `founding_member_listed = true` flag | Supabase `users` | Branch D2 — on `/api/founding-member/join` success |

---

## Customer.io Events Fired During This Flow

| Event | Fired when |
|---|---|
| `result_received` | Step A1 — webhook processed successfully |
| `subscription_started` | Branch D1 — subscription payment confirmed |
| `founding_member_listed` | Branch D2 — `/api/founding-member/join` returns success |

> ⛔ **Superseded (2026-06-04):** the `founding_member_list` row and `founding_member_listed` event (Branch D2) are retired — FM decommissioned. In **Phase 0a**, supplement routing fires **`supplement_waitlist_joined`** instead of `subscription_started`. See the banner at the top of this file.

---

## Rewrite Note (2026-05-09)

Branch D2 was reframed as a non-cash email opt-in. Specific changes:

- **Removed:** Stripe deposit checkout, £49 / £75 deposit figures, "fully refundable" language, `founding_member_deposit` event, deposit-paid dashboard state, Stripe-payment-fails-on-deposit error row.
- **Added:** `/founding-member` email-capture page, `/api/founding-member/join` endpoint, `founding_member_list` table, `founding_member_listed` event, "On founding-member list" dashboard state, idempotency error row, network-failure error row.
- **Preserved:** trigger gate (T < 12 nmol/L on Kit 1 or Kit 3 only — Kit 2 cannot trigger), Daily Stack "while you wait" secondary CTA, no-deposit-from-Kit-2-alone cross-sell rule, downstream nurture sequence handoff, compliance guards on clinical promises.

### Pre-existing inconsistency flagged for Keith

The £49 figure that appeared in the prior version of this doc (lines L112–113, L222 in v1.0) was an **unrelated inconsistency** that pre-dated the deposit shelving — the rest of the project consistently used £75. This was a data-hygiene drift that this rewrite incidentally cleans up. **Worth a sweep of other docs** (especially older `01_strategy/`, `06_marketing/`, and `07_sales/` drafts) for similar £49-vs-£75 drift before any are repurposed for archival or auditor reference, even though both figures are now obsolete.
