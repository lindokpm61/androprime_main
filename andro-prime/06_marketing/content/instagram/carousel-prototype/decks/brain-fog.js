/*
 * Deck: brain-fog
 * Source: content/blog/brain-fog.mdx (published 2026-06-24, Ewa-reviewed)
 *
 * No coverPhoto yet: the newspaper frame for this topic has not been inpainted.
 *
 * Close B names Kit 2 and must never name Kit 1. Kit 1 is testosterone only and
 * must not be framed as explaining brain fog (03_compliance/CONTEXT.md, Results
 * copy scoping). The topic and the kit feel adjacent, which is why it is written
 * down rather than left to judgement.
 */

module.exports = {
  slug: 'brain-fog',
  kit: 'energy-recovery',
  closeBHeadline: 'Ferritin, B12 and vitamin D are in the Energy & Recovery Check.',

  slides: [
    {
      type: 'statement',
      eyebrow: 'Start here',
      ghost: '',
      headline: 'Brain fog is a description.',
      body: 'Not a diagnosis. A dull, slow, can’t-quite-focus state where thinking feels heavier than it should. For most healthy men it isn’t a brain problem.',
    },
    {
      type: 'list',
      eyebrow: 'The inputs',
      ghost: '05',
      headline: 'What it usually traces back to',
      items: [
        ['01', 'Sleep quality, not hours in bed'],
        ['02', 'A stress load that never switches off'],
        ['03', 'Blood-sugar swings from a fast-carb breakfast'],
        ['04', 'Alcohol, and caffeine too late in the day'],
        ['05', 'A few things only a test can show'],
      ],
      note: 'Four or five ordinary things, stacked up over weeks.',
      source: 'NHS · Tiredness and fatigue',
    },
    {
      type: 'statement',
      eyebrow: 'The sleep trap',
      ghost: '8',
      headline: 'Eight hours in bed, six of sleep.',
      body: 'A late scroll, a nightcap, a warm room, a weekend lie-in that drags your body clock around. Each one chips at the quality while the hours on paper look fine.',
    },
    {
      type: 'list',
      eyebrow: 'This fortnight',
      ghost: '02',
      headline: 'Pick two or three',
      items: [
        ['01', 'Fixed wake time, weekends included'],
        ['02', 'Last coffee before mid-afternoon'],
        ['03', 'Protein and fibre at breakfast'],
        ['04', 'Two drink-free nights'],
        ['05', 'A daily walk, ideally in daylight'],
      ],
      note: 'The aim isn’t a flawless month. It’s enough change, held long enough to read.',
    },
    {
      type: 'statement',
      eyebrow: 'The quiet ones',
      ghost: '',
      headline: 'Some inputs have no feeling.',
      body: 'Low B12, low iron and low vitamin D don’t produce a symptom you can point to. They sit in the background and dull your edge. The only way to see them is to look.',
    },
    {
      type: 'statement',
      eyebrow: 'Why it matters',
      ghost: '',
      headline: 'Duration changes the picture.',
      body: 'Fog that came on suddenly, or arrives with a low mood that won’t lift, real memory loss or any neurological symptom, is a GP conversation that week.',
      source: 'NHS · Tiredness and fatigue',
    },
  ],
};
