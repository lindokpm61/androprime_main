# Newsletter Broadcast Playbook — "Health Intelligence"

**Owner workspace:** `06_marketing/content/email`
**Status:** Engine spec. Issues drafted here, built as Customer.io broadcasts, never activated without sign-off.
**Created:** 2026-05-31

---

## Why this exists

This is the **warming engine** of the cold-to-warm bridge. SEO and content rank and reach;
the article footer captures the reader who is not ready to test or buy (the passive newsletter
rung on every article, plus the blog index form). Without a newsletter behind that capture, those
emails sit on a list and go cold. The broadcast is what keeps them warm until they choose to test.

The funnel, end to end:

| Stage | Mechanism | Status |
| --- | --- | --- |
| **Capture** | Newsletter rung on every article + blog-index form → `newsletter_signup` | Live |
| **Welcome** | seq-07, single confirmation email, sets expectations | Live |
| **Warm** | **This playbook: the periodic editorial broadcast** | Being stood up |
| **Convert** | Reader self-serves into the quiz → `quiz_complete` → seq-06 nurture → kit | Live |

The newsletter does **not** try to close. It earns trust and earns the click to the quiz.
Selling is handed downstream to seq-06, which is already built and sharp.

---

## The locked promise (inherited from seq-07, do not break)

The welcome email already tells every new subscriber, in Keith's voice:

> "It isn't weekly. It isn't a drip of recycled blog posts. It isn't a funnel dressed up as a
> newsletter. If I don't have something worth your time, I don't send."

Every issue must honour that. Concretely:

1. **Not weekly.** Irregular by design. Roughly monthly, sometimes less. Send when there is
   something worth a man's time, not on a calendar slot.
2. **Not recycled.** An issue may *start* from an approved article (so the claims are already
   verified), but it must go deeper, add a new angle, or reframe — not paste the post.
3. **Not a funnel.** One soft pointer per issue, maximum. See the one-pointer rule below.
4. **Deep on one thing.** One marker, one mechanism, one question, properly. Not a roundup.

If an issue cannot clear all four, it does not send.

---

## The one-soft-pointer rule

- **At most one** call to action per issue, and it is **soft**: the 2-minute symptom quiz
  (`/test-selector`), an existing Phase 0 surface. The quiz is the bridge to conversion; it does
  the routing and the selling.
- A kit may be **named in context** the way the source articles do (e.g. "Kit 2 runs hs-CRP"),
  because that is information, not a pitch. But the **action** is always the quiz, never a kit
  buy-now button, and never more than one ask.
- **Never** route to the founding-member list. Content-to-FM is a CQC/ASA boundary risk
  (`feedback_fm_list_not_in_content`, compliance CONTEXT.md). The FM list stays dashboard-only.
- **Never** imply TRT or any clinical service is available. Phase 0 boundary.

---

## Compliance gate (non-negotiable)

Newsletter issues are health content. Same gate as the articles:

1. Draft here.
2. Run the **compliance pre-flight** (`/compliance-preflight`) against `03_compliance/CONTEXT.md`.
3. **Ewa sign-off** on any clinical framing, threshold numbers, or marker interpretation.
4. Keith voice check.
5. Human go/no-go before the broadcast is set to send.

Hard rules carried from compliance CONTEXT.md:

- No "diagnose / treat / cure / fix". Markers describe, they do not diagnose.
- No EFSA-unapproved ingredient claims. **Ashwagandha is silent — never named, anywhere.**
- Any marker discussion must **preserve the GP-referral guardrails** from the source article
  verbatim in substance (the "see your GP that week if…" thresholds). Lowering or softening a
  referral threshold is a compliance failure.
- Cite only verified sources. Reuse the source article's reference list; do not introduce a new
  study without checking journal + URL.
- No-name rule: subscribers gave email only. Every name reference uses
  `{{ customer.first_name | default: 'there' }}`.

---

## Issue structure (reusable template)

1. **Subject** — concrete, curiosity over hype. Lowercase-feel, no exclamation marks. **Lead with the feeling, not the test or the marker** (feeling-first rule, see [feeling-first-content-strategy.md](../../../master-plan/2026-06-26-feeling-first-content-strategy.md)). The reader scanning their inbox feels run-down; they are not "CRP-curious". Hook on the body-feel ("worn down for months"), let the marker be the payoff in the body. A subject that opens on a biomarker, a test name, or a number has broken the rule.
2. **Preview** — one line, pays off the subject, no clickbait gap.
3. **Open** — a real scene or a single sharp claim. The CRP article's "a man brought me his GP
   printout" is the model. No "Hi, in this issue we'll cover…".
4. **The deep dive** — one topic, properly. The number, the context, the honest caveats. This is
   the value. It must stand alone as worth the open even if the reader never clicks.
5. **What to do with it** — the practical takeaway + the GP-referral line where the topic warrants
   it (it almost always does for a marker piece).
6. **One soft pointer** — the quiz, framed as "if you want to know where you actually sit".
7. **Sign-off** — Keith, Andro Prime. One-click unsubscribe in footer.

Keep it scannable but not thin. The promise is depth; a 200-word issue breaks it as surely as a
hard sell does.

---

## Build & ops (Customer.io)

- **Type:** Broadcast (newsletter / one-off send), **not** a triggered campaign. Sequences are for
  automated flows; the newsletter is a human-sent broadcast.
- **Audience segment:** `Newsletter Subscribers` (`newsletter_subscriber = true`).
- **Suppression:** none required for the broadcast itself; respect global unsubscribe.
- **No stop goal** (broadcasts are single sends).
- **Attribution:** tag the quiz pointer link with UTMs so the first-party `events` table and GA4
  mirror can attribute newsletter → quiz_start → purchase. Convention:
  `?utm_source=newsletter&utm_medium=email&utm_campaign=issue-001-crp`.
- Stays **DRAFT** in Customer.io until the full sign-off gate above is cleared.

---

## Issue backlog (sourced from live, approved articles)

Drawing from approved articles keeps claims pre-verified and the workload sane.

| # | Topic | Source article | Soft pointer | Status |
| --- | --- | --- | --- | --- |
| 001 | CRP / inflammation: what the number means | `crp-blood-test.mdx` | Quiz | APPROVED (CA-012) |
| 002 | The myth of the "normal range" | `myth-of-normal-range.mdx` | Quiz | DRAFTED 2026-06-20 (`issue-002-myth-of-normal-range.md`) — pre-flight 0 HARD / 3 🟠 (all compliant TRT-boundary lines); **pending Ewa** (Pillar C) + Keith voice check + send go/no-go |
| 003 | Low vitamin D: the symptoms men miss | `low-vitamin-d-symptoms.mdx` | Quiz | Backlog |
| 004 | Inflammatory markers, the wider panel | `inflammatory-markers-blood-test.mdx` | Quiz | Backlog |

New topics outside the approved-article set need full source verification + Ewa before drafting.
