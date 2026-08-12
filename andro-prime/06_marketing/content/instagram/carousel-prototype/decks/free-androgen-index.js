/*
 * Deck: free-androgen-index
 * Source: content/blog/free-androgen-index.mdx (published 2026-07-14, Ewa-reviewed)
 *
 * FRAMING IS LOAD-BEARING AND WAS CORRECTED ONCE ALREADY. UK labs report a
 * calculated free testosterone for men and report FAI for women; FAI in men is a
 * rough proxy, not the number to chase (2026-07-30 ruling, recorded in
 * ../slide-8-closes.md). These slides are sourced from the ARTICLE. Do not
 * source them from 04_products/kits/kit-1-testosterone-health-check.md:72, which
 * is on record as contradicting thresholds.md on exactly this point.
 */

module.exports = {
  slug: 'free-androgen-index',
  /* SHBG is a Kit 1 marker, and Kit 1 is testosterone only. */
  kit: 'testosterone',
  closeBHeadline: 'SHBG is in the Testosterone Health Check.',

  /* The frame the video cover is built from: this topic's headline inpainted
   * onto the newspaper. The words live in covers.js and are set once, for the
   * newsprint and the plate both. */
  coverPhoto: 'cover-free-androgen-index.png',

  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'Two different numbers.',
      body: 'Your GP measured how much testosterone is in your blood. What governs how you feel is how much of it your body can actually reach. Those aren’t the same number.',
    },
    {
      type: 'list',
      eyebrow: 'The split',
      ghost: '45',
      headline: 'Where your testosterone is',
      items: [
        ['01', 'About 45% is bound tightly to SHBG'],
        ['02', 'Most of the rest is loosely held by albumin'],
        ['03', 'Only 1 to 3% is completely free'],
        ['04', 'Tightly bound testosterone is present, not available'],
      ],
      note: 'The total counts the locked-up and the free as if they were the same thing.',
      source: 'Lab Tests Online UK',
    },
    {
      type: 'statement',
      eyebrow: 'The trap',
      ghost: '',
      headline: 'High SHBG, shrinking free fraction.',
      body: 'More of your total gets tied up, and your total can read comfortably mid-range the whole time. That’s the gap between “your total is normal” and “you still feel off”.',
    },
    {
      type: 'statement',
      eyebrow: 'The correction',
      ghost: '',
      headline: 'UK labs don’t report FAI for men.',
      body: 'They report a calculated free testosterone instead, and report FAI for women. If you already have an FAI on a report, read it as a rough signal, not as your usable number.',
      source: 'North Bristol NHS Trust',
    },
    {
      type: 'statement',
      eyebrow: 'The honest limit',
      ghost: '',
      headline: 'It only matters at the edges.',
      /* "not as a routine upgrade on every test" is the source's own limit and
       * the first compression dropped it, which quietly widens the claim from
       * "useful at the edges" to "useful". */
      body: 'With SHBG sitting inside its reference range, a calculated free testosterone tells you nothing your total hasn’t already told you. These figures earn their keep when SHBG is high or low, not as a routine upgrade on every test.',
      source: 'SfE and ACB joint position statement, 2023',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'Ask for the right number.',
      body: 'If your total is ambiguous and your SHBG is unusual, a calculated free testosterone is the figure to ask for. UK guidance regards the borderline 8 to 12 nmol/L band as a reason for further assessment, not for reassurance.',
      /* "regards", never "treats" — the article's own word, and the permitted
       * alternative in the skill's own note on benign English uses of the
       * regulated vocabulary. Writing "treats" here HARD-failed the scanner on
       * the very edit that was restoring a qualifier. */
      source: 'BSSM guidelines, 2023',
    },
  ],
};
