# Sign-off packet: the 30 Instagram carousel posts

**Prepared 2026-08-12. Day 1 posts 2026-08-17 12:00 UTC, so this needs ruling inside five days.**

> **STATUS 2026-08-12: all 7 ruled. Every item in this packet is closed.**
>
> **Ewa, by email the same day** (thread *"Three rulings needed on the 30 carousel posts"*, two rounds,
> both answered inside 15 minutes): **E1** keep the slide and reconcile on it, **E2** both stand as
> written, **E3** the five covers are acceptable as they are.
>
> **Keith:** K1, K3, K4 and K2 ruled 2026-08-12.
>
> **K2 is closed and it changed the run's design**, from "one arm has no ask" to **the same offer at
> three distances**: quiz now, kit now, kit after the article. Both CTA-less articles were fixed live,
> so all ten now behave alike and close C is one consistent thing.
>
> **No decision-sweep is owed.** E1 option 3 was the only ruling in the packet that would have moved a
> live threshold, and it was not taken.
>
> **Two things this packet does NOT close, both flagged below and neither of them a ruling:** the
> captions and first comments (written, scanned, with Ewa, sign-off outstanding), and the live-versus-
> mirror drift that K2 turned from a theoretical gap into a confirmed instance.

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

**Ruling (Ewa, 2026-08-12, by email): option 2. Keep the slide and reconcile on it.**
✅ **DONE.**

The threshold does not move. `classifier.ts:310` stays `value > 1`, kit-2 §3 stays, and the Customer.io
routing keyed to it is untouched. **No decision-sweep is owed**, which is the whole value of this ruling:
option 3 was the only item in the packet that would have moved a live threshold.

**Shipped.** `decks/crp-blood-test.js` slide 3 `note`, offered to her as two variants; she picked the
replacing one:

> Our own report is tighter than this table: above 1.0 comes back elevated.

It **replaces** `The framework UK private labs read against.` The AHA/CDC attribution that line carried
is still printed directly beneath it on the `source` row, so nothing is lost by the swap.

**Three things about the placement and wording, recorded because they are load-bearing:**

- **It sits on slide 3, not slide 4.** Slide 4 is the "Same number, two answers" mismatch slide and was
  the tempting home. It was rejected on E3's own logic: a qualifier one swipe from its claim is one most
  readers never reach. The reconciliation travels with the table it reconciles.
- **"above 1.0" is exact, not loose.** The engine tests `> 1`, so exactly 1.0 is **not** elevated.
  "1.0 and above" would have misstated our own threshold in customer-facing copy. If `classifier.ts:310`
  ever moves, this line moves with it, and the deck comment says so.
- **"tighter", not "more accurate".** The slide does not adjudicate between the two frameworks. The
  AHA/CDC strata keep their citation; ours is stated as the narrower one.

**Verified as an image, not as HTML**: `png/crp-blood-test/slide-03.png` re-rendered at 1080x1350. The
note sets on one line beneath item 04 and above the source row, no clipping (`.slide` is
`overflow:hidden`, so a bad fit would have been silent), no reflow of the four bands. The body slides are
shared across the three closes, so days 4, 14 and 24 all carry it.

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

**Ruling (Ewa, 2026-08-12, by email): both stand as written. Outcome maps to option 3.**
✅ **DONE, nothing to change.**

**The three options above were overtaken before she saw them.** K1's resolution established that the
engine and the carousel slide already agree, and that the defect was on the marketing page. So she was
not asked to choose from this list; she was asked the two smaller questions K1 left behind, and answered
both:

- **The `fai-reported` report wording** (`biomarker-copy.ts:310`), quoted to her in full rather than
  linked: the `Reported for reference, not interpreted` label, the explanation, and the recommendation.
  **Approved as written.** This is the wording a customer meets when FAI comes back, and it now carries
  her explicit sign-off rather than an inherited one.
- **Slide 5 of the day 17 post.** **Matches, leave as it is.** Her 2026-07-30 ruling holds and the deck
  is a faithful compression of it.

Option 1 was already dead on Keith's K1 ruling (FAI stays: the lab returns it and the customer receives
it). Option 2 is refused by this ruling. What shipped is option 3 in substance: both stand, and the Kit 1
page now explains what FAI is and is not for men, via the `Not interpreted` badge and the
`Ratio of total T to SHBG` subtitle.

**Recorded because it nearly went the other way:** the packet as first written framed E2 as a
carousel-versus-product contradiction with the carousel probably at fault. It was neither. Both were
right and the marketing page was wrong. The lesson is in K1, but the misframing started here.

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

**Ruling (Ewa, 2026-08-12, by email): acceptable as they are. The hedge on slide 2 is enough.**
✅ **DONE, no change to any cover.**

All five stand: day 1 `14 SIGNS OF LOW VITAMIN D`, day 4 `WHAT CRP ACTUALLY MEANS`, day 10
`HOW TO READ YOUR RESULTS`, day 13 `YOUR IRON STORES, EXPLAINED`, day 25 `WHY AM I ALWAYS TIRED?`.
CA-032 is not amended by this item.

**The scope of this ruling is narrow, and the narrowness is deliberate.** She was offered a third option
making it a standing rule (*acceptable for these five, but from now on every cover carries its own
qualifier*) and **did not take it**. So this clears **these five covers on this run** and sets no
precedent. A future cover that drops a qualifier is a fresh question, not a settled one, and anyone
citing this ruling to wave one through is over-reading it.

**Live tension worth keeping visible.** E1 was just decided the other way round: there, the reconciling
line was put on the same slide as the claim precisely *because* a qualifier one swipe away is one most
readers never reach. Both rulings are defensible (a cover is a headline, a bands table is a set of
numbers a buyer acts on) but they are not the same principle, and the difference is the reader's
distance from a decision. If these two ever have to be reconciled into one rule, this is the paragraph
to start from.

---

## FOR KEITH — business and product

### K1 · Should the Kit 1 page stop advertising FAI? (follows E2)

If Ewa rules that slide 5 is correct, `app/lp/testosterone/page.tsx:23` and `kit-1` §3 both present a
marker to men that our own position says is not their usable number. That is live product copy on a
page the carousel sends buyers to. Note the repo already records kit-1 line 72 as contradicting
`thresholds.md` here, so this predates the carousel.

**Ruling (Keith, 2026-08-12): yes, Kit 1 should stop advertising FAI.**

⏸️ **WAS HELD while a fact was checked. Now RESOLVED — see the K1 resolution immediately below, which
supersedes this block.** Kept because the reasoning is what produced the answer, not because it is
still open.

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

### K1 · RESOLVED (Keith, 2026-08-12): FAI stays. The defect was one badge, not sixteen deletions.

**Keith's ruling:** it is returned rather than calculated by us, the customer still receives the
value, we simply do not take it into consideration. Nothing has been manipulated and it has been
advertised, so it stays.

**That ruling is already the shipped behaviour, and it is well built.** `classifier.ts:295` maps
`Free Androgen Index` to a dedicated `fai-reported` state. Its customer-facing copy
(`biomarker-copy.ts:310`) reads **"Reported for reference, not interpreted"**, and explains: *"we do
not draw a conclusion from it. In men it is not a reliable stand-in for free testosterone... Read
your Free Testosterone result instead."* It returns no CTA (`classifier.ts:358`) and is deliberately
excluded from vetoing an all-clear (`classifier.ts:128-134`), with a comment recording that it
previously fell through to `default: 'normal'` and asserted "no action needed" on any value.

**So the engine and the carousel slide agree.** E2's apparent contradiction is not between the
carousel and the product; it is between both of them and the **marketing pages**.

**The real defect, now fixed.** The live Kit 1 landing page rendered FAI as `36.9` with a
**`Borderline`** badge, in the same visual position where Total Testosterone shows `Borderline` and
SHBG shows `Normal`. It promised a verdict on the one marker the product refuses to grade, on a value
sitting just above the lab floor of 35.0 so it reads as a near-miss finding. Two corrections:

- Badge `Borderline` → **`Not interpreted`**, styled grey and dashed so it cannot be read as a verdict
  alongside its siblings.
- Subtitle "Bioavailable testosterone ratio" → **"Ratio of total T to SHBG"**. The old wording was
  precisely the free-T stand-in framing the engine refuses for men.
- `kit-1` §3 line 72, "gives clinical picture beyond Total T alone" → the engine's own framing. That
  line was already recorded as contradicting `thresholds.md`.

**Nothing was deleted and no marker left the advertised panel**, per the ruling.

**What is left for Ewa on E2** is therefore much smaller than the packet first suggested: confirm the
`fai-reported` wording she is being asked to stand behind, and rule whether the carousel slide 5
phrasing matches it.

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

**Ruling (Keith, 2026-08-12): call C what it is. A delayed kit offer, not a no-ask arm.**
✅ **DONE, and the run is better for it.**

Add kit CTAs to the two articles that have none, correct the description in `slide-8-closes.md:41`, and
the run tests **the same offer at three distances**: quiz now (A), kit now (B), kit after the article
(C). That is a coherent experiment and arguably a more useful one than the original design, **because
all three arms now end at something we sell** and the comparison is about distance to the ask rather
than about one arm being unlike the other two.

**The finding above was itself wrong on one point, and checking live is what caught it.** It says the
two articles *"carry no CTA at all"*. They did carry closing CTAs; what they lacked was the
`InlineKitCTA` component, so their asks were plain prose. The live rows say so:

- **`free-androgen-index`** already ended on a kit ask routing to `/kits/testosterone/`. Close C was
  never a dead end here. It was a delayed kit offer that simply did not look like one.
- **`how-to-read-blood-test-results`** ended on a **test-selector** ask. That is close A's destination,
  so close C on this topic was behaving as a **delayed close A**, which is a worse confound than the
  dead end the finding described and would have been read as a C result.

There is no `has_kit_cta` column on `blog_articles`; the flag cited in the finding does not exist. The
real check is whether the body contains `InlineKitCTA`, which is what the eight compliant articles use.

**Shipped 2026-08-12, live rows updated with an audit revision (`editor = k2-close-c-kit-cta-2026-08-12`):**

- `free-androgen-index`: existing closing paragraph wrapped in
  `<InlineKitCTA ctaHref="/kits/testosterone">`, destination unchanged because it was already right.
- `how-to-read-blood-test-results`: closing selector ask replaced with a Kit 3 `InlineKitCTA`
  (`/kits/hormone-recovery`, nine markers, no price), and **the selector link moved up** into the
  "Which test should you take?" section so that route survives rather than being deleted.
- **10 of 10 now carry the component**, verified by query, and both pages **checked as rendered images**,
  not as stripped HTML: the boxed CTA and its `SEE THE KIT` button appear above References on both.

**A second thing surfaced, and the first account of it in this packet was wrong. Corrected here.**

The packet's own caveat reads: *"Live versus mirror. Sources were the repo MDX mirrors. Where an article
is DB-served it was not diffed against its mirror."* That caveat is **discharged, and it was already
being handled by tooling nobody had looked for.**

- **The git mirror is `frontend/content/blog/*.mdx`**, and `scripts/content-engine/sync-mirror.ts` keeps
  it honest: DB is the source of truth, body-only so hand-written frontmatter survives, and it writes
  only on a genuine difference. **All 19 published articles were in sync before this work started.** The
  two K2 database writes put those two files out of sync; the script put them back, and a re-run reports
  *"mirror already in sync"*.
- **This packet's own pre-flight sourced the right path** (`--source frontend/content/blog/<slug>.mdx`,
  recorded in `preflight-per-post-close-B.md:21`), so **no finding in CA-034 was scanned against stale
  copy.**

**What was genuinely stale is a different directory, and it is worth naming as a hazard.**
`06_marketing/seo-ai-search/article-drafts/free-androgen-index.mdx` still carried the **pre-K1** FAI
wording (*"measures Total testosterone, SHBG, Free testosterone, Albumin and your Free Androgen Index"*)
while live had long since been corrected to *"measures Total testosterone, SHBG, Albumin and a calculated
Free testosterone, and reports your Free Androgen Index alongside them"*. That directory is the
**drafting workspace**: nothing syncs it, it is not slug-aligned (pillar-prefixed names, a dated
`-reopt-2026-07-30` variant, two `myth-of-normal-range` copies, no `why-am-i-always-tired` at all), and
it is the first hit when searching the repo for `<slug>.mdx`. **That is exactly how the superseded
wording was picked up here**, and it would be how a future derivative picks one up too.

**Rule to carry forward: any claim-bearing derivative sources `frontend/content/blog/<slug>.mdx`, never
`article-drafts/`.**

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
