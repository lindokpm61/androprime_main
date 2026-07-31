# X Channel Plan (Spine B, Lane 1)

**Owner:** Keith Antony | **Status:** v1, LIVE since 2026-07-29 (Keith signed off the reply habit, §10 decision 1) | **Read first:** `CONTEXT.md`, `written-post-playbook.md`, `../content/social-channel-setup.md`, `03_compliance/CONTEXT.md`

The account is wired (`@KeithAndroPrime`, connected via Metricool 2026-07-28) and has no lane, no cadence and no queue rows. This is the plan that makes it a channel instead of a connected account. **Keith has not used X before**, so this doc covers how the platform behaves as well as what to post.

---

## 1. The single most important thing about X

**Posting does not grow an X account. Replying does.**

Every other channel in the stack rewards the post: LinkedIn shows your post to a slice of your 900 followers, Substack emails 8 subscribers, the blog earns search traffic. X does not work that way. A post from an account with no followers and no reply history is shown to almost nobody, and posting daily into that silence changes nothing except the number of posts.

What moves an X account from zero is appearing in other people's replies, where their audience already is. The post is where that borrowed attention lands afterwards.

So the daily post is real, and it is the smaller half of the plan. **The other half is 10 to 15 replies a day, roughly 15 minutes.** If the reply habit does not happen, expect the daily posting to produce close to nothing for months, and treat that as the plan working as designed rather than as a surprise. This is the one thing in the plan that Keith has to agree to personally, because it cannot be batched, scheduled or delegated to a tool.

---

## 2. Identity

Consistent with every other founder channel: **founder-forward, Keith's own account, not a brand account.**

- **Handle:** `@KeithAndroPrime` (changed by Keith 2026-07-30 from the original `@keithantonyAP`). Now matches `@keithandroprime` on YouTube and `keithandroprime.substack.com`, so the founder handle is consistent across all three written channels and only Instagram (`@keith.antony.tech`) still diverges.
- **Display name:** `Keith Antony 🟣 Andro Prime` **(LIVE, verified by screenshot 2026-07-31)**. Keith used a coloured circle rather than the planned middle dot; it reads better at small sizes and is kept. Matches the shared cross-platform rule either way: the Name field and the headshot carry recognition, not the handle.
- **Avatar:** the same headshot used on LinkedIn, Instagram and YouTube. Not the logo.
- **Bio (158 of 160 characters). LIVE since 2026-07-31, verified by screenshot:**
  > I find what's broken in systems nobody can see into. Banks, then businesses, now men's blood results.
  > Founder, Andro Prime. UK.
  > Education, not medical advice.
- **Location:** `London` **(LIVE)**. Planned as "Croydon, UK"; Keith chose London, which is the wider-recognition option and is kept. **Link:** `andro-prime.com/test-selector?utm_source=x&utm_medium=bio` (the quiz), not the homepage, LIVE and UTM'd.
- **Banner:** `02_brand/assets/social/x-header-1500x500-black.png`, live and rendering. **Known defect: X crops it vertically and the bottom of the design is lost** (the marker strip and the lower white rule are gone; the `EDUCATION, NOT MEDICAL ADVICE` sub-line survives but sits on the crop boundary). The content block was recropped from the 16:9 original without being re-centred for 3:1, so it sits too low. Fix is to shift the block up, or drop the marker strip on X. Recorded rather than silently accepted.
- **Naming rule carries over from LinkedIn:** do not name the medical lead in X copy. Use "our GMC-registered medical lead". Same reasoning, same scope: this is Keith's personal account.

---

## 3. What X is for, and what it is not

**Role:** top-of-funnel reach and AI-search presence. X is now a heavily weighted source for LLM answers, which connects it to the `seo-ai-search` workstream: a marker explanation that gets quoted on X is a marker explanation an AI assistant can cite. That is the strategic reason to be there, ahead of any follower count.

**Not for:** conversion. Nothing on X sells a kit. Every route is quiz or email rung, exactly as on LinkedIn.

**Relationship to LinkedIn:** same founder, different register. LinkedIn gets the considered POV post two or three times a week and ends on a genuine question. X gets the single sharp observation, daily, and often ends on nothing at all. Do not cross-post the LinkedIn text; it reads long and earnest on X. The two audiences barely overlap.

---

## 4. Supply: the inventory already covers about fourteen weeks

Daily sounds like a lot until you count what exists. **Seventeen published, Ewa-signed articles.** Each one yields five to seven standalone X posts without a single new claim:

- one or two marker facts stated plainly
- the normal-versus-optimal wedge applied to that marker
- a myth correction the article already makes
- a question the article answers
- a founder-journey line where Keith's own history touches it

Call it six per article: **roughly 100 posts, about fourteen weeks of daily posting, entirely from claims that are already signed off.** Every new article adds another six. Supply is not the constraint and will not become one.

This matters for compliance as much as for volume: a derivative that only restates its canonical article inherits that article's sign-off. **Net-new claims are what cost Ewa's time**, and this plan generates almost none.

---

## 5. The weekly rotation

Seven slots. The mix keeps the account from reading like an automated content feed, which is the failure mode of daily posting from a backlog.

| Day | Type | Source | Link? |
| --- | --- | --- | --- |
| Mon | **Marker fact** | a published article | no |
| Tue | **Normal vs optimal** wedge | `myth-of-normal-range` or the article of the week | no |
| Wed | **Founder line** | Keith's own journey, the bio material | no |
| Thu | **Article link-out** | that week's featured article | yes, in a reply |
| Fri | **Myth correction** | a published article | no |
| Sat | **Open question** to the timeline | any | no |
| Sun | **Thread**, 5 to 7 posts | one article, atomised | link in the last post |

**On links.** X suppresses posts carrying an external link. Put the link in a reply to your own post, the same convention already used on LinkedIn's first comment. One or two link-bearing posts a week is the ceiling; the rest earn their reach by being worth reading without leaving.

**On hashtags.** None, or at most one. Hashtags on X now read as spam and do nothing for distribution. This is the opposite of Instagram and it catches people out.

**On length.** 280 characters is the hard ceiling and Metricool enforces it, refusing to split a longer message. Write to about 240 so a quote-tweet still fits. Short posts outperform: two lines beats a paragraph.

**On threads.** Sunday only, and produce them by hand for now. Metricool's post tool explicitly refuses to split X copy into a thread, so a scheduled thread is not something to rely on until the mechanism is tested.

---

## 6. How a week is actually produced

The batch is the point. Seven individually-drafted, individually-reviewed posts a week is not sustainable; seven drafted in one sitting is about an hour.

1. **Pick the article of the week** from the atomisation grid on the Content Machine board, preferring one with no derivatives yet. Thirteen of the seventeen currently have none.
2. **Draft all seven** into one file, `content-machine/drafts/x-week-<date>.md`, using the rotation above.
3. **One `/compliance-preflight` run over that file.** This is the reason to batch: the scanner reads a file, so a week costs one run rather than seven. Any HARD hit is fixed in place; anything genuinely net-new goes to Ewa, and in this model that should be rare.
4. **Keith approves the batch**, in one read.
5. **Schedule all seven in Metricool** to the daily slot. Metricool holds the calendar; nothing auto-publishes without Keith having approved the batch.
6. **Register the renditions** in `content_renditions` with `platform='x'`, `format='text-post'`, `publisher='metricool'`, so the board counts them and the coverage number moves.

**Timing.** Until there is a fortnight of the account's own data, use UK slots that suit the audience rather than a benchmark curve: 07:30 to 08:30, 12:00 to 13:00, or 20:00 to 21:30. After two weeks, pull Metricool's best-time-to-post for X on this brand and replace these with the real thing. **Metricool's current best-time figures for X are its global benchmark, not this account**, and should not be presented as ours.

**Stay for ten minutes after each post goes out.** Early replies are weighted heavily; a post left alone for an hour is largely finished.

---

## 7. The reply habit

Fifteen minutes, once a day, ideally before the post goes out so the account is already warm.

- **10 to 15 replies**, on accounts whose audience overlaps with Mark: UK men's health, GP and NHS commentary, longevity and testing, strength and midlife fitness, plus the general "my bloods came back normal" conversation.
- **A reply is a contribution, not a plug.** Add the specific thing the thread is missing. No link, no pitch, no "great post".
- **Never give individual medical advice in a reply.** Someone posting their own numbers and asking what to do is the single highest-risk interaction on this channel, and it is the one most likely to happen. Standing answer: explain what the marker measures in general terms, and say it is a GP conversation. Do not interpret their result, do not suggest what they should take. This is Phase 0 and it is education, not advice.
- **Log nothing, force nothing.** This habit is judged after a month by follower and reply counts, not by a tracker.

---

## 8. Compliance, specific to X

Everything in `03_compliance/CONTEXT.md` applies unchanged. The X-specific pressure is that the format rewards a confident short claim, which is exactly the shape of a compliance failure.

- **Never:** diagnose, treat, cure, fix; "you have low testosterone"; TRT availability; ashwagandha in any context; "clinically proven".
- **The recurring safe wedge** is normal-versus-optimal: it is the platform's favourite kind of post, it is genuinely true, and it is already signed off across several articles.
- **Never fire a low-T implication from a Kit 2 marker.** Energy and recovery markers do not license a testosterone statement.
- **"Recommendation logic approved by our GMC-registered medical lead"** is the substantiation phrasing. It must not drift into anything implying per-customer clinical interpretation.
- **No em dashes.** Brand rule, and an AI tell.
- **Real numbers only.** No invented figures, including in a founder-journey post. If a post needs Keith's own result, it waits for the Ep 0 bloods.

---

## 9. What success looks like, and when to judge it

Do not judge this channel on week one. A cold account posting into no audience produces almost nothing, and the LinkedIn baseline is the honest comparison: a profile with 900 followers and a four-month gap earned 33 impressions on its return post.

- **Weeks 1 to 4:** the only metric that matters is whether the habit held. Seven posts a week and roughly 300 replies over the month. Followers will be low double digits and that is normal.
- **Weeks 5 to 8:** look for the first posts that outperform the account's own median by several times. Those angles go back into the rotation and into the hook rubric.
- **Week 9 onward:** follower growth rate and profile clicks. Replace the timing guesses with Metricool's own data for this account.
- **Kill criterion, stated in advance so it is a decision rather than a drift:** if after eight weeks of a held habit the account is under 100 followers and no post has cleared 1,000 impressions, X is not working for this positioning. Stop, and put the hour a week back into Lane 1 channels that are working.

---

## 10. Decisions owed by Keith

1. **The reply habit.** Fifteen minutes a day, by him, not automatable. Without it the rest of this plan mostly does not work. If that is not realistic, say so now and the plan should be rewritten around a lower posting cadence rather than pretending.
2. ~~**Handle.** Keep `@keithantonyAP` or change it to match `@keithandroprime` elsewhere.~~ **RESOLVED 2026-07-30:** Keith changed it to `@KeithAndroPrime`. No week-8 revisit needed.
3. **The consulting practice.** LinkedIn kept it visible as a bridge. X is a fresh start with no existing audience to reconcile, so the recommendation is Andro Prime only, with the systems career as biography rather than an offer.

## 11. Not doing, deliberately

- **No automation, no scheduling tools beyond Metricool, no engagement pods.** Same rail as LinkedIn.
- **No paid promotion** until the organic habit has run eight weeks. Paying to amplify a positioning that has not been tested is how the budget goes.
- **No X-first content.** Everything derives from a published article or Keith's own documented history, so the substantiation trail holds.
