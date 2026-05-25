const ADMIN_EMAILS = new Set([
  'keith@andro-prime.com',
])

export function isAdmin(user: { email?: string | null } | null | undefined): boolean {
  const email = user?.email?.toLowerCase()
  return !!email && ADMIN_EMAILS.has(email)
}
