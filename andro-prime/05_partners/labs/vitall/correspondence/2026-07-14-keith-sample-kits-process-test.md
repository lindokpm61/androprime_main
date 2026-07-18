# Vitall — Sample kit request for end-to-end process test

**Date drafted:** 14 July 2026
**To:** Ben Starling (ben.starling@vitall.co.uk)
**From:** Keith Antony (keith@andro-prime.com)
**Status:** Sent. Ben replied 14 Jul; reply drafted (Gmail draft, awaiting review/send). See thread log below.

---

**Subject:** Sample kits for end-to-end process test

---

Hi Ben,

Before we go live I want to run the full process through myself end-to-end: register a kit, take the sample, send it in, get the results back, and check how they render in our app.

Could you send me sample kits for a test run? Two of each of our three kits, so six in total:

- Kit 1: Testosterone Health Check (2)
- Kit 2: Men's Energy & Recovery Check (2)
- Kit 3: Men's Hormone & Recovery Check (2)

Two of each lets me test a couple of runs per kit and check the results come through consistently.

Please send them to: 1 Ballards Rise, South Croydon, CR2 7JT.

Let me know if you need anything from our side to get these out.

Thanks,
Keith

Keith Antony
Founder, Andro Prime
keith@andro-prime.com

---

*Internal note: purpose is to validate the full pipeline end-to-end (kit registration, sample-in, lab result, webhook, results rendering in the app) before launch. Six kits = 2x each of Kit 1 / Kit 2 / Kit 3.*

---

## Thread log

### Ben Starling → Keith (14 Jul 2026)

> Hi Keith,
>
> Sure we can send these to you to register and return, etc. I'm just wondering: usually, we manage individual kit fulfilment and would do so for you clients. So we could test it like that instead, you register the details, we dispatch individually, and then you return samples etc, so you'll get the exact patient journey.
>
> Please let me know what you'd prefer,
>
> Kind regards,
> Ben

**Read:** Ben is offering the real client-fulfilment path (Keith registers → Vitall dispatches individually → Keith returns samples) instead of a bulk ship of 6 kits. This exercises the dispatch step and the integration, not just sample-in → results. Better pre-launch test.

### Keith → Ben (reply drafted 14 Jul 2026 — Gmail draft, not yet sent)

**Subject:** Re: Sample kits for end-to-end process test

Hi Ben,

Good point, let's do it your way and run the full client journey. That way I also test the dispatch step and the integration, which is exactly what I want to see before we go live.

Same quantities: two of each kit, six in total (Kit 1, Kit 2, Kit 3), dispatched to 1 Ballards Rise, South Croydon, CR2 7JT.

Two things so I set this up right:

1. How do you want the registrations to reach you? I can place them as normal orders on our side so they flow through to you via the usual integration, or you can set them up your end. Happy either way, but placing them through our system would test the full pipeline.
2. Can these run as comped samples rather than charged?

Thanks,
Keith

**Open with Ben (his reply will resolve):**
- Registration route: place as real orders through our checkout/integration vs Vitall sets up their end.
- Comped vs charged for the 6 sample kits.
