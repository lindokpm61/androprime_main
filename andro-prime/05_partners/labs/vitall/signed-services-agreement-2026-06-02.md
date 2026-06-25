# Vitall Services Agreement — EXECUTED (filed record)

**Status:** FULLY EXECUTED. Signed by both parties 2026-06-02.
**Source PDF:** `androprime-vitall-contract-signed.pdf` (Google eSignature; file "Andro Prime Services Agreement - May 2026.docx - 02/06/2026, 10:17").
**Filed:** 2026-06-12 (this record summarises the executed PDF for the operating system; the PDF is the authoritative document).

> This is a faithful summary of the executed agreement for internal reference. Where this record and the signed PDF differ, the PDF governs.

---

## Parties

| Role | Entity |
|---|---|
| **VITALL** (lab / testing provider) | **Healthy Human Labs Ltd**, Company No. 11263709, trading as VITALL. Registered office: 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ |
| **Partner** | **Andro Prime Ltd**, Company No. 17185839. Registered office: 128 City Road, London, EC1V 2NX |

## Key dates / term

- **Commencement Date: 08-05-2026** (specified in Order Form §2 — note this is *earlier* than the final signature date; an earlier eSignature round occurred 8 May, the revised version was executed 2 June).
- **Executed: 2026-06-02** (Keith Lindo, Director, signed 11:57 UTC; Ben Starling, Commercial Director, countersigned 12:00 UTC).
- **Initial Term: 12 months** from Commencement → ends ~08-05-2027.
- **Auto-renews** for successive 12-month terms unless either party gives **≥90 days' written notice** before the end of the term → **to exit at end of initial term, serve notice by ~07-02-2027.**
- Governing law: England & Wales.

## Commercial model

- **Model 3 — API / Electronic Order Model** selected (all other models have no effect).
- Andro Prime = customer-facing retailer and contracting party with the Patient; sets its own retail pricing.
- Vitall = silent fulfilment, laboratory coordination and reporting partner via API Integration, using Authorised Sub-Processors.
- Payment: monthly invoicing in arrears, 14 days, interest 4% over base. Vitall may suspend on ≥7 days' notice for undisputed non-payment.

## Pricing — Schedule 1 (Partner COST prices, inc. VAT where applicable; zero-rated for health testing)

| Kit | Markers | Partner cost |
|---|---|---|
| Andro Prime Hormone Check (Kit 1) | Free Testosterone, Albumin & SHBG, Testosterone | **£58.50** |
| Andro Prime Energy & Metabolism (Kit 2) | Vitamin D, CRP, Active B12, Ferritin | **£63.00** |
| Andro Prime Combo Test (Kit 3) | Vit D, CRP, Free T, Albumin & SHBG, Testosterone, Active B12, Ferritin | **£98.00** |

Fees: replacement finger-prick/home kit £12; Tasso/TAP II device £42; clinic rebooking £35; nurse rebooking £45. Partner bears any Patient refund/compensation it offers.

## Cancellation & billing mechanics (Model 3) — the refund-window answer

**Full executed text now transcribed into the repo 2026-06-25:** [`services-agreement-2026-06-02-full-text.md`](./services-agreement-2026-06-02-full-text.md) (the binary signed PDF should still be filed as `androprime-vitall-contract-signed.pdf`).

- **An order becomes non-cancellable only once "processed by the laboratory"** (Model 3 §3.1; Schedule 1 §2.2) — **NOT** when Andro Prime places/dispatches it via the API. Schedule 1 §2.1: an order is "deemed placed when transmitted via the API and accepted by VITALL's systems" — that's *placement*, not the non-cancellable trigger. So there is a contractual cancellation window between our auto-dispatch and lab processing (which is late: after kit produced → posted → sample collected → returned → analysed).
- **No stated fee for cancelling pre-lab-processing.** Schedule 1 §2.3 lists only replacement-kit (£12), Tasso/TAPII (£42), clinic rebooking (£35), nurse rebooking (£45) — no order-cancellation penalty.
- **Billing is "per completed order" / "per completed Test order"** (Schedule 1 §1.3, §4.4), monthly in arrears (Model 3 §2.1). Implication: an order cancelled before lab processing is arguably not a "completed order" → the test fee (£58.50/£63/£98) likely isn't owed; a kit already printed/posted is the only probable sunk cost.
- **Partner bears any Patient refund/compensation** (Model 3 §3.3; Schedule 1 §2.3(f)) — VITALL never reimburses a refund AP gives a customer.
- **Operational gap:** no order-cancel API endpoint exists (only `POST /order/create`; client has no cancel method), and the Stripe webhook auto-dispatches to VITALL within seconds of payment — so using the window is a **manual** request to VITALL (care@vitall.co.uk / Ben), done fast. See [[stripe-configuration-constraints]] / [[vitall-correspondence-state]].
- This **aligns with AP's own customer T&Cs**: customer right-to-cancel ends at opened-kit + barcode-registered / sample-to-lab; AP's ability to cancel with VITALL ends at lab-processing. A customer cancelling before using the kit sits inside both windows.

## Data protection — CONTROLLER-TO-CONTROLLER (Order Form §6 + Core Terms §6)

**This is the critical point for the Data Controller Position doc.** Under the selected Model:

- **Andro Prime Ltd = independent Data Controller** for: its own customer relationship, marketing, customer support, retail journey, pricing, payment, patient communications.
- **VITALL = independent Data Controller** for Patient Personal Data processed to provide the Testing Services: kit fulfilment, sample logistics, laboratory coordination, result generation, reporting, quality control, repeat testing, patient support relating to testing, legal compliance, record keeping.
- Either party acts as **Data Processor only** for a specific activity carried out solely on the other's documented instructions.
- Each controller: determines its own purposes/means, is responsible for its own compliance, responds to Data Subject Requests for data it controls, and must notify the other promptly of a Personal Data Breach affecting shared data (Core Terms §6.2).
- **Sub-processors (§6.3.4):** Andro Prime gives general written authorisation for Vitall to engage Authorised Sub-Processors (labs, kit/logistics/courier, IT hosting, phlebotomy, advisers). Vitall notifies of material changes. Named labs (per Ben, 22 May): TDL, Inuvi Diagnostics, Alderley Lighthouse Labs — **not** a contractual commitment; Vitall may change providers.
- **International transfers (§6.4):** Vitall will not transfer Patient Personal Data outside the UK without appropriate safeguards or a derogation.

## Liability & insurance

- **Liability cap (§5.3):** greater of £50,000 or 12 months' fees paid.
- **Data-protection / confidentiality / clause 6 cap (§5.4): £100,000.** (Keith flagged this as low for a special-category health dataset during negotiation; Vitall declined to raise it.)
- Usual carve-outs (death/personal injury, fraud, statutory) uncapped.
- **Insurance (§9.11):** professional indemnity (health data/reporting) £2m; product liability £5m; public liability £5m. Evidence available on request.

## Andro Prime contractual OBLIGATIONS to action

- **§3.14.6 — must reference Vitall as the Testing Services provider in Andro Prime's T&Cs and on relevant product pages, including a link to https://vitall.co.uk/terms.** (Verify this link is present — see flags.)
- **§3.14.7 / 3.14.9–10** — Patient-facing claims about tests, sample types, turnaround, results, clinical meaning and limitations must be consistent with Vitall-approved/supplied wording (Vitall supplied an approved-wording pack 22 May). Vitall may reject non-compliant copy; approval not given by silence.
- §3.14.2 — Andro Prime responsible for presentation/promotion/sale, accuracy/compliance of its claims, and the purchase journey (refunds, cancellations, complaints not about testing performance).
- §3.6 — test reports do not display the UKAS symbol; Vitall's sub-processor labs are UKAS accredited (verifiable at ukas.com).
- §3.10 — **results are informational only and do not constitute medical advice** (note this against the DPIA's stale "Vitall GPs write personalised reports" framing — see flags).

## Verified contacts

- Ben Starling, Commercial Director — `ben.starling@vitall.co.uk` (canonical; never the bare `ben@vitall.co.uk`).

## Related operational correspondence (Gmail, post-signing — file separately if needed)

- **Kit packaging / branding (2–3 Jun 2026):** Keith asked whether Vitall can dispatch in Andro Prime-supplied outer packaging with an Andro Prime welcome/instruction insert. **Ben confirmed YES (3 Jun): "If you provide the sleeves we can do so."** Relevant to the kit-packaging redesign + the white-label de-brand question.
