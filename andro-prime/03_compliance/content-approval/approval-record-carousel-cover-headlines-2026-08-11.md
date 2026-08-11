# Approval Record — Instagram carousel cover headlines (10 topics)

| Field | Value |
|---|---|
| Register ID | **CA-032** (stamped at sign-off, 2026-08-11) |
| ClickUp task | [`869egz2uv`](https://app.clickup.com/t/869egz2uv) (Approvals & Sign-offs, `901219880207`) |
| Artefact path | `06_marketing/content/instagram/carousel-prototype/covers.js` |
| Version | v1 |
| Content type | social (Instagram carousel cover: newspaper headline + overlay plate + typographic cover) |
| Submitted by | Claude, on Keith's instruction |
| Submitted date | 2026-08-11 |
| Required signers | Keith (business + voice). Ewa **not** required, see §2. |

## 1. Pre-flight evidence (mandatory)

- **Commands:**
  - `node .claude/skills/compliance-preflight/fragment-scan.js --fragment <deck> --source <article> --render <png dir>` across all ten decks
  - `node .claude/skills/compliance-preflight/scan.js` on the corrected source article
- **Run date:** 2026-08-11
- **Result:** **0 HARD / 46 REVIEW**, exit 0. Two residual REVIEW items are scanner noise (one matches on the word "either"; one is a spurious sentence pairing).
- **Fragment mode:** this is the first use of the mode added under `OBS-180` the same day. Every fragment was checked **against the published article it compresses**, not in isolation, because a compliant source sentence compresses into a non-compliant fragment when the qualifier is cut for length, and the result reads clean on its own.
- **Render obligation: DISCHARGED.** All 60 body slides and all 24 closes viewed as rendered PNGs. Type-only on flat grounds: no chart, before/after, trend arrow or colour-coded risk device. Disclaimer present on every slide. Nothing where the visual carries claim weight the text does not.
- **Judgement pass:** done, with `03_compliance/CONTEXT.md` **and** `03_compliance/STATE.md` loaded (rules, approvals and rulings layers).
  - **EFSA:** one ingredient claim in the entire run (zinc, `how-to-increase-testosterone-naturally` slide 6), quoted in the exact approved wording, with the slide stating that maintenance is not boosting. No other ingredient is named on any slide.
  - **Phase 0 boundary:** no TRT, clinical service, prescribing, confirmatory testing or availability claim anywhere in the run.
  - **Silent ingredient:** absent (synonym-swept).
  - **FM CTA gate / deposit:** absent.
  - **Kit scoping (CA-025):** every fatigue, energy and brain-fog topic names Kit 2 or Kit 3. Kit 1 is never framed as explaining fatigue.
  - **Em dash:** none.

## 2. Why Ewa was not a required signer

The two decisions are **voice and claim-strength calls on marketing copy**, not clinical questions. Neither headline states a threshold, a marker value, a symptom-to-cause link or a product claim. The one clinical question adjacent to this run (which kit may be named against a fatigue-type topic) was settled by **CA-025** on 2026-07-19 and is applied unchanged.

## 3. The two decisions, and what was approved

Both were put as separate ClickUp comments, because this workspace has no checklist gate (`create_checklist` is licence-locked) and **CA-031 was closed as approved with decision 3 unanswered** on 2026-08-11 for exactly that reason.

### Decision 1 — `free-androgen-index`

| | |
|---|---|
| Drafted | `THE NUMBER / GPS MISS` |
| Concern | The article is titled "the testosterone number your GP **probably** didn't measure". The cover dropped the hedge and generalised from one GP to GPs, turning an observation about a reader's own test into an assertion about how GPs practise. On the profile grid the cover is the whole tile, so no body copy carries the qualifier. |
| **Ruling** | **Option B** (Keith, 2026-08-11, verbatim: *"B is fine"*) |
| **Approved** | **`THE NUMBER / GPS OFTEN MISS`** |

### Decision 2 — `how-to-increase-testosterone-naturally`

| | |
|---|---|
| Drafted | `RAISE TESTOSTERONE / NATURALLY` |
| Concern | The article is the query "how to increase testosterone naturally". Dropping "how to" turns a question into an instruction, and an instruction implies the outcome follows. The deck argues the opposite for six slides ("The real list is boring and free", "There is no overnight switch"), so the cover promised what the body qualifies, on the surface most people will only ever see. Closest thing in the run to an efficacy claim, though it names no product and no ingredient. |
| **Ruling** | **Option C** (Keith, 2026-08-11, verbatim: *"C: is ok"*) |
| **Approved** | **`WHAT ACTUALLY RAISES / TESTOSTERONE`** |

**Both rulings were RELAYED, not typed.** Given in session and recorded on the task by the agent. Same disposition as CA-031 decision 3. Recorded here so nobody later reads the comment thread as Keith's own keystrokes.

## 4. The other eight headlines

Approved as drafted, unchanged: `14 SIGNS OF / LOW VITAMIN D`, `WHAT YOUR B12 / REALLY SAYS`, `YOUR IRON / STORES, EXPLAINED`, `WHAT CRP / ACTUALLY MEANS`, `WHY AM I / ALWAYS TIRED?`, `WHAT CAUSES / BRAIN FOG?`, `WHAT "NORMAL" / REALLY MEANS`, `HOW TO READ / YOUR RESULTS`.

Each echoes its article's own question or title without sharpening it.

## 5. Why the wording lives in one place

`covers.js` holds **one row per topic** and three consumers read it: the headline inpainted into the newspaper inside the photograph, the overlay plate on the video cover, and the typographic cover. A cover whose newsprint says one thing and whose plate says another is not obviously broken to whoever schedules it, so the single row makes that class of error unrepresentable. **Approving the row approves all three surfaces.**

The line break is stored, not computed: `inpaint.js` takes the headline as two lines and the newsprint layout depends on where the break falls, so the break is part of what was approved.

## 6. Conditions

- **Copy approval only. Not a ship authorisation.**
- **Covers 10 headline rows, NOT the 30 posts.** Each post remains its own compression of a signed article into fragments and needs its own pre-flight.
- Neither approved headline had been inpainted at the time of the ruling, so no paid frame was superseded. **This is why the ruling was taken before the frames were bought**: the mask is valid for one cover geometry only, and a headline changed after a frame exists is paid for twice.
- The run remains separately gated on `CAROUSEL_RUN_START`, the bio link pointing at `/go`, and the eight owed inpainted frames.

## 7. Related

- **CA-031** — the slide-8 closes and the topic-to-kit mapping for the same run.
- **CA-025** — Kit 1 testosterone-only scoping, applied unchanged.
- `06_marketing/STATE.md`, Instagram carousel section — the full pre-flight findings, including a wrong Active B12 band corrected in both the deck and the live article under Ewa's already-signed NG239 value.
