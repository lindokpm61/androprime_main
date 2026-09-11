/**
 * WHICH DESIGN SYSTEM THE DAILY LOOP IS WEARING.
 *
 * `CheckinRow` and `AdherenceChart` are rendered by two surfaces that are not
 * the same product:
 *
 *   'app'   /account/membership, Direction F   styles/components/f-app.css
 *   'demo'  /demo, the `ap-` phone shell       styles/pages/app-shell.css
 *
 * 🔴 THE COMPONENTS ARE SHARED ON PURPOSE AND THE SKIN IS THE ONLY DIFFERENCE.
 * The demo renders the REAL check-in row rather than a copy of it, so the two
 * cannot drift: that was the point of porting it on 2026-09-07, after a
 * hand-rolled `.ap-bars` chart turned out to encode a 1-to-10 scale when the
 * product's is 1 to 5. Forking the components to restyle them would put that
 * failure straight back. Keith ruled on 2026-09-12 for one implementation and
 * two skins, over rebuilding in `f-` and letting the demo inherit a foreign
 * look.
 *
 * WHY FULL CLASS STRINGS RATHER THAN A PREFIX SWAP. The two systems spell a
 * modifier differently and each is right in its own file: Direction F compounds
 * a modifier onto its base (`.f-adh-b.f-adh-st`) because
 * `verify-modifier-specificity.js` requires a modifier to out-specify what it
 * modifies, while `app-shell.css` uses BEM (`.ap-adh__b--st`). A prefix swap
 * would have to encode one house style and break the other, so the map carries
 * the finished string and each stylesheet stays native to itself.
 *
 * Adding a key here means adding a rule to BOTH stylesheets. A missing class is
 * silent: the element renders unstyled rather than erroring.
 */
export type LoopSurface = 'app' | 'demo'

export interface LoopSkin {
  /* today's taps */
  taps: string
  tap: string
  tapOn: string
  tapKey: string
  tapValue: string
  scale: string
  pip: string
  pipOn: string
  tapsError: string
  /* adherence */
  well: string
  chart: string
  bar: string
  barStreak: string
  barMissed: string
  barToday: string
  streakRun: string
  axis: string
  /**
   * The small print under a block. Not a new class in either system: it is the
   * note style each file already has, named here so a component never hard-codes
   * one system's class onto the other system's surface.
   */
  note: string
}

export const LOOP_SKIN: Record<LoopSurface, LoopSkin> = {
  app: {
    taps: 'f-taps',
    tap: 'f-tap',
    tapOn: 'f-tap f-tap-on',
    tapKey: 'f-tap-k',
    tapValue: 'f-tap-v',
    scale: 'f-tap-sc',
    pip: '',
    pipOn: 'f-tap-pip-on',
    tapsError: 'f-taps-err',
    well: 'f-well',
    chart: 'f-adh',
    bar: 'f-adh-b',
    barStreak: 'f-adh-b f-adh-st',
    barMissed: 'f-adh-b f-adh-miss',
    barToday: 'f-adh-b f-adh-st f-adh-now',
    streakRun: 'f-srun',
    axis: 'f-adhaxis',
    note: 'f-fine',
  },
  demo: {
    taps: 'ap-taps',
    tap: 'ap-tap',
    tapOn: 'ap-tap ap-tap--on',
    tapKey: 'ap-tap__k',
    tapValue: 'ap-tap__v',
    scale: 'ap-tap__sc',
    pip: '',
    pipOn: 'ap-pip--on',
    tapsError: 'ap-taps__err',
    well: 'ap-well',
    chart: 'ap-adh',
    bar: 'ap-adh__b',
    barStreak: 'ap-adh__b ap-adh__b--st',
    barMissed: 'ap-adh__b ap-adh__b--miss',
    barToday: 'ap-adh__b ap-adh__b--st ap-adh__b--now',
    streakRun: 'ap-srun',
    axis: 'ap-adhaxis',
    note: 'ap-note-sm',
  },
}
