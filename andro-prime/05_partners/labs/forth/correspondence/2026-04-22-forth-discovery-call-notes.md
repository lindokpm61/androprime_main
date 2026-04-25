# Forth Connect — Discovery Call Notes
**Date:** 22 April 2026
**Attendees:** Keith (Andro Prime), Emily McCann (Account Manager, Forth Connect)
**Next meeting:** Thursday 30 April 2026, 11:00 AM — API deep-dive with Emily + CTO (Chris Baines)

---

## Business Model Shared with Forth

- Diagnostic panels used as loss leader / cost centre to drive traffic into two revenue streams: supplements and TRT clinic
- Panels build trust and create a pipeline for recurring, higher-margin services
- Target monthly test volume: 30–50 kits (based on inquiry form data)
- Plan is phased: white label Forth platform first, then transition to proprietary platform via API
- Hard internal deadline on delivery — urgency to start API/sandbox testing ASAP

---

## Service Details Confirmed in Call

- Collection methods: fingerprick, phlebotomy, and Tasso auto-draw (launching within ~1 month)
- Kits include prepaid return postage
- Lab turnaround: most results within 2 working days
- GP review included in panel price — results reviewed by Forth's medical team before or simultaneously with patient release
- Client or partner can choose: patient sees results first, or simultaneous release
- Critical result handling: managed by Forth's Chief Medical Officer. Escalation protocol includes direct ambulance call in rare cases. Critical alerts can be routed to partner organisation rather than patient if preferred

---

## Pricing Confirmed

- £99/month ConnectPro portal fee — no minimum order, no minimum spend, cancel-anytime
- GP review included in panel price (no extra charge)
- API integration cost: separate — to be confirmed after technical discussion
- Full quote (panels, white label kits, web app, email templates) sent in meeting chat — see [2026-04-22-forth-quote-analysis.md](2026-04-22-forth-quote-analysis.md)

---

## API and Technical Integration

- Forth has an API framework (order generation + results transfer) — major upgrade in progress
- Keith requires webhook notifications for key workflow events:
  - Panel dispatched
  - Sample received at lab
  - Results ready
  - Doctor's comments available
- Forth open to hybrid API + webhook approach
- Keith to prepare and send an API requirements document (data points, flags, workflow triggers) for review by Forth's CTO before the 30 April call
- CTO (Chris Baines) will join 30 April call to discuss scope, capabilities, and integration cost

---

## Commercial Terms

| Item | Detail |
|---|---|
| Monthly platform fee | £99 (no minimum order or spend) |
| Contract | Cancel anytime |
| GP review | Included in panel price |
| API cost | TBC after technical discussion |
| Payment terms | End of month invoicing, 30-day payment terms |

---

## Action Items

**Keith:**
- [ ] Review the pricing and panel documents shared in meeting
- [ ] Prepare API requirements document (webhook events, data points, workflow triggers) and send to Emily ahead of 30 April
- [ ] Email Emily any questions before the call
- [ ] Join 30 April 11:00 AM call with Emily and CTO

**Emily (Forth):**
- [x] Sent quote and white label pricing in meeting chat
- [ ] Gather API requirements from Keith and brief CTO
- [ ] Confirm 30 April 11:00 AM calendar invite (Keith added as guest)
- [ ] Send AI meeting notes to Keith
- [ ] Respond to emails from Monday (on annual leave Friday 25 April)

---

## Notes

- Emily's direct contact shared (phone number for informal queries)
- Backup contacts: Chris Baines (CTO), Sarah Bolt (CEO)
- Forth explicitly confirmed their medical team handles all critical result escalation — removes clinical liability from Andro Prime during pre-CQC phase
