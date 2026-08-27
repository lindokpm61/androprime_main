# Customer Journey Workspace Context

## Purpose
This workspace maps the customer experience across onboarding, support, retention, and transitions between stages.

Use it for:
- pre-CQC customer flow
- post-CQC customer flow
- onboarding design
- support flow
- retention logic
- customer experience mapping

## Flows & source of truth

**Start at `journey-spine.md`.** It is the ordered list of every stage from the search that finds us to the retest twelve months later, naming the doc that owns each stage and marking what is built. The flows below are the detail; the spine is how they join, and it is the only file that covers the **second funnel** (the membership, sold by the app in a 30-day window after a result lands). Created 2026-08-27 because the journey was described by five docs written at different times against different theses, with nothing above them.

The core journeys are mapped in `flows/` (read the one relevant to your task):

- `flows/flow-1-first-time-access.md`: checkout → account creation → magic-link → first dashboard session (every customer).
- `flows/flow-2-returning-customer.md`: returning-customer passwordless (magic-link) re-auth.
- `flows/flow-3-kit-activation.md`: kit received → QR → in-app activation. **Engagement/onboarding only, NOT a technical requirement for the lab pipeline** (Vitall matches sample→order internally; results still deliver if the customer never activates).
- `flows/flow-4-results-to-action.md`: results arrive (Vitall webhook) → dashboard → next action. **Routing authority is `../04_products/CONTEXT.md`, not this doc** (flow-4's Part C/D routing was reconciled 2026-07-02; read its banner).
- `day-15-45-retention-experience-2026-05-08.md`: the Day 15–45 churn window, the single highest-leverage Phase-0 retention lever.

Topic subdirs `onboarding/`, `pre-cqc/`, `post-cqc/`, `retention/`, `support/` are scaffolded but not yet populated; file onboarding, support, and retention docs into the matching subdir as they are written (the Day 15–45 doc currently sits at root and belongs in `retention/`).

## Key durable rules (live in the flow files; summarised here)

- **Auth is passwordless magic-link** (single-use, ~24h, no password): the journey-wide spine for Flows 1–2. Implementation detail in `../09_website-app/CONTEXT.md` (Integration Access → Auth).
- **Kit activation is engagement-only**: never gate results or the lab pipeline on it (Flow 3).
- **Results routing defers to 04.** Low T (<12) → GP referral, no upsell; hs-CRP >10 and Ferritin <30 → GP referral, no cross-sell; the hs-CRP joint-symptoms qualifier must fire before any Collagen CTA; supplements route to the waitlist in Phase 0a. The founding-member list is decommissioned. Full rules: `../04_products/CONTEXT.md`.
- **Retest framing** (Flow 4 / seq-04): "find out how your levels have changed", never "did the supplement fix you".

## What belongs here
- journey maps
- onboarding docs
- support process notes
- retention plans
- service handoff notes
- experience design docs that are not purely UI

## Good output looks like
- step-by-step
- customer-centered
- operationally realistic
- aligned to the current mode of the business
- clear about what happens before, during, and after each stage

## Do not use this workspace for
- product threshold logic
- campaign ideation
- low-level technical implementation
- regulated clinical process design that belongs post-CQC

## Skills, tools & MCPs

MCP servers and tools most relevant when working in this workspace. Repo-wired servers are in the root `.mcp.json` (graphify, context7, dataforseo, supabase, clickup); the rest are claude.ai account connectors, some of which need authorising in an interactive session before use.

**Skills** (ship with plugins):

- `onboarding-cro`: activation, first-run experience, time-to-value.
- `churn-prevention`: cancellation/save flows, dunning, win-back.
- `email-sequence`: lifecycle and journey email design (copy is built in `07_sales`).
- `signup-flow-cro`, `form-cro`, `page-cro`, `paywall-upgrade-cro`: signup, form, page, and upgrade-moment conversion across the journey.

**MCPs & tools:**

- **Customer.io** (MCP, connector): lifecycle and journey messaging (sequence copy and campaigns are owned by `07_sales`).
- **supabase** (MCP, wired, read-only): user/order state that journeys branch on.
