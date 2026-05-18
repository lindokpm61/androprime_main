# seq-07: Newsletter Welcome

**Platform:** Customer.io
**Trigger:** `newsletter_signup` event (fired by `/api/forms/newsletter`, the blog "Health Intelligence Newsletter" form)
**Audience:** Anyone who subscribes to the newsletter from the blog. Not necessarily a customer. Most will have given only an email address (no first name).
**Goal:** Confirm the subscription, set honest expectations, and make the first issue feel worth waiting for. No hard sell.
**Tone:** Keith's voice: personal, direct, plain English. These people opted in to read, not to buy. Respect that. One soft pointer to the kits at most.

**Important:** This is a single email. The editorial newsletter itself is a separate, human-written periodic broadcast to the `Newsletter Subscribers` segment (no content exists yet, not built here). This sequence only sends the one welcome/confirmation email on opt-in.

**No-name rule:** The blog form collects email only. Do not assume `first_name` exists. Use the Liquid default filter on every name reference.

---

## Email 1 - Immediate: Welcome / confirmation

**Subject:** You're subscribed. Here's what you'll get.
**Preview:** Plain-English deep-dives on the markers that actually matter. No filler.

---

Hi {{ customer.first_name | default: 'there' }},

You're subscribed. Confirmed.

Here's what this is. Every so often I send one email that goes properly deep on a single thing that matters to men's health. What a blood marker actually tells you. Why a supplement ingredient is in a formula, or why it isn't. What the research says, in plain English, without the supplement-industry spin.

Here's what it isn't. It isn't weekly. It isn't a drip of recycled blog posts. It isn't a funnel dressed up as a newsletter. If I don't have something worth your time, I don't send.

A bit of context on why this exists. UK men over 35 are routinely told their levels are "normal" by a system that screens for illness, not for how you actually feel or perform. Most of what gets written about that gap is either vague or selling something. This is my attempt to do the opposite: give you the information and let you decide.

That's it. The next one lands when it's ready.

If this isn't for you, there's an unsubscribe link at the bottom of every email and it works on the first click. No hard feelings.

Keith
Andro Prime

P.S. If you landed here before doing a test and you're not sure where you stand, the 2-minute quiz points you to the right kit based on your symptoms: https://andro-prime.com/test-selector

---

## Customer.io Build Notes

| # | Delay | Notes |
|---|-------|-------|
| 1 | Immediate | Single sequence email. No follow-ups. |

**Trigger:** `newsletter_signup` event.

**Audience / segment:** Subscribers are identified with `newsletter_subscriber = true` and `newsletter_signup_source` (currently `blog`) via `identifyUser()` in `/api/forms/newsletter`, fired immediately before the `newsletter_signup` event. Build a data-driven segment **`Newsletter Subscribers`** = `newsletter_subscriber` is `true`. This segment is the audience for the future editorial broadcast (not built here); the welcome campaign itself triggers on the event.

**Stop goal:** None. Single send, nothing to stop.

**Suppression:** None required. (A subscriber who is also on another sequence still legitimately gets a one-off newsletter confirmation.)

**Delays:** None. Immediate send on event.

**Liquid variables required:**
- `{{ customer.first_name | default: 'there' }}`. Newsletter signups capture email only; the default is mandatory, not optional.

**Compliance notes (body checked against `03_compliance/CONTEXT.md`):**
- Phase 0 wellness only. Body makes no medicinal claim, no clinical-service availability claim, and no supplement health claim (deliberately omitted: a welcome email does not need ingredient benefits, which keeps it clear of EFSA wording risk). Guardrail #3 silent-ingredient rule respected: the body names no ingredient and makes no ingredient claim.
- No founding-member or clinical-service CTA in the body (the only outbound link is the symptom quiz, an existing Phase 0 surface).
- Marketing-consent basis: subscription is gated client-side on an explicit, unticked consent box (UK GDPR). One-click unsubscribe referenced in the body and present in the footer.
- Campaign stays **DRAFT** until Keith voice check, compliance sign-off, and human go/no-go (same gate as all other campaigns).
