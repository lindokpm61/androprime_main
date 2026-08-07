# Sales: Current State

Volatile sales/lifecycle status for this workspace. Durable funnel logic, routing, lifecycle stages, and rules are in `CONTEXT.md`; task-level status lives in **ClickUp** (workspace `90121729875`). This file holds only dated live status. Update the date on each change.

_Last updated: 2026-08-07 (stale zinc dose corrected in the all-clear offer copy)._

---

## Stale zinc dose corrected in the all-clear maintenance offer copy (2026-08-07)

`funnel/all-clear-maintenance-offer-copy.md` listed the Kit 1 / Kit 3 in-range trigger as **"Zinc
(Gluconate 30mg)"**. Ewa approved the cut to **25 mg** on 2026-08-02, and `04_products/supplements/daily-stack.md`
records that as applied to "all three site surfaces the same day". This file was not one of the three, and
neither was the results engine, which carried the same 30mg figure in its normal-testosterone card copy
(corrected in the same pass, commit `56f3a5e`). The LP was already right.

Found by reading rendered HTML while checking something else, not by any sweep. Worth noting as a
decision-sweep miss: a formulation change was propagated to the surfaces someone thought of, and the two
that were missed both live outside `09_website-app/app/`.


## Email sequences / campaigns (Customer.io build state)

- **All-clear retest reminder** (`retest-reminder-all-clear.md`, single send): copy **APPROVED 2026-07-18 (CA-022)**; built as **CIO campaign 23, DRAFT**. Fires on the `retest_due_at` date attribute (stamped on any whole-result all-clear); sends to ALL all-clear kit buyers, not just subscribers. Flag-gated on `RETEST_REMINDER_ENABLED`, **currently off**.
- **seq-03b (low-T notification + consent-gated nurture)**: built as **CIO campaign 5, DRAFT**, not activated. Part A result notification fires for all low-T (< 12 nmol/L); Part B education-only nurture fires ONLY on `lowt_nurture_consented`.

## Two-kit bundle funnel

- The two-kit bundle path (Confirmation / Prove-It / Full-picture SKUs, second kit on an automated later dispatch) is **dark behind `BUNDLES_ENABLED`**. The only pre-dispatch customer touchpoint, the **bundle address-check** email (`bundle_address_check` event, `bundle-address-check.md`), is **SPEC/DRAFT, not built**. Gated on the solicitor D2 bundle-terms decision plus an account-area address-update surface; needs Ewa sign-off + compliance pre-flight before build.

## Supplement waitlist capture

- Supplement range is not live in Phase 0, so a waitlist captures intent. Joining fires `supplement_waitlist_joined`, which triggers the transactional confirmation **T-10 (Supplement Waitlist Confirmed)**: a single confirmation send, not a nurture sequence. The waitlist population converts when the range ships.

## Funnel model & routing

- **`funnel/site-funnel-model.md` created 2026-07-25 (PROPOSED).** Reconciles the site to the conflict-free strategy: homepage = position + route the undecided (via the quiz); paid-search LPs (`lp/*`) = direct low-CAC conversion, no quiz; quiz = router plus the WTP/buyer-profile capture. Supersedes the acquisition-half routing assumptions in `kit-purchase.md`.
- **Open decision, pending Keith:** the homepage hero primary CTA should change from `/kits` to the quiz (the one live change the model proposes). Load-bearing because the quiz is the only planned WTP source (needs n roughly 50).
- **WTP + buyer-profile quiz block (ClickUp `869e74w93`): placement now specified** in the model (inside the quiz, after the symptom questions, un-priced, non-gating); the actual four-question Van Westendorp spec is still to write.
- **Track A launch copy** (`06_marketing/content/track-a-launch-copy.md`) message-matched to conflict-free 2026-07-25 (committed `b559ca8`); still DRAFT pending Ewa tone + claims sign-off (the Ewa sitting, ClickUp `869e7pmu9`).
