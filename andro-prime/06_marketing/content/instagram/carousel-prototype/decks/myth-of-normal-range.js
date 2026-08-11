/*
 * Deck: myth-of-normal-range
 * Source: content/blog/myth-of-normal-range.mdx (published 2026-06-18, Ewa-reviewed)
 *
 * No coverPhoto yet: the newspaper frame for this topic has not been inpainted.
 *
 * The bands on slide 5 are the NHS framework as the article states it, quoted
 * not editorialised. 8 nmol/L is the referral line; the 8 to 12 grey zone is the
 * population this topic is for. Andro Prime does not sit in the TRT conversation
 * and no slide here implies otherwise.
 */

module.exports = {
  slug: 'myth-of-normal-range',
  kit: 'testosterone',
  closeBHeadline: 'Testosterone is in the Testosterone Health Check.',

  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'The range answers another question.',
      /* "A typical UK lab band ... shifts from lab to lab", NOT "the NHS range".
       * There is no single national reference range: each lab sets its own from
       * its own population and assay. 03_compliance/STATE.md carries this as an
       * open finding against the parent article, and on a slide the assertion is
       * the whole premise rather than a passing line. */
      body: 'A typical UK lab band runs roughly 8 to 29 nmol/L, and it shifts from lab to lab. It was built to flag clinical illness, not to describe wellness. If you feel materially worse than you did five years ago, it isn’t lying. It isn’t answering you.',
    },
    {
      type: 'statement',
      eyebrow: 'The spread',
      ghost: '260',
      headline: 'A 260% spread, one verdict.',
      body: 'A man at 9 nmol/L and a man at 25 nmol/L are handed the same sentence: within normal range. Clinically they are not the same man.',
    },
    {
      type: 'list',
      eyebrow: 'Why so wide',
      ghost: '04',
      headline: 'What went into the band',
      items: [
        /* "roughly" is restored, not decorative: the article says "drops by
         * roughly 1 to 2% per year" and the first compression dropped it, which
         * turns a population average into a stated rate. Found by the fragment
         * pre-flight, which is the whole reason that mode exists. */
        ['01', 'Age: it falls roughly 1 to 2% a year from 30'],
        ['02', '18-year-olds and 70-year-olds, one pot'],
        ['03', 'A population that has grown heavier'],
        ['04', 'Athletes and sedentary men, same sample'],
      ],
      note: 'Normal today is lower than normal was thirty years ago.',
    },
    {
      type: 'list',
      eyebrow: 'The bands',
      ghost: '12',
      headline: 'Where the lines actually fall',
      items: [
        ['01', 'Below 8 nmol/L: the NHS referral line'],
        ['02', '8 to 12 nmol/L: the grey zone'],
        ['03', 'Above 12 nmol/L: fine by the framework'],
      ],
      /* Provenance on the slide, not just in the deck. A threshold on a brand
       * asset with no citation reads as Andro Prime's own cut-point: that is the
       * substantiation exposure Ewa ruled on 2026-08-04, when the 12 nmol/L line
       * came out of a Facebook post for exactly this reason. The sibling
       * threshold slides (ferritin, CRP, FAI) already carry one. */
      note: 'Most symptomatic men sit in the grey zone and are told they’re fine.',
      source: 'NHS · BSSM guidelines, 2023',
    },
    {
      type: 'statement',
      eyebrow: 'The evidence',
      ghost: '11',
      headline: 'Symptoms start at eleven.',
      body: 'In 3,369 European men aged 40 to 79, three or more classic symptoms became significantly more likely below 11 nmol/L. The referral threshold sits 3 below that.',
      source: 'Wu et al., 2010, NEJM, EMAS cohort',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'The framework isn’t lying.',
      body: 'It’s answering whether you are ill. Most men reading their result are asking whether they are well. A baseline you can retest tells you more than where you fall on one wide band.',
    },
  ],
};
