# Approval Record — Phase 0a Partner Addendum + Broadcast

| Field | Value |
|---|---|
| Register ID | CA-011 |
| Artefact(s) | `06_marketing/affiliates/phase0a-supplements-deferred-addendum-2026-05-23.md` (canonical partner-facing addendum, 142 lines) + `06_marketing/affiliates/partner-activation-phase0a-broadcast-2026-05-23.md` (one-off broadcast email body, 71 lines) |
| Version | v1 (Phase 0a — supplements deferred 2 to 3 months) |
| Content type | Partner-facing addendum + partner broadcast email |
| Submitted by | Keith Antony |
| Submitted date | 2026-05-24 (record filed; underlying files dated 2026-05-23) |
| Required signers | **Keith (business / mechanic) + Dr Ewa Lindo (clinical sight)**. Solicitor NOT required — addendum is annotative and explicitly does not amend the CA-001/002 money clause (addendum §6 line 127, broadcast operational note §53). |
| ClickUp | [869ddvr1h](https://app.clickup.com/t/869ddvr1h) (task 55) — gated on this approval + the partner-activation channel (task 41 / CA-006 build gates) before broadcast can ship |

## 1. Scope

**Addendum** (`phase0a-supplements-deferred-addendum-2026-05-23.md`):

- Annotates v2.3 partner briefs (CA-001..CA-005) without rewriting them
- States £15 kit commission unchanged; £10 supplement-conversion bonus dormant during Phase 0a and activates automatically at Phase 0b launch with the same 60-day attribution window
- Explicitly excludes waitlist opt-ins from commission (consistent with FM-list non-cash framing under CA-008)
- Acts as the canonical reference partners are pointed at when client questions arise during the kit-only window

**Broadcast** (`partner-activation-phase0a-broadcast-2026-05-23.md`):

- One-off email to all confirmed partners (`partner_status` ∈ {active, dormant}); offboarded partners globally suppressed
- Sending identity `keith@andro-prime.com`, plain-text-feel HTML
- Only Liquid: `{{ customer.first_name }}` (safe for both PT + influencer cohorts in one send)
- No links in body (deliverability) — references the addendum by document name only
- No stop-goal — one-off broadcast, not wired to the activation sequence

## 2. Pre-flight evidence

- **Command:** `node .claude/skills/compliance-preflight/scan.js <both files>`
- **Run date:** 2026-05-24
- **Result:** 🔴 **HARD: 0** · 🟠 **REVIEW: 1** · 🟢 OK: 1

### 2.1 Disposition of the 1 REVIEW hit

| `file:line` | Phrase (verbatim) | Rule | Disposition |
|---|---|---|---|
| `phase0a-supplements-deferred-addendum-2026-05-23.md:126` | "Phase 0 / post-CQC boundary: untouched. This addendum sits inside the Phase 0 commercial frame; clinical TRT references in partner copy remain 'be first when we launch' as approved." | Scanner flags the literal word **TRT**; cannot distinguish a meta-compliance statement from a claim. | **CLEARED via judgement pass.** The line is in the addendum's own §6 Compliance block, describing *how* the Phase 0 / clinical boundary is preserved — not a customer-facing claim. Same documented-exception pattern as CA-007 (prohibited-terms quoting the banned terms to ban them), CA-008 (seq-03b:11–12 compliance-notes block), CA-009 (T-10:109 silent-ingredient quoting), CA-010 (§7 checklist quoting forbidden phrases). Not customer-facing; not present in the broadcast body. |

### 2.2 OK hit (informational)

`phase0a-supplements-deferred-addendum-2026-05-23.md:20` — "treated" appears inside a negation phrase ("Waitlist opt-ins from partner traffic do not pay commission… The waitlist is an email opt-in, no [purchase], no [deposit], not [treated] as a sale"). Scanner's NEG guard correctly classifies as compliant. Verified.

### 2.3 Judgement-pass cross-checks vs `03_compliance/CONTEXT.md`

- **Silent-ingredient rule:** name absent throughout both files. Addendum §6 explicitly directs partners to the v2.3 brief's scripted answer for any Daily Stack composition question. ✅
- **EFSA wording for any named ingredient:** no ingredients named (both files are about commission mechanics, not product copy). ✅
- **Phase 0 / clinical-service boundary:** TRT references remain "be first when we launch" framing — Phase 0 wellness side, no implication of available clinical service. ✅
- **CA-001 / CA-002 money clause:** untouched. Addendum §6 line 127 explicit: "No CA-001 / CA-002 money clause is amended. The addendum annotates, does not rewrite. The signed v2.3 briefs and attestations remain canonical." Solicitor sign-off correctly out of scope for this CA. ✅
- **Inflated discount language (CA-007 §6 rule):** none present. ✅
- **FM-list non-cash framing:** consistent with CA-008. Waitlist explicitly distinguished from a deposit or purchase in both files. ✅
- **Em-dash sweep:** broadcast operational notes confirm "No em-dash. Verified manually before send." Addendum scanned — no em-dashes in customer-facing prose. ✅

## 3. Conditions of approval

- **Broadcast may NOT send until both** (a) this approval is APPROVED by Keith + Ewa sight, **and** (b) the partner-activation channel exists (CA-006 build gates closed — tracked under task [869dbepux](https://app.clickup.com/t/869dbepux) item #41: isolated CIO partner space + Attio→CIO sync). The addendum itself can sit in partner materials immediately on approval; the broadcast requires the live channel.
- Addendum is Phase 0a only. On Phase 0b launch it is automatically superseded by the v2.3 briefs + `commission-structure.md` v2.3 (per addendum §7).
- If Phase 0b slips beyond 4 months from Phase 0a launch, re-issue a status note via the same channel; no new addendum required unless the underlying mechanics change.
- Any future change to the addendum's commission mechanics description requires a new CA record or an amendment to this one.

## 4. Signature block — humans only

**Reminder:** Per `content-approval-register.md` legend, **only a named human sets a row to APPROVED — never Claude/automation.** Pre-flight evidence above is mechanical; the decisions in this block require Keith and Ewa.

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / sight | Dr Ewa Lindo | ☐ — awaiting direct response (draft sent 2026-05-25) | | |
| Business / mechanic | Keith Antony | **APPROVED** | None — voice + mechanic approved as drafted; recorded on Keith's explicit instruction during the 2026-05-25 session | 2026-05-25 |

## 5. Outcome

- Current decision: **PARTIAL — Keith APPROVED 2026-05-25. Awaiting Ewa sight.**
- Register row: CA-011 status remains 🟠 PENDING until Ewa's direct sight is recorded (per `content-approval-register.md` rule: "Only a named human sets a row to APPROVED — never Claude/automation"). Ewa sight request sent 2026-05-25 from `keith@andro-prime.com` to `ewalindo@live.co.uk`.
- Unblocks (on Ewa sight): the §7 broadcast in the addendum (subject to CA-006 build gates per §3).

## 6. Notes

- Solicitor explicitly out of scope. Both the addendum (§6 line 127, line 128) and the broadcast (operational note §53) explicitly state this. No CA-001/002 money clause is amended.
- Ewa countersignature is the addendum's own recommended threshold ("recommended but not required because no claim or money clause is changed", addendum §6 line 128). Recording "Ewa sight" is sufficient per the addendum's self-defined gate.
- This record is filed in advance of human sign-off to remove the compliance side from the critical path. ClickUp task 55 [869ddvr1h](https://app.clickup.com/t/869ddvr1h) remains open until both Keith+Ewa sign here AND the broadcast actually sends via the partner-activation channel.
