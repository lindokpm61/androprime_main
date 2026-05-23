# T-10. Supplement Waitlist Confirmed

**Platform:** Customer.io
**Trigger:** `supplement_waitlist_joined` event
**Send:** Immediate
**Type:** Transactional, single email, no stop goal, no follow-ups.
**Tone:** Plain English. Keith's voice. Honest about timing. No medicinal claim.
**from_identity_id:** 1

> **Phase 0a artefact.** Introduced 2026-05-23 as part of the Phase 0a supplements-deferred plan. The waitlist-mention pattern is referenced from seq-03a / seq-03c / seq-03d Email 3 (Phase 0a v1). When supplements ship in Phase 0b, this email continues to fire as the immediate confirmation for anyone joining the waitlist between cohorts; it is not retired by Phase 0b.

---

## Event payload

The triggering event should set the following customer attributes via `identifyUser()` at the moment of opt-in (mirroring the T-04 founding-member pattern):

| Attribute | Type | Required | Notes |
|---|---|---|---|
| `customer.first_name` | string | optional | Falls back to a neutral greeting if missing. |
| `customer.supplement_waitlist_source_marker` | string | required | One of: `vitamin-d`, `b12`, `vitamin-d-b12`, `testosterone-maintenance`, `borderline-t`, `general`. Determines whether the OTC paragraph appears and which one. |
| `customer.supplement_waitlist_joined_at` | ISO-8601 datetime | optional | For auditing. Not rendered in the email. |

Source-marker values map back to the email that drove the opt-in:

- `vitamin-d`: seq-03a Email 3 low-Vitamin-D branch
- `b12`: seq-03a Email 3 low-B12 branch
- `vitamin-d-b12`: seq-03a Email 3 both-below-optimal branch
- `testosterone-maintenance`: seq-03c Email 3 testosterone (in-range) branch
- `borderline-t`: seq-03d Email 3
- `general`: any other entry surface (e.g. supplement-waitlist landing page direct opt-in)

---

**Subject:** You're on the supplement waitlist.
**Preview text:** What you've joined, when supplements ship, and the founding-customer discount.

---

Hi {{ customer.first_name | default: "there" }},

You're on the Andro Prime supplement waitlist. No payment, no commitment, just your name on a short list of people who want to hear first when our supplements go on sale.

**What being on the list means:**
- A direct, priority notification when supplements ship
- The founding-customer discount, locked in at launch
- No filler emails in the meantime, just honest progress when there's something to say

**When supplements ship:**
We're launching shortly, as soon as our manufacturing partner is confirmed. We won't give you a date we can't keep. You'll hear from us when we have something real to tell you.

{% if customer.supplement_waitlist_source_marker == "vitamin-d" or customer.supplement_waitlist_source_marker == "vitamin-d-b12" %}
**In the meantime, on Vitamin D:** an over-the-counter Vitamin D3 supplement is widely available in any UK pharmacy or supermarket. 4,000 IU/day is the dose typically used to correct a deficiency, rather than just maintain levels. Vitamin D contributes to normal muscle function.
{% endif %}

{% if customer.supplement_waitlist_source_marker == "b12" or customer.supplement_waitlist_source_marker == "vitamin-d-b12" %}
**In the meantime, on B12:** an oral B12 supplement in the Methylcobalamin form (the active form your body uses most efficiently) is widely available in any UK pharmacy. B12 contributes to normal energy-yielding metabolism and normal psychological function.
{% endif %}

If you'd rather not be on the list, just reply to this email and we'll take you off. Or email keith@andro-prime.com any time.

Keith
Andro Prime

---

_No payment was taken. You're on a list, not under any obligation. Reply any time to leave it._

---

## Liquid branches (for the CIO builder)

The body of this email has two optional paragraphs controlled by `customer.supplement_waitlist_source_marker`. They are mutually compatible:

| Source marker | Vitamin D paragraph | B12 paragraph |
|---|---|---|
| `vitamin-d` | ✅ shown | ✗ hidden |
| `b12` | ✗ hidden | ✅ shown |
| `vitamin-d-b12` | ✅ shown | ✅ shown |
| `testosterone-maintenance` | ✗ hidden | ✗ hidden |
| `borderline-t` | ✗ hidden | ✗ hidden |
| `general` | ✗ hidden | ✗ hidden |

The `testosterone-maintenance`, `borderline-t`, and `general` cases intentionally omit the OTC suggestion because:

- The seq-03c (testosterone in range) and seq-03d (borderline T) emails already point men to all three building blocks (Zinc + D3 + B12) over the counter. T-10 is the confirmation, not a duplicate of that advice.
- The `general` case has no medical context to ground an OTC suggestion. Suggesting an OTC supplement without a result on file is out of scope for a transactional confirmation.

**No EFSA claim is made for Zinc in T-10.** Zinc as a testosterone-maintenance ingredient is only mentioned in the originating result-tier email (seq-03c / seq-03d), not in this confirmation.

---

## Customer.io Build Notes

| # | Delay | Notes |
|---|-------|-------|
| 1 | Immediate | Triggered by `supplement_waitlist_joined`. No subsequent emails in this campaign. |

**Stop goal:** None. Single-send transactional.

**Suppression:** This email always sends on the trigger; it is the confirmation of an opt-in. Do not suppress it from any other sequence.

**Cross-sequence interaction:** When `supplement_waitlist_joined` fires:
- seq-03a Email 4 (and later) should treat it as the Email 3 success-stop signal (see seq-03a Phase 0a stop-goal note).
- seq-03c and seq-03d should treat it similarly (see their respective Phase 0a stop-goal notes).

**Compliance notes:**
- No medicinal claim. The OTC paragraphs use EFSA-approved wording verbatim.
- No mention of any silent ingredient. No Ashwagandha reference, anywhere.
- No clinical-service implication. Supplements are not regulated clinical services; this email does not touch the wellness / clinical boundary.

**Liquid variables required:**
- `{{ customer.first_name }}` (with `default: "there"` fallback)
- `{{ customer.supplement_waitlist_source_marker }}` : string, set via `identifyUser()` at the moment of opt-in
