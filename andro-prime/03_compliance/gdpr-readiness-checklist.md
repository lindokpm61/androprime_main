# GDPR Readiness Checklist — Phase 0 Launch

**Last updated:** April 2026

---

## 1. ICO Registration (mandatory before processing any personal data)

- [ ] Go to ico.org.uk/for-organisations/data-protection-fee/register/new-registration/
- [ ] Complete the self-assessment (confirms tier and fee amount)
- [ ] Pay the data protection fee: £52/year for Tier 1 (micro-organisation: <10 staff, turnover <£632k). £5 discount if paying by direct debit.
- [ ] Record the ICO registration number
- [ ] Update the privacy policy at androprime.co.uk/privacy with the registration number (currently placeholder: "[ICO NUMBER]")
- [ ] Set a calendar reminder for annual renewal (failure to renew: up to £4,000 penalty on top of the fee)

**Note:** Registration is not an approval. The ICO does not review your practices. It is a legal requirement to be on the register if you process personal data. Processing without registration is a criminal offence under the Data Protection Act 2018.

---

## 2. Data Processing Agreements (required before launch)

Data processing agreements must be in place with every third-party processor before you share personal data with them.

- [ ] Thriva Solutions — DPA covering sample data, results, clinical governance. Thriva referenced as processor in privacy policy. Request their standard DPA or issue yours.
- [ ] Stripe — Stripe's DPA is available on their website. Review and confirm it covers UK GDPR requirements.
- [ ] Supabase — Supabase offers a standard DPA. Review and confirm. Confirm data centre location is UK or EU.
- [ ] Customer.io — US-based. Requires UK IDTA (International Data Transfer Agreement) standard contractual clauses in addition to their DPA. Do not pass any data to Customer.io until these are in place.

---

## 3. Consent Mechanism (required before first customer)

- [ ] Build explicit consent checkbox into the checkout flow. Not pre-ticked. Cannot be buried in terms and conditions.
- [ ] Consent text must specifically reference: collection of blood sample data, storage of biomarker results, display of results on dashboard, use of results to present supplement recommendations.
- [ ] Record consent with timestamp in database (Supabase).
- [ ] Build a withdrawal mechanism: email to privacy@androprime.co.uk triggers consent withdrawal and data deletion within 30 days.

---

## 4. DPIA (completed)

- [x] Phase 0 DPIA drafted: `03_compliance/dpia/phase0-dpia.md`
- [ ] Keith Lindo to review and sign off
- [ ] Dr Ewa Lindo to review and sign off
- [ ] Review date set: October 2026 (or earlier if processing changes)

---

## 5. Privacy Policy (drafted, needs updates)

- [x] Privacy policy drafted: `03_compliance/privacy/privacy-policy.md`
- [ ] Insert ICO registration number
- [ ] Insert registered company address
- [ ] Insert company registration number
- [ ] Confirm Supabase data centre location and update data transfers section if needed
- [ ] Review biomarker list in Section 2 (Kit 2 panel is changing due to magnesium removal)
- [ ] Publish to androprime.co.uk/privacy before launch

---

## 6. Subject Access Requests

- [ ] Confirm process: customer emails privacy@androprime.co.uk, response within one calendar month
- [ ] Decide format for data export (CSV, PDF, or JSON from Supabase)
- [ ] Test the process end-to-end before launch (even if manual)

---

## 7. Breach Response

- [ ] Document a simple breach response procedure: who is notified internally, how the ICO is contacted (within 72 hours), how affected customers are notified
- [ ] Confirm Thriva's breach notification obligations are in their DPA (they notify you, you notify ICO and customers)

---

## Order of Operations

1. Register with ICO (10 minutes, do it now)
2. Get DPAs signed with Thriva, Stripe, Supabase, Customer.io
3. Keith and Ewa sign off the DPIA
4. Build consent checkbox into checkout
5. Finalise and publish privacy policy
6. Test subject access request process
7. Document breach response procedure
8. Launch
