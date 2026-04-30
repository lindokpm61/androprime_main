# Attio CRM — PT/Influencer/Gym pipeline config spec

*v1 · April 2026 · matches v2.2 hybrid affiliate model*

This document is a setup spec for Andro Prime's Attio workspace, designed around the Phase 0 affiliate-first GTM. Build it yourself in 90 minutes following the steps below, or hand the spec to an Attio freelancer (~£200, 2 hours).

It covers three pipelines that share infrastructure but report separately:
1. **PT outreach** — the hero channel. 1,500 cold DMs over Weeks -8 to 0, sustained 200/wk through M1–M2.
2. **Influencer outreach** — secondary channel. 100–120 cold DMs pre-launch.
3. **Gym partnerships** — tertiary, but high leverage when it lands. 30 gyms approached pre-launch.

---

## 1. Why Attio (not HubSpot, not Pipedrive)

Three reasons this fits Andro Prime's actual workflow:

- **People-centric data model.** Every PT/influencer/gym contact is a person first; their company (gym) and their "deal" (affiliate journey) link off them. Attio's flexible "person → company → deal" graph maps better to outreach than HubSpot's contact-vs-account split.
- **Native enrichment.** Attio auto-enriches LinkedIn profiles when you paste a URL — saves the manual scrape on every PT.
- **Lightweight workflow primitives.** Status changes can trigger Zapier or Make webhooks without paying for HubSpot Marketing Pro tier.

Cost: £29/seat/month on the Plus plan (sufficient for Keith + 1 VA).

---

## 2. Object model

| Object | Built-in or custom | Why |
|---|---|---|
| **People** | Built-in | Every PT, influencer, and gym-owner contact. One-to-one. |
| **Companies** | Built-in | Gyms only. Influencer talent agencies if relevant. |
| **Deals** | Built-in (renamed) | One Deal = one affiliate journey from "identified" to "active code-bearing affiliate" or "rejected." |

**Don't** create a custom "Affiliate" object. Deals work better because they have built-in pipeline stages and are reportable out of the box.

**Rename Deals** in workspace settings to "Affiliate Applications" (or just "Applications") for clarity.

---

## 3. Custom attributes on People

Add these via Settings → Objects → People → Attributes. Order matters for sidebar UX — list them top-to-bottom in the order below.

| Attribute name | Type | Options / format |
|---|---|---|
| Affiliate type | Single-select | PT, Influencer, Gym owner, Other |
| Cohort tag | Single-select | Flagship, First-wave, Standard, Gym-affiliated, TBD |
| Primary platform | Multi-select | Instagram, LinkedIn, YouTube, TikTok, Twitter/X, Other |
| Handle | Text | e.g. `@strengthcoach.uk` (paste platform-prefix-free) |
| Audience size | Number | Followers count at last review |
| Engagement rate (%) | Number | At last review |
| Specialty | Multi-select | 35+ men, Body recomp, Performance, Recovery, Rehab, Biohacking, Longevity, General fitness |
| UK-based | Checkbox | Hard-fail filter for outreach |
| Compliance flag | Single-select | Cleared, Watch, Auto-reject (with reason in notes) |
| Auto-reject reason | Multi-select | Discount-led, Pseudo-clinical claims, Audience under-35, Female-skewed audience, Competitor sponsored, ASA history, Audience too small, Audience too large |
| Code | Text | Issued code, e.g. `PTMARK15`. Empty until issuance. |
| Code issuance date | Date | |
| Free kit recipient | Checkbox | |
| Free kit type | Single-select | Kit 2 (£63), Kit 3 (£98), None |
| Free kit dispatch date | Date | |
| Brief sent date | Date | |
| Attestation signed date | Date | Empty until DocuSign returns. |
| First sale date | Date | Auto-populated from FirstPromoter via Zap. |
| Last sale date | Date | Auto-populated from FirstPromoter via Zap. |
| 30-day kit count | Number (computed) | Updated daily via Zap. |
| Lifetime kit count | Number (computed) | Updated daily via Zap. |
| Tier | Single-select | Bronze, Silver, Gold, Flagship, Inactive |
| Strike count | Number | 0–3. |
| Last strike date | Date | |
| Notes | Long text | Free-form. |

**Why we don't track every individual sale on the person record:** the data lives in FirstPromoter (Stripe-native). Attio mirrors only the rolled-up counts and the tier, which is what the operator looks at. Detail goes to FirstPromoter.

---

## 4. Custom attributes on Companies (gyms)

Add via Settings → Objects → Companies → Attributes.

| Attribute name | Type | Options |
|---|---|---|
| Partnership type | Single-select | Gym partner, Talent agency, Lab partner, Supplier, Other |
| Gym tier | Single-select | First-wave (free kits to PTs), Standard, Pending |
| Number of in-house PTs | Number | |
| Free kits committed | Number | Up to 8 per first-wave gym. |
| Free kits dispatched | Number | |
| QR code generated | Checkbox | |
| Reception placement confirmed | Date | |
| Member newsletter sent | Date | First mention. |
| Co-branded LinkedIn post date | Date | |
| Compliance attestation signed (gym-side) | Date | |

Link gym Companies to their PTs via the standard People → Companies relationship.

---

## 5. Custom attributes on Deals (= Affiliate Applications)

| Attribute name | Type | Options |
|---|---|---|
| Application stage | Status (pipeline) | See §6 below — full stage list |
| Outreach channel | Single-select | Cold DM (IG), Cold DM (LinkedIn), Cold email, Warm intro, Gym-introduced, PT-referred, Inbound |
| First contact date | Date | When first DM/email was sent. |
| First reply date | Date | |
| Reply sentiment | Single-select | Positive, Neutral, Negative, No reply |
| Reason rejected/lost | Single-select | Auto-reject criteria, Non-response, Already sponsored, Outside ICP, Other |
| Onboarding call date | Date | |
| Onboarding call attended | Checkbox | |
| Compliance attestation pending | Checkbox | True between DocuSign send and signed-back. |
| Days since first contact | Number (computed) | |

The Deal is the "journey" record. Every person being recruited gets exactly one Deal; if they cycle back later (e.g. rejected at one tier and re-approached at another), open a second Deal.

---

## 6. Pipeline stages (Application stage)

Use one shared 11-stage pipeline across PT and Influencer applications. Filter views split them later.

| # | Stage | When it changes | Who moves it |
|---|---|---|---|
| 1 | **Identified** | Person sourced from hashtag/registry/reference. No outreach yet. | Auto on creation. |
| 2 | **Vetted — pass** | Manual review confirms ICP fit. Auto-reject criteria checked. | Keith / VA. |
| 3 | **Cold outreach sent** | First DM/email sent. | Manually moved when DM is sent — `First contact date` auto-fills. |
| 4 | **Replied** | They replied. Sentiment recorded. | Manual. |
| 5 | **Qualifying** | Second message sent (qualifying questions). | Manual. |
| 6 | **Onboarding call booked** | Calendly hold confirmed. | Manual or Calendly Zap. |
| 7 | **Brief sent** | PT/Influencer Brief PDF emailed. | Manual. |
| 8 | **Attestation pending** | DocuSign envelope sent. | Manual or DocuSign Zap. |
| 9 | **Code live — onboarded** | Attestation signed; FirstPromoter code created. | DocuSign-signed Zap or manual. |
| 10 | **Active** | First sale recorded in FirstPromoter. | FirstPromoter Zap on first commission event. |
| 11 | **Dormant / Lost** | 60 days without a sale OR rejected at any stage. | Manual or rule-based Zap. |

**Severity / strikes** are NOT stages — they're attributes on the Person record. A code-revoked PT becomes a Dormant Deal; the Person's `Strike count` records why.

---

## 7. Saved views (Lists)

Create these via Lists → New List, with the filter shown.

| List name | Object | Filter | Purpose |
|---|---|---|---|
| **PT — Outreach today** | Deal | `Affiliate type = PT` AND `Stage in {Vetted-pass, Replied, Qualifying}` AND `Days since first contact < 14` | Daily worklist. Where to spend the morning. |
| **PT — Stalled** | Deal | `Affiliate type = PT` AND `Stage in {Cold outreach sent, Replied}` AND `Days since first contact > 14` | Re-engage or close. |
| **PT — Onboarded but inactive** | Person | `Affiliate type = PT` AND `Code issuance date > 30d ago` AND `30-day kit count = 0` | Activation problem. |
| **PT — Top tier** | Person | `Tier in {Silver, Gold, Flagship}` | Special-treatment list. |
| **Influencer — Outreach today** | Deal | `Affiliate type = Influencer` AND `Stage in {Vetted-pass, Replied, Qualifying}` | Daily worklist. |
| **Influencer — Free-kit dispatched, no post yet** | Person | `Free kit dispatch date < today - 14d` AND `Last sale date is empty` | Nudge needed. |
| **Gyms — Active partnerships** | Company | `Partnership type = Gym partner` AND `Compliance attestation signed (gym-side) is not empty` | Live partner list. |
| **All — Compliance flagged** | Person | `Strike count >= 1` | Weekly review. |

Pin the top 4 in the sidebar; rest as folder.

---

## 8. Workflows (Zapier or Make)

Attio's native automations are limited; use Zapier/Make for these. Each is a 10-minute Zap.

### Zap 1 — DM-sent reminder
- **Trigger:** Attio — Deal stage changes to "Cold outreach sent."
- **Wait:** 7 days.
- **Filter:** Deal stage is still "Cold outreach sent" (no reply).
- **Action:** Create Attio task "Re-DM or close — [Person name]" assigned to Keith.

### Zap 2 — Onboarding sequence on attestation signed
- **Trigger:** DocuSign envelope completed (matched by template ID).
- **Action 1:** Update Attio Person — set `Attestation signed date` = today.
- **Action 2:** Update Attio Deal stage → "Code live — onboarded."
- **Action 3:** Create FirstPromoter affiliate (via FirstPromoter API or manual Slack alert if no API on current plan).
- **Action 4:** Send templated welcome email via Customer.io or Gmail.

### Zap 3 — First-sale activation
- **Trigger:** FirstPromoter — first commission record for an affiliate.
- **Action 1:** Update Attio Person — set `First sale date` = today.
- **Action 2:** Update Attio Deal stage → "Active."
- **Action 3:** Send Keith a Slack DM "[Name] just made their first sale 🎉."
- **Action 4:** Trigger Customer.io "first-month activation bonus" email to the PT.

### Zap 4 — Daily kit-count refresh
- **Trigger:** Daily at 04:00.
- **Action:** For each Attio Person with non-empty Code, query FirstPromoter for `30d kits` and `lifetime kits`; update.

### Zap 5 — Dormant-flag rollup
- **Trigger:** Daily at 04:30.
- **Filter:** People where `Last sale date < today - 60d` AND `Tier ≠ Inactive`.
- **Action:** Update Person `Tier` to "Inactive" and Deal stage to "Dormant / Lost."

### Zap 6 — Compliance audit input
- **Trigger:** Weekly (Monday 09:00).
- **Action:** Pull all active Person records with their Code, push to a Google Sheet that the audit script reads. (Audit script then runs separately and writes flagged content back to a "Compliance violations" Sheet.)

---

## 9. Reports / dashboards

In Attio's Reports tab (or a separate Looker Studio if more depth needed):

| Report | Metric | Cadence |
|---|---|---|
| Pipeline velocity — PT | Avg days from "Cold outreach sent" to "Code live" | Weekly |
| Reply rate — PT | % of "Cold outreach sent" that reach "Replied" within 14 days | Weekly |
| Activation rate — PT | % of "Code live" that reach "Active" within 45 days | Monthly |
| Reply rate — Influencer | Same as PT | Weekly |
| Free-kit ROI | Compare 30-day kit counts: free-kit cohort vs standard cohort | Monthly from M2 |
| Dormancy rate | % of code-bearing PTs with 0 sales in last 60 days | Monthly |
| Strike incidence | Count of strikes added in week | Weekly |

---

## 10. Naming conventions

- **Person name:** their full real name when known, otherwise their primary handle (e.g. `@strengthcoach.uk`).
- **Person handles:** never include the @ in the `Handle` field — Attio renders the platform icon separately.
- **Deal name:** auto-format as `[Affiliate type] — [Person name] — [Cold outreach date]`. Example: `PT — Mark Stevens — 2026-04-15`.
- **Code field:** uppercase, no spaces (e.g. `PTMARK15`). FirstPromoter is case-sensitive on some plans.

---

## 11. Setup checklist (90 minutes, in order)

- [ ] Create the Attio workspace, invite Keith + VA seat.
- [ ] Settings → Objects → People → add the 23 attributes from §3.
- [ ] Settings → Objects → Companies → add the 9 attributes from §4.
- [ ] Settings → Objects → Deals → rename to "Applications," add the 9 attributes from §5.
- [ ] Settings → Pipelines → Applications → configure the 11 stages from §6.
- [ ] Build the 8 Lists from §7. Pin the top 4 in sidebar.
- [ ] Connect the LinkedIn integration (Settings → Connections → LinkedIn).
- [ ] Connect Gmail (Settings → Connections → Gmail) for thread auto-logging.
- [ ] Set up Zaps 1–6 from §8 — each is a separate Zap, do them one at a time and test.
- [ ] Set up Reports from §9.
- [ ] Import the existing PT/influencer leads from `06_marketing/affiliates/pt-network/test-data/test-people-import.csv` to seed the workspace and verify field mapping.
- [ ] Run a dummy onboarding journey end-to-end: identify a person → vet → DM-sent → reply → brief → attestation → code → first sale. Verify each Zap fires.
- [ ] Document the workspace URL and admin handover in `06_marketing/affiliates/codes-and-tracking/`.

---

## 12. What's deferred to a v2 of this spec

These are real and worth doing eventually, but not blocking Week-8 outreach:

- **AI enrichment.** Attio has GPT-powered "research" actions that can auto-fill audience size, engagement rate, content category. Worth adding once you've manually populated 50+ records and know which fields you actually use.
- **Attio's native email-send flow.** Saves jumping to Gmail. Defer until inbox warmup is established (Week -2+).
- **Custom Deal scoring model.** "PT readiness score" 0–10 based on attribute completeness + recent posting + audience match. Useful at >100 active records, premature now.
- **Dual-pipeline split.** If PT and Influencer pipelines diverge meaningfully (different stage counts, different SLAs), split them into separate pipelines. Right now the shared 11-stage pipeline is sufficient.

---

## 13. The actual point of this spec

A CRM that captures who you DM'd, when, what they replied, what stage they're at, what's blocking them, and what they've sold — accessible from one search box, not three Google Sheets and a Notion page.

The reason this matters at Andro Prime specifically: at 1,500 cold DMs over 8 weeks, your bottleneck stops being "who do I DM next" and becomes "who already replied that I haven't followed up on." The Lists in §7 are designed to surface that question every morning in 30 seconds.

If you find after 4 weeks that you're not actually using one of the views, delete it. Less is more in a CRM. The worst Attio workspaces are the ones where every new idea got a new field.

---

*Drafted by Claude · April 2026 · v1*
*Cross-references: pt-programme.md §3.1, influencer-programme.md §3, master plan §6.1, FirstPromoter setup in `affiliates/codes-and-tracking/`*
*Review: after first 50 cold DMs sent through the system. Adjust attributes/views based on what was actually used.*
