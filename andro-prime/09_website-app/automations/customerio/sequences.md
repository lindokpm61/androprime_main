# Customer.io Sequence Specifications

**Platform:** Customer.io — event-triggered campaigns.
**Integration:** Events emitted from `lib/customerio/emit.ts`. User identity set at signup/purchase via `identifyUser()`.

All sequences are built in the Customer.io UI using these specs. Sequence IDs match the blueprint (`seq-01` through `seq-05`).

---

## Events emitted by the platform

| Event name | Emitted by | Data payload |
|------------|-----------|--------------|
| `waitlist_signup` | `/api/forms/waitlist` | `{ email }` |
| `purchase` | Stripe webhook | `{ kit_type, amount, order_id }` |
| `kit_dispatched` | `/api/vitall/dispatch` (live; historic stub at `/api/thriva/dispatch`) | `{ kit_type, order_id }` |
| `result_received` | `/api/jobs/process-result` | `{ kit_type, result_id, order_id }` |
| `subscription_started` | Stripe webhook | `{ product_slug, amount }` |
| `founding_member_listed` | `/api/forms/founding-member-list` (list opt-in form submit) | `{ email, source }` |
| `quiz_complete` | `/api/forms/test-selector` | `{ recommended_kit, symptom_flags }` |
| `contact_form` | `/api/forms/contact` | `{ message_type }` |

---

## seq-01 — Pre-Launch Waitlist

**Trigger:** `waitlist_signup` event
**Audience:** Anyone who signs up before launch

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Immediate | You're on the list. Here's what's coming. | Confirm sign-up. Explain Andro Prime in 3 sentences. |
| 2 | +4 days | The men's health system in the UK has a problem | Articulate the GP gap. No CTA. Build credibility. |
| 3 | +8 days | What 4 blood markers tell you about your energy | Educational. Introduce Kit 2. Soft CTA to kit page. |
| 4 | Launch day | We're live. Your 10% discount is below. | Launch email. Discount code. Hard CTA. |

**Discount:** 10% off first kit. Apply via Stripe coupon. Code must be set up in Stripe before seq-01 Email 4 sends.

---

## seq-02 — Post-Purchase, Result Pending

**Trigger:** `purchase` event (kit_type = any)
**Goal:** Reduce sample failure rate and anxiety. Set expectation for results timeline.

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Immediate | Your kit is on its way. Here's what happens next. | Confirm purchase. Explain dispatch, timeline. |
| 2 | +2 days | How to take your finger-prick sample (it's easier than it sounds) | Sample collection instructions. Reduce failed sample rate. |
| 3 | On `result_received` event | Your Andro Prime results are ready. | Magic link to results dashboard. Nothing else. <!-- TRACKER: once My Story tracker page is live, deep-link to /tracker instead of /results-dashboard --> |

Email 3 is a triggered send, not a delay. Trigger: `result_received` event for the same `order_id`.

---

## seq-03a — Result Sequence: Energy Deficiencies

**Trigger:** `result_received` event where `kit_type` is `energy-recovery` or `hormone-recovery` AND at least one of: `low_vitamin_d`, `low_b12`, `elevated_crp` is true.
**Classification logic lives in `lib/results/classifier.ts`.** Customer.io cannot do threshold logic — use the `result_received` event payload to set user attributes (`low_vitamin_d: true`, etc.) via `identifyUser()` before firing this sequence.

**Note on Ferritin:** `low_ferritin` is tracked as a user attribute but is NOT a supplement trigger — per kit-2 spec, low ferritin requires GP referral. If `low_ferritin` is true, email 3 should include a GP referral note alongside (or instead of) any supplement recommendation. Do not recommend a supplement for low ferritin alone.

**Note on Kit 3 dual-firing:** `hormone-recovery` (Kit 3) results can trigger both seq-03a AND seq-03b simultaneously if the customer has energy deficiencies AND low testosterone. Both sequences may run concurrently. Ensure CIO suppression lists prevent seq-03c/03d from also firing. Review overlap for email fatigue before activating.

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 (result delivery) | Your results: here's what we found | Link to results dashboard. Summary of flagged markers. <!-- TRACKER: once My Story tracker page is live, deep-link to /tracker instead --> |
| 2 | +1 day | What [low Vitamin D / elevated CRP] actually means for your body | Personalised by marker via liquid. Educational. |
| 3 | +3 days | Based on your results, here's exactly what we recommend | Personalised supplement recommendation. CTA to supplement page. If `low_ferritin` is true, include GP referral note. |
| 4 | +7 days | A quick question about your results | Ask if they've started supplementing. Reply-to-engage. |
| 5 | +14 days | Men with elevated CRP typically notice this by Week 6 | Retention/engagement. Social proof. Soft CTA. |
| 6 | +30 days | Ready to complete the picture? Add testosterone to your check. | Upsell to Kit 1 or Kit 3. Only if not already purchased. |

**Email 3 personalisation logic:**
- Low Vit D or Low B12 only → recommend Daily Stack (£34.95/mo)
- Elevated hs-CRP + joint symptoms confirmed (qualifier_responses) → recommend Collagen (£29.95/mo)
- 2+ markers flagged → recommend Complete Men's Stack (£54.95/mo)
- `low_ferritin` true → add GP referral note: "Your ferritin is low — this isn't something a supplement can fix. We'd recommend speaking to your GP." Do not upsell a supplement for this marker alone.

Use Customer.io liquid to personalise email 3 body based on user attributes set at result processing.

---

## seq-03b — Result Sequence: Low Testosterone

**Trigger:** `result_received` event where `kit_type` is `testosterone` or `hormone-recovery` AND `low_testosterone = true` (set when T < 12 nmol/L).
Set user attribute `low_testosterone: true` and `testosterone_value: [value]` via `identifyUser()` at result processing.

**Never trigger this sequence based on Kit 2 (energy-recovery) results alone.** Founding-member list CTA requires a confirmed testosterone result.

**Non-cash framing — mandatory:** Emails 3, 4, 5, and 7 reference the founding-member list. The FM list is a free, non-cash email opt-in — there is no payment, deposit, or financial commitment involved. Copy must NEVER imply otherwise. Do not use language that suggests "securing" in a financial sense. Frame as joining a priority notification list.

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 | Your results: what we found — and what it means | Link to results dashboard. Explain the low-T result in plain English. <!-- TRACKER: once My Story tracker page is live, deep-link to /tracker instead --> |
| 2 | +1 day | Why 12 nmol/L might be "in range" and still not right for you | NHS range vs optimal. Not diagnostic. Educational. |
| 3 | +3 days | TRT is coming. Here's how to get on the list. | Founding-member list CTA (non-cash email opt-in). No deposit, no payment. Join a priority notification list only. |
| 4 | +7 days | What to expect when TRT launches — and why the first cohort matters | Social proof. Explain the clinical pathway. Low pressure. |
| 5 | +14 days | One last note — want to be on the list? | Second list-opt-in CTA. Final push. Non-cash framing only. |
| 6 | +30 days | An update on TRT launch — and what founding members get | Progress update. Keep warm. |
| 7 | Monthly | Founding member update: [Month] progress | Keep list members engaged through TRT day-1 readiness wait. No payment implication. |

---

## seq-03c — Normal Results (All Markers in Range)

**Trigger:** `result_received` where no seq-03a, seq-03b, or seq-03d conditions are met. In Customer.io, implement as:

- `low_vitamin_d = false` AND `low_b12 = false` AND `elevated_crp = false` AND `low_ferritin = false` (covers energy markers)
- AND (`low_testosterone = false` AND `borderline_testosterone = false`) if kit_type is `testosterone` or `hormone-recovery`

**Do NOT route on a raw T value threshold.** The code sets boolean attributes, not a "normal_testosterone" flag. Use `low_testosterone = false AND borderline_testosterone = false` to confirm normal range.

**Full copy:** `email-templates/sequences/seq-03c-normal-results.md`

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 | Your results: everything came back in range. | Link to results dashboard. Plain English summary. What "normal" means. <!-- TRACKER: once My Story tracker page is live, deep-link to /tracker instead --> |
| 2 | +2 days | Normal doesn't mean optimal. | Explain reference ranges, introduce retest concept. |
| 3 | +7 days | One honest recommendation given your results. | Daily Stack (zinc hero for Kit 1) or Kit 1/2 cross-sell. Soft CTA. |
| 4 | +30 days | One month since your results. Quick note on timing. | Retest reminder. Low pressure. |

---

## seq-03d — Borderline Testosterone (12–15 nmol/L)

**Trigger:** `result_received` where `kit_type = testosterone` OR `kit_type = hormone-recovery` AND `borderline_testosterone = true` (set when T ≥ 12 and < 15 nmol/L).
Do NOT check a raw T value in CIO — use the `borderline_testosterone` boolean attribute set by `process-result`.
Founding-member CTA is not present. No mention of the founding member programme.

**Full copy:** `email-templates/sequences/seq-03d-borderline-t.md`

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 | Your results: your testosterone is at the lower end of normal. | Link to results dashboard. Plain English result. Measured tone — not alarming, not dismissive. <!-- TRACKER: once My Story tracker page is live, deep-link to /tracker instead --> |
| 2 | +1 day | Why [value] nmol/L matters — even if your GP says you're fine. | NHS range vs optimal. Decline context. Introduce trend concept. |
| 3 | +3 days | Two practical steps given your result. | Daily Stack (zinc/Mg/D3/B12). Retest in 3 months. |
| 4 | +30 days | A month on — it's worth thinking about a second test. | Retest prompt. Trend framing. <!-- TRACKER: once live, reference their sparkline ("your last two results show...") --> |

---

## seq-06 — Quiz Nurture (No Purchase)

**Trigger:** `quiz_complete` event where no `purchase` event fires within 24 hours.
**Audience:** Men who completed the test selector quiz but didn't buy.

**Full copy:** `email-templates/sequences/seq-06-quiz-nurture.md`

**New user attributes to set at `quiz_complete` via identifyUser():**
- `quiz_recommended_kit` — from event payload `recommended_kit`
- `quiz_symptom_flags` — from event payload `symptom_flags` (array)

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | +24h (if no purchase) | Your Andro Prime quiz result. | Confirm recommended kit. Link to product page. |
| 2 | +2 days | The gap between suspecting something's off and actually knowing. | Articulate the cost of not knowing. Friction-free. |
| 3 | +5 days | What most men actually discover with this test. | Social proof framing. GP gap. Keith voice. |
| 4 | +10 days | Last one from us on this. Just the facts. | Functional close — what you get, what it costs. |

**Stop goal:** Any `purchase` event.
**Suppression:** Do not run if seq-01 (waitlist) or seq-02 (post-purchase) is active.

---

## seq-04 — Supplement Subscriber Onboarding

**Trigger:** `subscription_started` event
**Goal:** Reduce early churn. Manage expectations. Drive retest behaviour.

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Immediate | Your first Andro Prime delivery is on its way. | Confirm subscription. Expected delivery date. |
| 2 | +5 days | Day 5: what to expect in the first few weeks | Set realistic expectations. Supplement timelines. |
| 3 | +20 days | How's it going? We genuinely want to know. | Re-engagement. Invite reply. Surface any issues early. |
| 4 | +30 days | Your second delivery is on its way. And a question. | Prompt retest. CTA to relevant kit. <!-- TRACKER: once My Story tracker page is live, reference their last result date and marker values to personalise the retest prompt ("Your [Vitamin D] was last measured [N] days ago") --> |
| 5 | +60 days | 60 days in. Here's what most men notice. | Retention. Social proof. Referral programme introduction. |

Email 4 prompts retest to show marker movement. Do not imply the supplement has "fixed" anything — frame as "find out how your levels have changed." See compliance rules in CLAUDE.md.

---

## seq-05 — Churn Prevention

**Trigger:** Subscriber has not opened last 3 emails, OR has visited `/account` or `/subscriptions` page (set attribute `viewed_cancel_page: true` via page event).

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 (trigger met) | Everything okay? | Low-friction check-in. No hard sell. |
| 2 | +3 days | If it's not working, here's why that might be — and what to do | Troubleshoot. Address common reasons for disengagement. |
| 3 | +7 days | A frank word from Keith | Personal founder email. Offer to pause instead of cancel. |

If no response after email 3 and subscription is still active, suppress further seq-05 sends for 60 days.

---

## Building in Customer.io

1. Create a **Campaign** for each sequence above
2. Set the **Trigger** as the relevant event name
3. Add **filter conditions** on event data and user attributes for personalised branching
4. Use **Liquid** for personalisation (e.g. `{{ customer.testosterone_value }}`, `{{ customer.low_vitamin_d }}`)
5. Set **Goal** on each campaign (e.g. supplement purchase, list opt-in form submission via `founding_member_listed`) to stop the sequence early on conversion
6. Set **Unsubscribe** and **suppression** lists before activating any campaign

## User attributes to set via identifyUser() at key events

Set these in the Next.js API routes at result processing and subscription start:

| Attribute | Set when | Value | Notes |
|-----------|----------|-----------| ------------------------------------------------- |
| `kit_type_latest` | result_received | `testosterone`, `energy-recovery`, `hormone-recovery` | |
| `low_testosterone` | result_received, Kit 1/3 | `true` / `false` | T < 12 nmol/L → triggers seq-03b |
| `borderline_testosterone` | result_received, Kit 1/3 | `true` / `false` | T ≥ 12 and < 15 nmol/L → triggers seq-03d |
| `testosterone_value` | result_received, Kit 1/3 | numeric nmol/L | |
| `low_vitamin_d` | result_received, Kit 2/3 | `true` / `false` | Vit D < 50 nmol/L |
| `low_b12` | result_received, Kit 2/3 | `true` / `false` | B12 < 37.5 pmol/L in code — **⚠ threshold mismatch:** kit-2 spec says < 35. Reconcile with Ewa sign-off (item 1). |
| `elevated_crp` | result_received, Kit 2/3 | `true` / `false` | hs-CRP > 1.0 mg/L |
| `low_ferritin` | result_received, Kit 2/3 | `true` / `false` | Ferritin < 30 µg/L. **GP referral signal — not a supplement trigger.** Do not use as seq-03a supplement routing condition. |
| `joint_symptoms_confirmed` | qualifier_responses | `true` / `false` | |
| `active_subscriber` | subscription_started | `true` | |
| `active_product_slug` | subscription_started | `daily-stack`, `collagen`, `complete-mens-stack` | |
| `is_founding_member` | founding_member_listed | `true` | |
