# Ewa review packet — LP clinical wording + countersignature backlog (2026-07-26)

| Field | Value |
|---|---|
| Purpose | (A) confirm the clinical wording attributed to / written about Dr Ewa Lindo on the live site; (B) collect her direct written countersignature on approvals so far recorded on Keith's in-session representation |
| Submitted by | Keith (assembled for Ewa) |
| Submitted date | 2026-07-26 |
| Required signer | Dr Ewa Lindo (clinical / claims) |
| Status | ✅ **CLOSED 2026-08-02 — Ewa signed both parts** in two written replies from `ewalindo@live.co.uk` (20:48 and 21:11 UTC). Logged as **CA-030**. See "Rulings received" below. |
| Source | `09_website-app/STATE.md` "Owed / flagged" list (the "Ewa packet" shorthand) + `content-approval-register.md` |
| Amended | 2026-08-02 — A4 and A5 added from the on-page review; clarifying note added to A2. Part B unchanged. |

> **Nothing in this packet is approved by assembling it.** Only Dr Ewa Lindo can
> confirm Part A and countersign Part B. Claude/automation never sets a sign-off.

---

## Rulings received (2026-08-02) — read this before the request sections below

Ewa answered in **two written replies from `ewalindo@live.co.uk`** (20:48 and
21:11 UTC), the second closing the items the first left open. Everything below
this section is the *request* as assembled; these are the *answers*. Logged as
**CA-030** in the register.

| Item | Her ruling |
|---|---|
| A1 canonical wording | **"actionable steps"** — the wording WITHOUT "health". Note this is the minority form: three surfaces changed to match it, not one. Flagged back to her explicitly; she did not reverse. |
| A2 "treated men" | ❌ **NOT accurate.** *"i've not treated, but I've seen men."* Corrected to **"a doctor who has seen men with exactly these symptoms"** (her pick, Option A, one word). This was a live factual misstatement about her clinical background. |
| A3 NHS-threshold quote | ✅ **"happy"** — accurate, content to be attributed. Unchanged. |
| A4 `GMC Registered Practice` | ❌ Cannot stand: *"i am not a pratice, i'm a registered GMC gp."* Replacement, her pick: **"Reviewed by a GMC-registered GP"**. |
| A4b `GP-Led Formulation` | Resolves to the **same string**, so all three pages now match. |
| A5 `Personalised to your data` | *"it's based on the system, so use the compliant version."* → **"Your next step, based on your numbers"** on the two kit pages; how-it-works step 2 → **"Based on your numbers and the symptoms you reported"** (same construction, sentence kept intact). |
| Part B countersignature | ✅ **"I countersign the approvals listed"** — all 19. Backlog closed. **CA-028 was not on the list and still owes one.** |

**Also ruled in the same exchange (raised from ClickUp `869ecq3cy`, not from this packet):**

- **"Harley Street-trained in TRT"** → her pick, Option B: **"a GMC-registered GP
  with specialist training in men's hormonal health"**. She went further than
  asked and dropped Harley Street as well as TRT. Applied to **both** surfaces
  (`how-it-works` and `about`), not the one the task named.
- **Zinc 30mg → 25mg**, confirmed as a change to the **formulation spec** and the
  pages, not a copy fix alone. Applied to `daily-stack.md` and all three site
  surfaces.
- **Zinc claim paraphrase** ("supports testosterone maintenance and immune
  function") deleted; the verbatim EFSA claims stand alone.
- **Copper ~2mg DECLINED**: *"25mg zinc low enough."* Consequence worth
  recording: **the clean 4-active spec is preserved, so Gate 0A's
  capped-downside condition is undisturbed.**

**Ruled by Keith (business/regulator-status, never Ewa's):** `EFSA Regulated`
footer badge → **`EFSA-Approved Claims`** (accurate, and already the wording on
`supplements/daily-stack`). `GP-designed report` prohibited (both homepage
instances, including the one inside the `HowTo` JSON-LD), **while the
`A real doctor designed your report.` heading stands** per the 2026-07-07 ruling.
That settles the contradiction between this packet's A2 scope note and the
2026-08-02 `09_website-app/STATE.md` entry.

**Still open, and still Keith's:** `EFSA Compliant Dosage` on the
`lp/daily-stack` badge array, plus the A-related parked items below (the £218
strikethrough framing and the category-absolute "other providers" lines).

---

## Part A — Clinical wording on the live site (Ewa to confirm)

These are her words, or written representations about her clinical work. They are
live now. She should confirm each is accurate and that she is content to be
attributed. The LP styling around them was retouched 2026-07-26 for design
conformance (gray classes only); **not one word was changed.**

### A1 — Her attributed "clinical protocols" quote (appears on 4 surfaces)

Attributed to Dr Ewa Lindo (Clinical Lead). Canonical wording:

> "Normal ranges are statistical averages, not targets for how you should actually
> feel. I review our clinical protocols to ensure your data translates into
> effective, actionable **health** steps."

| # | Surface | File:line |
|---|---|---|
| 1 | Testosterone LP | `frontend/app/lp/testosterone/page.tsx:404` |
| 2 | Hormone-Recovery LP | `frontend/app/lp/hormone-recovery/page.tsx:565` |
| 3 | Hormone-Recovery kit page | `frontend/app/(marketing)/kits/hormone-recovery/page.tsx:630` |
| 4 | Energy-Recovery LP | `frontend/app/lp/energy-recovery/page.tsx:340` |

⚠️ **Wording inconsistency to resolve:** surface #4 (Energy-Recovery LP) drops the
word "health" — it reads "…effective, actionable **steps**." The other three read
"…effective, actionable **health steps**." Ewa to pick the canonical phrasing; then
the odd one out gets aligned (a copy edit, not a re-approval).

### A2 — "Treated men" representation about Ewa

`frontend/app/(marketing)/how-it-works/page.tsx:430` (third-person, in the
"A real doctor designed your report" section):

> "This is not AI-generated copy. It is not a generic reference range. The ranges
> and plain-English explanations are set and signed off by a doctor who has
> **treated men with exactly these symptoms**, and who knows the difference between
> 'not clinically deficient' and 'not functioning well.'"

Ewa to confirm this representation of her clinical background is accurate and she
is content for it to stand.

> **Scope note added 2026-08-02.** Only the "treated men with exactly these
> symptoms" clause is in question here. The section heading it sits under ("A real
> doctor **designed** your report") is **not** a finding: the 2026-07-07 ruling in
> `clinical-governance-copy-corrections.md` (line 141) records "designed" as
> approved system-authorship framing, and only "GP-built report" as prohibited.
> Two independent site reviews in 2026-08 re-flagged the heading; both were wrong,
> and this note exists so it is not raised a third time.

### A3 — Second attributed blockquote (found during assembly — recommend including)

Not named in the STATE shorthand, but it is a **directly attributed Dr Ewa Lindo
quote** in the same section, so it belongs in the same sign-off:
`frontend/app/(marketing)/how-it-works/page.tsx:449`

> "The NHS threshold for testosterone deficiency exists to identify men who are
> clinically ill. It was never designed to tell a 45-year-old whether he's
> functioning optimally. Most men I see with classic low-T symptoms have levels
> that would never trigger an NHS referral. That is the gap Andro Prime exists to
> fill."

### A4 — "GMC Registered Practice" badge on the Daily Stack landing page (added 2026-08-02)

`frontend/app/lp/daily-stack/page.tsx:198` — a verification badge array reading:

> `GMC Registered Practice` · `UKAS ISO 15189 Lab` · `EFSA Compliant Dosage`

**This is the most serious single string found in the 2026-08-02 on-page review.**
"Registered practice" asserts a registered clinical practice. Andro Prime is not a
clinic, no clinical service is offered, and CQC registration is not complete, so on
its face this states a regulatory status the business does not hold. It is on a
paid-ad landing page, which is the most exposed copy surface we have, and it is
`noindex` so it had never been looked at by an SEO or content pass.

Two things for Ewa, and they are separable:

1. **The clinical assertion.** Confirm the badge cannot stand as written. The
   review's suggested direction is a statement of what the clinician actually did
   (formulation reviewed by a GMC-registered GP), not a status claim about the
   business, but the wording is hers to set.
2. **Whether "GP-Led Formulation"** (the sibling badge on `/supplements/daily-stack`
   and `/supplements/collagen`, already raised separately on ClickUp `869ecq3cy`)
   should be resolved to the same phrasing, so the three pages stop diverging.

`EFSA Compliant Dosage` on the same badge array is a **business/regulator-status
question for Keith**, not Ewa, and is tracked with the "EFSA Regulated" footer badge
below.

### A5 — "Personalised to your data" on the results mock-ups (added 2026-08-02)

Three surfaces label the sample results panel's recommendation line:

| # | Surface | File:line | Current wording |
| --- | --- | --- | --- |
| 1 | Energy-Recovery kit page | `frontend/app/(marketing)/kits/energy-recovery/page.tsx:218` | "Recommendation: **Personalised to your data**" |
| 2 | Hormone-Recovery kit page | `frontend/app/(marketing)/kits/hormone-recovery/page.tsx:233` | "Recommendation: **Personalised to your data**" |
| 3 | How-it-works, dashboard step 2 | `frontend/app/(marketing)/how-it-works/page.tsx` | "**Personalised to your number** and the symptoms you reported." |

"Personalised report" is prohibited under the CONTEXT.md red-flag table and the
"Ewa signs off the system, not individual reports" special case, because it implies
bespoke per-customer clinical interpretation. These label a recommendation rather
than a report, which is why they are put to Ewa as a judgement rather than asserted
as a breach.

**This should be cheap to rule on, because the compliant wording already exists in
our own codebase** and only needs propagating:

| Existing approved-direction wording | Where it already ships |
|---|---|
| "Your next step, based on your numbers" | `lp/testosterone:223`, `lp/hormone-recovery:264` |
| "A specific supplement, based on your numbers" | `lp/energy-recovery:173` |

So the ask is not "draft new copy", it is "confirm the LP wording is the canonical
form, and we align the three kit/how-it-works surfaces to it." Same shape as the A1
"health steps" inconsistency: one canonical choice, then the odd ones out get a copy
edit rather than a re-approval.

### A-related — separate items still parked for Ewa (not her words, but her call)

From the same STATE "Left for Ewa" list, flagged here so nothing is lost (each is
a separate ruling, not part of the wording confirmation above):
- The **£218 strikethrough** anchor-price framing on hormone-recovery (colour was
  changed 2026-07-26 to `gray-500`; the *framing* — anchoring against a struck
  £218 — is the open question).
- Category-absolute "Other providers give you numbers" lines.
- "EFSA Regulated" footer badge wording.

---

## Part B — Approvals owed Ewa's direct written countersignature

Every row below was recorded **APPROVED on Keith's in-session representation** with
"direct written countersignature recommended for the clinical record." They are
live/approved as copy; this closes the audit-trail gap by getting her own written
sign-off (one email covering the batch is fine). Rows Ewa already signed **directly
by email** — CA-008, CA-009, CA-010, CA-011 — are **excluded** (already complete).

| CA | Artefact (short) | Recorded date |
|---|---|---|
| CA-003 | Influencer Brief v2.3 | 2026-05-18 |
| CA-004 | Influencer Attestation v2.3 | 2026-05-18 |
| CA-005 | Gym-Partnership one-pager v2.3 | 2026-05-18 |
| CA-006 | Partner activation comms (copy) | 2026-05-18 |
| CA-007 | prohibited-terms reference list | 2026-05-18 |
| CA-012 | Newsletter Issue 001 (CRP) | 2026-05-31 |
| CA-013 | Low-T result-card GP-referral copy | 2026-06-04 |
| CA-014 | Low-T nurture consent opt-in copy | 2026-06-04 |
| CA-015 | seq-03b low-T nurture (esp. Email 3 line) | 2026-06-04 |
| CA-016 | Blog: why-am-i-always-tired (ClinicalInsight quote + red-flag list) | 2026-06-18 |
| CA-018 | Checkout health-data processing consent | 2026-06-23 |
| CA-019 | Kit collection instructions (no-fast + washout) | 2026-06-25 |
| CA-020 | seq-03c/03d testosterone-value reword | 2026-06-26 |
| CA-022 | Retest reminder (all-clear) email | 2026-07-18 |
| CA-023 | GP handoff printable summary | 2026-07-19 |
| CA-024 | Account data-use + erasure copy | 2026-07-19 |
| CA-025 | Kit-scope note ("what this test did not tell you") | 2026-07-19 |
| CA-026 | Conflict-free positioning wording set (site-wide) | 2026-07-22 |
| CA-027 | Bundle address-check email | 2026-07-26 |

**Also note (blocked on solicitor, not Ewa):** CA-001 (PT-Brief) and CA-002
(PT-Attestation) — Ewa + Keith signed their halves 2026-05-18 (relayed); still
PENDING the solicitor money clause. Her countersignature on these is recommended
too, but they cannot ship until the solicitor signs regardless.

---

## How to sign off

Simplest audit-clean route (matches how CA-008/009/010/011 were closed): Ewa
replies **from her own email address** (`ewalindo@live.co.uk`) with:

1. **Part A (attribution):** "I confirm the wording attributed to me at A1–A3 is
   accurate and I am content to be attributed" (and her pick for the A1 "health
   steps" wording).
2. **Part A (rulings, added 2026-08-02):** a decision on **A4** (the "GMC Registered
   Practice" badge) and **A5** (the "Personalised to your data" label, where the
   question is only whether the existing LP wording becomes canonical). These two
   are rulings rather than attribution confirmations, so they need an answer, not
   just agreement.
3. **Part B:** "I countersign the approvals CA-003–007, CA-012–016, CA-018–020,
   CA-022–027 recorded on Keith's representation."

Keith retains the email/PDF for the clinical record; the register rows and this
packet's Status get updated to note her direct countersignature received. Until
then this packet stays **PENDING**.

---

*Assembled 2026-07-26 by Keith (via Claude). Law: `03_compliance/CONTEXT.md`.
Register: `content-approval-register.md`.*
