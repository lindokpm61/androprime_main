# Template — Comment-to-DM Keyword Map (ManyChat)

The keyword-to-destination map for Instagram comment-to-DM automation (ManyChat, or a similar Meta-approved partner). A user comments a keyword under a post; the tool auto-sends them a DM with a link. This is the conversion mechanism for Instagram short-form. It sits alongside the bio link, it does not replace the `kitCTA` routing config (the DM destination is the same router / test-selector).

**Platform scope:** Instagram (primary). ManyChat also supports Facebook Messenger, but on the **Facebook feed** "comment X to get the link" reads as engagement-bait, which Meta demotes, so on Facebook keep the native in-post link instead of a comment trigger.

**Compliance:** the DM message is customer-facing copy. It runs `sops/sop-compliance-route.md` like any other asset. Keywords may only map to **live-kit** feelings. Destinations are the test-selector / quiz / kit / email rung, **never** the founding-member list or "priority access to TRT." **ManyChat is a data sub-processor**: before this goes live it must be added to the `03_compliance` sub-processor schedule, `data-controller-position.md`, and the privacy policy (see `sop-comment-to-dm.md`).

---

## Rules for the map

- **Keyword → feeling → live-kit destination.** Every trigger maps to a feeling that maps to a currently-available kit marker (T; Vit D / B12 / ferritin / hs-CRP).
- **Do not trigger on** andropause / male-menopause / libido / testosterone-booster keywords (Pillar E, Ewa-gated) or cortisol / thyroid / metabolic keywords (kits not live). If those feelings are the hook, route to **email capture**, not a kit.
- **The DM delivers a link only.** Do not collect health data in the DM (Art 9 health consent is captured at checkout, not in a DM). Any email capture in-DM is standard marketing opt-in and must say so.
- **UTM every link** (`utm_source=instagram&utm_medium=dm`).

---

## Proposed keyword map (confirm / adjust at kickoff)

| Comment keyword(s) | Feeling / pillar | Destination (live) | Redirect when live |
|---|---|---|---|
| tired, always tired, no energy, exhausted | Fatigue (B) | test-selector (Kit 2 lean) | + Kit 5 thyroid |
| brain fog, foggy, can't focus | Brain fog (K/B) | test-selector (Kit 2, B12) | + Kit 5 |
| recovery, aching, sore | Inflammation (G) | test-selector (Kit 2, hs-CRP) | Kit 3 Plus |
| vitamin d, winter, flat | Vitamin D (A) | test-selector (Kit 2 / Daily Stack) | — |
| normal, results, test, number | Normal-range (C) | test-selector (Kit 1) | — |
| belly, middle, weight | Metabolic (no live kit) | **email capture** | Kit 3 Plus |

---

## DM message template (pre-flight-clean)

Keep it feeling-first, plain, hedged, no claims, no em dashes. Example for the "tired" trigger:

> Thanks for the comment. Here's the plain-English rundown on why you might be running flat, and the four markers behind it: [test-selector link]
>
> It's education, not medical advice. If a number looks off, that's a chat with your GP, not a supplement order.
>
> Find out what your blood says.

**Fill-in:**
- Trigger keyword(s): ______
- Feeling opener (no claim): ______
- Link (UTM-tagged, router / test-selector, never FM): ______
- Disclaimer: "Education, not medical advice." + GP hedge.
- Optional email opt-in line (standard marketing consent, stated): ______

*Why the example passes: feeling-first; no diagnose/treat/cure; no supplement-causation; GP hedge; routes to test-selector not FM; no em dash. Still runs the full compliance route before it goes live.*
