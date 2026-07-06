# SOP — The Compliance Route (the mandatory gate)

**Every external-facing asset passes this before it ships. This is Guardrail #1 applied to the content machine.** The law is `03_compliance/CONTEXT.md`; this SOP is only the process. When they differ, the compliance CONTEXT wins.

**Applies to:** every blog derivative, founder script, caption, LinkedIn / Facebook post, email hook, thumbnail text, description, and **comment-to-DM message** (ManyChat). A founder account is not a loophole, and a DM is customer-facing copy.

**Data note:** ManyChat (or any comment-to-DM tool) stores contact data, so it is a **sub-processor** and must be added to the `03_compliance` sub-processor schedule + privacy policy before any live flow (`sops/sop-comment-to-dm.md`). Do not collect health data in a DM; the Art 9 health consent is captured at checkout, not in a DM.

---

## The route

```
asset ──► /compliance-preflight ──► 🔴 stop & fix
                                └──► 🟠 route to Ewa (ClickUp 901218140081)
                                └──► 🟢 pass ──► [claim check] ──► ship
```

1. **Read the law first.** `03_compliance/CONTEXT.md` (Red-Flag table, EFSA approved claims, Phase 0 boundary). Non-negotiable.
2. **Run `/compliance-preflight`** on the asset (it runs the deterministic scanner + a judgement pass). Three outcomes: 🔴 HARD FAIL (stop, fix, re-run), 🟠 FLAG FOR EWA, 🟢 PASS.
3. **The claim-inheritance check.** Even on a 🟢: does this asset make a claim the signed canonical asset does not? If yes, it is a net-new claim and goes to **Ewa** regardless of the scanner. If no, it inherits the canonical sign-off and ships.
4. **Route 🟠 and net-new claims to Ewa** via the ClickUp "Content Review — Ewa" list `901218140081`. Do not self-approve. Sign-off is Ewa's (clinical / claims) or Keith's (business).
5. **Human go.** No campaign activates, no video publishes, no email sends without an explicit Keith go. Every Customer.io email action stays draft until Keith activates (`/cio-sequence-build` invariant).

---

## The hard-rule checklist (restated from `03_compliance/CONTEXT.md`; the CONTEXT is authoritative)

- **No** diagnose / diagnosis / treat / treatment / cure / fix. Use "find out what your levels are"; on retests "how your levels have changed."
- **No** "TRT is available." Use "be first when we launch TRT."
- **No** "you have low testosterone." Use "your results indicate."
- **No** low-T action fired from Kit 2 markers. Only confirmed T < 12 nmol/L on Kit 1 or Kit 3.
- **Silent formulation ingredient:** the Daily Stack's undisclosed ingredient (named only in `03_compliance/CONTEXT.md` and the scanner regex) is never written, named, or shown on a label, anywhere, ever, including inside a prohibited-terms list. Enforce via the EFSA approved-claims allowlist, not a denylist.
- **Supplements:** EFSA-approved wording only (Zinc → normal testosterone; Vit D3 → normal muscle function; Active B12 → energy-yielding metabolism / psychological function; Vit C → collagen for cartilage). No magnesium fatigue claim (removed).
- **Trust language:** "Ewa-approved recommendation logic," never "GP-built / personalised report" or "reviewed by our doctor." "UKAS ISO 15189 accredited lab (Vitall)," never Andro Prime itself accredited.
- **No em dashes.** Replace with colon, comma, semicolon, period, or brackets.
- **CTAs:** Kit 1/2/3 or the email rung only. Never the founding-member list, never "priority access to TRT." Grep before ship: `founding.member`, `FM list`, `join the list`, `priority access to TRT`, `clinical service waitlist`.
- **Andropause / male-menopause:** Ewa-gated (Pillar E). Do not ship until signed.

---

## Definition of done

- `/compliance-preflight` returned 🟢 (or 🟠 items were Ewa-cleared).
- Claim-inheritance check passed (no net-new claim, or Ewa signed it).
- No hard-rule hit; grep for FM-list terms clean.
- Keith gave the explicit go.
