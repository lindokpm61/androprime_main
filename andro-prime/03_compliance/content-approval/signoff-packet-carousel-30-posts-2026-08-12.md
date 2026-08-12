# Sign-off packet: the 30 Instagram carousel posts

**Prepared 2026-08-12. Day 1 posts 2026-08-17 12:00 UTC, so this needs ruling inside five days.**

**What this is.** The 30-day run on `keith.antony.ai` is 10 topics x 3 closes. CA-031 approved the
three close templates plus one mapping. CA-032 approved the ten cover headline rows. **Neither covers
the posts**, and nothing ships without sign-off on the posts themselves.

**What this is NOT.** This is not a list of rule breaches. The per-post pre-flight found the copy
clean on every mechanical check (below). What is left is mostly a different shape of problem: **two of
our own sources saying different things**, where the copy is faithful to one of them. That is a
source-of-truth question, not a claims question, and it splits by who owns the source.

**Reading order.** Ewa's items are E1 to E3 and are the only ones that need a clinician. Keith's are
K1 to K4. Each item states the question, the two conflicting sources with file and line, what the
reader actually experiences, and the options. Rule by writing a decision under each.

---

## FOR EWA — clinical and claims

### E1 · The CRP bands on the slide contradict our own results engine

**Affects days 4, 14 and 24 (all three `crp-blood-test` posts).**

| Source | Says |
| --- | --- |
| Slide 3, item 02 | "1.0 to 3.0 is average", correctly attributed to the AHA/CDC strata |
| `frontend/lib/results/classifier.ts:310` | `if (value > 1) return 'elevated-crp'` |
| `04_products/kits/kit-2-energy-recovery-check.md` §3 | at or below 1 is normal, above 1 up to 3 is **elevated** |

**What the reader experiences.** A man reads "1.0 to 3.0 is average" on the slide, buys the kit on
slide 8, returns a 2.0, and his report calls it elevated. Both statements are defensible in isolation:
the slide is a faithful compression of the published article, and the classifier follows the kit spec.
Together they tell one buyer two different things about the same number.

**Note:** slide 3 item 04, "Over 10 is your GP that week", **does** match the classifier's `>10`
GP-referral band. Only the middle band disagrees.

**Options.**
1. Change the slide to our band (above 1 is elevated), losing the AHA/CDC attribution.
2. Keep the slide and accept the buyer sees two framings, with wording added to reconcile them.
3. Change the classifier to the AHA/CDC strata. **Widest blast radius: it moves a live threshold and
   the Customer.io routing that keys off it, so it is a decision-sweep, not an edit.**

**Ruling:**

---

### E2 · The post says FAI is not his usable number; the kit it sells advertises FAI

**Affects day 17 directly, and days 7 and 27 carry the same topic.**

| Source | Says |
| --- | --- |
| Slide 5 (day 17) | "UK labs don't report FAI for men." and "If you already have an FAI on a report, read it as a rough signal, not as your usable number." |
| Your 2026-07-30 ruling | UK labs report calculated free testosterone for men, and FAI for women |
| `app/lp/testosterone/page.tsx:23` (live) | "Tests Total T, SHBG, Free Androgen Index (FAI), Albumin, and Free T" |
| `04_products/kits/kit-1-testosterone-health-check.md` §3 and line 72 | lists FAI; line 72 is already recorded in the repo as contradicting `thresholds.md` on this exact point |

**What the reader experiences.** Slide 5 tells him FAI is not the number he should use. Slide 8 sells
him, at £99, the kit whose live page headlines FAI as one of five markers.

**The slide is very probably the correct one.** It follows your own ruling. Which means the likely
defect is on the **product side**, not in this copy, and fixing it is K1. Your ruling here decides
whether that is right.

**Options.**
1. Slide 5 is correct; the Kit 1 page and kit-1 §3 should stop presenting FAI as a headline marker
   for men. (Then K1 follows.)
2. Slide 5 overstates it; soften the slide and leave the product pages alone.
3. Both stand, with the kit page explaining what FAI is and is not for men.

**Ruling:**

---

### E3 · Five covers assert with no hedge, and the cover is the whole tile

**Affects days 1, 4, 10, 13 and 25.**

On five of the ten topics, the cover line matches a source sentence that carries a qualifier the cover
drops, with **nothing on that slide hedging it**. A cover has no body copy by design (`build.js`
renders eyebrow plus two headline lines only), so the hedge arrives on slide 2, which a profile-grid
viewer never opens.

This is the one thing a deck-level pass structurally could not see: it only appears when the cover is
read as a standalone tile, which is exactly how the Instagram grid presents it. **CA-032 approved
these rows and this is not a request to reopen them**, only to rule whether an unhedged assertion is
acceptable when the hedge is one swipe away and most viewers never swipe.

**Ruling:**

---

## FOR KEITH — business and product

### K1 · Should the Kit 1 page stop advertising FAI? (follows E2)

If Ewa rules that slide 5 is correct, `app/lp/testosterone/page.tsx:23` and `kit-1` §3 both present a
marker to men that our own position says is not their usable number. That is live product copy on a
page the carousel sends buyers to. Note the repo already records kit-1 line 72 as contradicting
`thresholds.md` here, so this predates the carousel.

**Ruling (Keith, 2026-08-12): yes, Kit 1 should stop advertising FAI.**

⏸️ **HELD, not actioned, because a fact surfaced after the ruling that changes what it means.**

**We deliver FAI.** `05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md:26`: *"FAI is
returned by Vitall, we do not calculate it"*, reference range 35.0 to 92.6%. It is also priced into
the Kit 1 all-in lab cost (`lab-partner-comparison.md:22`). So stripping it is not correcting a false
claim; it is **choosing to stop advertising a marker the customer still receives in his report**, in
16 places across two live pages including JSON-LD FAQ answers and OG descriptions.

The narrower reading is that the conflict is the **framing**, not the presence. `kit-1` line 72 sells
FAI as giving *"clinical picture beyond Total T alone"*, and that is the line already recorded as
contradicting `thresholds.md`. Demoting FAI and fixing that sentence may resolve E2 without removing
a delivered marker from the product description.

**Three ways to close it, for Keith with E2:** strip FAI from the advertised list entirely; keep it,
demote it below free T and fix the "beyond Total T" framing; or wait for Ewa, since E2 governs what
FAI means for men and this follows from it.

---

### K2 · Close C is not the ask-free control the run design assumes

`slide-8-closes.md:41` describes close C as "a two-step A: the article's own CTA routes to the quiz.
Score it on clicks that reach the quiz, not on raw article clicks." The destinations do not do that.

- **Eight of ten** articles carry an `InlineKitCTA` routing to a **kit page**, not the quiz
  (`has_kit_cta = true` in the live `blog_articles` rows).
- **`free-androgen-index` and `how-to-read-blood-test-results` carry no CTA at all**, confirmed in the
  MDX and live; `app/(marketing)/blog/[slug]/page.tsx` adds no page-level CTA either.

**Two consequences.** Close C is a **delayed kit offer** for eight of the ten, not a no-ask arm, so it
is not the clean control the experiment assumes. And the stated scoring rule cannot be executed as
written, because no quiz click exists on that path. This is a finding against the approval record's
rationale, not a request to change slide copy. **The run tests one variable, the close, so a control
arm that is not a control weakens the only result the 30 days buy.**

**Plainer version, asked for 2026-08-12.** The 30 days buy exactly one comparison: which close makes
people click. A is the quiz, B is the kit and price, C was meant to be the soft one. But close C is
three different experiences at once: a delayed kit offer on eight posts, a dead end on two, and the
intended no-ask arm on none. When C underperforms B you will not be able to say whether a softer ask
converts worse, or whether a fifth of the arm simply had nowhere to go.

**Cheapest fix:** add a CTA to `free-androgen-index` and `how-to-read-blood-test-results` so all ten
behave alike. Then C is at least one consistent thing, even if it is not the no-ask arm the record
describes.

**Ruling: OPEN.**

---

### K3 · The cover photograph is a synthetic man who is not Keith, and nothing marks it as an illustration

The account is a founder account whose stated premise is that the founder is the product feature. The
cover is a synthetic photograph of a man holding a newspaper mastheaded ANDRO PRIME. Nothing on the
slide marks it as an illustration, and this now recurs on **every** video cover, since all ten frames
are minted.

Whether that reads as a customer, an endorser, or an illustration is a judgement call, and it is the
kind that is cheap to settle now and expensive after 30 posts.

**Ruling (Keith, 2026-08-12): CLEARED. The AI likeness is fine on this account.**

The finding assumed the wrong account. **`keith.antony.ai` is not the main Andro Prime Instagram**; it
is a carousel-only channel, and the man in the frame is a **motif**, not a claim that this is the
founder. Keith intends to replace it with himself as the run develops. No disclosure marker is
required and no change is needed on any of the ten covers.

**Correction to record with it:** the pre-flight reasoned from "a founder account whose premise is
that the founder is the product feature". That premise is true of the main account, not this one. Any
future finding about likeness, endorsement or grid coherence on `keith.antony.ai` should start from
the carousel-only framing, or it will re-raise this and be wrong again.

---

### K4 · Day 17's cover and its close name different markers

The cover is "THE NUMBER GPS OFTEN MISS", singular (CA-032). The deck's answer to "the number" is
calculated free testosterone (slide 5 "They report a calculated free testosterone instead", slide 7
"a calculated free testosterone is the figure to ask for"). Close B names **SHBG**. A reader who takes
the cover at face value reads the close as saying SHBG is the missed number.

This is a **CA-031 mapping question** (which marker close B names for this topic), not an edit to
approved copy.

**Ruling (Keith, 2026-08-12): the cover reads "THE NUMBERS GP's OFTEN MISS". The rest is fine.**
✅ **DONE.** Amends **CA-032**, whose ten rows were approved 2026-08-11.

**Why the plural settles it.** The singular promised the reader one number, and the deck's answer to
"the number" is calculated free testosterone while close B names SHBG. Plural removes the promise, so
the close is free to name any marker in the kit and the mismatch stops existing. **No change to close
B and no change to CA-031's mapping**, which is why "the rest is fine" is the whole ruling.

**The apostrophe is load-bearing, not a typo.** Headlines set in caps, so "GPs" renders as "GPS" and
reads as the satnav. "GP's" keeps it a doctor. Recorded in `covers.js` so nobody tidies it away.

**Shipped:** `covers.js` row amended, newspaper frame re-inpainted, deck re-rendered, clip
recomposited from the existing raw (no API spend). Checked as images at full resolution: newsprint,
type cover and the clip's plate all read `THE NUMBERS / GP'S OFTEN MISS`, masthead clean. The stored
string uses a typographic apostrophe so the literal-rendered type cover matches the newsprint.

---

## Already cleared — do not spend time re-checking these

Verified across all 30 assembled posts by the per-post pre-flight, 2026-08-12.

- **Disclaimer on every slide.** `build.js:69` sets it and `footerHtml()` is emitted by every slide
  template and both cover formats. Present on 8 of 8 slides on 30 of 30 posts, and confirmed visually
  on renders, not just in the HTML.
- **Regulated vocabulary.** No treat, cure, clinically proven, guarantee, TRT or prescription
  anywhere. Every appearance of the diagnosis family is a negation. Every appearance of boost language
  is a refusal of the claim.
- **Ashwagandha.** Absent from all thirty.
- **Prices.** Only £99, £119 and £179, matching `frontend/lib/pricing.ts`. No suspended V7.1 or
  transitional figure appears.
- **Kit scope / CA-025.** Every fatigue, brain fog and B12 post carries `kit: 'energy-recovery'`,
  never Kit 1. The cortisol precedent is not repeated.
- **Em dashes.** Zero across all thirty.
- **The ten scanner HARDs on close B** are one repeated finding, the price figure, which is not an
  article fact. Verified against `pricing.ts` and the live kit pages and adjudicated as false
  positives.
- **Resolved since the pass ran:** the link-in-bio destination (C1, `CAROUSEL_RUN_START` now set), the
  missing cover frames (C5, all ten minted), the font-fallback renders (C3 and RH-1, re-rendered), and
  the test-selector returning Kit 1 to a fatigue reader (KS-1, now **CA-033**, fixed and live).

## What this packet does NOT cover

- **The finished MP4 covers as they will appear.** Only the still `cover-video.png` was declared to
  the scanner. The composited clips have since been minted and each checked as an image, but they have
  not been through a compliance pass.
- **Captions and first comments.** Not written, so not scanned. **A caption can reintroduce every
  claim the slides avoid**, so it needs its own pass before posting.
- **The destination pages' own copy.** Kit pages were read for marker inventory and price only. E2 and
  K1 both turn on what those pages say.
- **Live versus mirror.** Sources were the repo MDX mirrors. Where an article is DB-served it was not
  diffed against its mirror in this pass.
