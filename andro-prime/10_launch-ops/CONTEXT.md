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

Three gates control progression from build to live to scaled:

| Gate | Name | Condition | Blocks |
| --- | --- | --- | --- |
| Gate 0A | Pre-launch readiness | All checklist items cleared | Public go-live |
| Gate 0B | Post-launch validation | KPIs above alert threshold for 4 weeks | Scaling spend / PT outreach |
| Gate 0C | Scale trigger | Kit sales ≥ 20/week, CAC ≤ £50, supplement conversion ≥ 15% | CQC registration decision |

Gate criteria and trigger thresholds are defined in root `CLAUDE.md`. The checklists in `checklists/` are the working docs — update them as items clear.

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

1. Pull data from Plausible (traffic, CTR), Stripe (kit sales, subscription MRR, CAC), Supabase (result counts, supplement conversion rate).
2. Compare each metric against the targets table above. Flag any that hit the alert threshold.
3. For each alert: note the action, owner, and target resolution date.
4. Save the report as `REPORT_KPI_[WeekOf-YYYY-MM-DD].md` in `weekly-reviews/`.
5. Update the financial model at `../01_strategy/financial-model/financial_model.html` if revenue or cost figures have changed. Version the file header — do not create a new file.

### Completing a gate review

1. Open the relevant checklist in `checklists/`.
2. Work through each item. Only mark complete when the condition is verifiably met — not when it is in progress.
3. For Gate 0A: every item must be cleared before go-live. No partial launch.
4. Log blockers and their resolutions in the checklist file, not in a separate doc.
5. When a gate clears, record the date and reviewer in the checklist header.

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
- [ ] Supabase region confirmed as EU (Frankfurt) — not default US region
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

**seq-03b Email 7 — monthly founding member update:** Human-in-the-loop send. Keith writes the CQC progress section each month before the broadcast goes out. Cannot be fully automated. Add to monthly ops calendar.

**seq-04 Email 5 — Day 75 retest prompt:** Requires `SUBSCRIBER10` Stripe coupon (10% off, valid 14 days) created before the email activates. Block this in the Gate 0A checklist — do not activate the sequence without the coupon in place.

**seq-05 Email 3 — subscription pause option:** References Stripe subscription pause. Confirm this feature is live in the account portal (`/subscriptions/`) before activating the churn prevention sequence. Include in Gate 0A checklist.

**Financial model:** Always update `../01_strategy/financial-model/financial_model.html` in place — do not create a new file. Update the version header with the date of each edit.

---

## Platform Notes

- Output here is operational: concise, status-aware, easy to act on, suitable for a 15-minute execution review.
- File naming: `REPORT_KPI_[WeekOf-YYYY-MM-DD].md` for weekly reviews. Gate checklists named by gate (`gate-0a-checklist.md`).
- This workspace does not own: strategy (→ `/01_strategy`), compliance approval as primary task (→ `/03_compliance`), product threshold logic (→ `/04_products`), or app architecture (→ `/09_website-app`).
