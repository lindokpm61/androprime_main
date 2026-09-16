import SystemAlert from '@/components/marketing/SystemAlert'
import {
  symptomOverlayFor,
  type SymptomOverlayInput,
} from '@/lib/results/symptomOverlay'

/**
 * THE SYMPTOM OVERLAY, rendered.
 *
 * 🔴 NOT WIRED INTO ANY ROUTE, AND GATED OFF. The trigger it reads
 * (`symptomAnswers`) is populated by nothing in the product, so this renders
 * for nobody today. It exists so the signed copy is under test and the CA-048
 * render obligation can be discharged against a real render rather than a
 * description of one. See `lib/results/symptomOverlay.ts` for why.
 *
 * ── WHY `SystemAlert` AND NOT A LOCAL BOX ─────────────────────────────────
 * Ewa, CA-049 Q5 = A: the 999 block gets **the same presentation as on the
 * article**. On `cholesterol-test` that is literally this component, and
 * `f-blog.css` is imported globally in `styles/base/globals.css`, so reusing it
 * is the faithful reading of her answer rather than an approximation of it.
 *
 * ⚠ ITS COLOUR IS A COMPLIANCE CONSTRAINT AND IT IS INHERITED HERE ON PURPOSE.
 * `SystemAlert` is deliberately drawn in the accent and not in red, because red
 * is reserved for the results dashboard's critical / GP-block status (Keith,
 * 2026-08-29). This overlay renders on an ALL-CLEAR result, so a red box would
 * assert a severity the result does not carry, two inches from cards that use
 * red to mean exactly that.
 *
 * ── THE ORDER IS THE RULING ───────────────────────────────────────────────
 * 999 block, then the GP list, then the closing paragraph. That order is what
 * CA-048 approved as one screen, and it is why the pre-flight had to be run on
 * the composite: the defect that failed the first attempt was an omission
 * ABOVE the line, invisible in any sentence read on its own.
 */
export default function SymptomOverlay({ input }: { input: SymptomOverlayInput }) {
  const copy = symptomOverlayFor(input)
  if (!copy) return null

  return (
    <SystemAlert title={copy.alertTitle}>
      <h4>{copy.emergencyHeading}</h4>
      <ul>
        <li>
          {copy.emergencyBodyBeforeCitation}
          {/* The citation is a live link on the article and Q1 = A carried the
              paragraph over "exactly as it appears" there. On a safety
              escalation a dead citation is a downgrade of the substantiation,
              not a formatting choice. */}
          <a href={copy.citationHref} target="_blank" rel="noopener noreferrer">
            {copy.citationText}
          </a>
          {copy.emergencyBodyAfterCitation}
        </li>
      </ul>

      <h4>{copy.gpLeadIn}</h4>
      <ul>
        <li>{copy.gpRedFlagList}</li>
      </ul>

      <h4>{copy.connective}</h4>
      <p>{copy.closing}</p>
    </SystemAlert>
  )
}
