/*
 * Deck: 14-signs-of-vitamin-d-deficiency (published, Ewa-reviewed)
 *
 * Extracted VERBATIM from the inline `slides` array that build.js used to carry,
 * so the move to a data-driven build is provably lossless: re-rendering this deck
 * must reproduce the committed prototype PNGs.
 *
 * The old slide 8 is deliberately NOT here. Closes are now the tested variable
 * and live in ../closes.js under CA-031; a deck ends at slide 7.
 */

module.exports = {
  slug: '14-signs-of-vitamin-d-deficiency',
  /* Close B names this kit. Vitamin D is a Kit 2 marker. */
  kit: 'energy-recovery',
  closeBHeadline: 'Vitamin D is in the Energy & Recovery Check.',

  /* The frame the video cover is built from: base-2 with the eyes opened, this
   * topic's headline already inpainted onto the newspaper. The headline words
   * live in covers.js and are set once, for the newsprint and the plate both. */
  coverPhoto: 'cover-current-b2.jpg',

  /* Slides 2 to 7. The cover comes from covers.js, the close from closes.js. */
  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'Signs aren’t diagnoses.',
      body: 'They’re body-feel cues that turn up more often in men with low vitamin D. One on its own usually means very little. Three or four together is worth checking.',
    },
    {
      type: 'list',
      eyebrow: 'The list',
      ghost: '01',
      headline: 'Signs 01 to 04',
      items: [
        ['01', 'Tiredness that doesn’t shift with sleep'],
        ['02', 'Low mood through the dark months'],
        ['03', 'Slow recovery from training'],
        ['04', 'Bone ache you can’t pin on a session'],
      ],
      note: 'Suggestive, not diagnostic. One sign on its own means very little.',
    },
    {
      type: 'list',
      eyebrow: 'The list',
      ghost: '05',
      headline: 'Signs 05 to 09',
      items: [
        ['05', 'Muscle weakness in legs and arms'],
        ['06', 'More colds and flu than usual'],
        ['07', 'Lower back pain that creeps up'],
        ['08', 'Hair shedding above the seasonal norm'],
        ['09', 'Slow-healing cuts and grazes'],
      ],
      note: 'Suggestive, not diagnostic. One sign on its own means very little.',
    },
    {
      type: 'list',
      eyebrow: 'The list',
      ghost: '10',
      headline: 'Signs 10 to 13',
      items: [
        ['10', 'Joint stiffness, especially morning'],
        ['11', 'Headaches without obvious cause'],
        ['12', 'Concentration and mental fog'],
        ['13', 'Unrefreshing sleep'],
      ],
      note: 'Suggestive, not diagnostic. One sign on its own means very little.',
    },
    {
      type: 'statement',
      eyebrow: 'Sign 14',
      ghost: '14',
      headline: 'No signs at all.',
      body: 'Low vitamin D runs silent for years in most UK adult men. The signs above only get loud at the more severe end. That is the one most men miss.',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'October to March, UK sunlight is too weak.',
      body: 'At UK latitude the skin cannot make meaningful vitamin D through the dark half of the year. Indoor work, sunscreen and body composition compound it.',
      source: 'NHS · Royal Osteoporosis Society',
    },
  ],
};
