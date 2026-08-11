/*
 * The three closing slides under test, APPROVED as CA-031 (2026-08-11).
 *
 * Slides 1 to 7 are identical across a topic's three posts; only this slide
 * changes. That is the entire experiment, so the copy here is not a place to
 * improvise: A and C are fixed strings, and B is assembled from the approved
 * template plus the topic's own headline. Changing any of it needs a new
 * approval, not an edit.
 *
 * Record: 03_compliance/content-approval/approval-record-carousel-closes-2026-08-11.md
 * Copy:   ./slide-8-closes.md
 */

/* Canonical retail, v2.2 (Keith 2026-05-08), encoded in frontend/lib/pricing.ts.
 * The V7.1 and transitional sets were suspended 2026-08-09 and must not appear. */
const KITS = {
  testosterone: { name: 'Testosterone Health Check', price: '£99' },
  'energy-recovery': { name: 'Energy & Recovery Check', price: '£119' },
  'hormone-recovery': { name: 'Hormone & Recovery Check', price: '£179' },
};

/* Lifted verbatim from the live landing pages (app/lp/energy-recovery,
 * app/lp/hormone-recovery). If those change, this changes with them: a slide
 * that outlives the page it describes is an unsubstantiated claim. */
const MECHANICS = 'Finger-prick at home, results in 2 to 5 working days.';

/**
 * Build the three closes for one deck. `deck.kit` picks the kit named by close B;
 * Kit 1 is testosterone only, so a fatigue or brain-fog deck must never carry
 * `testosterone` here (CA-025, live behind KIT_SCOPE_NOTE_ENABLED).
 */
function closesFor(deck) {
  const kit = KITS[deck.kit];
  if (!kit) throw new Error(`unknown kit "${deck.kit}" on deck ${deck.slug}`);
  if (!deck.closeBHeadline) throw new Error(`deck ${deck.slug} has no closeBHeadline`);

  return {
    A: {
      type: 'cta',
      eyebrow: 'Not sure',
      headline: "Not sure which test you'd even need?",
      body: 'Three questions. About a minute.',
      link: 'Link in bio',
    },
    B: {
      type: 'cta',
      eyebrow: 'The test',
      headline: deck.closeBHeadline,
      body: `${kit.price}. ${MECHANICS}`,
      link: 'Link in bio',
    },
    C: {
      type: 'cta',
      eyebrow: 'The long version',
      headline: 'This is the short version.',
      body: 'The full article, with every source linked.',
      link: 'Link in bio',
    },
  };
}

module.exports = { KITS, MECHANICS, closesFor };
