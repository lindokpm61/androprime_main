/**
 * Supabase credentials. Read from the environment, never defaulted.
 *
 * 🔴 THIS MODULE USED TO DEFAULT ALL THREE, and that was Gate A item A3. It held
 * the real production project ref, the real anon key, and a placeholder
 * service-role key as `||` fallbacks, so a missing variable produced a client that
 * WORKED and pointed somewhere nobody chose — the identical shape to the
 * `http://localhost:3000` fallback fixed in `lib/activate/sendActivationLink.ts`
 * in the same change. **A fallback indistinguishable from success is a decision to
 * fail silently, taken by whoever wrote the `||`.** Neither one fails; both put a
 * wrong answer in front of a customer. Removed 2026-09-17.
 *
 * It mattered most where it looked safest. The fallback ref and the current
 * `NEXT_PUBLIC_SUPABASE_URL` are the same project TODAY, so the defect was
 * invisible: production was correct by coincidence. The day the ref changes — a
 * staging project, a restore, a migration — a missing variable stops being a
 * config error and becomes a silent connection to the old database.
 *
 * The check is truthiness, not `??`. The Dockerfile exports an unsupplied build
 * secret as `$(cat … || echo '')`, so it arrives as the EMPTY STRING, which `??`
 * passes straight through. Same rule `verify-env-contract.js` assertion F enforces
 * across the app, and assertion G now fails if a credential fallback comes back.
 *
 * `isSupabaseConfigured()` stays the soft check and is unchanged: call sites that
 * can degrade gracefully ask it first. The getters below are for call sites that
 * cannot continue without a credential, and they now say so instead of guessing.
 */

function required(name: string, value: string | undefined): string {
  if (value) return value
  throw new Error(
    `${name} is not set, and Supabase credentials have no fallback by design — a ` +
      `default here yields a working client pointed at a project nobody chose. ` +
      `Set it in .env.local locally. Every NEXT_PUBLIC_ one is ALSO a Coolify ` +
      `build argument: it is inlined at build time and cannot be repaired by ` +
      `restarting the container.`
  )
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  )
}

export function getSupabaseUrl() {
  return required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
}

export function getSupabaseAnonKey() {
  return required(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}

export function getSupabaseServiceRoleKey() {
  return required('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)
}
