# Ewa packet: CA-045, the Direction F homepage imagery (2026-09-02)

**Status: RAISED as a Gmail DRAFT, not sent.** Draft id `r-3136750216544571074`. Sending is
Keith's act, not the assistant's. Nothing in CA-045 is approved by the existence of this packet.

**Nine items, seven questions.** Expected answer count is **7**. A reply carrying fewer than seven
letters leaves the missing ones UNANSWERED; never infer a ruling from an adjacent answer.

| Question | Item(s) | Asset |
|---|---|---|
| 1 | hero film | `public/home/table.mp4` + `poster.jpg` |
| 2 | img-3 | Kit 3 card, hands holding a collection tube |
| 3 | img-1, img-2, img-4, img-6 | four ordinary photographs, one grouped judgement |
| 4 | img-5 | the changing room |
| 5 | img-7 | Kit 2 card, plus the trainer mark disclosed as Keith's call |
| 6 | hero data field | display or texture |
| 7 | hero data field | the hs-CRP and SHBG rows the page never shows |

**Attachments (10):** `q1-hero-film-frame.jpg`, `q2-img-3.jpg`, `q3-img-1.jpg`, `q3-img-2.jpg`,
`q3-img-4.jpg`, `q3-img-6.jpg`, `q4-img-5.jpg`, `q5-img-7.jpg`, `q6-hero-as-it-ships.png`,
`q6-hero-field-revealed.png`. The last two were rendered for this packet: the hero field is a
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
body and the copy read back out of Gmail after creation. Seven contiguous items, every item one
question and at least two lettered options, no em dashes, reply-by-letter instruction present.

**On reply:** rulings go to ClickUp task `869eqz4bd` (Approvals & Sign-offs) FIRST, then mirror
here. Count the answers against the seven before recording anything.

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

Reply with just the letters, like this: 1: A 2: B 3: A 4: A 5: A 6: A 7: B

Answering 1 to 7 with a letter is your sign-off on all nine items. There is no
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

Is this a data display?

A: No, it is texture. Clear as it is.
B: It is texture only because it is faint. Clear, but the opacity must never be
   raised without asking you again.
C: Yes, it is a data display. Do not use it.

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

Nothing ships until you answer. If any of these needs more than a letter from
you, say so and I will send whatever you need to see.

Thanks,
Keith
```
