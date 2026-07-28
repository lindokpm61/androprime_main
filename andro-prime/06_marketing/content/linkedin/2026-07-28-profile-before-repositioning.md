# LinkedIn profile: state before the Andro Prime repositioning

**Captured:** 2026-07-28, immediately before the headline and About were rewritten via the Unipile API.
**Purpose:** restore path. The Unipile profile-edit endpoint overwrites in place and has no undo. If the repositioning needs reverting, paste these values back.
**Account:** Unipile account id `vX9iWaO0Q0KNed0UWsOraA`, LinkedIn `linkedin.com/in/keithantony`, provider id `ACoAACKXRwYBFogMdtl9M3n3QijiRbAE-oTngx0`.

## Baseline metrics at capture

900 followers, 858 connections, creator mode on, open profile on, not premium. 15 posts, all between 4 and 25 March 2026, then dark for four months. 8,621 impressions in total across those 15 posts, median 222 per post, 16 reactions and 8 comments in aggregate. Listed websites: `keith-antony.com` and `keith-antony.com/audit`. Contact email on profile: `antidotedigi@gmail.com`. Location: Croydon, England.

## Previous headline

```
I find what's broken in your business operations. Then I fix it. | Systems diagnostics for UK founders, £1M-£10M | £500 process audit, no obligation.
```

## Previous About (summary)

```
Most founders I work with are running their business on duct tape and goodwill.

They've got a CRM that doesn't talk to their ops system. Admin staff burying themselves in work that should take 20 minutes but takes 3 hours. Processes that worked when the business was half the size. And no clear way to fix it without hiring more people or buying another tool that sits in isolation.

That gap between "the business works" and "the business works properly" is where I operate.

I map your actual operation. Not the version on paper. The real one. The spreadsheet nobody fully understands, the knowledge trapped in one person's head, the workaround that became permanent three years ago.

Then I build the fix. Not templates. Not SaaS. Something your team owns permanently.

The fastest way to start is a £500 process audit. One hour. I map your current operation, show you exactly where you're losing time and money, and tell you whether automation will actually fix it. A written report. The specific gaps in front of you. No obligation to go further.

If the audit shows something worth fixing, I build it. Typical engagement runs six weeks, discovery to handover, starting from £5,000.

If you're a founder whose ops are getting in the way of growth, DM me about the audit or book directly from the link in Featured.
```

## Not touched by the repositioning

The work-experience entries (Keith Antony Consulting, Morley Fund Management, WestLB), the 31 skills, the profile photo, the background image, the listed websites and the contact email were all left as they were. Only `headline` and `summary` were written. The two company pages on the account (`noCodeer`, urn 81835788, and `Keith Antony`, urn 110434140) were not touched either.

## Restore command shape

```
PATCH https://api20.unipile.com:15044/api/v1/users/me/edit
multipart/form-data: type=LINKEDIN, account_id=vX9iWaO0Q0KNed0UWsOraA, headline=<above>, summary=<above>
```
