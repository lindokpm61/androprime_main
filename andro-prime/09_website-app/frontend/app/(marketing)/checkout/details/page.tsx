import type { Metadata } from 'next'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { CheckoutDetailsForm } from '@/components/commerce/CheckoutDetailsForm'
import { isValidBundleType } from '@/lib/bundles/checkout'

/**
 * /checkout/details, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FRAME V AND V2, `design/mockups/journey/buy-F.html`. Layout ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY WORD IS VERBATIM. The eyebrow, the headline and its break, the
 * standfirst and all four trust items are byte-identical to the V2.0 page, as is
 * every string inside `CheckoutDetailsForm`. Nothing on this route needed a
 * section label invented for it, because it has one section.
 *
 * 🔴 THE PAGE'S REAL SURFACE IS THE FORM, NOT THIS FILE. Frame V names the trap
 * and it is the same one `/test-selector` sprang: this route is a wrapper and
 * `CheckoutDetailsForm` is where the three fields, the six error strings, the
 * submitting state and the consent gate live. A route's line count measures its
 * wrapper, not its surface. The CA-018 notes are in that file, beside the copy
 * they govern.
 *
 * 🔴 THERE IS NO SECTION COUNTER, AND THAT IS THE POINT RATHER THAN AN OMISSION.
 * `FPage` numbers every `FSection` carrying a rule, so a one-section page would
 * read `01 / 01`. This page already has a counter, it is called "Step 1 of 2",
 * and it counts something a buyer actually cares about. Two counters on one
 * screen, disagreeing about what is being counted, is worse than none: the
 * section rule is a position indicator for a document and this is not one. So
 * the single section takes `rule={false}` and the eyebrow carries the count.
 *
 * ⚠ THE FORM SITS BELOW THE HERO RATHER THAN IN ITS ASIDE, which is the one
 * place this departs from the shape `/supplements` and `/supplement-waitlist`
 * use. Those put a two-field email capture in the `.f-herogrid` right column at
 * about 417px. This form is a date field, a two-option control, a consent row
 * with an approved four-line sentence, and a submit; at 417px the consent
 * paragraph alone runs past the hero. Frame V draws it full-measure under the
 * hero in `.narrow`, and that is followed.
 *
 * ⚠ AND IT KEEPS THE SHARED HERO GROUND, WHICH THE FRAME DOES NOT DRAW. Frame V
 * predates `FHero` and draws a bare `.narrow` hero with no field behind it. Every
 * one of the fifteen rebuilt marketing routes wears the shared measurement
 * ground, including `/contact` and `/waitlist`, which are no less transactional
 * than this one; dropping it here would make the checkout the only marketing
 * route without a hero ground, and the reader crosses from `/kits` to this page
 * in one click. Read as a judgement call rather than as drift: `FHero` takes
 * `ground="none"` and reversing it is one prop.
 *
 * NO INVERTED PANEL. The direction allows one per page for a conformity
 * statement and this page makes none: it asks for two facts and takes a consent.
 * The one emphasis it does spend is the `.f-flagchip` on "Required" in the
 * consent row, which Frame V argues at length is the correct place for it.
 */

export const metadata: Metadata = {
  title: 'A few details for the lab | Andro Prime',
  description: 'Two details we need before your kit ships.',
  robots: { index: false, follow: false },
}

const VALID_KIT_TYPES = new Set(['testosterone', 'energy-recovery', 'hormone-recovery'])

/* The 18+ item is one of the three statements of the age gate; the other two are
   the date input's `max` and `isAtLeast18()`, both in `CheckoutDetailsForm`. */
const TRUST = [
  'GDPR compliant',
  'Stored securely in EU',
  '18+ only',
  'Never sold. Never used for advertising.',
]

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function CheckoutDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const kitParam = readParam(params.kit) ?? 'testosterone'
  const kitType = VALID_KIT_TYPES.has(kitParam) ? kitParam : 'testosterone'
  // Bundle is optional and only threaded through when it is a recognised SKU; a
  // stray or malformed ?bundle= value is dropped rather than forwarded. The
  // checkout API re-validates bundle/base-kit match server-side regardless.
  const bundleParam = readParam(params.bundle)
  const bundle = bundleParam && isValidBundleType(bundleParam) ? bundleParam : undefined

  return (
    <FPage>
      {/* `narrow` so the headline and the form card share one measure. */}
      <FHero narrow>
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Step 1 of 2</span>
        </div>
        {/* The break is the V2.0 page's own and it survives the measure change.
            `.f-h1` is 65.6px at 1440 and the budget is about 20 characters a
            line; "Two details" is 11 and "for the lab." is 12, so neither line
            orphans a word. Three heroes shipped with an orphan on 2026-09-09
            because a break was placed before the natural wrap rather than at it,
            and only a render shows it. Checked at 1440 and 390.

            ⚠ THE SECOND LINE TAKES `.f-grey` AND FRAME V DRAWS IT WITHOUT. Every
            multi-line F hero greys its last line (`/waitlist`, `/supplements`,
            `/supplement-waitlist`, `/about`), and Frame W greys the second line
            of its own h2 two sections later, so the frame disagrees with itself
            rather than ruling against the device. Following the shipped idiom.
            No word changes either way. */}
        <h1 className="f-h1">
          Two details<br /><span className="f-grey">for the lab.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          We need your date of birth and sex to register your sample with the lab. The lab uses these to apply the correct reference ranges to your results. Payment and delivery are on the next step.
        </p>
      </FHero>

      {/* ---------- THE FORM ----------
          `narrow` for the reason `/test-selector`'s quiz takes it: at the full
          1180px measure a consent sentence runs about 1100px of line while the
          control above it is a 200px date field, and the card stops reading as
          one object. `rule={false}` is argued in the file header.

          🔴 `cont`, BECAUSE THE FORM CONTINUES THE HERO RATHER THAN CHANGING
          SUBJECT. `--f-sec-gap` is the boundary between two TOPICS and it is
          130px at 900px and up; the standfirst here ends on "Payment and
          delivery are on the next step" and the very next thing is the field
          that sentence is about. Measured before: 174px of empty white between
          the standfirst and the card, on a page whose only job is to be filled
          in, and with `rule={false}` there is no rule crossing the gap to make
          it read as a boundary rather than as a dead zone. `.f-sec-cont` is the
          ruling of 2026-09-03 for exactly this and is 0.66 of the boundary. */}
      <FSection narrow rule={false} cont>
        <div className="f-tray f-rise" style={{ marginBottom: 0 }}>
          <div className="f-core">
            <CheckoutDetailsForm
              kitType={kitType as 'testosterone' | 'energy-recovery' | 'hormone-recovery'}
              bundle={bundle}
            />
          </div>
        </div>

        <div className="f-trustrow">
          {TRUST.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </FSection>
    </FPage>
  )
}
