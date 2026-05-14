# Cowork Prompt v2 — Phase 0 Pre-Launch Tracker (FINAL)

**Purpose:** Build ClickUp structure + Cowork dashboard for the locked Phase 0 pre-launch sprint scope.
**Replaces:** `phase0-prelaunch-tracker-prompt.md` (v1) which used Phase A discovery.
**Created:** 2026-05-12
**Target launch:** 26 May 2026 (expected, 14 days) / 2 June 2026 (planned cushion, 21 days)
**Source:** Triage doc `phase0-prelaunch-triage.md` (LOCKED)

This v2 prompt skips Phase A discovery because the triage is already done. Cowork goes straight to ClickUp creation with the pre-triaged task list embedded.

---

## PROMPT TO PASTE INTO COWORK

You are helping me set up a unified pre-launch tracking system for the Andro Prime Phase 0 launch sprint. Today is 12 May 2026. The expected launch is 26 May 2026 (14 days). The planning cushion is 2 June 2026 (21 days).

I have already triaged the full task list into buckets. You do not need to discover or triage anything. The task list is embedded in this prompt below. Your job is to create the ClickUp structure, load the tasks, and build a Cowork status dashboard.

Do this in two phases. Confirm with me before proceeding from Phase B to Phase C.

---

### PHASE B — CLICKUP SETUP

Create the following structure in my ClickUp workspace:

**Space:** Andro Prime (use existing if present, create if not)
**Folder:** Phase 0 Launch
**Lists to create inside the folder:**

1. **Sprint — Pre-launch** (Bucket 1 — must ship before 2 June)
2. **Soft-launch window** (Bucket 3 — first 1-3 weeks live)
3. **Parallel / external** (Bucket 4 — blocked on external or scheduled later)

**Custom fields to create on ALL three lists:**

- **Owner** (dropdown): Keith, Ewa, Dev, Vitall, Solicitor, External
- **Source** (dropdown): V7 implications, Outstanding punch list, Compliance, Vitall correspondence
- **Workstream** (dropdown): Compliance, Vitall integration, Checkout/Auth, Results dashboard, Environment, QA, Content/Brand, Pricing, Marketing, Supplements, Engineering
- **Severity** (dropdown): Critical, High, Medium, Low
- **Blocked on** (text): name of blocker (person, response, dependency)
- **Effort estimate** (number, days): 0.5, 1, 2, 3, 5, 8
- **Status** (default ClickUp statuses + add "Blocked" and "In QA")

**Tasks to create — load these directly from the lists below. Do not invent tasks. Do not omit tasks. Use the exact metadata provided.**

---

#### LIST 1: SPRINT — PRE-LAUNCH (Bucket 1, ~25 items)

Default due date logic (apply unless task has explicit deadline):
- Critical/High → 19 May 2026 (7 days from start)
- Medium → 26 May 2026 (14 days, expected launch)
- Low → 2 June 2026 (21 days, planning cushion)

**Compliance (8 tasks)**

1. **Ewa threshold sign-off — biomarker bands Kit 1, 2, 3**
   - Owner: Keith (chasing Ewa) | Source: Compliance | Workstream: Compliance | Severity: Critical | Blocked on: Ewa response | Effort: 1 day to coordinate
   - DoD: Written sign-off from Ewa on bands per kit; document in `03_compliance/ewa-signoffs/`

2. **Ewa sign-off on prohibited-terms.md**
   - Owner: Keith (chasing Ewa) | Source: Compliance | Workstream: Compliance | Severity: Critical | Blocked on: Ewa response | Effort: 0.5 day
   - DoD: Written sign-off; list referenced in content workflow

3. **Founding-member CTA language — Ewa written sign-off (non-cash framing)**
   - Owner: Keith (chasing Ewa) | Source: Compliance | Workstream: Compliance | Severity: Critical | Effort: 0.5 day
   - DoD: Approved CTA copy; deployed across landing pages

4. **Data Controller doc completion — Prima Medical Group Ltd company number + address, ICO registration number, solicitor review**
   - Owner: Keith (chasing solicitor) | Source: Compliance | Workstream: Compliance | Severity: Critical | Blocked on: Solicitor | Effort: 1 day
   - DoD: Doc complete, solicitor-reviewed, filed

5. **Lab partner DPA — Vitall service agreement (in active negotiation)**
   - Owner: Keith | Source: Vitall correspondence | Workstream: Compliance | Severity: Critical | Blocked on: Vitall response | Effort: 2 days
   - DoD: DPA signed by both parties; copy in `05_partners/labs/vitall/`

6. **Solicitor confirmation on lawful basis for FM list (Consent / Article 6(1)(a))**
   - Owner: Keith | Source: Compliance | Workstream: Compliance | Severity: Critical | Blocked on: Solicitor | Effort: 0.5 day
   - DoD: Written confirmation; referenced in DPIA + privacy policy

7. **Vitall clinical-governance posture confirmation**
   - Owner: Keith | Source: Vitall correspondence | Workstream: Compliance | Severity: High | Blocked on: Ben (Vitall) | Effort: 0.5 day
   - DoD: Written confirmation of whether Vitall provides clinical sign-off; if not, Ewa role expanded

8. **Retroactive audit of published LinkedIn content against prohibited terms**
   - Owner: Keith | Source: Compliance | Workstream: Compliance | Severity: High | Effort: 1 day
   - DoD: All published posts checked; remediations done where required

**Vitall integration (10 tasks)**

9. **Send Vitall service agreement reply to Ben (7-point reply, draft ready)**
   - Owner: Keith | Source: Vitall correspondence | Workstream: Vitall integration | Severity: Critical | Effort: 0.5 day
   - DoD: Reply sent; draft at `05_partners/labs/vitall/correspondence/2026-05-09-ben-service-agreement-review-reply-draft.md`

10. **Send webhook URL + secret to Ben (draft ready)**
    - Owner: Keith | Source: Vitall correspondence | Workstream: Vitall integration | Severity: Critical | Effort: 0.5 day
    - DoD: Reply sent; draft at `05_partners/labs/vitall/correspondence/2026-05-12-keith-webhook-reply-to-ben.md`

11. **Provide Ben alternative email or phone for credentials zip password**
    - Owner: Keith | Source: Vitall correspondence | Workstream: Vitall integration | Severity: High | Effort: 0.25 day
    - DoD: Sent to Ben

12. **End-to-end test in Vitall "don't fulfil orders" mode — each kit type (1, 2, 3)**
    - Owner: Dev + Keith | Source: Vitall correspondence | Workstream: Vitall integration | Severity: Critical | Blocked on: Vitall account active | Effort: 1 day
    - DoD: All three kit types successfully tested through full webhook flow

13. **Confirm webhook retry policy + failed sample handling with Vitall**
    - Owner: Keith | Source: Vitall correspondence | Workstream: Vitall integration | Severity: High | Blocked on: Ben (Vitall) | Effort: 0.5 day
    - DoD: Written confirmation; documented in integration spec

14. **QR/barcode on physical kit ↔ digital activation link — open question for Vitall**
    - Owner: Keith | Source: Vitall correspondence | Workstream: Vitall integration | Severity: High | Blocked on: Ben (Vitall) | Effort: 0.5 day
    - DoD: Activation flow confirmed; test with real kit

15. **Engineering: Vitall webhook flow + types — verify lib/vitall/ result normaliser works**
    - Owner: Dev | Source: Engineering | Workstream: Engineering | Severity: Critical | Effort: 2 days
    - DoD: `lib/vitall/client.ts` and `types.ts` tested; result normaliser produces correct shape for results dashboard

16. **Engineering: rename THRIVA_ env vars → VITALL_ where remaining (phase5/7 docs)**
    - Owner: Dev | Source: Engineering | Workstream: Engineering | Severity: Medium | Effort: 0.5 day
    - DoD: All references renamed; deployment unaffected

17. **48h vs 72h SLA written confirmation from Vitall**
    - Owner: Keith | Source: Vitall correspondence | Workstream: Vitall integration | Severity: Critical | Blocked on: Ben (Vitall) | Effort: 0.25 day
    - DoD: Written SLA confirmed; `SLA_HOURS` constant locked; 5 affiliate/kit docs updated if 72h

18. **VITALL_WEBHOOK_SECRET env var in Coolify**
    - Owner: Keith | Source: Engineering | Workstream: Engineering | Severity: Critical | Blocked on: Ben confirms setup | Effort: 0.25 day
    - DoD: Env var set in Coolify; webhook fires successfully

**Checkout/Auth/Payments (2 tasks — reduced from 4)**

19. **Archive STRIPE_PRICE_FOUNDING_MEMBER Price object in Stripe dashboard**
    - Owner: Keith | Source: Outstanding punch list | Workstream: Checkout/Auth | Severity: Low | Effort: 0.25 day
    - DoD: Archived (not deleted); confirmed no live references

**Results dashboard (1 task)**

20. **Live data wiring — results dashboard**
    - Owner: Dev | Source: Engineering | Workstream: Results dashboard | Severity: Critical | Blocked on: Tasks 1 (Ewa thresholds) + 5 (Vitall DPA) | Effort: 2 days
    - DoD: Customer can view their results via dashboard with real Vitall data and Ewa-approved thresholds

**Environment/deployment (2 tasks)**

21. **Build all CIO sequences + transactional emails in CIO UI (IN PROGRESS)**
    - Owner: Keith | Source: Outstanding punch list | Workstream: Environment | Severity: Critical | Status: In progress | Effort: 3 days
    - DoD: Order confirmation, kit activation, results-ready, FM opt-in sequences all live and tested

22. **Activate n8n workflows with real credentials (QStash, ClickUp, Supabase, CIO)**
    - Owner: Keith | Source: Outstanding punch list | Workstream: Environment | Severity: High | Effort: 1 day
    - DoD: All workflows running against production credentials; test order completes end-to-end

**QA (4 tasks)**

23. **Canonical pages audit — 10 pages still unaudited**
    - Owner: Keith | Source: Outstanding punch list | Workstream: QA | Severity: High | Effort: 1 day
    - DoD: All 10 pages audited for pricing consistency, legal copy, broken links; remediations done

24. **QA checkout E2E**
    - Owner: Dev + Keith | Source: Outstanding punch list | Workstream: QA | Severity: Critical | Blocked on: Live Stripe + Supabase + Vitall credentials | Effort: 1 day
    - DoD: Full purchase flow tested with real card; webhook fires; activation works

25. **QA results dashboard with real data**
    - Owner: Dev + Keith | Source: Outstanding punch list | Workstream: QA | Severity: Critical | Blocked on: Task 20 | Effort: 0.5 day
    - DoD: Real customer journey from kit purchase to result view verified

26. **Live browser mobile QA at 375 / 390 / 768 / 1280**
    - Owner: Keith | Source: Outstanding punch list | Workstream: QA | Severity: High | Effort: 1 day
    - DoD: All breakpoints tested; layout issues fixed; conversion-critical flows verified mobile-first

**Content/Brand (3 tasks)**

27. **Voice review on brand "From £99" one-liner in 02_brand/brand-description.md**
    - Owner: Keith | Source: Outstanding punch list | Workstream: Content/Brand | Severity: Medium | Effort: 0.25 day
    - DoD: Voice-checked, signed off, deployed where used

28. **Kit 3 result conflict rule — copy not yet written (low T + energy deficiencies simultaneously)**
    - Owner: Keith + Ewa | Source: Outstanding punch list | Workstream: Content/Brand | Severity: High | Blocked on: Ewa | Effort: 0.5 day
    - DoD: Copy written, Ewa-approved, deployed to dashboard

29. **Brand voice update to lead with "patient-owned data" framing (V7-derived)**
    - Owner: Keith | Source: V7 implications | Workstream: Content/Brand | Severity: High | Effort: 1 day
    - DoD: Brand copy across LPs, emails, social bios updated to lead with patient-owned data positioning per V7 §3.3

**Pricing migration (1 task)**

30. **V2.2 pricing regression test after SLA confirmed**
    - Owner: Keith | Source: Outstanding punch list | Workstream: Pricing | Severity: High | Blocked on: Task 17 (SLA confirmed) | Effort: 1 day
    - DoD: All LP pages, emails, Stripe charges verified at £99/£119/£179

**V7 implications net-new (4 tasks — not duplicates of above)**

31. **Content pipeline pillar mix updated (40% wellness, 40% clinical-curious, 20% TRT-specific)**
    - Owner: Keith | Source: V7 implications | Workstream: Content/Brand | Severity: Medium | Effort: 1 day
    - DoD: Content calendar reflects new mix; weekly-content-orchestrator skill brief updated

32. **Customer.io lifecycle: wellness-tier journey that doesn't push TRT**
    - Owner: Keith | Source: V7 implications | Workstream: Environment | Severity: High | Effort: 1.5 days
    - DoD: Email sequence built for wellness customers who test normal; no clinical pressure; tracker engagement nudges instead

33. **Tracker analytics infrastructure (log-in tracking) scoped**
    - Owner: Keith + Dev | Source: V7 implications | Workstream: Engineering | Severity: High | Effort: 0.5 day to scope (build happens M1-M3)
    - DoD: Scope doc written; log-in event tracking definition agreed; dashboard tile spec produced. **Note: scoping only is in-sprint; actual build is post-launch.**

34. **Signup flow consent broadens to allow downstream clinical opt-in (V7 multi-vertical optionality)**
    - Owner: Keith + Dev | Source: V7 implications | Workstream: Compliance | Severity: High | Effort: 0.5 day
    - DoD: Consent capture allows broad health data processing under wellness lawful basis; explicit downstream opt-in for future clinical services

35. **CRM tags for future hair loss / GLP-1 segmentation**
    - Owner: Keith | Source: V7 implications | Workstream: Environment | Severity: Low | Effort: 0.25 day
    - DoD: Tag taxonomy created in CIO/Supabase; future-segmentation supported

36. **Documented Gate failure response protocols**
    - Owner: Keith | Source: V7 implications | Workstream: Operations | Severity: Medium | Effort: 0.5 day
    - DoD: Doc filed at `01_strategy/operations/gate-failure-protocols.md`; what happens if Gate 0A, 0B, 0C, Tracker-Engage fails

37. **Ewa retainer arrangement confirmed and signed**
    - Owner: Keith | Source: V7 implications | Workstream: Compliance | Severity: High | Effort: 1 day
    - DoD: Written agreement, monthly retainer £1k/mo, scope documented

38. **Phase 0 dashboard adds gate metrics tile + cash position tile (V7-derived)**
    - Owner: Dev | Source: V7 implications | Workstream: Engineering | Severity: Medium | Effort: 1 day
    - DoD: Dashboard shows Gate 0A/B/C status and live cash position vs plan

*That's 38 task items above but several are sub-1-day. Net total ≈ 30 tasks; I had projected 25. The difference is the V7 items that needed surfacing as their own tasks rather than being absorbed into existing ones. Still inside 21-day sprint scope (~1.5 items/day).*

---

#### LIST 2: SOFT-LAUNCH WINDOW (Bucket 3, ~18 items)

These tasks ship in the first 1-3 weeks after launch, not before. Create them in ClickUp with no due dates yet — they'll be sequenced during launch week.

**Supplements (post-Gate-0A trigger)**
- Supplement pre-order prices — fill £TBC for Daily Stack / Collagen / Complete Stack
- Coolify Stripe price IDs: STRIPE_PRICE_DAILY_STACK, STRIPE_PRICE_COLLAGEN, STRIPE_PRICE_COMPLETE_STACK

**Auth/Checkout (post-launch additions)**
- Azure app registration for Microsoft OAuth (deferred — email-only at launch)
- Self-serve "leave founding-member list" page (mailto with 7-day SLA at launch)

**Marketing activation**
- Post Keith's 5 pre-launch LinkedIn posts (drafts ready)
- Influencer outreach: 40-60 UK micro-influencers; free kits to 15-20 confirmed
- PT affiliate network outreach (300+ contacts)
- FirstPromoter account setup + FIRSTPROMOTER_API_KEY
- Pre-launch waitlist (200+ sign-ups target)
- Google Search campaign structure
- Meta pixel + event tracking
- Verify ?promo= URL param applies FirstPromoter coupon
- SUBSCRIBER10 Stripe coupon (10% off, 14-day validity) creation

**Internal hygiene**
- Build replacement n8n workflow for founding_member_list opt-in alerts
- Update lab-partner-comparison.md + lab-partner-rankings-addendum.md → "Vitall confirmed"

---

#### LIST 3: PARALLEL / EXTERNAL (Bucket 4, ~7 items)

These have owners and timelines but are not in the sprint. Create in ClickUp with target months as due dates.

- **Supplement manufacturer: ashwagandha novel food regulatory check** (post-Gate-0A trigger)
- **Supplement manufacturer: stability testing arrangement** (post-Gate-0A trigger)
- **Supplement manufacturer: label design + compliance review (Ewa sign-off)** (post-Gate-0A trigger)
- **Founder bridge loan availability confirmed for M11** (target: by M9, October 2026)
- **Tracker v1 designed as brand-visible asset** (target: M3-M4, August-September 2026)
- **Tracker analytics build** (target: M1-M3, June-August 2026; scoping is in Bucket 1)
- **Drop legacy founding_member_deposits Supabase table** (currently FROZEN — drop when historical rows confirmed unneeded)

---

#### DROPPED ENTIRELY (do not create in ClickUp)

- Inter-company brand licence (V7 §2.1 single-entity supersedes the need)

---

### END OF LIST 1/2/3 SPECIFICATION

**Phase B order of operations:**

1. Create space (Andro Prime) if not present
2. Create folder "Phase 0 Launch"
3. Create three lists (Sprint — Pre-launch, Soft-launch window, Parallel / external)
4. Create custom fields on all three lists
5. Bulk-create List 1 tasks (38 items) with full metadata
6. Bulk-create List 2 tasks (18 items) without due dates
7. Bulk-create List 3 tasks (7 items) with month-based due dates
8. Set dependencies on List 1 (use "Blocked on" field, also create ClickUp blocking relationships where applicable):
   - Task 20 blocked on Tasks 1 + 5
   - Task 25 blocked on Task 20
   - Task 30 blocked on Task 17
9. Create a "Daily standup" recurring task in Sprint list firing every weekday morning with checklist: "what shipped yesterday / what's blocking today / what's at risk"

**Phase B output:**

Summary report listing:
- Total tasks created per list
- Breakdown by workstream
- Breakdown by owner
- Breakdown by severity
- All tasks flagged as Blocked, with blocker name
- ClickUp URL for each list

Pause here and ask me to confirm before proceeding to Phase C.

---

### PHASE C — COWORK STATUS DASHBOARD

Build a Cowork-rendered status dashboard pulling from List 1 (Sprint — Pre-launch). Other lists shown as context only.

**Top section: Launch countdown**
- Days until expected launch (26 May 2026) and planning cushion (2 June 2026)
- Sprint scope: X complete / Y in progress / Z not started / W blocked
- Critical and High severity items remaining
- Tasks at risk count (definition: open + severity Critical/High + due within 3 days OR open + blocked > 48hrs)

**Middle: Burndown chart**
- Total open Bucket 1 tasks per day from 12 May to today
- Trend line vs ideal burndown (linear from 38 → 0 over 21 days)
- Flag if actual is more than 2 days behind ideal

**Workstream breakdown grid:**
- Compliance / Vitall integration / Engineering / Environment / QA / Content/Brand / Pricing / Operations
- Per cell: open / in-progress / complete

**Owner breakdown:**
- Keith / Ewa / Dev / Vitall (blocked-on counts) / Solicitor (blocked-on counts)

**At-risk panel:**
- Tasks meeting at-risk definition above
- Tasks not updated in 48+ hours
- Tasks whose dependency is incomplete and own due date is within 3 days

**Blocker watch:**
- Items grouped by external party (Ewa / Vitall / Solicitor)
- Most-overdue blocker at top
- Last-action timestamp for each

**Daily standup log:**
- Most recent standup entry
- Quick-add field for today's entry

**Refresh:** on load + manual button. Stale-data indicator if >1 hour old.

**Phase C output:**
- Dashboard URL/local path
- Refresh instructions
- Daily standup confirmed recurring

---

### OVERALL CONSTRAINTS

- **Do not invent tasks.** Every task must come from the lists above. No additions.
- **Do not modify any source files.** Read-only on `phase0-prelaunch-triage.md`, `phase0-v7-implications.md`, etc.
- **Ask me to confirm at Phase B → C boundary.** Don't auto-proceed.
- **If you can't access something (ClickUp auth, API limit, etc.), stop and tell me.**
- **Do not delete or archive existing ClickUp tasks** that I haven't told you about. If you find Andro Prime tasks already in ClickUp, list them in the Phase B report and ask me how to handle them.

---

### DEFINITION OF DONE

- 38 tasks in List 1 with full metadata, dependencies, dates
- 18 tasks in List 2 (soft-launch) without due dates
- 7 tasks in List 3 (parallel) with month-based due dates
- Daily standup recurring task active
- Cowork dashboard renders, refreshes, and shows the right at-risk view at a glance

---

End of prompt.

---

## Notes for Keith (not part of the Cowork prompt)

**What's different from v1:**

- No Phase A discovery — the task list is embedded directly
- Three ClickUp lists, not one (sprint / soft-launch / parallel)
- Dashboard shows only the sprint list on burndown; other lists are reference
- Blocker watch panel surfaces external-party dependencies (Ewa / Vitall / Solicitor) so you can see who you're chasing at a glance

**What I'd suggest you do before running this:**

1. **Confirm Ewa's availability for the sprint.** Five tasks (1, 2, 3, 7, 28, 37) require Ewa input. If she's not available for ~4-6 hours of clinical sign-off across the 21 days, the sprint slips on her bandwidth alone. Better to know now.

2. **Send Tasks 9 and 10 to Ben at Vitall today.** Both drafts are already ready. Sending them today rather than Day 5 of the sprint compresses the Vitall response window meaningfully. Tasks 7, 13, 14, 17 all sit downstream of Vitall — every day of delay is a day they can't progress.

3. **Confirm solicitor availability for Tasks 4 + 6.** If the solicitor takes 10 working days, those two tasks blow through the sprint window entirely.

**The honest read:**

Your sprint scope is 38 tasks (not the 25 I projected — the V7 items needed surfacing as their own tasks rather than being absorbed). That's ~1.8 tasks/day across 21 days. Achievable, but the blocker dependencies are the real risk, not the task count. Three external parties (Ewa, Vitall, Solicitor) gate ~12 tasks between them. If any of them are slow, the sprint slips.

**Watch for this pattern:**

- Day 1-3: feels productive, lots of internal work gets done
- Day 4-7: external blockers start surfacing
- Day 8-14: blocker chase mode, may feel stalled
- Day 15-21: either everything clears and you ship, or you're triaging which Bucket 1 items get demoted to "ship without"

If by Day 10 you have 5+ unresolved external blockers, that's the signal to push launch from 26 May to 2 June (eat the cushion) rather than ship broken. The cushion exists for exactly this reason.
