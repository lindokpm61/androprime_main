# Lab Partner Rankings — Addendum
**Last updated:** 23 April 2026
**Supersedes:** Previous version (30 March 2026) and the lab partner section of `04_products/kits/kit-1-launch-guide.md`

---

## Why the Rankings Have Changed (April 2026 Update)

**Thriva Solutions has been ruled out.** Required 200 tests/month within 3 months to justify free API integration — incompatible with Phase 0 launch volumes. All COGS figures that referenced Thriva are invalid. Do not use Thriva pricing anywhere.

**Vitall has moved to #1.** Commercial terms fully confirmed. API assessed and fit for purpose. Per-kit pricing is lower than Thriva estimates on Kits 2 and 3. Setup cost is £0.

**Forth Connect has been added as #2.** Full quote received. Active comparison underway. API deep-dive call 30 April 2026.

---

## Background — Why Certain Partners Were Ruled Out Earlier

Two acquisitions created conflict-of-interest dynamics that eliminated other options:

1. **Medichecks acquired Leger Clinic** — Medichecks now operates an integrated diagnostic-to-treatment TRT pipeline. They are a direct competitor, not a viable partner.
2. **One Day Tests operates its own TRT service** (from £79/month) — same conflict-of-interest risk.

---

## Current Partner Rankings

### #1 — Vitall (vitall.co.uk)

**Status: FRONTRUNNER — commercial terms confirmed, API fit for purpose**

**Why Vitall is #1:**
- Pure diagnostics infrastructure — no clinical arm, no TRT service, no conflict
- API fully assessed: order creation, webhooks, results retrieval all confirmed. See `vitall/vitall-api-assessment.md`.
- Total setup cost: £0 (platform, API, integration — all included)
- Ongoing cost: £0 (no monthly fee)
- Per-kit pricing: £58.50 / £63.00 / £98.00 (lancet, all-in)
- No minimum volume, no minimum spend
- UKAS ISO 15189 accredited
- White-label: Andro Prime branding on platform, no Vitall branding visible to customer
- Sync Pro tier: orders via API, results via API, Vitall operates invisibly

**Contact:** Laura Sutton — laura.sutton@vitall.co.uk / +44 7871 491479

**Outstanding before signing:**
- Confirm to Laura that Andro Prime handles the transaction → triggers service agreement
- Review service agreement (minimum term, notice period, DPA)
- Three pre-build questions for developer (webhook retry policy, failed sample handling, sandbox event triggering)

---

### #2 — Forth Connect (forthconnect.io)

**Status: ACTIVE COMPARISON — full quote received, API call 30 April**

**Why Forth is worth evaluating:**
- Pure diagnostics — no treatment arm, no conflict
- GP review explicitly included in panel price (GMC-registered GPs)
- Critical result escalation owned by Forth's CMO — removes all clinical liability from Andro Prime pre-CQC
- Cancel-anytime contract term confirmed
- Results within 2 working days confirmed
- Tasso auto-draw launching within ~1 month

**Why Forth is currently #2:**
- Per-kit pricing higher than Vitall on Kit 2 (£76 vs £63) and Kit 3 (£131 vs £98)
- Setup cost: £7,270 minimum (vs £0 Vitall)
- Ongoing: £99/month portal (vs £0 Vitall)
- API upgrade in progress — cost and timeline TBC after 30 April call

**Contact:** Emily McCann — info@forthconnect.io
**Next step:** 30 April 2026, 11:00 AM — API deep-dive with Emily McCann + CTO Chris Baines

**Forth pricing (ex-VAT):**
- Panel 1 (Hormone, 5 markers): £55.00
- Panel 2 (Wellness, 4 markers): £76.00
- White-label kit printing: £1.21–£2.82/unit
- Setup: £7,270 minimum
- Ongoing: £99/month

---

### Ruled Out — Thriva Solutions (thrivasolutions.com)

**Status: RULED OUT — volume minimum incompatible with Phase 0**

Required 200 tests/month within 3 months to justify free API integration. Phase 0 launch volumes do not support this. Do not reopen without a fundamental change in volume projections.

---

### Ruled Out — Medichecks

**Status: COMPETITOR — do not engage**

Acquisition of Leger Clinic created an integrated diagnostic-to-treatment TRT pipeline. Every white-label kit sold through Medichecks feeds customer data into a system that competes directly with Andro Prime's TRT service. Not a partner under any circumstances.

---

### Benchmark Only — BloodLink / One Day Tests

**Status: CONFLICT OF INTEREST — do not sign**

One Day Tests operates its own TRT service (from £79/month). Same risk as Medichecks. Use for pricing benchmarks only. Do not enter a contract.

---

## Decision Timeline

| Action | Target date |
|---|---|
| Reply to Laura — confirm Andro Prime handles transaction | Immediately |
| Forth API deep-dive call | 30 April 2026, 11:00 AM |
| Review Vitall service agreement | Week of 28 April |
| Final partner decision | As soon as possible after 30 April Forth call |
| Service agreement signed | May 2026 |
| Sandbox integration and testing | May–June 2026 |

---

## Key Principles (unchanged)

1. **Never sign with a lab that treats patients.** The Medichecks/Leger precedent proves the risk.
2. **API access is non-negotiable.** Without API results delivery, the customer dashboard cannot function.
3. **No exclusivity clauses.** Must retain the ability to switch if partner strategy changes.
4. **Andro Prime handles the transaction.** Customers pay Andro Prime. Andro Prime pays the lab wholesale. Full margin and customer data ownership retained.

---

## See Also

- `lab-partner-comparison.md` — detailed side-by-side comparison (updated April 2026)
- `vitall/vitall-api-assessment.md` — full Vitall API technical assessment
- `vitall/correspondence/` — all Vitall correspondence
- `forth/correspondence/` — all Forth Connect correspondence
- `09_website-app/docs/vitall-integration-spec.md` — developer integration spec (Vitall)
