# Vitall — Service Agreement Thread (Ben Starling)
**Started:** 30 April 2026
**Contact:** Ben Starling, Commercial Director — ben@vitall.co.uk / ben.starling@vitall.co.uk
**Subject:** Handover from Laura, transaction model confirmation, service agreement, sandbox/live credentials, kit shortCodes, assay confirmations

---

## Email 1 — Keith → Laura (30 Apr, 10:01)

Confirming Andro Prime handles the transaction end-to-end (Sync Pro model). Vitall operates invisibly in the fulfilment chain. Asked Laura to send the service agreement and to resolve in parallel:

- **Sandbox credentials** — to test the API integration we've already built to spec
- **Kit shortCodes** — needed for our custom panels once the account is active (`GET /tests → your_tests`)
- **Assay confirmations in writing:**
  (a) Albumin used in the Vermeulen Free Testosterone calculation (not assumed constant)
  (b) hs-CRP, not standard CRP
  (c) Active B12 is HoloTC, not total B12

---

## Email 2 — Keith forwarded thread to Ben (30 Apr, 13:25)

Forwarded the Laura email to Ben so he had context.

---

## Email 3 — Ben → Keith + Laura (30 Apr, 16:33)

Ben's response, verbatim:

> Hi Keith,
>
> Thanks for the details. Regarding this piece: "Vitall operates invisibly in the fulfilment chain." — I strongly advise you setup webhooks so we can send you order confirmations, and status updates as the order progresses. These include a lot of detail to help pre-empt customer enquiries about the process.
>
> 1. Service agreement — please can you send me registered company name, address, and number and will forward ASAP.
> 2. Regarding short codes and API credentials, leave that with me and will get this setup. Given you are close to launch we sometimes just do this on the live server and don't fulfil any orders placed.
> 3. Regarding the assays;
>    a) albumin is measured and used in the calculation
>    b) your profile includes hsCRP
>    c) your profile includes Active B12
>
> Kind regards,
> Ben

**Key takeaways:**

- Assay questions confirmed in writing — all three exactly as we needed.
- Ben proposed setting up credentials on the live server (no sandbox), with a "don't fulfil orders" agreement during testing.
- Ben asked for company details to send the service agreement.

---

## Email 4 — Keith → Ben (1 May, 11:08)

Replied with:

- Webhook clarification: integration already handles all five status events (`order-placed`, `kit-sent`, `sample-received`, `tests-analysis`, `results-available`). "Invisibly" was about customer-facing branding only, not the technical layer.
- Company details for the agreement:
  - Andro Prime Ltd
  - Company number: 17185839
  - Registered address: 128 City Road, London, EC1V 2NX
- Agreed to live credentials on Ben's standard approach. We won't take orders until tested end-to-end, so no risk of premature live orders.

---

## Status as of 7 May 2026

**Outstanding from Ben (6 calendar days / ~4 working days since 1 May reply):**

1. Service agreement — not yet received
2. API credentials (live) — not yet received
3. Kit shortCodes — not yet received

**Confirmed / closed:**

- Transaction model: Andro Prime handles, Vitall fulfils (Sync Pro)
- Webhooks: our side built and ready
- Assay specs: all three confirmed in writing
- Company details for agreement: provided

---

## Email 5 — Keith → Ben (chase, 7 May)

Drafted to send today:

> **Subject:** Re: Vitall Contact: Partner Enquiry from Keith Lindo
>
> Hi Ben,
>
> Just chasing this up — wanted to check my reply on Friday came through OK.
>
> Three things still outstanding from your end:
>
> 1. Service agreement — company details sent on Friday. Happy to review and sign as soon as it lands.
> 2. API credentials — live credentials per your standard approach, as agreed (we'll hold off taking real orders during testing). Just need them to start integration testing.
> 3. Kit shortCodes — needed to finalise our custom panel specs (Total T, SHBG, Albumin, Free T calc, FAI, hs-CRP, Active B12, Ferritin, Vitamin D).
>
> We're holding final integration QA until those three pieces are in, so any rough timing on your side would help us plan launch.
>
> Thanks,
> Keith

---

## Next steps

- Send chase email today (7 May).
- If no reply by ~12 May, escalate via phone (Ben's mobile: +44 (0) 771 208 9495).
- Once service agreement arrives → solicitor review → sign → unlocks live API access.
- Once API credentials arrive → run integration smoke tests against live endpoint with Ben's "don't fulfil" agreement in place.
- Once shortCodes arrive → update placeholders in `app/api/vitall/dispatch/route.ts`.
