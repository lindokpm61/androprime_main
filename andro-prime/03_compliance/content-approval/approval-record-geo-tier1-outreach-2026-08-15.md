# Approval Record — GEO Tier 1 third-party outreach emails (v2, kit-offer removed)

| Field | Value |
| --- | --- |
| Register ID | CA-036 |
| ClickUp | [`869ejaxwx`](https://app.clickup.com/t/869ejaxwx) — Approvals & Sign-offs, status **`approved`** 2026-08-15 |
| Artefact path | `andro-prime/06_marketing/seo-ai-search/2026-08-15-tier1-outreach-filled.md` |
| Version | `v2 (2026-08-15, free-kit offer removed per Keith)` |
| Content type | `outbound partner/editorial outreach email (external-facing copy)` |
| Submitted by | `Claude (drafted), Keith Antony (sender)` |
| Submitted date | `2026-08-15` |
| Required signers | `Keith` |

**Why Ewa is not a required signer.** The emails carry no clinical claim. They name markers, state
the lab accreditation in its approved form, and describe the GP as approving the recommendation
logic rather than individual results. There is no threshold, no result interpretation, and no
symptom claim. The only clinical-adjacent question, whether the GP wording is correct, was settled
by the standing rule in `03_compliance/CONTEXT.md` (Red-Flag table, "GP-built report" row) and is
applied verbatim. Business sign-off only.

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js andro-prime/06_marketing/seo-ai-search/2026-08-15-tier1-outreach-filled.md`
- **Run date:** `2026-08-15` (run twice: once on v1, again on v2 after the kit-offer removal)
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 2`
- **Judgement pass:** `done` — checked:
  - **EFSA wording:** N/A. No supplement or ingredient is named in any of the four emails.
  - **Silent ingredient:** absent. `ashwagandha` returns zero hits.
  - **Phase-0 boundary:** held, and stated explicitly in the treatcompare email because that site
    vets against the CQC register, where silence would read as an implied claim.
  - **FM-CTA gate:** N/A. No founding-member offer, no deposit, no waitlist CTA appears.
  - **Retest framing:** compliant. "retest later and compare against your own numbers" describes a
    customer action, not a live longitudinal tracker.
  - **UKAS wording:** approved form only, "analysed by a UKAS ISO 15189-accredited UK lab". No
    instance of "UKAS-accredited report" or any claim that Andro Prime holds the accreditation.
  - **Vitall:** not named anywhere, per blog-rule 8. The lab is described by its accreditation.
  - **House style:** zero em dashes, straight apostrophes throughout.
- **Disposition of every HARD hit:** `N/A — zero HARD hits in both runs.`

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
| --- | --- | --- | --- | --- |
| `2026-08-15-tier1-outreach-filled.md:~75` | "We do not prescribe, we do not offer TRT, and we hold no CQC registration because we carry out no regulated activity." | Scanner flags the token `TRT`. Here it sits inside an **explicit denial of availability**, which is the compliant direction, and it is stated to a site that vets against the CQC register. Removing it would make the omission itself the risk. | Keith | ☑ **CLEAR** — covered by Keith's APPROVED signature, 15/08/2026 |
| `2026-08-15-tier1-outreach-filled.md:205` | "No clinical or TRT service implied as live." | Not payload. This is the compliance commentary section of the artefact, describing the rule being applied. Never sent. | Keith | ☑ **CLEAR** — covered by Keith's APPROVED signature, 15/08/2026 |

Both are the same known scanner behaviour: the `TRT` token is flagged regardless of polarity. Neither
is a claim of availability.

## 3. Conditions of approval

1. **Condition already met.** Keith's approval on 2026-08-15 was conditional on removing the
   *"I can send you a free kit to try and review yourselves"* offer from all four emails, on the
   grounds that the kits are essentially the same as competitors' and the offer sells the commodity
   rather than the position. Removed from all four; the only surviving mentions are in the ruling
   section that records why. **A second, sharper reason was found while applying it:** treatcompare
   states "No provider pays to be listed", so a free kit offered there reads as an inducement to the
   one target whose credibility depends on refusing them.
2. **Approval covers the four emails as written.** Any per-recipient edit at send time (a named
   contact, a changed page title, a reply) is outside this approval. Material changes to the claims,
   prices or lab wording need a fresh pre-flight.
3. **Prices and markers are true as at 2026-08-15**: £99 / £119 / £179, 2 to 5 working days from lab
   receipt. If any changes before sending, the emails change with them.
4. **lolahealth.com is not to be contacted** under this approval. It was dropped from Tier 1 on
   2026-08-15 (no comparison page; a direct competitor). No email exists for it.
5. **maleoptimal page title** was resolved by search, not direct fetch, because the site returns 403.
   It is "Best Home Blood Test UK 2026: 6 Kits Compared (Medichecks Wins)". Worth an eyeball at send.

## 4. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and
date. Until every required row is signed, the register stays PENDING.

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
| --- | --- | --- | --- | --- |
| Clinical / claims (Ewa) | — | not a required signer (see header) | — | — |
| Business (Keith) | Keith Lindo | APPROVED | | 15/08/2026 |
| Contractual (Solicitor) | — | not a required signer | — | — |

> ✅ **Signed by Keith Lindo on 15/08/2026, in his own hand.** The row above was written by the named
> human, not by automation, per the record template. Approval was conditional on the free-kit removal
> and that condition was met before signing. The legal name is used here because this is a signature
> block; "Keith Antony" is the public-facing pseudonym and is what the emails themselves are signed
> with.

## 5. Outcome

- Final decision: `APPROVED (Keith Lindo, 15/08/2026)`
- Register updated: `2026-08-15`
- Notes: Artefact is `06_marketing/seo-ai-search/2026-08-15-tier1-outreach-filled.md`. Supersedes the
  unfilled template in `geo-third-party-presence-outreach.md`, whose 2026-07-13 pre-flight covered
  the bracketed template rather than any sendable copy. Tracker rows updated in the same commit.
