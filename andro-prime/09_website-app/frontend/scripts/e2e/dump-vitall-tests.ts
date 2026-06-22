/**
 * One-off: dump Vitall's GET /tests definitions so we can read the exact marker
 * `name` / `name_simple` / units per panel — the source of truth for our
 * normaliser NAME_MAP, instead of guessing from demo results.
 *
 * Run from andro-prime/09_website-app/frontend:
 *   npx tsx scripts/e2e/dump-vitall-tests.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  if (!process.env.VITALL_CLIENT_ID || !process.env.VITALL_CLIENT_SECRET) {
    console.error('Missing VITALL_CLIENT_ID / VITALL_CLIENT_SECRET in .env.local')
    process.exit(1)
  }
  const { getAvailableTests } = await import('@/lib/vitall/client')
  const data = await getAvailableTests()
  console.log(JSON.stringify(data, null, 2))
}

main().catch((err) => {
  console.error('crashed:', err)
  process.exit(1)
})
