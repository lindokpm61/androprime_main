# Terms & Privacy — structured UK-law review (2026-07-25)

**Reviewer:** in-house (Claude), at Keith's direction. **Scope:** `03_compliance/terms-and-conditions.md` + `03_compliance/privacy/privacy-policy.md` (source of truth, including DRAFT bundle / lab-cancel sections not yet live), cross-checked against the live `canonical-site/{terms,privacy}/index.html`.

> **This is NOT legal advice and NOT ratification.** It is a structured pre-solicitor de-risk against the four regimes the terms live under: Consumer Rights Act 2015 (CRA), Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (CCRs), UK GDPR / DPA 2018, and the unfair-terms rules (CRA Part 2). Residual legal liability is only closed by a qualified UK solicitor with professional-indemnity cover. Method: the Anthropic `claude-for-legal` pack turned out to be corporate/US-oriented with no consumer-T&C skill, so its `marketing-claims` / `dpa` lenses were applied alongside the UK statutes directly.

**Bottom line:** structurally sound and unusually consumer-friendly (statutory-rights savings clauses, death/PI + fraud carve-outs, generous refund windows). No landmines. One genuine substantive gap (cancellation characterisation) plus a cluster of easy publish-blockers.

---

## Applied this session (the 🔴 batch)

| # | Fix | Where | Statute |
| --- | --- | --- | --- |
| 1 | Removed the `[analytics platform]` placeholder (→ Google Analytics 4 only) | privacy md | UK GDPR Art 13 transparency |
| 2 | Kit 3 marker count "nine" → "seven" (3 + 4 markers) | privacy md | Art 13 accuracy / consumer info |
| 3 | "Last updated" bumped to **July 2026**, version to **1.2** | terms + privacy md AND live canonical HTML (privacy live was stale at April 2026 / v1.0) | CCRs Sch 2 / Art 13 |
| 4 | Entity block "Andro Prime (trading name)" → "Andro Prime Ltd (trading as Andro Prime)" | terms md (canonical HTML already correct) | CCRs Sch 2 trader identity |
| 7 (wording) | Supplement cooling-off: removed the "first subscription only" limiter (the right attaches to each new distance contract) and replaced "partial refund at our discretion" with the hygiene-exemption position (aligns with the Returns section) | terms md + live canonical terms HTML | CCRs reg 28(3), reg 34(9) |

**Deploy note:** the barcode fix, founding-member removal, SLA, and the above are material changes to live pages → the Terms' own "Changes to These Terms" clause requires **emailing existing customers** on deploy, and the version/date bump reflects that.

---

## Open — genuinely want a solicitor (or Keith's commercial call)

**5. Cancellation: goods vs service — DIRECTION SET (Keith 2026-07-25).** The Terms previously ended the cancellation right on the basis that "the service is in progress" (kit opened + sample taken) — asserted without a clear footing. **Keith's characterisation:** a kit has two parts — (i) the **physical kit = goods**, and (ii) the **lab analysis + results dashboard = service**. This resolves to CCR path (b): the physical kit is sealed goods, so the return right ends on unsealing under the **reg 28(3) sealed-for-hygiene exemption** (the industry-standard basis for at-home test kits), and the analysis/results service follows. The single-kit "Opened kits" clause and the bundle first-kit cancellation clause were reworded 2026-07-25 to this footing (physical product sealed for hygiene → return right ends on opening; service follows). Refinement noted: the "service" is the analysis + results dashboard, not merely the app that displays them. **Still for the solicitor:** confirm the mixed goods+service (reg 28(3) + reg 36) treatment and whether the results service needs its own consent-to-immediate-supply + acknowledgment at checkout; but the drafting now rests on a defensible, articulated basis rather than a bare assertion.

**6. Subscription price/term variation (unfair-terms grey list, CRA Sch 2 paras 11–15).** "Change prices at any time" + "continued use = acceptance of updated terms" are fine for one-off buys but risk unfairness for **ongoing subscriptions** unless notice + a right to cancel before the change takes effect is given. The pre-order section already does this; the general subscription + "Changes" sections do not.

**8. ADR Regulations 2015.** Terms say a customer "may refer to an approved ADR scheme" but don't state whether Andro Prime *participates* in one (and name it) — the regs require that disclosure.

## Open — DPO / privacy (lower risk)

**9. Consent scope for the bundle.** The Art 9(2)(a) basis for *using the first result to schedule the recheck* rests on the checkout consent (CA-018). Confirm that wording covers result-triggered scheduling.

**10. Storage-location consistency.** Account page says data is "stored in the EU (Ireland)"; the policy lists US processors (Customer.io, Vercel) under generic transfer safeguards. Reconcile and name the transfer mechanism per US processor.

**11. Consent withdrawal mid-order.** Not addressed: what happens to an in-flight paid order if health-data consent is withdrawn before results land.

**12. Sentry not disclosed.** `next.config.ts` wires Sentry (US error-monitoring; may receive request data / incidental PII), but Sentry is absent from the "Who Else Receives Your Data" processor table. Confirm whether it belongs there.

**13. md ↔ live divergence.** The source md is ahead of / different from the live canonical HTML in several places (versioning, analytics wording). A full sign-off-gated sync is still owed; this review did NOT sync draft content live.

## Checked and sound (🟢)

Liability carve-outs (death/PI, fraud) correct; statutory-rights savings clauses present; the bundle **Art 22 automated-scheduling disclosure** is well-drafted (no significant effect + human-review offer, consistent with the "no automated decision-making" line); banked-kit 12-month-expiry-with-refund-backstop *exceeds* statutory generosity; ICO reg + controller identity present; Vitall correctly framed as a separate controller; retention rows coherent; UK-only jurisdiction clause fine for UK-resident customers.
