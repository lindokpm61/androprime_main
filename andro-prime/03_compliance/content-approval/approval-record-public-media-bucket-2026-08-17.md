# Approval Record — Public media bucket: what may never enter it

| Field | Value |
| --- | --- |
| Register ID | CA-039 |
| ClickUp | [`869ek4a8y`](https://app.clickup.com/t/869ek4a8y) — **Rules & Procedures** (Keith-Only Sign-offs), status **`approved`** 2026-08-17 23:50 London |
| Artefact path | `andro-prime/03_compliance/CONTEXT.md`, section "Public Media Bucket — what may never enter it" |
| Version | `v1 (written 2026-08-14, unchanged at approval)` |
| Content type | `internal compliance rule + three technical controls (NOT customer-facing copy)` |
| Submitted by | `Claude (drafted), Keith (owner)` |
| Submitted date | `2026-08-17` |
| Required signers | `Keith` |

**Why Ewa is not a required signer.** The rule contains no clinical content of any kind: no marker,
threshold, symptom, outcome, dosage or ingredient. It governs what class of FILE may enter a public
storage bucket. Its subject matter is data protection and publication control, which is Keith's, and
it makes no assertion about anyone's clinical judgement. It clears all four questions of the
Keith-only entry test in `README.md`.

**This is the first record on the second approval board**, created 2026-08-17 because this rule had
nowhere to be signed. See §6.

## 1. Pre-flight evidence (mandatory)

- **Command:** N/A — the standard scanner is not the applicable gate here.
- **Run date:** `2026-08-17`
- **Result:** `N/A`
- **Judgement pass:** `done`, against a different axis, and the reason is worth recording. The
  compliance pre-flight scans **customer-facing copy** for claim risk. This artefact is a rule about
  file classes; running the claims scanner over it would return the same known false positives every
  rulebook produces (it quotes the categories it forbids) and would say nothing about whether the
  rule is correct. The applicable evidence is **whether the controls it claims actually hold**, which
  is §2.
- **Disposition of every HARD hit:** `N/A`

## 2. Evidence: the controls were verified by ATTEMPTING them

Every control was exercised against the live bucket on 2026-08-14 rather than reasoned about, and
re-confirmed green by `content-doctor` on 2026-08-18.

| Layer | Control | Verified how | Result |
| --- | --- | --- | --- |
| Ingest | Mime allowlist: `image/png`, `image/jpeg`, `video/mp4` | Attempted a `application/pdf` upload **as the service role** | Refused **415** for every caller including our own jobs |
| Access | No RLS policy on `storage.objects` | Attempted anon upload, anon delete, anon list, unauthenticated download | 403 / 403 / `[]` / **200** — writes and enumeration denied, public read intact |
| Content | Doctor invariant **I11**: every object matches the path convention and its first segment is a live `content_assets` slug | Nightly unattended run | **PASS**, 110 objects |

**The done-when was restated during the build and the reason is recorded rather than buried.** The
step asked for "a doctor invariant that fails if a forbidden kind appears". Nothing can look at a PNG
and see that it is a biomarker chart rather than a marketing slide; implemented literally it becomes
a filename heuristic that passes trivially and reads like enforcement. **Inverted into an allowlist
over provenance it is buildable and stronger**: a results PDF, a customer photo and a stray export
are all things no content asset would ever claim, so I11 catches the whole class including the
members nobody enumerated.

## 3. Items flagged for human decision

| Item | Risk / rule | Signer | Decision |
| --- | --- | --- | --- |
| The rule shipped as **code before it was approved as a rule** | Right order for a control, wrong order for a rule. The controls are safe defaults and nothing depended on the text being signed, but for three days the CQC-facing answer to "who decided what may be published unauthenticated" was "nobody" | Keith | ☑ **CLEAR** — covered by the approval below |
| Path convention embeds a content hash | The hash is an **embargo**, not cache-busting: deck slugs appear in the published run calendar, so `<slug>/slide-03.png` would be guessable, and up to thirty carousels sit in the bucket before their slot | Keith | ☑ **CLEAR** |

## 4. Conditions of approval

1. **Widening any of this is a compliance change, not a config change.** Specifically: never add a
   `select` policy on `storage.objects` (it turns "unguessable" into "enumerable"), and never widen
   the mime allowlist to admit documents. Either needs a fresh submission, not a console edit.
2. **Approval covers the rule as written on 2026-08-14.** The three controls are evidence for it, not
   part of it; replacing a control with a weaker one of the same name is a material change.
3. **This approval does not cover the takedown path**, which is CA-040 and carries an Ewa line.
4. ⚠️ **Out of scope and still open: the bucket is not backed up.** Supabase's daily backup excludes
   Storage objects, so the 110 published files are covered by neither git nor the database backup.
   They are reproducible from `media-manifest.json` plus the renderer, which is a rebuild rather than
   a restore, and nobody has timed it. This is a durability gap, not a publication-control gap, and
   it is not what this rule governs.

## 5. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and
date. Until every required row is signed, the register stays PENDING.

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
| --- | --- | --- | --- | --- |
| Clinical / claims (Ewa) | — | not a required signer (see header) | — | — |
| Business (Keith) | Keith Lindo | APPROVED | see §4 | 17/08/2026 |
| Contractual (Solicitor) | — | not a required signer | — | — |

> ✅ **Signed by Keith by moving the ClickUp task to `approved` at 23:50 London on 17/08/2026**, which
> is the signature under the convention adopted for this board the same day: the COLUMN is the
> signature, `approved` is a closed-type status, and ClickUp stamps who moved it and when. **The row
> above is a mirror of that act, not an approval written by automation** — the hard rule that only a
> named human approves is satisfied by the status move itself, and the timestamp is the evidence.
> Nobody has to type a date for the trail to exist.
>
> The legal name is used here because this is a signature block; "Keith Antony" is the public-facing
> pseudonym.

## 6. Why this record exists on a second board

The rule was written on 2026-08-14 and shipped as code the same day, then **sat unapproved for three
days with nowhere to be signed**. The approvals register is built for external-facing copy, so a
Keith-only internal rule had no task, no row and no board; the only thing flagging it was a paragraph
in `03_compliance/STATE.md`, and **a STATE entry is a reminder, not an approval surface**.

The **Keith-Only Sign-offs** folder (`901213093318`) and its **Rules & Procedures** list
(`901220442060`) were created on 2026-08-17 to carry that class. Routing and the four-part entry test
are in `README.md`. CA numbering stays **one sequence across both boards**: the board decides where a
thing is signed, never what it is called.

## 7. Outcome

- Final decision: `APPROVED (Keith Lindo, 17/08/2026 23:50 London)`
- Register updated: `2026-08-18`
- Plan step 3.3 closed; `03_compliance/STATE.md` "OPEN FOR KEITH" reduced to CA-040 alone.
