import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./canonical-site/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./lp/**/*.{js,ts,jsx,tsx,mdx,html}",
  ],
  theme: {
    // Direction F radius scale, 2026-08-29. These were top-level overrides
    // zeroing EVERY radius utility, on the V2.0 rule "rounded-none everywhere,
    // no exceptions". Keith demoted that rule to advisory on 2026-08-27 and the
    // zeroing then made the approved direction uncompilable, silently:
    // `rounded-3xl` resolved to 0px and emitted no error, so a page built
    // against the F frames would have rendered flat with nothing to explain it.
    //
    // Still a top-level override, deliberately: the intermediate Tailwind steps
    // (sm/md/lg/xl) are not in F's vocabulary and letting them through would
    // reintroduce arbitrary radii. Three named steps plus zero, nothing else.
    //
    // Safe when applied: the codebase used ONLY rounded-none (52) and
    // shadow-none (7). Both keep their values below, so this changed zero
    // rendered pixels. Record: 02_brand/2026-08-29-direction-f-supersedes-v2-non-negotiables.md
    borderRadius: {
      none: "0px",          // data tables, rule lines, the logo mark (still square, unruled)
      DEFAULT: "var(--radius-container)",
      inset: "var(--radius-inset)",         // rounded-inset  — nested surfaces, 22px
      container: "var(--radius-container)", // rounded-container — trays/cards, 28px
      full: "var(--radius-pill)",           // rounded-full — CTAs, chips, pills
    },
    // Direction F elevation, 2026-08-29. Was a top-level override forcing every
    // shadow utility to `none`, on the V2.0 rule "border weight carries all
    // visual hierarchy — not shadows". Both halves withdrawn: depth is now the
    // hairline border plus one ambient shadow.
    //
    // One elevation on purpose. F uses a single ambient shadow everywhere it
    // uses elevation, and none of the forty approved frames needs a scale.
    // Arbitrary values (shadow-[...]) are unaffected, as before.
    boxShadow: {
      none: "none",
      DEFAULT: "var(--shadow-ambient)",
      ambient: "var(--shadow-ambient)", // shadow-ambient
    },
    extend: {
      // Brand colours — black/white core, functional grays, dashboard-only status colours
      colors: {
        brand: "#000000",
        brandHover: "#333333",
        surface: "#ffffff",
        surfaceElevated: "#f3f4f6",
        borderDefault: "#000000",
        textMuted: "#666666",
        // Data display — results dashboard only, never marketing pages.
        // Fenced by brand-guidelines.md §3.3, which the 2026-08-27 release did
        // NOT touch and which Keith reapplied on 2026-08-29 (accent red dropped
        // from the blog skin). A coloured bar outside a results panel is a bug.
        statusOptimal: "#059669",
        statusWarning: "#D97706",
        statusCritical: "#B91C1C",

        // --- Direction F, 2026-08-29 ---
        ink: "var(--ink)",
        ink2: "var(--ink-2)",
        ink3: "var(--ink-3)",
        paper: "var(--paper)",
        core: "var(--core)",
        tray: "var(--tray)",
        sunk: "var(--sunk)",
        hair: "var(--hair)",
        hair2: "var(--hair-2)",

        // 🔴 Accent: defined so the token layer is complete, NOT cleared for use.
        // F's accent is the borderline status hex doing double duty as a sales
        // colour (see colours.css). Do not apply to any surface until §4 of the
        // ruling doc is settled.
        flag: "var(--flag)",
        flagFaint: "var(--flag-f)",
        flagFaint2: "var(--flag-f2)",
      },
      fontFamily: {
        // Bound to the next/font CSS variables defined in app/layout.tsx.
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      // Hero / section padding tokens
      spacing: {
        section: "8rem",      // py-section = py-32
        sectionHero: "10rem", // py-sectionHero = py-40
      },
      // Type scale extras
      fontSize: {
        "data-label": ["0.625rem", { lineHeight: "1", letterSpacing: "0.15em" }],
        "data-value": ["0.875rem", { lineHeight: "1.2", fontWeight: "900" }],
      },
      maxWidth: {
        content: "1280px", // max-w-7xl
        contentNarrow: "896px", // max-w-4xl
        contentText: "768px", // max-w-3xl
      },
      // Section dividers
      borderWidth: {
        "section-divider": "4px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
