# Retest reminder — all-clear (Phase 2)

**Status:** Copy **APPROVED 2026-07-18** (Ewa clinical, reported by Keith; + Keith business) — logged as CA-022. The Customer.io campaign (id 23) stays DRAFT: activation still gated on the `RETEST_REMINDER_ENABLED` flag + deploy, an attribute-live test-send, the subscriber-suppression filter, and a human go/no-go.
**Platform:** Customer.io
**Goal:** Send ONE retest nudge to every kit buyer whose result came back all-clear — not just supplement subscribers (they already get the Day-90 `seq-04 e5` prompt). This closes the gap flagged in `09_website-app/docs/2026-07-17-retest-cta-mechanism-decision.md` (P3): the marketing promises a passive retest reminder, but before this only subscribers got one.
**Tone:** Plain, honest, no hype, no urgency. Keith's voice. On an all-clear result there is nothing to fix and nothing to sell hard.

**Compliance note (same rule as seq-04):** Never imply a supplement or anything else "fixed" or "cured" the person. Use "find out how your levels have changed". No health claim beyond the fact that levels move over time. No em dash in the copy.

---

## Trigger & segment (Customer.io build)

- **Campaign type:** `date` (date-attribute triggered), frequency `once`. Triggers off `date_triggered_attribute = retest_due_at`, sending on the due date. Built as campaign **id 23** (draft) in env 219186 on 2026-07-18.
- **Attribute:** `retest_due_at` — a Unix-seconds date stamped onto the customer profile by `buildCioTraits` (in `lib/results/processResult.ts`) when a result is **whole-result all-clear** and the `RETEST_REMINDER_ENABLED` flag is on. Value = result date + `RETEST_REMINDER_MONTHS` (currently 6 months, the start of the agreed 6–12 month window).
- **Why no separate all-clear filter:** `retest_due_at` is only ever stamped on an all-clear result, so anyone who has the attribute already qualifies. No extra segment condition needed.
- **Suppression — DEFERRED to supplement launch (2026-07-18).** Intent: exclude anyone who has fired `subscription_started` so a supplement subscriber does not get both this and the Day-90 seq-04 e5 prompt. Deliberately NOT wired yet, because in Phase 0 the supplement range is not live, `subscription_started` never fires, so the subscriber population is **empty** — there is nothing to suppress. It also has no clean mechanism yet (a `date`-campaign audience uses base64 `filters`, and there is no subscriber segment to exit on until supplements exist). Add it as a `global_exit_condition` on the subscriber segment at the same time the retest discount is added (both gated on the supplement range going live).
- **Idempotency:** frequency `once` = one reminder per due date. If a later all-clear result re-stamps `retest_due_at`, that is a fresh, correct reminder.

> The mechanism is built and dark. The remaining work is flipping the `RETEST_REMINDER_ENABLED` flag (so the attribute flows and registers in the CIO catalog), then the copy sign-off + activation gate below.

---

## Deferred: retest discount

The marketing promises a retest discount for supplement subscribers "once the range is live". The supplement range is not live yet, so this email links to a plain reorder for now. When the range ships, add the subscriber discount + a discounted reorder link here (and re-run the compliance pre-flight on the added line).

---

## Sign-off

| | Name | Decision | Date |
|---|---|---|---|
| Clinical / results copy | Dr Ewa Lindo | ✅ Agreed (reported by Keith; countersignature recommended) | 2026-07-18 |
| Business | Keith Antony | ✅ Agreed | 2026-07-18 |

Logged as **CA-022** in `03_compliance/content-approval/content-approval-register.md`.

---

## Email 1 — Retest reminder (all-clear)

**Subject:** Time for a fresh reading
**Preview:** Your last check was all in range. Levels move over time.

_Alternate subject for Ewa/Keith to pick: "It has been six months. Where are your levels now?"_

---

It has been about six months since your last check with Andro Prime. Your results then were all in range, which is a good place to be.

Levels do not stay still. They shift with the seasons, your training, your diet and your age. A retest is the only way to find out how your levels have changed since last time, and a second reading gives you a trend rather than a single snapshot.

There is no urgency here, and nothing about your last result needs action. If you are feeling well, this is simply the point where a fresh reading is useful. If something has not felt right, your GP is always a sensible place to start.

When you are ready:

**Retest your markers:** https://andro-prime.com/kits

Keith

Andro Prime
