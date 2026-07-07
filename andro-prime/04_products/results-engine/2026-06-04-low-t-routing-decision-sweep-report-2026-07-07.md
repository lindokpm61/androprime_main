# Low-T Routing Decision — Doc-Layer Sweep Report

**Sweep date:** 2026-07-07
**Decision:** `2026-06-04-low-t-routing-decision.md` — T < 12 nmol/L (Kit 1/3) → GP referral, no upsell (CA-013), optional consent-gated nurture (CA-014/015); FM list decommissioned as a results CTA (join route 410, `/founding-member` redirects to `/kits`); £75 FM deposit shelved 2026-05-08.
**Plan:** repo-root `PLAN-low-t-routing-sweep.md`. Executed per `.claude/skills/decision-sweep/SKILL.md` invariants.

---

## UPDATED (live rule/reference docs — stale text rewritten in place)

1. `09_website-app/frontend/email-templates/CONTEXT.md` — FM-CTA checklist item; `customer.is_founding_member` + `event.month_year` Liquid rows deleted; Email-7 Special Case → Part B go/no-go rule; stale "CIO not set up" note → live EU workspace 219186; dir-tree "(7 emails)" label → Part A + Part B.
2. `07_sales/funnel/supplement-conversion.md` — FM-CTA guardrail line → GP-referral rule.
3. `01_strategy/CONTEXT.md` — Strategic Constraints row → low-T routing rule.
4. `06_marketing/positioning/product-marketing-context.md` — ICP 1 conversion action (x2) → GP-referral journey; "TRT isn't available yet" objection response no longer pitches the FM list.
5. `06_marketing/content/copy-content-context.md` — seq-03b block rewritten (Part A + Part B); "Founding member emails" label → "Low-T result emails".
6. `06_marketing/seo-ai-search/seo-content-context.md` — `/founding-member/` indexed-page row + crawl-order entry deleted.
7. `04_products/results-engine/kit3-combined-result-rule.md` — 12 edits; routing, defect text, fixture, dashboard copy, compliance row now match `classifier.ts` (gpReferral primary, null secondary); §6 stop-goal line qualified as dormant per `conversion-rules.md`.
8. `02_brand/messaging-framework.md` — 2 edits.
9. `02_brand/prohibited-terms.md` — FM-CTA boundary row → retired; scanner row fixed.
10. `01_strategy/ai-agent-org-chart.md` — Architect trigger line + Typical Flow steps 4-5 (deposit-as-income removed).
11. `10_launch-ops/qa/results-dashboard.md` — 5 QA steps → verify CA-013 GP-referral card on T < 12 AND no FM/product CTA on that path.
12. `04_products/kits/kit-1-testosterone-health-check.md` (7 edits), `04_products/catalogue/non-regulated-tier-v7.md` (3), `04_products/kits/kit-2-energy-recovery-check.md` (4) — bodies aligned with their own top banners.

**Beyond the plan (stale live-rule lines the plan missed, fixed and disclosed):**
- `10_launch-ops/CONTEXT.md` Special Cases — retired "seq-03b Email 7 monthly FM update" was still a live monthly ops task → replaced with Part B go/no-go rule. (Plan listed this file Category D via ~121 only.)
- `04_products/kits/kit-3-hormone-recovery-check.md` §7 — live "Founding-member trigger | T < 12" compliance row → low-T GP-referral routing row. (Plan listed this file Category D.)
- `09_website-app/deployment/monitoring/monitoring.md` — weekly-KPI digest still listed "Founding member deposits" → replaced; note added that `automations/n8n/kpi-weekly-digest.json` may still query the old metric (code untouched per sweep invariant 4 — needs its own task before go-live).

## BANNERED (historical/planning records — body untouched)

- `01_strategy/master-implementation-blueprint.md` — top SUPERSEDED banner + 4 in-body pointers (§2.2 Kit Range, §5.3 Results Report Logic, §5.5 Follow-Up Emails, §8.4 Dashboard 4).
- `04_products/kits/kit-1-launch-guide.md` — existing banner extended to cover the shelved £75 deposit.
- `04_products/icp-kit-supplement-alignment-april2026.md` — §4.4 banner extended to cover the §5 "Old model" T<12↔FM equivalence.
- `09_website-app/docs/`: `implementation-plan.md`, `phase5-implementation-plan.md`, `phase7-implementation-plan.md` (existing PARTIALLY-OBSOLETE banners extended with the low-T bullet); `app-requirements.md`, `cro-context.md`, `screen-specs/account-screens.md`, `screen-specs/biomarker-result-card.md` (new historical banners, plan wording).
- `09_website-app/design/mockups/results-dashboard-design-reference.md` — new historical banner (beyond plan; ResultConvert row lists the FM-deposit CTA).

## ESCALATED (not edited — named-human sign-off required)

| Item | Owner | Status |
| --- | --- | --- |
| `06_marketing/content/linkedin/keith-launch-posts-v1.md` Post 5 — "Founding member places... open at launch" | **Keith** | Review note + suggested replacement sentence added above the post; Keith's copy untouched. |
| `03_compliance/privacy/privacy-policy.md` ~33/37/90/117 — still advertises the FM list | **Keith + Ewa** | Out of scope per plan (legal doc, launch-blocking). Untouched. |
| `03_compliance/brand-licence/inter-company-brand-licence.md` L86 — "founding member deposits" in schedule | **Solicitor** | Already flagged in-file (REVIEW REQUIRED 2026-05-09) and in blueprint hygiene table. Untouched. |

## DELIBERATELY UNTOUCHED (history per sweep invariant 1)

Everything in `03_compliance/content-approval/` (incl. `approval-record-fm-cta-language-2026-05-18.md`, `ewa-packet-ca-009-ca-010-2026-05-23-draft.md`); all dated decision/research docs (`01_strategy/*2026-05-08*`, `2026-05-23-phase0-supplements-deferred-plan.md`, `entity-structure/2026-05-12-single-entity-decision.md`, `03_compliance/2026-06-23-signup-clinical-optin-consent.md`); superseded models with existing STALE banners (`phase0-financial-model-v1.md`); `07_sales/funnel/founding-member.md` (already carries a DECOMMISSIONED banner); `10_launch-ops/implementation-checklists/qa-gates.md` (frozen April baseline under its 2026-06-22 banner); `09_website-app/docs/phase6-implementation-plan.md` (existing correction banner); `audit-2026-07-05-action-list.md` (snapshot — nothing ticked; ClickUp is the tracker).

**Note for Keith:** `03_compliance/2026-06-23-signup-clinical-optin-consent.md` (lines 28, 120) post-dates the routing change yet still describes the FM list as "Kit-1-dashboard-only and T < 12 gated" — left untouched as a dated decision doc, but worth a forward-pointer if it is still consulted. Also `08_customer-journey/flows/flow-4-results-to-action.md` line 12 says the FM opt-in is "now removed entirely", which is slightly stronger than the canonical "dormant standalone non-cash opt-in" (Category D, untouched).

## VERIFICATION

- `rg -in "founding.member|founding member"` — every remaining hit is: a dated/history doc, under a SUPERSEDED/historical/DECOMMISSIONED banner, a correct dormant-opt-in or 2026-06-04-change description, an escalated item above, or the escalation note itself.
- `rg -in "£75 deposit|founding.member deposit"` — every remaining hit is shelved-framing, bannered-historical, or escalated (brand licence).
- Category D files byte-identical except the two disclosed fixes above (`kit-3-hormone-recovery-check.md`, `10_launch-ops/CONTEXT.md`).
- Doc rewrites in `kit3-combined-result-rule.md` and `qa/results-dashboard.md` checked against `classifier.ts` (severely-low <5.2 / low / equivocal bands all → `gpReferral` primary, no secondary CTA).
- No em dashes introduced in any customer-facing replacement copy.
