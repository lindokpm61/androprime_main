# Approval Record — Instagram carousel slide-8 closes A/B/C (v1)

| Field | Value |
|---|---|
| Register ID | **CA-031** (stamped at sign-off, 2026-08-11) |
| ClickUp task | [`869egg5e1`](https://app.clickup.com/t/869egg5e1) (Approvals & Sign-offs, `901219880207`) |
| Artefact path | `06_marketing/content/instagram/carousel-prototype/slide-8-closes.md` |
| Version | v1 (PROPOSED) |
| Content type | social (Instagram carousel closing slide, three templates + one topic-to-kit mapping) |
| Submitted by | Claude, on Keith's instruction |
| Submitted date | 2026-08-11 |
| Required signers | Keith (business + routing). Ewa **not** required, see §2. |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js <payload>`
- **Run date:** 2026-08-11
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 0   🟡 CODE-COMMENT: 0`, exit 0
- **Payload/apparatus split:** the three closes plus all instantiated B lines were extracted into a standalone file and scanned alone, so the count measures shippable copy and not surrounding commentary.
- **Judgement pass:** done, with `03_compliance/CONTEXT.md` and `03_compliance/STATE.md` loaded.
  - **EFSA:** no ingredient is named and no benefit is asserted. No approved-claim wording is invoked, so no claim is engaged.
  - **Phase 0 boundary:** nothing addresses clinical services, prescribing or confirmatory testing.
  - **Silent ingredient:** absent.
  - **FM CTA gate:** no founding-member language.
  - **Results wording:** no result is depicted; the copy states what a kit measures and what it costs.
  - **Retest framing:** not engaged.
  - **Availability:** every kit named is purchasable now at the price stated (canonical £99 / £119 / £179 per the 2026-08-09 pricing decision). Mechanics ("finger-prick at home", "results in 2 to 5 working days") verified verbatim against the live `app/lp/energy-recovery` and `app/lp/hormone-recovery`.
  - **Em dash:** none.
- **Disposition of every HARD hit:** none to dispose of.

## 2. Items flagged for human decision

| # | Item | Risk / rule | Signer | Decision (2026-08-11) |
|---|---|---|---|---|
| 1 | Closes A and C, as drafted | no kit, marker or price named | **Keith** | ☑ **APPROVED** — his own typed reply, ClickUp comment `90120251482899` |
| 2 | Close B and the topic-to-kit mapping | Kit 1 is testosterone only; fatigue and brain-fog topics route to Kit 2 or Kit 3 | **Keith** | ☑ **APPROVED** — his own typed reply, ClickUp comment `90120251482914` |
| 3 | Does `andropause-male-menopause` stay in the 10? | CA-028 per-asset gate applies to every Pillar E derivative: three extra Ewa sightings | **Keith** | ☑ **SWAP** — replaced by `how-to-read-blood-test-results` → Hormone & Recovery Check, £179. Relayed in session and recorded as a reply by Claude, **not** typed by Keith; ClickUp comment `90120251483027` |
| 4 | The two topics dropped to reach 10 | marker redundancy, not compliance | **Keith** | ☑ **APPROVED** — his own typed reply, ClickUp comment `90120251482924` |

**Decision 3 was unanswered when the task was closed as `approved`, and was answered afterwards.** Recorded plainly because it is the exact gap this record predicted: with no checklist gate, completing the task could not enforce that all four were answered. Splitting the questions into one comment each did not prevent the omission, but it did make it detectable on read-back, which is why it was caught. Decisions 1, 2 and 4 carry Keith's own typed replies; decision 3 carries a relay and is marked as such.

**The decision-3 swap introduced no new copy.** Close B's Kit 3 line is unchanged and was already inside the scanned payload, so the delta against the approved set is zero new strings and the 0 HARD / 0 REVIEW result carries without a re-run. What changed is a topic label, not a claim.

**How the four decisions are registered, and which safeguard is missing.** The four are posted as **four separate ClickUp comments** on `869egg5e1`, one per decision, so each answer is retrievable against the question it answers. They are **not** checklist items: the checklist tool is license-locked on this workspace's MCP server, and the account connector has none. **The consequence, stated rather than hidden: completing the task does not enforce that all four were answered.** On an article review the checklist gate refuses approval until every item is ticked; here one completion click could register as four silent yeses. That is the defect Observation 111 describes, and it is present here by tooling limit rather than by choice. Read the comment replies, not the task status, as the record of decisions 1 to 4.

**Why Ewa is not a required signer, stated explicitly because the opposite was assumed first.** The only clinical question in this set is which kit may be named against a fatigue-type topic. **CA-025 (2026-07-19) already approved the Kit 1 testosterone-only rule**, and it is live in the results engine behind `KIT_SCOPE_NOTE_ENABLED`. `03_compliance/STATE.md` records that the remaining half is **routing**, and names it Keith's: *"Keith still owns the routing half (moving fatigue intent to Kit 2/Kit 3 rather than only deleting the words)."* This record therefore applies an approved decision rather than commissioning a new one, and no fresh Ewa ask is raised.

The one exception is topic-scoped, not close-scoped: if `andropause-male-menopause` stays in the 10, its three posts inherit the CA-028 per-asset gate and each needs Ewa's own sight, independently of this record.

## 3. Conditions of approval

1. **This covers three close templates and one mapping, not 30 posts.** Each post is a separate compression of a signed article into fragments and needs its own pre-flight. `compliance-preflight` has no fragment mode (`OBS-180`).
2. **B's mechanics are tied to the live landing pages.** If `app/lp/energy-recovery` or `app/lp/hormone-recovery` change their sample method, turnaround or price, the artefact changes in the same pass.
3. **`free-androgen-index` slides 1 to 7** must inherit that article's corrected framing (calculated free testosterone as the reported figure; FAI report-only in men, per the 2026-07-30 ruling). `kit-1-testosterone-health-check.md:72` is on record as contradicting `thresholds.md` here and is not a valid copy source.
4. **Copy approval is not a ship authorisation.** The run is separately gated on the bio-link rotation mechanism, without which the three closes cannot be told apart.

## 4. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | not required, see §2 | n/a | | |
| Business (Keith) | Keith Antony | **APPROVED** (set the ClickUp status himself; decisions 1, 2 and 4 typed by him, decision 3 relayed) | §3 conditions 1 to 4 stand | 2026-08-11 |
| Contractual (Solicitor) | n/a | n/a | | |

## 5. Outcome

- Final decision: **APPROVED as CA-031**
- Register updated: 2026-08-11
- **Copy approval only, not a ship authorisation.** The run remains gated on the bio-link rotation mechanism and on a per-post pre-flight for each of the 30 posts.
- Notes: run design, success criteria and rotation live in `06_marketing/STATE.md`, Instagram carousel section. The `andropause-male-menopause` swap removes the only CA-028 per-asset dependency from the run, so no Ewa sighting is owed on any of the ten topics.
