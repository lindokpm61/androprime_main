# Shot-list compliance pass: the eight founder video scripts

_Run 2026-08-16. Plan step 4.3 ("Run a compliance pass over the shot list, before the day")._

**Not an approval.** This is a pre-flight record. Sign-off on anything flagged stays with Ewa
(clinical/claims) or Keith (business), per `03_compliance/CONTEXT.md`.

## What this pass covers, and why it is a separate pass

**The spoken layer was already checked and is in good order.** Every one of these scripts carries a
claim-inheritance table tracing each line to a signed source, a rails note written in allowlist form,
and a recorded deterministic scan. Re-running that would measure work already done.

**This pass reads the layer a text scanner cannot see**: the `[Visual: …]` directives, the burnt-in
`[Text: …]` overlays, the delivery cues, and the props. That is where video makes claims that are not
text. A screen recording of a real medical record, a figure rendered as an image rather than spoken,
a document held up to camera, and a pause that turns a hedge into an assertion are all invisible to a
string match.

**Timing is the whole point.** A finding here costs a line edit. The same finding after a filming day
costs the day.

## Scope

**Eight scripts across seven asset files.** `same-test-twice.md` carries two (S1 and S2).

| Script | Frame-1 visual | Puts a real record on camera |
| --- | --- | --- |
| `the-stack` | five coasters on a counter | no |
| `when-a-test-earns-its-place` | four coins turned over | no |
| `ep-0-baseline` | unopened kit, then a finger-prick on camera | no |
| `handbrake-half-on` | a hand on a half-pulled handbrake | no |
| `lab-would-not-answer` | NHS App, laboratory comment bar | **yes** |
| `same-test-twice` S1 | NHS App result history, thumb scrolls | **yes** |
| `same-test-twice` S2 | a named body's position statement on screen | third-party document |
| `what-time-was-it-taken` | a watch on a printed result sheet | **yes** |

Three of the eight put a real medical record in frame. Those three carry essentially all of the risk
in this set, and all three of them do already instruct redaction. **The findings below are about
where that instruction sits, not about whether anyone remembered it.**

---

## 🟠 FLAG — V1. The redaction obligation sits at a different production stage in each script

All three record-on-camera scripts require identifiers off the screen. Each states it somewhere
different, and each implies a different moment:

| Script | Where it is stated | Which stage it names |
| --- | --- | --- |
| `what-time-was-it-taken` | **inside the `[Visual: …]` block** | capture: "Identifiers covered" |
| `lab-would-not-answer` | craft note, under its own heading | capture: "Redaction before filming" |
| `same-test-twice` S1 | production note at the end | **post: "before it is cut"** |

**Why this matters on the day.** The shot block is the part a person holding a camera actually reads.
Two of the three put the obligation outside it, in prose that is read while planning and not while
shooting. **The one script that puts it in the shot block is the one whose prop is a piece of paper**,
which is the easiest of the three to redact and the least likely to be forgotten.

**Suggested resolution, for Keith:** move the instruction into the `[Visual: …]` directive in all
three, so the obligation travels with the shot rather than with the document. This is a placement
change, not a copy change, and it needs no clinical ruling.

## 🟠 FLAG — V2. One script defers redaction to the edit, which creates a record with no retention rule

`same-test-twice` S1 says redact "**before it is cut**". Taken literally that is correct and
sufficient for what ships. It also means **an unredacted screen recording of special-category health
data legitimately exists on a device**, from filming until the edit, and nothing says where it lives,
how long it is kept, or that it is deleted afterwards.

**This is the one finding that is not about the broadcast.** `09_website-app/STATE.md` records that
`03_compliance/deletion-policy/` is empty and there is no retention schedule, so there is no policy
for this footage to fall under. Raw shot media is also the class step 3.5's cold archive copies to
`nc-server-01`, so an unredacted frame could be archived twice by design.

**Suggested resolution:** redact at capture rather than at the edit, which removes the question
entirely. If capture-time redaction is impractical on a phone screen, then the raw file needs a named
home and a deletion point, and that is a compliance decision rather than a production one.

## 🟠 FLAG — V3. "Identifiers" and "what else is on the screen" are different sets

`same-test-twice` S1 directs: *"Thumb scrolls once. Both rows land in frame together. Real screen, not
a graphic."* Its redaction instruction covers **patient identifiers**.

A scroll through a real results history can bring **adjacent unrelated results** into frame. Those
are not identifiers, so an instruction naming identifiers does not cover them, and they are still
special-category data about a named individual. The same applies to the laboratory comment bar in
`lab-would-not-answer`, where opening one comment can reveal neighbouring entries.

**Suggested resolution:** state the requirement as what the frame may contain (the two rows under
discussion and nothing else) rather than as what must be removed. That is both easier to check on the
day and consistent with the allowlist convention this repo already uses for compliance notes.

## 🟠 FLAG — V4. `ep-0-baseline` is amber with nothing joining it to its ask

`content_assets.preflight` is `amber-ewa` and `ewa_task` is **null**.

**The ask does exist.** ClickUp `869ec31xu`, "Before Mon 3 Aug shoot: Kit 1 in Keith's hands + Ep 0
script to Ewa", is still `to do` in Sprint — Pre-launch. **Its date has passed by nearly two weeks
and the shoot did not happen.**

So the state is not "forgotten", it is "unjoined": the row says something is with Ewa, the task says
what, and nothing connects them. Doctor invariant I5 resolves `amber-ewa` against the ClickUp task
named in `ewa_task`, so with that column null the gate has nothing to check. It does not fire today
only because no shot rendition is scheduled.

**Suggested resolution:** set `ewa_task` on the `ep-0-baseline` row to that task. Not done in this
pass because the task predates the asset-file convention and Keith may prefer a fresh one scoped to
the shoot rather than to the 3 August date.

## 🟠 FLAG — V5. A third party's document appears on screen and is quoted from

`same-test-twice` S2 opens on a named professional body's position statement, on screen, with the
sentence highlighted, and overlays a direct quotation as burnt-in text.

The quotation is used carefully in the spoken line: it is attributed, marked as a quote, and the
script states what the bodies are saying rather than extending it. **Two things sit outside what a
text check can confirm**, and both are cheap before the day: that the highlighted sentence on screen
is the sentence being quoted, and that reproducing a portion of that document on camera is acceptable
use. Neither is a claims question, so neither is Ewa's.

---

## 🔵 PREVIOUSLY ADJUDICATED — no action from this pass

**The two figures and the laboratory-comment screenshot are already ruled on.** Ewa's ruling D of
2026-07-29 (`03_compliance/correspondence/2026-07-30-keith-ewa-fai-rulings-a-to-d.md`) cleared Keith
showing his own results and recorded that the call is his. The scripts hold the line the ruling draws:
they state the numbers and never interpret them.

**The open question is already recorded in the script itself**, at `same-test-twice.md`: a viewer who
knows the referral line will see the lower figure and wonder why it goes unmentioned, and the more
transparent version needs a fresh named ruling. **That question is Keith's to raise with Ewa and this
pass does not re-open it.**

## 🟢 CLEARED at the visual layer

- **Five of the eight open on an ordinary object** — coasters, coins, a handbrake, a kit on a table, a
  watch. None carries a record, a figure or a result.
- **Every script ends on the same on-screen education line**, so the framing is carried in the
  picture and not only in the audio, which is what a muted viewer gets.
- **`what-time-was-it-taken` names its own trap and closes it**: the prop is deliberately generic, and
  the craft note instructs that a collection time must not be staged or implied if the real report
  says otherwise. That is the strongest visual-honesty instruction in the set and is the model for the
  others.
- **`ep-0-baseline`'s finger-prick is specified without dramatisation** — "unhurried, no music sting" —
  so the demonstration shows use rather than manufacturing urgency.
- **No burnt-in text in any script states an outcome, a benefit, or an ingredient.** The overlays are
  framings, figures Keith owns, and the education line. The EFSA tables are therefore not in play
  anywhere in this set, and there is no product claim rendered as an image.
- **The delivery cues are pauses and pace drops**, placed before reveals rather than before claims, so
  no cue converts a hedge into an assertion.

---

## Verdict

**Deterministic floor: already recorded per script. Judgement pass at the visual and delivery layer:
run 2026-08-16.**

**Not approved. Five items pending, none of them clinical.** V1, V2 and V3 are production and
data-handling placement questions for Keith. V4 is a one-column join. V5 is an accuracy and
permissions check. **Nothing in this set requires a fresh ruling from Ewa**, and the one question that
would is already written into the script that raises it.

**The scripts are safe to film once V1 to V3 are settled**, because all three are about making an
instruction that already exists impossible to miss on the day.

## What this pass did not do, and it is the plan's own point

Plan step 4.3 observes that the pre-flight skill already says its logic applies to a script line
before filming, and that **it has no mechanism behind it**. That is still true. This pass was run by
reading, and a pass run by reading is not repeatable and does not fire on the ninth script.

**The mechanism worth building** is a shot-block extractor: pull every `[Visual: …]`, `[Text: …]` and
delivery cue out of an asset file, then apply the checks that only exist at that layer — a record on
camera without a capture-stage redaction instruction in the shot block, a figure rendered as an
overlay that does not trace to a filed source, an overlay naming an ingredient or an outcome. Three of
this pass's five findings are mechanical enough to be caught that way, and V1 is exactly the shape a
machine is better at than a reader.
