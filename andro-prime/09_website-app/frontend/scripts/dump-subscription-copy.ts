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

function render(membershipEnabled: boolean): string {
  const c = subscriptionCopy(membershipEnabled)
  return [
    c.c1Kicker,
    c.c1Heading.join(' '),
    ...c.c1Paragraphs,
    c.orderStep01,
    c.kitFootnote,
    c.lpTestosteroneFootnote,
    c.secureCheckout,
    c.allInChip,
    c.faqTestosterone,
    c.faqHormoneRecovery,
    c.homepageMembership,
  ].join('\n\n') + '\n'
}

for (const [name, on] of [['baseline-flag-off', false], ['new-flag-on', true]] as const) {
  const p = join(outDir, `${name}.md`)
  writeFileSync(p, render(on), 'utf8')
  console.log(`wrote ${p}`)
}
