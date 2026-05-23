# Partner-Activation Broadcast: Phase 0a kit-only window (2026-05-23)

**Status:** DRAFT. Awaiting Keith approval + Ewa sight.
**Channel:** Andro Prime to Partners (isolated Customer.io partner space, see `partner-activation-comms.md` §1).
**Audience:** all confirmed partners (PT + influencer) with `partner_status` in {`active`, `dormant`}. Offboarded partners are globally suppressed as standard.
**Sending identity:** keith@andro-prime.com.
**Send type:** one-off manual broadcast. Not wired into the activation sequence.
**Pairs with:** `phase0a-supplements-deferred-addendum-2026-05-23.md` (canonical document referenced in the email body).

---

## Subject

A quick note on commissions during the kit-only window

## Preview

Kit commissions live as agreed. Supplement bonus activates when supplements ship.

---

## Body

Hi {{ customer.first_name }},

Short one, because there is one thing I want you to hear from me directly rather than spot in a payout statement.

We are launching kits first. The supplement side is right behind it, but I am not going to put a date on it in writing until our manufacturing partner is locked. Best estimate is 2 to 3 months from launch.

What that means for you, in plain English:

1. **Your kit commissions are unchanged.** £15 per kit, 10% off for your client or audience, £10 Kit 3 upsell, the PT tiers and graduation bonuses (PT only), the quarterly and annual contests, the flagship content payments. Everything in your v2.3 brief operates exactly as agreed.
2. **The £10 supplement-conversion bonus does not pay during this window** because there is no supplement to subscribe to yet. The clause is dormant, not changed.
3. **It activates automatically when supplements ship.** Same £10, same 60-day window from kit purchase, same rules in your brief. Nothing for you to re-sign or reconfirm. If a customer of yours bought a kit during the kit-only window and then subscribes within 60 days of that kit purchase, the bonus pays in full on your next monthly payout.
4. **Waitlist opt-ins from your traffic do not pay commission.** They never did and they will not start to. The waitlist is an email opt-in, not a sale.

That is the whole change. Nothing else moves.

The canonical document is the **Phase 0a Supplements-Deferred Addendum** (dated 2026-05-23) and it sits with the rest of your partner materials. If a client asks, that is the answer. If a payout statement reads differently to your expectation in the next two or three months, that is also the answer. If neither of those matches what you are seeing, reply and I will sort it personally.

When the supplement side goes live, you will get one more email from me on this thread confirming the date and the bonus activating from that point. Until then, the focus is kits.

Thanks for being in this with me.

Keith
Andro Prime

---

## Operational notes (not for partner-facing send)

- **Pre-flight:** run `compliance-preflight` on this file before send. Required.
- **Sign-off:** Keith approval + Ewa sight. Solicitor not required (no money clause changed; addendum sits outside CA-001 / CA-002).
- **Content-approval log entry:** required, under a new CA reference, before send.
- **Send mechanics:** broadcast from the isolated partner space, sending identity `keith@andro-prime.com`, plain-text-feel HTML. Suppression: `partner_status = offboarded` globally suppressed (standard).
- **Stop-goal:** none. One-off broadcast.
- **Follow-up:** the §4 commitment ("you will get one more email from me on this thread confirming the date") is honoured at Phase 0b launch via a separate broadcast.
- **No personalisation beyond `customer.first_name`.** Liquid use limited to first name to keep this safe for both PT and influencer cohorts in a single send.
- **No links in the body.** The addendum sits in the partner materials they already access; adding a link risks deliverability hits on a broadcast. If asked, reply with the document name.
- **No em-dash.** Verified manually before send.
- **No supplement health claims.** Verified.
- **No specific supplement launch date.** Verified (only "2 to 3 months" estimate and "when supplements ship" / "Phase 0b" framing).

---

*Compiled: 2026-05-23*
*Owner: Keith Antony*
*Version: 1 (DRAFT)*
*Status: DRAFT to awaiting Keith approval + Ewa sight*
*Companion to: phase0a-supplements-deferred-addendum-2026-05-23.md*
