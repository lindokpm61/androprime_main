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

The core journeys are mapped in `flows/` (read the one relevant to your task):

- `flows/flow-1-first-time-access.md` — checkout → account creation → magic-link → first dashboard session (every customer).
- `flows/flow-2-returning-customer.md` — returning-customer passwordless (magic-link) re-auth.
- `flows/flow-3-kit-activation.md` — kit received → QR → in-app activation. **Engagement/onboarding only — NOT a technical requirement for the lab pipeline** (Vitall matches sample→order internally; results still deliver if the customer never activates).
- `flows/flow-4-results-to-action.md` — results arrive (Vitall webhook) → dashboard → next action. **Routing authority is `../04_products/CONTEXT.md`, not this doc** (flow-4's Part C/D routing was reconciled 2026-07-02; read its banner).
- `day-15-45-retention-experience-2026-05-08.md` — the Day 15–45 churn window, the single highest-leverage Phase-0 retention lever.

## Key durable rules (live in the flow files; summarised here)

- **Auth is passwordless magic-link** (single-use, ~24h, no password) — the journey-wide spine for Flows 1–2. Implementation detail in `../09_website-app/CONTEXT.md` (Integration Access → Auth).
- **Kit activation is engagement-only** — never gate results or the lab pipeline on it (Flow 3).
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
