/*
 * Deck: why-am-i-always-tired (published, CA-016, Ewa-reviewed)
 *
 * DRAFT, not pre-flighted, not approved. Every line is compressed from the live
 * article body read out of `blog_articles`, not from the repo MDX mirror, and
 * nothing here adds a claim the article does not already make.
 *
 * TWO THINGS THIS DECK MUST NOT LOSE, because a fragment read alone is where
 * compressed copy sharpens a claim:
 *
 * 1. The GP rail. The article carries a red-flag box and Ewa's own line about
 *    duration and company. A tiredness carousel that drops it would be pointing a
 *    symptomatic reader at a product instead of at a doctor. Slide 7 is that box,
 *    and it is not a slide to cut for length.
 * 2. Kit scoping. Fatigue is NOT a Kit 1 story. Kit 1 measures testosterone only
 *    and must never be offered as the answer to general tiredness (CA-025), which
 *    is why `kit` below is energy-recovery and why close B names the four markers
 *    rather than a hormone.
 */

module.exports = {
  slug: 'why-am-i-always-tired',
  kit: 'energy-recovery',
  /* The four-marker form of close B, from the CA-031 approved set: this topic has
   * no single marker of its own, so naming one would imply a cause the article
   * explicitly does not claim. */
  closeBHeadline:
    'The four markers in the Energy & Recovery Check are Vitamin D, Active B12, hs-CRP and Ferritin.',

  /* The frame the video cover is built from: this base carries THIS topic's
   * headline inpainted onto the newspaper. Already minted, because it is the
   * file the mask swap was proven against, so this deck costs no inpaint call.
   * The headline words themselves live in covers.js and are set once. */
  coverPhoto: 'cover-why-tired.jpg',

  /* Slides 2 to 7. The cover comes from covers.js, the close from closes.js. */
  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'You’re not lazy.',
      body: 'There’s a difference between sleepy and tired all the time. Sleepy you can fix tonight. The flat feeling is an accumulation: small inputs, stacked, over weeks.',
    },
    {
      type: 'statement',
      eyebrow: 'The shape of it',
      ghost: '',
      headline: 'It’s not one big thing. It’s five small things you stopped noticing.',
      body: 'For most healthy men in their late 30s and 40s the answer isn’t dramatic. It’s the boring stuff, added up. And the boring stuff is fixable.',
    },
    {
      type: 'list',
      eyebrow: 'The usual suspects',
      ghost: '01',
      headline: 'What the NHS lists',
      items: [
        ['01', 'Not enough good sleep'],
        ['02', 'Stress'],
        ['03', 'Low mood'],
        ['04', 'Too little activity'],
        ['05', 'Alcohol and caffeine'],
      ],
      note: 'None of them sound serious on their own. That is exactly why they get missed.',
      source: 'NHS · Tiredness and fatigue',
    },
    {
      type: 'statement',
      eyebrow: 'The loop',
      ghost: '',
      headline: 'Wired but tired is still tired.',
      body: 'A mind that won’t power down keeps your body in a state that’s poor at repairing you. You lie there tired but alert, wake unrefreshed, and the next day makes everything harder.',
    },
    {
      type: 'list',
      eyebrow: 'This week',
      ghost: '',
      headline: 'Pick two or three. Give them a fortnight.',
      items: [
        ['01', 'A fixed wake time, weekends included'],
        ['02', 'Last coffee before 2pm'],
        ['03', 'Two drink-free nights'],
        ['04', 'A daily walk, ideally in daylight'],
        ['05', 'Breakfast built on protein and fibre'],
      ],
      note: 'A single tired week tells you nothing. A fortnight of honest changes tells you whether the cause is on this list.',
    },
    {
      type: 'statement',
      eyebrow: 'When to see your GP',
      ghost: '',
      headline: 'Some tiredness needs a doctor, not a blog.',
      body: 'See your GP that week if it came on suddenly, if it stops you doing normal things, or if it arrives with unexplained weight loss, breathlessness or a low mood that won’t lift.',
      source: 'Dr Ewa Lindo · GMC-registered GP',
    },
  ],
};
