/**
 * Print the two payloads of `lib/membership/subscriptionCopy.ts` as plain copy,
 * one file per flag state, for the compliance pre-flight.
 *
 * WHY IT EXISTS. Step 2a of the pre-flight skill: the scanner matches strings
 * without modelling their speech act, so a blended scan of the module measures
 * its comment block rather than its copy. The module is ~70% apparatus by line
 * count and every one of those lines names the regulated vocabulary on purpose.
 * The unit of scan is the extracted customer-facing copy.
 *
 * And step 1b: this is a REWRITE, so the absolute count is meaningless. Both
 * states are dumped so the pre-flight reports the DELTA against the approved
 * baseline, which is what the flag-off payload is.
 *
 *   npx tsx scripts/dump-subscription-copy.ts <out-dir>
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { subscriptionCopy } from '../lib/membership/subscriptionCopy'

const outDir = process.argv[2]
if (!outDir) {
  console.error('usage: tsx scripts/dump-subscription-copy.ts <out-dir>')
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })

/*
 * 🔴 EXHAUSTIVE BY CONSTRUCTION SINCE 2026-09-17, NOT BY A HAND-WRITTEN LIST.
 *
 * This used to enumerate the eleven fields by name. That is a second place to
 * remember something, and the thing it is used for is deciding whether copy has
 * been reviewed — so a field missing from the list produces a pre-flight that
 * scans a payload with the new strings taken out of it, and reports clean.
 *
 * It was one commit from happening: `standingClaim`, `aboutFactLabel` and
 * `aboutFactSub` were added to the interface for defect H2b and none of them
 * would have appeared here. The scan would have run, returned zero delta, and
 * the zero would have been about the wrong text.
 *
 * Walking the returned object means a field cannot be added to `SubscriptionCopy`
 * without entering the dump. Key order follows the object literal, so the two
 * payloads stay diffable run to run.
 */
function render(membershipEnabled: boolean): string {
  const c = subscriptionCopy(membershipEnabled)
  const parts: string[] = []
  for (const value of Object.values(c) as unknown[]) {
    if (Array.isArray(value)) parts.push(...(value as string[]))
    else parts.push(String(value))
  }
  return parts.join('\n\n') + '\n'
}

for (const [name, on] of [['baseline-flag-off', false], ['new-flag-on', true]] as const) {
  const p = join(outDir, `${name}.md`)
  writeFileSync(p, render(on), 'utf8')
  console.log(`wrote ${p}`)
}
