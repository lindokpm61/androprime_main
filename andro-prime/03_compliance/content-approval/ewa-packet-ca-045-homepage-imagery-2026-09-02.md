# Ewa packet: CA-045, the Direction F homepage imagery (2026-09-02)

> ✅ **SUPERSEDED BY EVENTS 2026-09-15. SENT 19:46 UTC, ANSWERED 20:07, CA-045 APPROVED.**
> Ewa replied `1: A 2: A 3: A 4: A 5: A 6: A 7: A` (thread `1a062879e02a792c`), Keith gave business
> sign-off the same day, and ClickUp `869eur84c` is `approved`. Record:
> `approval-record-ca-045-homepage-imagery-2026-09-15.md`.
>
> 🔴 **The two counts in the struck header below are BOTH wrong, and the second one matters.** The
> email that actually went was **nine items, SEVEN questions**, and seven letters came back, so the
> answer count was met exactly. **A reader trusting the "expected answer count is 8" line would
> conclude an answer is missing when none is.** The packet's own self-contradiction on this (eight
> versus seven) was one of the three corrections logged on 2026-09-15 before sending; the register
> row and the approval record both carry seven.

~~**Status: RAISED as a Gmail DRAFT, not sent.** Draft id `r-3136750216544571074`. Sending is
Keith's act, not the assistant's. Nothing in CA-045 is approved by the existence of this packet.~~

~~**Ten items, eight questions.** Expected answer count is **8**.~~ A reply carrying fewer than eight
letters leaves the missing ones UNANSWERED; never infer a ruling from an adjacent answer.

⚠ **AMENDED 2026-09-06, AND THE GMAIL DRAFT HAS NOT CAUGHT UP.** A new asset, `img-8`, was
generated for `/how-it-works` and is question 8 below. It is the FIRST addition to this gate that
could not avoid it: every previous one reused an image already on the register, matched by slug.
The draft was already stale on q6/q7 (their scope moved from one surface to two, and is now six);
it is now stale on the item count as well. **Rebuild the draft before sending.** This is the cheap
moment: `03_compliance/STATE.md` says corrections are free while the packet is unsent and expensive
after, and that is exactly why this went in now rather than at the end of the branch.

---

## 🔴 AMENDED AGAIN 2026-09-15, AND THIS IS THE ONE THAT CHANGES WHAT IS BEING ASKED

Three corrections, found while closing Phase 4 of the Direction F migration. **All three are free
now and expensive the moment this is sent**, which is the whole argument of the note above.

### 1. q6 and q7 govern TWENTY-SIX routes, not one, not two, and not six

Every previous count in this packet, in the register and on the board was arrived at by listing the
pages someone had **deliberately** added the hero field to. That is not how it gets onto a page.

`components/marketing/FPage.tsx` renders `<HeroField />` inside `FHero`, and its prop signature is
`ground?: 'field' | 'none'` **defaulting to `'field'`**. So the layer is opt-OUT, not opt-in: every
route that renders an `FHero` carries it unless the caller passes `ground="none"`, and exactly one
route in the codebase does (`/checkout/details`). Counted mechanically on 2026-09-15:

`/` · `/about` · `/contact` · `/faq` · `/go` · `/how-it-works` · `/how-to-sample` · `/kits` ·
`/kits/testosterone` · `/kits/energy-recovery` · `/kits/hormone-recovery` · `/lp/testosterone` ·
`/lp/energy-recovery` · `/lp/hormone-recovery` · `/lp/collagen` · `/lp/daily-stack` ·
`/membership` · `/order/confirmed` · `/privacy` · `/subscription/confirmed` ·
`/supplement-waitlist` · `/supplements` · `/supplements/collagen` · `/supplements/daily-stack` ·
`/test-selector` · `/waitlist`

**Twenty-six.** Including both legal documents, the order confirmation, and all five landing pages.

⚠ **Why every previous count was wrong, and it is not carelessness.** A shared component with a
defaulted prop distributes a decision silently: nobody adds the layer to `/privacy`, so nobody
records that `/privacy` has it, so no count built from the record can ever contain it. The register
rows are accurate about what was *done* and structurally blind to what was *inherited*. The general
rule this earns: **when asking whether a shared visual element is acceptable, count it from the
component's callers and its default, never from the list of places it was deliberately added.**

**What this changes about the question.** q6 asks whether the field reads as display or as texture,
and q7 asks about the two markers the page never shows. Neither answer changes with the count. What
changes is the **blast radius of the answer**, and one thing in it is genuinely new: the field now
renders on `/privacy` and `/terms`-adjacent surfaces and on `/order/confirmed`, which is a
post-purchase page. If the reading is ever anything other than texture, a data-derived ground on a
confirmation page is a different question from the same ground on a marketing hero. **Ewa should be
told the number before she answers, not after.**

### 2. This packet contradicts itself on how many answers to expect

The header says **eight** questions and the body carries eight numbered items, which is correct. But
the Format paragraph says *"Seven contiguous items"* and the On-reply paragraph says *"Count the
answers against the seven"*. Both are left over from before `img-8` became question 8 and are now
wrong. **The expected answer count is 8.** Corrected in both places below.

This matters more than a typo: the whole point of the numbering discipline is that a reply carrying
fewer letters than expected has an unanswered question in it, and a count that is wrong by one makes
that check pass while a question sits unanswered.

### 3. ~~There are TWO ClickUp tasks for CA-045 and both are `pending`~~ ✅ RESOLVED 2026-09-15

> **The packet was sent 2026-09-15 19:46 UTC and answered 20:07; CA-045 is APPROVED.** `869eur84c`
> is `approved` and canonical. **`869eqz4bd` is `superseded`** (Keith, "suspend the duplicate") and
> renamed to point at the live task. No approval was set on the retired one, and none was inferred
> from the other.
>
> ⚠ **Worth keeping, because the timing is the lesson.** For two weeks the duplicate was merely
> redundant and retiring it looked like housekeeping. The moment `869eur84c` went `approved` it
> became a **contradiction**: the board is the canonical answer to "is this signed off", and it was
> returning two different answers depending on which task a reader opened. **A duplicate record is
> tolerable while its copies agree and becomes a defect the instant one of them moves.** Retire
> duplicates before the state they hold starts to change.

- [`869eqz4bd`](https://app.clickup.com/t/869eqz4bd) — the older one, and the one **this packet
  names** for rulings. Its description is now materially stale: it says *"Nothing is owed yet. A
  mockup is not published"*, which stopped being true when the direction was built into the site;
  it describes a **five**-question judgement pass; and its artefact paths point at
  `design/mockups/directions/assets/f/`, the mockup, rather than `frontend/public/home/`.
- [`869eur84c`](https://app.clickup.com/t/869eur84c) — the newer one, created at wrap on 2026-09-03
  **because the board appeared to have no CA-045 task**. It did. This one describes **nine items as
  seven questions**.

So the item/question count now reads five, seven or eight depending on which of three records you
open. ⚠ **Neither task has been retired and neither should be, by anyone, without Keith deciding
which is canonical** — a duplicate that is merged from the title alone is how the surviving record
loses the half that only lived in the other. Flagged, not resolved.

| Question | Item(s) | Asset |
|---|---|---|
| 1 | hero film | `public/home/table.mp4` + `poster.jpg` |
| 2 | img-3 | Kit 3 card, hands holding a collection tube |
| 3 | img-1, img-2, img-4, img-6 | four ordinary photographs, one grouped judgement |
| 4 | img-5 | the changing room |
| 5 | img-7 | Kit 2 card, plus the trainer mark disclosed as Keith's call |
| 6 | hero data field | display or texture |
| 7 | hero data field | the hs-CRP and SHBG rows the page never shows |
| 8 | img-8 | `/how-it-works` hero, a postbox with a plain envelope |

**Attachments (11):** `q1-hero-film-frame.jpg`, `q2-img-3.jpg`, `q3-img-1.jpg`, `q3-img-2.jpg`,
`q3-img-4.jpg`, `q3-img-6.jpg`, `q4-img-5.jpg`, `q5-img-7.jpg`, `q6-hero-as-it-ships.png`,
`q6-hero-field-revealed.png`, `q8-img-8.jpg`. The last two were rendered for this packet: the hero field is a
canvas that exists only at run time, so no still of it existed anywhere. The "revealed" render has
the 0.34 opacity and the vertical mask removed and **never ships**; it exists so the question can
be answered on the artefact rather than on a description of it.

**Three corrections this packet makes to the record, all found by opening the images:**

1. **Nothing is live.** The register row says the five inherited photographs are "live as
   `public/home/img-1..5.jpg`" and `09_website-app/STATE.md` said "now LIVE on `/`". Neither is
   true: `git ls-tree -r main` returns no `frontend/public/home/` path at all, and all nine assets
   arrived in one commit on `redesign/direction-f`. Written from the register, this packet would
   have told the clinical reviewer that unapproved imagery was already published.
2. **`img-5`'s alt text describes the opposite of the photograph.** It reads "sitting on a bench
   putting on a trainer"; the image is a man hunched forward, head down, hands clasped, not moving.
   It is the strongest "this man looks unwell" image in the set, so it was pulled out of the
   grouped question and asked on its own.
3. **The photographs are in colour, not black and white**, and `img-2`'s subject reads
   considerably older than the "man in his fifties" its alt text claims.

Also named to Ewa in the body: the gate's evidence line ("no people, hands, clinic, blood or
sample") was established on the **film frame** and does not describe the photographs, so `img-3`
has never actually been cleared.

**Format:** validated by `.claude/skills/signoff-email/validate.js`, exit 0, on both the drafted
body and the copy read back out of Gmail after creation. **Eight** contiguous items, every item one
question and at least two lettered options, no em dashes, reply-by-letter instruction present.
⚠ *Said "seven" until 2026-09-15; that predates `img-8` becoming question 8 and was simply wrong.*

**On reply:** rulings go to ClickUp (Approvals & Sign-offs) FIRST, then mirror here. **Count the
answers against EIGHT** before recording anything. ⚠ *Said "the seven" until 2026-09-15. A
too-low expected count is the one error this check cannot survive: it makes a reply with a missing
answer look complete.* ⚠ **And confirm which task is canonical before writing to it** — there are
currently two, `869eqz4bd` and `869eur84c`, both `pending`. See correction 3 above.

---

## The email body as drafted

```
Hi Ewa,

Nine items for sign-off on the new homepage, and all nine are pictures rather
than words.

Nothing here is live. It sits on a branch that publishes nothing, and none of it
can go public until this is signed. I checked that against the deployed site this
morning rather than trusting my own notes, because the notes said otherwise.

Because it is all imagery, there is no copy for me to quote at you. The images
are attached and named to match the questions. Please open them: the descriptions
are there to say what I want you to look at, not to save you looking. Where an
image sits under a caption on the page, I have quoted the caption, because the
caption changes how the picture reads.

Attachments, in question order:

- q1-hero-film-frame.jpg
- q2-img-3.jpg
- q3-img-1.jpg, q3-img-2.jpg, q3-img-4.jpg, q3-img-6.jpg
- q4-img-5.jpg
- q5-img-7.jpg
- q6-hero-as-it-ships.png, q6-hero-field-revealed.png
- q8-img-8.jpg

Reply with just the letters, like this: 1: A 2: B 3: A 4: A 5: A 6: A 7: B 8: A

Answering 1 to 8 with a letter is your sign-off on all ten items. There is no
separate approval question at the end.

1. The film behind the headline.

An overhead shot of a white painted kitchen table in window light: a mug of tea,
a pair of reading glasses, and a sheet of pale paper. The film drifts slowly and
loops. There is no clinic, no blood, no sample and no medical object in frame.

The sheet is the whole question, and I want to describe it accurately rather than
favourably. It carries a few lines of handwriting, none of it legible at any
size. But it is ruled into rows, and most rows have a short mark at the left and
a second short mark away to the right. That is the structure of a list of things
with values beside them. It is meant to read as a letter or a note; if it instead
reads as a printed result or a report from a laboratory, the film is making a
clinical suggestion the page has not earned.

Does the sheet on the table read as a lab result?

A: No, it reads as handwriting. Clear as it is.
B: It is ambiguous. Clear only if the sheet is replaced or moved out of frame.
C: Yes, it reads as a result. Do not use this film.

2. The photograph on the Kit 3 card.

Overhead, in colour: a man's hands on a bare wooden table, holding a small plain
pale tube about the length of a finger joint. A mug sits at the top of the frame.
There is no blood, no clinic, no branding and nothing else medical. It sits on
the card for the nine-marker kit, under the caption "Five minutes, at home".

I want to name something the record got wrong rather than let you inherit it. The
evidence line on this gate reads "no people, hands, clinic, blood or sample", and
that was established on the film frame above, not on this photograph. This image
has people, hands and a sample in it. It has never actually been cleared.

Is a plain collection tube in a kitchen acceptable on this card?

A: Yes, clear as it is.
B: Clear only with the tube out of frame.
C: Not clear. Use a different photograph.

3. Four photographs of ordinary life.

All four in colour, all men in domestic or working settings, none holding or near
anything medical, none of them looking unwell:

- q3-img-1: a man in his mid forties standing at a kitchen counter in the
  morning, looking at his phone, mildly amused. Caption: "No email, no gate".
- q3-img-2: an older man, grey and balding, in glasses, at a kitchen table in the
  evening, looking at a laptop with some concentration. Our own note calls him a
  man in his fifties and he reads older than that to me. Caption: "The same test,
  later".
- q3-img-4: a man in his early fifties leaning back at an office desk late in the
  day, looking away from his monitor. Caption: "Thursday, 4pm". The copy beside
  it reads "Most men arrive here after a set of bloods came back with nothing
  flagged, and nothing explained".
- q3-img-6: a man in his late forties in a back doorway at dawn, holding a mug,
  looking out over a terraced garden. Caption: "Ordinary Tuesday".

They are grouped because they raise one judgement rather than four: whether a
photograph of an ordinary man, sitting next to copy about being tired, implies
that the man is unwell.

Do these four read as ordinary life rather than as illness?

A: Yes, all four are clear.
B: Clear except the ones I name in my reply.
C: No, none of them should be used this way.

4. The man in the changing room.

A man in his early forties alone on a bench in a municipal gym changing room,
leaning forward with his head down and his hands clasped between his knees. He is
not moving or dressing; he reads as exhausted, or as someone who has stopped. Our
own note describes him as "putting on a trainer", which is not what the picture
shows, and I would rather correct that here than have you rule on a description
instead of an image.

It sits under the caption "A demo account", beside copy about looking at a sample
result before paying. Nothing medical is in frame. The concern is only that a man
who looks defeated, on a page about tiredness, edges from describing a feeling
towards depicting a patient.

Does this man read as unwell rather than as tired?

A: No. Clear as it is.
B: Clear, but not under this caption.
C: Not clear. Use a different photograph.

5. The photograph on the Kit 2 card.

A man in his early forties sitting on the bottom stair of a hallway after a run,
still in running kit, sweat showing through a grey shirt, head down, catching his
breath. It sits on the card for the energy and recovery kit, under the caption
"Not bouncing back".

Two things before you answer. The first is not yours: the trainers carry a mark
that looks like a brand logo. It is generated and matches no real brand, so it is
a trademark question rather than a clinical one and Keith owns it. It is named
here so nobody finds it later. The second is yours. The image shows a man visibly
struggling after exercise, directly above a kit that measures vitamin D, B12,
ferritin and hs-CRP, under a caption that names the struggle.

Does this photograph, on this kit, imply a cause for how he feels?

A: No. Clear as it is.
B: Clear only if the caption "Not bouncing back" is changed.
C: Not clear. Use a photograph without the exertion in it.

6. The moving pattern of lines in the hero.

Two attachments for this one. q6-hero-as-it-ships.png is what a visitor sees.
q6-hero-field-revealed.png is the same hero with the transparency and the mask
taken off, so you can see what is actually being drawn. That second version never
ships; it exists only so this can be answered on the thing itself rather than on
my description of it.

What is drawn is real range geometry. Every band is a genuine percentage from our
own thresholds document: the laboratory reference range, our narrower action
range, and a sample value, for six markers, repeated down the hero and drifting
sideways. Nothing is labelled, no marker is named, no number appears, and there
is no axis and no scale. At the opacity it ships at, no single band is readable
as a value.

Our reading is that this is texture whose source happens to be real, rather than
a display of data. That reading is not ours to ratify, which is why it is here.

One thing you should know before you answer, because I had it wrong until this
week. This pattern is not only on the homepage. It is built into the shared page
frame and it is switched ON by default, so it sits behind the top of twenty six
pages. Every page has to opt out of it, and exactly one does. The list includes
the three kit pages, all five landing pages, the membership page, the privacy
page, and the order confirmation page a man sees straight after he has paid.

I am telling you the number because it changes the weight of the answer, not the
question. Two of those pages are worth a separate thought. On a marketing page
the pattern sits behind a sales argument. On the order confirmation page it sits
behind a man who has just handed over money and is waiting for his kit, and that
is the one place a faint pattern of ranges could most easily be taken for
something of his own.

Is this a data display?

A: No, it is texture. Clear as it is, on all twenty six pages.
B: It is texture only because it is faint. Clear, but the opacity must never be
   raised without asking you again.
C: Texture is fine on the marketing pages, but take it off the order
   confirmation page, where it could be read as his own result.
D: Yes, it is a data display. Do not use it anywhere.

7. Two markers in that pattern that the page never shows.

The pattern draws six markers. Four are the same four the page's sample result
shows: testosterone, vitamin D, active B12 and ferritin. The other two are hs-CRP
and SHBG, and they appear nowhere else on the homepage.

Nothing identifies them and nothing about the page changes if they come out. I am
raising it because it is the asymmetry most likely to matter to you and least
likely to be spotted: there is now a check on every build asserting that the four
shared markers match the sample result exactly, and by its nature that check
cannot cover the two that appear only here.

Should the two unshown markers come out of the pattern?

A: No, leave all six.
B: Yes, remove hs-CRP and SHBG and draw only the four the page shows.
C: Leave them, but only once both are added to the sample result as well. Note
   that this option changes the sample result on the homepage itself, so it is a
   copy change and a second pre-flight, not just a design tweak.

8. The postbox.

This is the newest image and the only one made specifically for a page rather
than inherited: a red pillar box on an ordinary residential street on an
overcast morning, with a plain white envelope part-way into the slot. There is
no person in it, no hands, no clinic, no laboratory, no blood and no sample. The
envelope is blank: no address, no writing, no printing, no logo. Nothing in the
frame carries any lettering at all.

It sits in the hero of `/how-it-works`, under the caption "Any postbox, any
morning", beside the standfirst that already says "a finger-prick, a pre-paid
envelope, and a UKAS ISO 15189-accredited lab".

I want to say plainly why it is a postbox and not a man, because it is the one
choice in this packet I made in order to avoid asking you something. Questions 3
and 4 above both come down to whether a photograph of an ordinary man, sitting
next to copy about being tired, implies that the man is unwell. An eighth
photograph of a man would have inherited that question before you had answered
it. This one cannot, because there is nobody in it.

Does this image raise anything at all?

A: No. Clear as it is.
B: Clear, but not under this caption.
C: Not clear, and tell me what you are seeing.

Nothing ships until you answer. If any of these needs more than a letter from
you, say so and I will send whatever you need to see.

Thanks,
Keith
```
