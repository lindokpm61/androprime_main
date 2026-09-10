# Kit 2 (Energy & Recovery) — Product Shot List

_Created 2026-09-09. Owner: Keith (brand sign-off). Scope: the AP-E02 carton only._

The orientation series for the Kit 2 pack: the same box from every camera position we
actually need, built as image passes over the approved render. **Five of eight shots are
verified and usable. Two are blocked by a model limit that this session pinned down.**

Renders are **gitignored** (per `STATE.md`), so this file is the index: every shot is
recorded by its `job_id`, which is the durable handle. Re-fetch any shot with
`job_status(jobId)`. Files are on disk at
`assets/packaging/renders/kit2-shotlist-2026-09-09/`.

> ⚠️ **They were not actually ignored until this session.** The rule written on 2026-09-09
> was `renders/*.png`, and a `*` does not cross a `/` — so it covered files sitting directly
> in `renders/` and missed any **subfolder**. This shot list created the first subfolder, and
> its **94 MB was fully stageable** while `STATE.md` asserted the opposite. Fixed by adding
> `renders/**/*.png`; the 35 already-tracked files in that directory are unaffected. Worth
> remembering when writing any "we don't commit these" rule: **the glob has to match the
> shape of the directory people will actually create, not the shape it had the day the rule
> was written.**

---

## 🔴 Read this before using any shot from an older folder

There are **two** Kit 2 pack renders on disk and they are not the same pack.

| | `pack-art/kit2-energy-recovery-pack-3q.png` | `renders/kit2-pack-interlocked-ap-2026-09-09.png` |
|---|---|---|
| Generated | 2026-08-20 | 2026-09-09 21:42 |
| AP mark | `AP` inside an **outlined square** | **Interlocked AP**, no container |
| Spine | `ANDROPRIME` (one word) | `ANDRO PRIME` (two words) |
| Ewa line | present | **removed** |
| Status | ❌ **SUPERSEDED** | ✅ **CANONICAL** |

The 2026-08-20 version breaches the interlocked-AP README, which is explicit that the mark
takes "no enclosing square and no container of any kind". It is the older file, it is the
one that gets reached for because its filename is the more plausible one (`pack-art`,
`-3q`), and it is 4800x3584 so it also *looks* like the better master. **It is not.**
Sort by date, not by filename.

Every shot below is built on the canonical render, job
`10f799cd-32ab-4284-887f-9d41dd30c08c`.

> ⚠️ **Kits 1 and 3 have not had this fix.** `kit-1-testosterone-3d.jpg` and
> `kit-3-hormone-recovery-3d.jpg` are both from the 2026-08-20 batch and still carry all
> three superseded elements — verified by eye this session on Kit 1. **Any three-kit family
> line-up is blocked until they are re-run.**

---

## 🔴 THE REAL BOX IS 169 x 122 x 23 mm, AND EVERY SHOT SO FAR IS WRONG ABOUT IT

Added 2026-09-09, from Vitall's own template
(`assets/packaging/dieline/Capillary Test Kit Artwork for Window 169x122x23mm.pdf`).
**This section outranks everything below it.** Two separate errors, and they compound.

**1. The pack art is the wrong SHAPE.** The front face is **169 wide x 122 tall = 1.385 : 1**.
The approved render measures **1.196 : 1** — **13.7% too tall**, or equivalently not wide
enough by the same. At the render's current 1970 px height the face should be 2728 px wide;
it is 2356 px. Every shot in this list inherits that, because they were all built on it.

**2. The box is the wrong SIZE in the scenes.** In the letterbox film frame the box measures
**52.7% of the doormat's width**. Against a normal 600-750 mm coir mat that reads as a
**316-395 mm** box. It should read **169 mm**, so it is **roughly twice its true size** and
needs to come down to about **28% of the mat width**.

**Anchors to prompt against, because models cannot do absolute millimetres but can do
comparisons:**

| Reference | The box against it |
|---|---|
| A5 sheet (210 x 148) | Slightly **smaller** than A5 |
| Adult hand, wrist to fingertip (~190 mm) | Box width is **shorter than one hand** |
| Doormat (600-750 mm wide) | **~25-28%** of the mat's width |
| Kitchen worktop depth (600 mm) | Takes **~28%** of the depth lying flat |
| Depth vs width | **13.6%** — it is a slim sleeve, not a chunky mailer |

⚠️ **The craft consequence, which is not obvious and costs a re-shoot if missed.** At true
scale this box is *small*. Simply shrinking it inside the existing wide frames makes a weak
hero: it reads as a bit of post rather than a product moment. **Correct scale means moving
the camera closer, not shrinking the box in the same frame.** Re-shoot tighter rather than
re-scaling.

✅ **No window on the front.** The template's 118 x 67 mm R5 aperture is on the **back**
panel (Keith, 2026-09-09), so the front artwork is right as drawn.

---

## The rails these shots are built to

1. **`brand-guidelines.md` §9.3 — Product Photography.** "On solid white background. Lit
   with clean, even light. **No props, no hands. Just the kit.**" Advisory since Keith's
   2026-08-27 demotion, but followed here on props and hands without exception.
   **One deliberate departure:** the background is the **pale neutral grey** of the approved
   render, not solid white. Holding grey keeps the set consistent with the hero Keith
   approved today; a white variant is one re-run away, and `image_background_remover` now
   exists in the catalogue if a true cutout is wanted.
2. **Standing rule (🔴 `02_brand/STATE.md`).** "Read every number at full zoom against the
   spec before any generated image is used." A generated packshot is a photograph of a
   claim, and one model has already silently changed a dose (`4,000 IU` → `4,999 IU`).
3. **Structural read-back, not just spelling.** A model can render every character correctly
   and still put the right unit on the wrong row. **This is not hypothetical — it is what
   went wrong here.** See the limit below.

---

## ⚠️ Two claims ride on every one of these shots

Both are printed on the pack, so they appear in every shot, and **neither is a design
question**:

- the outlined **IVD** mark plus **CE · UKCA** is a legal conformity declaration;
- **"ANALYSED IN A UKAS-ACCREDITED UK LABORATORY"** is a factual claim about the lab.

These shots are cleared as *images*. They are **not cleared for advertising** until those
two are verified. Do not put any of them in a paid ad, a landing page hero or a marketplace
listing before that happens.

---

## Tier A — the orientation series, with verification results

Every shot was opened at full resolution and checked for character accuracy, row pairing,
mark containment and blank-face integrity.

| # | Shot | Ratio | `job_id` | Verdict |
|---|---|---|---|---|
| **S1** | **Hero three-quarter (left)** | 4:3 | `10f799cd…` | ✅ **Approved master** |
| **S2** | **Front elevation** | 4:3 | `573db174…` | ✅ **Pass** |
| **S3** | **Flat / overhead** | 4:3 | `4dfe2a52…` | ✅ **Pass** |
| **S4** | **Three-quarter (right)** | 4:3 | `8194eba7…` | ✅ **Pass** |
| **S5** | **Steep side rake (~75°)** | 4:3 | `88d337bb…` v1 · `fc81b912…` v2 | ❌ **Fail, both passes** |
| **S6** | **True side profile (90°)** | 3:4 | `ab0d7adc…` | ✅ **Pass** — but blank, see below |
| **S7** | **Raised three-quarter (40°)** | 4:3 | `9632ee4c…` v1 · `e85f3293…` v2 · `3b56f833…` v3 | ❌ **Fail, all three passes** |
| **S8** | **Low hero angle** | 4:3 | `b2a19651…` | ✅ **Pass** |

**Usable today: S1, S2, S3, S4, S8** (plus S6 if a silhouette is ever wanted).

**S4 vs S1 is not redundant.** In a two-column layout the product should face *into* the
text, so you need the box facing both ways. That is the whole job of S4.

---

## 🔴 The limit this session found

**Neither `gpt_image_2` nor `gpt_image_2_5` can hold the marker table's row pairing once
the front panel is strongly foreshortened.**

The failure is always the same and it is the dangerous kind: **every character renders
correctly and correctly spelled, while the unit column slides vertically relative to the
name column.** A spell-check passes it. Only a structural read catches it.

What it looks like: in S7 v1 the four names bunched top-left over the headline while the
four units stacked bottom-right; in S7 v2 the whole unit column sat exactly one row high
and `FERRITIN` lost its unit; in S5 v1 and v2 `MG/L` and `µG/L` drifted above the rules
their names sat below.

**Three attempts, two models, same direction:**

| Attempt | Model | Change made | Result |
|---|---|---|---|
| v1 | `gpt_image_2` | baseline prompt | Fail, severe |
| v2 | `gpt_image_2` | explicit locked-pair rule, enumerated rows, negative constraints, verified flat elevation as layout authority | Fail, milder |
| v3 | `gpt_image_2_5` | different model, single-vanishing-point framing | Fail, severe |

Per the vendor runbook's own rule — when repeated independent attempts fail the same
constraint in the same direction, it is a property of the capability, not of the prompt —
**this is not worth further re-wording, and re-rolls should stop.**

**Where the boundary sits.** Near-frontal is reliable: S2 (0°), S3 (overhead but square to
the panel), S4 (~25°) and S8 (low, shallow rotation) all passed **first time**. It breaks
somewhere past ~40° of panel foreshortening.

**The route for steep angles, if they are wanted.** Not generation. `STATE.md` already
records the three.js render as "the geometric ground truth" for this artwork, and geometry
cannot make this mistake — a real perspective transform projects both columns through one
matrix by construction. Render the angle in three.js, then use a generative pass only for
material and light, which is exactly the pipeline `STATE.md` settled on for the supplement
label. That is a build job, not a prompt job.

---

## A second finding: the carton is printed on the front only

Top, back and both side faces are plain unprinted bone. That is why **S6 is a blank
rectangle** — it passed its check (no invented type, which is the pass criterion) and has
nothing to show.

For a mailer this is a perfectly reasonable, cheap decision. But it means:

- there is **no shelf presence** in any orientation but front-on;
- a **stack** of these reads as anonymous bone card;
- **S6 has nothing to say**, which is a product fact, not a render failure.

If retail, a stacked hero or an unboxing sequence matters, the fix is **artwork, not
photography**. Flagging it as a decision, not proposing one.

---

## Tier B — not generated, and why

| Shot | Status | Reason |
|---|---|---|
| **Back panel** | ⛔ **Blocked** | There is no back artwork. Generating one invents regulatory and instructional copy and photographs it as though it exists — the "photograph of a claim" failure. Needs real artwork first |
| **Open box / contents flat lay** | ⛔ **Blocked** | Kit contents (lancets, collection tube, IFU, Lab Request Form, return bag) come from Vitall and are not confirmed here. An invented contents shot misrepresents what the customer receives |
| **In-hand / scale reference** | 🟡 **Keith's call** | Against §9.3's "no props, no hands". §9.3 is advisory now, so it is available — but it is a deliberate departure and should be decided, not drifted into. It is also the single most useful shot for showing the box fits a letterbox |
| **Lifestyle (doormat, counter)** | 🟡 **Keith's call** | Same departure, larger. The Kit 2 film already has counter and cupboard frames in `06_marketing/content-machine/assets/kit2-same-programme/stage3-frames/` — check those before commissioning anything new |

## Tier C — blocked on other work

| Shot | Blocked on |
|---|---|
| **Three-kit family line-up** | Kits 1 and 3 still carry the boxed `AP`, `ANDROPRIME` and the Ewa line. A line-up today would ship the superseded mark on two boxes out of three. **Re-run both through the same correction that fixed Kit 2, then this unblocks.** ~22 credits |

---

## Verification protocol (run per shot, before use)

1. Open at **full resolution**, not on a contact sheet. A stray full stop once reached ten
   decks after a scaled montage cleared it.
2. **Character check:** `VITAMIN D`, `ACTIVE B12`, `HS-CRP`, `FERRITIN`; `NMOL/L`,
   `PMOL/L`, `MG/L`, `µG/L`; `REF · AP-E02`; `ANDRO-PRIME.COM`;
   `ANALYSED IN A UKAS-ACCREDITED UK LABORATORY`.
3. **Structural check — the one that actually catches things.** Each marker name shares a
   baseline with its unit, and a hairline rule sits under each pair. Crop the marker block
   at native resolution and look at it on its own; at fit-to-screen the drift is invisible.
4. **Identity check:** the AP mark has **no container** of any kind, and the spine reads
   **`ANDRO PRIME`, two words**. This is the regression to watch — the model's prior is the
   boxed version and it will drift back to it.
5. **Blank-face check** (S6, S7): no invented type, barcode or mark on the unprinted faces.

> The generated monogram is **close to but is not** the drawn vector: marginally narrower,
> slightly smaller bowl. Fine for a mockup. **For any definitive surface, composite
> `assets/logos/interlocked-ap/icon.svg` rather than generating the mark.**

---

## Spend

| Item | Credits |
|---|---|
| S2–S8, seven shots, `gpt_image_2` 4k/high | 77 |
| S5 + S7 re-runs, `gpt_image_2` | 22 |
| S7 control, `gpt_image_2_5` 4k/high | 7.5 |
| **Total** | **106.5** |
| _Balance before_ | _793.92_ |

Kit 1 + Kit 3 mark correction, if approved: ~22.

Note for future work: **`gpt_image_2_5` is cheaper than `gpt_image_2`** at the same
4k/high setting (7.5 vs 11) and carries an `auto` aspect ratio, which `gpt_image_2` does
not. It did not solve this particular problem, but it is the better default for
near-frontal work.
