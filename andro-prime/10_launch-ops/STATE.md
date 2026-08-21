# Launch-Ops: Current State

Volatile launch status for this workspace. Durable gate definitions, KPI conventions, and routing are in `CONTEXT.md`. Task-level status lives in **ClickUp** (workspace `90121729875`); this file is the gate-level at-a-glance. Update the date on each change.

_Last updated: 2026-08-21 (**FULL RECONCILE after four weeks stale.** Every claim below was re-verified at its source layer rather than re-dated. **The headline correction: this file said "no QA gate remains open, remaining step is the first customer order", and that was true but badly incomplete** — the launch gates do NOT live only in the Sprint list. A second ClickUp list, **Audit 2026-07-05 — Actions (`901219306518`)**, holds **four urgent open `[Launch]` items and two high `[Compliance]` items**, though **two of them are stale task titles, not live gaps** (see below): the DPIA exists and its Supabase position is correct, and the Customer.io trait gate is built and tested. A readiness read against the Sprint list alone still misses all six items. **Verified against the production database: 0 real paying customers** (3 users, 3 kit orders, 1 dispatched, 1 lab result — Keith's own run plus tests), so the first-customer gate is genuinely open. Gate 0A has moved materially: the Daily Stack **cannot be made from Nutribl stock at all**, so its first condition is currently unsatisfiable. Earlier, 2026-07-25: QA gates 3+4 cleared.)_

---

## The two lists that hold launch state, and why one file is not enough

**Read BOTH before any readiness answer.** On 2026-08-21 a launch-readiness verdict was assembled from the Sprint list alone and understated the position, because the `[Launch]`-tagged gates sit in the audit list.

| List | ID | Holds | Open |
| --- | --- | --- | --- |
| Sprint — Pre-launch | `901217968514` | delivery work | 26 |
| Audit 2026-07-05 — Actions | `901219306518` | **the launch + compliance gates** | 9 |

## Gate status

> **Gate framework (resolved 2026-07-02; 0A/0B/0C criteria restated 2026-07-09):** canonical = `implementation-checklists/qa-gates.md` **Gates 1–5 + 0A**; the strategic phase gates **0B/0C** (`01_strategy`) follow post-launch. The 1–5 + 0A set below is the operational one. The **criteria** for 0A (capped-downside spend authorisation), 0B (unit-economics: Stage-1 CPA < kit gross contribution / Stage-2 CPA < blended LTV), and 0C (Month-12 cash vs £30k) were restated by Keith 2026-07-09; canonical in `01_strategy/CONTEXT.md` → Gates Reference.

Reconciled from `qa-gates.md` (its checkbox marks are frozen at 2026-04-20 and SUPERSEDED; live status is here + ClickUp).

**QA gates: all clear, unchanged since 2026-07-25.** Checkout E2E (`869d99m5a`) and results dashboard against real data (`869d99m6m`) are both complete. **No QA gate is open.** Also cleared since the April baseline: Supabase + Stripe live · Ewa threshold + prohibited-terms + FM-CTA sign-offs · data-controller position + ICO registration · Customer.io sequences built · Vitall agreement signed 2026-06-02 · mobile QA · canonical-pages audit.

**Shipped since this file was last touched:** B1 bundle SKUs **live 2026-07-26** (`BUNDLES_ENABLED`, `lib/flags.ts:77`) · the LP design-conformance fixes · the Kit 1 scope split · the claim tier ladder (03_compliance) · **Vitall no longer receives the customer's real email or phone** (2026-08-21, verified live on build `YkyBJR98Hg-R6OZScV582`; `05_partners/labs/vitall/CONTEXT.md`).

### The technical build is not what is holding launch

**Verified against the production database 2026-08-21:** `users` 3, `kit_orders` 3 (2 live, 1 dispatched), `lab_results` 1. That is Keith's own end-to-end run plus test rows. **No real customer has ever bought.** The machinery has been proven; what is open is paperwork and one clinician sitting.

## Open launch gates (audit list `901219306518`)

All four `[Launch]` items are **urgent**:

- `869e0bc69` **First genuine customer Vitall order** — to do. The launch execution step itself. ⚠️ Its description still says it "unblocks the two formally open gates", which is stale: those gates closed 2026-07-25. The task is the launch, not a gate-closer.
- `869e0bc7k` **Update the privacy policy and sync the live page** — in progress. ⚠️ **Mostly done; re-verified 2026-08-21 against the SERVED page.** `/privacy` is live at **v1.2, July 2026**, synced at the `BUNDLES_ENABLED` flip (`248bcc1`), and accurate on explicit consent, the Recheck Bundle's automated-scheduling disclosure, retention, ICO ZC172852. Repo and live cannot drift (the Next page reads `canonical-site/privacy/index.html` at request time). **Both residuals FIXED and VERIFIED LIVE the same day at v1.3** (commit `7a483a8`): the processor register now names **Hetzner** (Helsinki, Finland, verified by RDAP on the production origin) and **Cloudflare**, Vercel is gone, and the transfers section names the basis per provider, closing the 2026-07-25 legal review's **item 10**. Keith directed the fix be made directly rather than via the solicitor. Detail in `03_compliance/STATE.md`.
- `869e0bc6t` **One Ewa sign-off session:** Track A tone, CA-017, packaging insert, all-clear offer — to do. ⚠️ **Overlaps `869e7pmu9` in the Sprint list** ("Ewa sitting — lock positioning wording + batch three sign-offs"). Two tasks, one meeting; merge or pick one before scheduling.
- `869e0bc5m` **Correct section C, then ratify the pre-launch checklist** — in progress.

Both `[Compliance]` items are **high** and both touch special-category data:

- `869e0bceu` **Record the real Supabase position; fix wrong "EU (Frankfurt)" references; sign the DPIA** — in progress. ⚠️ **STALE: the substantive work was done 2026-07-09 and the task was never moved.** Re-verified 2026-08-21:
  - **The DPIA exists** and is substantial: `03_compliance/dpia/phase0-dpia.md`, prepared by Keith as controller, three material change notes, residual risks assessed Low (so no Art 36 ICO consultation is triggered). It is not "unsigned" in any meaningful sense; Art 35 requires the assessment be carried out and documented, not signed.
  - **Supabase issue no DPIA and never will** — a DPIA is the controller's own obligation. Their DPA §3.2 commits only to "reasonable assistance to Customer to enable Customer to conduct and document any data protection assessments". Verified against <https://supabase.com/legal/customer-resources/data-processing-addendum>, 2026-08-21.
  - **The DPA needs no signature:** §12.2, "acceptance of the Agreement shall have the same effect as signing the SCCs". SCCs + UK Addendum auto-incorporated (§12.1–12.2, Schedule 2). Matches `data-controller-position.md:73`.
  - **Region verified live via the Supabase API: `eu-west-1` = Ireland**, not Frankfurt (which would be `eu-central-1`). Their DPA §6.1 commits to keeping region-directed data in region.
  - **The "EU (Frankfurt)" references are already gone.** A repo-wide grep returns two hits, both benign: the DPIA's own change note recording the correction, and this file quoting the stale task title.
  - **What actually remains on this task is Keith's call to close it**, plus the privacy-policy item tracked separately below.
- `869e0bcf4` **Decide the pre-consent health-trait emission to Customer.io** — in progress. ⚠️ **Largely stale too.** The consent gate is **built, fail-closed, and covered by 37 assertions** in `scripts/test-cio-traits-consent-gate.ts` (in the `npm test` chain; re-run green 2026-08-21), gating `low_testosterone`, `low_vitamin_d`, `low_b12`, `elevated_crp`, `crp_level`, `low_ferritin` on CA-018 consent, with a lookup failure defaulting to *no traits sent*. It is in `main`, therefore deployed. The DPIA's §5 row still reads "pending deploy + verification", which is out of date. **Genuinely outstanding: Ewa's co-sign on the gate approach** (Keith ratified it 2026-07-09).

## Other pre-launch items worth a date

From the Sprint list (`901217968514`), the ones that bear on going live rather than on growth:

- `869dgbwgm` **Rotate the Stripe live secret key** (high) — paste-then-rotate hygiene, outstanding on the payment path.
- `869e6g4gv` **Sign off the retention/deletion policy** (DRAFT) — Keith + solicitor + Ewa. Longest lead time of anything here.
- `869dw3ge8` **seq-03 results-sequence go-live** — in progress. Does **not** block the first sale, but must be live before the first customer's results land, roughly two weeks after they buy.
- `869ec31zw` **File Keith's Oct/Nov 2025 NHS results permanently** (high) — special-category data currently unfiled.
- `869d99kzh` Solicitor lawful-basis confirmation — **explicitly deferred post-launch**, a decision already taken. Not a gate.

**Resolved 2026-08-21, recorded here because it was briefly treated as a gate:** the Free Androgen Index question. An NHS lab report calls FAI invalid in men; our engine already reports it uninterpreted (badge `Reported` unfilled, no CTA, excluded from the all-clear veto) and its copy says the lab's own point. The evidence **corroborates** our published position. Not a blocker. See `04_products/STATE.md`.

## Gate 0A: supplement inventory order — NOT MET, and further away than in July

> **Restated 2026-07-09 (Keith).** Gate 0A is **no longer a demand threshold**; it is a **capped-downside spend authorisation** (a founder bet, not earned demand). The old "25+ supplement pre-orders" line was the _symptom_ that exposed the problem: it counted by first paid subscription invoice, but the 2026-05-23 supplements-deferred decision removed buy-now supplement CTAs (non-cash waitlist only), so that metric does not exist in Phase 0a; and 25 was arithmetically unreachable against the Tier-2 plan's own 90-day forecast of ~5–20 total kit sales even at 100% attach. Canonical definition: `01_strategy/CONTEXT.md` → Gates Reference.

Do not place the supplement MOQ order until all pass:

- **Capped-downside spend authorisation (all must hold):** (1) **stock private-label** formulation only, already stability-tested, no bespoke V7.2, no tooling spend; (2) total first-run exposure **capped at the phased ~£5,950**; (3) MOQ small enough that a **total write-off is survivable**; (4) the clean **4-active spec** held (Zinc, D3, Methyl-B12, KSM-66; ashwagandha silent in all copy). Supplement-waitlist opt-in rate is a **directional read only, never a threshold**.
- Lab contract signed (so kit revenue is live before inventory spend).
- Manufacturer quote accepted.
- Stability-testing path confirmed.
- Label design approved by Ewa.

**Status 2026-08-21: not met, and condition (1) is currently UNSATISFIABLE for the Daily Stack as specced.** Verified by parsing Nutribl's full 138-product trade catalogue: there is no bespoke route, no stock base to tweak (the only zinc-plus-D3 products contain iron or dose at D3 200 IU / zinc 5 mg), and the four-separate-bottles route is **under spec on zinc and KSM-66** at any price. Detail and the open "sell it as separate bottles" decision are in `04_products/STATE.md`. Nutribl have still **never been contacted**; no order placed, no quote received. Joint & Recovery separately **fits no stock container**.

**This gates the supplement line only.** Supplements have been a non-cash waitlist since 2026-05-23, so Gate 0A does **not** hold the kit launch. Do not let it.

**Waitlist reads, verified in the database 2026-08-21:** `supplement_waitlist` 4 · `supplement_subscriptions` 0. Directional only, never a threshold.

## Tier-2 build backlog (Phase 0b)

From `implementation-checklists/tier2-build-backlog-2026-06-27.md`. **Track A** (canonical + content) and **Track B** (supplements + retention). ⚠️ **The "6 of 8 still open" count in this file was a 2026-07-02 snapshot and has not been recounted; treat it as unknown rather than current.**

- **Done:** Instagram + YouTube accounts created 2026-07-02; channel art filed in `02_brand` 2026-08-20.
- **Open Keith decisions gating the builds:**
  - **Daily Stack base price.** **Verified: the live price is £34.95/mo** (`09_website-app/frontend/lib/pricing.ts:5`, `DAILY_STACK_MO`). The proposed £39.95 is **still not locked** (ClickUp `869e0bchv`, open). **Do not treat £39.95 as live.** ⚠️ `01_strategy`'s LTV model v2 quotes £39.95 and contradicts the live price.
  - Ewa sign-off on the all-clear maintenance offer (`869e0bchp`, in progress).
  - Commit supplement capital + contact manufacturers. **Blocked upstream** by the Nutribl finding above, which is now a formulation decision, not an outreach task.
  - Affiliate unfreeze — **parked**; the PT/affiliate/influencer engine has been FROZEN since 2026-06-07 and Keith restated the freeze 2026-08-20 (`06_marketing/STATE.md`).

## Analytics

- **GA4 + Sentry are the live stack.** **Plausible is NOT wired** — re-verified 2026-08-21 by grepping `app/`, `lib/` and `components/`: zero references. Ignore any workflow line that says to pull traffic or CTR from Plausible until it is.
- GEO/AEO measurement exists separately since 2026-08-15 (`06_marketing/STATE.md`): baseline recorded, cited in 0 of 72 cells.

## TRT day-1 readiness (internal target, not a CQC gate)

Founding-member list opt-ins: **0 / 40**. **Verified 2026-08-21:** `founding_member_list` 0 rows, `founding_member_deposits` 0 rows. The 40 is a commercial-readiness signal; CQC has no patient-volume requirement.

---

## Known gaps / owed (launch-ops doc hygiene)

- **This file is the one that goes stale.** Between 2026-07-25 and 2026-08-21 five other workspaces moved and this one did not, while remaining the document anyone would read to answer "are we ready". **Re-verify it whenever a readiness question is asked, and read both ClickUp lists**, not just Sprint.
- **`CONTEXT.md` Directory Structure:** only `checklists/` is genuinely absent; `dashboards/` and `weekly-reviews/` exist but are empty and unused. Actual working dirs are `implementation-checklists/` and `qa/`. The weekly-KPI workflow should run in ClickUp, not the empty `weekly-reviews/` folder.
- **Gate frameworks, RESOLVED 2026-07-02; criteria RESTATED 2026-07-09:** canonical = qa-gates **1–5 + 0A**; **0B/0C** retained as strategic post-launch phase gates. CONTEXT Gate Framework rewritten; the old "0A = pre-launch readiness" name-collision retired. 2026-07-09 (Keith): the numeric _criteria_ for 0A/0B were retired (they measured supplement metrics that the 2026-05-23 deferral removed) and restated: 0A = capped-downside spend authorisation, 0B = unit-economics CPA bars, 0C = Month-12 cash (unchanged). Canonical: `01_strategy/CONTEXT.md`. CONTEXT.md Gate Framework + qa-gates 0A definition updated to match.
- `qa-gates.md` / `launch-readiness.md` carry SUPERSEDED banners (last reconciled 2026-06-22). **Still overdue**, and `869e0bc5m` ("correct section C, then ratify the pre-launch checklist") is the task that closes it.
- **Two Ewa sitting tasks describe one meeting** (`869e0bc6t` audit list, `869e7pmu9` sprint list). Merge before scheduling, or the agenda splits.
