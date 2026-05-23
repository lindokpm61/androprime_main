# Ewa review packet — CA-009 (waitlist) + CA-010 (Kit 3 v1)

**Date drafted:** 23 May 2026
**To:** Dr Ewa Lindo (`ewalindo@live.co.uk`)
**From:** Keith Lindo (`keith@andro-prime.com`)
**Status:** Draft, ready to send (Keith).

---

**Subject:** Two compliance sign-offs in one packet (Phase 0a)

Hi Ewa,

Two things to sign off, packaged together so you can do them in one sitting. Background first, then the two records.

**Background.** The supplement range is not ready for launch. Manufacturing is two to three months out, so I have split Phase 0 into two: Phase 0a (kits and founding-member list go live now, supplements deferred) and Phase 0b (supplements ship). To avoid leaving customers on dead-end result cards, I have introduced a supplement-waitlist mechanic. It mirrors the founding-member list you already signed off in CA-008. Non-cash, opt-in, honest about timing.

That sequencing means two new approval records, and one existing record needs to be reopened with a different scope.

**1. CA-009 — Supplement waitlist copy template (new).**

The standard waitlist mention block, used across the new `/supplement-waitlist` landing, the `/supplements/*` coming-soon pages, the `/lp/daily-stack` and `/lp/collagen` pages, the seq-03a / seq-03c / seq-03d Email 3 rewrites, the form copy, and a new T-10 transactional confirmation email.

Pattern: honest about timing ("launches shortly, as soon as our manufacturing partner is confirmed", no specific month), pairs with an OTC suggestion where clinically appropriate (Vitamin D3 from a chemist, oral Active B12) using EFSA-verbatim wording, founding-customer discount on launch. No medicinal claims. Silent ingredient absent. FM-CTA gate untouched.

Record: `03_compliance/content-approval/approval-record-supplement-waitlist-template-2026-05-23.md`. Pre-flight: one HARD hit, which is the standard "rule-quoting" documented exception in the file's own compliance-notes block (same pattern as your CA-008 sign-off on seq-03b). Nine REVIEW items, all surfaced for your decision in §2.2 of the record.

**2. CA-010 — Kit 3 combined-result rule v1 (replaces the 2026-05-18 v2 ask).**

This is the same Kit 3 rule we discussed on 2026-05-18, **redrafted for Phase 0a**. Where the original v2 routed multi-deficiency Kit 3 customers to a Daily Stack or Complete Men's Stack purchase, v1 routes them to the supplement waitlist. The non-negotiable T < 12 nmol/L rule for the founding-member CTA is preserved. The §5 customer-facing dashboard copy has been rewritten in the seq-03b voice so it does not imply a buyable supplement today.

Record: `03_compliance/content-approval/approval-record-kit3-combined-result-rule-v1-2026-05-23.md`. Pre-flight: two HARD hits, both inside the §7 compliance checklist quoting forbidden phrases to forbid them. Same documented-exception pattern as CA-008. Disposition logged in §2.1 of the record.

The Kit 3 classifier defect we flagged on 2026-05-18 (low T plus one energy deficiency suppressing the FM CTA) is **fixed in code**. The regression fixture is in place and the test suite is clean. Activation of the fix gates on this approval.

**What you are signing off, specifically:**

- CA-009 §3 (the standardised waitlist mention pattern) and the per-surface application list in §1.
- CA-010 §3 (precedence ladder), §5 (the customer-facing dashboard copy block), and §7 (the compliance checklist).
- Sign each record's signature block in your own hand, send back from your own address. Same evidentiary standard as CA-008.

**What is gated on this sign-off:**

- The supplement-waitlist mechanic going live (DB, API, form, page conversions, sequence rewrites).
- The Kit 3 classifier fix being deployed.

Code is on `main` locally, not pushed to production, until both records are signed.

Happy to jump on a short call if any of the two surfaces is easier discussed verbally. Otherwise, the packet is on the repo and the records show every change line by line.

Thanks,
Keith

Keith Lindo
Founder, Andro Prime
keith@andro-prime.com

---

*Internal note:* sending Ewa direct links is awkward (the records reference each other and the plan doc). If she prefers, generate one PDF for each record (strip the reviewer comment-block markers if any) and send as attachments. The two records plus the umbrella plan (`01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`) are the canonical packet.
