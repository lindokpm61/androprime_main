// The only place in the frontend that turns a moment into a string a human
// reads. `scripts/verify-date-format.js` fails the build if `toLocaleDateString`
// appears anywhere else.
//
// WHY THIS EXISTS. Eight files had each written their own `formatDate`, all four
// lines long, all producing "15 June 2026", and all subtly different: some took a
// `Date`, some an ISO string, some tolerated null and some threw an "Invalid
// Date" at the customer. Nobody had decided anything; each author had simply
// written the obvious thing again. A ninth copy sat inside a file that already
// had one.
//
// THE TIMEZONE IS THE PART THAT WAS ACTUALLY BROKEN. `toLocaleDateString` with
// no `timeZone` formats in whatever zone the RUNTIME happens to be in. The
// production container is `node:20-alpine` with no TZ set, so it is UTC;
// development is a UK laptop, so it is Europe/London. The same order therefore
// rendered "14 June" in production and "15 June" on the machine where it was
// checked, for any timestamp in the hour before midnight BST — which is exactly
// the kind of defect that survives review, because both readings look right to
// the person looking at one of them.
//
// Europe/London is the answer rather than UTC because these are dates shown to
// UK customers about their own money and their own blood: the renewal date on
// their statement, the day they gave the sample. It is also the safer of the two
// for a bare `YYYY-MM-DD`, which parses as UTC midnight — London is never behind
// UTC, so a calendar date can never slip to the previous day, whereas a
// negative-offset zone would take "15 June" to "14 June".
//
// Formats are deliberately few. If a screen needs a fifth, add it here with the
// sentence explaining what it is for, the way the four below carry theirs.

type DateInput = Date | string | number | null | undefined

/** UK-only business, UK-only customers. See the note above on why not UTC. */
const TIME_ZONE = 'Europe/London'
const LOCALE = 'en-GB'

/**
 * Everything the app holds a date as: a `Date`, an ISO string from Postgres, a
 * bare `YYYY-MM-DD`, or epoch milliseconds from Stripe. Returns null for
 * anything unparseable so callers choose their own fallback wording rather than
 * printing "Invalid Date".
 */
function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function format(value: DateInput, options: Intl.DateTimeFormatOptions, fallback: string): string {
  const date = toDate(value)
  if (!date) return fallback
  return date.toLocaleDateString(LOCALE, { ...options, timeZone: TIME_ZONE })
}

/** "15 June 2026". The default: a date read once, not scanned against others. */
export function formatLongDate(value: DateInput, fallback = ''): string {
  return format(value, { day: 'numeric', month: 'long', year: 'numeric' }, fallback)
}

/** "13 September". No year, for a date inside the reader's own month or two. */
export function formatLongDateNoYear(value: DateInput, fallback = ''): string {
  return format(value, { day: 'numeric', month: 'long' }, fallback)
}

/** "14 Aug 2026". Narrow enough for a status strip, still unambiguous on year. */
export function formatMediumDate(value: DateInput, fallback = ''): string {
  return format(value, { day: 'numeric', month: 'short', year: 'numeric' }, fallback)
}

/** "12 Nov". For axes, column headers and anywhere the year is context. */
export function formatShortDate(value: DateInput, fallback = ''): string {
  return format(value, { day: 'numeric', month: 'short' }, fallback)
}

/**
 * "Tue 16 Jun". The weekday earns its place only where the reader is waiting on
 * the date and wants to know which working day it lands on.
 */
export function formatWeekdayDate(value: DateInput, fallback = ''): string {
  return format(value, { weekday: 'short', day: 'numeric', month: 'short' }, fallback)
}
