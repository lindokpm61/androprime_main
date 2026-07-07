# Email Templates — Context

**Platform:** Customer.io (event-triggered campaigns)
**Owner workspace:** `09_website-app`
**Integration:** Events emitted from `lib/customerio/emit.ts`. User identity set via `identifyUser()` at signup, purchase, and result processing.

This directory contains all email copy for Andro Prime. Two subdirectories. Do not create additional top-level folders here.

---

## Directory Structure

```
email-templates/
├── transactional/
│   └── transactional-emails.md   ← T-01 through T-08: event-triggered one-off sends
└── sequences/
    ├── seq-01-waitlist.md         ← Pre-launch waitlist (4 emails)
    ├── seq-02-post-purchase.md    ← Post-purchase, result pending (3 emails)
    ├── seq-03a-energy-results.md  ← Energy & recovery result (6 emails)
    ├── seq-03b-low-t.md           ← Low testosterone result, T < 12 nmol/L (Part A notification + Part B consented nurture)
    ├── seq-03c-normal-results.md  ← Normal result, all markers in range (4 emails)
    ├── seq-03d-borderline-t.md    ← Borderline T, 12–15 nmol/L (4 emails)
    ├── seq-04-subscriber-onboarding.md  ← Supplement subscriber onboarding (5 emails)
    ├── seq-05-churn-prevention.md ← Churn prevention (3 emails)
    ├── seq-06-quiz-nurture.md     ← Quiz completed, no purchase (4 emails)
    └── seq-07-newsletter-welcome.md ← Blog newsletter opt-in welcome (1 email)
```

The sequence trigger logic and Customer.io build specifications live in:
`automations/customerio/sequences.md`

Read that file alongside the copy file when building in the Customer.io UI.

---

## Transactional vs Sequence

| Type | File | When |
|---|---|---|
| Transactional | `transactional/transactional-emails.md` | Fired by a single event. One send. No delays. |
| Sequence | `sequences/seq-XX-name.md` | Multi-email series. Time delays and/or event triggers chain the emails. |

**Cross-references (do not duplicate):**
- T-01 = seq-02 Email 1 (kit order confirmed)
- T-03 = seq-02 Email 3 (results ready)
- T-05 = seq-04 Email 1 (subscription started)

These are built once in Customer.io as transactional sends and referenced in the sequences. The sequence files note this explicitly.

---

## How to Work Here

### Adding or editing email copy

1. Edit the relevant `.md` file directly.
2. Match the established format: subject line, preview text, body copy, closing, build notes.
3. Keep Keith's voice throughout. No em dashes. Plain English. Pub test.
4. Run the compliance checklist before saving (see below).
5. If the edit changes a Liquid variable or adds a new user attribute, update `automations/customerio/sequences.md` user attributes table too.

### Adding a new sequence

1. Create a new file in `sequences/` using kebab-case: `seq-XX-name.md`.
2. Add the sequence spec to `automations/customerio/sequences.md`.
3. Add the routing entry to the relevant section of this CONTEXT.md.

### Building in Customer.io

Each file contains a Customer.io Build Notes table at the bottom. That table defines: send delays, trigger conditions, stop goals, suppression rules, and required Liquid variables. Build from that table — do not interpret the copy files as CIO config.

---

## Compliance Checklist

Run before saving any email copy:

- [ ] No "diagnose," "diagnosis," "treat," "treatment," "cure"
- [ ] No claim that TRT is currently available
- [ ] Supplement claims use EFSA-approved language only (see root `CLAUDE.md`)
- [ ] No ashwagandha mentions — silent ingredient
- [ ] Results copy uses "Your results indicate..." not "You have..."
- [ ] No claim the kit is a substitute for medical advice
- [ ] Kit 1 copy scoped to testosterone only — does not claim to explain general fatigue
- [ ] Low-T (T < 12) results route to GP referral with no upsell. The only low-T email beyond the notification is the consent-gated education nurture (seq-03b Part B, CIO campaign 5, DRAFT). No founding-member CTA exists in any email.
- [ ] Retest framing: "find out how your levels have changed" — not "find out if the supplement fixed you"

---

## Liquid Variables Reference

Set via `identifyUser()` at the events listed. Required before any sequence that depends on them fires.

| Attribute | Set when | Used in |
|---|---|---|
| `customer.first_name` | Signup | All emails |
| `customer.kit_type_latest` | `result_received` | seq-03a, 03b, 03c, 03d, 04, 06 |
| `customer.testosterone_value` | **Retired 2026-06-04** — never sent to CIO (data minimisation; copy refers to the threshold, not the number) | — |
| `customer.low_testosterone` | `lowt_nurture_consented` consent route only — never at result-processing | seq-03b Part B trigger |
| `customer.low_vitamin_d` | `result_received` (Kit 2/3) — consent-gated (CA-018) as of 2026-07-07 | seq-03a |
| `customer.low_b12` | `result_received` (Kit 2/3) — consent-gated (CA-018) as of 2026-07-07 | seq-03a |
| `customer.elevated_crp` | `result_received` (Kit 2/3) — consent-gated (CA-018) as of 2026-07-07 | seq-03a |
| `customer.crp_level` | `result_received` (Kit 2/3) — consent-gated (CA-018) as of 2026-07-07; kept (not dropped): seq-03a compares the numeric | seq-03a (hs-CRP > 10 branch) |
| `customer.joint_symptoms_confirmed` | Dashboard qualifier response | seq-03a |
| `customer.low_ferritin` | `result_received` (Kit 2/3) — consent-gated (CA-018) as of 2026-07-07 | seq-03a |
| `customer.active_product_slug` | `subscription_started` | seq-04, 05 |
| `customer.quiz_recommended_kit` | `quiz_complete` | seq-06 |
| `customer.quiz_symptom_flags` | `quiz_complete` | seq-03c Email 3 |
| `customer.viewed_cancel_page` | Page event on `/account` or `/subscriptions` | seq-05 trigger |
| `event.kit_name` | At event emission | T-01, T-02, seq-02, 03b |
| `event.order_id` | `purchase`, `result_received` | T-01, seq-02 |
| `event.amount` | `purchase`, `invoice_payment_succeeded`, `invoice_payment_failed` | T-01, T-06, T-07 |
| `event.tracking_url` | `kit_dispatched` | T-02 |
| `event.product_name` | `subscription_started`, `invoice_payment_succeeded`, `invoice_payment_failed`, `subscription_cancelled` | T-05, T-06, T-07, T-08 |
| `event.renewal_date` | `invoice_payment_succeeded` | T-06 |
| `event.next_renewal_date` | `invoice_payment_succeeded` | T-06 |
| `event.discount_code` | Launch day broadcast | seq-01 Email 4 |

**New attributes not in the original sequences.md (added during copy writing):**
- `crp_level` — numeric mg/L. Consent-gated (CA-018) as of 2026-07-07; kept rather than retired because seq-03a's hs-CRP > 10 branching compares the numeric value in Liquid.
- `quiz_symptom_flags` — array. Set from `quiz_complete` event payload in `/api/forms/test-selector`.
- `quiz_recommended_kit` — string. Set from `quiz_complete` event payload.

---

## Special Cases

**seq-01 Email 4 (launch day):** Manual broadcast to `waitlist_signed_up` segment. Not a sequence delay. Send manually on launch day. Requires `LAUNCHDAY10` Stripe coupon set up in advance.

**seq-03b Part B (low-T education nurture) is consent-gated; activation in Customer.io is a human go/no-go, never automatic.**

**seq-04 Email 5 (retest prompt, Day 75):** Requires `SUBSCRIBER10` Stripe coupon (10% off, valid 14 days) created before this email activates.

**seq-05 Email 3 (pause option):** References Stripe subscription pause. Confirm this feature is live in the account portal before activating seq-05.

---

## Platform Notes

- All sequences built in Customer.io as **Journeys** (not broadcasts, except where noted).
- Use **Liquid** for all personalisation. Test all conditional branches before activating.
- Set **Goals** on each campaign to stop the sequence early on conversion.
- Set **Suppression** lists before activating any campaign.
- Customer.io is live (EU datacenter, workspace 219186); transactional sends verified on a real purchase 2026-06-25/26. Live/draft campaign state lives in `09_website-app/STATE.md`.
