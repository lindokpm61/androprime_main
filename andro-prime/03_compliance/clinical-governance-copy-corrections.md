# Clinical Governance — Results Copy Corrections (Tier 1 & Tier 2)

**Status:** APPROVED by Dr Ewa Lindo 2026-05-22. Implemented across the codebase 2026-05-22.
**Date:** 2026-05-22
**Owner:** Keith Lindo
**Companion to:** `clinical-governance-position.md`

## Purpose

The position note establishes that no one performs per-patient clinical review or sign-off of individual results. Live copy currently says the opposite in many places. This document lists those places and proposes corrected wording, for Dr Ewa Lindo to approve or amend. Nothing here is live until she signs it off.

## The rule the wording follows

Move every claim from an act done to the customer to authorship of the system.

- Safe: a GP set, designed, developed, signed off or approved the report, the healthy ranges and the explanations.
- Not safe: a GP reviews, has reviewed, interprets, checks, looks at or assesses your results.
- Fine: customer-specific outputs the report produces, such as "your recommendation", "where your number sits", "what your result means".

## One question for Ewa before wording is finalised

The proposals below say the marker explanations are "signed off by" Dr Ewa Lindo. If Ewa authored that explanatory copy herself, "written by" is stronger and may be used instead. If the copy is drafted by the team and she reviews and approves it, keep "signed off by". **Ewa to confirm which is accurate.**

## Building-block phrases (pending Ewa sign-off)

- **A (full):** "The healthy ranges your results are measured against, and the plain-English explanation of each marker, are set and signed off by Dr Ewa Lindo, a GMC-registered GP."
- **B (short / trust line):** "Healthy ranges and plain-English explanations signed off by a GMC-registered GP."
- **C (feature chip):** "GP-set ranges and explanations."
- **D (results-email line):** "Every marker in your report is explained in plain English, signed off by Dr Ewa Lindo, a GMC-registered GP."

---

## Tier 1 — results-delivery copy

These appear at the results moment, so they are the priority.

### T1.1 — "Results ready" email (T-05)
**Where:** `email-templates/transactional/transactional-emails.md` (T-05), and its HTML build `transactional-t03-results-ready.html`.
**Now:** "...a specific recommendation based on your numbers. Dr Ewa Lindo has reviewed them."
**Proposed:** "...a specific recommendation based on your numbers. Every marker is explained to a standard signed off by Dr Ewa Lindo, a GMC-registered GP."

### T1.2 — seq-03a energy results email
**Where:** `email-templates/sequences/seq-03a-energy-results.md`, and HTML build `seq-03a-email-1-results-in.html`.
**Now (a):** "Your {{ event.kit_name }} results are in. Dr Ewa Lindo has reviewed them."
**Proposed (a):** "Your {{ event.kit_name }} results are in."
**Now (b):** "...alongside the reference ranges, with Dr Ewa's notes on each marker."
**Proposed (b):** "...alongside the reference ranges, with the plain-English explanation Dr Ewa Lindo signed off for each marker."

### T1.3 — seq-03b low-T results email
**Where:** `email-templates/sequences/seq-03b-low-t.md`, and HTML build `seq-03b-email-1-results-in.html`.
**Now (a):** "...came back at {{ customer.testosterone_value }} nmol/L. Dr Ewa Lindo has reviewed your full panel (total testosterone, SHBG, Free Androgen Index, and Albumin), and her notes are alongside your results in the dashboard."
**Proposed (a):** "...came back at {{ customer.testosterone_value }} nmol/L. Your full panel (total testosterone, SHBG, Free Androgen Index, and Albumin) is in your dashboard, with a plain-English explanation of each marker, signed off by Dr Ewa Lindo, a GMC-registered GP."
**Now (b):** "Your results and Dr Ewa's notes are in your dashboard. Read them when you're ready."
**Proposed (b):** "Your results, with a plain-English explanation of each marker, are in your dashboard. Read them when you're ready."
**Now (c):** "...it gives Dr Ewa something specific and measurable to look at rather than a shrug."
**Proposed (c):** "...it gives you something specific and measurable to work from rather than a shrug."

### T1.4 — seq-03d borderline-T results email
**Where:** `email-templates/sequences/seq-03d-borderline-t.md`, and HTML build `seq-03d-email-1-results-in.html`.
**Now:** "Dr Ewa Lindo has reviewed your results. Your full panel (testosterone, SHBG, Free Androgen Index, and Albumin) is in your dashboard."
**Proposed:** "Your full panel (testosterone, SHBG, Free Androgen Index, and Albumin) is in your dashboard, each marker explained in plain English, signed off by Dr Ewa Lindo, a GMC-registered GP."

### T1.5 — Results engine, Kit 3 combined-panel intro
**Where:** `04_products/results-engine/kit3-combined-result-rule.md` (patient-facing results copy). Note: the same file flags that seq-03b Email 1 carries the same claim — covered by T1.3.
**Now:** "...Dr Ewa Lindo has reviewed the full panel and her notes are alongside each marker below."
**Proposed:** "...Each marker below is explained in plain English, to a standard signed off by Dr Ewa Lindo, a GMC-registered GP."

### T1.6 — Results dashboard header
**Where:** `docs/screen-specs/dashboard-screen.md`, and the built results dashboard.
**Now:** "Reviewed by [Dr Ewa Lindo, GMC registered]. Scroll down to see your full results."
**Proposed:** "Explanations signed off by Dr Ewa Lindo, GMC-registered GP. Scroll down to see your full results."

---

## Tier 2 — site and marketing copy

### T2.1 — Launch-day trust line
**Where:** `email-templates/sequences/seq-01-waitlist.md` (Email 4), and HTML build `seq-01-email-4-launch-day.html`.
**Now:** "Dr Ewa Lindo reviews every result. UKAS ISO 15189 accredited lab. Results in your dashboard within 2 to 5 working days of the lab receiving your sample."
**Proposed:** "Healthy ranges and plain-English explanations signed off by Dr Ewa Lindo, a GMC-registered GP. UKAS ISO 15189 accredited lab. Results in your dashboard within 2 to 5 working days of the lab receiving your sample."

### T2.2 — Landing-page and kit-page trust line
**Where:** `app/lp/hormone-recovery`, `app/lp/foundations`, `app/(marketing)/kits/hormone-recovery`, `app/(marketing)/kits/testosterone`, and the legacy `canonical-site/` and `lp/` HTML mirrors of those pages.
**Now:** "Your results are reviewed by a GMC-registered doctor. No guesswork. No generic advice. Just your data and what it means for you." (the testosterone page instead ends "Every recommendation is backed by your actual data, not a guess.")
**Proposed:** "Your report is built on healthy ranges and explanations set by a GMC-registered GP. No guesswork. No generic advice. Just your data and what it means for you." (keep the testosterone page's closing sentence unchanged.)

### T2.3 — Foundations FAQ answer
**Where:** `app/lp/foundations` (FAQ schema and the rendered FAQ), plus mirror.
**Now:** "You receive your kit, the lab analysis, and a digital report reviewed by a doctor."
**Proposed:** "You receive your kit, the lab analysis, and a digital report built on a GMC-registered GP's standards."

### T2.4 — Feature chip
**Where:** `app/lp/hormone-recovery`, `app/lp/foundations`, `components/auth/AuthCard.tsx`, plus mirrors.
**Now:** "GMC-registered doctor review"
**Proposed:** "GP-set ranges and explanations" (if a shorter chip is needed: "GP-built report").

### T2.5 — Homepage feature line
**Where:** `app/(marketing)/page.tsx`, and `canonical-site/home/index.html`.
**Now:** "Clear data, doctor review, and actionable recommendations." (one instance ends "...actionable protocols.")
**Proposed:** "Clear data, a GP-built report, and actionable recommendations." (keep "...protocols" on the other instance.)

### T2.6 — Collagen supplement page heading
**Where:** `app/(marketing)/supplements/collagen/page.tsx`.
**Now:** "Recommended based on your results. Reviewed by a real doctor."
**Proposed:** "Recommended based on your results. Built on a GMC-registered GP's guidance."
**Note for Ewa:** this assumes you have signed off the supplement-recommendation protocol. If not, the wording needs to change accordingly.

---

## Already correct — use as the reference

The Contact page (`app/(marketing)/contact/page.tsx`, `canonical-site/contact/index.html`, `canonical-site/contact/copy.md`) already reads correctly and needs no change:

> "Dr Ewa Lindo reviews our clinical protocols and results report copy. At this stage, we're not offering one-to-one clinical consultations. If your results raise something that needs medical attention, we'll tell you that clearly in your dashboard, and we'd encourage you to speak to your GP."

This is the tone to match.

## Tier 3 — the "GP-interpreted" USP (separate sweep)

Resolved in principle in the position note: retire "GP-interpreted", reframe to GP authorship using the building blocks above. Propagation across positioning docs, all affiliate briefs (PT, Influencer, Gym), the LinkedIn launch posts and product-page USP headlines is a separate sweep, to run once Ewa has signed off the wording here.

## Implementation note (2026-05-22)

Implemented across the codebase on 2026-05-22 following Dr Ewa Lindo's sign-off. Tier 1 and Tier 2 applied as specified. The following were also corrected, under the same approved rule, beyond the enumerated list above:

- `seq-03c-normal-results.md` and its HTML build carried the identical "Dr Ewa Lindo has reviewed them" claim and received the same Tier 1 fix.
- The `seq-03b` Email 2 HTML build carried the "gives Dr Ewa something to look at" line and received the same fix.
- Supplement and kit trust badges ("GMC Doctor Reviewed", "GMC-Registered Doctor Review") on the collagen, daily-stack and energy-recovery pages and their legacy mirrors were reworded to authorship phrasing for consistency. The supplement-page badges describe a product rather than a result, so their wording may warrant a separate check with Dr Ewa Lindo.

The DPIA risk register (`dpia/phase0-dpia.md`) was corrected: the "abnormal result not escalated" row no longer states that Vitall reviews every result.

## Sign-off

| Role | Name | Date | Status |
| --- | --- | --- | --- |
| Founder | Keith Lindo | 2026-05-22 | Drafted |
| Clinical lead | Dr Ewa Lindo | 2026-05-22 | Approved |
