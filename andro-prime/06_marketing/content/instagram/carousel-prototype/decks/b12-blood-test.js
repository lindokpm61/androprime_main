/*
 * Deck: b12-blood-test
 * Source: content/blog/b12-blood-test.mdx (published 2026-06-20, Ewa-reviewed)
 *
 * Do NOT point coverPhoto at another topic's photo: the plate and the newsprint
 * are set from one covers.js row, and they would then disagree.
 */

module.exports = {
  slug: 'b12-blood-test',
  /* Active B12 is a Kit 2 marker. */
  kit: 'energy-recovery',
  closeBHeadline: 'Active B12 is in the Energy & Recovery Check.',

  /* The frame the video cover is built from: this topic's headline inpainted
   * onto the newspaper. The words live in covers.js and are set once, for the
   * newsprint and the plate both. */
  coverPhoto: 'cover-b12-blood-test.png',

  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'Which B12 did they measure?',
      body: 'A standard test reads total B12. Only the active fraction is the part your cells can take up and use. Most reports don’t make it obvious which one you got.',
    },
    {
      type: 'list',
      eyebrow: 'The split',
      ghost: '70',
      headline: 'Where your B12 actually sits',
      items: [
        ['01', '70 to 90% is bound to haptocorrin'],
        ['02', 'Your cells can’t take that fraction up'],
        ['03', 'It’s carried to the liver and excreted'],
        ['04', '20 to 30% is bound to transcobalamin'],
        ['05', 'That fraction is the active one'],
      ],
      note: 'Total counts all of it. Active counts the part you can use.',
    },
    {
      type: 'list',
      eyebrow: 'The numbers',
      ghost: 'B12',
      headline: 'Active B12, in pmol/L',
      /* THESE ARE THE LIVE BANDS, TAKEN FROM THE SYSTEM OF RECORD, NOT FROM THE
       * ARTICLE. The published article says "under 35 pmol/L is low" and
       * attributes it to Kit 2; `classifier.ts:325` reads `value < 25`, on the
       * NICE NG239 three-band scheme Ewa signed 2026-06-16 and re-ratified
       * 2026-08-07. The article shipped four days after that decision and was
       * never swept. Sourcing a threshold from prose rather than from
       * thresholds.md is how a slide ends up misstating our own cut-point with
       * total confidence. */
      items: [
        ['01', 'Under 25 is low'],
        ['02', '25 to 70 is borderline'],
        ['03', 'Above 70 is normal'],
      ],
      note: 'Reference ranges vary by lab. Read the band printed on your own report.',
      source: 'NICE NG239',
    },
    {
      type: 'statement',
      eyebrow: 'The gap',
      ghost: '40',
      headline: 'A result of 40 is borderline.',
      body: 'It sits inside “normal” on most reports and can still be low enough to matter for how you feel, especially if it has been drifting down.',
    },
    {
      type: 'statement',
      eyebrow: 'What it isn’t',
      ghost: '',
      headline: 'One number is not a cause.',
      body: 'A low active B12 could be intake, or it could be absorption, and those have very different answers. Recent supplements or an injection can distort a reading too.',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'Nerve symptoms go to your GP.',
      body: 'Numbness, pins and needles, or changes in balance, memory or concentration need a GP without delay. Some of what B12 deficiency does to the nerves can become permanent if it’s left.',
      source: 'NHS · Gloucestershire Hospitals NHS',
    },
  ],
};
