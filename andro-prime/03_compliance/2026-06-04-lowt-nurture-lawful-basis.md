# Lawful-basis approval — low-T result storage + nurture

**Status:** APPROVED by Keith Lindo (Data Controller) 2026-06-04, as an interim business decision.
**Solicitor review:** DEFERRED to post-launch (solicitor will not advise until after launch — ClickUp task 06 `869d99kzh` remains open and is the post-launch confirmation step). Keith is proceeding now on the consent basis below at his own risk, accepting that the solicitor may refine it.
**Owner workspace:** `03_compliance`. Compliance authority: `03_compliance/CONTEXT.md` (Guardrail 1).
**Related:** `04_products/results-engine/2026-06-04-low-t-routing-decision.md` §4, `dpia/phase0-dpia.md`, `privacy/privacy-policy.md`.

---

## What is being approved

Using a customer's **low testosterone result (T < 12 nmol/L)** to (1) store the result, (2) segment the customer, and (3) send a **consent-gated nurture programme** keeping the high-intent low-T lead warm for the future (post-CQC) clinical/TRT service.

This is a **new purpose** for special-category (health) data, distinct from the existing purpose of storing the result to deliver the customer's test. It does not escape the lawful-basis requirement — it makes it central.

## Lawful basis (approved)

| Element | Basis |
|---|---|
| General processing | **Article 6(1)(a)** — consent |
| Special-category (health) data | **Article 9(2)(a)** — explicit consent |

The result-delivery purpose (store + display the test) is already covered by the existing point-of-purchase consent (see DPIA §1). This approval covers **only the new segment + nurture purpose**, captured by a **separate, explicit, granular opt-in** at the "keep my results and stay in touch" point — not bundled with any other consent, not pre-ticked.

## Conditions of this approval (all mandatory)

1. **Separate explicit opt-in.** The nurture consent is its own un-bundled, un-pre-ticked checkbox/action, distinct from the test-processing consent and from general marketing consent. Withdrawable at any time.
2. **Consent record stored.** What was consented to, the consent text version, and a timestamp, retained for accountability (UK GDPR Art 7(1)).
3. **Nurture fires only on explicit consent.** No nurture send to any low-T customer who has not given this specific opt-in. The `low_testosterone` segment trait alone is NOT a basis to nurture.
4. **Content constraint (Ewa, 2026-06-04).** Strictly education + "we'll let you know." **No treatment or TRT promises, no supplement claims for low T.** Every nurture email through compliance-preflight + Ewa before activation.
5. **CQC substance-over-form.** The programme must be genuine education/relationship, not disguised pipeline-building for a regulated service. No implication that a clinical/TRT service is available.
6. **Solicitor backstop.** This basis is re-confirmed (or amended) by the solicitor post-launch. If the solicitor disagrees, the programme pauses pending fix.

## Open prerequisite flagged to Keith (not resolved by this note)

**Customer.io receives a health-derived flag.** `buildCioTraits()` already sets a `low_testosterone` trait on the Customer.io profile. A `low_testosterone: true` flag reveals a health condition = special-category data sent to a US processor. The current DPIA states "Customer.io does not receive biomarker results" — this is arguably already inconsistent and the nurture makes it load-bearing. Resolve before nurture activation: (a) explicit consent must cover this transfer, (b) UK IDTA / SCCs with Customer.io must be in place (already an outstanding DPIA action), (c) the Customer.io DPA must cover special-category data, OR (d) orchestrate the nurture without sending the health flag to Customer.io. See DPIA §4 (new risk row) and §5 (outstanding actions).
