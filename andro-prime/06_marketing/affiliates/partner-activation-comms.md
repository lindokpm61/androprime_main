# Partner Activation Comms — PT + Influencer (v1 draft)

<!--
COPY APPROVED 2026-05-18 (Ewa — register CA-007/CA-006, see
03_compliance/content-approval/approval-record-partner-activation-comms-2026-05-18.md).
NOT BUILT — copy approval is NOT a ship/activation authorisation. Build remains
gated on the isolated CIO partner space, Attio→CIO sync, e-sign mechanism,
FirstPromoter, and CA-001/003 brief approval. Recorded on Keith's instruction;
Ewa countersignature recommended. Strip this comment block at PDF/CIO build time.
-->

**Platform:** Customer.io — **isolated "Andro Prime — Partners" space** (NOT the customer space)
**Owner:** Keith Antony
**Cross-references:** `pt-programme.md` (v2.3) §5/§7, `influencer-programme.md` (v2.3) §5/§7, `commission-structure.md` (v2.3), `attio-config-spec-v2.md`, `03_compliance/CONTEXT.md`
**Status:** Draft. Replaces nothing — this sequence did not previously exist anywhere.
**Goal:** Move a confirmed partner from "interested" to first sale (PT) / first content (influencer) inside the activation window, then recover dormant partners — without a first-month cash bonus (removed in v2.3).
**Tone:** Peer-to-peer, plain, direct. Keith writing to a partner he chose, not a customer. No hype. No pressure. Specific next action in every email.

> **Read first:** `03_compliance/CONTEXT.md`. These emails go *to partners*, but every example line a partner is shown must itself be compliant. The silent-ingredient rule applies here too: this document never names it — partners are pointed to the brief for the scripted answer.

---

## 0. Why this document exists

The v2.3 programme docs design the onboarding *funnel* (vetting → brief → call → attestation → code) but the actual activation *emails* existed only as fragments:

- `pt-programme.md` §5 Step 1 (Day-0 confirmation, "60 words from Keith"), Step 4 (Day-7 check-in one-liner), §7.5 (the 60-day re-engagement email — full text already written), §7.6 (sticky moments — described, not written)
- `influencer-programme.md` §5 Step 1, Step 6 (Day-14 first-content nudge — full text already written)

This file consolidates the existing fragments verbatim where they exist, writes the missing emails, and specifies the isolated Customer.io space and triggers so it is buildable. It does not change any economics, cadence, or compliance rule — it operationalises what the programme docs already decided.

---

## 1. Isolated partner space — architecture

**A separate Customer.io space, not a segment of the customer space.** Non-negotiable for four reasons:

1. A partner who is also a customer must never receive partner emails inside a customer journey, or customer lifecycle emails framed as a partner.
2. Partner segmentation, suppression lists, and sending identity differ entirely from customer ones.
3. Partner PII and the partner funnel are governed by the Attio partner CRM, not the customer Stripe/CIO stack (see `attio-config-spec-v2.md` — Attio owns recruitment/vetting/compliance, FirstPromoter owns sales/payout).
4. Compliance blast radius is contained: a partner-space misfire cannot leak into a customer's inbox.

**System of record / data flow:**

```text
Attio (partner CRM, funnel stages)  ──webhook/Zapier──▶  CIO Partner space (people + attributes)
FirstPromoter (sales, tier, payout) ──▶ Attio rollups ──▶  CIO Partner space (first_sale_at, tier)
DocuSign / e-sign tool ──"completed"──▶ Attio "Attestation signed" ──▶ partner_attestation_signed event
```

**Person attributes required in the partner space** (set on sync from Attio; namespace is `customer.*` because Customer.io's person object is always `customer` in Liquid, even in a partner space):

| Attribute | Values | Source |
|---|---|---|
| `customer.partner_type` | `pt` \| `influencer` | Attio `affiliate_type` |
| `customer.partner_cohort` | `flagship` \| `first_wave` \| `standard` \| `gym_head_trainer` | Attio cohort tag |
| `customer.partner_code` | string (e.g. `PTJAMES15`) | FirstPromoter → Attio |
| `customer.onboarding_call_booked` | bool | Attio (calendar integration) |
| `customer.attestation_signed_at` | date \| null | e-sign tool → Attio |
| `customer.first_sale_at` | date \| null | FirstPromoter → Attio rollup |
| `customer.first_content_at` | date \| null | manual / audit log → Attio (influencer only) |
| `customer.tier` | `bronze` \| `silver` \| `gold` | FirstPromoter → Attio rollup (PT only) |
| `customer.partner_status` | `active` \| `dormant` \| `offboarded` | Attio Deal stage |

**Sending identity:** `keith@andro-prime.com`, plain-text-feel HTML, partner-relationship voice. **Global suppression:** any person with `partner_status = offboarded` (code revoked / 3-strikes / churned) is suppressed across the entire partner space.

---

## 2. PT Activation Sequence

**Trigger:** `partner_confirmed` event (fired when the Attio Deal stage reaches "Brief sent" — vetting passed, partner accepted, brief dispatched). Entry condition: `partner_type = pt`.

### PT-A1 — Day 0: Welcome + book your call

**Subject:** You're in. Here's what happens next.
**Preview:** Two things before we put your code live: a 20-minute call and the brief.

---

Hi {{ customer.first_name }},

Welcome aboard — genuinely glad to have you in. I keep this programme small on purpose, so you're not a code in a spreadsheet to me.

Two things stand between here and your code going live, and both are quick:

**1. Book your 20-minute onboarding call.** It's a walk-through, not a sales call — the brief, how to talk about the price without apologising for it, your code and asset pack. Grab a slot: [BOOK CALL LINK]

**2. Read the brief before the call.** It's the one document that matters. It covers exactly what you can and can't say. Ten minutes: [BRIEF LINK]

{% if customer.partner_cohort == 'flagship' %}
Your Kit 3 is on its way — you're a flagship partner, so you get the full panel to test yourself. Use it before you post about it.
{% elsif customer.partner_cohort == 'first_wave' or customer.partner_cohort == 'gym_head_trainer' %}
Your Kit 2 is on its way — you're in the launch cohort, so you get a kit to test yourself. The trade-off is simple: you got the kit early; I'm asking you to actually test it and talk about your own result.
{% else %}
You're joining past the seeding phase, so there's no free kit — your code gives clients 10% off and you earn on every referral. If you want to test a kit yourself, buy one through your own code and you earn the same as any other sale.
{% endif %}

Any questions before the call, just reply. I read these myself.

Keith
Andro Prime

---

### PT-A2 — +2 days: Call not booked (conditional)

**Send only if** `customer.onboarding_call_booked == false`.
**Subject:** Quick one — your call slot
**Preview:** Five minutes to book, then your code is days away.

---

Hi {{ customer.first_name }},

No rush, but your code can't go live until we've done the 20-minute call and you've signed the attestation — that's the compliance gate, same for everyone.

If the times don't work, reply with two or three windows that do and I'll make one fit: [BOOK CALL LINK]

Keith
Andro Prime

---

### PT-A3 — On `partner_attestation_signed`: You're live

**Trigger:** `partner_attestation_signed` event (e-sign tool → Attio → partner space). This breaks the time-delay chain and starts the activation clock.

**Subject:** Your code is live. Here's your first move.
**Preview:** Code, portal, asset pack — and the one recommendation to make this week.

---

Hi {{ customer.first_name }},

Done. Your code is live: **{{ customer.partner_code }}**

- **Your portal** (sales, commission, tier, asset pack): [PORTAL LINK]
- **Asset pack** (story scripts, the reel, the caption, the client-conversation script): in the portal

The single highest-leverage thing you can do this week: pick **one** client who's told you they're shattered, not recovering, or "my GP said I'm fine but I don't feel fine" — and have the conversation in the brief. One real conversation beats ten posts.

Three things from the brief that I will hold the line on, because they protect you as much as us:

1. The discount is **exactly 10%** — never a higher number, never "biggest discount", never "limited time".
2. No "diagnose", "treat", or "cure", and nothing that frames our clinical service as something someone can buy yet — we're pre-launch on that side.
3. If a client asks what's in the Daily Stack, use the scripted answer in the brief — don't improvise the ingredient list.

That's it. Make the one recommendation. Reply here if a client conversation goes sideways and you want to debrief it.

Keith
Andro Prime

---

### PT-A4 — +7 days after code-live: First-week check-in

**Subject:** A week in — how's it landing?
**Preview:** No agenda. Just checking the brief and the pitch make sense.

---

Hi {{ customer.first_name }},

A week with your code live. Quick check-in.

{% if customer.partner_cohort == 'flagship' or customer.partner_cohort == 'first_wave' or customer.partner_cohort == 'gym_head_trainer' %}
How's the kit? If it's been through the lab, your own result is the strongest content you'll ever post — your real numbers, your honest reaction. If it's still sitting on the side, this is your nudge to run it.
{% else %}
How's the brief landing? The part most standard partners want to rehearse is positioning the price — saying "£119, £107 with my code" without flinching or over-explaining. If you want to run a client conversation past me before you have it for real, reply and we'll do it.
{% endif %}

Anything unclear in the brief, now's the time to ask — better a question to me than a guess in front of a client.

Keith
Andro Prime

---

### PT-A5 — +14 days after code-live, no sale yet: First-sale push

**Send only if** `customer.first_sale_at` is null (stop-goal: see Build Notes).
**Subject:** The first one is the only hard one
**Preview:** One client, one script, this week.

---

Hi {{ customer.first_name }},

Two weeks in, no referral yet — completely normal, and not a telling-off. The first recommendation is the only one that feels awkward; after that it's just part of how you coach.

Make it concrete this week:

- **One client.** The most obvious "I'm knackered all the time" one.
- **One script.** Use the client-conversation script in your asset pack word-for-word the first time if you need to. It's written to be said out loud.
- **One line if they push on price.** "A private clinic consultation alone is £200+. This is the test, the lab, and the interpretation for £107 with my code." The full price-pushback FAQ is in the brief.

That's the whole job this week. Reply and tell me which client you're going to ask — sometimes saying it to me makes it happen.

Keith
Andro Prime

---

### PT-A6 — +30 days after code-live, no sale yet: Positioning help

**Send only if** `customer.first_sale_at` is null.
**Subject:** If something's blocking it, let's name it
**Preview:** Usually it's price confidence. That's fixable in ten minutes.

---

Hi {{ customer.first_name }},

A month in, code unused. No pressure attached to this — but I'd rather understand the blocker than let it sit.

In my experience it's almost always one of three things:

1. **Price confidence** — it feels expensive to say out loud. This is the most common one and the most fixable. Ten minutes on a call and you'll never flinch on it again.
2. **The right client hasn't come up** — fair. It will. Keep the script in your back pocket.
3. **The brief made you nervous about saying the wrong thing** — also fair, and the safest position to be in. Reply with the line you're unsure about and I'll tell you exactly how to phrase it.

If it's number 1, grab a slot: [BOOK CALL LINK]. If it's 2 or 3, just reply. Either way the code stays live.

Keith
Andro Prime

---

### PT-A7 — +60 days, no sale: Re-engagement

**Send only if** `customer.first_sale_at` is null. **Verbatim from `pt-programme.md` §7.5** — do not reword without updating the source.

**Subject:** Noticed your code hasn't been used — anything I can do?
**Preview:** No pressure. Just want to know if something's in the way.

---

Hi {{ customer.first_name }},

I noticed your code hasn't been used yet. No pressure. Just wondering: anything blocking you? Brief unclear? Worried about a specific client conversation? Sometimes premium pricing is the blocker — in which case let's talk through positioning it. Or "not the right time" is fine — code stays live for another 90 days.

Keith
Andro Prime

---

### PT-A8 — +90 days, no sale: Cadence shift (sequence exits)

**Send only if** `customer.first_sale_at` is null.
**Subject:** Keeping your code live — stopping the nudges
**Preview:** The door stays open. I'll stop filling your inbox.

---

Hi {{ customer.first_name }},

Three months, code still live, no referral — and that's genuinely fine. Life, timing, the right client not turning up. None of it is a problem.

I'm going to stop the regular nudges from here so I'm not clutter in your inbox. Your code stays live. If a client ever comes to mind, it's there and so am I — just reply to this email and we pick straight back up.

Keith
Andro Prime

*(Sequence exits here. Partner moves to the quarterly newsletter cadence — see `pt-programme.md` §5 Step 5.)*

---

## 3. Influencer Activation Sequence

**Trigger:** `partner_confirmed` event. Entry condition: `partner_type = influencer`.

### INF-A1 — Day 0: Welcome + kit on its way

**Subject:** You're confirmed — kit's on its way
**Preview:** Read the brief, use the kit, then your code goes live.

---

Hi {{ customer.first_name }},

Confirmed and glad to have you. Here's everything in one place.

{% if customer.partner_cohort == 'first_wave' %}
**Your free Kit 2 is being dispatched.** The one rule that matters: actually use it before you post about it. Honest reaction — positive, neutral, or critical — all fine. Posting about a kit you haven't used is the one thing that ends the partnership immediately.
{% else %}
The first-25 free-kit cohort is closed, so there's no free kit — but your code is live-ready and your audience still gets 10% off with it. If you want product experience, buy a kit through your own code (you earn the £15 back). You can't claim personal experience you haven't had — credibility-led framing only, as in the brief.
{% endif %}

**Read the brief** — it's the one document that matters, and it has an influencer section on disclosure: [BRIEF LINK]

**Optional 15-minute call** if you want to talk it through: [BOOK CALL LINK]. Most creators skip it — if you do, I'll send a 7-minute Loom instead, and I need you to acknowledge you've watched it before the code can go live. That's the compliance gate, not a formality.

One thing up front, because it's the most common slip: **#ad or #gifted on every post, including Stories, visible without expanding.** The brief covers the rest.

Keith
Andro Prime

---

### INF-A2 — +3 days: Acknowledgement nudge (conditional)

**Send only if** `customer.attestation_signed_at` is null.
**Subject:** Quick one — so your code can go live
**Preview:** Brief acknowledged or call done, then you're live.

---

Hi {{ customer.first_name }},

Your code can't activate until you've either done the 15-minute call or confirmed you've watched the Loom and signed the attestation. Same gate for every creator — it's what keeps the programme clean.

Loom + attestation here, two minutes: [LOOM/ATTESTATION LINK]. Or book the call: [BOOK CALL LINK].

Keith
Andro Prime

---

### INF-A3 — On `partner_attestation_signed`: You're live

**Trigger:** `partner_attestation_signed` event. Starts the activation clock.

**Subject:** Your code is live
**Preview:** Code, portal, asset pack — and the rules that protect you.

---

Hi {{ customer.first_name }},

You're live. Your code: **{{ customer.partner_code }}**

- **Your portal** (sales, commission, asset pack): [PORTAL LINK]
- **Asset pack** (Reel script, Story sequence, caption template — all with the disclosure built in): in the portal

The rules, short version, because breaking them lands the ASA complaint on us and ends the partnership for you:

1. **#ad or #gifted on every post, including Stories**, visible without expanding, never edited away afterwards.
2. The discount is **exactly 10%** — never a higher number, never "exclusive", never "limited time".
3. No "diagnose", "treat", or "cure", and nothing that frames our clinical service as something someone can buy yet — we're pre-launch on that side.
4. If your audience asks what's in the Daily Stack, use the scripted answer in the brief — don't improvise the ingredient list.
5. Only post about the kit if you've actually used it.

That's the whole compliance surface. Within it, post whatever's genuinely true for you — your real reaction is the only thing that converts.

Keith
Andro Prime

---

### INF-A4 — +7 days after code-live: Kit arrived + how to post

**Subject:** Kit should have landed — the honest version posts best
**Preview:** No obligation to be positive. Just real, and disclosed.

---

Hi {{ customer.first_name }},

{% if customer.partner_cohort == 'first_wave' %}
Your kit should have arrived by now. Run it before you post anything — your real numbers and your honest reaction are the entire value here. If it hasn't arrived, reply and I'll chase it today.
{% else %}
A week in. If you bought a kit through your code to try it, run it before you reference your own experience. If not, keep it credibility-led — "I've vetted this for my audience" — never implied personal experience.
{% endif %}

There's no obligation to post, and no obligation to be positive if you do — authenticity is the requirement, not a good review. The only hard parts are the ones from the last email: disclosed (#ad/#gifted, visible), exactly 10%, no medical claims, used-it-before-you-post.

If you're unsure whether a specific line is allowed, send it to me before you publish. Always cheaper to ask.

Keith
Andro Prime

---

### INF-A5 — +14 days, no content: First-content nudge

**Send only if** `customer.first_content_at` is null. **Verbatim from `influencer-programme.md` §5 Step 6** — do not reword without updating the source.

**Subject:** Just checking in
**Preview:** Did the kit arrive? No pressure to post.

---

Hi {{ customer.first_name }},

Just checking in. Did the kit arrive? Any questions on the brief? No pressure to post — only if it feels right and your audience would care. Either way, happy to chat if helpful.

Keith
Andro Prime

---

### INF-A6 — +30 days, no content: Monitoring (sequence exits)

**Send only if** `customer.first_content_at` is null. Per `influencer-programme.md` §5 Step 6: no re-engagement push beyond Day 30.

**Subject:** No nudges from here — code stays live
**Preview:** If the moment comes, the code's there.

---

Hi {{ customer.first_name }},

A month in, nothing posted — and that's completely fine. The brief said no obligation and I meant it.

I'll stop checking in from here so I'm not noise in your inbox. Your code stays live. If a moment ever comes up where the kit genuinely fits your content, it's there and so am I — just reply.

Keith
Andro Prime

*(Sequence exits. Partner moves to "monitoring" status per `influencer-programme.md` §5 Step 6.)*

---

## 4. Event-triggered "sticky moment" emails

These are not part of the linear flow. They fire on events and apply across both cohorts unless noted. (Sources: `pt-programme.md` §7.6, `commission-structure.md` v2.3 §5.)

### S1 — On `partner_first_sale`: First sale (PT + influencer)

**This event is also the stop-goal for PT-A5/A6/A7/A8 and influencer INF-A5/A6.**

**Subject:** That's your first one.
**Preview:** Hand-written, because the first one matters.

---

Hi {{ customer.first_name }},

Your first referral just came through {{ customer.partner_code }}. That's the hard one done — every one after this is easier.

{% if customer.partner_type == 'pt' %}
It's in your portal now, commission and all. Now it's just part of how you coach.
{% else %}
It's in your portal, commission and all. Whatever you posted worked — do more of that.
{% endif %}

Nicely done. Keep going.

Keith
Andro Prime

---

### S2 — On `tier_graduation`: Graduation bonus (PT only)

**Entry condition:** `partner_type = pt`. **Verbatim framing from `pt-programme.md` §7.6** — the one-off nature must stay explicit.

**Subject:** You hit {{ customer.tier | capitalize }} this month
**Preview:** Your one-off graduation bonus, and what it does and doesn't mean.

---

Hi {{ customer.first_name }},

{% if customer.tier == 'silver' %}
You hit **Silver** this month. The **£200 graduation bonus** is in your account next Friday.
{% elsif customer.tier == 'gold' %}
You hit **Gold** this month. The **£400 graduation bonus** is in your account next Friday.
{% endif %}

One thing so there's no confusion later: this bonus is **one-off**. After this month the tier stays for the recognition and the benefits — but the cash bonus is paid once, not monthly. You keep earning the standard £15 base plus per-kit bonuses on everything from here. Full mechanics are in the commission structure on your portal.

Genuinely well done — this is a small group.

Keith
Andro Prime

---

### S3 — Quarterly contest result: manual broadcast (PT + influencer pool)

**Not a wired campaign.** Manual broadcast, like `seq-03b` Email 7. The quarterly pool is harmonised across PTs and influencers (`commission-structure.md` v2.3 §5: £750 top + £250 newcomer, best 90-day performer wins regardless of cohort).

Audience: partner-space segment "Quarterly contest — eligible". Keith fills the winner block and sends manually each quarter. Body skeleton:

> Subject: Q[N] results — and the numbers behind them
>
> Hi {{ customer.first_name }}, the quarter's in. **Top performer: [NAME] — £750.** **Best newcomer: [NAME] — £250.** [One honest line on what the quarter looked like overall.] Next quarter's pool is open from today — same rules, both PTs and creators in one pool, best 90 days wins. Keith / Andro Prime.

---

## 5. Customer.io Build Notes

> **Build target:** the isolated **"Andro Prime — Partners"** space. Provision the space first (outstanding — see §7). All campaigns built **draft**; activation is a human go/no-go gate, same as every customer sequence.

| Campaign | Trigger | Flow | Stop-goal |
|---|---|---|---|
| PT Activation | `partner_confirmed` (type=pt) | A1 Day0 → A2 +2d* → [A3 on `partner_attestation_signed`] → A4 +7d → A5 +14d* → A6 +30d* → A7 +60d* → A8 +90d* → exit | Segment **"Partner — first sale made"** (`first_sale_at` set) suppresses A5–A8. `partner_status = offboarded` exits all. |
| Influencer Activation | `partner_confirmed` (type=influencer) | A1 Day0 → A2 +3d* → [A3 on `partner_attestation_signed`] → A4 +7d → A5 +14d* → A6 +30d* → exit | Segment **"Partner — first content/sale"** (`first_content_at` OR `first_sale_at` set) suppresses A5–A6. `offboarded` exits all. |
| First sale (S1) | `partner_first_sale` | single email | n/a — also feeds the stop-goal segment above |
| Tier graduation (S2) | `tier_graduation` (type=pt) | single email, Liquid-branched silver/gold | n/a |
| Quarterly contest (S3) | manual broadcast | single email | n/a — not wired |

`*` = conditional send. Implement as a per-email precondition (`onboarding_call_booked == false` for PT-A2; `attestation_signed_at is null` for INF-A2; `first_sale_at is null` for PT-A5..A8; `first_content_at is null` for INF-A5..A6). Delays after A3 are measured **from the `partner_attestation_signed` event**, not from Day 0 — A3 resets the clock. If a partner never signs the attestation, A3 and everything after it never fire; PT-A2/INF-A2 plus the offboarding sweep handle that path.

**Attestation dependency:** A3 (the activation pivot) is gated on the `partner_attestation_signed` event, which depends on the e-signature mechanism being chosen and wired into Attio (outstanding programme item — see §7). Until that exists, A3 onward cannot fire; A1/A2 are safe to build and test.

**Liquid variables required:** `customer.first_name`, `customer.partner_type`, `customer.partner_cohort`, `customer.partner_code`, `customer.onboarding_call_booked`, `customer.attestation_signed_at`, `customer.first_sale_at`, `customer.first_content_at`, `customer.tier`, `customer.partner_status`. All set on Attio→partner-space sync (§1).

**Placeholders to resolve before build:** `[BOOK CALL LINK]`, `[BRIEF LINK]` (the signed v2.3 PDF — blocked on the 6 sign-offs + PDF regen), `[PORTAL LINK]` (FirstPromoter portal — blocked on FirstPromoter setup), `[LOOM/ATTESTATION LINK]` (blocked on e-sign tool decision).

<!-- SLA note: no email in this sequence quotes a results turnaround figure, so the 48h-vs-72h Vitall question does not touch this file. If a turnaround line is ever added, apply the same conditional-revisit annotation used in pt-programme.md §6 / influencer-programme.md §6. -->

---

## 6. Compliance

Self-checked against `03_compliance/CONTEXT.md` red-flag table. Findings:

- **Silent ingredient:** never named anywhere in this document; partners are pointed to the brief's scripted answer (PT-A3 point 3, INF-A3 point 4). Holds the rule without printing the word — consistent with the v2.3 brief approach.
- **No medicinal-claim or unsubstantiated-efficacy language** anywhere; the only example partner-facing lines ("knackered all the time", "£107 with my code") are lifted verbatim from the already-pre-flighted `pt-programme.md` §6 asset pack.
- **Exact 10%** stated as a hard rule in PT-A3 and INF-A3; no inflated-discount language anywhere.
- **Phase 0 boundary:** the TRT-launch-waitlist reward (reworded + approved 2026-05-18 per CA-001; was "reserved early-access TRT slot") is deliberately **not** enumerated in any activation email — reward detail is deferred to the brief/portal to keep boundary-adjacent lines out of automated sends.
- **Net-new copy:** **Ewa copy sign-off recorded 2026-05-18** (CA-006, on Keith's instruction; direct countersignature recommended). The 1 REVIEW item (the §6 TRT-slot exclusion note) is reconciled — the reward was reworded under CA-001 and is still deferred to the brief/portal, so no email body changed.

**Gate:** copy is approved; **build/activation is NOT**. Do not build or activate until (1) the isolated partner space exists, (2) Attio→CIO sync + e-sign trigger are wired, (3) FirstPromoter is set up, (4) the linked briefs CA-001/CA-003 are shippable. Approval logged in `03_compliance/content-approval/` (CA-006).

---

## 7. Blockers / dependencies

1. **Isolated CIO partner space** not yet provisioned (ClickUp task 41 — partner space + activation sequence).
2. **Attio → partner-space sync** (webhook/Zapier) not built; Attio Zaps referenced in `attio-config-spec-v2.md` but not configured.
3. **E-signature mechanism** not chosen — gates the `partner_attestation_signed` trigger and PT-A3/INF-A3 onward.
4. **FirstPromoter** not set up (outstanding task 34) — gates `partner_code`, `first_sale_at`, `tier` rollups and the portal link.
5. **Signed v2.3 brief PDF** not generated — gates `[BRIEF LINK]`. Influencer-Brief (CA-003) APPROVED; PT-Brief (CA-001) Ewa+Keith signed, **solicitor** outstanding; PDFs must strip reviewer comment blocks at generation.
6. ~~**Ewa sign-off** on net-new partner copy~~ — **DONE 2026-05-18 (CA-006).**

---

*Compiled: 2026-05-18*
*Owner: Keith Antony*
*Version: 1 — first draft, consolidates pt-programme/influencer-programme fragments + net-new activation copy*
*Status: COPY APPROVED 2026-05-18 (Ewa, CA-006) — NOT BUILT (build gated; see §7)*
