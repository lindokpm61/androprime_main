# seq-03b: Low Testosterone — result notification + consented nurture

**Platform:** Customer.io
**Rewritten 2026-06-04** for the low-T routing decision (`04_products/results-engine/2026-06-04-low-t-routing-decision.md`). Supersedes the prior founding-member / TRT-pre-sell version of seq-03b (CA-008 seq-03b portion retired). Low-T now routes to **GP referral**; the founding-member list is taken down; any ongoing contact is a **consent-gated, education-only nurture**.

This file defines TWO separate things with TWO different triggers:

- **Part A — Result notification (Email 1).** Trigger: `result_received` where `kit_type_latest = 'testosterone'` OR `'hormone-recovery'` AND the testosterone card state is `low-testosterone` (T < 12 nmol/L). Goes to every low-T customer. This is result delivery, lawful under the test-processing consent.
- **Part B — Consented nurture (Emails 2–4).** Trigger: `lowt_nurture_consented` event (fired by `api/lowt-nurture/consent` only after the explicit Art 9(2)(a) opt-in). Goes ONLY to customers who ticked the optional "stay informed" box on their result card. This is the special-category nurture — it must never fire without that consent.

**Goal:** Part A — get the man to his result and to his GP. Part B — keep a consented man genuinely informed about Andro Prime's future service. **No pitch, no founding-member list, no TRT promise, no supplement claim for low T.**

**Tone:** Empathetic, direct, Keith-personal. The most sensitive sequence in the platform — the man has just found out his testosterone is clinically low. Do not alarm. Do not pitch. Be genuinely useful.

**Compliance notes (Ewa constraint 2026-06-04 + CONTEXT.md):**
- Never state the result as a definitive diagnosis (the "you have…" form). Use "Your results indicate…".
- Never imply TRT or a clinical service is available now. Permitted future framing only: "we'll let you know when we launch."
- The primary next step is the customer's GP. Do not undermine GPs (no "even if your GP says you're fine").
- Part B is education + "we'll let you know" only. No treatment/TRT promise, no objection-handling that pre-sells TRT, no founding-member mechanic, no supplement claim.
- Never trigger on Kit 2 results. Requires a confirmed testosterone result (Part A) or explicit consent (Part B).
- No specific testosterone value in copy — `testosterone_value` is no longer sent to Customer.io (consent-gated data minimisation). Refer to the threshold ("below 12 nmol/L"), not the number.
- Every email carries a working unsubscribe. Reviewed/approved copy only — pending its own CA + Ewa sign-off before any CIO build.

---

# PART A — Result notification (all low-T)

## Email 1 — Day 0: Your results are in

**Subject:** Your results are in.
**Preview:** What your testosterone result means, and the next step.

---

Hi {{ customer.first_name | default: 'there' }},

Your {{ event.kit_name | default: 'test' }} results are in.

View them here: https://andro-prime.com/account

Your results indicate a total testosterone level below 12 nmol/L. Your full panel, with a plain-English explanation of each marker, is in your dashboard. The explanations and the recommendation logic are reviewed by Dr Ewa Lindo, a GMC-registered GP.

This isn't a medical emergency, and it isn't a diagnosis. What it is: a clear, measurable result worth acting on.

The most appropriate next step is to speak to your GP, who can confirm this result, look for any underlying cause, and talk you through your options. Take your result with you so they have the full picture.

If you'd like us to keep your result on file and let you know about our future men's health service when it becomes available, there's an optional box to tick on your results page. It's entirely up to you, and nothing changes if you don't.

If anything raises a question, reply to this email. I read every one.

Keith
Andro Prime

---

_Your results are for information only and are not a diagnosis or medical advice. If you are worried about your health, speak to your GP or call NHS 111._

---

# PART B — Consented nurture (only after the explicit opt-in)

## Email 2 — Day 0 (on consent): Thanks, and what happens now

**Subject:** Thanks for opting in. Here's what to expect.
**Preview:** No pitch. Just what to expect from us.

---

Hi {{ customer.first_name | default: 'there' }},

Thanks for choosing to stay informed. I'll keep this simple.

You've told us you'd like to hear about our future men's health service. That's all you've signed up for: occasional, genuinely useful updates. No payment, no commitment, and you can stop them any time using the link at the bottom of any email.

While we build that service, the most useful thing you can do with your result is take it to your GP. They can confirm it, check for anything underlying, and talk through what makes sense for you.

Over the next couple of weeks I'll send you two short emails: one on what a low testosterone result actually means, and one on where we're up to. Then I'll only be in touch when there's something worth telling you.

Keith
Andro Prime

---

_You asked us to keep you informed. Unsubscribe any time: {% unsubscribe_url %}_

---

## Email 3 — +3 days: What a low testosterone result means

**Subject:** What your result actually means.
**Preview:** Plain English. What the number is measuring, and what can affect it.

---

Hi {{ customer.first_name | default: 'there' }},

A quick, honest explainer. No spin, no pitch.

Testosterone is the main male sex hormone. It plays a part in energy, drive, mood, muscle, and sexual function. A result below 12 nmol/L sits under the level most men feel at their best, which is why it's worth understanding rather than ignoring.

A single result is a snapshot, not the whole story. A few things can affect testosterone, and a GP will usually want to look at them: sleep (short or poor sleep lowers it), body weight, alcohol, certain medications, and some underlying health conditions. That's exactly why the right next step is a conversation with a clinician who can see your whole picture, not a number in isolation.

What this result does give you is something specific to work from. Not "it's just stress" or "it's just age." A measurable starting point you can take to your GP.

If you haven't already, that GP conversation is the single most useful thing you can do with this.

Keith
Andro Prime

---

_Education only, not medical advice. Speak to your GP about your result. Unsubscribe any time: {% unsubscribe_url %}_

---

## Email 4 — +14 days: Where we're up to

**Subject:** Where we're up to.
**Preview:** An honest update, and then I'll leave you be.

---

Hi {{ customer.first_name | default: 'there' }},

Last one for now, as promised.

You asked to hear about our future service, so here's the honest status. We're building a properly regulated men's health service, under Dr Ewa Lindo's clinical oversight, and we're working through the registration that requires. It takes the time it takes, and I won't give you a date I can't keep.

When it's ready, you'll be among the first to know, with a direct email from me. Until then there's nothing to do and nothing to buy.

In the meantime, the advice hasn't changed: if you haven't taken your result to your GP yet, that's still the most useful next step.

That's me done for now. I'll only be in touch when there's something real to tell you. If anything's on your mind about your result, reply here. I read every one.

Keith
Andro Prime

---

_You're on our keep-me-informed list. No payment was taken. Unsubscribe any time: {% unsubscribe_url %}_

---

## Customer.io Build Notes

**Part A — result notification**

| # | Trigger | Delay | Subject |
|---|---------|-------|---------|
| 1 | `result_received` (low-T, Kit 1/3) | Day 0 | Your results are in. |

- Trigger filter: testosterone card state `low-testosterone` (T < 12) AND (`kit_type_latest = 'testosterone'` OR `'hormone-recovery'`). Never Kit 2.
- This is the only low-T result email. Do not also carry FM/TRT content.

**Part B — consented nurture**

| # | Trigger | Delay | Subject |
|---|---------|-------|---------|
| 2 | `lowt_nurture_consented` | Day 0 (on consent) | You're on the list. Here's what that means. |
| 3 | (same campaign) | +3 days | What your result actually means. |
| 4 | (same campaign) | +14 days | Where we're up to. |

- **Audience gate (non-negotiable):** Part B fires ONLY on the `lowt_nurture_consented` event. Never trigger Part B from `low_testosterone` alone — the trait is itself only set after consent, but the campaign trigger must be the consent event, not the trait, so an un-consented profile can never enter it.
- **No stop-goal pitch.** There is no FM/subscription conversion goal. The sequence simply ends after Email 4. Future "service is live" contact is a separate, human-authored broadcast when CQC registration completes — not part of this linear sequence.
- **Unsubscribe:** every Part B email must render `{% unsubscribe_url %}` (Liquid **tag**, not a `{{ }}` variable — the variable form silently drops the link). One-click unsubscribe in the footer.
- **Build as DRAFT only.** Per `cio-sequence-build`, never set the campaign to running. Activation is gated on the CA + Ewa sign-off for this copy.

**Retired content (do not build):** the prior seq-03b emails 3–7 (`seq-03b-email-3-founding-member`, `-4-what-trt-looks-like`, `-5-objection-handling`, `-6-personal-note`, `-7-fm-monthly-update`) and the FM/value framing in the old emails 1–2 are retired. The old HTML templates under `email-templates/html/seq-03b-*` are stale and must be regenerated from this copy (and the FM/TRT ones deleted) at build time.

**Liquid variables required:**
- `{{ customer.first_name }}` (with `| default: 'there'`)
- `{{ event.kit_name }}` (Email 1 only; with a default)
- `{% unsubscribe_url %}` (tag) on every Part B email

No `testosterone_value` / `low_testosterone` interpolation in copy — health-value minimisation (consent-gated; the value is not sent to Customer.io).
