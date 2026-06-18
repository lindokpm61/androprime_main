# Approval record — CA-016

**Asset:** `09_website-app/frontend/content/blog/why-am-i-always-tired.mdx`
**Title:** "Why Am I Always Tired? The Lifestyle Causes (and When to Get Checked)"
**Type:** Customer-facing blog article — Pillar B hub, **non-clinical / lifestyle**
**Version:** v1
**Date:** 2026-06-18
**Signers:** Keith Antony (business) + Dr Ewa Lindo (clinical sight)
**Decision:** ✅ **APPROVED for publishing**

## What was approved

Keith and Ewa both approved the draft for publishing in-session on 2026-06-18. The article is a
non-clinical lifestyle piece (causes of everyday tiredness in healthy men), with no biomarker
thresholds, no diagnosis, and no supplement efficacy claims. Ewa's sight specifically confirmed:

- The `<ClinicalInsight>` boundary quote attributed to her (drafted per brief §11).
- The "When to see your GP" `<SystemAlert>` red-flag list.

## Compliance basis

- `compliance-preflight` (2026-06-18): **🔴 HARD 0**, **🟠 REVIEW 7**. All 7 REVIEW hits are the word
  "fix" in *lifestyle* context (fix your sleep, fixed wake time, fixed the basics), not retest/
  supplement-efficacy framing — judged benign and surfaced to Ewa.
- One HARD `diagnose` (negation the scanner missed) was reworded to "isn't a diagnosis on its own".
- Sibling-pillar discipline held: Vit D / Active B12 / iron mentioned in passing, linked out to the
  Vit D hub, no thresholds. Kit 2 (Energy & Recovery) tie only — no Kit 1 fatigue framing. No
  magnesium fatigue claim (retired V7.2). No ashwagandha. Kit-only CTA.

## Conditions

- Publishing is via `/publish-article` (status flip + date stamp + audit + build + smoke test).
- The leftover non-rendering `{/* TODO Ewa sign-off */}` comment is stripped at publish.

## Voice / coverage

- Voice self-check ~12/13. Keyword audit: primary PASS, covered 7/7 PASS.
