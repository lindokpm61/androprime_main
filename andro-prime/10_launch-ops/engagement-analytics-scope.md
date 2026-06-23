---
ticket: engagement-analytics-scope
clickup: 869d99m89
status: scope COMPLETE 2026-06-22 — build deferred to M1–M3 post-launch
owner: Keith + Dev
workstream: Engineering
source: V7 multi-vertical repositioning (patient-owned data)
last_updated: 2026-06-22
---

# Engagement & login analytics — scope

> **What this is (and is NOT).** This is the internal/ops instrumentation that measures whether logged-in customers come back, look at their data, and retest over time. It is the deliverable for ClickUp `869d99m89` ("Tracker analytics infrastructure (log-in tracking) scoped"). It is **not** the customer-facing "Tracker / My Story" page (that is a separate, deferred product surface; only mockups exist — see the tracker-mockups note). Per the ClickUp card, **scoping is in-sprint; the build happens M1–M3 post-launch.**

## 1. Why (the business question this answers)

The V7 repositioning leads on *"your data, your dashboard, yours to keep, tracked over time."* Two things follow:

1. **Is the data-ownership value prop landing?** The honest proof is behavioural: do customers log back in, open their results, and retest? If they buy once and never return, the "tracked over time" promise is aspirational, not real.
2. **Is the pre-qualified clinical pipeline accruing?** Post-CQC, the warm pipeline is men who engage repeatedly with their own data. Engagement depth is the leading indicator of clinical-funnel readiness, ahead of any TRT launch.

So we need a small, privacy-safe set of engagement signals and one **internal dashboard tile** that surfaces them. This is measurement, not a new customer feature.

## 2. Current infrastructure (what we build on — already live)

This is **not** a greenfield build. The plumbing exists:

| Capability | Where | Notes |
| --- | --- | --- |
| First-party event store | Supabase `events` table | Authoritative, vendor-neutral. Cols: `event_name`, `occurred_at`, `anonymous_id`, `email_hash`, `utm_*`, `fpr_tid`, `referrer`, `landing_path`, `value`, `currency`, `kit_id`, `sku`, `props` (jsonb). **No `user_id` column yet** — see §5 decision. |
| Event emitter | `lib/analytics/events.ts` → `trackEvent(name, input)` | Writes the first-party row + mirrors to GA4. Best-effort (swallows failures, never breaks the request). `anonymous_id` is already set to `user.id` when a user is authenticated. |
| GA4 server-side mirror | `lib/analytics/ga4.ts` → `sendGa4Event()` | Measurement Protocol, pseudonymised (clientId = sha256(email) or random), no PII in params, `non_personalized_ads: true`. Phase 2 consent banner + client gtag live (`G-D5M4J5M3F6`). |
| Auth / login | Supabase passwordless OTP; `app/auth/callback/route.ts` (`exchangeCodeForSession`) | Today it only calls `identifyUser()` to Customer.io. **No login event is written to `events`.** This is the natural emit point for `user_logged_in`. |
| Results dashboard (customer) | `app/(app)/results-dashboard/page.tsx` → `getDashboardData(user.id)` | Natural emit point for `dashboard_viewed` / `result_view`. |
| Admin dashboard (ops) | `app/admin/dashboard/page.tsx` | `isAdmin` gated, `force-dynamic`. Renders Stripe cash position + a gate-metrics table. **This is where the engagement tile goes.** |
| Gate metrics pattern to copy | `lib/admin/getGateMetrics.ts` → Supabase view `v_gate_tracker` (`.select().single()`) | The established pattern: a SQL view does the aggregation, a thin server fn reads one row, the page renders it. Engagement tile mirrors this exactly. |

**Events emitted today:** `kit_purchase`, `supplement_subscribe`, `email_signup` (newsletter/waitlist), `quiz_complete`.
**Defined in the `EventName` union but NOT yet emitted:** `kit_activate`, `result_view`, `affiliate_click`, `content_cta_click`. (So `result_view` is already a sanctioned name — wiring it is part of this scope, not a new concept.)

## 3. Event taxonomy to add (the "log-in event tracking definition")

Three new emits, all server-side, all keyed to the logged-in user. Add `user_logged_in` and `dashboard_viewed` to the `EventName` union; `result_view` already exists.

| Event | Emit point | `props` | Purpose |
| --- | --- | --- | --- |
| `user_logged_in` | `app/auth/callback/route.ts`, right after `exchangeCodeForSession` succeeds (next to the existing `identifyUser`) | `{ method: 'otp' \| 'password', is_first_login: bool }` | Return-visit signal; the core of DAU/WAU/MAU and days-since-last-login. |
| `dashboard_viewed` | `app/(app)/results-dashboard/page.tsx` server load | `{ state: 'pre_results' \| 'sample_failed' \| 'ready' }` | Did they actually open the dashboard, not just authenticate? |
| `result_view` | dashboard load when `state = ready` (or on results-section render) | `{ kit_type, order_id, days_since_results_available }` | Did they look at the actual numbers, and how fast after results landed (activation latency)? |

**Identity rule:** for these authenticated events, pass `anonymousId: user.id` (the existing pattern) so they group per person. **Do not put raw email in `props`.** `email_hash` is already derived by `trackEvent`.

**De-dupe / volume note:** `dashboard_viewed` and `result_view` will fire on every page load (Next server component). For engagement we care about *distinct user-days*, not raw hits — the aggregation (§6) dedupes by `date_trunc('day')`. No client throttling needed for v1; revisit if row volume becomes a cost issue.

## 4. Privacy / compliance boundary (non-negotiable)

Login and especially `result_view` / `dashboard_viewed` are **adjacent to special-category health data** (they reveal that a person has a health result). Rules:

- **First-party only for the health-adjacent detail.** The GA4 mirror must carry **no health-implying props** — no `kit_type`, no `state`, no marker data on `result_view` / `dashboard_viewed`. Send only the bare event name + non-identifying engagement metadata to GA4, or keep these two first-party-only. (`trackEvent` already strips PII; this is an explicit instruction to keep the health props out of the GA4 `params`.)
- **No raw email/PII in `events.props`** — hashed identity only.
- **Aggregate, don't expose individuals** in the admin tile (counts, rates, medians — not "user X logged in 9 times").
- **DPIA touch-point:** add a line to the existing DPIA noting engagement events are processed on the lawful basis of legitimate interest (service improvement) on pseudonymised data, retained first-party. Flag for the compliance workstream before the build ships, not before scope sign-off.

## 5. Engagement metrics (definitions)

Computed from `events` + the existing order/result/subscription tables. No new customer feature required.

| Metric | Definition (source) |
| --- | --- |
| Active logged-in users (DAU/WAU/MAU) | distinct `anonymous_id` on `user_logged_in` within 1 / 7 / 30 days |
| Return rate | % of users with a `user_logged_in` after their first-ever login |
| Days since last login (median) | median over users of `now() - max(user_logged_in.occurred_at)` |
| Result-view rate | % of users with a `lab_results` row who have ≥1 `result_view` |
| Activation latency (median) | median `result_view.props.days_since_results_available` |
| Retest rate | % of users with `count(lab_results) > 1` |
| Repeat-purchase rate | % of users with `count(kit_orders WHERE status NOT IN (cancelled,refunded)) > 1` |
| Active subscribers | `count(supplement_subscriptions WHERE status IN (active,trialing))` |
| 4-week login retention | of users whose first login was in week W, % with any login in W+4 (cohort curve) |

Return/retest signals are already derivable today from `kit_orders`, `lab_results`, `supplement_subscriptions` (per `getAccountData.ts` / `getSubscriptions.ts`); the new events add the *login* and *viewed-their-data* layer those tables can't see.

## 6. Dashboard tile spec (the "dashboard tile spec" deliverable)

**Pattern:** mirror `getGateMetrics` exactly — a SQL view does the work, a thin reader returns one row, the admin page renders a section.

- **New Supabase view `v_engagement_metrics`** (single-row, like `v_gate_tracker`) computing the §5 metrics. Build as a plain view first; promote to a materialized view + scheduled refresh only if it gets slow.
- **New reader** `lib/admin/getEngagementMetrics.ts` — `createSupabaseAdminClient().from('v_engagement_metrics').select().single()`, best-effort, returns a typed `EngagementMetrics` object or an error string (same shape as `getGateMetrics`).
- **New section** in `app/admin/dashboard/page.tsx` titled **"Engagement"**, rendered after the gate-metrics table, same async-query + error-string pattern.

Proposed tile rows (v1):

| Row | Field | Suggested target (placeholder — Keith to set) |
| --- | --- | --- |
| Active users (7d) | `wau` | trend up week-on-week |
| Return rate | `return_rate_pct` | ≥ 40% |
| Result-view rate | `result_view_rate_pct` | ≥ 80% |
| Median activation latency | `activation_latency_days` | ≤ 2 days |
| Retest rate | `retest_rate_pct` | ≥ 15% (also a Gate 0B-adjacent signal) |
| Active subscribers | `active_sub_count` | (reuse gate-tracker number) |

Wireframe (text):

```
Engagement                                   [last 7 / 30 days]
────────────────────────────────────────────────────────────
Active users (7d)        128        ▲ vs prior 7d
Return rate              43%        target ≥ 40%   ✅
Result-view rate         71%        target ≥ 80%   ⚠
Activation latency       1.4 days   target ≤ 2d    ✅
Retest rate              9%         target ≥ 15%   ⚠
Active subscribers       30         (gate tracker)
```

## 7. Implementation plan (post-launch, M1–M3)

Sequenced so each step is shippable on its own:

1. **M1 — instrument.** Add `user_logged_in` + `dashboard_viewed` + wire `result_view`; extend the `EventName` union; enforce the GA4 no-health-props rule. (~0.5 day.) Verify rows land in `events` for a real login.
2. **M1/M2 — aggregate.** Create `v_engagement_metrics` view + `getEngagementMetrics.ts`. (~0.5 day.)
3. **M2 — surface.** Add the Engagement section to the admin dashboard. (~0.5 day.)
4. **M2/M3 — cohort view (optional).** 4-week retention curve as a second view + simple table/sparkline once there's ≥4 weeks of login data to plot.
5. **Compliance close-out.** DPIA line added; confirm GA4 payloads carry no health-adjacent props (spot-check the Measurement Protocol debug endpoint).

## 8. Open decisions for Keith (needed before the M1 build, not before scope sign-off)

1. **The one signal that matters most.** Recommended primary KPI: **retest rate** (repeat `lab_results` per user) as the truest proof of the "tracked over time" prop and the clinical-pipeline leading indicator. Confirm, or pick return-rate / result-view-rate instead.
2. **`events.user_id` column.** Add a nullable `user_id uuid` FK to `events` for clean joins, OR keep using `anonymous_id = user.id` and filter on that. Recommend **adding `user_id`** (one small migration) so engagement joins to `kit_orders`/`lab_results` are unambiguous and don't collide with the pre-auth pseudonymous-id semantics. Low effort, do it in M1.
3. **Targets.** The §6 target column is placeholder. Set real thresholds (can default to "trend up, no fixed gate" for v1).
4. **`result_view` health-prop boundary.** Confirm we keep `kit_type`/`state` first-party-only and out of GA4 (recommended).

## 9. Definition of Done (this ticket — scoping)

- [x] Scope doc written (this file)
- [x] Log-in event tracking definition agreed — `user_logged_in`, `dashboard_viewed`, `result_view` defined with emit points + props (§3)
- [x] Dashboard tile spec produced — `v_engagement_metrics` view + `getEngagementMetrics.ts` reader + admin "Engagement" section, with row/target spec and wireframe (§6)
- [ ] Keith signs off §8 open decisions (then the M1–M3 build per §7 can start)

The build itself is **out of scope for this ticket** and tracked for M1–M3 post-launch.
