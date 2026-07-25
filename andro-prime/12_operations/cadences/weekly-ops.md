# Weekly Ops Cadence

The once-a-week rhythm: read the trend, confirm the machine shipped what it promised, and clear the partner queue. Deeper and slower than the daily pass. Each check names its SOP and the workspace that owns any issue. Run status and findings go to **ClickUp** (`workspace_id: "90121729875"`), not this file.

Anchor it to a fixed day. The `10_launch-ops` KPI review runs Mondays; running this cadence the same day keeps the operational and KPI reads together.

---

## The weekly checks

| Check | SOP | Owner workspace | Why |
| --- | --- | --- | --- |
| Search Console review | `sops/search-console-monitoring.md` | `06_marketing/seo-ai-search` | New blog articles must index and the SEO trend (impressions/clicks/CTR/position) must hold; manual actions or a drop need catching early. |
| GA4 analytics review | `sops/analytics-review.md` | `06_marketing` + `10_launch-ops` | GA4 (`G-D5M4J5M3F6`) is the live traffic + conversion read: are `purchase` / `email_signup` events firing and are the funnel numbers moving the right way. |
| Content-machine output vs calendar | `sops/content-machine-verification.md` | `06_marketing/content-machine` | Confirm the content machine actually produced and shipped what its calendar promised, and that Ewa sign-off gates were respected before anything went live. |
| Affiliate / partner replies | (routes; no dedicated SOP) | `05_partners` (labs/manufacturers) + `06_marketing/affiliates` (PT/affiliate) | Partner round-trips cost a week each; a reply sat on for a week doubles that. Keep the negotiation and affiliate queues moving. |
| KPI glance vs weekly targets | (reference `10_launch-ops`) | `10_launch-ops` | The weekly KPI targets and their alert thresholds live in `10_launch-ops`; this is an operational glance that flags anything at its alert threshold, not a second source of the numbers. |

---

## How to run each

### 1. Search Console review

Run `sops/search-console-monitoring.md`. Check coverage/indexing (did this week's new articles get indexed), the performance trend, manual actions / security issues, and sitemap status. GSC is accessed in its own console, not an MCP. SEO owner is `06_marketing/seo-ai-search`; a confirmed drop escalates to a deeper **dataforseo** diagnostic per the SOP.

### 2. GA4 analytics review

Run `sops/analytics-review.md`. GA4 method sits behind the `analytics-tracking` skill; the review is co-owned by `06_marketing` (traffic/CTR/content) and `10_launch-ops` (conversion KPIs). Confirm events are still firing (a silent tracking break reads as a traffic cliff) before trusting any drop.

### 3. Content-machine output vs calendar

Run `sops/content-machine-verification.md`. Run `/content-status`, cross-check against the content-machine calendar and SOPs in `06_marketing/content-machine`, verify drafts moved to published where due, and confirm the Ewa sign-off gate held. Route any gap to `06_marketing`; the content machine is the source of truth for what was due.

### 4. Affiliate / partner replies

- **Labs / manufacturers** (`05_partners`): check for replies from Vitall (Ben Starling) and the manufacturer outreach queue. Update the relevant negotiation log or `manufacturers/outreach-tracker.md` (those living docs are the partner source of truth), and open/close ClickUp tasks. Apply the middleman-correspondence discipline in `05_partners/CONTEXT.md` on any reply to Vitall.
- **PT / affiliate** (`06_marketing/affiliates`): the PT/affiliate programme is FROZEN (2026-06-07); keep this to logging inbound interest until an unfreeze decision. Do not restart outreach here.
- Inbound partner email is first caught in the daily triage (`sops/email-triage.md`); this weekly pass is the follow-up-and-clear step.

### 5. KPI glance vs weekly targets

- The canonical targets, alert thresholds, and actions are the Weekly KPI Targets table in `10_launch-ops/CONTEXT.md` (kit sales/week, blended paid CAC, Google Search CTR, supplement conversion, affiliate-driven sales). **Do not restate the numbers here as canonical; read them there.**
- Pull the data per that workspace's method (GA4 for traffic/CTR, Stripe for sales/MRR/CAC, Supabase for result counts / supplement conversion).
- Flag anything at or past its alert threshold and open a ClickUp task against the owner named in the `10_launch-ops` action column. The full weekly KPI review itself belongs to `10_launch-ops`; this is the operational hand-off, not a duplicate of it.

---

## Escalation

An SEO drop, a broken tracking event, a missed publish gate, or a KPI past its alert threshold each opens a ClickUp task against the owning workspace with the SOP's recommended action. Anything that is actually broken in production still goes to `sops/incident-runbook.md`.
