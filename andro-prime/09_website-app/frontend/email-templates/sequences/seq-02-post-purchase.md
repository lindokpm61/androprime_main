# seq-02 — Post-Purchase, Result Pending

**Platform:** Customer.io
**Trigger:** `purchase` event (kit_type = any)
**Goal:** Reduce sample failure rate. Prevent drop-off between purchase and sample return.
**Tone:** Practical, reassuring. Keith's voice. No clinical jargon.

---

## Email 1 — Immediate: Order confirmed

**This email = T-01 (already written in `transactional/transactional-emails.md`)**

Build it once in Customer.io as a transactional send triggered by the `purchase` event. Reference it here in the sequence. Do not duplicate.

---

## Email 2 — +2 days: Sample instructions

**Subject:** How to take your finger-prick sample — the bit most people overthink.
**Preview:** Five steps, under 5 minutes. Here's exactly what to do when your kit arrives.

---

Hi {{ customer.first_name }},

Your kit should be arriving any day now. Before it does, here's exactly what to expect from the finger-prick step — because it looks more medical than it is.

The honest version: it takes five minutes. The lancet is smaller than anything you'd encounter in a GP's office. The most common reason samples get rejected by the lab isn't the prick itself. It's cold hands.

Here's how to get it right:

**1. First thing in the morning, before food.**
Testosterone and other hormones fluctuate throughout the day. Taking your sample fasted — water is fine — gives the most accurate baseline. This is the most important step.

**2. Warm your hands before you start.**
Run them under warm water for 30 seconds, or do 20 arm circles to get blood moving to your fingers. This is the single biggest factor in getting a good sample volume. Cold hands mean slow blood flow, and a slow-flowing sample is the main reason tubes don't fill to the line.

**3. Use the side of your fingertip, not the tip.**
The side has fewer nerve endings. Less discomfort, and it's easier to produce a steady drop. Your ring finger, non-dominant hand, works well.

**4. Don't squeeze the finger.**
Let gravity do the work. Hold your hand below heart level and let the blood drop naturally into the collection tube. Squeezing hard dilutes the sample with tissue fluid and can cause a lab rejection. There are spare lancets in the kit if you need a second attempt — use them.

**5. Fill the tube to the line, cap it, and post it.**
Give the vial a gentle shake as instructed on the packaging, then drop it in the pre-paid Royal Mail Priority envelope. Any Priority postbox in the UK will do. The envelope is pre-addressed.

The lab receives hundreds of these samples daily. It's routine for them.

Your results will be in your dashboard within 48 hours of the lab receiving your sample.

Any questions, reply to this email.

— Keith
Andro Prime

---

## Email 3 — On `result_received` event: Results ready

**This email = T-03 (already written in `transactional/transactional-emails.md`)**

Build it once in Customer.io as a transactional send triggered by the `result_received` event for the matching `order_id`. Reference it here in the sequence. Do not duplicate.

---

## Customer.io Build Notes

| # | Delay | Notes |
|---|-------|-------|
| 1 | Immediate | = T-01. Reference transactional template. |
| 2 | +2 days from `purchase` | Sequence email — full copy above. |
| 3 | On `result_received` | = T-03. Reference transactional template. Match by `order_id`. |

**Stop goal:** `result_received` event for the same `order_id`. Email 3 fires but stops the sequence at that point.

**Suppression:** Email 2 should not fire if `result_received` has already fired for the same order (i.e. same-day sample turnaround is unlikely but possible for local labs). Add suppression check.

**Note on Email 2 vs T-02:** T-02 (kit dispatched) fires on the `kit_dispatched` event and includes a tracking link plus brief instructions. Email 2 here fires +2 days from purchase and is purely focused on sample collection depth. They serve different purposes and should not suppress each other. Email 2 may arrive before or alongside the kit — treat it as preparation, not repetition.

**Liquid variables required:**
- `{{ customer.first_name }}`
- `{{ event.kit_name }}` — for Email 3 / T-03 reference
