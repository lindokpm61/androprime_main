# Founding Member List — Funnel Logic

## Purpose

Phase 0 non-cash list signup that captures men with confirmed low testosterone (T < 12 nmol/L from Kit 1 or Kit 3) who want a direct, priority invitation when the CQC-regulated TRT service goes live. No payment is taken. No Stripe involvement. No refund obligation. The list is an email opt-in only.

The £75 founding-member deposit was shelved on 2026-05-08. This funnel replaces it.

---

## Entry conditions

- A confirmed testosterone result below 12 nmol/L from Kit 1 (Testosterone Health Check) or Kit 3 (Hormone & Recovery Check)
- The user is enrolled in `seq-03b-low-t.md` and has reached or passed Email 3 (Day +3), or has clicked any founding-member CTA from a later email in the sequence
- The user submits the email-capture form on `/founding-member`

Kit 2 (Energy & Recovery Check) results alone never trigger this CTA. This is a compliance rule — see `/03_compliance/CONTEXT.md`.

---

## Flow

1. User clicks a founding-member CTA in `seq-03b` or navigates directly to `/founding-member`
2. User submits the email-capture form on `/founding-member` (frontend page owned by `/09_website-app`)
3. Form POSTs to `/api/founding-member/join`
4. API route writes a row to the `founding_member_list` database table
5. API route fires the Customer.io event `founding_member_listed` with the user's email and any relevant attributes
6. Customer.io sets `customer.is_founding_member = true` and sends T-04 (Founding Member List Confirmed) immediately
7. T-04 confirms the list signup and explains the leave-list path (mailto for now)
8. `seq-03b` stops on the `founding_member_listed` event
9. The user enters the monthly founding-member broadcast cadence (seq-03b Email 7 template, sent as a separate broadcast)

---

## Event and naming reference

| Item | Value |
|---|---|
| Customer.io event | `founding_member_listed` |
| API endpoint | `POST /api/founding-member/join` |
| Database table | `founding_member_list` |
| Customer attribute | `customer.is_founding_member` (bool) |
| Confirmation email | T-04 — Founding Member List Confirmed |
| Stop goal in seq-03b | `founding_member_listed` |
| CRM segment | `founding-member` |

The old event name `founding_member_deposit` is retired and must not be referenced in new copy or automation.

---

## Leave-list mechanic

For the current build round, leaving the list is handled via reply-to-email or a direct mailto to `keith@andro-prime.com`. There is no self-serve leave-list page. When the account portal supports list management, the leave-list path will move there.

---

## What is captured

- Email address (required)
- First name (optional, nice-to-have for personalisation)
- Source attribution (UTM and `seq-03b` email number, where available)
- Timestamp

No payment information. No card details. No Stripe customer is created by this funnel.

---

## What is NOT this funnel

- A clinical intake. The clinical intake is Phase post-CQC and lives in `/11_clinical-plugin_post-cqc`.
- A purchase. No money changes hands.
- A waitlist for a kit. Kits are purchasable today via the standard kit purchase funnel.

---

## Cross-references

- Email sequence: `/09_website-app/frontend/email-templates/sequences/seq-03b-low-t.md`
- Transactional email: `/09_website-app/frontend/email-templates/transactional/transactional-emails.md` (T-04)
- Compliance rule for trigger: `/03_compliance/CONTEXT.md`
- Frontend page: `/09_website-app/frontend/canonical-site/founding-member` (owned by frontend agent)
- API route and DB schema: `/09_website-app` (owned by frontend/backend agent)
