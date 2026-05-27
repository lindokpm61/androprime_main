---
doc: author-bios
status: Keith approved 2026-05-27 / Ewa pending
owner: Keith Antony
consumed_by: lib/authors.ts (blog-template-prep ticket), Article schema author + reviewedBy fields, /authors/[slug] pages
last_updated: 2026-05-27
---

# Andro Prime — Author Bios

Single source of truth for Keith's and Ewa's bios as they appear in:

- `/authors/keith-antony` and `/authors/dr-ewa-lindo` author pages
- Article schema `author` and `reviewedBy` fields (Person blocks)
- Blog article byline + reviewer line
- Anywhere else a named-byline credential is rendered

If a bio needs to change, change it here and let the ticket bundle propagate. Do not edit copies inside `lib/authors.ts` or schema blocks directly.

---

## Keith Antony — Founder

**Status:** Approved by Keith 2026-05-27.
**Public name:** Keith Antony (used in all customer-facing copy and schema).
**Legal name:** Keith Lindo (used only in legal/compliance/entity docs — never on author pages).

### Long bio (author page body, ~250 words)

I spent two years being told I was normal.

My testosterone came back borderline. My GP said it wasn't worth treating. Probably stress. Within range for my age. I was tired by 2pm every day, training four times a week and getting nowhere, losing focus in meetings I used to run. Not myself. But apparently fine.

I pushed further. Got the full picture. Tested SHBG, Free T, the markers the standard panel skips. That's when I understood why the first test had missed it — Total testosterone tells you part of the story. It doesn't tell you how much is actually available to your body. Mine wasn't.

I got the right support. It changed everything.

I built Andro Prime because I lost two years to a process that should have taken two weeks. Thousands of men are in the same position right now, being told they're fine when they're not. The data exists. They just can't access it easily.

Now they can.

I write for Andro Prime about what I've learned navigating men's health diagnostics — the markers that matter, the questions to ask, and how to read your own results without a medical degree. Clinical content is reviewed by Dr Ewa Lindo, our GMC-registered medical lead.

### Short bio — Keith (byline tooltip / Person schema `description` field, ~30 words)

Founder of Andro Prime. Spent two years being told his test results were "normal" before tracking down what the standard panel was missing. Writes about navigating men's health diagnostics.

### Schema fields

| Field | Value |
| --- | --- |
| `@type` | `Person` |
| `name` | `Keith Antony` |
| `jobTitle` | `Founder, Andro Prime` |
| `worksFor` | `@id` reference to `${BASE_URL}/#organization` |
| `description` | Short bio (above) |
| `sameAs` | TBD — LinkedIn URL pending |
| `image` | TBD — non-corporate photo pending (same dependency as About page) |

---

## Dr Ewa Lindo — Medical Lead

**Status:** CV received 2026-05-27. Harley Street TRT training credential verified by Keith 2026-05-27 — Ewa attended and passed a TRT training course in October–November 2025; her CV simply hasn't been updated to reflect it. Bio still pending Ewa sign-off on final wording + outstanding data points (GMC number, LinkedIn, photo, course-name-for-compliance-file).

### Facts on file from CV (verified)

| Field | Value | Source |
| --- | --- | --- |
| Full name | Dr Ewa Lindo | CV header |
| Medical degree | Doctor of Medicine, Pomorska Medical Academy, Szczecin, Poland (21 Dec 1992) | CV Qualifications |
| UK registration route | LRCS Eng, LRCP Lond, LMSSA Lond — Society of Apothecaries of London (22 Oct 2000) | CV Qualifications |
| Additional credential | Diploma in Aesthetic Medicine, Levels 1 + 2 (Sept 2021) | CV Qualifications |
| Current practice | Salaried GP, St James Medical Practice, Croydon / New Addington (Sept 2022 – present) | CV Professional Experience |
| Prior long tenure | Salaried GP, Denmark Road Surgery, South Norwood (Nov 2013 – Aug 2022, 9 years) | CV Professional Experience |
| Total UK clinical experience | 20+ years | CV Profile |
| Hospital experience | A&E, paediatrics, O&G, surgical, medical (St Helier + Epsom General, 2001–2003) | CV Professional Experience |
| Special interests | Dermatology, minor surgery, joint injections, family planning, aesthetic medicine | CV Profile |
| Languages | English + Polish (fluent) | CV Personal Details |

### Harley Street TRT training — verified (resolved 2026-05-27)

Certificate received and substantiated. Full credential file: [03_compliance/credentials/ewa-trt-training-2025.md](../03_compliance/credentials/ewa-trt-training-2025.md).

| Field | Value |
| --- | --- |
| Course | Testosterone Replacement Therapy (TRT) Training |
| Provider | Harley Street TRT |
| Date completed | 26 November 2025 |
| Signed by | Dr Amit Sra (UK TRT Clinical Lead) + Dr Hina Pathak Sra |
| Certificate | PDF supplied 2026-05-27 — storage location TBC by Keith |

**The claim "Harley Street TRT-trained" is fully substantiated** and stays in use across all 39 files currently referencing it. Approved public phrasings and phrasings-to-avoid are documented in the credential file linked above.

### GMC verification (resolved 2026-05-27)

| Field | Value |
| --- | --- |
| GMC reference number | **4758565** |
| Registration status | Registered with a licence to practise (verified on public GMC register 2026-05-27) |
| Designated body | GP |
| Year of UK qualification | 2000 (matches CV: LRCS Eng / LRCP Lond / LMSSA Lond, Oct 2000) |
| Public verification URL | `https://www.gmc-uk.org/doctors/4758565` |

This URL goes into Person schema `sameAs` — single biggest E-E-A-T signal available.

### LinkedIn (resolved 2026-05-27 — deferred)

Ewa has a LinkedIn profile but it is currently empty. **Do not link it from Person schema yet.** An empty `sameAs` target is worse than omitting the field — crawlers follow the link expecting verification content, find none, and can read it as a weak-trust signal.

**Recommended action (low effort, high return):** ask Ewa to add three lines to her LinkedIn at her own pace — current role, current practice, "Medical Lead at Andro Prime." Once it has that minimal content, add the URL to `sameAs`. Until then the GMC link alone carries the signal.

### Pending data points

| # | Field | Why it matters | Source |
| --- | --- | --- | --- |
| 1 | Photo (professional, warm; clinical setting or consultation room) | Same placeholder as About page; needed for Person `image` schema and author page rendering | Photographer + Ewa |
| 2 | TRT certificate PDF — storage location confirmed | Need either commit-to-repo decision or secure shared drive link recorded in [credential file](../03_compliance/credentials/ewa-trt-training-2025.md) | Keith |
| 3 | LinkedIn profile populated (3-line minimum) | Unlocks LinkedIn `sameAs` schema link | Ewa (when convenient) |

### Long bio — working draft (pending Ewa review)

> Dr Ewa Lindo is a GMC-registered GP with over 20 years of UK clinical experience and additional Harley Street training in testosterone replacement therapy. She currently practises at St James Medical Practice in Croydon, and previously spent nine years at Denmark Road Surgery in South Norwood. Her hospital background spans accident and emergency, paediatrics, obstetrics and gynaecology, dermatology, and surgical and medical house posts at St Helier and Epsom General Hospitals.
>
> She is the medical lead for Andro Prime. Her role is to review the clinical content men receive in their results reports, sign off the recommendation logic the platform uses, and make sure the line between wellness and clinical care is drawn honestly. She will be the prescriber when our clinical programme launches following CQC registration.

### Short bio — Ewa (byline tooltip / Person schema `description` field, ~30 words)

GMC-registered GP with 20+ years UK clinical experience and Harley Street training in testosterone replacement therapy. Medical lead for Andro Prime; reviews all clinical content and signs off results-report copy.

### Schema fields (post-Ewa-review)

| Field | Value |
| --- | --- |
| `@type` | `Person` |
| `name` | `Dr Ewa Lindo` |
| `jobTitle` | `General Practitioner` |
| `worksFor` | St James Medical Practice, Croydon — confirm she's happy to name |
| `hasCredential` | UK practising registration via Society of Apothecaries (LRCS Eng, LRCP Lond, LMSSA Lond, 2000); GMC 4758565; Diploma in Aesthetic Medicine 2021; Harley Street TRT training (Nov 2025) |
| `sameAs` | `["https://www.gmc-uk.org/doctors/4758565"]` (LinkedIn deferred — see section above) |
| `knowsLanguage` | `[en-GB, pl]` |
| `description` | Short bio TBD post-review |
| `image` | TBD — professional photo pending |

---

## Byline format (rendered on every article)

```text
Written by Keith Antony, Founder, Andro Prime →
Reviewed by Dr Ewa Lindo, GMC-registered GP →
Published: [date] · Last updated: [date]
```

Each name links to its respective author page. Format locked per [blog-ai-seo-strategy.md:159](../06_marketing/seo-ai-search/blog-ai-seo-strategy.md#L159).
