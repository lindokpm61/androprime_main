# Approval Record — Tier 2 GEO outreach, two messages (v1)

| Field | Value |
|---|---|
| Register ID | CA-037 |
| Artefact path | `06_marketing/seo-ai-search/2026-08-15-tier2-outreach-route-verification.md` |
| Version | `v1` |
| Content type | Outbound partner/editorial outreach (external-facing) |
| Submitted by | Claude (drafted), on Keith's instruction |
| Submitted date | `2026-08-15` |
| Required signers | Keith (business). **Ewa not required** — see §3. |
| ClickUp | [`869ejbmb9`](https://app.clickup.com/t/869ejbmb9) (Approvals & Sign-offs) |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js <extracted copy>`
- **Run date:** `2026-08-15`
- **Result:** 🔴 **HARD: 0**   🟠 **REVIEW: 0**
- **Scanned on the extracted copy, not the containing document.** Scanning the whole artefact is the
  wrong test for a decision doc: internal prose discussing a remedy trips rules about promising one.
  The two messages were extracted and scanned alone.
- **Also checked:** zero em dashes; banned-term sweep clean (0 ashwagandha, 0 boost / optimise /
  restore / cure / treat).
- **Judgement pass:** done.
  - **EFSA:** N/A. No supplement ingredient is named anywhere in either message. The markers listed
    are diagnostic analytes, not ingredients carrying health claims.
  - **Silent ingredient (ashwagandha):** absent.
  - **Phase-0 boundary:** held, and stated explicitly rather than by omission. *"Any result that needs
    a doctor, low testosterone included, goes to your own GP and earns us nothing"* is a denial of
    clinical service. Neither message uses the word TRT at all.
  - **FM-CTA gate:** N/A, no founding-member mention.
  - **Retest framing:** N/A, no retest or efficacy claim.
  - **Provenance:** prices, marker lists, turnaround and lab wording are lifted from the live approved
    surfaces (`public/llms.txt`, `04_products`), not written fresh. *"Recommendation logic approved by
    a GMC-registered GP"* is inherited **verbatim from CA-036**, sent the same day.
- **Disposition of every HARD hit in the sent copy:** none. There are none.

⚠️ **Scanning THIS RECORD returns 4 HARD / 2 REVIEW, and every one is the documented exception.**
`ashwagandha` ×2, `cure`, `treat` and `TRT` ×2 all appear in the evidence text above, in sentences
whose purpose is to record that those terms were searched for and are **absent** from the copy
("banned-term sweep clean (0 ashwagandha…)", "silent ingredient: absent", "neither message uses the
word TRT"). The template names this case: *a rulebook quoting banned terms to forbid them is the
documented exception, state so explicitly if that applies.* It applies. **Nothing here ships.**

This is the second instance today of the same pattern and it is worth naming: **a compliance artefact
scanned as if it were copy will always fail, because describing a rule requires uttering the thing the
rule forbids.** The Kit 1 decision doc tripped the retest-efficacy rule eight times on the word "fix"
for the same reason. **The correct unit of scan is the extracted customer-facing copy, never the
document that discusses it** — which is how §1 above was run.

**Cleaner than CA-036**, which carried 2 REVIEW for the `TRT` token flagged regardless of polarity.
These two messages avoid the token entirely by naming the condition rather than the therapy.

## 2. Items flagged for human decision

None. The deterministic floor is clean and the judgement pass raised nothing.

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| — | — | — | — | n/a |

## 3. Conditions of approval

1. **Ewa is not required, and the reasoning is recorded rather than assumed.** Neither message makes a
   clinical, diagnostic or efficacy claim; both describe what the kits measure, what they cost and
   what the report contains, all from already-approved surfaces. The one clinically-adjacent sentence
   is a **denial** of service that routes to the reader's own GP. This is the same basis on which
   CA-036 went out on Keith's signature.
2. **Routes are verified, not assumed.** This is the condition that matters, because Tier 1 lost two
   of five targets to unverified routes and maleoptimal turned out to have three dead addresses
   including the one behind its own form.
   - `hello@offshift.co.uk`: in **rendered visible text** on `/contact`, verified 2026-08-15.
   - `bloodtests.head-to-head.uk/contact`: a form with an explicit **"Suggest a Provider"** subject
     option and page copy asking *"want to get featured on our site?"*. **An invited route.** No
     honeypot and no captcha, so nothing is circumvented by submitting it.
3. **Delivery must be evidenced, not assumed.** Record the message id for the email and watch for a
   bounce; record the form's response for head-to-head. A form that returns a success state is not
   evidence of delivery, which is the maleoptimal lesson.
4. **A listing is not a citation.** Re-run the `track` sweep if either listing goes live.

## 4. Signature block — humans only

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | — | **NOT REQUIRED** (see §3.1) | — | — |
| Business (Keith) | Keith Lindo | **APPROVED** | Cleared to send | 2026-08-15 |
| Contractual (Solicitor) | — | N/A | — | — |

## 5. Outcome

- Final decision: **APPROVED 2026-08-15**
- Register updated: `2026-08-15`
- **Also ruled by Keith the same day, recorded here because it is part of the same decision:**
  **welzo.com, allhealthstore.com and bloodtestcompare.co.uk are DROPPED from Tier 2.** welzo is a
  competitor whose "ranked by a doctor" page lists only its own 13 products and names no rival;
  allhealthstore is welzo-owned (JSON-LD contact `hello@welzo.com`) and its round-up ranks Welzo #1
  "Best Overall"; bloodtestcompare has no contact route of any kind. **`truevitals.co.uk` is recorded
  as do-not-pitch** despite being the most-cited uncontacted domain in the 2026-08-15 baseline: it is
  a vendor, and its citation count is exactly what pulled welzo and lolahealth onto the list.
- Notes: sends and their evidence are logged in the artefact and in `06_marketing/STATE.md`.
