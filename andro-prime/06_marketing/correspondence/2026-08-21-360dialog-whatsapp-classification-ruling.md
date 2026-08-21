# 360dialog — WhatsApp Business Platform classification enquiry and reply

**Status:** CLOSED — reply received 2026-08-21. Ruling is unfavourable. See the verdict block in `../STATE.md`.
**Counterparty:** 360dialog GmbH (WhatsApp Business Solution Provider), Tölzer Strasse 1, 82031 Grünwald, Germany.
**Our side:** keith@andro-prime.com → support@360dialog.com.

---

## 1. Enquiry sent — 2026-08-20, 14:21

> Hello,
>
> I am evaluating BSPs ahead of onboarding to the WhatsApp Business Platform and need a policy ruling before committing, because the answer decides whether the channel is viable for us at all.
>
> We are Andro Prime, a UK company. UK customers only, all recipients 18+. Two product lines:
>
> 1. At-home blood sample collection kits sold direct to consumers, £99 to £179. The customer collects a capillary sample at home and posts it to a UKAS ISO 15189 accredited partner laboratory. We are not a clinic, we provide no treatment, we dispense nothing, and we hold no CQC registration.
>
> 2. A range of UK food supplements (vitamin D3, B12, collagen, omega-3), sold as a monthly subscription, £29.95 to £54.95. Under UK law these are foods regulated under food law, not medicines. They carry EFSA authorised claims only and make no medicinal claims.
>
> Five questions:
>
> 1. How does Meta classify each of those two product lines for WhatsApp Regulated Vertical purposes? Specifically, does either fall inside "Medical and healthcare products"?
>
> 2. The United Kingdom does not appear on the Allowed Countries list for the Over-the-Counter Drugs vertical in the published Business Messaging Policy. If our food supplements are treated as OTC, does that make UK promotional messaging about them impermissible?
>
> 3. Assuming no Commerce Catalog and no WhatsApp Payments, with all purchases completed on our own website via a link: is promotional and marketing template messaging about either product line permitted to UK recipients?
>
> 4. If the classification is unfavourable, is transactional and utility messaging to existing customers still permitted (dispatch notification, delivery, an account notification containing no health data)?
>
> 5. Your documentation says the business website is reviewed by the WhatsApp Integrity team at onboarding. Can you tell me in advance how andro-prime.com is likely to be assessed against these categories, or run that check before we commit to an account?
>
> Please also tell me whether you can obtain written confirmation from Meta on question 1 rather than a best-effort interpretation.
>
> To be explicit about what we would not do: no catalog, no in-chat payments, no health or biomarker data in any message, and no messaging to anyone under 18.
>
> Thanks,
> Keith Antony
> Andro Prime

## 2. Reply received — 2026-08-21, 11:18, Vladimir Zakharov, 360dialog support

> Hello,
>
> Thank you for reaching out to us.
>
> My name is Vladimir, 360dialog support.
>
> I understand that you need clear guidance on Meta's policies regarding your product lines before proceeding with onboarding to the WhatsApp Business Platform. Based on the WhatsApp Business Messaging Policy, here is the information regarding your questions:
>
> 1. Classification: Meta broadly classifies home testing kits and ingestible supplements under "Medical and healthcare products". While Meta explicitly bans unsafe ingestible supplements, standard supplements and diagnostic kits are still governed by the overarching medical and healthcare restrictions.
>
> 2. OTC in the UK: You are correct that the United Kingdom is not on the Allowed Countries list for Over-the-Counter (OTC) messaging. Therefore, if your supplements are classified as OTC, promotional messaging for them in the UK is impermissible.
>
> 3. Promotional Messaging: Since the UK is not an allowed region for OTC and medical products are generally restricted, promotional and marketing templates about these products are prohibited to UK recipients, regardless of whether you use commerce features or complete the sale externally on your website.
>
> 4. Utility Messaging: We must be clear that if Meta classifies your core business under a prohibited vertical, they may restrict the WhatsApp Business Account (WABA) entirely. While Meta allows some pharmacies to send messages for grocery or convenience items, using the platform to facilitate the exchange of prohibited healthcare products—even via utility messages like delivery notifications—is not allowed.
>
> 5. Advance Review and Written Confirmation: Meta's Integrity team only reviews businesses and their assets during the actual onboarding process and when message templates are submitted.
> However, the main concern might be the nature of the business activity. The website indicates that Andro Prime offers at-home blood-testing/diagnostic kits, including testing for testosterone and other health biomarkers. The service also involves the collection and laboratory analysis of blood samples and the provision of health-related results and recommendations.
>
> While the WhatsApp Business Policy does not prohibit healthcare services in general, it does contain restrictions relating to medical and healthcare products and other regulated healthcare activities. Given that the business sells diagnostic testing kits and provides medical/health-related testing and analysis, the activity requires additional policy review before we can confirm eligibility.
>
> For more details on these restrictions, you can review the official WhatsApp Business Messaging Policy here:
>
> https://whatsappbusiness.com/policy/
>
> But I need to mention that these restrictions are not at the BSP-level, they are implied by Meta directly, so with either BSP, there's a chance Meta will restrict the business, or block the accounts.
>
> Please let me know if you have any questions.
>
> Kind regards,
> Vladimir
>
> Vladimir Zakharov,
>
> 360dialog GmbH, Tölzer Strasse 1, 82031 Grünwald, Germany

---

## 3. Our assessment of the reply (2026-08-21)

**What it is.** A BSP support agent's best-effort reading of Meta's published policy. It is **not** a Meta ruling. The written-confirmation request in the last line of our enquiry was not answered: no written Meta confirmation was offered, obtained, or described as obtainable.

**Answers by question:**

| Q | Asked | Answered | Substance |
| - | ----- | -------- | --------- |
| 1 | Classification of each line | Yes, unfavourably | Both the kits and the supplements sit inside "Medical and healthcare products" |
| 2 | Does the UK OTC country gap bite | Yes | Confirmed: if supplements are OTC, UK promotional messaging is impermissible |
| 3 | Promo permitted with all sales off-platform | Yes, unfavourably | Prohibited to UK recipients **regardless** of catalog, payments, or off-platform checkout |
| 4 | Does utility/transactional survive | Yes, unfavourably | No, and the stated exposure is **WABA-level restriction**, not a lost feature |
| 5 | Advance Integrity review / written Meta confirmation | Partly | No advance review exists; review happens at onboarding and at template submission. **Written confirmation: not answered.** |

**Three points where the answer is looser than the policy text, recorded so this is not mistaken for a ruling:**

1. "Meta broadly classifies…" — "broadly" is the agent's inference, not a quoted policy line. Meta's text hangs the Regulated Vertical on the product being offered, and it does not enumerate at-home sample-collection kits.
2. Q3 merges two distinct rules (the OTC country gating, which is explicit, and the medical-and-healthcare prohibition, which has no country list) into one answer, then applies the conclusion to both product lines at once.
3. Q4 reasons from "facilitating the exchange of prohibited healthcare products" to a dispatch notification containing no health data. That is an extension of the policy, not a citation of it.

**Why none of that changes the outcome.** The decisive line is the last one: the restriction is Meta-level, it applies at whichever BSP we pick, and the enforcement mode is account restriction or block. Combined with (a) no advance review available, (b) no written confirmation obtainable, and (c) the Integrity review landing on a website that visibly sells testosterone biomarker testing, the channel cannot be de-risked before committing. There is no favourable reading of the ambiguity in which building on it is safe.

**Not affected by this ruling.** Keith's personal one-to-one WhatsApp messages to friends, gym contacts and PTs (warm-list build, partner comms) are consumer-app messages, not WhatsApp Business Platform or WhatsApp Business App traffic, and sit outside the Business Messaging Policy's scope. Those plans stand: see `../../10_launch-ops/pre-launch-waitlist-build-plan-2026-05-08.md` and the partner ICP docs.
