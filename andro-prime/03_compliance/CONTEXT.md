# Compliance — Context

**Regulatory framework:** UK — ASA CAP Code, EFSA health claims regulation, UK GDPR (UK GDPR / DPA 2018), CQC (post-CQC only), Consumer Rights Act 2015
**Owner workspace:** `03_compliance`
**Integration:** All copy, product, marketing, and engineering work that touches regulated language, personal data, deposit terms, or clinical boundaries must be cleared through this workspace before publishing.

This workspace governs wording risk, privacy, data governance, and regulatory boundary checks for Andro Prime. Two operating modes exist in parallel. Do not conflate them.

---

## Directory Structure

```text
03_compliance/
├── claims-and-labels/          ← EFSA approved claims, ingredient-level wording, label review
├── content-approval/           ← Approval log for copy, social, ads, email before publish
├── deletion-policy/            ← Data deletion procedures and retention schedules
├── deposits/
│   └── supplement-pre-order-terms.md   ← Pre-order deposit T&Cs (Gate 0A)
├── dpia/
│   └── phase0-dpia.md          ← Data Protection Impact Assessment for Phase 0
├── lab-partner-data-governance/← Thriva data sharing agreement, sub-processor schedule
├── privacy/
│   └── privacy-policy.md       ← Published privacy policy (UK GDPR compliant)
├── brand-licence/
│   └── inter-company-brand-licence.md  ← IP licence between operating entities
├── data-controller-position.md ← Controller vs processor positions for all data flows
├── gdpr-readiness-checklist.md ← Pre-launch GDPR checklist
├── pre-launch-checklist.md     ← Cross-workspace compliance gate before go-live
└── terms-and-conditions.md     ← Site-wide T&Cs
```

---

## How to Work Here

### Reviewing copy for compliance

1. Identify the content type: supplement claim, kit claim, founding member CTA, results copy, or TRT reference.
2. Check against the Red-Flag Language table below.
3. Check ingredient claims against the EFSA Approved Claims table below.
4. Apply the Phase 0 / post-CQC boundary check — if the copy implies clinical services are live, it fails.
5. Log approved copy in `content-approval/` with the reviewer name and date.

### Reviewing a new product or feature

1. Read the relevant product spec in `04_products/`.
2. Identify any data processing, health claims, or financial terms it introduces.
3. Update `dpia/phase0-dpia.md` if new personal data flows are involved.
4. Update `data-controller-position.md` if a new processor relationship is introduced.
5. Flag to Keith before implementation proceeds if the feature crosses into clinical territory.

### Updating privacy or terms documents

1. Read the current file before editing — these are published documents, not drafts.
2. Record the change reason and date in a comment at the top of the file.
3. If the change affects data subject rights or retention periods, re-run the GDPR readiness checklist.
4. Notify Keith before publishing any update to the live privacy policy or T&Cs.

### Adding a new sub-processor or data partner

1. Add the entity to `lab-partner-data-governance/` with: name, role, data accessed, legal basis, DPA reference.
2. Update `data-controller-position.md`.
3. Update the privacy policy's sub-processor schedule if required.

---

## Red-Flag Language Reference

Words and phrases that require immediate review before use in any published output.

| Term | Risk | Permitted alternative |
| --- | --- | --- |
| "diagnose" / "diagnosis" | Implies medical act | "Find out what your levels are" |
| "treat" / "treatment" | Medicinal claim | Remove entirely in Phase 0 |
| "cure" | Medicinal claim | Remove entirely |
| "You have low testosterone" | Definitive medical statement | "Your results indicate..." |
| "TRT is available now" | False availability claim | "Be first when we launch" |
| "clinically proven" | Misleading without RCT reference | Remove or cite specific study |
| "Collagen heals your joints" | Medicinal claim | "Vitamin C contributes to normal collagen formation for the normal function of cartilage" |
| "B12 improves your mood" | Unauthorised health claim | "Contributes to normal psychological function" |
| "Ashwagandha" (any context) | No approved EFSA claim; ASA exposure | Silent ingredient — never mention |
| "fix" / "cure" in retest copy | Implies therapeutic outcome | "Find out how your levels have changed" |
| Founding member CTA on Kit 2 results | False trigger — no testosterone confirmation | Only trigger when T < 12 nmol/L confirmed |

---

## EFSA Approved Claims Reference

Only these claims are permitted for the listed ingredients. Do not rephrase, extend, or imply anything beyond the approved wording.

| Ingredient | Approved claim | Products |
| --- | --- | --- |
| Zinc | "Contributes to the maintenance of normal testosterone levels" | Daily Stack |
| Vitamin D3 | "Contributes to normal muscle function" | Daily Stack |
| Active B12 (Methylcobalamin) | "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function" | Daily Stack |
| Vitamin C | "Contributes to normal collagen formation for the normal function of cartilage" | Joint & Recovery Collagen |
| Ashwagandha KSM-66 | **No approved EFSA claim. Silent ingredient. Do not mention.** | Daily Stack (undisclosed) |

> **V7.2 reformulation note (April 2026):** Magnesium has been removed from the Daily Stack formulation. The previous Magnesium fatigue claim ("contributes to the reduction of tiredness and fatigue") is no longer applicable to any Andro Prime product. Do not use this claim in copy. Energy/fatigue claims now flow through Active B12's energy-yielding metabolism claim — which has the additional benefit of being directly tied to a measured biomarker (Active B12 in Kit 2 and Kit 3).

---

## Phase 0 vs Post-CQC Boundary

This is the most important boundary in the business. It must be enforced in every output.

| Phase 0 — Permitted | Post-CQC Only — Not permitted until CQC registration is live |
| --- | --- |
| Non-regulated diagnostic kit sales | Regulated clinical intake |
| Supplement subscriptions | TRT prescribing |
| Founding member deposit collection | Confirmatory testosterone testing |
| Results reporting with approved wording | Clinical results delivery with prescriber sign-off |
| "Be first when we launch TRT" | "TRT is available" |
| Founding member deposit CTA (T < 12 nmol/L only) | Anything implying a prescription is being issued |

If any task risks crossing this line: stop. Route to Keith before proceeding.

---

## Special Cases

**Founding member deposit CTA:** Only triggered when Kit 1 or Kit 3 result shows testosterone < 12 nmol/L. Never infer low T from Kit 2 energy or recovery markers alone. The deposit is refundable and applied as credit on TRT sign-up — this must be stated clearly in all deposit-related copy.

**Ashwagandha silent ingredient:** Ashwagandha KSM-66 is in the Daily Stack. It has no approved EFSA claim. It is a silent ingredient — do not name it in any copy, email, social, affiliate brief, or influencer talking points. All affiliate and influencer partners must be briefed in writing before code issuance. If a partner makes a public claim about it, the ASA complaint lands on Andro Prime.

**Results copy scoping:** Kit 1 tests testosterone only. Do not frame Kit 1 as explaining general fatigue or energy symptoms. That framing belongs to Kit 2 and Kit 3.

**Retest framing:** Always use "Find out how your levels have changed." Never use language that implies the supplement fixed or cured anything.

**pre-launch-checklist.md:** This is a cross-workspace gate document. It must be reviewed and signed off by Keith before any page, email campaign, or automation goes live. It is not a marketing document — it is a go/no-go gate.

---

## Regulatory Body Reference

| Body | Scope | Relevant to |
| --- | --- | --- |
| ASA / CAP | Advertising claims, health claim substantiation | All marketing copy, email, social, ads |
| EFSA | Health claim approvals for food supplements | Supplement product copy and labelling |
| ICO (UK GDPR / DPA 2018) | Personal data processing, consent, retention | All data flows, privacy policy, DPIA |
| CQC | Regulated health service registration | Post-CQC clinical operations only |
| MHRA | Medicinal product classification | Any copy that risks medicinal claim territory |
| Consumer Rights Act 2015 | Deposit terms, refund obligations | Founding member deposit T&Cs |

---

## Do Not Use This Workspace For

- General marketing ideation without a compliance angle
- Product design unless the issue is regulatory
- UI or engineering implementation unless data governance is the focus
- Storing published content (content lives in `06_marketing/` and `09_website-app/`)
