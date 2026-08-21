# Vitall — disable all end-customer touchpoints (draft for Keith to send)

**Date drafted:** 21 August 2026
**To:** Ben Starling (ben.starling@vitall.co.uk)
**From:** Keith Antony (keith@andro-prime.com)
**Thread:** New email. Nothing open on this topic to reply into.
**Status:** SENT 21 Aug 2026, 14:29. **Ben replied 21 Aug 2026, 17:01** (same day, against his usual ~1 week). Reply and its consequences appended at the bottom of this file. Originally drafted as: Queued in Keith's Gmail Drafts addressed to Ben (draft `r3576165728725721974`), and a review copy emailed to keith@andro-prime.com on 21 Aug 2026 (message `1a02231ec64d8381`). Keith sends it himself.

**Design notes (per the middleman-correspondence rule, `../../../CONTEXT.md`):**

- **No compliance reasoning, at all.** Ben is a competitor as well as our lab. Telling him that his results copy breaches our claim rules, names TRT, or contradicts our classifier hands him our positioning and invites a debate about whether he agrees. The email frames it as a delivery-model preference: we deliver through our own interface, therefore every Vitall-side customer touchpoint should be off. That needs no justification and is far harder to argue with.
- **A confirm-line-by-line list, not a request to investigate.** Ben averages about a week to reply and works in short bursts, so each round trip is expensive. Every item degrades to a yes/no or a date.
- **The catch-all question is the most valuable line in the email.** Keith found the customer emails by accident. The real risk is the surfaces neither of us knows about, so the email asks Ben to enumerate anything touching the end customer that is not on the list.
- **Keith's own access is stated twice**, once in the opening and once in the list, because it is the single exception and an over-broad switch-off would cost another week to undo.
- **Evidence is cited precisely but without inference.** The guidelines block, the subdomain and the sender name are quoted as facts. No speculation about what else they imply.
- **Held back deliberately, to separate threads:** the FAI validity question (a clinical and commercial challenge that deserves its own thread and its own reply), and the firstname/surname transposition in the order payload (a mapping bug, different team, and mixing a "fix this" with a "turn this off" blunts both).
- No em dashes.

---

## Email

**Subject:** Turning off all end-customer contact from your side of our integration

---

Hi Ben,

A configuration change I need on our account, and I think it is a quick one.

We deliver results to our customers entirely through our own interface, using the API payload. Nothing on the Vitall side should reach an Andro Prime customer directly. Right now some of it does, so I would like all end-customer touchpoints switched off.

**One exception, which I want kept:** my own account access to your UI, on keith@andro-prime.com. That stays exactly as it is. This is only about what reaches our customers.

Could you confirm each of the following is off, with a date for anything that is not:

1. Automatic customer account creation on andro-prime.vitall.co.uk
2. Existing customer logins on that subdomain
3. Order confirmation emails to the customer
4. "Order received at the lab" emails to the customer
5. "Results available" emails to the customer
6. Any other transactional email to the customer, from any sender
7. Any SMS to the customer
8. The results PDF, if it is ever emailed or served to the customer directly

And one to keep ON: my own access on keith@andro-prime.com.

Three specifics so you can find them quickly:

1. **The emails are arriving from Raizel.** I have had order confirmation, order received at lab, and results available, all to the ordering address.
2. **The API payload carries a login instruction.** Under `order_status.guidelines` it returns: *"You can access your results via the login page"*, linking to `andro-prime.vitall.co.uk/login`, along with *"A user account has been created using the email address you ordered with."* If that block can be suppressed for our account, please do. If not, tell me and we will just drop it on our side.
3. **`andro-prime.vitall.co.uk` itself.** If it can be gated so only my account resolves, that is ideal. If it has to stay open, let me know and I will treat it accordingly.

Last thing, and it is the one I would most like a proper answer to: **is there anything else on your side that touches the end customer that is not on that list?** Anything automated, anything triggered by a status change, anything that uses the email address we pass in `createOrder`. I would rather have the full list from you than keep discovering them one at a time.

Happy to do this on a call if it is faster than working through the table.

Thanks,
Keith

Keith Antony
Founder, Andro Prime
keith@andro-prime.com


---

## Ben's reply, 21 August 2026, 17:01

Received same day, against his usual ~1 week turnaround.

> Hi Keith,
>
> 1. Automatic customer account creation on https://andro-prime.vitall.co.uk - this is currently not possible; if people visit that URL and buy a test then they have a user account created. However we don't publicise that URL and it's not linked anywhere, so I don't anticipate this happening.
>
> 2. Existing customer logins on that subdomain - we can't currently disable this. Current live orders are the one for Antony Keith and the test ones. So we can purge the test ones. What do you want to do with the live order?
>
> 3. Order confirmation emails to the customer - Now disabled.
>
> 4. "Order received at the lab" emails to the customer - Now disabled.
>
> 5. "Results available" emails to the customer - Now disabled.
>
> 6. Any other transactional email to the customer, from any sender - Now disabled.
>
> 7. Any SMS to the customer - only sent for nursing visits, by the nursing team, not currently configurable
>
> 8. The results PDF, if it is ever emailed or served to the customer directly - never sent anyway
>
> And one to keep ON: my own access on keith@andro-prime.com. - sure
>
> 1. The API payload carries a login instruction. - can't be suppressed, please do so
>
> 2. http://andro-prime.vitall.co.uk - can't be gated to your email at present
>
> 3. Other automations - that should all be covered, we disable our mailing list and any reminders etc when order confirmations are off. Other options only relate to if the customer contacts us directly, or we manually contact them (which we won't).
>
> Overall I have two thoughts on this:
>
> 1. Disabling user login, your subdomain and gating, etc., could be enabled pretty easily, so we will add to the dev plan.
>
> 2. We don't need the client email or phone number if we're not going to use them. Then they can't login or receive emails regardless of any oversights etc, and it is also better from a privacy perspective. Phone numbers we only need for clinic & nursing visits.
>
> We use an email as the account's unique identifier but it doesn't have to be real. i.e. I would recommend you register them as your-user-id-andro-prime@vitall.co.uk - this will then be unique and anything @vitall.co.uk on a partner account we ignore. We already use this approach for in-clinic client registrations where the user never gets their own account access.
>
> Kind regards,
> Ben
>
> Ben Starling MSc. | Commercial Director
> Healthy Human Labs Ltd, 71-75 Shelton Street, London, WC2H 9JQ

## Where each item landed

| # | Item | Outcome |
| - | ---- | ------- |
| 1 | Auto account creation on the subdomain | **Not disableable.** Mitigated only by the URL being unpublicised and unlinked. |
| 2 | Existing customer logins | **Not disableable now.** On the dev plan, no date. |
| 3 | Order confirmation emails | **Disabled.** |
| 4 | "Order received at lab" emails | **Disabled.** |
| 5 | "Results available" emails | **Disabled.** |
| 6 | Any other transactional email, any sender | **Disabled.** Mailing list and reminders go off with order confirmations. |
| 7 | SMS | Nursing visits only, by the nursing team, not configurable. **N/A to us:** we are self-collection only. |
| 8 | Results PDF to the customer | **Never sent anyway.** |
| — | Keith's own access on keith@andro-prime.com | **Kept.** |
| A | `order_status.guidelines` login instruction in the API payload | **Cannot be suppressed**; Ben asks us to drop it our side. **Already effectively done:** `guidelines` is not read or rendered anywhere in our frontend, so it never reaches a customer. Nothing to strip, but do not start rendering that field. |
| B | Gating the subdomain to Keith's account | **Not possible now.** On the dev plan. |
| C | Catch-all: anything else touching the end customer | Covered by 3 to 6. Residual is inbound only (customer contacts Vitall directly) or manual outbound, which Ben states they will not do. |

## The answer that matters: stop sending them the customer's email and phone

Ben's second closing point is a better fix than anything on our list, and it makes items 1, 2 and B moot rather than pending:

- Register each patient with a **synthetic address**, `<our-user-id>-andro-prime@vitall.co.uk`. Vitall use email only as the account's unique identifier; it does not have to be real, and they **ignore anything `@vitall.co.uk` on a partner account**. This is their existing pattern for in-clinic registrations where the client never gets account access.
- **Send no phone number.** Vitall only need one for clinic and nursing visits, which we do not use.

Why this is the right shape:

- It removes the capability rather than switching off the behaviour, so it survives a config regression, a new automation, or a Vitall release that resets a flag. Items 1 and 2 stop mattering because there is no reachable address behind the account.
- It is a **data-minimisation improvement**: we stop passing customer contact details to a processor that has no use for them. Good under GDPR and it shrinks what a Vitall-side breach would expose.
- **It is safe against our own integration.** Result matching is on `partner_order_id` (see `09_website-app/frontend/app/api/webhooks/vitall/route.ts`), never on email. The Customer.io event in the dispatch route is keyed on `user.email` from **our** database, not on what we send Vitall.

**Change required, one place:** `09_website-app/frontend/app/api/vitall/dispatch/route.ts`, in the `createOrder` patient block: replace `email: user.email` with the synthetic address built from `user.id`, and drop `phone`. The address block stays as-is; Vitall still ship the kit.

## Open, needs Keith

1. **The live order for "Antony Keith"** (his own test order; the transposed name is the separate mapping bug held back from this thread). Purge with the test orders, or leave it. Ben is waiting on this to purge the rest.
2. **Confirm the synthetic-email switch** before the code change goes in.
3. **Not asked, worth asking:** whether the accounts already created for the existing orders can be deleted rather than just left dormant, since logins cannot be disabled.
4. **Not asked, worth asking:** whether the email address ever appears on the **pre-printed kit or the Lab Request Form**. Ben confirmed 2026-06-03 that Vitall pre-print the kit with the patient details at packing (`../vitall-negotiation-log.md`), so if that print includes the email, a customer would receive a kit showing `<uuid>-andro-prime@vitall.co.uk`. Name, DOB, sex and address all stay real, so this is the only cosmetic risk in the switch.

## Why the synthetic email does not break fulfilment (checked 2026-08-21)

The question is whether email is load-bearing anywhere in the physical loop. It is not:

- **Kit-to-order linkage is not the email.** Ben confirmed 2026-06-03: we create the order via API, **Vitall pre-print the kit with the patient details**, and the **customer never registers a kit on a Vitall page**. Recorded in `../vitall-negotiation-log.md`. The bind happens at packing, against the Vitall order, which already carries our `partnerOrderId` and `partnerUserId`.
- **Vitall ship direct to the customer**, not to us. COGS is "kit + lab + postage both ways" (`../CONTEXT.md`) and Ben described individual fulfilment per client (`2026-07-14-keith-sample-kits-process-test.md`). The kit never passes through Andro Prime.
- **Results come back on `partner_order_id` and `partner_user_id`**, both of which we set. See `VitallWebhookPayload` in `09_website-app/frontend/lib/vitall/types.ts`.
- **No code path looks a customer up by email at Vitall.** `lib/vitall/client.ts` exposes only `createOrder` and `getAvailableTests`. Historical-results retrieval accepts `partnerUserId` as well as email (`../vitall-api-assessment.md`).

**It also closes a latent failure we have not hit yet.** Per `../vitall-api-assessment.md`: if the email we send is already registered **under a different partner account**, `createOrder` returns 400 and the patient cannot be claimed. Vitall are a direct DTC competitor with their own customers and other partners, so any customer who has ever tested with Vitall or another Vitall partner is a live 400 waiting to happen on dispatch. Per-user synthetic addresses remove that class of failure entirely.
