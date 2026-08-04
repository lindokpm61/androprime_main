# Vitall — analytes close-out (draft for Keith to send)

**Date drafted:** 4 August 2026
**To:** Ben Starling (ben.starling@vitall.co.uk)
**From:** Keith Antony (keith@andro-prime.com)
**Thread:** Re: Confirmation of analytes returned per test code (Schedule 1 panels) — Gmail `19f70d67aa19b5f5`. **Send as a reply in that thread**, do not start a new one.
**Status:** DRAFT, not sent.

**Design notes (per the middleman-correspondence rule, `05_partners/CONTEXT.md`):**

- One table plus one question. Every cell is answerable in a word or a number.
- Units are **pre-filled from what Ben has already confirmed** (30 Apr, 20 Jul, 21 Jul), so the ask degrades from "compile a table" to "glance and confirm". That is the single biggest lever on a contact who works ~4 hours then goes quiet.
- The reference-range column is the only genuinely new ask. Asking for all nine rows is *less* work for him than asking him to pick the four we need.
- FAI is a table row, not a separate question.
- **Nothing strategic.** No marker-count or Schedule 1 argument, no results-engine or banding logic, no retail pricing, no roadmap. The catalogue point is framed as an operational either/or, not a conformance complaint, because either answer unblocks us equally.
- Timeline pressure kept vague. The artefact nudge is explicitly no-rush so it cannot stall the table.
- **The six sample orders are deliberately omitted** pending Keith's £439 call. Optional paste-in line at the foot.

---

## Email

**Subject:** Re: Confirmation of analytes returned per test code (Schedule 1 panels)

---

Hi Ben,

One table and one question and I think this is closed out.

**1. Per-code analytes.** Below is what we currently have, using the units you have already confirmed. Could you fill the two right-hand columns? If a row is right as written, "yes" is all I need, and just correct anything that is wrong.

| Marker | Codes | Unit | Returned? | Male reference range |
|---|---|---|---|---|
| Total Testosterone | hormone-check, combo | nmol/L | | |
| SHBG | hormone-check, combo | nmol/L | | |
| Albumin | hormone-check, combo | g/L | | |
| Free Testosterone (calculated) | hormone-check, combo | nmol/L? | | |
| Free Androgen Index | hormone-check, combo | ratio | returned, or do we calculate it? | n/a |
| Vitamin D (25-OH) | energy-metabolism, combo | nmol/L | | |
| Active B12 | energy-metabolism, combo | pmol/L | | |
| CRP | energy-metabolism, combo | mg/L | | |
| Ferritin | energy-metabolism, combo | µg/L | | |

The reference-range column is the one I am really after. Where your analyser has its own interval we would rather apply that than a generic one.

**2. The catalogue.** Ferritin and Albumin still are not coming back in `GET /tests` for the relevant codes. You mentioned on 20 July that this is probably because they sit as separate biomarkers rather than as test panels. Is that something you are changing your end, or should we read those two from the results payload and not rely on the catalogue for them? Either is fine, I just need to know which way to build it.

That is everything on the analytes side.

Separately, and no rush at all: three bits of paperwork from our July catch-up are still to come. The insurance certificate (clause 9.11), the written per-lab UKAS ISO 15189 confirmation, and the per-kit collection-protocol confirmation. Whenever is convenient.

Thanks,
Keith

Keith Antony
Founder, Andro Prime
keith@andro-prime.com

---

## Optional paste-in, only if Keith has decided to proceed with the six sample kits

> Also, understood on the sample kits being chargeable. I will get the six orders registered via the API shortly.

**Why it is not in the body:** Ben declined to comp them (21 Jul), so the six kits cost ~£439 at Schedule 1 cost prices (2 x £58.50 + 2 x £63.00 + 2 x £98.00). That is Keith's spend decision and it is still open. Do not commit to it in writing until he has made it. Ben is not blocked on anything else by its absence.

---

## What this email deliberately does NOT ask

Recorded so nobody re-adds them on a later pass:

| Not asked | Why |
|---|---|
| Is the CRP assay high-sensitivity? | **Answered 2026-04-30**: "your profile includes hsCRP", in reply to an explicit hs-CRP-vs-standard question. See `2026-04-30-ben-service-agreement-thread.md` §Email 3 |
| Kit shelf life | **Decided against 2026-07-22** (ClickUp `869e74vwz`). The second kit is freshly ordered at trigger time, never held, so shelf life is moot |
| Order-time vs dispatch-time separation | **Resolved by design 2026-07-22.** Corroborated by Schedule 1 §1.3 / §4.4 (priced per completed order) and Ben's "chargeable once analysed" |
| Are Ferritin / Albumin included in the panels at all? | **Schedule 1 §5 names both.** Settled by the signed agreement; only the catalogue behaviour is in question |
| Whether staggered singleton orders are acceptable | **Satisfied by Ben's 2026-07-21 email**: "register the six orders via API or dashboard and we will fulfil from there" |
| Anything about the 9-vs-8 marker count in Schedule 1 | Internal question for Keith and Ewa about a marketing claim, not a Vitall question. The FAI table row gives us the only fact we need from him |

## After the reply lands

1. File the reply in this directory, dated.
2. Feed the reference ranges into `04_products/results-engine/thresholds.md` (the SHBG generic 17–55 fallback, the Active B12 NG239 range, and the albumin range behind `<35`) and clear the warning box added there 2026-08-04. **Ewa ratifies any band change**, we only supply the assay interval.
3. Update the assay-provenance table at the head of `thresholds.md`.
4. Close the outstanding items in `vitall-negotiation-log.md` as each artefact arrives.
