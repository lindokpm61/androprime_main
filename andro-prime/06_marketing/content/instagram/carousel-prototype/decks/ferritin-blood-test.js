/*
 * Deck: ferritin-blood-test
 * Source: content/blog/ferritin-blood-test.mdx (published 2026-06-20, Ewa-reviewed)
 *
 * No coverPhoto yet: the newspaper frame for this topic has not been inpainted.
 * The cover renders the missing-photo hatch until it exists.
 *
 * Slide 7 is not softenable. Andro Prime does not sell iron, and a low ferritin
 * in a man routes to a GP: iron carries a real overdose risk and depleted stores
 * can be the first sign of slow blood loss.
 */

module.exports = {
  slug: 'ferritin-blood-test',
  /* Ferritin is a Kit 2 marker. */
  kit: 'energy-recovery',
  closeBHeadline: 'Ferritin is in the Energy & Recovery Check.',

  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'Ferritin is the tank, not the fuel.',
      body: 'It measures the iron you hold in reserve. The tank empties first, which is why ferritin falls weeks or months before you’re frankly anaemic.',
    },
    {
      type: 'list',
      eyebrow: 'The numbers',
      ghost: '30',
      headline: 'Ferritin, in µg/L',
      items: [
        ['01', 'Under 30 points to depleted stores'],
        ['02', '30 to 100 reads normal for the lab'],
        ['03', 'Low-normal can still feel flat'],
        ['04', 'High is not automatically more iron'],
      ],
      note: 'UK adult male guide. Ranges vary by lab.',
      source: 'NICE CKS',
    },
    {
      type: 'list',
      eyebrow: 'What low feels like',
      ghost: '05',
      headline: 'The pattern in active men',
      items: [
        ['01', 'Flat energy a full night doesn’t fix'],
        ['02', 'Legs heavy in the last third of a session'],
        ['03', 'Breathless on efforts that never touched you'],
        ['04', 'Recovery that has quietly slipped'],
        ['05', 'Restless legs, cold hands, more shedding'],
      ],
      note: 'Every one of these has other causes. That’s exactly why you test.',
    },
    {
      type: 'statement',
      eyebrow: 'The miss',
      ghost: '',
      headline: 'Low iron, normal blood count.',
      body: 'Your stores empty before your haemoglobin drops, so ferritin can be low while a full blood count still reads normal. That’s the version most often missed.',
    },
    {
      type: 'statement',
      eyebrow: 'The other direction',
      ghost: '',
      headline: 'High doesn’t mean more iron.',
      body: 'Ferritin rises with inflammation, infection, recent alcohol and liver strain, all independent of how much iron you actually hold. A reading a week after a cold isn’t your baseline.',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'A low result is a GP question.',
      body: 'Iron carries a real overdose risk, and in men depleted stores can point to slow blood loss. The cause gets found first. We don’t sell iron.',
      source: 'NICE CKS · British Society of Gastroenterology',
    },
  ],
};
