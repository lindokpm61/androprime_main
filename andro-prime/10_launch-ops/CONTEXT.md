# Launch Ops — Context

**Purpose:** Implementation tracking, QA gates, launch readiness, and post-launch performance review
**Owner workspace:** `10_launch-ops`
**Integration:** Gates reference build state in `09_website-app`. KPI dashboards pull from **GA4** (`G-D5M4J5M3F6`, live), Stripe, and Supabase. Financial snapshots update `01_strategy/financial-model/financial_model.html`.

> **Canonical task tracking = ClickUp**, not markdown. Live sprint list **`901217968514`** in workspace **`90121729875`** (statuses: to do / in progress / complete) holds the authoritative task IDs; `phase0-prelaunch-triage.md` is the live triage narrative. The old `checklists/launch-readiness.md` + `qa-gates.md` were **retired as drifting trackers** (banners point to ClickUp). **Do not maintain a parallel open-task list in markdown** — update ClickUp. Build status per subsystem lives in each workspace's `STATE.md` (09/06/02/01) + git history, not a central build log. **Gate-level live status** (which gates are open, Gate 0A, the tier-2 backlog decisions, the analytics stack) is in this workspace's own `STATE.md` — read it alongside this file. _(Every ClickUp MCP call must pass `workspace_id: "90121729875"`.)_

This workspace moves the project from planned to live and tracks performance once open. It is operational, not strategic. Output here is concise, status-aware, and action-oriented. Do not use it for strategy, brand development, product design logic, or app architecture.

---

## Directory Structure

```text
10_launch-ops/
├── implementation-checklists/
│   ├── qa-gates.md                        ← Gates 1–5 + 0A (framework valid; live status SUPERSEDED → ClickUp + STATE.md)
│   ├── launch-readiness.md                ← April baseline (SUPERSEDED banner)
│   ├── tier2-build-backlog-2026-06-27.md  ← Phase 0b Track A/B build backlog
│   └── lp-implementation-checklist.md · blog-template-prep.md
├── qa/                                    ← Per-surface QA audits (canonical-pages, lp-pages, checkout, results-dashboard, mobile, …)
├── engagement-analytics-scope.md · pre-launch-waitlist-build-plan-2026-05-08.md
└── CONTEXT.md · STATE.md

(No `checklists/`, `dashboards/`, or `weekly-reviews/` directory exists — those names were listed here but are not on disk.)

> **Stale workflow references (audit flag 2026-07-02):** the Weekly KPI review, Gate Framework, and How-to-Work sections below still name `checklists/` / `dashboards/` / `weekly-reviews/` and **Plausible** (not wired — the live stack is GA4 + Sentry). Treat those pointers as stale; live gate status and the correct sources are in `STATE.md` (Known gaps), and task status is in ClickUp.
```

---

## Gate Framework

**Canonical operational gates: Gates 1–5 + 0A, defined in `implementation-checklists/qa-gates.md`** (the source of truth for what each gate means; live pass/fail state is in `STATE.md` + ClickUp, not the frozen checkboxes in that file).

| Gate | Meaning | Blocks until passed |
| --- | --- | --- |
| Gate 1 | LP pages ship | affiliate / social promotion |
| Gate 2 | Canonical pages ship | SEO indexing |
| Gate 3 | Checkout live | taking real money |
| Gate 4 | Results dashboard live | showing real results |
| Gate 5 | Marketing scale | paid / affiliate scale |
| Gate 0A | Supplement inventory order | committing MOQ spend. **Restated 2026-07-09 (canonical: `01_strategy/CONTEXT.md`):** a capped-downside **spend authorisation**, NOT a demand threshold. All must hold: (1) stock private-label formulation only, already stability-tested — no bespoke V7.2, no tooling; (2) total first-run exposure capped at the phased ~£5,950; (3) MOQ small enough a total write-off is survivable; (4) clean 4-active spec held (Zinc, D3, Methyl-B12, KSM-66 — ashwagandha silent). Supplement-waitlist opt-in rate = directional read only, never a threshold. Explicitly a founder bet, not earned demand. (Retired: the old "25+ supplement pre-orders / count by first paid subscription invoice" bar.) |

**Post-launch growth gates (strategic phase gates — `01_strategy/CONTEXT.md`, distinct from the build gates above):**

> **Restated 2026-07-09 (gate ruling, audit 2026-07-05; canonical: `01_strategy/CONTEXT.md` → Gates Reference).** The old supplement-metric numbers (0B = Month 4: 200+ kits / 100+ FM opt-ins / supp MRR > £2k/mo; 0C's kit-sales/CAC/conversion trigger) were one of four conflicting sets and are **retired** — the 2026-05-23 supplements-deferred decision means those metrics do not exist in Phase 0a. The definitions below are now the restated ones. Both remain strategic post-launch gates, distinct from the build gates; neither is a launch blocker.

- **Gate 0B** — **unit-economics gate** authorising paid scale. Read at the Tier-2 week 6–12 decision point (Stage 2 not readable before ~week 8). **Stage 1 (pre-supplement): CPA < kit gross contribution** — £38 (Kit 1) / £53 (Kit 2) / £77 (Kit 3), direct, per the 2026-06-26 LTV:CAC model. **Stage 2 (post-supplement, once attach is observed): CPA < blended LTV** (~£165 for a 6-month subscriber). Soft signals (CTR, quiz-starts, initiate-checkout, email captures) are tie-breakers at low n, not substitutes. → unlocks scaling paid spend beyond the £250–500 Search test.
- **Gate 0C** — **cash gate.** Month 12: cumulative cash position vs the **£30k "Phase 0 self-funded" threshold**. → confirms Phase 0 is self-funded, unlocking CQC-registration prep in earnest. (Unchanged by the restatement.)

_(The earlier "Gate 0A = pre-launch readiness" definition here was a name collision with qa-gates' 0A and is retired — pre-launch readiness is Gates 1–4.)_

---

## Weekly KPI Targets

Review every Monday. File in `weekly-reviews/` as `REPORT_KPI_[WeekOf-YYYY-MM-DD].md`.

| Metric | Target | Alert threshold | Action if alert |
| --- | --- | --- | --- |
| Kit sales / week | 15–25 | < 5 for 2 weeks | Audit acquisition channels |
| Blended paid CAC | ≤ £50 | > £55 for 2 weeks | Pause paid, rebuild copy |
| Google Search CTR | > 5% | < 2% | Rewrite title tags and headlines |
| Supplement conversion | ≥ 15% of kit buyers | < 10% after 80 results | Fix result email sequence |
| Affiliate-driven sales | > 30% of total | < 15% | More PT outreach |

---

## How to Work Here

### Running a weekly KPI review

1. Pull data from **GA4** (traffic, CTR — **Plausible is NOT wired**), Stripe (kit sales, subscription MRR, CAC), Supabase (result counts, supplement conversion rate).
2. Compare each metric against the targets table above. Flag any that hit the alert threshold.
3. For each alert: note the action, owner, and target resolution date.
4. Save the report as `REPORT_KPI_[WeekOf-YYYY-MM-DD].md` in `weekly-reviews/`.
5. Update the financial model at `../01_strategy/financial-model/financial_model.html` if revenue or cost figures have changed. Version the file header — do not create a new file.

### Completing a gate review

1. Gate definitions + checklist items live in `implementation-checklists/qa-gates.md` (Gates 1–5 + 0A). Live pass/fail state is in `STATE.md` + ClickUp, not that file's frozen checkboxes.
2. Only mark an item complete (in ClickUp) when the condition is verifiably met — not when it is in progress.
3. Go-live requires **Gates 1–4** (LP, canonical, checkout, results dashboard); **Gate 5** gates paid/affiliate scale; **Gate 0A** gates the supplement MOQ order.
4. Log blockers in ClickUp against the gate's task, not in a separate markdown doc.

### Adding a new checklist item

1. Add it to the relevant gate checklist in `checklists/`.
2. If the item has a compliance or legal dependency, mark it `[COMPLIANCE BLOCK]` and route to `03_compliance` before marking clear.
3. Do not create standalone issue docs — keep blockers in the gate checklist where they belong.

### Raising a launch blocker

1. Add it to the relevant gate checklist with a `[BLOCKER]` tag.
2. Identify the owner and the workspace that resolves it (see root `CLAUDE.md` routing table).
3. Track resolution in the same checklist entry. Do not create separate tracking files.

---

## Pre-Launch QA Checklist

Run before Gate 0A clears. Every item must pass.

### Payments and commerce

- [ ] Stripe test mode purchases complete end-to-end (one-off kit + supplement subscription)
- [ ] Stripe webhooks verified — no failed deliveries in Stripe dashboard
- [ ] Subscription pause feature confirmed live in account portal before seq-05 activates
- [ ] `LAUNCHDAY10` Stripe coupon created and tested
- [ ] `SUBSCRIBER10` Stripe coupon created (for seq-04 Email 5, Day 75 retest)
- [ ] One Stripe Coupon object per onboarded PT partner created in Stripe

### Results pipeline

- [ ] Vitall webhook → QStash → results processor tested end-to-end with a real sample
- [ ] Supabase region confirmed as Ireland (EU) — not default US region
- [ ] Supabase DPA signed before first live result is stored
- [ ] All result branches tested in dashboard (low T incl. the three sub-bands, borderline T, low Vit D/B12, elevated CRP, normal) — note Magnesium is no longer a marker (removed from the Daily Stack, V7.2)
- [ ] hs-CRP > 10 mg/L branch shows GP referral — no supplement CTA
- [ ] Low Ferritin < 30 µg/L branch shows GP referral — no supplement CTA
- [ ] Low T (T < 12) shows **GP referral** + the consent-gated nurture opt-in, with **no** kit/supplement upsell — NOT the founding-member list (taken down 2026-06-04; low-T routing per `04_products/CONTEXT.md`)

### Email and CRM

- [ ] Customer.io account set up and domain verified
- [ ] All sequences built and tested in Customer.io staging
- [ ] All Liquid variable branches tested — no blank fields on any conditional
- [ ] Suppression lists set before activating any campaign
- [ ] Goals set on each campaign to stop sequences on conversion

### Analytics and tracking

- [ ] **GA4** live (`G-D5M4J5M3F6`) — server-side Measurement Protocol mirror + consent-gated client `gtag` (Consent Mode v2); `purchase`/`email_signup` events firing (see `09_website-app/STATE.md`)
- [ ] Cookie-consent banner live with a genuine reject path (Accept/Reject equal weight per ICO)
- [ ] Sentry error monitoring active and receiving events from production
- [ ] Authenticated app routes (`/results-dashboard`, `/account`, …) excluded from any session-recording tool at the project level, not just suppressed in code
- [ ] ⚠️ _Stale-stack check:_ Plausible, Meta Pixel, and Microsoft Clarity are named in older plans but are **not currently wired** (stack is GA4 + Sentry, zero ad pixels per GTM v4). Only gate what's actually in the build; don't add pixels unless a decision reintroduces them.

### Compliance and legal

- [ ] Privacy policy live at `/privacy/`
- [ ] Terms live at `/terms/`
- [ ] No banned language on any live page ("diagnose," "treat," "cure," TRT available)
- [ ] Supplement pages use EFSA-approved claims only
- [ ] No ashwagandha mentions anywhere on the site
- [ ] Results copy uses "Your results indicate..." — not "You have..." — on all result pages
- [ ] Kit 1 copy scoped to testosterone only — does not claim to explain general fatigue

### Infrastructure

- [ ] Coolify deployment pipeline tested: push to GitHub → container rebuild → live
- [ ] Cloudflare DNS and proxy configured
- [ ] SSL certificate active on production domain
- [ ] Error pages (404, 500) returning correct status codes

---

## Special Cases

**Gate 0A — no partial launch:** Every checklist item must be cleared. There is no tiered or soft launch. If a compliance item is blocked, the gate does not clear.

**seq-01 Email 4 — launch day broadcast:** Manual send to `waitlist_signed_up` segment on launch day. Not a sequence delay. Keith sends this manually. `LAUNCHDAY10` Stripe coupon must exist in advance. Add to launch day run-of-show.

**seq-03b Part B — low-T education nurture:** Consent-gated (CA-014 consent UI + CA-015 copy); the Customer.io campaign stays DRAFT until a human go/no-go — activation is never automatic. The former "Email 7 — monthly founding member update" was retired with the 2026-06-04 low-T routing change; there is no monthly FM broadcast to schedule.

**seq-04 Email 5 — Day 75 retest prompt:** Requires `SUBSCRIBER10` Stripe coupon (10% off, valid 14 days) created before the email activates. Block this in the Gate 0A checklist — do not activate the sequence without the coupon in place.

**seq-05 Email 3 — subscription pause option:** References Stripe subscription pause. Confirm this feature is live in the account portal (`/subscriptions/`) before activating the churn prevention sequence. Include in Gate 0A checklist.

**Financial model:** Always update `../01_strategy/financial-model/financial_model.html` in place — do not create a new file. Update the version header with the date of each edit.

---

## Platform Notes

- Output here is operational: concise, status-aware, easy to act on, suitable for a 15-minute execution review.
- File naming: `REPORT_KPI_[WeekOf-YYYY-MM-DD].md` for weekly reviews. Gate checklists named by gate (`gate-0a-checklist.md`).
- This workspace does not own: strategy (→ `/01_strategy`), compliance approval as primary task (→ `/03_compliance`), product threshold logic (→ `/04_products`), or app architecture (→ `/09_website-app`).
