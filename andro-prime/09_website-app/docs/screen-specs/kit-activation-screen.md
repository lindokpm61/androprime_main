# Screen Specs — Kit Activation

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active
**Route:** `/activate?kit=KIT_CODE`

---

## Purpose

Confirms kit receipt, records activation against the order, and surfaces sample collection instructions. Triggered by scanning the QR code in the kit insert. The kit code is pre-filled from the URL — the customer never types it.

---

## Design Principles

- Feels like a continuation of the kit experience, not a form to complete.
- The primary goal after confirmation is to get the customer to take the sample correctly — the instructions are the most important content on this screen.
- Keep it linear. No sidebar nav. No distractions.
- Authenticated state: full confirmation screen. Unauthenticated state: email prompt first.

---

## Layout

**Container:** Centred column, `max-w-md` (448px). Horizontal padding `px-6`. Top padding `pt-12`.

**Minimal nav bar at top:** Logo only. `border-b-2 border-black`. No links. Height `h-16`.

---

## State A — Unauthenticated

Customer scanned the QR code but does not have an active session.

**Eyebrow:**
```
YOUR KIT
```

**Heading:**
```
Sign in to activate your kit.
```

**Subtext (Merriweather):**
```
Enter your email address. We'll send a sign-in link — it takes 30 seconds.
```

**Form:**
- Email field (same styling as auth screens)
- Label: `EMAIL ADDRESS`
- Primary button: `SEND LINK  →`

On submit: magic link generated with `redirect=/activate?kit=KIT_CODE` baked into the URL. Confirmation shown:

**Heading:**
```
Check your email.
```
**Subtext:**
```
We've sent a sign-in link to [email]. Click it to come back here and activate your kit.
```

When customer clicks the magic link, session is created and they are redirected back to `/activate?kit=KIT_CODE` — proceeding to State B.

---

## State B — Authenticated, Kit Valid

Customer is authenticated and the kit code maps to their account.

**Layout: two-section page**

### Section 1 — Confirmation banner

Full-width `bg-black text-white` banner. `py-8 px-6`.

Left: Status dot (white square, 8px) + eyebrow label `KIT ACTIVATED` in JetBrains Mono uppercase.

Below: Heading in Inter font-black ~1.5rem:
```
Your kit is registered.
```

Right-aligned (desktop) or below (mobile): Kit name in a `border border-white rounded-none px-3 py-1` tag:
```
Testosterone Health Check
```
(or whichever kit the order contains)

---

### Section 2 — Sample collection instructions

`border-t-4 border-black` separator.

**Eyebrow:**
```
NEXT STEPS
```

**Heading:**
```
How to take your sample.
```

**Subtext (Merriweather):**
```
Takes about 5 minutes. Do this in the morning before 10am if possible — testosterone levels are highest earlier in the day.
```

**Instruction steps:**

Numbered list. Each step is a card with `border-2 border-black rounded-none p-5`. Large ghost number positioned behind (gray-100, Inter font-black ~80px, absolutely positioned top-right). Content: step title in Inter font-black + one line of Merriweather body below.

```
1   WASH YOUR HANDS
    Warm water for 30 seconds. This improves blood flow to your fingertips.

2   USE THE LANCET
    Press it firmly against the side of a fingertip — not the pad. Rotate fingers between samples.

3   FILL THE TUBE
    Gently squeeze your finger and collect blood to the fill line. Takes 1–2 minutes.

4   SEAL AND PACK
    Seal the tube, place it in the biohazard bag, and put the bag in the pre-paid envelope.

5   POST TODAY
    Use the pre-paid envelope provided. Post before 2pm for same-day collection where possible.
```

**Note below instructions** (Merriweather text-sm, `border-l-4 border-black pl-4 text-gray-600`):
```
If you can't get enough blood from your fingertip, try warming your hands again or gently swinging your arm downward a few times before retrying.
```

**CTA:**
```
GO TO MY DASHBOARD  →
```
Primary button. Full width on mobile, `w-auto px-8` on desktop, left-aligned. Routes to `/app/dashboard`.

---

## State C — Kit Already Activated

**Heading:**
```
This kit has already been activated.
```

**Subtext:**
```
If you're looking for your results, go to your dashboard.
```

**Button:**
```
GO TO MY DASHBOARD  →
```

---

## State D — Kit Belongs to Different Account

**Heading:**
```
This kit doesn't match your account.
```

**Subtext:**
```
If you think this is wrong, contact us and we'll sort it out.
```

**Button:**
```
CONTACT SUPPORT  →
```
Routes to support contact method (email or help page).

---

## State E — Kit Code Not Found

**Heading:**
```
We couldn't find this kit.
```

**Subtext:**
```
Try scanning the QR code again. If you're still seeing this, contact us.
```

Two actions:
1. Text link: `Scan again` — closes page (JS `window.close()` or instructions to re-scan)
2. Button: `CONTACT SUPPORT  →`

---

## Mobile

- Ghost numbers on instruction cards hidden on mobile (`hidden md:block`) — they overlap at small sizes
- Instruction cards stack full width, `p-5` padding preserved
- Confirmation banner: heading and kit tag stack vertically, both left-aligned
- CTA button: full width

---

## Component Reference

| Component | Token / class |
|---|---|
| Page background | `bg-white` |
| Minimal nav | `h-16 border-b-2 border-black flex items-center px-6` |
| Confirmation banner | `bg-black text-white py-8 px-6` |
| Instruction card | `border-2 border-black rounded-none p-5 relative overflow-hidden` |
| Ghost number | `absolute top-0 right-2 text-[80px] font-sans font-black text-gray-100 select-none pointer-events-none` |
| Step title | Inter font-black text-base uppercase tracking-wide |
| Step body | Merriweather text-sm text-gray-600 mt-1 |
| Note block | `border-l-4 border-black pl-4 font-serif text-sm text-gray-600` |
| Primary button | Standard primary button from brand guidelines |
