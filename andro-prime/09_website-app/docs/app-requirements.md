# App Requirements

## Purpose

Define the main product and implementation requirements for the authenticated Andro Prime app before any app code is built.

This document covers:
- the role of each empty app area
- the required user journeys
- the results-dashboard logic that drives the product experience
- the platform, privacy, and compliance constraints the app must follow

## Context

The app is not a generic user portal. It is the authenticated layer of Andro Prime's Phase 0 business model:

- users buy a kit
- users receive results through an Andro Prime branded dashboard
- the app interprets those results in plain English
- the app routes the user to the correct next action
- the app supports the ongoing relationship through subscriptions or founding-member status

The app must stay within the Phase 0 wellness model and must not imply that regulated clinical treatment is already live.

## Core Product Goal

The app must turn biomarker results into the correct next step without:
- breaking compliance
- feeling opportunistic
- sounding clinical or generic
- blurring the line between wellness mode and post-CQC care

In practical terms, the app is a secure results-and-conversion engine supported by account, subscription, and founding-member management.

## App Areas

### `frontend/app/results-dashboard/`

This is the core product surface.

Responsibilities:
- display branded kit results inside the Andro Prime app
- show plain-English interpretation, not a raw lab portal
- apply conditional recommendation logic based on actual result data
- support the 5-part result flow for each marker:
  1. Result
  2. Explain
  3. Educate
  4. Recommend
  5. Convert
- handle qualifier questions where required
- show the correct primary and secondary CTA for each result state
- support retest messaging where appropriate

**Dashboard states (decided 2026-04-24):** The dashboard is a single screen with two states — not two separate screens.

- **Pre-results state:** Shows a status tracker (4 steps: Kit dispatched → Sample received → Analysing → Results ready) with the current step highlighted. Below the tracker: a stack of static educational content cards (what the kit tests, what testosterone does, what happens at the lab, how to read results). This content primes the customer for results and reduces support queries during the wait.
- **Post-results state:** Status tracker is replaced by the results view. Shows a plain-English summary headline for the full panel, followed by per-biomarker cards in the 5-part structure.

The dashboard is the customer's single destination throughout the entire journey. The URL does not change between states.

### `frontend/app/kit-activation/`

A lightweight standalone screen triggered by the QR code printed in the kit insert.

Responsibilities:

- receive the kit code as a URL parameter (pre-filled, not typed by the customer)
- prompt login via magic link if the customer is not already authenticated
- show a single confirm screen once authenticated
- record kit activation against the order in the database
- surface sample collection instructions after confirmation

This screen is an engagement and onboarding step — it is not a technical requirement for the lab pipeline. Vitall matches the sample internally. If a customer never activates, results are still delivered and displayed normally.

This area owns the post-kit experience and is the highest-priority app module.

### `frontend/app/auth/`

Responsibilities:
- login
- magic link request and validation
- secure session handling
- password set (optional, post-login prompt)
- password reset and account recovery
- gate access to private health-result screens

**Authentication model (decided 2026-04-24):** Magic link. Checkout collects email only — no password at purchase. The order confirmation email contains a single-use, time-limited magic link that logs the customer straight into the dashboard. On first dashboard load, a dismissible prompt offers the option to set a password for future logins. Returning customers without a password can request a new magic link from the login screen.

There is no standalone sign-up screen. Account creation only happens via checkout → magic link. `/auth/login` shows login only, with a "Buy a kit" link for unauthenticated visitors who have not purchased.

Required routes:

- `/auth/magic` — validates token, creates session, redirects to dashboard. Shows a spinner while validating; on failure shows an error with a "request a new link" CTA.
- `/auth/login` — email + password for returning customers with a password set, plus "send me a link instead" fallback. Includes "Buy a kit" link for non-customers.
- `/auth/request-link` — single email field, one button. Sends a new magic link.

This area must be treated as access control for special category health data.

### `frontend/app/account/`

Responsibilities:
- profile and account details
- result access history
- order and account state visibility
- support-related account actions
- subscription and founding-member links or summary views

This area is the user's central account hub, not the main conversion surface.

### `frontend/app/subscriptions/`

Responsibilities:
- show active supplement subscriptions
- show billing status and renewal state
- allow cancellation from the account dashboard
- support subscription lifecycle visibility after first payment

This area must align to Stripe billing and Customer.io lifecycle events.

### `frontend/app/founding-member-status/`

Responsibilities:
- show low-testosterone pathway eligibility state
- confirm whether a founding-member deposit has been paid
- show deposit-related status and next steps
- support the waiting-state between deposit payment and future clinical launch

This area must not imply current treatment availability.

## Primary User Journeys

### 1. Kit buyer to dashboard

- user purchases a kit
- user registers or accesses an account
- lab result is received from Thriva
- user logs into the app
- user sees their result in branded Andro Prime language
- user is shown the correct next action based on result logic

### 2. Result to supplement subscription

- user views result
- app explains what the result means
- app presents a data-led supplement recommendation where valid
- user starts a subscription through Stripe
- lifecycle events pass into Customer.io

### 3. Result to founding-member deposit

- user has confirmed testosterone result below threshold
- dashboard explains what this means
- founding-member deposit is shown as the primary CTA
- user pays the refundable deposit via Stripe
- app records founding-member status

### 4. Subscriber retention and retest

- user becomes an active supplement subscriber
- app shows subscription status
- retest prompt appears at the correct time in the lifecycle
- the app supports the loop of initial result -> supplement -> retest -> updated decision

## Results Dashboard Requirements

## Canonical Rule Source

The results-dashboard must follow:
- [04_products/icp-kit-supplement-alignment-april2026.md](D:\Androprime_main\andro-prime\04_products\icp-kit-supplement-alignment-april2026.md)
- [CLAUDE.md](D:\Androprime_main\andro-prime\CLAUDE.md)
- [09_website-app/CONTEXT.md](D:\Androprime_main\andro-prime\09_website-app\CONTEXT.md)

If other notes conflict with the canonical product logic, the product source-of-truth document wins.

## Required 5-Part Structure

Every result section must follow this order:

1. `Result`
   Show the user's number plainly.
2. `Explain`
   Describe what the number means in context.
3. `Educate`
   Add evidence-based, non-sales explanation.
4. `Recommend`
   Present the correct Andro Prime next step.
5. `Convert`
   Offer the action cleanly and honestly.

The app must never lead with a product CTA before explanation.

## Conditional Logic Requirements

The dashboard must support these result states and actions:

| Result state | Required logic |
| --- | --- |
| `T < 12 nmol/L` | Primary CTA is founding-member deposit. Secondary CTA is Daily Stack with "while you wait" framing. |
| `T 12-20 nmol/L` | Primary CTA is Daily Stack. Secondary CTA is Kit 2 only if energy symptoms were previously stated. |
| `T > 20 nmol/L` | Show retest reminder. No supplement-first conversion path. |
| `Low Vitamin D` | Primary CTA is Daily Stack with D3-led copy. Secondary CTA can be Kit 1 if age 40+ or 2+ deficiencies. |
| `Low Magnesium` | Primary CTA is Daily Stack with magnesium-led copy. Secondary CTA can be Kit 1 if age 40+ or 2+ deficiencies. |
| `Elevated hs-CRP` | Must ask joint-symptoms qualifier before recommendation. |
| `hs-CRP > 10 mg/L` | GP referral only. No supplement CTA. |
| `Low Ferritin < 30 ug/L` | GP referral plus dietary guidance. No supplement CTA. |
| `Low B12` | Daily Stack with B12-led copy if marker is confirmed in the product flow. |
| `2+ deficiencies` | Complete Men's Stack becomes primary CTA, with individual products as fallback. |

## Qualifier Logic

The app must support at least one explicit qualifier gate:

- when hs-CRP is elevated, ask:
  `Do you experience joint stiffness or soreness after training?`

Behavior:
- `Yes` -> collagen recommendation path
- `No` -> lifestyle guidance path

This must be presented as a simple UX question, not a clinical assessment flow.

## Cross-Sell Rules

The dashboard must support these cross-sell patterns:

- Kit 1 -> Kit 2 when testosterone is normal and the user previously reported energy symptoms
- Kit 2 -> Kit 1 when there are 2+ deficiencies or a single deficiency and the user is age 40+

The dashboard must not:
- cross-sell Kit 3 as an in-journey upsell from Kit 1 or Kit 2
- trigger founding-member deposit from Kit 2 results alone
- show generic "buy supplements" messaging detached from results

## Copy and Tone Requirements

The app experience must sound:
- plain-English
- direct
- personal
- data-led
- non-corporate

The app must not sound:
- like a lab portal
- like a clinic report
- like a generic wellness app
- like a hard-sell supplement funnel

Dashboard language must follow the brand voice and compliance rules, especially:
- use `Your results indicate...`
- do not use `You have...`
- do not imply diagnosis
- do not imply treatment availability in Phase 0

## Data and State Requirements

The app likely needs to support these entities and state objects:

- user account
- authentication credentials and session
- kit purchase record
- sample registration state
- lab result payload by kit and biomarker
- symptom answers from quiz or checkout
- dashboard recommendation state
- qualifier responses
- subscription state
- founding-member deposit state
- lifecycle event state for CRM/email triggers

## Integration Requirements

The app will need to integrate with:

- `Thriva`
  For dispatch and results webhooks.
- `Stripe`
  For kit purchases, subscriptions, deposit payments, and subscription state.
- `Customer.io`
  For event-driven emails such as `result_received`, `kit_dispatched`, `subscription_started`, and founding-member-related journeys.
- `Supabase`
  As the primary database for account, result, subscription, and recommendation state.
- `Plausible`, `GA4`, and `Meta`
  For analytics and server-side conversion tracking.
- `Sentry`
  For dashboard, webhook, and payment error monitoring.
- `QStash`
  For safe queuing and retry of inbound webhook jobs.

## Privacy and Compliance Requirements

The app must be designed as a health-data product, even in wellness mode.

Non-negotiable constraints:
- biomarker data is special category health data
- Supabase must use EU Frankfurt region
- access to results requires authenticated account access
- `/dashboard/*` must be excluded from session recording tools like Microsoft Clarity
- no diagnosis or treatment claims
- no implication that TRT is currently available
- recommendation logic must stay inside approved product and compliance rules

The app must separate:
- wellness-mode result interpretation
- future post-CQC regulated care workflows

## Analytics and Event Requirements

The app should support or emit these key events:

- `result_received`
- `kit_dispatched`
- `purchase`
- `founding_member_deposit`
- `subscription_started`
- `quiz_complete`
- `waitlist_signup`

At minimum, the app must support the result and subscription events needed to trigger CRM journeys and paid-media attribution.

## Success Criteria

The app is doing its job when:
- users can securely access results in a branded experience
- every result routes to the correct next action
- no invalid CTA is shown for a given result state
- the dashboard feels trustworthy rather than opportunistic
- subscription and founding-member actions are traceable and measurable
- the system respects privacy and compliance constraints by design

## Out of Scope for the First App Definition

These are not first-order app requirements for the current Phase 0 build:

- post-CQC clinical intake workflows
- prescribing workflows
- regulated treatment decisioning
- full clinical monitoring features
- generic community or social features
- broad health-MOT style experiences not backed by the current product catalogue

## Recommended Delivery Priority

1. Auth and access control
2. Results dashboard data model and rule engine
3. Dashboard UI and qualifier flow
4. Founding-member deposit state
5. Subscription management
6. Account area consolidation
7. Retest loop and lifecycle instrumentation

## Open Implementation Questions

These still need formal answers before build:

- where energy symptoms are captured and stored for the Kit 1 normal-T cross-sell
- how barcode registration and lab-result identity matching will work
- whether Kit 3 B12 logic is live at first release or feature-flagged
- how much result history and comparison is shown in account versus dashboard
- whether founding-member status is a standalone route or a dashboard module with deep links
