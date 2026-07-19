# Data Retention and Deletion Policy (Phase 0)

**Status:** DRAFT, pending sign-off (Keith + solicitor on the legal-retention rows; Ewa on the health-data rows). Do NOT treat as final until the signature block is completed.
**Version:** 2026-07-19-v1 (draft)
**Owner:** Keith Lindo
**Sources of truth this operationalises:** the published retention table in `03_compliance/privacy/privacy-policy.md` ("How Long We Keep Your Data"), the controller/processor map in `03_compliance/data-controller-position.md` (§4 Vitall independent controller, §4a processors), `03_compliance/dpia/phase0-dpia.md`, and `gdpr-readiness-checklist.md` §6.

**Why this doc exists:** the account "request data erasure" control (F4, `ACCOUNT_DATA_CONTROLS_ENABLED`, approval CA-024) records an erasure request and emits an ops alert; it deletes nothing automatically. This policy is the retention schedule + the manual workflow that answers such a request, and the precondition for ever building automated deletion. Until it is signed, erasure stays request-only and is actioned by hand.

---

## 1. Retention schedule

Periods below mirror the published privacy policy exactly (do not diverge without re-publishing that page). "System of record" is where the authoritative copy lives; the same data may be mirrored in other systems that must also be cleared on deletion (see §3).

| Data category | System(s) of record | Retention period | Lawful basis to retain | Trigger to delete / anonymise |
|---|---|---|---|---|
| Account and identity data (name, email, DOB) | Supabase `users` | 3 years after last activity | Legitimate interest (operations, support) | 3-year inactivity, or earlier on erasure request |
| Health / biomarker results | Supabase (`lab_results`, `blog_articles` unrelated) | 3 years after last kit purchase | Explicit consent, Art 9(2)(a) (captured at checkout, CA-018) | 3 years after last purchase, on consent withdrawal, or on erasure request |
| Order and payment records | Stripe + Supabase `kit_orders` | 7 years | Legal obligation (UK tax / HMRC record-keeping) | End of the 7-year period only. NOT deletable on an erasure request; anonymise the linked identity where possible instead |
| Email marketing consent + list membership | Customer.io | Until consent withdrawn | Consent / legal obligation to evidence consent | On unsubscribe / consent withdrawal, or erasure request |
| Customer support communications | Support inbox / Customer.io | 2 years | Legitimate interest (support, disputes) | 2 years, or earlier on erasure request unless needed for a live dispute |
| Website usage data (anonymised) | GA4 | 26 months | Consent (analytics cookies) | GA4 platform expiry (26 months); already anonymised |

**Reconciliation note (for the solicitor):** the task brief referenced "UK tax 6-year retention"; the **published** privacy policy commits to **7 years** for order/payment records. This policy uses 7 to match the public commitment. Confirm 6 vs 7 (HMRC generally requires records for 6 years from the end of the accounting period, which commonly lands at ~7 calendar years). If 6 is correct, the privacy policy must be corrected too, not just this doc.

---

## 2. Erasure-request workflow (the F4 feature, actioned manually)

1. **Request received.** Customer clicks "Request data erasure" on `/account` (F4), or emails `privacy@andro-prime.com`. The in-app control fires `POST /api/account/erasure-request`, which calls `emitOpsAlert()` to the ops address (`OPS_ALERT_EMAIL`, default `keith@andro-prime.com`) and records the request. It deletes nothing.
2. **Acknowledge + SLA.** The approved copy commits to actioning within **30 days** ("we will action your request within 30 days"). This is inside the UK GDPR one-calendar-month SAR/erasure window. Log the request date.
3. **Verify identity** (the request must come from the account's own authenticated session or verified email).
4. **Delete what can be deleted** across every system in §3.
5. **Retain what the law requires:** order/payment records stay for the 7-year tax period. Where the record can be de-identified without breaking the tax trail, anonymise the linked personal identity instead of keeping it whole.
6. **Handle Vitall separately** (see §4): Vitall is an independent controller for the lab data, so the customer's erasure right against Vitall is exercised with Vitall, not deleted by us as if it were our processor.
7. **Confirm to the customer** what was deleted and what was retained and why (the approved copy already says "some records, such as proof of purchase, may be kept where the law requires it").
8. **Record** the action (date, what was deleted/retained) for the audit trail.

---

## 3. Per-system deletion mechanics

Deletion must propagate to every system that holds the customer's personal data, not just Supabase.

- **Supabase (primary DB):** delete/anonymise the `users` row and cascade to `lab_results`; keep `kit_orders` for the tax period but null the personal identifiers where feasible. (A future automated path would be a service-role script; not built yet.)
- **Stripe (processor):** delete the Customer object / PII where possible; payment and invoice records that Stripe must keep for its own compliance remain under Stripe's retention. Keyed on the customer email.
- **Customer.io (processor):** delete the person/profile and suppress the email; keyed on email. Note the US-transfer safeguard (IDTA/SCCs) already tracked for CIO.
- **Attio:** not in scope for customer erasure (holds partner personal data only, per `data-controller-position.md` §4a).
- **GA4:** already anonymised; no per-user deletion needed beyond the platform's own controls.

Deletion is keyed on the customer's **email** across Stripe and Customer.io (as the task noted), and on the Supabase `user.id` internally.

---

## 4. Vitall: independent controller (critical)

Vitall (Healthy Human Labs Ltd) is a **separate, independent data controller** for the laboratory testing, NOT a processor of Andro Prime (`data-controller-position.md` §4; Services Agreement Core Terms §6 / Order Form §6). Consequences for erasure:

- Andro Prime cannot delete data from Vitall's systems on the customer's behalf as if Vitall were our processor.
- Each party responds to Data Subject Requests for the data it controls. For the lab-held record, either (a) tell the customer they also have erasure rights directly with Vitall and link `https://vitall.co.uk`, or (b) forward the request to Vitall as a courtesy and confirm.
- Confirm the exact mechanism and Vitall's own retention period with Vitall (open question below).

---

## 5. Open questions for the solicitor / Ewa (must resolve before sign-off)

1. **6 vs 7 year** tax retention (see §1 reconciliation note): which is correct, and does the privacy policy need changing?
2. **Health-data retention on account closure:** is "3 years after last kit purchase" the right period for special-category results, or should erasure be more aggressive? (Ewa + solicitor.)
3. **Vitall erasure mechanism:** do we forward requests to Vitall, or only signpost the customer to them? Confirm Vitall's retention period and DSR process.
4. **Anonymisation standard** for retained tax records: what counts as sufficiently de-identified so the residual order record is no longer "personal data".
5. **Automated deletion:** whether to build a service-role deletion script later, or keep erasure manual at Phase 0 volume. This policy assumes manual for now.

---

## 6. Review triggers

Review this policy if: a new processor is engaged, a new data category is introduced, the Vitall arrangement changes, the privacy-policy retention table changes, or automated deletion is built. Otherwise review annually.

---

## 7. Sign-off (humans only; DRAFT until all complete)

Approval requires all named signers. A signer writes their own name and date. Until then this policy is DRAFT and erasure remains manual, request-only.

| Role | Name | Decision | Date |
|---|---|---|---|
| Business (Keith) | | | |
| Clinical / health-data (Ewa) | | | |
| Legal (Solicitor) | | | |
