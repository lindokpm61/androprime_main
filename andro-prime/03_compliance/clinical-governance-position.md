# Clinical Governance Position — Results Sign-Off (Phase 0)

**Status:** APPROVED — signed off by Dr Ewa Lindo 2026-05-22. Copy corrections implemented 2026-05-22.
**Date:** 2026-05-22
**Owner:** Keith Lindo
**Workstream:** Compliance
**Related:** ClickUp task 07 (Vitall clinical-governance posture confirmation), task 13 (abnormal-result escalation), `dpia/phase0-dpia.md`

## Purpose

This document records Andro Prime's settled position on clinical sign-off of test results in Phase 0: who is responsible for clinically reviewing results, who is not, and what that means for customer-facing copy. It exists because the question "does anyone clinically sign off each result?" was unresolved, and live copy made claims that did not match operational reality.

## Vitall's posture (the testing partner)

Confirmed from Vitall's correspondence and documentation:

- Vitall is a data and fulfilment hub. It is not a clinical provider.
- Clinical governance sits with Vitall's UKAS-accredited laboratories, not with Vitall (2026-04-22 Vitall quote).
- The laboratories perform analytical validation and quality assurance of the result values. Qualified biomedical and clinical scientists are responsible for this (Partner Activation Kit, May 2026).
- The laboratory's clinical team handles direct escalation of critical or abnormal results only, via the `warning` field on the results webhook (Vitall integration spec).
- Vitall does not provide clinical consultations, diagnosis, treatment advice, or patient-facing clinical interpretation (Partner Activation Kit; Services Agreement clause 3.10: results are "informational only and do not constitute medical advice").

Conclusion: Vitall and its labs provide analytically validated results and lab-side escalation of critical findings. They do not provide patient-facing clinical interpretation or sign-off.

## Andro Prime's decision

Andro Prime will not perform per-patient clinical review or sign-off of individual results in Phase 0. No party in the chain does this.

Rationale:

1. A clinical review of a result means a clinician interpreting that value in the context of the individual: history, symptoms, medication, examination. That cannot be done responsibly from an isolated value.
2. Andro Prime deliberately does not collect or hold patient medical histories. It holds the test result only. The information required to clinically review a result therefore does not exist within Andro Prime, and will not.
3. Per-patient clinical results delivery with prescriber sign-off is a regulated, post-CQC activity. Performing it in Phase 0 would cross the wellness/clinical boundary the entire Phase 0 model depends on.

Andro Prime in Phase 0 is an information service. It presents lab-validated marker values together with a plain-English explanation of what each marker means. It does not diagnose and does not give individual medical advice.

## Dr Ewa Lindo's role (bounded)

Dr Ewa Lindo, as Andro Prime's clinical lead and a GMC-registered GP, signs off the results system, not individual patients' results. Specifically she reviews and signs off, once and whenever it changes:

- the results-engine logic: the bands, thresholds and reference ranges that classify a marker as low, normal, high or optimal;
- the explanatory wording shown against each marker (what the marker is, what a given result means);
- the safety-netting wording that tells a customer when to seek medical attention (GP, NHS 111, 999).

She does not review individual customers' result values. This is sign-off of the framework, which the results engine then applies automatically to every report.

## Safety net for critical results

A genuinely abnormal or critical result is caught by:

1. the laboratory's clinical team, which escalates critical findings directly (Vitall `warning` field); and
2. the standard disclaimer carried on every result: the result is health information, not medical advice, and the customer should speak to a healthcare professional.

The precise abnormal-result escalation and patient-communication flow is to be confirmed in writing with Vitall (ClickUp task 13).

## Consequences for copy

Customer-facing copy must not state or imply that a doctor reviews, has reviewed, or signs off an individual customer's results. Claims such as "Dr Ewa Lindo reviews every result", "Dr Ewa Lindo has reviewed your results", and "your results are reviewed by a GMC-registered doctor" are inaccurate under this position. They are a misleading-claim risk (ASA) and a Phase 0 boundary risk.

Permitted framing — already live on the Contact page, to be used as the template: Dr Ewa Lindo designs and signs off the results interpretation framework and the results report copy; Andro Prime does not offer one-to-one clinical consultations; where a result needs medical attention the customer is told clearly and directed to their GP.

A copy correction sweep is required across the results emails, the results engine, the dashboard, the landing pages and the kit pages. The wording is bounded copy that defines Dr Ewa Lindo's role, so the corrected wording must be signed off by her before it goes live.

## Headline USP — resolved direction

Andro Prime's headline USP was a "GP-interpreted report". A plain reader could take that to mean a GP interpreted their individual results, the same issue as above. Decision (2026-05-22): the USP is kept but reframed from an act to authorship.

- Retire the phrase "GP-interpreted". "Interpreted" reads as a per-patient act.
- Reframe to GP authorship of the report: the USP is that a GMC-registered GP set the healthy ranges every result is measured against and signed off the plain-English explanation of every marker.
- Verb test for all copy. Safe (authorship of the system, past tense): a GP set, designed, developed, wrote, signed off or approved the report, the ranges and the explanations. Not safe (an act on the customer): a GP reviews, has reviewed, interprets, checks, looks at or assesses your results. Customer-specific outputs the report produces ("your recommendation", "what your result means", "where your number sits") remain fine.

Approved customer-facing description (pending Dr Ewa Lindo sign-off): "A GMC-registered GP, Dr Ewa Lindo, set how every Andro Prime result works: the healthy ranges your numbers are measured against, the plain-English explanation of each marker, and the recommendation you receive. It is clear, GP-built information about your own data. It is not a one-to-one consultation or a personal medical opinion."

Tier 1 (results-delivery) and Tier 2 (site and marketing) copy corrections are set out in `clinical-governance-copy-corrections.md`. Propagation of the reframed USP across positioning docs, affiliate briefs, social content and product-page headlines is a further sweep (Tier 3 in that companion), to run once Dr Ewa Lindo has signed off the wording.

## Correction needed elsewhere

`dpia/phase0-dpia.md` currently states "Vitall's clinical governance team reviews every result pre-CQC." This is inaccurate per the Vitall posture above and should be corrected to reflect analytical validation plus lab-side escalation of critical findings only.

## Sign-off

This position was confirmed by Dr Ewa Lindo on 2026-05-22. It defines the limits of her clinical involvement.

| Role | Name | Date | Status |
| --- | --- | --- | --- |
| Founder | Keith Lindo | 2026-05-22 | Drafted |
| Clinical lead | Dr Ewa Lindo | 2026-05-22 | Approved |
