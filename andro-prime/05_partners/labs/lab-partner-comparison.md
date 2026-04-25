# Lab Partner Comparison Framework

**Last updated:** 23 April 2026
**Status:** Thriva ruled out. Active comparison: Vitall (frontrunner) vs Forth Connect (benchmark).

---

## Current Status Summary

| Partner | Status |
|---|---|
| **Thriva Solutions** | Ruled out — required 200 tests/month within 3 months. Incompatible with Phase 0 launch volumes. |
| **Vitall** | Frontrunner. All commercial terms confirmed. API assessed and fit for purpose. Service agreement pending. |
| **Forth Connect** | Active comparison. Full quote received. API deep-dive call 30 April 2026 (11:00 AM) with Emily McCann + CTO Chris Baines. |

---

## Pricing

| Factor | Vitall | Forth Connect | Notes |
|---|---|---|---|
| **Kit 1 all-in** (Total T, SHBG, Free T, Albumin, FAI) — lancet | £58.50 | £55.00 | Includes kit, lab, postage both ways |
| **Kit 1 all-in** — Tasso | £88.50 | TBC (Tasso launching ~1 month) | |
| **Kit 2 all-in** (Vit D, Active B12, hs-CRP, Ferritin) — lancet | £63.00 | £76.00 | Vitall £13 cheaper on Kit 2 |
| **Kit 2 all-in** — Tasso | £93.00 | TBC | |
| **Kit 3 all-in** (Kit 1 + Kit 2 combined) — lancet | £98.00 | £131.00 (£55 + £76) | Vitall £33 cheaper on Kit 3 |
| **Kit 3 all-in** — Tasso | £128.00 | TBC | |
| **GP / doctor review** | Included via lab partner (UKAS obligation) | Included in panel price (GMC-registered GPs) | Forth: explicitly named clinical process. Vitall: sits with lab under UKAS accreditation. |
| **Branded kit sleeves** | POA (optional, not needed Phase 0) | £1.21–£2.82/unit (volume-dependent) | |
| **Volume pricing tiers** | None — flat per-kit rate | None confirmed | |

---

## Setup and Ongoing Costs

| Cost item | Vitall | Forth Connect |
|---|---|---|
| White-label platform | £0 (within standard design framework) | £4,798 one-time |
| Kit artwork & compliance | £0 | £1,725 one-time |
| Email templates | £0 | £747 (3 templates) |
| API integration | £0 | TBC — post 30 April call |
| Monthly portal/access fee | £0 | £99/month (ConnectPro) |
| iOS/Android app (optional) | N/A | £2,475 one-time + £89/month |
| **Known setup total** | **£0** | **£7,270 minimum** |

---

## Minimum Volumes

| Factor | Vitall | Forth Connect |
|---|---|---|
| Minimum monthly volume | None | None |
| Minimum spend | None | None |

---

## API and Integration

| Factor | Vitall | Forth Connect |
|---|---|---|
| API available | Yes — v2 RESTful API | Yes — upgrade in progress |
| API cost | £0 | TBC after 30 April call |
| Sandbox environment | Yes — vitallsync.com | TBC |
| Webhook notifications | Yes — 5 status events | TBC |
| Results in webhook payload | Yes — results bundled on results-available event | TBC |
| Results format | JSON, PDF (base64), HTML (base64) | TBC |
| Partner order ID reference | Yes — `partnerOrderId` field | TBC |
| Partner customer ID reference | Yes — `partnerUserId` field | TBC |
| Historical results per customer | Yes — GET /orders/{partnerUserId} | TBC |
| Authentication | OAuth 2.0 client credentials | TBC |
| Webhook security | HMAC 256 signature | TBC |
| API documentation | Available — token-gated URL | TBC |
| Full assessment | See `vitall/vitall-api-assessment.md` | See `forth/correspondence/2026-04-23-api-requirements-for-forth-cto.md` |

---

## Biomarker Availability (Capillary Postal)

| Biomarker | Vitall | Forth Connect |
|---|---|---|
| Total Testosterone | Confirmed | Confirmed |
| SHBG | Confirmed | Confirmed |
| Free Testosterone (calculated, Vermeulen) | Confirmed | Confirmed (FAI method) |
| Albumin | Confirmed — used in Vermeulen calculation | Confirmed |
| Free Androgen Index | Confirmed | Confirmed |
| Vitamin D (25-OH) | Confirmed | Confirmed |
| hs-CRP (high-sensitivity) | Confirmed | Confirmed |
| Ferritin | Confirmed | Confirmed |
| Active B12 (HoloTC) | Confirmed | Confirmed |
| Magnesium | N/A — unstable in postal transit (biological limitation) | N/A |

---

## White-Labelling

| Factor | Vitall | Forth Connect |
|---|---|---|
| Results interface branding | Vitall platform branded with AP logos/colours — £0 | Branded web app — £4,798 |
| Kit packaging branding | Branded sleeves — POA (not needed Phase 0) | £1.21–£2.82/unit |
| Vitall branding visible to customer | No — fully white-labelled in Sync Pro tier | No — white-labelled |
| Customer comms (emails/SMS) | Handled by Andro Prime platform via webhooks | Handled by Andro Prime (3 branded templates £747) |

---

## Clinical Governance

| Factor | Vitall | Forth Connect |
|---|---|---|
| Doctor review of results | Via UKAS-accredited lab partner — clinical obligation | GMC-registered GP review included in price |
| Critical result escalation | Lab's clinical obligation under UKAS accreditation | Forth CMO handles — including ambulance dispatch if needed |
| Liability | Sits with lab (Andro Prime is a third party in the chain) | Sits with Forth's clinical team |
| Andro Prime exposure | Low — lab holds clinical responsibility | Very low — Forth explicitly owns escalation |
| Documented in contract | To be confirmed in service agreement | Confirmed in Forth's commercial terms |
| Clarity of process | Less explicit — implied by UKAS obligation | More explicit — named clinical officer, documented protocol |

---

## Contract and Terms

| Factor | Vitall | Forth Connect |
|---|---|---|
| Minimum contract length | TBC — service agreement not yet reviewed | No minimum — cancel anytime |
| Exclusivity | TBC | Not required |
| Notice period | TBC | TBC |
| Data processing agreement | Required — not yet executed | Required — not yet executed |
| Transaction handler | Andro Prime (to be confirmed to Laura to unlock service agreement) | TBC |

---

## Turnaround

| Factor | Vitall | Forth Connect |
|---|---|---|
| Results turnaround | TBC | 2 working days from sample receipt |
| Kit delivery | TBC | TBC |

---

## Decision Criteria (weighted)

| Criterion | Weight | Vitall | Forth | Notes |
|---|---|---|---|---|
| Per-test cost | High | Better on Kit 2 + 3; marginally worse on Kit 1 | Better on Kit 1 only | Vitall wins at volume mix |
| API capability | High | Confirmed fit for purpose | Upgrade in progress — risk TBC | Vitall confirmed; Forth unknown until 30 April |
| Setup cost | High | £0 | £7,270+ | Vitall wins clearly |
| Minimum volume flexibility | High | None | None | Draw |
| Clinical governance clarity | Medium | Less explicit | More explicit | Forth has edge on documentation |
| Ongoing cost | Medium | £0 | £99/month | Vitall wins |
| Biomarker availability | Medium | All confirmed | All confirmed | Draw |
| Contract flexibility | Medium | TBC | Cancel-anytime confirmed | Forth has edge pending Vitall service agreement |
| Turnaround | Medium | TBC | 2 working days | Forth confirmed; Vitall TBC |

---

## Current Assessment

**Vitall is the frontrunner** on cost (both per-kit and total cost of ownership), API capability, and commercial simplicity. The only areas where Forth has a confirmed advantage are clinical governance explicitness and the cancel-anytime contract term.

The 30 April Forth API call may reveal whether Forth's API upgrade risk is a blocker. If Forth's API is not ready or has significant additional cost, Vitall becomes the clear choice.

**Decision target:** as soon as possible after the 30 April Forth call.

---

## See Also

- `vitall/correspondence/2026-04-22-vitall-quote.md` — confirmed per-kit pricing
- `vitall/correspondence/2026-04-23-laura-commercial-clarification.md` — platform/API cost confirmation
- `vitall/vitall-api-assessment.md` — full technical API assessment
- `forth/correspondence/2026-04-22-forth-discovery-call-notes.md` — Forth discovery call
- `forth/correspondence/2026-04-23-api-requirements-for-forth-cto.md` — API requirements pre-read for 30 April call
- `09_website-app/docs/vitall-integration-spec.md` — developer integration spec
