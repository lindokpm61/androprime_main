# Approval Record: GEO Third-Party Outreach Email (listing request to comparison/review sites)

| Field | Value |
|---|---|
| Register ID | CA-021 |
| Artefact(s) | Outreach email template + subject + bloodtestguide corrections-variant in `06_marketing/seo-ai-search/geo-third-party-presence-outreach.md` (section "The outreach email (template)") |
| Version | 2026-07-13-v1 (safe-to-send) |
| Content type | Partner / third-party outreach email (B2B listing request). Non-consumer, external-facing. |
| Submitted by | Keith Antony |
| Submitted date | 2026-07-13 |
| Required signers | Keith (business framing). Ewa sight not required: no clinical/efficacy claim; the GP wording is the pre-approved CA-001/003 form. |
| ClickUp | n/a (GEO third-party-presence workstream; tracked in `06_marketing/STATE.md` + the outreach doc's status table) |

## 1. Scope

The email that goes to third-party blood-test comparison/review sites (treatcompare, maleoptimal, helvy, bloodtestguide, lolahealth, and the Tier 2 set) asking to be listed. Purpose is GEO citation: LLMs cite these hubs, not our own domain (baseline 0 citations, `seo-ai-search/geo-serp-findings-2026-06-21.md` + 2026-07-13 re-check). Covers the subject line, the body, and the bloodtestguide corrections-angle opener variant. Per-recipient brackets (`[name]`, `[page name]`, etc.) are filled at send time and carry no claim.

## 2. Pre-flight evidence

- Scanner run 2026-07-13 (`compliance-preflight` / `scan.js`): **0 HARD, 1 REVIEW.** The single REVIEW is the word "TRT" appearing in this document's own compliance note ("no clinical or TRT service implied as live"), not in the sent email. The email body is TRT-free. (An earlier run showed 1 HARD, which was a false positive on the negated phrase "TRT is available" inside the note; the note was reworded, HARD now 0.)
- Judgement pass vs `03_compliance/CONTEXT.md`:
  - **Phase-0 / post-CQC boundary: PASS.** No clinical service, TRT, or confirmatory testing implied as live. No FM CTA (out of scope for outreach).
  - **Kit scoping: PASS.** Kit 1 framed as testosterone testing, not general fatigue (respects the Kit 1 scoping rule).
  - **GP wording: PASS.** "recommendation logic signed off by a GMC-registered GP" is the approved CA-001/003 form (system sign-off, not per-customer interpretation).
  - **Trust signal: PASS.** UKAS / ISO 15189 in approved form, matches what is already live on the site. Keep "the same standard NHS labs work to" aligned to `02_brand/trust-signals.md` if that file tightens.
  - **Price/kit: PASS.** £99 / "Testosterone Health Check" confirmed verbatim against `04_products/icp-kit-supplement-alignment-april2026.md`.
  - **EFSA / supplement claims: N/A.** No supplement benefit claimed. No ashwagandha. No em dashes.

## 3. Flags actioned into the safe-to-send version (2026-07-13)

| Was | Now | Why |
|---|---|---|
| "so you can see how your levels change over time" | "so you can retest later and compare your results" | Brand CONTEXT rule: "tracked over time" must not imply a live longitudinal tracker (tracker v1 observation-only, ships M3–M4). Softened to retest framing. |
| "- If you work on commission, we can set up an affiliate arrangement." | Removed from body; saved as an optional add-back in the doc. | Affiliate programme is FROZEN (`affiliates/CONTEXT.md`; CA-001/002 solicitor sign-off parked). Offering commission is a separate Keith unfreeze decision + v2.3-compliant brief. |
| `keith@androprime.com` | `keith@andro-prime.com` | Domain typo (would bounce); repo uses the hyphenated domain throughout. |

## 4. Signature block

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Business / outreach framing | Keith Antony | ✅ APPROVED | Copy approval only. Affiliate line stays out until the affiliate channel is unfrozen. | 2026-07-13 |

## 5. Outcome

- **APPROVED 2026-07-13 (Keith, business sign-off, on his own instruction in-session).** Low-risk B2B outreach: deterministic scan clean (0 HARD), judgement pass clean, no clinical/efficacy claim, no consumer-facing health claim. Ewa sign-off not required unless the trust wording changes.
- Copy approval only, not a bulk-send authorisation: each send fills the per-recipient brackets; the bloodtestguide variant uses the corrections opener.
- Affiliate/commission line stays out of the body until the affiliate channel is unfrozen (separate Keith decision + v2.3-compliant brief).
- Register: CA-021 = ✅ APPROVED.
