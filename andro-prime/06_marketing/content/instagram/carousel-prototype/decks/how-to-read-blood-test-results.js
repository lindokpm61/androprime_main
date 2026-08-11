/*
 * Deck: how-to-read-blood-test-results
 * Source: content/blog/how-to-read-blood-test-results.mdx
 *         (published 2026-07-15, Ewa-reviewed)
 *
 * No coverPhoto yet: the newspaper frame for this topic has not been inpainted.
 *
 * This is the run's only Kit 3 topic. Close B names the nine-marker Hormone &
 * Recovery Check, which is honest for a topic about reading a whole panel; the
 * count is the one in 04_products/kits/kit-3-hormone-recovery-check.md.
 */

module.exports = {
  slug: 'how-to-read-blood-test-results',
  kit: 'hormone-recovery',
  closeBHeadline: 'Nine markers are in the Hormone & Recovery Check.',

  slides: [
    {
      type: 'list',
      eyebrow: 'Start here',
      ghost: '04',
      headline: 'Every line says four things',
      items: [
        ['01', 'The marker: what was measured'],
        ['02', 'The value: your number on the day'],
        ['03', 'The units: the scale it’s measured on'],
        ['04', 'The reference range: the lab’s normal band'],
      ],
      note: 'See those four on any line and you can read any panel.',
    },
    {
      type: 'statement',
      eyebrow: 'The range',
      ghost: '19',
      headline: 'It includes 19 people in 20.',
      body: 'The lab tests a large group it considers healthy and draws the band around about 95% of them. By definition that leaves 1 in 20 perfectly healthy people outside it.',
      source: 'Liver UK',
    },
    {
      type: 'list',
      eyebrow: 'The units',
      /* A lone letter reads as a mistake at watermark size; the other ghosts on
       * this deck are numbers, so this one counts the rows. */
      ghost: '05',
      headline: 'What you’ll see on a UK panel',
      items: [
        ['01', 'nmol/L: testosterone, SHBG'],
        ['02', 'mg/L: CRP'],
        ['03', 'µg/L: ferritin'],
        ['04', 'pmol/L: active B12'],
        ['05', 'g/L: haemoglobin'],
      ],
      note: 'A number means nothing without its unit. Read both before you react.',
    },
    {
      type: 'statement',
      eyebrow: 'The timing',
      ghost: '',
      headline: 'An afternoon reading is a mismatch.',
      body: 'Testosterone runs on a daily rhythm and is highest in the early morning. Read against a range calibrated for a morning sample, a 4pm figure can look low because of the clock.',
      source: 'BSSM guidelines, 2023',
    },
    {
      type: 'statement',
      eyebrow: 'What it isn’t',
      ghost: '',
      headline: 'One number outside is not a label.',
      body: 'A cold, a brutal session, a poor night, dehydration, the meal before the test. Any of them nudges a marker without your baseline having moved at all.',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'A retest is a sentence.',
      body: 'One reading tells you where you are today. It can’t tell you which way you’re moving. A baseline, one change, and a retest a few weeks later is what reads the difference.',
    },
  ],
};
