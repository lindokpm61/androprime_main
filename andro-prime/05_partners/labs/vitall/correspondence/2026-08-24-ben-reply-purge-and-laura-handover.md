# Vitall — Ben's reply of 24 August: accounts purged, three answers, kitting handed to Laura

**Date received:** 24 August 2026, 14:21 BST
**From:** Ben Starling (`ben.starling@vitall.co.uk`)
**To:** Keith Antony (keith@andro-prime.com)
**Thread:** `1a022324c79ebdd7`, "Re: Turning off all end-customer contact from your side of our integration"
**Message:** `1a033ef34e8d2f9e`
**Answers:** `2026-08-21-keith-reply-to-ben-synthetic-identifier-draft.md`, sent 21 Aug 20:14
**Status:** **READ 2026-08-24.** Nothing outstanding to Ben on this thread. The open work moved to Laura.

## What he said, verbatim

> All orders/users except your admin account are now removed.
>
> 1. the email doesn't get printed or appear anywhere
> 2. users have been removed
> 3. yes mailbag and label needs to remain unchanged please
>
> Your kitting questions I have passed to Laura to cover

## Scored against the three asks

| # | Asked | Answer | Consequence |
|---|---|---|---|
| 1 | Does the synthetic email address print on the kit or the Lab Request Form? | **No. It does not appear anywhere.** | **The synthetic `${users.id}-andro-prime@vitall.co.uk` address is safe to ship.** The failure mode we were guarding against, a customer opening a box with a long machine-generated string printed on it, does not exist. No tidier format is needed and no field has to be suppressed |
| 2 | Can the accounts already created on `andro-prime.vitall.co.uk` be deleted rather than left dormant? | **Deleted.** All orders and users removed except Keith's admin account | Closes the gap that Ben could not close in configuration. Auto account creation and existing logins on that subdomain are **still not disableable** and remain on his dev plan with no date, so the exposure returns the moment a new order is created against a real address. The synthetic address is what keeps it closed permanently |
| 3 | Must the return envelope and label stay exactly as they are, addressing and barcode included? | **Yes.** *"mailbag and label needs to remain unchanged"* | **A hard constraint on the sleeve and insert work.** The return mailbag is out of scope for branding. Whatever we design goes around it, not over it. This was first asked on 12 June and went unanswered until now |

## The handover, and what became of it

**Ben routed the packaging work to Laura Sutton and answered none of it himself.** At the moment this file was
written that left every question in `2026-08-23-keith-sleeve-cutter-guide-and-kitting.md` open.

> ⚠️ **SUPERSEDED THE SAME AFTERNOON, corrected 2026-08-25.** This section originally read *"Laura has not
> written"* and recommended waiting a few working days before chasing. **She wrote 43 minutes after this file
> was saved** (24 Aug, 17:26 BST) and answered all nine questions, both file requests and the collection
> protocol question, with five attachments. No chase was ever needed. Full scoring:
> [`2026-08-24-laura-sleeve-answers-and-aperture-conflict.md`](2026-08-24-laura-sleeve-answers-and-aperture-conflict.md).

Where the ten open items landed:

| Item as recorded here | Outcome (Laura, 24 Aug) |
|---|---|
| The cutter guide, and whether the existing die can be used | **Templates attached. No new tool needed** if we build to their dimensions |
| Sleeve movement on the box | **None.** *"They fit snug/tight"*, so no tolerance slack is needed |
| The dimensions of the label inside the aperture | ⚠️ **Answered as the aperture, at 67 x 118 mm, which CONFLICTS with our 108.00 x 57.00 mm.** The one genuinely open item |
| Whether Vitall print or we supply | **We supply**, through their print partner Mega-Pak |
| Whether the 500 minimum is per design | **Per design.** Confirms the assumption in `02_brand/STATE.md` |
| Whether setup is still about a month | **Yes**, but driven by Mega-Pak capacity |
| Where finished sleeves are delivered | **Mega-Pak ships direct to the fulfilment centres** |
| Whether the new kitting solution has gone in | **Not yet**, and nothing above changes |
| The two files | **Both can carry Andro Prime branding**, done at the same time as the sleeves. We owe a logo as SVG |
| Whether the collection protocol is identical across the three test codes | **Identical in the box.** Per-test guidance rides the API `guidelines` field |

**The blocking item is no longer the cutter guide, and it is no longer with Vitall.** It is the 10 mm aperture
discrepancy, which is ours to resolve off the attached templates before anything goes to print.

**Contact:** `laura.sutton@vitall.co.uk`, Head of Growth. Use the existing packaging thread
`19e80ec01a3f40e6`, not a new one.
