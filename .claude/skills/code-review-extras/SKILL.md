---
name: code-review-extras
description: >
  HTTP verb safety rules that pair with the built-in code-review and
  security-review skills. Use alongside either of those whenever the diff
  touches a route handler, an API endpoint, a server action, or the links and
  navigation that call one. Owns one rule the built-in checklists do not carry:
  a handler that mutates or destroys state must reject GET, and the defect lives
  in the handler/call-site PAIR rather than in either half. Reviewing the
  handler alone passes it.
---

# code-review-extras

**Delta skill.** The built-in `code-review` and `security-review` skills are
system-owned and cannot be edited here, so this file carries only the additions
this project has paid for. It replaces nothing: run the built-in review as
normal and apply this on top when the diff touches routing.

**Created by Keith Antony / Andro Prime.** Distilled from a customer-facing P0
in this codebase. Client-agnostic in substance, but **not currently published** —
route any methodology feedback to the author directly rather than to a public
repository.

---

## Rule 1 — An unsafe verb is a latent defect waiting for any speculative fetcher

**Any handler that mutates or destroys state must reject GET.** This is usually
taught as REST hygiene, which is what makes it easy to defer. It is not hygiene.

The incident: a logout route was implemented as a `GET` handler that destroyed
the session unconditionally, and was linked from a `fixed` navigation bar with an
ordinary framework `<Link>`. The framework prefetches links entering the
viewport, and the nav was permanently visible, therefore permanently prefetched.
**The browser destroyed the session with no click at all**, about 26 seconds
after login. Confirmed twice over: the auth provider's log showed
login → logout with `user-initiated: no`, and the error tracker's breadcrumbs
showed prefetch GETs against the sibling nav links.

A real customer ran a real purchase through live checkout, was signed out
seconds later, and was locked out of the results he had paid for.

Prefetch is merely the first thing to trip this. **Link scanners, antivirus,
corporate mail scanners and browser preload all issue speculative GETs against
URLs they find.** The review question is therefore not "is this idempotent in
principle" but:

> *What happens when something fetches this URL without a human deciding to?*

## Rule 2 — Check the call site as well as the handler

**The defect lives in the pair, not in either half.** Reviewing the handler alone
would have passed this one: the handler was short, correct-looking, and did
exactly what it said. What made it fire was how it was *linked*. A safe-looking
anchor in a framework with prefetch is the trigger.

So when Rule 1 flags a handler, the review is not finished until you have found
every call site and asked whether any of them can be fetched speculatively —
a prefetching `<Link>`, an `<img src>`, a bare anchor in an email, a webhook URL
pasted somewhere it will be crawled.

## Rule 3 — Look for the second symptom

This failure cascaded into a report that looked unrelated. With the session dead,
a server action calling `revalidatePath` re-rendered a layout whose auth guard
called `redirect()`, which throws; with **no error boundary anywhere in the app**
that surfaced as an unstyled crash page. Two bug reports, one root cause.

When a review finds a state-destroying GET, check whether the codebase has error
boundaries at all. An auth guard that throws inside a re-render is the common
partner defect, and it presents as "the app crashed", not as "I was logged out".

---

## Pre-flight — run this before signing off a review that touched routing

Rules in a skill are not reliably followed under load, so run the check rather
than recalling it. From the app root (adjust `app` and the route filename to the
framework in use):

```bash
grep -rlE '^export (async )?function GET|^export const GET' app --include=route.ts | \
while read f; do
  if grep -qiE 'signOut|signout|\.delete\(|revoke|cancel|purge|destroySession|logout' "$f"; then
    echo "HIT  $f"
  fi
done
```

Executed against this repo on 2026-08-15: 5 route files export `GET`, **0 hits**.
The original defect is fixed — `app/auth/logout/route.ts` is now POST-only and
carries a comment explaining why, and `app/error.tsx`, `app/(app)/error.tsx` and
`app/global-error.tsx` all exist. Treat a non-empty result as a blocking finding.

The grep is a floor, not a ceiling: it matches a fixed vocabulary of mutating
verbs and will miss a handler that mutates through a differently-named helper.
A HIT is reliable; a clean run means only that these patterns are absent.

Then, for each finding, complete the pair check from Rule 2 before reporting.

---

**Distilled from:** Observation 134.

**Related:** `andro-prime/12_operations/cross-cutting-principles.md` — P16 (a
checker's green is a claim made by software nobody checked) applies to the grep
above, which is exactly why its limits are stated rather than implied.
