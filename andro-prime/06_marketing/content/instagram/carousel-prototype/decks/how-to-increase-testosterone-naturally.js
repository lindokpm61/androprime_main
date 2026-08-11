/*
 * Deck: how-to-increase-testosterone-naturally
 * Source: content/blog/how-to-increase-testosterone-naturally.mdx
 *         (published 2026-06-24, Ewa-reviewed)
 *
 * No coverPhoto yet: the newspaper frame for this topic has not been inpainted.
 *
 * Slide 6 carries the ONLY ingredient claim in the whole run, and it is quoted
 * exactly: "Zinc contributes to the maintenance of normal testosterone levels"
 * is the approved EFSA wording (03_compliance/CONTEXT.md). It is not rephrased,
 * not extended, and the slide states plainly that maintenance is not boosting.
 * No other ingredient is named anywhere in this deck.
 */

module.exports = {
  slug: 'how-to-increase-testosterone-naturally',
  kit: 'testosterone',
  closeBHeadline: 'Testosterone is in the Testosterone Health Check.',

  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'The real list is boring and free.',
      body: 'Body fat. Strength training. Sleep. Alcohol. Stress. Roughly that order of impact for most men, and the rest is noise.',
    },
    {
      type: 'list',
      eyebrow: 'The levers',
      ghost: '05',
      headline: 'Ranked by what the evidence supports',
      items: [
        ['01', 'Lose excess body fat, the biggest one'],
        ['02', 'Strength train two or three times a week'],
        ['03', 'Sleep properly, the fastest to move'],
        ['04', 'Ease off the alcohol'],
        ['05', 'Bring the chronic stress down'],
      ],
      note: 'Not ranked by what sells supplements.',
    },
    {
      type: 'statement',
      eyebrow: 'Why fat first',
      ghost: '24',
      headline: 'Fat tissue converts testosterone.',
      body: 'It carries an enzyme called aromatase, which turns testosterone into oestrogen. A review pooling 24 studies found weight loss, by diet or surgery, was followed by a meaningful rise, and the more men lost, the bigger the rise.',
      source: 'Corona et al., 2013',
    },
    {
      type: 'statement',
      eyebrow: 'The overlooked one',
      ghost: '15',
      headline: 'One week of short sleep.',
      body: 'Ten healthy young men slept under five hours a night for a week. Their daytime testosterone fell by 10 to 15%. One week, healthy men, a double-digit drop.',
      source: 'Leproult & Van Cauter, 2011, JAMA',
    },
    {
      type: 'statement',
      eyebrow: 'The hype check',
      ghost: '',
      headline: 'Most boosters lack the evidence.',
      body: 'The blends change faster than anyone can study them. Zinc contributes to the maintenance of normal testosterone levels. Read that carefully: maintenance, not boosting.',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'There is no overnight switch.',
      body: 'The levers move over weeks to months. Build the habits, give them eight to twelve weeks, then measure, so you can see what actually moved instead of guessing.',
    },
  ],
};
