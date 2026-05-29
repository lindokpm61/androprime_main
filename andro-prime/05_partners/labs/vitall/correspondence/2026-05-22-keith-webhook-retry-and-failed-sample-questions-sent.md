# Vitall — Webhook retry policy + failed sample handling (draft)

**Date drafted:** 22 May 2026
**To:** Ben Starling (ben@vitall.co.uk)
**From:** Keith Lindo (keith@andro-prime.com)
**Status:** Draft, ready to send. Closes punch-list item 13 / ClickUp 869d99m2c (DoD = written confirmation + documented in integration spec).

---

**To:** ben@vitall.co.uk
**Subject:** Two integration questions: webhook retries and failed samples

---

Hi Ben,

Two quick operational questions to close out before we go live, both for our integration spec and so our customer-facing copy matches your process exactly.

1. Webhook retry policy. If our endpoint is briefly unavailable when Vitall fires a webhook, do you retry? If so, how many attempts, over what window, and with what backoff? And will missed events be replayed automatically once we are back up, or do we need to reconcile via the API ourselves?

2. Failed or insufficient sample. How is this signalled to us in the results payload? Is it a dedicated status event, a flag or note field in the standard results response, an absence of result values, or a separate sample-failed webhook? And on the customer side, what is the recollection process? Specifically, does Vitall ship a replacement kit directly to the customer, and how is the cost handled under our agreement?

Happy to take either by email or in a quick call if that is easier.

Thanks,
Keith

Keith Lindo
Founder, Andro Prime
keith@andro-prime.com

---

*Internal note:* Two long-standing open questions from `vitall-api-assessment.md` (gap table rows "Failed sample indication" and "Webhook retry policy", plus the "Outstanding Questions for Vitall" list — questions 1 and 2). Both were ❓ since the assessment was written; never put to Ben in writing. Task 13 / 869d99m2c is technically labelled "Blocked on: Ben" but was actually blocked on us to ask. Once Ben replies, transcribe answers into `09_website-app/docs/thriva-integration-spec.md` and flip both ❓ rows in `vitall-api-assessment.md` to ✅ with the documented behaviour, then close the ClickUp task with the answers pasted in a comment.
