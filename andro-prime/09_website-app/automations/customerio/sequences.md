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
| `kit_dispatched` | `/api/thriva/dispatch` | `{ kit_type, order_id }` |
| `result_received` | `/api/jobs/process-result` | `{ kit_type, result_id, order_id }` |
| `subscription_started` | Stripe webhook | `{ product_slug, amount }` |
| `founding_member_deposit` | Stripe webhook | `{ amount }` |
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
| 3 | On `result_received` event | Your Andro Prime results are ready. | Magic link to dashboard. Nothing else. |

Email 3 is a triggered send, not a delay. Trigger: `result_received` event for the same `order_id`.

---

## seq-03a — Result Sequence: Energy Deficiencies

**Trigger:** `result_received` event where `kit_type` is `energy-recovery` or `hormone-recovery` AND at least one marker is below optimal (low Vit D, low B12, elevated hs-CRP).
**Classification logic lives in `lib/results/classifier.ts`.** Customer.io cannot do threshold logic — use the `result_received` event payload to set user attributes (`low_vitamin_d: true`, etc.) via `identifyUser()` before firing this sequence.

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 (result delivery) | Your results: here's what we found | Link to dashboard. Summary of flagged markers. |
| 2 | +1 day | What [low Vitamin D / elevated CRP] actually means for your body | Personalised by marker via liquid. Educational. |
| 3 | +3 days | Based on your results, here's exactly what we recommend | Personalised supplement recommendation. CTA to supplement page. |
| 4 | +7 days | A quick question about your results | Ask if they've started supplementing. Reply-to-engage. |
| 5 | +14 days | Men with elevated CRP typically notice this by Week 6 | Retention/engagement. Social proof. Soft CTA. |
| 6 | +30 days | Ready to complete the picture? Add testosterone to your check. | Upsell to Kit 1 or Kit 3. Only if not already purchased. |

**Email 3 personalisation logic:**
- Low Vit D or Low B12 only → recommend Daily Stack (£34.95/mo)
- Elevated hs-CRP + joint symptoms confirmed (qualifier_responses) → recommend Collagen (£29.95/mo)
- 2+ markers → recommend Complete Men's Stack (£54.95/mo)

Use Customer.io liquid to personalise email 3 body based on user attributes set at result processing.

---

## seq-03b — Result Sequence: Low Testosterone

**Trigger:** `result_received` event where `kit_type` is `testosterone` or `hormone-recovery` AND `total_testosterone < 12 nmol/L`.
Set user attribute `low_testosterone: true` and `testosterone_value: [value]` via `identifyUser()` at result processing.

**Never trigger this sequence based on Kit 2 (energy-recovery) results alone.** Founding member deposit CTA requires a confirmed testosterone result.

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 | Your results: what we found — and what it means | Link to dashboard. Explain the low-T result in plain English. |
| 2 | +1 day | Why 12 nmol/L might be "in range" and still not right for you | NHS range vs optimal. Not diagnostic. Educational. |
| 3 | +3 days | TRT is coming. Here's how to secure your place. | Founding member deposit CTA. £75, fully refundable. |
| 4 | +7 days | What to expect when TRT launches — and why the first cohort matters | Social proof. Explain the clinical pathway. Low pressure. |
| 5 | +14 days | Your deposit secures your place. Will you be in? | Second deposit CTA. Final push. |
| 6 | +30 days | An update on TRT launch — and what founding members get | Progress update. Keep warm. |
| 7 | Monthly | Founding member update: [Month] progress | Keep depositors engaged through CQC wait. |

---

## seq-03c — Normal Results (All Markers in Range)

**Trigger:** `result_received` where no seq-03a, seq-03b, or seq-03d conditions are met.
- `kit_type = testosterone` AND `total_testosterone ≥ 15 nmol/L`
- OR `kit_type = energy-recovery` AND all markers in range
- OR `kit_type = hormone-recovery` AND all markers in range AND `total_testosterone ≥ 15 nmol/L`

**Full copy:** `email-templates/sequences/seq-03c-normal-results.md`

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 | Your results: everything came back in range. | Results in, plain English summary. What "normal" means. |
| 2 | +2 days | Normal doesn't mean optimal. | Explain reference ranges, introduce retest concept. |
| 3 | +7 days | One honest recommendation given your results. | Daily Stack (zinc hero for Kit 1) or Kit 1/2 cross-sell. Soft CTA. |
| 4 | +30 days | One month since your results. Quick note on timing. | Retest reminder. Low pressure. |

---

## seq-03d — Borderline Testosterone (12–15 nmol/L)

**Trigger:** `result_received` where `kit_type = testosterone` OR `kit_type = hormone-recovery` AND `total_testosterone` is 12–15 nmol/L (inclusive).
Founding member deposit CTA is not present. No mention of the founding member programme.

**Full copy:** `email-templates/sequences/seq-03d-borderline-t.md`

| # | Delay | Subject | Purpose |
|---|-------|---------|---------|
| 1 | Day 0 | Your results: your testosterone is at the lower end of normal. | Plain English result. Measured tone — not alarming, not dismissive. |
| 2 | +1 day | Why [value] nmol/L matters — even if your GP says you're fine. | NHS range vs optimal. Decline context. Introduce trend concept. |
| 3 | +3 days | Two practical steps given your result. | Daily Stack (zinc/Mg/D3/B12). Retest in 3 months. |
| 4 | +30 days | A month on — it's worth thinking about a second test. | Retest prompt. Trend framing. |

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
| 4 | +30 days | Your second delivery is on its way. And a question. | Prompt Kit 2 retest. CTA to retest kit. |
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
5. Set **Goal** on each campaign (e.g. supplement purchase, deposit payment) to stop the sequence early on conversion
6. Set **Unsubscribe** and **suppression** lists before activating any campaign

## User attributes to set via identifyUser() at key events

Set these in the Next.js API routes at result processing and subscription start:

| Attribute | Set when | Value |
|-----------|----------|-------|
| `kit_type_latest` | result_received | `testosterone`, `energy-recovery`, `hormone-recovery` |
| `low_testosterone` | result_received, Kit 1/3 | `true` / `false` |
| `testosterone_value` | result_received, Kit 1/3 | numeric nmol/L |
| `low_vitamin_d` | result_received, Kit 2/3 | `true` / `false` |
| `low_b12` | result_received, Kit 2/3 | `true` / `false` |
| `elevated_crp` | result_received, Kit 2/3 | `true` / `false` |
| `joint_symptoms_confirmed` | qualifier_responses | `true` / `false` |
| `active_subscriber` | subscription_started | `true` |
| `active_product_slug` | subscription_started | `daily-stack`, `collagen`, `complete-mens-stack` |
| `is_founding_member` | founding_member_deposit | `true` |
