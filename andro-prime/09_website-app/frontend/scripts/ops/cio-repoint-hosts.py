# -*- coding: utf-8 -*-
"""Repoint Customer.io email bodies from the apex to the app host for the two
AUTHENTICATED routes only.

Why a script rather than editing through the agent's context: these bodies are
version-locked approved copy. Reading them into context and retyping them risks
a silent copy change that nobody would notice until it shipped. Here the only
mutation is a regex over two exact URL shapes, and every other byte is passed
through untouched.

Sweeps EVERY action on EVERY campaign rather than a hand-listed set, so a
template missed by the earlier audit still gets caught.

Usage:  python cio_repoint.py --dry     (report only, writes nothing)
        python cio_repoint.py --apply   (PUT the changed actions back)
"""
import json
import os
import re
import sys
import time
import urllib.request

BASE = "https://api-eu.customer.io"

# Only these two paths move. /kits, /test-selector, /supplement-waitlist and the
# bare domain are MARKETING and must stay on the apex.
PATTERN = re.compile(r"(?<!app\.)andro-prime\.com/(account|auth/login)")
REPLACEMENT = r"app.andro-prime.com/\1"

# Fields that can carry a link. `layout` is shared across actions, so it is
# reported but never written from here: writing it per-action would fight itself.
BODY_FIELDS = ("body", "body_plain", "body_amp")


def load_key() -> str:
    env_path = os.path.join(
        r"d:\Androprime_main\andro-prime\09_website-app\frontend", ".env.local"
    )
    with open(env_path, encoding="utf-8") as fh:
        for line in fh:
            if line.startswith("CUSTOMERIO_APP_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    raise SystemExit("CUSTOMERIO_APP_API_KEY not found")


KEY = load_key()


def api(path: str, method: str = "GET", payload=None):
    req = urllib.request.Request(BASE + path, method=method)
    req.add_header("Authorization", "Bearer " + KEY)
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, data, timeout=45) as resp:
        raw = resp.read().decode("utf-8")
        return resp.status, (json.loads(raw) if raw.strip() else {})


def main() -> int:
    apply = "--apply" in sys.argv
    if not apply and "--dry" not in sys.argv:
        raise SystemExit("pass --dry or --apply")

    _, camps = api("/v1/campaigns")
    campaigns = camps.get("campaigns", [])
    print("campaigns: %d" % len(campaigns))

    changed, scanned, failed = [], 0, []

    for c in campaigns:
        cid = c["id"]
        # /v1/campaigns/{id}/actions returns FULL action objects including body,
        # so one call per campaign covers everything. The public API has no
        # workflow_action_ids field: that shape belongs to the internal API the
        # MCP proxies, and assuming it here scanned zero actions while reporting
        # zero changes, which reads identically to "nothing needed changing".
        try:
            _, wrapped = api("/v1/campaigns/%s/actions" % cid)
        except Exception as exc:
            failed.append((cid, None, "list: %s" % exc))
            continue

        for a in wrapped.get("actions", []) or []:
            aid = a.get("id")
            scanned += 1

            updates, hits = {}, 0
            for field in BODY_FIELDS:
                val = a.get(field)
                if not isinstance(val, str) or not val:
                    continue
                new, n = PATTERN.subn(REPLACEMENT, val)
                if n:
                    updates[field] = new
                    hits += n

            layout = a.get("layout")
            if isinstance(layout, str) and PATTERN.search(layout):
                print("  !! layout on action %s also matches; NOT written here" % aid)

            if not updates:
                continue

            name = (a.get("name") or "").strip() or "(unnamed)"
            changed.append((cid, aid, name, hits))
            print("  campaign %-4s action %-4s  %-42s  %d link(s)" % (cid, aid, name[:42], hits))

            if apply:
                try:
                    status, _ = api(
                        "/v1/campaigns/%s/actions/%s" % (cid, aid), "PUT", updates
                    )
                    print("      -> PUT %s" % status)
                except Exception as exc:
                    failed.append((cid, aid, "write: %s" % exc))
                    print("      -> WRITE FAILED: %s" % exc)
                time.sleep(0.3)

    print()
    print("scanned %d actions; %d carry an authenticated apex link; %d total link(s)"
          % (scanned, len(changed), sum(h for _, _, _, h in changed)))
    if failed:
        print("FAILURES:")
        for f in failed:
            print("  ", f)
        return 1
    print("mode: %s" % ("APPLIED" if apply else "DRY RUN, nothing written"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
