// Derive a person's age in whole years from an ISO date-of-birth string
// (YYYY-MM-DD). Returns null for missing/invalid input.
//
// We hold two overlapping fields on `users`: `date_of_birth` (captured at
// checkout, sent to Vitall for age-appropriate lab ranges) and `age` (an integer
// captured only at the post-login consent step for non-purchasers). A customer who
// bought a kit therefore has a DOB but no `age`. Rather than ask them for their age
// a second time at login, derive it from the DOB they already gave. Prefer the
// stored `age` when present; fall back to this.
export function ageFromDobIso(dobIso: string | null | undefined): number | null {
  if (!dobIso || !/^\d{4}-\d{2}-\d{2}$/.test(dobIso)) return null
  const dob = new Date(dobIso)
  if (Number.isNaN(dob.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDiff = now.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1
  }
  return age >= 0 && age < 130 ? age : null
}
