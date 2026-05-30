import type { Metadata, Viewport } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import "@/styles/base/globals.css";
import { JsonLd } from "@/components/shared/JsonLd";
import { SkipToContent } from "@/components/shared/SkipToContent";
import FirstPromoterScript from "@/components/analytics/FirstPromoterScript";

// Brand fonts — self-hosted by Next at build time (no Google request from the
// visitor's browser). Exposed as CSS variables consumed by tailwind.config.ts
// fontFamily and the typography tokens (--font-sans / --font-serif / --font-mono).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const BASE_URL = "https://andro-prime.com";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Andro Prime",
      "url": BASE_URL,
      "description": "At-home blood tests for men. UKAS ISO 15189 accredited laboratory. Results in 2 to 5 working days. No GP needed.",
      "areaServed": { "@type": "Country", "name": "United Kingdom" },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Andro Prime",
      "description": "At-home blood tests for men. UKAS ISO 15189 accredited lab. Results in 2 to 5 working days.",
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "inLanguage": "en-GB",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Andro Prime | Premium At-Home Blood Tests for Men",
    template: "%s | Andro Prime",
  },
  description:
    "At-home blood tests that tell you exactly what your levels are. No GP needed. UKAS ISO 15189 accredited lab.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://andro-prime.com"
  ),
  openGraph: {
    siteName: "Andro Prime",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Andro Prime — At-home blood tests for men" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`scroll-smooth ${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <JsonLd data={siteSchema} />
      </head>
      <body className="bg-white text-black antialiased overflow-x-hidden selection:bg-black selection:text-white">
        <SkipToContent />
        {children}
        <FirstPromoterScript />
      </body>
    </html>
  );
}
