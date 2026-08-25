# Vitall — Laura's reply of 24 August: all nine answered, and the aperture does not match ours

**Date received:** 24 August 2026, 16:26 UTC (17:26 BST)
**From:** Laura Sutton, Head of Growth (`laura.sutton@vitall.co.uk`), cc Ben Starling
**To:** Keith Antony (keith@andro-prime.com)
**Thread:** `19e80ec01a3f40e6`, "Andro Prime - kit packaging and branding (operational)"
**Message:** `1a034986c56190cc`
**Answers:** `2026-08-23-keith-sleeve-cutter-guide-and-kitting.md`, sent 23 Aug 17:15
**Status:** **READ 2026-08-24. Not replied to.** The next move is ours, and one answer conflicts with a
figure already built into the print proofs.

Ben forwarded our 23 Aug list to her at 14:22 BST the same day with *"Hi please could you respond to the
below"*. She answered every question, both file requests and the collection-protocol question, within
about two hours.

## Score, question by question

| # | What we asked | Verdict | What she said |
|---|---|---|---|
| 1 | Is the existing die available for our sleeves, or would ours need a new tool? | ✅ **No new tool** | *"If you make the sleeves to our dimensions, there's no new die needed. This is something Mega-Pak will consult you on."* Confirms the 2026-08-23 brand finding that matching the existing die exactly is what avoids tooling cost |
| 2 | How much does the sleeve move on the box once it is on? | ✅ **It does not** | *"It doesn't really move. They fit snug/tight."* So the aperture does **not** need slackening to absorb movement, and the tolerance argument for drawing it generous is gone |
| 3 | Dimensions of the label inside the aperture | ⚠️ **Answered a different question, and it conflicts** | *"I have attached the box cutter templates. The aperture is 67mm x 118mm."* See the conflict section below |
| 4 | Do you print the sleeves, or do we supply them printed? | ✅ **We supply, via their printer** | *"We will introduce you to our trusted print partner - Mega-Pak (mega-pak.com), who you will liaise with regarding print timings + payment."* A new third-party relationship, priced and contracted by us, not by Vitall |
| 5 | Is the 500 minimum per sleeve design or across all designs? | ✅ **Per design** | *"Per sleeve design."* Confirms the assumption already carried in `02_brand/STATE.md`: each kit-specific front is its own 500 run |
| 6 | Is setup still around a month? | ✅ **Yes, with a caveat** | *"Yes - although this will largely be driven by Mega-Pak capacity and how quickly they can get the sleeves printed."* The timeline now depends on a supplier we have not met |
| 7 | Where do finished sleeves get delivered? | ✅ **Mega-Pak ships direct** | *"Mega-Pak will send them to the appropriate fulfilment centers."* We never take delivery, so no storage burden and no inbound QC step on our side |
| 8 | Has the new kitting solution gone in yet? | ✅ **Not yet** | *"Not as of yet."* |
| 9 | If it has, does it change any of the above? | ✅ **No change** | *"No - the current system remains unchanged for now. We will keep you updated and informed if this changes."* The in-house-printing upgrade stays a Phase 2 possibility, not a live variable |
| — | Is the collection protocol identical across our three test codes? | ✅ **Identical in the box** | *"The instructions in the kit are always the same. We do include additional guidance in our guidelines via API, which may change between tests."* |
| — | Collection instruction sheet with our branding | ✅ **Yes** | *"IFU and request form can be branded andro prime when we do the sleeves."* Both documents get our branding at the same time as the sleeves, so they are one workstream, not three |
| — | Lab Request Form logo spec | ✅ **SVG / vector** | *"If you could send your logo over as a SVG / vector file, that would be great."* **Owed by us.** The only thing blocking the branded IFU and request form |

## 🔴 The aperture conflict, which is the reason this file matters

Our figure and hers disagree, and ours is already in two print-ready PDFs.

| Source | Aperture | Provenance |
|---|---|---|
| **Ours** | **108.00 x 57.00 mm** | Lifted from Vitall's own `.eps` on 2026-08-22, recorded as *"exact, not measured"*. Drawn into `andro-prime-sleeves-routeB-print-proof.pdf` and the pure-white variant, verified at 107.999 x 56.999 mm by pixel sample |
| **Laura, 2026-08-24** | **67 x 118 mm** | Stated in the reply, alongside attached box cutter templates |

Read as width x height in the same orientation, hers is **10 mm larger on both axes**. Two readings, and
only one survives:

1. She answered the question asked (**label** dimensions) but called it the aperture. This fails on its
   own terms: the label would then be larger than the hole it shows through.
2. She gave the **aperture**, and our 108.00 x 57.00 is wrong by 10 mm each way.

Reading 2 is the likely one, which means the figure recorded as *exact, not measured* is out, and both
Route B print proofs are drawn to the wrong hole. **Nothing goes to Mega-Pak until this is settled.**

**The arbiter is attached to her email and has not been pulled down yet.** Five attachments on message
`1a034986c56190cc`:

- `Capillary Test Kit Artwork for Window 169x122x23mm.pdf` — box cutter template. The filename carries a
  box dimension (169 x 122 x 23 mm) that is itself a cross-check on the 179.00 x 304.00 mm trim
- `IVI_Tasso_Kit.pdf` — second cutter template
- `IMG_1725.HEIC`, `IMG_1726.HEIC`, `IMG_1727.HEIC` — photographs of an existing kit sleeve and box

**Next action: download all five into `02_brand/assets/packaging/dieline/`, measure the aperture off the
cutter template, and reconcile against `dieline/README.md`.** The `.eps` extraction method is documented
there and this is the first independent check it has ever had.

Note the provenance detail that makes the conflict worth taking seriously in both directions: the `.eps`
our figure came from was **authored by Laura Sutton herself** (InDesign, 14 Aug 2025), per
`02_brand/assets/packaging/dieline/README.md`. She is not a second-hand source on this file.

## What this changes

- **The sleeve artwork is no longer blocked on Vitall.** Every question that gated it is answered. It is
  now blocked on us: resolve the aperture, then send the logo as SVG.
- **Mega-Pak enters the critical path.** Unquoted, unmet, and setup timing is explicitly theirs to drive.
  The 500-per-design minimum is confirmed, so a Kit 1 + Kit 2 first run is 1,000 sleeves plus the
  universal inserts.
- **The 500-per-design assumption in `02_brand/STATE.md` is now verified rather than assumed**, which
  matters because it is what makes deferring Kit 3 a real saving rather than a presentational one.
- **Ben is out of this thread.** Packaging correspondence goes to Laura from here.

## Owed by us, in order

1. **Resolve the aperture** from the attached cutter template before any print file moves.
2. **Send the logo as SVG or vector**, which unblocks the branded IFU and Lab Request Form.
3. **Ask to be introduced to Mega-Pak**, and get a quote against 500 per design.
4. Confirm which of the two palettes goes to print, since that call is still open in `02_brand/STATE.md`
   and Mega-Pak cannot quote finish without it.
