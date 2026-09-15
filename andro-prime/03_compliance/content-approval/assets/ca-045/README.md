# CA-045 packet attachments

Evidence for the CA-045 sign-off packet
(`../../ewa-packet-ca-045-homepage-imagery-2026-09-02.md`). **Nothing here is approved by
existing.** These are the artefacts the questions are answered against.

## Why this directory exists at all

Until 2026-09-15 the packet's eleven attachments lived **only inside a Gmail draft**. Nine of them
were recoverable, being copies of `09_website-app/frontend/public/home/img-1..8.jpg` and
`poster.jpg`. **Two were not recoverable by any means**, and they are the two that answer question
6: renders of the hero data field, which is a canvas drawn at run time, so no still of it existed
anywhere else. The "revealed" one cannot even be screenshotted from a running site, because the
state it shows never ships.

That made a routine edit dangerous in a way nobody had noticed: Gmail's update-draft operation does
not merge attachments, so changing one word of the body would have destroyed both images silently.
It was caught only because the tool's own documentation was read before the edit rather than after.

**The general rule, which is the `/wrap` rule about public-facing assets applied one step further:
an artefact that exists only inside an email has no version, no owner and no history, and cannot be
swept when the thing it depicts changes.** Evidence in an approval packet is a stronger case than
brand assets, not a weaker one, because it is what a clinician's ruling attaches to.

## The two renders, and how to make them again

Both regenerated 2026-09-15 from `redesign/direction-f`, at 1440x950, light theme, scale 1.5. The
point of recording the method is that they are now **reproducible** rather than one-off: if the
hero changes, these can be remade to match instead of silently describing an older page.

| File | What it is |
| --- | --- |
| `q6-hero-as-it-ships.png` | The hero exactly as a visitor receives it. |
| `q6-hero-field-revealed.png` | The same hero with the field's concealment removed, so the question can be answered on the thing itself rather than on a description of it. **This state never ships.** |

Serve a production build (not `next dev`), then:

```bash
node andro-prime/12_operations/automation/shot.js http://localhost:3000/ \
  --width 1440 --height 950 --theme light --no-walk --motion --wait 1200 \
  --localstorage ap_cookie_consent=denied --expect-text "Your bloods came" \
  --name q6-hero-as-it-ships --out <this directory>
```

⚠ **Three flags are load-bearing and the capture is wrong without them.** `--no-walk`, because
`shot.js` scrolls the page to trigger reveal animations and the default capture is therefore of the
sample-result section, which is a perfectly good screenshot of the wrong thing. `--motion`, because
the field is a canvas animation and motion is off by default. And `--expect-text "Your bloods came"`
rather than the fuller headline, because the DOM renders a typographic apostrophe and a match on
`That's` fails on the straight one.

⚠ **`--no-walk` makes `shot.js` exit 2**, reporting below-the-fold reveal elements still hidden.
That is the tool being correct: for a hero capture those elements are irrelevant, but it cannot know
that, and it refuses to call a capture trustworthy on its own judgement. Read the named elements and
confirm they are all below the fold before accepting the shot.

For **`q6-hero-field-revealed.png`**, make three temporary source changes, rebuild, capture, then
revert all three and rebuild again:

1. `frontend/styles/components/f-primitives.css`, `.f-field` — `opacity: 0.34` to `opacity: 1`.
2. The same rule's `-webkit-mask-image` and `mask-image` to `none`. This is the vertical mask that
   fades the field out at the top and bottom of the hero.
3. `frontend/components/marketing/HeroField.tsx` — `const fade = 1 - near * 0.88` to `const fade = 1`.
   This is the per-row fade that drops rows near the headline to a twelfth of their weight, and
   without removing it the middle of the reveal stays faint.

The revert is verified by `git diff` over exactly those two files returning empty, and by a grep for
any marker left in them. Do that before rebuilding, not after.
