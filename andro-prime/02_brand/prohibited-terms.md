# Prohibited Terms

<!--
APPROVED 2026-05-18 (Keith + Ewa) — see
03_compliance/content-approval/approval-record-prohibited-terms-2026-05-18.md
and register CA-007. Closes outstanding-tasks blockers #2 and #48.
Recorded on Keith's instruction; Ewa countersignature recommended for the
clinical record. Consolidated from 03_compliance/CONTEXT.md + the scanner;
CONTEXT.md remains the law — this restates, it does not supersede.
Strip this comment block if this file is ever rendered/exported.
-->

## 0. Status & precedence

| | |
|---|---|
| **Status** | **APPROVED 2026-05-18** (Keith + Ewa — register CA-007). Blockers #2 & #48 closed. Recorded on Keith's instruction; Ewa countersignature recommended. |
| **Owner** | Keith Antony · clinical sign-off: Dr Ewa Lindo |
| **Law (source of truth)** | **`03_compliance/CONTEXT.md`** — Red-Flag Language Reference + EFSA Approved Claims + Phase-0 boundary + Special Cases. If this file and CONTEXT.md ever disagree, **CONTEXT.md wins** and this file is stale. |
| **Enforcement** | `.claude/skills/compliance-preflight/scan.js` (deterministic floor) + the judgement pass. This document and the scanner must stay in lockstep — change one, reconcile the other. |
| **Scope** | Every external-facing or potentially-external artefact: email, landing page, ad, social post, affiliate/influencer brief, results-report wording, internal docs that could go external. |

This document exists because the rules are currently scattered across CONTEXT.md, the scanner, and the v2.3 partner briefs. It is the single consolidated list for Keith ↔ Ewa to agree in writing. It restates; it does not create new rules.

---

## 1. HARD — banned outright (must fix before publish)

Presence of any of these = a defect. Decision Priority #1 (compliance overrides persuasion). The deterministic scanner exits non-zero on these.

| Banned term / pattern | Why | Permitted alternative |
|---|---|---|
| The undisclosed Daily Stack botanical (the "silent ingredient" — see §4) | No approved EFSA claim; an ASA complaint about it lands on Andro Prime | **Never name it, any context, any channel.** Use only the §3 EFSA allowlist; partners use the scripted answer in the brief |
| "diagnose" / "diagnosis" / "diagnosed" / "diagnosing" | Implies a medical act | "Find out what your levels are" |
| "treat" / "treatment" / "treats" / "treated" | Medicinal claim (benign data-"treatment" use must be verified in the judgement pass) | Remove entirely in Phase 0 |
| "cure" / "cures" / "cured" | Medicinal claim | Remove entirely |
| "clinically proven" | Misleading without an RCT reference | Remove, or cite a specific named study |
| "TRT is available" / "TRT is now/currently available" / "available now … TRT" | False availability claim — clinical service is not live (pre-CQC) | "Be first when we launch TRT" |
| "You have low testosterone" | Definitive medical statement | "Your results indicate…" |
| "heals/healing … joints/cartilage/body/tissue" (e.g. "collagen heals your joints") | Medicinal claim | "Vitamin C contributes to normal collagen formation for the normal function of cartilage" |
| Inflated discount: "15% off", "20% off", "25% off", "biggest discount", "exclusive deal", "limited time", "half price", "sale" (when the partner rate is exactly 10%) | ASA polices exaggerated savings claims; the partner code is **exactly 10%** | "10% off" / "£107 with my code (£119 RRP)" — the exact figure only |

**Negation/disclaimer exception:** `diagnose` / `treat` / `cure` inside a proper disclaimer ("this does not constitute a diagnosis", "not a substitute for medical advice", "for informational purposes only") is the *compliant* construction, not a breach. Do not write the prohibition as a sentence that itself contains a banned multi-word string (e.g. spell out "we are pre-launch on the clinical side" rather than quoting the false-availability phrase).

---

## 2. REVIEW — needs a human/Ewa decision (do not silently rewrite)

Not auto-banned, but flagged on every pass. These often sit on Keith's voice — surface, never edit unilaterally. Clinical/claims → Ewa; FM/business framing → Keith.

| Pattern | Why it's flagged |
|---|---|
| "improves your mood / energy / libido / sleep / focus / drive" | Unauthorised health claim — must use the exact §3 EFSA wording |
| "fix" / "fixed" / "fixes" / "fixing" (esp. retest copy) | Efficacy framing — use "find out how your levels have changed", never "fixed" |
| "deposit" / "£75" | The £75 founding-member deposit was **shelved 2026-05-08** — must not appear in new copy; FM list is non-cash |
| "magnesium" | Removed from the Daily Stack (V7.2, Apr 2026) — must not be presented as an ingredient or carry the old fatigue claim |
| "secure/securing/reserve/pay/payment/pre-order" within ~40 chars of "founding member / FM list / the list" | FM list is a non-cash email opt-in — no financial / "securing" language |
| "founding member" / "TRT" / "first cohort" | FM CTA retired 2026-06-04: low-T (T < 12, Kit 1/3) routes to a GP referral, no upsell, never an FM/TRT results CTA. Any FM/TRT/cohort framing surfaced from a result is prohibited; TRT stays future-conditional until CQC |
| An ingredient name within ~60 chars of "support/help/boost/improve/maintain/contributes/reduces" | The benefit must be the **exact** EFSA-approved wording for that ingredient (§3). No rephrasing or extension |
| "substitute for medical/GP/doctor advice" / "not a substitute" | Verify the medical-advice disclaimer is present and correctly worded |

---

## 3. EFSA approved claims — the only permitted supplement benefit wording

These are the **only** benefit statements allowed for these ingredients. Do not rephrase, extend, combine, or imply anything beyond the exact approved wording. Any ingredient not on this list + any benefit = fail.

| Ingredient | The only permitted claim | Products |
|---|---|---|
| Zinc | "Contributes to the maintenance of normal testosterone levels" | Daily Stack |
| Vitamin D3 | "Contributes to normal muscle function" | Daily Stack |
| Active B12 (Methylcobalamin) | "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function" | Daily Stack |
| Vitamin C | "Contributes to normal collagen formation for the normal function of cartilage" | Joint & Recovery Collagen |
| The silent botanical (§4) | **No approved EFSA claim. Never named. No claim of any kind.** | Daily Stack (undisclosed) |

> Magnesium's former "reduction of tiredness and fatigue" claim is **retired** (V7.2, Apr 2026 reformulation removed magnesium). Energy/fatigue messaging now flows only through Active B12's energy-yielding-metabolism claim.

---

## 4. The silent ingredient (absolute)

The Daily Stack contains a botanical with no approved EFSA health claim. It is a **silent ingredient**:

- **It must never be named** in any copy, email, social post, ad, affiliate brief, influencer talking point, results report, or any partner/external artefact — **anywhere, ever**, including inside a prohibition or "do not say" section. (The v2.2 PT/Influencer Brief breached this by printing the name in its own prohibition section — do not regress.)
- The rule is enforced by an **allowlist**, not a denylist: only the §3 EFSA-approved ingredients may be referenced, and only in their exact approved wording.
- If a customer/audience asks what is in the Daily Stack: partners use the scripted answer in the PT/Influencer Brief ("Zinc, vitamin D3, Active B12, and a few other ingredients — full label on the bottle and on andro-prime.com"). They do not improvise the ingredient list.
- **Severity:** naming it publicly = immediate permanent affiliate code revocation; in owned copy = a business-ending defect (the ASA complaint lands on Andro Prime).
- The **named internal definition** lives only in the compliance-controlled `03_compliance/CONTEXT.md` (and the scanner regex). This document deliberately does not reproduce the name, so `02_brand/` cannot become the leak vector. See §6 open question Q1.

---

## 5. Phase 0 / post-CQC boundary

The most important boundary in the business. Nothing in any output may imply regulated clinical services are live.

| Phase 0 — permitted | Not permitted until CQC registration is live |
|---|---|
| Non-regulated diagnostic kit sales | Regulated clinical intake |
| Supplement subscriptions | TRT prescribing |
| Founding-member list (non-cash email opt-in) | Confirmatory testosterone testing |
| Results reporting with the §3 approved wording | Clinical results delivery with prescriber sign-off |
| "Be first when we launch TRT" | "TRT is available" |
| Founding-member CTA: retired 2026-06-04. Low-T routes to GP referral, no upsell. Never surface an FM CTA from results. | Anything implying a prescription is being issued |

**Kit-scoping:** Kit 1 tests testosterone only — do not frame it as explaining general fatigue/energy (that is Kit 2 / Kit 3). **Results wording:** "Your results indicate…", never "You have…". **Retest:** "find out how your levels have changed", never "fixed/cured". **Founding-member:** non-cash, no payment, no deposit (shelved 2026-05-08), no contractual right to a future service, leave the list anytime.

---

## 6. Sign-off (compliance blockers #2 & #48 — CLOSED)

**APPROVED 2026-05-18.** This document now carries authority as the agreed
Keith ↔ Ewa prohibited-terms list. `03_compliance/CONTEXT.md` remains the law;
this restates it. Logged in `03_compliance/content-approval/` (CA-007).

| Role | Name | Decision | Date |
|---|---|---|---|
| Business owner | Keith Antony | **APPROVED** | 2026-05-18 |
| Clinical / claims | Dr Ewa Lindo | **APPROVED** (recorded on Keith's representation; direct countersignature recommended) | 2026-05-18 |

Outstanding-tasks blockers #2 ("Ewa sign-off on prohibited-terms.md") and #48
("Prohibited terms list agreed in writing between Keith and Ewa") are **closed**.

**Open questions — resolved at sign-off:**

1. **Silent-ingredient de-naming — RESOLVED.** This file stays **de-named**; §4 enforces the rule via the EFSA allowlist without printing the name. `03_compliance/CONTEXT.md` remains the single named internal definition.
2. **Canonical home — RESOLVED.** Stays at `02_brand/prohibited-terms.md` (the path the launch blockers reference); CONTEXT.md is the law.
3. **Inflated-discount enforcement — RESOLVED.** A HARD inflated-discount rule (">10% off", "biggest discount", "exclusive deal", "limited time", "half price") was added to `scan.js` 2026-05-18. The deterministic floor now catches it, alongside the partner briefs.

---

*Compiled: 2026-05-18 · Approved: 2026-05-18 (Keith + Ewa, CA-007) · Owner: Keith Antony · Law: 03_compliance/CONTEXT.md*
