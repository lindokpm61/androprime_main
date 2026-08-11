/*
 * THE TITLE TABLE. One row per topic, three consumers.
 *
 * Keith 2026-08-11. Every cover asset for the 30-day run is generated from this
 * table and nothing else:
 *
 *   1. the newspaper headline inpainted into the photo  (inpaint.js --l1 --l2)
 *   2. the overlay plate on the video cover             (build.js, cover-video)
 *   3. the typographic cover                            (build.js, cover-type)
 *
 * WHY ONE TABLE. The newspaper headline and the overlay plate say the same
 * words, on purpose: the newsprint is the scene, the plate is what makes the
 * tile legible at grid size. If the two can be set independently they will
 * eventually disagree, and a cover whose newspaper says one article and whose
 * plate says another is not obviously broken to whoever schedules it. It just
 * looks like a mistake nobody made on purpose. Setting them from one row makes
 * that class of error unrepresentable.
 *
 * WHY THE LINE BREAK IS DATA. inpaint.js takes the headline as two lines and the
 * newsprint layout depends on where the break falls. "WHY AM I / ALWAYS TIRED?"
 * and "WHY AM I ALWAYS / TIRED?" set differently on the page, so the break is an
 * editorial decision and is stored, never computed.
 *
 * COVER FORMAT IS NOT IN THIS TABLE. A topic runs three times and alternates
 * between the video cover and the type cover, so format is a property of the
 * APPEARANCE, not of the topic. It is assigned by schedule (see coverFormat
 * below), which is also the only place the balance can be checked.
 */

/** `typeBg` is the typographic cover's ground. Alternating it down the table is
 *  what gives the grid its black/white rhythm; it is per-row so it can be
 *  overridden when two adjacent topics would otherwise clash. */
const COVERS = {
  '14-signs-of-vitamin-d-deficiency': {
    eyebrow: 'Vitamin D',
    l1: '14 SIGNS OF',
    l2: 'LOW VITAMIN D',
    typeBg: 'black',
  },
  'b12-blood-test': {
    eyebrow: 'B12',
    l1: 'WHAT YOUR B12',
    l2: 'REALLY SAYS',
    typeBg: 'white',
  },
  'ferritin-blood-test': {
    eyebrow: 'Ferritin',
    l1: 'YOUR IRON',
    l2: 'STORES, EXPLAINED',
    typeBg: 'black',
  },
  'crp-blood-test': {
    eyebrow: 'hs-CRP',
    l1: 'WHAT CRP',
    l2: 'ACTUALLY MEANS',
    typeBg: 'white',
  },
  'why-am-i-always-tired': {
    eyebrow: 'Tiredness',
    l1: 'WHY AM I',
    l2: 'ALWAYS TIRED?',
    typeBg: 'black',
  },
  'brain-fog': {
    eyebrow: 'Brain fog',
    l1: 'WHAT CAUSES',
    l2: 'BRAIN FOG?',
    typeBg: 'white',
  },
  'free-androgen-index': {
    eyebrow: 'Free androgen',
    l1: 'THE NUMBER',
    l2: 'GPS MISS',
    typeBg: 'black',
  },
  'how-to-increase-testosterone-naturally': {
    eyebrow: 'Testosterone',
    l1: 'RAISE TESTOSTERONE',
    l2: 'NATURALLY',
    typeBg: 'white',
  },
  'myth-of-normal-range': {
    eyebrow: 'Reference range',
    l1: 'WHAT "NORMAL"',
    l2: 'REALLY MEANS',
    typeBg: 'black',
  },
  'how-to-read-blood-test-results': {
    eyebrow: 'Blood tests',
    l1: 'HOW TO READ',
    l2: 'YOUR RESULTS',
    typeBg: 'white',
  },
};

const TOPIC_ORDER = Object.keys(COVERS);

function coverFor(slug) {
  const row = COVERS[slug];
  if (!row) {
    throw new Error(
      `No cover row for "${slug}". Every deck needs one; add it to covers.js.`
    );
  }
  for (const k of ['eyebrow', 'l1', 'l2', 'typeBg']) {
    if (!row[k]) throw new Error(`covers.js row "${slug}" is missing ${k}`);
  }
  if (row.typeBg !== 'black' && row.typeBg !== 'white') {
    throw new Error(`covers.js row "${slug}": typeBg must be black or white`);
  }
  // The single string every consumer renders. Derived, never stored twice.
  return { ...row, title: `${row.l1} ${row.l2}` };
}

/**
 * Which cover format an appearance uses.
 *
 * NOT `day % 2`. The schedule is topic = (day-1) % 10, and 2 divides 10, so
 * day-parity would lock every topic to a single format for the entire run:
 * vitamin D video three times, B12 type three times. Format would be perfectly
 * confounded with topic while the cell counts still read 5/5/5/5/5/5, so the
 * balance table would never show it.
 *
 * `(topic + appearance) % 2` keeps 15 video / 15 type and 10 posts per close,
 * with no topic locked to one format. Verified in checkBalance().
 */
function coverFormat(topicIndex, appearance) {
  return (topicIndex + appearance) % 2 === 0 ? 'video' : 'type';
}

/** Assert the run is balanced. Called by the planner so a schedule change that
 *  quietly breaks the design fails loudly instead of producing a readable-looking
 *  result that means nothing. */
function checkBalance(runLength = 30, topicCount = TOPIC_ORDER.length) {
  const fmt = { video: 0, type: 0 };
  const close = { A: 0, B: 0, C: 0 };
  const perTopic = {};
  for (let day = 1; day <= runLength; day++) {
    const t = (day - 1) % topicCount;
    const k = Math.floor((day - 1) / topicCount);
    const f = coverFormat(t, k);
    fmt[f]++;
    close['ABC'[(day - 1) % 3]]++;
    (perTopic[t] = perTopic[t] || []).push(f);
  }
  const locked = Object.values(perTopic).filter((a) => new Set(a).size === 1).length;
  const problems = [];
  if (fmt.video !== fmt.type) problems.push(`cover formats uneven: ${JSON.stringify(fmt)}`);
  if (new Set(Object.values(close)).size !== 1) problems.push(`closes uneven: ${JSON.stringify(close)}`);
  if (locked > 0) problems.push(`${locked} topic(s) locked to one cover format`);
  return { fmt, close, locked, ok: problems.length === 0, problems };
}

module.exports = { COVERS, TOPIC_ORDER, coverFor, coverFormat, checkBalance };
