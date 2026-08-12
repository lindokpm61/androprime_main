/*
 * Deck: crp-blood-test
 * Source: content/blog/crp-blood-test.mdx (published, Ewa-reviewed)
 *
 * The hs-CRP bands are the AHA/CDC strata the article cites, not house numbers.
 * If they change on the article they change here.
 */

module.exports = {
  slug: 'crp-blood-test',
  /* hs-CRP is a Kit 2 marker. */
  kit: 'energy-recovery',
  closeBHeadline: 'hs-CRP is in the Energy & Recovery Check.',

  /* The frame the video cover is built from: this topic's headline inpainted
   * onto the newspaper. The words live in covers.js and are set once, for the
   * newsprint and the plate both. */
  coverPhoto: 'cover-crp-blood-test.png',

  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'CRP says a response is happening.',
      body: 'Your liver releases it when your immune system is reacting to something. It doesn’t tell you what. It tells you that it’s happening, and how much.',
    },
    {
      type: 'list',
      eyebrow: 'The bands',
      ghost: 'CRP',
      headline: 'hs-CRP, in mg/L',
      items: [
        ['01', 'Under 1.0 is the low band'],
        ['02', '1.0 to 3.0 is average'],
        ['03', 'Over 3.0 is elevated, worth retesting'],
        ['04', 'Over 10 is your GP that week'],
      ],
      note: 'The framework UK private labs read against.',
      source: 'Pearson et al., 2003, AHA/CDC',
    },
    {
      type: 'statement',
      eyebrow: 'The mismatch',
      ghost: '2',
      headline: 'Same number, two answers.',
      body: 'A standard CRP of 2 reads normal on an NHS printout. The same 2 on the hs-CRP framework reads average to elevated. Different questions, one figure on the page.',
    },
    {
      type: 'list',
      eyebrow: 'The confounders',
      ghost: '05',
      headline: 'Five things that make one reading lie',
      items: [
        ['01', 'A cold or flu in the last fortnight'],
        ['02', 'A hard session in the last 48 hours'],
        ['03', 'Dental work in the last week'],
        ['04', 'A fresh vaccination'],
        ['05', 'Anything acute you can name'],
      ],
      note: 'A single reading on an acute event is not your baseline.',
    },
    {
      type: 'statement',
      eyebrow: 'In active men',
      ghost: '',
      headline: 'It’s rarely the dramatic story.',
      body: 'Training load that has outrun recovery. Sleep debt under six hours. Body composition, alcohol, ultra-processed food. Usually a slow accumulation, often two of them stacked.',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'The pattern, not the number.',
      body: 'Retest four to eight weeks later, when you’re not acutely ill and didn’t train brutally the day before. That’s the reading that means something.',
      source: 'NHS · British Heart Foundation',
    },
  ],
};
