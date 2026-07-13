# Content Machine: Assets

**Owner:** Keith Antony | **Status:** Live tracker, 2026-07-13 | **Read first:** `../CONTEXT.md`, `../content-library-build-spec.md`

One markdown file in this folder is one founder content idea, from first hook to measured. It is the single record for that piece: **its frontmatter is the tracker** (status, funnel tags, preflight result, and every platform rendition), and its body holds the chosen hook plus the script.

**Filename:** `YYYY-MM-DD-<slug>.md`, lowercase kebab-case. The date is the mint date, the slug is immutable once set (it is also the Drive folder name and the ClickUp task name).

**The gate scanner enforces transitions.** `.claude/skills/content-status/scan.js` reads the frontmatter and hard-blocks invalid moves (exit 2): no `scripted` without a script, no `approved` without a green preflight and a canonical asset, no `scheduled` rendition without its thumbnail, and the compliance HARD checks (no em dashes, the silent ingredient never named). It runs in `/wrap` and on demand via `/content-status`.

**The tools write here, not you.** `/hook` mints the file, `/script` fills the body and adds the default renditions, and `/content-status` renders the board and moves status. Humans rarely edit frontmatter by hand: let the skills do it so the gates stay honest.

Media (video, thumbnails) lives in Google Drive at `Content/YYYY-MM/<slug>/{raw,final,thumb}/`, never in git. The asset file holds only the folder link.

Start from the template at `../templates/asset-file.md`.
