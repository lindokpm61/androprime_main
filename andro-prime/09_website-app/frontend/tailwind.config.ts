import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./canonical-site/**/*.{js,ts,jsx,tsx,mdx}",
    "./lp/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        // Brand rule: rounded-none everywhere. No radius.
        DEFAULT: "0px",
        none: "0px",
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
