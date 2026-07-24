import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./canonical-site/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./lp/**/*.{js,ts,jsx,tsx,mdx,html}",
  ],
  theme: {
    // Brand rule: rounded-none everywhere. Top-level override so NO standard
    // radius utility (rounded-sm/md/lg/xl/2xl/3xl/full) can compile to a non-zero value.
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    // Brand rule: no shadows on marketing/UI. Top-level override so NO standard
    // shadow utility (shadow-sm/md/lg/xl/2xl/inner) can compile. Arbitrary values
    // (shadow-[...]) are unaffected — blog-skin offset shadows are raw CSS anyway.
    boxShadow: {
      none: "none",
      sm: "none",
      DEFAULT: "none",
      md: "none",
      lg: "none",
      xl: "none",
      "2xl": "none",
      inner: "none",
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
        // Data display — results dashboard only, never marketing pages
        statusOptimal: "#059669",
        statusWarning: "#D97706",
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
