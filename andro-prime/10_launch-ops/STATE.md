# Launch-Ops — Current State

Volatile launch status for this workspace. Durable gate definitions, KPI conventions, and routing are in `CONTEXT.md`. Task-level status lives in **ClickUp** (workspace `90121729875`, sprint list `901217968514`); this file is the gate-level at-a-glance. Update the date on each change.

_Last updated: 2026-07-02._

---

## Gate status

> **Gate framework (resolved 2026-07-02):** canonical = `implementation-checklists/qa-gates.md` **Gates 1–5 + 0A**; the strategic phase gates **0B/0C** (`01_strategy`) follow post-launch. The 1–5 + 0A set below is the operational one.

Reconciled from `qa-gates.md` (its checkbox marks are frozen at 2026-04-20 and SUPERSEDED; live status is here + ClickUp).

**Cleared since the April baseline:** Supabase + Stripe live · Ewa threshold + prohibited-terms + FM-CTA sign-offs · data-controller position + ICO registration done · Customer.io sequences built · Vitall agreement signed (2026-06-02) · mobile QA passed · canonical-pages audit done.

**Genuinely open (both blocked on the first live Vitall order):**
- **Checkout E2E** — ClickUp `869d99m5a`.
- **Results dashboard with real data** — ClickUp `869d99m6m`.

**Primary blocker for launch: the first live Vitall order** (unblocks both open QA gates).

## Gate 0A — supplement inventory order (not met)

Do not place the supplement MOQ order until all pass:
- **25+ supplement pre-orders** — deposit mechanic **shelved 2026-05-08**; counted by first paid subscription invoice. (Not met; supplements are deferred to Phase 0b.)
- Lab contract signed (so kit revenue is live before inventory spend).
- Manufacturer quote accepted.
- Stability-testing path confirmed.
- Label design approved by Ewa.

## Tier-2 build backlog (Phase 0b)

From `implementation-checklists/tier2-build-backlog-2026-06-27.md`. **Track A** (canonical + content) and **Track B** (supplements + retention).
- **Done:** Instagram + YouTube accounts created (2026-07-02).
- **"Minimum to start this week": 6 of 8 still open** as of 2026-07-02.
- **Open Keith decisions gating the builds:**
  - **Daily Stack base price** — live price is **£34.95/mo**. A proposed increase to **£39.95/mo** is under consideration (backlog: "Lock base subscription price at £39.95") but **not yet locked**. Do not treat £39.95 as live.
  - Ewa sign-off on the all-clear maintenance offer.
  - Commit supplement capital + send the 4 manufacturer emails (stock-first).
  - Affiliate unfreeze (parked).

## Analytics

- **GA4 + Sentry are the live stack.** **Plausible is NOT wired** — ignore any workflow line that says to pull traffic/CTR from Plausible until it is.

## TRT day-1 readiness (internal target, not a CQC gate)

Founding-member list opt-ins: **0 / 40** target. The 40 is a commercial-readiness signal; CQC has no patient-volume requirement.

---

## Known gaps / owed (launch-ops doc hygiene)

- **`CONTEXT.md` Directory Structure is wrong:** it names `checklists/`, `dashboards/`, `weekly-reviews/` — none exist. Actual dirs are `implementation-checklists/` and `qa/`. The weekly-KPI workflow points into a non-existent `weekly-reviews/` folder.
- **Gate frameworks — RESOLVED 2026-07-02:** canonical = qa-gates **1–5 + 0A**; **0B/0C** retained as strategic post-launch phase gates. CONTEXT Gate Framework rewritten; the old "0A = pre-launch readiness" name-collision retired.
- **CONTEXT internal contradiction:** line ~7 says "do not maintain a parallel open-task list in markdown," line ~34 says checklists "are the working docs — update them as items clear." Pick one.
- `qa-gates.md` / `launch-readiness.md` carry SUPERSEDED banners (last reconciled 2026-06-22) — overdue for a reconcile vs today.
